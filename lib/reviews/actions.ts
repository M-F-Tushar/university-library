'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitReview(resourceId: string, rating: number, comment?: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: 'You must be logged in to submit a review' }
    }

    if (rating < 1 || rating > 5) {
        return { error: 'Rating must be between 1 and 5' }
    }

    try {
        // Check if user already reviewed this resource
        const existing = await prisma.resourceReview.findFirst({
            where: {
                reviewerId: session.user.id,
                resourceId,
            },
        })

        if (existing) {
            return { error: 'You have already reviewed this resource' }
        }

        // Create review
        await prisma.resourceReview.create({
            data: {
                reviewerId: session.user.id,
                resourceId,
                rating,
                comment,
            },
        })

        revalidatePath(`/resources/${resourceId}`)
        return { success: true, message: 'Review submitted! It will appear after admin approval.' }
    } catch (error) {
        console.error('Failed to submit review:', error)
        return { error: 'Failed to submit review' }
    }
}

export async function getResourceReviews(resourceId: string) {
    const reviews = await prisma.resourceReview.findMany({
        where: {
            resourceId,
            isApproved: true,
        },
        include: {
            reviewer: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return reviews
}

export async function getResourceRating(resourceId: string) {
    let rating = await prisma.resourceRating.findUnique({
        where: { resourceId },
    })

    // If no rating exists, calculate it
    if (!rating) {
        const reviews = await prisma.resourceReview.findMany({
            where: {
                resourceId,
                isApproved: true,
            },
            select: {
                rating: true,
                comment: true,
            },
        })

        const totalRatings = reviews.length
        const averageRating = totalRatings > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings
            : 0
        const totalReviews = reviews.filter(r => r.comment).length

        // Create rating record
        rating = await prisma.resourceRating.create({
            data: {
                resourceId,
                averageRating,
                totalRatings,
                totalReviews,
            },
        })
    }

    return rating
}

export async function approveReview(reviewId: string) {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        const review = await prisma.resourceReview.update({
            where: { id: reviewId },
            data: { isApproved: true },
            include: { resource: true },
        })

        // Update aggregate rating
        await updateResourceRating(review.resourceId)

        revalidatePath('/admin/reviews')
        revalidatePath(`/resources/${review.resourceId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to approve review:', error)
        return { error: 'Failed to approve review' }
    }
}

export async function deleteReview(reviewId: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: 'Unauthorized' }
    }

    try {
        const review = await prisma.resourceReview.findUnique({
            where: { id: reviewId },
        })

        if (!review) {
            return { error: 'Review not found' }
        }

        // Only allow user to delete their own review, or admin to delete any
        if (review.reviewerId !== session.user.id && session.user.role !== 'ADMIN') {
            return { error: 'Unauthorized' }
        }

        await prisma.resourceReview.delete({
            where: { id: reviewId },
        })

        // Update aggregate rating
        await updateResourceRating(review.resourceId)

        revalidatePath('/admin/reviews')
        revalidatePath(`/resources/${review.resourceId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to delete review:', error)
        return { error: 'Failed to delete review' }
    }
}

async function updateResourceRating(resourceId: string) {
    const reviews = await prisma.resourceReview.findMany({
        where: {
            resourceId,
            isApproved: true,
        },
        select: {
            rating: true,
            comment: true,
        },
    })

    const totalRatings = reviews.length
    const averageRating = totalRatings > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0
    const totalReviews = reviews.filter(r => r.comment).length

    await prisma.resourceRating.upsert({
        where: { resourceId },
        update: {
            averageRating,
            totalRatings,
            totalReviews,
        },
        create: {
            resourceId,
            averageRating,
            totalRatings,
            totalReviews,
        },
    })
}

export async function getPendingReviews() {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
        return []
    }

    const reviews = await prisma.resourceReview.findMany({
        where: {
            isApproved: false,
        },
        include: {
            reviewer: {
                select: {
                    name: true,
                    email: true,
                },
            },
            resource: {
                select: {
                    title: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return reviews
}
