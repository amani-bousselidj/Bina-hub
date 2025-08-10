'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui';
import { 
  Search, 
  Filter, 
  BarChart3, 
  Eye, 
  TrendingUp, 
  Users,
  Plus,
  Download,
  Info,
  Zap,
  Target
} from 'lucide-react';
import { CustomerSearchWidget, type Customer } from '@/components/admin/store/CustomerSearchWidget';
import { toast } from 'sonner';

export default function SearchPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock search data
  const searchStats = {
    totalSearches: 1250,
    popularQueries: 45,
    searchResults: 890,
    averageTime: 0.8,
    conversionRate: 23,
    activeUsers: 156
  };

  const popularSearches = [
    { query: 'كرسي مكتب', count: 89, trend: '+12%' },
    { query: 'طاولة اجتماعات', count: 67, trend: '+8%' },
    { query: 'مصباح LED', count: 54, trend: '+15%' },
    { query: 'خزانة ملفات', count: 43, trend: '+5%' }
  ];

  const recentSearches = [
    { id: 1, query: 'مكتب تنفيذي', user: 'أحمد محمد', time: '5 دقائق', results: 23 },
    { id: 2, query: 'كرسي ألعاب', user: 'فاطمة علي', time: '10 دقائق', results: 15 },
    { id: 3, query: 'مكتبة خشبية', user: 'محمد حسن', time: '15 دقيقة', results: 31 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-3xl font-bold mb-2">محرك البحث المتقدم</h1>
              <p className="text-blue-100 text-lg">نظام بحث ذكي مع تحليلات شاملة ونتائج مخصصة</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Download className="h-4 w-4 mr-2" />
                تصدير النتائج
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Filter className="h-4 w-4 mr-2" />
                تصفية متقدمة
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-gray-50">
                <Plus className="h-4 w-4 mr-2" />
                بحث مخصص
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Search Section */}
      <Card className="border-l-4 border-l-purple-500 shadow-lg">
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
              toast.success(`تم اختيار العميل: ${customer.name} للبحث`);
            }}
          />
        </CardContent>
      </Card>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">إجمالي البحثات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-800">{searchStats.totalSearches}</span>
                <p className="text-xs text-blue-600 mt-1">عملية بحث</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">استعلامات شائعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-purple-800">{searchStats.popularQueries}</span>
                <p className="text-xs text-purple-600 mt-1">استعلام</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">نتائج البحث</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-green-800">{searchStats.searchResults}</span>
                <p className="text-xs text-green-600 mt-1">نتيجة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-700">سرعة البحث</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-orange-800">{searchStats.averageTime}</span>
                <p className="text-xs text-orange-600 mt-1">ثانية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-indigo-700">معدل التحويل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-indigo-800">{searchStats.conversionRate}%</span>
                <p className="text-xs text-indigo-600 mt-1">تحويل</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-teal-700">المستخدمون النشطون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-teal-800">{searchStats.activeUsers}</span>
                <p className="text-xs text-teal-600 mt-1">مستخدم</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Search Box */}
      <Card>
        <CardHeader>
          <CardTitle>البحث المتقدم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث عن المنتجات، العملاء، الطلبات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 py-3 text-lg"
              />
            </div>
            <Button size="lg" className="px-8">
              <Search className="h-5 w-5 mr-2" />
              بحث
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Searches */}
        <Card>
          <CardHeader>
            <CardTitle>البحثات الشائعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularSearches.map((search, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-gray-900">{search.query}</div>
                    <Badge variant="secondary">{search.count} بحث</Badge>
                  </div>
                  <div className="text-sm text-green-600 font-medium">{search.trend}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Searches */}
        <Card>
          <CardHeader>
            <CardTitle>البحثات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSearches.map((search) => (
                <div key={search.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <div className="font-medium text-gray-900">{search.query}</div>
                    <div className="text-sm text-gray-600">بواسطة {search.user} • {search.time}</div>
                  </div>
                  <Badge variant="outline">{search.results} نتيجة</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}





