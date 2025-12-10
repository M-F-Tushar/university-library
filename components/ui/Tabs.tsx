import * as React from 'react'
import { cn } from './Button'

interface TabsContextValue {
    activeTab: string
    setActiveTab: (tab: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function useTabs() {
    const context = React.useContext(TabsContext)
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs provider')
    }
    return context
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
}

function Tabs({
    defaultValue,
    value,
    onValueChange,
    className,
    children,
    ...props
}: TabsProps) {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '')
    
    const activeTab = value !== undefined ? value : internalValue
    const setActiveTab = React.useCallback(
        (tab: string) => {
            if (value === undefined) {
                setInternalValue(tab)
            }
            onValueChange?.(tab)
        },
        [value, onValueChange]
    )

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={cn('w-full', className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    )
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'pills' | 'underline'
}

function TabsList({
    variant = 'default',
    className,
    children,
    ...props
}: TabsListProps) {
    const variantClasses = {
        default: 'inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500',
        pills: 'inline-flex items-center gap-2',
        underline: 'inline-flex items-center border-b border-gray-200',
    }

    return (
        <div
            role="tablist"
            className={cn(variantClasses[variant], className)}
            {...props}
        >
            {children}
        </div>
    )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string
    variant?: 'default' | 'pills' | 'underline'
}

function TabsTrigger({
    value,
    variant = 'default',
    className,
    children,
    disabled,
    ...props
}: TabsTriggerProps) {
    const { activeTab, setActiveTab } = useTabs()
    const isActive = activeTab === value
    const ref = React.useRef<HTMLButtonElement>(null)

    const handleClick = () => {
        if (!disabled) {
            setActiveTab(value)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
        }
    }

    const variantClasses = {
        default: cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            isActive
                ? 'bg-white text-gray-950 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
        ),
        pills: cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            isActive
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        ),
        underline: cn(
            'inline-flex items-center justify-center whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        ),
    }

    return (
        <button
            ref={ref}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`tabpanel-${value}`}
            tabIndex={isActive ? 0 : -1}
            disabled={disabled}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={cn(variantClasses[variant], className)}
            {...props}
        >
            {children}
        </button>
    )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
    forceMount?: boolean
}

function TabsContent({
    value,
    forceMount = false,
    className,
    children,
    ...props
}: TabsContentProps) {
    const { activeTab } = useTabs()
    const isActive = activeTab === value

    if (!forceMount && !isActive) {
        return null
    }

    return (
        <div
            role="tabpanel"
            id={`tabpanel-${value}`}
            aria-labelledby={`tab-${value}`}
            hidden={!isActive}
            tabIndex={0}
            className={cn(
                'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                !isActive && 'hidden',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

// Icon tabs variant
interface TabWithIconProps extends TabsTriggerProps {
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right' | 'top'
}

function TabWithIcon({
    icon,
    iconPosition = 'left',
    children,
    className,
    ...props
}: TabWithIconProps) {
    const iconContent = icon && (
        <span className={cn(
            iconPosition === 'top' ? 'mb-1' : '',
            iconPosition === 'left' ? 'mr-2' : '',
            iconPosition === 'right' ? 'ml-2' : ''
        )}>
            {icon}
        </span>
    )

    return (
        <TabsTrigger
            className={cn(
                iconPosition === 'top' && 'flex-col',
                className
            )}
            {...props}
        >
            {iconPosition === 'left' || iconPosition === 'top' ? iconContent : null}
            {children}
            {iconPosition === 'right' ? iconContent : null}
        </TabsTrigger>
    )
}

export {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    TabWithIcon,
    useTabs,
}
