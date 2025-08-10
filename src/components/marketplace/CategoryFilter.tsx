'use client';

import React from 'react';
import { useCategories } from '../../hooks/useMarketplace';

interface CategoryFilterProps {
  categories: Array<{ id: string; name: string; count: number }>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories: propCategories,
  activeCategory,
  onCategoryChange,
  className = '',
}) => {
  const { categories: hookCategories, loading } = useCategories();
  
  // Use passed categories or hook categories
  const categories = propCategories.length > 0 ? propCategories : hookCategories;

  // Add "All" category to the beginning
  const allCategories = [
    {
      id: 'all',
      name: 'جميع المنتجات',
      count: 0
    },
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: 'count' in cat ? cat.count : ('productCount' in cat ? (cat as any).productCount : 0)
    }))
  ];

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">الفئات</h3>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">الفئات</h3>
      
      <div className="space-y-2">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full text-right p-3 rounded-lg transition-all duration-200 flex items-center justify-between hover:bg-gray-50 ${
              activeCategory === category.id
                ? 'bg-blue-50 border-blue-200 text-blue-700 border'
                : 'text-gray-700 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">{category.name}</span>
            </div>
            
            {category.count !== undefined && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeCategory === category.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">فلتر سريع</h4>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>متوفر في المخزن</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>منتجات مضمونة</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>توصيل مجاني</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;


