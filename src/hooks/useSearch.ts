import { useState, useEffect, useMemo } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useSearch<T>(
  items: T[],
  searchTerm: string,
  searchKey: keyof T,
  delay: number = 300
) {
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm) return items;
    
    return items.filter(item => {
      const value = item[searchKey];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      }
      return false;
    });
  }, [items, debouncedSearchTerm, searchKey]);

  return filteredItems;
}


