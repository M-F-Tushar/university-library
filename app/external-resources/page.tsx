import Link from 'next/link';
import { GlobeAltIcon, LinkIcon } from '@heroicons/react/24/outline';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import PageComments from '@/app/ui/page-comments';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ExternalResourcesPage() {
    const [externalResources, comments, session] = await Promise.all([
        prisma.externalResource.findMany({
            where: { isActive: true },
            orderBy: [{ category: 'asc' }, { order: 'asc' }],
        }),
        prisma.pageComment.findMany({
            where: { pageUrl: '/external-resources', isApproved: true },
            orderBy: { createdAt: 'desc' },
            select: { id: true, userName: true, comment: true, createdAt: true },
        }),
        auth(),
    ]);

    // Group by category
    const groupedResources = externalResources.reduce((acc, resource) => {
        if (!acc[resource.category]) {
            acc[resource.category] = [];
        }
        acc[resource.category].push(resource);
        return acc;
    }, {} as Record<string, typeof externalResources>);

    const userSession = session?.user ? { name: session.user.name!, email: session.user.email! } : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 mb-4">
                        <GlobeAltIcon className="h-4 w-4" />
                        <span>Curated External Links</span>
                    </div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent sm:text-5xl">
                        External Resources
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        Handpicked collection of the best online learning platforms, tools, and resources for Computer Science students
                    </p>
                </div>

                {/* Resources Grid */}
                <div className="space-y-8 mb-12">
                    {Object.entries(groupedResources).map(([category, resources]) => (
                        <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-violet-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {resources.map((resource) => (
                                    <a
                                        key={resource.id}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {resource.name}
                                                    </h3>
                                                    <LinkIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                                </div>
                                                <p className="text-sm text-gray-600">{resource.description}</p>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Note */}
                <div className="mb-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> These are external resources. We are not affiliated with these platforms.
                        Please verify the authenticity and relevance of content before use.
                    </p>
                </div>

                {/* Comments Section */}
                <PageComments
                    pageUrl="/external-resources"
                    comments={comments}
                    userSession={userSession}
                />
            </div>
        </div>
    );
}
