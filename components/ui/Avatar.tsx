import * as React from 'react'
import { cn } from './Button'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    shape?: 'circle' | 'square'
}

function Avatar({
    size = 'md',
    shape = 'circle',
    className,
    children,
    ...props
}: AvatarProps) {
    const sizeClasses = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-14 w-14 text-xl',
        '2xl': 'h-16 w-16 text-2xl',
    }

    const shapeClasses = {
        circle: 'rounded-full',
        square: 'rounded-md',
    }

    return (
        <div
            className={cn(
                'relative inline-flex items-center justify-center overflow-hidden bg-gray-100',
                sizeClasses[size],
                shapeClasses[shape],
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    onLoadingStatusChange?: (status: 'idle' | 'loading' | 'loaded' | 'error') => void
}

function AvatarImage({
    src,
    alt = '',
    onLoadingStatusChange,
    className,
    ...props
}: AvatarImageProps) {
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')

    React.useEffect(() => {
        if (!src || typeof src !== 'string') {
            setStatus('error')
            return
        }

        setStatus('loading')
        const image = new Image()
        image.src = src
        image.onload = () => {
            setStatus('loaded')
            onLoadingStatusChange?.('loaded')
        }
        image.onerror = () => {
            setStatus('error')
            onLoadingStatusChange?.('error')
        }
    }, [src, onLoadingStatusChange])

    if (status !== 'loaded' || typeof src !== 'string') {
        return null
    }

    return (
        <img
            src={src}
            alt={alt}
            className={cn('h-full w-full object-cover', className)}
            {...props}
        />
    )
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
    delayMs?: number
}

function AvatarFallback({
    delayMs = 0,
    className,
    children,
    ...props
}: AvatarFallbackProps) {
    const [canRender, setCanRender] = React.useState(delayMs === 0)

    React.useEffect(() => {
        if (delayMs === 0) return

        const timer = setTimeout(() => setCanRender(true), delayMs)
        return () => clearTimeout(timer)
    }, [delayMs])

    if (!canRender) {
        return null
    }

    return (
        <span
            className={cn(
                'flex h-full w-full items-center justify-center font-medium text-gray-600',
                className
            )}
            {...props}
        >
            {children}
        </span>
    )
}

// Convenient wrapper for user avatars
interface UserAvatarProps extends Omit<AvatarProps, 'children'> {
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
    } | null
    fallbackIcon?: React.ReactNode
}

function UserAvatar({ user, fallbackIcon, ...props }: UserAvatarProps) {
    const getInitials = (name?: string | null, email?: string | null): string => {
        if (name) {
            const parts = name.split(' ')
            if (parts.length >= 2) {
                return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
            }
            return name.substring(0, 2).toUpperCase()
        }
        if (email) {
            return email.substring(0, 2).toUpperCase()
        }
        return '?'
    }

    const defaultIcon = (
        <svg
            className="h-1/2 w-1/2"
            fill="currentColor"
            viewBox="0 0 24 24"
        >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    )

    return (
        <Avatar {...props}>
            {user?.image && <AvatarImage src={user.image} alt={user.name || 'User avatar'} />}
            <AvatarFallback>
                {user?.name || user?.email ? getInitials(user.name, user.email) : (fallbackIcon || defaultIcon)}
            </AvatarFallback>
        </Avatar>
    )
}

// Avatar Group for stacked avatars
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    max?: number
    size?: AvatarProps['size']
}

function AvatarGroup({
    max = 4,
    size = 'md',
    className,
    children,
    ...props
}: AvatarGroupProps) {
    const avatars = React.Children.toArray(children)
    const visibleAvatars = avatars.slice(0, max)
    const remainingCount = avatars.length - max

    return (
        <div
            className={cn('flex -space-x-2', className)}
            {...props}
        >
            {visibleAvatars.map((avatar, index) => (
                <div
                    key={index}
                    className="relative ring-2 ring-white rounded-full"
                >
                    {React.isValidElement(avatar)
                        ? React.cloneElement(avatar as React.ReactElement<AvatarProps>, { size })
                        : avatar}
                </div>
            ))}
            {remainingCount > 0 && (
                <Avatar size={size} className="ring-2 ring-white bg-gray-200">
                    <AvatarFallback className="text-gray-600 text-xs">
                        +{remainingCount}
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}

// Online status indicator
interface OnlineIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: 'online' | 'offline' | 'away' | 'busy'
    size?: 'sm' | 'md' | 'lg'
}

function OnlineIndicator({
    status,
    size = 'md',
    className,
    ...props
}: OnlineIndicatorProps) {
    const statusColors = {
        online: 'bg-success',
        offline: 'bg-gray-400',
        away: 'bg-warning',
        busy: 'bg-error',
    }

    const sizeClasses = {
        sm: 'h-2 w-2',
        md: 'h-3 w-3',
        lg: 'h-4 w-4',
    }

    return (
        <span
            className={cn(
                'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
                statusColors[status],
                sizeClasses[size],
                className
            )}
            aria-label={`Status: ${status}`}
            {...props}
        />
    )
}

export {
    Avatar,
    AvatarImage,
    AvatarFallback,
    UserAvatar,
    AvatarGroup,
    OnlineIndicator,
}
