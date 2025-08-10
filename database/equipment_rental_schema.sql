-- Equipment Rental System Database Schema

-- Equipment Providers Table
CREATE TABLE IF NOT EXISTS equipment_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  coordinates JSONB,
  service_areas TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  operating_hours JSONB,
  certifications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment Inventory Table
CREATE TABLE IF NOT EXISTS equipment_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES equipment_providers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('crane', 'truck', 'excavator', 'mixer', 'generator', 'forklift', 'pump', 'compactor')),
  specifications JSONB NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  weekly_rate DECIMAL(10,2) NOT NULL,
  monthly_rate DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'SAR',
  images TEXT[],
  features TEXT[],
  requirements TEXT[],
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment Bookings Table
CREATE TABLE IF NOT EXISTS equipment_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment_inventory(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES equipment_providers(id) ON DELETE CASCADE,
  project_id VARCHAR(255),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  delivery_address TEXT NOT NULL,
  coordinates JSONB,
  total_cost DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in-transit', 'delivered', 'in-use', 'returned', 'completed', 'cancelled')),
  booking_details JSONB,
  delivery_info JSONB,
  tracking_info JSONB,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment Tracking Table (for real-time location updates)
CREATE TABLE IF NOT EXISTS equipment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES equipment_bookings(id) ON DELETE CASCADE,
  current_location JSONB NOT NULL,
  estimated_arrival TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE equipment_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_tracking ENABLE ROW LEVEL SECURITY;

-- Allow providers to manage their own data
CREATE POLICY "Providers can manage their own data" ON equipment_providers
  FOR ALL USING (auth.uid()::text = user_id OR auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Public can view active providers" ON equipment_providers
  FOR SELECT USING (is_active = true);

-- Allow providers to manage their equipment
CREATE POLICY "Providers can manage their equipment" ON equipment_inventory
  FOR ALL USING (
    provider_id IN (SELECT id FROM equipment_providers WHERE user_id = auth.uid()::text)
    OR auth.jwt() ->> 'role' = 'service_role'
  );

CREATE POLICY "Public can view available equipment" ON equipment_inventory
  FOR SELECT USING (is_available = true);

-- Users can view and create their own bookings
CREATE POLICY "Users can manage their own bookings" ON equipment_bookings
  FOR ALL USING (user_id = auth.uid());

-- Providers can view and update bookings for their equipment
CREATE POLICY "Providers can manage bookings for their equipment" ON equipment_bookings
  FOR ALL USING (
    provider_id IN (SELECT id FROM equipment_providers WHERE user_id = auth.uid()::text)
    OR auth.jwt() ->> 'role' = 'service_role'
  );

-- Tracking policies
CREATE POLICY "Users and providers can view tracking" ON equipment_tracking
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM equipment_bookings 
      WHERE user_id = auth.uid() 
      OR provider_id IN (SELECT id FROM equipment_providers WHERE user_id = auth.uid()::text)
    )
    OR auth.jwt() ->> 'role' = 'service_role'
  );

CREATE POLICY "Providers can create tracking updates" ON equipment_tracking
  FOR INSERT WITH CHECK (
    booking_id IN (
      SELECT id FROM equipment_bookings 
      WHERE provider_id IN (SELECT id FROM equipment_providers WHERE user_id = auth.uid()::text)
    )
    OR auth.jwt() ->> 'role' = 'service_role'
  );

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_equipment_providers_city ON equipment_providers(city);
CREATE INDEX IF NOT EXISTS idx_equipment_providers_rating ON equipment_providers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_equipment_inventory_provider ON equipment_inventory(provider_id);
CREATE INDEX IF NOT EXISTS idx_equipment_inventory_category ON equipment_inventory(category);
CREATE INDEX IF NOT EXISTS idx_equipment_inventory_available ON equipment_inventory(is_available);
CREATE INDEX IF NOT EXISTS idx_equipment_bookings_user ON equipment_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_bookings_provider ON equipment_bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_equipment_bookings_dates ON equipment_bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_equipment_bookings_status ON equipment_bookings(status);
CREATE INDEX IF NOT EXISTS idx_equipment_tracking_booking ON equipment_tracking(booking_id);

-- Insert sample data
INSERT INTO equipment_providers (name, name_ar, contact_phone, contact_email, city, coordinates, service_areas, rating, is_verified, is_active, operating_hours) VALUES
('Riyadh Heavy Equipment Rental', 'تأجير المعدات الثقيلة الرياض', '+966501234567', 'info@riyadhequipment.com', 'الرياض', '{"lat": 24.7136, "lng": 46.6753}', '{"الرياض", "الخرج", "الدرعية"}', 4.8, true, true, '{"weekdays": {"open": "07:00", "close": "18:00"}, "weekends": {"open": "08:00", "close": "16:00"}}'),
('Jeddah Construction Equipment', 'معدات البناء جدة', '+966502345678', 'contact@jeddahequip.com', 'جدة', '{"lat": 21.4858, "lng": 39.1925}', '{"جدة", "مكة المكرمة", "رابغ"}', 4.6, true, true, '{"weekdays": {"open": "06:30", "close": "17:30"}, "weekends": {"open": "08:00", "close": "15:00"}}'),
('Eastern Province Equipment', 'معدات المنطقة الشرقية', '+966503456789', 'sales@easternequip.com', 'الدمام', '{"lat": 26.4207, "lng": 50.0888}', '{"الدمام", "الخبر", "الظهران", "الأحساء"}', 4.7, true, true, '{"weekdays": {"open": "07:00", "close": "18:00"}, "weekends": {"open": "08:00", "close": "16:00"}}')
ON CONFLICT DO NOTHING;

-- Get provider IDs for sample equipment
DO $$
DECLARE
  riyadh_provider_id UUID;
  jeddah_provider_id UUID;
  eastern_provider_id UUID;
BEGIN
  SELECT id INTO riyadh_provider_id FROM equipment_providers WHERE name = 'Riyadh Heavy Equipment Rental';
  SELECT id INTO jeddah_provider_id FROM equipment_providers WHERE name = 'Jeddah Construction Equipment';
  SELECT id INTO eastern_provider_id FROM equipment_providers WHERE name = 'Eastern Province Equipment';

  -- Insert sample equipment
  INSERT INTO equipment_inventory (provider_id, name, name_ar, category, specifications, hourly_rate, daily_rate, weekly_rate, monthly_rate, delivery_fee, images, features, requirements) VALUES
  (riyadh_provider_id, 'Liebherr Mobile Crane 50T', 'رافعة ليبهير متحركة 50 طن', 'crane', '{"capacity": "50 طن", "maxLoad": 50, "fuelType": "diesel", "dimensions": {"length": 12, "width": 2.5, "height": 3.8}}', 150, 1200, 7200, 25000, 500, '{"https://example.com/crane1.jpg"}', '{"رافعة هيدروليكية", "نظام أمان متقدم", "مشغل مدرب"}', '{"رخصة تشغيل رافعات", "موقع مناسب للرافعة"}'),
  (riyadh_provider_id, 'CAT Excavator 320D', 'حفار كاتربلر 320D', 'excavator', '{"capacity": "متوسط", "maxLoad": 20, "fuelType": "diesel", "dimensions": {"length": 10, "width": 3.2, "height": 3.1}}', 100, 800, 4800, 18000, 300, '{"https://example.com/excavator1.jpg"}', '{"محرك قوي", "نظام هيدروليكي متقدم", "مقصورة مكيفة"}', '{"مشغل معتمد", "موقع آمن للعمل"}'),
  (jeddah_provider_id, 'Mercedes Concrete Mixer 8m³', 'خلاطة خرسانة مرسيدس 8 متر مكعب', 'mixer', '{"capacity": "8 متر مكعب", "maxLoad": 8, "fuelType": "diesel", "dimensions": {"length": 9, "width": 2.5, "height": 3.5}}', 80, 650, 3900, 14000, 250, '{"https://example.com/mixer1.jpg"}', '{"خلط عالي الجودة", "تفريغ سريع", "نظام تنظيف ذاتي"}', '{"طريق مناسب للشاحنة", "موقع تفريغ محدد"}'),
  (eastern_provider_id, 'Generator Caterpillar 100KVA', 'مولد كاتربلر 100 كيلو فولت أمبير', 'generator', '{"capacity": "100 KVA", "maxLoad": 100, "fuelType": "diesel", "dimensions": {"length": 3, "width": 1.2, "height": 1.8}}', 60, 500, 3000, 10000, 200, '{"https://example.com/generator1.jpg"}', '{"صوت منخفض", "توفير في الوقود", "تشغيل آلي"}', '{"مساحة مناسبة", "تهوية جيدة"}')
  ON CONFLICT DO NOTHING;
END $$;
