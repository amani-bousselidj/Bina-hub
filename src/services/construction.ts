// Enhanced Construction Guidance Service
// Integrated with formal documents and external platforms

import { BaseService } from './base-service';
import { LandListing } from './constructionIntegrationService';

export interface ConstructionPhase {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  order: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  estimatedDuration: string;
  duration: number; // in days
  dependencies?: string[];
  checkpoints: QualityCheckpoint[];
  tips: string[];
  warnings: string[];
  documents: DocumentationFile[];
  materials: Material[];
  regulations: Regulation[];
}

export interface QualityCheckpoint {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  isRequired: boolean;
  mandatory: boolean;
  status: 'pending' | 'passed' | 'failed';
  checkDate?: Date;
  notes?: string;
  inspectionType: 'self' | 'supervisor' | 'official';
  photos?: string[];
  criteria: string[];
}

export interface Material {
  id: string;
  materialId?: string;
  name: string;
  arabicName: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  sbcCompliant?: boolean;
  specifications?: string[];
  suppliers?: string[];
}

export interface Regulation {
  id: string;
  title: string;
  arabicTitle: string;
  code?: string;
  description: string;
  authority: string;
  url?: string;
  documentUrl?: string;
  section?: string;
  requirement?: string;
}

export interface ProjectGuidanceSettings {
  projectType: 'residential' | 'commercial' | 'industrial';
  area: number;
  floors: number;
  compliance: 'basic' | 'enhanced' | 'premium';
  supervision: 'self' | 'engineer' | 'contractor';
  location: string;
}

export interface ConstructionLevel {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  order: number;
  hasExternalIntegration: boolean;
  externalPlatforms?: string[];
  documentationFiles: DocumentationFile[];
  requirements: string[];
  estimatedDuration: string;
  estimatedCost?: {
    min: number;
    max: number;
    currency: string;
  };
  dependencies?: string[]; // Other levels that must be completed first
}

export interface DocumentationFile {
  id: string;
  title: string;
  arabicTitle: string;
  name?: string; // alias for title
  type: 'pdf' | 'doc' | 'guide' | 'checklist';
  url: string;
  description: string;
  topics: string[];
  isOfficial: boolean;
  source: string;
  authority?: string;
  required?: boolean;
  templateUrl?: string;
}

export interface ProjectLevel {
  levelId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  startDate?: Date;
  completionDate?: Date;
  selectedOptions?: Record<string, any>;
  documents?: string[]; // IDs of completed documents
  notes?: string;
  progress: number; // 0-100
}

export interface ConstructionProject {
  id: string;
  name: string;
  description: string;
  location: string;
  area: number;
  budget: number;
  clientName: string;
  projectType: 'residential' | 'commercial' | 'industrial';
  levels: ProjectLevel[];
  currentLevel: string;
  overallProgress: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ConstructionGuidanceService extends BaseService {
  private static readonly DRIVE_BASE_URL = 'https://drive.google.com/drive/folders/1e3V8i3wQrhl9tqbhZ6JMWgaW1gEH0KMS';

  static getConstructionLevels(): ConstructionLevel[] {
    return [
      {
        id: 'land-acquisition',
        title: 'Land Acquisition',
        arabicTitle: 'حجز وشراء الأرض',
        description: 'البحث عن الأرض المناسبة وإجراءات الشراء والتسجيل',
        order: 1,
        hasExternalIntegration: true,
        externalPlatforms: ['sa.aqar.fm', 'sakani.sa'],
        estimatedDuration: '2-4 أسابيع',
        estimatedCost: { min: 100000, max: 2000000, currency: 'SAR' },
        requirements: [
          'تحديد الموقع المطلوب',
          'تحديد المساحة المطلوبة',
          'تحديد الميزانية',
          'الحصول على تمويل (إن لزم الأمر)'
        ],
        documentationFiles: [
          {
            id: 'land-purchase-guide',
            title: 'Land Purchase Complete Guide',
            arabicTitle: 'دليل شراء الأراضي الشامل',
            type: 'pdf',
            url: `${this.DRIVE_BASE_URL}/land-purchase-guide.pdf`,
            description: 'دليل شامل لعملية شراء الأراضي في المملكة العربية السعودية',
            topics: ['إجراءات الشراء', 'الوثائق المطلوبة', 'التمويل العقاري', 'التسجيل في الطابو'],
            isOfficial: true,
            source: 'وزارة العدل - مصلحة الطابو'
          },
          {
            id: 'sakani-program-guide',
            title: 'Sakani Housing Program Guide',
            arabicTitle: 'دليل برنامج سكني للإسكان',
            type: 'guide',
            url: `${this.DRIVE_BASE_URL}/sakani-program.pdf`,
            description: 'دليل التقديم على برنامج سكني والحصول على أرض مجانية',
            topics: ['شروط التقديم', 'المستندات المطلوبة', 'آلية التقييم', 'الحصول على الأرض'],
            isOfficial: true,
            source: 'وزارة الإسكان - برنامج سكني'
          }
        ]
      },
      {
        id: 'design-approval',
        title: 'Design and Permits',
        arabicTitle: 'التصميم والتراخيص',
        description: 'إعداد التصميم المعماري والحصول على تراخيص البناء',
        order: 2,
        hasExternalIntegration: true,
        externalPlatforms: ['ackdconsult.com', 'sakani.sa'],
        estimatedDuration: '4-8 أسابيع',
        estimatedCost: { min: 15000, max: 50000, currency: 'SAR' },
        dependencies: ['land-acquisition'],
        requirements: [
          'مسح الأرض',
          'إعداد التصميم المعماري',
          'إعداد التصميم الإنشائي',
          'الحصول على رخصة البناء'
        ],
        documentationFiles: [
          {
            id: 'building-permit-guide',
            title: 'Building Permit Application Guide',
            arabicTitle: 'دليل التقديم على رخصة البناء',
            type: 'pdf',
            url: `${this.DRIVE_BASE_URL}/building-permit-guide.pdf`,
            description: 'دليل شامل للحصول على رخصة البناء من الأمانة',
            topics: ['المستندات المطلوبة', 'الرسوم', 'مراحل الموافقة', 'الشروط والمتطلبات'],
            isOfficial: true,
            source: 'أمانة المنطقة - إدارة التراخيص'
          },
          {
            id: 'saudi-building-code',
            title: 'Saudi Building Code (SBC)',
            arabicTitle: 'كود البناء السعودي',
            type: 'pdf',
            url: `${this.DRIVE_BASE_URL}/saudi-building-code.pdf`,
            description: 'كود البناء السعودي - المتطلبات والمعايير',
            topics: ['المعايير الإنشائية', 'معايير السلامة', 'المتطلبات البيئية', 'التصميم المعماري'],
            isOfficial: true,
            source: 'الهيئة السعودية للمواصفات والمقاييس والجودة'
          }
        ]
      },
      {
        id: 'contractor-selection',
        title: 'Contractor Selection',
        arabicTitle: 'اختيار المقاول',
        description: 'اختيار المقاول المناسب والتعاقد معه',
        order: 3,
        hasExternalIntegration: true,
        externalPlatforms: ['sca.sa', 'comyon.com'],
        estimatedDuration: '1-2 أسبوع',
        dependencies: ['design-approval'],
        requirements: [
          'البحث عن مقاولين معتمدين',
          'طلب عروض أسعار',
          'مقارنة العروض',
          'التعاقد مع المقاول'
        ],
        documentationFiles: [
          {
            id: 'contractor-selection-guide',
            title: 'Contractor Selection Guide',
            arabicTitle: 'دليل اختيار المقاول',
            type: 'guide',
            url: `${this.DRIVE_BASE_URL}/contractor-selection.pdf`,
            description: 'دليل شامل لاختيار المقاول المناسب للمشروع',
            topics: ['معايير الاختيار', 'التحقق من التراخيص', 'مقارنة العروض', 'نموذج العقد'],
            isOfficial: false,
            source: 'غرفة التجارة والصناعة'
          },
          {
            id: 'construction-contract-template',
            title: 'Construction Contract Template',
            arabicTitle: 'نموذج عقد المقاولة',
            type: 'doc',
            url: `${this.DRIVE_BASE_URL}/construction-contract.pdf`,
            description: 'نموذج عقد مقاولة شامل يحمي حقوق جميع الأطراف',
            topics: ['بنود العقد', 'الضمانات', 'آلية الدفع', 'حل النزاعات'],
            isOfficial: true,
            source: 'وزارة العدل'
          }
        ]
      },
      {
        id: 'foundation-work',
        title: 'Foundation Work',
        arabicTitle: 'أعمال الأساسات',
        description: 'حفر الأساسات وصب القواعد',
        order: 4,
        hasExternalIntegration: false,
        estimatedDuration: '2-4 أسابيع',
        dependencies: ['contractor-selection'],
        requirements: [
          'مسح الموقع وتحديد المناسيب',
          'حفر الأساسات',
          'تركيب حديد التسليح',
          'صب الخرسانة'
        ],
        documentationFiles: [
          {
            id: 'foundation-construction-guide',
            title: 'Foundation Construction Guide',
            arabicTitle: 'دليل تنفيذ الأساسات',
            type: 'pdf',
            url: `${this.DRIVE_BASE_URL}/foundation-guide.pdf`,
            description: 'دليل تقني لتنفيذ أعمال الأساسات والقواعد',
            topics: ['أنواع الأساسات', 'حديد التسليح', 'خلطات الخرسانة', 'ضبط الجودة'],
            isOfficial: true,
            source: 'الهيئة السعودية للمهندسين'
          }
        ]
      },
      {
        id: 'structural-work',
        title: 'Structural Work',
        arabicTitle: 'الأعمال الإنشائية',
        description: 'بناء الهيكل الخرساني والجدران',
        order: 5,
        hasExternalIntegration: false,
        estimatedDuration: '6-12 أسبوع',
        dependencies: ['foundation-work'],
        requirements: [
          'صب الأعمدة والجسور',
          'صب البلاطات',
          'بناء الجدران',
          'تركيب الأبواب والشبابيك'
        ],
        documentationFiles: [
          {
            id: 'structural-construction-guide',
            title: 'Structural Construction Guide',
            arabicTitle: 'دليل الأعمال الإنشائية',
            type: 'pdf',
            url: `${this.DRIVE_BASE_URL}/structural-guide.pdf`,
            description: 'دليل تنفيذ الأعمال الإنشائية والخرسانية',
            topics: ['صب الخرسانة', 'حديد التسليح', 'القوالب', 'معالجة الخرسانة'],
            isOfficial: true,
            source: 'الهيئة السعودية للمهندسين'
          }
        ]
      },
      {
        id: 'mep-installation',
        title: 'MEP Installation',
        arabicTitle: 'التمديدات الكهربائية والصحية',
        description: 'تمديد الكهرباء والسباكة والتكييف',
        order: 6,
        hasExternalIntegration: false,
        estimatedDuration: '3-6 أسابيع',
        dependencies: ['structural-work'],
        requirements: [
          'التمديدات الكهربائية',
          'التمديدات الصحية',
          'تمديدات التكييف',
          'أنظمة الأمان والحماية'
        ],
        documentationFiles: [
          {
            id: 'electrical-installation-guide',
            title: 'Electrical Installation Guide',
            arabicTitle: 'دليل التمديدات الكهربائية',
            type: 'pdf',
            url: `${this.DRIVE_BASE_URL}/electrical-guide.pdf`,
            description: 'دليل تنفيذ التمديدات الكهربائية طبقاً للكود السعودي',
            topics: ['الأحمال الكهربائية', 'أنواع الكابلات', 'لوحات التوزيع', 'أنظمة الحماية'],
            isOfficial: true,
            source: 'الهيئة السعودية للمهندسين'
          },
          {
            id: 'plumbing-installation-guide',
            title: 'Plumbing Installation Guide',
            arabicTitle: 'دليل التمديدات الصحية',
            type: 'pdf',
            url: `${this.DRIVE_BASE_URL}/plumbing-guide.pdf`,
            description: 'دليل تنفيذ التمديدات الصحية وأنظمة الصرف',
            topics: ['أنابيب المياه', 'أنظمة الصرف', 'أجهزة السباكة', 'العزل المائي'],
            isOfficial: true,
            source: 'الهيئة السعودية للمهندسين'
          }
        ]
      },
      {
        id: 'finishing-work',
        title: 'Finishing Work',
        arabicTitle: 'أعمال التشطيب',
        description: 'التشطيبات الداخلية والخارجية',
        order: 7,
        hasExternalIntegration: true,
        externalPlatforms: ['ackdconsult.com'],
        estimatedDuration: '4-8 أسابيع',
        dependencies: ['mep-installation'],
        requirements: [
          'أعمال الدهان',
          'تركيب الأرضيات',
          'تركيب الأسقف المستعارة',
          'التشطيبات الخارجية'
        ],
        documentationFiles: [
          {
            id: 'finishing-guide',
            title: 'Finishing Work Guide',
            arabicTitle: 'دليل أعمال التشطيب',
            type: 'pdf',
            url: `${this.DRIVE_BASE_URL}/finishing-guide.pdf`,
            description: 'دليل شامل لأعمال التشطيب الداخلي والخارجي',
            topics: ['أنواع الدهانات', 'أنواع الأرضيات', 'الأسقف المستعارة', 'التشطيبات الخارجية'],
            isOfficial: false,
            source: 'اتحاد المقاولين'
          }
        ]
      },
      {
        id: 'final-inspection',
        title: 'Final Inspection',
        arabicTitle: 'الفحص النهائي والتسليم',
        description: 'الفحص النهائي للمشروع والتسليم',
        order: 8,
        hasExternalIntegration: false,
        estimatedDuration: '1-2 أسبوع',
        dependencies: ['finishing-work'],
        requirements: [
          'فحص الأعمال المدنية',
          'فحص التمديدات',
          'اختبار الأنظمة',
          'استلام المشروع'
        ],
        documentationFiles: [
          {
            id: 'final-inspection-checklist',
            title: 'Final Inspection Checklist',
            arabicTitle: 'قائمة الفحص النهائي',
            type: 'checklist',
            url: `${this.DRIVE_BASE_URL}/inspection-checklist.pdf`,
            description: 'قائمة شاملة لفحص المشروع قبل التسليم',
            topics: ['فحص الأعمال المدنية', 'فحص التمديدات', 'اختبار الأنظمة', 'التوثيق'],
            isOfficial: true,
            source: 'أمانة المنطقة - إدارة الرقابة'
          }
        ]
      }
    ];
  }

  static getLevelById(levelId: string): ConstructionLevel | undefined {
    return this.getConstructionLevels().find(level => level.id === levelId);
  }

  static getLevelsByProjectType(projectType: string): ConstructionLevel[] {
    // For now, return all levels. Later we can filter by project type
    return this.getConstructionLevels();
  }

  static getNextLevel(currentLevelId: string): ConstructionLevel | undefined {
    const levels = this.getConstructionLevels();
    const currentLevel = levels.find(level => level.id === currentLevelId);
    if (!currentLevel) return undefined;
    
    return levels.find(level => level.order === currentLevel.order + 1);
  }

  static canStartLevel(levelId: string, completedLevels: string[]): boolean {
    const level = this.getLevelById(levelId);
    if (!level) return false;
    
    if (!level.dependencies) return true;
    
    return level.dependencies.every(dep => completedLevels.includes(dep));
  }
}

// Standardized export: class + instance
export const constructionService = new ConstructionGuidanceService();
export default constructionService;


