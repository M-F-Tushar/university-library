"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Session } from "next-auth"
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    BookmarkIcon,
    UserIcon
} from "@heroicons/react/24/outline"
import { mainNavigation } from "@/lib/navigation"
import { Button } from "@/components/ui/Button"
import { handleSignOut } from "@/app/lib/auth-actions"

interface MobileNavProps {
    session: Session | null
}

export function MobileNav({ session }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            {/* Hamburger Menu Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
                <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sidebar Content */}
                    <div className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-200">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold font-display">Menu</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-2">
                            {mainNavigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${pathname === item.href
                                            ? "bg-primary-50 text-primary-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {item.icon && <item.icon className="h-5 w-5" />}
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto pt-6 border-t border-gray-100 space-y-4">
                            {session ? (
                                <>
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                                            {session.user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{session.user.name}</p>
                                            <p className="text-xs text-gray-500">{session.user.email}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        className="w-full justify-start"
                                        onClick={() => handleSignOut()}
                                    >
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full">Sign In</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Tab Bar (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden pb-safe">
                <div className="flex justify-around items-center h-16">
                    <Link
                        href="/"
                        className={`flex flex-col items-center gap-1 p-2 ${pathname === '/' ? 'text-primary-600' : 'text-gray-500'
                            }`}
                    >
                        <HomeIcon className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>
                    <Link
                        href="/resources"
                        className={`flex flex-col items-center gap-1 p-2 ${pathname === '/resources' ? 'text-primary-600' : 'text-gray-500'
                            }`}
                    >
                        <MagnifyingGlassIcon className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Browse</span>
                    </Link>
                    <Link
                        href="/bookmarks"
                        className={`flex flex-col items-center gap-1 p-2 ${pathname === '/bookmarks' ? 'text-primary-600' : 'text-gray-500'
                            }`}
                    >
                        <BookmarkIcon className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Saved</span>
                    </Link>
                    <Link
                        href={session ? "/profile" : "/login"}
                        className={`flex flex-col items-center gap-1 p-2 ${pathname === '/profile' ? 'text-primary-600' : 'text-gray-500'
                            }`}
                    >
                        <UserIcon className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Profile</span>
                    </Link>
                </div>
            </div>
        </>
    )
}
