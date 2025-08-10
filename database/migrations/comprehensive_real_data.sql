-- Additional Real Data for Binna Platform
-- Run this script in Supabase SQL Editor to add more realistic data

-- Insert more customers (construction companies and individuals)
INSERT INTO erp_customers (name, email, phone, company, address, city, country, vat_number, total_orders, total_spent, status) VALUES
('خالد بن أحمد المطيري', 'khalid.almutairi@constructco.sa', '+966501112233', 'شركة المطيري للمقاولات', 'طريق الملك عبدالعزيز، حي السليمانية', 'الرياض', 'السعودية', '300234567800001', 22, 127500.00, 'active'),
('نورا بنت سالم العتيبي', 'nora.alotaibi@buildplus.sa', '+966502334455', 'مؤسسة البناء المتقدم', 'شارع التحلية، حي الروضة', 'جدة', 'السعودية', '300234567800002', 18, 89750.00, 'active'),
('عبدالرحمن القحطاني', 'abdulrahman@homeconstruct.sa', '+966503445566', 'شركة إنشاءات المنازل الحديثة', 'طريق الدمام السريع، حي الفيصلية', 'الدمام', 'السعودية', '300234567800003', 31, 185000.00, 'active'),
('سارة الدوسري', 'sara.aldosari@gmail.com', '+966504556677', NULL, 'حي الملقا، شارع الأمير سلطان', 'الرياض', 'السعودية', NULL, 5, 12500.00, 'active'),
('محمد الشهري', 'mohammed.alshahri@contractorpro.sa', '+966505667788', 'مقاولات الشهري المحدودة', 'طريق الملك فهد، حي العزيزية', 'مكة المكرمة', 'السعودية', '300234567800004', 14, 67800.00, 'active'),
('فهد الغامدي', 'fahad.alghamdi@buildsmart.sa', '+966506778899', 'شركة البناء الذكي', 'شارع الأمير نايف، حي الشفا', 'الطائف', 'السعودية', '300234567800005', 26, 156300.00, 'active'),
('عائشة الجهني', 'aisha.aljuhani@interiordesign.sa', '+966507889900', 'استوديو التصميم الداخلي', 'كورنيش جدة، برج التجارة', 'جدة', 'السعودية', '300234567800006', 9, 43200.00, 'active'),
('علي الزهراني', 'ali.alzahrani@maintenance.sa', '+966508990011', 'شركة الصيانة الشاملة', 'طريق المدينة، حي الخالدية', 'المدينة المنورة', 'السعودية', '300234567800007', 11, 28900.00, 'active'),
('ليلى النجار', 'layla.alnajjar@renovations.sa', '+966509001122', 'مؤسسة التجديد والترميم', 'شارع الملك سعود، حي النزهة', 'الدمام', 'السعودية', '300234567800008', 7, 34600.00, 'active'),
('يوسف الحربي', 'youssef.alharbi@greenbuild.sa', '+966500112233', 'شركة البناء الأخضر', 'طريق الأمير محمد بن فهد، حي الشاطئ', 'الخبر', 'السعودية', '300234567800009', 19, 98750.00, 'active');

-- Insert more construction products with realistic pricing
INSERT INTO erp_products (name, name_ar, sku, price, cost, category, stock, min_stock, unit, description, description_ar, status, specifications, barcode) VALUES
-- Cement and concrete products
('White Portland Cement', 'أسمنت أبيض بورتلاندي', 'CEM-002', 35.00, 27.00, 'مواد البناء', 300, 50, 'كيس 50 كغ', 'High-quality white cement for decorative works', 'أسمنت أبيض عالي الجودة للأعمال الديكورية', 'active', '{"grade": "52.5N", "color": "white", "setting_time": "fast", "compressive_strength": "52.5 MPa"}', '6281234567001'),
('Ready Mix Concrete', 'خرسانة جاهزة', 'RMC-001', 180.00, 145.00, 'مواد البناء', 0, 0, 'متر مكعب', 'Ready-mixed concrete grade 30', 'خرسانة جاهزة درجة 30', 'active', '{"grade": "C30", "slump": "100mm", "aggregate_size": "20mm", "delivery": "truck_mixer"}', '6281234567002'),
('Concrete Blocks', 'بلوك خرساني', 'BLK-001', 4.50, 3.20, 'مواد البناء', 2000, 500, 'قطعة', 'Hollow concrete blocks 20x20x40cm', 'بلوك خرساني مفرغ 20×20×40 سم', 'active', '{"dimensions": "20x20x40cm", "weight": "18kg", "compressive_strength": "7 MPa", "thermal_conductivity": "0.9 W/mK"}', '6281234567003'),

-- Steel and metal products
('Steel Rebar 8mm', 'حديد تسليح 8 مم', 'REB-008', 2500.00, 2200.00, 'الحديد والمعادن', 30, 10, 'طن', 'High tensile steel reinforcement bars', 'حديد تسليح عالي المقاومة', 'active', '{"diameter": "8mm", "length": "12m", "grade": "B500B", "yield_strength": "500 MPa"}', '6281234567004'),
('Steel Rebar 16mm', 'حديد تسليح 16 مم', 'REB-016', 2850.00, 2550.00, 'الحديد والمعادن', 25, 8, 'طن', 'Heavy duty steel reinforcement bars', 'حديد تسليح للأعمال الثقيلة', 'active', '{"diameter": "16mm", "length": "12m", "grade": "B500B", "yield_strength": "500 MPa"}', '6281234567005'),
('Steel Mesh', 'شبك حديد', 'MSH-001', 85.00, 68.00, 'الحديد والمعادن', 150, 30, 'لوح', 'Welded steel mesh 6mm 15x15cm', 'شبك حديد ملحوم 6 مم 15×15 سم', 'active', '{"wire_diameter": "6mm", "mesh_size": "150x150mm", "sheet_size": "2x3m", "weight": "25kg"}', '6281234567006'),

-- Tiles and flooring
('Porcelain Floor Tiles', 'بلاط بورسلان أرضي', 'POR-001', 65.00, 48.00, 'السيراميك والبلاط', 500, 100, 'متر مربع', 'High-quality porcelain floor tiles 60x60cm', 'بلاط بورسلان أرضي عالي الجودة 60×60 سم', 'active', '{"size": "60x60cm", "thickness": "10mm", "finish": "polished", "slip_resistance": "R10", "water_absorption": "<0.5%"}', '6281234567007'),
('Marble Tiles', 'بلاط رخام', 'MAR-001', 120.00, 95.00, 'السيراميك والبلاط', 200, 50, 'متر مربع', 'Natural marble tiles from Carrara', 'بلاط رخام طبيعي من كرارا', 'active', '{"origin": "Carrara", "size": "30x30cm", "thickness": "20mm", "finish": "polished", "veining": "natural"}', '6281234567008'),
('Outdoor Pavers', 'أحجار رصف خارجية', 'PAV-001', 45.00, 35.00, 'السيراميك والبلاط', 800, 150, 'متر مربع', 'Interlocking concrete pavers', 'أحجار رصف خرسانية متشابكة', 'active', '{"thickness": "60mm", "shape": "rectangular", "color": "grey", "load_bearing": "heavy_duty"}', '6281234567009'),

-- Paints and coatings
('Exterior Wall Paint', 'دهان خارجي للجدران', 'PNT-002', 85.00, 65.00, 'الدهانات', 120, 30, 'جالون', 'Weather-resistant exterior paint', 'دهان خارجي مقاوم للعوامل الجوية', 'active', '{"coverage": "12-14 sqm/liter", "drying_time": "4 hours", "colors_available": 50, "uv_protection": "high"}', '6281234567010'),
('Primer Sealer', 'دهان تأسيس', 'PNT-003', 55.00, 42.00, 'الدهانات', 80, 20, 'جالون', 'Universal primer and sealer', 'دهان تأسيس عام للجدران', 'active', '{"coverage": "10-12 sqm/liter", "base": "water", "application": "brush_roller", "opacity": "high"}', '6281234567011'),
('Wood Stain', 'صبغة خشب', 'PNT-004', 95.00, 75.00, 'الدهانات', 60, 15, 'جالون', 'Premium wood stain and protector', 'صبغة خشب فاخرة وحماية', 'active', '{"protection": "UV_water", "penetration": "deep", "colors": 12, "durability": "5_years"}', '6281234567012'),

-- Electrical supplies
('Electrical Cable 2.5mm', 'كابل كهرباء 2.5 مم', 'ELE-001', 12.50, 9.80, 'المواد الكهربائية', 500, 100, 'متر', 'Copper electrical cable 2.5mm²', 'كابل كهرباء نحاس 2.5 مم²', 'active', '{"conductor": "copper", "insulation": "PVC", "voltage_rating": "450/750V", "current_capacity": "27A"}', '6281234567013'),
('LED Light Bulbs 9W', 'مصابيح ليد 9 واط', 'LED-001', 25.00, 18.00, 'المواد الكهربائية', 800, 200, 'قطعة', 'Energy efficient LED bulbs', 'مصابيح ليد موفرة للطاقة', 'active', '{"power": "9W", "lumens": "806", "color_temp": "3000K", "lifespan": "25000_hours", "base": "E27"}', '6281234567014'),
('Circuit Breaker 20A', 'قاطع كهرباء 20 أمبير', 'CBR-001', 45.00, 32.00, 'المواد الكهربائية', 200, 50, 'قطعة', 'Single pole circuit breaker 20A', 'قاطع كهرباء أحادي القطب 20 أمبير', 'active', '{"current_rating": "20A", "voltage": "230V", "poles": "1", "breaking_capacity": "6kA"}', '6281234567015'),

-- Plumbing supplies
('PVC Pipe 4 inch', 'أنبوب بي في سي 4 بوصة', 'PVC-001', 35.00, 28.00, 'السباكة', 300, 50, 'متر', 'PVC drainage pipe 110mm', 'أنبوب صرف بي في سي 110 مم', 'active', '{"diameter": "110mm", "wall_thickness": "3.2mm", "length": "6m", "pressure_rating": "SN4"}', '6281234567016'),
('Water Faucet', 'صنبور مياه', 'FAU-001', 85.00, 65.00, 'السباكة', 150, 30, 'قطعة', 'Single handle kitchen faucet', 'صنبور مطبخ بمقبض واحد', 'active', '{"material": "brass", "finish": "chrome", "type": "single_handle", "mounting": "deck_mount"}', '6281234567017'),
('Toilet Bowl', 'كرسي حمام', 'TOI-001', 320.00, 245.00, 'السباكة', 50, 10, 'قطعة', 'Two-piece toilet with dual flush', 'كرسي حمام قطعتين مع دفق مزدوج', 'active', '{"type": "two_piece", "flush_type": "dual", "water_consumption": "4.5/3L", "height": "standard"}', '6281234567018'),

-- Tools and equipment
('Power Drill', 'مثقاب كهربائي', 'DRL-001', 180.00, 135.00, 'الأدوات والمعدات', 80, 20, 'قطعة', 'Cordless power drill 18V', 'مثقاب كهربائي لاسلكي 18 فولت', 'active', '{"voltage": "18V", "battery": "lithium_ion", "chuck_size": "13mm", "torque": "50Nm", "warranty": "2_years"}', '6281234567019'),
('Angle Grinder', 'مطحنة زاوية', 'GRN-001', 95.00, 72.00, 'الأدوات والمعدات', 60, 15, 'قطعة', 'Electric angle grinder 115mm', 'مطحنة زاوية كهربائية 115 مم', 'active', '{"disc_size": "115mm", "power": "900W", "no_load_speed": "11000 rpm", "safety": "guard_included"}', '6281234567020'),
('Tool Box', 'صندوق عدة', 'TBX-001', 125.00, 95.00, 'الأدوات والمعدات', 100, 25, 'قطعة', 'Professional tool box with wheels', 'صندوق عدة احترافي بعجلات', 'active', '{"material": "steel", "drawers": "5", "wheels": "yes", "lock": "keyed", "dimensions": "70x40x80cm"}', '6281234567021'),

-- Insulation materials
('Glass Wool Insulation', 'عزل صوف زجاجي', 'INS-001', 45.00, 35.00, 'مواد العزل', 200, 50, 'لفة', 'Thermal insulation glass wool 10cm', 'عزل حراري صوف زجاجي 10 سم', 'active', '{"thickness": "100mm", "thermal_conductivity": "0.035 W/mK", "density": "16 kg/m³", "fire_rating": "A1"}', '6281234567022'),
('Foam Board Insulation', 'لوح عزل فوم', 'INS-002', 65.00, 48.00, 'مواد العزل', 150, 30, 'لوح', 'Extruded polystyrene foam board', 'لوح فوم بوليسترين مبثوق', 'active', '{"thickness": "50mm", "thermal_conductivity": "0.029 W/mK", "compressive_strength": "300 kPa", "size": "120x60cm"}', '6281234567023'),

-- Waterproofing materials
('Bitumen Membrane', 'غشاء بيتوميني', 'WPF-001', 55.00, 42.00, 'مواد العزل المائي', 180, 40, 'لفة', 'Self-adhesive bitumen membrane', 'غشاء بيتوميني ذاتي اللصق', 'active', '{"thickness": "4mm", "width": "1m", "length": "10m", "adhesive": "self_adhesive", "temperature_resistance": "-20 to 80°C"}', '6281234567024'),
('Liquid Waterproofing', 'عازل مائي سائل', 'WPF-002', 85.00, 65.00, 'مواد العزل المائي', 120, 25, 'جالون', 'Polyurethane liquid waterproofing', 'عازل مائي سائل بولي يوريثان', 'active', '{"coverage": "2-3 sqm/liter", "curing_time": "24 hours", "flexibility": "high", "color": "grey"}', '6281234567025');

-- Insert more realistic orders with various products
INSERT INTO erp_orders (order_number, customer_id, customer_name, total, subtotal, vat_amount, status, payment_status, order_date, items, shipping_cost, delivery_address) VALUES
('ORD-20240701-001', (SELECT id FROM erp_customers WHERE email = 'khalid.almutairi@constructco.sa'), 'خالد بن أحمد المطيري', 14950.00, 13000.00, 1950.00, 'delivered', 'paid', '2024-07-01', '[{"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'CEM-001') || '", "product_name": "أسمنت بورتلاندي", "sku": "CEM-001", "quantity": 200, "price": 25.00, "total": 5000.00}, {"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'REB-008') || '", "product_name": "حديد تسليح 8 مم", "sku": "REB-008", "quantity": 3, "price": 2500.00, "total": 7500.00}, {"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'BLK-001') || '", "product_name": "بلوك خرساني", "sku": "BLK-001", "quantity": 100, "price": 4.50, "total": 450.00}, {"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'PNT-001') || '", "product_name": "دهان داخلي", "sku": "PNT-001", "quantity": 4, "price": 120.00, "total": 480.00}]', 50.00, 'طريق الملك عبدالعزيز، حي السليمانية، الرياض'),

('ORD-20240702-002', (SELECT id FROM erp_customers WHERE email = 'nora.alotaibi@buildplus.sa'), 'نورا بنت سالم العتيبي', 8625.00, 7500.00, 1125.00, 'shipped', 'paid', '2024-07-02', '[{"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'POR-001') || '", "product_name": "بلاط بورسلان أرضي", "sku": "POR-001", "quantity": 80, "price": 65.00, "total": 5200.00}, {"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'MAR-001') || '", "product_name": "بلاط رخام", "sku": "MAR-001", "quantity": 15, "price": 120.00, "total": 1800.00}, {"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'PNT-002') || '", "product_name": "دهان خارجي للجدران", "sku": "PNT-002", "quantity": 6, "price": 85.00, "total": 510.00}]', 75.00, 'شارع التحلية، حي الروضة، جدة'),

('ORD-20240703-003', (SELECT id FROM erp_customers WHERE email = 'abdulrahman@homeconstruct.sa'), 'عبدالرحمن القحطاني', 12650.00, 11000.00, 1650.00, 'confirmed', 'paid', '2024-07-03', '[{"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'REB-016') || '", "product_name": "حديد تسليح 16 مم", "sku": "REB-016", "quantity": 3, "price": 2850.00, "total": 8550.00}, {"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'MSH-001') || '", "product_name": "شبك حديد", "sku": "MSH-001", "quantity": 20, "price": 85.00, "total": 1700.00}, {"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'ELE-001') || '", "product_name": "كابل كهرباء 2.5 مم", "sku": "ELE-001", "quantity": 60, "price": 12.50, "total": 750.00}]', 100.00, 'طريق الدمام السريع، حي الفيصلية، الدمام'),

('ORD-20240704-004', (SELECT id FROM erp_customers WHERE email = 'sara.aldosari@gmail.com'), 'سارة الدوسري', 1725.00, 1500.00, 225.00, 'delivered', 'paid', '2024-07-04', '[{"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'LED-001') || '", "product_name": "مصابيح ليد 9 واط", "sku": "LED-001", "quantity": 20, "price": 25.00, "total": 500.00}, {"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'FAU-001') || '", "product_name": "صنبور مياه", "sku": "FAU-001", "quantity": 4, "price": 85.00, "total": 340.00}, {"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'CBR-001') || '", "product_name": "قاطع كهرباء 20 أمبير", "sku": "CBR-001", "quantity": 8, "price": 45.00, "total": 360.00}, {"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'PNT-003') || '", "product_name": "دهان تأسيس", "sku": "PNT-003", "quantity": 5, "price": 55.00, "total": 275.00}]', 25.00, 'حي الملقا، شارع الأمير سلطان، الرياض');

-- Insert corresponding invoices for the new orders
INSERT INTO erp_invoices (invoice_number, customer_id, customer_name, order_id, total, subtotal, vat_amount, status, issue_date, due_date, items, payment_date) VALUES
('INV-20240701-001', (SELECT id FROM erp_customers WHERE email = 'khalid.almutairi@constructco.sa'), 'خالد بن أحمد المطيري', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240701-001'), 14950.00, 13000.00, 1950.00, 'paid', '2024-07-01', '2024-07-31', '[{"description": "أسمنت بورتلاندي", "quantity": 200, "price": 25.00, "total": 5000.00}, {"description": "حديد تسليح 8 مم", "quantity": 3, "price": 2500.00, "total": 7500.00}, {"description": "بلوك خرساني", "quantity": 100, "price": 4.50, "total": 450.00}, {"description": "دهان داخلي", "quantity": 4, "price": 120.00, "total": 480.00}, {"description": "رسوم شحن", "quantity": 1, "price": 50.00, "total": 50.00}]', '2024-07-05'),

('INV-20240702-002', (SELECT id FROM erp_customers WHERE email = 'nora.alotaibi@buildplus.sa'), 'نورا بنت سالم العتيبي', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240702-002'), 8625.00, 7500.00, 1125.00, 'paid', '2024-07-02', '2024-08-01', '[{"description": "بلاط بورسلان أرضي", "quantity": 80, "price": 65.00, "total": 5200.00}, {"description": "بلاط رخام", "quantity": 15, "price": 120.00, "total": 1800.00}, {"description": "دهان خارجي للجدران", "quantity": 6, "price": 85.00, "total": 510.00}, {"description": "رسوم شحن", "quantity": 1, "price": 75.00, "total": 75.00}]', '2024-07-08'),

('INV-20240703-003', (SELECT id FROM erp_customers WHERE email = 'abdulrahman@homeconstruct.sa'), 'عبدالرحمن القحطاني', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240703-003'), 12650.00, 11000.00, 1650.00, 'paid', '2024-07-03', '2024-08-02', '[{"description": "حديد تسليح 16 مم", "quantity": 3, "price": 2850.00, "total": 8550.00}, {"description": "شبك حديد", "quantity": 20, "price": 85.00, "total": 1700.00}, {"description": "كابل كهرباء 2.5 مم", "quantity": 60, "price": 12.50, "total": 750.00}, {"description": "رسوم شحن", "quantity": 1, "price": 100.00, "total": 100.00}]', '2024-07-10'),

('INV-20240704-004', (SELECT id FROM erp_customers WHERE email = 'sara.aldosari@gmail.com'), 'سارة الدوسري', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240704-004'), 1725.00, 1500.00, 225.00, 'paid', '2024-07-04', '2024-08-03', '[{"description": "مصابيح ليد 9 واط", "quantity": 20, "price": 25.00, "total": 500.00}, {"description": "صنبور مياه", "quantity": 4, "price": 85.00, "total": 340.00}, {"description": "قاطع كهرباء 20 أمبير", "quantity": 8, "price": 45.00, "total": 360.00}, {"description": "دهان تأسيس", "quantity": 5, "price": 55.00, "total": 275.00}, {"description": "رسوم شحن", "quantity": 1, "price": 25.00, "total": 25.00}]', '2024-07-06');

-- Insert more stock movements
INSERT INTO erp_stock_movements (product_id, product_name, type, quantity, reference_type, reference_id, created_by, notes) VALUES
-- Stock movements for the new orders
((SELECT id FROM erp_products WHERE sku = 'CEM-001'), 'أسمنت بورتلاندي', 'out', 200, 'sale', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240701-001'), 'system', 'بيع لشركة المطيري للمقاولات'),
((SELECT id FROM erp_products WHERE sku = 'REB-008'), 'حديد تسليح 8 مم', 'out', 3, 'sale', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240701-001'), 'system', 'بيع لشركة المطيري للمقاولات'),
((SELECT id FROM erp_products WHERE sku = 'BLK-001'), 'بلوك خرساني', 'out', 100, 'sale', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240701-001'), 'system', 'بيع لشركة المطيري للمقاولات'),
((SELECT id FROM erp_products WHERE sku = 'POR-001'), 'بلاط بورسلان أرضي', 'out', 80, 'sale', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240702-002'), 'system', 'بيع لمؤسسة البناء المتقدم'),
((SELECT id FROM erp_products WHERE sku = 'MAR-001'), 'بلاط رخام', 'out', 15, 'sale', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240702-002'), 'system', 'بيع لمؤسسة البناء المتقدم'),
((SELECT id FROM erp_products WHERE sku = 'REB-016'), 'حديد تسليح 16 مم', 'out', 3, 'sale', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240703-003'), 'system', 'بيع لشركة إنشاءات المنازل الحديثة'),
((SELECT id FROM erp_products WHERE sku = 'LED-001'), 'مصابيح ليد 9 واط', 'out', 20, 'sale', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240704-004'), 'system', 'بيع للعميلة سارة الدوسري'),

-- Stock receipts (incoming inventory)
((SELECT id FROM erp_products WHERE sku = 'CEM-001'), 'أسمنت بورتلاندي', 'in', 1000, 'purchase', NULL, 'admin@binna.com', 'شحنة جديدة من المورد الرئيسي'),
((SELECT id FROM erp_products WHERE sku = 'CEM-002'), 'أسمنت أبيض بورتلاندي', 'in', 300, 'purchase', NULL, 'admin@binna.com', 'شحنة أسمنت أبيض للمشاريع الخاصة'),
((SELECT id FROM erp_products WHERE sku = 'REB-008'), 'حديد تسليح 8 مم', 'in', 50, 'purchase', NULL, 'admin@binna.com', 'تجديد مخزون الحديد'),
((SELECT id FROM erp_products WHERE sku = 'REB-016'), 'حديد تسليح 16 مم', 'in', 35, 'purchase', NULL, 'admin@binna.com', 'تجديد مخزون الحديد الثقيل'),
((SELECT id FROM erp_products WHERE sku = 'POR-001'), 'بلاط بورسلان أرضي', 'in', 800, 'purchase', NULL, 'admin@binna.com', 'شحنة بلاط جديدة من إيطاليا'),
((SELECT id FROM erp_products WHERE sku = 'LED-001'), 'مصابيح ليد 9 واط', 'in', 1000, 'purchase', NULL, 'admin@binna.com', 'مصابيح ليد موفرة للطاقة'),

-- Stock adjustments
((SELECT id FROM erp_products WHERE sku = 'BLK-001'), 'بلوك خرساني', 'adjustment', -50, 'adjustment', NULL, 'admin@binna.com', 'تسوية مخزون - تلف في النقل'),
((SELECT id FROM erp_products WHERE sku = 'PNT-001'), 'دهان داخلي', 'adjustment', 10, 'adjustment', NULL, 'admin@binna.com', 'تسوية مخزون - عد فعلي'),
((SELECT id FROM erp_products WHERE sku = 'ELE-001'), 'كابل كهرباء 2.5 مم', 'adjustment', 25, 'adjustment', NULL, 'admin@binna.com', 'تسوية مخزون - إرجاع من مشروع ملغي');

-- Insert more warranties
INSERT INTO warranties (warranty_number, product_id, product_name, customer_id, customer_name, order_id, purchase_date, warranty_start, warranty_end, warranty_period, coverage_details, quantity, unit_price, total_value) VALUES
('W003', (SELECT id FROM erp_products WHERE sku = 'DRL-001'), 'مثقاب كهربائي', (SELECT id FROM erp_customers WHERE email = 'khalid.almutairi@constructco.sa'), 'خالد بن أحمد المطيري', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240701-001'), '2024-07-01', '2024-07-01', '2026-07-01', 24, 'ضمان ضد عيوب التصنيع والأجزاء الداخلية', 2, 180.00, 360.00),
('W004', (SELECT id FROM erp_products WHERE sku = 'LED-001'), 'مصابيح ليد 9 واط', (SELECT id FROM erp_customers WHERE email = 'sara.aldosari@gmail.com'), 'سارة الدوسري', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240704-004'), '2024-07-04', '2024-07-04', '2027-07-04', 36, 'ضمان ضد انقطاع الإضاءة المبكر', 20, 25.00, 500.00),
('W005', (SELECT id FROM erp_products WHERE sku = 'FAU-001'), 'صنبور مياه', (SELECT id FROM erp_customers WHERE email = 'sara.aldosari@gmail.com'), 'سارة الدوسري', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240704-004'), '2024-07-04', '2024-07-04', '2029-07-04', 60, 'ضمان ضد التسرب وعيوب الصناعة', 4, 85.00, 340.00);

-- Insert more warranty claims
INSERT INTO warranty_claims (claim_number, warranty_id, customer_id, customer_name, customer_email, customer_phone, issue_type, issue_description, quantity_affected, total_quantity, preferred_resolution, damage_photos, priority, value, status, store_response) VALUES
('CLAIM-003', (SELECT id FROM warranties WHERE warranty_number = 'W003'), (SELECT id FROM erp_customers WHERE email = 'khalid.almutairi@constructco.sa'), 'خالد بن أحمد المطيري', 'khalid.almutairi@constructco.sa', '+966501112233', 'performance_issue', 'المثقاب يتوقف عن العمل بعد استخدام لفترات قصيرة ويحتاج لفترة راحة طويلة قبل إعادة التشغيل', 1, 2, 'إصلاح أو استبدال المثقاب المعيب', '["drill-issue-1.jpg", "drill-issue-2.jpg"]', 'high', 180.00, 'approved', 'تم قبول المطالبة. سيتم استبدال المثقاب خلال 5 أيام عمل'),
('CLAIM-004', (SELECT id FROM warranties WHERE warranty_number = 'W004'), (SELECT id FROM erp_customers WHERE email = 'sara.aldosari@gmail.com'), 'سارة الدوسري', 'sara.aldosari@gmail.com', '+966504556677', 'manufacturing_defect', 'ثلاثة مصابيح من أصل 20 توقفت عن العمل خلال أسبوع من التركيب رغم الاستخدام العادي', 3, 20, 'استبدال المصابيح المعيبة', '["led-burnt-1.jpg"]', 'medium', 75.00, 'in_progress', 'جاري فحص المصابيح في المختبر. سيتم الرد خلال 48 ساعة');

-- Insert more store reviews with realistic Arabic content
INSERT INTO store_reviews (store_id, customer_id, rating, review_text, review_title, verified_purchase) VALUES
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'khalid.almutairi@constructco.sa'), 5, 'متجر ممتاز ومواد عالية الجودة. تعاملت معهم في عدة مشاريع وكانت التجربة دائماً إيجابية. الأسعار معقولة والتوصيل سريع.', 'تجربة ممتازة ومواد عالية الجودة', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'nora.alotaibi@buildplus.sa'), 4, 'اختيار جيد من المواد والبلاط. الخدمة جيدة لكن أحياناً التوصيل يتأخر قليلاً. بشكل عام راضية عن التعامل معهم.', 'اختيار جيد وخدمة مقبولة', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'abdulrahman@homeconstruct.sa'), 5, 'الحديد والمواد الخام ممتازة وتطابق المواصفات. فريق العمل متعاون ويساعد في اختيار المواد المناسبة للمشروع.', 'مواد خام ممتازة وفريق متعاون', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'sara.aldosari@gmail.com'), 4, 'تجربة جيدة لشراء مواد كهربائية للمنزل. الموظفون مفيدون في الشرح والمساعدة. سأتعامل معهم مرة أخرى.', 'تجربة جيدة للمواد الكهربائية', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'mohammed.alshahri@contractorpro.sa'), 5, 'أفضل متجر في المنطقة للمواد الإنشائية. السعر والجودة والخدمة كلها ممتازة. أنصح به للمقاولين والأفراد.', 'الأفضل في المنطقة', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'fahad.alghamdi@buildsmart.sa'), 4, 'تشكيلة واسعة من المنتجات وجودة عالية. أتمنى أن يكون هناك خصومات أكثر للكميات الكبيرة.', 'تشكيلة واسعة وجودة عالية', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'aisha.aljuhani@interiordesign.sa'), 5, 'مجموعة رائعة من البلاط والدهانات. ساعدوني في اختيار الألوان والتصاميم المناسبة لمشروعي.', 'مجموعة رائعة من التصاميم', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'ali.alzahrani@maintenance.sa'), 3, 'الخدمة عموماً جيدة لكن أحياناً بعض المواد غير متوفرة. أتمنى تحسين إدارة المخزون.', 'خدمة جيدة مع تحسينات مطلوبة', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'layla.alnajjar@renovations.sa'), 4, 'أسعار منافسة ومواد جيدة للترميم. فريق الدعم الفني مفيد جداً في تقديم النصائح.', 'أسعار منافسة ودعم فني ممتاز', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'youssef.alharbi@greenbuild.sa'), 5, 'يتميزون بتوفير مواد صديقة للبيئة وحلول بناء مستدامة. خدمة عملاء ممتازة ومعرفة تقنية عالية.', 'رواد في البناء المستدام', true);

-- Update store metrics with more recent data
INSERT INTO store_metrics (store_id, metric_type, metric_date, total_sales, total_orders, new_customers, average_order_value, customer_satisfaction, return_rate, response_time_hours)
SELECT 
    (SELECT id FROM stores WHERE email = 'store@binna.com'),
    'daily',
    CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 6),
    CASE 
        WHEN generate_series % 7 IN (0, 6) THEN 8500 + (RANDOM() * 3000) -- Weekend
        ELSE 12000 + (RANDOM() * 5000) -- Weekday
    END,
    CASE 
        WHEN generate_series % 7 IN (0, 6) THEN 12 + (RANDOM() * 6)::INTEGER -- Weekend
        ELSE 18 + (RANDOM() * 10)::INTEGER -- Weekday
    END,
    (RANDOM() * 4)::INTEGER + 1,
    600 + (RANDOM() * 300),
    4.5 + (RANDOM() * 0.5),
    0.8 + (RANDOM() * 1.2),
    1.5 + (RANDOM() * 2.5)
FROM generate_series(0, 6);

-- Update customer totals based on new orders
UPDATE erp_customers SET 
    total_orders = (SELECT COUNT(*) FROM erp_orders WHERE customer_id = erp_customers.id),
    total_spent = (SELECT COALESCE(SUM(total), 0) FROM erp_orders WHERE customer_id = erp_customers.id AND payment_status = 'paid');

-- Update store totals
UPDATE stores SET 
    total_orders = (SELECT COUNT(*) FROM erp_orders),
    total_sales = (SELECT COALESCE(SUM(total), 0) FROM erp_orders WHERE payment_status = 'paid'),
    total_reviews = (SELECT COUNT(*) FROM store_reviews WHERE store_id = stores.id);

-- Recalculate store rating
SELECT update_store_rating();

-- Create recent activity entries for dashboard
INSERT INTO erp_stock_movements (product_id, product_name, type, quantity, reference_type, created_by, notes) VALUES
((SELECT id FROM erp_products WHERE sku = 'TOI-001'), 'كرسي حمام', 'in', 20, 'purchase', 'admin@binna.com', 'شحنة جديدة من أدوات السباكة'),
((SELECT id FROM erp_products WHERE sku = 'TBX-001'), 'صندوق عدة', 'in', 15, 'purchase', 'admin@binna.com', 'تجديد مخزون الأدوات'),
((SELECT id FROM erp_products WHERE sku = 'INS-001'), 'عزل صوف زجاجي', 'in', 100, 'purchase', 'admin@binna.com', 'مواد عزل للمشاريع الشتوية'),
((SELECT id FROM erp_products WHERE sku = 'WPF-001'), 'غشاء بيتوميني', 'in', 50, 'purchase', 'admin@binna.com', 'مواد عزل مائي');

-- Insert suppliers data
INSERT INTO erp_suppliers (name, email, phone, address, city, country, vat_number, contact_person, payment_terms, status) VALUES
('شركة أسمنت المملكة', 'sales@saudicement.com.sa', '+966112000001', 'المنطقة الصناعية الثانية', 'الرياض', 'السعودية', '300987654300001', 'أحمد السالم', 'دفع خلال 30 يوم', 'active'),
('مصنع الحديد العربي', 'orders@arabsteel.sa', '+966133000002', 'منطقة الجبيل الصناعية', 'الجبيل', 'السعودية', '300987654300002', 'محمد القرني', 'دفع خلال 45 يوم', 'active'),
('شركة البلاط الإيطالي', 'export@italiantiles.com', '+390123456789', 'Via Roma 123', 'Milano', 'Italy', 'IT12345678901', 'Marco Rossi', 'Letter of Credit', 'active'),
('مؤسسة الدهانات الحديثة', 'sales@modernpaints.sa', '+966122000003', 'شارع الصناعات', 'جدة', 'السعودية', '300987654300003', 'سالم العمري', 'دفع خلال 30 يوم', 'active'),
('شركة الكهرباء التقنية', 'info@techelectrical.sa', '+966133000004', 'حي الفناتير', 'الجبيل', 'السعودية', '300987654300004', 'يوسف الشمري', 'دفع خلال 60 يوم', 'active');

COMMIT;
