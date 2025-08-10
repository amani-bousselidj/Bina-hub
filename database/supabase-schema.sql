-- Supabase Database Schema for Store Management
-- Generated on: 2025-07-26T02:18:04.500Z
-- 
-- This schema supports the complete store management system
-- including products, orders, customers, inventory, and more.

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS stores CASCADE;

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  rating decimal DEFAULT 0,
  location text,
  phone text,
  email text,
  is_active boolean DEFAULT true,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_stores_category ON stores(category);
CREATE INDEX idx_stores_user_id ON stores(user_id);
CREATE INDEX idx_stores_active ON stores(is_active);

-- Enable Row Level Security
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy (customize as needed)

CREATE POLICY "stores_policy" ON stores
  FOR ALL USING (true);


-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal NOT NULL,
  cost decimal,
  category text NOT NULL,
  stock_quantity integer DEFAULT 0,
  min_stock_level integer DEFAULT 0,
  max_stock_level integer,
  unit text DEFAULT piece,
  barcode text,
  image_url text,
  is_available boolean DEFAULT true,
  store_id uuid NOT NULL REFERENCES stores(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_products_barcode ON products(barcode);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy (customize as needed)

CREATE POLICY "products_policy" ON products
  FOR ALL USING (true);


-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  address text,
  city text,
  region text,
  postal_code text,
  type text DEFAULT individual,
  category text DEFAULT regular,
  credit_limit decimal DEFAULT 0,
  store_id uuid NOT NULL REFERENCES stores(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_customers_store_id ON customers(store_id);
CREATE INDEX idx_customers_type ON customers(type);
CREATE INDEX idx_customers_phone ON customers(phone);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy (customize as needed)

CREATE POLICY "customers_policy" ON customers
  FOR ALL USING (true);


-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_person text,
  phone text NOT NULL,
  email text,
  address text,
  category text,
  payment_terms integer DEFAULT 30,
  store_id uuid NOT NULL REFERENCES stores(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_suppliers_store_id ON suppliers(store_id);
CREATE INDEX idx_suppliers_category ON suppliers(category);

-- Enable Row Level Security
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy (customize as needed)

CREATE POLICY "suppliers_policy" ON suppliers
  FOR ALL USING (true);


-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  position text NOT NULL,
  department text,
  salary decimal,
  hire_date date NOT NULL,
  is_active boolean DEFAULT true,
  store_id uuid NOT NULL REFERENCES stores(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_employees_store_id ON employees(store_id);
CREATE INDEX idx_employees_position ON employees(position);
CREATE INDEX idx_employees_active ON employees(is_active);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy (customize as needed)

CREATE POLICY "employees_policy" ON employees
  FOR ALL USING (true);


-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL,
  customer_id uuid NOT NULL REFERENCES customers(id),
  store_id uuid NOT NULL REFERENCES stores(id),
  status text DEFAULT pending,
  payment_status text DEFAULT pending,
  payment_method text,
  subtotal decimal NOT NULL,
  tax_amount decimal DEFAULT 0,
  shipping_cost decimal DEFAULT 0,
  total_amount decimal NOT NULL,
  shipping_address text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy (customize as needed)

CREATE POLICY "orders_policy" ON orders
  FOR ALL USING (true);


-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price decimal NOT NULL,
  total_price decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Enable Row Level Security
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy (customize as needed)

CREATE POLICY "order_items_policy" ON order_items
  FOR ALL USING (true);


-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  reserved_quantity integer DEFAULT 0,
  warehouse_location text,
  last_counted timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_quantity ON inventory(quantity);

-- Enable Row Level Security
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy (customize as needed)

CREATE POLICY "inventory_policy" ON inventory
  FOR ALL USING (true);


-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount decimal NOT NULL,
  type text NOT NULL,
  category text,
  description text,
  reference_id uuid,
  reference_type text,
  store_id uuid NOT NULL REFERENCES stores(id),
  created_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_transactions_store_id ON transactions(store_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy (customize as needed)

CREATE POLICY "transactions_policy" ON transactions
  FOR ALL USING (true);


-- Useful Views

-- Product inventory view
CREATE OR REPLACE VIEW product_inventory AS
SELECT 
  p.*,
  i.quantity,
  i.reserved_quantity,
  (i.quantity - i.reserved_quantity) as available_quantity,
  s.name as store_name
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id
LEFT JOIN stores s ON p.store_id = s.id;

-- Order summary view
CREATE OR REPLACE VIEW order_summary AS
SELECT 
  o.*,
  c.name as customer_name,
  c.phone as customer_phone,
  s.name as store_name,
  COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN stores s ON o.store_id = s.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, c.name, c.phone, s.name;

-- Store analytics view
CREATE OR REPLACE VIEW store_analytics AS
SELECT 
  s.id,
  s.name,
  COUNT(DISTINCT p.id) as total_products,
  COUNT(DISTINCT c.id) as total_customers,
  COUNT(DISTINCT o.id) as total_orders,
  COALESCE(SUM(o.total_amount), 0) as total_revenue
FROM stores s
LEFT JOIN products p ON s.id = p.store_id
LEFT JOIN customers c ON s.id = c.store_id  
LEFT JOIN orders o ON s.id = o.store_id
GROUP BY s.id, s.name;
