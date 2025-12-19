'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// 1. Get a submission to review
export async function getReviewCandidate(courseId: string) {
    const session = await auth()
    if (!session?.user?.id) return null
    const userId = session.user.id

    // Find submissions for this course:
    // - NOT by me
    // - NOT already reviewed by me
    // - Prioritize those with fewest reviews

    // Prisma doesn't strictly support complex ordering by relation count easily in one go without raw query or aggregate
    // We'll fetch a batch and filter
    const candidates = await prisma.labSubmission.findMany({
        where: {
            courseId,
            studentId: { not: userId },
            peerReviews: {
                none: { reviewerId: userId }
            }
        },
        include: {
            _count: {
                select: { peerReviews: true }
            }
        },
        take: 20
    })

    // Sort by review count (ascending) to help those who need it most
    candidates.sort((a, b) => a._count.peerReviews - b._count.peerReviews)

    if (candidates.length === 0) return null

    // Pick top one
    const submission = candidates[0]

    // Return safe data
    return {
        id: submission.id,
        labNumber: submission.labNumber,
        language: submission.language,
        code: submission.submissionCode, // In real app, might just return URL or snippet
        submittedAt: submission.submittedAt
    }
}

// 2. Submit a Review
export async function submitPeerReview(submissionId: string, rating: number, feedback: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: 'Unauthorized' }
    const userId = session.user.id

    try {
        await prisma.peerReview.create({
            data: {
                submissionId,
                reviewerId: userId,
                rating,
                feedback
            }
        })
        return { success: true }
    } catch (e) {
        console.error('Failed to submit review', e)
        return { error: 'Failed to submit review' }
    }
}

// 3. Get my completed reviews
export async function getMyReviews() {
    const session = await auth()
    if (!session?.user?.id) return []
    const userId = session.user.id

    const reviews = await prisma.peerReview.findMany({
        where: { reviewerId: userId },
        include: {
            submission: {
                select: {
                    labNumber: true,
                    course: { select: { courseCode: true } }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return reviews
}
