"use client";

import { useState } from "react";
import { Filter, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-100 dark:border-gray-700 py-4 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 dark:text-white mb-2"
            >
                {title}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isOpen && <div className="mt-2 space-y-2">{children}</div>}
        </div>
    );
}

import { useRouter, useSearchParams } from "next/navigation";

interface FilterSidebarProps {
    facets?: {
        categories: string[];
        departments?: string[];
        semesters?: string[];
        formats?: string[];
    };
}

export function FilterSidebar({ facets }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateFilter = (key: string, value: string | null, isMultiSelect: boolean = false) => {
        const params = new URLSearchParams(searchParams.toString());

        if (isMultiSelect && value) {
            const currentValues = params.getAll(key);
            if (currentValues.includes(value)) {
                // Remove the value
                const newValues = currentValues.filter(v => v !== value);
                params.delete(key);
                newValues.forEach(v => params.append(key, v));
            } else {
                // Add the value
                params.append(key, value);
            }
        } else {
            // Single select behavior
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        }

        params.delete("page"); // Reset to page 1 on filter change
        router.push(`/resources?${params.toString()}`);
    };

    const currentDepartment = searchParams.get("department");
    const currentCategories = searchParams.getAll("category"); // Get all categories
    const currentSemester = searchParams.get("semester");
    const currentFormat = searchParams.get("format");
    const currentDate = searchParams.get("date");

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Filter size={18} /> Filters
                </h3>
                <button
                    onClick={() => router.push("/resources")}
                    className="text-xs text-primary-600 hover:underline"
                >
                    Clear all
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 space-y-1">
                <FilterSection title="Department">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                            <input
                                type="radio"
                                name="department"
                                checked={!currentDepartment}
                                onChange={() => updateFilter("department", null)}
                                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            All Departments
                        </label>
                        {facets?.departments?.map((dept) => (
                            <label key={dept} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                                <input
                                    type="radio"
                                    name="department"
                                    checked={currentDepartment === dept}
                                    onChange={() => updateFilter("department", dept)}
                                    className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                {dept}
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Category" defaultOpen={true}>
                    <div className="space-y-2">
                        {/* Multi-select for Categories */}
                        {facets?.categories.map((cat) => (
                            <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="category"
                                    checked={currentCategories.includes(cat)}
                                    onChange={() => updateFilter("category", cat, true)}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                {cat}
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Semester">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                            <input
                                type="radio"
                                name="semester"
                                checked={!currentSemester}
                                onChange={() => updateFilter("semester", null)}
                                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            All Semesters
                        </label>
                        {facets?.semesters?.map((sem) => (
                            <label key={sem} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                                <input
                                    type="radio"
                                    name="semester"
                                    checked={currentSemester === sem}
                                    onChange={() => updateFilter("semester", sem)}
                                    className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                {sem} Sem
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Level">
                    <div className="space-y-2">
                        {/* Hardcoded Levels for now, ideally dynamic */}
                        {["100 Level", "200 Level", "300 Level", "400 Level"].map((level) => (
                            <label key={level} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                                <input
                                    type="checkbox" // Checkbox for multi-select logic later, staying simple radio for URL param for now
                                    name="level"
                                    checked={searchParams.get("level") === level}
                                    onChange={() => updateFilter("level", searchParams.get("level") === level ? null : level)}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                {level}
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Session">
                    <div className="space-y-2">
                        {["Spring 2024", "Fall 2023", "Spring 2023"].map((session) => (
                            <label key={session} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                                <input
                                    type="radio"
                                    name="session"
                                    checked={searchParams.get("session") === session}
                                    onChange={() => updateFilter("session", session)}
                                    className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                {session}
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Format">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                            <input
                                type="radio"
                                name="format"
                                checked={!currentFormat}
                                onChange={() => updateFilter("format", null)}
                                className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            All Formats
                        </label>
                        {facets?.formats?.map((fmt) => (
                            <label key={fmt} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                                <input
                                    type="radio"
                                    name="format"
                                    checked={currentFormat === fmt}
                                    onChange={() => updateFilter("format", fmt)}
                                    className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                {fmt}
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Date Added" defaultOpen={false}>
                    <div className="space-y-2">
                        {["Any time", "Past week", "Past month", "Past year"].map((type) => (
                            <label key={type} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                                <input
                                    type="radio"
                                    name="date"
                                    checked={currentDate === type || (!currentDate && type === "Any time")}
                                    onChange={() => updateFilter("date", type === "Any time" ? null : type)}
                                    className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </FilterSection>
            </div>

            <div className="mt-4">
                <Button fullWidth onClick={() => router.push("/resources")}>Reset Filters</Button>
            </div>
        </div>
    );
}
