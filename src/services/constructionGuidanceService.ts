// Construction Guidance Service
export interface ConstructionPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  startDate?: Date;
  endDate?: Date;
}

export interface ConstructionLevel {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  dependencies: string[];
  requirements: string[];
  documentationFiles: any[]; // Flexible to accommodate various doc properties
  hasExternalIntegration?: boolean;
  externalPlatforms?: string[];
  order?: number;
  estimatedDuration?: number;
  estimatedCost?: { min: number; max: number; currency: string };
}

export interface ProjectLevel {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  status: 'not_started' | 'in_progress' | 'completed';
}

export class ConstructionGuidanceService {
  async getConstructionAdvice(category: string) {
    // Placeholder implementation
    return {
      advice: "إرشادات البناء قيد التطوير",
      category,
      tips: [
        "استخدم مواد عالية الجودة",
        "اتبع معايير السلامة",
        "احرص على التخطيط الجيد"
      ]
    };
  }

  async getConstructionGuidelines() {
    return [
      {
        id: '1',
        title: 'إرشادات الأساسات',
        description: 'دليل شامل لبناء الأساسات',
        category: 'foundation'
      },
      {
        id: '2', 
        title: 'إرشادات البناء',
        description: 'دليل شامل للبناء',
        category: 'construction'
      }
    ];
  }

  async getConstructionPhases(): Promise<ConstructionLevel[]> {
    return ConstructionGuidanceService.getConstructionLevels();
  }

  static getConstructionLevels(): ConstructionLevel[] {
    // Implementation of construction levels
    return [
      {
        id: 'foundation',
        title: 'Foundation',
        arabicTitle: 'الأساسات',
        description: 'Foundation phase of construction',
        arabicDescription: 'مرحلة الأساسات',
        dependencies: [],
        requirements: ['Foundation plans', 'Soil test'],
        documentationFiles: ['foundation-guide.pdf']
      }
    ];
  }

  static getGuidanceForLevel(levelId: string) {
    return {
      tips: [
        'Use high-quality materials',
        'Follow safety standards',
        'Plan carefully'
      ],
      warnings: [
        'Check weather conditions',
        'Verify permits'
      ],
      bestPractices: [
        'Regular inspections',
        'Document everything'
      ]
    }
  }

  static canStartLevel(levelId: string, selectedLevels: string[]) {
    const level = this.getConstructionLevels().find(l => l.id === levelId);
    if (!level) return false;
    return level.dependencies.every(dep => selectedLevels.includes(dep));
  }
}

export const constructionGuidanceService = new ConstructionGuidanceService();
export default constructionGuidanceService;


