import Link from 'next/link';
import prisma from '@/lib/prisma';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default async function FeaturesPage() {
    const features = await prisma.feature.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6" suppressHydrationWarning>
            {/* Header */}
            <div className="flex items-center justify-between" suppressHydrationWarning>
                <div suppressHydrationWarning>
                    <h1 className="text-3xl font-bold text-gray-900">Features Management</h1>
                    <p className="text-gray-600 mt-2">Manage homepage feature cards</p>
                </div>
                <Link
                    href="/admin/features/create"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Feature
                </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" suppressHydrationWarning>
                {features.map((feature) => (
                    <div key={feature.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow" suppressHydrationWarning>
                        <div className="flex items-start justify-between mb-4" suppressHydrationWarning>
                            {feature.coverImage ? (
                                <img src={feature.coverImage} alt={feature.title} className="h-20 w-20 object-cover rounded-lg" />
                            ) : (
                                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600" suppressHydrationWarning>
                                    <div className="h-6 w-6 bg-white/30 rounded" suppressHydrationWarning></div>
                                </div>
                            )}
                            <div className="flex gap-2" suppressHydrationWarning>
                                <Link
                                    href={`/admin/features/${feature.id}/edit`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500" suppressHydrationWarning>
                            <span className={`px-2 py-1 rounded ${feature.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {feature.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {features.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200" suppressHydrationWarning>
                    <p className="text-gray-500">No features found. Create your first feature to get started.</p>
                </div>
            )}
        </div>
    );
}
