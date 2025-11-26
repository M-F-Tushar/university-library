import Link from 'next/link';
import prisma from '@/lib/prisma';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';

export default async function AnnouncementsPage() {
    const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
    });

    const typeColors = {
        info: 'bg-blue-100 text-blue-700 border-blue-200',
        warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        success: 'bg-green-100 text-green-700 border-green-200',
        error: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                    <p className="text-gray-600 mt-2">Manage site-wide announcements</p>
                </div>
                <Link
                    href="/admin/announcements/create"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                    <PlusIcon className="h-5 w-5" />
                    Create Announcement
                </Link>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${typeColors[announcement.type as keyof typeof typeColors]}`}>
                                        {announcement.type}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${announcement.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {announcement.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-3">{announcement.content}</p>
                                <div className="flex gap-4 text-xs text-gray-500">
                                    <span>Created: {new Date(announcement.createdAt).toLocaleDateString()}</span>
                                    {announcement.startDate && (
                                        <span>Start: {new Date(announcement.startDate).toLocaleDateString()}</span>
                                    )}
                                    {announcement.endDate && (
                                        <span>End: {new Date(announcement.endDate).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                            <Link
                                href={`/admin/announcements/${announcement.id}/edit`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <PencilIcon className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {announcements.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">No announcements found. Create your first announcement to get started.</p>
                </div>
            )}
        </div>
    );
}
