import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET - List all courses
export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            orderBy: [{ department: 'asc' }, { order: 'asc' }],
        });
        return NextResponse.json(courses);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }
}

// POST - Create new course
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { code, name, description, department, semester, credits, order, isActive } = body;

        // Check if course code already exists
        const existing = await prisma.course.findUnique({
            where: { code },
        });

        if (existing) {
            return NextResponse.json({ error: 'Course code already exists' }, { status: 400 });
        }

        const course = await prisma.course.create({
            data: {
                code,
                name,
                description,
                department,
                semester,
                credits: credits || 3,
                order: order || 0,
                isActive: isActive !== false,
            },
        });

        return NextResponse.json(course, { status: 201 });
    } catch (error) {
        console.error('Error creating course:', error);
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}
