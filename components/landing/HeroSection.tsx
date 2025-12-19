'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white dark:bg-black pt-16 pb-32 lg:pt-32 lg:pb-40">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container relative z-10 px-4 mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
                >
                    <span className="relative flex w-2 h-2">
                        <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-blue-400"></span>
                        <span className="relative inline-flex w-2 h-2 rounded-full bg-blue-500"></span>
                    </span>
                    <span className="text-sm font-semibold tracking-wide uppercase">Student Community Portal</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6 text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 sm:text-6xl md:text-7xl lg:text-8xl font-display"
                >
                    CSTU Computer Science<br className="hidden sm:block" /> & Engineering
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-2xl mx-auto mb-10 text-lg text-gray-600 dark:text-gray-300 sm:text-xl md:text-2xl"
                >
                    Built by students, for students. The unofficial central hub for resources, curriculum tracking, and peer collaboration at CSTU.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        href="/courses"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1"
                    >
                        Explore Curriculum
                        <ArrowRightIcon className="w-5 h-5 ml-2 -mr-1" />
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-1"
                    >
                        <AcademicCapIcon className="w-5 h-5 mr-2 -ml-1 text-gray-500 dark:text-gray-400" />
                        My Student Dashboard
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
