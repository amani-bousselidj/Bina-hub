// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from "@/components/ui/Input";
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Scan, 
  CreditCard, 
  Receipt, 
  Calculator,
  User,
  Package,
  Trash2,
  Plus,
  Minus,
  DollarSign,
  Printer,
  QrCode,
  Gift,
  Percent,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Keyboard,
  UserPlus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CartItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  barcode: string;
  category: string;
  categoryAr: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  vat: number;
  stockQuantity: number;
  imageUrl?: string;
  attributes?: Record<string, string>;
}

interface Customer {
  id: string;
  name: string;
  nameAr: string;
  phone: string;
  email: string;
  address: string;
  addressAr: string;
  vatNumber?: string;
  discount: number;
  loyaltyPoints: number;
  totalSpent: number;
  lastVisit: Date;
  isVip: boolean;
}

interface PaymentMethod {
  type: 'cash' | 'card' | 'mobile' | 'giftcard' | 'loyalty';
  amount: number;
  reference?: string;
  cardType?: string;
  lastFour?: string;
}

interface Sale {
  id: string;
  timestamp: Date;
  items: CartItem[];
  customer?: Customer;
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  payments: PaymentMethod[];
  change: number;
  receipt: string;
  zatcaQr: string;
  employee: string;
  status: 'completed' | 'void' | 'refund';
}

export default function ComprehensivePOSSystem({ 
  language = 'en',
  isRTL = false,
  onTransactionComplete 
}: {
  language?: 'en' | 'ar';
  isRTL?: boolean;
  onTransactionComplete?: (sale: Sale) => void;
}) {
  // State Management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentMethod['type']>('cash');
  const [activeTab, setActiveTab] = useState('items');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  // Refs
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const paymentInputRef = useRef<HTMLInputElement>(null);

  // Sample Data
  const sampleProducts: CartItem[] = [
    {
      id: '1',
      name: 'Premium Coffee Beans 1kg',
      nameAr: 'حبوب قهوة ممتازة 1 كيلو',
      price: 89.99,
      quantity: 1,
      barcode: '1234567890123',
      category: 'Beverages',
      categoryAr: 'مشروبات',
      discount: 0,
      discountType: 'percentage',
      vat: 15,
      stockQuantity: 45,
      imageUrl: '/api/placeholder/100/100'
    },
    {
      id: '2',
      name: 'Organic Green Tea 50 bags',
      nameAr: 'شاي أخضر عضوي 50 كيس',
      price: 34.50,
      quantity: 1,
      barcode: '2345678901234',
      category: 'Beverages',
      categoryAr: 'مشروبات',
      discount: 0,
      discountType: 'percentage',
      vat: 15,
      stockQuantity: 23,
      imageUrl: '/api/placeholder/100/100'
    },
    {
      id: '3',
      name: 'Artisan Chocolate Bar 200g',
      nameAr: 'لوح شوكولاتة حرفي 200 جرام',
      price: 25.75,
      quantity: 1,
      barcode: '3456789012345',
      category: 'Confectionery',
      categoryAr: 'حلويات',
      discount: 10,
      discountType: 'percentage',
      vat: 15,
      stockQuantity: 67,
      imageUrl: '/api/placeholder/100/100'
    }
  ];

  const sampleCustomers: Customer[] = [
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      nameAr: 'أحمد الراشد',
      phone: '+966501234567',
      email: 'ahmed@example.com',
      address: '123 King Fahd Road, Riyadh',
      addressAr: '123 طريق الملك فهد، الرياض',
      vatNumber: 'SA123456789',
      discount: 5,
      loyaltyPoints: 1250,
      totalSpent: 5670.50,
      lastVisit: new Date(),
      isVip: true
    },
    {
      id: '2',
      name: 'Sarah Mohammed',
      nameAr: 'سارة محمد',
      phone: '+966509876543',
      email: 'sarah@example.com',
      address: '456 Prince Sultan St, Jeddah',
      addressAr: '456 شارع الأمير سلطان، جدة',
      discount: 3,
      loyaltyPoints: 890,
      totalSpent: 2340.25,
      lastVisit: new Date(Date.now() - 86400000),
      isVip: false
    }
  ];

  // Text translations
  const t = {
    en: {
      posSystem: 'Point of Sale System',
      scanBarcode: 'Scan Barcode',
      searchCustomer: 'Search Customer',
      cart: 'Cart',
      payment: 'Payment',
      items: 'Items',
      customer: 'Customer',
      checkout: 'Checkout',
      total: 'Total',
      subtotal: 'Subtotal',
      discount: 'Discount',
      vat: 'VAT',
      change: 'Change',
      cash: 'Cash',
      card: 'Card',
      mobile: 'Mobile Pay',
      giftcard: 'Gift Card',
      loyalty: 'Loyalty Points',
      addPayment: 'Add Payment',
      completeTransaction: 'Complete Transaction',
      newTransaction: 'New Transaction',
      printReceipt: 'Print Receipt',
      emailReceipt: 'Email Receipt',
      voidTransaction: 'Void Transaction',
      customerDetails: 'Customer Details',
      loyaltyPoints: 'Loyalty Points',
      vipCustomer: 'VIP Customer',
      noCustomer: 'Walk-in Customer',
      quickAmount: 'Quick Amount',
      enterAmount: 'Enter Amount',
      exactAmount: 'Exact Amount',
      processPayment: 'Process Payment',
      receipt: 'Receipt',
      transactionComplete: 'Transaction Complete',
      qty: 'Qty',
      price: 'Price',
      remove: 'Remove',
      addCustomer: 'Add Customer',
      searchProducts: 'Search Products',
      emptyCart: 'Cart is empty',
      insufficientStock: 'Insufficient stock'
    },
    ar: {
      posSystem: 'نظام نقاط البيع',
      scanBarcode: 'مسح الباركود',
      searchCustomer: 'البحث عن عميل',
      cart: 'السلة',
      payment: 'الدفع',
      items: 'المنتجات',
      customer: 'العميل',
      checkout: 'الدفع',
      total: 'المجموع',
      subtotal: 'المجموع الفرعي',
      discount: 'الخصم',
      vat: 'ضريبة القيمة المضافة',
      change: 'الباقي',
      cash: 'نقداً',
      card: 'بطاقة',
      mobile: 'دفع إلكتروني',
      giftcard: 'بطاقة هدية',
      loyalty: 'نقاط الولاء',
      addPayment: 'إضافة دفعة',
      completeTransaction: 'إتمام المعاملة',
      newTransaction: 'معاملة جديدة',
      printReceipt: 'طباعة الفاتورة',
      emailReceipt: 'إرسال الفاتورة',
      voidTransaction: 'إلغاء المعاملة',
      customerDetails: 'تفاصيل العميل',
      loyaltyPoints: 'نقاط الولاء',
      vipCustomer: 'عميل مميز',
      noCustomer: 'عميل عادي',
      quickAmount: 'مبلغ سريع',
      enterAmount: 'أدخل المبلغ',
      exactAmount: 'المبلغ المطلوب',
      processPayment: 'معالجة الدفع',
      receipt: 'الفاتورة',
      transactionComplete: 'تم إتمام المعاملة',
      qty: 'الكمية',
      price: 'السعر',
      remove: 'إزالة',
      addCustomer: 'إضافة عميل',
      searchProducts: 'البحث عن المنتجات',
      emptyCart: 'السلة فارغة',
      insufficientStock: 'المخزون غير كاف'
    }
  };

  const text = t[language];

  // Effects
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Focus barcode input on component mount
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'f':
            event.preventDefault();
            barcodeInputRef.current?.focus();
            break;
          case 'p':
            event.preventDefault();
            setActiveTab('payment');
            break;
          case 'Enter':
            if (activeTab === 'payment' && getTotalToPay() <= 0) {
              event.preventDefault();
              handleCompleteTransaction();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTab]);

  // Calculations
  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartDiscount = () => {
    return cart.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      if (item.discountType === 'percentage') {
        return sum + (itemTotal * item.discount / 100);
      } else {
        return sum + item.discount;
      }
    }, 0) + (selectedCustomer ? (getCartSubtotal() * selectedCustomer.discount / 100) : 0);
  };

  const getCartVAT = () => {
    const discountedSubtotal = getCartSubtotal() - getCartDiscount();
    return cart.reduce((sum, item) => {
      const itemTotal = (item.price * item.quantity) - (item.discountType === 'percentage' ? (item.price * item.quantity * item.discount / 100) : item.discount);
      return sum + (itemTotal * item.vat / 100);
    }, 0);
  };

  const getCartTotal = () => {
    return getCartSubtotal() - getCartDiscount() + getCartVAT();
  };

  const getTotalPaid = () => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getTotalToPay = () => {
    return Math.max(0, getCartTotal() - getTotalPaid());
  };

  const getChange = () => {
    return Math.max(0, getTotalPaid() - getCartTotal());
  };

  // Handlers
  const handleBarcodeInput = (barcode: string) => {
    const product = sampleProducts.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      // Show error for unknown barcode
      console.log('Product not found for barcode:', barcode);
    }
  };

  const addToCart = (product: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stockQuantity) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          alert(text.insufficientStock);
          return prevCart;
        }
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === id) {
          const product = sampleProducts.find(p => p.id === id);
          if (product && quantity <= product.stockQuantity) {
            return { ...item, quantity };
          } else {
            alert(text.insufficientStock);
            return item;
          }
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch('');
  };

  const addPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (amount > 0) {
      const newPayment: PaymentMethod = {
        type: selectedPaymentType,
        amount: amount,
        reference: `REF${Date.now()}`
      };

      setPayments(prev => [...prev, newPayment]);
      setPaymentAmount('');
      
      if (paymentInputRef.current) {
        paymentInputRef.current.focus();
      }
    }
  };

  const removePayment = (index: number) => {
    setPayments(prev => prev.filter((_, i) => i !== index));
  };

  const handleCompleteTransaction = async () => {
    if (cart.length === 0) {
      alert(text.emptyCart);
      return;
    }

    if (getTotalToPay() > 0) {
      alert('Payment incomplete');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const saleId = `POS${Date.now()}`;
      const zatcaQr = generateZATCAQR(saleId);
        const newSale: Sale = {
        id: saleId,
        timestamp: new Date(),
        items: [...cart],
        customer: selectedCustomer || undefined,
        subtotal: getCartSubtotal(),
        discount: getCartDiscount(),
        vat: getCartVAT(),
        total: getCartTotal(),
        payments: [...payments],
        change: getChange(),
        receipt: generateReceipt(saleId),
        zatcaQr,
        employee: 'Current User',
        status: 'completed'
      };

      setLastSale(newSale);
      setShowReceipt(true);
      
      // Clear transaction
      setCart([]);
      setSelectedCustomer(null);
      setPayments([]);
      setActiveTab('items');

      // Notify parent component
      if (onTransactionComplete) {
        onTransactionComplete(newSale);
      }

    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateZATCAQR = (saleId: string): string => {
    // Generate ZATCA-compliant QR code data
    const qrData = {
      seller: 'OSPOS Store',
      vatNumber: '123456789012345',
      timestamp: new Date().toISOString(),
      total: getCartTotal(),
      vat: getCartVAT(),
      saleId
    };
    return btoa(JSON.stringify(qrData));
  };

  const generateReceipt = (saleId: string): string => {
    return `
=== ${text.receipt} ===
${text.posSystem}
${currentTime.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}

${text.customer}: ${selectedCustomer ? (language === 'ar' ? selectedCustomer.nameAr : selectedCustomer.name) : text.noCustomer}

${cart.map(item => `
${language === 'ar' ? item.nameAr : item.name}
${item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)} SAR
`).join('')}

${text.subtotal}: ${getCartSubtotal().toFixed(2)} SAR
${text.discount}: -${getCartDiscount().toFixed(2)} SAR
${text.vat}: ${getCartVAT().toFixed(2)} SAR
${text.total}: ${getCartTotal().toFixed(2)} SAR

${text.cash}: ${getTotalPaid().toFixed(2)} SAR
${text.change}: ${getChange().toFixed(2)} SAR

${saleId}
================
    `;
  };

  const filteredCustomers = sampleCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.nameAr.includes(customerSearch) ||
    customer.phone.includes(customerSearch)
  );

  const quickAmounts = [5, 10, 20, 50, 100, 200, 500];

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{text.posSystem}</h1>
                <p className="text-sm text-gray-500">
                  {currentTime.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {currentTime.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Product Search & Cart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Barcode Scanner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  {text.scanBarcode}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    ref={barcodeInputRef}
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleBarcodeInput(barcodeInput);
                      }
                    }}
                    placeholder={text.scanBarcode}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleBarcodeInput(barcodeInput)}
                    disabled={!barcodeInput}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick Add Products */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                  {sampleProducts.slice(0, 6).map((product) => (
                    <Button
                      key={product.id}
                      variant="outline"
                      onClick={() => addToCart(product)}
                      className="h-auto p-3 flex flex-col items-center gap-2"
                    >
                      <Package className="h-5 w-5" />
                      <span className="text-xs text-center">
                        {language === 'ar' ? product.nameAr : product.name}
                      </span>
                      <span className="font-semibold">{product.price.toFixed(2)} SAR</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shopping Cart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    {text.cart} ({cart.length})
                  </div>
                  <Badge variant="secondary">
                    {getCartTotal().toFixed(2)} SAR
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{text.emptyCart}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {language === 'ar' ? item.nameAr : item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.price.toFixed(2)} SAR {item.vat > 0 && `(+${item.vat}% VAT)`}
                          </p>
                          {item.discount > 0 && (
                            <p className="text-xs text-green-600">
                              {item.discountType === 'percentage' ? `${item.discount}%` : `${item.discount} SAR`} {text.discount}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} SAR</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Cart Summary */}
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{text.subtotal}:</span>
                        <span>{getCartSubtotal().toFixed(2)} SAR</span>
                      </div>
                      {getCartDiscount() > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>{text.discount}:</span>
                          <span>-{getCartDiscount().toFixed(2)} SAR</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>{text.vat}:</span>
                        <span>{getCartVAT().toFixed(2)} SAR</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>{text.total}:</span>
                        <span>{getCartTotal().toFixed(2)} SAR</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Customer & Payment */}
          <div className="space-y-6">
            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {text.customer}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCustomer ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {language === 'ar' ? selectedCustomer.nameAr : selectedCustomer.name}
                          </h4>
                          <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                        </div>
                        {selectedCustomer.isVip && (
                          <Badge className="bg-gold text-black">VIP</Badge>
                        )}
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">{text.loyaltyPoints}:</span>
                          <span className="font-medium ml-1">{selectedCustomer.loyaltyPoints}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">{text.discount}:</span>
                          <span className="font-medium ml-1">{selectedCustomer.discount}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCustomer(null)}
                      className="w-full"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Remove Customer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Input
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      placeholder={text.searchCustomer}
                    />
                    
                    {customerSearch && (
                      <div className="max-h-40 overflow-y-auto border rounded-lg">
                        {filteredCustomers.map((customer) => (
                          <button
                            key={customer.id}
                            onClick={() => selectCustomer(customer)}
                            className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-sm">
                                  {language === 'ar' ? customer.nameAr : customer.name}
                                </h4>
                                <p className="text-xs text-gray-600">{customer.phone}</p>
                              </div>
                              {customer.isVip && (
                                <Badge variant="secondary" className="text-xs">VIP</Badge>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <Button variant="outline" className="w-full" onClick={() => alert('Button clicked')}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      {text.addCustomer}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {text.payment}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Payment Summary */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{text.total}:</span>
                      <span className="font-semibold">{getCartTotal().toFixed(2)} SAR</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Paid:</span>
                      <span>{getTotalPaid().toFixed(2)} SAR</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>{getTotalToPay() > 0 ? 'To Pay:' : text.change + ':'}</span>
                      <span className={getTotalToPay() > 0 ? 'text-red-600' : 'text-green-600'}>
                        {getTotalToPay() > 0 ? getTotalToPay().toFixed(2) : getChange().toFixed(2)} SAR
                      </span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { type: 'cash', icon: DollarSign, label: text.cash },
                        { type: 'card', icon: CreditCard, label: text.card },
                        { type: 'mobile', icon: Keyboard, label: text.mobile },
                        { type: 'giftcard', icon: Gift, label: text.giftcard }
                      ].map(({ type, icon: Icon, label }) => (
                        <Button
                          key={type}
                          variant={selectedPaymentType === type ? 'default' : 'outline'}
                          onClick={() => setSelectedPaymentType(type as PaymentMethod['type'])}
                          className="h-auto p-2 flex flex-col items-center gap-1"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-xs">{label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div>
                    <label className="block text-sm font-medium mb-2">{text.quickAmount}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          onClick={() => setPaymentAmount(amount.toString())}
                          className="text-sm"
                        >
                          {amount} SAR
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Amount Input */}
                  <div className="flex gap-2">
                    <Input
                      ref={paymentInputRef}
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder={text.enterAmount}
                      className="flex-1"
                      step="0.01"
                    />
                    <Button
                      onClick={() => setPaymentAmount(getTotalToPay().toFixed(2))}
                      variant="outline"
                      className="px-2"
                    >
                      <Calculator className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={addPayment}
                    disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                    className="w-full"
                  >
                    {text.addPayment}
                  </Button>

                  {/* Payment List */}
                  {payments.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Payments:</label>
                      {payments.map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">
                            {payment.type} - {payment.amount.toFixed(2)} SAR
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePayment(index)}
                            className="text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Complete Transaction */}
                  <Button
                    onClick={handleCompleteTransaction}
                    disabled={cart.length === 0 || getTotalToPay() > 0 || isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {text.completeTransaction}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{text.transactionComplete}</h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowReceipt(false)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {lastSale.receipt}
                </pre>
              </div>

              <div className="flex items-center justify-center mb-4">
                <div className="bg-white p-2 border rounded">
                  <QrCode className="h-16 w-16" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    // Print receipt logic
                    window.print();
                  }}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  {text.printReceipt}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Email receipt logic
                    console.log('Email receipt');
                  }}
                  className="flex items-center gap-2"
                >
                  <Receipt className="h-4 w-4" />
                  {text.emailReceipt}
                </Button>
              </div>

              <Button
                onClick={() => {
                  setShowReceipt(false);
                  // Reset for new transaction
                  if (barcodeInputRef.current) {
                    barcodeInputRef.current.focus();
                  }
                }}
                className="w-full mt-2"
                variant="outline"
              >
                {text.newTransaction}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}









