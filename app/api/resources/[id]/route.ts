import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const resourceUpdateSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    department: z.string().optional(),
    course: z.string().optional(),
    semester: z.string().optional(),
    tags: z.string().optional(),
    externalUrl: z.string().optional(),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validatedFields = resourceUpdateSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json({ message: 'Invalid fields', errors: validatedFields.error.flatten() }, { status: 400 });
        }

        const resource = await prisma.resource.update({
            where: { id },
            data: validatedFields.data,
        });

        return NextResponse.json(resource);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating resource' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    // @ts-ignore
    if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.resource.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Resource deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting resource' }, { status: 500 });
    }
}
