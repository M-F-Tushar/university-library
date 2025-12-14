"use client";

import { FileText, Clock, PenTool, BookOpen } from "lucide-react";
import Link from "next/link";

const shortcuts = [
    {
        title: "Mid Term Papers",
        desc: "Prepare for upcoming exams",
        href: "/resources?type=Past+Question&exam=Mid",
        icon: FileText,
        color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
        title: "Final Papers",
        desc: "Previous year finals",
        href: "/resources?type=Past+Question&exam=Final",
        icon: Clock,
        color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
    },
    {
        title: "Lab Manuals",
        desc: "Experiments & code",
        href: "/resources?type=Lab",
        icon: PenTool,
        color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
        title: "Reference Books",
        desc: "Core textbooks PDF",
        href: "/resources?type=Book",
        icon: BookOpen,
        color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
    }
];

export function ExamShortcuts() {
    return (
        <section className="py-8 bg-gray-50 dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Exam Ready</h2>
                    <Link href="/resources" className="text-sm font-medium text-primary-600 hover:underline">View all resources</Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {shortcuts.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="flex flex-col p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all group"
                        >
                            <div className={`h-10 w-10 rounded-lg ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                <item.icon className="h-5 w-5" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.desc}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
