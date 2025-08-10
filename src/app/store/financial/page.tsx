'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  CreditCard,
  PieChart,
  BarChart3,
  Calendar,
  Download
} from 'lucide-react';

export default function FinancialPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const financialData = {
    revenue: 125000,
    expenses: 87500,
    profit: 37500,
    growth: 12.5,
    transactions: 342,
    avgOrderValue: 365.50
  };

  const recentTransactions = [
    { id: 1, type: 'sale', amount: 1250, description: 'بيع مواد بناء', date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'expense', amount: -850, description: 'شراء مخزون', date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'sale', amount: 2100, description: 'طلب شركة الإنشاءات', date: '2024-01-14', status: 'pending' },
    { id: 4, type: 'refund', amount: -320, description: 'استرداد منتج', date: '2024-01-13', status: 'completed' }
  ];

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sale': return 'text-green-600';
      case 'expense': return 'text-red-600';
      case 'refund': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">التقارير المالية</h1>
          <p className="text-gray-600 mt-1">متابعة الأداء المالي للمتجر</p>
        </div>
        <div className="flex space-x-2">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="quarter">هذا الربع</option>
            <option value="year">هذا العام</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              إجمالي الإيرادات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {financialData.revenue.toLocaleString()} ر.س
            </div>
            <div className="flex items-center mt-1">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{financialData.growth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Receipt className="w-4 h-4 mr-1" />
              إجمالي المصروفات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {financialData.expenses.toLocaleString()} ر.س
            </div>
            <div className="flex items-center mt-1">
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm text-red-600">-5.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              صافي الربح
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {financialData.profit.toLocaleString()} ر.س
            </div>
            <div className="text-sm text-gray-600 mt-1">
              هامش ربح: {((financialData.profit / financialData.revenue) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <CreditCard className="w-4 h-4 mr-1" />
              متوسط قيمة الطلب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {financialData.avgOrderValue.toLocaleString()} ر.س
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {financialData.transactions} معاملة
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              اتجاه الإيرادات الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">مخطط الإيرادات الشهرية</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              توزيع المصروفات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">مخطط توزيع المصروفات</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            آخر المعاملات المالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`text-2xl font-bold ${getTransactionColor(transaction.type)}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} ر.س
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-600">{transaction.date}</div>
                  </div>
                </div>
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status === 'completed' ? 'مكتملة' : 'معلقة'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
