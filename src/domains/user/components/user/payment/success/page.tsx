'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, FileText, ArrowRight, Download, Receipt } from 'lucide-react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues

function PaymentSuccessContent() {
  const { user, session, isLoading, error } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<{
    invoiceId?: string;
    amount?: string;
    transactionId?: string;
  }>({});

  useEffect(() => {
    const invoiceId = searchParams?.get('invoice');    const amount = searchParams?.get('amount');
    const transactionId = searchParams?.get('transaction');

    setPaymentInfo({
      invoiceId: invoiceId || undefined,
      amount: amount || undefined,
      transactionId: transactionId || undefined
    });
  }, [searchParams]);

  
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
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            تم الدفع بنجاح!
          </h1>
          <p className="text-gray-600">
            شكراً لك، تم معالجة دفعتك بنجاح
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
          <h3 className="font-semibold text-gray-900 mb-3">تفاصيل الدفعة</h3>
          <div className="space-y-2 text-sm">
            {paymentInfo.invoiceId && (
              <div className="flex justify-between">
                <span className="text-gray-600">رقم الفاتورة:</span>
                <span className="font-mono font-medium">{paymentInfo.invoiceId}</span>
              </div>
            )}
            {paymentInfo.amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">المبلغ المدفوع:</span>
                <span className="font-medium text-green-600">{paymentInfo.amount} ر.س</span>
              </div>
            )}
            {paymentInfo.transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">رقم المعاملة:</span>
                <span className="font-mono text-xs">{paymentInfo.transactionId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">التاريخ:</span>
              <span>{new Date().toLocaleDateString('en-US')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الحالة:</span>
              <span className="text-green-600 font-medium">مدفوع</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {paymentInfo.invoiceId && (
            <Link href={`/store/invoices/${paymentInfo.invoiceId}`}>
              <Button className="w-full" variant="outline" onClick={() => alert('Button clicked')}>
                <FileText className="w-4 h-4 ml-2" />
                عرض الفاتورة
              </Button>
            </Link>
          )}
          
          <Button className="w-full" variant="outline" onClick={() => window.print()}>
            <Receipt className="w-4 h-4 ml-2" />
            طباعة إيصال الدفع
          </Button>

          <Link href="/">
            <Button className="w-full" onClick={() => alert('Button clicked')}>
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-500">
            سيتم إرسال إيصال الدفع إلى بريدك الإلكتروني
          </p>
          <p className="text-xs text-gray-400 mt-1">
            تمت العملية بواسطة نظام فاتورة الآمن
          </p>
        </div>
      </Card>
    </div>
  );
}

// Loading component for Suspense fallback
function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen bg-gray-50 font-tajawal flex items-center justify-center p-4" dir="rtl">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">جاري التحميل...</h1>
        <p className="text-gray-600">يرجى الانتظار</p>
      </Card>
    </div>
  );
}

// Main component wrapped with Suspense
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}



