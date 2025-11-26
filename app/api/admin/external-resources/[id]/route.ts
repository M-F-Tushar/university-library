import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET - Get single resource
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const resource = await prisma.externalResource.findUnique({
            where: { id },
        });

        if (!resource) {
            return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
        }

        return NextResponse.json(resource);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 });
    }
}

// PUT - Update resource
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
        const { name, url, description, category, order, isActive } = body;

        const resource = await prisma.externalResource.update({
            where: { id },
            data: {
                name,
                url,
                description,
                category,
                order,
                isActive,
            },
        });

        return NextResponse.json(resource);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 });
    }
}

// DELETE - Delete resource
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
        await prisma.externalResource.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
    }
}
