'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';

const studentUploadSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    courseId: z.string().min(1, 'Course is required'),
    resourceType: z.string().min(1, 'Resource type is required'),
    topics: z.string().optional(),
    externalUrl: z.string().url().optional().or(z.literal('')),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    year: z.coerce.number().optional(),
    // Past paper specific
    isPastPaper: z.boolean().optional(),
    examYear: z.coerce.number().optional(),
    examSemester: z.coerce.number().optional(),
});

export type StudentUploadState = {
    errors?: Record<string, string[]>;
    message?: string | null;
    success?: boolean;
};

export async function submitResourceForApproval(
    prevState: StudentUploadState,
    formData: FormData
): Promise<StudentUploadState> {
    const session = await auth();

    if (!session?.user?.id) {
        return { message: 'You must be logged in to submit a resource.' };
    }

    const validatedFields = studentUploadSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        courseId: formData.get('courseId'),
        resourceType: formData.get('resourceType'),
        topics: formData.get('topics'),
        externalUrl: formData.get('externalUrl') || '',
        difficulty: formData.get('difficulty') || 'INTERMEDIATE',
        year: formData.get('year') || undefined,
        isPastPaper: formData.get('isPastPaper') === 'true',
        examYear: formData.get('examYear') || undefined,
        examSemester: formData.get('examSemester') || undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please fix the errors below.',
        };
    }

    // Handle file upload
    const file = formData.get('file') as File | null;
    let fileUrl = '';

    if (file && file.size > 0) {
        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `${Date.now()}_${sanitizedName}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads/pending');

            try {
                await access(uploadDir);
            } catch {
                await mkdir(uploadDir, { recursive: true });
            }

            await writeFile(path.join(uploadDir, filename), buffer);
            fileUrl = `/uploads/pending/${filename}`;
        } catch (error) {
            console.error('File upload error:', error);
            return { message: 'Failed to upload file. Please try again.' };
        }
    }

    // External URL is required if no file
    if (!fileUrl && !validatedFields.data.externalUrl) {
        return { message: 'Please provide either a file or an external URL.' };
    }

    const { title, description, courseId, resourceType, topics, externalUrl, difficulty, year, isPastPaper, examYear, examSemester } = validatedFields.data;

    try {
        await prisma.resource.create({
            data: {
                title,
                description,
                courseId,
                resourceType,
                fileUrl: fileUrl || externalUrl || '',
                externalUrl: externalUrl || null,
                topics: topics || null,
                difficulty: difficulty || 'INTERMEDIATE',
                year: year || null,
                isPastPaper: isPastPaper || false,
                examYear: examYear || null,
                examSemester: examSemester || null,
                // Key fields for approval workflow
                uploadedById: session.user.id,
                isApproved: false, // Requires admin approval
            },
        });
    } catch (error) {
        console.error('Database error:', error);
        return { message: 'Database error: Failed to submit resource.' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/upload');

    return {
        success: true,
        message: 'Your resource has been submitted for review! An admin will approve it shortly.'
    };
}
