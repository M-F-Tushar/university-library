import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') === 'true';
        const where = activeOnly ? { isActive: true } : {};

        const semesters = await prisma.semester.findMany({
            where,
            orderBy: { order: 'asc' },
        });

        return NextResponse.json(semesters);
    } catch (error) {
        console.error('Error fetching semesters:', error);
        return NextResponse.json({ error: 'Failed to fetch semesters' }, { status: 500 });
    }
}
