'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui';
import { Textarea } from '@/components/ui/Textarea';
import ProjectCompletionPopup from '@/domains/project/components/ProjectCompletionPopup';
import { Project } from '@/core/shared/types/types';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  Calendar,
  Target,
  TrendingUp,
  FileText
} from 'lucide-react';

interface Task {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'on-hold';
  startDate: string;
  dueDate: string;
  assignee: string;
  dependencies: string[];
  category: string;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  progress: number;
  status: 'upcoming' | 'in-progress' | 'completed' | 'delayed';
  tasks: string[];
}

interface ProgressReport {
  id: string;
  date: string;
  overallProgress: number;
  completedTasks: number;
  totalTasks: number;
  summary: string;
  issues: string[];
  achievements: string[];
}

export default function ProgressTracking() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: 'Foundation Excavation',
      description: 'Dig foundation and prepare ground',
      progress: 100,
      status: 'completed',
      startDate: '2024-01-15',
      dueDate: '2024-01-25',
      assignee: 'Ahmed Hassan',
      dependencies: [],
      category: 'Foundation'
    },
    {
      id: '2',
      name: 'Concrete Pouring',
      description: 'Pour concrete for foundation',
      progress: 85,
      status: 'in-progress',
      startDate: '2024-01-26',
      dueDate: '2024-02-05',
      assignee: 'Mohammed Ali',
      dependencies: ['1'],
      category: 'Foundation'
    },
    {
      id: '3',
      name: 'Steel Framework',
      description: 'Install steel framework structure',
      progress: 30,
      status: 'in-progress',
      startDate: '2024-02-01',
      dueDate: '2024-02-20',
      assignee: 'Khalid Ibrahim',
      dependencies: ['2'],
      category: 'Structure'
    },
    {
      id: '4',
      name: 'Electrical Installation',
      description: 'Install electrical systems',
      progress: 0,
      status: 'not-started',
      startDate: '2024-02-15',
      dueDate: '2024-03-01',
      assignee: 'Omar Mahmoud',
      dependencies: ['3'],
      category: 'MEP'
    }
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      name: 'Foundation Complete',
      description: 'Foundation work completed and cured',
      targetDate: '2024-02-10',
      completedDate: '2024-02-08',
      progress: 100,
      status: 'completed',
      tasks: ['1', '2']
    },
    {
      id: '2',
      name: 'Structure Complete',
      description: 'Main structure framework completed',
      targetDate: '2024-02-25',
      progress: 65,
      status: 'in-progress',
      tasks: ['3']
    },
    {
      id: '3',
      name: 'MEP Systems Complete',
      description: 'Mechanical, Electrical, and Plumbing systems installed',
      targetDate: '2024-03-15',
      progress: 0,
      status: 'upcoming',
      tasks: ['4']
    }
  ]);

  const [progressReports, setProgressReports] = useState<ProgressReport[]>([
    {
      id: '1',
      date: '2024-01-30',
      overallProgress: 35,
      completedTasks: 1,
      totalTasks: 4,
      summary: 'Foundation work completed ahead of schedule. Moving to concrete pouring phase.',
      issues: ['Weather delays expected next week'],
      achievements: ['Foundation completed 2 days early', 'Material procurement on schedule']
    },
    {
      id: '2',
      date: '2024-02-07',
      overallProgress: 52,
      completedTasks: 1,
      totalTasks: 4,
      summary: 'Concrete pouring in progress. Steel framework preparation started.',
      issues: ['Concrete delivery delayed by 1 day'],
      achievements: ['Quality tests passed', 'Safety record maintained']
    }
  ]);

  const [newReport, setNewReport] = useState({
    summary: '',
    issues: '',
    achievements: ''
  });

  // Completion popup state
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [previousProgress, setPreviousProgress] = useState(0);

  // Mock project data for the popup
  const mockProject: Project = {
    id: 'current-project',
    userId: 'mock-user-id',
    name: 'مشروع فيلا الأحلام',
    location: 'الرياض - حي الملك فهد',
    startDate: '2024-01-15',
    progress: 100,
    status: 'completed',
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stage: 'تشطيبات نهائية',
    area: 400,
    projectType: 'residential',
    floorCount: 2,
    roomCount: 5,
    estimations: {
      id: 'est-1',
      projectId: 'current-project',
      calculatorType: 'comprehensive',
      createdAt: new Date().toISOString(),
      materials: [],
      totalCost: 450000, // 450,000 SAR total cost
      phases: {
        foundation: 90000,
        structure: 180000,
        finishing: 120000,
        electrical: 35000,
        plumbing: 25000
      }
    }
  };

  const overallProgress = tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const delayedTasks = tasks.filter(task => task.status === 'delayed').length;
  const activeTasks = tasks.filter(task => task.status === 'in-progress').length;

  // Check for project completion and show popup
  useEffect(() => {
    if (overallProgress >= 100 && previousProgress < 100) {
      setShowCompletionPopup(true);
    }
    setPreviousProgress(overallProgress);
  }, [overallProgress, previousProgress]);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Completion popup handlers
  const handleSellProject = (saleData: { 
    sale_price: number; 
    sale_description: string; 
    for_sale: boolean;
    profit_percentage?: number;
    total_cost?: number;
  }) => {
    console.log('Project marked for sale:', saleData);
    console.log(`Total Cost: ${saleData.total_cost?.toLocaleString('en-US')} SAR`);
    console.log(`Sale Price: ${saleData.sale_price.toLocaleString('en-US')} SAR`);
    console.log(`Profit Percentage: ${saleData.profit_percentage}%`);
    console.log(`Net Profit: ${saleData.sale_price - (saleData.total_cost || 0) - (saleData.sale_price * 0.05)} SAR`);
    // Here you would integrate with your project API to update the project
    // Example: await updateProject(mockProject.id, { ...saleData });
  };

  const handleKeepPrivate = () => {
    console.log('Project kept as showcase only');
    // Here you would update the project to be public but not for sale
    // Example: await updateProject(mockProject.id, { publicDisplay: { isPublic: true, hideCosts: true } });
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <PlayCircle className="w-4 h-4 text-blue-600" />;
      case 'delayed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'on-hold': return <PauseCircle className="w-4 h-4 text-yellow-600" />;
      case 'not-started': return <Clock className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  const getMilestoneStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddReport = () => {
    if (newReport.summary) {
      const report: ProgressReport = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        overallProgress,
        completedTasks,
        totalTasks: tasks.length,
        summary: newReport.summary,
        issues: newReport.issues ? newReport.issues.split('\n').filter(i => i.trim()) : [],
        achievements: newReport.achievements ? newReport.achievements.split('\n').filter(a => a.trim()) : []
      };

      setProgressReports([report, ...progressReports]);
      setNewReport({ summary: '', issues: '', achievements: '' });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Progress Tracking</h1>
        <p className="text-gray-600">Real-time monitoring of construction project progress</p>
        
        {/* Test Button for Completion Popup */}
        <div className="mt-4">
          <Button 
            onClick={() => setShowCompletionPopup(true)}
            variant="outline"
            className="text-sm"
          >
            🧪 Test Completion Popup
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-blue-600">{overallProgress.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-blue-600">{activeTasks}</p>
              </div>
              <PlayCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delayed Tasks</p>
                <p className="text-2xl font-bold text-red-600">{delayedTasks}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm text-gray-600">{overallProgress.toFixed(1)}%</span>
                </div>
                <Progress value={overallProgress} className="w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Task Status Distribution</h4>
                    {Object.entries(
                      tasks.reduce((acc, task) => {
                        acc[task.status] = (acc[task.status] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status as Task['status'])}
                          <span className="text-sm capitalize">{status.replace('-', ' ')}</span>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Category Progress</h4>
                    {Object.entries(
                      tasks.reduce((acc, task) => {
                        if (!acc[task.category]) acc[task.category] = { total: 0, completed: 0 };
                        acc[task.category].total += 1;
                        if (task.status === 'completed') acc[task.category].completed += 1;
                        return acc;
                      }, {} as Record<string, { total: number; completed: number }>)
                    ).map(([category, data]) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">{category}</span>
                          <span className="text-sm">{data.completed}/{data.total}</span>
                        </div>
                        <Progress value={(data.completed / data.total) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(task.status)}
                        <div>
                          <h4 className="font-medium">{task.name}</h4>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{task.progress}%</p>
                          <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                        </div>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Progress value={task.progress} className="w-full" />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Assignee: {task.assignee}</span>
                        <span>Category: {task.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium">{milestone.name}</h4>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{milestone.progress}%</p>
                          <p className="text-xs text-gray-500">
                            {milestone.completedDate ? `Completed: ${milestone.completedDate}` : `Due: ${milestone.targetDate}`}
                          </p>
                        </div>
                        <Badge className={getMilestoneStatusColor(milestone.status)}>
                          {milestone.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={milestone.progress} className="w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Progress Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={newReport.summary}
                  onChange={(e) => setNewReport({...newReport, summary: e.target.value})}
                  placeholder="Brief summary of current progress..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="issues">Issues (one per line)</Label>
                <Textarea
                  id="issues"
                  value={newReport.issues}
                  onChange={(e) => setNewReport({...newReport, issues: e.target.value})}
                  placeholder="List any issues or challenges..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="achievements">Achievements (one per line)</Label>
                <Textarea
                  id="achievements"
                  value={newReport.achievements}
                  onChange={(e) => setNewReport({...newReport, achievements: e.target.value})}
                  placeholder="List achievements and successes..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAddReport} className="w-full">
                Add Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Report - {report.date}</h4>
                          <p className="text-sm text-gray-600">
                            {report.completedTasks}/{report.totalTasks} tasks completed ({report.overallProgress.toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">{report.summary}</p>
                      {report.issues.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-red-600 mb-1">Issues:</h5>
                          <ul className="text-sm text-gray-600">
                            {report.issues.map((issue, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {report.achievements.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-green-600 mb-1">Achievements:</h5>
                          <ul className="text-sm text-gray-600">
                            {report.achievements.map((achievement, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Project Completion Popup */}
      <ProjectCompletionPopup
        project={mockProject}
        isOpen={showCompletionPopup}
        onClose={() => setShowCompletionPopup(false)}
        onSellProject={handleSellProject}
        onKeepPrivate={handleKeepPrivate}
      />
    </div>
  );
}






