import { getPendingReviews, approveReview, deleteReview } from '@/lib/reviews/actions'
import { StarIcon } from '@heroicons/react/24/solid'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Server action wrappers for form actions
async function handleApprove(reviewId: string) {
    'use server'
    await approveReview(reviewId)
}

async function handleDelete(reviewId: string) {
    'use server'
    await deleteReview(reviewId)
}

export default async function AdminReviewsPage() {
    const pendingReviews = await getPendingReviews()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Review Moderation</h1>
                <p className="text-gray-500 mt-2">
                    Approve or reject user reviews for resources
                </p>
            </div>

            {pendingReviews.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">No pending reviews</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingReviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{review.resource.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        By {review.user.name} • {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                                    </p>
                                </div>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon
                                            key={star}
                                            className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {review.review && (
                                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{review.review}</p>
                            )}

                            <div className="flex gap-2">
                                <form action={handleApprove.bind(null, review.id)}>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <CheckIcon className="h-4 w-4" />
                                        Approve
                                    </button>
                                </form>
                                <form action={handleDelete.bind(null, review.id)}>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                        Reject
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
