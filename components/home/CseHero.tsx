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
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 pt-20 pb-32 lg:pt-32 lg:pb-40 text-white">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-10"></div>
                <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-blue-500/20 blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-purple-500/20 blur-[100px] animate-pulse delay-700"></div>
            </div>

            <div className="container relative mx-auto px-4 text-center z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-sm font-medium text-blue-100 mb-8 mx-auto hover:bg-white/20 transition-colors cursor-default">
                    <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                    <span>CSE Digital Library</span>
                </div>

                {/* Hero Title */}
                <h1 className="mx-auto max-w-5xl font-display text-5xl font-bold tracking-tight sm:text-7xl mb-8 leading-tight">
                    <span className="block text-white">Your Academic</span>
                    <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Knowledge Hub
                    </span>
                </h1>

                {/* Description */}
                <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-300 mb-12 leading-relaxed">
                    Access over <span className="text-white font-semibold">5,000+</span> curated resources including past questions,
                    lecture notes, and project reports designed for Computer Science students.
                </p>

                {/* Search Box */}
                <div className="mx-auto max-w-2xl relative mb-12 group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <form onSubmit={handleSearch} className="relative">
                        <div className="relative flex items-center bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2 shadow-2xl">
                            <Search className="absolute left-6 h-6 w-6 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses (e.g., CSE-220), topics..."
                                className="h-14 w-full bg-transparent pl-14 pr-4 text-lg text-white placeholder:text-gray-400 outline-none border-none focus:ring-0"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="absolute right-2">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="rounded-xl px-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20 border-none h-12"
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Quick Tags */}
                    <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
                        <span className="text-gray-400">Trending:</span>
                        {[
                            { label: 'CSE-220', query: 'CSE-220' },
                            { label: 'Data Structures', query: 'Data Structures' },
                            { label: 'Calculus', query: 'MAT-120' },
                            { label: 'Physics', query: 'PHY-101' }
                        ].map((tag) => (
                            <button
                                key={tag.label}
                                onClick={() => router.push(`/resources?q=${tag.query}`)}
                                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all text-xs sm:text-sm"
                            >
                                {tag.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-backwards delay-200">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto min-w-[180px] h-14 text-base font-semibold bg-white text-slate-900 hover:bg-gray-100 border-none shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                        onClick={() => router.push('/courses')}
                    >
                        Browse Courses
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto min-w-[180px] h-14 text-base font-semibold bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                        onClick={() => router.push('/resources?type=Past+Question')}
                    >
                        Past Questions Only
                    </Button>
                </div>

                {/* Stats */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-white/10 pt-10">
                    {[
                        { label: 'Resources', value: '5K+' },
                        { label: 'Courses', value: '45+' },
                        { label: 'Users', value: '1.2K' },
                        { label: 'Contributors', value: '50+' },
                    ].map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center">
                            <span className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                {stat.value}
                            </span>
                            <span className="text-sm text-gray-400 uppercase tracking-wider font-medium">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
