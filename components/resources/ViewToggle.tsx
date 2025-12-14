"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";

export function ViewToggle() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view") || "grid";

    const setView = (view: "grid" | "list") => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("view", view);
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-md transition-all ${currentView === "grid"
                        ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                title="Grid View"
            >
                <LayoutGrid size={18} />
            </button>
            <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-md transition-all ${currentView === "list"
                        ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                title="List View"
            >
                <List size={18} />
            </button>
        </div>
    );
}
