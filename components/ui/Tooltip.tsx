import * as React from 'react'
import { cn } from './Button'

interface TooltipProps {
    content: React.ReactNode
    children: React.ReactElement
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    delayDuration?: number
    skipDelayDuration?: number
    disabled?: boolean
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

function Tooltip({
    content,
    children,
    side = 'top',
    align = 'center',
    sideOffset = 6,
    delayDuration = 300,
    skipDelayDuration = 0,
    disabled = false,
    open,
    defaultOpen = false,
    onOpenChange,
}: TooltipProps) {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })
    const triggerRef = React.useRef<HTMLElement | null>(null)
    const tooltipRef = React.useRef<HTMLDivElement>(null)
    const openTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    const isOpen = open !== undefined ? open : internalOpen
    const setIsOpen = React.useCallback(
        (newOpen: boolean) => {
            if (open === undefined) {
                setInternalOpen(newOpen)
            }
            onOpenChange?.(newOpen)
        },
        [open, onOpenChange]
    )

    const updatePosition = React.useCallback(() => {
        if (!triggerRef.current || !tooltipRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const tooltipRect = tooltipRef.current.getBoundingClientRect()

        let top = 0
        let left = 0

        // Calculate position based on side
        switch (side) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - sideOffset
                break
            case 'bottom':
                top = triggerRect.bottom + sideOffset
                break
            case 'left':
                left = triggerRect.left - tooltipRect.width - sideOffset
                break
            case 'right':
                left = triggerRect.right + sideOffset
                break
        }

        // Calculate alignment
        if (side === 'top' || side === 'bottom') {
            switch (align) {
                case 'start':
                    left = triggerRect.left
                    break
                case 'center':
                    left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
                    break
                case 'end':
                    left = triggerRect.right - tooltipRect.width
                    break
            }
        } else {
            switch (align) {
                case 'start':
                    top = triggerRect.top
                    break
                case 'center':
                    top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
                    break
                case 'end':
                    top = triggerRect.bottom - tooltipRect.height
                    break
            }
        }

        // Clamp to viewport
        const padding = 8
        top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding))
        left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding))

        setPosition({ top, left })
    }, [side, align, sideOffset])

    React.useEffect(() => {
        if (isOpen) {
            updatePosition()
            window.addEventListener('scroll', updatePosition, true)
            window.addEventListener('resize', updatePosition)
            return () => {
                window.removeEventListener('scroll', updatePosition, true)
                window.removeEventListener('resize', updatePosition)
            }
        }
    }, [isOpen, updatePosition])

    const handleMouseEnter = () => {
        if (disabled) return
        clearTimeout(closeTimeoutRef.current)
        openTimeoutRef.current = setTimeout(() => {
            setIsOpen(true)
        }, delayDuration)
    }

    const handleMouseLeave = () => {
        clearTimeout(openTimeoutRef.current)
        closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false)
        }, skipDelayDuration)
    }

    const handleFocus = () => {
        if (disabled) return
        setIsOpen(true)
    }

    const handleBlur = () => {
        setIsOpen(false)
    }

    // Assign ref to child element using callback ref pattern
    const setTriggerRef = React.useCallback((node: HTMLElement | null) => {
        triggerRef.current = node
    }, [])

    const sideClasses = {
        top: 'animate-in fade-in-0 slide-in-from-bottom-1',
        bottom: 'animate-in fade-in-0 slide-in-from-top-1',
        left: 'animate-in fade-in-0 slide-in-from-right-1',
        right: 'animate-in fade-in-0 slide-in-from-left-1',
    }

    // Clone child with event handlers - using callback ref
    const trigger = React.cloneElement(children, {
        ref: setTriggerRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        'aria-describedby': isOpen ? 'tooltip' : undefined,
    } as React.HTMLAttributes<HTMLElement>)

    return (
        <>
            {trigger}
            {isOpen && (
                <div
                    ref={tooltipRef}
                    id="tooltip"
                    role="tooltip"
                    className={cn(
                        'fixed z-50 max-w-xs rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white shadow-md',
                        sideClasses[side]
                    )}
                    style={{
                        top: position.top,
                        left: position.left,
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {content}
                </div>
            )}
        </>
    )
}

// Simple tooltip wrapper for text content
interface SimpleTooltipProps extends Omit<TooltipProps, 'content'> {
    label: string
}

function SimpleTooltip({ label, ...props }: SimpleTooltipProps) {
    return <Tooltip content={label} {...props} />
}

export { Tooltip, SimpleTooltip }
