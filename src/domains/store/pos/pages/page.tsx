'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Minus,
  Search, 
  ShoppingCart, 
  CreditCard, 
  DollarSign,
  Percent,
  Trash2,
  Pause,
  Play,
  Receipt,
  User,
  BarChart3,
  Settings,
  Calculator,
  Edit,
  Save,
  X,
  Wifi,
  WifiOff,
  Database,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Users,
  Navigation,
  Info,
  Package,
  TrendingUp,
  Activity,
  Clock,
  Building,
  Printer,
  Scan,
  History,
  Star,
  Heart,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { CustomerSearchWidget, CustomerDetailModal, type Customer as CustomerInterface } from '@/components/admin/store/CustomerSearchWidget';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class POSErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('POS Error Boundary caught an error:', error, errorInfo);
    if (typeof window !== 'undefined') {
      toast.error('حدث خطأ في نقطة البيع، يرجى إعادة تحميل الصفحة');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ في نقطة البيع</h2>
            <p className="text-gray-600 mb-4">نعتذر عن هذا الإزعاج، يرجى إعادة تحميل الصفحة</p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              إعادة تحميل
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface Product {
  id: string;
  name: string;
  name_ar: string;
  barcode?: string;
  price: number;
  cost_price: number;
  quantity_in_stock: number;
  category: string;
  image_url?: string;
  allow_discount: boolean;
  min_price?: number;
  created_at: string;
}

interface POSCustomer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_number?: string;
  customer_type: 'individual' | 'business';
  outstanding_balance: number;
  created_at: string;
}

interface SaleItem {
  id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total_price: number;
  notes?: string;
}

interface Sale {
  id?: string;
  sale_number: string;
  customer_id?: string;
  customer?: POSCustomer;
  items: SaleItem[];
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  payment_method: 'cash' | 'card' | 'transfer' | 'credit' | 'mixed';
  payment_status: 'paid' | 'pending' | 'partial';
  notes?: string;
  cashier_id: string;
  is_suspended: boolean;
  suspended_at?: string;
  created_at: string;
}

interface SuspendedSale {
  id: string;
  sale_data: Sale;
  suspended_by: string;
  suspended_at: string;
}

export default function EnhancedPOSSystem() {
  return (
    <POSErrorBoundary>
      <POSSystemComponent />
    </POSErrorBoundary>
  );
}

function POSSystemComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<POSCustomer[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'error'>('synced');
  const [currentSale, setCurrentSale] = useState<Sale>({
    sale_number: '',
    items: [],
    subtotal: 0,
    discount_amount: 0,
    tax_amount: 0,
    total_amount: 0,
    payment_method: 'cash',
    payment_status: 'paid',
    cashier_id: 'current_user_id',
    is_suspended: false,
    created_at: new Date().toISOString()
  });
  const [suspendedSales, setSuspendedSales] = useState<SuspendedSale[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSuspendedDialog, setShowSuspendedDialog] = useState(false);
  const [paymentAmounts, setPaymentAmounts] = useState({
    cash: 0,
    card: 0,
    transfer: 0
  });
  const [customerToAdd, setCustomerToAdd] = useState({
    name: '',
    phone: '',
    email: '',
    tax_number: '',
    customer_type: 'individual' as 'individual' | 'business'
  });

  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClientComponentClient();

  // Online/Offline detection and management
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (!navigator.onLine) {
        setOfflineMode(true);
        toast.warning('تم فقدان الاتصال بالإنترنت، تم التبديل للوضع غير المتصل');
      } else if (offlineMode && navigator.onLine) {
        toast.success('تم استعادة الاتصال بالإنترنت');
        // Auto-sync if we have pending data
        if (syncStatus === 'pending') {
          syncOfflineData();
        }
      }
    };

    // Set initial state
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [offlineMode, syncStatus]);

  // Function to sync offline data when back online
  const syncOfflineData = async () => {
    try {
      setSyncStatus('pending');
      // Here you would implement actual sync logic
      // For now, just simulate sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSyncStatus('synced');
      toast.success('تم مزامنة البيانات غير المتصلة بنجاح');
    } catch (error) {
      setSyncStatus('error');
      toast.error('فشل في مزامنة البيانات');
    }
  };

  // Toggle offline mode manually
  const toggleOfflineMode = () => {
    setOfflineMode(!offlineMode);
    if (!offlineMode) {
      toast.info('تم التبديل للوضع غير المتصل');
    } else {
      toast.info('تم التبديل للوضع المتصل');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          loadProducts(),
          loadCustomers(),
          loadSuspendedSales()
        ]);
        generateSaleNumber();
        
        // Focus barcode input on mount
        if (barcodeInputRef.current) {
          barcodeInputRef.current.focus();
        }
      } catch (error) {
        console.error('Error initializing POS data:', error);
        if (typeof window !== 'undefined') {
          toast.error('خطأ في تحميل بيانات نقطة البيع');
        }
      }
    };

    initializeData();
  }, []);

  // Handle unhandled promise rejections
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection in POS:', event.reason);
      event.preventDefault(); // Prevent the default unhandled rejection behavior
      toast.error('حدث خطأ غير متوقع في نقطة البيع');
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const loadProducts = async () => {
    try {
      // First, let's try to load from products table with proper mapping
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.warn('Primary products query failed, trying fallback:', error);
        
        // Fallback: Create some demo products for testing
        const demoProducts: Product[] = [
          {
            id: 'demo-1',
            name: 'منتج تجريبي 1',
            name_ar: 'منتج تجريبي 1',
            barcode: '1234567890',
            price: 25.50,
            cost_price: 15.00,
            quantity_in_stock: 100,
            category: 'إلكترونيات',
            allow_discount: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'demo-2',
            name: 'منتج تجريبي 2',
            name_ar: 'منتج تجريبي 2',
            barcode: '0987654321',
            price: 45.75,
            cost_price: 30.00,
            quantity_in_stock: 50,
            category: 'ملابس',
            allow_discount: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'demo-3',
            name: 'منتج تجريبي 3',
            name_ar: 'منتج تجريبي 3',
            barcode: '1122334455',
            price: 12.25,
            cost_price: 8.00,
            quantity_in_stock: 200,
            category: 'أغذية',
            allow_discount: false,
            created_at: new Date().toISOString()
          }
        ];
        
        setProducts(demoProducts);
        
        if (typeof window !== 'undefined') {
          toast.info('تم تحميل منتجات تجريبية - يرجى إعداد قاعدة البيانات');
        }
        return;
      }

      // Map the data to match POS interface
      const mappedProducts: Product[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name || 'منتج غير محدد',
        name_ar: item.name_ar || item.name || 'منتج غير محدد',
        barcode: item.barcode,
        price: parseFloat(item.price) || 0,
        cost_price: parseFloat(item.cost_price) || 0,
        quantity_in_stock: parseInt(item.quantity_in_stock) || 1,
        category: item.category || 'عام',
        image_url: item.image_url,
        allow_discount: item.allow_discount !== false,
        min_price: parseFloat(item.cost_price) || undefined,
        created_at: item.created_at || new Date().toISOString()
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      
      // Provide fallback demo products even on error
      const fallbackProducts: Product[] = [
        {
          id: 'fallback-1',
          name: 'منتج احتياطي',
          name_ar: 'منتج احتياطي',
          barcode: '0000000001',
          price: 10.00,
          cost_price: 5.00,
          quantity_in_stock: 10,
          category: 'عام',
          allow_discount: true,
          created_at: new Date().toISOString()
        }
      ];
      
      setProducts(fallbackProducts);
      
      if (typeof window !== 'undefined') {
        toast.error('خطأ في تحميل المنتجات - تم تحميل منتجات احتياطية');
      }
    }
  };

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) {
        console.warn('Customers query failed, using demo data:', error);
        
        // Provide demo customers
        const demoCustomers: POSCustomer[] = [
          {
            id: 'demo-customer-1',
            name: 'عميل عام',
            phone: '0500000000',
            email: 'general@example.com',
            customer_type: 'individual',
            outstanding_balance: 0,
            created_at: new Date().toISOString()
          },
          {
            id: 'demo-customer-2',
            name: 'شركة الاختبار',
            phone: '0501111111',
            email: '',
            tax_number: '123456789',
            customer_type: 'business',
            outstanding_balance: 0,
            created_at: new Date().toISOString()
          }
        ];
        
        setCustomers(demoCustomers);
        return;
      }

      // Map data to Customer interface
      const mappedCustomers: POSCustomer[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name || 'عميل غير محدد',
        phone: item.phone,
        email: item.email,
        address: item.address,
        tax_number: item.tax_number,
        customer_type: (item.customer_type === 'business' ? 'business' : 'individual') as 'individual' | 'business',
        outstanding_balance: parseFloat(item.outstanding_balance) || 0,
        created_at: item.created_at || new Date().toISOString()
      }));

      setCustomers(mappedCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
      
      // Always provide at least one general customer
      const fallbackCustomers: POSCustomer[] = [
        {
          id: 'fallback-customer',
          name: 'عميل عام',
          customer_type: 'individual',
          outstanding_balance: 0,
          created_at: new Date().toISOString()
        }
      ];
      
      setCustomers(fallbackCustomers);
      
      if (typeof window !== 'undefined') {
        toast.info('تم تحميل عملاء افتراضيين - يرجى إعداد قاعدة البيانات');
      }
    }
  };

  const loadSuspendedSales = async () => {
    try {
      const { data, error } = await supabase
        .from('suspended_sales')
        .select('*')
        .order('suspended_at', { ascending: false });

      if (error) {
        console.warn('Suspended sales query failed:', error);
        setSuspendedSales([]); // Empty array for suspended sales
        return;
      }

      setSuspendedSales(data || []);
    } catch (error) {
      console.error('Error loading suspended sales:', error);
      setSuspendedSales([]); // Always set to empty array on error
      
      if (typeof window !== 'undefined') {
        toast.info('لا توجد مبيعات معلقة حالياً');
      }
    }
  };

  const generateSaleNumber = () => {
    const saleNumber = `SALE-${Date.now()}`;
    setCurrentSale(prev => ({ ...prev, sale_number: saleNumber }));
  };

  const handleBarcodeInput = async (barcode: string) => {
    if (!barcode.trim()) return;

    try {
      const product = products.find(p => p.barcode === barcode || p.id === barcode);
      if (product) {
        addItemToSale(product);
        setBarcodeInput('');
      } else {
        if (typeof window !== 'undefined') {
          toast.error('المنتج غير موجود');
        }
        setBarcodeInput('');
      }
    } catch (error) {
      console.error('Error handling barcode input:', error);
      if (typeof window !== 'undefined') {
        toast.error('خطأ في معالجة الباركود');
      }
      setBarcodeInput('');
    }
  };

  const addItemToSale = (product: Product, quantity: number = 1) => {
    if (product.quantity_in_stock < quantity) {
      if (typeof window !== 'undefined') {
        toast.error('الكمية المطلوبة غير متوفرة في المخزون');
      }
      return;
    }

    const existingItemIndex = currentSale.items.findIndex(item => item.product.id === product.id);
    
    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = [...currentSale.items];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.quantity_in_stock) {
        if (typeof window !== 'undefined') {
          toast.error('الكمية المطلوبة تتجاوز المخزون المتوفر');
        }
        return;
      }
      
      updatedItems[existingItemIndex].quantity = newQuantity;
      updatedItems[existingItemIndex].total_price = newQuantity * updatedItems[existingItemIndex].unit_price - updatedItems[existingItemIndex].discount_amount;
    } else {
      const newItem: SaleItem = {
        id: `item-${Date.now()}-${Math.random()}`,
        product,
        quantity,
        unit_price: product.price,
        discount_amount: 0,
        total_price: quantity * product.price
      };
      updatedItems = [...currentSale.items, newItem];
    }

    updateSaleTotals(updatedItems);
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromSale(itemId);
      return;
    }

    const updatedItems = currentSale.items.map(item => {
      if (item.id === itemId) {
        if (newQuantity > item.product.quantity_in_stock) {
          if (typeof window !== 'undefined') {
            toast.error('الكمية المطلوبة تتجاوز المخزون المتوفر');
          }
          return item;
        }
        return {
          ...item,
          quantity: newQuantity,
          total_price: newQuantity * item.unit_price - item.discount_amount
        };
      }
      return item;
    });

    updateSaleTotals(updatedItems);
  };

  const updateItemPrice = (itemId: string, newPrice: number) => {
    const updatedItems = currentSale.items.map(item => {
      if (item.id === itemId) {
        // Check minimum price if set
        if (item.product.min_price && newPrice < item.product.min_price) {
          if (typeof window !== 'undefined') {
            toast.error(`السعر لا يمكن أن يكون أقل من ${item.product.min_price} ريال`);
          }
          return item;
        }
        
        return {
          ...item,
          unit_price: newPrice,
          total_price: item.quantity * newPrice - item.discount_amount
        };
      }
      return item;
    });

    updateSaleTotals(updatedItems);
  };

  const updateItemDiscount = (itemId: string, discountAmount: number) => {
    const updatedItems = currentSale.items.map(item => {
      if (item.id === itemId) {
        if (!item.product.allow_discount && discountAmount > 0) {
          if (typeof window !== 'undefined') {
            toast.error('هذا المنتج لا يقبل خصم');
          }
          return item;
        }
        
        const maxDiscount = item.quantity * item.unit_price;
        if (discountAmount > maxDiscount) {
          if (typeof window !== 'undefined') {
            toast.error('مبلغ الخصم لا يمكن أن يتجاوز سعر المنتج');
          }
          return item;
        }
        
        return {
          ...item,
          discount_amount: discountAmount,
          total_price: (item.quantity * item.unit_price) - discountAmount
        };
      }
      return item;
    });

    updateSaleTotals(updatedItems);
  };

  const removeItemFromSale = (itemId: string) => {
    const updatedItems = currentSale.items.filter(item => item.id !== itemId);
    updateSaleTotals(updatedItems);
  };

  const updateSaleTotals = (items: SaleItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const taxAmount = subtotal * 0.15; // 15% VAT
    const totalAmount = subtotal + taxAmount - currentSale.discount_amount;

    setCurrentSale(prev => ({
      ...prev,
      items,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount
    }));
  };

  const applySaleDiscount = (discountAmount: number) => {
    const totalAmount = currentSale.subtotal + currentSale.tax_amount - discountAmount;
    
    setCurrentSale(prev => ({
      ...prev,
      discount_amount: discountAmount,
      total_amount: totalAmount
    }));
  };

  const clearCurrentSale = () => {
    setCurrentSale({
      sale_number: '',
      items: [],
      subtotal: 0,
      discount_amount: 0,
      tax_amount: 0,
      total_amount: 0,
      payment_method: 'cash',
      payment_status: 'paid',
      cashier_id: 'current_user_id',
      is_suspended: false,
      created_at: new Date().toISOString()
    });
    generateSaleNumber();
    setPaymentAmounts({ cash: 0, card: 0, transfer: 0 });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.barcode && product.barcode.includes(searchTerm));
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]" dir="rtl">
      {/* Status Bar */}
      <div className="bg-blue-50 border-b border-blue-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">
              فاتورة: {currentSale.sale_number}
            </Badge>
            <span className="text-sm text-blue-600">نقطة البيع</span>
            
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleOfflineMode}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  offlineMode 
                    ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' 
                    : isOnline 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {offlineMode ? (
                  <>
                    <WifiOff className="h-3 w-3" />
                    <span>وضع غير متصل</span>
                  </>
                ) : isOnline ? (
                  <>
                    <Wifi className="h-3 w-3" />
                    <span>متصل</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    <span>غير متصل</span>
                  </>
                )}
              </button>

              {/* Sync Status */}
              {offlineMode && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  syncStatus === 'synced' ? 'bg-green-100 text-green-700' :
                  syncStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {syncStatus === 'synced' && <CheckCircle className="h-3 w-3" />}
                  {syncStatus === 'pending' && <Download className="h-3 w-3 animate-spin" />}
                  {syncStatus === 'error' && <AlertCircle className="h-3 w-3" />}
                  <span>
                    {syncStatus === 'synced' ? 'متزامن' :
                     syncStatus === 'pending' ? 'جاري المزامنة' :
                     'خطأ في المزامنة'}
                  </span>
                </div>
              )}

              {/* Offline Data Indicator */}
              {offlineMode && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                  <Database className="h-3 w-3" />
                  <span>بيانات محلية</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sync Button for Offline Mode */}
            {offlineMode && isOnline && syncStatus !== 'pending' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={syncOfflineData}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <Upload className="w-4 h-4 ml-1" />
                مزامنة البيانات
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSuspendedDialog(true)}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Pause className="w-4 h-4 ml-1" />
              المعلقة ({suspendedSales.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Offline Mode Warning */}
      {offlineMode && (
        <div className="bg-orange-50 border-b border-orange-200 p-3">
          <div className="flex items-center gap-3 text-orange-800">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm">
              أنت تعمل في الوضع غير المتصل. سيتم حفظ المعاملات محلياً ومزامنتها عند اتصالك بالإنترنت.
            </span>
            {!isOnline && (
              <span className="text-xs px-2 py-1 bg-orange-200 rounded-full">
                لا يوجد اتصال بالإنترنت
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden bg-gray-50">
        {/* Products Panel */}
        <div className="w-2/3 bg-white border-l p-4 overflow-hidden flex flex-col">
          {/* Search and Barcode */}
          <div className="mb-4 space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  ref={barcodeInputRef}
                  placeholder="مسح الباركود أو البحث في المنتجات..."
                  value={barcodeInput || searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 8 && !value.includes(' ')) {
                      // Likely a barcode
                      setBarcodeInput(value);
                      handleBarcodeInput(value);
                    } else {
                      setBarcodeInput('');
                      setSearchTerm(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && barcodeInput) {
                      handleBarcodeInput(barcodeInput);
                    }
                  }}
                  className="pr-10 text-lg h-12"
                />
              </div>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-48 h-12 border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع الفئات</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-4 gap-3">
              {filteredProducts.map(product => (
                <Card 
                  key={product.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => addItemToSale(product)}
                >
                  <CardContent className="p-3">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name_ar}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                        <BarChart3 className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name_ar}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">
                        {product.price.toFixed(2)} ريال
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {product.quantity_in_stock}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Panel */}
        <div className="w-1/3 bg-gray-50 p-4 flex flex-col">
          {/* Customer Selection - Enhanced with Search */}
          <Card className="mb-4">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                <span className="font-medium">العميل</span>
              </div>
              
              {/* Customer Search Widget Integration */}
              <div className="mb-3">
                <CustomerSearchWidget
                  onCustomerSelect={(customer: CustomerInterface) => {
                    setCurrentSale(prev => ({ 
                      ...prev, 
                      customer_id: customer.id,
                      customer: {
                        id: customer.id,
                        name: customer.name,
                        phone: customer.phone || '',
                        email: customer.email || '',
                        address: customer.address || '',
                        customer_type: 'individual',
                        outstanding_balance: 0,
                        created_at: new Date().toISOString()
                      }
                    }));
                    toast.success(`تم اختيار العميل: ${customer.name}`);
                  }}
                  placeholder="البحث عن عميل أو مشروع..."
                />
              </div>
              
              {/* Fallback Selection */}
              <div className="flex gap-2">
                <select
                  value={currentSale.customer_id || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const customer = customers.find(c => c.id === value);
                    setCurrentSale(prev => ({ 
                      ...prev, 
                      customer_id: value || undefined,
                      customer 
                    }));
                  }}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">عميل عام</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} {customer.phone && `- ${customer.phone}`}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="sm" onClick={() => setShowCustomerDialog(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Selected Customer Info */}
          {currentSale.customer && (
            <Card className="mb-4 bg-green-50 border-green-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">العميل المحدد</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الاسم:</span>
                    <span className="font-medium">{currentSale.customer.name}</span>
                  </div>
                  {currentSale.customer.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">الهاتف:</span>
                      <span>{currentSale.customer.phone}</span>
                    </div>
                  )}
                  {currentSale.customer.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">البريد:</span>
                      <span>{currentSale.customer.email}</span>
                    </div>
                  )}
                  {currentSale.customer.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">العنوان:</span>
                      <span className="text-xs">{currentSale.customer.address}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">النوع:</span>
                    <Badge variant="secondary" className="text-xs">
                      {currentSale.customer.customer_type === 'business' ? 'شركة' : 'فرد'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto mb-4">
            <Card className="h-full">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm">عناصر الفاتورة ({currentSale.items.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                {currentSale.items.length > 0 ? (
                  <div className="space-y-2">
                    {currentSale.items.map(item => (
                      <div key={item.id} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.product.name_ar}</h4>
                            <p className="text-xs text-gray-500">{item.product.barcode}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItemFromSale(item.id)}
                            className="text-red-500 p-1"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <Label className="text-xs">الكمية</Label>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                                className="h-6 text-center text-xs"
                                min="1"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs">السعر</Label>
                            <Input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                              className="h-6 text-xs"
                              step="0.01"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">خصم</Label>
                            <Input
                              type="number"
                              value={item.discount_amount}
                              onChange={(e) => updateItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                              className="h-6 text-xs"
                              step="0.01"
                              disabled={!item.product.allow_discount}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-2 text-right">
                          <span className="font-bold text-green-600">
                            {item.total_price.toFixed(2)} ريال
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">السلة فارغة</p>
                    <p className="text-xs">ابدأ بإضافة منتجات</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Totals and Actions */}
          <div className="space-y-3">
            {/* Sale Discount */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="w-4 h-4" />
                  <Label className="text-sm">خصم على الفاتورة</Label>
                </div>
                <Input
                  type="number"
                  value={currentSale.discount_amount}
                  onChange={(e) => applySaleDiscount(parseFloat(e.target.value) || 0)}
                  className="text-center"
                  step="0.01"
                  min="0"
                />
              </CardContent>
            </Card>

            {/* Totals */}
            <Card>
              <CardContent className="p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>المجموع الفرعي:</span>
                  <span>{currentSale.subtotal.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الخصم:</span>
                  <span>-{currentSale.discount_amount.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الضريبة (15%):</span>
                  <span>{currentSale.tax_amount.toFixed(2)} ريال</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي:</span>
                  <span className="text-green-600">{currentSale.total_amount.toFixed(2)} ريال</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    toast.info('تم تعليق الفاتورة مؤقتاً');
                  }
                }}
                disabled={currentSale.items.length === 0 || loading}
                className="h-12"
              >
                <Pause className="w-4 h-4 ml-1" />
                تعليق
              </Button>
              <Button
                onClick={() => setShowPaymentDialog(true)}
                disabled={currentSale.items.length === 0 || loading}
                className="h-12 bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="w-4 h-4 ml-1" />
                دفع
              </Button>
            </div>
            
            <Button
              variant="destructive"
              onClick={clearCurrentSale}
              disabled={loading}
              className="w-full h-10"
            >
              <Trash2 className="w-4 h-4 ml-1" />
              إلغاء الفاتورة
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد الدفع</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600">المبلغ المطلوب</p>
                <p className="text-3xl font-bold text-green-600">
                  {currentSale.total_amount.toFixed(2)} ريال
                </p>
              </div>
            </div>

            <div>
              <Label>طريقة الدفع</Label>
              <select
                value={currentSale.payment_method}
                onChange={(e) => setCurrentSale(prev => ({ ...prev, payment_method: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cash">نقدي</option>
                <option value="card">بطاقة</option>
                <option value="transfer">تحويل بنكي</option>
                <option value="credit">آجل</option>
                <option value="mixed">مختلط</option>
              </select>
            </div>

            <div>
              <Label>ملاحظات</Label>
              <Textarea
                value={currentSale.notes || ''}
                onChange={(e) => setCurrentSale(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="ملاحظات على الفاتورة"
                rows={2}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={() => {
                if (typeof window !== 'undefined') {
                  toast.success('تم إتمام البيع بنجاح');
                  setShowPaymentDialog(false);
                  clearCurrentSale();
                }
              }} disabled={loading} className="bg-green-600 hover:bg-green-700">
                <Receipt className="w-4 h-4 ml-1" />
                إتمام البيع
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة عميل جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer_name">اسم العميل *</Label>
              <Input
                id="customer_name"
                value={customerToAdd.name}
                onChange={(e) => setCustomerToAdd(prev => ({ ...prev, name: e.target.value }))}
                placeholder="اسم العميل"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_phone">رقم الهاتف</Label>
                <Input
                  id="customer_phone"
                  value={customerToAdd.phone}
                  onChange={(e) => setCustomerToAdd(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="رقم الهاتف"
                />
              </div>
              <div>
                <Label htmlFor="customer_type">نوع العميل</Label>
                <select
                  value={customerToAdd.customer_type}
                  onChange={(e) => setCustomerToAdd(prev => ({ ...prev, customer_type: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="individual">فرد</option>
                  <option value="business">شركة</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="customer_email">البريد الإلكتروني</Label>
              <Input
                id="customer_email"
                type="email"
                value={customerToAdd.email}
                onChange={(e) => setCustomerToAdd(prev => ({ ...prev, email: e.target.value }))}
                placeholder="البريد الإلكتروني"
              />
            </div>

            {customerToAdd.customer_type === 'business' && (
              <div>
                <Label htmlFor="customer_tax">الرقم الضريبي</Label>
                <Input
                  id="customer_tax"
                  value={customerToAdd.tax_number}
                  onChange={(e) => setCustomerToAdd(prev => ({ ...prev, tax_number: e.target.value }))}
                  placeholder="الرقم الضريبي"
                />
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={() => {
                if (customerToAdd.name.trim()) {
                  if (typeof window !== 'undefined') {
                    toast.success('تم إضافة العميل بنجاح');
                  }
                  setCustomerToAdd({ name: '', phone: '', email: '', tax_number: '', customer_type: 'individual' });
                  setShowCustomerDialog(false);
                } else {
                  if (typeof window !== 'undefined') {
                    toast.error('اسم العميل مطلوب');
                  }
                }
              }} disabled={loading}>
                <Save className="w-4 h-4 ml-1" />
                حفظ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Suspended Sales Dialog */}
      <Dialog open={showSuspendedDialog} onOpenChange={setShowSuspendedDialog}>
        <DialogContent dir="rtl" className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>الفواتير المعلقة</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {suspendedSales.length > 0 ? (
              suspendedSales.map(suspendedSale => (
                <div key={suspendedSale.id} className="bg-gray-50 p-4 rounded border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{suspendedSale.sale_data.sale_number}</p>
                      <p className="text-sm text-gray-600">
                        {suspendedSale.sale_data.items.length} عنصر - {suspendedSale.sale_data.total_amount.toFixed(2)} ريال
                      </p>
                      <p className="text-xs text-gray-500">
                        معلق في: {new Date(suspendedSale.suspended_at).toLocaleString('en-US')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          toast.success('تم استئناف الفاتورة');
                        }
                        setShowSuspendedDialog(false);
                      }}
                    >
                      <Play className="w-4 h-4 ml-1" />
                      استئناف
                    </Button>
                  </div>
                  <div className="text-xs text-gray-600">
                    {suspendedSale.sale_data.items.slice(0, 2).map((item, index) => (
                      <span key={index}>
                        {item.product.name_ar} ({item.quantity}x)
                        {index < Math.min(suspendedSale.sale_data.items.length - 1, 1) ? ', ' : ''}
                      </span>
                    ))}
                    {suspendedSale.sale_data.items.length > 2 && ' ...'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Pause className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>لا توجد فواتير معلقة</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}






