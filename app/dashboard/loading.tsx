import { SkeletonDashboard } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            {/* Page Header Skeleton */}
            <div className="space-y-2">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-lg border border-gray-200 bg-white p-4"
                    >
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Bookmarks */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-gray-200 rounded animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Continue Reading */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-gray-200 rounded animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-2 w-full bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
