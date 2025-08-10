'use client';

import { useAuth } from '@/core/shared/auth/AuthProvider';
// User Help Center page with articles, guides, and video links
export default function HelpCenterPage() {
  const { user, session, isLoading, error } = useAuth();
  
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
    <main className="max-w-3xl mx-auto p-6 space-y-6">    
      <h1 className="text-3xl font-bold text-blue-700 mb-4">مركز المساعدة</h1>
      <p className="text-lg text-gray-700 mb-6">كل ما تحتاج معرفته عن البناء واستخدام المنصة في مكان واحد.</p>      
      
      {/* Warning about AI Features */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-yellow-800 mb-2">⚠️ تحديث مهم: اختبار الميزات الذكية</h3>
        <p className="text-yellow-700 mb-2">
          نقوم حالياً بمراجعة وتحسين جميع ميزات الذكاء الاصطناعي والحاسبات الذكية لضمان أفضل تجربة للمستخدمين.
        </p>
        <a href="/user/ai-smart-features-test" className="text-yellow-800 hover:underline font-medium">
          🧪 صفحة اختبار الميزات الذكية - ساعدنا في التحسين
        </a>
      </div>

      <ul className="list-disc pl-6 space-y-2">
        <li><a href="/user/help-center/articles/getting-started" className="text-blue-600 hover:underline">دليل البدء السريع للبناء</a></li>
        <li><a href="/user/help-center/articles/project-steps" className="text-blue-600 hover:underline">مراحل رحلة البناء خطوة بخطوة</a></li>
        <li><a href="/user/help-center/articles/warranty" className="text-blue-600 hover:underline">كل شيء عن الضمانات</a></li>
        <li><a href="/user/help-center/articles/documents" className="text-blue-600 hover:underline">إدارة الملفات والمستندات</a></li>
        <li><a href="/user/help-center/articles/orders" className="text-blue-600 hover:underline">كيفية إدارة الطلبات</a></li>
        <li><a href="/user/help-center/articles/support" className="text-blue-600 hover:underline">الدعم الفني والتواصل مع الخبراء</a></li>
        <li><a href="/user/help-center/articles/faq" className="text-blue-600 hover:underline">الأسئلة الشائعة</a></li>
        <li><a href="/user/ai-smart-features-test" className="text-purple-600 hover:underline font-medium">🤖 اختبار الميزات الذكية والذكاء الاصطناعي</a></li>
      </ul>

      {/* New Construction Services Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">🏗️ خدمات البناء الجديدة - استكشف الآن!</h2>
        <p className="text-blue-700 mb-4">اكتشف خدماتنا الجديدة المتكاملة لإدارة مشروع البناء بالكامل</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">📅 حجز وإدارة الخدمات</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/dashboard/bookings" className="text-blue-600 hover:underline">• تقويم الحجوزات الموحد</a></li>
              <li><a href="/ai-assistant" className="text-blue-600 hover:underline">• المساعد الذكي للبناء</a></li>
              <li><a href="/auth/signup" className="text-blue-600 hover:underline">• تسجيل مقدمي الخدمات</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">🚛 خدمات متخصصة</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/dashboard/equipment-rental" className="text-blue-600 hover:underline">• تأجير المعدات والآليات</a></li>
              <li><a href="/dashboard/waste-management" className="text-blue-600 hover:underline">• إدارة النفايات والمخلفات</a></li>
              <li><a href="/dashboard/concrete-supplier" className="text-blue-600 hover:underline">• توريد الخرسانة الجاهزة</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-700 text-sm">
            ✨ <strong>جديد:</strong> جميع هذه الخدمات مدمجة مع نظام إدارة المشاريع لتوفير تجربة شاملة ومتكاملة
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">فيديوهات تعليمية</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><a href="https://www.youtube.com/results?search_query=بناء+منزل+خطوة+بخطوة" target="_blank" rel="noopener" className="text-blue-600 hover:underline">مشاهدة فيديوهات بناء المنزل خطوة بخطوة</a></li>
        </ul>
      </div>
    </main>
  );
}
