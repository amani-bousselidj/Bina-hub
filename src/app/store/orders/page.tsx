'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Package, Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: '1001',
      customerName: 'أحمد محمد',
      totalAmount: 1500,
      status: 'pending',
      date: '2024-01-15',
      items: 3
    },
    {
      id: '1002',
      customerName: 'فاطمة السالم',
      totalAmount: 2300,
      status: 'confirmed',
      date: '2024-01-14',
      items: 5
    },
    {
      id: '1003',
      customerName: 'محمد الأحمد',
      totalAmount: 800,
      status: 'processing',
      date: '2024-01-13',
      items: 2
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { label: 'في الانتظار', color: 'bg-yellow-100 text-yellow-800' },
      'confirmed': { label: 'مؤكد', color: 'bg-blue-100 text-blue-800' },
      'processing': { label: 'قيد التجهيز', color: 'bg-purple-100 text-purple-800' },
      'shipped': { label: 'تم الشحن', color: 'bg-green-100 text-green-800' },
      'delivered': { label: 'تم التسليم', color: 'bg-green-100 text-green-800' },
      'cancelled': { label: 'ملغي', color: 'bg-red-100 text-red-800' }
    };
    
    return statusMap[status as keyof typeof statusMap] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة الطلبات</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            تصفية
          </Button>
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            بحث
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            طلب جديد
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد التجهيز</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'processing').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()} ر.س
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">رقم الطلب</th>
                  <th className="text-right p-3">العميل</th>
                  <th className="text-right p-3">التاريخ</th>
                  <th className="text-right p-3">عدد المنتجات</th>
                  <th className="text-right p-3">المبلغ الإجمالي</th>
                  <th className="text-right p-3">الحالة</th>
                  <th className="text-right p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusInfo = getStatusBadge(order.status);
                  return (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">#{order.id}</td>
                      <td className="p-3">{order.customerName}</td>
                      <td className="p-3">{order.date}</td>
                      <td className="p-3">{order.items}</td>
                      <td className="p-3 font-bold">{order.totalAmount.toLocaleString()} ر.س</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            عرض
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
