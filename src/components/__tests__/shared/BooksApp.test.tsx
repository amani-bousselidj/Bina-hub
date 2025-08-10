import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BooksApp } from '../../shared/BooksApp'

jest.mock('@/domains/marketplace/services/medusa', () => ({
  getProducts: jest.fn(() => Promise.resolve([
    { id: 1, title: 'Book 1', price: 25, category: 'Fiction' },
    { id: 2, title: 'Book 2', price: 30, category: 'Non-Fiction' },
  ])),
}))

describe('BooksApp', () => {
  it('renders books management interface', async () => {
    render(<BooksApp />)
    
    expect(screen.getByText('Books Management')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Book 1')).toBeInTheDocument()
      expect(screen.getByText('Book 2')).toBeInTheDocument()
    })
  })

  it('filters books by category', async () => {
    render(<BooksApp />)
    
    await waitFor(() => {
      expect(screen.getByText('Book 1')).toBeInTheDocument()
    })

    const categoryFilter = screen.getByDisplayValue('All Categories')
    fireEvent.change(categoryFilter, { target: { value: 'Fiction' } })
    
    await waitFor(() => {
      expect(screen.getByText('Book 1')).toBeInTheDocument()
      expect(screen.queryByText('Book 2')).not.toBeInTheDocument()
    })
  })

  it('displays loading state initially', () => {
    render(<BooksApp />)
    expect(screen.getByText('Loading books...')).toBeInTheDocument()
  })
})


