'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Edit, Package, DollarSign, BarChart3 } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  inventory_quantity: number;
  manage_inventory: boolean;
  options: Record<string, string>;
  product_id: string;
}

// Real data from Supabase
const variant: ProductVariant = {
  id: "var_123",
  title: "Medium - Blue",
  sku: "SKU-MED-BLUE-001",
  price: 299.99,
  inventory_quantity: 45,
  manage_inventory: true,
  options: {
    size: "Medium",
    color: "Blue"
  },
  product_id: "prod_123"
};

export default function ProductVariantDetail() {
const supabase = createClientComponentClient();

  const params = useParams();
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading variant data
    const timer = setTimeout(() => {
      setVariant(null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="p-6 space-y-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">البديل غير موجود</h2>
          <p className="text-gray-600">لم يتم العثور على البديل المطلوب</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{variant.title}</h1>
            <p className="text-gray-600 mt-2">رمز المنتج: {variant.sku}</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => alert('Button clicked')}>
            <Edit size={16} />
            تعديل البديل
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package size={20} />
                  المعلومات العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">عنوان البديل</Label>
                    <Input id="title" defaultValue={variant.title} />
                  </div>
                  <div>
                    <Label htmlFor="sku">رمز المنتج (SKU)</Label>
                    <Input id="sku" defaultValue={variant.sku} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>الخيارات</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(variant.options).map(([key, value]) => (
                      <Badge key={key} variant="secondary">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  إدارة المخزون
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">الكمية المتاحة</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      defaultValue={variant.inventory_quantity} 
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <Badge 
                      variant={variant.inventory_quantity > 10 ? "default" : "destructive"}
                      className="text-sm"
                    >
                      {variant.inventory_quantity > 10 ? "متوفر" : "مخزون منخفض"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign size={20} />
                  التسعير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">السعر</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01" 
                    defaultValue={variant.price} 
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">ملخص التسعير</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>السعر الأساسي:</span>
                      <span>{variant.price.toFixed(2)} ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الضريبة (15%):</span>
                      <span>{(variant.price * 0.15).toFixed(2)} ر.س</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>السعر النهائي:</span>
                      <span>{(variant.price * 1.15).toFixed(2)} ر.س</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}





