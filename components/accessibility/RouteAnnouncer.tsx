"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function RouteAnnouncer() {
    const pathname = usePathname()
    const [announcement, setAnnouncement] = useState("")

    useEffect(() => {
        // Small delay to allow title to update if needed, 
        // though for now we'll just announce the path or a generic message
        // In a real app, you might want to grab document.title
        const title = document.title || "University Digital Library"
        setAnnouncement(`Navigated to ${title}`)
    }, [pathname])

    return (
        <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
        >
            {announcement}
        </div>
    )
}
