import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import {
    ApiError,
    handleApiError,
    successResponse,
    errorResponse,
} from '@/lib/api/error-handler';

const settingsUpdateSchema = z.object({
    settings: z.array(z.object({
        key: z.string().min(1),
        value: z.string(),
    })),
});

// GET all settings or filter by category
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return errorResponse(ApiError.unauthorized('Admin access required'));
        }

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const where = category ? { category } : {};
        const settings = await prisma.siteSettings.findMany({
            where,
            orderBy: { category: 'asc' },
        });

        return successResponse(settings);
    } catch (error) {
        return handleApiError(error);
    }
}

// POST - Update multiple settings at once
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return errorResponse(ApiError.unauthorized('Admin access required'));
        }

        const body = await request.json();
        const validated = settingsUpdateSchema.safeParse(body);

        if (!validated.success) {
            return errorResponse(
                ApiError.badRequest('Invalid settings format', 'VALIDATION_ERROR', validated.error.flatten())
            );
        }

        const { settings } = validated.data;

        // Update each setting
        const updates = settings.map((setting) =>
            prisma.siteSettings.update({
                where: { key: setting.key },
                data: {
                    value: setting.value,
                    updatedBy: session.user.id,
                },
            })
        );

        await Promise.all(updates);

        return successResponse({ message: 'Settings updated successfully' });
    } catch (error) {
        return handleApiError(error);
    }
}
