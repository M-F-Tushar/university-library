import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET - Get single course
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const course = await prisma.course.findUnique({
            where: { id },
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
    }
}

// PUT - Update course
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { code, name, description, department, semester, credits, order, isActive } = body;

        const course = await prisma.course.update({
            where: { id },
            data: {
                code,
                name,
                description,
                department,
                semester,
                credits,
                order,
                isActive,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
    }
}

// DELETE - Delete course
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.course.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Course deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
    }
}
