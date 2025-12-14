import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "info"
    size?: "sm" | "md"
}

export function Badge({
    className,
    variant = "default",
    size = "md",
    ...props
}: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                {
                    // Variants
                    "border-transparent bg-primary-600 text-white hover:bg-primary-700": variant === "default",
                    "border-transparent bg-primary-100 text-primary-900 hover:bg-primary-200": variant === "secondary",
                    "text-foreground border border-gray-200": variant === "outline",
                    "border-transparent bg-red-100 text-red-700 hover:bg-red-200": variant === "destructive",
                    "border-transparent bg-green-100 text-green-700 hover:bg-green-200": variant === "success",
                    "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200": variant === "warning",
                    "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200": variant === "info",
                },
                {
                    // Sizes
                    "text-[10px] px-2 py-0.5": size === "sm",
                    "text-xs px-2.5 py-0.5": size === "md",
                },
                className
            )}
            {...props}
        />
    )
}
