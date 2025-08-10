"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Shield, Calendar, FileText, ArrowRight, Package, DollarSign, AlertCircle, CheckCircle, Clock, Phone, Mail, MapPin } from 'lucide-react';
import { formatDateSafe, useIsClient } from '@/core/shared/utils/hydration-safe';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { useUserData } from '@/core/shared/contexts/UserDataContext';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic'

interface ClaimHistoryEntry {
  action: string;
  date: string;
  description?: string;
  status?: string;
  notes?: string;
}

interface StoreContact {
  phone: string;
  email: string;
  address?: string;
}

interface Warranty {
  id: string;
  productName: string;
  store: string;
  storeContact: StoreContact;
  claimId?: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'claimed';
  receiptNumber: string;
  purchaseDate: string;
  warrantyType: string;
  value: number;
  description?: string;
  product: {
    name: string;
    brand: string;
    model: string;
    serialNumber: string;
  };
  claimHistory: ClaimHistoryEntry[];
}

export default function WarrantyDetailPage({ params }: { params: { id: string } }) {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const warrantyId = params?.id as string;
  const isClient = useIsClient();

  const [warranty, setWarranty] = useState<Warranty | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchWarranty(params.id);
    }
  }, [params?.id]);

  const fetchWarranty = async (warrantyId: string) => {
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('id', warrantyId)
        .single();
      if (error) throw error;
      setWarranty(data);
    } catch (error) {
      console.error('Error fetching warranty:', error);
      setWarranty(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'expired': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'claimed': return <Clock className="w-5 h-5 text-yellow-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'expired': return 'منتهي';
      case 'claimed': return 'تم المطالبة';
      default: return 'غير محدد';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'claimed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClaimWarranty = () => {
    if (!warranty) return;
    
    if (warranty.claimId) {
      // Redirect to tracking page if claim already exists
      router.push(`/user/warranties/tracking?highlight=${warranty.claimId}`);
      return;
    }

    // Show confirmation dialog for new claim
    const confirmed = window.confirm(
      `هل أنت متأكد من رغبتك في المطالبة بضمان "${warranty.productName}"؟\n\nسيتم إرسال إشعار إلى "${warranty.store}" لبدء عملية المطالبة.`
    );
    
    if (confirmed) {
      // Show options: go to claim form or tracking
      const choice = window.confirm(
        'اختر العملية التالية:\n\n- موافق: ملء نموذج تفاصيل المطالبة\n- إلغاء: الانتقال لصفحة التتبع مباشرة'
      );

      if (choice) {
        // Go to claim form
        router.push(`/user/warranties/${warrantyId}/claim`);
      } else {
        // Go to tracking page
        router.push(`/user/warranties/tracking`);
      }
    }
  };

  const handleCancelClaim = () => {
    if (!warranty) return;
    
    if (!warranty.claimId) {
      alert('لا توجد مطالبة نشطة لإلغائها');
      return;
    }

    const confirmed = window.confirm(
      `هل أنت متأكد من رغبتك في إلغاء مطالبة الضمان؟\n\nرقم المطالبة: ${warranty.claimId}\n\nسيتم إشعار المتجر بالإلغاء.`
    );

    if (confirmed) {
      // In real app, this would call an API to cancel the claim
      alert(`تم إلغاء مطالبة الضمان بنجاح\nرقم المطالبة: ${warranty.claimId}`);
      router.push('/user/warranties');
    }
  };

  const handleContactStore = () => {
    if (!warranty) return;
    
    // Navigate to chat page with store information
    const storeData = {
      storeName: warranty.store,
      storeContact: warranty.storeContact,
      warrantyId: warranty.id,
      productName: warranty.productName
    };
    
    // Pass store data as URL parameters for the chat page
    const chatParams = new URLSearchParams({
      store: warranty.store,
      storePhone: warranty.storeContact.phone,
      storeEmail: warranty.storeContact.email,
      warrantyId: warranty.id,
      product: warranty.productName
    });
    
    router.push(`/user/chat?${chatParams.toString()}`);
  };

  const isExpired = warranty ? new Date(warranty.expiryDate) < new Date() : false;
  const daysUntilExpiry = warranty ? Math.ceil((new Date(warranty.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  if (!isClient) {
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

  // No warranty data
  if (!warranty) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl" dir="rtl">
        <div className="text-center p-12">
          <p className="text-gray-600 mb-4">لم يتم العثور على بيانات الضمان</p>
          <button 
            onClick={() => router.push('/user/warranties')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            العودة للضمانات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowRight className="w-5 h-5" />
          العودة للضمانات
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              تفاصيل الضمان
            </Typography>
            <Typography variant="body" size="lg" className="text-gray-600">
              معلومات مفصلة عن ضمان المنتج
            </Typography>
          </div>
          
          <div className="flex items-center gap-3">
            {getStatusIcon(warranty.status)}
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(warranty.status)}`}>
              {getStatusText(warranty.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information */}
          <EnhancedCard className="p-6">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              معلومات المنتج
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-1">اسم المنتج</Typography>
                <Typography variant="body" size="lg" weight="medium">{warranty.productName}</Typography>
              </div>
              
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-1">رقم الفاتورة</Typography>
                <Typography variant="body" size="lg" weight="medium">{warranty.receiptNumber}</Typography>
              </div>
              
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ الشراء</Typography>
                <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDateSafe(warranty.purchaseDate, { format: 'long' })}
                </Typography>
              </div>
              
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ انتهاء الضمان</Typography>
                <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDateSafe(warranty.expiryDate, { format: 'long' })}
                </Typography>
              </div>
              
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-1">نوع الضمان</Typography>
                <Typography variant="body" size="lg" weight="medium">{warranty.warrantyType}</Typography>
              </div>
              
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-1">قيمة المنتج</Typography>
                <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {warranty.value.toLocaleString('en-US')} ر.س
                </Typography>
              </div>
            </div>
            
            {warranty.description && (
              <div className="mt-6">
                <Typography variant="caption" size="sm" className="text-gray-600 mb-2">وصف المنتج</Typography>
                <Typography variant="body" size="md" className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                  {warranty.description}
                </Typography>
              </div>
            )}
          </EnhancedCard>

          {/* Claim History */}
          <EnhancedCard className="p-6">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              تاريخ المطالبات
            </Typography>
            
            <div className="space-y-4">
              {warranty.claimHistory.map((entry, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Typography variant="body" size="md" weight="medium">{entry.action}</Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">
                        {formatDateSafe(entry.date, { format: 'medium' })}
                      </Typography>
                    </div>
                    <Typography variant="caption" size="sm" className="text-green-600">
                      {entry.status}
                    </Typography>
                    {entry.notes && (
                      <Typography variant="caption" size="sm" className="text-gray-600 mt-1">
                        {entry.notes}
                      </Typography>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Alert */}
          {warranty.status === 'active' && !isExpired && (
            <EnhancedCard className="p-6 bg-green-50 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <Typography variant="subheading" size="lg" weight="semibold" className="text-green-900">
                  الضمان نشط
                </Typography>
              </div>
              <Typography variant="body" size="sm" className="text-green-800">
                {daysUntilExpiry > 0 
                  ? `ينتهي الضمان خلال ${daysUntilExpiry} يوم`
                  : 'الضمان نشط'
                }
              </Typography>
            </EnhancedCard>
          )}

          {warranty.status === 'active' && daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
            <EnhancedCard className="p-6 bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <Typography variant="subheading" size="lg" weight="semibold" className="text-yellow-900">
                  تنبيه انتهاء الضمان
                </Typography>
              </div>
              <Typography variant="body" size="sm" className="text-yellow-800">
                سينتهي الضمان خلال {daysUntilExpiry} يوم
              </Typography>
            </EnhancedCard>
          )}

          {/* Store Contact */}
          <EnhancedCard className="p-6">
            <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900 mb-4">
              معلومات المتجر
            </Typography>
            
            <div className="space-y-4">
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-1">اسم المتجر</Typography>
                <Typography variant="body" size="md" weight="medium">{warranty.store}</Typography>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <Typography variant="body" size="sm" className="text-gray-700">
                    {warranty.storeContact.phone}
                  </Typography>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <Typography variant="body" size="sm" className="text-gray-700">
                    {warranty.storeContact.email}
                  </Typography>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <Typography variant="body" size="sm" className="text-gray-700">
                    {warranty.storeContact.address}
                  </Typography>
                </div>
              </div>
            </div>
          </EnhancedCard>

          {/* Actions */}
          <EnhancedCard className="p-6">
            <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900 mb-4">
              الإجراءات
            </Typography>
            
            <div className="space-y-3">
              {warranty.status === 'active' && !isExpired && (
                <Button
                  onClick={handleClaimWarranty}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
                >
                  المطالبة بالضمان
                </Button>
              )}
              
              {warranty.claimId && (
                <Button
                  onClick={handleCancelClaim}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
                >
                  إلغاء المطالبة
                </Button>
              )}
              
              <Button
                onClick={handleContactStore}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                التواصل مع المتجر
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg"
              >
                طباعة التفاصيل
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/user/warranties')}
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 py-3 rounded-lg"
              >
                عرض جميع الضمانات
              </Button>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </div>
  );
}
