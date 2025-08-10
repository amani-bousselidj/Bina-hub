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
  searchKeys: (keyof T)[],
  initialSearchTerm: string = ''
) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return items;
    
    return items.filter(item => {
      return searchKeys.some(key => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        }
        return false;
      });
    });
  }, [items, debouncedSearchTerm, searchKeys]);

  const clearSearch = () => setSearchTerm('');

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    clearSearch
  };
}


