'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Users, Plus, Search, Phone, Mail, MapPin, Star } from 'lucide-react';

export default function SuppliersPage() {
  const [suppliers] = useState([
    {
      id: 1,
      name: 'شركة الرياض للمواد',
      category: 'مواد البناء',
      phone: '+966501234567',
      email: 'info@riyadh-materials.com',
      address: 'الرياض، حي الملز',
      rating: 4.5,
      status: 'active',
      totalOrders: 24
    },
    {
      id: 2,
      name: 'مؤسسة جدة للحديد',
      category: 'حديد ومعادن',
      phone: '+966502345678',
      email: 'sales@jeddah-steel.com',
      address: 'جدة، حي الفيصلية',
      rating: 4.8,
      status: 'active',
      totalOrders: 18
    },
    {
      id: 3,
      name: 'شركة الدمام للدهانات',
      category: 'دهانات وطلاء',
      phone: '+966503456789',
      email: 'contact@dammam-paint.com',
      address: 'الدمام، حي الشاطئ',
      rating: 4.2,
      status: 'inactive',
      totalOrders: 12
    }
  ]);

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'نشط' : 'غير نشط';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة الموردين</h1>
          <p className="text-gray-600 mt-1">متابعة وإدارة موردي المتجر</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          إضافة مورد جديد
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الموردين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">موردين نشطين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {suppliers.filter(s => s.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">متوسط التقييم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(suppliers.reduce((acc, s) => acc + s.rating, 0) / suppliers.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {suppliers.reduce((acc, s) => acc + s.totalOrders, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الموردين..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{supplier.category}</p>
                </div>
                <Badge className={getStatusColor(supplier.status)}>
                  {getStatusText(supplier.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{supplier.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{supplier.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{supplier.address}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {renderStars(supplier.rating)}
                  <span className="text-sm font-medium mr-1">{supplier.rating}</span>
                </div>
                <span className="text-sm text-gray-600">{supplier.totalOrders} طلب</span>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  عرض التفاصيل
                </Button>
                <Button size="sm" className="flex-1">
                  طلب جديد
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
