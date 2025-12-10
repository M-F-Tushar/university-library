'use client'

import * as React from 'react'
import { cn } from './Button'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface DialogContextType {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

function useDialogContext() {
    const context = React.useContext(DialogContext)
    if (!context) {
        throw new Error('Dialog components must be used within a Dialog')
    }
    return context
}

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
    // Handle escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onOpenChange(false)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [open, onOpenChange])

    // Prevent body scroll when open
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [open])

    if (!open) return null

    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            {children}
        </DialogContext.Provider>
    )
}

type DialogOverlayProps = React.HTMLAttributes<HTMLDivElement>

function DialogOverlay({ className, ...props }: DialogOverlayProps) {
    const { onOpenChange } = useDialogContext()

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
                'animate-in fade-in-0 duration-200',
                className
            )}
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
            {...props}
        />
    )
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

function DialogContent({
    className,
    size = 'md',
    children,
    ...props
}: DialogContentProps) {
    const { onOpenChange } = useDialogContext()
    const contentRef = React.useRef<HTMLDivElement>(null)

    // Focus trap
    React.useEffect(() => {
        const content = contentRef.current
        if (!content) return

        const focusableElements = content.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement?.focus()
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement?.focus()
                }
            }
        }

        firstElement?.focus()
        document.addEventListener('keydown', handleTab)
        return () => document.removeEventListener('keydown', handleTab)
    }, [])

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-4xl',
    }

    return (
        <>
            <DialogOverlay />
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onOpenChange(false)
                    }
                }}
            >
                <div
                    ref={contentRef}
                    role="dialog"
                    aria-modal="true"
                    className={cn(
                        'relative w-full bg-white rounded-lg shadow-xl',
                        'animate-in fade-in-0 zoom-in-95 duration-200',
                        'max-h-[90vh] overflow-auto',
                        sizeClasses[size],
                        className
                    )}
                    onClick={(e) => e.stopPropagation()}
                    {...props}
                >
                    {children}
                </div>
            </div>
        </>
    )
}

type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>

function DialogHeader({ className, ...props }: DialogHeaderProps) {
    return (
        <div
            className={cn(
                'flex flex-col space-y-1.5 p-6 pb-4',
                className
            )}
            {...props}
        />
    )
}

type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>

function DialogTitle({ className, ...props }: DialogTitleProps) {
    return (
        <h2
            className={cn(
                'text-lg font-semibold leading-none tracking-tight text-gray-900',
                className
            )}
            {...props}
        />
    )
}

type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
    return (
        <p
            className={cn('text-sm text-gray-500', className)}
            {...props}
        />
    )
}

type DialogBodyProps = React.HTMLAttributes<HTMLDivElement>

function DialogBody({ className, ...props }: DialogBodyProps) {
    return (
        <div
            className={cn('px-6 py-2', className)}
            {...props}
        />
    )
}

type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>

function DialogFooter({ className, ...props }: DialogFooterProps) {
    return (
        <div
            className={cn(
                'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4',
                className
            )}
            {...props}
        />
    )
}

type DialogCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>

function DialogClose({ className, children, ...props }: DialogCloseProps) {
    const { onOpenChange } = useDialogContext()

    return (
        <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={cn(
                'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity',
                'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'disabled:pointer-events-none',
                className
            )}
            {...props}
        >
            {children || <XMarkIcon className="h-5 w-5" />}
            <span className="sr-only">Close</span>
        </button>
    )
}

export {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
    DialogClose,
    DialogOverlay,
}
