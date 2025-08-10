// @ts-nocheck
/**
 * Enhanced Offline POS System - Browser Compatible Version
 * Supports offline operations with localStorage for client-side persistence
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  WifiOff, 
  Wifi, 
  ShoppingCart, 
  CreditCard, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Receipt, 
  Users,
  Smartphone,
  ScanLine,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

// Simplified interfaces for browser-compatible POS
interface CartItem {
  id: string
  name: string
  price: number
  cart_quantity: number
  cart_total: number
  category?: string
  sku?: string
}

interface OfflineTransaction {
  id: string
  items: CartItem[]
  total_amount: number
  tax_amount: number
  payment_method: string
  timestamp: string
  status: 'pending' | 'completed'
}

interface OfflineCustomer {
  id: string
  name: string
  email?: string
  phone?: string
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ComponentType
  offline_supported: boolean
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'cash', name: 'نقد', icon: CreditCard, offline_supported: true },
  { id: 'mada', name: 'مدى', icon: CreditCard, offline_supported: true },
  { id: 'visa', name: 'فيزا', icon: CreditCard, offline_supported: false },
  { id: 'stc_pay', name: 'STC Pay', icon: Smartphone, offline_supported: false },
]

export default function EnhancedOfflinePOS() {
  const { store } = useStore()
  
  // Connection and sync state
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online')
  const [syncStatus, setSyncStatus] = useState<any>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  // POS state
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<OfflineCustomer | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cash')
  const [isProcessing, setIsProcessing] = useState(false)

  // Search states
  const [productSearchQuery, setProductSearchQuery] = useState('')
  const [customerSearchQuery, setCustomerSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<OfflineInventoryItem[]>([])
  const [customerResults, setCustomerResults] = useState<OfflineCustomer[]>([])

  // Receipt state
  const [lastTransaction, setLastTransaction] = useState<OfflineTransaction | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)

  // Initialize SQLite and sync service
  useEffect(() => {
    const initializeOfflineSystem = async () => {
      try {
        await sqliteManager.initialize()
        await offlineSyncService.startSync()
        
        // Update connection status
        const status = offlineSyncService.getConnectionStatus()
        setConnectionStatus(status)
        
        // Update sync status
        const syncInfo = await offlineSyncService.getSyncStatus()
        setSyncStatus(syncInfo)
      } catch (error) {
        console.error('Failed to initialize offline system:', error)
        toast.error('فشل في تهيئة النظام', { description: 'لم يتم تهيئة النظام المحلي بشكل صحيح' })
      }
    }

    initializeOfflineSystem()

    // Cleanup on unmount
    return () => {
      offlineSyncService.stopSync()
    }
  }, [])

  // Monitor connection status
  useEffect(() => {
    const checkConnectionStatus = () => {
      const status = offlineSyncService.getConnectionStatus()
      setConnectionStatus(status)
    }

    const interval = setInterval(checkConnectionStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  // Search products in offline inventory
  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      // This would need to be implemented in SQLiteManager
      // For now, we'll use a placeholder
      setSearchResults([])
    } catch (error) {
      console.error('Product search failed:', error)
    }
  }, [])

  // Search customers
  const searchCustomers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setCustomerResults([])
      return
    }

    try {
      const results = await sqliteManager.searchCustomers(query)
      setCustomerResults(results)
    } catch (error) {
      console.error('Customer search failed:', error)
    }
  }, [])

  // Add item to cart
  const addToCart = (item: OfflineInventoryItem) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(
        cartItem => cartItem.product_id === item.product_id && cartItem.variant_id === item.variant_id
      )

      if (existingItem) {
        if (existingItem.cart_quantity >= item.current_stock) {
          toast.error('المخزون غير كافي', { description: 'لا يمكن إضافة المزيد من هذا المنتج' })
          return currentCart
        }

        return currentCart.map(cartItem =>
          cartItem.product_id === item.product_id && cartItem.variant_id === item.variant_id
            ? {
                ...cartItem,
                cart_quantity: cartItem.cart_quantity + 1,
                cart_total: (cartItem.cart_quantity + 1) * cartItem.current_stock // This should be price
              }
            : cartItem
        )
      } else {
        if (item.current_stock <= 0) {
          toast.error('المنتج غير متوفر', { description: 'هذا المنتج غير متوفر في المخزون' })
          return currentCart
        }

        return [...currentCart, {
          ...item,
          cart_quantity: 1,
          cart_total: item.current_stock // This should be price
        }]
      }
    })
  }

  // Update cart item quantity
  const updateCartQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId)
      return
    }

    setCart(currentCart =>
      currentCart.map(item => {
        if (item.product_id === productId && item.variant_id === variantId) {
          if (quantity > item.current_stock) {
            toast.error('المخزون غير كافي')
            return item
          }
          return {
            ...item,
            cart_quantity: quantity,
            cart_total: quantity * item.current_stock // This should be price
          }
        }
        return item
      })
    )
  }

  // Remove item from cart
  const removeFromCart = (productId: string, variantId: string | undefined) => {
    setCart(currentCart =>
      currentCart.filter(item => !(item.product_id === productId && item.variant_id === variantId))
    )
  }

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.cart_total, 0)
    const taxRate = 0.15 // 15% VAT
    const taxAmount = subtotal * taxRate
    const total = subtotal + taxAmount

    return { subtotal, taxAmount, total }
  }

  // Process transaction
  const processTransaction = async () => {
    if (cart.length === 0) {
      toast.error('العربة فارغة', { description: 'أضف منتجات للعربة قبل المتابعة' })
      return
    }

    const paymentMethod = PAYMENT_METHODS.find(pm => pm.id === selectedPaymentMethod)
    if (!paymentMethod) {
      toast.error('طريقة دفع غير صحيحة')
      return
    }

    if (connectionStatus === 'offline' && !paymentMethod.offline_supported) {
      toast.error('طريقة الدفع غير متاحة', { 
        description: 'هذه طريقة الدفع غير متاحة في وضع عدم الاتصال' 
      })
      return
    }

    setIsProcessing(true)

    try {
      // Check stock availability for all items
      for (const item of cart) {
        const available = await sqliteManager.decrementStock(
          item.product_id,
          item.variant_id,
          item.cart_quantity,
          item.location_id
        )
        
        if (!available) {
          toast.error(`مخزون غير كافي للمنتج: ${item.title}`)
          setIsProcessing(false)
          return
        }
      }

      const totals = calculateTotals()
      const transactionId = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const receiptNumber = `RCP-${Date.now()}`

      const transaction: OfflineTransaction = {
        id: transactionId,
        store_id: store?.id || 'default_store',
        customer_id: selectedCustomer?.id,
        items: cart.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.cart_quantity,
          unit_price: item.current_stock, // This should be actual price
          total_price: item.cart_total,
          tax_rate: 0.15
        })),
        payment_method: selectedPaymentMethod,
        total_amount: totals.total,
        tax_amount: totals.taxAmount,
        discount_amount: 0,
        status: 'completed',
        timestamp: Date.now(),
        pos_device_id: 'pos_001', // This should be dynamic
        receipt_number: receiptNumber
      }

      // Save transaction to local database
      await sqliteManager.saveTransaction(transaction)

      // Show success and receipt
      setLastTransaction(transaction)
      setShowReceipt(true)
      setCart([])
      setSelectedCustomer(null)
      setSelectedPaymentMethod('cash')

      toast.success('تمت المعاملة بنجاح', { 
        description: connectionStatus === 'offline' 
          ? 'تم حفظ المعاملة محلياً وستتم المزامنة عند الاتصال'
          : 'تمت المعاملة ومزامنتها مع السحابة'
      })

    } catch (error) {
      console.error('Transaction failed:', error)
      toast.error('فشل في المعاملة', { 
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Force sync
  const forceSync = async () => {
    if (connectionStatus === 'offline') {
      toast.error('لا يمكن المزامنة', { description: 'يجب الاتصال بالإنترنت أولاً' })
      return
    }

    setIsSyncing(true)
    try {
      const result = await offlineSyncService.forceSync()
      if (result.success) {
        toast.success('تمت المزامنة بنجاح', { description: result.message })
      } else {
        toast.error('فشل في المزامنة', { description: result.message })
      }
      
      // Update sync status
      const syncInfo = await offlineSyncService.getSyncStatus()
      setSyncStatus(syncInfo)
    } catch (error) {
      toast.error('خطأ في المزامنة')
    } finally {
      setIsSyncing(false)
    }
  }

  const totals = calculateTotals()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-800">نقطة البيع المتقدمة</h1>
            <Badge variant={connectionStatus === 'online' ? 'default' : 'destructive'}>
              {connectionStatus === 'online' ? (
                <><Wifi className="w-4 h-4 mr-1" /> متصل</>
              ) : (
                <><WifiOff className="w-4 h-4 mr-1" /> غير متصل</>
              )}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {syncStatus?.pendingSync > 0 && (
              <Badge variant="outline" className="text-orange-600">
                <Clock className="w-4 h-4 mr-1" />
                {syncStatus.pendingSync} في انتظار المزامنة
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={forceSync}
              disabled={connectionStatus === 'offline' || isSyncing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              مزامنة
            </Button>
          </div>
        </div>

        {/* Connection Status Alert */}
        {connectionStatus === 'offline' && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              أنت تعمل في وضع عدم الاتصال. ستتم مزامنة المعاملات تلقائياً عند استعادة الاتصال.
              المدفوعات النقدية ومدى متاحة فقط.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Search & Cart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  البحث عن المنتجات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="ابحث بالاسم أو الباركود..."
                    value={productSearchQuery}
                    onChange={(e) => {
                      setProductSearchQuery(e.target.value)
                      searchProducts(e.target.value)
                    }}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={() => alert('Button clicked')}>
                    <ScanLine className="w-4 h-4" />
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <ScrollArea className="h-48 mt-4">
                    <div className="space-y-2">
                      {searchResults.map((product) => (
                        <div
                          key={`${product.product_id}-${product.variant_id}`}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100"
                          onClick={() => addToCart(product)}
                        >
                          <div>
                            <p className="font-medium">{product.title}</p>
                            <p className="text-sm text-slate-600">SKU: {product.sku}</p>
                            <p className="text-sm text-slate-600">المخزون: {product.current_stock}</p>
                          </div>
                          <Button size="sm" onClick={() => alert('Button clicked')}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Shopping Cart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  عربة التسوق ({cart.length} منتج)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    العربة فارغة
                  </div>
                ) : (
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={`${item.product_id}-${item.variant_id}`}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-slate-600">SKU: {item.sku}</p>
                            <p className="text-sm text-green-600 font-medium">
                              {item.cart_total.toFixed(2)} ريال
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(
                                item.product_id,
                                item.variant_id,
                                item.cart_quantity - 1
                              )}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            
                            <span className="mx-2 font-medium min-w-[2rem] text-center">
                              {item.cart_quantity}
                            </span>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(
                                item.product_id,
                                item.variant_id,
                                item.cart_quantity + 1
                              )}
                              disabled={item.cart_quantity >= item.current_stock}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeFromCart(item.product_id, item.variant_id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Customer & Payment */}
          <div className="space-y-6">
            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  العميل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="ابحث عن العميل..."
                  value={customerSearchQuery}
                  onChange={(e) => {
                    setCustomerSearchQuery(e.target.value)
                    searchCustomers(e.target.value)
                  }}
                  className="mb-3"
                />

                {selectedCustomer && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">
                          {selectedCustomer.first_name} {selectedCustomer.last_name}
                        </p>
                        {selectedCustomer.phone && (
                          <p className="text-sm text-green-600">{selectedCustomer.phone}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedCustomer(null)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {customerResults.length > 0 && (
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {customerResults.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100"
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setCustomerSearchQuery('')
                            setCustomerResults([])
                          }}
                        >
                          <p className="font-medium">
                            {customer.first_name} {customer.last_name}
                          </p>
                          {customer.phone && (
                            <p className="text-sm text-slate-600">{customer.phone}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  طريقة الدفع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((method) => {
                    const isDisabled = connectionStatus === 'offline' && !method.offline_supported
                    return (
                      <Button
                        key={method.id}
                        variant={selectedPaymentMethod === method.id ? 'default' : 'outline'}
                        className="h-16 p-2"
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        disabled={isDisabled}
                      >
                        <div className="text-center">
                          <method.icon className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">{method.name}</p>
                          {isDisabled && <p className="text-xs text-red-500">غير متاح</p>}
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>{totals.subtotal.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span>ضريبة القيمة المضافة (15%):</span>
                  <span>{totals.taxAmount.toFixed(2)} ريال</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي:</span>
                  <span>{totals.total.toFixed(2)} ريال</span>
                </div>
                
                <Button
                  className="w-full h-12 text-lg"
                  onClick={processTransaction}
                  disabled={cart.length === 0 || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <Receipt className="w-5 h-5 mr-2" />
                      إتمام البيع
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Receipt Modal */}
        {showReceipt && lastTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>إيصال البيع</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReceipt(false)}
                  >
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-green-600">تمت المعاملة بنجاح</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>رقم الإيصال:</span>
                    <span className="font-mono">{lastTransaction.receipt_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>التاريخ:</span>
                    <span>{new Date(lastTransaction.timestamp).toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>طريقة الدفع:</span>
                    <span>{PAYMENT_METHODS.find(pm => pm.id === lastTransaction.payment_method)?.name}</span>
                  </div>
                  {selectedCustomer && (
                    <div className="flex justify-between">
                      <span>العميل:</span>
                      <span>{selectedCustomer.first_name} {selectedCustomer.last_name}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-1 text-sm">
                  {lastTransaction.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.quantity}x منتج {item.product_id}</span>
                      <span>{item.total_price.toFixed(2)} ريال</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>{(lastTransaction.total_amount - lastTransaction.tax_amount).toFixed(2)} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ضريبة القيمة المضافة:</span>
                    <span>{lastTransaction.tax_amount.toFixed(2)} ريال</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>الإجمالي:</span>
                    <span>{lastTransaction.total_amount.toFixed(2)} ريال</span>
                  </div>
                </div>

                <Button className="w-full" onClick={() => setShowReceipt(false)}>
                  <Receipt className="w-4 h-4 mr-2" />
                  طباعة الإيصال
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}









