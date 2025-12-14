import * as React from 'react'
import { cn } from './Button'

interface DropdownMenuContextValue {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    triggerRef: React.RefObject<HTMLButtonElement | null>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined)

function useDropdownMenu() {
    const context = React.useContext(DropdownMenuContext)
    if (!context) {
        throw new Error('DropdownMenu components must be used within a DropdownMenu provider')
    }
    return context
}

interface DropdownMenuProps {
    children: React.ReactNode
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

function DropdownMenu({
    children,
    defaultOpen = false,
    open,
    onOpenChange,
}: DropdownMenuProps) {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const triggerRef = React.useRef<HTMLButtonElement>(null)

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

    // Close on click outside
    React.useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node
            if (triggerRef.current && !triggerRef.current.contains(target)) {
                setIsOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
                triggerRef.current?.focus()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, setIsOpen])

    return (
        <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
            <div className="relative inline-block text-left">
                {children}
            </div>
        </DropdownMenuContext.Provider>
    )
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
    ({ className, children, asChild, ...props }, forwardedRef) => {
        const { isOpen, setIsOpen, triggerRef } = useDropdownMenu()

        // Merge refs
        const ref = React.useCallback(
            (node: HTMLButtonElement | null) => {
                (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
                if (typeof forwardedRef === 'function') {
                    forwardedRef(node)
                } else if (forwardedRef) {
                    forwardedRef.current = node
                }
            },
            [forwardedRef, triggerRef]
        )

        const handleClick = (e: React.MouseEvent) => {
            setIsOpen(!isOpen)
            props.onClick?.(e as React.MouseEvent<HTMLButtonElement>)
        }

        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children as React.ReactElement<any>, {
                ref,
                "aria-expanded": isOpen,
                "aria-haspopup": "menu",
                onClick: handleClick,
                className: cn((children.props as any).className, className),
                ...props
            })
        }

        return (
            <button
                ref={ref}
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'inline-flex items-center justify-center',
                    className
                )}
                {...props}
            >
                {children}
            </button>
        )
    }
)
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: 'start' | 'center' | 'end'
    side?: 'top' | 'bottom'
    sideOffset?: number
}

function DropdownMenuContent({
    align = 'end',
    side = 'bottom',
    sideOffset = 4,
    className,
    children,
    ...props
}: DropdownMenuContentProps) {
    const { isOpen } = useDropdownMenu()
    const contentRef = React.useRef<HTMLDivElement>(null)

    // Focus first item when opened
    React.useEffect(() => {
        if (isOpen && contentRef.current) {
            const firstItem = contentRef.current.querySelector('[role="menuitem"]:not([disabled])') as HTMLElement
            firstItem?.focus()
        }
    }, [isOpen])

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!contentRef.current) return

        const items = Array.from(
            contentRef.current.querySelectorAll('[role="menuitem"]:not([disabled])')
        ) as HTMLElement[]
        const currentIndex = items.indexOf(document.activeElement as HTMLElement)

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                items[(currentIndex + 1) % items.length]?.focus()
                break
            case 'ArrowUp':
                event.preventDefault()
                items[(currentIndex - 1 + items.length) % items.length]?.focus()
                break
            case 'Home':
                event.preventDefault()
                items[0]?.focus()
                break
            case 'End':
                event.preventDefault()
                items[items.length - 1]?.focus()
                break
        }
    }

    if (!isOpen) return null

    const alignClasses = {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0',
    }

    const sideClasses = {
        top: 'bottom-full mb-1',
        bottom: 'top-full mt-1',
    }

    return (
        <div
            ref={contentRef}
            role="menu"
            aria-orientation="vertical"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className={cn(
                'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md',
                'animate-in fade-in-0 zoom-in-95',
                alignClasses[align],
                sideClasses[side],
                className
            )}
            style={{ marginTop: side === 'bottom' ? sideOffset : undefined, marginBottom: side === 'top' ? sideOffset : undefined }}
            {...props}
        >
            {children}
        </div>
    )
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    inset?: boolean
    destructive?: boolean
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
    ({ className, inset, destructive, disabled, children, onClick, ...props }, ref) => {
        const { setIsOpen } = useDropdownMenu()

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            if (!disabled) {
                onClick?.(event)
                setIsOpen(false)
            }
        }

        return (
            <button
                ref={ref}
                role="menuitem"
                type="button"
                disabled={disabled}
                onClick={handleClick}
                className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                    'transition-colors focus:bg-gray-100 focus:text-gray-900',
                    'hover:bg-gray-100 hover:text-gray-900',
                    'disabled:pointer-events-none disabled:opacity-50',
                    inset && 'pl-8',
                    destructive && 'text-error focus:bg-error/10 hover:bg-error/10 focus:text-error hover:text-error',
                    className
                )}
                {...props}
            >
                {children}
            </button>
        )
    }
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

function DropdownMenuLabel({
    className,
    inset,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
    return (
        <div
            className={cn(
                'px-2 py-1.5 text-sm font-semibold text-gray-900',
                inset && 'pl-8',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

function DropdownMenuSeparator({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            role="separator"
            className={cn('-mx-1 my-1 h-px bg-gray-200', className)}
            {...props}
        />
    )
}

function DropdownMenuGroup({
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div role="group" {...props}>
            {children}
        </div>
    )
}

interface DropdownMenuCheckboxItemProps extends DropdownMenuItemProps {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
}

const DropdownMenuCheckboxItem = React.forwardRef<HTMLButtonElement, DropdownMenuCheckboxItemProps>(
    ({ className, checked, onCheckedChange, children, ...props }, ref) => {
        return (
            <DropdownMenuItem
                ref={ref}
                role="menuitemcheckbox"
                aria-checked={checked}
                className={cn('pl-8', className)}
                onClick={() => onCheckedChange?.(!checked)}
                {...props}
            >
                <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                    {checked && (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </span>
                {children}
            </DropdownMenuItem>
        )
    }
)
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuCheckboxItem,
}
