'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Package, 
  Clipboard,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  CheckCircle,
  Clock,
  Eye,
  AlertTriangle,
  BarChart3,
  Calendar,
  User,
  MapPin,
  Scan,
  FileText,
  Target
} from 'lucide-react';

interface StockTake {
  id: string;
  stockTakeNumber: string;
  location: string;
  category?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  startedDate?: string;
  completedDate?: string;
  assignedTo: string[];
  totalItems: number;
  countedItems: number;
  discrepancies: number;
  totalVariance: number;
  notes?: string;
}

interface StockTakeItem {
  id: string;
  productName: string;
  sku: string;
  systemQuantity: number;
  countedQuantity?: number;
  variance: number;
  unit: string;
  unitCost: number;
  varianceValue: number;
  location: string;
  counted: boolean;
  notes?: string;
}

interface StockTakeDetails extends StockTake {
  items: StockTakeItem[];
}

export default function StockTakePage() {
  const [stockTakes, setStockTakes] = useState<StockTake[]>([]);
  const [stockTakeDetails, setStockTakeDetails] = useState<StockTakeDetails | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');

  useEffect(() => {
    loadStockTakes();
  }, []);

  const loadStockTakes = async () => {
    try {
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('stock_takes')
        .select('*')
        .order('scheduledDate', { ascending: false });
      if (error) throw error;
      setStockTakes(data || []);
      // Optionally, fetch details for the first stock take
      if (data && data.length > 0) {
        loadStockTakeDetails(data[0].id);
      }
    } catch (error) {
      setStockTakes([]);
    }
  };

  const loadStockTakeDetails = async (id: string) => {
    try {
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('stock_take_details')
        .select('*')
        .eq('stockTakeId', id)
        .single();
      if (error) throw error;
      setStockTakeDetails(data);
    } catch (error) {
      setStockTakeDetails(null);
    }
  };

  const filteredStockTakes = stockTakes.filter(stockTake => 
    selectedStatus === 'all' || stockTake.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'in_progress': return 'قيد التنفيذ';
      case 'scheduled': return 'مجدول';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const totalStockTakes = stockTakes.length;
  const completedStockTakes = stockTakes.filter(st => st.status === 'completed').length;
  const inProgressStockTakes = stockTakes.filter(st => st.status === 'in_progress').length;
  const scheduledStockTakes = stockTakes.filter(st => st.status === 'scheduled').length;
  const totalVariance = stockTakes.reduce((sum, st) => sum + st.totalVariance, 0);

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const countedPercentage = stockTakeDetails && stockTakeDetails.totalItems > 0 
    ? Math.round((stockTakeDetails.countedItems / stockTakeDetails.totalItems) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">جرد المخزون</h1>
          <p className="text-gray-600">إدارة عمليات الجرد والتحقق من دقة المخزون</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'list' ? 'details' : 'list')}>
            {viewMode === 'list' ? <Eye className="h-4 w-4 mr-2" /> : <Clipboard className="h-4 w-4 mr-2" />}
            {viewMode === 'list' ? 'عرض التفاصيل' : 'عرض القائمة'}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير التقرير
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            جرد جديد
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الجرد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{totalStockTakes}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">عملية جرد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">مكتمل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{completedStockTakes}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">عملية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">قيد التنفيذ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{inProgressStockTakes}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">عملية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">مجدول</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{scheduledStockTakes}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">عملية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي التباين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span className={`text-2xl font-bold ${getVarianceColor(totalVariance)}`}>
                {totalVariance >= 0 ? '+' : ''}{totalVariance.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>
      </div>

      {viewMode === 'list' ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>عمليات الجرد</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في عمليات الجرد..."
                    className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="scheduled">مجدول</option>
                  <option value="in_progress">قيد التنفيذ</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>

                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  تصفية
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStockTakes.map((stockTake) => (
                <div key={stockTake.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{stockTake.stockTakeNumber}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{stockTake.location}</span>
                          {stockTake.category && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{stockTake.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(stockTake.status)}`}>
                        {getStatusIcon(stockTake.status)}
                        {getStatusText(stockTake.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-left">
                        <p className={`text-lg font-bold ${getVarianceColor(stockTake.totalVariance)}`}>
                          {stockTake.totalVariance >= 0 ? '+' : ''}{stockTake.totalVariance.toLocaleString()} ريال
                        </p>
                        <p className="text-xs text-gray-500">قيمة التباين</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setViewMode('details')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {stockTake.status === 'scheduled' && (
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Scan className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">التاريخ المجدول:</p>
                      <p className="font-medium">{stockTake.scheduledDate}</p>
                    </div>
                    {stockTake.startedDate && (
                      <div>
                        <p className="text-sm text-gray-600">تاريخ البداية:</p>
                        <p className="font-medium">{stockTake.startedDate}</p>
                      </div>
                    )}
                    {stockTake.completedDate && (
                      <div>
                        <p className="text-sm text-gray-600">تاريخ الإكمال:</p>
                        <p className="font-medium">{stockTake.completedDate}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">المكلفون:</p>
                      <p className="font-medium">{stockTake.assignedTo.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">التقدم:</p>
                      <p className="font-medium">{stockTake.countedItems}/{stockTake.totalItems}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stockTake.totalItems}</p>
                      <p className="text-sm text-blue-800">إجمالي المنتجات</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stockTake.countedItems}</p>
                      <p className="text-sm text-green-800">تم عدها</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{stockTake.discrepancies}</p>
                      <p className="text-sm text-red-800">اختلافات</p>
                    </div>
                  </div>

                  {stockTake.notes && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-900">
                        <span className="font-medium">ملاحظات:</span> {stockTake.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {viewMode === 'details' && stockTakeDetails && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{stockTakeDetails?.stockTakeNumber}</CardTitle>
                      <p className="text-gray-600">{stockTakeDetails?.location} - {stockTakeDetails?.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(stockTakeDetails?.status || '')}`}>
                      {getStatusIcon(stockTakeDetails?.status || '')}
                      {getStatusText(stockTakeDetails?.status || '')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">{countedPercentage}%</p>
                        <p className="text-sm text-blue-800">مكتمل</p>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${countedPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">{stockTakeDetails?.countedItems}</p>
                        <p className="text-sm text-green-800">تم العد</p>
                        <p className="text-xs text-gray-500 mt-1">من أصل {stockTakeDetails?.totalItems}</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-3xl font-bold text-red-600">{stockTakeDetails?.discrepancies}</p>
                        <p className="text-sm text-red-800">اختلافات</p>
                        <p className={`text-xs mt-1 ${getVarianceColor(stockTakeDetails?.totalVariance || 0)}`}>
                          {stockTakeDetails?.totalVariance >= 0 ? '+' : ''}{stockTakeDetails?.totalVariance.toLocaleString()} ريال
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-right py-3 px-3 font-medium text-gray-600">المنتج</th>
                            <th className="text-right py-3 px-3 font-medium text-gray-600">الموقع</th>
                            <th className="text-right py-3 px-3 font-medium text-gray-600">المخزون بالنظام</th>
                            <th className="text-right py-3 px-3 font-medium text-gray-600">الكمية المعدودة</th>
                            <th className="text-right py-3 px-3 font-medium text-gray-600">التباين</th>
                            <th className="text-right py-3 px-3 font-medium text-gray-600">قيمة التباين</th>
                            <th className="text-right py-3 px-3 font-medium text-gray-600">الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockTakeDetails?.items.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-3">
                                <div>
                                  <p className="font-medium">{item.productName}</p>
                                  <p className="text-gray-600 text-xs">{item.sku}</p>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-gray-600">{item.location}</td>
                              <td className="py-3 px-3">{item.systemQuantity} {item.unit}</td>
                              <td className="py-3 px-3">
                                {item.countedQuantity !== undefined ? (
                                  <span className="font-medium">{item.countedQuantity} {item.unit}</span>
                                ) : (
                                  <span className="text-gray-400">لم يتم العد</span>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`font-medium ${getVarianceColor(item.variance)}`}>
                                  {item.variance !== 0 && (item.variance > 0 ? '+' : '')}{item.variance} {item.unit}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`font-medium ${getVarianceColor(item.varianceValue)}`}>
                                  {item.varianceValue !== 0 && (item.varianceValue > 0 ? '+' : '')}{item.varianceValue.toLocaleString()} ريال
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                {item.counted ? (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                                    <CheckCircle className="h-3 w-3" />
                                    مكتمل
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
                                    <Clock className="h-3 w-3" />
                                    معلق
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الجرد</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">التاريخ المجدول:</p>
                  <p className="font-medium">{stockTakeDetails?.scheduledDate}</p>
                </div>
                {stockTakeDetails?.startedDate && (
                  <div>
                    <p className="text-sm text-gray-600">تاريخ البداية:</p>
                    <p className="font-medium">{stockTakeDetails.startedDate}</p>
                  </div>
                )}
                {stockTakeDetails?.completedDate && (
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الإكمال:</p>
                    <p className="font-medium">{stockTakeDetails.completedDate}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">المكلفون بالجرد:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {stockTakeDetails?.assignedTo.map((person, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {person}
                      </span>
                    ))}
                  </div>
                </div>
                {stockTakeDetails?.notes && (
                  <div>
                    <p className="text-sm text-gray-600">ملاحظات:</p>
                    <p className="text-sm bg-yellow-50 p-2 rounded">{stockTakeDetails.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ملخص التباينات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm text-green-800">منتجات صحيحة:</span>
                    <span className="font-medium text-green-600">
                      {stockTakeDetails?.items.filter(item => item.variance === 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm text-red-800">منتجات ناقصة:</span>
                    <span className="font-medium text-red-600">
                      {stockTakeDetails?.items.filter(item => item.variance < 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm text-blue-800">منتجات زائدة:</span>
                    <span className="font-medium text-blue-600">
                      {stockTakeDetails?.items.filter(item => item.variance > 0).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إجراءات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Scan className="h-4 w-4 mr-2" />
                  بدء الجرد
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  تصدير التقرير
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  رفع ملف العد
                </Button>
                {stockTakeDetails?.status === 'completed' && (
                  <Button variant="outline" className="w-full text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    تطبيق التعديلات
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>إنشاء جرد جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>اختر الموقع</option>
                  <option>المستودع الرئيسي</option>
                  <option>فرع الرياض</option>
                  <option>فرع جدة</option>
                  <option>فرع الدمام</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة (اختياري)</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>جميع الفئات</option>
                  <option>إلكترونيات</option>
                  <option>قرطاسية</option>
                  <option>أثاث</option>
                  <option>معدات</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ المجدول</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المكلفون بالجرد</label>
                <select multiple className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>أحمد محمد</option>
                  <option>سارة أحمد</option>
                  <option>محمد علي</option>
                  <option>عبدالله السعد</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ملاحظات حول الجرد..."
                />
              </div>

              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                إنشاء الجرد
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الجرد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">معدل دقة الجرد</h4>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">94.2%</p>
                    <p className="text-sm text-blue-800">متوسط الدقة</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3">توزيع التباينات</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-800">منتجات صحيحة</span>
                      <span className="font-medium text-green-900">75%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-800">منتجات ناقصة</span>
                      <span className="font-medium text-green-900">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-800">منتجات زائدة</span>
                      <span className="font-medium text-green-900">10%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-3">الجرد الشهري</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-yellow-800">هذا الشهر</span>
                      <span className="font-medium text-yellow-900">3 عمليات</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-yellow-800">الشهر الماضي</span>
                      <span className="font-medium text-yellow-900">5 عمليات</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-yellow-800">متوسط وقت الجرد</span>
                      <span className="font-medium text-yellow-900">1.5 يوم</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
