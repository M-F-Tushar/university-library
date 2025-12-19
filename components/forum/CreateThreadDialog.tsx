'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { createDiscussion } from '@/lib/forum/actions'
import { MessageSquarePlus } from 'lucide-react'

export function CreateThreadDialog({ courseId }: { courseId: string }) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            await createDiscussion(courseId, title, content)
            setOpen(false)
            setTitle('')
            setContent('')
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <MessageSquarePlus className="h-4 w-4" />
                    New Discussion
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start a New Discussion</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Title</label>
                        <input
                            required
                            className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's on your mind?"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Content</label>
                        <textarea
                            required
                            className="w-full rounded-md border border-gray-300 p-2 min-h-[150px] dark:border-gray-700 dark:bg-gray-800"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Elaborate on your question or topic..."
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Posting...' : 'Post Discussion'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
