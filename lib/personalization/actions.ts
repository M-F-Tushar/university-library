'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function trackActivity(action: string, resourceId?: string, details?: unknown) {
    const session = await auth()
    if (!session?.user?.id) return

    try {
        await prisma.userActivity.create({
            data: {
                userId: session.user.id,
                action,
                resourceId,
                details: details ? JSON.stringify(details) : undefined,
            },
        })
    } catch (error) {
        console.error('Failed to track activity:', error)
    }
}

export async function updateReadingProgress(resourceId: string, currentPage: number, totalPages?: number) {
    const session = await auth()
    if (!session?.user?.id) return

    try {
        const percentComplete = totalPages ? (currentPage / totalPages) * 100 : 0

        await prisma.readingProgress.upsert({
            where: {
                userId_resourceId: {
                    userId: session.user.id,
                    resourceId,
                },
            },
            update: {
                currentPage,
                totalPages,
                percentComplete,
                lastReadAt: new Date(),
            },
            create: {
                userId: session.user.id,
                resourceId,
                currentPage,
                totalPages,
                percentComplete,
            },
        })
        revalidatePath('/dashboard')
    } catch (error) {
        console.error('Failed to update reading progress:', error)
    }
}

export async function getDashboardData() {
    const session = await auth()
    if (!session?.user?.id) return null

    // Helper to calculate streak
    async function getStudyStreak(userId: string) {
        const activities = await prisma.userActivity.findMany({
            where: { userId },
            select: { createdAt: true },
            orderBy: { createdAt: 'desc' },
            distinct: ['createdAt'],
            take: 30
        });

        if (activities.length === 0) return 0;

        const uniqueDates = Array.from(new Set(
            activities.map(a => new Date(a.createdAt).toDateString())
        )).map(d => new Date(d));

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // check if active today or yesterday
        const lastActive = uniqueDates[0];
        const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));

        if (diffDays > 1) return 0;

        for (let i = 0; i < uniqueDates.length; i++) {
            streak++;
            if (i < uniqueDates.length - 1) {
                const current = uniqueDates[i];
                const next = uniqueDates[i + 1];
                const diff = Math.floor((current.getTime() - next.getTime()) / (1000 * 3600 * 24));
                if (diff > 1) break;
            }
        }
        return streak;
    }

    const [recentActivity, continueReading, recommended, stats, enrolledCourses, streak, user] = await Promise.all([
        // Recent Activity
        prisma.userActivity.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                action: true,
                createdAt: true,
                resource: { select: { id: true, title: true } }
            },
        }),
        // Continue Reading
        prisma.readingProgress.findMany({
            where: { userId: session.user.id },
            orderBy: { lastReadAt: 'desc' },
            take: 3,
            select: {
                id: true,
                resourceId: true,
                currentPage: true,
                totalPages: true,
                percentComplete: true,
                resource: { select: { id: true, title: true } }
            },
        }),
        // Recommended
        prisma.resource.findMany({
            where: {
                NOT: { readingProgress: { some: { userId: session.user.id } } }
            },
            orderBy: { uploadedAt: 'desc' },
            take: 3,
            select: {
                id: true,
                title: true,
                description: true,
                resourceType: true,
                course: { select: { department: true } }
            }
        }),
        // Stats
        Promise.all([
            prisma.userBookmark.count({ where: { userId: session.user.id } }),
            prisma.readingProgress.count({ where: { userId: session.user.id, percentComplete: { gte: 100 } } }),
        ]).then(([bookmarks, completed]) => ({ bookmarks, completed })),
        // Enrolled Courses (Inferred)
        prisma.user.findUnique({ where: { id: session.user.id }, select: { currentSemester: true, currentYear: true } })
            .then(u => {
                if (!u?.currentSemester) return [];
                return prisma.course.findMany({
                    where: { semester: u.currentSemester },
                    include: {
                        _count: { select: { resources: true } }
                    }
                })
            }),
        getStudyStreak(session.user.id),
        prisma.user.findUnique({ where: { id: session.user.id }, select: { currentSemester: true, currentYear: true } })
    ])

    const formattedRecommended = recommended.map(r => ({
        ...r,
        category: r.resourceType,
        department: r.course.department
    }))

    return {
        recentActivity,
        continueReading,
        recommended: formattedRecommended,
        stats,
        enrolledCourses,
        streak,
        semesterInfo: {
            currentSemester: user?.currentSemester || 1,
            currentYear: user?.currentYear || 1
        }
    }
}


export async function getRecommendedResources(limit = 20) {
    const session = await auth()
    if (!session?.user?.id) return []

    // 1. Get User Context
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { currentSemester: true, currentYear: true, department: true }
    })

    if (!user) return []

    // 2. Fetch Resources
    // Priority 1: Matches current semester & department (Course material)
    // Priority 2: Popular resources (high ratings/downloads)
    const resources = await prisma.resource.findMany({
        where: {
            isApproved: true,
            OR: [
                // Match by semester (via Course)
                {
                    course: {
                        semester: user.currentSemester || undefined,
                        // department: user.department || undefined // Optional strict department check
                    }
                },
                // Or highly rated
                { rating: { gte: 4.0 } }
            ],
            NOT: {
                // Exclude own uploads
                uploadedById: session.user.id
            }
        },
        take: limit,
        orderBy: [
            { rating: 'desc' },
            { uploadedAt: 'desc' }
        ],
        include: {
            course: { select: { courseCode: true, courseTitle: true, department: true, semester: true } },
            uploadedBy: { select: { name: true } },
            _count: { select: { reviews: true, bookmarkedBy: true } }
        }
    })

    return resources.map(r => ({
        ...r,
        matchReason: (user.currentSemester && r.course.semester === user.currentSemester)
            ? 'Course Match'
            : (r.rating >= 4.0 ? 'Highly Rated' : 'Recommended')
    }))
}
