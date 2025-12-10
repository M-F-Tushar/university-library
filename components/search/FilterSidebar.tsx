"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"

interface FilterSidebarProps {
    facets: {
        categories: string[]
        departments: string[]
        semesters: string[]
    }
}

export function FilterSidebar({ facets }: FilterSidebarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            if (params.get(key) === value) {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        } else {
            params.delete(key)
        }
        router.push(`/search?${params.toString()}`)
    }

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('category')
        params.delete('department')
        params.delete('semester')
        router.push(`/search?${params.toString()}`)
    }

    const FilterSection = ({ title, items, paramKey }: { title: string, items: string[], paramKey: string }) => (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <div className="space-y-2">
                {items.map((item) => {
                    const isSelected = searchParams.get(paramKey) === item
                    return (
                        <label key={item} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => updateFilter(paramKey, item)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span>{item}</span>
                        </label>
                    )
                })}
            </div>
        </div>
    )

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-bold font-display mb-4">Filters</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-900 -ml-2"
                >
                    Clear all
                </Button>
            </div>

            <FilterSection
                title="Categories"
                items={facets.categories}
                paramKey="category"
            />

            <div className="h-px bg-gray-200" />

            <FilterSection
                title="Departments"
                items={facets.departments}
                paramKey="department"
            />

            <div className="h-px bg-gray-200" />

            <FilterSection
                title="Semesters"
                items={facets.semesters}
                paramKey="semester"
            />
        </div>
    )
}
