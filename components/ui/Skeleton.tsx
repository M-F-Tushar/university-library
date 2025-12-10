import * as React from 'react'
import { cn } from './Button'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Animation type */
    animation?: 'pulse' | 'shimmer' | 'none'
}

function Skeleton({
    className,
    animation = 'pulse',
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(
                'rounded-md bg-gray-200',
                animation === 'pulse' && 'animate-pulse',
                animation === 'shimmer' && 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',
                className
            )}
            {...props}
        />
    )
}

// Common skeleton patterns
function SkeletonText({
    lines = 3,
    className,
    ...props
}: { lines?: number } & SkeletonProps) {
    return (
        <div className={cn('space-y-2', className)} {...props}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        'h-4',
                        i === lines - 1 ? 'w-4/5' : 'w-full'
                    )}
                />
            ))}
        </div>
    )
}

function SkeletonCard({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                'rounded-lg border border-gray-200 p-4',
                className
            )}
            {...props}
        >
            <Skeleton className="mb-4 h-48 w-full" />
            <Skeleton className="mb-2 h-4 w-3/4" />
            <Skeleton className="mb-4 h-4 w-1/2" />
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
            </div>
        </div>
    )
}

function SkeletonTable({
    rows = 5,
    columns = 4,
    className,
    ...props
}: { rows?: number; columns?: number } & SkeletonProps) {
    return (
        <div className={cn('w-full', className)} {...props}>
            {/* Header */}
            <div className="mb-4 flex gap-4 border-b border-gray-200 pb-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {/* Rows */}
            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex gap-4">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <Skeleton key={colIndex} className="h-4 flex-1" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

function SkeletonList({
    items = 5,
    showAvatar = true,
    className,
    ...props
}: { items?: number; showAvatar?: boolean } & SkeletonProps) {
    return (
        <div className={cn('space-y-4', className)} {...props}>
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    {showAvatar && (
                        <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
                    )}
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

function SkeletonAvatar({
    size = 'md',
    className,
    ...props
}: { size?: 'sm' | 'md' | 'lg' | 'xl' } & SkeletonProps) {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    }

    return (
        <Skeleton
            className={cn('rounded-full', sizeClasses[size], className)}
            {...props}
        />
    )
}

function SkeletonButton({
    size = 'md',
    className,
    ...props
}: { size?: 'sm' | 'md' | 'lg' } & SkeletonProps) {
    const sizeClasses = {
        sm: 'h-8 w-20',
        md: 'h-10 w-24',
        lg: 'h-12 w-32',
    }

    return (
        <Skeleton
            className={cn('rounded-md', sizeClasses[size], className)}
            {...props}
        />
    )
}

function SkeletonInput({ className, ...props }: SkeletonProps) {
    return (
        <div className={cn('space-y-2', className)} {...props}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
        </div>
    )
}

// Page-level skeleton patterns
function SkeletonPage({ className, ...props }: SkeletonProps) {
    return (
        <div className={cn('space-y-6', className)} {...props}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            {/* Content */}
            <div className="grid gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    )
}

function SkeletonDashboard({ className, ...props }: SkeletonProps) {
    return (
        <div className={cn('space-y-6', className)} {...props}>
            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-lg border border-gray-200 p-4"
                    >
                        <Skeleton className="mb-2 h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                ))}
            </div>
            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4">
                    <Skeleton className="mb-4 h-6 w-32" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                    <Skeleton className="mb-4 h-6 w-32" />
                    <SkeletonList items={5} showAvatar={false} />
                </div>
            </div>
        </div>
    )
}

export {
    Skeleton,
    SkeletonText,
    SkeletonCard,
    SkeletonTable,
    SkeletonList,
    SkeletonAvatar,
    SkeletonButton,
    SkeletonInput,
    SkeletonPage,
    SkeletonDashboard,
}
