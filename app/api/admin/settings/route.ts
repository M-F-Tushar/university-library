import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET all settings or filter by category
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const where = category ? { category } : {};
        const settings = await prisma.siteSettings.findMany({
            where,
            orderBy: { category: 'asc' },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// POST - Update multiple settings at once
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { settings } = body; // Array of { key, value }

        if (!Array.isArray(settings)) {
            return NextResponse.json({ error: 'Settings must be an array' }, { status: 400 });
        }

        // Update each setting
        const updates = settings.map((setting: { key: string; value: string }) =>
            prisma.siteSettings.update({
                where: { key: setting.key },
                data: {
                    value: setting.value,
                    updatedBy: session.user.id,
                },
            })
        );

        await Promise.all(updates);

        return NextResponse.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
