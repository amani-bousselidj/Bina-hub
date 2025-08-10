'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { 
  Package, 
  Plus, 
  Minus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  MapPin
} from 'lucide-react';

interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  type: 'increase' | 'decrease' | 'damaged' | 'expired' | 'lost' | 'found';
  location: string;
  items: AdjustmentItem[];
  totalValue: number;
  reason: string;
  status: 'draft' | 'approved' | 'completed';
  createdDate: string;
  approvedDate?: string;
  completedDate?: string;
  createdBy: string;
  approvedBy?: string;
  notes?: string;
}

interface AdjustmentItem {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  adjustmentQuantity: number;
  newStock: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  reason: string;
  expiry?: string;
  batch?: string;
}

interface AdjustmentSummary {
  totalAdjustments: number;
  increaseValue: number;
  decreaseValue: number;
  pendingApproval: number;
  thisMonth: number;
}

export default function StockAdjustmentsPage() {
  const [stockAdjustments] = useState<StockAdjustment[]>([
    {
      id: '1',
      adjustmentNumber: 'ADJ-001',
      type: 'decrease',
      location: 'المستودع الرئيسي',
      items: [
        {
          id: '1',
          productName: 'لابتوب HP EliteBook',
          sku: 'HP-001',
          currentStock: 20,
          adjustmentQuantity: -2,
          newStock: 18,
          unit: 'قطعة',
          unitCost: 2500,
          totalValue: -5000,
          reason: 'تلف في الشحن'
        },
        {
          id: '2',
          productName: 'ماوس لوجيتك',
          sku: 'LG-002',
          currentStock: 50,
          adjustmentQuantity: -5,
          newStock: 45,
          unit: 'قطعة',
          unitCost: 75,
          totalValue: -375,
          reason: 'تلف في الشحن'
        }
      ],
      totalValue: -5375,
      reason: 'تلف منتجات في شحنة وصلت تالفة',
      status: 'completed',
      createdDate: '2025-01-10',
      approvedDate: '2025-01-11',
      completedDate: '2025-01-11',
      createdBy: 'أحمد محمد',
      approvedBy: 'سارة أحمد',
      notes: 'تم التواصل مع المورد لإرجاع المنتجات التالفة'
    },
    {
      id: '2',
      adjustmentNumber: 'ADJ-002',
      type: 'increase',
      location: 'فرع الرياض',
      items: [
        {
          id: '3',
          productName: 'كيبورد ميكانيكي',
          sku: 'KB-003',
          currentStock: 10,
          adjustmentQuantity: 5,
          newStock: 15,
          unit: 'قطعة',
          unitCost: 150,
          totalValue: 750,
          reason: 'إعادة عد المخزون'
        }
      ],
      totalValue: 750,
      reason: 'وجد منتجات إضافية بعد إعادة الجرد',
      status: 'approved',
      createdDate: '2025-01-15',
      approvedDate: '2025-01-15',
      createdBy: 'محمد علي',
      approvedBy: 'أحمد محمد',
      notes: 'منتجات كانت في مكان آخر لم يتم عدها'
    },
    {
      id: '3',
      adjustmentNumber: 'ADJ-003',
      type: 'expired',
      location: 'فرع جدة',
      items: [
        {
          id: '4',
          productName: 'شاشة 4K Dell',
          sku: 'DL-004',
          currentStock: 8,
          adjustmentQuantity: -1,
          newStock: 7,
          unit: 'قطعة',
          unitCost: 800,
          totalValue: -800,
          reason: 'منتهي الصلاحية',
          expiry: '2024-12-31',
          batch: 'BTH-001'
        }
      ],
      totalValue: -800,
      reason: 'انتهاء فترة الضمان',
      status: 'draft',
      createdDate: '2025-01-16',
      createdBy: 'سارة أحمد',
      notes: 'يحتاج موافقة المدير'
    }
  ]);

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredAdjustments = stockAdjustments.filter(adjustment => {
    const typeMatch = selectedType === 'all' || adjustment.type === selectedType;
    const statusMatch = selectedStatus === 'all' || adjustment.status === selectedStatus;
    return typeMatch && statusMatch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'increase': case 'found': return 'bg-green-100 text-green-800';
      case 'decrease': case 'lost': return 'bg-red-100 text-red-800';
      case 'damaged': return 'bg-orange-100 text-orange-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'increase': return 'زيادة';
      case 'decrease': return 'نقص';
      case 'damaged': return 'تلف';
      case 'expired': return 'منتهي الصلاحية';
      case 'lost': return 'مفقود';
      case 'found': return 'موجود';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'increase': case 'found': return <TrendingUp className="h-4 w-4" />;
      case 'decrease': case 'lost': return <TrendingDown className="h-4 w-4" />;
      case 'damaged': case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'approved': return 'معتمد';
      case 'draft': return 'مسودة';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'approved': return <Eye className="h-4 w-4" />;
      case 'draft': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const summary: AdjustmentSummary = {
    totalAdjustments: stockAdjustments.length,
    increaseValue: stockAdjustments
      .filter(adj => adj.totalValue > 0)
      .reduce((sum, adj) => sum + adj.totalValue, 0),
    decreaseValue: Math.abs(stockAdjustments
      .filter(adj => adj.totalValue < 0)
      .reduce((sum, adj) => sum + adj.totalValue, 0)),
    pendingApproval: stockAdjustments.filter(adj => adj.status === 'draft').length,
    thisMonth: stockAdjustments.filter(adj => 
      new Date(adj.createdDate).getMonth() === new Date().getMonth()
    ).length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل المخزون</h1>
          <p className="text-gray-600">إدارة تعديلات الكميات والمخزون</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير التعديلات
          </Button>
          <Button onClick={() => {
            const el = document.getElementById('create-adjustment');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            <Plus className="h-4 w-4 mr-2" />
            تعديل جديد
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي التعديلات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{summary.totalAdjustments}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">تعديل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">زيادة القيمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {summary.increaseValue.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">نقص القيمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">
                {summary.decreaseValue.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">في انتظار الموافقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{summary.pendingApproval}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">تعديل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">هذا الشهر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{summary.thisMonth}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">تعديل</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>تعديلات المخزون</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في التعديلات..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الأنواع</option>
                <option value="increase">زيادة</option>
                <option value="decrease">نقص</option>
                <option value="damaged">تلف</option>
                <option value="expired">منتهي الصلاحية</option>
                <option value="lost">مفقود</option>
                <option value="found">موجود</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="draft">مسودة</option>
                <option value="approved">معتمد</option>
                <option value="completed">مكتمل</option>
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
            {filteredAdjustments.map((adjustment) => (
              <div key={adjustment.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{adjustment.adjustmentNumber}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{adjustment.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTypeColor(adjustment.type)}`}>
                        {getTypeIcon(adjustment.type)}
                        {getTypeText(adjustment.type)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(adjustment.status)}`}>
                        {getStatusIcon(adjustment.status)}
                        {getStatusText(adjustment.status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-left">
                      <p className={`text-lg font-bold ${adjustment.totalValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {adjustment.totalValue >= 0 ? '+' : ''}{adjustment.totalValue.toLocaleString()} ريال
                      </p>
                      <p className="text-xs text-gray-500">القيمة الإجمالية</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {adjustment.status === 'draft' && (
                      <>
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الإنشاء:</p>
                    <p className="font-medium">{adjustment.createdDate}</p>
                  </div>
                  {adjustment.approvedDate && (
                    <div>
                      <p className="text-sm text-gray-600">تاريخ الموافقة:</p>
                      <p className="font-medium">{adjustment.approvedDate}</p>
                    </div>
                  )}
                  {adjustment.completedDate && (
                    <div>
                      <p className="text-sm text-gray-600">تاريخ الإكمال:</p>
                      <p className="font-medium">{adjustment.completedDate}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">أنشئ بواسطة:</p>
                    <p className="font-medium">{adjustment.createdBy}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">المنتجات ({adjustment.items.length})</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-right py-2 px-3 font-medium text-gray-600">المنتج</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">المخزون الحالي</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">التعديل</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">المخزون الجديد</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">القيمة</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">السبب</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adjustment.items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-2 px-3">
                              <div>
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-gray-600 text-xs">{item.sku}</p>
                                {item.batch && (
                                  <p className="text-gray-500 text-xs">دفعة: {item.batch}</p>
                                )}
                                {item.expiry && (
                                  <p className="text-red-600 text-xs">انتهاء: {item.expiry}</p>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-3">{item.currentStock} {item.unit}</td>
                            <td className="py-2 px-3">
                              <span className={`font-medium ${item.adjustmentQuantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.adjustmentQuantity >= 0 ? '+' : ''}{item.adjustmentQuantity} {item.unit}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-medium">{item.newStock} {item.unit}</td>
                            <td className="py-2 px-3">
                              <span className={`font-medium ${item.totalValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.totalValue >= 0 ? '+' : ''}{item.totalValue.toLocaleString()} ريال
                              </span>
                            </td>
                            <td className="py-2 px-3 text-gray-600">{item.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <span className="font-medium">السبب:</span> {adjustment.reason}
                    </p>
                  </div>
                  {adjustment.notes && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-900">
                        <span className="font-medium">ملاحظات:</span> {adjustment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="create-adjustment">
        <Card>
          <CardHeader>
            <CardTitle>إنشاء تعديل جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع التعديل</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>اختر نوع التعديل</option>
                  <option value="increase">زيادة</option>
                  <option value="decrease">نقص</option>
                  <option value="damaged">تلف</option>
                  <option value="expired">منتهي الصلاحية</option>
                  <option value="lost">مفقود</option>
                  <option value="found">موجود</option>
                </select>
              </div>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المنتج</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>اختر المنتج</option>
                <option>لابتوب HP EliteBook</option>
                <option>ماوس لوجيتك</option>
                <option>كيبورد ميكانيكي</option>
                <option>شاشة 4K Dell</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المخزون الحالي</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  value="20"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">كمية التعديل</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المخزون الجديد</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  value="18"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">سبب التعديل</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="اكتب سبب التعديل..."
              />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                حفظ كمسودة
              </Button>
              <Button variant="outline" className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                حفظ ومراجعة
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تحليل التعديلات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">التوزيع حسب النوع</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-800">نقص</span>
                    <span className="font-medium text-blue-900">40%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-800">زيادة</span>
                    <span className="font-medium text-blue-900">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-800">تلف</span>
                    <span className="font-medium text-blue-900">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-800">انتهاء صلاحية</span>
                    <span className="font-medium text-blue-900">10%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <h4 className="font-medium text-green-900 mb-3">أكثر المنتجات تعديلاً</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-800">لابتوب HP EliteBook</span>
                    <span className="font-medium text-green-900">5 تعديلات</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-800">ماوس لوجيتك</span>
                    <span className="font-medium text-green-900">3 تعديلات</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-800">كيبورد ميكانيكي</span>
                    <span className="font-medium text-green-900">2 تعديلات</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-3">التعديلات حسب الموقع</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-800">المستودع الرئيسي</span>
                    <span className="font-medium text-yellow-900">6 تعديلات</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-800">فرع الرياض</span>
                    <span className="font-medium text-yellow-900">3 تعديلات</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-800">فرع جدة</span>
                    <span className="font-medium text-yellow-900">2 تعديلات</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



