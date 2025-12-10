'use client'

import * as React from 'react'
import { cn } from './Button'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'

// Select Context
interface SelectContextType {
    value: string
    onValueChange: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined)

function useSelectContext() {
    const context = React.useContext(SelectContext)
    if (!context) {
        throw new Error('Select components must be used within a Select')
    }
    return context
}

// Select Root
interface SelectProps {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
    disabled?: boolean
}

function Select({
    value: controlledValue,
    defaultValue = '',
    onValueChange,
    children,
    disabled = false,
}: SelectProps) {
    const [open, setOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(defaultValue)

    const value = controlledValue ?? internalValue

    const handleValueChange = React.useCallback((newValue: string) => {
        if (!controlledValue) {
            setInternalValue(newValue)
        }
        onValueChange?.(newValue)
        setOpen(false)
    }, [controlledValue, onValueChange])

    // Close on click outside
    React.useEffect(() => {
        if (!open) return

        const handleClick = () => setOpen(false)
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [open])

    // Close on escape
    React.useEffect(() => {
        if (!open) return

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [open])

    return (
        <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open, setOpen }}>
            <div className="relative">
                {children}
            </div>
        </SelectContext.Provider>
    )
}

// Select Trigger
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    placeholder?: string
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
    ({ className, placeholder = 'Select...', children, ...props }, ref) => {
        const { value, open, setOpen } = useSelectContext()

        return (
            <button
                type="button"
                ref={ref}
                onClick={(e) => {
                    e.stopPropagation()
                    setOpen(!open)
                }}
                className={cn(
                    'flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm',
                    'ring-offset-white placeholder:text-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    open && 'ring-2 ring-primary-500 ring-offset-2',
                    className
                )}
                aria-expanded={open}
                aria-haspopup="listbox"
                {...props}
            >
                <span className={cn(!value && 'text-gray-400')}>
                    {children || placeholder}
                </span>
                <ChevronDownIcon
                    className={cn(
                        'h-4 w-4 text-gray-500 transition-transform duration-200',
                        open && 'rotate-180'
                    )}
                />
            </button>
        )
    }
)
SelectTrigger.displayName = 'SelectTrigger'

// Select Value
interface SelectValueProps {
    placeholder?: string
}

function SelectValue({ placeholder = 'Select...' }: SelectValueProps) {
    const { value } = useSelectContext()
    return <>{value || placeholder}</>
}

// Select Content
type SelectContentProps = React.HTMLAttributes<HTMLDivElement>

function SelectContent({ className, children, ...props }: SelectContentProps) {
    const { open } = useSelectContext()

    if (!open) return null

    return (
        <div
            role="listbox"
            className={cn(
                'absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg',
                'animate-in fade-in-0 zoom-in-95 duration-100',
                'max-h-60 overflow-auto',
                className
            )}
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            <div className="p-1">
                {children}
            </div>
        </div>
    )
}

// Select Item
interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
    disabled?: boolean
}

function SelectItem({
    className,
    value: itemValue,
    disabled = false,
    children,
    ...props
}: SelectItemProps) {
    const { value, onValueChange } = useSelectContext()
    const isSelected = value === itemValue

    return (
        <div
            role="option"
            aria-selected={isSelected}
            aria-disabled={disabled}
            onClick={() => {
                if (!disabled) {
                    onValueChange(itemValue)
                }
            }}
            className={cn(
                'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                'hover:bg-gray-100 focus:bg-gray-100',
                isSelected && 'bg-primary-50 text-primary-600',
                disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                className
            )}
            {...props}
        >
            <span className="flex-1">{children}</span>
            {isSelected && (
                <CheckIcon className="h-4 w-4 text-primary-600" />
            )}
        </div>
    )
}

// Select Group
type SelectGroupProps = React.HTMLAttributes<HTMLDivElement>

function SelectGroup({ className, ...props }: SelectGroupProps) {
    return (
        <div
            role="group"
            className={cn('', className)}
            {...props}
        />
    )
}

// Select Label
type SelectLabelProps = React.HTMLAttributes<HTMLDivElement>

function SelectLabel({ className, ...props }: SelectLabelProps) {
    return (
        <div
            className={cn(
                'px-2 py-1.5 text-xs font-semibold text-gray-500',
                className
            )}
            {...props}
        />
    )
}

// Select Separator
function SelectSeparator({ className }: { className?: string }) {
    return (
        <div
            className={cn('my-1 h-px bg-gray-200', className)}
            role="separator"
        />
    )
}

export {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
}
