import { auth } from "@/auth"
import { getRecommendedResources } from "@/lib/personalization/actions"
import Link from "next/link"
import { ChevronRight, Star, BookOpen, Clock } from "lucide-react"

export default async function RecommendationsPage() {
    const session = await auth()
    const resources = await getRecommendedResources(50)

    if (!session?.user) {
        return <div>Please sign in to view recommendations.</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-black">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/dashboard" className="hover:text-blue-500">Dashboard</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Recommended for You</span>
                </nav>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recommended Resources</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Curated study materials based on your courses and semester.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {resources.map((resource) => (
                        <div key={resource.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                            <div className="p-5 flex-1">
                                <div className="mb-3 flex items-start justify-between">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${resource.matchReason === 'Course Match'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                        {resource.matchReason}
                                    </span>
                                    {resource.rating > 0 && (
                                        <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                                            <Star className="h-3 w-3 fill-current" />
                                            {resource.rating.toFixed(1)}
                                        </div>
                                    )}
                                </div>

                                <Link href={`/resources/${resource.id}`} className="block">
                                    <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                        {resource.title}
                                    </h3>
                                    <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                        {resource.description || 'No description available.'}
                                    </p>
                                </Link>
                            </div>

                            <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3 dark:border-gray-800 dark:bg-gray-800/50">
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-3 w-3" />
                                        <span>{resource.course.courseCode}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        <span>{new Date(resource.uploadedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {resources.length === 0 && (
                        <div className="col-span-full py-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                <Star className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No recommendations yet</h3>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                                Enroll in courses or wait for more resources to be uploaded.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
