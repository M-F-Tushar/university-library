'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { unstable_cache } from 'next/cache'

export interface SearchFilters {
    query?: string
    category?: string
    department?: string
    semester?: string
    limit?: number
}

export async function searchResources(filters: SearchFilters) {
    const { query, category, department, semester, limit = 20 } = filters

    try {
        const conditions: Prisma.ResourceWhereInput[] = []

        if (query) {
            conditions.push({
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } },
                    { topics: { contains: query } },
                    {
                        course: { // Search in related Course
                            OR: [
                                { courseTitle: { contains: query } },
                                { courseCode: { contains: query } }
                            ]
                        }
                    }
                ],
            })
        }

        if (category) {
            conditions.push({ resourceType: category })
        }

        if (department) {
            conditions.push({
                course: {
                    department: department
                }
            })
        }

        if (semester) {
            // Try to parse '1st' -> 1
            const semInt = parseInt(semester)
            if (!isNaN(semInt)) {
                conditions.push({ course: { semester: semInt } })
            }
        }

        // Only show approved resources
        conditions.push({ isApproved: true })

        const where: Prisma.ResourceWhereInput = conditions.length > 0 ? { AND: conditions } : { isApproved: true }

        const resources = await prisma.resource.findMany({
            where,
            take: limit,
            orderBy: {
                rating: 'desc', // Better sorting
            },
            include: {
                course: {
                    select: {
                        courseCode: true,
                        courseTitle: true,
                        department: true,
                        semester: true
                    }
                },
                uploadedBy: {
                    select: { name: true }
                }
            }
        })

        return { resources }
    } catch (error) {
        console.error('Search error:', error)
        return { resources: [], error: 'Failed to search resources' }
    }
}

const getSearchFacetsUncached = async () => {
    const [categories, departments, semesters] = await Promise.all([
        prisma.category.findMany({ where: { isActive: true }, select: { name: true } }),
        prisma.department.findMany({ where: { isActive: true }, select: { name: true } }),
        prisma.semester.findMany({ where: { isActive: true }, select: { name: true } }),
    ])

    return {
        categories: categories.map(c => c.name),
        departments: departments.map(d => d.name),
        semesters: semesters.map(s => s.name),
    }
}

export const getSearchFacets = unstable_cache(
    getSearchFacetsUncached,
    ['search-facets'],
    {
        revalidate: 3600, // Cache for 1 hour
        tags: ['search-facets']
    }
)
