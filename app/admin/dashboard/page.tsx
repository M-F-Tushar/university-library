import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
    PlusIcon,
    Cog6ToothIcon,
    SparklesIcon,
    MegaphoneIcon,
    UsersIcon,
    DocumentTextIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

export default async function AdminDashboard() {
    const [totalResources, totalUsers, totalFeatures, totalAnnouncements, resourcesByCategory] = await Promise.all([
        prisma.resource.count(),
        prisma.user.count(),
        prisma.feature.count({ where: { isActive: true } }),
        prisma.announcement.count({ where: { isActive: true } }),
        prisma.resource.groupBy({
            by: ['category'],
            _count: { category: true },
        }),
    ]);

    const recentResources = await prisma.resource.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    const stats = [
        { name: 'Total Resources', value: totalResources, icon: DocumentTextIcon, color: 'from-blue-500 to-blue-600' },
        { name: 'Total Users', value: totalUsers, icon: UsersIcon, color: 'from-purple-500 to-purple-600' },
        { name: 'Active Features', value: totalFeatures, icon: SparklesIcon, color: 'from-violet-500 to-violet-600' },
        { name: 'Active Announcements', value: totalAnnouncements, icon: MegaphoneIcon, color: 'from-pink-500 to-pink-600' },
    ];

    const quickActions = [
        { name: 'Manage Resources', href: '/admin/resources', icon: DocumentTextIcon, color: 'from-blue-500 to-cyan-600', description: 'Add, edit, delete resources' },
        { name: 'Site Settings', href: '/admin/settings', icon: Cog6ToothIcon, color: 'from-cyan-500 to-violet-600', description: 'Manage homepage content' },
        { name: 'Manage Features', href: '/admin/features', icon: SparklesIcon, color: 'from-violet-500 to-purple-600', description: 'Edit feature cards' },
        { name: 'Announcements', href: '/admin/announcements', icon: MegaphoneIcon, color: 'from-purple-500 to-pink-600', description: 'Create announcements' },
        { name: 'User Management', href: '/admin/users', icon: UsersIcon, color: 'from-pink-500 to-red-600', description: 'Manage user accounts' },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">Monitor and manage your university library system</p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {quickActions.map((action) => (
                        <Link key={action.name} href={action.href} className="group">
                            <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${action.color} p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}>
                                <div className="flex items-center justify-between mb-3">
                                    <action.icon className="h-8 w-8 text-white" />
                                    <svg className="h-5 w-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">{action.name}</h3>
                                <p className="text-sm text-white/80 mt-1">{action.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Resources by Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resources by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {resourcesByCategory.map((item) => (
                        <div key={item.category} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                            <p className="text-sm font-medium text-gray-600">{item.category}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{item._count.category}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Resources */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-violet-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Resources</h2>
                    <Link
                        href="/admin/resources"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        View All
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {recentResources.map((resource) => (
                                <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className="inline-flex rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 border border-green-200">
                                            {resource.category}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {resource.department}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {new Date(resource.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
