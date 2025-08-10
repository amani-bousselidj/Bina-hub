// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Grid,
  List,
  Download,
  Upload
} from 'lucide-react';

interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  status: 'draft' | 'published' | 'proposed' | 'rejected';
  thumbnail?: string;
  variants: MedusaProductVariant[];
  categories?: MedusaProductCategory[];
  tags?: MedusaProductTag[];
  created_at: string;
  updated_at: string;
}

interface MedusaProductVariant {
  id: string;
  title: string;
  sku?: string;
  barcode?: string;
  inventory_quantity: number;
  allow_backorder: boolean;
  manage_inventory: boolean;
  prices: MedusaPrice[];
}

interface MedusaPrice {
  id: string;
  currency_code: string;
  amount: number;
  region_id?: string;
}

interface MedusaProductCategory {
  id: string;
  name: string;
  handle: string;
}

interface MedusaProductTag {
  id: string;
  value: string;
}

const MedusaProductManagement: React.FC = () => {
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    loadMedusaProducts();
  }, []);

  const loadMedusaProducts = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Medusa API call
      // const response = await fetch('/api/medusa/products');
      // const data = await response.json();
      
      // Mock data for now - replace with actual Medusa integration
      const mockProducts: MedusaProduct[] = [
        {
          id: 'prod_01HWXYZ123',
          title: 'Construction Materials Bundle',
          handle: 'construction-materials-bundle',
          description: 'Essential construction materials for residential projects',
          status: 'published',
          thumbnail: '/images/construction-bundle.jpg',
          variants: [
            {
              id: 'variant_01HWXYZ456',
              title: 'Standard Bundle',
              sku: 'CONST-BUNDLE-STD',
              barcode: '1234567890123',
              inventory_quantity: 50,
              allow_backorder: false,
              manage_inventory: true,
              prices: [
                {
                  id: 'price_01HWXYZ789',
                  currency_code: 'SAR',
                  amount: 150000 // 1500.00 SAR in cents
                }
              ]
            }
          ],
          categories: [
            {
              id: 'cat_construction',
              name: 'Construction Materials',
              handle: 'construction-materials'
            }
          ],
          tags: [
            { id: 'tag_1', value: 'construction' },
            { id: 'tag_2', value: 'materials' },
            { id: 'tag_3', value: 'bundle' }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading Medusa products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.handle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for products:`, selectedProducts);
    // TODO: Implement bulk actions with Medusa API
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading Medusa products...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Powered by Medusa Commerce</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => alert('Button clicked')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" onClick={() => alert('Button clicked')}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" onClick={() => alert('Button clicked')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="proposed">Proposed</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('unpublish')}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
              >
                Unpublish
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleProductSelect(product.id)}
                    className="rounded"
                  />
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.status === 'published' ? 'bg-green-100 text-green-800' :
                    product.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    product.status === 'proposed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
                
                {product.thumbnail && (
                  <img 
                    src={product.thumbnail} 
                    alt={product.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                
                {product.variants.length > 0 && (
                  <div className="text-sm text-gray-600 mb-2">
                    <div className="flex justify-between">
                      <span>Stock:</span>
                      <span>{product.variants[0].inventory_quantity}</span>
                    </div>
                    {product.variants[0].prices.length > 0 && (
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span>{(product.variants[0].prices[0].amount / 100).toFixed(2)} {product.variants[0].prices[0].currency_code}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-600 hover:text-blue-600" onClick={() => alert('Button clicked')}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-blue-600" onClick={() => alert('Button clicked')}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-red-600" onClick={() => alert('Button clicked')}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(filteredProducts.map(p => p.id));
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleProductSelect(product.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.thumbnail && (
                          <img 
                            src={product.thumbnail} 
                            alt={product.title}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'published' ? 'bg-green-100 text-green-800' :
                        product.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        product.status === 'proposed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.variants.length > 0 ? product.variants[0].inventory_quantity : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.variants.length > 0 && product.variants[0].prices.length > 0 
                        ? `${(product.variants[0].prices[0].amount / 100).toFixed(2)} ${product.variants[0].prices[0].currency_code}`
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" onClick={() => alert('Button clicked')}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" onClick={() => alert('Button clicked')}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => alert('Button clicked')}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first product'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default MedusaProductManagement;





