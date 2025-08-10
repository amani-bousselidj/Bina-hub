"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Shield, Calendar, Package, AlertCircle, CheckCircle, Clock, Eye, MessageSquare, ArrowRight } from 'lucide-react';
import { formatDateSafe } from '@/core/shared/utils/hydration-safe';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic'

interface WarrantyClaim {
  id: string;
  warrantyId: string;
  productName: string;
  store: string;
  claimDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  issueType: string;
  quantityAffected: number;
  totalQuantity: number;
  quantityUsed: number; // How many items have been claimed previously
  quantityRemaining: number; // How many items still have warranty
  resolution: string;
  storeResponse?: string;
  estimatedCompletion?: string;
  trackingNumber?: string;
}

export default function WarrantyTrackingPage() {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightClaim = searchParams?.get('highlight');
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [warranties, setWarranties] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
    if (user?.id) {
      fetchClaims(user.id);
    }
  }, [user]);

  const fetchClaims = async (userId: string) => {
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('warranty_claims')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setClaims(data || []);
    } catch (error) {
      console.error('Error fetching warranty claims:', error);
      setClaims([]);
    }
  };

  const fetchWarranties = async (userId: string) => {
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setWarranties(data || []);
    } catch (error) {
      console.error('Error fetching warranties:', error);
      setWarranties([]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'in_progress': return <Package className="w-5 h-5 text-blue-600" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'approved': return 'مقبولة';
      case 'rejected': return 'مرفوضة';
      case 'in_progress': return 'قيد المعالجة';
      case 'completed': return 'مكتملة';
      default: return 'غير محدد';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIssueTypeText = (issueType: string) => {
    switch (issueType) {
      case 'manufacturing_defect': return 'عيب تصنيع';
      case 'not_working': return 'لا يعمل';
      case 'partial_damage': return 'تلف جزئي';
      case 'complete_failure': return 'تعطل كامل';
      case 'performance_issue': return 'مشكلة في الأداء';
      case 'physical_damage': return 'تلف مادي';
      default: return 'أخرى';
    }
  };

  const getResolutionText = (resolution: string) => {
    switch (resolution) {
      case 'replacement': return 'استبدال';
      case 'repair': return 'إصلاح';
      case 'refund': return 'استرداد';
      case 'store_credit': return 'رصيد متجر';
      default: return 'غير محدد';
    }
  };

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
      <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
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
          onClick={() => router.push('/user/warranties')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowRight className="w-5 h-5" />
          العودة للضمانات
        </button>
        
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          تتبع مطالبات الضمان
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          تابع حالة جميع مطالبات الضمان وعدد القطع المستخدمة والمتبقية
        </Typography>
      </div>

      {/* Highlight Notification */}
      {highlightClaim && (
        <EnhancedCard className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-blue-600" />
            <div>
              <Typography variant="subheading" size="md" weight="semibold" className="text-blue-900">
                تم إنشاء المطالبة بنجاح!
              </Typography>
              <Typography variant="caption" size="sm" className="text-blue-700">
                يمكنك متابعة مطالبتك أدناه - رقم المطالبة: {highlightClaim}
              </Typography>
            </div>
          </div>
        </EnhancedCard>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                {claims.length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">إجمالي المطالبات</Typography>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-yellow-600">
                {claims.filter(c => c.status === 'pending' || c.status === 'in_progress').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">قيد المعالجة</Typography>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                {claims.filter(c => c.status === 'completed').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">مكتملة</Typography>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-orange-600">
                {claims.reduce((sum, c) => sum + c.quantityRemaining, 0)}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">قطع متبقية للضمان</Typography>
            </div>
            <Package className="w-8 h-8 text-orange-600" />
          </div>
        </EnhancedCard>
      </div>

      {/* Claims List */}
      <div className="grid gap-6">
        {claims.map((claim) => {
          const isHighlighted = highlightClaim && (claim.id === highlightClaim || claim.trackingNumber === highlightClaim);
          return (
            <EnhancedCard 
              key={claim.id} 
              className={`p-6 hover:shadow-lg transition-shadow ${
                isHighlighted ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
            >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(claim.status)}
                  <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900">
                    {claim.productName}
                  </Typography>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                    {getStatusText(claim.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">رقم المطالبة</Typography>
                    <Typography variant="body" size="lg" weight="medium">{claim.id}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">المتجر</Typography>
                    <Typography variant="body" size="lg" weight="medium">{claim.store}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">نوع المشكلة</Typography>
                    <Typography variant="body" size="lg" weight="medium">{getIssueTypeText(claim.issueType)}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">الحل المطلوب</Typography>
                    <Typography variant="body" size="lg" weight="medium">{getResolutionText(claim.resolution)}</Typography>
                  </div>
                </div>

                {/* Quantity Tracking */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900 mb-3">
                    تتبع الكميات
                  </Typography>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                        {claim.totalQuantity}
                      </Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">إجمالي القطع</Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="subheading" size="2xl" weight="bold" className="text-orange-600">
                        {claim.quantityAffected}
                      </Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">المطالبة الحالية</Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="subheading" size="2xl" weight="bold" className="text-red-600">
                        {claim.quantityUsed}
                      </Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">مستخدمة سابقاً</Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                        {claim.quantityRemaining}
                      </Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">متبقية للضمان</Typography>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>استخدام الضمان</span>
                    <span>{claim.quantityUsed} من {claim.totalQuantity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(claim.quantityUsed / claim.totalQuantity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ المطالبة</Typography>
                    <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateSafe(claim.claimDate, { format: 'medium' })}
                    </Typography>
                  </div>
                  
                  {claim.trackingNumber && (
                    <div>
                      <Typography variant="caption" size="sm" className="text-gray-600 mb-1">رقم التتبع</Typography>
                      <Typography variant="body" size="lg" weight="medium">{claim.trackingNumber}</Typography>
                    </div>
                  )}
                </div>

                {claim.storeResponse && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Typography variant="caption" size="sm" className="text-blue-600 mb-1">رد المتجر</Typography>
                    <Typography variant="body" size="lg" className="text-blue-800">{claim.storeResponse}</Typography>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 lg:w-48">
                <Button
                  onClick={() => setSelectedClaim(claim)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  عرض التفاصيل
                </Button>
                
                {(claim.status === 'pending' || claim.status === 'in_progress') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Navigate to chat page with store information
                      const chatParams = new URLSearchParams({
                        store: claim.store,
                        claimId: claim.id,
                        product: claim.productName,
                        subject: `مطالبة ضمان - ${claim.productName}`
                      });
                      router.push(`/user/chat?${chatParams.toString()}`);
                    }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    التواصل مع المتجر
                  </Button>
                )}
              </div>
            </div>
          </EnhancedCard>
          );
        })}
      </div>

      {claims.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
            لا توجد مطالبات ضمان
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-500">
            لم تقم بتقديم أي مطالبات ضمان بعد
          </Typography>
        </div>
      )}

      {/* Claim Details Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <EnhancedCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="heading" size="2xl" weight="bold" className="text-gray-900">
                  تفاصيل المطالبة
                </Typography>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600">رقم المطالبة</Typography>
                    <Typography variant="body" size="lg" weight="medium">{selectedClaim.id}</Typography>
                  </div>
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600">الحالة</Typography>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClaim.status)}`}>
                      {getStatusText(selectedClaim.status)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Typography variant="caption" size="sm" className="text-gray-600">المنتج</Typography>
                  <Typography variant="body" size="lg" weight="medium">{selectedClaim.productName}</Typography>
                </div>
                
                <div>
                  <Typography variant="caption" size="sm" className="text-gray-600">المتجر</Typography>
                  <Typography variant="body" size="lg" weight="medium">{selectedClaim.store}</Typography>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900 mb-3">
                    ملخص الكميات
                  </Typography>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Typography variant="caption" size="sm" className="text-gray-600">إجمالي القطع المشتراة</Typography>
                      <Typography variant="subheading" size="xl" weight="bold" className="text-blue-600">
                        {selectedClaim.totalQuantity}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" size="sm" className="text-gray-600">القطع في هذه المطالبة</Typography>
                      <Typography variant="subheading" size="xl" weight="bold" className="text-orange-600">
                        {selectedClaim.quantityAffected}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" size="sm" className="text-gray-600">مجموع القطع المستخدمة</Typography>
                      <Typography variant="subheading" size="xl" weight="bold" className="text-red-600">
                        {selectedClaim.quantityUsed}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" size="sm" className="text-gray-600">القطع المتبقية للضمان</Typography>
                      <Typography variant="subheading" size="xl" weight="bold" className="text-green-600">
                        {selectedClaim.quantityRemaining}
                      </Typography>
                    </div>
                  </div>
                </div>

                {selectedClaim.estimatedCompletion && (
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600">التاريخ المتوقع للإنجاز</Typography>
                    <Typography variant="body" size="lg" weight="medium">
                      {formatDateSafe(selectedClaim.estimatedCompletion, { format: 'medium' })}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </EnhancedCard>
        </div>
      )}
    </div>
  );
}



