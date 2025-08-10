import { render, screen } from '@testing-library/react'
import { LoadingSpinner, LoadingState } from '../LoadingComponents'

describe('LoadingComponents', () => {
  describe('LoadingSpinner', () => {
    it('renders with default size', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toBeInTheDocument()
    })

    it('renders with custom size', () => {
      render(<LoadingSpinner size="lg" />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('h-12', 'w-12')
    })
  })

  describe('LoadingState', () => {
    it('renders with default message', () => {
      render(<LoadingState />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      const state = screen.getByTestId('loading-state')
      expect(state).toBeInTheDocument()
    })

    it('renders with custom message and size', () => {
      render(<LoadingState message="Custom..." size="sm" />)
      expect(screen.getByText('Custom...')).toBeInTheDocument()
    })
  })
})


