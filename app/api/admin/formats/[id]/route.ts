import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const format = await prisma.format.findUnique({
            where: { id },
        });

        if (!format) {
            return NextResponse.json({ error: 'Format not found' }, { status: 404 });
        }

        return NextResponse.json(format);
    } catch (error) {
        console.error('Error fetching format:', error);
        return NextResponse.json({ error: 'Failed to fetch format' }, { status: 500 });
    }
}

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
        const body = await request.json();
        const { name, extension, mimeType, order, isActive } = body;

        const format = await prisma.format.update({
            where: { id },
            data: { name, extension, mimeType, order, isActive },
        });

        return NextResponse.json(format);
    } catch (error) {
        console.error('Error updating format:', error);
        return NextResponse.json({ error: 'Failed to update format' }, { status: 500 });
    }
}

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
        await prisma.format.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Format deleted successfully' });
    } catch (error) {
        console.error('Error deleting format:', error);
        return NextResponse.json({ error: 'Failed to delete format' }, { status: 500 });
    }
}
