'use client'

import * as React from 'react'
import { cn } from './Button'
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: string
    type: ToastType
    title: string
    description?: string
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

// Hook to use toast
export function useToast() {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    
    const { addToast, removeToast } = context
    
    return {
        toast: {
            success: (title: string, description?: string) => 
                addToast({ type: 'success', title, description }),
            error: (title: string, description?: string) => 
                addToast({ type: 'error', title, description }),
            warning: (title: string, description?: string) => 
                addToast({ type: 'warning', title, description }),
            info: (title: string, description?: string) => 
                addToast({ type: 'info', title, description }),
        },
        dismiss: removeToast,
    }
}

// Toast Provider
interface ToastProviderProps {
    children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = React.useState<Toast[]>([])

    const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast = { ...toast, id }
        
        setToasts((prev) => [...prev, newToast])

        // Auto dismiss after duration (default 5s)
        const duration = toast.duration ?? 5000
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id))
            }, duration)
        }
    }, [])

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    )
}

// Toast Container
interface ToastContainerProps {
    toasts: Toast[]
    onDismiss: (id: string) => void
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    if (toasts.length === 0) return null

    return (
        <div
            className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full"
            role="region"
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    )
}

// Toast Item
interface ToastItemProps {
    toast: Toast
    onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
    const icons = {
        success: CheckCircleIcon,
        error: ExclamationCircleIcon,
        warning: ExclamationTriangleIcon,
        info: InformationCircleIcon,
    }

    const styles = {
        success: {
            bg: 'bg-green-50 border-green-200',
            icon: 'text-green-500',
            title: 'text-green-800',
            desc: 'text-green-700',
        },
        error: {
            bg: 'bg-red-50 border-red-200',
            icon: 'text-red-500',
            title: 'text-red-800',
            desc: 'text-red-700',
        },
        warning: {
            bg: 'bg-yellow-50 border-yellow-200',
            icon: 'text-yellow-500',
            title: 'text-yellow-800',
            desc: 'text-yellow-700',
        },
        info: {
            bg: 'bg-blue-50 border-blue-200',
            icon: 'text-blue-500',
            title: 'text-blue-800',
            desc: 'text-blue-700',
        },
    }

    const Icon = icons[toast.type]
    const style = styles[toast.type]

    return (
        <div
            role="alert"
            className={cn(
                'relative flex items-start gap-3 rounded-lg border p-4 shadow-lg',
                'animate-in slide-in-from-right-full duration-300',
                style.bg
            )}
        >
            <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', style.icon)} />
            
            <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium', style.title)}>
                    {toast.title}
                </p>
                {toast.description && (
                    <p className={cn('text-sm mt-1', style.desc)}>
                        {toast.description}
                    </p>
                )}
            </div>

            <button
                onClick={() => onDismiss(toast.id)}
                className={cn(
                    'shrink-0 rounded-md p-1 transition-colors',
                    'hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-primary-500',
                    style.icon
                )}
                aria-label="Dismiss notification"
            >
                <XMarkIcon className="h-4 w-4" />
            </button>
        </div>
    )
}

export { ToastContainer, ToastItem }
