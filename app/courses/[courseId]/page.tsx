
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen, FileText, Share2, Star, Download, ChevronRight } from 'lucide-react'

const prisma = new PrismaClient()

async function getCourse(courseId: string) {
    // Allow Code or ID
    const course = await prisma.course.findFirst({
        where: {
            OR: [
                { id: courseId },
                { courseCode: decodeURIComponent(courseId) }
            ]
        },
        include: {
            preRequisites: true,
            resources: {
                where: { isApproved: true },
                include: {
                    uploadedBy: { select: { name: true } }
                }
            },
            _count: {
                select: { discussions: true }
            }
        }
    })

    if (!course) return null
    return course
}

import { getCourseDiscussions } from '@/lib/forum/actions'
import { ThreadList } from '@/components/forum/ThreadList'

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params
    const course = await getCourse(courseId)

    if (!course) {
        notFound()
    }

    const discussions = await getCourseDiscussions(course.id)

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-black">
            <div className="container mx-auto px-4">

                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/courses" className="hover:text-blue-500">Curriculum</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{course.courseCode}</span>
                </nav>

                {/* Header Header */}
                <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                                    {course.courseCode}
                                </span>
                                <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                    {course.credits} Credits
                                </span>
                                {course.isSessional && (
                                    <span className="rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">
                                        Lab / Sessional
                                    </span>
                                )}
                            </div>
                            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                                {course.courseTitle}
                            </h1>
                            <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                                {course.description || "No description available for this course."}
                            </p>

                            {course.instructor && (
                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Instructor:</span> {course.instructor}
                                </div>
                            )}

                            {course.learningOutcomes && (
                                <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">Learning Outcomes</h3>
                                    <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-line">
                                        {course.learningOutcomes}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700">
                                <Share2 className="h-4 w-4" />
                                Share
                            </button>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="mt-8 flex flex-wrap gap-8 border-t border-gray-100 pt-6 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resources</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{course.resources.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prerequisites</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{course.preRequisites.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs (Simplified) */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Prerequisites */}
                        {course.preRequisites.length > 0 && (
                            <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Prerequisites</h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {course.preRequisites.map(prereq => (
                                        <Link href={`/courses/${prereq.courseCode}`} key={prereq.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-4 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                                            <span className="font-semibold text-gray-900 dark:text-white">{prereq.courseCode}</span>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Resources List */}
                        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Study Resources</h2>
                                <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                                    Upload New
                                </button>
                            </div>

                            {course.resources.filter(r => r.resourceType !== 'Past Paper').length > 0 ? (
                                <div className="space-y-4">
                                    {course.resources.filter(r => r.resourceType !== 'Past Paper').map(resource => (
                                        <div key={resource.id} className="flex items-start justify-between rounded-lg border border-gray-100 p-4 hover:border-blue-100 hover:bg-blue-50/30 dark:border-gray-800 dark:hover:border-blue-900/30 dark:hover:bg-blue-900/10">
                                            <div className="flex gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-white">{resource.title}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {resource.resourceType} • Uploaded by {resource.uploadedBy.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                                                <Download className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                                        <BookOpen className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <h3 className="mt-4 font-medium text-gray-900 dark:text-white">No resources yet</h3>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Be the first to share study materials for this course.</p>
                                    <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                        Upload Resource
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* Past Papers Section */}
                        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Past Exam Papers</h2>
                            </div>

                            {course.resources.filter(r => r.resourceType === 'Past Paper').length > 0 ? (
                                <div className="space-y-4">
                                    {course.resources.filter(r => r.resourceType === 'Past Paper').map(paper => (
                                        <div key={paper.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:border-blue-100 hover:bg-blue-50/30 dark:border-gray-800 dark:hover:border-blue-900/30 dark:hover:bg-blue-900/10">
                                            <div className="flex gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-white">{paper.title}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Year: {paper.year || 'N/A'} • Uploaded by {paper.uploadedBy.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                                                <Download className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-sm text-gray-500 py-8">
                                    No past papers available yet.
                                </div>
                            )}
                        </section>

                        {/* Forum Section */}
                        <ThreadList courseId={course.id} threads={discussions} />
                    </div>

                    {/* Sidebar (Instructors, etc) */}
                    <div className="space-y-6">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                            <div className="mt-4 space-y-3">
                                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                                    <Star className="h-4 w-4" />
                                    Add to Favorites
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
