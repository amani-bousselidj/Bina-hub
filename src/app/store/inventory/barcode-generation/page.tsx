'use client';

import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Package, 
  QrCode,
  Scan,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Copy,
  Printer,
  Grid,
  List,
  BarChart3,
  Settings,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface BarcodeTemplate {
  id: string;
  name: string;
  type: 'product' | 'location' | 'asset' | 'batch';
  format: 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'QR_CODE' | 'DATA_MATRIX';
  width: number;
  height: number;
  includeText: boolean;
  fontSize: number;
  margin: number;
  prefix?: string;
  suffix?: string;
  isDefault: boolean;
}

interface GeneratedBarcode {
  id: string;
  code: string;
  type: string;
  format: string;
  productName?: string;
  sku?: string;
  location?: string;
  batchNumber?: string;
  generatedDate: string;
  printedCount: number;
  status: 'generated' | 'printed' | 'used';
}

export default function BarcodeGenerationPage() {
  const [barcodeTemplates] = useState<BarcodeTemplate[]>([
    {
      id: '1',
      name: 'قالب المنتجات الأساسي',
      type: 'product',
      format: 'CODE128',
      width: 80,
      height: 30,
      includeText: true,
      fontSize: 8,
      margin: 2,
      prefix: 'PRD',
      isDefault: true
    },
    {
      id: '2',
      name: 'قالب المواقع',
      type: 'location',
      format: 'QR_CODE',
      width: 25,
      height: 25,
      includeText: true,
      fontSize: 6,
      margin: 1,
      prefix: 'LOC',
      isDefault: false
    },
    {
      id: '3',
      name: 'قالب الأصول',
      type: 'asset',
      format: 'CODE39',
      width: 60,
      height: 20,
      includeText: true,
      fontSize: 7,
      margin: 2,
      prefix: 'AST',
      isDefault: false
    },
    {
      id: '4',
      name: 'قالب الدفعات',
      type: 'batch',
      format: 'EAN13',
      width: 50,
      height: 25,
      includeText: true,
      fontSize: 8,
      margin: 1,
      prefix: 'BTH',
      isDefault: false
    }
  ]);

  const [generatedBarcodes] = useState<GeneratedBarcode[]>([
    {
      id: '1',
      code: 'PRD001234567890',
      type: 'product',
      format: 'CODE128',
      productName: 'لابتوب HP EliteBook',
      sku: 'HP-001',
      generatedDate: '2025-01-15',
      printedCount: 5,
      status: 'printed'
    },
    {
      id: '2',
      code: 'LOC001',
      type: 'location',
      format: 'QR_CODE',
      location: 'رف A-01',
      generatedDate: '2025-01-14',
      printedCount: 2,
      status: 'printed'
    },
    {
      id: '3',
      code: 'AST987654321',
      type: 'asset',
      format: 'CODE39',
      productName: 'شاشة 4K Dell',
      sku: 'DL-004',
      generatedDate: '2025-01-13',
      printedCount: 1,
      status: 'used'
    },
    {
      id: '4',
      code: 'BTH2025010001',
      type: 'batch',
      format: 'EAN13',
      batchNumber: 'BTH-001',
      generatedDate: '2025-01-12',
      printedCount: 0,
      status: 'generated'
    },
    {
      id: '5',
      code: 'PRD002345678901',
      type: 'product',
      format: 'CODE128',
      productName: 'ماوس لوجيتك',
      sku: 'LG-002',
      generatedDate: '2025-01-11',
      printedCount: 3,
      status: 'printed'
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const filteredBarcodes = generatedBarcodes.filter(barcode => 
    selectedType === 'all' || barcode.type === selectedType
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'bg-blue-100 text-blue-800';
      case 'location': return 'bg-green-100 text-green-800';
      case 'asset': return 'bg-purple-100 text-purple-800';
      case 'batch': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'product': return 'منتج';
      case 'location': return 'موقع';
      case 'asset': return 'أصل';
      case 'batch': return 'دفعة';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-yellow-100 text-yellow-800';
      case 'printed': return 'bg-blue-100 text-blue-800';
      case 'used': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'generated': return 'تم الإنشاء';
      case 'printed': return 'تم الطباعة';
      case 'used': return 'مستخدم';
      default: return status;
    }
  };

  const getFormatText = (format: string) => {
    switch (format) {
      case 'CODE128': return 'كود 128';
      case 'CODE39': return 'كود 39';
      case 'EAN13': return 'EAN-13';
      case 'EAN8': return 'EAN-8';
      case 'QR_CODE': return 'رمز QR';
      case 'DATA_MATRIX': return 'مصفوفة البيانات';
      default: return format;
    }
  };

  const totalBarcodes = generatedBarcodes.length;
  const productBarcodes = generatedBarcodes.filter(b => b.type === 'product').length;
  const locationBarcodes = generatedBarcodes.filter(b => b.type === 'location').length;
  const printedBarcodes = generatedBarcodes.filter(b => b.status === 'printed').length;
  const totalPrintCount = generatedBarcodes.reduce((sum, b) => sum + b.printedCount, 0);

  // Barcode visualization component
  const BarcodePreview = ({ code, format, width, height }: { code: string, format: string, width: number, height: number }) => (
    <div className="border border-gray-300 rounded p-2 bg-white" style={{ width: `${width}mm`, height: `${height}mm` }}>
      <div className="h-full flex flex-col items-center justify-center">
        {format === 'QR_CODE' ? (
          <div className="grid grid-cols-8 gap-0.5">
            {Array.from({ length: 64 }, (_, i) => (
              <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
            ))}
          </div>
        ) : (
          <>
            <div className="flex space-x-0.5 mb-1">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className={`w-0.5 ${Math.random() > 0.5 ? 'h-4' : 'h-2'} bg-black`} />
              ))}
            </div>
            <div className="text-xs font-mono">{code}</div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إنتاج الباركود</h1>
          <p className="text-gray-600">إنشاء وإدارة أكواد المنتجات والمواقع</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="h-4 w-4 mr-2" /> : <Grid className="h-4 w-4 mr-2" />}
            {viewMode === 'grid' ? 'عرض القائمة' : 'عرض الشبكة'}
          </Button>
          <Button variant="outline" onClick={() => setShowTemplateModal(true)}>
            <Settings className="h-4 w-4 mr-2" />
            إدارة القوالب
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إنشاء باركود
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الأكواد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{totalBarcodes}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">كود</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">أكواد المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{productBarcodes}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">كود منتج</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">أكواد المواقع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{locationBarcodes}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">كود موقع</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">تم الطباعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">{printedBarcodes}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">كود مطبوع</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الطباعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{totalPrintCount}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">طباعة</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {barcodeTemplates.map((template) => (
          <Card key={template.id} className={`hover:shadow-lg transition-shadow ${template.isDefault ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                {template.isDefault && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    افتراضي
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                    {getTypeText(template.type)}
                  </span>
                  <span className="text-sm text-gray-600">{getFormatText(template.format)}</span>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>الحجم: {template.width}×{template.height} مم</p>
                  <p>الخط: {template.fontSize} نقطة</p>
                  <p>الهامش: {template.margin} مم</p>
                  {template.prefix && <p>البادئة: {template.prefix}</p>}
                </div>

                <div className="flex justify-center py-3">
                  <BarcodePreview 
                    code={`${template.prefix || ''}123456`}
                    format={template.format}
                    width={Math.min(template.width, 60)}
                    height={Math.min(template.height, 30)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => setSelectedTemplate(template.id)}>
                    <QrCode className="h-4 w-4 mr-2" />
                    استخدام
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>الأكواد المُنشأة</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الأكواد..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الأنواع</option>
                <option value="product">منتج</option>
                <option value="location">موقع</option>
                <option value="asset">أصل</option>
                <option value="batch">دفعة</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                تصفية
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBarcodes.map((barcode) => (
                <div key={barcode.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(barcode.type)}`}>
                      {getTypeText(barcode.type)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(barcode.status)}`}>
                      {getStatusText(barcode.status)}
                    </span>
                  </div>

                  <div className="flex justify-center mb-3">
                    <BarcodePreview 
                      code={barcode.code}
                      format={barcode.format}
                      width={60}
                      height={30}
                    />
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-gray-900">{barcode.code}</p>
                    {barcode.productName && (
                      <p className="text-gray-600">{barcode.productName}</p>
                    )}
                    {barcode.sku && (
                      <p className="text-gray-500">SKU: {barcode.sku}</p>
                    )}
                    {barcode.location && (
                      <p className="text-gray-600">الموقع: {barcode.location}</p>
                    )}
                    {barcode.batchNumber && (
                      <p className="text-gray-600">الدفعة: {barcode.batchNumber}</p>
                    )}
                    <p className="text-gray-500">تاريخ الإنشاء: {barcode.generatedDate}</p>
                    <p className="text-gray-500">عدد الطباعات: {barcode.printedCount}</p>
                  </div>

                  <div className="flex gap-1 mt-3">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-3 font-medium text-gray-600">الكود</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-600">النوع</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-600">التفاصيل</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-600">التنسيق</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-600">تاريخ الإنشاء</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-600">الطباعات</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-600">الحالة</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-600">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBarcodes.map((barcode) => (
                    <tr key={barcode.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <BarcodePreview 
                            code={barcode.code}
                            format={barcode.format}
                            width={40}
                            height={20}
                          />
                          <span className="font-mono text-sm">{barcode.code}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(barcode.type)}`}>
                          {getTypeText(barcode.type)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          {barcode.productName && <p className="font-medium">{barcode.productName}</p>}
                          {barcode.sku && <p className="text-gray-600 text-xs">SKU: {barcode.sku}</p>}
                          {barcode.location && <p className="text-gray-600">الموقع: {barcode.location}</p>}
                          {barcode.batchNumber && <p className="text-gray-600">الدفعة: {barcode.batchNumber}</p>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-600">{getFormatText(barcode.format)}</td>
                      <td className="py-3 px-3 text-gray-600">{barcode.generatedDate}</td>
                      <td className="py-3 px-3 font-medium">{barcode.printedCount}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(barcode.status)}`}>
                          {getStatusText(barcode.status)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>إنشاء باركود جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع الباركود</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>اختر نوع الباركود</option>
                <option value="product">منتج</option>
                <option value="location">موقع</option>
                <option value="asset">أصل</option>
                <option value="batch">دفعة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">القالب</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>اختر القالب</option>
                {barcodeTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({getFormatText(template.format)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المنتج/العنصر</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>اختر المنتج</option>
                <option>لابتوب HP EliteBook</option>
                <option>ماوس لوجيتك</option>
                <option>كيبورد ميكانيكي</option>
                <option>شاشة 4K Dell</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الكمية</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                  defaultValue="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم البداية</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                  defaultValue="1"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">معاينة الباركود:</p>
              <div className="flex justify-center">
                <BarcodePreview 
                  code="PRD001234567890"
                  format="CODE128"
                  width={80}
                  height={30}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <QrCode className="h-4 w-4 mr-2" />
                إنشاء الباركود
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                إنشاء وطباعة
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إحصائيات الباركود</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">التوزيع حسب النوع</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-800">منتجات</span>
                    <span className="font-medium text-blue-900">60%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-800">مواقع</span>
                    <span className="font-medium text-blue-900">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-800">أصول</span>
                    <span className="font-medium text-blue-900">10%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-800">دفعات</span>
                    <span className="font-medium text-blue-900">5%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <h4 className="font-medium text-green-900 mb-3">أكثر التنسيقات استخداماً</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-800">CODE128</span>
                    <span className="font-medium text-green-900">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-800">QR Code</span>
                    <span className="font-medium text-green-900">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-800">EAN-13</span>
                    <span className="font-medium text-green-900">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-800">CODE39</span>
                    <span className="font-medium text-green-900">10%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-3">نشاط الطباعة</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-800">اليوم</span>
                    <span className="font-medium text-yellow-900">15 طباعة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-800">هذا الأسبوع</span>
                    <span className="font-medium text-yellow-900">87 طباعة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-800">هذا الشهر</span>
                    <span className="font-medium text-yellow-900">324 طباعة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-800">متوسط يومي</span>
                    <span className="font-medium text-yellow-900">12 طباعة</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">إدارة قوالب الباركود</h2>
              <Button variant="ghost" onClick={() => setShowTemplateModal(false)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                إضافة قالب جديد
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {barcodeTemplates.map((template) => (
                  <div key={template.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{template.name}</h3>
                      {template.isDefault && (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          افتراضي
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {getTypeText(template.type)} - {getFormatText(template.format)}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        تعديل
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
