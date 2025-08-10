import { supabase } from '@/lib/supabase/client';

export interface CityData {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  population: number;
  area: number; // in km²
  economicZones: string[];
  majorDistricts: District[];
  serviceAvailability: ServiceAvailability;
  metadata: {
    timezone: string;
    currency: string;
    languages: string[];
    businessHours: string;
    emergencyNumbers: EmergencyNumbers;
  };
}

export interface District {
  id: string;
  name: string;
  cityId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'residential' | 'commercial' | 'industrial' | 'mixed';
  averageIncome: 'low' | 'medium' | 'high' | 'premium';
  populationDensity: number;
  developmentLevel: 'developing' | 'established' | 'premium';
}

export interface ServiceAvailability {
  equipment: {
    available: boolean;
    providers: number;
    avgResponseTime: string;
    coverageAreas: string[];
    specializedServices: string[];
  };
  concrete: {
    available: boolean;
    plants: number;
    maxDailyCapacity: number; // in cubic meters
    grades: string[];
    deliveryRadius: number; // in km
  };
  waste: {
    available: boolean;
    providers: number;
    wasteTypes: string[];
    recyclingFacilities: number;
    collectionSchedule: string;
  };
  consultation: {
    available: boolean;
    engineers: number;
    specializations: string[];
    languages: string[];
    certifications: string[];
  };
  materials: {
    available: boolean;
    suppliers: number;
    categories: string[];
    warehouses: number;
    deliveryOptions: string[];
  };
}

export interface EmergencyNumbers {
  police: string;
  fire: string;
  medical: string;
  civilDefense: string;
  municipality: string;
}

export interface FilterCriteria {
  services: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  responseTime?: 'immediate' | 'same_day' | 'next_day' | 'week';
  qualityLevel?: 'basic' | 'standard' | 'premium';
  certifications?: string[];
  languages?: string[];
  workingHours?: 'business' | 'extended' | '24/7';
  emergencyService?: boolean;
}

export interface CityFilterResult {
  city: CityData;
  matchScore: number;
  availableServices: {
    serviceType: string;
    providers: any[];
    estimatedCost: {
      min: number;
      max: number;
      currency: string;
    };
    avgResponseTime: string;
    qualityScore: number;
  }[];
  recommendations: {
    bestValue: any[];
    highestQuality: any[];
    fastestResponse: any[];
  };
  insights: {
    marketSize: string;
    competition: 'low' | 'medium' | 'high';
    priceLevel: 'low' | 'average' | 'high';
    qualityLevel: 'basic' | 'good' | 'excellent';
    growthTrend: 'declining' | 'stable' | 'growing';
  };
}

class CityBasedFilteringService {
  private citiesCache: Map<string, CityData> = new Map();
  private districtsCache: Map<string, District[]> = new Map();
  private serviceProvidersCache: Map<string, any[]> = new Map();

  // Saudi Arabian cities data
  private readonly saudiCities: Partial<CityData>[] = [
    {
      id: 'riyadh',
      name: 'الرياض',
      nameEn: 'Riyadh',
      region: 'منطقة الرياض',
      coordinates: { lat: 24.7136, lng: 46.6753 },
      population: 7676654,
      area: 1913,
      economicZones: ['الملك عبدالله الاقتصادية', 'حي المال والأعمال'],
      metadata: {
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        languages: ['ar', 'en'],
        businessHours: '08:00-17:00',
        emergencyNumbers: {
          police: '999',
          fire: '998',
          medical: '997',
          civilDefense: '998',
          municipality: '940'
        }
      }
    },
    {
      id: 'jeddah',
      name: 'جدة',
      nameEn: 'Jeddah',
      region: 'منطقة مكة المكرمة',
      coordinates: { lat: 21.3099, lng: 39.8208 },
      population: 4697000,
      area: 1765,
      economicZones: ['مدينة الملك عبدالله الاقتصادية', 'ميناء جدة الإسلامي'],
      metadata: {
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        languages: ['ar', 'en'],
        businessHours: '08:00-17:00',
        emergencyNumbers: {
          police: '999',
          fire: '998',
          medical: '997',
          civilDefense: '998',
          municipality: '940'
        }
      }
    },
    {
      id: 'dammam',
      name: 'الدمام',
      nameEn: 'Dammam',
      region: 'المنطقة الشرقية',
      coordinates: { lat: 26.3927, lng: 49.9777 },
      population: 1532300,
      area: 800,
      economicZones: ['مدينة الجبيل الصناعية', 'ميناء الملك عبدالعزيز'],
      metadata: {
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        languages: ['ar', 'en'],
        businessHours: '08:00-17:00',
        emergencyNumbers: {
          police: '999',
          fire: '998',
          medical: '997',
          civilDefense: '998',
          municipality: '940'
        }
      }
    },
    {
      id: 'mecca',
      name: 'مكة المكرمة',
      nameEn: 'Mecca',
      region: 'منطقة مكة المكرمة',
      coordinates: { lat: 21.3891, lng: 39.8579 },
      population: 2385509,
      area: 850,
      economicZones: ['مشروع جبل عمر', 'أبراج البيت'],
      metadata: {
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        languages: ['ar', 'en', 'ur'],
        businessHours: '08:00-17:00',
        emergencyNumbers: {
          police: '999',
          fire: '998',
          medical: '997',
          civilDefense: '998',
          municipality: '940'
        }
      }
    },
    {
      id: 'medina',
      name: 'المدينة المنورة',
      nameEn: 'Medina',
      region: 'منطقة المدينة المنورة',
      coordinates: { lat: 24.5247, lng: 39.5692 },
      population: 1488782,
      area: 589,
      economicZones: ['مطار الأمير محمد بن عبدالعزيز', 'المدينة الصناعية'],
      metadata: {
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        languages: ['ar', 'en', 'ur'],
        businessHours: '08:00-17:00',
        emergencyNumbers: {
          police: '999',
          fire: '998',
          medical: '997',
          civilDefense: '998',
          municipality: '940'
        }
      }
    }
  ];

  async getAllCities(): Promise<CityData[]> {
    try {
      // Check cache first
      if (this.citiesCache.size > 0) {
        return Array.from(this.citiesCache.values());
      }

      // Try to load from database
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('population', { ascending: false });

      if (error && error.code !== 'PGRST116') {
        console.warn('Database not available, using default data:', error);
      }

      // Use database data if available, otherwise use default data
      const citiesData = data && data.length > 0 ? data : this.saudiCities;

      const cities: CityData[] = await Promise.all(
        citiesData.map(async (cityData) => {
          const city = await this.enrichCityData(cityData as CityData);
          this.citiesCache.set(city.id, city);
          return city;
        })
      );

      return cities;
    } catch (error) {
      console.error('Error loading cities:', error);
      // Fallback to default data
      return this.saudiCities.map(city => this.createDefaultCityData(city));
    }
  }

  async getCityById(cityId: string): Promise<CityData | null> {
    try {
      // Check cache first
      if (this.citiesCache.has(cityId)) {
        return this.citiesCache.get(cityId)!;
      }

      // Load all cities to populate cache
      await this.getAllCities();
      
      return this.citiesCache.get(cityId) || null;
    } catch (error) {
      console.error('Error getting city by ID:', error);
      return null;
    }
  }

  async getCityByName(cityName: string): Promise<CityData | null> {
    try {
      const cities = await this.getAllCities();
      return cities.find(city => 
        city.name === cityName || 
        city.nameEn.toLowerCase() === cityName.toLowerCase()
      ) || null;
    } catch (error) {
      console.error('Error getting city by name:', error);
      return null;
    }
  }

  async getDistrictsByCity(cityId: string): Promise<District[]> {
    try {
      // Check cache first
      if (this.districtsCache.has(cityId)) {
        return this.districtsCache.get(cityId)!;
      }

      const { data, error } = await supabase
        .from('districts')
        .select('*')
        .eq('city_id', cityId)
        .order('name');

      if (error && error.code !== 'PGRST116') {
        console.warn('Database not available for districts:', error);
      }

      const districts = data || this.getDefaultDistricts(cityId);
      this.districtsCache.set(cityId, districts);
      
      return districts;
    } catch (error) {
      console.error('Error loading districts:', error);
      return this.getDefaultDistricts(cityId);
    }
  }

  async filterServicesByCityAndCriteria(
    cityId: string,
    criteria: FilterCriteria
  ): Promise<CityFilterResult | null> {
    try {
      const city = await this.getCityById(cityId);
      if (!city) return null;

      // Get available services in the city
      const availableServices = await this.getAvailableServicesInCity(cityId, criteria.services);
      
      // Calculate match score
      const matchScore = this.calculateCityMatchScore(city, criteria, availableServices);

      // Generate recommendations
      const recommendations = this.generateRecommendations(availableServices, criteria);

      // Generate insights
      const insights = this.generateCityInsights(city, availableServices);

      return {
        city,
        matchScore,
        availableServices,
        recommendations,
        insights
      };
    } catch (error) {
      console.error('Error filtering services by city:', error);
      return null;
    }
  }

  async searchCitiesByServiceAvailability(
    requiredServices: string[],
    criteria?: FilterCriteria
  ): Promise<CityFilterResult[]> {
    try {
      const cities = await this.getAllCities();
      const results: CityFilterResult[] = [];

      for (const city of cities) {
        const filterResult = await this.filterServicesByCityAndCriteria(city.id, {
          services: requiredServices,
          ...criteria
        });

        if (filterResult && filterResult.matchScore > 0.3) {
          results.push(filterResult);
        }
      }

      // Sort by match score descending
      return results.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      console.error('Error searching cities by service availability:', error);
      return [];
    }
  }

  async getNearestCities(
    coordinates: { lat: number; lng: number },
    maxDistance: number = 100, // km
    limit: number = 5
  ): Promise<CityData[]> {
    try {
      const cities = await this.getAllCities();
      
      const citiesWithDistance = cities.map(city => ({
        city,
        distance: this.calculateDistance(coordinates, city.coordinates)
      }))
      .filter(item => item.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

      return citiesWithDistance.map(item => item.city);
    } catch (error) {
      console.error('Error getting nearest cities:', error);
      return [];
    }
  }

  private async enrichCityData(cityData: Partial<CityData>): Promise<CityData> {
    const serviceAvailability = await this.getServiceAvailabilityForCity(cityData.id!);
    const districts = await this.getDistrictsByCity(cityData.id!);

    return {
      ...this.createDefaultCityData(cityData),
      majorDistricts: districts.slice(0, 10), // Top 10 districts
      serviceAvailability
    };
  }

  private async getServiceAvailabilityForCity(cityId: string): Promise<ServiceAvailability> {
    try {
      // Get service providers by city
      const { data: providers, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          services (*)
        `)
        .ilike('location', `%${cityId}%`)
        .eq('active', true);

      if (error) {
        console.warn('Error loading service providers:', error);
      }

      const serviceProviders = providers || [];

      return {
        equipment: {
          available: serviceProviders.some(p => p.services?.some((s: any) => s.category === 'equipment')),
          providers: serviceProviders.filter(p => p.services?.some((s: any) => s.category === 'equipment')).length,
          avgResponseTime: '2-4 ساعات',
          coverageAreas: ['المدينة الكاملة'],
          specializedServices: ['رافعات', 'حفارات', 'شاحنات']
        },
        concrete: {
          available: serviceProviders.some(p => p.services?.some((s: any) => s.category === 'concrete')),
          plants: serviceProviders.filter(p => p.services?.some((s: any) => s.category === 'concrete')).length,
          maxDailyCapacity: 5000,
          grades: ['C20', 'C25', 'C30', 'C35', 'C40'],
          deliveryRadius: 50
        },
        waste: {
          available: serviceProviders.some(p => p.services?.some((s: any) => s.category === 'waste')),
          providers: serviceProviders.filter(p => p.services?.some((s: any) => s.category === 'waste')).length,
          wasteTypes: ['بناء', 'هدم', 'تجاري', 'صناعي'],
          recyclingFacilities: 2,
          collectionSchedule: 'يومي'
        },
        consultation: {
          available: serviceProviders.some(p => p.services?.some((s: any) => s.category === 'consultation')),
          engineers: serviceProviders.filter(p => p.services?.some((s: any) => s.category === 'consultation')).length,
          specializations: ['إنشائي', 'معماري', 'كهربائي', 'ميكانيكي'],
          languages: ['العربية', 'الإنجليزية'],
          certifications: ['هيئة المهندسين', 'ISO']
        },
        materials: {
          available: serviceProviders.some(p => p.services?.some((s: any) => s.category === 'materials')),
          suppliers: serviceProviders.filter(p => p.services?.some((s: any) => s.category === 'materials')).length,
          categories: ['خرسانة', 'حديد', 'أسمنت', 'مواد عزل'],
          warehouses: 5,
          deliveryOptions: ['نفس اليوم', 'اليوم التالي', 'مجدول']
        }
      };
    } catch (error) {
      console.error('Error getting service availability:', error);
      return this.getDefaultServiceAvailability();
    }
  }

  private async getAvailableServicesInCity(cityId: string, requiredServices: string[]): Promise<any[]> {
    try {
      if (this.serviceProvidersCache.has(cityId)) {
        return this.serviceProvidersCache.get(cityId)!;
      }

      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          services (*)
        `)
        .ilike('location', `%${cityId}%`)
        .eq('active', true);

      if (error) {
        console.warn('Error loading service providers:', error);
      }

      const services = (data || []).map(provider => ({
        serviceType: provider.service_categories?.[0] || 'general',
        providers: [provider],
        estimatedCost: {
          min: provider.base_price || 1000,
          max: (provider.base_price || 1000) * 3,
          currency: 'SAR'
        },
        avgResponseTime: provider.response_time || '1-2 أيام',
        qualityScore: provider.rating || 4.0
      }));

      this.serviceProvidersCache.set(cityId, services);
      return services;
    } catch (error) {
      console.error('Error getting available services:', error);
      return [];
    }
  }

  private calculateCityMatchScore(
    city: CityData,
    criteria: FilterCriteria,
    availableServices: any[]
  ): number {
    let score = 0;
    let maxScore = 0;

    // Service availability (40% weight)
    const serviceScore = criteria.services.reduce((acc, service) => {
      const available = availableServices.some(s => s.serviceType === service);
      return acc + (available ? 1 : 0);
    }, 0) / Math.max(1, criteria.services.length);
    score += serviceScore * 40;
    maxScore += 40;

    // Price range compatibility (20% weight)
    if (criteria.priceRange) {
      const avgPrice = availableServices.reduce((acc, s) => acc + s.estimatedCost.min, 0) / Math.max(1, availableServices.length);
      if (avgPrice >= criteria.priceRange.min && avgPrice <= criteria.priceRange.max) {
        score += 20;
      } else if (avgPrice <= criteria.priceRange.max * 1.2) {
        score += 15;
      } else if (avgPrice <= criteria.priceRange.max * 1.5) {
        score += 10;
      }
    }
    maxScore += 20;

    // Quality level (20% weight)
    if (criteria.qualityLevel) {
      const avgQuality = availableServices.reduce((acc, s) => acc + s.qualityScore, 0) / Math.max(1, availableServices.length);
      const qualityThresholds = { basic: 3.0, standard: 4.0, premium: 4.5 } as { [key: string]: number };
      const requiredQuality = qualityThresholds[criteria.qualityLevel];
      
      if (avgQuality >= requiredQuality) {
        score += 20;
      } else if (avgQuality >= requiredQuality - 0.5) {
        score += 15;
      } else if (avgQuality >= requiredQuality - 1.0) {
        score += 10;
      }
    }
    maxScore += 20;

    // Response time (20% weight)
    if (criteria.responseTime) {
      const timeScores = { immediate: 20, same_day: 15, next_day: 10, week: 5 } as { [key: string]: number };
      score += timeScores[criteria.responseTime] || 0;
    }
    maxScore += 20;

    return maxScore > 0 ? (score / maxScore) : 0;
  }

  private generateRecommendations(availableServices: any[], criteria: FilterCriteria): any {
    const sortedByValue = [...availableServices].sort((a, b) => 
      (b.qualityScore / a.estimatedCost.min) - (a.qualityScore / b.estimatedCost.min)
    );

    const sortedByQuality = [...availableServices].sort((a, b) => 
      b.qualityScore - a.qualityScore
    );

    const sortedByResponse = [...availableServices].sort((a, b) => {
      const responseOrder = { 'فوري': 1, 'ساعات': 2, 'يوم': 3, 'أيام': 4 } as { [key: string]: number };
      const aOrder = Object.keys(responseOrder).find(key => a.avgResponseTime.includes(key)) || 'أيام';
      const bOrder = Object.keys(responseOrder).find(key => b.avgResponseTime.includes(key)) || 'أيام';
      return responseOrder[aOrder] - responseOrder[bOrder];
    });

    return {
      bestValue: sortedByValue.slice(0, 3),
      highestQuality: sortedByQuality.slice(0, 3),
      fastestResponse: sortedByResponse.slice(0, 3)
    };
  }

  private generateCityInsights(city: CityData, availableServices: any[]): any {
    const marketSize = city.population > 5000000 ? 'كبير' : 
                      city.population > 1000000 ? 'متوسط' : 'صغير';

    const competition = availableServices.length > 20 ? 'high' : 
                       availableServices.length > 10 ? 'medium' : 'low';

    const avgPrice = availableServices.reduce((acc, s) => acc + s.estimatedCost.min, 0) / Math.max(1, availableServices.length);
    const priceLevel = avgPrice > 15000 ? 'high' : avgPrice > 8000 ? 'average' : 'low';

    const avgQuality = availableServices.reduce((acc, s) => acc + s.qualityScore, 0) / Math.max(1, availableServices.length);
    const qualityLevel = avgQuality > 4.5 ? 'excellent' : avgQuality > 4.0 ? 'good' : 'basic';

    return {
      marketSize,
      competition,
      priceLevel,
      qualityLevel,
      growthTrend: 'growing' // Default for Saudi cities
    };
  }

  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private createDefaultCityData(partialCity: Partial<CityData>): CityData {
    return {
      id: partialCity.id || '',
      name: partialCity.name || '',
      nameEn: partialCity.nameEn || '',
      region: partialCity.region || '',
      coordinates: partialCity.coordinates || { lat: 0, lng: 0 },
      population: partialCity.population || 0,
      area: partialCity.area || 0,
      economicZones: partialCity.economicZones || [],
      majorDistricts: [],
      serviceAvailability: this.getDefaultServiceAvailability(),
      metadata: partialCity.metadata || {
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        languages: ['ar'],
        businessHours: '08:00-17:00',
        emergencyNumbers: {
          police: '999',
          fire: '998',
          medical: '997',
          civilDefense: '998',
          municipality: '940'
        }
      }
    };
  }

  private getDefaultServiceAvailability(): ServiceAvailability {
    return {
      equipment: {
        available: true,
        providers: 5,
        avgResponseTime: '2-4 ساعات',
        coverageAreas: ['المدينة الكاملة'],
        specializedServices: ['رافعات', 'حفارات', 'شاحنات']
      },
      concrete: {
        available: true,
        plants: 3,
        maxDailyCapacity: 2000,
        grades: ['C20', 'C25', 'C30'],
        deliveryRadius: 30
      },
      waste: {
        available: true,
        providers: 3,
        wasteTypes: ['بناء', 'هدم'],
        recyclingFacilities: 1,
        collectionSchedule: 'يومي'
      },
      consultation: {
        available: true,
        engineers: 10,
        specializations: ['إنشائي', 'معماري'],
        languages: ['العربية'],
        certifications: ['هيئة المهندسين']
      },
      materials: {
        available: true,
        suppliers: 8,
        categories: ['خرسانة', 'حديد', 'أسمنت'],
        warehouses: 3,
        deliveryOptions: ['اليوم التالي', 'مجدول']
      }
    };
  }

  private getDefaultDistricts(cityId: string): District[] {
    // Return some default districts based on city
    const defaultDistricts: { [key: string]: Array<{ name: string; type: 'residential' | 'commercial' | 'mixed'; averageIncome: 'low' | 'medium' | 'high' | 'premium' }> } = {
      'riyadh': [
        { name: 'الملز', type: 'residential' as const, averageIncome: 'high' as const },
        { name: 'العليا', type: 'commercial' as const, averageIncome: 'premium' as const },
        { name: 'الفيصلية', type: 'mixed' as const, averageIncome: 'high' as const },
        { name: 'النخيل', type: 'residential' as const, averageIncome: 'medium' as const }
      ],
      'jeddah': [
        { name: 'الشاطئ', type: 'mixed' as const, averageIncome: 'high' as const },
        { name: 'الزهراء', type: 'residential' as const, averageIncome: 'medium' as const },
        { name: 'وسط البلد', type: 'commercial' as const, averageIncome: 'medium' as const }
      ]
    };

    const districts = defaultDistricts[cityId] || defaultDistricts['riyadh'];
    
    return districts.map((district: any, index: number) => ({
      id: `${cityId}_${index}`,
      name: district.name,
      cityId,
      coordinates: { lat: 0, lng: 0 },
      type: district.type,
      averageIncome: district.averageIncome,
      populationDensity: 1000,
      developmentLevel: 'established' as const
    }));
  }

  // Cache management methods
  clearCache(): void {
    this.citiesCache.clear();
    this.districtsCache.clear();
    this.serviceProvidersCache.clear();
  }

  clearCityCache(cityId: string): void {
    this.citiesCache.delete(cityId);
    this.districtsCache.delete(cityId);
    this.serviceProvidersCache.delete(cityId);
  }
}

// Singleton instance
export const cityBasedFilteringService = new CityBasedFilteringService();

// Utility functions
export async function getCitiesWithService(serviceType: string): Promise<CityData[]> {
  const results = await cityBasedFilteringService.searchCitiesByServiceAvailability([serviceType]);
  return results.map(result => result.city);
}

export async function findBestCityForProject(
  requiredServices: string[],
  criteria: FilterCriteria
): Promise<CityFilterResult | null> {
  const results = await cityBasedFilteringService.searchCitiesByServiceAvailability(
    requiredServices, 
    criteria
  );
  return results.length > 0 ? results[0] : null;
}


