'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Upload,
  FileText,
  Percent,
  DollarSign,
  Settings,
  AlertTriangle,
  CheckCircle,
  Globe,
  Building,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';

export default function TaxesPage() {
  const [activeTab, setActiveTab] = useState('rates');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock tax data
  const taxRates = [
    {
      id: 1,
      name: 'ضريبة القيمة المضافة',
      code: 'VAT',
      rate: 15,
      type: 'percentage',
      status: 'active',
      applicableProducts: ['جميع المنتجات'],
      regions: ['المملكة العربية السعودية'],
      description: 'ضريبة القيمة المضافة العامة',
      createdDate: '2020-01-01',
      lastModified: '2025-01-15'
    },
    {
      id: 2,
      name: 'إعفاء ضريبي للمواد الغذائية',
      code: 'FOOD_EXEMPT',
      rate: 0,
      type: 'exemption',
      status: 'active',
      applicableProducts: ['المواد الغذائية الأساسية', 'الخضروات', 'الفواكه'],
      regions: ['المملكة العربية السعودية'],
      description: 'إعفاء ضريبي للمواد الغذائية الأساسية',
      createdDate: '2020-01-01',
      lastModified: '2024-12-01'
    },
    {
      id: 3,
      name: 'ضريبة على المشروبات المحلاة',
      code: 'SUGAR_TAX',
      rate: 50,
      type: 'percentage',
      status: 'active',
      applicableProducts: ['المشروبات المحلاة', 'المشروبات الغازية'],
      regions: ['المملكة العربية السعودية'],
      description: 'ضريبة انتقائية على المشروبات المحلاة',
      createdDate: '2017-06-01',
      lastModified: '2025-01-01'
    }
  ];

  const taxReports = [
    {
      id: 1,
      period: 'يناير 2025',
      totalTaxCollected: 125000,
      vatAmount: 95000,
      exemptAmount: 15000,
      specialTaxAmount: 15000,
      status: 'completed',
      filingDeadline: '2025-02-28',
      filed: true
    },
    {
      id: 2,
      period: 'ديسمبر 2024',
      totalTaxCollected: 134000,
      vatAmount: 98000,
      exemptAmount: 18000,
      specialTaxAmount: 18000,
      status: 'completed',
      filingDeadline: '2025-01-31',
      filed: true
    },
    {
      id: 3,
      period: 'نوفمبر 2024',
      totalTaxCollected: 110000,
      vatAmount: 82000,
      exemptAmount: 12000,
      specialTaxAmount: 16000,
      status: 'completed',
      filingDeadline: '2024-12-31',
      filed: true
    }
  ];

  const taxCategories = [
    {
      id: 1,
      name: 'منتجات عامة',
      taxRate: 15,
      productCount: 1250,
      description: 'المنتجات الخاضعة لضريبة القيمة المضافة العامة'
    },
    {
      id: 2,
      name: 'مواد غذائية أساسية',
      taxRate: 0,
      productCount: 340,
      description: 'المواد الغذائية المعفاة من الضريبة'
    },
    {
      id: 3,
      name: 'منتجات طبية',
      taxRate: 0,
      productCount: 85,
      description: 'المنتجات الطبية والأدوية المعفاة'
    },
    {
      id: 4,
      name: 'مشروبات محلاة',
      taxRate: 50,
      productCount: 45,
      description: 'المشروبات الخاضعة للضريبة الانتقائية'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'معلق';
      case 'completed': return 'مكتمل';
      default: return status;
    }
  };

  const getTaxTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="h-4 w-4" />;
      case 'exemption': return <CheckCircle className="h-4 w-4" />;
      case 'fixed': return <DollarSign className="h-4 w-4" />;
      default: return <Calculator className="h-4 w-4" />;
    }
  };

  const stats = {
    totalTaxCollected: taxReports.reduce((sum, report) => sum + report.totalTaxCollected, 0),
    activeTaxRates: taxRates.filter(rate => rate.status === 'active').length,
    exemptCategories: taxCategories.filter(cat => cat.taxRate === 0).length,
    pendingReports: taxReports.filter(report => !report.filed).length
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الضرائب</h1>
          <p className="text-gray-600">إدارة معدلات الضرائب والتقارير الضريبية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير التقارير
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة معدل ضريبي
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الضرائب المحصلة</p>
                <p className="text-2xl font-bold">{stats.totalTaxCollected.toLocaleString()} ر.س</p>
              </div>
              <Receipt className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المعدلات النشطة</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeTaxRates}</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الفئات المعفاة</p>
                <p className="text-2xl font-bold text-purple-600">{stats.exemptCategories}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">التقارير المعلقة</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingReports}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث في المعدلات الضريبية..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rates">المعدلات الضريبية</TabsTrigger>
          <TabsTrigger value="categories">فئات المنتجات</TabsTrigger>
          <TabsTrigger value="reports">التقارير الضريبية</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* Tax Rates Tab */}
        <TabsContent value="rates" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {taxRates.map((rate) => (
              <Card key={rate.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTaxTypeIcon(rate.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{rate.name}</h3>
                        <p className="text-gray-600">{rate.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className={getStatusColor(rate.status)}>
                            {getStatusText(rate.status)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            كود: {rate.code}
                          </span>
                          <span className="text-sm text-gray-500">
                            المعدل: {rate.rate}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">المنتجات المشمولة:</p>
                      <div className="flex flex-wrap gap-2">
                        {rate.applicableProducts.map((product, index) => (
                          <Badge key={index} variant="outline">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">المناطق المشمولة:</p>
                      <div className="flex flex-wrap gap-2">
                        {rate.regions.map((region, index) => (
                          <Badge key={index} variant="outline">
                            <Globe className="h-3 w-3 mr-1" />
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between text-sm text-gray-500">
                    <span>تاريخ الإنشاء: {new Date(rate.createdDate).toLocaleDateString('ar-SA')}</span>
                    <span>آخر تعديل: {new Date(rate.lastModified).toLocaleDateString('ar-SA')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {taxCategories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{category.taxRate}%</p>
                      <p className="text-sm text-gray-500">{category.productCount} منتج</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor('active')}>
                      نشط
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {taxReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">تقرير ضريبي - {report.period}</h3>
                      <p className="text-gray-600">
                        موعد التقديم: {new Date(report.filingDeadline).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusText(report.status)}
                      </Badge>
                      {report.filed && (
                        <Badge className="bg-green-100 text-green-800">
                          مقدم
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">إجمالي الضرائب</p>
                      <p className="text-xl font-bold">{report.totalTaxCollected.toLocaleString()} ر.س</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">ضريبة القيمة المضافة</p>
                      <p className="text-xl font-bold text-blue-600">{report.vatAmount.toLocaleString()} ر.س</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">المبالغ المعفاة</p>
                      <p className="text-xl font-bold text-green-600">{report.exemptAmount.toLocaleString()} ر.س</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">الضرائب الخاصة</p>
                      <p className="text-xl font-bold text-purple-600">{report.specialTaxAmount.toLocaleString()} ر.س</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      تحميل التقرير
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      عرض التفاصيل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات الضرائب العامة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>الرقم الضريبي للمتجر</Label>
                  <Input placeholder="300001234567894" />
                </div>
                
                <div className="space-y-2">
                  <Label>عملة الضرائب</Label>
                  <Select defaultValue="SAR">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                      <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                      <SelectItem value="EUR">يورو (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>طريقة حساب الضريبة</Label>
                  <Select defaultValue="inclusive">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inclusive">شامل الضريبة</SelectItem>
                      <SelectItem value="exclusive">بدون ضريبة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>دورة التقارير</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">شهرية</SelectItem>
                      <SelectItem value="quarterly">ربع سنوية</SelectItem>
                      <SelectItem value="yearly">سنوية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>أدوات إضافية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Upload className="h-6 w-6 mb-2" />
                  استيراد معدلات ضريبية
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  تصدير البيانات
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calculator className="h-6 w-6 mb-2" />
                  حاسبة الضرائب
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
