import { auth } from "@/auth"
import { getDashboardData } from "@/lib/personalization/actions"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { ContinueReading } from "@/components/dashboard/ContinueReading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Link from "next/link"

export default async function DashboardPage() {
    const session = await auth()
    const data = await getDashboardData()

    if (!session?.user) {
        return <div>Please sign in to view your dashboard.</div>
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-gray-100">
                        Welcome back, {session.user.name?.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Here's what's happening with your learning journey.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Card className="p-4 flex items-center gap-4 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Bookmarks</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{data?.stats?.bookmarks || 0}</p>
                        </div>
                    </Card>
                    <Card className="p-4 flex items-center gap-4 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/30">
                            <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{data?.stats?.completed || 0}</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Continue Reading Section */}
            {data?.continueReading && data.continueReading.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Continue Reading</h2>
                    </div>
                    <ContinueReading items={data.continueReading} />
                </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Recommended Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recommended for You</h2>
                            <Link href="/resources" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                                Browse all
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data?.recommended.map((resource) => (
                                <Link key={resource.id} href={`/resources/${resource.id}`}>
                                    <Card className="h-full hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                                        <CardHeader>
                                            <CardTitle className="text-base dark:text-gray-100">{resource.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{resource.description}</p>
                                            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                                {resource.category} • {resource.department}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Area */}
                <div className="space-y-8">
                    {/* Recent Activity */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                        <Card className="dark:bg-gray-800 dark:border-gray-700">
                            <CardContent className="pt-6">
                                <ActivityFeed activities={data?.recentActivity || []} />
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    )
}
