import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// POST - Create a new comment
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { pageUrl, comment } = body;

        if (!pageUrl || !comment) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newComment = await prisma.pageComment.create({
            data: {
                pageUrl,
                userId: session.user.id!,
                userName: session.user.name!,
                userEmail: session.user.email!,
                comment,
                isApproved: false, // Requires admin approval
            },
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}

// GET - Get comments for a page
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pageUrl = searchParams.get('pageUrl');

        if (!pageUrl) {
            return NextResponse.json({ error: 'Missing pageUrl parameter' }, { status: 400 });
        }

        const comments = await prisma.pageComment.findMany({
            where: {
                pageUrl,
                isApproved: true, // Only show approved comments
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                userName: true,
                comment: true,
                createdAt: true,
            },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}
