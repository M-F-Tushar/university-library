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
            <div>
                <h1 className="text-3xl font-bold font-display text-gray-900">
                    Welcome back, {session.user.name?.split(' ')[0]}!
                </h1>
                <p className="text-gray-500 mt-2">
                    Here's what's happening with your learning journey.
                </p>
            </div>

            {/* Continue Reading Section */}
            {data?.continueReading && data.continueReading.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Continue Reading</h2>
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
                            <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
                            <Link href="/resources" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                Browse all
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data?.recommended.map((resource) => (
                                <Link key={resource.id} href={`/resources/${resource.id}`}>
                                    <Card className="h-full hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="text-base">{resource.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-500 line-clamp-2">{resource.description}</p>
                                            <div className="mt-2 text-xs text-gray-400">
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
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                        <Card>
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
