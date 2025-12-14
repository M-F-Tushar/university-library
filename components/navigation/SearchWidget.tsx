"use client";

import { useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

export function SearchWidget() {
    const [searchType, setSearchType] = useState<"catalog" | "site">("catalog");

    return (
        <div className="relative flex w-full max-w-2xl items-center">
            <div className="flex w-full items-center rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-primary-500/20">
                {/* Search Type Dropdown */}
                <div className="relative border-r border-gray-200 dark:border-gray-700">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50 dark:hover:text-white transition-colors rounded-l-lg outline-none">
                                {searchType === "catalog" ? "Catalog" : "Site"}
                                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40 z-[110]">
                            <DropdownMenuItem onClick={() => setSearchType("catalog")} className="flex items-center justify-between cursor-pointer">
                                <span>Catalog</span>
                                {searchType === "catalog" && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSearchType("site")} className="flex items-center justify-between cursor-pointer">
                                <span>Site</span>
                                {searchType === "site" && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Input */}
                <div className="flex-1 flex items-center px-4">
                    <Search className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder={searchType === "catalog" ? "Search books, resources, materials..." : "Search help, FAQs, staff..."}
                        className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
                    />
                </div>

                {/* Action Button */}
                <div className="p-1">
                    <Button size="sm" className="h-9 px-4 font-semibold shadow-none">
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
}
