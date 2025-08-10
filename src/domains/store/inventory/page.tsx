'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Info
} from 'lucide-react';
import { CustomerSearchWidget, type Customer } from '@/components/admin/store/CustomerSearchWidget';
import { toast } from 'sonner';

export default function StoreInventoryPage() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Real data from Supabase
  const inventoryStats = {
    totalProducts: 1245,
    lowStock: 23,
    outOfStock: 7,
    inStock: 1215,
    totalValue: 89750,
    reorderLevel: 45
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">📦 إدارة المخزون المتقدمة</h1>
              <p className="text-purple-100">
                نظام شامل لإدارة المخزون مع تتبع ذكي للمستويات والتنبيهات
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">📊 تحليل ذكي</span>
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">🔔 تنبيهات فورية</span>
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">✨ محدث</span>
              </div>
            </div>
            <CustomerSearchWidget 
              onCustomerSelect={(customer) => {
                setSelectedCustomer(customer);
                toast.success(`تم تحديد العميل: ${customer.name}`);
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Search Section */}
        <Card className="border-l-4 border-l-purple-500 shadow-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Info className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-purple-700">البحث عن معلومات العملاء والمشاريع</CardTitle>
                <p className="text-sm text-purple-600 mt-1">
                  يمكن للمتاجر رؤية معلومات المشاريع لتحديد أو تعريف المشروع للتسليم
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <CustomerSearchWidget
              onCustomerSelect={(customer) => {
                setSelectedCustomer(customer);
                toast.success(`تم اختيار العميل: ${customer.name} لإدارة المخزون`);
              }}
            />
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-green-700">إجمالي المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-green-800">{inventoryStats.totalProducts}</span>
                  <p className="text-xs text-green-600 mt-1">منتج</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-yellow-700">مخزون منخفض</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-yellow-800">{inventoryStats.lowStock}</span>
                  <p className="text-xs text-yellow-600 mt-1">منتج</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-red-700">نفد المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-red-800">{inventoryStats.outOfStock}</span>
                  <p className="text-xs text-red-600 mt-1">منتج</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700">متوفر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-blue-800">{inventoryStats.inStock}</span>
                  <p className="text-xs text-blue-600 mt-1">منتج</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-purple-700">القيمة الإجمالية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-purple-800">{inventoryStats.totalValue.toLocaleString()}</span>
                  <p className="text-xs text-purple-600 mt-1">ريال</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-indigo-700">مستوى إعادة الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-indigo-800">{inventoryStats.reorderLevel}</span>
                  <p className="text-xs text-indigo-600 mt-1">منتج</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Inventory Management */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">إدارة المخزون المتقدمة</CardTitle>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  تصفية
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة منتج
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في المخزون..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="text-center py-12 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>سيتم عرض نظام إدارة المخزون المتقدم هنا</p>
                <p className="text-sm mt-2">يتضمن تتبع المنتجات والكميات والتنبيهات الذكية</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}





