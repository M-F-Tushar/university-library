import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Download, Bookmark, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { ResourceCard } from "@/components/resources/ResourceCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function ResourceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const resource = await prisma.resource.findUnique({
        where: { id },
        include: {
            course: true,
            uploadedBy: { select: { name: true } }
        }
    });

    if (!resource) {
        notFound();
    }

    // Mock related data (in a real app, this would be a separate fetch)
    const relatedResources = [
        { id: "rel-1", title: "Previous Year Question 2022", department: "CSE-220", semester: "2-2", type: "Question", createdAt: new Date() },
        { id: "rel-2", title: "Lab Manual: Sorting Algorithms", department: "CSE-220", semester: "2-2", type: "Lab", format: "PDF", createdAt: new Date() },
        { id: "rel-3", title: "Advanced Data Structures Slides", department: "CSE-220", semester: "2-2", type: "Slides", format: "PPTX", createdAt: new Date() },
    ];

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pb-24 lg:pb-12">
            {/* Sticky Mobile Action Bar (Bottom) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 lg:hidden flex gap-3 shadow-lg">
                {resource.fileUrl ? (
                    <a href={resource.fileUrl} download className="flex-1">
                        <Button fullWidth size="lg">Download {resource.format}</Button>
                    </a>
                ) : (
                    <Button disabled fullWidth size="lg">No File</Button>
                )}
                <Button variant="outline" size="lg"><Bookmark className="h-5 w-5" /></Button>
            </div>

            <div className="max-w-6xl mx-auto p-4 lg:p-8">
                {/* Breadcrumb / Back */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/resources" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to Resources
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Report Issue</Button>
                        <Button variant="ghost" size="sm">Request Update</Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                            {/* Header Section */}
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">{resource.course?.department || 'General'}</Badge>
                                    {resource.course && <Badge variant="outline">{resource.course.courseCode}</Badge>}
                                    {resource.course?.semester && <Badge variant="outline">{resource.course.semester} Sem</Badge>}
                                    <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700">{resource.resourceType}</Badge>
                                </div>
                                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2 leading-tight">{resource.title}</h1>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Uploaded by <span className="font-medium text-gray-900 dark:text-white">{resource.uploadedBy?.name || "Unknown"}</span> • {formatDistanceToNow(new Date(resource.uploadedAt), { addSuffix: true })}
                                </p>
                            </div>

                            {/* Viewer Placeholder */}
                            <div className="bg-gray-100 dark:bg-gray-950 min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                                {resource.coverImage ? (
                                    <img src={resource.coverImage} className="max-h-96 shadow-lg rounded-lg" alt="Preview" />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                        <FileText className="h-10 w-10 text-gray-400" />
                                    </div>
                                )}
                                <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-sm">
                                    Preview not available for this file type. Please download to view.
                                </p>
                            </div>

                            {/* Description & Metadata */}
                            <div className="p-8">
                                <div className="prose prose-blue dark:prose-invert max-w-none">
                                    <h3>Description</h3>
                                    <p>{resource.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Related Resources */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Resources</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {relatedResources.map(rel => (
                                    // Use stripped down props for mock data
                                    <ResourceCard key={rel.id} resource={rel as any} variant="list" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions (Desktop) */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Download & Actions</h3>

                            <div className="space-y-3">
                                {resource.fileUrl ? (
                                    <>
                                        <a href={resource.fileUrl} target="_blank" className="block">
                                            <Button fullWidth size="lg">Read Online</Button>
                                        </a>
                                        <a href={resource.fileUrl} download className="block">
                                            <Button fullWidth variant="outline" size="lg">
                                                <Download className="mr-2 h-4 w-4" /> Download
                                            </Button>
                                        </a>
                                    </>
                                ) : (
                                    <Button disabled fullWidth>File Unavailable</Button>
                                )}
                            </div>

                            <div className="my-6 border-t border-gray-100 dark:border-gray-800"></div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-500 text-xs">Downloads</span>
                                    <span className="font-medium">0</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs">File Size</span>
                                    <span className="font-medium">Unknown</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs">Format</span>
                                    <span className="font-medium uppercase">{resource.format || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs">Course</span>
                                    <span className="font-medium">{resource.course?.department || resource.course?.courseCode || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
