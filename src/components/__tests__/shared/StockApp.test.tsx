import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StockApp } from '../../shared/StockApp'

// Mock the medusa service
jest.mock('@/domains/marketplace/services/medusa', () => ({
  getProducts: jest.fn(() => Promise.resolve([
    { id: 1, title: 'Product 1', price: 100, inventory_quantity: 10 },
    { id: 2, title: 'Product 2', price: 200, inventory_quantity: 5 },
  ])),
}))

describe('StockApp', () => {
  it('renders stock management interface', async () => {
    render(<StockApp />)
    
    expect(screen.getByText('Stock Management')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
      expect(screen.getByText('Product 2')).toBeInTheDocument()
    })
  })

  it('handles search functionality', async () => {
    render(<StockApp />)
    
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/search/i)
    fireEvent.change(searchInput, { target: { value: 'Product 1' } })
    
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
      expect(screen.queryByText('Product 2')).not.toBeInTheDocument()
    })
  })

  it('displays loading state initially', () => {
    render(<StockApp />)
    expect(screen.getByText('Loading stock data...')).toBeInTheDocument()
  })
})


