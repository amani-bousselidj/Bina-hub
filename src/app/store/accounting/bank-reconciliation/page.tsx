'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Building2, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle,
  Upload,
  Download,
  RefreshCw,
  Eye,
  Plus,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  Search
} from 'lucide-react';

interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  balance: number;
  lastReconciled: string;
  status: 'reconciled' | 'pending' | 'discrepancy';
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'debit' | 'credit';
  amount: number;
  status: 'matched' | 'unmatched' | 'pending';
  reference: string;
}

export default function BankReconciliationPage() {
const supabase = createClientComponentClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [bankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      name: 'الحساب الجاري الرئيسي',
      accountNumber: '1234567890',
      bankName: 'البنك الأهلي السعودي',
      balance: 125000,
      lastReconciled: '2025-01-10',
      status: 'reconciled'
    },
    {
      id: '2',
      name: 'حساب التوفير',
      accountNumber: '0987654321',
      bankName: 'بنك الراجحي',
      balance: 75000,
      lastReconciled: '2025-01-08',
      status: 'pending'
    },
    {
      id: '3',
      name: 'حساب العمليات',
      accountNumber: '5555666677',
      bankName: 'بنك سامبا',
      balance: 45000,
      lastReconciled: '2025-01-05',
      status: 'discrepancy'
    }
  ]);

  const [transactions, setTransactions] = useState<any[]>([]);;

  const [selectedAccount, setSelectedAccount] = useState<string>('1');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reconciled': return 'bg-green-100 text-green-800';
      case 'matched': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'unmatched': return 'bg-red-100 text-red-800';
      case 'discrepancy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reconciled': return 'مُسوّى';
      case 'matched': return 'متطابق';
      case 'pending': return 'قيد المراجعة';
      case 'unmatched': return 'غير متطابق';
      case 'discrepancy': return 'يوجد اختلاف';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reconciled':
      case 'matched':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4" />;
      case 'unmatched':
      case 'discrepancy':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }
      
      if (data) {
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التسوية البنكية</h1>
          <p className="text-gray-600">تسوية الحسابات البنكية ومطابقة المعاملات</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push('/store/accounting/bank-reconciliation/upload')}>
              <Upload className="h-4 w-4 mr-2" />
              رفع كشف حساب
            </Button>
          <Button onClick={() => router.push('/store/accounting/bank-reconciliation/new')}>
            <Plus className="h-4 w-4 mr-2" />
            تسوية جديدة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الحسابات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{bankAccounts.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">الرصيد الإجمالي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {bankAccounts.reduce((sum, account) => sum + account.balance, 0).toLocaleString()} ريال
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">المعاملات المطابقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {transactions.filter(t => t.status === 'matched').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">المعاملات المعلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold">
                {transactions.filter(t => t.status !== 'matched').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {bankAccounts.map((account) => (
          <Card key={account.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{account.name}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(account.status)}`}>
                  {getStatusIcon(account.status)}
                  {getStatusText(account.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{account.bankName}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{account.accountNumber}</span>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">الرصيد الحالي:</span>
                    <span className="text-lg font-bold text-green-600">
                      {account.balance.toLocaleString()} ريال
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">آخر تسوية:</span>
                    <span className="text-sm text-gray-900">{account.lastReconciled}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    عرض
                  </Button>
                  <Button size="sm" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    تسوية
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>معاملات الحساب الجاري الرئيسي</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في المعاملات..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">جميع المعاملات</option>
                <option value="matched">متطابقة</option>
                <option value="unmatched">غير متطابقة</option>
                <option value="pending">قيد المراجعة</option>
              </select>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">التاريخ</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الوصف</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">النوع</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">المبلغ</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">المرجع</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الحالة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{transaction.date}</td>
                    <td className="py-3 px-4 text-gray-900">{transaction.description}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'credit' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'credit' ? 'إيداع' : 'سحب'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toLocaleString()} ريال
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{transaction.reference}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        {getStatusText(transaction.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {transaction.status !== 'matched' && (
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ملخص التسوية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-900 font-medium">رصيد البنك</span>
                <span className="text-blue-600 font-bold">125,000 ريال</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-900 font-medium">رصيد الدفاتر</span>
                <span className="text-green-600 font-bold">124,975 ريال</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-900 font-medium">الفرق</span>
                <span className="text-yellow-600 font-bold">25 ريال</span>
              </div>

              <div className="pt-4">
                <Button className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  إنهاء التسوية
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>البنود غير المطابقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-red-900">رسوم خدمات بنكية</p>
                    <p className="text-sm text-red-700">لم يتم تسجيلها في الدفاتر</p>
                  </div>
                  <span className="text-red-600 font-medium">25 ريال</span>
                </div>
                <Button variant="outline" size="sm" className="mt-2 text-red-600 border-red-300">
                  إضافة للدفاتر
                </Button>
              </div>

              <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-yellow-900">إيداع معلق</p>
                    <p className="text-sm text-yellow-700">لم يظهر في كشف البنك بعد</p>
                  </div>
                  <span className="text-yellow-600 font-medium">2,000 ريال</span>
                </div>
                <Button variant="outline" size="sm" className="mt-2 text-yellow-600 border-yellow-300">
                  متابعة مع البنك
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
