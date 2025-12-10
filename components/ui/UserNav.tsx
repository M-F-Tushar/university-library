"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Session } from "next-auth"
import { handleSignOut } from "@/app/lib/auth-actions"
import { UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"

interface UserNavProps {
    session: Session
}

export function UserNav({ session }: UserNavProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const user = session.user

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.name}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-4 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <div className="p-1">
                        {user.role === "ADMIN" && (
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                onClick={() => setIsOpen(false)}
                            >
                                <Cog6ToothIcon className="h-4 w-4" />
                                Admin Dashboard
                            </Link>
                        )}
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                            onClick={() => setIsOpen(false)}
                        >
                            <UserCircleIcon className="h-4 w-4" />
                            Profile
                        </Link>
                    </div>

                    <div className="p-1 border-t border-gray-100">
                        <button
                            onClick={() => handleSignOut()}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                        >
                            <ArrowRightOnRectangleIcon className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
