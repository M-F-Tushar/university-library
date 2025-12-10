'use client'

import { useEffect } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { logger } from '@/lib/monitoring/logger'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        logger.error('Next.js Error Page', error, {
            digest: error.digest,
        })
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                        <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Oops! Something went wrong
                </h1>
                <p className="text-gray-600 mb-6">
                    We encountered an unexpected error. Don't worry, our team has been notified.
                </p>
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                        <p className="text-sm font-semibold text-red-900 mb-1">Error Details:</p>
                        <p className="text-sm font-mono text-red-800 break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-red-600 mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}
                <div className="flex gap-3 justify-center">
                    <Button onClick={reset}>
                        Try Again
                    </Button>
                    <Button variant="secondary" onClick={() => window.location.href = '/'}>
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    )
}
