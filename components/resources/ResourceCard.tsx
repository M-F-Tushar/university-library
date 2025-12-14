"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileText, Download, Star, Bookmark, MoreVertical, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface ResourceCardProps {
    // Update interface at the top
    resource: {
        id: string;
        title: string;
        description: string;
        type: string;
        author?: string | null;
        department: string;
        course?: string | null; // Added
        semester?: string | null; // Added
        createdAt: Date;
        rating?: number;
        downloads?: number;
        fileSize?: string | null;
        format?: string | null;
    };
    variant?: "grid" | "list";
}

export function ResourceCard({ resource, variant = "grid" }: ResourceCardProps) {
    // Helper to determine badge color based on course level (simple hash or logic)
    const getLevelColor = (code: string) => {
        if (code.includes("1")) return "bg-blue-50 text-blue-700 border-blue-200";
        if (code.includes("2")) return "bg-teal-50 text-teal-700 border-teal-200";
        if (code.includes("3")) return "bg-purple-50 text-purple-700 border-purple-200";
        return "bg-orange-50 text-orange-700 border-orange-200";
    };

    if (variant === "list") {
        return (
            <div className="group flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Thumbnail (Smaller) */}
                <div className="w-48 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center border-r border-gray-100 dark:border-gray-700 relative shrink-0">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm relative z-10">
                        <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    {/* Course Badge (Overlay) */}
                    <div className="absolute top-2 left-2 z-20">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getLevelColor(resource.department)}`}>
                            {resource.department}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                {resource.semester && (
                                    <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                                        {resource.semester} Sem
                                    </span>
                                )}
                                <span className="inline-flex items-center rounded-md bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300 ring-1 ring-inset ring-primary-700/10">
                                    {resource.type}
                                </span>
                            </div>
                            <Link href={`/resources/${resource.id}`}>
                                <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-lg">
                                    {resource.title}
                                </h3>
                            </Link>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><Bookmark className="mr-2 h-4 w-4" /> Save</DropdownMenuItem>
                                <DropdownMenuItem>Share</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Report</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 mb-3 flex-1">
                        {resource.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                        <div className="flex items-center gap-4">
                            {resource.author && <span className="text-gray-500 dark:text-gray-400">by {resource.author}</span>}
                            <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {resource.downloads || 0}</span>
                            <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400 fill-amber-400" /> {resource.rating ? resource.rating.toFixed(1) : "New"}</span>
                            <span>{formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}</span>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/resources/${resource.id}`}>
                                <Button variant="secondary" size="sm" className="h-8 text-xs">View Details</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-card-hover transition-all duration-200 overflow-hidden">
            {/* Card Header / Thumbnail Placeholder */}
            <div className="h-32 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center border-b border-gray-100 dark:border-gray-700 relative">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                    <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>

                {/* Type Badge */}
                <span className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 z-10">
                    {resource.type || "Resource"}
                </span>

                {/* Format Badge */}
                {resource.format && (
                    <span className="absolute top-3 right-3 bg-gray-900/10 dark:bg-white/10 px-2 py-0.5 rounded text-xs font-bold uppercase text-gray-700 dark:text-gray-300 z-10">
                        {resource.format}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div className="w-full">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getLevelColor(resource.department)}`}>
                                {resource.department}
                            </span>
                            {resource.semester && (
                                <span className="text-[10px] text-gray-500 font-medium bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                    {resource.semester}
                                </span>
                            )}
                        </div>
                        <Link href={`/resources/${resource.id}`}>
                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors h-11 leading-snug">
                                {resource.title}
                            </h3>
                        </Link>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 -mr-2">
                                <MoreVertical className="h-4 w-4 text-gray-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Bookmark className="mr-2 h-4 w-4" /> Save
                            </DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Report</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                    {resource.description}
                </p>

                {/* Footer info */}
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3 mt-auto">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" /> {resource.downloads || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> {resource.rating ? resource.rating.toFixed(1) : "New"}
                        </span>
                    </div>
                    <span>{formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}</span>
                </div>
            </div>

            {/* Quick Action Footer */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                <Link href={`/resources/${resource.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" fullWidth className="h-8 text-xs">
                        View Details
                    </Button>
                </Link>
                <Button size="sm" variant="ghost" className="h-8 px-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                    <Download className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
