'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    BookmarkIcon,
    Cog6ToothIcon,
    BookOpenIcon,
    UserCircleIcon,
    CalculatorIcon,
    ChartBarIcon,
    TrophyIcon,
    ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: HomeIcon },
    { name: 'My Bookmarks', href: '/bookmarks', icon: BookmarkIcon },
    { name: 'Browse Resources', href: '/resources', icon: BookOpenIcon },
    { name: 'GPA Calculator', href: '/tools/gpa', icon: CalculatorIcon },
    { name: 'My Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon },
    { name: 'Peer Reviews', href: '/dashboard/reviews', icon: ClipboardDocumentCheckIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export function UserSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0">
            {/* User Info / Brand (optional if nav handles brand) */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">My Dashboard</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Student Portal</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-500'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Back to Home */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
