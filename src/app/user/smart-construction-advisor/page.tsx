import React from 'react';

export default function SmartConstructionAdvisorPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">المستشار الذكي للبناء</h1>
            <p className="text-lg text-gray-600">
              نصائح ذكية ومخصصة لمشروع البناء الخاص بك
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">قيد التطوير</h2>
            <p className="text-yellow-700">
              هذه الصفحة قيد التطوير وستكون متاحة قريباً مع ميزات الذكاء الاصطناعي المتقدمة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">تحليل التكاليف</h3>
              <p className="text-gray-600 text-sm">تحليل ذكي لتكاليف مشروعك</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">اختيار المواد</h3>
              <p className="text-gray-600 text-sm">نصائح لاختيار أفضل المواد</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">جدولة المشروع</h3>
              <p className="text-gray-600 text-sm">تخطيط زمني محسن للمشروع</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
