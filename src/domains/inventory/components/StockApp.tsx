/**
 * StockApp - Advanced Inventory Management System
 * Advanced Inventory Management with Medusa.js Integration
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductService, InventoryService } from '../../../lib/mock-medusa';

interface InventoryItem {
  id: string;
  sku: string;
  title: string;
  quantity: number;
  reserved_quantity: number;
  location: string;
  reorder_level: number;
  cost_price: number;
  selling_price: number;
  supplier: string;
  last_restocked: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  type: 'warehouse' | 'store' | 'distribution';
}

const StockApp = React.memo(() => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch inventory data from Medusa.js
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryService = new InventoryService();
        const inventoryData: any[] = await inventoryService.getInventoryItems();
        setInventory(inventoryData);
        
        // Filter low stock items
        const lowStock = inventoryData.filter(item => item.quantity <= item.reorder_level);
        setLowStockItems(lowStock);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleStockAdjustment = async (itemId: string, adjustment: number, reason: string) => {
    try {
      const inventoryService = new InventoryService();
      await inventoryService.adjustInventory(itemId, adjustment);
      
      // Update local state
      setInventory(inventory.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity + adjustment }
          : item
      ));
    } catch (error) {
      console.error('Error adjusting stock:', error);
    }
  };

  const handleReorder = async (itemId: string, quantity: number) => {
    try {
      // Create purchase order
      const purchaseOrder = {
        supplier: inventory.find(item => item.id === itemId)?.supplier,
        items: [{ product_id: itemId, quantity }],
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      // API call to create purchase order
      console.log('Creating purchase order:', purchaseOrder);
      
      alert(`Reorder request created for ${quantity} units`);
    } catch (error) {
      console.error('Error creating reorder:', error);
    }
  };

  const generateStockReport = () => {
    const report = {
      total_items: inventory.length,
      total_value: inventory.reduce((sum, item) => sum + (item.quantity * item.cost_price), 0),
      low_stock_items: lowStockItems.length,
      locations: locations.length,
      generated_at: new Date().toISOString(),
    };

    // Export report
    console.log('Stock Report:', report);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Stock Management System</h1>
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Items</h3>
            <p className="text-3xl font-bold text-blue-600">{inventory.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Low Stock</h3>
            <p className="text-3xl font-bold text-red-600">{lowStockItems.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-green-600">
              {inventory.reduce((sum, item) => sum + (item.quantity * item.cost_price), 0).toLocaleString('en-US')} SAR
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Locations</h3>
            <p className="text-3xl font-bold text-purple-600">{locations.length}</p>
          </div>
        </div>

        {/* Location Filter */}
        <div className="mb-6">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={generateStockReport}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Generate Report
          </button>
        </div>

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Low Stock Alerts</h3>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-red-700">{item.title} - {item.quantity} units left</span>
                  <button
                    onClick={() => handleReorder(item.id, item.reorder_level * 2)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Reorder
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map(item => (
                  <tr key={item.id} className={item.quantity <= item.reorder_level ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.supplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          item.quantity <= item.reorder_level ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {item.quantity}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          (Reserved: {item.reserved_quantity})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.cost_price.toLocaleString('en-US')} SAR
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleStockAdjustment(item.id, 1, 'Manual adjustment')}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleStockAdjustment(item.id, -1, 'Manual adjustment')}
                        className="text-red-600 hover:text-red-900 mr-3"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleReorder(item.id, item.reorder_level * 2)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

StockApp.displayName = 'StockApp';

export default StockApp;



