'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  TrendingUp,
  Building,
  User,
  Star,
  ShoppingCart,
  History,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Percent,
  FileText,
  Tag,
  UserPlus,
  UserCheck,
  Hash,
  Briefcase
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Customer {
  id: string;
  customerCode: string;
  name: string;
  arabicName?: string;
  type: 'individual' | 'business';
  category: CustomerCategory;
  contactInfo: ContactInfo;
  businessInfo?: BusinessInfo;
  financialInfo: FinancialInfo;
  status: 'active' | 'inactive' | 'blocked';
  registrationDate: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  creditScore: number;
  loyaltyPoints: number;
  preferredPaymentMethod: string;
  notes?: string;
  tags: string[];
}

interface ContactInfo {
  phone: string;
  email?: string;
  address: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;
}

interface BusinessInfo {
  businessName: string;
  businessType: string;
  taxNumber?: string;
  commercialRegister?: string;
  industry: string;
  employeeCount?: number;
  website?: string;
}

interface FinancialInfo {
  creditLimit: number;
  currentBalance: number;
  paymentTerms: number; // days
  discountPercentage: number;
  lastPaymentDate?: string;
  outstandingAmount: number;
}

interface CustomerCategory {
  id: string;
  name: string;
  discountPercentage: number;
  creditDays: number;
  minimumOrderValue: number;
  color: string;
}

export default function CustomersPage() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);;

  const [customerCategories] = useState<CustomerCategory[]>([
    {
      id: '1',
      name: 'عميل ذهبي',
      discountPercentage: 10,
      creditDays: 30,
      minimumOrderValue: 1000,
      color: 'gold'
    },
    {
      id: '2',
      name: 'عميل فضي',
      discountPercentage: 5,
      creditDays: 15,
      minimumOrderValue: 500,
      color: 'silver'
    },
    {
      id: '3',
      name: 'عميل برونزي',
      discountPercentage: 3,
      creditDays: 7,
      minimumOrderValue: 200,
      color: 'bronze'
    },
    {
      id: '4',
      name: 'عميل عادي',
      discountPercentage: 0,
      creditDays: 0,
      minimumOrderValue: 0,
      color: 'gray'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCustomers = customers.filter(customer => {
    const matchesCategory = selectedCategory === 'all' || customer.category.id === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactInfo.phone.includes(searchTerm) ||
      (customer.contactInfo.email && customer.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getCategoryColor = (category: CustomerCategory) => {
    switch (category.color) {
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'blocked': return 'محظور';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <Clock className="h-4 w-4" />;
      case 'blocked': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const businessCustomers = customers.filter(c => c.type === 'business').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrderValue = customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length;
  const outstandingAmount = customers.reduce((sum, c) => sum + c.financialInfo.outstandingAmount, 0);

  // Fetch customers from Supabase
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching customers:', error);
        return;
      }
      
      if (data) {
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
          <p className="text-gray-600">إدارة قاعدة بيانات العملاء والعلاقات التجارية</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            استيراد عملاء
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير البيانات
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            عميل جديد
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{totalCustomers}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">عميل مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">عملاء نشطون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{activeCustomers}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">عميل نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">عملاء الأعمال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{businessCustomers}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">شركة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">متوسط قيمة الطلب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{averageOrderValue.toFixed(0)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">مبالغ مستحقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">{outstandingAmount.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>فئات العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {customerCategories.map((category) => {
              const categoryCustomers = customers.filter(c => c.category.id === category.id);
              const categoryRevenue = categoryCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
              
              return (
                <div key={category.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-medium px-2 py-1 rounded border ${getCategoryColor(category)}`}>
                      {category.name}
                    </h3>
                    <span className="text-lg font-bold">{categoryCustomers.length}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>خصم:</span>
                      <span>{category.discountPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>مدة السداد:</span>
                      <span>{category.creditDays} يوم</span>
                    </div>
                    <div className="flex justify-between">
                      <span>إجمالي الإيرادات:</span>
                      <span className="font-medium">{categoryRevenue.toLocaleString()} ريال</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة العملاء</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في العملاء..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الفئات</option>
                {customerCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="blocked">محظور</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                تصفية متقدمة
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {customer.type === 'business' ? (
                        <Building className="h-6 w-6 text-blue-600" />
                      ) : (
                        <User className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{customer.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(customer.category)}`}>
                          {customer.category.name}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(customer.status)}`}>
                          {getStatusIcon(customer.status)}
                          {getStatusText(customer.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{customer.customerCode}</p>
                      {customer.businessInfo && (
                        <p className="text-sm text-blue-600">{customer.businessInfo.businessName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <History className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">معلومات الاتصال</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{customer.contactInfo.phone}</span>
                      </div>
                      {customer.contactInfo.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{customer.contactInfo.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{customer.contactInfo.city}, {customer.contactInfo.region}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">الإحصائيات</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">إجمالي الطلبات:</span>
                        <span className="font-medium">{customer.totalOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">إجمالي المبيعات:</span>
                        <span className="font-medium text-green-600">{customer.totalSpent.toLocaleString()} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">متوسط الطلب:</span>
                        <span className="font-medium">{customer.averageOrderValue.toLocaleString()} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">نقاط الولاء:</span>
                        <span className="font-medium text-blue-600">{customer.loyaltyPoints}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">المعلومات المالية</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">حد الائتمان:</span>
                        <span className="font-medium">{customer.financialInfo.creditLimit.toLocaleString()} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الرصيد الحالي:</span>
                        <span className={`font-medium ${customer.financialInfo.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {customer.financialInfo.currentBalance.toLocaleString()} ريال
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">مبالغ مستحقة:</span>
                        <span className="font-medium text-orange-600">{customer.financialInfo.outstandingAmount.toLocaleString()} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">التقييم الائتماني:</span>
                        <span className={`font-medium ${getCreditScoreColor(customer.creditScore)}`}>
                          {customer.creditScore}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {customer.tags.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          <Tag className="h-3 w-3 inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {customer.notes && (
                  <div className="p-3 bg-blue-50 rounded-lg mb-3">
                    <p className="text-sm text-blue-900">
                      <FileText className="h-4 w-4 inline mr-1" />
                      <span className="font-medium">ملاحظات:</span> {customer.notes}
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    طلب جديد
                  </Button>
                  <Button size="sm" variant="outline">
                    <DollarSign className="h-4 w-4 mr-2" />
                    تسجيل دفعة
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    كشف حساب
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    اتصال
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




