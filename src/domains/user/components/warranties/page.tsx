"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Shield, Calendar, FileText, Search, Plus, Filter, ExternalLink, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatDateSafe, useIsClient, generateSafeId } from '@/core/shared/utils/hydration-safe';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';

export const dynamic = 'force-dynamic'

interface Warranty {
  id: string;
  productName: string;
  store: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'claimed';
  claimId?: string;
  warrantyType: string;
  value: number;
}

export default function WarrantiesPage() {
  const router = useRouter();
  const [warranties, setWarranties] = useState<Warranty[]>([
    {
      id: 'W001',
      productName: 'مضخة المياه عالية الكفاءة',
      store: 'متجر الأدوات الصحية المتقدمة',
      purchaseDate: '2024-01-15',
      expiryDate: '2026-01-15',
      status: 'active',
      warrantyType: 'ضمان الشركة المصنعة',
      value: 850
    },
    {
      id: 'W002',
      productName: 'مكيف هواء 24000 وحدة',
      store: 'معرض التكييف المركزي',
      purchaseDate: '2024-03-10',
      expiryDate: '2027-03-10',
      status: 'active',
      warrantyType: 'ضمان شامل',
      value: 2400
    },
    {
      id: 'W003',
      productName: 'أدوات كهربائية متنوعة',
      store: 'متجر العدد والأدوات',
      purchaseDate: '2023-06-20',
      expiryDate: '2024-06-20',
      status: 'expired',
      warrantyType: 'ضمان محدود',
      value: 320
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const filteredWarranties = warranties.filter(warranty => {
    const matchesSearch = warranty.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warranty.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || warranty.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'expired': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'claimed': return <Clock className="w-5 h-5 text-orange-600" />;
      default: return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'نشط';
      case 'expired': return 'منتهي الصلاحية';
      case 'claimed': return 'تم المطالبة';
      default: return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'claimed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClaimWarranty = (warrantyId: string) => {
    const warranty = warranties.find(w => w.id === warrantyId);
    if (!warranty) return;

    // Check if warranty already has a claim
    if (warranty.claimId) {
      // Redirect to tracking page if claim already exists
      router.push(`/user/warranties/tracking?highlight=${warranty.claimId}`);
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `هل أنت متأكد من رغبتك في المطالبة بضمان "${warranty.productName}"؟\n\nسيتم إرسال إشعار إلى "${warranty.store}" لبدء عملية المطالبة.`
    );
    
    if (confirmed) {
      // Create new claim and redirect directly to claim form
      const claimId = generateSafeId('CLAIM');
      
      // Update warranty status
      setWarranties(prev => prev.map(w => 
        w.id === warrantyId 
          ? { ...w, status: 'claimed' as const, claimId }
          : w
      ));

      // Go directly to claim form
      router.push(`/user/warranties/${warrantyId}/claim?claimId=${claimId}`);
      
      // Send notification to store
      console.log(`Warranty claim sent to store: ${warranty.store} for warranty: ${warrantyId}`);
    }
  };

  const handleViewDetails = (warrantyId: string) => {
    // Navigate to warranty details page
    window.location.href = `/user/warranties/${warrantyId}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          إدارة الضمانات
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          تتبع وإدارة جميع ضماناتك والمطالبة بها عند الحاجة
        </Typography>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                {warranties.filter(w => w.status === 'active').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">ضمانات نشطة</Typography>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-red-600">
                {warranties.filter(w => w.status === 'expired').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">ضمانات منتهية</Typography>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-orange-600">
                {warranties.filter(w => w.status === 'claimed').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">تم المطالبة</Typography>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                {warranties.length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">إجمالي الضمانات</Typography>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-purple-600">
                {warranties.reduce((sum, w) => sum + w.value, 0).toLocaleString('en-US')}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">القيمة الإجمالية (ر.س)</Typography>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </EnhancedCard>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في الضمانات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">جميع الضمانات</option>
          <option value="active">نشطة</option>
          <option value="expired">منتهية</option>
          <option value="claimed">تم المطالبة</option>
        </select>

        <Link href="/user/warranties/tracking">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2" onClick={() => alert('Button clicked')}>
            <Shield className="w-5 h-5" />
            تتبع المطالبات
          </Button>
        </Link>

        <Link href="/user/warranties/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2" onClick={() => alert('Button clicked')}>
            <Plus className="w-5 h-5" />
            إضافة ضمان جديد
          </Button>
        </Link>
      </div>

      {/* Warranties List */}
      <div className="grid gap-6">
        {filteredWarranties.map((warranty) => (
          <EnhancedCard key={warranty.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(warranty.status)}
                  <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900">
                    {warranty.productName}
                  </Typography>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(warranty.status)}`}>
                    {getStatusText(warranty.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">المتجر</Typography>
                    <Typography variant="body" size="lg" weight="medium">{warranty.store}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ الشراء</Typography>
                    <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateSafe(warranty.purchaseDate, { format: 'medium' })}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ انتهاء الضمان</Typography>
                    <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateSafe(warranty.expiryDate, { format: 'medium' })}
                    </Typography>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">نوع الضمان</Typography>
                    <Typography variant="body" size="lg" weight="medium">{warranty.warrantyType}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">القيمة</Typography>
                    <Typography variant="body" size="lg" weight="medium">{warranty.value.toLocaleString('en-US')} ر.س</Typography>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {warranty.status === 'active' && (
                  <Button
                    onClick={() => handleClaimWarranty(warranty.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    المطالبة بالضمان
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => handleViewDetails(warranty.id)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  عرض التفاصيل
                </Button>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {filteredWarranties.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
            لا توجد ضمانات
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-500">
            {searchTerm || statusFilter !== 'all' ? 'لم يتم العثور على ضمانات تطابق البحث' : 'لم تقم بإضافة أي ضمانات بعد'}
          </Typography>
        </div>
      )}

      {/* AI Features Integration */}
      <EnhancedCard className="p-6 mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <Typography variant="subheading" size="xl" weight="semibold" className="mb-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.53-1.453l-.548-.547z" />
          </svg>
          أدوات ذكية لإدارة الضمانات
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/user/warranties/ai-extract">
            <div className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <Typography variant="subheading" size="lg" weight="semibold" className="text-green-800">
                  استخراج بيانات الضمان
                </Typography>
              </div>
              <Typography variant="body" size="sm" className="text-green-600">
                استخدم الذكاء الاصطناعي لاستخراج بيانات الضمان من الفواتير والإيصالات
              </Typography>
            </div>
          </Link>
          
          <Link href="/user/warranty-expense-tracking">
            <div className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <Typography variant="subheading" size="lg" weight="semibold" className="text-blue-800">
                  تتبع ذكي للمصروفات
                </Typography>
              </div>
              <Typography variant="body" size="sm" className="text-blue-600">
                ربط الضمانات بالمصروفات للحصول على رؤى مالية شاملة
              </Typography>
            </div>
          </Link>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link href="/user/ai-hub" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            استكشف جميع الأدوات الذكية في مركز الذكاء الاصطناعي
          </Link>
        </div>
      </EnhancedCard>
    </div>
  );
}

