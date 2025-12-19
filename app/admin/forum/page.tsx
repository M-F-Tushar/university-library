import prisma from '@/lib/prisma';
import Link from 'next/link';
import { MessageCircle, Flag, CheckCircle, Clock, AlertTriangle, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

async function getForumModerationData() {
    const [
        totalDiscussions,
        unresolvedDiscussions,
        flaggedDiscussions,
        recentDiscussions,
        topContributors
    ] = await Promise.all([
        prisma.forumDiscussion.count(),
        prisma.forumDiscussion.count({ where: { isResolved: false } }),
        // Count discussions that have flagged resources in their course (proxy for problematic content)
        prisma.forumDiscussion.count({ where: { views: { gt: 50 } } }), // High-visibility posts
        prisma.forumDiscussion.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { name: true, email: true } },
                course: { select: { courseCode: true, courseTitle: true } },
                _count: { select: { replies: true } }
            }
        }),
        prisma.user.findMany({
            take: 5,
            orderBy: { forumPosts: { _count: 'desc' } },
            select: {
                id: true,
                name: true,
                email: true,
                _count: { select: { forumPosts: true, forumReplies: true } }
            }
        })
    ]);

    return {
        stats: {
            total: totalDiscussions,
            unresolved: unresolvedDiscussions,
            highVisibility: flaggedDiscussions,
        },
        recentDiscussions,
        topContributors
    };
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default async function ForumModerationPage() {
    const { stats, recentDiscussions, topContributors } = await getForumModerationData();

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Forum Moderation</h1>
                <p className="text-gray-600 mt-2">Monitor and moderate community discussions</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Discussions</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100">
                                <MessageCircle className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Unresolved</p>
                                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.unresolved}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-100">
                                <Clock className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">High Visibility</p>
                                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.highVisibility}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-100">
                                <Eye className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">
                                    {stats.total > 0 ? Math.round(((stats.total - stats.unresolved) / stats.total) * 100) : 0}%
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-green-100">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Discussions */}
                <div className="lg:col-span-2">
                    <Card className="bg-white border border-gray-200 overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
                            <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-blue-600" />
                                Recent Discussions
                            </CardTitle>
                        </CardHeader>
                        <div className="divide-y divide-gray-100">
                            {recentDiscussions.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No discussions yet
                                </div>
                            ) : (
                                recentDiscussions.map((discussion) => (
                                    <div key={discussion.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                        {discussion.course.courseCode}
                                                    </span>
                                                    {discussion.isResolved ? (
                                                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                                                            <CheckCircle className="h-3 w-3" />
                                                            Resolved
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            Open
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-medium text-gray-900 truncate">
                                                    {discussion.title}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                                    <span>by {discussion.author.name || discussion.author.email}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(discussion.createdAt)}</span>
                                                    <span>•</span>
                                                    <span>{discussion._count.replies} replies</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/courses/${discussion.courseId}?tab=forum&discussion=${discussion.id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Discussion"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Top Contributors */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Top Forum Contributors</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {topContributors.length === 0 ? (
                                <p className="text-sm text-gray-500">No contributors yet</p>
                            ) : (
                                topContributors.map((user, index) => (
                                    <div key={user.id} className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {user.name || user.email}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user._count.forumPosts} posts • {user._count.forumReplies} replies
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
                        <CardHeader>
                            <CardTitle className="text-lg">Moderation Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-gray-600 space-y-3">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    Mark helpful answers as solutions
                                </li>
                                <li className="flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                    Monitor high-visibility discussions
                                </li>
                                <li className="flex items-start gap-2">
                                    <Flag className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                    Review flagged content promptly
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
