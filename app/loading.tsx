export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            {/* Animated spinner */}
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
                <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            
            {/* Loading text */}
            <p className="text-gray-500 text-sm font-medium animate-pulse">
                Loading...
            </p>
        </div>
    )
}
