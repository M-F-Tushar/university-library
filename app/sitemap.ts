import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://library.example.com'
    
    // Get all resources
    const resources = await prisma.resource.findMany({
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
    })
    
    // Get all categories
    const categories = await prisma.category.findMany({
        select: { id: true },
    })
    
    // Get all semesters
    const semesters = await prisma.semester.findMany({
        select: { id: true },
    })
    
    // Get all courses
    const courses = await prisma.course.findMany({
        select: { id: true },
    })
    
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/resources`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/semesters`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/courses`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/external-resources`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ]
    
    // Resource pages
    const resourcePages: MetadataRoute.Sitemap = resources.map((resource) => ({
        url: `${baseUrl}/resources/${resource.id}`,
        lastModified: resource.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))
    
    // Category pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${baseUrl}/categories/${category.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))
    
    // Semester pages
    const semesterPages: MetadataRoute.Sitemap = semesters.map((semester) => ({
        url: `${baseUrl}/semesters/${semester.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))
    
    // Course pages
    const coursePages: MetadataRoute.Sitemap = courses.map((course) => ({
        url: `${baseUrl}/courses/${course.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))
    
    return [
        ...staticPages,
        ...resourcePages,
        ...categoryPages,
        ...semesterPages,
        ...coursePages,
    ]
}
