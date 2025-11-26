import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET - Get single feature
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const feature = await prisma.feature.findUnique({
            where: { id },
        });

        if (!feature) {
            return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
        }

        return NextResponse.json(feature);
    } catch (error) {
        console.error('Error fetching feature:', error);
        return NextResponse.json({ error: 'Failed to fetch feature' }, { status: 500 });
    }
}

// PUT - Update feature
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { title, description, icon, link, coverImage, isActive } = await request.json();

        const feature = await prisma.feature.update({
            where: { id },
            data: {
                title,
                description,
                icon,
                link,
                coverImage,
                isActive,
            },
        });

        return NextResponse.json(feature);
    } catch (error) {
        console.error('Error updating feature:', error);
        return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 });
    }
}

// DELETE - Delete feature
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.feature.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Feature deleted successfully' });
    } catch (error) {
        console.error('Error deleting feature:', error);
        return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
    }
}
