'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Star, X } from 'lucide-react';

/**
 * StoreSearch Component
 * 
 * This component fetches stores from /api/stores endpoint.
 * Make sure to implement the API route at:
 * - GET /api/stores - Returns all stores
 * - GET /api/stores?search=query - Returns filtered stores
 * 
 * Expected API response format:
 * {
 *   stores: Array<{
 *     id: string;
 *     name: string;
 *     location?: string;
 *     rating?: number;
 *     hours?: string;
 *   }>
 * }
 */

interface Store {
  id: string;
  name: string;
  location?: string;
  rating?: number;
  hours?: string;
}

interface StoreSearchProps {
  onSelect: (store: Store) => void;
  onCancel: () => void;
  selectedStore?: Store | null;
}

export default function StoreSearch({ onSelect, onCancel, selectedStore }: StoreSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch stores from API
  const fetchStores = async (query: string = '') => {
    setLoading(true);
    setError(null);
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/stores${query ? `?search=${encodeURIComponent(query)}` : ''}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStores(data.stores || []);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError('حدث خطأ في تحميل المتاجر. يرجى المحاولة مرة أخرى.');
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStores();
  }, []);

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchStores(searchTerm.trim());
      } else {
        fetchStores();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleStoreSelect = (store: Store) => {
    onSelect(store);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">اختر المتجر</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن متجر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Store List */}
        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">جاري البحث...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              <div className="w-12 h-12 mx-auto mb-3 text-red-300">⚠️</div>
              <p className="font-medium">{error}</p>
              <button
                onClick={() => fetchStores(searchTerm)}
                className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : stores.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لم يتم العثور على متاجر</p>
              {searchTerm ? (
                <p className="text-sm">جرب مصطلح بحث مختلف</p>
              ) : (
                <p className="text-sm">لا توجد متاجر متاحة حالياً</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {stores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => handleStoreSelect(store)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedStore?.id === store.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{store.name}</h4>
                      
                      {store.location && (
                        <div className="flex items-center text-gray-600 text-sm mb-1">
                          <MapPin className="w-4 h-4 ml-1" />
                          {store.location}
                        </div>
                      )}
                      
                      {store.hours && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="w-4 h-4 ml-1" />
                          {store.hours}
                        </div>
                      )}
                    </div>
                    
                    {store.rating && (
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Star className="w-4 h-4 ml-1 fill-current" />
                        {store.rating}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            {selectedStore && (
              <button
                onClick={() => handleStoreSelect(selectedStore)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                اختيار المتجر
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



