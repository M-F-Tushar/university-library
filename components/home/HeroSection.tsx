import Link from 'next/link';
import { BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface HeroSectionProps {
    title1: string;
    title2: string;
    subtitle: string;
    badge: string;
    cta1Text: string;
    cta1Link: string;
    cta2Text: string;
    cta2Link: string;
}

export function HeroSection({
    title1,
    title2,
    subtitle,
    badge,
    cta1Text,
    cta1Link,
}: HeroSectionProps) {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 dark:from-blue-900 dark:via-violet-900 dark:to-purple-950 text-white">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium border border-white/20">
                        <SparklesIcon className="h-4 w-4" />
                        <span>{badge}</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
                        <span className="block">{title1}</span>
                        <span className="block bg-gradient-to-r from-blue-200 to-violet-200 bg-clip-text text-transparent">
                            {title2}
                        </span>
                    </h1>
                    <p className="mx-auto mb-10 text-lg sm:text-xl text-blue-100 leading-relaxed font-light">
                        {subtitle}
                    </p>

                    {/* Hero Search Bar */}
                    <div className="max-w-xl mx-auto mb-8 bg-white p-2 rounded-2xl shadow-2xl flex items-center p-2 focus-within:ring-4 focus-within:ring-blue-400/50 transition-all transform hover:scale-[1.01]">
                        <input
                            type="text"
                            placeholder="Search for books, notes, or past questions..."
                            className="flex-1 w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none text-base sm:text-lg"
                        />
                        <Link href="/resources">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2">
                                <BookOpenIcon className="h-5 w-5" />
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </Link>
                    </div>

                    <div className="flex justify-center gap-6 text-sm font-medium opacity-80">
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> 10k+ Resources</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Updated Daily</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Verified Content</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
