import React from 'react';
import Link from 'next/link';
import { EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { createClient } from '@supabase/supabase-js';
import { MapPin, Calendar, DollarSign, TrendingUp, Eye, Settings } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface Project {
  id: string;
  project_name: string;
  description: string;
  project_type: string;
  status: string;
  budget: number;
  actual_cost: number;
  start_date: string;
  completion_percentage: number;
  location: any;
  created_at: string;
  user_id: string;
}

async function fetchProjects(): Promise<Project[]> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // For demo purposes, filter by a specific user ID
  // In production, this should come from the authenticated user session
  const currentUserId = 'user@binna.com'; // This matches some test data
  
  const { data, error } = await supabase
    .from('construction_projects')
    .select('*')
    .eq('user_id', currentUserId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

function getStatusColor(status: string) {
  switch (status) {
    case 'planning': return 'bg-blue-100 text-blue-700';
    case 'in_progress': return 'bg-yellow-100 text-yellow-700';
    case 'completed': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'planning': return 'التخطيط';
    case 'in_progress': return 'قيد التنفيذ';
    case 'completed': return 'مكتمل';
    default: return status;
  }
}

function getProjectTypeText(type: string) {
  switch (type) {
    case 'residential': return 'سكني';
    case 'commercial': return 'تجاري';
    case 'renovation': return 'تجديد';
    case 'landscaping': return 'تنسيق حدائق';
    case 'recreational': return 'ترفيهي';
    case 'villa': return 'فيلا';
    default: return type;
  }
}

export default async function ProjectListPage() {
  const projects = await fetchProjects();

  if (projects.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">قائمة المشاريع</h1>
          <p className="text-gray-600">عرض جميع مشاريعك النشطة والمكتملة</p>
        </div>

        <EnhancedCard className="p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مشاريع</h3>
          <p className="text-gray-500 mb-4">ابدأ مشروعك الأول لتراه هنا</p>
          <Link href="/user/projects/create">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              إنشاء مشروع جديد
            </Button>
          </Link>
        </EnhancedCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl" dir="rtl">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">قائمة المشاريع</h1>
          <p className="text-gray-600 text-sm sm:text-base">عرض جميع مشاريعك النشطة والمكتملة ({projects.length} مشروع)</p>
        </div>
        <Link href="/user/projects/create">
          <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
            إنشاء مشروع جديد
          </Button>
        </Link>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {projects.map((project) => (
          <EnhancedCard key={project.id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate" title={project.project_name}>
                    {project.project_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getProjectTypeText(project.project_type)}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium text-gray-900">{project.completion_percentage}%</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${project.completion_percentage}%` }}
                ></div>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <div>الميزانية: {project.budget > 0 ? `${project.budget.toLocaleString()} ر.س` : 'غير محدد'}</div>
                <div>الموقع: {typeof project.location === 'string' ? project.location : project.location?.address || 'غير محدد'}</div>
                <div>تاريخ الإنشاء: {new Date(project.created_at).toLocaleDateString('ar-SA')}</div>
              </div>

              <div className="flex gap-2">
                <Link href={`/user/projects/${project.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    عرض
                  </Button>
                </Link>
                <Link href={`/user/projects/${project.id}/settings`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    إعدادات
                  </Button>
                </Link>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <EnhancedCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم المشروع
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    النوع
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التقدم
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الميزانية
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    الموقع
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    تاريخ الإنشاء
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={project.project_name}>
                        {project.project_name}
                      </div>
                      {project.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs" title={project.description}>
                          {project.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {getProjectTypeText(project.project_type)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${project.completion_percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 min-w-[35px]">
                          {project.completion_percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="max-w-[120px]">
                        <div>{project.budget > 0 ? `${project.budget.toLocaleString()} ر.س` : 'غير محدد'}</div>
                        {project.actual_cost > 0 && (
                          <div className="text-xs text-gray-500">
                            إنفاق: {project.actual_cost.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                      <div className="max-w-[150px] truncate" title={typeof project.location === 'string' ? project.location : project.location?.address || 'غير محدد'}>
                        {typeof project.location === 'string' 
                          ? project.location 
                          : project.location?.address || 'غير محدد'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                      {new Date(project.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-1">
                        <Link href={`/user/projects/${project.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-1 px-2">
                            <Eye className="w-3 h-3" />
                            <span className="hidden lg:inline">عرض</span>
                          </Button>
                        </Link>
                        <Link href={`/user/projects/${project.id}/settings`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-1 px-2">
                            <Settings className="w-3 h-3" />
                            <span className="hidden lg:inline">إعدادات</span>
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </EnhancedCard>
      </div>
    </div>
  );
}
