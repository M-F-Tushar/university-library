import * as React from "react"
import { cn } from "./Button"

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
    label?: string
    helperText?: string
    error?: string | boolean
    success?: boolean
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    clearable?: boolean
    onClear?: () => void
    fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
        className,
        type,
        label,
        helperText,
        error,
        success,
        prefix,
        suffix,
        clearable,
        onClear,
        fullWidth = true,
        id,
        ...props
    }, ref) => {
        const generatedId = React.useId()
        const inputId = id || generatedId
        const errorId = `${inputId}-error`
        const helperId = `${inputId}-helper`
        const hasError = !!error
        const errorMessage = typeof error === 'string' ? error : undefined

        return (
            <div className={cn("space-y-1.5", fullWidth && "w-full")}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}
                        {props.required && <span className="text-error ml-0.5">*</span>}
                    </label>
                )}

                {/* Input wrapper */}
                <div className="relative">
                    {/* Prefix */}
                    {prefix && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {prefix}
                        </div>
                    )}

                    {/* Input */}
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            // Base styles
                            "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm",
                            "ring-offset-white transition-colors duration-200",
                            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                            "placeholder:text-gray-400",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
                            // Default state
                            !hasError && !success && [
                                "border-gray-200",
                                "focus-visible:ring-primary-500 focus-visible:border-primary-500",
                            ],
                            // Error state
                            hasError && [
                                "border-error",
                                "focus-visible:ring-error focus-visible:border-error",
                                "bg-red-50/50",
                            ],
                            // Success state
                            success && !hasError && [
                                "border-success",
                                "focus-visible:ring-success focus-visible:border-success",
                            ],
                            // Prefix padding
                            prefix && "pl-10",
                            // Suffix/clearable padding
                            (suffix || clearable) && "pr-10",
                            className
                        )}
                        ref={ref}
                        aria-invalid={hasError}
                        aria-describedby={
                            hasError ? errorId : helperText ? helperId : undefined
                        }
                        {...props}
                    />

                    {/* Suffix or Clear button */}
                    {(suffix || (clearable && props.value)) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {clearable && props.value && (
                                <button
                                    type="button"
                                    onClick={onClear}
                                    className="p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Clear input"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            )}
                            {suffix && <span className="text-gray-500">{suffix}</span>}
                        </div>
                    )}
                </div>

                {/* Error message */}
                {errorMessage && (
                    <p
                        id={errorId}
                        className="text-sm text-error flex items-center gap-1"
                        role="alert"
                    >
                        <svg
                            className="h-4 w-4 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {errorMessage}
                    </p>
                )}

                {/* Helper text */}
                {helperText && !errorMessage && (
                    <p
                        id={helperId}
                        className="text-sm text-gray-500"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

// Textarea component
export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    helperText?: string
    error?: string | boolean
    success?: boolean
    fullWidth?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({
        className,
        label,
        helperText,
        error,
        success,
        fullWidth = true,
        id,
        ...props
    }, ref) => {
        const generatedId = React.useId()
        const textareaId = id || generatedId
        const errorId = `${textareaId}-error`
        const helperId = `${textareaId}-helper`
        const hasError = !!error
        const errorMessage = typeof error === 'string' ? error : undefined

        return (
            <div className={cn("space-y-1.5", fullWidth && "w-full")}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}
                        {props.required && <span className="text-error ml-0.5">*</span>}
                    </label>
                )}

                {/* Textarea */}
                <textarea
                    id={textareaId}
                    className={cn(
                        // Base styles
                        "flex min-h-[100px] w-full rounded-md border bg-white px-3 py-2 text-sm",
                        "ring-offset-white transition-colors duration-200",
                        "placeholder:text-gray-400",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
                        "resize-y",
                        // Default state
                        !hasError && !success && [
                            "border-gray-200",
                            "focus-visible:ring-primary-500 focus-visible:border-primary-500",
                        ],
                        // Error state
                        hasError && [
                            "border-error",
                            "focus-visible:ring-error focus-visible:border-error",
                            "bg-red-50/50",
                        ],
                        // Success state
                        success && !hasError && [
                            "border-success",
                            "focus-visible:ring-success focus-visible:border-success",
                        ],
                        className
                    )}
                    ref={ref}
                    aria-invalid={hasError}
                    aria-describedby={
                        hasError ? errorId : helperText ? helperId : undefined
                    }
                    {...props}
                />

                {/* Error message */}
                {errorMessage && (
                    <p
                        id={errorId}
                        className="text-sm text-error flex items-center gap-1"
                        role="alert"
                    >
                        <svg
                            className="h-4 w-4 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {errorMessage}
                    </p>
                )}

                {/* Helper text */}
                {helperText && !errorMessage && (
                    <p
                        id={helperId}
                        className="text-sm text-gray-500"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)
Textarea.displayName = "Textarea"

export { Input, Textarea }
