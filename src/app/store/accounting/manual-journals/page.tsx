'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Upload,
  Search,
  FileText,
  Eye
} from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  status: 'draft' | 'posted' | 'reversed';
  createdBy: string;
}

export default function ManualJournalsPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2025-01-15',
      reference: 'JE001',
      description: 'قيد تصحيح حساب المخزون',
      debitAccount: 'المخزون',
      creditAccount: 'تكلفة البضاعة المباعة',
      amount: 5000,
      status: 'posted',
      createdBy: 'أحمد محمد'
    },
    {
      id: '2',
      date: '2025-01-14',
      reference: 'JE002',
      description: 'استهلاك الأصول الثابتة',
      debitAccount: 'مصروف الاستهلاك',
      creditAccount: 'مجمع استهلاك المعدات',
      amount: 1200,
      status: 'posted',
      createdBy: 'سارة أحمد'
    },
    {
      id: '3',
      date: '2025-01-13',
      reference: 'JE003',
      description: 'قيد تسوية الإيرادات المستحقة',
      debitAccount: 'الإيرادات المستحقة',
      creditAccount: 'إيرادات الخدمات',
      amount: 3500,
      status: 'draft',
      createdBy: 'محمد علي'
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredEntries = journalEntries.filter(entry => 
    selectedStatus === 'all' || entry.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'reversed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'posted': return 'مُرحل';
      case 'draft': return 'مسودة';
      case 'reversed': return 'مُلغى';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">القيود اليدوية</h1>
          <p className="text-gray-600">إدارة وإنشاء القيود المحاسبية اليدوية</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          قيد جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي القيود</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{journalEntries.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">القيود المُرحلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {journalEntries.filter(entry => entry.status === 'posted').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">المسودات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold">
                {journalEntries.filter(entry => entry.status === 'draft').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي المبلغ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {journalEntries.reduce((sum, entry) => sum + entry.amount, 0).toLocaleString()} ريال
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>جميع القيود اليدوية</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في القيود..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="posted">مُرحل</option>
                <option value="draft">مسودة</option>
                <option value="reversed">مُلغى</option>
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
                  <th className="text-right py-3 px-4 font-medium text-gray-600">المرجع</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">التاريخ</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الوصف</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الحساب المدين</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الحساب الدائن</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">المبلغ</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الحالة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-blue-600">{entry.reference}</td>
                    <td className="py-3 px-4 text-gray-600">{entry.date}</td>
                    <td className="py-3 px-4 text-gray-900">{entry.description}</td>
                    <td className="py-3 px-4 text-gray-600">{entry.debitAccount}</td>
                    <td className="py-3 px-4 text-gray-600">{entry.creditAccount}</td>
                    <td className="py-3 px-4 font-medium">{entry.amount.toLocaleString()} ريال</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                        {getStatusText(entry.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
            <CardTitle>إنشاء قيد يدوي جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم المرجع</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="JE004"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="وصف القيد المحاسبي..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحساب المدين</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>اختر الحساب المدين</option>
                  <option>المخزون</option>
                  <option>الحسابات المدينة</option>
                  <option>النقدية</option>
                  <option>المصروفات</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحساب الدائن</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>اختر الحساب الدائن</option>
                  <option>المبيعات</option>
                  <option>الحسابات الدائنة</option>
                  <option>رأس المال</option>
                  <option>الإيرادات</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ (ريال)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-3">
              <Button className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                حفظ كمسودة
              </Button>
              <Button variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                ترحيل القيد
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تحليل القيود الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">المدين</p>
                  <p className="text-2xl font-bold text-green-600">125,000 ريال</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">الدائن</p>
                  <p className="text-2xl font-bold text-red-600">125,000 ريال</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 mb-2">حالة التوازن</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-blue-200 rounded-full flex-1">
                    <div className="h-2 bg-blue-600 rounded-full w-full"></div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">متوازن 100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
