import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/security/rate-limit';
import { validateFile, sanitizeFilename } from '@/lib/security/file-validation';
import {
    ApiError,
    handleApiError,
    successResponse,
    errorResponse,
} from '@/lib/api/error-handler';
import { getPaginationParams, paginatedResponse } from '@/lib/api/response';

// Rate limiter for resource creation
const createResourceLimiter = rateLimit({
    maxTokens: 20,
    refillRate: 1,
    windowMs: 60000,
});

const resourceSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    department: z.string().min(1, 'Department is required'),
    course: z.string().optional(),
    semester: z.string().optional(),
    tags: z.string().optional(),
    externalUrl: z.string().url().optional().or(z.literal('')),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const department = searchParams.get('department');
        const semester = searchParams.get('semester');
        const { page, limit, skip } = getPaginationParams(searchParams);

        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
                { tags: { contains: search } },
            ];
        }
        if (category) where.category = category;
        if (department) where.department = department;
        if (semester) where.semester = semester;

        const [resources, total] = await Promise.all([
            prisma.resource.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.resource.count({ where }),
        ]);

        return paginatedResponse(resources, { page, limit, total });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'ADMIN') {
            return errorResponse(ApiError.unauthorized('Admin access required'));
        }

        // Rate limiting
        const rateLimitResult = await createResourceLimiter(request, session.user.id);
        if (rateLimitResult) {
            return rateLimitResult;
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const department = formData.get('department') as string;
        const course = formData.get('course') as string;
        const semester = formData.get('semester') as string;
        const tags = formData.get('tags') as string;
        const externalUrl = formData.get('externalUrl') as string;

        // Validate fields
        const validatedFields = resourceSchema.safeParse({
            title,
            description,
            category,
            department,
            course,
            semester,
            tags,
            externalUrl: externalUrl || undefined,
        });

        if (!validatedFields.success) {
            return errorResponse(
                ApiError.badRequest(
                    'Invalid fields',
                    'VALIDATION_ERROR',
                    validatedFields.error.flatten()
                )
            );
        }

        let fileUrl = null;
        if (file && file.size > 0) {
            // Validate file
            const fileValidation = validateFile(file, ['document', 'image']);
            if (!fileValidation.valid) {
                return errorResponse(
                    ApiError.badRequest(fileValidation.error || 'Invalid file', 'INVALID_FILE_TYPE')
                );
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const sanitizedName = sanitizeFilename(file.name);
            const filename = `${Date.now()}_${sanitizedName}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');

            try {
                await import('fs/promises').then(fs => fs.access(uploadDir));
            } catch {
                await import('fs/promises').then(fs => fs.mkdir(uploadDir, { recursive: true }));
            }

            await writeFile(path.join(uploadDir, filename), buffer);
            fileUrl = `/uploads/${filename}`;
        }

        const resource = await prisma.resource.create({
            data: {
                title,
                description,
                category,
                department,
                course,
                semester,
                tags,
                externalUrl: externalUrl || null,
                fileUrl,
            },
        });

        return successResponse(resource, undefined, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
