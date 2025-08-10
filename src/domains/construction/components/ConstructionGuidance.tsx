'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ConstructionPhotoUploader from './ConstructionPhotoUploader';
import constructionGuidanceService, { ConstructionGuidanceService } from '@/services/constructionGuidanceService';
import type { ConstructionLevel, ProjectLevel } from '@/services/construction';
import { Project, ProjectImage } from '@/core/shared/types/types';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Camera, 
  ExternalLink,
  Play,
  Pause,
  SkipForward,
  Info,
  Shield,
  BookOpen,
  Calendar,
  MapPin,
  Users,
  Settings,
  Download,
  Eye,
  Hammer
} from 'lucide-react';

interface ConstructionGuidanceProps {
  project: Project;
  onPhaseUpdate?: (phaseId: string, completed: boolean) => void;
}

export default function ConstructionGuidance({ project, onPhaseUpdate }: ConstructionGuidanceProps) {
  const [currentPhase, setCurrentPhase] = useState<string>('land-acquisition');
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [projectPhases, setProjectPhases] = useState<ConstructionLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<ConstructionLevel | null>(null);
  const [guidanceData, setGuidanceData] = useState<any>({});

  useEffect(() => {
    // Get construction phases based on project settings (async)
    constructionGuidanceService.getConstructionPhases().then((phases: any) => {
      setProjectPhases(phases as unknown as ConstructionLevel[]);
      if (phases.length > 0) {
        setCurrentPhase(phases[0].id);
      }
    });
  }, [project]);

  const handlePhaseComplete = (phaseId: string) => {
    if (!completedPhases.includes(phaseId)) {
      setCompletedPhases([...completedPhases, phaseId]);
      onPhaseUpdate?.(phaseId, true);
      
      // Move to next phase
      const currentIndex = projectPhases.findIndex(p => p.id === phaseId);
      if (currentIndex < projectPhases.length - 1) {
        setCurrentPhase(projectPhases[currentIndex + 1].id);
      }
    }
  };

  const getPhaseStatus = (phase: ConstructionLevel) => {
    if (completedPhases.includes(phase.id)) {
      return { status: 'completed', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
    } else if (phase.id === currentPhase) {
      return { status: 'active', color: 'bg-blue-100 text-blue-800', icon: <Play className="w-4 h-4" /> };
    } else {
      return { status: 'pending', color: 'bg-gray-100 text-gray-600', icon: <Clock className="w-4 h-4" /> };
    }
  };

  const currentPhaseData = projectPhases.find(p => p.id === currentPhase);
  const overallProgress = (completedPhases.length / projectPhases.length) * 100;
  
  // Get guidance for current phase
  const currentGuidance = currentPhaseData ? ConstructionGuidanceService.getGuidanceForLevel(currentPhaseData.id) : null;

  return (
    <div className="space-y-6">
      {/* Project Timeline Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              خطة تنفيذ المشروع
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-800">
              عدد المستويات: {projectPhases.length} مستوى
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>التقدم الإجمالي</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectPhases.map((phase, index) => {
                const status = getPhaseStatus(phase);
                return (
                  <Card 
                    key={phase.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      phase.id === currentPhase ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setCurrentPhase(phase.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${status.color}`}>
                          {status.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{phase.arabicTitle}</h4>
                          <p className="text-xs text-gray-500">مدة تقديرية: 1-2 أسابيع</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        المرحلة {index + 1}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Phase Details */}
      {currentPhaseData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hammer className="w-5 h-5" />
              {currentPhaseData.arabicTitle}
            </CardTitle>
            <p className="text-gray-600">{currentPhaseData.description}</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="photos">الصور</TabsTrigger>
                <TabsTrigger value="documents">المستندات</TabsTrigger>
                <TabsTrigger value="checkpoints">نقاط الفحص</TabsTrigger>
                <TabsTrigger value="materials">المواد</TabsTrigger>
                <TabsTrigger value="regulations">اللوائح</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      نصائح مهمة
                    </h4>
                    <ul className="space-y-2">
                      {currentGuidance?.tips.map((tip: any, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      تحذيرات مهمة
                    </h4>
                    <ul className="space-y-2">
                      {currentGuidance?.warnings.map((warning: any, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <Button 
                    onClick={() => handlePhaseComplete(currentPhaseData.id)}
                    disabled={completedPhases.includes(currentPhaseData.id)}
                    className="w-full"
                  >
                    {completedPhases.includes(currentPhaseData.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        تم إكمال هذه المرحلة
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        إكمال هذه المرحلة
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="photos" className="space-y-4">
                <ConstructionPhotoUploader
                  projectId={project.id}
                  phaseId={currentPhaseData.id}
                  existingImages={project.images?.filter(img => img.phaseId === currentPhaseData.id) || []}
                  onImageUpload={(images: any) => {
                    // Handle image upload - update project
                    console.log('Images uploaded:', images);
                  }}
                  onImageDelete={(imageId: any) => {
                    // Handle image deletion
                    console.log('Image deleted:', imageId);
                  }}
                  allowPublicToggle={true}
                />
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="grid gap-4">
                  {currentPhaseData.documentationFiles?.map((doc: any) => (
                    <Card key={doc.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <div>
                            <h5 className="font-medium">{doc.arabicTitle}</h5>
                            <p className="text-sm text-gray-600">{doc.source}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.isOfficial && (
                            <Badge variant="default" className="text-xs">رسمي</Badge>
                          )}
                          <Button variant="outline" size="sm" onClick={() => window.open(doc.url, '_blank')}>
                            <Download className="w-4 h-4 mr-1" />
                            تحميل
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="checkpoints" className="space-y-4">
                <div className="grid gap-4">
                  {currentPhaseData.requirements?.map((requirement: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{requirement}</h5>
                        <Badge variant="default" className="text-xs">مطلوب</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">متطلب أساسي لإكمال هذا المستوى</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="materials" className="space-y-4">
                <div className="grid gap-4">
                  {currentGuidance?.bestPractices.map((practice: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h5 className="font-medium">أفضل الممارسات</h5>
                          <p className="text-sm text-gray-600">{practice}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="regulations" className="space-y-4">
                <div className="grid gap-4">
                  {(currentPhaseData as any)?.externalPlatforms?.map((platform: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ExternalLink className="w-5 h-5 text-blue-500" />
                          <div>
                            <h5 className="font-medium">{platform}</h5>
                            <p className="text-sm text-gray-600">منصة خارجية للدعم</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => alert('سيتم التوجه للمنصة الخارجية')}>
                          <ExternalLink className="w-4 h-4 mr-1" />
                          زيارة
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            ملخص المشروع
          </CardTitle>
          <p className="text-sm text-gray-600">معلومات عامة عن المشروع والمستويات</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{projectPhases.length}</div>
              <div className="text-sm text-gray-600">إجمالي المستويات</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedPhases.length}</div>
              <div className="text-sm text-gray-600">المستويات المكتملة</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-gray-600">نسبة التقدم</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




