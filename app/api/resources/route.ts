import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import { z } from 'zod';

const resourceSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    category: z.string(),
    department: z.string(),
    course: z.string().optional(),
    semester: z.string().optional(),
    tags: z.string().optional(), // Comma separated
    externalUrl: z.string().optional(),
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const department = searchParams.get('department');
    const semester = searchParams.get('semester');

    const where: any = {};

    if (search) {
        where.OR = [
            { title: { contains: search } }, // SQLite contains is case-sensitive usually, but Prisma might normalize.
            { description: { contains: search } },
        ];
    }
    if (category) where.category = category;
    if (department) where.department = department;
    if (semester) where.semester = semester;

    try {
        const resources = await prisma.resource.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(resources);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching resources' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
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
            externalUrl,
        });

        if (!validatedFields.success) {
            return NextResponse.json({ message: 'Invalid fields', errors: validatedFields.error.flatten() }, { status: 400 });
        }

        let fileUrl = null;
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = Date.now() + '_' + file.name.replaceAll(' ', '_');
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

        return NextResponse.json(resource, { status: 201 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
