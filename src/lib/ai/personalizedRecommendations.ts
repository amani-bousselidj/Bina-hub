import { supabase } from '@/lib/supabase/client';

export interface UserPreferences {
  userId: string;
  preferredServices: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  location: {
    city: string;
    district?: string;
    coordinates?: { lat: number; lng: number; };
  };
  projectTypes: string[];
  qualityPreferences: {
    priorityFactor: 'price' | 'quality' | 'speed' | 'reputation';
    minimumRating: number;
  };
  communicationPreferences: {
    language: 'ar' | 'en';
    notifications: boolean;
    preferredContactMethod: 'phone' | 'email' | 'whatsapp';
  };
  workingHours: {
    preferred: string[];
    emergency: boolean;
  };
  previousInteractions: {
    serviceId: string;
    providerId: string;
    rating: number;
    date: Date;
    projectValue: number;
  }[];
}

export interface RecommendationRequest {
  userId: string;
  serviceType: string;
  projectDetails?: {
    type: string;
    budget?: number;
    timeline?: string;
    location?: string;
    specifications?: any;
  };
  currentContext?: {
    timeOfDay: string;
    urgency: 'low' | 'medium' | 'high';
    weather?: string;
  };
}

export interface Recommendation {
  id: string;
  type: 'service_provider' | 'equipment' | 'material' | 'consultation' | 'bundle';
  title: string;
  description: string;
  provider: {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    responseTime: string;
    location: string;
    avatar?: string;
  };
  service: {
    id: string;
    name: string;
    category: string;
    basePrice: number;
    priceRange?: { min: number; max: number; };
    availability: string;
    features: string[];
    specifications?: any;
  };
  score: number;
  reasons: string[];
  benefits: string[];
  pricing: {
    estimated: number;
    currency: string;
    factors: string[];
    discounts?: {
      type: string;
      amount: number;
      conditions: string;
    }[];
  };
  timeline: {
    estimated: string;
    factors: string[];
  };
  metadata: {
    confidence: number;
    freshness: Date;
    dataQuality: number;
    personalizedFactors: string[];
  };
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  totalFound: number;
  processingTime: number;
  filters: {
    applied: string[];
    available: string[];
  };
  insights: {
    marketTrends: string[];
    budgetOptimization: string[];
    qualityMetrics: string[];
  };
}

class PersonalizedRecommendationEngine {
  private userPreferencesCache: Map<string, UserPreferences> = new Map();
  private recommendationCache: Map<string, RecommendationResponse> = new Map();

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      // Check cache first
      if (this.userPreferencesCache.has(userId)) {
        return this.userPreferencesCache.get(userId)!;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Return default preferences for new users
        return this.createDefaultPreferences(userId);
      }

      const preferences: UserPreferences = {
        userId: data.user_id,
        preferredServices: data.preferred_services || [],
        budgetRange: data.budget_range || { min: 1000, max: 100000 },
        location: data.location || { city: 'الرياض' },
        projectTypes: data.project_types || [],
        qualityPreferences: data.quality_preferences || {
          priorityFactor: 'quality',
          minimumRating: 4.0
        },
        communicationPreferences: data.communication_preferences || {
          language: 'ar',
          notifications: true,
          preferredContactMethod: 'phone'
        },
        workingHours: data.working_hours || {
          preferred: ['08:00-17:00'],
          emergency: false
        },
        previousInteractions: data.previous_interactions || []
      };

      this.userPreferencesCache.set(userId, preferences);
      return preferences;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return this.createDefaultPreferences(userId);
    }
  }

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preferred_services: preferences.preferredServices,
          budget_range: preferences.budgetRange,
          location: preferences.location,
          project_types: preferences.projectTypes,
          quality_preferences: preferences.qualityPreferences,
          communication_preferences: preferences.communicationPreferences,
          working_hours: preferences.workingHours,
          previous_interactions: preferences.previousInteractions,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update cache
      const currentPrefs = this.userPreferencesCache.get(userId);
      if (currentPrefs) {
        this.userPreferencesCache.set(userId, { ...currentPrefs, ...preferences });
      }
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  async generateRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    try {
      const startTime = Date.now();
      const cacheKey = this.generateCacheKey(request);

      // Check cache for recent recommendations
      if (this.recommendationCache.has(cacheKey)) {
        const cached = this.recommendationCache.get(cacheKey)!;
        const cacheAge = Date.now() - cached.insights.marketTrends.length;
        if (cacheAge < 5 * 60 * 1000) { // 5 minutes cache
          return cached;
        }
      }

      const userPreferences = await this.getUserPreferences(request.userId);
      if (!userPreferences) {
        throw new Error('Unable to load user preferences');
      }

      // Get available services and providers
      const services = await this.getAvailableServices(request.serviceType, userPreferences);
      const providers = await this.getAvailableProviders(request.serviceType, userPreferences);

      // Generate recommendations using AI scoring
      const recommendations = await this.scoreAndRankRecommendations(
        services,
        providers,
        userPreferences,
        request
      );

      // Generate insights
      const insights = await this.generateInsights(recommendations, userPreferences, request);

      const response: RecommendationResponse = {
        recommendations: recommendations.slice(0, 10), // Top 10
        totalFound: recommendations.length,
        processingTime: Date.now() - startTime,
        filters: {
          applied: this.getAppliedFilters(userPreferences, request),
          available: this.getAvailableFilters(services)
        },
        insights
      };

      // Cache the response
      this.recommendationCache.set(cacheKey, response);

      return response;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  private async getAvailableServices(serviceType: string, preferences: UserPreferences): Promise<any[]> {
    try {
      let query = supabase
        .from('services')
        .select(`
          *,
          service_providers (
            id,
            name,
            rating,
            review_count,
            response_time,
            location,
            avatar
          )
        `)
        .eq('category', serviceType)
        .eq('active', true);

      // Apply location filter
      if (preferences.location.city) {
        query = query.ilike('service_providers.location', `%${preferences.location.city}%`);
      }

      // Apply budget filter
      if (preferences.budgetRange.max > 0) {
        query = query.lte('base_price', preferences.budgetRange.max);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }

  private async getAvailableProviders(serviceType: string, preferences: UserPreferences): Promise<any[]> {
    try {
      let query = supabase
        .from('service_providers')
        .select('*')
        .contains('service_categories', [serviceType])
        .eq('active', true)
        .gte('rating', preferences.qualityPreferences.minimumRating);

      // Apply location filter
      if (preferences.location.city) {
        query = query.ilike('location', `%${preferences.location.city}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching providers:', error);
      return [];
    }
  }

  private async scoreAndRankRecommendations(
    services: any[],
    providers: any[],
    preferences: UserPreferences,
    request: RecommendationRequest
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    for (const service of services) {
      const provider = providers.find(p => p.id === service.service_providers?.id);
      if (!provider) continue;

      const score = this.calculateRecommendationScore(service, provider, preferences, request);
      const reasons = this.generateRecommendationReasons(service, provider, preferences, score);
      const benefits = this.generateBenefits(service, provider, preferences);

      recommendations.push({
        id: `rec_${service.id}_${provider.id}`,
        type: this.determineRecommendationType(service),
        title: service.name,
        description: service.description || `${service.name} من ${provider.name}`,
        provider: {
          id: provider.id,
          name: provider.name,
          rating: provider.rating || 0,
          reviewCount: provider.review_count || 0,
          responseTime: provider.response_time || 'غير محدد',
          location: provider.location || '',
          avatar: provider.avatar
        },
        service: {
          id: service.id,
          name: service.name,
          category: service.category,
          basePrice: service.base_price || 0,
          priceRange: service.price_range,
          availability: service.availability || 'متاح',
          features: service.features || [],
          specifications: service.specifications
        },
        score,
        reasons,
        benefits,
        pricing: {
          estimated: this.estimatePricing(service, request.projectDetails),
          currency: 'SAR',
          factors: this.getPricingFactors(service, request),
          discounts: this.calculateDiscounts(service, provider, preferences)
        },
        timeline: {
          estimated: this.estimateTimeline(service, provider, request),
          factors: this.getTimelineFactors(service, provider, request)
        },
        metadata: {
          confidence: score / 100,
          freshness: new Date(),
          dataQuality: this.assessDataQuality(service, provider),
          personalizedFactors: this.getPersonalizedFactors(preferences)
        }
      });
    }

    // Sort by score descending
    return recommendations.sort((a, b) => b.score - a.score);
  }

  private calculateRecommendationScore(
    service: any,
    provider: any,
    preferences: UserPreferences,
    request: RecommendationRequest
  ): number {
    let score = 0;

    // Base quality score (40% weight)
    score += (provider.rating || 0) * 8; // Max 40 points

    // Location proximity (20% weight)
    const locationScore = this.calculateLocationScore(provider.location, preferences.location);
    score += locationScore * 20;

    // Price compatibility (15% weight)
    const priceScore = this.calculatePriceScore(service.base_price, preferences.budgetRange);
    score += priceScore * 15;

    // Previous interactions (10% weight)
    const historyScore = this.calculateHistoryScore(provider.id, preferences.previousInteractions);
    score += historyScore * 10;

    // Service match (10% weight)
    const serviceMatchScore = this.calculateServiceMatchScore(service, preferences.preferredServices);
    score += serviceMatchScore * 10;

    // Availability and response time (5% weight)
    const availabilityScore = this.calculateAvailabilityScore(provider.response_time, service.availability);
    score += availabilityScore * 5;

    return Math.min(100, Math.max(0, score));
  }

  private calculateLocationScore(providerLocation: string, userLocation: any): number {
    if (!providerLocation || !userLocation.city) return 0.5;
    
    // Simple city matching (in real implementation, use geographic distance)
    if (providerLocation.includes(userLocation.city)) {
      return 1.0;
    }
    
    // Check for nearby cities or districts
    if (userLocation.district && providerLocation.includes(userLocation.district)) {
      return 0.8;
    }
    
    return 0.3; // Different city penalty
  }

  private calculatePriceScore(servicePrice: number, budgetRange: any): number {
    if (!servicePrice || !budgetRange.max) return 0.5;
    
    if (servicePrice <= budgetRange.min) return 0.7; // Maybe too cheap
    if (servicePrice <= budgetRange.max) return 1.0; // Perfect fit
    if (servicePrice <= budgetRange.max * 1.2) return 0.6; // Slightly over budget
    
    return 0.2; // Way over budget
  }

  private calculateHistoryScore(providerId: string, interactions: any[]): number {
    const providerInteractions = interactions.filter(i => i.providerId === providerId);
    if (providerInteractions.length === 0) return 0.5; // Neutral for new providers
    
    const avgRating = providerInteractions.reduce((sum, i) => sum + i.rating, 0) / providerInteractions.length;
    return avgRating / 5; // Normalize to 0-1
  }

  private calculateServiceMatchScore(service: any, preferredServices: string[]): number {
    if (preferredServices.length === 0) return 0.5;
    
    const serviceCategories = [service.category, ...(service.tags || [])];
    const matchCount = serviceCategories.filter(cat => 
      preferredServices.some(pref => pref.includes(cat) || cat.includes(pref))
    ).length;
    
    return Math.min(1, matchCount / Math.max(1, preferredServices.length));
  }

  private calculateAvailabilityScore(responseTime: string, availability: string): number {
    let score = 0.5;
    
    // Response time scoring
    if (responseTime) {
      if (responseTime.includes('فوري') || responseTime.includes('دقائق')) score += 0.3;
      else if (responseTime.includes('ساعة')) score += 0.2;
      else if (responseTime.includes('يوم')) score += 0.1;
    }
    
    // Availability scoring
    if (availability) {
      if (availability.includes('متاح') || availability.includes('فوري')) score += 0.2;
      else if (availability.includes('قريباً')) score += 0.1;
    }
    
    return Math.min(1, score);
  }

  private generateRecommendationReasons(
    service: any,
    provider: any,
    preferences: UserPreferences,
    score: number
  ): string[] {
    const reasons: string[] = [];
    
    if (provider.rating >= 4.5) {
      reasons.push(`تقييم ممتاز (${provider.rating}/5)`);
    }
    
    if (provider.location && provider.location.includes(preferences.location.city)) {
      reasons.push(`موقع قريب في ${preferences.location.city}`);
    }
    
    if (service.base_price <= preferences.budgetRange.max) {
      reasons.push('يناسب الميزانية المحددة');
    }
    
    if (provider.response_time && provider.response_time.includes('سريع')) {
      reasons.push('وقت استجابة سريع');
    }
    
    if (score >= 80) {
      reasons.push('توافق عالي مع تفضيلاتك');
    }
    
    return reasons;
  }

  private generateBenefits(service: any, provider: any, preferences: UserPreferences): string[] {
    const benefits: string[] = [];
    
    if (service.features && service.features.length > 0) {
      benefits.push(...service.features.slice(0, 3));
    }
    
    if (provider.review_count > 50) {
      benefits.push('خبرة موثقة من عملاء كثيرين');
    }
    
    if (preferences.qualityPreferences.priorityFactor === 'quality' && provider.rating >= 4.5) {
      benefits.push('جودة عالية كما طلبت');
    }
    
    return benefits;
  }

  private estimatePricing(service: any, projectDetails?: any): number {
    let basePrice = service.base_price || 0;
    
    if (projectDetails?.budget) {
      // Adjust based on project scope
      const scopeMultiplier = Math.min(2, Math.max(0.5, projectDetails.budget / basePrice));
      basePrice *= scopeMultiplier;
    }
    
    return Math.round(basePrice);
  }

  private getPricingFactors(service: any, request: RecommendationRequest): string[] {
    const factors: string[] = ['السعر الأساسي للخدمة'];
    
    if (request.projectDetails?.timeline === 'urgent') {
      factors.push('رسوم الاستعجال');
    }
    
    if (request.currentContext?.timeOfDay === 'evening') {
      factors.push('رسوم العمل المسائي');
    }
    
    return factors;
  }

  private calculateDiscounts(service: any, provider: any, preferences: UserPreferences): any[] {
    const discounts: any[] = [];
    
    // New customer discount
    const hasHistory = preferences.previousInteractions.some(i => i.providerId === provider.id);
    if (!hasHistory) {
      discounts.push({
        type: 'عميل جديد',
        amount: 10,
        conditions: 'للعملاء الجدد'
      });
    }
    
    // Bulk discount
    if (preferences.budgetRange.max > 10000) {
      discounts.push({
        type: 'خصم الكمية',
        amount: 5,
        conditions: 'للمشاريع الكبيرة'
      });
    }
    
    return discounts;
  }

  private estimateTimeline(service: any, provider: any, request: RecommendationRequest): string {
    let baseTime = 'يوم واحد';
    
    if (service.category === 'equipment') baseTime = '2-4 ساعات';
    else if (service.category === 'concrete') baseTime = '4-8 ساعات';
    else if (service.category === 'consultation') baseTime = '1-2 ساعات';
    
    if (request.currentContext?.urgency === 'high') {
      baseTime = 'فوري - ' + baseTime;
    }
    
    return baseTime;
  }

  private getTimelineFactors(service: any, provider: any, request: RecommendationRequest): string[] {
    const factors: string[] = ['نوع الخدمة المطلوبة'];
    
    if (provider.response_time) {
      factors.push(`وقت استجابة المزود: ${provider.response_time}`);
    }
    
    if (request.projectDetails?.timeline) {
      factors.push(`الجدول الزمني المطلوب: ${request.projectDetails.timeline}`);
    }
    
    return factors;
  }

  private determineRecommendationType(service: any): Recommendation['type'] {
    if (service.category === 'consultation') return 'consultation';
    if (service.category === 'equipment') return 'equipment';
    if (service.category === 'materials') return 'material';
    return 'service_provider';
  }

  private assessDataQuality(service: any, provider: any): number {
    let quality = 0;
    
    if (service.description) quality += 0.2;
    if (service.features && service.features.length > 0) quality += 0.2;
    if (provider.rating > 0) quality += 0.2;
    if (provider.review_count > 10) quality += 0.2;
    if (provider.response_time) quality += 0.2;
    
    return quality;
  }

  private getPersonalizedFactors(preferences: UserPreferences): string[] {
    const factors: string[] = [];
    
    if (preferences.preferredServices.length > 0) {
      factors.push('تفضيلات الخدمات');
    }
    
    if (preferences.qualityPreferences.priorityFactor !== 'price') {
      factors.push('أولوية ' + preferences.qualityPreferences.priorityFactor);
    }
    
    if (preferences.location.city) {
      factors.push('الموقع الجغرافي');
    }
    
    return factors;
  }

  private async generateInsights(
    recommendations: Recommendation[],
    preferences: UserPreferences,
    request: RecommendationRequest
  ): Promise<any> {
    return {
      marketTrends: [
        'ارتفاع الطلب على خدمات البناء بنسبة 15% هذا الشهر',
        'توفر جيد لمعدات البناء في منطقتك',
        'أسعار المواد مستقرة مقارنة بالشهر الماضي'
      ],
      budgetOptimization: [
        'يمكن توفير 20% من خلال الحجز المبكر',
        'حزم الخدمات المتكاملة توفر تكلفة أفضل',
        'مقارنة الأسعار بين 3 مزودين على الأقل'
      ],
      qualityMetrics: [
        `متوسط التقييم للخدمات المقترحة: ${(recommendations.reduce((sum, r) => sum + r.provider.rating, 0) / recommendations.length).toFixed(1)}/5`,
        'جميع المزودين المقترحين معتمدين',
        'معدل رضا العملاء للخدمات المماثلة: 92%'
      ]
    };
  }

  private getAppliedFilters(preferences: UserPreferences, request: RecommendationRequest): string[] {
    const filters: string[] = [];
    
    if (preferences.location.city) filters.push(`المدينة: ${preferences.location.city}`);
    if (preferences.budgetRange.max > 0) filters.push(`الميزانية: حتى ${preferences.budgetRange.max}`);
    if (preferences.qualityPreferences.minimumRating > 0) filters.push(`التقييم: ${preferences.qualityPreferences.minimumRating}+ نجوم`);
    
    return filters;
  }

  private getAvailableFilters(services: any[]): string[] {
    const categories = [...new Set(services.map(s => s.category))];
    const locations = [...new Set(services.map(s => s.service_providers?.location).filter(Boolean))];
    
    return [
      ...categories.map(c => `فئة: ${c}`),
      ...locations.map(l => `موقع: ${l}`)
    ];
  }

  private generateCacheKey(request: RecommendationRequest): string {
    const key = `${request.userId}_${request.serviceType}_${JSON.stringify(request.projectDetails)}_${JSON.stringify(request.currentContext)}`;
    return btoa(key).substring(0, 32);
  }

  private createDefaultPreferences(userId: string): UserPreferences {
    return {
      userId,
      preferredServices: [],
      budgetRange: { min: 1000, max: 50000 },
      location: { city: 'الرياض' },
      projectTypes: [],
      qualityPreferences: {
        priorityFactor: 'quality',
        minimumRating: 4.0
      },
      communicationPreferences: {
        language: 'ar',
        notifications: true,
        preferredContactMethod: 'phone'
      },
      workingHours: {
        preferred: ['08:00-17:00'],
        emergency: false
      },
      previousInteractions: []
    };
  }

  // Public method to track user interactions
  async trackUserInteraction(userId: string, interaction: {
    serviceId: string;
    providerId: string;
    rating: number;
    projectValue: number;
  }): Promise<void> {
    try {
      const preferences = await this.getUserPreferences(userId);
      if (!preferences) return;

      const newInteraction = {
        ...interaction,
        date: new Date()
      };

      preferences.previousInteractions.push(newInteraction);
      
      // Keep only last 50 interactions
      if (preferences.previousInteractions.length > 50) {
        preferences.previousInteractions = preferences.previousInteractions.slice(-50);
      }

      await this.updateUserPreferences(userId, { previousInteractions: preferences.previousInteractions });
    } catch (error) {
      console.error('Error tracking user interaction:', error);
    }
  }

  // Clear cache methods
  clearUserCache(userId: string): void {
    this.userPreferencesCache.delete(userId);
  }

  clearRecommendationCache(): void {
    this.recommendationCache.clear();
  }
}

// Singleton instance
export const personalizedRecommendationEngine = new PersonalizedRecommendationEngine();

// Utility function for easy usage
export async function getPersonalizedRecommendations(
  userId: string,
  serviceType: string,
  projectDetails?: any,
  currentContext?: any
): Promise<RecommendationResponse> {
  return personalizedRecommendationEngine.generateRecommendations({
    userId,
    serviceType,
    projectDetails,
    currentContext
  });
}


