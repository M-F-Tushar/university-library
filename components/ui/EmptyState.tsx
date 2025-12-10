import * as React from 'react'
import { cn } from './Button'
import { Button } from './Button'

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
        variant?: 'primary' | 'secondary' | 'ghost'
    }
    secondaryAction?: {
        label: string
        onClick: () => void
    }
    size?: 'sm' | 'md' | 'lg'
}

function EmptyState({
    icon,
    title,
    description,
    action,
    secondaryAction,
    size = 'md',
    className,
    ...props
}: EmptyStateProps) {
    const sizeClasses = {
        sm: {
            container: 'py-8',
            icon: 'h-10 w-10',
            title: 'text-base',
            description: 'text-sm',
        },
        md: {
            container: 'py-12',
            icon: 'h-12 w-12',
            title: 'text-lg',
            description: 'text-sm',
        },
        lg: {
            container: 'py-16',
            icon: 'h-16 w-16',
            title: 'text-xl',
            description: 'text-base',
        },
    }

    const styles = sizeClasses[size]

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center text-center',
                styles.container,
                className
            )}
            {...props}
        >
            {icon && (
                <div className={cn('mb-4 text-gray-400', styles.icon)}>
                    {icon}
                </div>
            )}
            <h3 className={cn('font-medium text-gray-900', styles.title)}>
                {title}
            </h3>
            {description && (
                <p className={cn('mt-1 max-w-sm text-gray-500', styles.description)}>
                    {description}
                </p>
            )}
            {(action || secondaryAction) && (
                <div className="mt-6 flex items-center gap-3">
                    {action && (
                        <Button
                            variant={action.variant || 'primary'}
                            onClick={action.onClick}
                        >
                            {action.label}
                        </Button>
                    )}
                    {secondaryAction && (
                        <Button
                            variant="ghost"
                            onClick={secondaryAction.onClick}
                        >
                            {secondaryAction.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

// Specific empty states for common use cases
interface NoResultsProps extends Omit<EmptyStateProps, 'title'> {
    searchQuery?: string
}

function NoResults({ searchQuery, ...props }: NoResultsProps) {
    return (
        <EmptyState
            icon={
                <svg
                    className="h-full w-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            }
            title={searchQuery ? `No results for "${searchQuery}"` : 'No results found'}
            description="Try adjusting your search or filters to find what you're looking for."
            {...props}
        />
    )
}

function NoData(props: Omit<EmptyStateProps, 'title'>) {
    return (
        <EmptyState
            icon={
                <svg
                    className="h-full w-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
            }
            title="No data yet"
            description="Get started by adding your first item."
            {...props}
        />
    )
}

function ErrorState(props: Omit<EmptyStateProps, 'title'>) {
    return (
        <EmptyState
            icon={
                <svg
                    className="h-full w-full text-error"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            }
            title="Something went wrong"
            description="An error occurred while loading the data. Please try again."
            {...props}
        />
    )
}

export { EmptyState, NoResults, NoData, ErrorState }
