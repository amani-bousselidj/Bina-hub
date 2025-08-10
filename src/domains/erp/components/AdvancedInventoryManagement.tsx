// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Scan, 
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstocked';
}

interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: string;
  user: string;
}

export default function AdvancedInventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [isRTL] = useState(false); // Based on current language

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'سيراميك أبيض 60x60',
        sku: 'CER-WHT-6060',
        category: 'سيراميك',
        quantity: 150,
        minStock: 50,
        maxStock: 500,
        unitPrice: 85.00,
        supplier: 'مصنع الخزف الوطني',
        location: 'مخزن A-1',
        lastUpdated: '2024-01-15',
        status: 'in_stock'
      },
      {
        id: '2',
        name: 'رخام كرارا طبيعي',
        sku: 'MAR-CAR-NAT',
        category: 'رخام',
        quantity: 25,
        minStock: 30,
        maxStock: 200,
        unitPrice: 450.00,
        supplier: 'شركة الرخام الإيطالي',
        location: 'مخزن B-2',
        lastUpdated: '2024-01-14',
        status: 'low_stock'
      },
      {
        id: '3',
        name: 'أسمنت بورتلاندي',
        sku: 'CEM-POR-50KG',
        category: 'مواد البناء',
        quantity: 0,
        minStock: 100,
        maxStock: 1000,
        unitPrice: 18.50,
        supplier: 'مصنع الإسمنت العربي',
        location: 'مخزن C-1',
        lastUpdated: '2024-01-13',
        status: 'out_of_stock'
      },
      {
        id: '4',
        name: 'طوب أحمر',
        sku: 'BRK-RED-STD',
        category: 'طوب',
        quantity: 5000,
        minStock: 1000,
        maxStock: 3000,
        unitPrice: 0.85,
        supplier: 'معمل الطوب الحديث',
        location: 'ساحة خارجية',
        lastUpdated: '2024-01-15',
        status: 'overstocked'
      }
    ];

    const mockMovements: StockMovement[] = [
      {
        id: '1',
        productId: '1',
        type: 'in',
        quantity: 100,
        reason: 'وصول دفعة جديدة',
        date: '2024-01-15',
        user: 'أحمد محمد'
      },
      {
        id: '2',
        productId: '2',
        type: 'out',
        quantity: 15,
        reason: 'بيع للعميل',
        date: '2024-01-14',
        user: 'فاطمة علي'
      }
    ];

    setProducts(mockProducts);
    setMovements(mockMovements);
  }, []);

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'overstocked': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'in_stock': return 'متوفر';
      case 'low_stock': return 'مخزون منخفض';
      case 'out_of_stock': return 'نفد المخزون';
      case 'overstocked': return 'مخزون زائد';
      default: return 'غير معروف';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const inventoryStats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0),
    lowStockItems: products.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length,
    outOfStockItems: products.filter(p => p.status === 'out_of_stock').length
  };

  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += product.quantity;
      existing.count += 1;
    } else {
      acc.push({
        name: product.category,
        value: product.quantity,
        count: 1
      });
    }
    return acc;
  }, [] as any[]);

  const stockLevelData = products.map(product => ({
    name: product.name.substring(0, 20) + (product.name.length > 20 ? '...' : ''),
    current: product.quantity,
    min: product.minStock,
    max: product.maxStock
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className={`space-y-6 p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المخزون المتقدمة</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowBarcodeScanner(!showBarcodeScanner)} variant="outline">
            <Scan className="w-4 h-4 mr-2" />
            مسح الباركود
          </Button>
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </Button>
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            <Upload className="w-4 h-4 mr-2" />
            استيراد
          </Button>
          <Button onClick={() => alert('Button clicked')}>
            <Plus className="w-4 h-4 mr-2" />
            إضافة منتج
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold">{inventoryStats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">قيمة المخزون</p>
                <p className="text-2xl font-bold">{inventoryStats.totalValue.toLocaleString('en-US')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">مخزون منخفض</p>
                <p className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">نفد المخزون</p>
                <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>توزيع المخزون حسب الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مستويات المخزون</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#8884d8" name="المخزون الحالي" />
                <Bar dataKey="min" fill="#ff7300" name="الحد الأدنى" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">جميع الفئات</option>
          <option value="سيراميك">سيراميك</option>
          <option value="رخام">رخام</option>
          <option value="مواد البناء">مواد البناء</option>
          <option value="طوب">طوب</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">جميع الحالات</option>
          <option value="in_stock">متوفر</option>
          <option value="low_stock">مخزون منخفض</option>
          <option value="out_of_stock">نفد المخزون</option>
          <option value="overstocked">مخزون زائد</option>
        </select>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">المنتج</th>
                  <th className="text-right p-3">رمز المنتج</th>
                  <th className="text-right p-3">الفئة</th>
                  <th className="text-right p-3">الكمية</th>
                  <th className="text-right p-3">السعر</th>
                  <th className="text-right p-3">المورد</th>
                  <th className="text-right p-3">الحالة</th>
                  <th className="text-right p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.location}</div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-sm">{product.sku}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{product.quantity}</div>
                        <div className="text-xs text-gray-500">
                          حد أدنى: {product.minStock} | حد أقصى: {product.maxStock}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{product.unitPrice.toLocaleString('en-US')}</td>
                    <td className="p-3">{product.supplier}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusText(product.status)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedProduct(product)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600" onClick={() => alert('Button clicked')}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>مسح الباركود</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg mb-4">
                <p className="text-gray-600">كاميرا مسح الباركود ستظهر هنا</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setShowBarcodeScanner(false)} variant="outline" className="flex-1">
                  إلغاء
                </Button>
                <Button className="flex-1" onClick={() => alert('Button clicked')}>
                  مسح
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Stock Movements */}
      <Card>
        <CardHeader>
          <CardTitle>حركات المخزون الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {movements.map((movement) => {
              const product = products.find(p => p.id === movement.productId);
              return (
                <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      movement.type === 'in' ? 'bg-green-500' : 
                      movement.type === 'out' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <div className="font-medium">{product?.name}</div>
                      <div className="text-sm text-gray-500">{movement.reason}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      movement.type === 'in' ? 'text-green-600' : 
                      movement.type === 'out' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '±'}{movement.quantity}
                    </div>
                    <div className="text-sm text-gray-500">{movement.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}









