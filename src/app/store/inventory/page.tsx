'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Package, Plus, Search, Filter, Edit, Trash2, BarChart3 } from 'lucide-react';

export default function InventoryPage() {
  const [inventory] = useState([
    { id: 1, name: 'مواد بناء - أسمنت', sku: 'BM-001', quantity: 150, minQuantity: 50, price: 25.50, status: 'in_stock' },
    { id: 2, name: 'حديد التسليح 12مم', sku: 'BM-002', quantity: 30, minQuantity: 20, price: 450.00, status: 'low_stock' },
    { id: 3, name: 'طلاء خارجي أبيض', sku: 'PT-001', quantity: 0, minQuantity: 10, price: 85.00, status: 'out_of_stock' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'متوفر';
      case 'low_stock': return 'مخزون منخفض';
      case 'out_of_stock': return 'نفد المخزون';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة المخزون</h1>
          <p className="text-gray-600 mt-1">متابعة وإدارة مخزون المتجر</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            تقرير المخزون
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            إضافة منتج
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">منتجات متوفرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inventory.filter(item => item.status === 'in_stock').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">مخزون منخفض</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {inventory.filter(item => item.status === 'low_stock').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">نفد المخزون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inventory.filter(item => item.status === 'out_of_stock').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في المخزون..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              تصفية
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            قائمة المخزون
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-medium">اسم المنتج</th>
                  <th className="text-right p-3 font-medium">رمز المنتج</th>
                  <th className="text-right p-3 font-medium">الكمية المتوفرة</th>
                  <th className="text-right p-3 font-medium">الحد الأدنى</th>
                  <th className="text-right p-3 font-medium">السعر</th>
                  <th className="text-right p-3 font-medium">الحالة</th>
                  <th className="text-right p-3 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-gray-600">{item.sku}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{item.minQuantity}</td>
                    <td className="p-3">{item.price} ر.س</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
