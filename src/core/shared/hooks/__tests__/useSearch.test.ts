import { renderHook, act } from '@testing-library/react'
import { useSearch } from '../useSearch'

describe('useSearch', () => {
  const mockData = [
    { id: 1, title: 'Apple iPhone', category: 'Electronics' },
    { id: 2, title: 'Samsung Galaxy', category: 'Electronics' },
    { id: 3, title: 'Nike Shoes', category: 'Footwear' },
  ]

  it('returns all data when no search term', () => {
    const { result } = renderHook(() => useSearch(mockData, ['title']))
    
    expect(result.current.filteredData).toEqual(mockData)
    expect(result.current.searchTerm).toBe('')
  })

  it('filters data by search term', () => {
    const { result } = renderHook(() => useSearch(mockData, ['title']))
    
    act(() => {
      result.current.setSearchTerm('iPhone')
    })
    
    expect(result.current.filteredData).toEqual([mockData[0]])
    expect(result.current.searchTerm).toBe('iPhone')
  })

  it('searches across multiple fields', () => {
    const { result } = renderHook(() => useSearch(mockData, ['title', 'category']))
    
    act(() => {
      result.current.setSearchTerm('Electronics')
    })
    
    expect(result.current.filteredData).toEqual([mockData[0], mockData[1]])
  })

  it('performs case-insensitive search', () => {
    const { result } = renderHook(() => useSearch(mockData, ['title']))
    
    act(() => {
      result.current.setSearchTerm('APPLE')
    })
    
    expect(result.current.filteredData).toEqual([mockData[0]])
  })

  it('clears search results', () => {
    const { result } = renderHook(() => useSearch(mockData, ['title']))
    
    act(() => {
      result.current.setSearchTerm('iPhone')
    })
    
    expect(result.current.filteredData).toEqual([mockData[0]])
    
    act(() => {
      result.current.clearSearch()
    })
    
    expect(result.current.filteredData).toEqual(mockData)
    expect(result.current.searchTerm).toBe('')
  })
})


