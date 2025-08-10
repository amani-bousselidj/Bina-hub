// @ts-nocheck
// Enhanced Store POS System
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Plus, 
  Minus, 
  Search, 
  ShoppingCart, 
  CreditCard, 
  Receipt, 
  User,
  Barcode,
  Calculator,
  Clock,
  DollarSign
} from 'lucide-react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from "@/components/ui/Input";
import { toast } from 'react-hot-toast';
import POSUserSearch from './POSUserSearch';

interface Product {
  id: string;
  name: string;
  price: number;
  barcode?: string;
  stock_quantity: number;
  category: string;
  image_url?: string;
}

interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface POSTransaction {
  id?: string;
  customer_id?: string;
  items: CartItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: 'cash' | 'card' | 'digital';
  created_at?: string;
}

export default function EnhancedStorePOS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [loading, setLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const supabase = createClientComponentClient();
  const TAX_RATE = 0.15; // 15% VAT for Saudi Arabia

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.includes(searchTerm)
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Load products from database
  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', user.id)
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('فشل في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  // Add product to cart or increase quantity
  const addToCart = (product: Product) => {
    if (product.stock_quantity <= 0) {
      toast.error('المنتج غير متوفر في المخزون');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        if (existingItem.quantity >= product.stock_quantity) {
          toast.error('لا يمكن إضافة المزيد - الكمية المتوفرة محدودة');
          return prevCart;
        }
        
        return prevCart.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price
              }
            : item
        );
      } else {
        return [...prevCart, {
          ...product,
          quantity: 1,
          subtotal: product.price
        }];
      }
    });
  };

  // Remove product from cart or decrease quantity
  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId
            ? { 
                ...item, 
                quantity: item.quantity - 1,
                subtotal: (item.quantity - 1) * item.price
              }
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== productId);
      }
    });
  };

  // Handle barcode scanning
  const handleBarcodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcodeInput.trim()) {
      const product = products.find(p => p.barcode === barcodeInput.trim());
      if (product) {
        addToCart(product);
        setBarcodeInput('');
        toast.success(`تم إضافة ${product.name} إلى السلة`);
      } else {
        toast.error('لم يتم العثور على المنتج');
      }
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * TAX_RATE;
  const totalAmount = taxableAmount + taxAmount;

  // Process payment and create transaction
  const processPayment = async () => {
    if (cart.length === 0) {
      toast.error('السلة فارغة');
      return;
    }

    try {
      setIsProcessingPayment(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create transaction record
      const transaction: POSTransaction = {
        customer_id: selectedCustomer?.id,
        items: cart,
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        created_at: new Date().toISOString()
      };

      // Save transaction to database
      const { data: transactionData, error: transactionError } = await supabase
        .from('pos_transactions')
        .insert([{
          store_id: user.id,
          customer_id: selectedCustomer?.id,
          subtotal,
          tax_amount: taxAmount,
          discount_amount: discountAmount,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          items: JSON.stringify(cart)
        }])
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Update inventory
      for (const item of cart) {
        const { error: inventoryError } = await supabase
          .from('products')
          .update({ 
            stock_quantity: item.stock_quantity - item.quantity 
          })
          .eq('id', item.id);

        if (inventoryError) {
          console.error(`Error updating inventory for ${item.name}:`, inventoryError);
        }
      }

      // Clear cart and reset form
      setCart([]);
      setSelectedCustomer(null);
      setDiscountPercentage(0);
      setPaymentMethod('cash');
      
      toast.success('تم إتمام البيع بنجاح');
      
      // Optionally print receipt
      printReceipt(transaction, transactionData.id);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('فشل في إتمام عملية البيع');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Print receipt (opens in new window for printing)
  const printReceipt = (transaction: POSTransaction, transactionId: string) => {
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) return;

    const receiptHTML = `
      <html>
        <head>
          <title>فاتورة POS - ${transactionId}</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; }
            .receipt { max-width: 300px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .item { display: flex; justify-content: space-between; padding: 5px 0; }
            .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>فاتورة نقطة البيع</h2>
              <p>رقم المعاملة: ${transactionId}</p>
              <p>التاريخ: ${new Date().toLocaleDateString('en-US')}</p>
              ${selectedCustomer ? `<p>العميل: ${selectedCustomer.name}</p>` : ''}
            </div>
            
            <div class="items">
              ${cart.map(item => `
                <div class="item">
                  <span>${item.name} × ${item.quantity}</span>
                  <span>${item.subtotal.toFixed(2)} ريال</span>
                </div>
              `).join('')}
            </div>
            
            <div class="total">
              <div class="item">
                <span>المجموع الفرعي:</span>
                <span>${subtotal.toFixed(2)} ريال</span>
              </div>
              ${discountAmount > 0 ? `
                <div class="item">
                  <span>الخصم (${discountPercentage}%):</span>
                  <span>-${discountAmount.toFixed(2)} ريال</span>
                </div>
              ` : ''}
              <div class="item">
                <span>ضريبة القيمة المضافة (15%):</span>
                <span>${taxAmount.toFixed(2)} ريال</span>
              </div>
              <div class="item" style="font-size: 18px;">
                <span>المجموع الإجمالي:</span>
                <span>${totalAmount.toFixed(2)} ريال</span>
              </div>
              <div class="item">
                <span>طريقة الدفع:</span>
                <span>${paymentMethod === 'cash' ? 'نقداً' : paymentMethod === 'card' ? 'بطاقة' : 'رقمي'}</span>
              </div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="ابحث عن المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-48">
              <Input
                type="text"
                placeholder="مسح الباركود..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeInput}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {filteredProducts.map(product => (
              <Card 
                key={product.id}
                className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => addToCart(product)}
              >
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                )}
                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                <p className="text-green-600 font-bold">{product.price} ريال</p>
                <p className="text-xs text-gray-500">متوفر: {product.stock_quantity}</p>
              </Card>
            ))}
          </div>
        </Card>

        {/* Customer Search */}
        <POSUserSearch
          onCustomerSelect={setSelectedCustomer}
          selectedCustomer={selectedCustomer}
        />
      </div>

      {/* Cart and Checkout Section */}
      <div className="space-y-4">
        <Card className="p-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            السلة ({cart.length})
          </h2>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.price} ريال</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToCart(item)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-right ml-2">
                  <p className="font-bold">{item.subtotal.toFixed(2)} ريال</p>
                </div>
              </div>
            ))}
          </div>

          {cart.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              السلة فارغة
            </div>
          )}
        </Card>

        {/* Totals and Payment */}
        {cart.length > 0 && (
          <Card className="p-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span>{subtotal.toFixed(2)} ريال</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span>الخصم (%):</span>
                <Input
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                  className="w-20"
                  min="0"
                  max="100"
                />
                <span>-{discountAmount.toFixed(2)} ريال</span>
              </div>
              
              <div className="flex justify-between">
                <span>ضريبة القيمة المضافة (15%):</span>
                <span>{taxAmount.toFixed(2)} ريال</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>المجموع الإجمالي:</span>
                <span>{totalAmount.toFixed(2)} ريال</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">طريقة الدفع:</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('cash')}
                  className="text-xs"
                >
                  نقداً
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="text-xs"
                >
                  بطاقة
                </Button>
                <Button
                  variant={paymentMethod === 'digital' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('digital')}
                  className="text-xs"
                >
                  رقمي
                </Button>
              </div>
            </div>

            <Button
              onClick={processPayment}
              disabled={isProcessingPayment || cart.length === 0}
              className="w-full"
              size="lg"
            >
              {isProcessingPayment ? (
                'جاري المعالجة...'
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  إتمام البيع ({totalAmount.toFixed(2)} ريال)
                </>
              )}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}









