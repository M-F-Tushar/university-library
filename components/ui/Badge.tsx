import * as React from 'react'
import { cn } from './Button'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    dot?: boolean
    removable?: boolean
    onRemove?: () => void
}

function Badge({
    variant = 'default',
    size = 'md',
    dot = false,
    removable = false,
    onRemove,
    className,
    children,
    ...props
}: BadgeProps) {
    const variantClasses = {
        default: 'bg-primary/10 text-primary border-primary/20',
        secondary: 'bg-gray-100 text-gray-700 border-gray-200',
        success: 'bg-success/10 text-success border-success/20',
        warning: 'bg-warning/10 text-warning border-warning/20',
        error: 'bg-error/10 text-error border-error/20',
        info: 'bg-info/10 text-info border-info/20',
        outline: 'bg-transparent text-gray-700 border-gray-300',
    }

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
    }

    const dotColors = {
        default: 'bg-primary',
        secondary: 'bg-gray-500',
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-error',
        info: 'bg-info',
        outline: 'bg-gray-500',
    }

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border font-medium',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            {...props}
        >
            {dot && (
                <span
                    className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        dotColors[variant]
                    )}
                />
            )}
            {children}
            {removable && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove?.()
                    }}
                    className="ml-0.5 -mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    aria-label="Remove"
                >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </span>
    )
}

// Status Badge for common statuses
interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
    status: 'active' | 'inactive' | 'pending' | 'published' | 'draft' | 'archived' | 'approved' | 'rejected'
}

function StatusBadge({ status, ...props }: StatusBadgeProps) {
    const statusConfig: Record<StatusBadgeProps['status'], { variant: BadgeProps['variant']; label: string }> = {
        active: { variant: 'success', label: 'Active' },
        inactive: { variant: 'secondary', label: 'Inactive' },
        pending: { variant: 'warning', label: 'Pending' },
        published: { variant: 'success', label: 'Published' },
        draft: { variant: 'secondary', label: 'Draft' },
        archived: { variant: 'secondary', label: 'Archived' },
        approved: { variant: 'success', label: 'Approved' },
        rejected: { variant: 'error', label: 'Rejected' },
    }

    const config = statusConfig[status]

    return (
        <Badge variant={config.variant} dot {...props}>
            {config.label}
        </Badge>
    )
}

// Role Badge for user roles
interface RoleBadgeProps extends Omit<BadgeProps, 'variant'> {
    role: 'admin' | 'user' | 'moderator' | 'contributor'
}

function RoleBadge({ role, ...props }: RoleBadgeProps) {
    const roleConfig: Record<RoleBadgeProps['role'], { variant: BadgeProps['variant']; label: string }> = {
        admin: { variant: 'error', label: 'Admin' },
        moderator: { variant: 'warning', label: 'Moderator' },
        contributor: { variant: 'info', label: 'Contributor' },
        user: { variant: 'secondary', label: 'User' },
    }

    const config = roleConfig[role]

    return (
        <Badge variant={config.variant} {...props}>
            {config.label}
        </Badge>
    )
}

// Count Badge (for notifications, etc)
interface CountBadgeProps extends Omit<BadgeProps, 'children'> {
    count: number
    max?: number
    showZero?: boolean
}

function CountBadge({ count, max = 99, showZero = false, ...props }: CountBadgeProps) {
    if (count === 0 && !showZero) {
        return null
    }

    const displayCount = count > max ? `${max}+` : count.toString()

    return (
        <Badge size="sm" {...props}>
            {displayCount}
        </Badge>
    )
}

export { Badge, StatusBadge, RoleBadge, CountBadge }
