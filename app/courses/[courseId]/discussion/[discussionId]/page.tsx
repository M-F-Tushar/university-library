import { getDiscussionDetails } from '@/lib/forum/actions'
import { notFound } from 'next/navigation'
import { ReplyForm } from '@/components/forum/ReplyForm'
import { User, MessageSquare, ChevronLeft, ThumbsUp } from 'lucide-react'
import Link from 'next/link'

export default async function ThreadPage({ params }: { params: Promise<{ courseId: string; discussionId: string }> }) {
    const { courseId, discussionId } = await params
    const discussion = await getDiscussionDetails(discussionId)

    if (!discussion) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-black">
            <div className="container mx-auto max-w-4xl px-4">
                <Link
                    href={`/courses/${courseId}`}
                    className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Course
                </Link>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    {/* Header */}
                    <div className="mb-6 border-b border-gray-100 pb-6 dark:border-gray-800">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{discussion.title}</h1>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">{discussion.author.name || 'Anonymous'}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Posted on {new Date(discussion.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            {/* Actions/Status could go here */}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="prose max-w-none text-gray-800 dark:text-gray-200 dark:prose-invert">
                        <p className="whitespace-pre-line">{discussion.content}</p>
                    </div>
                </div>

                {/* Replies */}
                <div className="mt-8 space-y-6">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                        <MessageSquare className="h-5 w-5" />
                        {discussion.replies.length} Replies
                    </h2>

                    <div className="space-y-4">
                        {discussion.replies.map((reply) => (
                            <div key={reply.id} className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-900 dark:text-white">{reply.author.name || 'Anonymous'}</span>
                                            <span className="mx-2 text-gray-300">•</span>
                                            <span className="text-gray-500 dark:text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    {reply.isMarkedSolution && (
                                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Solution
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    <p className="whitespace-pre-line">{reply.content}</p>
                                </div>
                                <div className="mt-4 flex items-center gap-4">
                                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                                        <ThumbsUp className="h-3 w-3" />
                                        Helpful
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <ReplyForm discussionId={discussion.id} />
                </div>
            </div>
        </div>
    )
}
