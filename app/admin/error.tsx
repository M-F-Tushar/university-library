'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Admin panel error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
                        <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Admin Panel Error
                    </h1>
                    <p className="text-gray-600 mb-6">
                        An error occurred in the admin panel. Please try again or contact support if the issue persists.
                    </p>

                    {process.env.NODE_ENV === 'development' && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                            <p className="text-xs font-mono text-gray-700 break-all">
                                {error.message}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={reset}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Try Again
                        </button>
                        <a
                            href="/admin/dashboard"
                            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
                        >
                            Go to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
