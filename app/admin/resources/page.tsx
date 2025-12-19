import Link from 'next/link';
import prisma from '@/lib/prisma';
import { PlusIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ApproveRejectButtons } from './ApproveRejectButtons';

interface SearchParams {
    filter?: string;
}

export default async function AdminResourcesPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const resolvedSearchParams = await searchParams;
    const filter = resolvedSearchParams.filter || 'all';

    const where = filter === 'pending'
        ? { isApproved: false }
        : filter === 'approved'
            ? { isApproved: true }
            : {};

    const resources = await prisma.resource.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        include: {
            _count: {
                select: { bookmarkedBy: true },
            },
            course: {
                select: { courseCode: true, department: true }
            },
            uploadedBy: {
                select: { name: true, email: true }
            }
        },
    });

    const counts = await prisma.resource.groupBy({
        by: ['isApproved'],
        _count: true,
    });

    const pendingCount = counts.find(c => !c.isApproved)?._count || 0;
    const approvedCount = counts.find(c => c.isApproved)?._count || 0;
    const totalCount = pendingCount + approvedCount;

    const categoryColors: Record<string, string> = {
        'Books': 'bg-blue-100 text-blue-700 border-blue-200',
        'Questions': 'bg-purple-100 text-purple-700 border-purple-200',
        'Notes': 'bg-green-100 text-green-700 border-green-200',
        'Past Paper': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Other': 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const filterTabs = [
        { id: 'all', label: 'All', count: totalCount, icon: DocumentTextIcon },
        { id: 'pending', label: 'Pending', count: pendingCount, icon: ClockIcon },
        { id: 'approved', label: 'Approved', count: approvedCount, icon: CheckCircleIcon },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Resources Management</h1>
                    <p className="text-gray-600 mt-2">Manage library resources and approve student submissions</p>
                </div>
                <Link
                    href="/resources/create"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                    <PlusIcon className="h-5 w-5" />
                    Upload Resource
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-4">
                {filterTabs.map((tab) => (
                    <Link
                        key={tab.id}
                        href={`/admin/resources?filter=${tab.id}`}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filter === tab.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${filter === tab.id ? 'bg-blue-200' : 'bg-gray-200'
                            }`}>
                            {tab.count}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Resources Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Submitted By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {resources.map((resource) => (
                                <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
                                                <DocumentTextIcon className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-xs">{resource.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold border ${categoryColors[resource.resourceType] || categoryColors['Other']}`}>
                                            {resource.resourceType}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm text-gray-900">{resource.uploadedBy?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{resource.uploadedBy?.email}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {resource.course?.courseCode || '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {resource.isApproved ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <CheckCircleIcon className="h-3 w-3" />
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                <ClockIcon className="h-3 w-3" />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {new Date(resource.uploadedAt).toLocaleDateString()}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            {!resource.isApproved && (
                                                <ApproveRejectButtons resourceId={resource.id} />
                                            )}
                                            <Link
                                                href={`/resources/${resource.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {resources.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">
                        {filter === 'pending'
                            ? 'No resources pending approval.'
                            : 'No resources found.'}
                    </p>
                </div>
            )}
        </div>
    );
}
