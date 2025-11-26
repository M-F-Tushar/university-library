import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, BookOpenIcon, ArrowDownTrayIcon, LinkIcon } from '@heroicons/react/24/outline';

export default async function ResourceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const resource = await prisma.resource.findUnique({
        where: { id },
    });

    if (!resource) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black p-6">
            <div className="max-w-5xl mx-auto">
                <Link href="/resources" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors">
                    <ArrowLeftIcon className="mr-1 h-4 w-4" />
                    Back to Resources
                </Link>

                <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <div className="md:flex">
                        {/* Cover Image Section */}
                        <div className="md:w-1/3 bg-gray-100 dark:bg-gray-800 p-8 flex items-center justify-center border-r border-gray-100 dark:border-gray-800">
                            {resource.coverImage ? (
                                <div className="relative w-48 h-72 shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                    <img
                                        src={resource.coverImage}
                                        alt={resource.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-48 h-72 bg-gradient-to-br from-blue-100 to-violet-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center shadow-inner">
                                    <BookOpenIcon className="h-20 w-20 text-blue-300 dark:text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="p-8 md:w-2/3">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10">
                                    {resource.category}
                                </span>
                                {resource.format && (
                                    <span className="inline-flex items-center rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10">
                                        {resource.format}
                                    </span>
                                )}
                                {resource.year && (
                                    <span className="inline-flex items-center rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10">
                                        {resource.year}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{resource.title}</h1>

                            {resource.author && (
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 italic">
                                    by <span className="font-medium text-gray-900 dark:text-white">{resource.author}</span>
                                </p>
                            )}

                            <div className="prose prose-blue dark:prose-invert max-w-none mb-8">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-2">Description</h3>
                                <p className="text-gray-600 dark:text-gray-300">{resource.description}</p>

                                {resource.abstract && (
                                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-2">Abstract</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 italic">{resource.abstract}</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                                <div>
                                    <span className="block text-gray-500 dark:text-gray-400">Department</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{resource.department}</span>
                                </div>
                                {resource.course && (
                                    <div>
                                        <span className="block text-gray-500 dark:text-gray-400">Course</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{resource.course}</span>
                                    </div>
                                )}
                                {resource.semester && (
                                    <div>
                                        <span className="block text-gray-500 dark:text-gray-400">Semester</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{resource.semester}</span>
                                    </div>
                                )}
                                {resource.fileSize && (
                                    <div>
                                        <span className="block text-gray-500 dark:text-gray-400">File Size</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{resource.fileSize}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                                {resource.fileUrl ? (
                                    <>
                                        <a
                                            href={resource.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                        >
                                            <BookOpenIcon className="mr-2 h-5 w-5" />
                                            Read Online
                                        </a>
                                        <a
                                            href={resource.fileUrl}
                                            download
                                            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                        >
                                            <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                                            Download {resource.format}
                                        </a>
                                    </>
                                ) : (
                                    <button
                                        disabled
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl cursor-not-allowed"
                                    >
                                        No File Available
                                    </button>
                                )}

                                {resource.externalUrl && (
                                    <a
                                        href={resource.externalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                    >
                                        <LinkIcon className="mr-2 h-5 w-5" />
                                        External Link
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
