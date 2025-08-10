"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Shield, DollarSign, TrendingUp, ArrowRight, Receipt, Eye, Calendar, Package, BarChart3, PieChart } from 'lucide-react';
import { formatDateSafe, useIsClient } from '@/core/shared/utils/hydration-safe';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export const dynamic = 'force-dynamic'

interface WarrantyExpense {
  id: string;
  warrantyId: string;
  productName: string;
  purchasePrice: number;
  warrantyValue: number;
  purchaseDate: string;
  store: string;
  category: string;
  status: 'active' | 'claimed' | 'expired';
  claimValue?: number;
  claimDate?: string;
}

export default function WarrantyExpenseTrackingPage() {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const isClient = useIsClient();
  const [expenses, setExpenses] = useState<WarrantyExpense[]>([]);

  useEffect(() => {
    setExpenses([
      {
        id: 'WE001',
        warrantyId: 'W001',
        productName: 'مضخة المياه عالية الكفاءة',
        purchasePrice: 850,
        warrantyValue: 850,
        purchaseDate: '2024-01-15',
        store: 'متجر الأدوات الصحية المتقدمة',
        category: 'أدوات صحية',
        status: 'active'
      },
      {
        id: 'WE002',
        warrantyId: 'W002',
        productName: 'مكيف هواء 24000 وحدة',
        purchasePrice: 2400,
        warrantyValue: 2400,
        purchaseDate: '2024-03-10',
        store: 'معرض التكييف المركزي',
        category: 'أجهزة كهربائية',
        status: 'active'
      },
      {
        id: 'WE003',
        warrantyId: 'W003',
        productName: 'أدوات كهربائية متنوعة',
        purchasePrice: 320,
        warrantyValue: 320,
        purchaseDate: '2023-06-20',
        store: 'متجر العدد والأدوات',
        category: 'أدوات ومعدات',
        status: 'claimed',
        claimValue: 150,
        claimDate: '2024-05-15'
      }
    ]);
  }, []);

  const totalInvestment = expenses.reduce((sum, exp) => sum + exp.purchasePrice, 0);
  const totalWarrantyValue = expenses.reduce((sum, exp) => sum + exp.warrantyValue, 0);
  const totalClaimedValue = expenses.reduce((sum, exp) => sum + (exp.claimValue || 0), 0);
  const activeWarranties = expenses.filter(exp => exp.status === 'active');

  const categoryBreakdown = expenses.reduce((acc: { [key: string]: number }, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.purchasePrice;
    return acc;
  }, {});

  if (!isClient) {
    
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
      <div className="container mx-auto px-4 py-8 max-w-6xl" dir="rtl">
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowRight className="w-5 h-5" />
          العودة
        </button>
        
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          تتبع المصروفات والضمانات
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          ربط الضمانات بالمصروفات لتتبع أفضل للاستثمارات وعوائد المطالبات
        </Typography>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                {totalInvestment.toLocaleString('en-US')}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">إجمالي الاستثمار (ر.س)</Typography>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                {totalWarrantyValue.toLocaleString('en-US')}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">قيمة الضمانات (ر.س)</Typography>
            </div>
            <Shield className="w-8 h-8 text-green-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-orange-600">
                {totalClaimedValue.toLocaleString('en-US')}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">المطالبات المستلمة (ر.س)</Typography>
            </div>
            <Receipt className="w-8 h-8 text-orange-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-purple-600">
                {activeWarranties.length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">ضمانات نشطة</Typography>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </EnhancedCard>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <EnhancedCard className="p-6">
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            التوزيع حسب الفئة
          </Typography>
          
          <div className="space-y-4">
            {Object.entries(categoryBreakdown).map(([category, amount]) => {
              const percentage = ((amount / totalInvestment) * 100).toFixed(1);
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Typography variant="body" size="md">{category}</Typography>
                    <Typography variant="body" size="md" weight="medium">
                      {amount.toLocaleString('en-US')} ر.س ({percentage}%)
                    </Typography>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            مؤشرات الأداء
          </Typography>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <Typography variant="body" size="md">نسبة تغطية الضمان</Typography>
              <Typography variant="body" size="md" weight="bold" className="text-green-600">
                {((totalWarrantyValue / totalInvestment) * 100).toFixed(1)}%
              </Typography>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <Typography variant="body" size="md">عائد المطالبات</Typography>
              <Typography variant="body" size="md" weight="bold" className="text-blue-600">
                {((totalClaimedValue / totalInvestment) * 100).toFixed(1)}%
              </Typography>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <Typography variant="body" size="md">متوسط قيمة المنتج</Typography>
              <Typography variant="body" size="md" weight="bold" className="text-purple-600">
                {(totalInvestment / expenses.length).toLocaleString('en-US')} ر.س
              </Typography>
            </div>
          </div>
        </EnhancedCard>
      </div>

      {/* Expense Details */}
      <EnhancedCard className="p-6">
        <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 mb-6">
          تفاصيل المصروفات والضمانات
        </Typography>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4">المنتج</th>
                <th className="text-right py-3 px-4">الفئة</th>
                <th className="text-right py-3 px-4">سعر الشراء</th>
                <th className="text-right py-3 px-4">تاريخ الشراء</th>
                <th className="text-right py-3 px-4">حالة الضمان</th>
                <th className="text-right py-3 px-4">قيمة المطالبة</th>
                <th className="text-right py-3 px-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <Typography variant="body" size="md" weight="medium">{expense.productName}</Typography>
                  </td>
                  <td className="py-4 px-4">
                    <Typography variant="caption" size="sm" className="text-gray-600">{expense.category}</Typography>
                  </td>
                  <td className="py-4 px-4">
                    <Typography variant="body" size="md" weight="medium">{expense.purchasePrice.toLocaleString('en-US')} ر.س</Typography>
                  </td>
                  <td className="py-4 px-4">
                    <Typography variant="caption" size="sm" className="text-gray-600">
                      {formatDateSafe(expense.purchaseDate, { format: 'medium' })}
                    </Typography>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      expense.status === 'active' ? 'bg-green-100 text-green-800' :
                      expense.status === 'claimed' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {expense.status === 'active' ? 'نشط' : 
                       expense.status === 'claimed' ? 'تم المطالبة' : 'منتهي'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Typography variant="body" size="md" weight="medium">
                      {expense.claimValue ? `${expense.claimValue.toLocaleString('en-US')} ر.س` : '-'}
                    </Typography>
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/user/warranties/${expense.warrantyId}`)}
                      className="text-sm"
                    >
                      <Eye className="w-4 h-4 ml-1" />
                      عرض التفاصيل
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EnhancedCard>

      {/* Quick Actions */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button
          onClick={() => router.push('/user/ai-hub')}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Receipt className="w-5 h-5" />
          استخراج بيانات فاتورة جديدة
        </Button>
        
        <Button
          variant="outline"
          onClick={() => router.push('/user/warranties')}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <Shield className="w-5 h-5" />
          إدارة الضمانات
        </Button>
        
        <Button
          variant="outline"
          onClick={() => router.push('/user/expenses')}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <DollarSign className="w-5 h-5" />
          إدارة المصروفات
        </Button>
      </div>
    </div>
  );
}



