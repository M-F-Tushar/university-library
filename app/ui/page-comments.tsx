'use client';

import { useState } from 'react';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface Comment {
    id: string;
    userName: string;
    comment: string;
    createdAt: Date | string;
}

interface PageCommentsProps {
    pageUrl: string;
    comments: Comment[];
    userSession: { name: string; email: string } | null;
}

export default function PageComments({ pageUrl, comments, userSession }: PageCommentsProps) {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pageUrl, comment }),
            });

            if (response.ok) {
                setComment('');
                setMessage('Comment submitted! It will appear after admin approval.');
                setTimeout(() => window.location.reload(), 2000);
            } else {
                const data = await response.json();
                setMessage(data.error || 'Failed to submit comment');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <ChatBubbleLeftIcon className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Comments & Feedback</h2>
            </div>

            {/* Comment Form */}
            {userSession ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts, suggestions, or feedback..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={4}
                        disabled={isSubmitting}
                    />
                    <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Posting as <strong>{userSession.name}</strong>
                        </p>
                        <button
                            type="submit"
                            disabled={isSubmitting || !comment.trim()}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
                        </button>
                    </div>
                    {message && (
                        <div className={`mt-3 p-3 rounded-lg ${message.includes('submitted') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            {message}
                        </div>
                    )}
                </form>
            ) : (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800">
                        Please <a href="/login" className="font-semibold underline">log in</a> to leave a comment.
                    </p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map((c) => (
                        <div key={c.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {c.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{c.userName}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(c.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{c.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">
                        No comments yet. Be the first to share your thoughts!
                    </p>
                )}
            </div>
        </div>
    );
}
