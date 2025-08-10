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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Camera, 
  FileText, 
  Award, 
  TrendingUp,
  ClipboardCheck,
  Eye,
  Star,
  Target,
  BarChart3
} from 'lucide-react';

interface QualityCheck {
  id: string;
  item: string;
  category: string;
  description: string;
  requirement: string;
  status: 'passed' | 'failed' | 'pending' | 'not-applicable';
  inspector: string;
  inspectionDate: string;
  score: number;
  notes: string;
  photos: string[];
  corrective_action?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface QualityInspection {
  id: string;
  projectArea: string;
  inspectionType: 'pre-construction' | 'in-progress' | 'completion' | 'final';
  inspector: string;
  date: string;
  overallScore: number;
  status: 'passed' | 'failed' | 'conditional' | 'pending';
  checks: QualityCheck[];
  summary: string;
  recommendations: string[];
  nextInspection?: string;
}

interface QualityStandard {
  id: string;
  name: string;
  description: string;
  category: string;
  requirements: string[];
  tolerance: string;
  testMethods: string[];
  frequency: string;
  applicablePhases: string[];
  references: string[];
}

interface QualityMetrics {
  passRate: number;
  averageScore: number;
  totalInspections: number;
  criticalIssues: number;
  improvement: number;
  topIssues: { issue: string; count: number }[];
}

export default function QualityControl() {
  const [activeTab, setActiveTab] = useState('overview');
  const [inspections, setInspections] = useState<QualityInspection[]>([
    {
      id: '1',
      projectArea: 'Foundation - Block A',
      inspectionType: 'completion',
      inspector: 'Eng. Sarah Al-Mahmoud',
      date: '2024-02-10',
      overallScore: 92,
      status: 'passed',
      checks: [
        {
          id: '1-1',
          item: 'Concrete Strength',
          category: 'Structural',
          description: 'Concrete compressive strength test',
          requirement: 'Min 25 MPa at 28 days',
          status: 'passed',
          inspector: 'Eng. Sarah Al-Mahmoud',
          inspectionDate: '2024-02-10',
          score: 95,
          notes: 'Test results: 28.5 MPa - exceeds requirement',
          photos: ['concrete-test-1.jpg', 'concrete-test-2.jpg'],
          priority: 'high'
        },
        {
          id: '1-2',
          item: 'Reinforcement Placement',
          category: 'Structural',
          description: 'Steel reinforcement positioning and spacing',
          requirement: 'As per approved drawings',
          status: 'passed',
          inspector: 'Eng. Sarah Al-Mahmoud',
          inspectionDate: '2024-02-10',
          score: 88,
          notes: 'Minor spacing variation in corner section within tolerance',
          photos: ['rebar-1.jpg'],
          priority: 'medium'
        },
        {
          id: '1-3',
          item: 'Surface Finish',
          category: 'Aesthetic',
          description: 'Concrete surface finish quality',
          requirement: 'Smooth finish, no major defects',
          status: 'failed',
          inspector: 'Eng. Sarah Al-Mahmoud',
          inspectionDate: '2024-02-10',
          score: 65,
          notes: 'Surface irregularities and honeycomb patches detected',
          photos: ['surface-defects.jpg'],
          corrective_action: 'Repair honeycomb areas, apply surface treatment',
          priority: 'medium'
        }
      ],
      summary: 'Foundation inspection completed with overall acceptable quality. Surface finish issues require correction.',
      recommendations: [
        'Improve concrete placement techniques',
        'Enhance quality control during pouring',
        'Additional training for concrete crew'
      ],
      nextInspection: '2024-02-20'
    },
    {
      id: '2',
      projectArea: 'Structural Frame - Level 1',
      inspectionType: 'in-progress',
      inspector: 'Eng. Omar Mahmoud',
      date: '2024-02-12',
      overallScore: 78,
      status: 'conditional',
      checks: [
        {
          id: '2-1',
          item: 'Steel Column Alignment',
          category: 'Structural',
          description: 'Vertical alignment of steel columns',
          requirement: 'Max deviation 5mm',
          status: 'failed',
          inspector: 'Eng. Omar Mahmoud',
          inspectionDate: '2024-02-12',
          score: 60,
          notes: 'Column C-3 shows 8mm deviation from vertical',
          photos: ['column-alignment.jpg'],
          corrective_action: 'Realign column C-3 before concrete placement',
          priority: 'critical'
        },
        {
          id: '2-2',
          item: 'Beam Connections',
          category: 'Structural',
          description: 'Welded beam-to-column connections',
          requirement: 'Full penetration welds per AWS D1.1',
          status: 'passed',
          inspector: 'Eng. Omar Mahmoud',
          inspectionDate: '2024-02-12',
          score: 95,
          notes: 'All welds meet AWS standards, good quality',
          photos: ['weld-quality.jpg'],
          priority: 'high'
        }
      ],
      summary: 'Structural frame inspection shows good welding quality but column alignment issues need immediate attention.',
      recommendations: [
        'Realign column C-3 immediately',
        'Implement more frequent alignment checks',
        'Review installation procedures'
      ],
      nextInspection: '2024-02-15'
    }
  ]);

  const [standards, setStandards] = useState<QualityStandard[]>([
    {
      id: '1',
      name: 'Concrete Quality Standards',
      description: 'Quality requirements for concrete work',
      category: 'Structural',
      requirements: [
        'Compressive strength ≥ 25 MPa at 28 days',
        'Slump test 75-100mm',
        'Air content 4-6%',
        'Water-cement ratio ≤ 0.45'
      ],
      tolerance: '±5% for strength, ±10mm for dimensions',
      testMethods: ['Cube test', 'Slump test', 'Air content test'],
      frequency: 'Every 50 m³ or daily, whichever is more frequent',
      applicablePhases: ['Foundation', 'Structural', 'Finishing'],
      references: ['ASTM C39', 'BS 1881', 'ACI 318']
    },
    {
      id: '2',
      name: 'Steel Reinforcement Standards',
      description: 'Quality requirements for steel reinforcement',
      category: 'Structural',
      requirements: [
        'Grade 60 steel (420 MPa yield strength)',
        'Proper spacing as per drawings',
        'Adequate concrete cover',
        'Proper lap lengths and splices'
      ],
      tolerance: '±10mm for spacing, ±5mm for cover',
      testMethods: ['Tensile test', 'Dimensional check', 'Visual inspection'],
      frequency: 'Every delivery batch, continuous during placement',
      applicablePhases: ['Foundation', 'Structural'],
      references: ['ASTM A615', 'ACI 318', 'Local Building Code']
    },
    {
      id: '3',
      name: 'Welding Quality Standards',
      description: 'Quality requirements for structural welding',
      category: 'Structural',
      requirements: [
        'AWS D1.1 structural welding code',
        'Certified welders only',
        'Proper joint preparation',
        'Complete fusion and penetration'
      ],
      tolerance: 'Per AWS D1.1 acceptance criteria',
      testMethods: ['Visual inspection', 'Ultrasonic testing', 'Dye penetrant'],
      frequency: '100% visual, 10% NDT for critical joints',
      applicablePhases: ['Structural'],
      references: ['AWS D1.1', 'AISC 360', 'Local Standards']
    }
  ]);

  const [newInspection, setNewInspection] = useState({
    projectArea: '',
    inspectionType: 'in-progress',
    inspector: '',
    summary: '',
    recommendations: ''
  });

  const [selectedStandard, setSelectedStandard] = useState<QualityStandard | null>(null);

  const metrics: QualityMetrics = {
    passRate: (inspections.filter(i => i.status === 'passed').length / inspections.length) * 100,
    averageScore: inspections.reduce((sum, i) => sum + i.overallScore, 0) / inspections.length,
    totalInspections: inspections.length,
    criticalIssues: inspections.reduce((sum, i) => sum + i.checks.filter(c => c.priority === 'critical' && c.status === 'failed').length, 0),
    improvement: 5.2, // Mock improvement percentage
    topIssues: [
      { issue: 'Surface finish defects', count: 12 },
      { issue: 'Dimensional deviations', count: 8 },
      { issue: 'Material quality issues', count: 6 },
      { issue: 'Installation errors', count: 4 }
    ]
  };

  const getStatusColor = (status: QualityCheck['status']) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'not-applicable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: QualityCheck['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'not-applicable': return <Eye className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: QualityCheck['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInspectionStatusColor = (status: QualityInspection['status']) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'conditional': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddInspection = () => {
    if (newInspection.projectArea && newInspection.inspector) {
      const inspection: QualityInspection = {
        id: Date.now().toString(),
        projectArea: newInspection.projectArea,
        inspectionType: newInspection.inspectionType as QualityInspection['inspectionType'],
        inspector: newInspection.inspector,
        date: new Date().toISOString().split('T')[0],
        overallScore: 0,
        status: 'pending',
        checks: [],
        summary: newInspection.summary,
        recommendations: newInspection.recommendations ? newInspection.recommendations.split('\n').filter(r => r.trim()) : []
      };

      setInspections([...inspections, inspection]);
      setNewInspection({
        projectArea: '',
        inspectionType: 'in-progress',
        inspector: '',
        summary: '',
        recommendations: ''
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Quality Control</h1>
        <p className="text-gray-600">Quality assurance tools and compliance management</p>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-green-600">{metrics.passRate.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.averageScore.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inspections</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.totalInspections}</p>
              </div>
              <ClipboardCheck className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">{metrics.criticalIssues}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Improvement</p>
                <p className="text-2xl font-bold text-green-600">+{metrics.improvement}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="standards">Standards</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="new-inspection">New Inspection</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="space-y-4">
          <div className="space-y-4">
            {inspections.map((inspection) => (
              <Card key={inspection.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{inspection.projectArea}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {inspection.inspectionType.replace('-', ' ')} inspection by {inspection.inspector}
                      </p>
                      <p className="text-sm text-gray-600">Date: {inspection.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{inspection.overallScore}%</p>
                        <p className="text-xs text-gray-500">Overall Score</p>
                      </div>
                      <Badge className={getInspectionStatusColor(inspection.status)}>
                        {inspection.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Quality Checks</h4>
                      <div className="space-y-2">
                        {inspection.checks.map((check) => (
                          <div key={check.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(check.status)}
                                <div>
                                  <h5 className="font-medium">{check.item}</h5>
                                  <p className="text-sm text-gray-600">{check.description}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-xs text-gray-500">📋 {check.requirement}</span>
                                    <span className="text-xs text-gray-500">📊 {check.score}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(check.priority)}>
                                {check.priority}
                              </Badge>
                              <Badge className={getStatusColor(check.status)}>
                                {check.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-sm text-gray-600">{inspection.summary}</p>
                    </div>

                    {inspection.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Recommendations</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {inspection.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Camera className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">
                            {inspection.checks.reduce((sum, check) => sum + check.photos.length, 0)} photos
                          </span>
                        </div>
                        {inspection.nextInspection && (
                          <div className="text-sm text-gray-500">
                            Next: {inspection.nextInspection}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                          View Details
                        </Button>
                        <Button size="sm" onClick={() => alert('Button clicked')}>
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="standards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quality Standards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {standards.map((standard) => (
                    <div 
                      key={standard.id} 
                      className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedStandard(standard)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{standard.name}</h4>
                          <p className="text-sm text-gray-600">{standard.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{standard.category}</Badge>
                          <Shield className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Standard Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStandard ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedStandard.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Tolerance</h4>
                      <p className="text-sm text-gray-600">{selectedStandard.tolerance}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Test Methods</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedStandard.testMethods.map((method, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Testing Frequency</h4>
                      <p className="text-sm text-gray-600">{selectedStandard.frequency}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Applicable Phases</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedStandard.applicablePhases.map((phase, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {phase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">References</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedStandard.references.map((ref, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {ref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Select a standard to view details</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quality Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Quality Score</span>
                    <span className="text-sm">{metrics.averageScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.averageScore} className="w-full" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pass Rate</span>
                    <span className="text-sm">{metrics.passRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.passRate} className="w-full" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Improvement Rate</span>
                    <span className="text-sm text-green-600">+{metrics.improvement}%</span>
                  </div>
                  <Progress value={metrics.improvement * 10} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Quality Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.topIssues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm">{issue.issue}</span>
                      </div>
                      <Badge variant="outline">{issue.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="new-inspection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule New Inspection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectArea">Project Area</Label>
                  <Input
                    id="projectArea"
                    value={newInspection.projectArea}
                    onChange={(e) => setNewInspection({...newInspection, projectArea: e.target.value})}
                    placeholder="e.g., Foundation - Block A"
                  />
                </div>
                <div>
                  <Label htmlFor="inspectionType">Inspection Type</Label>
                  <select
                    id="inspectionType"
                    value={newInspection.inspectionType}
                    onChange={(e) => setNewInspection({...newInspection, inspectionType: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="pre-construction">Pre-construction</option>
                    <option value="in-progress">In-progress</option>
                    <option value="completion">Completion</option>
                    <option value="final">Final</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="inspector">Inspector</Label>
                  <Input
                    id="inspector"
                    value={newInspection.inspector}
                    onChange={(e) => setNewInspection({...newInspection, inspector: e.target.value})}
                    placeholder="e.g., Eng. Sarah Al-Mahmoud"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={newInspection.summary}
                  onChange={(e) => setNewInspection({...newInspection, summary: e.target.value})}
                  placeholder="Brief summary of inspection scope..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="recommendations">Recommendations</Label>
                <Textarea
                  id="recommendations"
                  value={newInspection.recommendations}
                  onChange={(e) => setNewInspection({...newInspection, recommendations: e.target.value})}
                  placeholder="Initial recommendations (one per line)..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAddInspection} className="w-full">
                Schedule Inspection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}





