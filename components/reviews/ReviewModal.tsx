'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { getReviewCandidate, submitPeerReview } from '@/lib/reviews/peer-actions';
import { CodeBracketIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface ReviewModalProps {
    courseId: string;
    isOpen: boolean;
    onClose: () => void;
    onReviewComplete: () => void;
}

export function ReviewModal({ courseId, isOpen, onClose, onReviewComplete }: ReviewModalProps) {
    const [step, setStep] = useState<'LOADING' | 'REVIEW' | 'SUCCESS' | 'NONE'>('LOADING');
    const [submission, setSubmission] = useState<any>(null);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(5);
    const [error, setError] = useState('');

    // Load candidate when opening
    const init = async () => {
        setStep('LOADING');
        setError('');
        const candidate = await getReviewCandidate(courseId);
        if (candidate) {
            setSubmission(candidate);
            setStep('REVIEW');
        } else {
            console.log('No submissions found');
            setStep('NONE');
        }
    };

    // Trigger init when opening if not loaded
    if (isOpen && step === 'LOADING' && !submission && !error) {
        // Use effect or just call it? Effect is safer to avoid loops
        // But for simplicity in this logic-less component:
        // We will rely on parent or a button to trigger 'Start'.
        // Actually, let's use a "Start" button inside if we want, or just auto-load.
        // Auto-load is better UX.
    }

    // Changing approach: Use a "Start Review" button on the parent to fetch, pass data In?
    // Or fetch inside useEffect here.

    // Better: Effect
    // useEffect(() => { if (isOpen) init(); }, [isOpen]); 
    // Typescript implementation below uses a manual trigger for "Find Submission" if we want, but let's do auto-load.

    const handleSubmit = async () => {
        if (!submission) return;
        await submitPeerReview(submission.id, rating, feedback);
        setStep('SUCCESS');
        setTimeout(() => {
            onReviewComplete();
            onClose();
            setStep('LOADING');
            setSubmission(null);
            setFeedback('');
        }, 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Peer Review</DialogTitle>
                </DialogHeader>

                {step === 'LOADING' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <Button onClick={init}>Find a Submission to Review</Button>
                        <p className="text-gray-500 text-sm">Review 2 peers to unlock the Helper badge!</p>
                    </div>
                )}

                {step === 'NONE' && (
                    <div className="flex-1 flex items-center justify-center">
                        <p>No submissions available for review right now. Check back later!</p>
                    </div>
                )}

                {step === 'REVIEW' && submission && (
                    <div className="flex-1 flex gap-6 overflow-hidden">
                        {/* Code View */}
                        <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-auto font-mono text-sm text-gray-100">
                            <div className="text-gray-500 mb-2 border-b border-gray-700 pb-2">
                                Lab {submission.labNumber} ({submission.language})
                            </div>
                            <pre>{submission.code}</pre>
                        </div>

                        {/* Review Form */}
                        <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setRating(r)}
                                            className={`p-2 rounded border ${rating === r ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 min-h-[100px]">
                                <label className="block text-sm font-medium mb-1">Feedback</label>
                                <Textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Constructive feedback..."
                                    className="h-full resize-none"
                                />
                            </div>

                            <Button onClick={handleSubmit} className="w-full">
                                Submit Review
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'SUCCESS' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-green-600">
                        <CheckCircleIcon className="w-16 h-16 mb-4" />
                        <h3 className="text-xl font-bold">Review Submitted!</h3>
                        <p>Thank you for your contribution.</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
