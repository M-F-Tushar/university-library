import { StarIcon } from '@heroicons/react/24/solid'
import { formatDistanceToNow } from 'date-fns'

interface Review {
    id: string
    rating: number
    review: string | null
    createdAt: Date
    user: {
        name: string
        email: string
    }
}

interface ReviewListProps {
    reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No reviews yet. Be the first to review this resource!
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold">
                                {review.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{review.user.name}</p>
                                <p className="text-xs text-gray-500">
                                    {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                                </p>
                            </div>
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
                        <p className="text-gray-700 whitespace-pre-wrap">{review.review}</p>
                    )}
                </div>
            ))}
        </div>
    )
}
