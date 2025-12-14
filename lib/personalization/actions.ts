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

    const [recentActivity, continueReading, recommended, stats] = await Promise.all([
        // Recent Activity - only fetch needed fields
        prisma.userActivity.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                action: true,
                createdAt: true,
                resource: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            },
        }),
        // Continue Reading - only fetch needed fields
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
                resource: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            },
        }),
        // Recommended - only fetch needed fields
        prisma.resource.findMany({
            where: {
                NOT: {
                    readingProgress: {
                        some: { userId: session.user.id }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                department: true,
            }
        }),
        // Stats
        Promise.all([
            prisma.bookmark.count({ where: { userId: session.user.id } }),
            prisma.readingProgress.count({ where: { userId: session.user.id, percentComplete: { gte: 100 } } }),
        ]).then(([bookmarks, completed]) => ({ bookmarks, completed }))
    ])

    return {
        recentActivity,
        continueReading,
        recommended,
        stats,
    }
}
