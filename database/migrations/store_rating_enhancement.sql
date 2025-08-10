-- Add store rating and evaluation system enhancements
-- This script adds missing evaluation fields and data

-- Add evaluation/rating fields to stores table if not exists
DO $$ 
BEGIN 
    -- Add rating fields if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'average_rating') THEN
        ALTER TABLE stores ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 4.5;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'total_reviews') THEN
        ALTER TABLE stores ADD COLUMN total_reviews INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'verification_status') THEN
        ALTER TABLE stores ADD COLUMN verification_status VARCHAR(20) DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'suspended'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'featured') THEN
        ALTER TABLE stores ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create store metrics table for detailed analytics
CREATE TABLE IF NOT EXISTS store_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly'
    metric_date DATE NOT NULL,
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0,
    customer_satisfaction DECIMAL(3,2) DEFAULT 0,
    return_rate DECIMAL(5,2) DEFAULT 0,
    response_time_hours DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create store categories table
CREATE TABLE IF NOT EXISTS store_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    category_name_ar VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Update existing store with enhanced data
UPDATE stores SET 
    average_rating = 4.7,
    total_reviews = 47,
    verification_status = 'verified',
    featured = true,
    total_sales = 285750.00,
    total_orders = 186
WHERE email = 'store@binna.com';

-- Insert store metrics for the past month
INSERT INTO store_metrics (store_id, metric_type, metric_date, total_sales, total_orders, new_customers, average_order_value, customer_satisfaction, return_rate, response_time_hours)
SELECT 
    (SELECT id FROM stores WHERE email = 'store@binna.com'),
    'daily',
    date_series.metric_date,
    CASE 
        WHEN EXTRACT(dow FROM date_series.metric_date) IN (0, 6) THEN 3500 + (RANDOM() * 2000) -- Weekend
        ELSE 5500 + (RANDOM() * 3000) -- Weekday
    END,
    CASE 
        WHEN EXTRACT(dow FROM date_series.metric_date) IN (0, 6) THEN 8 + (RANDOM() * 5)::INTEGER -- Weekend
        ELSE 12 + (RANDOM() * 8)::INTEGER -- Weekday
    END,
    (RANDOM() * 3)::INTEGER,
    450 + (RANDOM() * 200),
    4.3 + (RANDOM() * 0.7),
    1.5 + (RANDOM() * 2),
    2 + (RANDOM() * 4)
FROM (
    SELECT CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 29) AS metric_date
) AS date_series;

-- Insert store categories
INSERT INTO store_categories (store_id, category_name, category_name_ar, is_primary) VALUES
((SELECT id FROM stores WHERE email = 'store@binna.com'), 'Construction Materials', 'مواد البناء', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), 'Hardware Tools', 'أدوات العتاد', false),
((SELECT id FROM stores WHERE email = 'store@binna.com'), 'Home Improvement', 'تحسين المنزل', false),
((SELECT id FROM stores WHERE email = 'store@binna.com'), 'Electrical Supplies', 'المواد الكهربائية', false);

-- Add more sample reviews for rating calculation
INSERT INTO store_reviews (store_id, customer_id, rating, review_text, review_title, verified_purchase) VALUES
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'ahmed@example.com'), 5, 'خدمة عملاء ممتازة وسرعة في التوصيل. أنصح بشدة', 'خدمة رائعة', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'fatima@example.com'), 4, 'جودة المنتجات جيدة والأسعار معقولة', 'تجربة إيجابية', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'mohammed@example.com'), 5, 'أفضل متجر للمواد الإنشائية في المنطقة', 'الأفضل في المنطقة', true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_store_metrics_store_date ON store_metrics(store_id, metric_date);
CREATE INDEX IF NOT EXISTS idx_store_categories_store ON store_categories(store_id);

-- Update store rating based on all reviews
SELECT update_store_rating();

-- Create a view for store dashboard analytics
CREATE OR REPLACE VIEW store_dashboard_analytics AS
SELECT 
    s.id,
    s.name,
    s.email,
    s.average_rating,
    s.total_reviews,
    s.total_sales,
    s.total_orders,
    s.verification_status,
    s.featured,
    COALESCE(recent_metrics.daily_avg_sales, 0) as avg_daily_sales,
    COALESCE(recent_metrics.daily_avg_orders, 0) as avg_daily_orders,
    COALESCE(recent_metrics.satisfaction, 4.5) as customer_satisfaction,
    COALESCE(recent_metrics.response_time, 3.0) as avg_response_time
FROM stores s
LEFT JOIN (
    SELECT 
        store_id,
        AVG(total_sales) as daily_avg_sales,
        AVG(total_orders) as daily_avg_orders,
        AVG(customer_satisfaction) as satisfaction,
        AVG(response_time_hours) as response_time
    FROM store_metrics 
    WHERE metric_date >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY store_id
) recent_metrics ON s.id = recent_metrics.store_id;
