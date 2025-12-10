import * as React from 'react'
import { cn } from './Button'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number
    max?: number
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
    showValue?: boolean
    animated?: boolean
    indeterminate?: boolean
}

function Progress({
    value = 0,
    max = 100,
    size = 'md',
    variant = 'default',
    showValue = false,
    animated = true,
    indeterminate = false,
    className,
    ...props
}: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    }

    const variantClasses = {
        default: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-error',
        info: 'bg-info',
    }

    return (
        <div className={cn('flex items-center gap-2', className)} {...props}>
            <div
                role="progressbar"
                aria-valuenow={indeterminate ? undefined : value}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuetext={indeterminate ? 'Loading...' : `${Math.round(percentage)}%`}
                className={cn(
                    'w-full overflow-hidden rounded-full bg-gray-200',
                    sizeClasses[size]
                )}
            >
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-300',
                        variantClasses[variant],
                        animated && !indeterminate && 'transition-[width]',
                        indeterminate && 'animate-progress-indeterminate'
                    )}
                    style={{
                        width: indeterminate ? undefined : `${percentage}%`,
                    }}
                />
            </div>
            {showValue && !indeterminate && (
                <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
                    {Math.round(percentage)}%
                </span>
            )}
        </div>
    )
}

// Circular Progress
interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number
    max?: number
    size?: 'sm' | 'md' | 'lg' | 'xl'
    strokeWidth?: number
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
    showValue?: boolean
    indeterminate?: boolean
}

function CircularProgress({
    value = 0,
    max = 100,
    size = 'md',
    strokeWidth,
    variant = 'default',
    showValue = false,
    indeterminate = false,
    className,
    ...props
}: CircularProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizeConfig = {
        sm: { dimension: 32, stroke: 3, fontSize: 'text-xs' },
        md: { dimension: 48, stroke: 4, fontSize: 'text-sm' },
        lg: { dimension: 64, stroke: 5, fontSize: 'text-base' },
        xl: { dimension: 96, stroke: 6, fontSize: 'text-lg' },
    }

    const config = sizeConfig[size]
    const actualStrokeWidth = strokeWidth ?? config.stroke
    const radius = (config.dimension - actualStrokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    const variantColors = {
        default: 'stroke-primary',
        success: 'stroke-success',
        warning: 'stroke-warning',
        error: 'stroke-error',
        info: 'stroke-info',
    }

    return (
        <div
            role="progressbar"
            aria-valuenow={indeterminate ? undefined : value}
            aria-valuemin={0}
            aria-valuemax={max}
            className={cn('relative inline-flex items-center justify-center', className)}
            {...props}
        >
            <svg
                width={config.dimension}
                height={config.dimension}
                className={cn(indeterminate && 'animate-spin')}
            >
                {/* Background circle */}
                <circle
                    cx={config.dimension / 2}
                    cy={config.dimension / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={actualStrokeWidth}
                    className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                    cx={config.dimension / 2}
                    cy={config.dimension / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={actualStrokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
                    className={cn(
                        variantColors[variant],
                        'transition-all duration-300',
                        '-rotate-90 origin-center'
                    )}
                    style={{
                        transformOrigin: '50% 50%',
                        transform: 'rotate(-90deg)',
                    }}
                />
            </svg>
            {showValue && !indeterminate && (
                <span className={cn('absolute font-medium text-gray-700', config.fontSize)}>
                    {Math.round(percentage)}%
                </span>
            )}
        </div>
    )
}

// Steps Progress
interface Step {
    label: string
    description?: string
}

interface StepsProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    steps: Step[]
    currentStep: number
    orientation?: 'horizontal' | 'vertical'
}

function StepsProgress({
    steps,
    currentStep,
    orientation = 'horizontal',
    className,
    ...props
}: StepsProgressProps) {
    return (
        <div
            className={cn(
                'w-full',
                orientation === 'horizontal' ? 'flex items-center' : 'flex flex-col',
                className
            )}
            {...props}
        >
            {steps.map((step, index) => {
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isLast = index === steps.length - 1

                return (
                    <React.Fragment key={index}>
                        <div
                            className={cn(
                                'flex items-center',
                                orientation === 'vertical' && 'flex-col items-start'
                            )}
                        >
                            {/* Step indicator */}
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                                    isCompleted && 'border-primary bg-primary text-white',
                                    isCurrent && 'border-primary text-primary',
                                    !isCompleted && !isCurrent && 'border-gray-300 text-gray-400'
                                )}
                            >
                                {isCompleted ? (
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            {/* Step label */}
                            <div className={cn(orientation === 'horizontal' ? 'ml-2' : 'ml-0 mt-2')}>
                                <p
                                    className={cn(
                                        'text-sm font-medium',
                                        isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                                    )}
                                >
                                    {step.label}
                                </p>
                                {step.description && (
                                    <p className="text-xs text-gray-500">{step.description}</p>
                                )}
                            </div>
                        </div>
                        {/* Connector */}
                        {!isLast && (
                            <div
                                className={cn(
                                    'flex-1',
                                    orientation === 'horizontal' ? 'mx-4 h-0.5' : 'ml-4 w-0.5 min-h-[2rem] my-2',
                                    isCompleted ? 'bg-primary' : 'bg-gray-300'
                                )}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export { Progress, CircularProgress, StepsProgress }
