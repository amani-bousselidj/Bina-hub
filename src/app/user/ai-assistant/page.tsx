import React from 'react';

export default function UserAIAssistantPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">المساعد الذكي</h1>
            <p className="text-lg text-gray-600">
              مساعدك الشخصي في مشاريع البناء والتشييد
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">قريباً</h2>
            <p className="text-blue-700">
              المساعد الذكي قيد التطوير وسيوفر لك إجابات فورية ونصائح مخصصة لمشروعك
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">إجابات فورية</h3>
              <p className="text-gray-600 text-sm">احصل على إجابات سريعة لأسئلتك حول البناء</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">نصائح مخصصة</h3>
              <p className="text-gray-600 text-sm">نصائح مبنية على تفاصيل مشروعك الخاص</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
