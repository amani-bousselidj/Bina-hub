// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Progress } from '@/components/ui/Progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  Target,
  TrendingUp,
  FileText,
  MessageCircle,
  Filter,
  Plus,
  Edit,
  Eye,
  Play,
  Pause,
  MoreHorizontal
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  manager: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  team: TeamMember[];
  tasks: Task[];
  milestones: Milestone[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  startDate: string;
  dueDate: string;
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
  actualHours: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

interface ProjectMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalSpent: number;
  averageProgress: number;
}

export default function AdvancedProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [metrics, setMetrics] = useState<ProjectMetrics>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalBudget: 0,
    totalSpent: 0,
    averageProgress: 0
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'projects' | 'tasks' | 'timeline'>('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isRTL] = useState(false);

  // Fetch real project data from your API or Supabase
  useEffect(() => {
    async function fetchProjects() {
      try {
        // Example: Replace with your actual API or Supabase query
        // const { data, error } = await supabase.from('projects').select('*');
        // if (error) throw error;
        // setProjects(data);
        // Calculate metrics based on real data
        // const calculatedMetrics: ProjectMetrics = {
        //   totalProjects: data.length,
        //   activeProjects: data.filter(p => p.status === 'in_progress' || p.status === 'planning').length,
        //   completedProjects: data.filter(p => p.status === 'completed').length,
        //   totalBudget: data.reduce((sum, p) => sum + p.budget, 0),
        //   totalSpent: data.reduce((sum, p) => sum + p.spent, 0),
        //   averageProgress: data.reduce((sum, p) => sum + p.progress, 0) / data.length
        // };
        // setMetrics(calculatedMetrics);
        throw new Error('fetchProjects: Real API integration required');
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setMetrics({
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0,
          totalBudget: 0,
          totalSpent: 0,
          averageProgress: 0
        });
      }
    }
    fetchProjects();
  }, []);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'تخطيط';
      case 'in_progress': return 'قيد التنفيذ';
      case 'on_hold': return 'متوقف مؤقتاً';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return 'غير معروف';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'منخفضة';
      case 'medium': return 'متوسطة';
      case 'high': return 'عالية';
      case 'critical': return 'حرجة';
      default: return 'غير معروف';
    }
  };

  const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusText = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'لم تبدأ';
      case 'in_progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتملة';
      case 'blocked': return 'محجوبة';
      default: return 'غير معروف';
    }
  };

  const filteredProjects = projects.filter(project => {
    return filterStatus === 'all' || project.status === filterStatus;
  });

  // Chart data
  const projectStatusData = [
    { name: 'تخطيط', value: projects.filter(p => p.status === 'planning').length, color: '#3B82F6' },
    { name: 'قيد التنفيذ', value: projects.filter(p => p.status === 'in_progress').length, color: '#10B981' },
    { name: 'متوقف', value: projects.filter(p => p.status === 'on_hold').length, color: '#F59E0B' },
    { name: 'مكتمل', value: projects.filter(p => p.status === 'completed').length, color: '#8B5CF6' },
    { name: 'ملغي', value: projects.filter(p => p.status === 'cancelled').length, color: '#EF4444' }
  ];

  const budgetPerformance = projects.map(project => ({
    name: project.name.substring(0, 15) + '...',
    budget: project.budget,
    spent: project.spent,
    remaining: project.budget - project.spent
  }));

  const monthlyProgress = [
    { month: 'يناير', completed: 2, started: 1, budget: 5000000 },
    { month: 'فبراير', completed: 1, started: 2, budget: 8000000 },
    { month: 'مارس', completed: 3, started: 1, budget: 12000000 },
    { month: 'أبريل', completed: 2, started: 3, budget: 7000000 },
    { month: 'مايو', completed: 4, started: 2, budget: 15000000 },
    { month: 'يونيو', completed: 1, started: 4, budget: 10000000 }
  ];

  return (
    <div className={`space-y-6 p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المشاريع المتقدمة</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            <FileText className="w-4 h-4 mr-2" />
            تقرير المشاريع
          </Button>
          <Button onClick={() => alert('Button clicked')}>
            <Plus className="w-4 h-4 mr-2" />
            مشروع جديد
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المشاريع</p>
                <p className="text-2xl font-bold">{metrics.totalProjects}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المشاريع النشطة</p>
                <p className="text-2xl font-bold text-green-600">{metrics.activeProjects}</p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المشاريع المكتملة</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.completedProjects}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الميزانيات</p>
                <p className="text-xl font-bold">
                  {metrics.totalBudget.toLocaleString('en-US')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المبلغ المنفق</p>
                <p className="text-xl font-bold text-red-600">
                  {metrics.totalSpent.toLocaleString('en-US')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط التقدم</p>
                <p className="text-2xl font-bold text-indigo-600">{Math.round(metrics.averageProgress)}%</p>
              </div>
              <Target className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[ 
          { key: 'overview', label: 'نظرة عامة', icon: Target },
          { key: 'projects', label: 'المشاريع', icon: Briefcase },
          { key: 'tasks', label: 'المهام', icon: CheckCircle },
          { key: 'timeline', label: 'الجدول الزمني', icon: Calendar }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveView(key as any)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              activeView === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع حالة المشاريع</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أداء الميزانيات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => value.toLocaleString('en-US')}
                    />
                    <Bar dataKey="budget" fill="#3B82F6" name="الميزانية المخططة" />
                    <Bar dataKey="spent" fill="#EF4444" name="المبلغ المنفق" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>التقدم الشهري</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completed" stroke="#10B981" name="مشاريع مكتملة" strokeWidth={2} />
                  <Line type="monotone" dataKey="started" stroke="#3B82F6" name="مشاريع جديدة" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Projects Tab */}
      {activeView === 'projects' && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">جميع المشاريع</option>
              <option value="planning">تخطيط</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="on_hold">متوقف مؤقتاً</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge className={getPriorityColor(project.priority)}>
                        {getPriorityText(project.priority)}
                      </Badge>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{project.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">العميل:</span>
                    <span className="font-medium">{project.client}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">مدير المشروع:</span>
                    <span className="font-medium">{project.manager}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>التقدم</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="w-full" />
                  </div>

                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-gray-600">الميزانية: </span>
                      <span className="font-medium">
                        {project.budget.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-gray-600">المنفق: </span>
                      <span className="font-medium text-red-600">
                        {project.spent.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member) => (
                        <div
                          key={member.id}
                          className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" variant="ghost" onClick={() => setSelectedProject(project)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeView === 'tasks' && (
        <Card>
          <CardHeader>
            <CardTitle>جميع المهام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">المهمة</th>
                    <th className="text-right p-3">المشروع</th>
                    <th className="text-right p-3">المكلف</th>
                    <th className="text-right p-3">تاريخ الاستحقاق</th>
                    <th className="text-right p-3">الساعات المقدرة</th>
                    <th className="text-right p-3">الساعات الفعلية</th>
                    <th className="text-right p-3">الحالة</th>
                    <th className="text-right p-3">الأولوية</th>
                    <th className="text-right p-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.flatMap(project =>
                    project.tasks.map(task => (
                      <tr key={task.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-gray-500">{task.description}</div>
                          </div>
                        </td>
                        <td className="p-3">{project.name}</td>
                        <td className="p-3">{task.assignee}</td>
                        <td className="p-3">{new Date(task.dueDate).toLocaleDateString('en-US')}</td>
                        <td className="p-3">{task.estimatedHours} ساعة</td>
                        <td className="p-3">{task.actualHours} ساعة</td>
                        <td className="p-3">
                          <Badge className={getTaskStatusColor(task.status)}>
                            {getTaskStatusText(task.status)}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => alert('Button clicked')}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Tab */}
      {activeView === 'timeline' && (
        <Card>
          <CardHeader>
            <CardTitle>الجدول الزمني للمشاريع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span>من {new Date(project.startDate).toLocaleDateString('en-US')} إلى {new Date(project.endDate).toLocaleDateString('en-US')}</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>التقدم</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="w-full" />
                  </div>
                  {project.milestones.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">المعالم المهمة:</h4>
                      <div className="space-y-1">
                        {project.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center space-x-2 text-sm">
                            <div className={`w-3 h-3 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className={milestone.completed ? 'line-through text-gray-500' : ''}>{milestone.title}</span>
                            <span className="text-gray-500">({new Date(milestone.dueDate).toLocaleDateString('en-US')})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{selectedProject.name}</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedProject(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">تفاصيل المشروع</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">العميل:</span> {selectedProject.client}</div>
                    <div><span className="font-medium">مدير المشروع:</span> {selectedProject.manager}</div>
                    <div><span className="font-medium">تاريخ البداية:</span> {new Date(selectedProject.startDate).toLocaleDateString('en-US')}</div>
                    <div><span className="font-medium">تاريخ النهاية:</span> {new Date(selectedProject.endDate).toLocaleDateString('en-US')}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">الميزانية والتقدم</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">الميزانية:</span> {selectedProject.budget.toLocaleString('en-US')}</div>
                    <div><span className="font-medium">المنفق:</span> {selectedProject.spent.toLocaleString('en-US')}</div>
                    <div><span className="font-medium">المتبقي:</span> {(selectedProject.budget - selectedProject.spent).toLocaleString('en-US')}</div>
                    <div><span className="font-medium">التقدم:</span> {selectedProject.progress}%</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">فريق العمل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedProject.team.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProject.tasks.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">المهام</h3>
                  <div className="space-y-2">
                    {selectedProject.tasks.map((task) => (
                      <div key={task.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{task.title}</div>
                          <Badge className={getTaskStatusColor(task.status)}>
                            {getTaskStatusText(task.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{task.description}</div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>المكلف: {task.assignee}</span>
                          <span>الاستحقاق: {new Date(task.dueDate).toLocaleDateString('en-US')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


