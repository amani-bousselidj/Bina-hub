// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, LoadingSpinner, StatusBadge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/core/shared/utils';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import {
  TrendingUp,
  Plus,
  Calendar,
  DollarSign,
  FileText,
  Receipt,
  User,
  X,
  Eye,
  Edit,
  Filter,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface ProjectExpenseTrackerProps {
  projectId: string;
  projectName: string;
  projectBudget?: number;
  onExpenseCreated?: (expenseId: string) => void;
  onCancel?: () => void;
}

interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  expense_date: string;
  vendor_name: string;
  vendor_contact: string;
  invoice_number: string;
  invoice_url: string;
  receipt_url: string;
  payment_method: string;
  payment_status: string;
  paid_date: string;
  notes: string;
  quantity: number;
  unit_price: number;
  unit: string;
  is_budgeted: boolean;
  category_id: string;
  category_name: string;
  category_name_ar: string;
  category_color: string;
  created_at: string;
}

interface ExpenseForm {
  title: string;
  description: string;
  amount: number;
  currency: string;
  expense_date: string;
  vendor_name: string;
  vendor_contact: string;
  invoice_number: string;
  invoice_url: string;
  receipt_url: string;
  payment_method: string;
  payment_status: string;
  paid_date: string;
  notes: string;
  quantity: number;
  unit_price: number;
  unit: string;
  is_budgeted: boolean;  category_id: string;
}

// Note: Using a local interface for expense categories which differs from construction categories
interface ExpenseConstructionCategory {
  id: string;
  name: string;
  name_ar: string;
  color: string;
}

// Payment methods will be fetched from Supabase
const defaultPaymentMethods = [
  { value: 'cash', label: 'نقداً' },
  { value: 'card', label: 'بطاقة ائتمان' },
  { value: 'bank_transfer', label: 'تحويل بنكي' },
  { value: 'check', label: 'شيك' }
];

const defaultPaymentStatuses = [
  { value: 'pending', label: 'في الانتظار' },
  { value: 'paid', label: 'مدفوع' },
  { value: 'overdue', label: 'متأخر' },
  { value: 'cancelled', label: 'ملغي' }
];

// Currencies will be fetched from Supabase  
const defaultCurrencies = [
  { value: 'SAR', label: 'ريال سعودي' },
  { value: 'USD', label: 'دولار أمريكي' },
  { value: 'EUR', label: 'يورو' }
];

const units = [
  { value: 'piece', label: 'قطعة' },
  { value: 'meter', label: 'متر' },
  { value: 'square_meter', label: 'متر مربع' },
  { value: 'cubic_meter', label: 'متر مكعب' },
  { value: 'ton', label: 'طن' },
  { value: 'kg', label: 'كيلوجرام' },
  { value: 'hour', label: 'ساعة' },
  { value: 'day', label: 'يوم' },
  { value: 'service', label: 'خدمة' }
];

export default function ProjectExpenseTracker({
  projectId,
  projectName,
  projectBudget,
  onExpenseCreated,
  onCancel
}: ProjectExpenseTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseConstructionCategory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [form, setForm] = useState<ExpenseForm>({
    title: '',
    description: '',
    amount: 0,
    currency: 'SAR',
    expense_date: new Date().toISOString().split('T')[0],
    vendor_name: '',
    vendor_contact: '',
    invoice_number: '',
    invoice_url: '',
    receipt_url: '',
    payment_method: 'cash',
    payment_status: 'pending',
    paid_date: '',
    notes: '',
    quantity: 1,
    unit_price: 0,
    unit: 'piece',
    is_budgeted: false,
    category_id: ''
  });

  // Supabase options state
  const [paymentMethods, setPaymentMethods] = useState(defaultPaymentMethods);
  const [paymentStatuses, setPaymentStatuses] = useState(defaultPaymentStatuses);
  const [currencies, setCurrencies] = useState(defaultCurrencies);
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadData().catch(error => {
      console.error('Error in ProjectExpenseTracker loadData:', error);
      setError('فشل في تحميل البيانات');
      setLoading(false);
    });
  }, [projectId]);

  useEffect(() => {
    // Auto-calculate amount when quantity or unit_price changes
    if (form.quantity && form.unit_price) {
      setForm(prev => ({ ...prev, amount: prev.quantity * prev.unit_price }));
    }
  }, [form.quantity, form.unit_price]);

  // Load options from Supabase
  useEffect(() => {
    const loadOptions = async () => {
      try {
        // Try to load payment methods from Supabase
        const { data: paymentMethodsData, error: pmError } = await supabase
          .from('payment_methods')
          .select('value, label')
          .order('label');
        
        if (paymentMethodsData && !pmError) {
          setPaymentMethods(paymentMethodsData);
        }

        // Try to load currencies from Supabase  
        const { data: currenciesData, error: currError } = await supabase
          .from('currencies')
          .select('value, label')
          .eq('active', true)
          .order('label');
        
        if (currenciesData && !currError) {
          setCurrencies(currenciesData);
        }
      } catch (error) {
        console.log('Using default options - Supabase tables may not exist yet');
        // Keep default values if Supabase tables don't exist
      }
    };

    loadOptions();
  }, [supabase]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load construction categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('construction_categories')
        .select('id, name, name_ar, color')
        .eq('is_active', true)
        .order('sort_order');

      if (categoriesError) throw categoriesError;

      // Load project expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('construction_expenses')
        .select(`
          id, title, description, amount, currency, expense_date,
          vendor_name, vendor_contact, invoice_number, invoice_url,
          receipt_url, payment_method, payment_status, paid_date,
          notes, quantity, unit_price, unit, is_budgeted, created_at,
          construction_categories!category_id (id, name, name_ar, color)
        `)
        .eq('project_id', projectId)
        .order('expense_date', { ascending: false });

      if (expensesError) throw expensesError;

      setCategories(categoriesData || []);
      
      // Transform expenses to include category information
      const expensesWithCategory = expensesData?.map(expense => ({
        ...expense,
        category_id: (expense.construction_categories as any)?.id || '',
        category_name: (expense.construction_categories as any)?.name || '',
        category_name_ar: (expense.construction_categories as any)?.name_ar || '',
        category_color: (expense.construction_categories as any)?.color || '#gray'
      })) || [];

      setExpenses(expensesWithCategory);

      // Set default category if available
      if (categoriesData && categoriesData.length > 0 && !form.category_id) {
        setForm(prev => ({ ...prev, category_id: categoriesData[0].id }));
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setError('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.amount || !form.category_id) {
      setError('يرجى ملء الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const expenseData = {
        project_id: projectId,
        category_id: form.category_id,
        title: form.title,
        description: form.description,
        amount: form.amount,
        currency: form.currency,
        expense_date: form.expense_date,
        vendor_name: form.vendor_name,
        vendor_contact: form.vendor_contact,
        invoice_number: form.invoice_number,
        invoice_url: form.invoice_url,
        receipt_url: form.receipt_url,
        payment_method: form.payment_method,
        payment_status: form.payment_status,
        paid_date: form.paid_date || null,
        notes: form.notes,
        quantity: form.quantity,
        unit_price: form.unit_price,
        unit: form.unit,
        is_budgeted: form.is_budgeted,
        created_by: user.id
      };

      let result;
      if (editingExpense) {
        // Update existing expense
        result = await supabase
          .from('construction_expenses')
          .update(expenseData)
          .eq('id', editingExpense.id)
          .select()
          .single();
      } else {
        // Create new expense
        result = await supabase
          .from('construction_expenses')
          .insert(expenseData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Reset form and reload expenses
      resetForm();
      setShowForm(false);
      setEditingExpense(null);
      await loadData();

      if (onExpenseCreated && !editingExpense) {
        onExpenseCreated(result.data.id);
      }

    } catch (error) {
      console.error('Error saving expense:', error);
      setError('خطأ في حفظ بيانات المصروف');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      amount: 0,
      currency: 'SAR',
      expense_date: new Date().toISOString().split('T')[0],
      vendor_name: '',
      vendor_contact: '',
      invoice_number: '',
      invoice_url: '',
      receipt_url: '',
      payment_method: 'cash',
      payment_status: 'pending',
      paid_date: '',
      notes: '',
      quantity: 1,
      unit_price: 0,
      unit: 'piece',
      is_budgeted: false,
      category_id: categories.length > 0 ? categories[0].id : ''
    });
  };

  const editExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setForm({
      title: expense.title,
      description: expense.description || '',
      amount: expense.amount,
      currency: expense.currency,
      expense_date: expense.expense_date,
      vendor_name: expense.vendor_name || '',
      vendor_contact: expense.vendor_contact || '',
      invoice_number: expense.invoice_number || '',
      invoice_url: expense.invoice_url || '',
      receipt_url: expense.receipt_url || '',
      payment_method: expense.payment_method || 'cash',
      payment_status: expense.payment_status || 'pending',
      paid_date: expense.paid_date || '',
      notes: expense.notes || '',
      quantity: expense.quantity || 1,
      unit_price: expense.unit_price || 0,
      unit: expense.unit || 'piece',
      is_budgeted: expense.is_budgeted || false,
      category_id: expense.category_id
    });
    setShowForm(true);
  };

  const deleteExpense = async (expenseId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('construction_expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError('خطأ في حذف المصروف');
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      pending: { text: 'في الانتظار', variant: 'warning' as const, icon: Clock },
      paid: { text: 'مدفوع', variant: 'success' as const, icon: CheckCircle },
      overdue: { text: 'متأخر', variant: 'error' as const, icon: AlertTriangle },
      cancelled: { text: 'ملغي', variant: 'error' as const, icon: X }
    };
    return statusMap[status as keyof typeof statusMap] || { text: status, variant: 'default' as const, icon: Clock };
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = filterCategory === 'all' || expense.category_id === filterCategory;
    const matchesStatus = filterStatus === 'all' || expense.payment_status === filterStatus;
    return matchesCategory && matchesStatus;
  });

  const calculateTotals = () => {
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const paidExpenses = filteredExpenses
      .filter(expense => expense.payment_status === 'paid')
      .reduce((sum, expense) => sum + expense.amount, 0);
    const pendingExpenses = filteredExpenses
      .filter(expense => expense.payment_status === 'pending')
      .reduce((sum, expense) => sum + expense.amount, 0);
    const categoryBreakdown = categories.map(category => {
      const categoryExpenses = filteredExpenses.filter(expense => expense.category_id === category.id);
      const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return { category, total, count: categoryExpenses.length };
    }).filter(item => item.total > 0);

    return {
      totalExpenses,
      paidExpenses,
      pendingExpenses,
      categoryBreakdown,
      budgetUsage: projectBudget ? (totalExpenses / projectBudget) * 100 : 0
    };
  };

  const totals = calculateTotals();

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
          <h2 className="text-2xl font-bold flex items-center">
            <TrendingUp className="w-6 h-6 ml-2" />
            تتبع مصروفات المشروع
          </h2>
          <p className="text-gray-600">{projectName}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingExpense(null);
              resetForm();
            }}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة مصروف
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5 ml-2" />
              إغلاق
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          {projectBudget && (
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>من الميزانية</span>
                <span>{totals.budgetUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${
                    totals.budgetUsage > 90 ? 'bg-red-500' : 
                    totals.budgetUsage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(totals.budgetUsage, 100)}%` }}
                />
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">المدفوع</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.paidExpenses)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">في الانتظار</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totals.pendingExpenses)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">عدد المصروفات</p>
              <p className="text-2xl font-bold text-blue-600">{filteredExpenses.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      {totals.categoryBreakdown.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">توزيع المصروفات حسب الفئة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {totals.categoryBreakdown.map(({ category, total, count }) => (
              <div key={category.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{category.name_ar}</p>
                  <p className="text-xs text-gray-500">{count} مصروف</p>
                </div>
                <p className="font-semibold text-sm">{formatCurrency(total)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Expense Form */}
      {showForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingExpense ? 'تعديل المصروف' : 'إضافة مصروف جديد'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">المعلومات الأساسية</h4>
                
                <div>
                  <label className="block text-sm font-medium mb-1">عنوان المصروف *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">الفئة *</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name_ar}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">الوصف</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="وصف تفصيلي للمصروف..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ المصروف *</label>
                  <input
                    type="date"
                    value={form.expense_date}
                    onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_budgeted"
                    checked={form.is_budgeted}
                    onChange={(e) => setForm({ ...form, is_budgeted: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                  />
                  <label htmlFor="is_budgeted" className="mr-2 text-sm text-gray-900">
                    مدرج في الميزانية
                  </label>
                </div>
              </div>

              {/* Financial Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">التفاصيل المالية</h4>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">الكمية</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">سعر الوحدة</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.unit_price}
                      onChange={(e) => setForm({ ...form, unit_price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">الوحدة</label>
                    <select
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {units.map(unit => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">المبلغ الإجمالي *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">العملة</label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {currencies.map(currency => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">طريقة الدفع</label>
                    <select
                      value={form.payment_method}
                      onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">حالة الدفع</label>
                    <select
                      value={form.payment_status}
                      onChange={(e) => setForm({ ...form, payment_status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {paymentStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {form.payment_status === 'paid' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">تاريخ الدفع</label>
                    <input
                      type="date"
                      value={form.paid_date}
                      onChange={(e) => setForm({ ...form, paid_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Vendor Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">معلومات المورد</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم المورد</label>
                  <input
                    type="text"
                    value={form.vendor_name}
                    onChange={(e) => setForm({ ...form, vendor_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">جهة الاتصال</label>
                  <input
                    type="text"
                    value={form.vendor_contact}
                    onChange={(e) => setForm({ ...form, vendor_contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="رقم هاتف أو بريد إلكتروني"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">رقم الفاتورة</label>
                  <input
                    type="text"
                    value={form.invoice_number}
                    onChange={(e) => setForm({ ...form, invoice_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">المستندات</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">رابط الفاتورة</label>
                  <input
                    type="url"
                    value={form.invoice_url}
                    onChange={(e) => setForm({ ...form, invoice_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">رابط الإيصال</label>
                  <input
                    type="url"
                    value={form.receipt_url}
                    onChange={(e) => setForm({ ...form, receipt_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">ملاحظات</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="ملاحظات إضافية..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingExpense(null);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 ml-2" />
                    {editingExpense ? 'تحديث المصروف' : 'حفظ المصروف'}
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">مصروفات المشروع ({filteredExpenses.length})</h3>
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">جميع الفئات</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name_ar}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              {paymentStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expenses List */}
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-2">لا توجد مصروفات لهذا المشروع</p>
            <p className="text-sm text-gray-400">قم بإضافة مصروفات البناء والتشييد</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredExpenses.map((expense) => {
              const statusBadge = getPaymentStatusBadge(expense.payment_status);
              const StatusIcon = statusBadge.icon;

              return (
                <div key={expense.id} className="py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: expense.category_color }}
                        />                        <h4 className="font-medium">{expense.title}</h4>
                        <StatusBadge 
                          status={statusBadge.variant}
                          label={statusBadge.text}
                        />
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {expense.category_name_ar}
                        </span>
                        {expense.is_budgeted && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                            مدرج في الميزانية
                          </span>
                        )}
                      </div>

                      {expense.description && (
                        <p className="text-sm text-gray-600 mb-2">{expense.description}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>المبلغ:</strong> {formatCurrency(expense.amount, expense.currency)}</p>
                          {expense.quantity > 1 && (
                            <p><strong>الكمية:</strong> {expense.quantity} {expense.unit}</p>
                          )}
                        </div>
                        <div>
                          <p><strong>تاريخ المصروف:</strong> {formatDate(expense.expense_date)}</p>
                          {expense.vendor_name && (
                            <p><strong>المورد:</strong> {expense.vendor_name}</p>
                          )}
                        </div>
                        <div>
                          {expense.payment_method && (
                            <p><strong>طريقة الدفع:</strong> {paymentMethods.find(m => m.value === expense.payment_method)?.label}</p>
                          )}
                          {expense.paid_date && (
                            <p><strong>تاريخ الدفع:</strong> {formatDate(expense.paid_date)}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mr-4">
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatCurrency(expense.amount, expense.currency)}</p>
                      </div>

                      <div className="flex gap-2">
                        {expense.invoice_url && (
                          <a
                            href={expense.invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="عرض الفاتورة"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                        
                        {expense.receipt_url && (
                          <a
                            href={expense.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="عرض الإيصال"
                          >
                            <Receipt className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => setSelectedExpense(expense)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => editExpense(expense)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Expense Details Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold">تفاصيل المصروف</h3>
                <button
                  onClick={() => setSelectedExpense(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="font-medium mb-3">المعلومات الأساسية</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>العنوان:</strong> {selectedExpense.title}</div>
                    <div><strong>الفئة:</strong> {selectedExpense.category_name_ar}</div>
                    <div><strong>تاريخ المصروف:</strong> {formatDate(selectedExpense.expense_date)}</div>
                    <div><strong>المبلغ:</strong> {formatCurrency(selectedExpense.amount, selectedExpense.currency)}</div>
                    <div><strong>الكمية:</strong> {selectedExpense.quantity} {selectedExpense.unit}</div>
                    <div><strong>سعر الوحدة:</strong> {formatCurrency(selectedExpense.unit_price || 0, selectedExpense.currency)}</div>
                  </div>
                  {selectedExpense.description && (
                    <div className="mt-3">
                      <strong>الوصف:</strong>
                      <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedExpense.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Information */}
                <div>
                  <h4 className="font-medium mb-3">معلومات الدفع</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>طريقة الدفع:</strong> {paymentMethods.find(m => m.value === selectedExpense.payment_method)?.label || selectedExpense.payment_method}</div>
                    <div><strong>حالة الدفع:</strong> {paymentStatuses.find(s => s.value === selectedExpense.payment_status)?.label || selectedExpense.payment_status}</div>
                    {selectedExpense.paid_date && (
                      <div><strong>تاريخ الدفع:</strong> {formatDate(selectedExpense.paid_date)}</div>
                    )}
                    <div><strong>مدرج في الميزانية:</strong> {selectedExpense.is_budgeted ? 'نعم' : 'لا'}</div>
                  </div>
                </div>

                {/* Vendor Information */}
                {(selectedExpense.vendor_name || selectedExpense.vendor_contact || selectedExpense.invoice_number) && (
                  <div>
                    <h4 className="font-medium mb-3">معلومات المورد</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedExpense.vendor_name && <div><strong>اسم المورد:</strong> {selectedExpense.vendor_name}</div>}
                      {selectedExpense.vendor_contact && <div><strong>جهة الاتصال:</strong> {selectedExpense.vendor_contact}</div>}
                      {selectedExpense.invoice_number && <div><strong>رقم الفاتورة:</strong> {selectedExpense.invoice_number}</div>}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {(selectedExpense.invoice_url || selectedExpense.receipt_url) && (
                  <div>
                    <h4 className="font-medium mb-3">المستندات</h4>
                    <div className="flex gap-3">
                      {selectedExpense.invoice_url && (
                        <a
                          href={selectedExpense.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <FileText className="w-4 h-4 ml-2" />
                          الفاتورة
                        </a>
                      )}
                      
                      {selectedExpense.receipt_url && (
                        <a
                          href={selectedExpense.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <Receipt className="w-4 h-4 ml-2" />
                          الإيصال
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedExpense.notes && (
                  <div>
                    <h4 className="font-medium mb-3">ملاحظات</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedExpense.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}





