// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';

interface MoneyAmount {
  currency_code: string;
  amount: number;
}

interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  inventory_quantity: number;
  prices: MoneyAmount[];
}

interface Product {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  handle: string;
  status: string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[];
}

interface ProductsResponse {
  products: Product[];
  count: number;
  offset: number;
  limit: number;
}

const EnhancedMedusaDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

  // Check health status
  const checkHealth = async () => {
    try {
      const response = await fetch(`${backendUrl}/health`);
      const data = await response.json();
      setHealthStatus(data);
    } catch (err) {
      console.error('Health check failed:', err);
    }
  };

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/store/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ProductsResponse = await response.json();
      setProducts(data.products || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load single product details
  const loadProductDetails = async (productId: string) => {
    try {
      const response = await fetch(`${backendUrl}/store/products/${productId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSelectedProduct(data.product);
    } catch (err) {
      console.error('Error loading product details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product details');
    }
  };

  useEffect(() => {
    checkHealth();
    loadProducts();
  }, []);

  const formatPrice = (amount: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount / 100);
  };

  const getVariantPriceRange = (variants: ProductVariant[]) => {
    if (!variants || variants.length === 0) return 'N/A';
    
    const prices = variants.flatMap(v => v.prices.map(p => p.amount));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return formatPrice(minPrice);
    }
    
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  const getTotalInventory = (variants: ProductVariant[]) => {
    return variants.reduce((total, variant) => total + variant.inventory_quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Medusa data...</p>
        </div>
      </div>
    );
  }

  if (error && !products.length) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
            <p className="mb-4">{error}</p>
            <p className="text-sm text-gray-600 mb-4">
              Make sure the Enhanced Medusa server is running on {backendUrl}
            </p>
            <button 
              onClick={() => {
                setError(null);
                loadProducts();
              }} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Construction Equipment Store</h1>
          <p className="text-gray-600 mb-4">Enhanced Medusa API Dashboard - Safety gear and construction equipment</p>
          
          {/* Health Status */}
          {healthStatus && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-green-800 font-medium">
                    Enhanced API Status: {healthStatus.status} ✨
                  </p>
                  <p className="text-green-600 text-sm">
                    Database: {healthStatus.database} | Uptime: {Math.round(healthStatus.uptime)}s | 
                    Service: {healthStatus.service}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && products.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">⚠️ Warning: {error}</p>
            <button 
              onClick={loadProducts}
              className="mt-2 text-yellow-600 hover:text-yellow-800 font-medium"
            >
              Refresh Data
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">🛒</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Products
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {products.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📦</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Variants
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {products.reduce((total, p) => total + p.variants.length, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📊</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Inventory
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {products.reduce((total, p) => total + getTotalInventory(p.variants), 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Published
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {products.filter(p => p.status === 'published').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                🏗️ Construction Products ({products.length})
              </h2>
              
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found</p>
                  <p className="text-gray-400 text-sm mt-2">Add some construction equipment to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                        selectedProduct?.id === product.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => loadProductDetails(product.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{product.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Handle: <code className="bg-gray-100 px-1 rounded">{product.handle}</code></span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              product.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {product.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-lg text-blue-600">
                            {getVariantPriceRange(product.variants)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-400">
                            Stock: {getTotalInventory(product.variants)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">📋 Product Details</h2>
              
              {!selectedProduct ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">🔍</div>
                  <p className="text-gray-500">
                    Click on a product to view detailed information
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{selectedProduct.title}</h3>
                    {selectedProduct.description && (
                      <p className="text-gray-600 text-sm mb-4">{selectedProduct.description}</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      🏷️ Variants ({selectedProduct.variants.length})
                    </h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedProduct.variants.map((variant) => (
                        <div key={variant.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-900">{variant.title}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                SKU: <code className="bg-white px-1 rounded">{variant.sku}</code>
                              </p>
                              <p className="text-xs text-gray-500">
                                Stock: <span className={`font-medium ${
                                  variant.inventory_quantity > 50 ? 'text-green-600' : 
                                  variant.inventory_quantity > 10 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {variant.inventory_quantity}
                                </span>
                              </p>
                            </div>
                            <div className="text-right ml-3">
                              {variant.prices.map((price, idx) => (
                                <p key={idx} className="font-bold text-sm text-green-600">
                                  {formatPrice(price.amount, price.currency_code)}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium mb-2">ℹ️ Metadata</h4>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>ID: <code className="bg-gray-100 px-1 rounded">{selectedProduct.id}</code></p>
                      <p>Created: {new Date(selectedProduct.created_at).toLocaleString('en-US')}</p>
                      <p>Updated: {new Date(selectedProduct.updated_at).toLocaleString('en-US')}</p>
                      <p>Total Inventory: <span className="font-medium">{getTotalInventory(selectedProduct.variants)}</span></p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* API Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">🔌 Enhanced API Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-blue-800 font-medium mb-2">Backend Configuration:</p>
              <p className="text-blue-700">URL: <code className="bg-blue-100 px-2 py-1 rounded">{backendUrl}</code></p>
              <p className="text-blue-700 mt-1">Status: <span className="font-medium">Enhanced API Active</span></p>
            </div>
            <div>
              <p className="text-blue-800 font-medium mb-2">Available Endpoints:</p>
              <ul className="text-blue-700 space-y-1">
                <li><code className="bg-blue-100 px-1 rounded">GET /store/products</code></li>
                <li><code className="bg-blue-100 px-1 rounded">GET /store/products/:id</code></li>
                <li><code className="bg-blue-100 px-1 rounded">GET /admin/products</code></li>
                <li><code className="bg-blue-100 px-1 rounded">GET /health</code></li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EnhancedMedusaDashboard;





