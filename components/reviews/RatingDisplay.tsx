import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

interface RatingDisplayProps {
    averageRating: number
    totalRatings: number
    totalReviews?: number
    showDistribution?: boolean
}

export function RatingDisplay({
    averageRating,
    totalRatings,
    totalReviews,
    showDistribution = false
}: RatingDisplayProps) {
    const roundedRating = Math.round(averageRating * 10) / 10

    return (
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{roundedRating.toFixed(1)}</span>
                    <span className="text-gray-500">/ 5</span>
                </div>
                <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        star <= Math.round(averageRating) ? (
                            <StarIcon key={star} className="h-5 w-5 text-yellow-400" />
                        ) : (
                            <StarOutlineIcon key={star} className="h-5 w-5 text-gray-300" />
                        )
                    ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
                    {totalReviews !== undefined && totalReviews > 0 && (
                        <>, {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</>
                    )}
                </p>
            </div>
        </div>
    )
}
