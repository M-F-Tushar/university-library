"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Session } from "next-auth"
import { BookOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { mainNavigation } from "@/lib/navigation"
import { UserNav } from "@/components/ui/UserNav"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { MobileNav } from "./MobileNav"
import { SearchDialog } from "@/components/search/SearchDialog"

interface MainNavProps {
    session: Session | null
    siteName: string
}

export function MainNav({ session, siteName }: MainNavProps) {
    const pathname = usePathname()
    const [searchOpen, setSearchOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-sm">
                            <BookOpenIcon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent hidden sm:block">
                            {siteName}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {mainNavigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors hover:text-primary-600 ${pathname === item.href
                                        ? "text-primary-600"
                                        : "text-gray-600"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search Bar (Desktop) */}
                    <div className="hidden lg:block relative w-64">
                        <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <div onClick={() => setSearchOpen(true)}>
                            <Input
                                type="search"
                                placeholder="Search resources... (Ctrl+K)"
                                className="pl-9 h-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors cursor-pointer"
                                readOnly
                            />
                        </div>
                    </div>

                    {/* User Menu or Sign In */}
                    <div className="hidden md:flex items-center gap-4">
                        {session ? (
                            <UserNav session={session} />
                        ) : (
                            <Link href="/login">
                                <Button size="sm">Sign In</Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Nav Trigger */}
                    <MobileNav session={session} />
                </div>
            </div>

            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </header>
    )
}
