import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') === 'true';
        const where = activeOnly ? { isActive: true } : {};

        const formats = await prisma.format.findMany({
            where,
            orderBy: { order: 'asc' },
        });

        return NextResponse.json(formats);
    } catch (error) {
        console.error('Error fetching formats:', error);
        return NextResponse.json({ error: 'Failed to fetch formats' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, extension, mimeType, order } = body;

        if (!name || !extension) {
            return NextResponse.json({ error: 'Name and extension are required' }, { status: 400 });
        }

        const format = await prisma.format.create({
            data: { name, extension, mimeType, order: order || 0 },
        });

        return NextResponse.json(format);
    } catch (error) {
        console.error('Error creating format:', error);
        return NextResponse.json({ error: 'Failed to create format' }, { status: 500 });
    }
}
