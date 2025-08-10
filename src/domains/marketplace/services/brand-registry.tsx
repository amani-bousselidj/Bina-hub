// @ts-nocheck
import { MedusaService } from '@medusajs/framework/utils';
import { 
  BrandRegistry, 
  BrandRegistryStatus,
  BrandProtectionLevel,
  IPType,
  DocumentType,
  BrandProtectionAlert,
  AlertType,
  AlertSeverity,
  AlertStatus,
  BrandInfringementCase,
  CaseStatus,
  CaseType,
  BrandStorefront,
  StorefrontStatus
} from '../models/brand-registry';

type CreateBrandRegistryData = {
  vendor_id: string;
  brand_name: string;
  brand_code: string;
  brand_description?: string;
  website_url?: string;
  logo_url?: string;
  product_categories?: string[];
  target_markets?: string[];
  brand_keywords?: string[];
  contact_person_name: string;
  contact_email: string;
  contact_phone?: string;
  contact_address?: string;
  legal_entity_name: string;
  legal_entity_type?: string;
  registration_country?: string;
  tax_id?: string;
  business_license_number?: string;
  protection_level?: BrandProtectionLevel;
  metadata?: Record<string, any>;
  created_by?: string;
};

type UpdateBrandRegistryData = Partial<CreateBrandRegistryData> & {
  status?: BrandRegistryStatus;
  protection_settings?: Record<string, boolean>;
  performance_metrics?: Record<string, number>;
};

type CreateProtectionAlertData = {
  brand_registry_id: string;
  alert_type: AlertType;
  title: string;
  description: string;
  infringing_url?: string;
  infringing_seller_id?: string;
  infringing_product_id?: string;
  infringing_listing_title?: string;
  infringing_images?: string[];
  infringing_description?: string;
  evidence_urls?: string[];
  screenshot_urls?: string[];
  evidence_notes?: string;
  detection_method?: string;
  detection_confidence?: number;
  detection_metadata?: Record<string, any>;
  estimated_impact_revenue?: number;
  estimated_impact_units?: number;
  brand_damage_score?: number;
};

type CreateInfringementCaseData = {
  brand_registry_id: string;
  case_type: CaseType;
  title: string;
  description: string;
  infringing_party_name?: string;
  infringing_party_contact?: string;
  infringing_platform?: string;
  infringing_urls?: string[];
  legal_basis?: Array<{
    ip_type: IPType;
    registration_number: string;
    jurisdiction: string;
    description: string;
  }>;
  estimated_damages?: number;
  lost_sales_units?: number;
  priority_level?: number;
  due_date?: Date;
  assigned_attorney?: string;
  assigned_investigator?: string;
  created_by?: string;
};

type CreateStorefrontData = {
  brand_registry_id: string;
  storefront_name: string;
  storefront_url_slug: string;
  design_config?: Record<string, any>;
  content_sections?: Array<{
    type: 'hero' | 'about' | 'products' | 'testimonials' | 'gallery' | 'contact' | 'custom';
    title?: string;
    subtitle?: string;
    content?: string;
    image_url?: string;
    video_url?: string;
    cta_text?: string;
    cta_url?: string;
    visible?: boolean;
  }>;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  social_media?: Record<string, string>;
  custom_domain?: string;
  metadata?: Record<string, any>;
  created_by?: string;
};

type BrandAnalytics = {
  brand_id: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  protection_summary: {
    total_alerts: number;
    critical_alerts: number;
    resolved_alerts: number;
    average_resolution_time: number;
    infringement_cases: number;
    successful_takedowns: number;
  };
  performance_metrics: {
    total_products: number;
    total_sales: number;
    revenue: number;
    customer_rating: number;
    review_count: number;
    brand_page_views: number;
    search_ranking: number;
    conversion_rate: number;
  };
  market_presence: {
    authorized_sellers: number;
    market_coverage: string[];
    brand_awareness_score: number;
    competitor_analysis: Array<{
      competitor_brand: string;
      market_share: number;
      similarity_score: number;
    }>;
  };
  financial_impact: {
    protection_cost_savings: number;
    revenue_protected: number;
    brand_value_preserved: number;
    legal_costs: number;
  };
};

type InfringementScanResult = {
  scan_id: string;
  brand_registry_id: string;
  scan_date: Date;
  platforms_scanned: string[];
  total_listings_scanned: number;
  potential_infringements: Array<{
    platform: string;
    listing_url: string;
    seller_name: string;
    product_title: string;
    confidence_score: number;
    infringement_type: AlertType;
    risk_level: AlertSeverity;
    evidence: {
      screenshots: string[];
      similarities: string[];
      trademark_matches: string[];
    };
  }>;
  summary: {
    high_risk_count: number;
    medium_risk_count: number;
    low_risk_count: number;
    estimated_revenue_impact: number;
  };
};

export class BrandRegistryService extends MedusaService({
  BrandRegistry,
  BrandProtectionAlert,
  BrandInfringementCase,
  BrandStorefront,
}) {

  // Brand Registry Management
  async createBrandRegistry(data: CreateBrandRegistryData): Promise<BrandRegistry> {
    // Check if brand code is unique
    const existingBrand = await this.brandRegistryRepository_.findOne({ 
      brand_code: data.brand_code 
    });
    
    if (existingBrand) {
      throw new Error(`Brand code ${data.brand_code} already exists`);
    }

    const brand = this.brandRegistryRepository_.create({
      ...data,
      submitted_at: new Date(),
    });

    const savedBrand = await this.brandRegistryRepository_.save(brand);
    
    // Auto-calculate initial verification score
    savedBrand.calculateVerificationScore();
    await this.brandRegistryRepository_.save(savedBrand);

    return savedBrand;
  }

  async updateBrandRegistry(
    id: string, 
    data: UpdateBrandRegistryData
  ): Promise<BrandRegistry> {
    const brand = await this.brandRegistryRepository_.findOne({ id });
    if (!brand) {
      throw new Error(`Brand registry with id ${id} not found`);
    }

    Object.assign(brand, data);
    brand.updated_at = new Date();

    // Recalculate verification score if relevant data changed
    if (data.brand_description || data.website_url || data.logo_url) {
      brand.calculateVerificationScore();
    }

    return await this.brandRegistryRepository_.save(brand);
  }

  async getBrandRegistry(id: string): Promise<BrandRegistry | null> {
    return await this.brandRegistryRepository_.findOne(
      { id },
      { 
        populate: ['protection_alerts', 'infringement_cases', 'storefronts']
      }
    );
  }

  async getBrandRegistryByCode(brandCode: string): Promise<BrandRegistry | null> {
    return await this.brandRegistryRepository_.findOne({ brand_code: brandCode });
  }

  async listBrandRegistries(filters?: {
    vendor_id?: string;
    status?: BrandRegistryStatus;
    protection_level?: BrandProtectionLevel;
    verification_score_min?: number;
    created_from?: Date;
    created_to?: Date;
  }): Promise<BrandRegistry[]> {
    const whereClause: any = {};

    if (filters?.vendor_id) whereClause.vendor_id = filters.vendor_id;
    if (filters?.status) whereClause.status = filters.status;
    if (filters?.protection_level) whereClause.protection_level = filters.protection_level;
    if (filters?.verification_score_min) {
      whereClause.verification_score = { $gte: filters.verification_score_min };
    }
    if (filters?.created_from || filters?.created_to) {
      whereClause.created_at = {};
      if (filters.created_from) whereClause.created_at.$gte = filters.created_from;
      if (filters.created_to) whereClause.created_at.$lte = filters.created_to;
    }

    return await this.brandRegistryRepository_.find(whereClause);
  }

  async approveBrandRegistry(
    id: string, 
    reviewerId: string, 
    notes?: string
  ): Promise<BrandRegistry> {
    const brand = await this.brandRegistryRepository_.findOne({ id });
    if (!brand) {
      throw new Error(`Brand registry with id ${id} not found`);
    }

    brand.updateStatus(BrandRegistryStatus.APPROVED, reviewerId, notes);
    
    // Set initial subscription if approved
    brand.subscription_start_date = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);
    brand.subscription_end_date = endDate;

    return await this.brandRegistryRepository_.save(brand);
  }

  async rejectBrandRegistry(
    id: string, 
    reviewerId: string, 
    reason: string
  ): Promise<BrandRegistry> {
    const brand = await this.brandRegistryRepository_.findOne({ id });
    if (!brand) {
      throw new Error(`Brand registry with id ${id} not found`);
    }

    brand.updateStatus(BrandRegistryStatus.REJECTED, reviewerId, reason);
    return await this.brandRegistryRepository_.save(brand);
  }

  async addIntellectualProperty(
    brandId: string,
    ipData: {
      type: IPType;
      registration_number: string;
      registration_date: string;
      expiration_date?: string;
      jurisdiction: string;
      description: string;
      document_url?: string;
    }
  ): Promise<BrandRegistry> {
    const brand = await this.brandRegistryRepository_.findOne({ id: brandId });
    if (!brand) {
      throw new Error(`Brand registry with id ${brandId} not found`);
    }

    brand.addIntellectualProperty(ipData);
    brand.calculateVerificationScore();
    
    return await this.brandRegistryRepository_.save(brand);
  }

  async addVerificationDocument(
    brandId: string,
    docData: {
      type: DocumentType;
      filename: string;
      url: string;
    }
  ): Promise<BrandRegistry> {
    const brand = await this.brandRegistryRepository_.findOne({ id: brandId });
    if (!brand) {
      throw new Error(`Brand registry with id ${brandId} not found`);
    }

    brand.addVerificationDocument(docData);
    brand.calculateVerificationScore();
    
    return await this.brandRegistryRepository_.save(brand);
  }

  async verifyDocument(
    brandId: string,
    documentIndex: number,
    verifierId: string,
    verified: boolean,
    notes?: string
  ): Promise<BrandRegistry> {
    const brand = await this.brandRegistryRepository_.findOne({ id: brandId });
    if (!brand) {
      throw new Error(`Brand registry with id ${brandId} not found`);
    }

    if (documentIndex >= brand.verification_documents.length) {
      throw new Error(`Document index ${documentIndex} out of range`);
    }

    const document = brand.verification_documents[documentIndex];
    document.verified = verified;
    document.verification_date = new Date().toISOString();
    document.verified_by = verifierId;
    document.notes = notes;

    // Update verification flags based on document type
    switch (document.type) {
      case DocumentType.TRADEMARK_CERTIFICATE:
        brand.trademark_verified = verified;
        break;
      case DocumentType.BUSINESS_LICENSE:
        brand.business_verified = verified;
        break;
      case DocumentType.GOVERNMENT_ID:
        brand.identity_verified = verified;
        break;
      case DocumentType.UTILITY_BILL:
        brand.address_verified = verified;
        break;
    }

    brand.calculateVerificationScore();
    return await this.brandRegistryRepository_.save(brand);
  }

  // Brand Protection Alert Management
  async createProtectionAlert(data: CreateProtectionAlertData): Promise<BrandProtectionAlert> {
    const brand = await this.brandRegistryRepository_.findOne({ 
      id: data.brand_registry_id 
    });
    
    if (!brand) {
      throw new Error(`Brand registry ${data.brand_registry_id} not found`);
    }

    const alert = this.brandProtectionAlertRepository_.create({
      brand_registry: brand,
      ...data,
    });

    // Auto-calculate severity
    alert.severity = alert.calculateSeverity();

    return await this.brandProtectionAlertRepository_.save(alert);
  }

  async updateAlertStatus(
    alertId: string, 
    status: AlertStatus,
    userId?: string
  ): Promise<BrandProtectionAlert> {
    const alert = await this.brandProtectionAlertRepository_.findOne({ id: alertId });
    if (!alert) {
      throw new Error(`Protection alert ${alertId} not found`);
    }

    alert.updateStatus(status, userId);
    return await this.brandProtectionAlertRepository_.save(alert);
  }

  async addAlertAction(
    alertId: string,
    actionData: {
      action: string;
      taken_by: string;
      result: string;
      notes?: string;
    }
  ): Promise<BrandProtectionAlert> {
    const alert = await this.brandProtectionAlertRepository_.findOne({ id: alertId });
    if (!alert) {
      throw new Error(`Protection alert ${alertId} not found`);
    }

    alert.addAction(actionData);
    return await this.brandProtectionAlertRepository_.save(alert);
  }

  async listProtectionAlerts(filters?: {
    brand_registry_id?: string;
    alert_type?: AlertType;
    severity?: AlertSeverity;
    status?: AlertStatus;
    from_date?: Date;
    to_date?: Date;
  }): Promise<BrandProtectionAlert[]> {
    const whereClause: any = {};

    if (filters?.brand_registry_id) {
      whereClause.brand_registry = { id: filters.brand_registry_id };
    }
    if (filters?.alert_type) whereClause.alert_type = filters.alert_type;
    if (filters?.severity) whereClause.severity = filters.severity;
    if (filters?.status) whereClause.status = filters.status;
    if (filters?.from_date || filters?.to_date) {
      whereClause.detected_at = {};
      if (filters.from_date) whereClause.detected_at.$gte = filters.from_date;
      if (filters.to_date) whereClause.detected_at.$lte = filters.to_date;
    }

    return await this.brandProtectionAlertRepository_.find(
      whereClause,
      { populate: ['brand_registry'] }
    );
  }

  // Infringement Case Management
  async createInfringementCase(data: CreateInfringementCaseData): Promise<BrandInfringementCase> {
    const brand = await this.brandRegistryRepository_.findOne({ 
      id: data.brand_registry_id 
    });
    
    if (!brand) {
      throw new Error(`Brand registry ${data.brand_registry_id} not found`);
    }

    // Generate unique case number
    const caseNumber = await this.generateCaseNumber(brand.brand_code);

    const infringementCase = this.brandInfringementCaseRepository_.create({
      brand_registry: brand,
      case_number: caseNumber,
      ...data,
    });

    const savedCase = await this.brandInfringementCaseRepository_.save(infringementCase);

    // Add initial timeline entry
    savedCase.addTimelineEntry({
      action: 'Case Created',
      description: 'Infringement case created and assigned case number',
      performed_by: data.created_by || 'system',
    });

    return await this.brandInfringementCaseRepository_.save(savedCase);
  }

  async updateCaseStatus(
    caseId: string, 
    status: CaseStatus,
    userId?: string
  ): Promise<BrandInfringementCase> {
    const infringementCase = await this.brandInfringementCaseRepository_.findOne({ 
      id: caseId 
    });
    if (!infringementCase) {
      throw new Error(`Infringement case ${caseId} not found`);
    }

    infringementCase.updateStatus(status, userId);
    return await this.brandInfringementCaseRepository_.save(infringementCase);
  }

  async addCaseEvidence(
    caseId: string,
    evidenceData: {
      type: 'screenshot' | 'document' | 'correspondence' | 'purchase_proof' | 'other';
      filename: string;
      url: string;
      description: string;
      collected_by: string;
    }
  ): Promise<BrandInfringementCase> {
    const infringementCase = await this.brandInfringementCaseRepository_.findOne({ 
      id: caseId 
    });
    if (!infringementCase) {
      throw new Error(`Infringement case ${caseId} not found`);
    }

    infringementCase.addEvidence(evidenceData);
    infringementCase.addTimelineEntry({
      action: 'Evidence Added',
      description: `New evidence added: ${evidenceData.description}`,
      performed_by: evidenceData.collected_by,
      documents: [evidenceData.url],
    });

    return await this.brandInfringementCaseRepository_.save(infringementCase);
  }

  async listInfringementCases(filters?: {
    brand_registry_id?: string;
    case_type?: CaseType;
    status?: CaseStatus;
    assigned_attorney?: string;
    priority_level?: number;
  }): Promise<BrandInfringementCase[]> {
    const whereClause: any = {};

    if (filters?.brand_registry_id) {
      whereClause.brand_registry = { id: filters.brand_registry_id };
    }
    if (filters?.case_type) whereClause.case_type = filters.case_type;
    if (filters?.status) whereClause.status = filters.status;
    if (filters?.assigned_attorney) whereClause.assigned_attorney = filters.assigned_attorney;
    if (filters?.priority_level) whereClause.priority_level = filters.priority_level;

    return await this.brandInfringementCaseRepository_.find(
      whereClause,
      { populate: ['brand_registry'] }
    );
  }

  // Brand Storefront Management
  async createBrandStorefront(data: CreateStorefrontData): Promise<BrandStorefront> {
    const brand = await this.brandRegistryRepository_.findOne({ 
      id: data.brand_registry_id 
    });
    
    if (!brand) {
      throw new Error(`Brand registry ${data.brand_registry_id} not found`);
    }

    // Check if URL slug is unique
    const existingStorefront = await this.brandStorefrontRepository_.findOne({
      storefront_url_slug: data.storefront_url_slug
    });

    if (existingStorefront) {
      throw new Error(`Storefront URL slug ${data.storefront_url_slug} already exists`);
    }

    const storefront = this.brandStorefrontRepository_.create({
      brand_registry: brand,
      ...data,
    });

    const savedStorefront = await this.brandStorefrontRepository_.save(storefront);

    // Add default content sections if none provided
    if (!data.content_sections || data.content_sections.length === 0) {
      savedStorefront.addContentSection({
        type: 'hero',
        title: `Welcome to ${brand.brand_name}`,
        subtitle: 'Discover our premium products',
        visible: true,
      });

      savedStorefront.addContentSection({
        type: 'about',
        title: 'About Our Brand',
        content: brand.brand_description || '',
        visible: true,
      });

      await this.brandStorefrontRepository_.save(savedStorefront);
    }

    return savedStorefront;
  }

  async updateStorefront(
    id: string, 
    data: Partial<CreateStorefrontData>
  ): Promise<BrandStorefront> {
    const storefront = await this.brandStorefrontRepository_.findOne({ id });
    if (!storefront) {
      throw new Error(`Brand storefront with id ${id} not found`);
    }

    Object.assign(storefront, data);
    storefront.updated_at = new Date();

    return await this.brandStorefrontRepository_.save(storefront);
  }

  async publishStorefront(id: string, userId?: string): Promise<BrandStorefront> {
    const storefront = await this.brandStorefrontRepository_.findOne({ id });
    if (!storefront) {
      throw new Error(`Brand storefront with id ${id} not found`);
    }

    storefront.publish(userId);
    return await this.brandStorefrontRepository_.save(storefront);
  }

  async unpublishStorefront(id: string, userId?: string): Promise<BrandStorefront> {
    const storefront = await this.brandStorefrontRepository_.findOne({ id });
    if (!storefront) {
      throw new Error(`Brand storefront with id ${id} not found`);
    }

    storefront.unpublish(userId);
    return await this.brandStorefrontRepository_.save(storefront);
  }

  // Analytics and Reporting
  async getBrandAnalytics(
    brandId: string, 
    period: 'day' | 'week' | 'month' | 'quarter' | 'year'
  ): Promise<BrandAnalytics> {
    const brand = await this.brandRegistryRepository_.findOne({ id: brandId });
    if (!brand) {
      throw new Error(`Brand registry ${brandId} not found`);
    }

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    // Get protection alerts and cases
    const alerts = await this.brandProtectionAlertRepository_.find({
      brand_registry: brand,
      detected_at: { $gte: startDate },
    });

    const cases = await this.brandInfringementCaseRepository_.find({
      brand_registry: brand,
      created_at: { $gte: startDate },
    });

    const criticalAlerts = alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length;
    const resolvedAlerts = alerts.filter(a => a.status === AlertStatus.RESOLVED).length;
    const successfulTakedowns = cases.filter(c => 
      c.status === CaseStatus.RESOLVED && 
      c.resolution_method === 'takedown'
    ).length;

    // Calculate average resolution time
    const resolvedAlertsWithTime = alerts.filter(a => 
      a.status === AlertStatus.RESOLVED && a.resolved_at
    );
    const avgResolutionTime = resolvedAlertsWithTime.length > 0 
      ? resolvedAlertsWithTime.reduce((sum, alert) => {
          const resolutionTime = alert.resolved_at!.getTime() - alert.detected_at.getTime();
          return sum + resolutionTime;
        }, 0) / resolvedAlertsWithTime.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    return {
      brand_id: brandId,
      period,
      protection_summary: {
        total_alerts: alerts.length,
        critical_alerts: criticalAlerts,
        resolved_alerts: resolvedAlerts,
        average_resolution_time: avgResolutionTime,
        infringement_cases: cases.length,
        successful_takedowns: successfulTakedowns,
      },
      performance_metrics: {
        total_products: brand.performance_metrics.total_products || 0,
        total_sales: brand.performance_metrics.total_sales || 0,
        revenue: 0, // Would be calculated from actual sales data
        customer_rating: brand.performance_metrics.customer_rating || 0,
        review_count: brand.performance_metrics.review_count || 0,
        brand_page_views: brand.performance_metrics.brand_page_views || 0,
        search_ranking: brand.performance_metrics.search_ranking || 0,
        conversion_rate: 0, // Would be calculated from actual analytics
      },
      market_presence: {
        authorized_sellers: brand.authorized_sellers.filter(s => s.active).length,
        market_coverage: brand.target_markets,
        brand_awareness_score: brand.verification_score || 0,
        competitor_analysis: [], // Would be populated with actual competitor data
      },
      financial_impact: {
        protection_cost_savings: 0, // Would be calculated based on prevented losses
        revenue_protected: alerts.reduce((sum, alert) => 
          sum + (alert.estimated_impact_revenue || 0), 0
        ),
        brand_value_preserved: 0, // Would be calculated based on brand damage prevented
        legal_costs: cases.reduce((sum, case_) => sum + (case_.legal_costs || 0), 0),
      },
    };
  }

  // Automated Infringement Scanning (Amazon-style monitoring)
  async performInfringementScan(
    brandId: string,
    platforms: string[] = ['marketplace', 'social_media', 'search_engines']
  ): Promise<InfringementScanResult> {
    const brand = await this.brandRegistryRepository_.findOne({ id: brandId });
    if (!brand) {
      throw new Error(`Brand registry ${brandId} not found`);
    }

    // This would integrate with actual scanning services
    // For now, return a mock result structure
    const scanId = v4();
    
    // Mock scanning logic - in production this would:
    // 1. Search major marketplaces for similar brand names/keywords
    // 2. Use image recognition to find similar logos/products
    // 3. Monitor social media for brand impersonation
    // 4. Check domain registrations for similar names
    
    const mockInfringements = [
      {
        platform: 'Amazon',
        listing_url: 'https://amazon.com/fake-listing',
        seller_name: 'Suspicious Seller',
        product_title: `Fake ${brand.brand_name} Product`,
        confidence_score: 85,
        infringement_type: AlertType.COUNTERFEIT_PRODUCT,
        risk_level: AlertSeverity.HIGH,
        evidence: {
          screenshots: ['screenshot1.jpg'],
          similarities: ['Brand name match', 'Similar logo'],
          trademark_matches: ['Brand name trademark'],
        },
      },
    ];

    return {
      scan_id: scanId,
      brand_registry_id: brandId,
      scan_date: new Date(),
      platforms_scanned: platforms,
      total_listings_scanned: 1000, // Mock number
      potential_infringements: mockInfringements,
      summary: {
        high_risk_count: mockInfringements.filter(i => i.risk_level === AlertSeverity.HIGH).length,
        medium_risk_count: mockInfringements.filter(i => i.risk_level === AlertSeverity.MEDIUM).length,
        low_risk_count: mockInfringements.filter(i => i.risk_level === AlertSeverity.LOW).length,
        estimated_revenue_impact: mockInfringements.reduce((sum, inf) => sum + 1000, 0), // Mock calculation
      },
    };
  }

  // Helper methods
  private async generateCaseNumber(brandCode: string): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Count existing cases for this brand this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const caseCount = await this.brandInfringementCaseRepository_.count({
      brand_registry: { brand_code: brandCode },
      created_at: { $gte: startOfMonth },
    });

    const sequence = String(caseCount + 1).padStart(4, '0');
    return `${brandCode}-${year}${month}-${sequence}`;
  }

  async deleteBrandRegistry(id: string): Promise<void> {
    await this.brandRegistryRepository_.nativeDelete({ id });
  }
}





