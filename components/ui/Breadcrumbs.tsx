"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline"

export function Breadcrumbs() {
    const pathname = usePathname()

    // Don't show breadcrumbs on home page
    if (pathname === "/") return null

    const paths = pathname.split("/").filter(Boolean)

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
                <li>
                    <Link
                        href="/"
                        className="flex items-center hover:text-primary-600 transition-colors"
                    >
                        <HomeIcon className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>

                {paths.map((path, index) => {
                    const href = `/${paths.slice(0, index + 1).join("/")}`
                    const isLast = index === paths.length - 1
                    const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")

                    return (
                        <li key={path} className="flex items-center gap-2">
                            <ChevronRightIcon className="h-3 w-3 text-gray-400" />
                            {isLast ? (
                                <span className="font-medium text-gray-900" aria-current="page">
                                    {label}
                                </span>
                            ) : (
                                <Link
                                    href={href}
                                    className="hover:text-primary-600 transition-colors"
                                >
                                    {label}
                                </Link>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
