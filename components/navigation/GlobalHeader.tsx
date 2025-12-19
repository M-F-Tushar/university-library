"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, University } from "lucide-react";
import { SearchWidget } from "./SearchWidget";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";

interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
}

interface GlobalHeaderProps {
    user?: User | null;
}

export function GlobalHeader({ user }: GlobalHeaderProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:border-gray-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* Left: Logo & Mobile Menu */}
                <div className="flex items-center gap-2 md:gap-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm" className="lg:hidden px-2">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px] z-[100] bg-white dark:bg-gray-950">
                            <div className="flex flex-col gap-6 py-4">
                                <Link href="/" className="flex items-center gap-2 font-bold text-xl px-2">
                                    <div className="bg-primary-600 p-1.5 rounded-lg text-white">
                                        <University size={24} />
                                    </div>
                                    <span>CSE Library</span>
                                </Link>
                                <nav className="flex flex-col gap-1">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Core</div>
                                    <Link href="/" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium">Home</Link>
                                    <Link href="/courses" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium">Courses</Link>
                                    <Link href="/dashboard" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium">Dashboard</Link>
                                    <Link href="/leaderboard" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium">Leaderboard</Link>

                                    <div className="mt-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resources</div>
                                    <Link href="/resources?category=Questions" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium text-primary-600">Past Questions</Link>
                                    <Link href="/resources?category=Notes&category=Slides" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium">Notes & Slides</Link>
                                    <Link href="/resources?category=Books&category=Papers" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium">Books & References</Link>
                                    <Link href="/resources?category=Labs&category=Assignments" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium">Labs & Assignments</Link>
                                    <Link href="/resources?category=Projects&category=Reports" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium">Projects & Reports</Link>

                                    <div className="mt-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">System</div>
                                    <Link href="/tools" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium">Tools</Link>
                                    <Link href="/help" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium">Help</Link>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-gray-900 dark:text-white shrink-0">
                        <div className="bg-primary-600 p-1.5 rounded-lg text-white hidden sm:block">
                            <University size={24} />
                        </div>
                        <span className="hidden sm:inline">CSE Library</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <Link href="/courses" className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/courses'
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}>
                            Courses
                        </Link>
                        <Link href="/resources?category=Questions" className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/resources' && searchParams.get('category') === 'Questions'
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}>
                            Past Questions
                        </Link>
                        <Link href="/resources" className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/resources' && !searchParams.get('category')
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}>
                            Resources
                        </Link>
                        <Link href="/leaderboard" className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/leaderboard'
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}>
                            Leaderboard
                        </Link>
                        <Link href="/tools" className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/tools'
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}>
                            Tools
                        </Link>
                    </nav>
                </div>

                {/* Center: Search Widget */}
                <div className="hidden md:flex flex-1 justify-center max-w-xl mx-4">
                    <SearchWidget />
                </div>

                {/* Right: User Menu & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <UserMenu user={user || undefined} />
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden border-t p-2 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
                <SearchWidget />
            </div>
        </header>
    );
}
