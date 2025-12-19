"use client"

import * as React from "react"
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon } from "@heroicons/react/24/outline"
import { searchResources } from "@/lib/search/actions"
import { Resource } from "@prisma/client"
import { useDebounce } from "use-debounce"
import Link from "next/link"

interface SearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const [query, setQuery] = React.useState("")
    const [debouncedQuery] = useDebounce(query, 300)
    const [results, setResults] = React.useState<(Resource & { course: { department: string } | null })[]>([])
    const [loading, setLoading] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [open])

    React.useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery) {
                setResults([])
                return
            }

            setLoading(true)
            const { resources } = await searchResources({ query: debouncedQuery, limit: 5 })
            setResults(resources)
            setLoading(false)
        }

        performSearch()
    }, [debouncedQuery])

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onOpenChange(true)
            }
            if (e.key === "Escape") {
                onOpenChange(false)
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [onOpenChange])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-32">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => onOpenChange(false)}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 mx-4">
                <div className="flex items-center border-b border-gray-100 px-4 py-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    <input
                        ref={inputRef}
                        className="flex-1 border-0 bg-transparent px-3 py-1 text-base placeholder:text-gray-400 focus:outline-none focus:ring-0"
                        placeholder="Search resources, authors, tags..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-1 hover:bg-gray-100 rounded-md text-gray-500"
                    >
                        <span className="sr-only">Close</span>
                        <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded border border-gray-200">ESC</kbd>
                        <XMarkIcon className="sm:hidden h-5 w-5" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {loading && (
                        <div className="py-12 text-center text-sm text-gray-500">
                            Searching...
                        </div>
                    )}

                    {!loading && results.length === 0 && query && (
                        <div className="py-12 text-center text-sm text-gray-500">
                            No results found for &ldquo;{query}&rdquo;
                        </div>
                    )}

                    {!loading && results.length === 0 && !query && (
                        <div className="py-4 px-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Recent Searches</h3>
                            <div className="space-y-1">
                                {/* Mock recent searches */}
                                <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                                    <ClockIcon className="h-4 w-4 text-gray-400" />
                                    <span>Data Structures</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                                    <ClockIcon className="h-4 w-4 text-gray-400" />
                                    <span>Algorithms</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <div className="space-y-1">
                            {results.map((resource) => (
                                <Link
                                    key={resource.id}
                                    href={`/resources/${resource.id}`}
                                    onClick={() => onOpenChange(false)}
                                    className="flex items-start gap-3 px-3 py-3 hover:bg-gray-50 rounded-lg group transition-colors"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="h-8 w-8 rounded bg-primary-50 flex items-center justify-center text-primary-600">
                                            <MagnifyingGlassIcon className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 truncate">
                                            {resource.title}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {resource.resourceType} • {resource.course?.department || 'General'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                            <div className="pt-2 border-t border-gray-100">
                                <Link
                                    href={`/search?q=${encodeURIComponent(query)}`}
                                    onClick={() => onOpenChange(false)}
                                    className="block w-full text-center py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md"
                                >
                                    View all results for &ldquo;{query}&rdquo;
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
