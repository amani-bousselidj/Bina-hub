import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import POSApp from '../POSApp'

jest.mock('@/domains/marketplace/services/medusa', () => ({
  getProducts: jest.fn(() => Promise.resolve([
    { id: 1, title: 'Item 1', price: 10 },
    { id: 2, title: 'Item 2', price: 15 },
  ])),
}))

describe('POSApp', () => {
  it('renders POS interface', async () => {
    render(<POSApp />)
    
    expect(screen.getByText('Point of Sale')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  it('adds items to cart', async () => {
    render(<POSApp />)
    
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    const addButton = screen.getAllByText('Add to Cart')[0]
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('Cart (1)')).toBeInTheDocument()
    })
  })

  it('calculates total correctly', async () => {
    render(<POSApp />)
    
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addButtons[0]) // Add Item 1 ($10)
    fireEvent.click(addButtons[1]) // Add Item 2 ($15)
    
    await waitFor(() => {
      expect(screen.getByText('Total: $25.00')).toBeInTheDocument()
    })
  })
})


