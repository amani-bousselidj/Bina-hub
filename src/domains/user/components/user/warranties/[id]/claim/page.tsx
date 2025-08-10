"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Shield, Calendar, ArrowRight, Package, Upload, MessageSquare, AlertTriangle, FileText, Camera } from 'lucide-react';
import { formatDateSafe, generateSafeId } from '@/core/shared/utils/hydration-safe';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { useUserData } from '@/contexts';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic'

interface WarrantyClaimForm {
  issueDescription: string;
  issueType: string;
  quantityAffected: number;
  totalQuantity: number;
  damagePhotos: File[];
  receiptPhoto: File | null;
  preferredResolution: string;
  additionalNotes: string;
}

export default function WarrantyClaimPage() {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const params = useParams();
  // Ensure params.id is always a string
  const warrantyId = Array.isArray(params?.id) ? params.id[0] : params?.id || '';
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [formData, setFormData] = useState<WarrantyClaimForm>({
    issueDescription: '',
    issueType: '',
    quantityAffected: 1,
    totalQuantity: 1,
    damagePhotos: [],
    receiptPhoto: null,
    preferredResolution: '',
    additionalNotes: ''
  });

  const [claim, setClaim] = useState<any>(null);
  useEffect(() => {
    if (warrantyId) {
      fetchClaim(warrantyId);
    }
  }, [warrantyId]);

  const fetchClaim = async (claimId: string) => {
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('warranty_claims')
        .select('*')
        .eq('warranty_id', claimId)
        .single();
      if (error) throw error;
      setClaim(data);
    } catch (error) {
      console.error('Error fetching warranty claim:', error);
      setClaim(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'quantityAffected' || name === 'totalQuantity' ? parseInt(value) || 0 : value 
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'damage' | 'receipt') => {
    if (e.target.files) {
      if (type === 'damage') {
        setFormData(prev => ({ 
          ...prev, 
          damagePhotos: [...prev.damagePhotos, ...Array.from(e.target.files || [])]
        }));
      } else {
        setFormData(prev => ({ ...prev, receiptPhoto: e.target.files![0] }));
      }
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      damagePhotos: prev.damagePhotos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.issueType || !formData.issueDescription) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.quantityAffected > claim.quantityAvailable) {
      alert(`لا يمكن المطالبة بأكثر من ${claim.quantityAvailable} قطع`);
      return;
    }

    const claimId = generateSafeId('CLAIM');
    
    // Show success message
    alert(`تم إرسال طلب المطالبة بنجاح!\n\nرقم المطالبة: ${claimId}\nالمنتج: ${claim.productName}\nالكمية المطالب بها: ${formData.quantityAffected} من أصل ${claim.quantityAvailable} متاح\nالكمية المستخدمة سابقاً: ${claim.quantityUsedPreviously}\nإجمالي القطع: ${claim.totalQuantity}\n\nسيتم التواصل معك من قبل "${claim.store}" خلال 48 ساعة لمراجعة الطلب وتقديم الحل المناسب.`);
    
    console.log('Warranty claim submitted:', {
      warrantyId,
      claimId,
      formData,
      claim,
      quantityTracking: {
        totalQuantity: claim.totalQuantity,
        quantityUsedPreviously: claim.quantityUsedPreviously,
        quantityAvailable: claim.quantityAvailable,
        quantityAffected: formData.quantityAffected,
        quantityRemaining: claim.quantityAvailable - formData.quantityAffected
      }
    });

    router.push('/user/warranties/tracking');
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
      <div className="container mx-auto px-4 py-8 max-w-4xl" dir="rtl">
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
    <div className="container mx-auto px-4 py-8 max-w-4xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowRight className="w-5 h-5" />
          العودة لتفاصيل الضمان
        </button>
        
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          المطالبة بالضمان
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          قم بتعبئة النموذج التالي لبدء عملية المطالبة بالضمان
        </Typography>
      </div>

      {/* Warranty Info Summary */}
      <EnhancedCard className="p-6 mb-8 bg-blue-50 border-blue-200">
        <Typography variant="subheading" size="lg" weight="semibold" className="text-blue-900 mb-3">
          معلومات المنتج المراد المطالبة بضمانه
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
          <div>
            <Typography variant="caption" size="sm" className="text-blue-600">المنتج</Typography>
            <Typography variant="body" size="lg" weight="medium">{claim?.productName}</Typography>
          </div>
          <div>
            <Typography variant="caption" size="sm" className="text-blue-600">المتجر</Typography>
            <Typography variant="body" size="lg" weight="medium">{claim?.store}</Typography>
          </div>
          <div>
            <Typography variant="caption" size="sm" className="text-blue-600">تاريخ الشراء</Typography>
            <Typography variant="body" size="lg" weight="medium">{formatDateSafe(claim?.purchaseDate, { format: 'medium' })}</Typography>
          </div>
          <div>
            <Typography variant="caption" size="sm" className="text-blue-600">إجمالي القطع</Typography>
            <Typography variant="body" size="lg" weight="medium">{claim?.totalQuantity}</Typography>
          </div>
          <div>
            <Typography variant="caption" size="sm" className="text-blue-600">مستخدمة سابقاً</Typography>
            <Typography variant="body" size="lg" weight="medium">{claim?.quantityUsedPreviously}</Typography>
          </div>
          <div>
            <Typography variant="caption" size="sm" className="text-blue-600">متاحة للمطالبة</Typography>
            <Typography variant="body" size="lg" weight="medium">{claim?.quantityAvailable}</Typography>
          </div>
        </div>
      </EnhancedCard>

      <EnhancedCard className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Details */}
          <div className="space-y-6">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 border-b pb-2">
              تفاصيل المشكلة
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  نوع المشكلة *
                </label>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">اختر نوع المشكلة</option>
                  <option value="manufacturing_defect">عيب تصنيع</option>
                  <option value="not_working">لا يعمل</option>
                  <option value="partial_damage">تلف جزئي</option>
                  <option value="complete_failure">تعطل كامل</option>
                  <option value="performance_issue">مشكلة في الأداء</option>
                  <option value="physical_damage">تلف مادي</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  الكمية المتأثرة *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="quantityAffected"
                    value={formData.quantityAffected}
                    onChange={handleInputChange}
                    min="1"
                    max={claim?.quantityAvailable}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <span className="flex items-center px-4 bg-gray-100 rounded-lg text-gray-600">
                    من {claim?.quantityAvailable} متاح
                  </span>
                </div>
                <Typography variant="caption" size="sm" className="text-gray-500 mt-1">
                  إجمالي القطع المشتراة: {claim?.totalQuantity} | مستخدمة سابقاً: {claim?.quantityUsedPreviously} | متاحة للمطالبة: {claim?.quantityAvailable}
                </Typography>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <MessageSquare className="w-4 h-4 inline ml-1" />
                وصف مفصل للمشكلة *
              </label>
              <textarea
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="اشرح المشكلة بالتفصيل، متى ظهرت، وكيف تؤثر على استخدام المنتج"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                الحل المفضل
              </label>
              <select
                name="preferredResolution"
                value={formData.preferredResolution}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر الحل المفضل</option>
                <option value="replacement">استبدال المنتج</option>
                <option value="repair">إصلاح المنتج</option>
                <option value="refund">استرداد المبلغ</option>
                <option value="store_credit">رصيد في المتجر</option>
                <option value="let_store_decide">دع المتجر يقرر</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ملاحظات إضافية
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أي معلومات إضافية قد تكون مفيدة للمتجر"
              />
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-6">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 border-b pb-2">
              الصور والمستندات
            </Typography>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Camera className="w-4 h-4 inline ml-1" />
                صور المشكلة (مستحسن)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(e, 'damage')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <Typography variant="caption" size="sm" className="text-gray-500 mt-1">
                أضف صور توضح المشكلة بوضوح
              </Typography>

              {/* Display uploaded photos */}
              {formData.damagePhotos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.damagePhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`صورة ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FileText className="w-4 h-4 inline ml-1" />
                صورة الفاتورة (اختياري)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, 'receipt')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.receiptPhoto && (
                <Typography variant="caption" size="sm" className="text-green-600 mt-1">
                  ✓ تم رفع صورة الفاتورة
                </Typography>
              )}
            </div>
          </div>

          {/* Warranty Terms */}
          <EnhancedCard className="p-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
              <div>
                <Typography variant="subheading" size="lg" weight="semibold" className="text-yellow-900 mb-2">
                  شروط المطالبة بالضمان
                </Typography>
                <ul className="space-y-1 text-yellow-800 text-sm">
                  <li>• يجب أن يكون المنتج ضمن فترة الضمان المحددة</li>
                  <li>• المطالبة صالحة فقط للعيوب المصنعية وليس سوء الاستخدام</li>
                  <li>• قد يطلب المتجر فحص المنتج قبل الموافقة على المطالبة</li>
                  <li>• مدة المعالجة قد تتراوح من 3-14 يوم عمل</li>
                  <li>• احتفظ بالمنتج في حالته الحالية حتى يتم التواصل معك</li>
                </ul>
              </div>
            </div>
          </EnhancedCard>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              onClick={() => {/* handle submit */}}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
            >
              إرسال طلب المطالبة
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </EnhancedCard>
    </div>
  );
}

