'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { subDays, startOfDay, format } from 'date-fns'

export async function getStudentAnalytics() {
    const session = await auth()
    if (!session?.user?.id) return null

    const userId = session.user.id

    // 1. Study Activity (Last 7 Days)
    // We will count number of UserActivity logs per day as a proxy for "Sessions"
    const today = new Date()
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(today, 6 - i)
        return startOfDay(d)
    })

    const activityData = await Promise.all(last7Days.map(async (date) => {
        const nextDay = new Date(date)
        nextDay.setDate(date.getDate() + 1)

        const count = await prisma.userActivity.count({
            where: {
                userId,
                createdAt: {
                    gte: date,
                    lt: nextDay
                }
            }
        })

        return {
            date: format(date, 'MMM dd'),
            interactions: count,
            // Mocking hours based on interactions for demo (e.g. 5 mins per interaction)
            hours: Number((count * 5 / 60).toFixed(1))
        }
    }))

    // 2. Reading Progress Distribution
    const readingStats = await prisma.readingProgress.groupBy({
        by: ['percentComplete'],
        where: { userId },
    })

    // Aggregate into buckets
    let notStarted = 0
    let inProgress = 0
    let completed = 0

    // Fetch actual counts differently since we want ranges
    // Or just fetch all and map JS side for flexibility
    const allProgress = await prisma.readingProgress.findMany({
        where: { userId },
        select: { percentComplete: true }
    })

    allProgress.forEach(p => {
        if (p.percentComplete >= 100) completed++
        else if (p.percentComplete > 0) inProgress++
        else notStarted++
    })

    // 3. GPA / Grades (Mock or Real)
    // Assuming simple Grade model exists: { course: { code }, grade: number }
    // If not, we return empty or mock
    const grades = await prisma.studentGrade.findMany({
        where: { userId },
        include: { course: { select: { courseCode: true } } }
    })

    const gradeData = grades.map(g => ({
        course: g.course.courseCode,
        grade: g.gradeValue // e.g. 4.0, 3.7
    }))

    // 4. Resource Usage by Type
    // Count resources viewed/interacted with
    // We can use UserActivity grouping
    const typeUsage = await prisma.userActivity.groupBy({
        by: ['action'], // action is like 'VIEW', 'DOWNLOAD' - might not map to resource type strictly
        where: { userId },
        _count: true
    })

    return {
        activityData,
        readingDistribution: [
            { name: 'To Read', value: notStarted, color: '#94a3b8' },
            { name: 'In Progress', value: inProgress, color: '#3b82f6' },
            { name: 'Completed', value: completed, color: '#22c55e' }
        ],
        gradeData,
        totalInteractions: activityData.reduce((acc, curr) => acc + curr.interactions, 0)
    }
}
