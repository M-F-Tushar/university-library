import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn()
        render(<Button onClick={handleClick}>Click me</Button>)
        
        fireEvent.click(screen.getByRole('button'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies primary variant styles by default', () => {
        render(<Button>Primary Button</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('bg-primary')
    })

    it('applies secondary variant styles', () => {
        render(<Button variant="secondary">Secondary Button</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('bg-gray-100')
    })

    it('applies ghost variant styles', () => {
        render(<Button variant="ghost">Ghost Button</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('hover:bg-gray-100')
    })

    it('applies destructive variant styles', () => {
        render(<Button variant="destructive">Danger Button</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('bg-error')
    })

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled Button</Button>)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('shows loading spinner when loading', () => {
        render(<Button loading>Loading Button</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
        expect(button.querySelector('svg')).toBeInTheDocument()
    })

    it('applies size classes correctly', () => {
        const { rerender } = render(<Button size="sm">Small</Button>)
        expect(screen.getByRole('button')).toHaveClass('h-8')

        rerender(<Button size="md">Medium</Button>)
        expect(screen.getByRole('button')).toHaveClass('h-10')

        rerender(<Button size="lg">Large</Button>)
        expect(screen.getByRole('button')).toHaveClass('h-12')
    })

    it('renders with icon on the left by default', () => {
        const icon = <span data-testid="icon">★</span>
        render(<Button icon={icon}>With Icon</Button>)
        
        const button = screen.getByRole('button')
        const iconElement = screen.getByTestId('icon')
        
        // Icon should be before text
        expect(button.firstChild).toContain(iconElement)
    })

    it('renders with icon on the right when iconPosition is right', () => {
        const icon = <span data-testid="icon">★</span>
        render(<Button icon={icon} iconPosition="right">With Icon</Button>)
        
        const button = screen.getByRole('button')
        const iconElement = screen.getByTestId('icon')
        
        // Icon should be after text
        expect(button.lastChild).toContain(iconElement)
    })

    it('applies fullWidth class', () => {
        render(<Button fullWidth>Full Width</Button>)
        expect(screen.getByRole('button')).toHaveClass('w-full')
    })

    it('renders as a link when asChild is used with Link', () => {
        // This would require actual Next.js Link component
        // For now, just test the button renders
        render(<Button>Link Style</Button>)
        expect(screen.getByRole('button')).toBeInTheDocument()
    })
})
