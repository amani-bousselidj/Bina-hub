'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench, Plus, Edit, Trash2, Eye, Clock, DollarSign } from 'lucide-react';

export default function ServiceProviderServicesPage() {
  const services = [
    {
      id: '1',
      title: 'استشارة هندسية',
      description: 'استشارة هندسية شاملة للمشاريع السكنية والتجارية',
      category: 'استشارات',
      price: { type: 'hourly', amount: 500 },
      duration: '2-3 ساعات',
      availability: 'متاح',
      rating: 4.8,
      completedJobs: 24
    },
    {
      id: '2',
      title: 'إشراف على البناء',
      description: 'إشراف مهني على أعمال البناء والتشطيب',
      category: 'إشراف',
      price: { type: 'daily', amount: 1500 },
      duration: 'يوم كامل',
      availability: 'محدود',
      rating: 4.9,
      completedJobs: 18
    },
    {
      id: '3',
      title: 'تصميم معماري',
      description: 'تصميم معماري احترافي للفلل والمباني التجارية',
      category: 'تصميم',
      price: { type: 'project', amount: 25000 },
      duration: '2-4 أسابيع',
      availability: 'متاح',
      rating: 4.7,
      completedJobs: 12
    }
  ];

  const getAvailabilityColor = (availability: string) => {
    const colors: Record<string, string> = {
      'متاح': 'bg-green-500',
      'محدود': 'bg-yellow-500',
      'غير متاح': 'bg-red-500'
    };
    return colors[availability] || 'bg-gray-500';
  };

  const getPriceText = (price: any) => {
    const types: Record<string, string> = {
      'hourly': 'ر.س/ساعة',
      'daily': 'ر.س/يوم',
      'project': 'ر.س/مشروع'
    };
    return `${price.amount.toLocaleString()} ${types[price.type]}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wrench className="h-8 w-8 text-blue-600" />
            إدارة الخدمات
          </h1>
          <p className="text-gray-600">
            إدارة وتحديث خدماتك المقدمة للعملاء
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          إضافة خدمة جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الخدمات</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">نشطة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الأسعار</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">750 ر.س</div>
            <p className="text-xs text-muted-foreground">متوسط/ساعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأعمال المكتملة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.reduce((sum, service) => sum + service.completedJobs, 0)}
            </div>
            <p className="text-xs text-muted-foreground">إجمالي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(services.reduce((sum, service) => sum + service.rating, 0) / services.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">من 5</p>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle>خدماتي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{service.category}</Badge>
                    <Badge className={getAvailabilityColor(service.availability)}>
                      {service.availability}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">السعر:</span>
                    <div className="font-medium">{getPriceText(service.price)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">المدة:</span>
                    <div className="font-medium">{service.duration}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">التقييم:</span>
                    <div className="font-medium">{service.rating}/5</div>
                  </div>
                  <div>
                    <span className="text-gray-500">الأعمال المكتملة:</span>
                    <div className="font-medium">{service.completedJobs}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    تعديل
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-3 w-3 mr-1" />
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Service Form */}
      <Card>
        <CardHeader>
          <CardTitle>إضافة خدمة جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>عنوان الخدمة</Label>
                <Input placeholder="مثال: استشارة هندسية" />
              </div>
              <div className="space-y-2">
                <Label>الفئة</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">استشارات</SelectItem>
                    <SelectItem value="supervision">إشراف</SelectItem>
                    <SelectItem value="design">تصميم</SelectItem>
                    <SelectItem value="construction">بناء</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المدة المتوقعة</Label>
                <Input placeholder="مثال: 2-3 ساعات" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>السعر</Label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="500" />
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="نوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">ر.س/ساعة</SelectItem>
                      <SelectItem value="daily">ر.س/يوم</SelectItem>
                      <SelectItem value="project">ر.س/مشروع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>الحالة</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">متاح</SelectItem>
                    <SelectItem value="limited">محدود</SelectItem>
                    <SelectItem value="unavailable">غير متاح</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>وصف الخدمة</Label>
              <Textarea 
                placeholder="اكتب وصفاً تفصيلياً للخدمة..." 
                rows={4}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-4">
              <Button variant="outline">إلغاء</Button>
              <Button>إضافة الخدمة</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




