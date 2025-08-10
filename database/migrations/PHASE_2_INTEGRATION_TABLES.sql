-- Payment Gateway Integration Tables
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_id VARCHAR(50) NOT NULL,
  payment_id VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'SAR',
  status VARCHAR(20) NOT NULL,
  success BOOLEAN NOT NULL DEFAULT FALSE,
  transaction_id VARCHAR(100),
  customer_id UUID REFERENCES customers(id),
  metadata JSONB,
  gateway_response JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping & Logistics Tables
CREATE TABLE IF NOT EXISTS shipping_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipping_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id VARCHAR(50) NOT NULL,
  tracking_number VARCHAR(100) NOT NULL UNIQUE,
  label_url TEXT,
  cost DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'SAR',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  service_type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  origin JSONB NOT NULL,
  destination JSONB NOT NULL,
  package_details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ERP Integration Tables
CREATE TABLE IF NOT EXISTS erp_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_id VARCHAR(100) NOT NULL UNIQUE,
  erp_system_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  records_processed INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  errors TEXT[],
  data_summary JSONB,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_id VARCHAR(100),
  activity VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_endpoints (
  id VARCHAR(100) PRIMARY KEY,
  erp_system_id VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  endpoint_url TEXT NOT NULL,
  method VARCHAR(10) NOT NULL,
  headers JSONB,
  authentication JSONB,
  rate_limit JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_sync_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  erp_system_id VARCHAR(50) NOT NULL UNIQUE,
  data_types TEXT[] NOT NULL,
  frequency VARCHAR(20) NOT NULL,
  time VARCHAR(5), -- HH:mm format
  enabled BOOLEAN DEFAULT TRUE,
  next_run TIMESTAMP WITH TIME ZONE,
  last_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_logs_gateway_id ON payment_logs(gateway_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_created_at ON payment_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_logs_customer_id ON payment_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_status ON payment_logs(status);

CREATE INDEX IF NOT EXISTS idx_shipping_logs_activity ON shipping_logs(activity);
CREATE INDEX IF NOT EXISTS idx_shipping_logs_created_at ON shipping_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_shipping_labels_provider_id ON shipping_labels(provider_id);
CREATE INDEX IF NOT EXISTS idx_shipping_labels_tracking_number ON shipping_labels(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipping_labels_status ON shipping_labels(status);

CREATE INDEX IF NOT EXISTS idx_erp_sync_logs_erp_system_id ON erp_sync_logs(erp_system_id);
CREATE INDEX IF NOT EXISTS idx_erp_sync_logs_status ON erp_sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_erp_sync_logs_created_at ON erp_sync_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_erp_activity_logs_sync_id ON erp_activity_logs(sync_id);
CREATE INDEX IF NOT EXISTS idx_erp_activity_logs_activity ON erp_activity_logs(activity);

-- Enable Row Level Security (RLS)
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_sync_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_logs
CREATE POLICY "Users can view their own payment logs" ON payment_logs
  FOR SELECT USING (
    customer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM stores WHERE user_id = auth.uid())
  );

CREATE POLICY "Store owners can manage payment logs" ON payment_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM stores WHERE user_id = auth.uid())
  );

-- RLS Policies for shipping tables
CREATE POLICY "Store owners can access shipping logs" ON shipping_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM stores WHERE user_id = auth.uid())
  );

CREATE POLICY "Store owners can access shipping labels" ON shipping_labels
  FOR ALL USING (
    EXISTS (SELECT 1 FROM stores WHERE user_id = auth.uid())
  );

-- RLS Policies for ERP tables
CREATE POLICY "Store owners can access ERP sync logs" ON erp_sync_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM stores WHERE user_id = auth.uid())
  );

CREATE POLICY "Store owners can access ERP activity logs" ON erp_activity_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM stores WHERE user_id = auth.uid())
  );

CREATE POLICY "Store owners can access ERP endpoints" ON erp_endpoints
  FOR ALL USING (
    EXISTS (SELECT 1 FROM stores WHERE user_id = auth.uid())
  );

CREATE POLICY "Store owners can access ERP schedules" ON erp_sync_schedules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM stores WHERE user_id = auth.uid())
  );

-- Insert sample data for testing
INSERT INTO payment_logs (gateway_id, payment_id, amount, currency, status, success, transaction_id, metadata, gateway_response) VALUES
('stripe', 'pay_test_001', 150.00, 'SAR', 'completed', true, 'pi_test_001', '{"test": true}', '{"gateway": "stripe", "amount": 150}'),
('paypal', 'pay_test_002', 200.00, 'SAR', 'completed', true, 'PAY-TEST-002', '{"test": true}', '{"gateway": "paypal", "amount": 200}'),
('mada', 'pay_test_003', 75.00, 'SAR', 'failed', false, null, '{"test": true}', '{"gateway": "mada", "error": "declined"}'),
('tamara', 'pay_test_004', 300.00, 'SAR', 'completed', true, 'TAMARA-TEST-004', '{"test": true, "installments": 3}', '{"gateway": "tamara", "amount": 300}');

INSERT INTO shipping_logs (activity, data) VALUES
('label_created', '{"provider": "dhl", "tracking": "DHL123456", "cost": 25.00}'),
('tracking_requested', '{"provider": "aramex", "tracking": "ARA789012", "status": "delivered"}'),
('label_created', '{"provider": "smsa", "tracking": "SMS345678", "cost": 15.00}');

INSERT INTO erp_sync_logs (sync_id, erp_system_id, status, records_processed, records_failed, data_summary) VALUES
('sync_001', 'sap', 'completed', 1500, 5, '{"customers": 500, "products": 800, "orders": 200}'),
('sync_002', 'oracle', 'completed', 2000, 10, '{"customers": 600, "products": 1200, "invoices": 200}'),
('sync_003', 'quickbooks', 'running', 750, 2, '{"customers": 300, "products": 450}');

-- Create functions for automated tasks
CREATE OR REPLACE FUNCTION update_payment_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_shipping_labels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_erp_sync_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER payment_logs_updated_at_trigger
  BEFORE UPDATE ON payment_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_logs_updated_at();

CREATE TRIGGER shipping_labels_updated_at_trigger
  BEFORE UPDATE ON shipping_labels
  FOR EACH ROW
  EXECUTE FUNCTION update_shipping_labels_updated_at();

CREATE TRIGGER erp_sync_logs_updated_at_trigger
  BEFORE UPDATE ON erp_sync_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_erp_sync_logs_updated_at();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON payment_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON shipping_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON shipping_labels TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON erp_sync_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON erp_activity_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON erp_endpoints TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON erp_sync_schedules TO authenticated;
