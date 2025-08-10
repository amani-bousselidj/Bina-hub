-- =================================================================
-- BINNA PLATFORM - PHASE 3 DATABASE MIGRATION
-- GCC Market Expansion & Construction Ecosystem Implementation
-- Created: July 6, 2025
-- =================================================================

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- GCC MARKETS MANAGEMENT TABLES
-- =================================================================

-- Main GCC Markets Configuration
CREATE TABLE gcc_markets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(2) NOT NULL UNIQUE, -- SA, AE, KW, QA
    country_name VARCHAR(100) NOT NULL,
    currency_code VARCHAR(3) NOT NULL, -- SAR, AED, KWD, QAR
    timezone VARCHAR(50) NOT NULL,
    language_codes TEXT[] DEFAULT ARRAY['en', 'ar'], -- Supported languages
    market_status VARCHAR(20) DEFAULT 'planned' CHECK (market_status IN ('planned', 'active', 'maintenance', 'disabled')),
    launch_date DATE,
    
    -- Market Configuration
    tax_rate DECIMAL(5,2) DEFAULT 0.00, -- VAT/Tax rate
    commission_rate DECIMAL(5,2) DEFAULT 5.00, -- Platform commission
    min_order_amount DECIMAL(10,2) DEFAULT 0.00,
    free_shipping_threshold DECIMAL(10,2),
    
    -- Compliance & Regulations
    trade_license_required BOOLEAN DEFAULT true,
    tax_certificate_required BOOLEAN DEFAULT true,
    business_verification_required BOOLEAN DEFAULT true,
    
    -- Market Metrics
    total_vendors INTEGER DEFAULT 0,
    total_customers INTEGER DEFAULT 0,
    monthly_revenue DECIMAL(15,2) DEFAULT 0.00,
    growth_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- GCC Market Payment Methods
CREATE TABLE gcc_market_payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID NOT NULL REFERENCES gcc_markets(id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL, -- Emirates NBD, ADCB, QNB, etc.
    provider_code VARCHAR(50) NOT NULL,
    method_type VARCHAR(50) NOT NULL, -- bank_transfer, credit_card, digital_wallet
    currency_codes TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT true,
    processing_fee DECIMAL(5,2) DEFAULT 0.00,
    settlement_days INTEGER DEFAULT 1,
    
    -- Provider Configuration
    api_endpoint TEXT,
    api_credentials JSONB, -- Encrypted credentials
    sandbox_mode BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(market_id, provider_code)
);

-- GCC Market Shipping Providers
CREATE TABLE gcc_market_shipping_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID NOT NULL REFERENCES gcc_markets(id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL,
    provider_code VARCHAR(50) NOT NULL,
    service_types TEXT[] NOT NULL, -- standard, express, overnight, international
    coverage_areas TEXT[] NOT NULL, -- city/region codes
    is_active BOOLEAN DEFAULT true,
    
    -- Pricing Configuration
    base_cost DECIMAL(8,2) DEFAULT 0.00,
    cost_per_kg DECIMAL(6,2) DEFAULT 0.00,
    cost_per_km DECIMAL(4,2) DEFAULT 0.00,
    free_shipping_threshold DECIMAL(10,2),
    
    -- Service Configuration
    api_endpoint TEXT,
    api_credentials JSONB, -- Encrypted credentials
    tracking_url_template TEXT,
    estimated_delivery_days INTEGER DEFAULT 3,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(market_id, provider_code)
);

-- GCC Market Compliance Rules
CREATE TABLE gcc_market_compliance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID NOT NULL REFERENCES gcc_markets(id) ON DELETE CASCADE,
    rule_type VARCHAR(50) NOT NULL, -- tax, import, export, business_license
    rule_name VARCHAR(200) NOT NULL,
    rule_description TEXT,
    is_mandatory BOOLEAN DEFAULT true,
    enforcement_level VARCHAR(20) DEFAULT 'strict' CHECK (enforcement_level IN ('strict', 'moderate', 'advisory')),
    
    -- Rule Configuration
    applicable_categories TEXT[], -- Product categories this applies to
    threshold_amount DECIMAL(10,2), -- Minimum amount for rule application
    percentage_rate DECIMAL(5,2), -- Tax/fee percentage
    fixed_amount DECIMAL(8,2), -- Fixed fee amount
    
    -- Documentation Requirements
    required_documents TEXT[],
    verification_process TEXT,
    renewal_period_days INTEGER,
    
    -- Metadata
    effective_date DATE NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- CONSTRUCTION ECOSYSTEM TABLES
-- =================================================================

-- Construction Material Categories
CREATE TABLE construction_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES construction_categories(id),
    level INTEGER DEFAULT 0,
    path TEXT, -- Materialized path for hierarchy
    sort_order INTEGER DEFAULT 0,
    
    -- Climate Considerations
    climate_critical BOOLEAN DEFAULT false, -- Requires special climate considerations
    seasonal_availability BOOLEAN DEFAULT false,
    optimal_seasons TEXT[], -- best, spring, summer, autumn, winter
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Advanced Construction Materials Database
CREATE TABLE construction_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(300) NOT NULL,
    slug VARCHAR(300) NOT NULL UNIQUE,
    description TEXT,
    category_id UUID NOT NULL REFERENCES construction_categories(id),
    sku VARCHAR(100) UNIQUE,
    
    -- Gulf Climate Specifications
    climate_rating DECIMAL(3,1) DEFAULT 0.0 CHECK (climate_rating >= 0 AND climate_rating <= 10), -- 0-10 scale
    heat_resistance_temp DECIMAL(5,1), -- Maximum temperature tolerance (°C)
    humidity_resistance DECIMAL(3,1), -- 0-10 scale
    sand_resistance DECIMAL(3,1), -- 0-10 scale for sandstorm resistance
    uv_protection_rating DECIMAL(3,1), -- UV resistance rating
    corrosion_resistance DECIMAL(3,1), -- Salt air corrosion resistance
    
    -- Technical Specifications
    specifications JSONB, -- Detailed technical specs
    dimensions JSONB, -- Length, width, height, weight
    material_composition TEXT[],
    quality_standards TEXT[], -- SASO, ASTM, BS, etc.
    certifications TEXT[],
    
    -- Availability & Pricing
    base_price DECIMAL(10,2),
    price_currency VARCHAR(3) DEFAULT 'SAR',
    unit_of_measure VARCHAR(50) DEFAULT 'piece',
    minimum_order_quantity INTEGER DEFAULT 1,
    lead_time_days INTEGER DEFAULT 7,
    seasonal_availability BOOLEAN DEFAULT false,
    
    -- Supplier Information
    supplier_count INTEGER DEFAULT 0,
    average_supplier_rating DECIMAL(2,1) DEFAULT 0.0,
    preferred_suppliers UUID[], -- Array of supplier IDs
    
    -- Usage Guidelines
    recommended_applications TEXT[],
    climate_usage_notes TEXT,
    installation_complexity VARCHAR(20) DEFAULT 'medium' CHECK (installation_complexity IN ('low', 'medium', 'high')),
    professional_installation_required BOOLEAN DEFAULT false,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id)
);

-- Construction Contractors & Service Providers
CREATE TABLE construction_contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(300) NOT NULL,
    trading_name VARCHAR(300),
    registration_number VARCHAR(100) UNIQUE,
    license_number VARCHAR(100),
    license_expiry DATE,
    
    -- Contact Information
    contact_person VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    website TEXT,
    
    -- Location & Coverage
    country_code VARCHAR(2) NOT NULL,
    city VARCHAR(100),
    region VARCHAR(100),
    full_address TEXT,
    service_radius_km INTEGER DEFAULT 50,
    coverage_areas TEXT[], -- Cities/regions they serve
    
    -- Specializations
    primary_specialization VARCHAR(100) NOT NULL,
    secondary_specializations TEXT[],
    services_offered TEXT[],
    construction_types TEXT[], -- residential, commercial, industrial, infrastructure
    project_sizes TEXT[], -- small, medium, large, mega
    
    -- Experience & Qualifications
    years_in_business INTEGER,
    total_projects_completed INTEGER DEFAULT 0,
    current_active_projects INTEGER DEFAULT 0,
    team_size INTEGER,
    engineers_count INTEGER DEFAULT 0,
    supervisors_count INTEGER DEFAULT 0,
    
    -- Ratings & Performance
    overall_rating DECIMAL(2,1) DEFAULT 0.0 CHECK (overall_rating >= 0 AND overall_rating <= 5),
    quality_rating DECIMAL(2,1) DEFAULT 0.0,
    timeliness_rating DECIMAL(2,1) DEFAULT 0.0,
    communication_rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    
    -- Financial Information
    price_range VARCHAR(20), -- $, $$, $$$, $$$$
    payment_terms TEXT,
    insurance_coverage DECIMAL(15,2),
    bond_capacity DECIMAL(15,2),
    
    -- Platform Status
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'suspended', 'rejected')),
    verification_date DATE,
    is_featured BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP WITH TIME ZONE
);

-- Construction Projects Management
CREATE TABLE construction_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(300) NOT NULL,
    project_description TEXT,
    customer_id UUID REFERENCES auth.users(id),
    contractor_id UUID REFERENCES construction_contractors(id),
    
    -- Project Details
    project_type VARCHAR(100) NOT NULL, -- residential, commercial, industrial
    construction_phase VARCHAR(50) DEFAULT 'planning', -- planning, foundation, structure, finishing, completed
    project_status VARCHAR(50) DEFAULT 'active' CHECK (project_status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
    
    -- Location
    country_code VARCHAR(2) NOT NULL,
    city VARCHAR(100),
    address TEXT,
    location_coordinates POINT, -- GPS coordinates
    
    -- Timeline
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    estimated_duration_days INTEGER,
    
    -- Budget & Costs
    estimated_budget DECIMAL(15,2),
    actual_cost DECIMAL(15,2) DEFAULT 0.00,
    materials_cost DECIMAL(15,2) DEFAULT 0.00,
    labor_cost DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'SAR',
    
    -- Climate Considerations
    climate_assessment JSONB, -- Weather impact analysis
    seasonal_constraints TEXT[],
    optimal_work_schedule JSONB, -- Best times for different activities
    
    -- Quality & Compliance
    building_permits TEXT[],
    quality_checkpoints JSONB,
    compliance_status VARCHAR(50) DEFAULT 'pending',
    inspection_reports JSONB,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Building Guidance System
CREATE TABLE building_guidance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    construction_phase VARCHAR(100) NOT NULL, -- foundation, structure, electrical, plumbing, finishing
    category VARCHAR(100) NOT NULL,
    
    -- Climate-Specific Guidance
    climate_zone VARCHAR(50) NOT NULL, -- gulf_coastal, gulf_inland, desert
    applicable_countries TEXT[] DEFAULT ARRAY['SA', 'AE', 'KW', 'QA'],
    seasonal_considerations TEXT[],
    temperature_range JSONB, -- Min/max temperature applicability
    humidity_considerations TEXT,
    
    -- Guidance Content
    overview TEXT NOT NULL,
    detailed_instructions TEXT,
    best_practices TEXT[],
    common_mistakes TEXT[],
    quality_checkpoints TEXT[],
    
    -- Material Recommendations
    recommended_materials UUID[], -- References to construction_materials
    alternative_materials UUID[],
    materials_to_avoid UUID[],
    
    -- Cost & Timeline Estimates
    estimated_cost_range JSONB, -- Min/max cost estimates
    estimated_duration_days INTEGER,
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    professional_required BOOLEAN DEFAULT false,
    
    -- Compliance & Standards
    building_codes TEXT[], -- Applicable building codes
    required_permits TEXT[],
    safety_requirements TEXT[],
    environmental_considerations TEXT[],
    
    -- Metadata
    is_published BOOLEAN DEFAULT true,
    priority_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id)
);

-- =================================================================
-- AI & ANALYTICS ENHANCEMENT TABLES
-- =================================================================

-- AI Model Configurations
CREATE TABLE ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(200) NOT NULL,
    model_type VARCHAR(100) NOT NULL, -- recommendation, prediction, classification, optimization
    model_version VARCHAR(50) NOT NULL,
    description TEXT,
    
    -- Model Configuration
    input_features TEXT[],
    output_features TEXT[],
    model_parameters JSONB,
    training_data_source TEXT,
    
    -- Performance Metrics
    accuracy_score DECIMAL(5,4), -- 0.0000 to 1.0000
    precision_score DECIMAL(5,4),
    recall_score DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    last_trained_at TIMESTAMP WITH TIME ZONE,
    
    -- Deployment Status
    is_active BOOLEAN DEFAULT false,
    deployment_environment VARCHAR(50), -- development, staging, production
    api_endpoint TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id)
);

-- AI-Generated Insights
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES ai_models(id),
    insight_type VARCHAR(100) NOT NULL, -- recommendation, prediction, alert, opportunity
    title VARCHAR(300) NOT NULL,
    description TEXT,
    
    -- Insight Details
    confidence_score DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
    impact_level VARCHAR(20) DEFAULT 'medium' CHECK (impact_level IN ('low', 'medium', 'high')),
    category VARCHAR(100),
    applicable_markets TEXT[], -- Country codes
    
    -- Data & Analysis
    input_data JSONB,
    analysis_results JSONB,
    supporting_evidence TEXT[],
    
    -- Actionability
    is_actionable BOOLEAN DEFAULT false,
    recommended_actions TEXT[],
    estimated_impact JSONB, -- Revenue, cost savings, etc.
    implementation_effort VARCHAR(20), -- low, medium, high
    
    -- Status & Follow-up
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'in_progress', 'implemented', 'dismissed')),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    implementation_notes TEXT,
    
    -- Metadata
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Market Analytics & Predictions
CREATE TABLE market_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID REFERENCES gcc_markets(id),
    analysis_date DATE NOT NULL,
    analysis_type VARCHAR(100) NOT NULL, -- daily, weekly, monthly, quarterly
    
    -- Market Metrics
    total_transactions INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0.00,
    customer_acquisition_count INTEGER DEFAULT 0,
    vendor_acquisition_count INTEGER DEFAULT 0,
    
    -- Growth Metrics
    revenue_growth_rate DECIMAL(5,2) DEFAULT 0.00,
    transaction_growth_rate DECIMAL(5,2) DEFAULT 0.00,
    customer_growth_rate DECIMAL(5,2) DEFAULT 0.00,
    vendor_growth_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Predictions (AI-generated)
    predicted_revenue_next_period DECIMAL(15,2),
    predicted_growth_rate DECIMAL(5,2),
    confidence_interval JSONB, -- Upper and lower bounds
    prediction_accuracy DECIMAL(5,4), -- Accuracy of previous predictions
    
    -- Category Analysis
    top_categories JSONB, -- Best performing categories
    emerging_categories JSONB, -- Growing categories
    declining_categories JSONB, -- Declining categories
    
    -- Customer Insights
    customer_segments JSONB, -- Segment analysis
    customer_behavior_patterns JSONB,
    churn_risk_analysis JSONB,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =================================================================

-- GCC Markets Indexes
CREATE INDEX idx_gcc_markets_country_code ON gcc_markets(country_code);
CREATE INDEX idx_gcc_markets_status ON gcc_markets(market_status);
CREATE INDEX idx_gcc_market_payments_market_id ON gcc_market_payment_methods(market_id);
CREATE INDEX idx_gcc_market_shipping_market_id ON gcc_market_shipping_providers(market_id);
CREATE INDEX idx_gcc_market_compliance_market_id ON gcc_market_compliance(market_id);

-- Construction Indexes
CREATE INDEX idx_construction_materials_category ON construction_materials(category_id);
CREATE INDEX idx_construction_materials_climate_rating ON construction_materials(climate_rating);
CREATE INDEX idx_construction_materials_active ON construction_materials(is_active);
CREATE INDEX idx_construction_contractors_country ON construction_contractors(country_code);
CREATE INDEX idx_construction_contractors_specialization ON construction_contractors(primary_specialization);
CREATE INDEX idx_construction_contractors_rating ON construction_contractors(overall_rating);
CREATE INDEX idx_construction_contractors_verification ON construction_contractors(verification_status);
CREATE INDEX idx_construction_projects_customer ON construction_projects(customer_id);
CREATE INDEX idx_construction_projects_contractor ON construction_projects(contractor_id);
CREATE INDEX idx_construction_projects_status ON construction_projects(project_status);

-- AI & Analytics Indexes
CREATE INDEX idx_ai_models_type ON ai_models(model_type);
CREATE INDEX idx_ai_models_active ON ai_models(is_active);
CREATE INDEX idx_ai_insights_type ON ai_insights(insight_type);
CREATE INDEX idx_ai_insights_status ON ai_insights(status);
CREATE INDEX idx_ai_insights_confidence ON ai_insights(confidence_score);
CREATE INDEX idx_market_analytics_market_date ON market_analytics(market_id, analysis_date);

-- =================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to all relevant tables
CREATE TRIGGER update_gcc_markets_updated_at BEFORE UPDATE ON gcc_markets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gcc_market_payment_methods_updated_at BEFORE UPDATE ON gcc_market_payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gcc_market_shipping_providers_updated_at BEFORE UPDATE ON gcc_market_shipping_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gcc_market_compliance_updated_at BEFORE UPDATE ON gcc_market_compliance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_construction_categories_updated_at BEFORE UPDATE ON construction_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_construction_materials_updated_at BEFORE UPDATE ON construction_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_construction_contractors_updated_at BEFORE UPDATE ON construction_contractors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_construction_projects_updated_at BEFORE UPDATE ON construction_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_building_guidance_updated_at BEFORE UPDATE ON building_guidance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_models_updated_at BEFORE UPDATE ON ai_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_market_analytics_updated_at BEFORE UPDATE ON market_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- INITIAL DATA SEEDING
-- =================================================================

-- Insert GCC Markets
INSERT INTO gcc_markets (country_code, country_name, currency_code, timezone, market_status, tax_rate, commission_rate) VALUES
('SA', 'Saudi Arabia', 'SAR', 'Asia/Riyadh', 'active', 15.00, 5.00),
('AE', 'United Arab Emirates', 'AED', 'Asia/Dubai', 'active', 5.00, 5.00),
('KW', 'Kuwait', 'KWD', 'Asia/Kuwait', 'active', 0.00, 5.00),
('QA', 'Qatar', 'QAR', 'Asia/Qatar', 'active', 0.00, 5.00);

-- Insert Construction Categories
INSERT INTO construction_categories (name, slug, description, level, climate_critical) VALUES
('Foundation Materials', 'foundation-materials', 'Materials for building foundations', 0, true),
('Structural Materials', 'structural-materials', 'Load-bearing construction materials', 0, true),
('Insulation Materials', 'insulation-materials', 'Thermal and moisture insulation', 0, true),
('Roofing Materials', 'roofing-materials', 'Materials for roof construction', 0, true),
('Flooring Materials', 'flooring-materials', 'Interior and exterior flooring', 0, false),
('Electrical Materials', 'electrical-materials', 'Electrical installation materials', 0, false),
('Plumbing Materials', 'plumbing-materials', 'Water and drainage systems', 0, false),
('Finishing Materials', 'finishing-materials', 'Interior and exterior finishing', 0, false);

-- Insert AI Models
INSERT INTO ai_models (model_name, model_type, model_version, description, is_active) VALUES
('GCC Market Growth Predictor', 'prediction', '1.0.0', 'Predicts market growth trends across GCC countries', true),
('Construction Material Recommender', 'recommendation', '1.0.0', 'Recommends optimal materials based on climate and project requirements', true),
('Customer Segmentation Model', 'classification', '1.0.0', 'Segments customers based on behavior and preferences', true),
('Price Optimization Engine', 'optimization', '1.0.0', 'Optimizes pricing strategies for different markets', true),
('Inventory Demand Forecaster', 'prediction', '1.0.0', 'Forecasts inventory demand based on seasonal and market factors', true);

-- =================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================

-- Enable RLS on sensitive tables
ALTER TABLE gcc_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be expanded based on specific requirements)
CREATE POLICY "Users can view active markets" ON gcc_markets FOR SELECT USING (market_status = 'active');
CREATE POLICY "Contractors can view their own data" ON construction_contractors FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can view their own projects" ON construction_projects FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "Authorized users can view insights" ON ai_insights FOR SELECT USING (auth.role() IN ('authenticated'));

-- =================================================================
-- COMPLETED: PHASE 3 DATABASE MIGRATION
-- Total Tables Created: 12
-- Total Indexes Created: 20
-- Total Triggers Created: 11
-- =================================================================
