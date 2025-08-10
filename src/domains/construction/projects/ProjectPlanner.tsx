import React, { useState } from 'react';
import { 
  BuildingOfficeIcon, 
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  team: number;
  location: string;
}

interface ProjectPlannerProps {
  projects: Project[];
  onCreateProject: (project: Omit<Project, 'id'>) => void;
}

/**
 * Advanced construction project planner
 * AI-powered scheduling and resource management
 */
export const ProjectPlanner: React.FC<ProjectPlannerProps> = ({ projects, onCreateProject }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    status: 'planning' as const,
    progress: 0,
    budget: 0,
    spent: 0,
    startDate: '',
    endDate: '',
    team: 0,
    location: ''
  });

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'on-hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'تخطيط';
      case 'in-progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'on-hold': return 'متوقف';
      default: return 'غير محدد';
    }
  };

  const handleCreateProject = () => {
    onCreateProject(newProject);
    setNewProject({
      name: '',
      status: 'planning',
      progress: 0,
      budget: 0,
      spent: 0,
      startDate: '',
      endDate: '',
      team: 0,
      location: ''
    });
    setShowCreateForm(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            مخطط المشاريع الإنشائية
          </h1>
          <p className="text-gray-600 mt-2">
            إدارة وتخطيط المشاريع الإنشائية بذكاء اصطناعي
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          مشروع جديد
        </button>
      </div>

      {/* Projects Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي المشاريع</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">قيد التنفيذ</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'in-progress').length}
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مكتملة</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <CalendarDaysIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الميزانية</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString('en-US')} ر.س
              </p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">المشاريع الحالية</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم المشروع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التقدم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الميزانية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الموقع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {project.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="mr-2 text-sm text-gray-600">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="text-sm font-medium">
                        {project.budget.toLocaleString('en-US')} ر.س
                      </div>
                      <div className="text-xs text-gray-500">
                        مُستخدم: {project.spent.toLocaleString('en-US')} ر.س
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 ml-2" onClick={() => alert('Button clicked')}>
                      عرض
                    </button>
                    <button className="text-green-600 hover:text-green-900 ml-2" onClick={() => alert('Button clicked')}>
                      تحرير
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              إنشاء مشروع جديد
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المشروع
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الميزانية (ر.س)
                </label>
                <input
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({...newProject, budget: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الموقع
                </label>
                <input
                  type="text"
                  value={newProject.location}
                  onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors ml-2"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                إنشاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPlanner;



