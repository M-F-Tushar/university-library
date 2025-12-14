"use client";

import { Info, X, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function NoticeBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-primary-50 dark:bg-primary-900/20 border-b border-primary-100 dark:border-primary-800 relative">
            <div className="container mx-auto px-4 py-2 flex items-center justify-center text-xs sm:text-sm font-medium text-primary-800 dark:text-primary-200 gap-2 text-center pr-8">
                <Info className="h-4 w-4 shrink-0" />
                <span>
                    Mid-term exams for Spring 2024 start from October 15th. Check the <a href="/exam-schedule" className="underline hover:text-primary-600">schedule here</a>.
                </span>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-800/50"
            >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Dismiss</span>
            </button>
        </div>
    );
}
