import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Skeleton */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
                        <Skeleton className="h-8 w-full" />
                        <div className="space-y-4">
                            <Skeleton className="h-64 w-full rounded-lg" />
                            <Skeleton className="h-48 w-full rounded-lg" />
                        </div>
                    </aside>

                    {/* Main Content Skeleton */}
                    <div className="flex-1">
                        <div className="mb-6 flex gap-4">
                            <Skeleton className="h-12 flex-1 rounded-lg" />
                            <Skeleton className="h-12 w-24 rounded-lg hidden sm:block" />
                        </div>

                        <div className="mb-6 flex gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-8 w-24 rounded-full" />
                            ))}
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-5 w-24" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <Skeleton className="h-10 w-10 rounded-lg" />
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
