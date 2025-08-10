import React, { useState } from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select';

interface ConstructionProject {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'industrial' | 'infrastructure';
  location: string;
  client: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  progress: number;
  phases: ProjectPhase[];
}

interface ProjectPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
  dependencies: string[];
}

export function ProjectPlanner() {
  const [projects, setProjects] = useState<ConstructionProject[]>([
    {
      id: '1',
      name: 'مجمع الرياض التجاري',
      type: 'commercial',
      location: 'الرياض، حي الملقا',
      client: 'شركة التطوير العقاري',
      startDate: '2025-08-01',
      endDate: '2026-08-01',
      budget: 15000000,
      status: 'planning',
      progress: 15,
      phases: [
        {
          id: 'ph1',
          name: 'أعمال الحفر والأساسات',
          startDate: '2025-08-01',
          endDate: '2025-10-01',
          budget: 2500000,
          status: 'pending',
          dependencies: []
        },
        {
          id: 'ph2',
          name: 'الهيكل الخرساني',
          startDate: '2025-10-01',
          endDate: '2025-02-01',
          budget: 5000000,
          status: 'pending',
          dependencies: ['ph1']
        }
      ]
    }
  ]);

  const [showNewProject, setShowNewProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');

  const projectTypes = [
    { value: 'residential', label: 'سكني' },
    { value: 'commercial', label: 'تجاري' },
    { value: 'industrial', label: 'صناعي' },
    { value: 'infrastructure', label: 'بنية تحتية' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Construction Project Management</h1>
        <Button onClick={() => setShowNewProject(true)}>
          + New Project
        </Button>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Active Projects</h3>
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-green-600">+2 this month</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Total Budget</h3>
          <p className="text-2xl font-bold">SAR 85M</p>
          <p className="text-sm text-blue-600">across all projects</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">On Schedule</h3>
          <p className="text-2xl font-bold">89%</p>
          <p className="text-sm text-green-600">meeting deadlines</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Resource Utilization</h3>
          <p className="text-2xl font-bold">76%</p>
          <p className="text-sm text-orange-600">can optimize</p>
        </Card>
      </div>

      {/* Projects List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Current Projects</h2>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-gray-600">{project.location}</p>
                  <p className="text-sm text-gray-500">Client: {project.client}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    SAR {project.budget.toLocaleString('en-US')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium">{new Date(project.startDate).toLocaleDateString('en-US')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium">{new Date(project.endDate).toLocaleDateString('en-US')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => alert(`عرض تفاصيل المشروع ${project.name}`)}>View Details</Button>
                <Button size="sm" variant="outline" onClick={() => alert(`تحرير المشروع ${project.name}`)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => alert(`عرض جدول المشروع ${project.name}`)}>Timeline</Button>
                <Button size="sm" variant="outline" onClick={() => alert(`إدارة موارد المشروع ${project.name}`)}>Resources</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Project Phases Timeline */}
      <Card className="p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Project Timeline - مجمع الرياض التجاري</h2>
        <div className="space-y-4">
          {projects[0]?.phases.map((phase, index) => (
            <div key={phase.id} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${
                  phase.status === 'completed' ? 'bg-green-500' :
                  phase.status === 'in-progress' ? 'bg-blue-500' :
                  'bg-gray-300'
                }`}></div>
                {index < projects[0].phases.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{phase.name}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(phase.startDate).toLocaleDateString('en-US')} - 
                  {new Date(phase.endDate).toLocaleDateString('en-US')}
                </p>
                <p className="text-sm text-gray-500">
                  Budget: SAR {phase.budget.toLocaleString('en-US')}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>Manage</Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Construction Industry KPIs */}
      <Card className="p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Construction Industry KPIs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Safety Score</h4>
            <p className="text-2xl font-bold text-blue-700">94%</p>
            <p className="text-sm text-blue-600">Above industry average</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900">Quality Rating</h4>
            <p className="text-2xl font-bold text-green-700">4.8/5</p>
            <p className="text-sm text-green-600">Client satisfaction</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900">Cost Variance</h4>
            <p className="text-2xl font-bold text-yellow-700">-2.3%</p>
            <p className="text-sm text-yellow-600">Under budget</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900">Schedule Performance</h4>
            <p className="text-2xl font-bold text-purple-700">102%</p>
            <p className="text-sm text-purple-600">Slightly ahead</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProjectPlanner;



