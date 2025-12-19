import { Suspense } from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { MessageCircle, TrendingUp, Clock, Users, Plus, ChevronRight, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

async function getForumData() {
    const [discussions, courses, hotTopics] = await Promise.all([
        // Get recent discussions across all courses
        prisma.forumDiscussion.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { name: true, image: true } },
                course: { select: { courseCode: true, courseTitle: true } },
                _count: { select: { replies: true } }
            }
        }),
        // Get courses that have discussions
        prisma.course.findMany({
            where: {
                discussions: { some: {} }
            },
            select: {
                id: true,
                courseCode: true,
                courseTitle: true,
                _count: { select: { discussions: true } }
            },
            orderBy: { discussions: { _count: 'desc' } },
            take: 10
        }),
        // Hot topics - most viewed/replied in last 7 days
        prisma.forumDiscussion.findMany({
            where: {
                createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            },
            orderBy: { views: 'desc' },
            take: 5,
            include: {
                author: { select: { name: true } },
                course: { select: { courseCode: true } },
                _count: { select: { replies: true } }
            }
        })
    ]);

    return { discussions, courses, hotTopics };
}

function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}

export default async function CommunityPage() {
    const session = await auth();
    const { discussions, courses, hotTopics } = await getForumData();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 pt-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                            <Users className="h-4 w-4" />
                            Student Community
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Community Forum
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-xl">
                            Ask questions, share knowledge, and help your peers succeed. Together we learn better.
                        </p>
                    </div>

                    {session?.user && (
                        <Link href="/courses">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Start New Discussion
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search discussions..."
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-purple-500"
                        />
                    </div>
                    <button className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 shrink-0">
                        <Filter className="h-4 w-4" />
                        Filter
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content - Discussions */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Discussions</h2>
                            <div className="flex gap-2 text-sm">
                                <button className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-medium">
                                    Latest
                                </button>
                                <button className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    Popular
                                </button>
                                <button className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    Unanswered
                                </button>
                            </div>
                        </div>

                        {discussions.length === 0 ? (
                            <Card className="p-12 text-center">
                                <MessageCircle className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No discussions yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Be the first to start a conversation!</p>
                                {session?.user && (
                                    <Link href="/courses">
                                        <Button variant="outline">Browse Courses to Start</Button>
                                    </Link>
                                )}
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {discussions.map((discussion) => (
                                    <Link key={discussion.id} href={`/courses/${discussion.courseId}?tab=forum&discussion=${discussion.id}`}>
                                        <Card className="p-5 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800 transition-all cursor-pointer group">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                                    {discussion.author.name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">
                                                            {discussion.course.courseCode}
                                                        </span>
                                                        {discussion.isResolved && (
                                                            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">
                                                                ✓ Solved
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                                                        {discussion.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                                        {discussion.content.substring(0, 120)}...
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                                        <span>{discussion.author.name}</span>
                                                        <span>•</span>
                                                        <span>{formatTimeAgo(discussion.createdAt)}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageCircle className="h-3 w-3" />
                                                            {discussion._count.replies} replies
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-purple-500 transition-colors" />
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Hot Topics */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUp className="h-5 w-5 text-orange-500" />
                                    Hot Topics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {hotTopics.length === 0 ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No trending topics this week</p>
                                ) : (
                                    hotTopics.map((topic, i) => (
                                        <Link key={topic.id} href={`/courses/${topic.courseId}?tab=forum&discussion=${topic.id}`} className="block group">
                                            <div className="flex items-start gap-3">
                                                <span className="text-lg font-bold text-gray-300 dark:text-gray-700">{i + 1}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 line-clamp-2">
                                                        {topic.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {topic.course.courseCode} • {topic._count.replies} replies
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Active Courses */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Clock className="h-5 w-5 text-blue-500" />
                                    Active Courses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {courses.length === 0 ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No active discussions in courses</p>
                                ) : (
                                    courses.map((course) => (
                                        <Link key={course.id} href={`/courses/${course.id}?tab=forum`}>
                                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600">
                                                        {course.courseCode}
                                                    </p>
                                                    <p className="text-xs text-gray-400 line-clamp-1">{course.courseTitle}</p>
                                                </div>
                                                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-500">
                                                    {course._count.discussions}
                                                </span>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Community Guidelines */}
                        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-100 dark:border-purple-800">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Community Guidelines</h3>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500">•</span>
                                        Be respectful and constructive
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500">•</span>
                                        No plagiarism - share knowledge, not answers
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500">•</span>
                                        Mark solutions to help others
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500">•</span>
                                        Use appropriate course tags
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
