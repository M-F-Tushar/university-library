import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline" | "link"
    size?: "xs" | "sm" | "md" | "lg" | "xl"
    loading?: boolean
    icon?: React.ReactNode
    iconPosition?: "left" | "right"
    fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant = "primary",
        size = "md",
        loading = false,
        icon,
        iconPosition = "left",
        fullWidth = false,
        disabled,
        children,
        ...props
    }, ref) => {
        const isDisabled = disabled || loading

        return (
            <button
                className={cn(
                    // Base styles
                    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 font-sans tracking-wide",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "active:scale-[0.98]",
                    // Variants
                    {
                        // Primary
                        "bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-primary-500/25":
                            variant === "primary",
                        // Secondary
                        "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm hover:border-gray-300":
                            variant === "secondary",
                        // Ghost
                        "hover:bg-gray-100 text-gray-700 hover:text-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white":
                            variant === "ghost",
                        // Destructive
                        "bg-error text-white hover:bg-red-600 shadow-sm hover:shadow-md":
                            variant === "destructive",
                        // Outline
                        "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 bg-transparent":
                            variant === "outline",
                        // Link
                        "text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline p-0 h-auto":
                            variant === "link",
                    },
                    // Sizes
                    {
                        "h-8 px-3 text-xs": size === "xs",
                        "h-9 px-4 text-sm": size === "sm",
                        "h-11 px-6 text-base": size === "md",
                        "h-12 px-8 text-lg": size === "lg",
                        "h-14 px-10 text-xl": size === "xl",
                    },
                    // Full width
                    fullWidth && "w-full",
                    // Loading state
                    loading && "relative text-transparent",
                    className
                )}
                ref={ref}
                disabled={isDisabled}
                {...props}
            >
                {/* Loading spinner */}
                {loading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <LoadingSpinner size={size} />
                    </span>
                )}

                {/* Icon left */}
                {icon && iconPosition === "left" && !loading && (
                    <span className="shrink-0">{icon}</span>
                )}

                {/* Content */}
                {children}

                {/* Icon right */}
                {icon && iconPosition === "right" && !loading && (
                    <span className="shrink-0">{icon}</span>
                )}
            </button>
        )
    }
)
Button.displayName = "Button"

// Loading Spinner component
function LoadingSpinner({ size }: { size: ButtonProps["size"] }) {
    const sizeClasses = {
        xs: "h-3 w-3",
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
        xl: "h-6 w-6",
    }

    return (
        <svg
            className={cn("animate-spin text-current", sizeClasses[size || "md"])}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    )
}

// Icon Button variant
export interface IconButtonProps extends Omit<ButtonProps, "icon" | "iconPosition" | "children"> {
    icon: React.ReactNode
    "aria-label": string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, size = "md", icon, ...props }, ref) => {
        const sizeClasses = {
            xs: "h-7 w-7",
            sm: "h-8 w-8",
            md: "h-10 w-10",
            lg: "h-11 w-11",
            xl: "h-12 w-12",
        }

        return (
            <Button
                ref={ref}
                size={size}
                className={cn(sizeClasses[size], "p-0", className)}
                {...props}
            >
                {icon}
            </Button>
        )
    }
)
IconButton.displayName = "IconButton"

export { Button, IconButton, cn }
