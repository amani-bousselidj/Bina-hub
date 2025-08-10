// @ts-nocheck
// Enhanced Project Order Component with ERPNext-inspired features
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/core/shared/utils';
import ERPIntegrationServiceCore from '@/core/shared/services/erp-integration/service';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Filter,
  Store,
  Package,
  Star,
  MapPin,
  Phone,
  Clock,
  Check,
  X,
  AlertCircle,
  Calculator,
  FileText,
  Settings,
  Truck,
  CreditCard,
  Calendar,
  User,
  Building2,
  BarChart3,
  Tags,
  Shield,
  Warehouse
} from 'lucide-react';

interface ERPProjectOrderProps {
  projectId: string;
  projectName: string;
  onOrderCreated?: (orderId: string) => void;
  onCancel?: () => void;
}

interface ERPOrderItem {
  item_code: string;
  item_name: string;
  description: string;
  item_group: string;
  uom: string;
  stock_uom: string;
  conversion_factor: number;
  qty: number;
  rate: number;
  amount: number;
  warehouse: string;
  delivery_date: string;
  margin_type: 'Percentage' | 'Amount';
  margin_rate_or_amount: number;
  discount_percentage: number;
  pricing_rules: string[];
  has_serial_no: boolean;
  has_batch_no: boolean;
  projected_qty: number;
  actual_qty: number;
  reserved_qty: number;
}

interface ERPTaxCharge {
  charge_type: 'On Net Total' | 'On Previous Row Amount' | 'On Previous Row Total' | 'Actual';
  account_head: string;
  description: string;
  rate: number;
  tax_amount: number;
  total: number;
}

interface ERPPaymentSchedule {
  due_date: string;
  invoice_portion: number;
  payment_amount: number;
  outstanding: number;
}

interface ERPOrderConfiguration {
  customer: string;
  customer_name: string;
  currency: string;
  conversion_rate: number;
  selling_price_list: string;
  price_list_currency: string;
  delivery_date: string;
  order_type: 'Sales' | 'Maintenance' | 'Shopping Cart';
  apply_discount_on: 'Grand Total' | 'Net Total';
  ignore_pricing_rule: boolean;
  taxes_and_charges: string;
  payment_terms_template: string;
  tc_name: string;
  terms: string;
  source: string;
  campaign: string;
  territory: string;
  customer_group: string;
}

export default function ERPProjectOrderComponent({
  projectId,
  projectName,
  onOrderCreated,
  onCancel
}: ERPProjectOrderProps) {
  const [items, setItems] = useState<ERPOrderItem[]>([]);
  const [taxes, setTaxes] = useState<ERPTaxCharge[]>([]);
  const [paymentSchedule, setPaymentSchedule] = useState<ERPPaymentSchedule[]>([]);
  const [orderConfig, setOrderConfig] = useState<ERPOrderConfiguration>({
    customer: '',
    customer_name: '',
    currency: 'SAR',
    conversion_rate: 1,
    selling_price_list: 'Standard Selling',
    price_list_currency: 'SAR',
    delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    order_type: 'Sales',
    apply_discount_on: 'Grand Total',
    ignore_pricing_rule: false,
    taxes_and_charges: 'Saudi Arabia VAT 15%',
    payment_terms_template: '',
    tc_name: '',
    terms: '',
    source: 'Project Order',
    campaign: '',
    territory: 'All Territories',
    customer_group: 'All Customer Groups'
  });

  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [priceLists, setPriceLists] = useState<any[]>([]);
  const [taxTemplates, setTaxTemplates] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'items' | 'taxes' | 'payment' | 'terms' | 'advanced'>('items');
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [itemSearch, setItemSearch] = useState('');
  const [stockValidation, setStockValidation] = useState<Record<string, boolean>>({});

  const supabase = createClientComponentClient();
  const erpService = new ERPIntegrationServiceCore(supabase);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load available items
      const itemsData = await erpService.getItemDetails('');
      
      // Load customers
      const { data: customersData, error: customersError } = await supabase
        .from('erp_customers')
        .select('id, customer_name, customer_group, territory, default_currency, default_price_list')
        .eq('disabled', false);

      if (customersError) throw customersError;

      // Load price lists
      const { data: priceListsData, error: priceListsError } = await supabase
        .from('price_lists')
        .select('name, currency, enabled')
        .eq('enabled', true);

      if (priceListsError) throw priceListsError;

      // Load tax templates
      const { data: taxTemplatesData, error: taxError } = await supabase
        .from('sales_taxes_and_charges_templates')
        .select('name, title, is_default')
        .eq('disabled', false);

      if (taxError) throw taxError;

      // Load warehouses
      const { data: warehousesData, error: warehousesError } = await supabase
        .from('warehouses')
        .select('name, warehouse_name, company, is_group, disabled')
        .eq('is_group', false)
        .eq('disabled', false);

      if (warehousesError) throw warehousesError;

      setCustomers(customersData || []);
      setPriceLists(priceListsData || []);
      setTaxTemplates(taxTemplatesData || []);
      setWarehouses(warehousesData || []);
      
      if (warehousesData?.length) {
        setSelectedWarehouse(warehousesData[0].name);
      }

    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('خطأ في تحميل البيانات الأولية');
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderTotals = () => {
    const netTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const totalTaxes = taxes.reduce((sum, tax) => sum + tax.tax_amount, 0);
    const grandTotal = netTotal + totalTaxes;
    const discount = orderConfig.apply_discount_on === 'Net Total' ? 0 : 0; // TODO: Calculate actual discount

    return {
      netTotal,
      totalTaxes,
      grandTotal,
      discount,
      roundingAdjustment: Math.round(grandTotal) - grandTotal
    };
  };

  const validateStock = async (itemCode: string, warehouse: string, qty: number) => {
    try {
      const available = await erpService.checkStockAvailability(itemCode, warehouse, qty);
      setStockValidation(prev => ({
        ...prev,
        [`${itemCode}-${warehouse}`]: available
      }));
      return available;
    } catch (error) {
      console.error('Stock validation error:', error);
      return false;
    }
  };

  const addItem = async (selectedItem: any) => {
    try {
      // Get item details
      const itemDetails = await erpService.getItemDetails(selectedItem.item_code);
      if (!itemDetails) {
        setError('لم يتم العثور على تفاصيل الصنف');
        return;
      }      // Get item price
      const rate = await erpService.getItemPrice(
        selectedItem.item_code,
        orderConfig.selling_price_list,
        orderConfig.currency
      );

      // Validate stock
      const stockAvailable = await validateStock(
        selectedItem.item_code,
        selectedWarehouse,
        1
      );

      const newItem: ERPOrderItem = {
        item_code: selectedItem.item_code,
        item_name: selectedItem.item_name,
        description: selectedItem.description || '',
        item_group: selectedItem.item_group,
        uom: selectedItem.stock_uom,
        stock_uom: selectedItem.stock_uom,
        conversion_factor: 1,
        qty: 1,
        rate: rate,
        amount: rate,
        warehouse: selectedWarehouse,
        delivery_date: orderConfig.delivery_date,
        margin_type: 'Percentage',
        margin_rate_or_amount: 0,
        discount_percentage: 0,
        pricing_rules: [],
        has_serial_no: itemDetails.has_serial_no,
        has_batch_no: itemDetails.has_batch_no,
        projected_qty: await erpService.getStockBalance(selectedItem.item_code, selectedWarehouse),
        actual_qty: 0,
        reserved_qty: 0
      };

      setItems(prev => [...prev, newItem]);
      await calculateTaxes();
      setShowItemSelector(false);

    } catch (error) {
      console.error('Error adding item:', error);
      setError('خطأ في إضافة الصنف');
    }
  };

  const updateItemQuantity = async (index: number, qty: number) => {
    const updatedItems = [...items];
    updatedItems[index].qty = qty;
    updatedItems[index].amount = qty * updatedItems[index].rate;
    
    // Validate stock
    await validateStock(
      updatedItems[index].item_code,
      updatedItems[index].warehouse,
      qty
    );

    setItems(updatedItems);
    await calculateTaxes();
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    calculateTaxes();
  };

  const calculateTaxes = async () => {
    try {
      if (!orderConfig.taxes_and_charges || items.length === 0) {
        setTaxes([]);
        return;
      }

      const calculatedTaxes = await erpService.calculateTaxes(items, orderConfig.taxes_and_charges);
      setTaxes(calculatedTaxes);

    } catch (error) {
      console.error('Error calculating taxes:', error);
    }
  };

  const generatePaymentSchedule = () => {
    if (!orderConfig.payment_terms_template) {
      const totals = calculateOrderTotals();
      setPaymentSchedule([{
        due_date: orderConfig.delivery_date,
        invoice_portion: 100,
        payment_amount: totals.grandTotal,
        outstanding: totals.grandTotal
      }]);
      return;
    }

    // TODO: Implement payment terms template logic
    setPaymentSchedule([]);
  };

  const submitOrder = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (items.length === 0) {
        throw new Error('يجب إضافة أصناف للطلب');
      }

      if (!orderConfig.customer) {
        throw new Error('يجب اختيار عميل');
      }      // Validate credit limit
      const totals = calculateOrderTotals();
      const creditLimitResult = await erpService.checkCreditLimit(
        orderConfig.customer,
        totals.grandTotal
      );

      if (!creditLimitResult.allowed) {
        throw new Error('تم تجاوز حد الائتمان للعميل');
      }

      // Create sales order
      const salesOrderData = {
        customer: orderConfig.customer,
        customer_name: orderConfig.customer_name,
        project: projectId,
        order_type: orderConfig.order_type,
        transaction_date: new Date().toISOString(),
        delivery_date: orderConfig.delivery_date,
        currency: orderConfig.currency,
        conversion_rate: orderConfig.conversion_rate,
        selling_price_list: orderConfig.selling_price_list,
        price_list_currency: orderConfig.price_list_currency,
        ignore_pricing_rule: orderConfig.ignore_pricing_rule,
        apply_discount_on: orderConfig.apply_discount_on,
        base_net_total: totals.netTotal,
        net_total: totals.netTotal,
        base_total_taxes_and_charges: totals.totalTaxes,
        total_taxes_and_charges: totals.totalTaxes,
        base_grand_total: totals.grandTotal,
        grand_total: totals.grandTotal,
        base_rounding_adjustment: totals.roundingAdjustment,
        rounding_adjustment: totals.roundingAdjustment,
        items: items,
        taxes: taxes,
        payment_schedule: paymentSchedule,
        source: orderConfig.source,
        territory: orderConfig.territory,
        customer_group: orderConfig.customer_group
      };

      const salesOrder = await erpService.createSalesOrder(salesOrderData);

      // Process workflow to submit the order
      await erpService.processOrderWorkflow(salesOrder.id, 'Submit');

      if (onOrderCreated) {
        onOrderCreated(salesOrder.id);
      }

    } catch (error) {
      console.error('Error submitting order:', error);
      setError(error instanceof Error ? error.message : 'خطأ في إنشاء الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  const totals = calculateOrderTotals();

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إنشاء طلب مبيعات متقدم</h2>
          <p className="text-gray-600">مشروع: {projectName}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowItemSelector(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة صنف
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5 ml-2" />
              إلغاء
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 ml-2" />
          {error}
        </div>
      )}

      {/* Customer Selection */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">العميل *</label>
            <select
              value={orderConfig.customer}
              onChange={(e) => {
                const customer = customers.find(c => c.id === e.target.value);
                setOrderConfig(prev => ({
                  ...prev,
                  customer: e.target.value,
                  customer_name: customer?.customer_name || '',
                  currency: customer?.default_currency || prev.currency,
                  selling_price_list: customer?.default_price_list || prev.selling_price_list
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">اختر عميل</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.customer_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">قائمة الأسعار</label>
            <select
              value={orderConfig.selling_price_list}
              onChange={(e) => setOrderConfig(prev => ({ ...prev, selling_price_list: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priceLists.map(priceList => (
                <option key={priceList.name} value={priceList.name}>
                  {priceList.name} ({priceList.currency})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">تاريخ التسليم</label>
            <input
              type="date"
              value={orderConfig.delivery_date}
              onChange={(e) => setOrderConfig(prev => ({ ...prev, delivery_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card>
        <div className="border-b">
          <nav className="flex space-x-8 px-4">
            {[
              { id: 'items', label: 'الأصناف', icon: Package },
              { id: 'taxes', label: 'الضرائب', icon: Calculator },
              { id: 'payment', label: 'شروط الدفع', icon: CreditCard },
              { id: 'terms', label: 'الشروط والأحكام', icon: FileText },
              { id: 'advanced', label: 'خيارات متقدمة', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm ${
                  currentTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 ml-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4">
          {/* Items Tab */}
          {currentTab === 'items' && (
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>لا توجد أصناف في الطلب</p>
                  <p className="text-sm mt-2">اضغط "إضافة صنف" لبدء إضافة الأصناف</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div className="md:col-span-2">
                          <h4 className="font-medium">{item.item_name}</h4>
                          <p className="text-sm text-gray-600">{item.item_code}</p>
                          {!stockValidation[`${item.item_code}-${item.warehouse}`] && (
                            <p className="text-xs text-red-600 flex items-center mt-1">
                              <AlertCircle className="w-3 h-3 ml-1" />
                              مخزون غير كافي
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500">الكمية</label>
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => updateItemQuantity(index, parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border rounded text-sm"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500">السعر</label>
                          <div className="text-sm font-medium">{formatCurrency(item.rate)}</div>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500">المجموع</label>
                          <div className="text-sm font-bold">{formatCurrency(item.amount)}</div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Taxes Tab */}
          {currentTab === 'taxes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">قالب الضرائب والرسوم</label>
                <select
                  value={orderConfig.taxes_and_charges}
                  onChange={(e) => {
                    setOrderConfig(prev => ({ ...prev, taxes_and_charges: e.target.value }));
                    calculateTaxes();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">بدون ضرائب</option>
                  {taxTemplates.map(template => (
                    <option key={template.name} value={template.name}>
                      {template.title}
                    </option>
                  ))}
                </select>
              </div>

              {taxes.length > 0 && (
                <div className="border rounded-lg">
                  <div className="bg-gray-50 px-4 py-2 font-medium">تفاصيل الضرائب</div>
                  {taxes.map((tax, index) => (
                    <div key={index} className="px-4 py-2 border-t flex justify-between">
                      <span>{tax.description}</span>
                      <span className="font-medium">{formatCurrency(tax.tax_amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payment Tab */}
          {currentTab === 'payment' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">قالب شروط الدفع</label>
                <select
                  value={orderConfig.payment_terms_template}
                  onChange={(e) => {
                    setOrderConfig(prev => ({ ...prev, payment_terms_template: e.target.value }));
                    generatePaymentSchedule();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">دفع فوري</option>
                  <option value="30_days">30 يوم</option>
                  <option value="60_days">60 يوم</option>
                  <option value="installments">أقساط</option>
                </select>
              </div>

              {paymentSchedule.length > 0 && (
                <div className="border rounded-lg">
                  <div className="bg-gray-50 px-4 py-2 font-medium">جدول الدفع</div>
                  {paymentSchedule.map((payment, index) => (
                    <div key={index} className="px-4 py-2 border-t grid grid-cols-3 gap-4">
                      <span>تاريخ الاستحقاق: {payment.due_date}</span>
                      <span>النسبة: {payment.invoice_portion}%</span>
                      <span className="font-medium">{formatCurrency(payment.payment_amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Terms Tab */}
          {currentTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">قالب الشروط والأحكام</label>
                <select
                  value={orderConfig.tc_name}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, tc_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر قالب</option>
                  <option value="standard">الشروط القياسية</option>
                  <option value="construction">شروط البناء</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">الشروط والأحكام</label>
                <textarea
                  value={orderConfig.terms}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, terms: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  placeholder="اكتب الشروط والأحكام..."
                />
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {currentTab === 'advanced' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">مصدر الطلب</label>
                  <select
                    value={orderConfig.source}
                    onChange={(e) => setOrderConfig(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Project Order">طلب مشروع</option>
                    <option value="Website">الموقع الإلكتروني</option>
                    <option value="Phone">الهاتف</option>
                    <option value="Email">البريد الإلكتروني</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">المنطقة</label>
                  <select
                    value={orderConfig.territory}
                    onChange={(e) => setOrderConfig(prev => ({ ...prev, territory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All Territories">جميع المناطق</option>
                    <option value="Riyadh">الرياض</option>
                    <option value="Jeddah">جدة</option>
                    <option value="Dammam">الدمام</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">مجموعة العملاء</label>
                  <select
                    value={orderConfig.customer_group}
                    onChange={(e) => setOrderConfig(prev => ({ ...prev, customer_group: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All Customer Groups">جميع مجموعات العملاء</option>
                    <option value="Individual">أفراد</option>
                    <option value="Corporate">شركات</option>
                    <option value="Government">حكومي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">المستودع الافتراضي</label>
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {warehouses.map(warehouse => (
                      <option key={warehouse.name} value={warehouse.name}>
                        {warehouse.warehouse_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={orderConfig.ignore_pricing_rule}
                    onChange={(e) => setOrderConfig(prev => ({ ...prev, ignore_pricing_rule: e.target.checked }))}
                    className="ml-2 text-blue-600"
                  />
                  تجاهل قواعد التسعير
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="apply_discount"
                    checked={orderConfig.apply_discount_on === 'Net Total'}
                    onChange={() => setOrderConfig(prev => ({ ...prev, apply_discount_on: 'Net Total' }))}
                    className="ml-2 text-blue-600"
                  />
                  تطبيق الخصم على الصافي
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="apply_discount"
                    checked={orderConfig.apply_discount_on === 'Grand Total'}
                    onChange={() => setOrderConfig(prev => ({ ...prev, apply_discount_on: 'Grand Total' }))}
                    className="ml-2 text-blue-600"
                  />
                  تطبيق الخصم على الإجمالي
                </label>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Order Totals */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">ملخص الطلب</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>الصافي:</span>
            <span>{formatCurrency(totals.netTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>إجمالي الضرائب:</span>
            <span>{formatCurrency(totals.totalTaxes)}</span>
          </div>
          {totals.roundingAdjustment !== 0 && (
            <div className="flex justify-between">
              <span>تسوية التقريب:</span>
              <span>{formatCurrency(totals.roundingAdjustment)}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>الإجمالي:</span>
            <span>{formatCurrency(totals.grandTotal + totals.roundingAdjustment)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={submitOrder}
            disabled={submitting || items.length === 0 || !orderConfig.customer}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Check className="w-5 h-5 ml-2" />
                إنشاء طلب المبيعات
              </>
            )}
          </button>
        </div>
      </Card>

      {/* Item Selector Modal */}
      {showItemSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">اختيار الأصناف</h3>
              <button
                onClick={() => setShowItemSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <input
                  type="text"
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  placeholder="البحث عن الأصناف..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {availableItems
                  .filter(item => 
                    item.item_name.toLowerCase().includes(itemSearch.toLowerCase()) ||
                    item.item_code.toLowerCase().includes(itemSearch.toLowerCase())
                  )
                  .map(item => (
                    <div key={item.item_code} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                         onClick={() => addItem(item)}>
                      <h4 className="font-medium">{item.item_name}</h4>
                      <p className="text-sm text-gray-600">{item.item_code}</p>
                      <p className="text-sm text-gray-500">{item.item_group}</p>
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





