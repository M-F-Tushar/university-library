import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"

interface MetricCardProps {
    title: string
    value: string | number
    change?: number
    icon: React.ComponentType<{ className?: string }>
    trend?: 'up' | 'down' | 'neutral'
}

export function MetricCard({ title, value, change, icon: Icon, trend = 'neutral' }: MetricCardProps) {
    const getTrendColor = () => {
        if (trend === 'up') return 'text-green-600'
        if (trend === 'down') return 'text-red-600'
        return 'text-gray-600'
    }

    const getTrendBg = () => {
        if (trend === 'up') return 'bg-green-50'
        if (trend === 'down') return 'bg-red-50'
        return 'bg-gray-50'
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor()}`}>
                            {trend === 'up' && <ArrowUpIcon className="h-4 w-4" />}
                            {trend === 'down' && <ArrowDownIcon className="h-4 w-4" />}
                            <span className="font-medium">
                                {change > 0 ? '+' : ''}{change.toFixed(1)}%
                            </span>
                            <span className="text-gray-500">vs last 30 days</span>
                        </div>
                    )}
                </div>
                <div className={`h-12 w-12 rounded-xl ${getTrendBg()} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${getTrendColor()}`} />
                </div>
            </div>
        </div>
    )
}
