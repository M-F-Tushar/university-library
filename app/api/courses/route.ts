
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const semester = searchParams.get('semester')
    const year = searchParams.get('year')
    const searchQuery = searchParams.get('search')
    const department = searchParams.get('department')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const where: any = {}

    if (semester) {
        where.semester = parseInt(semester)
    }

    if (year) {
        where.year = parseInt(year)
    }

    if (department) {
        where.department = department
    }

    if (searchQuery) {
        where.OR = [
            { courseTitle: { contains: searchQuery } }, // Case insensitive in most DBs, specific to adapter for SQLite it is usually distinct but Prisma handles it
            { courseCode: { contains: searchQuery } },
            { description: { contains: searchQuery } }
        ]
    }

    try {
        const [courses, total] = await Promise.all([
            prisma.course.findMany({
                where,
                take: limit,
                skip,
                orderBy: [
                    { year: 'asc' },
                    { semester: 'asc' },
                    { courseCode: 'asc' }
                ],
                include: {
                    _count: {
                        select: { resources: true }
                    }
                }
            }),
            prisma.course.count({ where })
        ])

        return NextResponse.json({
            data: courses,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching courses:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
