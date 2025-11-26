import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';
        const category = searchParams.get('category');
        const semester = searchParams.get('semester');
        const department = searchParams.get('department');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const skip = (page - 1) * limit;

        // Build where clause for filtering
        const where: any = {};

        // Full-text search across multiple fields
        if (query) {
            where.OR = [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { tags: { contains: query, mode: 'insensitive' } },
                { author: { contains: query, mode: 'insensitive' } },
            ];
        }

        // Apply filters
        if (category) where.category = category;
        if (semester) where.semester = semester;
        if (department) where.department = department;

        // Execute search with pagination
        const [resources, total] = await Promise.all([
            prisma.resource.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.resource.count({ where }),
        ]);

        return NextResponse.json({
            resources,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Failed to search resources' },
            { status: 500 }
        );
    }
}
