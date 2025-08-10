'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { projectTrackingService } from '@/services'; // ensure instance import
import { Project } from '@/core/shared/types/types';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import GoogleMapsLocationPicker from '@/components/ui/GoogleMapsLocationPicker';
import { 
  ArrowLeft,
  MapPin,
  Users,
  Shield,
  Hammer,
  Truck,
  FileText,
  Home,
  Eye,
  CheckCircle,
  Clock,
  Building,
  Zap,
  Package,
  DollarSign,
  Calendar,
  Link as LinkIcon,
  ExternalLink,
  Search,
  Filter,
  AlertTriangle,
  Plus
} from 'lucide-react';

interface ConstructionPhase {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: any;
  order: number;
  estimatedDuration: string;
  requiredDocuments: string[];
  integrations: {
    platform?: string;
    description: string;
    url?: string;
  }[];
  dependencies: string[];
  checkpoints: string[];
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: string;
}

export default function ConstructionProjectCreationPage() {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    location: '',
    locationCoordinates: { lat: 0, lng: 0 },
    landSize: '',
    plotType: 'villa',
    budget: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    timeline: '',
    phases: [] as string[]
  });

  // Construction phases based on your requirements
  const constructionPhases: ConstructionPhase[] = [
    {
      id: 'land-purchase',
      title: 'شراء الأرض',
      titleEn: 'Land Purchase',
      description: 'الخطوة الأولى في رحلة البناء وهي شراء الأرض. يمكن للمستخدمين اختيار أو عرض القطع المتاحة.',
      icon: MapPin,
      order: 1,
      estimatedDuration: '2-4 أسابيع',
      requiredDocuments: ['صك الملكية', 'مخطط الأرض', 'شهادة المساحة'],
      integrations: [
        {
          platform: 'sa.aqar.fm',
          description: 'جلب القطع المتاحة من المنصة لعرض الأراضي للبيع حسب الموقع والحجم',
          url: 'https://sa.aqar.fm'
        }
      ],
      dependencies: [],
      checkpoints: [
        'تحديد المنطقة المطلوبة',
        'فحص الأرض والتأكد من صحة الوثائق',
        'التفاوض على السعر',
        'إتمام عملية الشراء'
      ],
      isActive: true,
      isCompleted: false
    },
    {
      id: 'contractor-selection',
      title: 'اختيار المقاول',
      titleEn: 'Contractor Selection',
      description: 'بعد شراء الأرض، تتضمن المرحلة التالية اختيار مقاول للمضي قدما في المشروع.',
      icon: Users,
      order: 2,
      estimatedDuration: '1-2 أسابيع',
      requiredDocuments: ['تراخيص المقاول', 'أعمال سابقة', 'عقد التعاقد'],
      integrations: [
        {
          platform: 'ACKD',
          description: 'السماح للمستخدمين بالتكامل مع تطبيق ACKD لاختيار الخطط الجاهزة لأنواع المباني المختلفة',
          url: 'https://ackd.sa'
        }
      ],
      dependencies: ['land-purchase'],
      checkpoints: [
        'البحث وتصفية المقاولين',
        'مراجعة التقييمات والمراجعات',
        'طلب عروض أسعار',
        'اختيار المقاول المناسب'
      ],
      isActive: false,
      isCompleted: false
    },
    {
      id: 'fencing',
      title: 'التسوير',
      titleEn: 'Fencing',
      description: 'هذه المرحلة تتضمن بناء السياج المحيطي حول الأرض.',
      icon: Shield,
      order: 3,
      estimatedDuration: '1-2 أسابيع',
      requiredDocuments: ['تصريح البناء', 'مخطط التسوير'],
      integrations: [
        {
          description: 'توفير مقدمي خدمات التسوير المحليين',
        }
      ],
      dependencies: ['contractor-selection'],
      checkpoints: [
        'تحديد نوع السياج المطلوب',
        'الحصول على التصاريح',
        'بدء أعمال التسوير',
        'فحص واستلام الأعمال'
      ],
      isActive: false,
      isCompleted: false
    },
    {
      id: 'excavation',
      title: 'الحفر وتجهيز الأرض',
      titleEn: 'Excavation and Site Preparation',
      description: 'تجهيز الموقع يشمل الحفر للأساسات وتنظيف الأرض للبناء.',
      icon: Hammer,
      order: 4,
      estimatedDuration: '1-3 أسابيع',
      requiredDocuments: ['مخطط الحفر', 'تقرير التربة'],
      integrations: [
        {
          description: 'ربط مع شركات متخصصة في تنظيف الأراضي والحفر',
        }
      ],
      dependencies: ['fencing'],
      checkpoints: [
        'فحص التربة',
        'تحديد أعماق الحفر',
        'بدء أعمال الحفر',
        'تجهيز الأساسات'
      ],
      isActive: false,
      isCompleted: false
    },
    {
      id: 'insurance',
      title: 'إصدار التأمين',
      titleEn: 'Insurance',
      description: 'بمجرد وضع الأرض والأساس، الخطوة المهمة التالية هي الحصول على تأمين البناء.',
      icon: Shield,
      order: 5,
      estimatedDuration: '1 أسبوع',
      requiredDocuments: ['وثيقة التأمين', 'تقدير قيمة المشروع'],
      integrations: [
        {
          description: 'ربط مع شركات التأمين المتخصصة في تغطية البناء',
        }
      ],
      dependencies: ['excavation'],
      checkpoints: [
        'اختيار نوع التأمين المناسب',
        'مراجعة أسعار الأقساط',
        'توقيع العقد',
        'بدء التغطية التأمينية'
      ],
      isActive: false,
      isCompleted: false
    },
    {
      id: 'waste-disposal',
      title: 'مخلفات البناء',
      titleEn: 'Construction Waste Disposal',
      description: 'إدارة النفايات المتولدة من أنشطة البناء أمر ضروري لإنجاز المشروع.',
      icon: Truck,
      order: 6,
      estimatedDuration: 'مستمر',
      requiredDocuments: ['تصريح نقل النفايات'],
      integrations: [
        {
          description: 'شراكة مع شركات التخلص من النفايات',
        }
      ],
      dependencies: ['insurance'],
      checkpoints: [
        'تقدير كمية النفايات',
        'اختيار شركة التخلص من النفايات',
        'جدولة عمليات النقل',
        'التأكد من التخلص الآمن'
      ],
      isActive: false,
      isCompleted: false
    },
    {
      id: 'blueprint-approval',
      title: 'مراجعة وموافقة على المخططات',
      titleEn: 'Blueprint Review and Approval',
      description: 'قبل بدء البناء الفعلي، تحتاج الخطط المعمارية والهندسية إلى مراجعة وموافقة.',
      icon: FileText,
      order: 7,
      estimatedDuration: '2-4 أسابيع',
      requiredDocuments: ['المخططات المعمارية', 'المخططات الإنشائية', 'موافقة البلدية'],
      integrations: [
        {
          description: 'ربط مع الشركات الهندسية المرخصة',
        },
        {
          description: 'واجهة مع السلطات المحلية أو الهيئات البلدية',
        }
      ],
      dependencies: ['waste-disposal'],
      checkpoints: [
        'رفع المخططات للمراجعة',
        'مراجعة المتطلبات المحلية',
        'الحصول على الموافقات',
        'إصدار رخصة البناء'
      ],
      isActive: false,
      isCompleted: false
    },
    {
      id: 'execution',
      title: 'التنفيذ والمتابعة',
      titleEn: 'Execution and Monitoring',
      description: 'هذه المرحلة تشمل عملية البناء الفعلية، والتي تحتاج إلى مراقبة وإدارة بكفاءة.',
      icon: Building,
      order: 8,
      estimatedDuration: '6-12 شهر',
      requiredDocuments: ['تقارير التقدم', 'تقارير الفحص'],
      integrations: [
        {
          description: 'ربط مع أدوات إدارة البناء للتتبع في الوقت الفعلي',
        }
      ],
      dependencies: ['blueprint-approval'],
      checkpoints: [
        'بدء أعمال البناء',
        'مراقبة التقدم',
        'فحص المراحل',
        'إدارة الجودة'
      ],
      isActive: false,
      isCompleted: false
    },
    {
      id: 'completion',
      title: 'إنهاء المشروع وإصدار شهادة الإشغال',
      titleEn: 'Project Completion and Occupancy Certificate',
      description: 'عند اكتمال البناء، يتم إصدار شهادة الإشغال بعد الفحص النهائي.',
      icon: CheckCircle,
      order: 9,
      estimatedDuration: '2-3 أسابيع',
      requiredDocuments: ['تقرير الفحص النهائي', 'شهادة الإشغال'],
      integrations: [
        {
          description: 'ربط مع السلطات المحلية لتقديم الوثائق',
        }
      ],
      dependencies: ['execution'],
      checkpoints: [
        'الفحص النهائي',
        'تقديم الوثائق للسلطات',
        'الحصول على الموافقة',
        'إصدار شهادة الإشغال'
      ],
      isActive: false,
      isCompleted: false
    }
  ];

  const handlePhaseToggle = (phaseId: string) => {
    setProjectData(prev => ({
      ...prev,
      phases: prev.phases.includes(phaseId)
        ? prev.phases.filter(id => id !== phaseId)
        : [...prev.phases, phaseId]
    }));
  };

  const handleCreateProject = async () => {
    if (!projectData.name.trim()) {
      alert('يرجى إدخال اسم المشروع');
      return;
    }

    try {
      setLoading(true);
      
      // Map custom plotType to allowed values
      let mappedProjectType: 'residential' | 'commercial' | 'industrial' = 'residential';
      if (['residential', 'commercial', 'industrial'].includes(projectData.plotType)) {
        mappedProjectType = projectData.plotType as 'residential' | 'commercial' | 'industrial';
      } else if (['villa', 'apartment', 'house', 'flat'].includes(projectData.plotType)) {
        mappedProjectType = 'residential' as 'residential';
      } else if (['shop', 'mall', 'office'].includes(projectData.plotType)) {
        mappedProjectType = 'commercial' as 'commercial';
      } else if (['factory', 'warehouse'].includes(projectData.plotType)) {
        mappedProjectType = 'industrial' as 'industrial';
      }
      const newProject: Project = {
        id: Date.now().toString(),
        userId: 'current-user', // TODO: Get actual user ID
        name: projectData.name.trim(),
        description: projectData.description.trim(),
        area: parseFloat(projectData.landSize) || 0,
        projectType: mappedProjectType,
        floorCount: 1,
        roomCount: 4,
        stage: 'تخطيط',
        progress: 0,
        status: 'planning',
        location: projectData.location,
        budget: parseFloat(projectData.budget) || 0,
        clientName: projectData.clientName,
        selectedPhases: projectData.phases,
        enablePhotoTracking: true,
        enableProgressTracking: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await projectTrackingService.saveProject(newProject);
      router.push(`/user/comprehensive-construction-calculator?projectId=${newProject.id}`);
      
    } catch (error) {
      console.error('Error creating construction project:', error);
      alert('حدث خطأ أثناء إنشاء المشروع');
    } finally {
      setLoading(false);
    }
  };

  const getPhaseProgress = () => {
    const completedPhases = constructionPhases.filter(phase => 
      projectData.phases.includes(phase.id)
    ).length;
    return projectData.phases.length > 0 ? (completedPhases / projectData.phases.length) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">إنشاء مشروع بناء</h1>
            <p className="text-gray-600 mt-1">دليل شامل لمراحل مشروع البناء مع التكاملات الخارجية</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="phases">مراحل البناء</TabsTrigger>
            <TabsTrigger value="project-info">معلومات المشروع</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  مراحل مشروع البناء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {constructionPhases.map((phase) => {
                    const Icon = phase.icon;
                    return (
                      <Card key={phase.id} className="border-2 transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Icon className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-sm">{phase.title}</h3>
                                <p className="text-xs text-gray-500">المرحلة {phase.order}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {phase.estimatedDuration}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {phase.description}
                          </p>
                          <div className="space-y-2">
                            <div className="text-xs">
                              <span className="font-medium">التكاملات:</span>
                              <div className="mt-1">
                                {phase.integrations.map((integration, idx) => (
                                  <div key={idx} className="flex items-center gap-1 text-blue-600">
                                    {integration.platform && (
                                      <>
                                        <LinkIcon className="w-3 h-3" />
                                        <span>{integration.platform}</span>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="text-xs">
                              <span className="font-medium">نقاط الفحص:</span>
                              <span className="text-gray-500 mr-1">{phase.checkpoints.length} نقطة</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phases Selection Tab */}
          <TabsContent value="phases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hammer className="w-5 h-5" />
                  اختيار مراحل البناء للتتبع
                </CardTitle>
                <p className="text-sm text-gray-600">
                  اختر المراحل التي تريد تتبعها في مشروعك
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {constructionPhases.map((phase) => {
                    const Icon = phase.icon;
                    const isSelected = projectData.phases.includes(phase.id);
                    
                    return (
                      <Card 
                        key={phase.id} 
                        className={`border-2 cursor-pointer transition-all ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePhaseToggle(phase.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2 rounded-lg ${
                                isSelected ? 'bg-blue-200' : 'bg-gray-100'
                              }`}>
                                <Icon className={`w-5 h-5 ${
                                  isSelected ? 'text-blue-600' : 'text-gray-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold">{phase.title}</h3>
                                  <Badge variant="outline">المرحلة {phase.order}</Badge>
                                  <Badge variant="secondary">{phase.estimatedDuration}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  {phase.description}
                                </p>
                                
                                {/* Integrations */}
                                <div className="space-y-2 mb-3">
                                  <h4 className="text-sm font-medium text-gray-700">التكاملات المتاحة:</h4>
                                  {phase.integrations.map((integration, idx) => (
                                    <div key={idx} className="bg-gray-50 p-2 rounded text-xs">
                                      <div className="flex items-center gap-2 mb-1">
                                        {integration.platform && (
                                          <>
                                            <LinkIcon className="w-3 h-3 text-blue-500" />
                                            <span className="font-medium text-blue-600">
                                              {integration.platform}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                      <p className="text-gray-600">{integration.description}</p>
                                      {integration.url && (
                                        <a 
                                          href={integration.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-500 hover:underline flex items-center gap-1 mt-1"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          زيارة المنصة
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {/* Checkpoints */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-700">نقاط الفحص:</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                    {phase.checkpoints.map((checkpoint, idx) => (
                                      <div key={idx} className="flex items-center gap-2 text-xs">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        <span>{checkpoint}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Required Documents */}
                                <div className="mt-3">
                                  <h4 className="text-sm font-medium text-gray-700 mb-1">الوثائق المطلوبة:</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {phase.requiredDocuments.map((doc, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {doc}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4">
                              {isSelected && (
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Progress Summary */}
                {projectData.phases.length > 0 && (
                  <Card className="mt-6 bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">ملخص المراحل المحددة</h3>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-sm">تم اختيار {projectData.phases.length} مرحلة</span>
                        <Progress value={getPhaseProgress()} className="flex-1" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {projectData.phases.map(phaseId => {
                          const phase = constructionPhases.find(p => p.id === phaseId);
                          return phase ? (
                            <Badge key={phaseId} variant="default" className="text-xs">
                              {phase.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Information Tab */}
          <TabsContent value="project-info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  معلومات المشروع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      اسم المشروع *
                    </label>
                    <Input
                      value={projectData.name}
                      onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="مثال: فيلا العائلة الحديثة"
                      required
                    />
                  </div>

                  {/* Location with Google Maps */}
                  <div>
                    <GoogleMapsLocationPicker
                      onLocationSelected={(location: { lat: number; lng: number }) => {
                        setProjectData(prev => ({
                          ...prev,
                          location: `${location.lat}, ${location.lng}`,
                          locationCoordinates: { lat: location.lat, lng: location.lng }
                        }));
                      }}
                      defaultLocation={
                        projectData.location && projectData.locationCoordinates.lat !== 0
                          ? {
                              lat: projectData.locationCoordinates.lat,
                              lng: projectData.locationCoordinates.lng
                            }
                          : undefined
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Land Size */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      مساحة الأرض (متر مربع) *
                    </label>
                    <Input
                      type="number"
                      value={projectData.landSize}
                      onChange={(e) => setProjectData(prev => ({ ...prev, landSize: e.target.value }))}
                      placeholder="500"
                      required
                    />
                  </div>

                  {/* Plot Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      نوع العقار
                    </label>
                    <select
                      value={projectData.plotType}
                      onChange={(e) => setProjectData(prev => ({ ...prev, plotType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="villa">فيلا</option>
                      <option value="apartment">شقة</option>
                      <option value="chalet">شاليه</option>
                      <option value="commercial">تجاري</option>
                      <option value="warehouse">مستودع</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الميزانية المقدرة (ريال سعودي)
                    </label>
                    <Input
                      type="number"
                      value={projectData.budget}
                      onChange={(e) => setProjectData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="1000000"
                    />
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      المدة الزمنية المتوقعة
                    </label>
                    <Input
                      value={projectData.timeline}
                      onChange={(e) => setProjectData(prev => ({ ...prev, timeline: e.target.value }))}
                      placeholder="12 شهر"
                    />
                  </div>
                </div>

                {/* Client Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">معلومات العميل</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        اسم العميل
                      </label>
                      <Input
                        value={projectData.clientName}
                        onChange={(e) => setProjectData(prev => ({ ...prev, clientName: e.target.value }))}
                        placeholder="أحمد محمد"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        رقم الهاتف
                      </label>
                      <Input
                        value={projectData.clientPhone}
                        onChange={(e) => setProjectData(prev => ({ ...prev, clientPhone: e.target.value }))}
                        placeholder="+966501234567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        البريد الإلكتروني
                      </label>
                      <Input
                        type="email"
                        value={projectData.clientEmail}
                        onChange={(e) => setProjectData(prev => ({ ...prev, clientEmail: e.target.value }))}
                        placeholder="ahmed@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    وصف المشروع
                  </label>
                  <Textarea
                    value={projectData.description}
                    onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف تفصيلي لمشروع البناء..."
                    rows={4}
                  />
                </div>

                {/* Project Summary */}
                {(projectData.name || projectData.location || projectData.landSize) && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-800 mb-2">ملخص المشروع</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {projectData.name && (
                          <div>
                            <span className="text-gray-600">الاسم:</span>
                            <p className="font-medium">{projectData.name}</p>
                          </div>
                        )}
                        {projectData.location && (
                          <div>
                            <span className="text-gray-600">الموقع:</span>
                            <p className="font-medium">{projectData.location}</p>
                          </div>
                        )}
                        {projectData.landSize && (
                          <div>
                            <span className="text-gray-600">المساحة:</span>
                            <p className="font-medium">{projectData.landSize} م²</p>
                          </div>
                        )}
                        {projectData.budget && (
                          <div>
                            <span className="text-gray-600">الميزانية:</span>
                            <p className="font-medium">{parseInt(projectData.budget).toLocaleString('en-US')} ريال</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-600">
            {projectData.phases.length > 0 && (
              <span>تم اختيار {projectData.phases.length} مرحلة للتتبع</span>
            )}
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/user/projects/list')}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={loading || !projectData.name.trim()}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  إنشاء المشروع...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  إنشاء مشروع البناء
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}





