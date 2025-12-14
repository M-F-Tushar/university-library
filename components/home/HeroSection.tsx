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

            <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
                <div className="text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium border border-white/20">
                        <SparklesIcon className="h-4 w-4" />
                        <span>{badge}</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
                        <span className="block">{title1}</span>
                        <span className="block bg-gradient-to-r from-blue-200 to-violet-200 bg-clip-text text-transparent">
                            {title2}
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-100 leading-relaxed font-light">
                        {subtitle}
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link
                            href={cta1Link}
                            className="group relative inline-flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 px-8 py-4 text-base font-semibold text-blue-600 dark:text-blue-400 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
                        >
                            <BookOpenIcon className="mr-2 h-5 w-5" />
                            {cta1Text}
                            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
