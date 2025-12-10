'use server'

import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

export async function getOverviewMetrics() {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const [
        totalUsers,
        totalResources,
        totalActivities,
        recentUsers,
        recentResources,
        recentActivities,
        previousUsers,
        previousResources,
        previousActivities,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.resource.count(),
        prisma.userActivity.count(),
        prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.resource.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.userActivity.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
        prisma.resource.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
        prisma.userActivity.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    ])

    const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0
        return ((current - previous) / previous) * 100
    }

    return {
        totalUsers,
        totalResources,
        totalActivities,
        userGrowth: calculateGrowth(recentUsers, previousUsers),
        resourceGrowth: calculateGrowth(recentResources, previousResources),
        activityGrowth: calculateGrowth(recentActivities, previousActivities),
    }
}

export async function getPopularResources(limit = 10) {
    const popularByViews = await prisma.userActivity.groupBy({
        by: ['resourceId'],
        where: {
            action: 'view',
            resourceId: { not: null },
        },
        _count: {
            id: true,
        },
        orderBy: {
            _count: {
                id: 'desc',
            },
        },
        take: limit,
    })

    const resourceIds = popularByViews.map(item => item.resourceId).filter(Boolean) as string[]

    const resources = await prisma.resource.findMany({
        where: { id: { in: resourceIds } },
        select: {
            id: true,
            title: true,
            category: true,
            department: true,
            createdAt: true,
        },
    })

    return popularByViews.map(item => {
        const resource = resources.find(r => r.id === item.resourceId)
        return {
            resourceId: item.resourceId,
            views: item._count.id,
            title: resource?.title || 'Unknown',
            category: resource?.category || 'Unknown',
            department: resource?.department || 'Unknown',
        }
    })
}

export async function getUserEngagement() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const dailyActivity = await prisma.userActivity.groupBy({
        by: ['createdAt'],
        where: {
            createdAt: { gte: thirtyDaysAgo },
        },
        _count: {
            id: true,
        },
    })

    // Group by day
    const activityByDay = dailyActivity.reduce((acc, item) => {
        const day = item.createdAt.toISOString().split('T')[0]
        acc[day] = (acc[day] || 0) + item._count.id
        return acc
    }, {} as Record<string, number>)

    return Object.entries(activityByDay).map(([date, count]) => ({
        date,
        activities: count,
    })).sort((a, b) => a.date.localeCompare(b.date))
}

export async function getSearchTrends(limit = 10) {
    const searchActivities = await prisma.userActivity.findMany({
        where: {
            action: 'search',
            details: { not: null },
        },
        select: {
            details: true,
        },
        take: 1000, // Limit to recent searches
        orderBy: {
            createdAt: 'desc',
        },
    })

    const searchCounts = searchActivities.reduce((acc, item) => {
        if (item.details) {
            try {
                const parsed = JSON.parse(item.details)
                const query = parsed.query?.toLowerCase()
                if (query) {
                    acc[query] = (acc[query] || 0) + 1
                }
            } catch {
                // Skip invalid JSON
            }
        }
        return acc
    }, {} as Record<string, number>)

    return Object.entries(searchCounts)
        .map(([query, count]) => ({ query, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
}

export async function getCategoryBreakdown() {
    const breakdown = await prisma.resource.groupBy({
        by: ['category'],
        _count: {
            id: true,
        },
        orderBy: {
            _count: {
                id: 'desc',
            },
        },
    })

    return breakdown.map(item => ({
        category: item.category,
        count: item._count.id,
    }))
}

// Cache analytics data for 5 minutes
export const getCachedOverviewMetrics = unstable_cache(
    async () => await getOverviewMetrics(),
    ['analytics-overview'],
    { revalidate: 300 }
)

export const getCachedPopularResources = unstable_cache(
    async (limit = 10) => await getPopularResources(limit),
    ['analytics-popular-resources'],
    { revalidate: 300 }
)

export const getCachedCategoryBreakdown = unstable_cache(
    async () => await getCategoryBreakdown(),
    ['analytics-category-breakdown'],
    { revalidate: 300 }
)
