import { Suspense } from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

async function ExternalResourcesList() {
    const resources = await prisma.externalResource.findMany({
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    const groupedResources = resources.reduce((acc: any, resource: any) => {
        if (!acc[resource.category]) {
            acc[resource.category] = [];
        }
        acc[resource.category].push(resource);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {Object.entries(groupedResources).map(([category, categoryResources]: [string, any]) => (
                <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {categoryResources.map((resource: any) => (
                                <div key={resource.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                                            {!resource.isActive && (
                                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                                        >
                                            {resource.url}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Link
                                            href={`/admin/external-resources/edit/${resource.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </Link>
                                        <form action={`/api/admin/external-resources/${resource.id}`} method="DELETE">
                                            <button
                                                type="submit"
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ExternalResourcesManagementPage() {
    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">External Resources</h1>
                    <p className="text-gray-600 mt-1">Manage external learning platforms and resources</p>
                </div>
                <Link
                    href="/admin/external-resources/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Resource
                </Link>
            </div>

            <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
                <ExternalResourcesList />
            </Suspense>
        </div>
    );
}
