// Construction Platform Integration Service
// Handles integrations with external platforms mentioned in the construction phases

import { BaseService } from './BaseService';

export interface PlatformIntegration {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  url: string;
  apiEndpoint?: string;
  category: 'real-estate' | 'architecture' | 'insurance' | 'construction' | 'waste-management' | 'government';
  status: 'available' | 'connected' | 'maintenance';
  features: string[];
  credentials?: {
    apiKey?: string;
    token?: string;
    userId?: string;
  };
}

export interface LandListing {
  id: string;
  title: string;
  location: string;
  area: number;
  price: number;
  currency: string;
  type: 'villa' | 'apartment' | 'commercial' | 'land';
  images: string[];
  description: string;
  features: string[];
  contact: {
    name: string;
    phone: string;
    email?: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ArchitecturalPlan {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  buildingType: 'villa' | 'apartment' | 'commercial' | 'chalet';
  floors: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  currency: string;
  images: string[];
  plans: {
    type: 'floor-plan' | '3d-view' | 'section' | 'elevation';
    url: string;
    format: 'pdf' | 'dwg' | 'jpg' | 'png';
  }[];
  features: string[];
  description: string;
  specifications: Record<string, any>;
}

export interface InsuranceQuote {
  id: string;
  company: string;
  companyAr: string;
  type: 'construction' | 'liability' | 'comprehensive';
  coverage: number;
  premium: number;
  currency: string;
  duration: number; // months
  features: string[];
  exclusions: string[];
  terms: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface ServiceProvider {
  id: string;
  name: string;
  nameAr: string;
  category: 'contractor' | 'fencing' | 'excavation' | 'waste-disposal' | 'engineering';
  rating: number;
  reviews: number;
  location: string;
  services: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
    unit: string;
  };
  contact: {
    name: string;
    phone: string;
    email?: string;
    website?: string;
  };
  certifications: string[];
  portfolio: {
    projectName: string;
    projectType: string;
    completedDate: string;
    images: string[];
  }[];
}

class ConstructionIntegrationService extends BaseService {
  private static instance: ConstructionIntegrationService;
  private integrations: Map<string, PlatformIntegration> = new Map();
  private platforms: PlatformIntegration[] = [];

  constructor() {
    super();
    this.initializeIntegrations();
  }

  static getInstance(): ConstructionIntegrationService {
    if (!ConstructionIntegrationService.instance) {
      ConstructionIntegrationService.instance = new ConstructionIntegrationService();
    }
    return ConstructionIntegrationService.instance;
  }

  private async initializeIntegrations() {
    try {
      // Try to load platforms from Supabase first
      const { data: platformsData, error } = await this.supabase
        .from('platform_integrations')
        .select('*')
        .eq('status', 'available')
        .order('name');

      if (platformsData && !error) {
        this.platforms = platformsData;
        return;
      }
    } catch (error) {
      console.log('Using default platforms - Supabase table may not exist yet');
    }

    // Fallback to hardcoded platforms
    const platforms: PlatformIntegration[] = [
      {
        id: 'sa-aqar',
        name: 'SA Aqar',
        nameAr: 'عقار السعودية',
        description: 'Saudi Arabia\'s leading real estate platform',
        descriptionAr: 'المنصة العقارية الرائدة في المملكة العربية السعودية',
        url: 'https://sa.aqar.fm',
        apiEndpoint: 'https://api.aqar.fm/v1',
        category: 'real-estate',
        status: 'available',
        features: [
          'البحث عن الأراضي',
          'مقارنة الأسعار',
          'معلومات تفصيلية عن العقارات',
          'خرائط تفاعلية',
          'تواصل مباشر مع المعلنين'
        ]
      },
      {
        id: 'ackd',
        name: 'ACKD',
        nameAr: 'أكد',
        description: 'Architectural plans and construction designs platform',
        descriptionAr: 'منصة المخططات المعمارية وتصاميم البناء',
        url: 'https://ackd.sa',
        apiEndpoint: 'https://api.ackd.sa/v1',
        category: 'architecture',
        status: 'available',
        features: [
          'مخططات معمارية جاهزة',
          'تصاميم حسب المساحة',
          'مخططات ثلاثية الأبعاد',
          'تخصيص التصاميم',
          'استشارات معمارية'
        ]
      },
      {
        id: 'tawuniya',
        name: 'Tawuniya Insurance',
        nameAr: 'التأمين التعاوني',
        description: 'Comprehensive insurance solutions for construction projects',
        descriptionAr: 'حلول تأمين شاملة لمشاريع البناء',
        url: 'https://tawuniya.com.sa',
        category: 'insurance',
        status: 'available',
        features: [
          'تأمين مشاريع البناء',
          'تأمين المسؤولية المدنية',
          'تأمين المعدات',
          'تأمين العمالة',
          'تعويضات سريعة'
        ]
      },
      {
        id: 'malath',
        name: 'Malath Insurance',
        nameAr: 'مالاذ للتأمين',
        description: 'Construction and contractor insurance specialist',
        descriptionAr: 'متخصص في تأمين البناء والمقاولين',
        url: 'https://malath.com.sa',
        category: 'insurance',
        status: 'available',
        features: [
          'تأمين المقاولين',
          'تأمين المواد',
          'تأمين التأخير',
          'تأمين الحوادث',
          'خدمة عملاء متخصصة'
        ]
      },
      {
        id: 'balady',
        name: 'Balady Portal',
        nameAr: 'بوابة بلدي',
        description: 'Municipal services and building permits',
        descriptionAr: 'الخدمات البلدية وتراخيص البناء',
        url: 'https://balady.gov.sa',
        category: 'government',
        status: 'available',
        features: [
          'طلب رخص البناء',
          'متابعة حالة الطلبات',
          'الدفع الإلكتروني',
          'تحميل الوثائق',
          'خدمات استعلام'
        ]
      },
      {
        id: 'najm-waste',
        name: 'Najm Waste Management',
        nameAr: 'نجم لإدارة النفايات',
        description: 'Construction waste disposal and recycling services',
        descriptionAr: 'خدمات التخلص من مخلفات البناء وإعادة التدوير',
        url: 'https://najm-waste.sa',
        category: 'waste-management',
        status: 'available',
        features: [
          'نقل مخلفات البناء',
          'إعادة تدوير المواد',
          'جدولة منتظمة',
          'تقارير بيئية',
          'خدمات طارئة'
        ]
      }
    ];

    this.platforms = platforms;
    platforms.forEach(platform => {
      this.integrations.set(platform.id, platform);
    });
  }

  // Get all available integrations
  getAllIntegrations(): PlatformIntegration[] {
    return Array.from(this.integrations.values());
  }

  // Get integrations by category
  getIntegrationsByCategory(category: PlatformIntegration['category']): PlatformIntegration[] {
    return Array.from(this.integrations.values()).filter(
      integration => integration.category === category
    );
  }

  // Get specific integration
  getIntegration(id: string): PlatformIntegration | undefined {
    return this.integrations.get(id);
  }

  // Connect to platform (mock implementation)
  async connectToPlatform(platformId: string, credentials?: any): Promise<boolean> {
    const platform = this.integrations.get(platformId);
    if (!platform) {
      throw new Error(`Platform ${platformId} not found`);
    }

    // Mock connection logic
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update platform status
    platform.status = 'connected';
    platform.credentials = credentials;
    
    return true;
  }

  // SA Aqar Integration - Search for land
  async searchLand(filters: {
    location?: string;
    minArea?: number;
    maxArea?: number;
    minPrice?: number;
    maxPrice?: number;
    type?: string;
  }): Promise<LandListing[]> {
    // Mock data - in real implementation, this would call SA Aqar API
    const mockListings: LandListing[] = [
      {
        id: '1',
        title: 'أرض سكنية في الرياض - حي النرجس',
        location: 'الرياض، حي النرجس',
        area: 500,
        price: 450000,
        currency: 'SAR',
        type: 'land',
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        description: 'أرض سكنية ممتازة في موقع مميز بحي النرجس، مناسبة لبناء فيلا عائلية',
        features: ['واجهة شمالية', 'قريب من الخدمات', 'في مخطط معتمد'],
        contact: {
          name: 'أحمد المالك',
          phone: '+966501234567',
          email: 'ahmed@example.com'
        },
        coordinates: { lat: 24.7136, lng: 46.6753 }
      },
      {
        id: '2',
        title: 'أرض تجارية على شارع رئيسي',
        location: 'الرياض، حي العليا',
        area: 800,
        price: 1200000,
        currency: 'SAR',
        type: 'commercial',
        images: ['/api/placeholder/400/300'],
        description: 'أرض تجارية على شارع رئيسي مناسبة للاستثمار التجاري',
        features: ['واجهة على شارع رئيسي', 'إطلالة ممتازة', 'موقع استراتيجي'],
        contact: {
          name: 'محمد العقاري',
          phone: '+966501234568'
        },
        coordinates: { lat: 24.6877, lng: 46.7219 }
      }
    ];

    // Apply filters
    let filteredListings = mockListings;

    if (filters.location) {
      filteredListings = filteredListings.filter(listing =>
        listing.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.minArea) {
      filteredListings = filteredListings.filter(listing => listing.area >= filters.minArea!);
    }

    if (filters.maxArea) {
      filteredListings = filteredListings.filter(listing => listing.area <= filters.maxArea!);
    }

    if (filters.minPrice) {
      filteredListings = filteredListings.filter(listing => listing.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      filteredListings = filteredListings.filter(listing => listing.price <= filters.maxPrice!);
    }

    return filteredListings;
  }

  // ACKD Integration - Get architectural plans
  async getArchitecturalPlans(filters: {
    buildingType?: ArchitecturalPlan['buildingType'];
    minArea?: number;
    maxArea?: number;
    floors?: number;
    bedrooms?: number;
  }): Promise<ArchitecturalPlan[]> {
    // Mock data - in real implementation, this would call ACKD API
    const mockPlans: ArchitecturalPlan[] = [
      {
        id: '1',
        name: 'Modern Villa Plan A',
        nameAr: 'مخطط فيلا عصرية أ',
        category: 'residential',
        buildingType: 'villa',
        floors: 2,
        bedrooms: 4,
        bathrooms: 3,
        area: 350,
        price: 15000,
        currency: 'SAR',
        images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
        plans: [
          { type: 'floor-plan', url: '/plans/villa-a-floor.pdf', format: 'pdf' },
          { type: '3d-view', url: '/plans/villa-a-3d.jpg', format: 'jpg' }
        ],
        features: ['مجلس رجال منفصل', 'مطبخ مفتوح', 'حديقة خلفية', 'موقف سيارتين'],
        description: 'تصميم عصري لفيلا سكنية بمساحة 350 متر مربع',
        specifications: {
          groundFloor: 'مجلس، صالة، مطبخ، غرفة خادمة',
          firstFloor: 'غرفة نوم رئيسية، 3 غرف نوم، 2 حمام'
        }
      },
      {
        id: '2',
        name: 'Classic Villa Plan B',
        nameAr: 'مخطط فيلا كلاسيكية ب',
        category: 'residential',
        buildingType: 'villa',
        floors: 2,
        bedrooms: 5,
        bathrooms: 4,
        area: 450,
        price: 20000,
        currency: 'SAR',
        images: ['/api/placeholder/600/400'],
        plans: [
          { type: 'floor-plan', url: '/plans/villa-b-floor.pdf', format: 'pdf' },
          { type: 'elevation', url: '/plans/villa-b-elevation.pdf', format: 'pdf' }
        ],
        features: ['مجلس كبير', 'غرفة طعام منفصلة', 'مكتب', 'شرفات متعددة'],
        description: 'تصميم كلاسيكي فاخر لفيلا كبيرة',
        specifications: {
          groundFloor: 'مجلس، صالة، مطبخ، غرفة طعام، مكتب',
          firstFloor: 'غرفة نوم رئيسية، 4 غرف نوم، 3 حمام'
        }
      }
    ];

    // Apply filters
    let filteredPlans = mockPlans;

    if (filters.buildingType) {
      filteredPlans = filteredPlans.filter(plan => plan.buildingType === filters.buildingType);
    }

    if (filters.minArea) {
      filteredPlans = filteredPlans.filter(plan => plan.area >= filters.minArea!);
    }

    if (filters.maxArea) {
      filteredPlans = filteredPlans.filter(plan => plan.area <= filters.maxArea!);
    }

    if (filters.floors) {
      filteredPlans = filteredPlans.filter(plan => plan.floors === filters.floors);
    }

    if (filters.bedrooms) {
      filteredPlans = filteredPlans.filter(plan => plan.bedrooms === filters.bedrooms);
    }

    return filteredPlans;
  }

  // Insurance Integration - Get quotes
  async getInsuranceQuotes(projectDetails: {
    projectValue: number;
    projectType: string;
    duration: number;
    location: string;
  }): Promise<InsuranceQuote[]> {
    // Mock data - in real implementation, this would call insurance APIs
    const mockQuotes: InsuranceQuote[] = [
      {
        id: '1',
        company: 'Tawuniya Insurance',
        companyAr: 'التأمين التعاوني',
        type: 'comprehensive',
        coverage: projectDetails.projectValue,
        premium: projectDetails.projectValue * 0.015, // 1.5% of project value
        currency: 'SAR',
        duration: projectDetails.duration,
        features: [
          'تغطية شاملة ضد الحوادث',
          'تأمين المواد والمعدات',
          'تأمين العمالة',
          'تعويض التأخير'
        ],
        exclusions: ['الكوارث الطبيعية', 'الأعمال الإرهابية'],
        terms: 'شروط وأحكام قياسية',
        contact: {
          name: 'خالد السليم',
          phone: '+966112345678',
          email: 'khalid@tawuniya.com.sa'
        }
      },
      {
        id: '2',
        company: 'Malath Insurance',
        companyAr: 'مالاذ للتأمين',
        type: 'construction',
        coverage: projectDetails.projectValue * 0.8,
        premium: projectDetails.projectValue * 0.012, // 1.2% of project value
        currency: 'SAR',
        duration: projectDetails.duration,
        features: [
          'تأمين مخاطر البناء',
          'تأمين المسؤولية المدنية',
          'تأمين معدات البناء'
        ],
        exclusions: ['الأخطاء التصميمية', 'العيوب الخفية'],
        terms: 'شروط خاصة بمشاريع البناء',
        contact: {
          name: 'سارة أحمد',
          phone: '+966112345679',
          email: 'sara@malath.com.sa'
        }
      }
    ];

    return mockQuotes;
  }

  // Service Providers Integration
  async getServiceProviders(category: ServiceProvider['category'], location?: string): Promise<ServiceProvider[]> {
    // Mock data - in real implementation, this would call various service provider APIs
    const mockProviders: ServiceProvider[] = [
      {
        id: '1',
        name: 'Al-Bina Construction',
        nameAr: 'البناء للمقاولات',
        category: 'contractor',
        rating: 4.8,
        reviews: 156,
        location: 'الرياض',
        services: ['البناء العام', 'التشطيبات', 'الصيانة'],
        priceRange: { min: 800, max: 1200, currency: 'SAR', unit: 'per_sqm' },
        contact: {
          name: 'محمد البناء',
          phone: '+966501234567',
          email: 'info@albina.sa',
          website: 'https://albina.sa'
        },
        certifications: ['رخصة مقاولة درجة أولى', 'شهادة الجودة ISO'],
        portfolio: [
          {
            projectName: 'فيلا العائلة',
            projectType: 'فيلا سكنية',
            completedDate: '2023-12-01',
            images: ['/api/placeholder/300/200']
          }
        ]
      },
      {
        id: '2',
        name: 'Secure Fencing Co.',
        nameAr: 'الأمان للتسوير',
        category: 'fencing',
        rating: 4.6,
        reviews: 89,
        location: 'الرياض',
        services: ['تسوير بلوك', 'تسوير حديد', 'أبواب وبوابات'],
        priceRange: { min: 150, max: 300, currency: 'SAR', unit: 'per_meter' },
        contact: {
          name: 'عبدالله الأمان',
          phone: '+966501234568',
          email: 'info@secure-fencing.sa'
        },
        certifications: ['رخصة تجارية', 'شهادة سلامة'],
        portfolio: [
          {
            projectName: 'تسوير مجمع سكني',
            projectType: 'تسوير',
            completedDate: '2024-01-15',
            images: ['/api/placeholder/300/200']
          }
        ]
      }
    ];

    // Filter by category and location
    let filteredProviders = mockProviders.filter(provider => provider.category === category);
    
    if (location) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    return filteredProviders;
  }

  // Government Services Integration
  async submitBuildingPermit(projectData: {
    projectName: string;
    location: string;
    area: number;
    projectType: string;
    plans: File[];
    ownerInfo: any;
  }): Promise<{ applicationId: string; status: string; estimatedDays: number }> {
    // Mock submission - in real implementation, this would integrate with Balady portal
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      applicationId: `BP-${Date.now()}`,
      status: 'submitted',
      estimatedDays: 14
    };
  }

  // Check permit status
  async checkPermitStatus(applicationId: string): Promise<{
    status: 'submitted' | 'under_review' | 'approved' | 'rejected';
    comments?: string;
    nextStep?: string;
  }> {
    // Mock status check
    const statuses = ['submitted', 'under_review', 'approved', 'rejected'] as const;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      status: randomStatus,
      comments: randomStatus === 'rejected' ? 'نقص في الوثائق المطلوبة' : undefined,
      nextStep: randomStatus === 'approved' ? 'يمكنك الآن بدء أعمال البناء' : undefined
    };
  }

  // Waste Management Integration
  async scheduleWastePickup(projectId: string, wasteType: string[], frequency: 'daily' | 'weekly' | 'on-demand'): Promise<{
    scheduleId: string;
    nextPickup: string;
    estimatedCost: number;
  }> {
    // Mock scheduling
    await new Promise(resolve => setTimeout(resolve, 1000));

    const nextPickup = new Date();
    nextPickup.setDate(nextPickup.getDate() + (frequency === 'daily' ? 1 : 7));

    return {
      scheduleId: `WS-${Date.now()}`,
      nextPickup: nextPickup.toISOString(),
      estimatedCost: wasteType.length * 500 // SAR per waste type
    };
  }
}

export { ConstructionIntegrationService };

const constructionIntegrationService = ConstructionIntegrationService.getInstance();
export default constructionIntegrationService;



