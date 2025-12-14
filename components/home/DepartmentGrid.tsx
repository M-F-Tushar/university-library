"use client";

import Link from "next/link";
import { Code, Beaker, BookOpen, Calculator, PenTool, Globe } from "lucide-react";

const DEPARTMENTS = [
    {
        id: "cs",
        name: "Computer Science",
        icon: Code,
        color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        hoverBorder: "hover:border-blue-500",
        count: 240
    },
    {
        id: "eng",
        name: "Engineering",
        icon: PenTool,
        color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
        hoverBorder: "hover:border-orange-500",
        count: 185
    },
    {
        id: "sci",
        name: "Science",
        icon: Beaker,
        color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
        hoverBorder: "hover:border-green-500",
        count: 312
    },
    {
        id: "arts",
        name: "Liberal Arts",
        icon: BookOpen,
        color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
        hoverBorder: "hover:border-purple-500",
        count: 156
    },
    {
        id: "math",
        name: "Mathematics",
        icon: Calculator,
        color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        hoverBorder: "hover:border-red-500",
        count: 98
    },
    {
        id: "bus",
        name: "Business",
        icon: Globe,
        color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
        hoverBorder: "hover:border-indigo-500",
        count: 142
    }
];

export function DepartmentGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {DEPARTMENTS.map((dept) => (
                <Link
                    key={dept.id}
                    href={`/resources?department=${dept.id}`}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border border-transparent bg-white shadow-sm transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1 ${dept.hoverBorder} dark:bg-gray-800 dark:border-gray-700`}
                >
                    <div className={`p-3 rounded-full mb-3 ${dept.color}`}>
                        <dept.icon size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm text-center mb-1 dark:text-white">{dept.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{dept.count} Resources</span>
                </Link>
            ))}
        </div>
    );
}
