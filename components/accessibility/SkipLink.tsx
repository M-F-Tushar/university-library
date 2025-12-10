import Link from "next/link"

export function SkipLink() {
    return (
        <Link
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-white focus:text-primary-600 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
        >
            Skip to main content
        </Link>
    )
}
