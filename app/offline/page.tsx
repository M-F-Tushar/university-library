'use client';

import { WifiIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function OfflinePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-gray-100 p-4 rounded-full mb-6">
                <WifiIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-2">You're Offline</h1>
            <p className="text-gray-500 mb-8 max-w-md">
                It seems you've lost your internet connection. Check your network settings and try again.
            </p>
            <Button onClick={() => window.location.reload()}>
                Try Again
            </Button>
        </div>
    )
}
