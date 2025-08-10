import React from 'react';

export default function UserCompanyBulkOptimizerPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">محسن الجملة للشركات</h1>
            <p className="text-lg text-gray-600">
              حلول تحسين الشراء بالجملة للشركات الكبيرة
            </p>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-orange-800 mb-2">للشركات الكبيرة</h2>
            <p className="text-orange-700">
              أداة تحسين خاصة بالشركات التي تحتاج لشراء مواد البناء بكميات كبيرة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">تحسين الكميات</h3>
              <p className="text-gray-600 text-sm">حساب الكميات المثلى للشراء</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">خصومات الجملة</h3>
              <p className="text-gray-600 text-sm">العثور على أفضل عروض الجملة</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">إدارة المخزون</h3>
              <p className="text-gray-600 text-sm">تحسين إدارة مخزون المواد</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
