import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { resourceSchema } from '@/lib/schemas';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate input data
        const validation = resourceSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
        }

        const data = validation.data;

        const resource = await prisma.resource.create({
            data: {
                title: data.title,
                description: data.description,
                category: data.category,
                department: data.department,
                semester: data.semester,
                course: data.course,
                fileUrl: data.fileUrl,
                tags: data.tags || '',
                author: data.author,
                year: data.year,
                format: data.format,
                coverImage: data.coverImage,
                abstract: data.abstract,
                fileSize: data.fileSize,
                externalUrl: data.externalUrl,
            },
        });

        return NextResponse.json(resource);
    } catch (error) {
        console.error('Error creating resource:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
