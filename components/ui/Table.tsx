import * as React from 'react'
import { cn } from './Button'

// Table
type TableProps = React.HTMLAttributes<HTMLTableElement>

const Table = React.forwardRef<HTMLTableElement, TableProps>(
    ({ className, ...props }, ref) => (
        <div className="relative w-full overflow-auto">
            <table
                ref={ref}
                className={cn('w-full caption-bottom text-sm', className)}
                {...props}
            />
        </div>
    )
)
Table.displayName = 'Table'

// Table Header
type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
    ({ className, ...props }, ref) => (
        <thead
            ref={ref}
            className={cn('[&_tr]:border-b', className)}
            {...props}
        />
    )
)
TableHeader.displayName = 'TableHeader'

// Table Body
type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
    ({ className, ...props }, ref) => (
        <tbody
            ref={ref}
            className={cn('[&_tr:last-child]:border-0', className)}
            {...props}
        />
    )
)
TableBody.displayName = 'TableBody'

// Table Footer
type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement>

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
    ({ className, ...props }, ref) => (
        <tfoot
            ref={ref}
            className={cn(
                'border-t bg-gray-50/50 font-medium [&>tr]:last:border-b-0',
                className
            )}
            {...props}
        />
    )
)
TableFooter.displayName = 'TableFooter'

// Table Row
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    clickable?: boolean
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
    ({ className, clickable, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn(
                'border-b transition-colors',
                'hover:bg-gray-50/50 data-[state=selected]:bg-gray-50',
                clickable && 'cursor-pointer',
                className
            )}
            {...props}
        />
    )
)
TableRow.displayName = 'TableRow'

// Table Head
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    sortable?: boolean
    sorted?: 'asc' | 'desc' | false
    onSort?: () => void
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
    ({ className, sortable, sorted, onSort, children, ...props }, ref) => (
        <th
            ref={ref}
            className={cn(
                'h-12 px-4 text-left align-middle font-medium text-gray-500',
                '[&:has([role=checkbox])]:pr-0',
                sortable && 'cursor-pointer select-none hover:text-gray-700',
                className
            )}
            onClick={sortable ? onSort : undefined}
            {...props}
        >
            <div className="flex items-center gap-2">
                {children}
                {sortable && sorted && (
                    <svg
                        className={cn(
                            'h-4 w-4',
                            sorted === 'desc' && 'rotate-180'
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                        />
                    </svg>
                )}
            </div>
        </th>
    )
)
TableHead.displayName = 'TableHead'

// Table Cell
type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
    ({ className, ...props }, ref) => (
        <td
            ref={ref}
            className={cn(
                'p-4 align-middle [&:has([role=checkbox])]:pr-0',
                className
            )}
            {...props}
        />
    )
)
TableCell.displayName = 'TableCell'

// Table Caption
type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement>

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
    ({ className, ...props }, ref) => (
        <caption
            ref={ref}
            className={cn('mt-4 text-sm text-gray-500', className)}
            {...props}
        />
    )
)
TableCaption.displayName = 'TableCaption'

// Empty State for Table
interface TableEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: React.ReactNode
    title?: string
    description?: string
    action?: React.ReactNode
    colSpan?: number
}

function TableEmpty({
    icon,
    title = 'No data',
    description,
    action,
    colSpan = 1,
    className,
    ...props
}: TableEmptyProps) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="h-48">
                <div
                    className={cn(
                        'flex flex-col items-center justify-center text-center',
                        className
                    )}
                    {...props}
                >
                    {icon && (
                        <div className="mb-4 text-gray-400">
                            {icon}
                        </div>
                    )}
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    {description && (
                        <p className="mt-1 text-sm text-gray-500">{description}</p>
                    )}
                    {action && <div className="mt-4">{action}</div>}
                </div>
            </TableCell>
        </TableRow>
    )
}

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
    TableEmpty,
}
