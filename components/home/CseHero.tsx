"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CseHero() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/resources?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-16 pb-24 lg:pt-24 lg:pb-32">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />

            <div className="container relative mx-auto px-4 text-center">
                <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-800 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300 mb-8">
                    ✨ New: Collaborative Notes for CSE-320
                </div>

                <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl dark:text-white mb-6">
                    CSE Digital Library
                </h1>

                <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300 mb-10">
                    Access 5000+ resources including past questions, lecture notes, lab manuals, and project reports. Curated for Computer Science students.
                </p>

                {/* Search Box */}
                <div className="mx-auto max-w-2xl relative mb-8">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by course (e.g., CSE-220), topic, or keyword..."
                                className="h-14 w-full rounded-2xl border-2 border-gray-200 bg-white pl-12 pr-4 text-lg shadow-lg shadow-gray-200/50 outline-none transition-all placeholder:text-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none dark:text-white"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="absolute right-2">
                                <Button type="submit" size="lg" className="rounded-xl px-6">
                                    Search
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Quick Tags */}
                    <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                        <span>Popular:</span>
                        <button onClick={() => router.push('/resources?q=CSE-220')} className="hover:text-primary-600 underline decoration-dotted">CSE-220</button>
                        <button onClick={() => router.push('/resources?q=Data+Structures')} className="hover:text-primary-600 underline decoration-dotted">Data Structures</button>
                        <button onClick={() => router.push('/resources?q=Mid+Term+2023')} className="hover:text-primary-600 underline decoration-dotted">Mid Term 2023</button>
                    </div>
                </div>

                {/* Main Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        variant="secondary"
                        size="lg"
                        className="w-full sm:w-auto min-w-[160px] h-12 text-base font-semibold"
                        onClick={() => router.push('/courses')}
                    >
                        Browse Courses
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto min-w-[160px] h-12 text-base font-semibold bg-white dark:bg-transparent"
                        onClick={() => router.push('/resources?type=Past+Question')}
                    >
                        Past Questions
                    </Button>
                </div>
            </div>
        </section>
    );
}
