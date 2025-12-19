'use client';

import { useEffect, useState } from 'react';
import { getMyReviews } from '@/lib/reviews/peer-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ReviewModal } from '@/components/reviews/ReviewModal';
import { ClipboardDocumentCheckIcon, PlusIcon } from '@heroicons/react/24/outline';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Hardcoded for demo - in real app, user selects which course to review for
    // Or we show a dropdown. For now, picking a likely ID or just assuming we pass one.
    // Ideally we'd list courses I can review for.
    // Let's assume we find a course ID from my enrollments?
    // For this prototype, I'll let the user pick from a mock list or just auto-pick first enrolled.
    // SIMPLIFICATION: Using a placeholder Course ID or 'all'.
    // `getReviewCandidate` needs a courseId.
    const [selectedCourseId, setSelectedCourseId] = useState('course_id_placeholder');

    useEffect(() => {
        loadReviews();
    }, []);

    async function loadReviews() {
        const data = await getMyReviews();
        setReviews(data);
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-black">
            <div className="container mx-auto px-4 max-w-5xl space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Peer Reviews</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Give feedback to your peers and earn reputation.
                        </p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <PlusIcon className="w-5 h-5" />
                        Start Review
                    </Button>
                </div>

                <div className="grid gap-4">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <Card key={review.id} className="dark:bg-gray-900">
                                <CardContent className="flex items-center justify-between p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                            <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">
                                                Reviewed Lab {review.submission.labNumber}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {review.submission.course.courseCode} • {review.rating}/5 Rating
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No reviews yet</h3>
                            <p className="text-gray-500">Start reviewing peers to help the community!</p>
                        </div>
                    )}
                </div>

                <ReviewModal
                    courseId={selectedCourseId} // In real app, prompt user to select course first
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onReviewComplete={loadReviews}
                />
            </div>
        </div>
    );
}
