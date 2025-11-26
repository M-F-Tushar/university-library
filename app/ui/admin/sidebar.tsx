'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    Cog6ToothIcon,
    SparklesIcon,
    MegaphoneIcon,
    UsersIcon,
    DocumentTextIcon,
    ChartBarIcon,
    GlobeAltIcon,
    AcademicCapIcon,
    RectangleStackIcon,
    BuildingOfficeIcon,
    DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Site Settings', href: '/admin/settings', icon: Cog6ToothIcon },
    { name: 'Features', href: '/admin/features', icon: SparklesIcon },
    { name: 'Categories', href: '/admin/categories', icon: RectangleStackIcon },
    { name: 'Departments', href: '/admin/departments', icon: BuildingOfficeIcon },
    { name: 'Formats', href: '/admin/formats', icon: DocumentDuplicateIcon },
    { name: 'Announcements', href: '/admin/announcements', icon: MegaphoneIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Resources', href: '/admin/resources', icon: DocumentTextIcon },
    { name: 'Semesters', href: '/admin/semesters', icon: AcademicCapIcon },
    { name: 'Courses', href: '/admin/courses', icon: AcademicCapIcon },
    { name: 'External Resources', href: '/admin/external-resources', icon: GlobeAltIcon },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700" suppressHydrationWarning>
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700" suppressHydrationWarning>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
                    <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                    <p className="text-xs text-slate-400">UniLibrary</p>
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
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-700" suppressHydrationWarning>
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Website
                </Link>
            </div>
        </div>
    );
}
