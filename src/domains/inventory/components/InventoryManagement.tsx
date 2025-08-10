// @ts-nocheck
// Enhanced Inventory Management System
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Search, 
  Filter,
  Plus,
  Minus,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  Eye,
  RefreshCw,
  Users,
  Navigation,
  Info
} from 'lucide-react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui';
import { toast } from 'react-hot-toast';
import { CustomerSearchWidget, CustomerDetailModal, type Customer } from '@/components/admin/store/CustomerSearchWidget';

interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  location: string;
  supplier: string;
  status: 'active' | 'inactive' | 'discontinued';
  last_restocked: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface StockMovement {
  id: string;
  product_id: string;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reason: string;
  reference: string;
  created_at: string;
  created_by: string;
}

interface InventoryStats {
  total_products: number;
  total_value: number;
  low_stock_items: number;
  out_of_stock_items: number;
  categories: string[];
}

export default function EnhancedInventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, low, out
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  
  // Customer search functionality
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [customerDetailData, setCustomerDetailData] = useState<Customer | null>(null);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadInventoryData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, statusFilter, stockFilter]);

  // Customer handling functions
  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    toast.success(`تم اختيار العميل: ${customer.name} - ${customer.projectType}`);
  };

  const handleShowCustomerDetails = (customer: Customer) => {
    setCustomerDetailData(customer);
    setShowCustomerDetail(true);
  };

  const clearCustomerSelection = () => {
    setSelectedCustomer(null);
  };

  // Load all inventory data
  const loadInventoryData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', user.id)
        .order('name');

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Load recent stock movements
      const { data: movementsData, error: movementsError } = await supabase
        .from('stock_movements')
        .select('*')
        .eq('store_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (movementsError) throw movementsError;
      setStockMovements(movementsData || []);

      // Calculate stats
      calculateStats(productsData || []);

    } catch (error) {
      console.error('Error loading inventory data:', error);
      toast.error('فشل في تحميل بيانات المخزون');
    } finally {
      setLoading(false);
    }
  };

  // Calculate inventory statistics
  const calculateStats = (productsData: Product[]) => {
    const stats: InventoryStats = {
      total_products: productsData.length,
      total_value: productsData.reduce((sum, p) => sum + (p.stock_quantity * p.cost_price), 0),
      low_stock_items: productsData.filter(p => p.stock_quantity <= p.min_stock_level && p.stock_quantity > 0).length,
      out_of_stock_items: productsData.filter(p => p.stock_quantity === 0).length,
      categories: [...new Set(productsData.map(p => p.category))].filter(Boolean)
    };
    setStats(stats);
  };

  // Filter products based on search and filters
  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    // Stock level filter
    if (stockFilter === 'low') {
      filtered = filtered.filter(product => 
        product.stock_quantity <= product.min_stock_level && product.stock_quantity > 0
      );
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(product => product.stock_quantity === 0);
    }

    setFilteredProducts(filtered);
  };

  // Handle stock adjustment
  const handleStockAdjustment = async () => {
    if (!selectedProduct || adjustmentQuantity === 0) {
      toast.error('يرجى إدخال كمية صحيحة');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newQuantity = selectedProduct.stock_quantity + adjustmentQuantity;
      
      if (newQuantity < 0) {
        toast.error('لا يمكن أن تكون الكمية أقل من صفر');
        return;
      }

      // Update product quantity
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          stock_quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProduct.id);

      if (updateError) throw updateError;

      // Record stock movement
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert([{
          store_id: user.id,
          product_id: selectedProduct.id,
          movement_type: 'adjustment',
          quantity: Math.abs(adjustmentQuantity),
          previous_quantity: selectedProduct.stock_quantity,
          new_quantity: newQuantity,
          reason: adjustmentReason || 'تعديل المخزون',
          reference: `ADJ-${Date.now()}`,
          created_by: user.id
        }]);

      if (movementError) throw movementError;

      toast.success('تم تحديث المخزون بنجاح');
      setShowAdjustModal(false);
      setSelectedProduct(null);
      setAdjustmentQuantity(0);
      setAdjustmentReason('');
      loadInventoryData();

    } catch (error) {
      console.error('Error adjusting stock:', error);
      toast.error('فشل في تحديث المخزون');
    }
  };

  // Get stock status badge
  const getStockStatusBadge = (product: Product) => {
    if (product.stock_quantity === 0) {
      return <Badge variant="destructive">نفد المخزون</Badge>;
    } else if (product.stock_quantity <= product.min_stock_level) {
      return <Badge variant="secondary">مخزون منخفض</Badge>;
    } else if (product.stock_quantity >= product.max_stock_level) {
      return <Badge variant="default">مخزون مرتفع</Badge>;
    }
    return <Badge variant="outline">طبيعي</Badge>;
  };

  // Get stock level color
  const getStockLevelColor = (product: Product) => {
    if (product.stock_quantity === 0) return 'text-red-600';
    if (product.stock_quantity <= product.min_stock_level) return 'text-orange-600';
    return 'text-green-600';
  };

  // Paginated products
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold">{stats.total_products}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">قيمة المخزون</p>
                <p className="text-2xl font-bold">{stats.total_value.toLocaleString('en-US')} ريال</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مخزون منخفض</p>
                <p className="text-2xl font-bold text-orange-600">{stats.low_stock_items}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">نفد المخزون</p>
                <p className="text-2xl font-bold text-red-600">{stats.out_of_stock_items}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="ابحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">جميع الفئات</option>
            {stats?.categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="discontinued">متوقف</option>
          </select>
          
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">جميع المستويات</option>
            <option value="low">مخزون منخفض</option>
            <option value="out">نفد المخزون</option>
          </select>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button onClick={loadInventoryData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            تحديث
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
            <Upload className="w-4 h-4 mr-2" />
            استيراد
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowCustomerSearch(!showCustomerSearch)}
            className={showCustomerSearch ? 'bg-blue-50 text-blue-700' : ''}
          >
            <Users className="w-4 h-4 mr-2" />
            البحث عن عميل
          </Button>
        </div>
      </Card>

      {/* Customer Search Section */}
      {showCustomerSearch && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">البحث عن العملاء لمعلومات المشروع والتسليم</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCustomerSearch(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CustomerSearchWidget
                onCustomerSelect={handleCustomerSelect}
                showProjectDetails={true}
                showDeliveryInfo={true}
                compact={true}
                placeholder="البحث عن العملاء لمعلومات المشروع والتسليم..."
              />
              
              {selectedCustomer && (
                <Card className="p-3 bg-green-50 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-green-900 flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      معلومات التسليم للطلب
                    </h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShowCustomerDetails(selectedCustomer)}
                      >
                        <Info className="h-3 w-3 mr-1" />
                        تفاصيل كاملة
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={clearCustomerSelection}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-green-900">العميل:</p>
                        <p className="text-green-800">{selectedCustomer.name}</p>
                        <p className="text-green-700">{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <p className="font-medium text-green-900">نوع المشروع:</p>
                        <p className="text-green-800">{selectedCustomer.projectType}</p>
                        <p className="text-green-700">{selectedCustomer.projectLocation}</p>
                      </div>
                    </div>
                    
                    {selectedCustomer.projectAddress && (
                      <div className="pt-2 border-t border-green-200">
                        <p className="font-medium text-green-900">عنوان التسليم:</p>
                        <p className="text-green-800">{selectedCustomer.projectAddress}</p>
                        {selectedCustomer.deliveryInstructions && (
                          <p className="text-green-700 mt-1">
                            <span className="font-medium">تعليمات:</span> {selectedCustomer.deliveryInstructions}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Products Table */}
      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-2">المنتج</th>
                <th className="text-right py-2">SKU</th>
                <th className="text-right py-2">الفئة</th>
                <th className="text-right py-2">الكمية</th>
                <th className="text-right py-2">الحد الأدنى</th>
                <th className="text-right py-2">السعر</th>
                <th className="text-right py-2">القيمة</th>
                <th className="text-right py-2">الحالة</th>
                <th className="text-right py-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      {product.image_url && (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{product.sku}</td>
                  <td className="py-3">{product.category}</td>
                  <td className={`py-3 font-bold ${getStockLevelColor(product)}`}>
                    {product.stock_quantity}
                  </td>
                  <td className="py-3">{product.min_stock_level}</td>
                  <td className="py-3">{product.price} ريال</td>
                  <td className="py-3">
                    {(product.stock_quantity * product.cost_price).toLocaleString('en-US')} ريال
                  </td>
                  <td className="py-3">
                    {getStockStatusBadge(product)}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowAdjustModal(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              السابق
            </Button>
            <span className="px-4 py-2">
              {currentPage} من {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              التالي
            </Button>
          </div>
        )}
      </Card>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-96">
            <h2 className="text-lg font-bold mb-4">تعديل المخزون - {selectedProduct.name}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">الكمية الحالية:</label>
                <p className="text-lg font-bold">{selectedProduct.stock_quantity}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">التعديل:</label>
                <Input
                  type="number"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                  placeholder="أدخل الكمية (+ للزيادة، - للنقصان)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">السبب:</label>
                <Input
                  type="text"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="سبب التعديل (اختياري)"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600">
                  الكمية الجديدة: {selectedProduct.stock_quantity + adjustmentQuantity}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={handleStockAdjustment} className="flex-1">
                تأكيد التعديل
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAdjustModal(false);
                  setSelectedProduct(null);
                  setAdjustmentQuantity(0);
                  setAdjustmentReason('');
                }}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Customer Detail Modal */}
      {showCustomerDetail && customerDetailData && (
        <CustomerDetailModal
          customer={customerDetailData}
          onClose={() => setShowCustomerDetail(false)}
          showDeliveryInfo={true}
        />
      )}
    </div>
  );
}










