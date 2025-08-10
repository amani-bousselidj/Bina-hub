'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { CustomerSearchWidget, type Customer } from '@/components/admin/store/CustomerSearchWidget';
import { toast } from 'sonner';
import { 
  Package, 
  Plus, 
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  DollarSign,
  Layers,
  ShoppingCart,
  Scan,
  Star,
  Award,
  Target,
  Activity,
  User,
  Info
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProductCategory {
  id: string;
  name: string;
  arabicName: string;
  color: string;
}

interface Product {
  id: string;
  productCode: string;
  name: string;
  arabicName: string;
  category: ProductCategory;
  price: number;
  cost: number;
  discountPrice?: number;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
  status: 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
  barcode?: string;
  taxRate: number;
  profitMargin: number;
  revenue: number;
  description?: string;
  supplier?: string;
  lastUpdated: string;
}

export default function ProductsManagementPage() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [categories] = useState<ProductCategory[]>([
    { id: '1', name: 'Cement', arabicName: 'الأسمنت', color: 'bg-blue-100 text-blue-800' },
    { id: '2', name: 'Steel', arabicName: 'الحديد', color: 'bg-gray-100 text-gray-800' },
    { id: '3', name: 'Sand', arabicName: 'الرمل', color: 'bg-yellow-100 text-yellow-800' },
    { id: '4', name: 'Bricks', arabicName: 'الطوب', color: 'bg-red-100 text-red-800' },
    { id: '5', name: 'Paint', arabicName: 'الدهانات', color: 'bg-green-100 text-green-800' },
    { id: '6', name: 'Tools', arabicName: 'الأدوات', color: 'bg-purple-100 text-purple-800' }
  ]);

  const [products, setProducts] = useState<any[]>([]);;

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.arabicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category.id === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'discontinued': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'out_of_stock': return 'نفد المخزون';
      case 'discontinued': return 'متوقف';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <Clock className="h-4 w-4" />;
      case 'out_of_stock': return <AlertCircle className="h-4 w-4" />;
      case 'discontinued': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: ProductCategory) => {
    return category.color;
  };

  // Customer selection state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const outOfStockProducts = products.filter(p => p.status === 'out_of_stock').length;
  const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.minStockLevel).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*,store:stores(*)')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        return;
      }
      
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Enhanced Header with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة المنتجات المتقدمة</h1>
            <p className="text-blue-100">نظام إدارة شامل للمنتجات والمخزون مع التتبع المالي والعملاء</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              تصدير المنتجات
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Upload className="h-4 w-4 mr-2" />
              استيراد منتجات
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              منتج جديد
            </Button>
          </div>
        </div>
        
        {/* Statistics Cards in Header */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-200" />
              <div>
                <p className="text-blue-100 text-sm">إجمالي المنتجات</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-200" />
              <div>
                <p className="text-blue-100 text-sm">قيمة المخزون</p>
                <p className="text-2xl font-bold">{totalInventoryValue.toLocaleString('ar-SA')} ر.س</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-200" />
              <div>
                <p className="text-blue-100 text-sm">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString('ar-SA')} ر.س</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-orange-200" />
              <div>
                <p className="text-blue-100 text-sm">منتجات منخفضة المخزون</p>
                <p className="text-2xl font-bold">{lowStockProducts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Search Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <User className="h-5 w-5" />
            البحث عن العملاء والمشاريع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerSearchWidget
            onCustomerSelect={(customer: Customer) => {
              setSelectedCustomer(customer);
              toast.success(`تم اختيار العميل: ${customer.name}`);
            }}
            placeholder="البحث عن عميل أو مشروع لعرض تفاصيل التوريد..."
          />
          
          {selectedCustomer && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">العميل المحدد</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">الاسم:</span>
                  <span className="font-medium mr-2">{selectedCustomer.name}</span>
                </div>
                {selectedCustomer.phone && (
                  <div>
                    <span className="text-gray-600">الهاتف:</span>
                    <span className="font-medium mr-2">{selectedCustomer.phone}</span>
                  </div>
                )}
                {selectedCustomer.email && (
                  <div>
                    <span className="text-gray-600">البريد:</span>
                    <span className="font-medium mr-2">{selectedCustomer.email}</span>
                  </div>
                )}
                {selectedCustomer.address && (
                  <div className="col-span-2">
                    <span className="text-gray-600">العنوان:</span>
                    <span className="font-medium mr-2">{selectedCustomer.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Products List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">قائمة المنتجات</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الفئات</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.arabicName}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="out_of_stock">نفد المخزون</option>
                <option value="discontinued">متوقف</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                تصفية متقدمة
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className={`p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer ${
                  selectedProduct?.id === product.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{product.arabicName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(product.status)}`}>
                          {getStatusIcon(product.status)}
                          {getStatusText(product.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                          {product.category.arabicName}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{product.name}</p>
                      <p className="text-sm text-blue-600">{product.productCode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Scan className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">السعر:</span>
                      <span className="font-medium text-green-600">{product.price.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التكلفة:</span>
                      <span className="font-medium">{product.cost.toLocaleString()} ريال</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المخزون:</span>
                      <span className={`font-medium ${product.stockQuantity === 0 ? 'text-red-600' : product.stockQuantity <= product.minStockLevel ? 'text-yellow-600' : 'text-green-600'}`}>
                        {product.stockQuantity} {product.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحد الأدنى:</span>
                      <span className="font-medium">{product.minStockLevel} {product.unit}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">هامش الربح:</span>
                      <span className="font-medium text-blue-600">{product.profitMargin.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الضريبة:</span>
                      <span className="font-medium">{product.taxRate}%</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الإيرادات:</span>
                      <span className="font-medium text-green-600">{product.revenue.toLocaleString()} ريال</span>
                    </div>
                    {product.barcode && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">الباركود:</span>
                        <span className="font-medium font-mono text-xs">{product.barcode}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
                    {product.supplier && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">المورد:</span>
                        <span className="font-medium">{product.supplier}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">آخر تحديث:</span>
                      <span className="font-medium">{new Date(product.lastUpdated).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    إضافة للمبيعات
                  </Button>
                  <Button size="sm" variant="outline">
                    <Layers className="h-4 w-4 mr-2" />
                    تحديث المخزون
                  </Button>
                  <Button size="sm" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    عرض التقرير
                  </Button>
                  <Button size="sm" variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    إضافة للمفضلة
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Product Details Panel */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              تفاصيل المنتج {selectedProduct.arabicName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">المعلومات الأساسية</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">كود المنتج:</span>
                    <span className="font-medium">{selectedProduct.productCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الاسم العربي:</span>
                    <span className="font-medium">{selectedProduct.arabicName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الاسم الإنجليزي:</span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الفئة:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(selectedProduct.category)}`}>
                      {selectedProduct.category.arabicName}
                    </span>
                  </div>
                  {selectedProduct.barcode && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">الباركود:</span>
                      <span className="font-medium">{selectedProduct.barcode}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(selectedProduct.status)}`}>
                      {getStatusIcon(selectedProduct.status)}
                      {getStatusText(selectedProduct.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">الأسعار والربحية</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">سعر البيع:</span>
                    <span className="font-medium text-green-600">{selectedProduct.price.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التكلفة:</span>
                    <span className="font-medium">{selectedProduct.cost.toLocaleString()} ريال</span>
                  </div>
                  {selectedProduct.discountPrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">سعر الخصم:</span>
                      <span className="font-medium text-orange-600">{selectedProduct.discountPrice.toLocaleString()} ريال</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">هامش الربح:</span>
                    <span className="font-medium text-blue-600">{selectedProduct.profitMargin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الضريبة:</span>
                    <span className="font-medium">{selectedProduct.taxRate}%</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">إجمالي الإيرادات:</span>
                    <span className="font-bold text-green-600">{selectedProduct.revenue.toLocaleString()} ريال</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}





