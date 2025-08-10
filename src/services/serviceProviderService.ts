// Service Provider Registration Platform
// Comprehensive platform for construction service providers to register and manage their services

import { BaseService } from './BaseService';

export interface ServiceCategory {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  requirements: string[];
  averageRating: number;
  providerCount: number;
  isPopular: boolean;
}

export interface ServiceProvider {
  id: string;
  businessName: string;
  businessNameAr: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: 'individual' | 'company' | 'corporation';
  commercialRegister?: string;
  taxId?: string;
  
  // Service Information
  serviceCategories: string[]; // Category IDs
  serviceDescription: string;
  serviceDescriptionAr: string;
  experienceYears: number;
  teamSize: number;
  
  // Location & Coverage
  city: string;
  district: string;
  address: string;
  coordinates: { lat: number; lng: number };
  serviceAreas: string[];
  maxServiceRadius: number; // in km
  
  // Verification & Credentials
  verificationStatus: 'pending' | 'verified' | 'rejected';
  documents: {
    commercialRegisterCopy?: string;
    taxCertificate?: string;
    insuranceCertificate?: string;
    portfolioImages: string[];
    certifications: string[];
  };
  
  // Pricing & Availability
  pricing: {
    hourlyRate?: number;
    dailyRate?: number;
    projectRate?: number;
    priceRange: 'budget' | 'mid-range' | 'premium';
    paymentTerms: string[];
    emergencyRate?: number; // percentage increase for emergency services
  };
  
  availability: {
    workingDays: string[];
    workingHours: { start: string; end: string };
    emergencyService: boolean;
    advanceBookingRequired: number; // days
    seasonalAvailability?: string;
  };
  
  // Performance Metrics
  rating: number;
  reviewCount: number;
  completedProjects: number;
  responseTime: number; // hours
  onTimePerformance: number; // percentage
  
  // Features & Specializations
  specializations: string[];
  equipmentOwned: string[];
  languages: string[];
  certifications: string[];
  awards: string[];
  
  // Business Profile
  establishedYear: number;
  companyLogo?: string;
  coverImage?: string;
  portfolioImages: string[];
  
  // Contact & Social
  website?: string;
  socialMedia: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
  
  // Status & Settings
  isActive: boolean;
  isPremium: boolean;
  subscriptionTier: 'basic' | 'professional' | 'enterprise';
  lastActiveAt: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  providerId?: string;
  serviceCategory: string;
  
  // Project Details
  projectTitle: string;
  projectDescription: string;
  projectType: string;
  estimatedBudget: { min: number; max: number };
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  
  // Location & Timing
  projectLocation: string;
  coordinates: { lat: number; lng: number };
  preferredStartDate: Date;
  estimatedDuration: number; // days
  flexibleTiming: boolean;
  
  // Requirements
  requiredSkills: string[];
  equipmentNeeded: string[];
  teamSizeNeeded: number;
  specialRequirements: string[];
  
  // Status & Communication
  status: 'open' | 'proposals-received' | 'provider-selected' | 'in-progress' | 'completed' | 'cancelled';
  proposals: ServiceProposal[];
  selectedProviderId?: string;
  
  // Customer Preferences
  preferredProviderType: 'individual' | 'company' | 'any';
  maxResponseTime: number; // hours
  requiresInsurance: boolean;
  requiresPortfolio: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceProposal {
  id: string;
  requestId: string;
  providerId: string;
  
  // Proposal Details
  proposedCost: number;
  estimatedDuration: number; // days
  startDate: Date;
  methodology: string;
  
  // Provider Commitment
  teamAssigned: {
    size: number;
    specializations: string[];
    experience: string;
  };
  equipmentIncluded: string[];
  materialsIncluded: boolean;
  
  // Terms & Conditions
  paymentTerms: string;
  warrantyPeriod?: number; // months
  milestones: {
    description: string;
    duration: number;
    payment: number;
  }[];
  
  // Additional Info
  similarProjectsCompleted: number;
  portfolioReferences: string[];
  additionalNotes: string;
  
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: Date;
  respondedAt?: Date;
}

export interface ProviderReview {
  id: string;
  providerId: string;
  customerId: string;
  projectId: string;
  
  rating: number; // 1-5
  reviewText: string;
  
  // Detailed Ratings
  ratings: {
    quality: number;
    timeliness: number;
    communication: number;
    professionalism: number;
    valueForMoney: number;
  };
  
  // Review Details
  projectType: string;
  projectValue: number;
  wouldRecommend: boolean;
  images?: string[];
  
  // Response
  providerResponse?: {
    text: string;
    respondedAt: Date;
  };
  
  // Verification
  isVerified: boolean;
  helpfulVotes: number;
  
  createdAt: Date;
}

class ServiceProviderService extends BaseService {
  private static instance: ServiceProviderService;

  static getInstance(): ServiceProviderService {
    if (!ServiceProviderService.instance) {
      ServiceProviderService.instance = new ServiceProviderService();
    }
    return ServiceProviderService.instance;
  }

  // Register new service provider
  async registerServiceProvider(providerData: Omit<ServiceProvider, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount' | 'completedProjects' | 'responseTime' | 'onTimePerformance'>): Promise<ServiceProvider> {
    try {
      const { data: provider, error } = await this.supabase
        .from('service_providers')
        .insert({
          business_name: providerData.businessName,
          business_name_ar: providerData.businessNameAr,
          owner_name: providerData.ownerName,
          email: providerData.email,
          phone: providerData.phone,
          business_type: providerData.businessType,
          commercial_register: providerData.commercialRegister,
          tax_id: providerData.taxId,
          service_categories: providerData.serviceCategories,
          service_description: providerData.serviceDescription,
          service_description_ar: providerData.serviceDescriptionAr,
          experience_years: providerData.experienceYears,
          team_size: providerData.teamSize,
          city: providerData.city,
          district: providerData.district,
          address: providerData.address,
          coordinates: providerData.coordinates,
          service_areas: providerData.serviceAreas,
          max_service_radius: providerData.maxServiceRadius,
          verification_status: 'pending',
          documents: providerData.documents,
          pricing: providerData.pricing,
          availability: providerData.availability,
          rating: 0,
          review_count: 0,
          completed_projects: 0,
          response_time: 24,
          on_time_performance: 100,
          specializations: providerData.specializations,
          equipment_owned: providerData.equipmentOwned,
          languages: providerData.languages,
          certifications: providerData.certifications,
          awards: providerData.awards,
          established_year: providerData.establishedYear,
          company_logo: providerData.companyLogo,
          cover_image: providerData.coverImage,
          portfolio_images: providerData.portfolioImages,
          website: providerData.website,
          social_media: providerData.socialMedia,
          is_active: true,
          is_premium: false,
          subscription_tier: 'basic',
          last_active_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Send verification notification
      await this.sendVerificationNotification(provider.id);

      return this.mapToServiceProvider(provider);
    } catch (error) {
      console.error('Error registering service provider:', error);
      throw new Error('Failed to register service provider');
    }
  }

  // Get service categories
  async getServiceCategories(): Promise<ServiceCategory[]> {
    try {
      const { data: categories, error } = await this.supabase
        .from('service_categories')
        .select(`
          *,
          provider_count:service_providers(count)
        `)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      return categories.map(this.mapToServiceCategory);
    } catch (error) {
      console.error('Error fetching service categories:', error);
      return [];
    }
  }

  // Search service providers
  async searchServiceProviders(filters: {
    category?: string;
    city?: string;
    priceRange?: string;
    rating?: number;
    verifiedOnly?: boolean;
    emergencyService?: boolean;
    searchText?: string;
    coordinates?: { lat: number; lng: number };
    radius?: number;
  }): Promise<ServiceProvider[]> {
    try {
      let query = this.supabase
        .from('service_providers')
        .select('*')
        .eq('is_active', true);

      // Apply filters
      if (filters.category) {
        query = query.contains('service_categories', [filters.category]);
      }

      if (filters.city) {
        query = query.eq('city', filters.city);
      }

      if (filters.priceRange) {
        query = query.eq('pricing->price_range', filters.priceRange);
      }

      if (filters.rating) {
        query = query.gte('rating', filters.rating);
      }

      if (filters.verifiedOnly) {
        query = query.eq('verification_status', 'verified');
      }

      if (filters.emergencyService) {
        query = query.eq('availability->emergency_service', true);
      }

      if (filters.searchText) {
        query = query.or(`business_name.ilike.%${filters.searchText}%,business_name_ar.ilike.%${filters.searchText}%,service_description.ilike.%${filters.searchText}%`);
      }

      const { data: providers, error } = await query
        .order('rating', { ascending: false })
        .order('review_count', { ascending: false });

      if (error) throw error;

      let results = providers.map(this.mapToServiceProvider);

      // Apply location-based filtering if coordinates provided
      if (filters.coordinates && filters.radius) {
        results = results.filter(provider => {
          const distance = this.calculateDistance(
            filters.coordinates!,
            provider.coordinates
          );
          return distance <= (filters.radius || 50);
        });
      }

      return results;
    } catch (error) {
      console.error('Error searching service providers:', error);
      return [];
    }
  }

  // Submit service request
  async submitServiceRequest(requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'proposals' | 'status'>): Promise<ServiceRequest> {
    try {
      const { data: request, error } = await this.supabase
        .from('service_requests')
        .insert({
          customer_id: requestData.customerId,
          service_category: requestData.serviceCategory,
          project_title: requestData.projectTitle,
          project_description: requestData.projectDescription,
          project_type: requestData.projectType,
          estimated_budget: requestData.estimatedBudget,
          urgency: requestData.urgency,
          project_location: requestData.projectLocation,
          coordinates: requestData.coordinates,
          preferred_start_date: requestData.preferredStartDate.toISOString(),
          estimated_duration: requestData.estimatedDuration,
          flexible_timing: requestData.flexibleTiming,
          required_skills: requestData.requiredSkills,
          equipment_needed: requestData.equipmentNeeded,
          team_size_needed: requestData.teamSizeNeeded,
          special_requirements: requestData.specialRequirements,
          status: 'open',
          preferred_provider_type: requestData.preferredProviderType,
          max_response_time: requestData.maxResponseTime,
          requires_insurance: requestData.requiresInsurance,
          requires_portfolio: requestData.requiresPortfolio,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Notify matching providers
      await this.notifyMatchingProviders(request.id, requestData.serviceCategory, requestData.coordinates);

      return this.mapToServiceRequest(request);
    } catch (error) {
      console.error('Error submitting service request:', error);
      throw new Error('Failed to submit service request');
    }
  }

  // Submit proposal for service request
  async submitProposal(proposalData: Omit<ServiceProposal, 'id' | 'submittedAt' | 'status'>): Promise<ServiceProposal> {
    try {
      // Check if provider already submitted a proposal
      const { data: existingProposal } = await this.supabase
        .from('service_proposals')
        .select('id')
        .eq('request_id', proposalData.requestId)
        .eq('provider_id', proposalData.providerId)
        .single();

      if (existingProposal) {
        throw new Error('Proposal already submitted for this request');
      }

      const { data: proposal, error } = await this.supabase
        .from('service_proposals')
        .insert({
          request_id: proposalData.requestId,
          provider_id: proposalData.providerId,
          proposed_cost: proposalData.proposedCost,
          estimated_duration: proposalData.estimatedDuration,
          start_date: proposalData.startDate.toISOString(),
          methodology: proposalData.methodology,
          team_assigned: proposalData.teamAssigned,
          equipment_included: proposalData.equipmentIncluded,
          materials_included: proposalData.materialsIncluded,
          payment_terms: proposalData.paymentTerms,
          warranty_period: proposalData.warrantyPeriod,
          milestones: proposalData.milestones,
          similar_projects_completed: proposalData.similarProjectsCompleted,
          portfolio_references: proposalData.portfolioReferences,
          additional_notes: proposalData.additionalNotes,
          status: 'pending',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update request status
      await this.supabase
        .from('service_requests')
        .update({ 
          status: 'proposals-received',
          updated_at: new Date().toISOString()
        })
        .eq('id', proposalData.requestId);

      // Notify customer
      await this.notifyCustomerNewProposal(proposalData.requestId, proposalData.providerId);

      return this.mapToServiceProposal(proposal);
    } catch (error) {
      console.error('Error submitting proposal:', error);
      throw new Error('Failed to submit proposal');
    }
  }

  // Get provider dashboard data
  async getProviderDashboard(providerId: string): Promise<{
    provider: ServiceProvider;
    stats: {
      totalRequests: number;
      activeProposals: number;
      completedProjects: number;
      monthlyEarnings: number;
      averageRating: number;
    };
    recentRequests: ServiceRequest[];
    recentReviews: ProviderReview[];
  }> {
    try {
      const [providerData, requestsData, proposalsData, reviewsData] = await Promise.all([
        this.supabase
          .from('service_providers')
          .select('*')
          .eq('id', providerId)
          .single(),
        
        this.supabase
          .from('service_requests')
          .select('*')
          .contains('service_categories', ['category']) // This would need proper filtering
          .order('created_at', { ascending: false })
          .limit(10),
        
        this.supabase
          .from('service_proposals')
          .select('*')
          .eq('provider_id', providerId)
          .eq('status', 'pending'),
        
        this.supabase
          .from('provider_reviews')
          .select('*')
          .eq('provider_id', providerId)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const provider = this.mapToServiceProvider(providerData.data);
      const recentRequests = requestsData.data?.map(this.mapToServiceRequest) || [];
      const recentReviews = reviewsData.data?.map(this.mapToProviderReview) || [];

      // Calculate stats
      const stats = {
        totalRequests: recentRequests.length,
        activeProposals: proposalsData.data?.length || 0,
        completedProjects: provider.completedProjects,
        monthlyEarnings: 0, // This would need actual earnings calculation
        averageRating: provider.rating
      };

      return {
        provider,
        stats,
        recentRequests,
        recentReviews
      };
    } catch (error) {
      console.error('Error fetching provider dashboard:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }

  // Submit review for provider
  async submitProviderReview(reviewData: Omit<ProviderReview, 'id' | 'createdAt' | 'helpfulVotes' | 'isVerified'>): Promise<ProviderReview> {
    try {
      const { data: review, error } = await this.supabase
        .from('provider_reviews')
        .insert({
          provider_id: reviewData.providerId,
          customer_id: reviewData.customerId,
          project_id: reviewData.projectId,
          rating: reviewData.rating,
          review_text: reviewData.reviewText,
          ratings: reviewData.ratings,
          project_type: reviewData.projectType,
          project_value: reviewData.projectValue,
          would_recommend: reviewData.wouldRecommend,
          images: reviewData.images,
          provider_response: reviewData.providerResponse,
          is_verified: false,
          helpful_votes: 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update provider's rating
      await this.updateProviderRating(reviewData.providerId);

      return this.mapToProviderReview(review);
    } catch (error) {
      console.error('Error submitting review:', error);
      throw new Error('Failed to submit review');
    }
  }

  // Private helper methods
  private async sendVerificationNotification(providerId: string): Promise<void> {
    await this.supabase
      .from('notifications')
      .insert({
        recipient_id: providerId,
        type: 'provider_verification',
        title: 'مراجعة طلب التسجيل',
        message: 'تم استلام طلب التسجيل وسيتم مراجعته خلال 48 ساعة',
        created_at: new Date().toISOString()
      });
  }

  private async notifyMatchingProviders(requestId: string, category: string, coordinates: { lat: number; lng: number }): Promise<void> {
    // This would implement logic to find and notify matching providers
    console.log('Notifying matching providers for request:', requestId);
  }

  private async notifyCustomerNewProposal(requestId: string, providerId: string): Promise<void> {
    const { data: request } = await this.supabase
      .from('service_requests')
      .select('customer_id')
      .eq('id', requestId)
      .single();

    if (request) {
      await this.supabase
        .from('notifications')
        .insert({
          recipient_id: request.customer_id,
          type: 'new_proposal',
          title: 'عرض جديد لمشروعك',
          message: 'تم استلام عرض جديد لمشروعك من أحد مقدمي الخدمة',
          data: { requestId, providerId },
          created_at: new Date().toISOString()
        });
    }
  }

  private async updateProviderRating(providerId: string): Promise<void> {
    const { data: reviews } = await this.supabase
      .from('provider_reviews')
      .select('rating')
      .eq('provider_id', providerId);

    if (reviews && reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await this.supabase
        .from('service_providers')
        .update({
          rating: Math.round(averageRating * 10) / 10,
          review_count: reviews.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', providerId);
    }
  }

  private calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Mapping functions
  private mapToServiceCategory(data: any): ServiceCategory {
    return {
      id: data.id,
      name: data.name,
      nameAr: data.name_ar,
      description: data.description,
      descriptionAr: data.description_ar,
      icon: data.icon,
      requirements: data.requirements || [],
      averageRating: data.average_rating || 0,
      providerCount: data.provider_count || 0,
      isPopular: data.is_popular || false
    };
  }

  private mapToServiceProvider(data: any): ServiceProvider {
    return {
      id: data.id,
      businessName: data.business_name,
      businessNameAr: data.business_name_ar,
      ownerName: data.owner_name,
      email: data.email,
      phone: data.phone,
      businessType: data.business_type,
      commercialRegister: data.commercial_register,
      taxId: data.tax_id,
      serviceCategories: data.service_categories || [],
      serviceDescription: data.service_description,
      serviceDescriptionAr: data.service_description_ar,
      experienceYears: data.experience_years,
      teamSize: data.team_size,
      city: data.city,
      district: data.district,
      address: data.address,
      coordinates: data.coordinates,
      serviceAreas: data.service_areas || [],
      maxServiceRadius: data.max_service_radius,
      verificationStatus: data.verification_status,
      documents: data.documents || {},
      pricing: data.pricing || {},
      availability: data.availability || {},
      rating: data.rating,
      reviewCount: data.review_count,
      completedProjects: data.completed_projects,
      responseTime: data.response_time,
      onTimePerformance: data.on_time_performance,
      specializations: data.specializations || [],
      equipmentOwned: data.equipment_owned || [],
      languages: data.languages || [],
      certifications: data.certifications || [],
      awards: data.awards || [],
      establishedYear: data.established_year,
      companyLogo: data.company_logo,
      coverImage: data.cover_image,
      portfolioImages: data.portfolio_images || [],
      website: data.website,
      socialMedia: data.social_media || {},
      isActive: data.is_active,
      isPremium: data.is_premium,
      subscriptionTier: data.subscription_tier,
      lastActiveAt: new Date(data.last_active_at),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapToServiceRequest(data: any): ServiceRequest {
    return {
      id: data.id,
      customerId: data.customer_id,
      providerId: data.provider_id,
      serviceCategory: data.service_category,
      projectTitle: data.project_title,
      projectDescription: data.project_description,
      projectType: data.project_type,
      estimatedBudget: data.estimated_budget,
      urgency: data.urgency,
      projectLocation: data.project_location,
      coordinates: data.coordinates,
      preferredStartDate: new Date(data.preferred_start_date),
      estimatedDuration: data.estimated_duration,
      flexibleTiming: data.flexible_timing,
      requiredSkills: data.required_skills || [],
      equipmentNeeded: data.equipment_needed || [],
      teamSizeNeeded: data.team_size_needed,
      specialRequirements: data.special_requirements || [],
      status: data.status,
      proposals: [], // Would be loaded separately
      selectedProviderId: data.selected_provider_id,
      preferredProviderType: data.preferred_provider_type,
      maxResponseTime: data.max_response_time,
      requiresInsurance: data.requires_insurance,
      requiresPortfolio: data.requires_portfolio,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapToServiceProposal(data: any): ServiceProposal {
    return {
      id: data.id,
      requestId: data.request_id,
      providerId: data.provider_id,
      proposedCost: data.proposed_cost,
      estimatedDuration: data.estimated_duration,
      startDate: new Date(data.start_date),
      methodology: data.methodology,
      teamAssigned: data.team_assigned,
      equipmentIncluded: data.equipment_included || [],
      materialsIncluded: data.materials_included,
      paymentTerms: data.payment_terms,
      warrantyPeriod: data.warranty_period,
      milestones: data.milestones || [],
      similarProjectsCompleted: data.similar_projects_completed,
      portfolioReferences: data.portfolio_references || [],
      additionalNotes: data.additional_notes,
      status: data.status,
      submittedAt: new Date(data.submitted_at),
      respondedAt: data.responded_at ? new Date(data.responded_at) : undefined
    };
  }

  private mapToProviderReview(data: any): ProviderReview {
    return {
      id: data.id,
      providerId: data.provider_id,
      customerId: data.customer_id,
      projectId: data.project_id,
      rating: data.rating,
      reviewText: data.review_text,
      ratings: data.ratings,
      projectType: data.project_type,
      projectValue: data.project_value,
      wouldRecommend: data.would_recommend,
      images: data.images,
      providerResponse: data.provider_response,
      isVerified: data.is_verified,
      helpfulVotes: data.helpful_votes,
      createdAt: new Date(data.created_at)
    };
  }
}

export const serviceProviderService = ServiceProviderService.getInstance();
export default serviceProviderService;
