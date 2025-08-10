import React from 'react';
import Link from 'next/link';
import { EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { createClient } from '@supabase/supabase-js';
import { MapPin, Calendar, DollarSign, TrendingUp } from 'lucide-react';

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

export default async function UserProjectsPage() {
  const projects = await fetchProjects();

  if (projects.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مشاريعي</h1>
          <p className="text-gray-600">إدارة وتتبع جميع مشاريعك</p>
        </div>

        <EnhancedCard className="p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🏗️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مشاريع حالياً</h3>
          <p className="text-gray-500 mb-4">ابدأ مشروعك الأول معنا</p>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">مشاريعي</h1>
          <p className="text-gray-600 text-sm sm:text-base">إدارة وتتبع جميع مشاريعك ({projects.length} مشروع)</p>
        </div>
        <Link href="/user/projects/create">
          <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
            إنشاء مشروع جديد
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {projects.map((project) => (
          <EnhancedCard key={project.id} className="p-4 lg:p-6 hover:shadow-lg transition-shadow h-fit">
            <div className="space-y-3 lg:space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-1 truncate" title={project.project_name}>
                    {project.project_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getProjectTypeText(project.project_type)}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium text-gray-900">
                    {project.completion_percentage}%
                  </div>
                  <div className="text-xs text-gray-500">مكتمل</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${project.completion_percentage}%` }}
                ></div>
              </div>

              {/* Description */}
              {project.description && (
                <p className="text-sm text-gray-600 line-clamp-2" title={project.description}>
                  {project.description}
                </p>
              )}

              {/* Details - Simplified for mobile */}
              <div className="space-y-2 text-sm text-gray-600">
                {project.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {typeof project.location === 'string' 
                        ? project.location 
                        : project.location?.address || 'غير محدد'}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    {project.start_date 
                      ? new Date(project.start_date).toLocaleDateString('ar-SA')
                      : 'لم يتم تحديد تاريخ البداية'}
                  </span>
                </div>

                {/* Budget info - only show if exists and on larger screens */}
                <div className="hidden sm:block space-y-1">
                  {project.budget > 0 && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{project.budget.toLocaleString()} ر.س</span>
                    </div>
                  )}

                  {project.actual_cost > 0 && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">تم إنفاق: {project.actual_cost.toLocaleString()} ر.س</span>
                    </div>
                  )}
                </div>

                {/* Mobile budget summary */}
                <div className="sm:hidden">
                  {(project.budget > 0 || project.actual_cost > 0) && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate text-xs">
                        {project.budget > 0 && `${project.budget.toLocaleString()} ر.س`}
                        {project.actual_cost > 0 && project.budget > 0 && ' • '}
                        {project.actual_cost > 0 && `إنفاق: ${project.actual_cost.toLocaleString()}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Link href={`/user/projects/${project.id}`} className="flex-1">
                  <Button variant="outline" className="w-full text-sm">
                    عرض المشروع
                  </Button>
                </Link>
                <Link href={`/user/projects/${project.id}/settings`} className="sm:flex-shrink-0">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    إعدادات
                  </Button>
                </Link>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>
    </div>
  );
}
