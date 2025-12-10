import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input, Textarea } from '@/components/ui/Input'

describe('Input', () => {
    it('renders input element', () => {
        render(<Input placeholder="Enter text" />)
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('renders with label', () => {
        render(<Input label="Email" id="email" />)
        expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })

    it('shows required indicator', () => {
        render(<Input label="Email" required />)
        expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('shows helper text', () => {
        render(<Input helperText="Enter your email address" />)
        expect(screen.getByText('Enter your email address')).toBeInTheDocument()
    })

    it('shows error message', () => {
        render(<Input error="Email is required" />)
        expect(screen.getByText('Email is required')).toBeInTheDocument()
        expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('applies error styles when error is present', () => {
        render(<Input error="Error" data-testid="input" />)
        const input = screen.getByTestId('input')
        expect(input).toHaveClass('border-error')
    })

    it('applies success styles', () => {
        render(<Input success data-testid="input" />)
        const input = screen.getByTestId('input')
        expect(input).toHaveClass('border-success')
    })

    it('calls onChange when value changes', () => {
        const handleChange = vi.fn()
        render(<Input onChange={handleChange} />)
        
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
        expect(handleChange).toHaveBeenCalled()
    })

    it('renders prefix element', () => {
        render(<Input prefix={<span data-testid="prefix">$</span>} />)
        expect(screen.getByTestId('prefix')).toBeInTheDocument()
    })

    it('renders suffix element', () => {
        render(<Input suffix={<span data-testid="suffix">.com</span>} />)
        expect(screen.getByTestId('suffix')).toBeInTheDocument()
    })

    it('shows clear button when clearable and has value', () => {
        const handleClear = vi.fn()
        render(<Input clearable value="test" onClear={handleClear} />)
        
        const clearButton = screen.getByLabelText('Clear input')
        fireEvent.click(clearButton)
        expect(handleClear).toHaveBeenCalled()
    })

    it('is disabled when disabled prop is true', () => {
        render(<Input disabled />)
        expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('sets aria-invalid when error is present', () => {
        render(<Input error="Error" />)
        expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })
})

describe('Textarea', () => {
    it('renders textarea element', () => {
        render(<Textarea placeholder="Enter text" />)
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('renders with label', () => {
        render(<Textarea label="Description" id="description" />)
        expect(screen.getByLabelText('Description')).toBeInTheDocument()
    })

    it('shows error message', () => {
        render(<Textarea error="Description is required" />)
        expect(screen.getByText('Description is required')).toBeInTheDocument()
    })

    it('is disabled when disabled prop is true', () => {
        render(<Textarea disabled />)
        expect(screen.getByRole('textbox')).toBeDisabled()
    })
})
