import { render, screen } from '@testing-library/react'
import { LoadingSpinner, LoadingState } from '../LoadingComponents'

describe('LoadingComponents', () => {
  describe('LoadingSpinner', () => {
    it('renders with default size', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('w-6', 'h-6')
    })

    it('renders with custom size', () => {
      render(<LoadingSpinner size="lg" />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('h-12', 'w-12')
    })

    it('renders without extra props', () => {
      render(<LoadingSpinner />)
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })
  })

  describe('LoadingState', () => {
    it('renders with default props', () => {
      render(<LoadingState />)
      const state = screen.getByTestId('loading-state')
      expect(state).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('renders with custom message', () => {
      render(<LoadingState message="Custom loading..." />)
      expect(screen.getByText('Custom loading...')).toBeInTheDocument()
    })
  })
})


