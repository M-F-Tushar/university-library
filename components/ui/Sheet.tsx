"use client"

import * as React from "react"
import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { X } from "lucide-react"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const SheetContext = React.createContext<{
    isOpen: boolean
    setIsOpen: (open: boolean) => void
} | undefined>(undefined)

function useSheet() {
    const context = React.useContext(SheetContext)
    if (!context) {
        throw new Error("Sheet components must be used within a Sheet provider")
    }
    return context
}

export function Sheet({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <SheetContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </SheetContext.Provider>
    )
}

export function SheetTrigger({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) {
    const { setIsOpen } = useSheet()

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: () => setIsOpen(true)
        })
    }

    return (
        <button onClick={() => setIsOpen(true)}>
            {children}
        </button>
    )
}

export function SheetContent({
    children,
    side = "left",
    className,
}: {
    children: React.ReactNode
    side?: "left" | "right" | "top" | "bottom"
    className?: string
}) {
    const { isOpen, setIsOpen } = useSheet()

    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }
        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }
        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = ""
        }
    }, [isOpen, setIsOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Content */}
            <div
                className={cn(
                    "relative z-50 h-full w-full max-w-sm bg-white p-6 shadow-lg transition-transform dark:bg-gray-950 dark:border-gray-800",
                    {
                        "animate-in slide-in-from-left duration-300": side === "left",
                        "animate-in slide-in-from-right duration-300": side === "right",
                        "border-r": side === "left",
                        "border-l": side === "right",
                    },
                    className
                )}
            >
                <div className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}
