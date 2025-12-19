'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { createReply } from '@/lib/forum/actions'
import { useRouter } from 'next/navigation'

export function ReplyForm({ discussionId }: { discussionId: string }) {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            await createReply(discussionId, content)
            setContent('')
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Leave a reply</h3>
            <textarea
                required
                className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts or answer..."
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? 'Posting...' : 'Post Reply'}
                </Button>
            </div>
        </form>
    )
}
