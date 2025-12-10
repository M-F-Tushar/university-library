import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

describe('Card', () => {
    it('renders children correctly', () => {
        render(<Card>Card content</Card>)
        expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies default variant styles', () => {
        render(<Card data-testid="card">Content</Card>)
        const card = screen.getByTestId('card')
        expect(card).toHaveClass('border', 'border-gray-200', 'bg-white')
    })

    it('applies bordered variant styles', () => {
        render(<Card variant="bordered" data-testid="card">Content</Card>)
        const card = screen.getByTestId('card')
        expect(card).toHaveClass('border-2', 'border-gray-300')
    })

    it('applies elevated variant styles', () => {
        render(<Card variant="elevated" data-testid="card">Content</Card>)
        const card = screen.getByTestId('card')
        expect(card).toHaveClass('shadow-lg')
    })

    it('applies interactive styles when interactive', () => {
        render(<Card interactive data-testid="card">Content</Card>)
        const card = screen.getByTestId('card')
        expect(card).toHaveClass('cursor-pointer')
        expect(card).toHaveAttribute('tabindex', '0')
    })
})

describe('CardHeader', () => {
    it('renders children correctly', () => {
        render(<CardHeader>Header content</CardHeader>)
        expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('applies divided styles when divided', () => {
        render(<CardHeader divided data-testid="header">Header</CardHeader>)
        const header = screen.getByTestId('header')
        expect(header).toHaveClass('border-b')
    })
})

describe('CardTitle', () => {
    it('renders as h3', () => {
        render(<CardTitle>Title</CardTitle>)
        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Title')
    })
})

describe('CardDescription', () => {
    it('renders description text', () => {
        render(<CardDescription>Description text</CardDescription>)
        expect(screen.getByText('Description text')).toBeInTheDocument()
    })

    it('applies gray text color', () => {
        render(<CardDescription data-testid="desc">Description</CardDescription>)
        expect(screen.getByTestId('desc')).toHaveClass('text-gray-500')
    })
})

describe('CardContent', () => {
    it('renders children correctly', () => {
        render(<CardContent>Content here</CardContent>)
        expect(screen.getByText('Content here')).toBeInTheDocument()
    })
})

describe('CardFooter', () => {
    it('renders children correctly', () => {
        render(<CardFooter>Footer content</CardFooter>)
        expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('applies divided styles when divided', () => {
        render(<CardFooter divided data-testid="footer">Footer</CardFooter>)
        const footer = screen.getByTestId('footer')
        expect(footer).toHaveClass('border-t')
    })
})

describe('Full Card composition', () => {
    it('renders complete card structure', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description</CardDescription>
                </CardHeader>
                <CardContent>Main content</CardContent>
                <CardFooter>Footer</CardFooter>
            </Card>
        )

        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Card Title')
        expect(screen.getByText('Card description')).toBeInTheDocument()
        expect(screen.getByText('Main content')).toBeInTheDocument()
        expect(screen.getByText('Footer')).toBeInTheDocument()
    })
})
