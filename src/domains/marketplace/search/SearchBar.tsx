import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

/**
 * Advanced search bar for marketplace
 * Searches across all stores and products
 */
export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "ابحث عن المنتجات والمتاجر..." 
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 text-gray-900 bg-white rounded-lg shadow-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          dir="rtl"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Quick Search Suggestions */}
      <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 mt-1 z-10 hidden">
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-2">البحث الشائع:</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200">
              مواد البناء
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200">
              أدوات كهربائية
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200">
              سيراميك
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;



