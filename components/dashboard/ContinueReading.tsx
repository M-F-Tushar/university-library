import Link from "next/link"
import { Card, CardContent } from "@/components/ui/Card"

interface ContinueReadingProps {
    items: Array<{
        id: string
        resourceId: string
        currentPage: number
        totalPages: number | null
        percentComplete: number
        resource: {
            id: string
            title: string
        }
    }>
}

export function ContinueReading({ items }: ContinueReadingProps) {
    if (items.length === 0) {
        return null
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
                <Link key={item.id} href={`/resources/${item.resourceId}`}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 truncate mb-1">
                                {item.resource.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">
                                Page {item.currentPage} {item.totalPages ? `of ${item.totalPages}` : ''}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${item.percentComplete}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
