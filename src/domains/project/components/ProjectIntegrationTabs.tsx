// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, LoadingSpinner, StatusBadge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/core/shared/utils';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import {
  ShoppingCart,
  Shield,
  TrendingUp,
  Plus,
  Calendar,
  DollarSign,
  Package,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface ProjectIntegrationTabsProps {
  projectId: string;
  projectName: string;
  onOrderCreate?: () => void;
  onWarrantyCreate?: () => void;
  onExpenseCreate?: () => void;
}

interface ProjectOrder {
  id: string;
  order_number: string;
  store_name: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  items_count: number;
}

interface ProjectWarranty {
  id: string;
  product_name: string;
  warranty_number: string;
  vendor_name: string;
  warranty_end_date: string;
  status: string;
  claim_count: number;
  created_at: string;
}

interface ProjectExpense {
  id: string;
  title: string;
  category_name: string;
  category_name_ar: string;
  amount: number;
  expense_date: string;
  vendor_name: string;
  payment_status: string;
  created_at: string;
}

export default function ProjectIntegrationTabs({ 
  projectId, 
  projectName, 
  onOrderCreate, 
  onWarrantyCreate, 
  onExpenseCreate 
}: ProjectIntegrationTabsProps) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<ProjectOrder[]>([]);
  const [warranties, setWarranties] = useState<ProjectWarranty[]>([]);
  const [expenses, setExpenses] = useState<ProjectExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load project orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id, order_number, total_amount, status, payment_status, created_at,
          stores!orders_store_id_fkey (store_name),
          order_items (id)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Load project warranties
      const { data: warrantiesData, error: warrantiesError } = await supabase
        .from('warranties')
        .select(`
          id, product_name, warranty_number, vendor_name, 
          warranty_end_date, status, claim_count, created_at
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (warrantiesError) throw warrantiesError;

      // Load project expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('construction_expenses')
        .select(`
          id, title, amount, expense_date, vendor_name, 
          payment_status, created_at,
          construction_categories!category_id (name, name_ar)
        `)
        .eq('project_id', projectId)
        .order('expense_date', { ascending: false });

      if (expensesError) throw expensesError;

      // Transform and set data
      setOrders(ordersData?.map(order => ({
        id: order.id,
        order_number: order.order_number,
        store_name: (order.stores as any)?.store_name || 'متجر غير معروف',
        total_amount: order.total_amount,
        status: order.status,
        payment_status: order.payment_status,
        created_at: order.created_at,
        items_count: order.order_items?.length || 0
      })) || []);

      setWarranties(warrantiesData || []);

      setExpenses(expensesData?.map(expense => ({
        id: expense.id,
        title: expense.title,
        category_name: (expense.construction_categories as any)?.name || '',
        category_name_ar: (expense.construction_categories as any)?.name_ar || '',
        amount: expense.amount,
        expense_date: expense.expense_date,
        vendor_name: expense.vendor_name,
        payment_status: expense.payment_status,
        created_at: expense.created_at
      })) || []);

    } catch (error) {
      console.error('Error loading project data:', error);
      setError('خطأ في تحميل بيانات المشروع');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusBadge = (status: string) => {
    const statusMap = {
      pending: { text: 'قيد الانتظار', variant: 'warning' as const },
      confirmed: { text: 'مؤكد', variant: 'info' as const },
      processing: { text: 'قيد التجهيز', variant: 'info' as const },
      shipped: { text: 'تم الشحن', variant: 'success' as const },
      delivered: { text: 'تم التسليم', variant: 'success' as const },
      cancelled: { text: 'ملغي', variant: 'error' as const }
    };
    return statusMap[status as keyof typeof statusMap] || { text: status, variant: 'default' as const };
  };

  const getWarrantyStatusBadge = (status: string) => {
    const statusMap = {
      active: { text: 'نشط', variant: 'success' as const },
      expired: { text: 'منتهي', variant: 'error' as const },
      claimed: { text: 'تم المطالبة', variant: 'warning' as const },
      void: { text: 'ملغي', variant: 'error' as const }
    };
    return statusMap[status as keyof typeof statusMap] || { text: status, variant: 'default' as const };
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      pending: { text: 'قيد الانتظار', variant: 'warning' as const },
      paid: { text: 'مدفوع', variant: 'success' as const },
      overdue: { text: 'متأخر', variant: 'error' as const },
      cancelled: { text: 'ملغي', variant: 'error' as const }
    };
    return statusMap[status as keyof typeof statusMap] || { text: status, variant: 'default' as const };
  };

  const calculateProjectTotals = () => {
    const totalOrders = orders.length;
    const totalOrderValue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const activeWarranties = warranties.filter(w => w.status === 'active').length;
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      totalOrders,
      totalOrderValue,
      activeWarranties,
      totalExpenses
    };
  };

  const totals = calculateProjectTotals();

  const tabs = [
    {
      id: 'orders',
      label: 'الطلبات',
      icon: ShoppingCart,
      count: totals.totalOrders,
      color: 'blue'
    },
    {
      id: 'warranties',
      label: 'الضمانات',
      icon: Shield,
      count: totals.activeWarranties,
      color: 'green'
    },
    {
      id: 'expenses',
      label: 'المصروفات',
      icon: TrendingUp,
      count: expenses.length,
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSpinner />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">{error}</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-blue-600">{totals.totalOrders}</p>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            قيمة: {formatCurrency(totals.totalOrderValue)}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">الضمانات النشطة</p>
              <p className="text-2xl font-bold text-green-600">{totals.activeWarranties}</p>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            من أصل {warranties.length} ضمان
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">إجمالي المصروفات</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totals.totalExpenses)}</p>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {expenses.length} عملية صرف
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">إجمالي الإنفاق</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(totals.totalOrderValue + totals.totalExpenses)}
              </p>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            طلبات + مصروفات
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card className="overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 ml-2" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`mr-2 px-2 py-1 text-xs rounded-full bg-${tab.color}-100 text-${tab.color}-600`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">طلبات المشروع</h3>
                <button
                  onClick={onOrderCreate}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  طلب جديد
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>لا توجد طلبات لهذا المشروع</p>
                  <p className="text-sm mt-2">قم بإنشاء طلب جديد لبدء التسوق</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">                            <h4 className="font-medium">#{order.order_number}</h4>
                            <StatusBadge 
                              status={getOrderStatusBadge(order.status).variant}
                              label={getOrderStatusBadge(order.status).text}
                            />
                            <StatusBadge 
                              status={getPaymentStatusBadge(order.payment_status).variant}
                              label={getPaymentStatusBadge(order.payment_status).text}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mb-1">من: {order.store_name}</p>
                          <p className="text-sm text-gray-500">
                            {order.items_count} عنصر • {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-lg">{formatCurrency(order.total_amount)}</p>
                          <div className="flex gap-2 mt-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600" onClick={() => alert('Button clicked')}>
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600" onClick={() => alert('Button clicked')}>
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'warranties' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">ضمانات المشروع</h3>
                <button
                  onClick={onWarrantyCreate}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  ضمان جديد
                </button>
              </div>

              {warranties.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>لا توجد ضمانات لهذا المشروع</p>
                  <p className="text-sm mt-2">قم بتسجيل ضمانات المنتجات المشتراة</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {warranties.map((warranty) => (
                    <div key={warranty.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">                            <h4 className="font-medium">{warranty.product_name}</h4>
                            <StatusBadge 
                              status={getWarrantyStatusBadge(warranty.status).variant}
                              label={getWarrantyStatusBadge(warranty.status).text}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mb-1">رقم الضمان: {warranty.warranty_number}</p>
                          <p className="text-sm text-gray-600 mb-1">المورد: {warranty.vendor_name}</p>
                          <p className="text-sm text-gray-500">
                            ينتهي في: {formatDate(warranty.warranty_end_date)}
                          </p>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2 mb-2">
                            {warranty.claim_count > 0 ? (
                              <span className="text-sm text-orange-600">
                                {warranty.claim_count} مطالبة
                              </span>
                            ) : (
                              <span className="text-sm text-green-600">لا توجد مطالبات</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600" onClick={() => alert('Button clicked')}>
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600" onClick={() => alert('Button clicked')}>
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">مصروفات المشروع</h3>
                <button
                  onClick={onExpenseCreate}
                  className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  مصروف جديد
                </button>
              </div>

              {expenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>لا توجد مصروفات لهذا المشروع</p>
                  <p className="text-sm mt-2">قم بتسجيل مصروفات البناء والتشييد</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{expense.title}</h4>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                              {expense.category_name_ar || expense.category_name}
                            </span>                            <StatusBadge 
                              status={getPaymentStatusBadge(expense.payment_status).variant}
                              label={getPaymentStatusBadge(expense.payment_status).text}
                            />
                          </div>
                          {expense.vendor_name && (
                            <p className="text-sm text-gray-600 mb-1">المورد: {expense.vendor_name}</p>
                          )}
                          <p className="text-sm text-gray-500">
                            تاريخ الصرف: {formatDate(expense.expense_date)}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-lg">{formatCurrency(expense.amount)}</p>
                          <div className="flex gap-2 mt-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600" onClick={() => alert('Button clicked')}>
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600" onClick={() => alert('Button clicked')}>
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}





