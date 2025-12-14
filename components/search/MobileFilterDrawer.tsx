"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/Sheet";
import { FilterSidebar } from "./FilterSidebar";

interface MobileFilterDrawerProps {
    facets?: {
        categories: string[];
        departments?: string[];
        semesters?: string[];
        formats?: string[];
    };
}

export function MobileFilterDrawer({ facets }: MobileFilterDrawerProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden flex items-center gap-2 w-full justify-center mb-4">
                    <Filter size={16} />
                    Filters & Categories
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto z-[150]">
                <SheetHeader>
                    <SheetTitle className="text-left">REFINE RESOURCES</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                    <FilterSidebar facets={facets} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
