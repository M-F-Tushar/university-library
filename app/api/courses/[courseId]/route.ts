
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> } // Next.js 15 params are async promises
) {
    const { courseId } = await params

    if (!courseId) {
        return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    try {
        // Try to find by ID first, then by Code
        const course = await prisma.course.findFirst({
            where: {
                OR: [
                    { id: courseId },
                    { courseCode: courseId }, // Allow lookup by "CSE 1101" etc if URL encoded
                    { courseCode: decodeURIComponent(courseId) }
                ]
            },
            include: {
                preRequisites: {
                    select: { id: true, courseCode: true, courseTitle: true }
                },
                prerequisiteOf: {
                    select: { id: true, courseCode: true, courseTitle: true }
                },
                specialization: {
                    select: { id: true, name: true, year: true }
                },
                resources: {
                    where: { isApproved: true }, // Only show approved resources
                    select: {
                        id: true,
                        title: true,
                        resourceType: true,
                        fileUrl: true,
                        rating: true,
                        downloadCount: true,
                        uploadedAt: true,
                        uploadedBy: { select: { name: true } }
                    },
                    orderBy: { rating: 'desc' }
                },
                _count: {
                    select: { discussions: true }
                }
            }
        })

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 })
        }

        return NextResponse.json(course)
    } catch (error) {
        console.error('Error fetching course details:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
