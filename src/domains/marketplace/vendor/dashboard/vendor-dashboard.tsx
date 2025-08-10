import React, { useState } from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';

interface VendorStats {
  totalSales: number;
  ordersCount: number;
  productsCount: number;
  rating: number;
  commission: number;
  pendingPayouts: number;
}

export function VendorDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  
  const stats: VendorStats = {
    totalSales: 125000,
    ordersCount: 456,
    productsCount: 89,
    rating: 4.8,
    commission: 8750,
    pendingPayouts: 15600,
  };

  const recentOrders = [
    { id: '#12345', customer: 'Ahmed Al-Rashid', amount: 450, status: 'completed', date: '2025-07-09' },
    { id: '#12346', customer: 'Fatima Al-Zahra', amount: 320, status: 'processing', date: '2025-07-09' },
    { id: '#12347', customer: 'Mohammed Al-Otaibi', amount: 780, status: 'shipped', date: '2025-07-08' },
    { id: '#12348', customer: 'Sarah Al-Mahmoud', amount: 260, status: 'completed', date: '2025-07-08' },
  ];

  const topProducts = [
    { name: 'أدوات البناء المتقدمة', sales: 234, revenue: 45600 },
    { name: 'مواد العزل الحراري', sales: 189, revenue: 38900 },
    { name: 'أنابيب المياه المقاومة', sales: 156, revenue: 31200 },
    { name: 'أدوات السباكة الذكية', sales: 134, revenue: 26800 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <div className="flex gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button onClick={() => alert('Button clicked')}>Export Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Total Sales</h3>
          <p className="text-2xl font-bold">SAR {stats.totalSales.toLocaleString('en-US')}</p>
          <p className="text-sm text-green-600">+12.5%</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Orders</h3>
          <p className="text-2xl font-bold">{stats.ordersCount.toString()}</p>
          <p className="text-sm text-green-600">+8.3%</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Products</h3>
          <p className="text-2xl font-bold">{stats.productsCount.toString()}</p>
          <p className="text-sm text-green-600">+2</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Rating</h3>
          <p className="text-2xl font-bold">{stats.rating}/5.0</p>
          <p className="text-sm text-green-600">+0.2</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Commission Paid</h3>
          <p className="text-2xl font-bold">SAR {stats.commission.toLocaleString('en-US')}</p>
          <p className="text-sm text-gray-500">-</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Pending Payouts</h3>
          <p className="text-2xl font-bold">SAR {stats.pendingPayouts.toLocaleString('en-US')}</p>
          <p className="text-sm text-green-600">+5.2%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>View All</Button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">SAR {order.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Top Selling Products</h3>
            <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>View All</Button>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} sold</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">SAR {product.revenue.toLocaleString('en-US')}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-20 flex-col" onClick={() => alert('Button clicked')}>
            <span className="text-2xl mb-1">📦</span>
            Add Product
          </Button>
          <Button className="h-20 flex-col" variant="outline" onClick={() => alert('Button clicked')}>
            <span className="text-2xl mb-1">📊</span>
            View Analytics
          </Button>
          <Button className="h-20 flex-col" variant="outline" onClick={() => alert('Button clicked')}>
            <span className="text-2xl mb-1">💰</span>
            Request Payout
          </Button>
          <Button className="h-20 flex-col" variant="outline" onClick={() => alert('Button clicked')}>
            <span className="text-2xl mb-1">⚙️</span>
            Store Settings
          </Button>
        </div>
      </Card>

      {/* Performance Insights */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Boost Your Sales</h4>
            <p className="text-sm text-blue-700 mt-1">
              Add more product photos to increase conversion by up to 30%
            </p>
            <Button size="sm" className="mt-2" onClick={() => alert('Button clicked')}>Update Products</Button>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900">Great Performance!</h4>
            <p className="text-sm text-green-700 mt-1">
              Your response time is 15% faster than average vendors
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900">Inventory Alert</h4>
            <p className="text-sm text-yellow-700 mt-1">
              5 products are running low on stock
            </p>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => alert('Button clicked')}>Manage Inventory</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default VendorDashboard;



