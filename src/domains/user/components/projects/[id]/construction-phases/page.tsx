'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/enhanced-components';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/enhanced-components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProjectTrackingService } from '@/core/services/projectTrackingService';
import { Project } from '@/core/shared/types/types';
import { 
  ArrowLeft,
  MapPin,
  Users,
  Shield,
  Hammer,
  Truck,
  FileText,
  CheckCircle,
  Clock,
  Building,
  AlertTriangle,
  ExternalLink,
  Upload,
  Calendar,
  DollarSign,
  Phone,
  Camera,
  Plus,
  Edit,
  Eye,
  Download,
  Share2,
  Search,
  Filter,
  Target,
  Zap,
  Package
} from 'lucide-react';
import { LandPurchaseIntegration } from '@/core/shared/components/integrations/LandPurchaseIntegration';
import ContractorSelectionIntegration from '@/components/integrations/ContractorSelectionIntegration';
import { InsuranceIntegration } from '@/core/shared/components/integrations/InsuranceIntegration';

interface PhaseAction {
  id: string;
  title: string;
  description: string;
  type: 'integration' | 'document' | 'inspection' | 'payment';
  platform?: string;
  url?: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

interface ConstructionPhaseDetail {
  id: string;
  title: string;
  description: string;
  icon: any;
  order: number;
  status: 'pending' | 'active' | 'completed' | 'blocked';
  progress: number;
  startDate?: string;
  endDate?: string;
  estimatedDuration: string;
  actualDuration?: string;
  budget?: number;
  actualCost?: number;
  actions: PhaseAction[];
  integrations: Array<{
    platform?: string;
    description: string;
    url?: string;
    status: 'available' | 'connected' | 'completed';
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadedAt?: string;
    url?: string;
  }>;
  checkpoints: Array<{
    id: string;
    title: string;
    completed: boolean;
    completedAt?: string;
    inspector?: string;
  }>;
}

export default function ConstructionPhasesPage() {
  const { user, session, isLoading, error } = useAuth();
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<ConstructionPhaseDetail[]>([]);
  const [activePhase, setActivePhase] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<ConstructionPhaseDetail | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);

  // Initialize phases with detailed data
  const initializePhases = (): ConstructionPhaseDetail[] => [
    {
      id: 'land-purchase',
      title: 'شراء الأرض',
      description: 'البحث عن وشراء قطعة الأرض المناسبة للمشروع',
      icon: MapPin,
      order: 1,
      status: 'active',
      progress: 30,
      estimatedDuration: '2-4 أسابيع',
      budget: 500000,
      actions: [
        {
          id: 'search-land',
          title: 'البحث عن الأراضي',
          description: 'البحث في منصة عقار للأراضي المتاحة',
          type: 'integration',
          platform: 'sa.aqar.fm',
          url: 'https://sa.aqar.fm',
          completed: false
        },
        {
          id: 'land-inspection',
          title: 'فحص الأرض',
          description: 'فحص فني للأرض والتأكد من صحة الوثائق',
          type: 'inspection',
          completed: false
        },
        {
          id: 'purchase-contract',
          title: 'عقد الشراء',
          description: 'توقيع عقد شراء الأرض',
          type: 'document',
          completed: false
        }
      ],
      integrations: [
        {
          platform: 'sa.aqar.fm',
          description: 'منصة عقار للبحث عن الأراضي المتاحة',
          url: 'https://sa.aqar.fm',
          status: 'available'
        }
      ],
      documents: [
        { id: 'deed', name: 'صك الملكية', type: 'pdf' },
        { id: 'survey', name: 'مخطط المساحة', type: 'pdf' },
        { id: 'contract', name: 'عقد الشراء', type: 'pdf' }
      ],
      checkpoints: [
        { id: 'location-verified', title: 'التحقق من الموقع', completed: false },
        { id: 'documents-verified', title: 'التحقق من الوثائق', completed: false },
        { id: 'payment-completed', title: 'اكتمال الدفع', completed: false }
      ]
    },
    {
      id: 'contractor-selection',
      title: 'اختيار المقاول',
      description: 'اختيار المقاول المناسب والحصول على المخططات',
      icon: Users,
      order: 2,
      status: 'pending',
      progress: 0,
      estimatedDuration: '1-2 أسابيع',
      budget: 50000,
      actions: [
        {
          id: 'ackd-integration',
          title: 'تصفح الخطط الجاهزة',
          description: 'استعراض الخطط المعمارية من منصة ACKD',
          type: 'integration',
          platform: 'ACKD',
          url: 'https://ackd.sa',
          completed: false
        },
        {
          id: 'contractor-search',
          title: 'البحث عن المقاولين',
          description: 'البحث وتقييم المقاولين المتاحين',
          type: 'integration',
          completed: false
        },
        {
          id: 'contract-signing',
          title: 'توقيع العقد',
          description: 'توقيع عقد المقاولة',
          type: 'document',
          completed: false
        }
      ],
      integrations: [
        {
          platform: 'ACKD',
          description: 'منصة ACKD للحصول على مخططات معمارية جاهزة',
          url: 'https://ackd.sa',
          status: 'available'
        }
      ],
      documents: [
        { id: 'contractor-license', name: 'رخصة المقاول', type: 'pdf' },
        { id: 'architectural-plans', name: 'المخططات المعمارية', type: 'dwg' },
        { id: 'contractor-agreement', name: 'عقد المقاولة', type: 'pdf' }
      ],
      checkpoints: [
        { id: 'contractor-verified', title: 'التحقق من المقاول', completed: false },
        { id: 'plans-approved', title: 'اعتماد المخططات', completed: false },
        { id: 'contract-signed', title: 'توقيع العقد', completed: false }
      ]
    },
    {
      id: 'fencing',
      title: 'التسوير',
      description: 'بناء السياج المحيطي للموقع',
      icon: Shield,
      order: 3,
      status: 'pending',
      progress: 0,
      estimatedDuration: '1-2 أسابيع',
      budget: 30000,
      actions: [
        {
          id: 'fencing-quotes',
          title: 'طلب عروض أسعار',
          description: 'الحصول على عروض أسعار من مقدمي خدمات التسوير',
          type: 'integration',
          completed: false
        },
        {
          id: 'fencing-permit',
          title: 'تصريح التسوير',
          description: 'الحصول على تصريح البناء للسياج',
          type: 'document',
          completed: false
        }
      ],
      integrations: [
        {
          description: 'ربط مع مقدمي خدمات التسوير المحليين',
          status: 'available'
        }
      ],
      documents: [
        { id: 'fencing-permit', name: 'تصريح التسوير', type: 'pdf' },
        { id: 'fencing-plan', name: 'مخطط السياج', type: 'pdf' }
      ],
      checkpoints: [
        { id: 'permit-obtained', title: 'الحصول على التصريح', completed: false },
        { id: 'materials-delivered', title: 'توصيل المواد', completed: false },
        { id: 'fencing-completed', title: 'اكتمال التسوير', completed: false }
      ]
    },
    {
      id: 'excavation',
      title: 'الحفر وتجهيز الأرض',
      description: 'أعمال الحفر وتجهيز الموقع للبناء',
      icon: Hammer,
      order: 4,
      status: 'pending',
      progress: 0,
      estimatedDuration: '1-3 أسابيع',
      budget: 80000,
      actions: [
        {
          id: 'soil-test',
          title: 'فحص التربة',
          description: 'إجراء فحص التربة والحصول على التقرير',
          type: 'inspection',
          completed: false
        },
        {
          id: 'excavation-service',
          title: 'خدمة الحفر',
          description: 'التعاقد مع شركة الحفر والتجهيز',
          type: 'integration',
          completed: false
        }
      ],
      integrations: [
        {
          description: 'ربط مع شركات الحفر والتجهيز المعتمدة',
          status: 'available'
        }
      ],
      documents: [
        { id: 'soil-report', name: 'تقرير فحص التربة', type: 'pdf' },
        { id: 'excavation-plan', name: 'مخطط الحفر', type: 'pdf' }
      ],
      checkpoints: [
        { id: 'soil-tested', title: 'فحص التربة', completed: false },
        { id: 'excavation-started', title: 'بدء الحفر', completed: false },
        { id: 'foundation-ready', title: 'جاهزية الأساسات', completed: false }
      ]
    },
    {
      id: 'insurance',
      title: 'إصدار التأمين',
      description: 'الحصول على تأمين شامل للمشروع',
      icon: Shield,
      order: 5,
      status: 'pending',
      progress: 0,
      estimatedDuration: '1 أسبوع',
      budget: 15000,
      actions: [
        {
          id: 'insurance-quotes',
          title: 'عروض التأمين',
          description: 'مقارنة عروض شركات التأمين المختلفة',
          type: 'integration',
          completed: false
        },
        {
          id: 'insurance-contract',
          title: 'عقد التأمين',
          description: 'توقيع عقد التأمين',
          type: 'document',
          completed: false
        }
      ],
      integrations: [
        {
          description: 'ربط مع شركات التأمين المتخصصة في تأمين البناء',
          status: 'available'
        }
      ],
      documents: [
        { id: 'insurance-policy', name: 'وثيقة التأمين', type: 'pdf' },
        { id: 'coverage-details', name: 'تفاصيل التغطية', type: 'pdf' }
      ],
      checkpoints: [
        { id: 'coverage-selected', title: 'اختيار التغطية', completed: false },
        { id: 'premium-paid', title: 'دفع القسط', completed: false },
        { id: 'policy-issued', title: 'إصدار الوثيقة', completed: false }
      ]
    },
    {
      id: 'waste-disposal',
      title: 'إدارة مخلفات البناء',
      description: 'ترتيب خدمات التخلص من مخلفات البناء',
      icon: Truck,
      order: 6,
      status: 'pending',
      progress: 0,
      estimatedDuration: 'مستمر',
      budget: 25000,
      actions: [
        {
          id: 'waste-service',
          title: 'خدمة التخلص من النفايات',
          description: 'التعاقد مع شركة متخصصة في نقل مخلفات البناء',
          type: 'integration',
          completed: false
        }
      ],
      integrations: [
        {
          description: 'ربط مع شركات التخلص من النفايات المعتمدة',
          status: 'available'
        }
      ],
      documents: [
        { id: 'waste-permit', name: 'تصريح نقل النفايات', type: 'pdf' },
        { id: 'disposal-schedule', name: 'جدول النقل', type: 'pdf' }
      ],
      checkpoints: [
        { id: 'service-contracted', title: 'التعاقد مع الخدمة', completed: false },
        { id: 'schedule-set', title: 'تحديد الجدول', completed: false },
        { id: 'disposal-ongoing', title: 'التخلص المستمر', completed: false }
      ]
    },
    {
      id: 'blueprint-approval',
      title: 'اعتماد المخططات',
      description: 'مراجعة واعتماد المخططات من الجهات المختصة',
      icon: FileText,
      order: 7,
      status: 'pending',
      progress: 0,
      estimatedDuration: '2-4 أسابيع',
      budget: 10000,
      actions: [
        {
          id: 'municipality-submission',
          title: 'تقديم للبلدية',
          description: 'تقديم المخططات للبلدية للمراجعة والاعتماد',
          type: 'document',
          completed: false
        },
        {
          id: 'engineering-review',
          title: 'المراجعة الهندسية',
          description: 'مراجعة المخططات من قبل مهندس معتمد',
          type: 'inspection',
          completed: false
        }
      ],
      integrations: [
        {
          description: 'ربط مع البلديات والجهات الحكومية',
          status: 'available'
        }
      ],
      documents: [
        { id: 'architectural-plans', name: 'المخططات المعمارية', type: 'dwg' },
        { id: 'structural-plans', name: 'المخططات الإنشائية', type: 'dwg' },
        { id: 'building-permit', name: 'رخصة البناء', type: 'pdf' }
      ],
      checkpoints: [
        { id: 'plans-submitted', title: 'تقديم المخططات', completed: false },
        { id: 'review-completed', title: 'اكتمال المراجعة', completed: false },
        { id: 'permit-issued', title: 'إصدار الرخصة', completed: false }
      ]
    },
    {
      id: 'execution',
      title: 'التنفيذ والمتابعة',
      description: 'تنفيذ أعمال البناء مع المتابعة المستمرة',
      icon: Building,
      order: 8,
      status: 'pending',
      progress: 0,
      estimatedDuration: '6-12 شهر',
      budget: 800000,
      actions: [
        {
          id: 'construction-monitoring',
          title: 'متابعة التنفيذ',
          description: 'متابعة يومية لسير العمل والتقدم',
          type: 'inspection',
          completed: false
        },
        {
          id: 'quality-control',
          title: 'ضبط الجودة',
          description: 'فحوصات دورية لضمان جودة التنفيذ',
          type: 'inspection',
          completed: false
        }
      ],
      integrations: [
        {
          description: 'ربط مع أنظمة إدارة المشاريع للمتابعة',
          status: 'available'
        }
      ],
      documents: [
        { id: 'progress-reports', name: 'تقارير التقدم', type: 'pdf' },
        { id: 'quality-reports', name: 'تقارير الجودة', type: 'pdf' },
        { id: 'inspection-reports', name: 'تقارير الفحص', type: 'pdf' }
      ],
      checkpoints: [
        { id: 'foundation-completed', title: 'اكتمال الأساسات', completed: false },
        { id: 'structure-completed', title: 'اكتمال الهيكل', completed: false },
        { id: 'finishing-completed', title: 'اكتمال التشطيبات', completed: false }
      ]
    },
    {
      id: 'completion',
      title: 'الإنجاز وشهادة الإشغال',
      description: 'الفحص النهائي والحصول على شهادة الإشغال',
      icon: CheckCircle,
      order: 9,
      status: 'pending',
      progress: 0,
      estimatedDuration: '2-3 أسابيع',
      budget: 5000,
      actions: [
        {
          id: 'final-inspection',
          title: 'الفحص النهائي',
          description: 'فحص نهائي شامل للمبنى',
          type: 'inspection',
          completed: false
        },
        {
          id: 'occupancy-certificate',
          title: 'شهادة الإشغال',
          description: 'الحصول على شهادة الإشغال من البلدية',
          type: 'document',
          completed: false
        }
      ],
      integrations: [
        {
          description: 'ربط مع البلديات لإصدار شهادة الإشغال',
          status: 'available'
        }
      ],
      documents: [
        { id: 'final-inspection-report', name: 'تقرير الفحص النهائي', type: 'pdf' },
        { id: 'occupancy-certificate', name: 'شهادة الإشغال', type: 'pdf' },
        { id: 'completion-certificate', name: 'شهادة الإنجاز', type: 'pdf' }
      ],
      checkpoints: [
        { id: 'inspection-passed', title: 'اجتياز الفحص', completed: false },
        { id: 'documents-submitted', title: 'تقديم الوثائق', completed: false },
        { id: 'certificate-issued', title: 'إصدار الشهادة', completed: false }
      ]
    }
  ];

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const projectData = await ProjectTrackingService.getProjectById(projectId);
      if (projectData) {
        // Map status from service format to expected format and add userId
        let mappedStatus: 'planning' | 'in_progress' | 'completed' | 'cancelled' | 'on-hold' = 'planning';
        switch (projectData.status) {
          case 'active':
            mappedStatus = 'in_progress';
            break;
          case 'planning':
            mappedStatus = 'planning';
            break;
          case 'completed':
            mappedStatus = 'completed';
            break;
          case 'on-hold':
            mappedStatus = 'on-hold';
            break;
          default:
            mappedStatus = 'planning';
        }
        
        // Map projectType to expected format
        let mappedProjectType: 'residential' | 'commercial' | 'industrial' = 'residential';
        if (projectData.projectType) {
          if (['residential', 'commercial', 'industrial'].includes(projectData.projectType)) {
            mappedProjectType = projectData.projectType as 'residential' | 'commercial' | 'industrial';
          } else if (['villa', 'apartment', 'house', 'flat'].includes(projectData.projectType)) {
            mappedProjectType = 'residential';
          } else if (['shop', 'mall', 'office'].includes(projectData.projectType)) {
            mappedProjectType = 'commercial';
          } else if (['factory', 'warehouse'].includes(projectData.projectType)) {
            mappedProjectType = 'industrial';
          }
        }
        
        const projectWithUserId = {
          ...projectData,
          userId: 'unknown', // Add userId as required by the main Project type
          status: mappedStatus,
          projectType: mappedProjectType
        };
        setProject(projectWithUserId);
      }
      
      // Initialize phases
      const initialPhases = initializePhases();
      setPhases(initialPhases);
      
      // Set active phase to first incomplete phase
      const activePhaseId = initialPhases.find(p => p.status !== 'completed')?.id || initialPhases[0].id;
      setActivePhase(activePhaseId);
      
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverallProgress = () => {
    const totalProgress = phases.reduce((acc, phase) => acc + phase.progress, 0);
    return Math.round(totalProgress / phases.length);
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handlePhaseAction = async (phaseId: string, actionId: string) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          actions: phase.actions.map(action => {
            if (action.id === actionId) {
              return {
                ...action,
                completed: !action.completed,
                completedAt: action.completed ? undefined : new Date().toISOString()
              };
            }
            return action;
          })
        };
      }
      return phase;
    }));
  };

  const handleCheckpointToggle = (phaseId: string, checkpointId: string) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          checkpoints: phase.checkpoints.map(checkpoint => {
            if (checkpoint.id === checkpointId) {
              return {
                ...checkpoint,
                completed: !checkpoint.completed,
                completedAt: checkpoint.completed ? undefined : new Date().toISOString()
              };
            }
            return checkpoint;
          })
        };
      }
      return phase;
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">جاري تحميل مراحل المشروع...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">المشروع غير موجود</h1>
          <p className="text-gray-600 mb-4">لم يتم العثور على المشروع المطلوب</p>
          <Button onClick={() => router.push('/user/projects/list')}>
            العودة للمشاريع
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
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
              <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
              <p className="text-gray-600 mt-1">مراحل مشروع البناء التفاعلية</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
              <Share2 className="w-4 h-4 mr-2" />
              مشاركة
            </Button>
            <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
              <Download className="w-4 h-4 mr-2" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Project Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{getOverallProgress()}%</div>
                <div className="text-sm text-gray-600">التقدم الإجمالي</div>
                <Progress value={getOverallProgress()} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{phases.filter(p => p.status === 'completed').length}</div>
                <div className="text-sm text-gray-600">مراحل مكتملة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{phases.filter(p => p.status === 'active').length}</div>
                <div className="text-sm text-gray-600">مراحل نشطة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{phases.length}</div>
                <div className="text-sm text-gray-600">إجمالي المراحل</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phases Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Phases List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  مراحل المشروع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {phases.map((phase, index) => {
                    const Icon = phase.icon;
                    const isActive = activePhase === phase.id;
                    
                    return (
                      <div
                        key={phase.id}
                        className={`p-4 cursor-pointer transition-all border-r-4 ${
                          isActive 
                            ? 'bg-blue-50 border-r-blue-500' 
                            : 'hover:bg-gray-50 border-r-transparent'
                        }`}
                        onClick={() => setActivePhase(phase.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getPhaseStatusColor(phase.status)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-sm">{phase.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {phase.progress}%
                              </Badge>
                            </div>
                            <Progress value={phase.progress} className="h-2" />
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">المرحلة {phase.order}</span>
                              <span className="text-xs text-gray-500">{phase.estimatedDuration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Phase Details */}
          <div className="lg:col-span-2">
            {phases.filter(p => p.id === activePhase).map(phase => {
              const Icon = phase.icon;
              
              return (
                <Card key={phase.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${getPhaseStatusColor(phase.status)}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{phase.title}</CardTitle>
                          <p className="text-gray-600 text-sm mt-1">{phase.description}</p>
                        </div>
                      </div>
                      <Badge className={getPhaseStatusColor(phase.status)}>
                        {phase.status === 'completed' && 'مكتملة'}
                        {phase.status === 'active' && 'نشطة'}
                        {phase.status === 'pending' && 'معلقة'}
                        {phase.status === 'blocked' && 'محجوبة'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="actions" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="actions">الإجراءات</TabsTrigger>
                        <TabsTrigger value="integrations">التكاملات</TabsTrigger>
                        <TabsTrigger value="documents">الوثائق</TabsTrigger>
                        <TabsTrigger value="checkpoints">نقاط الفحص</TabsTrigger>
                      </TabsList>

                      {/* Actions Tab */}
                      <TabsContent value="actions" className="space-y-4">
                        {phase.actions.map(action => (
                          <Card key={action.id} className={`border-l-4 ${
                            action.completed ? 'border-l-green-500 bg-green-50' : 'border-l-gray-300'
                          }`}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold">{action.title}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {action.type === 'integration' && 'تكامل'}
                                      {action.type === 'document' && 'وثيقة'}
                                      {action.type === 'inspection' && 'فحص'}
                                      {action.type === 'payment' && 'دفع'}
                                    </Badge>
                                    {action.platform && (
                                      <Badge variant="secondary" className="text-xs">
                                        {action.platform}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                                  {action.url && (
                                    <a
                                      href={action.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                    >
                                      فتح الرابط
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                                <Button
                                  variant={action.completed ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handlePhaseAction(phase.id, action.id)}
                                  className="mr-4"
                                >
                                  {action.completed ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      مكتمل
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="w-4 h-4 mr-2" />
                                      تنفيذ
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>

                      {/* Integrations Tab */}
                      <TabsContent value="integrations" className="space-y-4">
                        {/* Render specific integrations based on phase */}
                        {phase.id === 'land-purchase' && (
                          <LandPurchaseIntegration 
                            projectId={projectId}
                            onLandSelected={(land) => {
                              console.log('Land selected:', land);
                              // Update project with selected land info
                            }}
                          />
                        )}
                        
                        {phase.id === 'contractor-selection' && (
                          <ContractorSelectionIntegration 
                            onContractorSelected={(contractor: any) => {
                              console.log('Contractor selected:', contractor);
                              // Update project with selected contractor
                            }}
                          />
                        )}
                        
                        {phase.id === 'insurance' && (
                          <InsuranceIntegration 
                            projectId={projectId}
                            onInsuranceSelected={(insurance: any) => {
                              console.log('Insurance selected:', insurance);
                              // Update project with selected insurance
                            }}
                          />
                        )}
                        
                        {/* Generic integrations for other phases */}
                        {!['land-purchase', 'contractor-selection', 'insurance'].includes(phase.id) && 
                          phase.integrations.map((integration, index) => (
                          <Card key={index} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {integration.platform && (
                                      <h4 className="font-semibold">{integration.platform}</h4>
                                    )}
                                    <Badge 
                                      variant={integration.status === 'connected' ? 'default' : 'outline'}
                                      className="text-xs"
                                    >
                                      {integration.status === 'available' && 'متاح'}
                                      {integration.status === 'connected' && 'متصل'}
                                      {integration.status === 'completed' && 'مكتمل'}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                                  {integration.url && (
                                    <a
                                      href={integration.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                    >
                                      زيارة المنصة
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                                <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                                  <Target className="w-4 h-4 mr-2" />
                                  ربط
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>

                      {/* Documents Tab */}
                      <TabsContent value="documents" className="space-y-4">
                        {phase.documents.map(document => (
                          <Card key={document.id} className="border-l-4 border-l-purple-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-8 h-8 text-purple-600" />
                                  <div>
                                    <h4 className="font-semibold">{document.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      {document.type.toUpperCase()} • {document.uploadedAt ? 'مرفوع' : 'غير مرفوع'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {document.uploadedAt ? (
                                    <>
                                      <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        عرض
                                      </Button>
                                      <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                                        <Download className="w-4 h-4 mr-2" />
                                        تحميل
                                      </Button>
                                    </>
                                  ) : (
                                    <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                                      <Upload className="w-4 h-4 mr-2" />
                                      رفع
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>

                      {/* Checkpoints Tab */}
                      <TabsContent value="checkpoints" className="space-y-4">
                        {phase.checkpoints.map(checkpoint => (
                          <Card 
                            key={checkpoint.id} 
                            className={`border-l-4 cursor-pointer ${
                              checkpoint.completed ? 'border-l-green-500 bg-green-50' : 'border-l-gray-300'
                            }`}
                            onClick={() => handleCheckpointToggle(phase.id, checkpoint.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full ${
                                    checkpoint.completed ? 'bg-green-200' : 'bg-gray-200'
                                  }`}>
                                    {checkpoint.completed ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Clock className="w-4 h-4 text-gray-600" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">{checkpoint.title}</h4>
                                    {checkpoint.completedAt && (
                                      <p className="text-sm text-gray-600">
                                        مكتمل في: {new Date(checkpoint.completedAt).toLocaleDateString('en-US')}
                                      </p>
                                    )}
                                    {checkpoint.inspector && (
                                      <p className="text-sm text-gray-600">
                                        المفتش: {checkpoint.inspector}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <Badge variant={checkpoint.completed ? "default" : "outline"}>
                                  {checkpoint.completed ? 'مكتمل' : 'معلق'}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
