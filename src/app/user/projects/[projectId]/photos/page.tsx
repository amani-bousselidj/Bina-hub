import React from 'react';

export const dynamic = 'force-dynamic';

export default function ProjectPhotosPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">صور المشروع</h1>
        <p className="text-sm text-gray-500 mt-1">أضف صورًا لتوثيق مراحل المشروع وتتبع التقدم</p>
      </header>

      <section className="bg-white rounded-lg border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">رفع صور</button>
          <span className="text-xs text-gray-500">الرفع يدعم صور متعددة وسيتم ربطها بالمشروع</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Placeholder tiles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-video bg-gray-100 border rounded-md flex items-center justify-center text-gray-400 text-xs">
              معاينة الصورة
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
