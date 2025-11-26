'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { writeFile } from 'fs/promises';
import path from 'path';

const resourceSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    category: z.string(),
    department: z.string(),
    course: z.string().optional(),
    semester: z.string().optional(),
    tags: z.string().optional(),
    externalUrl: z.string().optional(),
    author: z.string().optional(),
    year: z.coerce.number().optional(),
    format: z.string().optional(),
    coverImage: z.string().optional(),
    abstract: z.string().optional(),
    fileSize: z.string().optional(),
});

export type State = {
    errors?: {
        title?: string[];
        description?: string[];
        category?: string[];
        department?: string[];
        course?: string[];
        semester?: string[];
        tags?: string[];
        externalUrl?: string[];
        file?: string[];
        author?: string[];
        year?: string[];
        format?: string[];
        coverImage?: string[];
        abstract?: string[];
        fileSize?: string[];
    };
    message?: string | null;
};

export async function createResource(prevState: State, formData: FormData): Promise<State> {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
        return { message: 'Unauthorized' };
    }

    const validatedFields = resourceSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        department: formData.get('department'),
        course: formData.get('course'),
        semester: formData.get('semester'),
        tags: formData.get('tags'),
        externalUrl: formData.get('externalUrl'),
        author: formData.get('author'),
        year: formData.get('year'),
        format: formData.get('format'),
        coverImage: formData.get('coverImage'),
        abstract: formData.get('abstract'),
        fileSize: formData.get('fileSize'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Resource.',
        };
    }

    const file = formData.get('file') as File | null;
    let fileUrl = null;

    if (file && file.size > 0) {
        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const uploadDir = path.join(process.cwd(), 'public/uploads');

            try {
                await import('fs/promises').then(fs => fs.access(uploadDir));
            } catch {
                await import('fs/promises').then(fs => fs.mkdir(uploadDir, { recursive: true }));
            }

            await writeFile(path.join(uploadDir, filename), buffer);
            fileUrl = `/uploads/${filename}`;
        } catch (error) {
            return { message: 'Failed to upload file.' };
        }
    }

    const { title, description, category, department, course, semester, tags, externalUrl, author, year, format, coverImage, abstract, fileSize } = validatedFields.data;

    try {
        await prisma.resource.create({
            data: {
                title,
                description,
                category,
                department,
                course,
                semester,
                tags: tags || '',
                externalUrl: externalUrl || null,
                fileUrl,
                author: author || null,
                year: year || null,
                format: format || null,
                coverImage: coverImage || null,
                abstract: abstract || null,
                fileSize: fileSize || null,
            },
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Create Resource.' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/resources');
    revalidatePath('/admin/resources');
    redirect('/admin/resources');
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
