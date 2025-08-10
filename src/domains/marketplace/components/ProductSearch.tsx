'use client';

import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ProductSearchProps {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  value,
  onSearch,
  placeholder = 'البحث في المنتجات...',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
        className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        dir="rtl"
      />
      
      {value && (
        <button
          onClick={() => onSearch('')}
          className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ProductSearch;



