'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreditCard, Package, ShoppingCart, Calculator, Receipt } from 'lucide-react';

export default function POSPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const t = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotal(t);
  }, [cart]);

  const addSample = (name: string, price: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.name === name);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { name, price, quantity: 1 }];
    });
  };

  const checkoutCash = () => {
    if (cart.length === 0) return;
    // TODO: integrate with Supabase orders API
    alert('تم تسجيل دفع نقدي (تجريبي). سيتم ربط العملية بقاعدة البيانات لاحقًا.');
    setCart([]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">نقطة البيع (POS)</h1>
        <div className="flex space-x-2">
    <Button variant="outline" onClick={() => router.push('/store/pos/print-last')}>
            <Receipt className="w-4 h-4 mr-2" />
            طباعة آخر فاتورة
          </Button>
          <Button>
            <Package className="w-4 h-4 mr-2" />
            منتج جديد
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                اختيار المنتجات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="البحث عن منتج..."
                  className="w-full p-3 border rounded-lg"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Sample products (مؤقتة) */}
                  <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => addSample('منتج تجريبي 1', 100)}>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                      <div className="font-medium">منتج تجريبي 1</div>
                      <div className="text-sm text-gray-500">100 ر.س</div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => addSample('منتج تجريبي 2', 200)}>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                      <div className="font-medium">منتج تجريبي 2</div>
                      <div className="text-sm text-gray-500">200 ر.س</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart and Checkout */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                سلة الشراء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">لا توجد منتجات في السلة</p>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border-b">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.quantity} x {item.price} ر.س</div>
                        </div>
                        <div className="font-bold">{item.quantity * item.price} ر.س</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">المجموع:</span>
                    <span className="text-lg font-bold">{total} ر.س</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full" size="lg" onClick={checkoutCash} disabled={cart.length === 0}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      دفع نقدي
                    </Button>
                    <Button className="w-full" variant="outline" size="lg">
                      <CreditCard className="w-4 h-4 mr-2" />
                      دفع بالبطاقة
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
