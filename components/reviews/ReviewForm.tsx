'use client'

import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { submitReview } from '@/lib/reviews/actions'
import { Button } from '@/components/ui/Button'

interface ReviewFormProps {
    resourceId: string
    onSuccess?: () => void
}

export function ReviewForm({ resourceId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [review, setReview] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            setMessage({ type: 'error', text: 'Please select a rating' })
            return
        }

        setIsSubmitting(true)
        setMessage(null)

        const result = await submitReview(resourceId, rating, review || undefined)

        if (result.error) {
            setMessage({ type: 'error', text: result.error })
        } else {
            setMessage({ type: 'success', text: result.message || 'Review submitted!' })
            setRating(0)
            setReview('')
            onSuccess?.()
        }

        setIsSubmitting(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                </label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                        >
                            {star <= (hoverRating || rating) ? (
                                <StarIcon className="h-8 w-8 text-yellow-400" />
                            ) : (
                                <StarOutlineIcon className="h-8 w-8 text-gray-300" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review (Optional)
                </label>
                <textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Share your thoughts about this resource..."
                    disabled={isSubmitting}
                />
            </div>

            {message && (
                <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                    {message.text}
                </div>
            )}

            <Button type="submit" disabled={isSubmitting || rating === 0}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
        </form>
    )
}
