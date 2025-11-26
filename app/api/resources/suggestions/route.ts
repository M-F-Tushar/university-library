import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    try {
        // Fetch matching titles
        const titles = await prisma.resource.findMany({
            where: { title: { contains: query } },
            select: { title: true, id: true },
            take: 5,
        });

        // Fetch matching authors
        const authors = await prisma.resource.findMany({
            where: { author: { contains: query } },
            select: { author: true },
            distinct: ['author'],
            take: 3,
        });

        // Fetch matching tags (this is harder with comma-separated string, but we'll try simple contains)
        const tags = await prisma.resource.findMany({
            where: { tags: { contains: query } },
            select: { tags: true },
            take: 5,
        });

        // Process tags to extract relevant ones
        const uniqueTags = new Set<string>();
        tags.forEach(r => {
            r.tags.split(',').forEach(tag => {
                const t = tag.trim();
                if (t.toLowerCase().includes(query.toLowerCase())) {
                    uniqueTags.add(t);
                }
            });
        });

        return NextResponse.json({
            titles: titles.map(t => ({ text: t.title, type: 'resource', id: t.id })),
            authors: authors.map(a => ({ text: a.author, type: 'author' })).filter(a => a.text),
            tags: Array.from(uniqueTags).slice(0, 3).map(t => ({ text: t, type: 'tag' })),
        });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching suggestions' }, { status: 500 });
    }
}
