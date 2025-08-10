// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  FileText, 
  Calendar,
  Download,
  Eye,
  Edit,
  Plus,
  Filter,
  Search
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientTaxId: string;
  date: string;
  dueDate: string;
  subtotal: number;
  vatAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  zatcaStatus: 'pending' | 'approved' | 'rejected';
  qrCode: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  outstandingReceivables: number;
  vatCollected: number;
  vatPaid: number;
}

export default function AdvancedFinancialManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    outstandingReceivables: 0,
    vatCollected: 0,
    vatPaid: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isRTL] = useState(false);

  // Mock data
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        number: 'INV-2024-001',
        clientName: 'شركة المقاولات العربية',
        clientTaxId: '300123456789003',
        date: '2024-01-15',
        dueDate: '2024-02-14',
        subtotal: 100000,
        vatAmount: 15000,
        total: 115000,
        status: 'paid',
        zatcaStatus: 'approved',
        qrCode: 'QR_CODE_DATA_HERE',
        items: [
          {
            id: '1',
            name: 'سيراميك فاخر 60x60',
            quantity: 500,
            unitPrice: 200,
            vatRate: 15,
            total: 100000
          }
        ]
      },
      {
        id: '2',
        number: 'INV-2024-002',
        clientName: 'مؤسسة البناء الحديث',
        clientTaxId: '300987654321003',
        date: '2024-01-14',
        dueDate: '2024-02-13',
        subtotal: 75000,
        vatAmount: 11250,
        total: 86250,
        status: 'sent',
        zatcaStatus: 'pending',
        qrCode: 'QR_CODE_DATA_HERE',
        items: [
          {
            id: '2',
            name: 'رخام كرارا طبيعي',
            quantity: 100,
            unitPrice: 750,
            vatRate: 15,
            total: 75000
          }
        ]
      },
      {
        id: '3',
        number: 'INV-2024-003',
        clientName: 'شركة التطوير العقاري',
        clientTaxId: '300456789123003',
        date: '2024-01-10',
        dueDate: '2024-01-25',
        subtotal: 50000,
        vatAmount: 7500,
        total: 57500,
        status: 'overdue',
        zatcaStatus: 'approved',
        qrCode: 'QR_CODE_DATA_HERE',
        items: [
          {
            id: '3',
            name: 'مواد بناء متنوعة',
            quantity: 1,
            unitPrice: 50000,
            vatRate: 15,
            total: 50000
          }
        ]
      }
    ];

    setInvoices(mockInvoices);

    // Calculate financial summary
    const summary: FinancialSummary = {
      totalRevenue: mockInvoices.reduce((sum, inv) => sum + inv.total, 0),
      totalExpenses: 45000, // Mock data
      netProfit: 0,
      outstandingReceivables: mockInvoices
        .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.total, 0),
      vatCollected: mockInvoices.reduce((sum, inv) => sum + inv.vatAmount, 0),
      vatPaid: 6750 // Mock data
    };
    summary.netProfit = summary.totalRevenue - summary.totalExpenses;
    setFinancialSummary(summary);
  }, []);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'مدفوعة';
      case 'sent': return 'مرسلة';
      case 'overdue': return 'متأخرة';
      case 'draft': return 'مسودة';
      case 'cancelled': return 'ملغية';
      default: return 'غير معروف';
    }
  };

  const getZatcaStatusColor = (status: Invoice['zatcaStatus']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getZatcaStatusText = (status: Invoice['zatcaStatus']) => {
    switch (status) {
      case 'approved': return 'معتمدة';
      case 'pending': return 'قيد المراجعة';
      case 'rejected': return 'مرفوضة';
      default: return 'غير معروف';
    }
  };

  const filteredInvoices = invoices.filter((invoice: Invoice) => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Chart data
  const revenueData = [
    { month: 'يناير', revenue: 180000, expenses: 120000, profit: 60000 },
    { month: 'فبراير', revenue: 220000, expenses: 140000, profit: 80000 },
    { month: 'مارس', revenue: 280000, expenses: 160000, profit: 120000 },
    { month: 'أبريل', revenue: 240000, expenses: 150000, profit: 90000 },
    { month: 'مايو', revenue: 300000, expenses: 180000, profit: 120000 },
    { month: 'يونيو', revenue: 350000, expenses: 200000, profit: 150000 }
  ];

  const statusDistribution = [
    { name: 'مدفوعة', value: invoices.filter((i: Invoice) => i.status === 'paid').length, color: '#10B981' },
    { name: 'مرسلة', value: invoices.filter((i: Invoice) => i.status === 'sent').length, color: '#3B82F6' },
    { name: 'متأخرة', value: invoices.filter((i: Invoice) => i.status === 'overdue').length, color: '#EF4444' },
    { name: 'مسودة', value: invoices.filter((i: Invoice) => i.status === 'draft').length, color: '#6B7280' }
  ];

  const generateZATCACompliantInvoice = (invoice: Invoice) => {
    // This would integrate with ZATCA's API in a real application
    console.log('Generating ZATCA compliant invoice for:', invoice.number);
    // Implementation would include:
    // - XML generation according to ZATCA standards
    // - Digital signature
    // - QR code with required fields
    // - Submission to ZATCA platform
  };

  return (
    <div className={`space-y-6 p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الإدارة المالية المتقدمة</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            <Download className="w-4 h-4 mr-2" />
            تقرير مالي
          </Button>
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            <FileText className="w-4 h-4 mr-2" />
            تقرير ضريبة القيمة المضافة
          </Button>
          <Button onClick={() => alert('Button clicked')}>
            <Plus className="w-4 h-4 mr-2" />
            فاتورة جديدة
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-green-600">
                  {financialSummary.totalRevenue.toLocaleString('en-US')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المصروفات</p>
                <p className="text-2xl font-bold text-red-600">
                  {financialSummary.totalExpenses.toLocaleString('en-US')}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">صافي الربح</p>
                <p className="text-2xl font-bold text-blue-600">
                  {financialSummary.netProfit.toLocaleString('en-US')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الذمم المدينة</p>
                <p className="text-2xl font-bold text-orange-600">
                  {financialSummary.outstandingReceivables.toLocaleString('en-US')}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ضريبة ق.م محصلة</p>
                <p className="text-2xl font-bold text-purple-600">
                  {financialSummary.vatCollected.toLocaleString('en-US')}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ضريبة ق.م مدفوعة</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {financialSummary.vatPaid.toLocaleString('en-US')}
                </p>
              </div>
              <FileText className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الأداء المالي الشهري</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => value.toLocaleString('en-US')}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" name="الإيرادات" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="المصروفات" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#3B82F6" name="صافي الربح" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توزيع حالة الفواتير</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ZATCA Compliance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            امتثال ZATCA (هيئة الزكاة والضريبة والجمارك)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">الفواتير المعتمدة</h3>
              <p className="text-2xl font-bold text-green-600">
                {invoices.filter(i => i.zatcaStatus === 'approved').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800">قيد المراجعة</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {invoices.filter(i => i.zatcaStatus === 'pending').length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800">مرفوضة</h3>
              <p className="text-2xl font-bold text-red-600">
                {invoices.filter(i => i.zatcaStatus === 'rejected').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث في الفواتير..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">جميع الحالات</option>
          <option value="paid">مدفوعة</option>
          <option value="sent">مرسلة</option>
          <option value="overdue">متأخرة</option>
          <option value="draft">مسودة</option>
        </select>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="month">هذا الشهر</option>
          <option value="quarter">هذا الربع</option>
          <option value="year">هذا العام</option>
        </select>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>الفواتير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">رقم الفاتورة</th>
                  <th className="text-right p-3">العميل</th>
                  <th className="text-right p-3">التاريخ</th>
                  <th className="text-right p-3">تاريخ الاستحقاق</th>
                  <th className="text-right p-3">المبلغ الإجمالي</th>
                  <th className="text-right p-3">الحالة</th>
                  <th className="text-right p-3">حالة ZATCA</th>
                  <th className="text-right p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono">{invoice.number}</td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{invoice.clientName}</div>
                        <div className="text-sm text-gray-500">{invoice.clientTaxId}</div>
                      </div>
                    </td>
                    <td className="p-3">{new Date(invoice.date).toLocaleDateString('en-US')}</td>
                    <td className="p-3">{new Date(invoice.dueDate).toLocaleDateString('en-US')}</td>
                    <td className="p-3 font-medium">
                      {invoice.total.toLocaleString('en-US')}
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(invoice.status)}>
                        {getStatusText(invoice.status)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getZatcaStatusColor(invoice.zatcaStatus)}>
                        {getZatcaStatusText(invoice.zatcaStatus)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => generateZATCACompliantInvoice(invoice)}
                        >
                          <FileText className="w-4 h-4" />
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
    </div>
  );
}









