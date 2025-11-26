import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET all features
export async function GET() {
    try {
        const features = await prisma.feature.findMany({
            orderBy: { createdAt: 'asc' },
        });
        return NextResponse.json(features);
    } catch (error) {
        console.error('Error fetching features:', error);
        return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 });
    }
}

// POST - Create new feature
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, icon, link, coverImage, isActive } = body;

        const feature = await prisma.feature.create({
            data: {
                title,
                description,
                icon,
                link: link || null,
                coverImage: coverImage || null,
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        return NextResponse.json(feature, { status: 201 });
    } catch (error) {
        console.error('Error creating feature:', error);
        return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
    }
}
