'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Session } from 'next-auth';
import { Bars3Icon, XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { handleSignOut } from '@/app/lib/auth-actions';
import { mainNavigation } from '@/lib/navigation';

interface NavbarContentProps {
    session: Session | null;
    siteName: string;
}

export default function NavbarContent({ session, siteName }: NavbarContentProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300" suppressHydrationWarning>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                <div className="flex h-16 justify-between items-center" suppressHydrationWarning>
                    <div className="flex items-center" suppressHydrationWarning>
                        <div className="flex flex-shrink-0 items-center gap-2" suppressHydrationWarning>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-md" suppressHydrationWarning>
                                <BookOpenIcon className="h-6 w-6 text-white" />
                            </div>
                            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                                {siteName}
                            </Link>
                        </div>
                        <div className="hidden md:ml-8 md:flex md:space-x-1" suppressHydrationWarning>
                            {mainNavigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4" suppressHydrationWarning>
                        {session?.user ? (
                            <>
                                {session.user.role === 'ADMIN' && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <div className="flex items-center gap-3" suppressHydrationWarning>
                                    <div className="flex items-center gap-2" suppressHydrationWarning>
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm" suppressHydrationWarning>
                                            {session.user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {session.user.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleSignOut()}
                                        className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:from-blue-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg text-sm"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden" suppressHydrationWarning>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            aria-label="Toggle navigation menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {mainNavigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-800 pb-3 pt-4">
                        <div className="px-4 space-y-3">
                            {session?.user ? (
                                <>
                                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold">
                                            {session.user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{session.user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{session.user.email}</p>
                                        </div>
                                    </div>
                                    {session.user.role === 'ADMIN' && (
                                        <Link
                                            href="/admin/dashboard"
                                            className="block w-full text-center rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => handleSignOut()}
                                        className="block w-full text-center rounded-md bg-red-50 dark:bg-red-900/20 px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="block w-full text-center rounded-md bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2 text-base font-semibold text-white hover:from-blue-700 hover:to-violet-700"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
