"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

const popularCourses = [
    { code: "CSE-110", name: "Programming Fundamentals", count: 450, level: "100" },
    { code: "CSE-111", name: "Object Oriented Programming", count: 320, level: "100" },
    { code: "CSE-220", name: "Data Structures", count: 512, level: "200" },
    { code: "CSE-221", name: "Algorithms", count: 480, level: "200" },
    { code: "CSE-320", name: "Data Communications", count: 210, level: "300" },
    { code: "CSE-321", name: "Operating Systems", count: 305, level: "300" },
    { code: "CSE-370", name: "Database Systems", count: 410, level: "300" },
    { code: "CSE-420", name: "Compiler Design", count: 180, level: "400" },
];

export function CourseQuickGrid() {
    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Popular Courses</h2>
                        <p className="text-gray-500 dark:text-gray-400">Most accessed course materials this semester</p>
                    </div>
                    <Link href="/courses" className="hidden sm:flex items-center text-primary-600 font-medium hover:underline">
                        View all courses <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {popularCourses.map((course) => (
                        <Link
                            key={course.code}
                            href={`/resources?q=${course.code}`}
                            className="group relative p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none hover:border-primary-100 dark:hover:border-primary-800 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700
                                    ${course.level === "100" ? "text-blue-600" :
                                        course.level === "200" ? "text-teal-600" :
                                            course.level === "300" ? "text-purple-600" : "text-orange-600"}`
                                }>
                                    {course.code}
                                </span>
                                <span className="text-xs text-gray-400">{course.count} items</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                                {course.name}
                            </h3>
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                <ChevronRight className="text-primary-600 w-5 h-5" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link href="/courses" className="inline-flex items-center text-primary-600 font-medium">
                        View all courses <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
