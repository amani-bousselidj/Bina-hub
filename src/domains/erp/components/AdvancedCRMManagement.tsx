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
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  TrendingUp,
  Target,
  DollarSign,
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Eye,
  MessageSquare
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  country: string;
  totalPurchases: number;
  lastPurchase: string;
  status: 'active' | 'inactive' | 'prospect';
  segment: 'premium' | 'regular' | 'basic';
  source: string;
  assignedSalesperson: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  value: number;
  source: string;
  assignedTo: string;
  lastActivity: string;
  nextFollowUp: string;
}

interface CRMMetrics {
  totalCustomers: number;
  activeLeads: number;
  conversionRate: number;
  averageDealSize: number;
  customerLifetimeValue: number;
  monthlyRecurringRevenue: number;
}

export default function AdvancedCRMManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState<CRMMetrics>({
    totalCustomers: 0,
    activeLeads: 0,
    conversionRate: 0,
    averageDealSize: 0,
    customerLifetimeValue: 0,
    monthlyRecurringRevenue: 0
  });
  const [activeTab, setActiveTab] = useState<'customers' | 'leads' | 'analytics'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isRTL] = useState(false);

  // Mock data
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'محمد أحمد السعدي',
        email: 'mohamed.alsaadi@company.com',
        phone: '+966501234567',
        company: 'شركة المقاولات العربية',
        address: 'شارع الملك فهد، حي العليا',
        city: 'الرياض',
        country: 'السعودية',
        totalPurchases: 450000,
        lastPurchase: '2024-01-15',
        status: 'active',
        segment: 'premium',
        source: 'مرجع',
        assignedSalesperson: 'سارة محمد'
      },
      {
        id: '2',
        name: 'فاطمة علي الزهراني',
        email: 'fatima.alzahrani@gmail.com',
        phone: '+966509876543',
        company: 'مؤسسة البناء الحديث',
        address: 'طريق الأمير محمد بن عبدالعزيز',
        city: 'جدة',
        country: 'السعودية',
        totalPurchases: 125000,
        lastPurchase: '2024-01-10',
        status: 'active',
        segment: 'regular',
        source: 'موقع إلكتروني',
        assignedSalesperson: 'أحمد خالد'
      },
      {
        id: '3',
        name: 'خالد عبدالله القحطاني',
        email: 'khalid.alqahtani@construction.sa',
        phone: '+966551122334',
        company: 'شركة التطوير العقاري',
        address: 'شارع التحلية، حي السلامة',
        city: 'الدمام',
        country: 'السعودية',
        totalPurchases: 75000,
        lastPurchase: '2024-01-05',
        status: 'inactive',
        segment: 'basic',
        source: 'معرض تجاري',
        assignedSalesperson: 'نورا سالم'
      }
    ];

    const mockLeads: Lead[] = [
      {
        id: '1',
        name: 'عبدالرحمن محمد العتيبي',
        email: 'abdulrahman.alotaibi@newproject.com',
        phone: '+966502233445',
        company: 'مشروع المدينة الجديدة',
        status: 'qualified',
        value: 500000,
        source: 'LinkedIn',
        assignedTo: 'سارة محمد',
        lastActivity: '2024-01-14',
        nextFollowUp: '2024-01-20'
      },
      {
        id: '2',
        name: 'منى سعد الغامدي',
        email: 'mona.alghamdi@villa.sa',
        phone: '+966505566778',
        company: 'مشروع الفلل الراقية',
        status: 'proposal',
        value: 300000,
        source: 'مكالمة هاتفية',
        assignedTo: 'أحمد خالد',
        lastActivity: '2024-01-13',
        nextFollowUp: '2024-01-18'
      },
      {
        id: '3',
        name: 'سعد أحمد الحربي',
        email: 'saad.alharbi@mall.com',
        phone: '+966507788990',
        company: 'مشروع المول التجاري',
        status: 'new',
        value: 750000,
        source: 'موقع إلكتروني',
        assignedTo: 'نورا سالم',
        lastActivity: '2024-01-12',
        nextFollowUp: '2024-01-16'
      }
    ];

    setCustomers(mockCustomers);
    setLeads(mockLeads);

    // Calculate metrics
    const calculatedMetrics: CRMMetrics = {
      totalCustomers: mockCustomers.length,
      activeLeads: mockLeads.filter(l => ['new', 'contacted', 'qualified', 'proposal', 'negotiation'].includes(l.status)).length,
      conversionRate: 25.5,
      averageDealSize: mockLeads.reduce((sum, lead) => sum + lead.value, 0) / mockLeads.length,
      customerLifetimeValue: mockCustomers.reduce((sum, customer) => sum + customer.totalPurchases, 0) / mockCustomers.length,
      monthlyRecurringRevenue: 185000
    };
    setMetrics(calculatedMetrics);
  }, []);

  const getCustomerStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerStatusText = (status: Customer['status']) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'prospect': return 'عميل محتمل';
      default: return 'غير معروف';
    }
  };

  const getLeadStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-orange-100 text-orange-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-indigo-100 text-indigo-800';
      case 'closed_won': return 'bg-green-100 text-green-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadStatusText = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'جديد';
      case 'contacted': return 'تم التواصل';
      case 'qualified': return 'مؤهل';
      case 'proposal': return 'عرض سعر';
      case 'negotiation': return 'تفاوض';
      case 'closed_won': return 'تم الإغلاق بنجاح';
      case 'closed_lost': return 'تم الإغلاق بفشل';
      default: return 'غير معروف';
    }
  };

  const getSegmentColor = (segment: Customer['segment']) => {
    switch (segment) {
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      case 'regular': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSegmentText = (segment: Customer['segment']) => {
    switch (segment) {
      case 'premium': return 'مميز';
      case 'regular': return 'عادي';
      case 'basic': return 'أساسي';
      default: return 'غير معروف';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Chart data
  const salesFunnelData = [
    { stage: 'عملاء محتملون', count: 100, value: 5000000 },
    { stage: 'تم التواصل', count: 75, value: 3750000 },
    { stage: 'مؤهل', count: 50, value: 2500000 },
    { stage: 'عرض سعر', count: 30, value: 1500000 },
    { stage: 'تفاوض', count: 20, value: 1000000 },
    { stage: 'إغلاق بنجاح', count: 15, value: 750000 }
  ];

  const customerSegmentData = [
    { name: 'مميز', value: customers.filter(c => c.segment === 'premium').length, color: '#F59E0B' },
    { name: 'عادي', value: customers.filter(c => c.segment === 'regular').length, color: '#3B82F6' },
    { name: 'أساسي', value: customers.filter(c => c.segment === 'basic').length, color: '#6B7280' }
  ];

  const monthlyPerformance = [
    { month: 'يناير', newCustomers: 15, deals: 12, revenue: 180000 },
    { month: 'فبراير', newCustomers: 22, deals: 18, revenue: 220000 },
    { month: 'مارس', newCustomers: 28, deals: 25, revenue: 280000 },
    { month: 'أبريل', newCustomers: 24, deals: 20, revenue: 240000 },
    { month: 'مايو', newCustomers: 30, deals: 28, revenue: 300000 },
    { month: 'يونيو', newCustomers: 35, deals: 32, revenue: 350000 }
  ];

  return (
    <div className={`space-y-6 p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة علاقات العملاء المتقدمة</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            <Download className="w-4 h-4 mr-2" />
            تقرير العملاء
          </Button>
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            <MessageSquare className="w-4 h-4 mr-2" />
            إرسال رسائل جماعية
          </Button>
          <Button onClick={() => alert('Button clicked')}>
            <Plus className="w-4 h-4 mr-2" />
            عميل جديد
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
                <p className="text-2xl font-bold">{metrics.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">العملاء المحتملون النشطون</p>
                <p className="text-2xl font-bold">{metrics.activeLeads}</p>
              </div>
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">معدل التحويل</p>
                <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط قيمة الصفقة</p>
                <p className="text-xl font-bold">
                  {metrics.averageDealSize.toLocaleString('en-US')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">قيمة العميل الدائمة</p>
                <p className="text-xl font-bold">
                  {metrics.customerLifetimeValue.toLocaleString('en-US')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الإيرادات الشهرية المتكررة</p>
                <p className="text-xl font-bold">
                  {metrics.monthlyRecurringRevenue.toLocaleString('en-US')}
                </p>
              </div>
              <FileText className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'customers'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          العملاء
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'leads'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          العملاء المحتملون
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'analytics'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          التحليلات
        </button>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>قمع المبيعات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesFunnelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" name="العدد" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع العملاء حسب الفئة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={customerSegmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {customerSegmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>الأداء الشهري</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="newCustomers" stackId="1" stroke="#10B981" fill="#10B981" name="عملاء جدد" />
                  <Area type="monotone" dataKey="deals" stackId="2" stroke="#3B82F6" fill="#3B82F6" name="صفقات مغلقة" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters for Customers and Leads */}
      {(activeTab === 'customers' || activeTab === 'leads') && (
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`البحث في ${activeTab === 'customers' ? 'العملاء' : 'العملاء المحتملين'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">جميع الحالات</option>
            {activeTab === 'customers' && (
              <>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="prospect">عميل محتمل</option>
              </>
            )}
            {activeTab === 'leads' && (
              <>
                <option value="new">جديد</option>
                <option value="contacted">تم التواصل</option>
                <option value="qualified">مؤهل</option>
                <option value="proposal">عرض سعر</option>
                <option value="negotiation">تفاوض</option>
                <option value="closed_won">تم الإغلاق بنجاح</option>
                <option value="closed_lost">تم الإغلاق بفشل</option>
              </>
            )}
          </select>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <Card>
          <CardHeader>
            <CardTitle>قائمة العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">العميل</th>
                    <th className="text-right p-3">الشركة</th>
                    <th className="text-right p-3">التواصل</th>
                    <th className="text-right p-3">إجمالي المشتريات</th>
                    <th className="text-right p-3">آخر شراء</th>
                    <th className="text-right p-3">الفئة</th>
                    <th className="text-right p-3">الحالة</th>
                    <th className="text-right p-3">مسؤول المبيعات</th>
                    <th className="text-right p-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.city}, {customer.country}</div>
                        </div>
                      </td>
                      <td className="p-3">{customer.company}</td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div className="flex items-center mb-1">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {customer.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-medium">
                        {customer.totalPurchases.toLocaleString('en-US')}
                      </td>
                      <td className="p-3">{new Date(customer.lastPurchase).toLocaleDateString('en-US')}</td>
                      <td className="p-3">
                        <Badge className={getSegmentColor(customer.segment)}>
                          {getSegmentText(customer.segment)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getCustomerStatusColor(customer.status)}>
                          {getCustomerStatusText(customer.status)}
                        </Badge>
                      </td>
                      <td className="p-3">{customer.assignedSalesperson}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                            <MessageSquare className="w-4 h-4" />
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
      )}

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <Card>
          <CardHeader>
            <CardTitle>العملاء المحتملون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">العميل المحتمل</th>
                    <th className="text-right p-3">الشركة</th>
                    <th className="text-right p-3">التواصل</th>
                    <th className="text-right p-3">قيمة الصفقة</th>
                    <th className="text-right p-3">الحالة</th>
                    <th className="text-right p-3">المصدر</th>
                    <th className="text-right p-3">مسؤول المبيعات</th>
                    <th className="text-right p-3">المتابعة القادمة</th>
                    <th className="text-right p-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium">{lead.name}</div>
                      </td>
                      <td className="p-3">{lead.company}</td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div className="flex items-center mb-1">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {lead.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                            {lead.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-medium">
                        {lead.value.toLocaleString('en-US')}
                      </td>
                      <td className="p-3">
                        <Badge className={getLeadStatusColor(lead.status)}>
                          {getLeadStatusText(lead.status)}
                        </Badge>
                      </td>
                      <td className="p-3">{lead.source}</td>
                      <td className="p-3">{lead.assignedTo}</td>
                      <td className="p-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          {new Date(lead.nextFollowUp).toLocaleDateString('en-US')}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                            <MessageSquare className="w-4 h-4" />
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
      )}
    </div>
  );
}









