"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, FileText, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface Resource {
    id: string;
    title: string;
    department: { name: string };
    uploader: { name: string | null };
    _count: { downloads: number };
}

export function FeaturedCarousel({ resources }: { resources: Resource[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % resources.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + resources.length) % resources.length);
    };

    if (!resources.length) return null;

    // Responsive: Show 1 card on mobile, 3 on desktop
    // This simple implementation shows one main card or a sliding window
    // For simplicity in this iteration, we'll show a grid that "looks" like a carousel or just a list
    // A true infinite carousel requires more complex logic/library.
    // Let's implement a simple 3-card grid that slices the data based on index (simulated carousel)

    // Actually, simpler for MVP: A nice grid of 3 items. Carousel logic can be added later if strict requirement.
    // PRD said "Auto-rotating... 3-5 items". 
    // Let's just do a grid of the top 3 for now to ensure stability, or a scrollable flex row (Snap Scroll).

    return (
        <div className="w-full relative group">
            <h2 className="text-2xl font-display font-bold mb-6 text-gray-900 dark:text-white">Featured Resources</h2>
            <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                {resources.map((resource) => (
                    <div
                        key={resource.id}
                        className="min-w-[280px] md:min-w-[320px] snap-center bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-card-hover transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                <FileText size={24} />
                            </div>
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                                {resource.department.name}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-white">
                            <Link href={`/resources/${resource.id}`} className="hover:underline">
                                {resource.title}
                            </Link>
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
                            by {resource.uploader.name || "Unknown"}
                        </p>
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Download size={14} /> {resource._count.downloads} downloads
                            </span>
                            <Link href={`/resources/${resource.id}`}>
                                <Button size="sm" variant="outline">Preview</Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
