interface StatsSectionProps {
    stats: {
        resourcesNum: string;
        resourcesLabel: string;
        studentsNum: string;
        studentsLabel: string;
        accessNum: string;
        accessLabel: string;
    };
}

export function StatsSection({ stats }: StatsSectionProps) {
    return (
        <div className="bg-white dark:bg-gray-900 py-12 border-b border-gray-100 dark:border-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
                    <div className="p-4">
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.resourcesNum}</div>
                        <div className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stats.resourcesLabel}</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl font-bold text-violet-600 dark:text-violet-400">{stats.studentsNum}</div>
                        <div className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stats.studentsLabel}</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">{stats.accessNum}</div>
                        <div className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stats.accessLabel}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
