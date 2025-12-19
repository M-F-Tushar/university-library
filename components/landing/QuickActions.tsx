'use client';

import { motion } from 'framer-motion';
import {
    BookOpenIcon,
    UserGroupIcon,
    DocumentTextIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: string[]) {
    return twMerge(clsx(inputs));
}

const actions = [
    {
        title: "Course Catalog",
        description: "Browse 50+ courses by semester and year.",
        href: "/courses",
        icon: BookOpenIcon,
        color: "blue",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        title: "Past Papers Hub",
        description: "Access years of exam questions and solutions.",
        // Assuming this route, likely integrated into /resources with filter or dedicated page
        // Based on previous tasks, it's accessed via course detail or resource filter. 
        // Let's link to resources for now with a query if possible, or just resources.
        href: "/resources?category=Past%20Paper",
        icon: DocumentTextIcon,
        color: "amber",
        gradient: "from-amber-500 to-orange-500"
    },
    {
        title: "Community Forum",
        description: "Discuss topics, ask questions, and help peers.",
        href: "/community",
        icon: UserGroupIcon,
        color: "purple",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        title: "Leaderboard",
        description: "Compete with peers and earn badges.",
        href: "/leaderboard",
        icon: TrophyIcon,
        color: "emerald",
        gradient: "from-emerald-500 to-green-500"
    }
];

export function QuickActions() {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="container px-4 mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-display">
                        Everything You Need
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Quick access to the most important tools for your academic success.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {actions.map((action, index) => (
                        <Link key={action.title} href={action.href} className="group">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="relative h-full p-8 overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow"
                            >
                                <div className={cn(
                                    "absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full opacity-10 blur-xl bg-gradient-to-br",
                                    action.gradient
                                )} />

                                <div className={cn(
                                    "inline-flex p-3 rounded-xl mb-6 bg-gradient-to-br text-white shadow-lg",
                                    action.gradient
                                )}>
                                    <action.icon className="w-6 h-6" />
                                </div>

                                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                                    {action.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {action.description}
                                </p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
