import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const bookmarkSchema = z.object({
    resourceId: z.string(),
});

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: session.user.id },
            include: { resource: true },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(bookmarks);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching bookmarks' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { resourceId } = bookmarkSchema.parse(body);

        const existingBookmark = await prisma.bookmark.findUnique({
            where: {
                userId_resourceId: {
                    userId: session.user.id,
                    resourceId,
                },
            },
        });

        if (existingBookmark) {
            // Toggle: Remove if exists
            await prisma.bookmark.delete({
                where: { id: existingBookmark.id },
            });
            return NextResponse.json({ message: 'Bookmark removed', bookmarked: false });
        } else {
            // Add if not exists
            await prisma.bookmark.create({
                data: {
                    userId: session.user.id,
                    resourceId,
                },
            });
            return NextResponse.json({ message: 'Bookmark added', bookmarked: true }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error updating bookmark' }, { status: 500 });
    }
}
