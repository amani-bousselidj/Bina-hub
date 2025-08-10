import { renderHook, waitFor } from '@testing-library/react';
import { useAsyncData } from '../useAsyncData';

// Mock function that resolves after a delay
const mockAsyncFunction = (data: any, delay = 100) => 
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

// Mock function that rejects
const mockAsyncError = (error = new Error('Test error')) => 
  new Promise((_, reject) => setTimeout(() => reject(error), 100));

describe('useAsyncData', () => {
  it('should handle successful data fetching', async () => {
    const testData = { id: 1, name: 'Test' };
    const fetchFn = () => mockAsyncFunction(testData);

    const { result } = renderHook(() => useAsyncData(fetchFn));

    // Initially should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(testData);
    expect(result.current.error).toBe(null);
  });

  it('should handle errors correctly', async () => {
    const errorMessage = 'Network error';
    const fetchFn = () => mockAsyncError(new Error(errorMessage));

    const { result } = renderHook(() => useAsyncData(fetchFn));

    // Initially should be loading
    expect(result.current.loading).toBe(true);

    // Wait for error to occur
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should use initial data when provided', () => {
    const initialData = { id: 0, name: 'Initial' };
    const fetchFn = () => mockAsyncFunction({ id: 1, name: 'Fetched' });

    const { result } = renderHook(() => 
      useAsyncData(fetchFn, { initialData })
    );

    expect(result.current.data).toEqual(initialData);
  });

  it('should refresh data when refresh is called', async () => {
    let callCount = 0;
    const fetchFn = () => {
      callCount++;
      return mockAsyncFunction({ call: callCount });
    };

    const { result } = renderHook(() => useAsyncData(fetchFn));

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ call: 1 });

    // Call refresh
    result.current.refresh();

    // Wait for refresh to complete
    await waitFor(() => {
      expect(result.current.data).toEqual({ call: 2 });
    });
  });

  it('should re-fetch when dependencies change', async () => {
    let fetchArg = 'initial';
    const fetchFn = () => mockAsyncFunction({ arg: fetchArg });

    const { result, rerender } = renderHook(
      ({ arg }) => useAsyncData(() => mockAsyncFunction({ arg }), { deps: [arg] }),
      { initialProps: { arg: 'initial' } }
    );

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ arg: 'initial' });

    // Change dependency
    rerender({ arg: 'updated' });

    // Wait for re-fetch
    await waitFor(() => {
      expect(result.current.data).toEqual({ arg: 'updated' });
    });
  });
});


