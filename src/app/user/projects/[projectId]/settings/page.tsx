import React from 'react';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

interface ProjectData {
  id: string;
  project_name: string;
  description: string;
  location: any;
  created_at: string;
}

async function getProjectData(projectId: string): Promise<ProjectData | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const { data, error } = await supabase
    .from('construction_projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

export default async function ProjectSettingsPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;
  const project = await getProjectData(projectId);

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">إعدادات المشروع</h1>
        <p className="text-sm text-gray-500 mt-1">إدارة اسم المشروع، الوصف، والموقع والصورة</p>
      </header>

      {!project ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">لم يتم العثور على بيانات المشروع</p>
        </div>
      ) : (
        <>
          <section className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-lg border p-4 space-y-3">
              <h2 className="font-semibold text-gray-900">المعلومات الأساسية</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>اسم المشروع</p>
                <input 
                  className="w-full border rounded-md px-3 py-2" 
                  placeholder="مثال: مشروع فيلا عائلية"
                  defaultValue={project.project_name || ''}
                />
                <p>الوصف</p>
                <textarea 
                  className="w-full border rounded-md px-3 py-2 min-h-[100px]" 
                  placeholder="نبذة عن المشروع"
                  defaultValue={project.description || ''}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4 space-y-3">
              <h2 className="font-semibold text-gray-900">الموقع الجغرافي</h2>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div>
                  <p>خط العرض (Latitude)</p>
                  <input 
                    className="w-full border rounded-md px-3 py-2" 
                    placeholder="24.7136"
                    defaultValue={project.location?.coordinates?.lat || ''}
                  />
                </div>
                <div>
                  <p>خط الطول (Longitude)</p>
                  <input 
                    className="w-full border rounded-md px-3 py-2" 
                    placeholder="46.6753"
                    defaultValue={project.location?.coordinates?.lng || ''}
                  />
                </div>
              </div>
              {project.location?.address && (
                <div>
                  <p className="text-sm text-gray-600">العنوان</p>
                  <input 
                    className="w-full border rounded-md px-3 py-2" 
                    defaultValue={project.location.address}
                  />
                </div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-lg border p-4 space-y-3">
            <h2 className="font-semibold text-gray-900">صورة المشروع</h2>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-md border flex items-center justify-center text-gray-400 text-xs">
                معاينة
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">رفع صورة</button>
            </div>
          </section>

          <section className="bg-gray-50 rounded-lg border p-4">
            <h2 className="font-semibold text-gray-900 mb-3">معلومات إضافية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">رقم المشروع:</span>
                <span className="ml-2 font-mono text-gray-900">{project.id}</span>
              </div>
              <div>
                <span className="text-gray-600">تاريخ الإنشاء:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(project.created_at).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          </section>

          <footer className="flex justify-end gap-3">
            <button className="px-4 py-2 rounded-md border">إلغاء</button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">حفظ التغييرات</button>
          </footer>
        </>
      )}
    </div>
  );
}
