export default function DashboardLoading() {
    return (
        <div className="p-6">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
                ))}
            </div>
        </div>
    );
}
