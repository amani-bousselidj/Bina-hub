'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { CustomerSearchWidget, type Customer } from '@/components/admin/store/CustomerSearchWidget';
import { toast } from 'sonner';
import { 
  Building, 
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
  DollarSign,
  Package,
  TrendingUp,
  Star,
  Target,
  Activity,
  CreditCard,
  FileText,
  User,
  Hash,
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
  BarChart3,
  Truck,
  ShoppingCart,
  Receipt,
  Users,
  Globe,
  Factory,
  Scale,
  Info
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface VendorCategory {
  id: string;
  name: string;
  color: string;
  requirements: string[];
}

interface VendorPerformance {
  deliveryScore: number;
  qualityScore: number;
  serviceScore: number;
  overallRating: number;
  onTimeDeliveries: number;
  totalDeliveries: number;
  defectRate: number;
  responseTime: number; // hours
}

interface Vendor {
  id: string;
  vendorCode: string;
  name: string;
  arabicName?: string;
  category: VendorCategory;
  contactPerson: string;
  contactTitle: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  website?: string;
  address: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;
  taxNumber?: string;
  commercialRegister?: string;
  bankName?: string;
  bankAccount?: string;
  iban?: string;
  paymentTerms: number;
  creditLimit: number;
  currentBalance: number;
  status: 'active' | 'inactive' | 'blocked' | 'pending_approval';
  registrationDate: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  performance: VendorPerformance;
  certifications: string[];
  products: string[];
  notes?: string;
  tags: string[];
}

export default function EnhancedSuppliersPage() {
const supabase = createClientComponentClient();

  // Customer selection state
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [vendorCategories] = useState<VendorCategory[]>([
    {
      id: '1',
      name: 'مواد البناء',
      color: 'blue',
      requirements: ['شهادة الجودة', 'ترخيص المصنع', 'التأمين']
    },
    {
      id: '2',
      name: 'المعادن والحديد',
      color: 'gray',
      requirements: ['مواصفات سعودية', 'شهادة المنشأ', 'فحص الجودة']
    },
    {
      id: '3',
      name: 'الخدمات اللوجستية',
      color: 'green',
      requirements: ['رخصة النقل', 'التأمين على البضائع', 'تتبع الشحنات']
    },
    {
      id: '4',
      name: 'التكنولوجيا والمعدات',
      color: 'purple',
      requirements: ['الضمان', 'الدعم الفني', 'التدريب']
    }
  ]);

  const [vendors] = useState<Vendor[]>([
    {
      id: '1',
      vendorCode: 'VEN-001',
      name: 'شركة مواد البناء المتطورة',
      arabicName: 'شركة مواد البناء المتطورة',
      category: vendorCategories[0],
      contactPerson: 'أحمد محمد الشمري',
      contactTitle: 'مدير المبيعات',
      email: 'ahmed@advanced-building.com',
      phone: '+966501234567',
      alternativePhone: '+966112345678',
      website: 'www.advanced-building.com',
      address: 'المنطقة الصناعية الثالثة، شارع الصناعة',
      city: 'الرياض',
      region: 'منطقة الرياض',
      postalCode: '12345',
      country: 'المملكة العربية السعودية',
      taxNumber: '123456789',
      commercialRegister: 'CR-1234567890',
      bankName: 'البنك الأهلي السعودي',
      bankAccount: '123456789012',
      iban: 'SA1234567890123456789012',
      paymentTerms: 30,
      creditLimit: 500000,
      currentBalance: -25000,
      status: 'active',
      registrationDate: '2024-01-15',
      lastOrderDate: '2025-01-20',
      totalOrders: 45,
      totalSpent: 1250000,
      averageOrderValue: 27777.78,
      performance: {
        deliveryScore: 95,
        qualityScore: 92,
        serviceScore: 96,
        overallRating: 94.3,
        onTimeDeliveries: 43,
        totalDeliveries: 45,
        defectRate: 2.1,
        responseTime: 4
      },
      certifications: ['ISO 9001:2015', 'مواصفات سعودية SASO', 'شهادة الجودة البيئية'],
      products: ['أسمنت', 'خرسانة جاهزة', 'طوب', 'مونة', 'مواد عازلة'],
      notes: 'مورد ممتاز مع تاريخ أداء ممتاز وجودة عالية',
      tags: ['مورد رئيسي', 'جودة عالية', 'توصيل سريع', 'أسعار تنافسية']
    },
    {
      id: '2',
      vendorCode: 'VEN-002',
      name: 'مصنع الحديد والصلب الوطني',
      arabicName: 'مصنع الحديد والصلب الوطني',
      category: vendorCategories[1],
      contactPerson: 'سالم عبدالله العتيبي',
      contactTitle: 'مدير العمليات التجارية',
      email: 'salem@national-steel.com',
      phone: '+966512345678',
      alternativePhone: '+966133456789',
      website: 'www.national-steel.com',
      address: 'المدينة الصناعية الثانية، منطقة المعادن',
      city: 'الدمام',
      region: 'المنطقة الشرقية',
      postalCode: '23456',
      country: 'المملكة العربية السعودية',
      taxNumber: '987654321',
      commercialRegister: 'CR-9876543210',
      bankName: 'بنك الراجحي',
      bankAccount: '987654321098',
      iban: 'SA9876543210987654321098',
      paymentTerms: 45,
      creditLimit: 1000000,
      currentBalance: -45000,
      status: 'active',
      registrationDate: '2023-08-20',
      lastOrderDate: '2025-01-18',
      totalOrders: 32,
      totalSpent: 2100000,
      averageOrderValue: 65625,
      performance: {
        deliveryScore: 88,
        qualityScore: 95,
        serviceScore: 90,
        overallRating: 91,
        onTimeDeliveries: 28,
        totalDeliveries: 32,
        defectRate: 1.5,
        responseTime: 6
      },
      certifications: ['ASTM Standards', 'مواصفات سعودية للحديد', 'ISO 14001'],
      products: ['حديد تسليح', 'زوايا حديدية', 'أنابيب فولاذية', 'صفائح معدنية'],
      notes: 'مورد حديد موثوق مع معايير جودة عالية',
      tags: ['حديد عالي الجودة', 'أسعار مناسبة', 'مواصفات دولية']
    },
    {
      id: '3',
      vendorCode: 'VEN-003',
      name: 'شركة الخدمات اللوجستية السريعة',
      arabicName: 'شركة الخدمات اللوجستية السريعة',
      category: vendorCategories[2],
      contactPerson: 'فهد إبراهيم الدوسري',
      contactTitle: 'مدير العمليات',
      email: 'fahad@fast-logistics.com',
      phone: '+966559876543',
      alternativePhone: '+966114567890',
      website: 'www.fast-logistics.com',
      address: 'منطقة المستودعات، طريق الملك فهد',
      city: 'جدة',
      region: 'منطقة مكة المكرمة',
      postalCode: '34567',
      country: 'المملكة العربية السعودية',
      taxNumber: '456789123',
      commercialRegister: 'CR-4567891230',
      bankName: 'البنك السعودي للاستثمار',
      bankAccount: '456789123456',
      iban: 'SA4567891234567891234567',
      paymentTerms: 15,
      creditLimit: 200000,
      currentBalance: -8000,
      status: 'active',
      registrationDate: '2024-03-10',
      lastOrderDate: '2025-01-22',
      totalOrders: 78,
      totalSpent: 450000,
      averageOrderValue: 5769.23,
      performance: {
        deliveryScore: 96,
        qualityScore: 89,
        serviceScore: 94,
        overallRating: 93,
        onTimeDeliveries: 75,
        totalDeliveries: 78,
        defectRate: 0.8,
        responseTime: 2
      },
      certifications: ['رخصة النقل العام', 'شهادة السلامة', 'ISO 28000'],
      products: ['نقل البضائع', 'التخزين', 'الخدمات اللوجستية', 'التوزيع'],
      notes: 'شركة لوجستية سريعة ومتخصصة في النقل الآمن',
      tags: ['توصيل سريع', 'خدمة ممتازة', 'أسعار تنافسية', 'تتبع مباشر']
    }
  ]);

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [performanceFilter, setPerformanceFilter] = useState<string>('all');

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = searchTerm === '' || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || vendor.category.id === categoryFilter;
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    
    let matchesPerformance = true;
    if (performanceFilter === 'excellent') matchesPerformance = vendor.performance.overallRating >= 90;
    else if (performanceFilter === 'good') matchesPerformance = vendor.performance.overallRating >= 80 && vendor.performance.overallRating < 90;
    else if (performanceFilter === 'average') matchesPerformance = vendor.performance.overallRating >= 70 && vendor.performance.overallRating < 80;
    else if (performanceFilter === 'poor') matchesPerformance = vendor.performance.overallRating < 70;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPerformance;
  });

  const getCategoryColor = (category: VendorCategory) => {
    switch (category.color) {
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'gray': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'blocked': return 'محظور';
      case 'pending_approval': return 'في انتظار الموافقة';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <Clock className="h-4 w-4" />;
      case 'blocked': return <AlertCircle className="h-4 w-4" />;
      case 'pending_approval': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 90) return 'ممتاز';
    if (score >= 80) return 'جيد جداً';
    if (score >= 70) return 'جيد';
    return 'ضعيف';
  };

  // Calculate statistics
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const excellentPerformance = vendors.filter(v => v.performance.overallRating >= 90).length;
  const totalSpent = vendors.reduce((sum, v) => sum + v.totalSpent, 0);
  const averagePerformance = vendors.reduce((sum, v) => sum + v.performance.overallRating, 0) / vendors.length;
  const totalOrders = vendors.reduce((sum, v) => sum + v.totalOrders, 0);

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Enhanced Header with Gradient Background */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة الموردين المتقدمة</h1>
            <p className="text-purple-100">نظام إدارة موردين شامل مع تقييم الأداء ومتابعة الجودة والعملاء</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              تصدير قائمة الموردين
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Upload className="h-4 w-4 mr-2" />
              استيراد موردين
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              مورد جديد
            </Button>
          </div>
        </div>
        
        {/* Statistics Cards in Header */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-purple-200" />
              <div>
                <p className="text-purple-100 text-sm">إجمالي الموردين</p>
                <p className="text-2xl font-bold">{totalVendors}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-200" />
              <div>
                <p className="text-purple-100 text-sm">موردين نشطين</p>
                <p className="text-2xl font-bold">{activeVendors}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-200" />
              <div>
                <p className="text-purple-100 text-sm">متوسط التقييم</p>
                <p className="text-2xl font-bold">{averagePerformance.toFixed(1)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-200" />
              <div>
                <p className="text-purple-100 text-sm">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Search Section */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <User className="h-5 w-5" />
            البحث عن العملاء لربطهم بالموردين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerSearchWidget
            onCustomerSelect={(customer: Customer) => {
              setSelectedCustomer(customer);
              toast.success(`تم اختيار العميل: ${customer.name}`);
            }}
            placeholder="البحث عن عميل أو مشروع لربطه بالموردين..."
          />
          
          {selectedCustomer && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-orange-600" />
                <span className="font-semibold text-orange-800">العميل المحدد للموردين</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">الاسم:</span>
                  <span className="font-medium mr-2">{selectedCustomer.name}</span>
                </div>
                {selectedCustomer.phone && (
                  <div>
                    <span className="text-gray-600">الهاتف:</span>
                    <span className="font-medium mr-2">{selectedCustomer.phone}</span>
                  </div>
                )}
                {selectedCustomer.email && (
                  <div>
                    <span className="text-gray-600">البريد:</span>
                    <span className="font-medium mr-2">{selectedCustomer.email}</span>
                  </div>
                )}
                {selectedCustomer.address && (
                  <div className="col-span-2">
                    <span className="text-gray-600">عنوان التوريد:</span>
                    <span className="font-medium mr-2">{selectedCustomer.address}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Building className="h-4 w-4 mr-1" />
                  عرض موردين العميل
                </Button>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  ربط مورد جديد
                </Button>
                <Button size="sm" variant="outline">
                  <Package className="h-4 w-4 mr-1" />
                  طلبيات العميل
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الموردين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{totalVendors}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">مورد مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">موردين نشطين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{activeVendors}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">مورد نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">أداء ممتاز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{excellentPerformance}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">مورد متميز</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي المشتريات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{(totalSpent / 1000000).toFixed(1)}م</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">مليون ريال</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">متوسط الأداء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{averagePerformance.toFixed(1)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">من 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{totalOrders}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">طلب شراء</p>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>فئات الموردين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {vendorCategories.map((category) => {
              const categoryVendors = vendors.filter(v => v.category.id === category.id);
              const categorySpent = categoryVendors.reduce((sum, v) => sum + v.totalSpent, 0);
              const avgPerformance = categoryVendors.length > 0 
                ? categoryVendors.reduce((sum, v) => sum + v.performance.overallRating, 0) / categoryVendors.length 
                : 0;
              
              return (
                <div key={category.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-medium px-2 py-1 rounded border ${getCategoryColor(category)}`}>
                      {category.name}
                    </h3>
                    <span className="text-lg font-bold">{categoryVendors.length}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>إجمالي المشتريات:</span>
                      <span className="font-medium">{(categorySpent / 1000).toFixed(0)}K ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span>متوسط الأداء:</span>
                      <span className={`font-medium ${getPerformanceColor(avgPerformance)}`}>
                        {avgPerformance.toFixed(1)}/100
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      المتطلبات: {category.requirements.join(', ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Vendors List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">قائمة الموردين</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الموردين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الفئات</option>
                {vendorCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="blocked">محظور</option>
                <option value="pending_approval">في انتظار الموافقة</option>
              </select>

              <select
                value={performanceFilter}
                onChange={(e) => setPerformanceFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع مستويات الأداء</option>
                <option value="excellent">ممتاز (90+)</option>
                <option value="good">جيد جداً (80-89)</option>
                <option value="average">جيد (70-79)</option>
                <option value="poor">ضعيف (أقل من 70)</option>
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
            {filteredVendors.map((vendor) => (
              <div 
                key={vendor.id} 
                className={`p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer ${
                  selectedVendor?.id === vendor.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedVendor(vendor)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{vendor.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(vendor.category)}`}>
                          {vendor.category.name}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(vendor.status)}`}>
                          {getStatusIcon(vendor.status)}
                          {getStatusText(vendor.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{vendor.vendorCode}</p>
                      <p className="text-sm text-blue-600">{vendor.contactPerson} - {vendor.contactTitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getPerformanceColor(vendor.performance.overallRating)}`}>
                        {vendor.performance.overallRating.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">الأداء العام</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">معلومات الاتصال</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{vendor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{vendor.city}, {vendor.region}</span>
                      </div>
                      {vendor.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span>{vendor.website}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">الإحصائيات</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">إجمالي الطلبات:</span>
                        <span className="font-medium">{vendor.totalOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">إجمالي المبيعات:</span>
                        <span className="font-medium text-green-600">{(vendor.totalSpent / 1000).toFixed(0)}K ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">متوسط الطلب:</span>
                        <span className="font-medium">{(vendor.averageOrderValue / 1000).toFixed(0)}K ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">التسليم في الوقت:</span>
                        <span className="font-medium text-blue-600">
                          {((vendor.performance.onTimeDeliveries / vendor.performance.totalDeliveries) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">الأداء والجودة</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">جودة التسليم:</span>
                        <span className={`font-medium ${getPerformanceColor(vendor.performance.deliveryScore)}`}>
                          {vendor.performance.deliveryScore}/100
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">جودة المنتج:</span>
                        <span className={`font-medium ${getPerformanceColor(vendor.performance.qualityScore)}`}>
                          {vendor.performance.qualityScore}/100
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">خدمة العملاء:</span>
                        <span className={`font-medium ${getPerformanceColor(vendor.performance.serviceScore)}`}>
                          {vendor.performance.serviceScore}/100
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">معدل العيوب:</span>
                        <span className="font-medium text-orange-600">{vendor.performance.defectRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">المعلومات المالية</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">حد الائتمان:</span>
                        <span className="font-medium">{(vendor.creditLimit / 1000).toFixed(0)}K ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الرصيد الحالي:</span>
                        <span className={`font-medium ${vendor.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {vendor.currentBalance.toLocaleString()} ريال
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">شروط الدفع:</span>
                        <span className="font-medium">{vendor.paymentTerms} يوم</span>
                      </div>
                      {vendor.lastOrderDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">آخر طلب:</span>
                          <span className="font-medium">
                            {new Date(vendor.lastOrderDate).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Products */}
                {vendor.products.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      المنتجات والخدمات
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {vendor.products.slice(0, 5).map((product, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {product}
                        </span>
                      ))}
                      {vendor.products.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{vendor.products.length - 5} المزيد
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {vendor.certifications.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      الشهادات والاعتمادات
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {vendor.certifications.map((cert, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {vendor.tags.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {vendor.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {vendor.notes && (
                  <div className="p-3 bg-blue-50 rounded-lg mb-3">
                    <p className="text-sm text-blue-900">
                      <FileText className="h-4 w-4 inline mr-1" />
                      <span className="font-medium">ملاحظات:</span> {vendor.notes}
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    طلب شراء جديد
                  </Button>
                  <Button size="sm" variant="outline">
                    <Receipt className="h-4 w-4 mr-2" />
                    عرض الطلبات
                  </Button>
                  <Button size="sm" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    تقرير الأداء
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

      {/* Selected Vendor Details Panel */}
      {selectedVendor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              تفاصيل المورد: {selectedVendor.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Factory className="h-4 w-4" />
                  المعلومات التجارية
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الاسم التجاري:</span>
                    <span className="font-medium">{selectedVendor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم المورد:</span>
                    <span className="font-medium">{selectedVendor.vendorCode}</span>
                  </div>
                  {selectedVendor.taxNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">الرقم الضريبي:</span>
                      <span className="font-medium">{selectedVendor.taxNumber}</span>
                    </div>
                  )}
                  {selectedVendor.commercialRegister && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">السجل التجاري:</span>
                      <span className="font-medium">{selectedVendor.commercialRegister}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ التسجيل:</span>
                    <span className="font-medium">
                      {new Date(selectedVendor.registrationDate).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>

                {/* Banking Information */}
                <h3 className="font-medium text-gray-900 flex items-center gap-2 mt-6">
                  <CreditCard className="h-4 w-4" />
                  المعلومات المصرفية
                </h3>
                <div className="space-y-2 text-sm">
                  {selectedVendor.bankName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">البنك:</span>
                      <span className="font-medium">{selectedVendor.bankName}</span>
                    </div>
                  )}
                  {selectedVendor.bankAccount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">رقم الحساب:</span>
                      <span className="font-medium">{selectedVendor.bankAccount}</span>
                    </div>
                  )}
                  {selectedVendor.iban && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">IBAN:</span>
                      <span className="font-medium">{selectedVendor.iban}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Analytics */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  تحليل الأداء
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">التسليم في الوقت</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${selectedVendor.performance.deliveryScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{selectedVendor.performance.deliveryScore}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">جودة المنتج</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${selectedVendor.performance.qualityScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{selectedVendor.performance.qualityScore}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">خدمة العملاء</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${selectedVendor.performance.serviceScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{selectedVendor.performance.serviceScore}%</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">التقييم العام</span>
                      <span className={`text-lg font-bold ${getPerformanceColor(selectedVendor.performance.overallRating)}`}>
                        {selectedVendor.performance.overallRating.toFixed(1)}/100
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={`text-sm font-medium ${getPerformanceColor(selectedVendor.performance.overallRating)}`}>
                        {getPerformanceLabel(selectedVendor.performance.overallRating)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">{selectedVendor.performance.responseTime}ساعة</div>
                    <div className="text-xs text-blue-600">وقت الاستجابة</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-red-600">{selectedVendor.performance.defectRate}%</div>
                    <div className="text-xs text-red-600">معدل العيوب</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}




