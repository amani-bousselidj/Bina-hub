import React from 'react';

export default function UserSmartInsightsPage() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الرؤى الذكية</h1>
            <p className="text-lg text-gray-600">
              تحليلات ورؤى متقدمة لمشاريعك
            </p>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-indigo-800 mb-2">قيد التطوير</h2>
            <p className="text-indigo-700">
              ستوفر هذه الصفحة رؤى ذكية حول أداء مشاريعك وتوصيات للتحسين
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">--</div>
              <p className="text-sm text-gray-600">مشاريع نشطة</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">--</div>
              <p className="text-sm text-gray-600">نسبة الإنجاز</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">--</div>
              <p className="text-sm text-gray-600">توفير التكاليف</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">--</div>
              <p className="text-sm text-gray-600">تقييم الأداء</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
