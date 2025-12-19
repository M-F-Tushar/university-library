'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MessageCircle, Star, Upload, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
    id: string;
    type: 'upload' | 'discussion' | 'review';
    title: string;
    user: string;
    course?: string;
    timeAgo: string;
}

// Simulated recent activity - in production this would come from an API
const mockActivity: ActivityItem[] = [
    { id: '1', type: 'upload', title: 'Data Structures Lab Manual', user: 'Ahmed', course: 'CSE 2101', timeAgo: '5 min ago' },
    { id: '2', type: 'discussion', title: 'How to solve recursion problems?', user: 'Fatima', course: 'CSE 2201', timeAgo: '12 min ago' },
    { id: '3', type: 'review', title: 'Great notes for OS concepts!', user: 'Rafiq', course: 'CSE 3201', timeAgo: '1 hour ago' },
    { id: '4', type: 'upload', title: 'Previous Year Final Paper 2023', user: 'Nadia', course: 'CSE 3101', timeAgo: '2 hours ago' },
    { id: '5', type: 'discussion', title: 'ML project ideas for Year 4', user: 'Karim', course: 'CSE 4103', timeAgo: '3 hours ago' },
];

const ActivityIcon = ({ type }: { type: ActivityItem['type'] }) => {
    switch (type) {
        case 'upload':
            return <Upload className="h-4 w-4 text-green-500" />;
        case 'discussion':
            return <MessageCircle className="h-4 w-4 text-blue-500" />;
        case 'review':
            return <Star className="h-4 w-4 text-amber-500" />;
    }
};

const getActivityLabel = (type: ActivityItem['type']) => {
    switch (type) {
        case 'upload': return 'shared';
        case 'discussion': return 'asked';
        case 'review': return 'reviewed';
    }
};

export function CommunityActivity() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setActivities(mockActivity);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="py-20 bg-white dark:bg-black">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block px-3 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-full"
                        >
                            Live Community
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-display"
                        >
                            Students Helping Students
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl"
                        >
                            See what your peers are sharing right now. Join the conversation and contribute to our growing knowledge base.
                        </motion.p>
                    </div>
                    <Link
                        href="/community"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    >
                        View All Activity
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        // Loading skeletons
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 animate-pulse">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                                        <ActivityIcon type={activity.type} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                                            {activity.title}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{activity.user}</span>
                                            {' '}{getActivityLabel(activity.type)}{' '}
                                            {activity.course && (
                                                <span className="text-blue-600 dark:text-blue-400">in {activity.course}</span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            {activity.timeAgo}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Community Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {[
                        { label: 'Active Students', value: '500+', icon: '👥' },
                        { label: 'Resources Shared', value: '2,500+', icon: '📚' },
                        { label: 'Discussions', value: '1,200+', icon: '💬' },
                        { label: 'Helpful Answers', value: '3,800+', icon: '✅' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/50 border border-gray-100 dark:border-gray-800">
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
