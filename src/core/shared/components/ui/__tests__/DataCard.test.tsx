import { render, screen } from '@testing-library/react'
import DataCard from '../DataCard'

describe('DataCard', () => {
  it('renders with title and value', () => {
    render(<DataCard title="Test Card" value="123" />)
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('renders with subtitle', () => {
    render(<DataCard title="Test Card" value={100} subtitle="Test subtitle" />)
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('Test subtitle')).toBeInTheDocument()
  })

  it('renders with trend', () => {
    render(<DataCard title="Test Card" value={100} trend={{ value: 10, direction: 'up' }} />)
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    render(<DataCard title="Test Card" value={100} variant="success" />)
    expect(screen.getByText('Test Card')).toBeInTheDocument()
  })
})


