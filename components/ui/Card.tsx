import * as React from "react"
import { cn } from "./Button"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'bordered' | 'elevated' | 'ghost'
    interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', interactive = false, ...props }, ref) => {
        const variantClasses = {
            default: 'border border-gray-200 bg-white shadow-sm',
            bordered: 'border-2 border-gray-300 bg-white',
            elevated: 'bg-white shadow-lg border-0',
            ghost: 'bg-transparent border-0 shadow-none',
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-lg text-gray-950 transition-all",
                    variantClasses[variant],
                    interactive && "cursor-pointer hover:shadow-md hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    !interactive && variant === 'default' && "hover:shadow-md",
                    className
                )}
                tabIndex={interactive ? 0 : undefined}
                {...props}
            />
        )
    }
)
Card.displayName = "Card"

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    divided?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, divided = false, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex flex-col space-y-1.5 p-6",
                divided && "border-b border-gray-200",
                className
            )}
            {...props}
        />
    )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight font-display",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-gray-500", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    divided?: boolean
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, divided = false, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex items-center p-6 pt-0",
                divided && "border-t border-gray-200 mt-4 pt-4",
                className
            )}
            {...props}
        />
    )
)
CardFooter.displayName = "CardFooter"

// Stat Card for dashboards
interface StatCardProps extends Omit<CardProps, 'children'> {
    title: string
    value: string | number
    change?: {
        value: number
        type: 'increase' | 'decrease' | 'neutral'
    }
    icon?: React.ReactNode
    description?: string
}

function StatCard({
    title,
    value,
    change,
    icon,
    description,
    className,
    ...props
}: StatCardProps) {
    const changeColors = {
        increase: 'text-success',
        decrease: 'text-error',
        neutral: 'text-gray-500',
    }

    const changeIcons = {
        increase: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
        ),
        decrease: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
        ),
        neutral: null,
    }

    return (
        <Card className={cn('p-6', className)} {...props}>
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <div className={cn('flex items-center gap-1 text-sm', changeColors[change.type])}>
                            {changeIcons[change.type]}
                            <span>{Math.abs(change.value)}%</span>
                            <span className="text-gray-500">vs last period</span>
                        </div>
                    )}
                    {description && (
                        <p className="text-sm text-gray-500">{description}</p>
                    )}
                </div>
                {icon && (
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    )
}

// Feature Card for showcasing features
interface FeatureCardProps extends Omit<CardProps, 'children'> {
    icon?: React.ReactNode
    title: string
    description: string
    action?: React.ReactNode
}

function FeatureCard({
    icon,
    title,
    description,
    action,
    className,
    ...props
}: FeatureCardProps) {
    return (
        <Card className={cn('p-6 text-center', className)} {...props}>
            {icon && (
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {icon}
                </div>
            )}
            <CardTitle className="mb-2 text-lg">{title}</CardTitle>
            <CardDescription className="mb-4">{description}</CardDescription>
            {action}
        </Card>
    )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, StatCard, FeatureCard }
