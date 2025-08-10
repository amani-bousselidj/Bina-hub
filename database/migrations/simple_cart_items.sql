-- Enhanced Cart Items Table for Direct User Integration
-- This table provides a simpler cart structure that works directly with users
-- without requiring separate cart sessions

CREATE TABLE IF NOT EXISTS marketplace.simple_cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES marketplace.products(id) ON DELETE CASCADE,
    store_id UUID REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_simple_cart_items_user_id ON marketplace.simple_cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_simple_cart_items_product_id ON marketplace.simple_cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_simple_cart_items_store_id ON marketplace.simple_cart_items(store_id);

-- Create unique constraint to prevent duplicate items
CREATE UNIQUE INDEX IF NOT EXISTS idx_simple_cart_items_user_product 
ON marketplace.simple_cart_items(user_id, product_id);

-- RLS Policies for cart items
ALTER TABLE marketplace.simple_cart_items ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own cart items
CREATE POLICY "Users can view own cart items" ON marketplace.simple_cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON marketplace.simple_cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" ON marketplace.simple_cart_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON marketplace.simple_cart_items
    FOR DELETE USING (auth.uid() = user_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION marketplace.update_simple_cart_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_simple_cart_items_updated_at
    BEFORE UPDATE ON marketplace.simple_cart_items
    FOR EACH ROW
    EXECUTE FUNCTION marketplace.update_simple_cart_items_updated_at();
