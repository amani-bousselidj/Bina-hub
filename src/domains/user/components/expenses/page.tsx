"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { DollarSign, Plus, Search, Filter, Calendar, Tag, TrendingUp, TrendingDown, PieChart, BarChart3, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export const dynamic = 'force-dynamic'

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  project?: string;
  store: string;
  date: string;
  receipt?: string;
  tags: string[];
  paymentMethod: string;
}

interface ExpenseCategory {
  name: string;
  color: string;
  total: number;
  count: number;
}

export default function ExpensesPage() {
  const { user, session, isLoading, error } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const search = useSearchParams();
  const projectIdFromUrl = search?.get('projectId') || undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    project: '',
    store: '',
    date: '',
    paymentMethod: ''
  });

  // Fetch expenses data from API
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user || !session) return;
      
      try {
        setLoading(true);
        setApiError(null);
        const url = projectIdFromUrl ? `/api/user/expenses?projectId=${projectIdFromUrl}` : '/api/user/expenses';
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.expenses) {
          // Transform API data to match our Expense interface
          const transformedExpenses = data.expenses.map((exp: any) => ({
            id: exp.id || exp.order_number || `EXP-${Date.now()}`,
            description: exp.description || exp.order_items?.map((item: any) => item.product_name || item.name).join(', ') || 'منتجات متنوعة',
            amount: parseFloat(exp.amount || exp.total_amount || 0),
            category: exp.category || 'عام',
            project: exp.project_name || exp.project || undefined,
            store: exp.store_name || exp.store || 'متجر غير محدد',
            date: exp.date || exp.created_at || new Date().toISOString().split('T')[0],
            tags: exp.tags || [],
            paymentMethod: exp.payment_method || 'غير محدد'
          }));
          
          setExpenses(transformedExpenses);
        } else {
          console.warn('No expenses data received:', data);
          setExpenses([]);
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to fetch expenses');
        // Keep empty array if API fails
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user, session, projectIdFromUrl]);

  // If projectId provided in URL, pre-filter by that project name when possible
  useEffect(() => {
    if (projectIdFromUrl && expenses.length > 0) {
      // project prop holds name; if we can't map ID->name here, leave the list already filtered by API
      setProjectFilter('all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIdFromUrl]);

  const categories: ExpenseCategory[] = [
    { name: 'مواد خام', color: 'bg-blue-500', total: 0, count: 0 },
    { name: 'كهربائيات', color: 'bg-yellow-500', total: 0, count: 0 },
    { name: 'صحية', color: 'bg-green-500', total: 0, count: 0 },
    { name: 'عمالة', color: 'bg-red-500', total: 0, count: 0 },
    { name: 'تشطيبات', color: 'bg-purple-500', total: 0, count: 0 },
    { name: 'أخرى', color: 'bg-gray-500', total: 0, count: 0 }
  ];

  // Calculate category totals
  const categoryTotals = categories.map(cat => ({
    ...cat,
    total: expenses.filter(exp => exp.category === cat.name).reduce((sum, exp) => sum + exp.amount, 0),
    count: expenses.filter(exp => exp.category === cat.name).length
  }));

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesProject = projectFilter === 'all' || expense.project === projectFilter;
    return matchesSearch && matchesCategory && matchesProject;
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyTotal = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const currentDate = new Date();
    return expDate.getMonth() === currentDate.getMonth() && expDate.getFullYear() === currentDate.getFullYear();
  }).reduce((sum, exp) => sum + exp.amount, 0);

  const expenseProjects = [...new Set(expenses.filter(exp => exp.project).map(exp => exp.project))];

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount && newExpense.category) {
      const expense: Expense = {
        id: `EXP${(expenses.length + 1).toString().padStart(3, '0')}`,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        project: newExpense.project || undefined,
        store: newExpense.store,
        date: newExpense.date || new Date().toISOString().split('T')[0],
        tags: [],
        paymentMethod: newExpense.paymentMethod
      };
      setExpenses([...expenses, expense]);
      setNewExpense({
        description: '',
        amount: '',
        category: '',
        project: '',
        store: '',
        date: '',
        paymentMethod: ''
      });
      setShowAddExpense(false);
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter(exp => exp.id !== expenseId));
  };

  
  // Loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error || apiError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <p className="text-sm text-gray-600 mb-4">{error || apiError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-green-600" />
          تتبع المصروفات
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          إدارة وتحليل جميع مصروفات مشاريعك ومشترياتك
        </Typography>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                {totalExpenses.toLocaleString('en-US')}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">إجمالي المصروفات (ر.س)</Typography>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                {monthlyTotal.toLocaleString('en-US')}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">مصروفات هذا الشهر (ر.س)</Typography>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-purple-600">
                {expenses.length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">عدد المعاملات</Typography>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-orange-600">
                {Math.round(totalExpenses / expenses.length).toLocaleString('en-US')}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">متوسط المصروف (ر.س)</Typography>
            </div>
            <PieChart className="w-8 h-8 text-orange-600" />
          </div>
        </EnhancedCard>
      </div>

      {/* Category Breakdown */}
      <EnhancedCard className="p-6 mb-8">
        <Typography variant="subheading" size="xl" weight="semibold" className="mb-4">توزيع المصروفات حسب الفئة</Typography>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryTotals.map((category, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${category.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                <Typography variant="caption" size="sm" className="text-white font-bold">
                  {category.count}
                </Typography>
              </div>
              <Typography variant="caption" size="sm" className="font-medium">{category.name}</Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">
                {category.total.toLocaleString('en-US')} ر.س
              </Typography>
            </div>
          ))}
        </div>
      </EnhancedCard>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في المصروفات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">جميع الفئات</option>
          {categories.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        {expenseProjects.length > 0 && (
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">جميع المشاريع</option>
            {expenseProjects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        )}

        {/* AI Invoice Extractor Button */}
        <Link href="/user/ai-hub?feature=expense-tracker">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2" onClick={() => alert('Button clicked')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            استخراج من فاتورة بالذكاء الاصطناعي
          </Button>
        </Link>

        <Button
          onClick={() => setShowAddExpense(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          إضافة مصروف
        </Button>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EnhancedCard className="p-6 max-w-md w-full mx-4">
            <Typography variant="subheading" size="xl" weight="semibold" className="mb-4">إضافة مصروف جديد</Typography>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="وصف المصروف..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (ر.س)</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المتجر</label>
                <input
                  type="text"
                  value={newExpense.store}
                  onChange={(e) => setNewExpense({...newExpense, store: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="اسم المتجر..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المشروع (اختياري)</label>
                <input
                  type="text"
                  value={newExpense.project}
                  onChange={(e) => setNewExpense({...newExpense, project: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="اسم المشروع..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">طريقة الدفع</label>
                <select
                  value={newExpense.paymentMethod}
                  onChange={(e) => setNewExpense({...newExpense, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر طريقة الدفع</option>
                  <option value="نقداً">نقداً</option>
                  <option value="بطاقة ائتمان">بطاقة ائتمان</option>
                  <option value="تحويل بنكي">تحويل بنكي</option>
                  <option value="شيك">شيك</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddExpense}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                حفظ المصروف
              </Button>
              <Button
                onClick={() => setShowAddExpense(false)}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </Button>
            </div>
          </EnhancedCard>
        </div>
      )}

      {/* Expenses List */}
      <div className="grid gap-6">
        {filteredExpenses.map((expense) => (
          <EnhancedCard key={expense.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    categoryTotals.find(cat => cat.name === expense.category)?.color || 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900 mb-1">
                      {expense.description}
                    </Typography>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <Typography variant="caption" size="sm" className="text-gray-600">الفئة: {expense.category}</Typography>
                        <Typography variant="caption" size="sm" className="text-gray-600">المتجر: {expense.store}</Typography>
                      </div>
                      
                      <div>
                        <Typography variant="caption" size="sm" className="text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(expense.date).toLocaleDateString('en-US')}
                        </Typography>
                        <Typography variant="caption" size="sm" className="text-gray-600">الدفع: {expense.paymentMethod}</Typography>
                      </div>
                      
                      {expense.project && (
                        <div>
                          <Typography variant="caption" size="sm" className="text-gray-600">المشروع: {expense.project}</Typography>
                        </div>
                      )}
                    </div>

                    {expense.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {expense.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                  {expense.amount.toLocaleString('en-US')} ر.س
                </Typography>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                   onClick={() => alert('Button clicked')}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteExpense(expense.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {filteredExpenses.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
            لا توجد مصروفات
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-500">
            {searchTerm || categoryFilter !== 'all' ? 'لم يتم العثور على مصروفات تطابق البحث' : 'ابدأ بإضافة مصروفاتك لتتبع إنفاقك'}
          </Typography>
        </div>
      )}

      {/* AI Features Integration */}
      <EnhancedCard className="p-6 mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <Typography variant="subheading" size="xl" weight="semibold" className="mb-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.53-1.453l-.548-.547z" />
          </svg>
          أدوات ذكية لإدارة المصروفات
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/user/ai-hub?feature=expense-tracker">
            <div className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <Typography variant="subheading" size="lg" weight="semibold" className="text-purple-800">
                  استخراج ذكي من الفواتير
                </Typography>
              </div>
              <Typography variant="body" size="sm" className="text-purple-600">
                استخدم الذكاء الاصطناعي لاستخراج بيانات المصروفات من الفواتير تلقائياً
              </Typography>
            </div>
          </Link>
          
          <Link href="/user/smart-insights">
            <div className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <Typography variant="subheading" size="lg" weight="semibold" className="text-blue-800">
                  تحليلات ذكية
                </Typography>
              </div>
              <Typography variant="body" size="sm" className="text-blue-600">
                احصل على رؤى ذكية وتوقعات لأنماط إنفاقك ونصائح للتوفير
              </Typography>
            </div>
          </Link>
          
          <Link href="/user/comprehensive-construction-calculator">
            <div className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <Typography variant="subheading" size="lg" weight="semibold" className="text-green-800">
                  حاسبة ذكية
                </Typography>
              </div>
              <Typography variant="body" size="sm" className="text-green-600">
                احسب تكاليف مشاريعك بدقة واربطها بمصروفاتك الفعلية
              </Typography>
            </div>
          </Link>
        </div>
      </EnhancedCard>
    </div>
  );
}

