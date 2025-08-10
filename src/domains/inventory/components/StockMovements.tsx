// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  Search, 
  Filter, 
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';

interface MedusaInventoryItem {
  id: string;
  sku?: string;
  variant_id: string;
  location_id: string;
  stocked_quantity: number;
  reserved_quantity: number;
  incoming_quantity: number;
  available_quantity: number;
  created_at: string;
  updated_at: string;
}

interface MedusaStockMovement {
  id: string;
  inventory_item_id: string;
  location_id: string;
  quantity: number;
  type: 'stock_adjustment' | 'sale' | 'return' | 'transfer' | 'reservation';
  reference_id?: string;
  reference_type?: string;
  reason?: string;
  created_at: string;
  metadata?: Record<string, any>;
  product_title?: string;
  variant_title?: string;
  sku?: string;
  location_name?: string;
}

interface StockSummary {
  total_items: number;
  low_stock_items: number;
  out_of_stock_items: number;
  total_movements_today: number;
  total_value: number;
}

const MedusaStockMovements: React.FC = () => {
  const [movements, setMovements] = useState<MedusaStockMovement[]>([]);
  const [inventoryItems, setInventoryItems] = useState<MedusaInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [stockSummary, setStockSummary] = useState<StockSummary | null>(null);
  const [selectedMovement, setSelectedMovement] = useState<MedusaStockMovement | null>(null);

  useEffect(() => {
    loadMedusaStockData();
  }, []);

  const loadMedusaStockData = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual Medusa API calls
      // const movementsResponse = await fetch('/api/medusa/stock-movements');
      // const inventoryResponse = await fetch('/api/medusa/inventory-items');
      
      // Mock data for now - replace with actual Medusa integration
      const mockMovements: MedusaStockMovement[] = [
        {
          id: 'smov_01HWXYZ123',
          inventory_item_id: 'iitem_01HWXYZ456',
          location_id: 'sloc_01HWXYZ789',
          quantity: -5,
          type: 'sale',
          reference_id: 'order_01HWXYZ012',
          reference_type: 'order',
          reason: 'Customer purchase',
          created_at: new Date().toISOString(),
          metadata: { customer_id: 'cus_01HWXYZ345' },
          product_title: 'خرسانة جاهزة - درجة 350',
          variant_title: 'كيس 50 كيلو',
          sku: 'CONCRETE-350-50KG',
          location_name: 'Main Warehouse'
        },
        {
          id: 'smov_01HWXYZ124',
          inventory_item_id: 'iitem_01HWXYZ457',
          location_id: 'sloc_01HWXYZ789',
          quantity: 100,
          type: 'stock_adjustment',
          reference_id: 'adj_01HWXYZ013',
          reference_type: 'adjustment',
          reason: 'New stock received',
          created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          metadata: { supplier_id: 'sup_01HWXYZ678' },
          product_title: 'حديد تسليح 16مم',
          variant_title: 'قضيب 12 متر',
          sku: 'REBAR-16MM-12M',
          location_name: 'Main Warehouse'
        }
      ];

      const mockInventoryItems: MedusaInventoryItem[] = [
        {
          id: 'iitem_01HWXYZ456',
          sku: 'CONCRETE-350-50KG',
          variant_id: 'variant_01HWXYZ123',
          location_id: 'sloc_01HWXYZ789',
          stocked_quantity: 145,
          reserved_quantity: 15,
          incoming_quantity: 50,
          available_quantity: 130,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const mockSummary: StockSummary = {
        total_items: 156,
        low_stock_items: 12,
        out_of_stock_items: 3,
        total_movements_today: 23,
        total_value: 450000 // In cents
      };

      setMovements(mockMovements);
      setInventoryItems(mockInventoryItems);
      setStockSummary(mockSummary);
    } catch (error) {
      console.error('Error loading Medusa stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.product_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const movementDate = new Date(movement.created_at);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - movementDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today':
          matchesDate = daysDiff === 0;
          break;
        case 'week':
          matchesDate = daysDiff <= 7;
          break;
        case 'month':
          matchesDate = daysDiff <= 30;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getMovementIcon = (type: string, quantity: number) => {
    if (quantity > 0) {
      return <ArrowUp className="w-4 h-4 text-green-600" />;
    } else {
      return <ArrowDown className="w-4 h-4 text-red-600" />;
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-red-100 text-red-800';
      case 'stock_adjustment':
        return 'bg-blue-100 text-blue-800';
      case 'return':
        return 'bg-green-100 text-green-800';
      case 'transfer':
        return 'bg-yellow-100 text-yellow-800';
      case 'reservation':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading Medusa inventory data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Movements</h1>
          <p className="text-gray-600">Powered by Medusa Commerce</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadMedusaStockData}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => alert('Button clicked')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {stockSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stockSummary.total_items}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stockSummary.low_stock_items}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <TrendingDown className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stockSummary.out_of_stock_items}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Today's Movements</p>
                <p className="text-2xl font-bold text-gray-900">{stockSummary.total_movements_today}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{(stockSummary.total_value / 100).toFixed(0)} SAR</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search movements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="sale">Sales</option>
            <option value="stock_adjustment">Adjustments</option>
            <option value="return">Returns</option>
            <option value="transfer">Transfers</option>
            <option value="reservation">Reservations</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{movement.product_title}</div>
                      <div className="text-sm text-gray-500">{movement.variant_title}</div>
                      <div className="text-xs text-gray-400">SKU: {movement.sku}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getMovementTypeColor(movement.type)}`}>
                      {movement.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getMovementIcon(movement.type, movement.quantity)}
                      <span className={`ml-2 text-sm font-medium ${
                        movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(movement.quantity)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movement.location_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(movement.created_at).toLocaleDateString('en-US')}
                    <div className="text-xs">
                      {new Date(movement.created_at).toLocaleTimeString('ar-SA')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedMovement(movement)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredMovements.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No movements found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || typeFilter !== 'all' || dateFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Stock movements will appear here as they occur'
            }
          </p>
        </div>
      )}

      {/* Movement Detail Modal */}
      {selectedMovement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Movement Details</h3>
              <button
                onClick={() => setSelectedMovement(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div><span className="font-medium">Product:</span> {selectedMovement.product_title}</div>
              <div><span className="font-medium">Variant:</span> {selectedMovement.variant_title}</div>
              <div><span className="font-medium">SKU:</span> {selectedMovement.sku}</div>
              <div><span className="font-medium">Type:</span> {selectedMovement.type.replace('_', ' ')}</div>
              <div><span className="font-medium">Quantity:</span> {selectedMovement.quantity}</div>
              <div><span className="font-medium">Location:</span> {selectedMovement.location_name}</div>
              <div><span className="font-medium">Date:</span> {new Date(selectedMovement.created_at).toLocaleString('en-US')}</div>
              {selectedMovement.reason && (
                <div><span className="font-medium">Reason:</span> {selectedMovement.reason}</div>
              )}
              {selectedMovement.reference_id && (
                <div><span className="font-medium">Reference:</span> {selectedMovement.reference_id}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedusaStockMovements;





