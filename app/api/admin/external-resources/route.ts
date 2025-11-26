import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET - List all external resources
export async function GET() {
    try {
        const resources = await prisma.externalResource.findMany({
            orderBy: [{ category: 'asc' }, { order: 'asc' }],
        });
        return NextResponse.json(resources);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
    }
}

// POST - Create new external resource
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, url, description, category, order, isActive } = body;

        const resource = await prisma.externalResource.create({
            data: {
                name,
                url,
                description,
                category,
                order: order || 0,
                isActive: isActive !== false,
            },
        });

        return NextResponse.json(resource, { status: 201 });
    } catch (error) {
        console.error('Error creating external resource:', error);
        return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
    }
}
