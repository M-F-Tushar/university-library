import Link from 'next/link';
import prisma from '@/lib/prisma';
import { PlusIcon, PencilIcon, Cog6ToothIcon, SparklesIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

export default async function AdminDashboard() {
    const resources = await prisma.resource.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
    });

    const totalResources = await prisma.resource.count();
    const totalUsers = await prisma.user.count();
    const totalFeatures = await prisma.feature.count({ where: { isActive: true } });
    const totalAnnouncements = await prisma.announcement.count({ where: { isActive: true } });

    return (
        <div className="space-y-8">
            {/* CMS Quick Access */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Link href="/dashboard/settings" className="group">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-white/80">Site Settings</h3>
                                <p className="mt-2 text-2xl font-bold text-white">Manage Content</p>
                            </div>
                            <Cog6ToothIcon className="h-12 w-12 text-white/30 group-hover:text-white/50 transition-colors" />
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/features" className="group">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-white/80">Features</h3>
                                <p className="mt-2 text-2xl font-bold text-white">{totalFeatures} Active</p>
                            </div>
                            <SparklesIcon className="h-12 w-12 text-white/30 group-hover:text-white/50 transition-colors" />
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/announcements" className="group">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-white/80">Announcements</h3>
                                <p className="mt-2 text-2xl font-bold text-white">{totalAnnouncements} Active</p>
                            </div>
                            <MegaphoneIcon className="h-12 w-12 text-white/30 group-hover:text-white/50 transition-colors" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Total Resources</h3>
                    <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">{totalResources}</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                    <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">{totalUsers}</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 flex items-center justify-center">
                    <Link
                        href="/resources/create"
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-white font-medium hover:from-blue-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Upload Resource
                    </Link>
                </div>
            </div>

            {/* Recent Uploads */}
            <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-violet-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Uploads</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {resources.map((resource) => (
                                <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                                        <div className="text-sm text-gray-500">{resource.department}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className="inline-flex rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 border border-green-200">
                                            {resource.category}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {new Date(resource.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <Link href={`/resources/${resource.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium">
                                            Edit
                                        </Link>
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
