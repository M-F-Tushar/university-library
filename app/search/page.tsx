import { searchResources, getSearchFacets } from "@/lib/search/actions"
import { FilterSidebar } from "@/components/search/FilterSidebar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { BookOpenIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline"

export const metadata = {
    title: 'Search Resources',
    description: 'Search and filter library resources',
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const params = await searchParams
    const query = params.q || ""
    const category = params.category
    const department = params.department
    const semester = params.semester

    const [searchResults, facets] = await Promise.all([
        searchResources({ query, category, department, semester }),
        getSearchFacets(),
    ])

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <FilterSidebar facets={facets} />
                </aside>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold font-display">
                            {query ? `Results for "${query}"` : "All Resources"}
                        </h1>
                        <span className="text-sm text-gray-500">
                            {searchResults.resources.length} results found
                        </span>
                    </div>

                    {searchResults.resources.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
                            <p className="text-gray-500 mt-2">
                                Try adjusting your filters or search query.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults.resources.map((resource) => (
                                <Card key={resource.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-700/10">
                                                    {resource.category}
                                                </span>
                                                <CardTitle className="text-lg line-clamp-2">
                                                    <Link href={`/resources/${resource.id}`} className="hover:text-primary-600 transition-colors">
                                                        {resource.title}
                                                    </Link>
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <CardDescription className="line-clamp-3 mb-4">
                                            {resource.description}
                                        </CardDescription>
                                        <div className="space-y-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="h-4 w-4" />
                                                <span className="truncate">{resource.author || "Unknown Author"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4" />
                                                <span>{resource.year || "Year N/A"}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t bg-gray-50/50 p-4">
                                        <div className="flex items-center justify-between w-full text-xs text-gray-500">
                                            <span>{resource.department}</span>
                                            <span>{resource.semester}</span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
