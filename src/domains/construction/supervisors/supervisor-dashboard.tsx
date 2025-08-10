'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui';
import { Progress } from '@/components/ui/Progress';
import { Textarea } from '@/components/ui/Textarea';
import { 
  HardHat, 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText,
  Camera,
  Map,
  Shield,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

interface SupervisorTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedTo: string;
  dueDate: string;
  completedDate?: string;
  location: string;
  estimatedHours: number;
  actualHours?: number;
}

interface QualityInspection {
  id: string;
  area: string;
  inspector: string;
  date: string;
  status: 'passed' | 'failed' | 'pending' | 'requires-revision';
  score: number;
  checklist: {
    item: string;
    status: boolean;
    notes?: string;
  }[];
  photos: string[];
  recommendations: string[];
}

interface SafetyIncident {
  id: string;
  type: 'near-miss' | 'minor-injury' | 'major-injury' | 'property-damage';
  description: string;
  location: string;
  date: string;
  reportedBy: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  corrective_actions: string[];
  photos: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'on-break' | 'off-duty' | 'absent';
  location: string;
  skills: string[];
  experience: number;
  rating: number;
  contact: string;
  shift: 'morning' | 'afternoon' | 'night';
}

export default function SupervisorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState<SupervisorTask[]>([
    {
      id: '1',
      title: 'Foundation Inspection',
      description: 'Inspect foundation concrete quality and dimensions',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Ahmed Hassan',
      dueDate: '2024-02-15',
      location: 'Section A - Foundation',
      estimatedHours: 4,
      actualHours: 2
    },
    {
      id: '2',
      title: 'Safety Equipment Check',
      description: 'Verify all workers have proper safety equipment',
      priority: 'urgent',
      status: 'pending',
      assignedTo: 'Mohammed Ali',
      dueDate: '2024-02-12',
      location: 'All Sections',
      estimatedHours: 2
    },
    {
      id: '3',
      title: 'Material Quality Review',
      description: 'Review and approve incoming steel reinforcement',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'Khalid Ibrahim',
      dueDate: '2024-02-10',
      completedDate: '2024-02-09',
      location: 'Material Storage',
      estimatedHours: 3,
      actualHours: 2.5
    }
  ]);

  const [inspections, setInspections] = useState<QualityInspection[]>([
    {
      id: '1',
      area: 'Foundation - Section A',
      inspector: 'Sarah Ahmed',
      date: '2024-02-10',
      status: 'passed',
      score: 92,
      checklist: [
        { item: 'Concrete strength test', status: true },
        { item: 'Reinforcement placement', status: true },
        { item: 'Surface finish quality', status: true },
        { item: 'Dimension accuracy', status: false, notes: 'Minor deviation in corner section' }
      ],
      photos: ['foundation-1.jpg', 'foundation-2.jpg'],
      recommendations: ['Monitor corner section closely', 'Implement additional quality checks']
    },
    {
      id: '2',
      area: 'Structural Framework',
      inspector: 'Omar Mahmoud',
      date: '2024-02-11',
      status: 'requires-revision',
      score: 75,
      checklist: [
        { item: 'Steel bar positioning', status: false, notes: 'Incorrect spacing in beam B-3' },
        { item: 'Welding quality', status: true },
        { item: 'Connection integrity', status: true },
        { item: 'Alignment check', status: false, notes: 'Column alignment off by 5mm' }
      ],
      photos: ['structure-1.jpg', 'structure-2.jpg'],
      recommendations: ['Correct steel bar spacing', 'Re-align columns', 'Additional supervision required']
    }
  ]);

  const [incidents, setIncidents] = useState<SafetyIncident[]>([
    {
      id: '1',
      type: 'near-miss',
      description: 'Worker nearly slipped on wet concrete surface',
      location: 'Section B - Floor Level 2',
      date: '2024-02-11',
      reportedBy: 'Ahmed Hassan',
      severity: 'medium',
      status: 'investigating',
      corrective_actions: ['Install warning signs', 'Improve drainage system'],
      photos: ['incident-1.jpg']
    },
    {
      id: '2',
      type: 'minor-injury',
      description: 'Worker cut hand on sharp metal edge',
      location: 'Material Storage Area',
      date: '2024-02-09',
      reportedBy: 'Mohammed Ali',
      severity: 'low',
      status: 'resolved',
      corrective_actions: ['First aid provided', 'Sharp edges covered', 'Additional safety training'],
      photos: ['injury-1.jpg', 'injury-2.jpg']
    }
  ]);

  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Ahmed Hassan',
      role: 'Site Engineer',
      status: 'active',
      location: 'Section A',
      skills: ['Concrete work', 'Quality control', 'Safety management'],
      experience: 8,
      rating: 4.8,
      contact: '+966-50-123-4567',
      shift: 'morning'
    },
    {
      id: '2',
      name: 'Mohammed Ali',
      role: 'Foreman',
      status: 'active',
      location: 'Section B',
      skills: ['Team leadership', 'Steel work', 'Equipment operation'],
      experience: 12,
      rating: 4.9,
      contact: '+966-50-234-5678',
      shift: 'morning'
    },
    {
      id: '3',
      name: 'Khalid Ibrahim',
      role: 'Quality Inspector',
      status: 'on-break',
      location: 'Quality Lab',
      skills: ['Material testing', 'Documentation', 'Compliance'],
      experience: 6,
      rating: 4.7,
      contact: '+966-50-345-6789',
      shift: 'afternoon'
    },
    {
      id: '4',
      name: 'Omar Mahmoud',
      role: 'Safety Officer',
      status: 'active',
      location: 'All Sections',
      skills: ['Safety protocols', 'Risk assessment', 'Training'],
      experience: 10,
      rating: 4.8,
      contact: '+966-50-456-7890',
      shift: 'morning'
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    dueDate: '',
    location: '',
    estimatedHours: ''
  });

  const getPriorityColor = (priority: SupervisorTask['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: SupervisorTask['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: SupervisorTask['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getTeamStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-break': return 'bg-yellow-100 text-yellow-800';
      case 'off-duty': return 'bg-gray-100 text-gray-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInspectionStatusColor = (status: QualityInspection['status']) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'requires-revision': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentSeverityColor = (severity: SafetyIncident['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeTasks = tasks.filter(task => task.status === 'in-progress').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const overdueTasks = tasks.filter(task => task.status === 'overdue').length;
  const activeWorkers = team.filter(member => member.status === 'active').length;
  const qualityScore = inspections.reduce((sum, inspection) => sum + inspection.score, 0) / inspections.length;

  const handleAddTask = () => {
    if (newTask.title && newTask.assignedTo && newTask.dueDate) {
      const task: SupervisorTask = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority as SupervisorTask['priority'],
        status: 'pending',
        assignedTo: newTask.assignedTo,
        dueDate: newTask.dueDate,
        location: newTask.location,
        estimatedHours: parseFloat(newTask.estimatedHours) || 0
      };

      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
        location: '',
        estimatedHours: ''
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Supervisor Dashboard</h1>
        <p className="text-gray-600">Advanced supervision tools for construction site management</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-blue-600">{activeTasks}</p>
              </div>
              <ClipboardCheck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
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
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Workers</p>
                <p className="text-2xl font-bold text-blue-600">{activeWorkers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quality Score</p>
                <p className="text-2xl font-bold text-green-600">{qualityScore.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="add-task">Add Task</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(task.status)}
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-gray-600">{task.description}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">📍 {task.location}</span>
                            <span className="text-xs text-gray-500">👤 {task.assignedTo}</span>
                            <span className="text-xs text-gray-500">⏰ {task.estimatedHours}h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Due: {task.dueDate}</p>
                        {task.completedDate && (
                          <p className="text-xs text-green-600">Completed: {task.completedDate}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Inspections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inspections.map((inspection) => (
                  <div key={inspection.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{inspection.area}</h4>
                        <p className="text-sm text-gray-600">Inspector: {inspection.inspector}</p>
                        <p className="text-sm text-gray-600">Date: {inspection.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">{inspection.score}%</p>
                          <p className="text-xs text-gray-500">Quality Score</p>
                        </div>
                        <Badge className={getInspectionStatusColor(inspection.status)}>
                          {inspection.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Checklist Items:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {inspection.checklist.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {item.status ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            )}
                            <span className={item.status ? 'text-green-800' : 'text-red-800'}>
                              {item.item}
                            </span>
                            {item.notes && (
                              <span className="text-xs text-gray-500">- {item.notes}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {inspection.recommendations.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-1">Recommendations:</h5>
                        <ul className="text-sm text-gray-600">
                          {inspection.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{inspection.photos.length} photos</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>View Details</Button>
                        <Button size="sm" onClick={() => alert('Button clicked')}>Follow Up</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safety Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div key={incident.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium capitalize">{incident.type.replace('-', ' ')}</h4>
                        <p className="text-sm text-gray-600">{incident.description}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">📍 {incident.location}</span>
                          <span className="text-xs text-gray-500">👤 {incident.reportedBy}</span>
                          <span className="text-xs text-gray-500">📅 {incident.date}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getIncidentSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <Badge variant="outline">
                          {incident.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Corrective Actions:</h5>
                      <ul className="text-sm text-gray-600">
                        {incident.corrective_actions.map((action, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{incident.photos.length} photos</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>View Report</Button>
                        <Button size="sm" onClick={() => alert('Button clicked')}>Update Status</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.map((member) => (
                  <div key={member.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Map className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{member.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getTeamStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                        <Badge variant="outline">
                          {member.shift}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Experience:</span>
                        <span className="text-sm">{member.experience} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Rating:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{member.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < member.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => alert('Button clicked')}>
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => alert('Button clicked')}>
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-task" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="e.g., Foundation Inspection"
                  />
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select team member</option>
                    {team.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newTask.location}
                    onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                    placeholder="e.g., Section A - Foundation"
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({...newTask, estimatedHours: e.target.value})}
                    placeholder="4"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Detailed description of the task..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAddTask} className="w-full">
                Add Task
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}





