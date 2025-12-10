import {
    getCachedOverviewMetrics,
    getCachedPopularResources,
    getCachedCategoryBreakdown,
    getUserEngagement,
    getSearchTrends
} from '@/lib/analytics/metrics'
import { MetricCard } from '@/components/analytics/MetricCard'
import { ChartWrapper } from '@/components/analytics/ChartWrapper'
import { PopularResourcesTable } from '@/components/analytics/PopularResourcesTable'
import {
    UsersIcon,
    BookOpenIcon,
    ChartBarIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AnalyticsPage() {
    const [overview, popularResources, categoryBreakdown, engagement, searchTrends] = await Promise.all([
        getCachedOverviewMetrics(),
        getCachedPopularResources(),
        getCachedCategoryBreakdown(),
        getUserEngagement(),
        getSearchTrends(10),
    ])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-500 mt-2">
                    Track platform usage, popular resources, and user engagement
                </p>
            </div>

            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Users"
                    value={overview.totalUsers.toLocaleString()}
                    change={overview.userGrowth}
                    trend={overview.userGrowth > 0 ? 'up' : overview.userGrowth < 0 ? 'down' : 'neutral'}
                    icon={UsersIcon}
                />
                <MetricCard
                    title="Total Resources"
                    value={overview.totalResources.toLocaleString()}
                    change={overview.resourceGrowth}
                    trend={overview.resourceGrowth > 0 ? 'up' : overview.resourceGrowth < 0 ? 'down' : 'neutral'}
                    icon={BookOpenIcon}
                />
                <MetricCard
                    title="Total Activities"
                    value={overview.totalActivities.toLocaleString()}
                    change={overview.activityGrowth}
                    trend={overview.activityGrowth > 0 ? 'up' : overview.activityGrowth < 0 ? 'down' : 'neutral'}
                    icon={ChartBarIcon}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWrapper
                    type="line"
                    data={engagement}
                    dataKey="activities"
                    xKey="date"
                    title="User Engagement (Last 30 Days)"
                />
                <ChartWrapper
                    type="pie"
                    data={categoryBreakdown.map(item => ({ name: item.category, value: item.count }))}
                    dataKey="value"
                    title="Resources by Category"
                />
            </div>

            {/* Popular Resources */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Most Popular Resources</h2>
                    <p className="text-sm text-gray-500 mt-1">Top resources by view count</p>
                </div>
                <PopularResourcesTable resources={popularResources} />
            </div>

            {/* Search Trends */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                    <MagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Top Search Queries</h2>
                </div>
                {searchTrends.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchTrends.map((trend, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                                    <span className="text-sm font-medium text-gray-900">{trend.query}</span>
                                </div>
                                <span className="text-sm font-semibold text-blue-600">{trend.count} searches</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-gray-500">No search data available</p>
                )}
            </div>
        </div>
    )
}
