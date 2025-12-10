import { ClockIcon, BookOpenIcon, BookmarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface ActivityFeedProps {
    activities: Array<{
        id: string
        action: string
        createdAt: Date
        resource: {
            id: string
            title: string
        } | null
    }>
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
    const getIcon = (action: string) => {
        switch (action) {
            case 'view': return <BookOpenIcon className="h-4 w-4" />
            case 'bookmark': return <BookmarkIcon className="h-4 w-4" />
            case 'download': return <ArrowDownTrayIcon className="h-4 w-4" />
            default: return <ClockIcon className="h-4 w-4" />
        }
    }

    const getMessage = (action: string) => {
        switch (action) {
            case 'view': return 'Viewed'
            case 'bookmark': return 'Bookmarked'
            case 'download': return 'Downloaded'
            default: return 'Interacted with'
        }
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 text-sm">
                No recent activity. Start exploring!
            </div>
        )
    }

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {activities.map((activity, activityIdx) => (
                    <li key={activity.id}>
                        <div className="relative pb-8">
                            {activityIdx !== activities.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white text-gray-500">
                                        {getIcon(activity.action)}
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {getMessage(activity.action)}{' '}
                                            {activity.resource && (
                                                <Link href={`/resources/${activity.resource.id}`} className="font-medium text-gray-900 hover:text-primary-600">
                                                    {activity.resource.title}
                                                </Link>
                                            )}
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                        <time dateTime={activity.createdAt.toISOString()}>
                                            {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                                        </time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
