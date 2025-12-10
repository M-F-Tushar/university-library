import { SkeletonCard } from '@/components/ui/Skeleton'

export default function ResourcesLoading() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-72 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-wrap gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
            </div>

            {/* Resources Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-lg border border-gray-200 bg-white p-4"
                    >
                        {/* Cover Image Skeleton */}
                        <div className="h-48 w-full bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                        
                        {/* Title */}
                        <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        
                        {/* Description */}
                        <div className="space-y-1 mb-4">
                            <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex gap-2 mb-4">
                            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                ))}
            </div>
        </div>
    )
}
