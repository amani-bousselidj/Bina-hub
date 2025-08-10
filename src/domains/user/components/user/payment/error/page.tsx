'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, ArrowRight, AlertTriangle, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues

function PaymentErrorContent() {
  const { user, session, isLoading, error } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errorInfo, setErrorInfo] = useState<{
    reason?: string;
    invoiceId?: string;
    message?: string;
  }>({});

  useEffect(() => {
    const reason = searchParams?.get('reason');
    const invoiceId = searchParams?.get('invoice');
    const message = searchParams?.get('message');

    setErrorInfo({
      reason: reason || undefined,
      invoiceId: invoiceId || undefined,
      message: message || undefined
    });
  }, [searchParams]);

  const getErrorMessage = (reason?: string) => {
    switch (reason) {
      case 'missing_payment_id':
        return 'معرف الدفعة مفقود';
      case 'payment_failed':
        return 'فشل في معالجة الدفعة';
      case 'processing_error':
        return 'خطأ في معالجة البيانات';
      case 'cancelled':
        return 'تم إلغاء عملية الدفع';
      case 'expired':
        return 'انتهت صلاحية رابط الدفع';
      case 'insufficient_funds':
        return 'رصيد غير كافي';
      case 'card_declined':
        return 'تم رفض البطاقة';
      default:
        return 'حدث خطأ غير متوقع';
    }
  };

  const getErrorDescription = (reason?: string) => {
    switch (reason) {
      case 'missing_payment_id':
        return 'لم يتم العثور على معرف الدفعة في الطلب';
      case 'payment_failed':
        return 'لم يتم إتمام عملية الدفع بنجاح، يرجى المحاولة مرة أخرى';
      case 'processing_error':
        return 'حدث خطأ أثناء معالجة البيانات، يرجى المحاولة لاحقاً';
      case 'cancelled':
        return 'قمت بإلغاء عملية الدفع قبل إتمامها';
      case 'expired':
        return 'انتهت صلاحية رابط الدفع، يرجى طلب رابط جديد';
      case 'insufficient_funds':
        return 'الرصيد في حساب البطاقة غير كافي لإتمام العملية';
      case 'card_declined':
        return 'تم رفض البطاقة من قبل البنك المصدر';
      default:
        return 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى';
    }
  };

  const retryPayment = () => {
    if (errorInfo.invoiceId) {
      router.push(`/store/invoices/${errorInfo.invoiceId}`);
    } else {
      router.back();
    }
  };

  
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
    <div className="min-h-screen bg-gray-50 font-tajawal flex items-center justify-center p-4" dir="rtl">
      <Card className="max-w-md w-full p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            فشل في الدفع
          </h1>
          <p className="text-gray-600">
            {getErrorMessage(errorInfo.reason)}
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-right">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 ml-2 shr shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-medium mb-1">تفاصيل الخطأ:</p>
              <p>{getErrorDescription(errorInfo.reason)}</p>
              {errorInfo.message && (
                <p className="mt-2 text-red-600">{errorInfo.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Troubleshooting Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-right">
          <h3 className="font-semibold text-blue-900 mb-2">نصائح لحل المشكلة:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• تأكد من صحة بيانات البطاقة</li>
            <li>• تحقق من وجود رصيد كافي</li>
            <li>• تأكد من تفعيل التسوق الإلكتروني</li>
            <li>• جرب طريقة دفع أخرى</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button className="w-full" onClick={retryPayment}>
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة المحاولة
          </Button>

          {errorInfo.invoiceId && (
            <Link href={`/store/invoices/${errorInfo.invoiceId}`}>
              <Button className="w-full" variant="outline" onClick={() => alert('Button clicked')}>
                <CreditCard className="w-4 h-4 ml-2" />
                العودة للفاتورة
              </Button>
            </Link>
          )}

          <Link href="/">
            <Button className="w-full" variant="outline" onClick={() => alert('Button clicked')}>
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-600 mb-2">
            تحتاج مساعدة؟
          </p>
          <Link href="/support" className="text-blue-600 hover:text-blue-800 text-sm underline">
            تواصل مع فريق الدعم
          </Link>
        </div>
      </Card>
    </div>
  );
}

// Loading component for Suspense fallback
function PaymentErrorLoading() {
  return (
    <div className="min-h-screen bg-gray-50 font-tajawal flex items-center justify-center p-4" dir="rtl">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">جاري التحميل...</h1>
        <p className="text-gray-600">يرجى الانتظار</p>
      </Card>
    </div>
  );
}

// Main component wrapped with Suspense
export default function PaymentErrorPage() {
  return (
    <Suspense fallback={<PaymentErrorLoading />}>
      <PaymentErrorContent />
    </Suspense>
  );
}



