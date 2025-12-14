import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET current email domain setting
export async function GET() {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const setting = await prisma.siteSettings.findUnique({
        where: { key: 'allowed_email_domain' }
    });

    return NextResponse.json({ domain: setting?.value || '@university.edu' });
}

// PUT update email domain setting
export async function PUT(request: Request) {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { domain } = await request.json();

        // Validate domain format
        if (!domain || typeof domain !== 'string') {
            return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
        }

        if (!domain.startsWith('@') || domain.length < 4) {
            return NextResponse.json({
                error: 'Domain must start with @ and be at least 4 characters'
            }, { status: 400 });
        }

        // Upsert the setting
        await prisma.siteSettings.upsert({
            where: { key: 'allowed_email_domain' },
            update: {
                value: domain.toLowerCase(),
                updatedBy: session.user.id,
            },
            create: {
                key: 'allowed_email_domain',
                value: domain.toLowerCase(),
                type: 'text',
                category: 'auth',
                description: 'Allowed email domain for student login',
                updatedBy: session.user.id,
            }
        });

        return NextResponse.json({ success: true, domain });
    } catch (error) {
        console.error('Failed to update email domain:', error);
        return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
    }
}
