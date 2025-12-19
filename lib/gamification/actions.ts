'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// 1. Badge Definitions
const BADGES = {
    SCHOLAR: { name: 'Scholar', description: 'Viewed 10 resources', icon: '📚', requirement: '10_views' },
    CONTRIBUTOR: { name: 'Contributor', description: 'Uploaded 5 resources', icon: '📤', requirement: '5_uploads' },
    HELPER: { name: 'Helper', description: 'Marked as helpful 3 times', icon: '🤝', requirement: '3_helpful' }
}

export async function checkAndAwardBadges(userId?: string) {
    if (!userId) {
        const session = await auth()
        if (!session?.user?.id) return
        userId = session.user.id
    }

    // 1. Get Stats
    const [views, uploads, helpfulCount] = await Promise.all([
        prisma.userActivity.count({ where: { userId, action: 'VIEW' } }),
        prisma.resource.count({ where: { uploadedById: userId } }),
        prisma.forumDiscussion.count({ where: { authorId: userId, helpful: { some: {} } } }) // Approximate
    ])

    // 2. Define Rules
    const awards = []
    if (views >= 10) awards.push(BADGES.SCHOLAR)
    if (uploads >= 5) awards.push(BADGES.CONTRIBUTOR)
    if (helpfulCount >= 3) awards.push(BADGES.HELPER)

    // 3. Award Badges
    const results = []
    for (const badge of awards) {
        // Check if exists
        let badgeRecord = await prisma.achievementBadge.findUnique({ where: { name: badge.name } })

        // Create if system badge missing (lazy init)
        if (!badgeRecord) {
            badgeRecord = await prisma.achievementBadge.create({ data: badge })
        }

        // Connect to user if not already
        const userHasBadge = await prisma.user.findFirst({
            where: { id: userId, badges: { some: { id: badgeRecord.id } } }
        })

        if (!userHasBadge) {
            await prisma.user.update({
                where: { id: userId },
                data: { badges: { connect: { id: badgeRecord.id } } }
            })
            results.push(badge.name)
        }
    }

    return results // Returns newly awarded badges
}

export async function getLeaderboard() {
    // Rank by a simple reputation metric
    // Users with most badges + most uploads
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            image: true,
            department: true,
            _count: {
                select: {
                    badges: true,
                    uploadedResources: true,
                    helpfulDiscussions: true
                }
            }
        },
        take: 10
    })

    // Calculate score
    const leaderboard = users.map(u => ({
        ...u,
        score: (u._count.badges * 50) + (u._count.uploadedResources * 10) + (u._count.helpfulDiscussions * 5)
    })).sort((a, b) => b.score - a.score)

    return leaderboard
}
