import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionButton from '../ActionButton';

// Mock the shadcn Button component
jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, className, disabled, ...props }: any) => (
    <button className={className} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('ActionButton', () => {
  it('renders with default props', () => {
    render(<ActionButton>Click me</ActionButton>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('applies correct variant classes', () => {
    render(<ActionButton variant="success">Success Button</ActionButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-green-600', 'hover:bg-green-700');
  });

  it('shows loading state correctly', () => {
    render(<ActionButton loading>Loading Button</ActionButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    
    // Check for loading spinner
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('displays icon when provided', () => {
    const TestIcon = () => <span data-testid="test-icon">🔥</span>;
    
    render(<ActionButton icon={<TestIcon />}>Button with Icon</ActionButton>);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('hides icon when loading', () => {
    const TestIcon = () => <span data-testid="test-icon">🔥</span>;
    
    render(<ActionButton icon={<TestIcon />} loading>Loading Button</ActionButton>);
    
    expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    
    render(<ActionButton onClick={handleClick}>Clickable Button</ActionButton>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct size classes', () => {
    render(<ActionButton size="lg">Large Button</ActionButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('is disabled when loading or explicitly disabled', () => {
    const { rerender } = render(<ActionButton disabled>Disabled Button</ActionButton>);
    expect(screen.getByRole('button')).toBeDisabled();

    rerender(<ActionButton loading>Loading Button</ActionButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});


