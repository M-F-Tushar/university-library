import Link from 'next/link';
import prisma from '@/lib/prisma';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default async function StudentDashboard() {
    const recentResources = await prisma.resource.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
    });

    return (
        <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Find Resources</h2>
                <div className="relative">
                    <Link href="/resources" className="block w-full">
                        <div className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors">
                            <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
                            <span>Search for books, notes, questions...</span>
                        </div>
                    </Link>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {['Computer Science', 'Electrical Eng', 'Business', 'Mathematics'].map((dept) => (
                        <Link key={dept} href={`/resources?department=${encodeURIComponent(dept)}`} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200">
                            {dept}
                        </Link>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Recently Added</h2>
                    <Link href="/resources" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        View all
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentResources.map((resource) => (
                        <div key={resource.id} className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                                        {resource.category}
                                    </span>
                                    <span className="text-xs text-gray-500">{new Date(resource.createdAt).toLocaleDateString()}</span>
                                </div>
                                <Link href={`/resources/${resource.id}`} className="mt-2 block">
                                    <h3 className="text-lg font-medium text-gray-900 truncate" title={resource.title}>{resource.title}</h3>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{resource.description}</p>
                                </Link>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{resource.department}</span>
                                    {/* Bookmark button could go here */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
