'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Users, MessageSquare, Star, TrendingUp, MapPin, Phone, Mail } from 'lucide-react';

export default function ServiceProviderCustomersPage() {
  const customers = [
    {
      id: '1',
      name: 'أحمد محمد الزهراني',
      email: 'ahmed.m@example.com',
      phone: '+966501234567',
      location: 'الرياض - حي النرجس',
      totalProjects: 3,
      totalSpent: 75000,
      lastProject: '2025-07-15',
      rating: 5,
      status: 'active'
    },
    {
      id: '2',
      name: 'فاطمة عبدالله',
      email: 'fatima.a@example.com',
      phone: '+966502345678',
      location: 'جدة - حي الزهراء',
      totalProjects: 1,
      totalSpent: 25000,
      lastProject: '2025-06-28',
      rating: 4,
      status: 'completed'
    },
    {
      id: '3',
      name: 'خالد العتيبي',
      email: 'khalid.o@example.com',
      phone: '+966503456789',
      location: 'الدمام - حي الشاطئ',
      totalProjects: 2,
      totalSpent: 45000,
      lastProject: '2025-07-10',
      rating: 5,
      status: 'in-progress'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-500',
      'in-progress': 'bg-blue-500',
      'completed': 'bg-gray-500',
      'inactive': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'active': 'نشط',
      'in-progress': 'مشروع جاري',
      'completed': 'مكتمل',
      'inactive': 'غير نشط'
    };
    return texts[status] || status;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            إدارة العملاء
          </h1>
          <p className="text-gray-600">
            إدارة وتتبع علاقاتك مع العملاء
          </p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          إضافة عميل جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">عميل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء النشطون</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.status === 'active' || c.status === 'in-progress').length}
            </div>
            <p className="text-xs text-muted-foreground">نشط حالياً</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toLocaleString()} ر.س
            </div>
            <p className="text-xs text-muted-foreground">من جميع العملاء</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {(customers.reduce((sum, customer) => sum + customer.rating, 0) / customers.length).toFixed(1)}
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground">من العملاء</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{customer.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(customer.status)}>
                      {getStatusText(customer.status)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{customer.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">الموقع:</span>
                    <div className="font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {customer.location}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">عدد المشاريع:</span>
                    <div className="font-medium">{customer.totalProjects} مشروع</div>
                  </div>
                  <div>
                    <span className="text-gray-500">إجمالي الإنفاق:</span>
                    <div className="font-medium">{customer.totalSpent.toLocaleString()} ر.س</div>
                  </div>
                  <div>
                    <span className="text-gray-500">آخر مشروع:</span>
                    <div className="font-medium">
                      {new Date(customer.lastProject).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    راسل
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-3 w-3 mr-1" />
                    عرض المشاريع
                  </Button>
                  <Button variant="outline" size="sm">
                    عرض التفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>أفضل العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customers
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 3)
                .map((customer, index) => (
                  <div key={customer.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.totalProjects} مشاريع</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{customer.totalSpent.toLocaleString()} ر.س</div>
                      <div className="text-sm text-gray-500">#{index + 1}</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>العملاء الجدد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customers
                .sort((a, b) => new Date(b.lastProject).getTime() - new Date(a.lastProject).getTime())
                .slice(0, 3)
                .map((customer) => (
                  <div key={customer.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {new Date(customer.lastProject).toLocaleDateString('ar-SA')}
                      </div>
                      <Badge className={getStatusColor(customer.status)} size="sm">
                        {getStatusText(customer.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



