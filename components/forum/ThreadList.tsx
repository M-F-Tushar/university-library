import Link from 'next/link'
import { MessageSquare, User } from 'lucide-react'
import { CreateThreadDialog } from './CreateThreadDialog'

interface Discussion {
    id: string
    title: string
    content: string
    createdAt: Date
    author: { name: string | null; image: string | null }
    _count: { replies: number }
}

export function ThreadList({ courseId, threads }: { courseId: string; threads: Discussion[] }) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Discussion Forum</h2>
                <CreateThreadDialog courseId={courseId} />
            </div>

            {threads.length > 0 ? (
                <div className="space-y-4">
                    {threads.map((thread) => (
                        <Link
                            key={thread.id}
                            href={`/courses/${courseId}/discussion/${thread.id}`}
                            className="block rounded-lg border border-gray-100 p-4 hover:border-blue-100 hover:bg-blue-50/30 dark:border-gray-800 dark:hover:border-blue-900/30 dark:hover:bg-blue-900/10"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-gray-900 dark:text-white">{thread.title}</h3>
                                        {thread._count.replies > 0 && (
                                            <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                                                {thread._count.replies} replies
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {thread.author.name || 'Anonymous'}
                                        </span>
                                        <span>•</span>
                                        <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="text-gray-300">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
                    <MessageSquare className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
                    <p>No discussions yet.</p>
                    <p className="text-sm">Start a conversation to help your peers!</p>
                </div>
            )}
        </section>
    )
}
