import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function BookmarksPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const bookmarks = await prisma.bookmark.findMany({
        where: { userId: session.user.id },
        include: { resource: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <main className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Bookmarks</h1>

            {bookmarks.length === 0 ? (
                <p className="text-gray-500">You haven't bookmarked any resources yet.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {bookmarks.map(({ resource }) => (
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
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
