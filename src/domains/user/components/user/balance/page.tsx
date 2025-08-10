"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Wallet, CreditCard, Plus, Minus, DollarSign, TrendingUp, TrendingDown, RefreshCw, Download, Eye, Gift, Crown, Filter, Calendar, Search, X } from 'lucide-react';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export const dynamic = 'force-dynamic'

interface TransactionFilters {
  type: string;
  status: string;
  dateRange: string;
  searchQuery: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'refund' | 'bonus';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

interface BalanceInfo {
  main: number;
  pending: number;
  bonus: number;
  total: number;
}

export default function BalancePage() {
  const { user, session, isLoading, error } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  
  const [balance, setBalance] = useState<BalanceInfo>({
    main: 2850.00,
    pending: 150.00,
    bonus: 50.00,
    total: 3050.00
  });

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      type: 'deposit',
      amount: 1000.00,
      description: 'إيداع من بطاقة ائتمانية',
      date: '2024-03-20T10:30:00',
      status: 'completed',
      reference: 'DEP123456'
    },
    {
      id: 'TXN002',
      type: 'purchase',
      amount: -250.50,
      description: 'شراء - أسمنت بورتلاند',
      date: '2024-03-19T14:15:00',
      status: 'completed',
      reference: 'PUR789123'
    },
    {
      id: 'TXN003',
      type: 'bonus',
      amount: 50.00,
      description: 'مكافأة العضوية الذهبية',
      date: '2024-03-18T09:45:00',
      status: 'completed',
      reference: 'BON456789'
    },
    {
      id: 'TXN004',
      type: 'deposit',
      amount: 500.00,
      description: 'إيداع مصرفي',
      date: '2024-03-17T16:20:00',
      status: 'pending',
      reference: 'DEP987654'
    },
    {
      id: 'TXN005',
      type: 'withdrawal',
      amount: -100.00,
      description: 'سحب إلى المحفظة',
      date: '2024-03-16T11:30:00',
      status: 'completed',
      reference: 'WTH654321'
    },
    {
      id: 'TXN006',
      type: 'purchase',
      amount: -75.25,
      description: 'شراء - مواد كهربائية',
      date: '2024-03-15T13:45:00',
      status: 'completed',
      reference: 'PUR456123'
    },
    {
      id: 'TXN007',
      type: 'refund',
      amount: 125.00,
      description: 'استرداد - طلب ملغي',
      date: '2024-03-14T10:20:00',
      status: 'completed',
      reference: 'REF789456'
    },
    {
      id: 'TXN008',
      type: 'withdrawal',
      amount: -200.00,
      description: 'سحب إلى الحساب المصرفي',
      date: '2024-03-13T09:15:00',
      status: 'failed',
      reference: 'WTH123789'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    searchQuery: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Filter transactions based on current filters
  useEffect(() => {
    let filtered = [...allTransactions];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(t => new Date(t.date) >= filterDate);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(query) ||
        t.reference?.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query)
      );
    }

    setTransactions(filtered);
  }, [filters, allTransactions]);

  // Format date consistently to avoid hydration mismatch
  const formatDate = (dateString: string) => {
    if (!isHydrated) {
      // Return a simple format during SSR
      return new Date(dateString).toISOString().split('T')[0];
    }
    // Return localized format after hydration
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  // Quick action handlers
  const handleWithdrawFunds = () => {
    // Simulate withdrawal process
    const withdrawalAmount = 100; // Default withdrawal amount
    const newTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'withdrawal',
      amount: -withdrawalAmount,
      description: 'سحب رصيد سريع',
      date: new Date().toISOString(),
      status: 'pending',
      reference: `WTH${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };

    setAllTransactions([newTransaction, ...allTransactions]);
    setBalance(prev => ({
      ...prev,
      pending: prev.pending - withdrawalAmount,
      total: prev.total - withdrawalAmount
    }));

    alert('تم إرسال طلب سحب الرصيد بنجاح! سيتم معالجته خلال 24 ساعة.');
  };

  const handleDownloadStatement = async () => {
    try {
      // Create CSV content
      const headers = ['التاريخ', 'النوع', 'الوصف', 'المبلغ', 'الحالة', 'المرجع'];
      const csvContent = [
        headers.join(','),
        ...transactions.map(t => [
          formatDate(t.date),
          getTransactionText(t.type),
          `"${t.description}"`,
          t.amount,
          getStatusText(t.status),
          t.reference || ''
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `كشف_حساب_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('تم تحميل كشف الحساب بنجاح!');
    } catch (error) {
      alert('حدث خطأ أثناء تحميل كشف الحساب. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleViewAllTransactions = () => {
    // Reset filters to show all transactions
    setFilters({
      type: 'all',
      status: 'all',
      dateRange: 'all',
      searchQuery: ''
    });
    setShowFilters(true);
    
    // Scroll to transactions section
    setTimeout(() => {
      const transactionsSection = document.getElementById('transactions-section');
      if (transactionsSection) {
        transactionsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleExportTransactions = () => {
    try {
      // Create Excel-like CSV with detailed formatting
      const headers = [
        'رقم المعاملة',
        'نوع المعاملة', 
        'الوصف',
        'المبلغ (ر.س)',
        'التاريخ',
        'الحالة',
        'رقم المرجع'
      ];

      // Calculate summary data
      const summary = {
        totalDeposits: transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
        totalWithdrawals: transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + Math.abs(t.amount), 0),
        totalPurchases: transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + Math.abs(t.amount), 0),
        totalBonuses: transactions.filter(t => t.type === 'bonus').reduce((sum, t) => sum + t.amount, 0)
      };

      const csvRows = [
        // Title and export info
        ['تقرير المعاملات المالية - منصة بنا'],
        ['تاريخ التصدير:', new Date().toLocaleDateString('en-US')],
        ['عدد المعاملات:', transactions.length.toString()],
        [''],
        
        // Balance summary
        ['ملخص الرصيد الحالي'],
        ['الرصيد الأساسي:', `${balance.main.toLocaleString('en-US')} ر.س`],
        ['الرصيد المعلق:', `${balance.pending.toLocaleString('en-US')} ر.س`],
        ['رصيد المكافآت:', `${balance.bonus.toLocaleString('en-US')} ر.س`],
        ['إجمالي الرصيد:', `${balance.total.toLocaleString('en-US')} ر.س`],
        [''],
        
        // Transaction summary
        ['ملخص المعاملات'],
        ['إجمالي الإيداعات:', `${summary.totalDeposits.toLocaleString('en-US')} ر.س`],
        ['إجمالي السحوبات:', `${summary.totalWithdrawals.toLocaleString('en-US')} ر.س`],
        ['إجمالي المشتريات:', `${summary.totalPurchases.toLocaleString('en-US')} ر.س`],
        ['إجمالي المكافآت:', `${summary.totalBonuses.toLocaleString('en-US')} ر.س`],
        [''],
        [''],
        
        // Table headers
        headers,
        
        // Transaction data
        ...transactions.map(t => [
          t.id,
          getTransactionText(t.type),
          t.description,
          `${t.amount.toLocaleString('en-US')}`,
          formatDate(t.date),
          getStatusText(t.status),
          t.reference || ''
        ])
      ];

      // Convert to CSV with proper UTF-8 BOM for Excel compatibility
      const csvContent = csvRows.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `تقرير_المعاملات_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('تم تصدير التقرير بصيغة Excel بنجاح! يمكنك فتحه في Microsoft Excel أو Google Sheets.');
    } catch (error) {
      alert('حدث خطأ أثناء تصدير التقرير. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleUpgradeMembership = () => {
    // Navigate to membership upgrade page
    window.location.href = '/user/subscriptions';
  };

  // Filter handlers
  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      dateRange: 'all',
      searchQuery: ''
    });
  };

  const hasActiveFilters = () => {
    return filters.type !== 'all' || 
           filters.status !== 'all' || 
           filters.dateRange !== 'all' || 
           filters.searchQuery !== '';
  };

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'deposit': return <Plus className="w-5 h-5 text-green-600" />;
      case 'withdrawal': return <Minus className="w-5 h-5 text-red-600" />;
      case 'purchase': return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'refund': return <RefreshCw className="w-5 h-5 text-purple-600" />;
      case 'bonus': return <Gift className="w-5 h-5 text-yellow-600" />;
      default: return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionText = (type: string) => {
    switch(type) {
      case 'deposit': return 'إيداع';
      case 'withdrawal': return 'سحب';
      case 'purchase': return 'شراء';
      case 'refund': return 'استرداد';
      case 'bonus': return 'مكافأة';
      default: return 'معاملة';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed': return 'مكتملة';
      case 'pending': return 'قيد المعالجة';
      case 'failed': return 'فاشلة';
      default: return 'غير محدد';
    }
  };

  const handleAddFunds = () => {
    if (!addAmount || parseFloat(addAmount) <= 0) return;
    
    // Use a more predictable ID generation to avoid hydration issues
    const timestamp = isHydrated ? Date.now() : 0;
    const randomId = isHydrated ? Math.random().toString(36).substr(2, 9).toUpperCase() : 'PENDING';
    
    const newTransaction: Transaction = {
      id: `TXN${timestamp}`,
      type: 'deposit',
      amount: parseFloat(addAmount),
      description: `إيداع من ${paymentMethod === 'card' ? 'بطاقة ائتمانية' : 'حساب مصرفي'}`,
      date: new Date().toISOString(),
      status: 'pending',
      reference: `DEP${randomId}`
    };

    setTransactions([newTransaction, ...allTransactions]);
    setAllTransactions([newTransaction, ...allTransactions]);
    setBalance(prev => ({
      ...prev,
      pending: prev.pending + parseFloat(addAmount),
      total: prev.total + parseFloat(addAmount)
    }));
    
    setAddAmount('');
    setShowAddFunds(false);
  };

  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
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
          <Wallet className="w-8 h-8 text-green-600" />
          محفظة بنا
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          إدارة رصيدك ومتابعة معاملاتك المالية
        </Typography>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <EnhancedCard className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="caption" size="sm" className="text-green-100 mb-1">الرصيد الأساسي</Typography>
              <Typography variant="heading" size="2xl" weight="bold">{balance.main.toLocaleString('en-US')} ر.س</Typography>
            </div>
            <Wallet className="w-8 h-8 text-green-200" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="caption" size="sm" className="text-yellow-100 mb-1">رصيد معلق</Typography>
              <Typography variant="heading" size="2xl" weight="bold">{balance.pending.toLocaleString('en-US')} ر.س</Typography>
            </div>
            <RefreshCw className="w-8 h-8 text-yellow-200" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="caption" size="sm" className="text-purple-100 mb-1">رصيد المكافآت</Typography>
              <Typography variant="heading" size="2xl" weight="bold">{balance.bonus.toLocaleString('en-US')} ر.س</Typography>
            </div>
            <Gift className="w-8 h-8 text-purple-200" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="caption" size="sm" className="text-blue-100 mb-1">إجمالي الرصيد</Typography>
              <Typography variant="heading" size="2xl" weight="bold">{balance.total.toLocaleString('en-US')} ر.س</Typography>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </EnhancedCard>
      </div>

      {/* Quick Actions */}
      <EnhancedCard className="p-6 mb-8">
        <Typography variant="subheading" size="xl" weight="semibold" className="mb-4">العمليات السريعة</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setShowAddFunds(true)}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center gap-3"
          >
            <Plus className="w-5 h-5" />
            إضافة رصيد
          </Button>
          
          <Button
            onClick={handleWithdrawFunds}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 p-4 rounded-lg flex items-center gap-3"
          >
            <Minus className="w-5 h-5" />
            سحب رصيد
          </Button>
          
          <Button
            onClick={handleDownloadStatement}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 p-4 rounded-lg flex items-center gap-3"
          >
            <Download className="w-5 h-5" />
            تنزيل كشف حساب
          </Button>
        </div>
      </EnhancedCard>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EnhancedCard className="p-6 m-4 max-w-md w-full">
            <Typography variant="subheading" size="xl" weight="semibold" className="mb-4">إضافة رصيد</Typography>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ (ر.س)</label>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="card">بطاقة ائتمانية</option>
                  <option value="bank">حساب مصرفي</option>
                  <option value="wallet">محفظة إلكترونية</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddFunds}
                disabled={!addAmount || parseFloat(addAmount) <= 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                إضافة رصيد
              </Button>
              <Button
                onClick={() => setShowAddFunds(false)}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </Button>
            </div>
          </EnhancedCard>
        </div>
      )}

      {/* Transaction History */}
      <div id="transactions-section">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="subheading" size="xl" weight="semibold">سجل المعاملات</Typography>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={`border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 ${showFilters ? 'bg-gray-100' : ''}`}
            >
              <Filter className="w-4 h-4" />
              فلترة
              {hasActiveFilters() && <span className="bg-green-500 text-white text-xs rounded-full w-2 h-2"></span>}
            </Button>
            <Button
              onClick={handleViewAllTransactions}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              عرض الكل
            </Button>
            <Button
              onClick={handleExportTransactions}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <EnhancedCard className="p-6 mb-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="subheading" size="lg" weight="semibold">فلاتر البحث</Typography>
              {hasActiveFilters() && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  مسح الفلاتر
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Transaction Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع المعاملة</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="deposit">إيداع</option>
                  <option value="withdrawal">سحب</option>
                  <option value="purchase">شراء</option>
                  <option value="refund">استرداد</option>
                  <option value="bonus">مكافأة</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">حالة المعاملة</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="completed">مكتملة</option>
                  <option value="pending">قيد المعالجة</option>
                  <option value="failed">فاشلة</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفترة الزمنية</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">جميع الفترات</option>
                  <option value="today">اليوم</option>
                  <option value="week">آخر أسبوع</option>
                  <option value="month">آخر شهر</option>
                  <option value="year">آخر سنة</option>
                </select>
              </div>

              {/* Search Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                    placeholder="البحث في الوصف أو المرجع..."
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Filter Results Summary */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Typography variant="caption" size="sm" className="text-gray-600">
                عرض {transactions.length} من أصل {allTransactions.length} معاملة
              </Typography>
              
              {hasActiveFilters() && (
                <div className="flex flex-wrap gap-2">
                  {filters.type !== 'all' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      النوع: {getTransactionText(filters.type as any)}
                    </span>
                  )}
                  {filters.status !== 'all' && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      الحالة: {getStatusText(filters.status as any)}
                    </span>
                  )}
                  {filters.dateRange !== 'all' && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      الفترة: {filters.dateRange}
                    </span>
                  )}
                  {filters.searchQuery && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      البحث: {filters.searchQuery}
                    </span>
                  )}
                </div>
              )}
            </div>
          </EnhancedCard>
        )}

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
              لا توجد معاملات بعد
            </Typography>
            <Typography variant="body" size="lg" className="text-gray-500">
              ستظهر جميع معاملاتك المالية هنا
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <EnhancedCard key={transaction.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900">
                          {transaction.description}
                        </Typography>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{getTransactionText(transaction.type)}</span>
                        <span>{formatDate(transaction.date)}</span>
                        {transaction.reference && <span>#{transaction.reference}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <Typography
                      variant="subheading"
                      size="lg"
                      weight="bold"
                      className={
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US')} ر.س
                    </Typography>
                  </div>
                </div>
              </EnhancedCard>
            ))}
          </div>
        )}
      </div>

      {/* Membership Benefits */}
      <EnhancedCard className="p-6 mt-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-6 h-6 text-yellow-600" />
          <Typography variant="subheading" size="xl" weight="semibold" className="text-yellow-800">
            العضوية الذهبية
          </Typography>
        </div>
        
        <Typography variant="body" size="lg" className="text-yellow-700 mb-4">
          احصل على مكافآت إضافية وخصومات حصرية مع العضوية الذهبية
        </Typography>
        
        <Button
          onClick={handleUpgradeMembership}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          ترقية العضوية
        </Button>
      </EnhancedCard>

      {/* Floating Help */}
      <Link href="/user/help-center" className="fixed bottom-8 left-8 bg-green-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-green-700 z-50">
        مساعدة؟
      </Link>
    </div>
  );
}



