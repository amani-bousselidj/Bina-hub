// @ts-nocheck
import { MedusaService } from '@medusajs/framework/utils';
import { 
  FulfillmentCenter, 
  FulfillmentCenterStatus, 
  FulfillmentCenterType,
  ServiceCapability,
  FulfillmentInventory,
  FulfillmentOrder,
  FulfillmentOrderStatus,
  FulfillmentOrderPriority,
  FulfillmentShipment,
  ShipmentStatus
} from '../models/fulfillment-center';

type CreateFulfillmentCenterData = {
  name: string;
  code: string;
  type: FulfillmentCenterType;
  address: string;
  city: string;
  region: string;
  postal_code: string;
  country_code: string;
  latitude?: number;
  longitude?: number;
  total_capacity_cubic_meters: number;
  total_storage_units: number;
  service_capabilities?: ServiceCapability[];
  service_areas?: Record<string, string[]>;
  operating_hours?: Record<string, { open: string; close: string }>;
  manager_name?: string;
  manager_email?: string;
  manager_phone?: string;
  contact_email?: string;
  contact_phone?: string;
  cost_structure?: Record<string, number>;
  metadata?: Record<string, any>;
  created_by?: string;
};

type UpdateFulfillmentCenterData = Partial<CreateFulfillmentCenterData> & {
  status?: FulfillmentCenterStatus;
};

type CreateFulfillmentOrderData = {
  fulfillment_center_id: string;
  order_id: string;
  vendor_id: string;
  customer_id: string;
  priority?: FulfillmentOrderPriority;
  shipping_address: {
    name: string;
    company?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    region: string;
    postal_code: string;
    country_code: string;
    phone?: string;
    email?: string;
  };
  items: {
    product_id: string;
    variant_id: string;
    sku: string;
    quantity: number;
    title: string;
    unit_price: number;
    total_price: number;
    weight_kg?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  }[];
  total_amount: number;
  total_weight_kg?: number;
  requested_ship_date?: Date;
  promised_delivery_date?: Date;
  carrier_code?: string;
  service_type?: string;
  special_instructions?: Record<string, any>;
  metadata?: Record<string, any>;
};

type InventoryReceiptData = {
  fulfillment_center_id: string;
  items: {
    product_id: string;
    variant_id: string;
    sku: string;
    quantity: number;
    location_code?: string;
    batch_number?: string;
    lot_number?: string;
    expiration_date?: Date;
    unit_weight_kg?: number;
    unit_volume_cubic_meters?: number;
  }[];
  vendor_id: string;
  reference_number?: string;
  notes?: string;
  received_by?: string;
};

type FulfillmentAnalytics = {
  center_id: string;
  period: 'day' | 'week' | 'month' | 'year';
  orders_processed: number;
  order_accuracy_rate: number;
  on_time_shipment_rate: number;
  capacity_utilization: number;
  cost_per_order: number;
  revenue_generated: number;
  top_products: Array<{
    product_id: string;
    sku: string;
    quantity_shipped: number;
    revenue: number;
  }>;
  performance_trends: Array<{
    date: string;
    orders: number;
    accuracy: number;
    on_time: number;
  }>;
};

type FulfillmentRecommendations = {
  inventory_restock: Array<{
    sku: string;
    current_stock: number;
    recommended_quantity: number;
    reason: string;
    urgency: 'low' | 'medium' | 'high';
  }>;
  capacity_optimization: Array<{
    center_id: string;
    issue: string;
    recommendation: string;
    potential_savings: number;
  }>;
  performance_improvements: Array<{
    metric: string;
    current_value: number;
    target_value: number;
    action_items: string[];
  }>;
};

export class FulfillmentCenterService extends MedusaService({
  FulfillmentCenter,
  FulfillmentInventory,
  FulfillmentOrder,
  FulfillmentShipment,
}) {
  
  // Fulfillment Center Management
  async createFulfillmentCenter(data: CreateFulfillmentCenterData): Promise<FulfillmentCenter> {
    const center = this.fulfillmentCenterRepository_.create({
      ...data,
      available_storage_units: data.total_storage_units,
      capacity_utilization_percent: 0,
    });

    return await this.fulfillmentCenterRepository_.save(center);
  }

  async updateFulfillmentCenter(
    id: string, 
    data: UpdateFulfillmentCenterData
  ): Promise<FulfillmentCenter> {
    const center = await this.fulfillmentCenterRepository_.findOne({ id });
    if (!center) {
      throw new Error(`Fulfillment center with id ${id} not found`);
    }

    Object.assign(center, data);
    center.updated_at = new Date();

    return await this.fulfillmentCenterRepository_.save(center);
  }

  async getFulfillmentCenter(id: string): Promise<FulfillmentCenter | null> {
    return await this.fulfillmentCenterRepository_.findOne(
      { id },
      { 
        populate: ['inventory_items', 'fulfillment_orders', 'shipments']
      }
    );
  }

  async listFulfillmentCenters(filters?: {
    status?: FulfillmentCenterStatus;
    type?: FulfillmentCenterType;
    city?: string;
    region?: string;
    country_code?: string;
    service_capability?: ServiceCapability;
  }): Promise<FulfillmentCenter[]> {
    const whereClause: any = {};

    if (filters?.status) whereClause.status = filters.status;
    if (filters?.type) whereClause.type = filters.type;
    if (filters?.city) whereClause.city = filters.city;
    if (filters?.region) whereClause.region = filters.region;
    if (filters?.country_code) whereClause.country_code = filters.country_code;
    if (filters?.service_capability) {
      whereClause.service_capabilities = { $like: `%${filters.service_capability}%` };
    }

    return await this.fulfillmentCenterRepository_.find(whereClause);
  }

  async deleteFulfillmentCenter(id: string): Promise<void> {
    await this.fulfillmentCenterRepository_.nativeDelete({ id });
  }

  // Inventory Management (FBA-style)
  async receiveInventory(data: InventoryReceiptData): Promise<FulfillmentInventory[]> {
    const center = await this.fulfillmentCenterRepository_.findOne({ 
      id: data.fulfillment_center_id 
    });
    
    if (!center) {
      throw new Error(`Fulfillment center ${data.fulfillment_center_id} not found`);
    }

    const inventoryItems: FulfillmentInventory[] = [];

    for (const item of data.items) {
      // Check if inventory already exists for this SKU
      let inventory = await this.fulfillmentInventoryRepository_.findOne({
        fulfillment_center: center,
        sku: item.sku,
        variant_id: item.variant_id,
      });

      if (inventory) {
        // Update existing inventory
        inventory.quantity_available += item.quantity;
        inventory.last_counted_at = new Date();
        if (item.location_code) inventory.location_code = item.location_code;
        if (item.batch_number) inventory.batch_number = item.batch_number;
        if (item.lot_number) inventory.lot_number = item.lot_number;
        if (item.expiration_date) inventory.expiration_date = item.expiration_date;
        if (item.unit_weight_kg) inventory.unit_weight_kg = item.unit_weight_kg;
        if (item.unit_volume_cubic_meters) inventory.unit_volume_cubic_meters = item.unit_volume_cubic_meters;
      } else {
        // Create new inventory record
        inventory = this.fulfillmentInventoryRepository_.create({
          fulfillment_center: center,
          product_id: item.product_id,
          variant_id: item.variant_id,
          sku: item.sku,
          quantity_available: item.quantity,
          location_code: item.location_code,
          batch_number: item.batch_number,
          lot_number: item.lot_number,
          expiration_date: item.expiration_date,
          unit_weight_kg: item.unit_weight_kg,
          unit_volume_cubic_meters: item.unit_volume_cubic_meters,
        });
      }

      await this.fulfillmentInventoryRepository_.save(inventory);
      inventoryItems.push(inventory);

      // Update center capacity if volume is specified
      if (item.unit_volume_cubic_meters) {
        center.used_capacity_cubic_meters += item.quantity * item.unit_volume_cubic_meters;
        center.updateCapacityUtilization();
      }
    }

    await this.fulfillmentCenterRepository_.save(center);
    return inventoryItems;
  }

  async getInventoryByCenter(centerId: string): Promise<FulfillmentInventory[]> {
    return await this.fulfillmentInventoryRepository_.find(
      { fulfillment_center: { id: centerId } },
      { populate: ['fulfillment_center'] }
    );
  }

  async getInventoryBySKU(sku: string): Promise<FulfillmentInventory[]> {
    return await this.fulfillmentInventoryRepository_.find(
      { sku },
      { populate: ['fulfillment_center'] }
    );
  }

  async updateInventoryLocation(
    inventoryId: string, 
    locationData: {
      location_code?: string;
      aisle?: string;
      shelf?: string;
      bin?: string;
    }
  ): Promise<FulfillmentInventory> {
    const inventory = await this.fulfillmentInventoryRepository_.findOne({ id: inventoryId });
    if (!inventory) {
      throw new Error(`Inventory record ${inventoryId} not found`);
    }

    Object.assign(inventory, locationData);
    inventory.updated_at = new Date();

    return await this.fulfillmentInventoryRepository_.save(inventory);
  }

  // Fulfillment Order Management (FBA-style)
  async createFulfillmentOrder(data: CreateFulfillmentOrderData): Promise<FulfillmentOrder> {
    const center = await this.fulfillmentCenterRepository_.findOne({ 
      id: data.fulfillment_center_id 
    });
    
    if (!center) {
      throw new Error(`Fulfillment center ${data.fulfillment_center_id} not found`);
    }

    // Check inventory availability
    for (const item of data.items) {
      const inventory = await this.fulfillmentInventoryRepository_.findOne({
        fulfillment_center: center,
        sku: item.sku,
      });

      if (!inventory || inventory.quantity_available < item.quantity) {
        throw new Error(`Insufficient inventory for SKU ${item.sku}`);
      }
    }

    const order = this.fulfillmentOrderRepository_.create({
      fulfillment_center: center,
      ...data,
    });

    const savedOrder = await this.fulfillmentOrderRepository_.save(order);

    // Reserve inventory
    for (const item of data.items) {
      const inventory = await this.fulfillmentInventoryRepository_.findOne({
        fulfillment_center: center,
        sku: item.sku,
      });

      if (inventory) {
        inventory.quantity_available -= item.quantity;
        inventory.quantity_reserved += item.quantity;
        await this.fulfillmentInventoryRepository_.save(inventory);
      }
    }

    // Calculate fulfillment costs
    savedOrder.calculateFulfillmentCosts(center);
    await this.fulfillmentOrderRepository_.save(savedOrder);

    return savedOrder;
  }

  async updateFulfillmentOrderStatus(
    orderId: string, 
    status: FulfillmentOrderStatus,
    userId?: string
  ): Promise<FulfillmentOrder> {
    const order = await this.fulfillmentOrderRepository_.findOne({ id: orderId });
    if (!order) {
      throw new Error(`Fulfillment order ${orderId} not found`);
    }

    order.updateStatus(status, userId);
    
    // If order is completed, release reserved inventory
    if (status === FulfillmentOrderStatus.SHIPPED) {
      for (const item of order.items) {
        const inventory = await this.fulfillmentInventoryRepository_.findOne({
          fulfillment_center: order.fulfillment_center,
          sku: item.sku,
        });

        if (inventory) {
          inventory.quantity_reserved -= item.quantity;
          await this.fulfillmentInventoryRepository_.save(inventory);
        }
      }
    }

    return await this.fulfillmentOrderRepository_.save(order);
  }

  async getFulfillmentOrder(id: string): Promise<FulfillmentOrder | null> {
    return await this.fulfillmentOrderRepository_.findOne(
      { id },
      { populate: ['fulfillment_center', 'shipments'] }
    );
  }

  async listFulfillmentOrders(filters?: {
    fulfillment_center_id?: string;
    status?: FulfillmentOrderStatus;
    priority?: FulfillmentOrderPriority;
    vendor_id?: string;
    customer_id?: string;
    from_date?: Date;
    to_date?: Date;
  }): Promise<FulfillmentOrder[]> {
    const whereClause: any = {};

    if (filters?.fulfillment_center_id) {
      whereClause.fulfillment_center = { id: filters.fulfillment_center_id };
    }
    if (filters?.status) whereClause.status = filters.status;
    if (filters?.priority) whereClause.priority = filters.priority;
    if (filters?.vendor_id) whereClause.vendor_id = filters.vendor_id;
    if (filters?.customer_id) whereClause.customer_id = filters.customer_id;
    if (filters?.from_date || filters?.to_date) {
      whereClause.created_at = {};
      if (filters.from_date) whereClause.created_at.$gte = filters.from_date;
      if (filters.to_date) whereClause.created_at.$lte = filters.to_date;
    }

    return await this.fulfillmentOrderRepository_.find(
      whereClause,
      { populate: ['fulfillment_center', 'shipments'] }
    );
  }

  // Shipment Management
  async createShipment(data: {
    fulfillment_order_id: string;
    tracking_number: string;
    carrier_code: string;
    service_type: string;
    shipping_cost: number;
    weight_kg?: number;
    dimensions?: { length: number; width: number; height: number };
    estimated_delivery_at?: Date;
  }): Promise<FulfillmentShipment> {
    const order = await this.fulfillmentOrderRepository_.findOne({ 
      id: data.fulfillment_order_id 
    });
    
    if (!order) {
      throw new Error(`Fulfillment order ${data.fulfillment_order_id} not found`);
    }

    const shipment = this.fulfillmentShipmentRepository_.create({
      fulfillment_center: order.fulfillment_center,
      fulfillment_order: order,
      ...data,
    });

    const savedShipment = await this.fulfillmentShipmentRepository_.save(shipment);

    // Update order with tracking info
    order.tracking_number = data.tracking_number;
    order.carrier_code = data.carrier_code;
    order.service_type = data.service_type;
    order.updateStatus(FulfillmentOrderStatus.SHIPPED);
    await this.fulfillmentOrderRepository_.save(order);

    return savedShipment;
  }

  async updateShipmentStatus(
    shipmentId: string, 
    status: ShipmentStatus,
    location?: string
  ): Promise<FulfillmentShipment> {
    const shipment = await this.fulfillmentShipmentRepository_.findOne({ id: shipmentId });
    if (!shipment) {
      throw new Error(`Shipment ${shipmentId} not found`);
    }

    shipment.updateStatus(status);
    shipment.addTrackingEvent(status, `Status updated to ${status}`, location);

    return await this.fulfillmentShipmentRepository_.save(shipment);
  }

  // Analytics and Reporting
  async getFulfillmentAnalytics(
    centerId: string, 
    period: 'day' | 'week' | 'month' | 'year'
  ): Promise<FulfillmentAnalytics> {
    const center = await this.fulfillmentCenterRepository_.findOne({ id: centerId });
    if (!center) {
      throw new Error(`Fulfillment center ${centerId} not found`);
    }

    // Calculate date range based on period
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
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const orders = await this.fulfillmentOrderRepository_.find({
      fulfillment_center: center,
      created_at: { $gte: startDate },
    });

    const ordersProcessed = orders.length;
    const shippedOrders = orders.filter(o => o.status === FulfillmentOrderStatus.SHIPPED).length;
    const onTimeShipments = orders.filter(o => 
      o.shipped_at && o.promised_delivery_date && 
      o.shipped_at <= o.promised_delivery_date
    ).length;

    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const totalCosts = orders.reduce((sum, order) => 
      sum + (order.fulfillment_costs.total || 0), 0
    );

    return {
      center_id: centerId,
      period,
      orders_processed: ordersProcessed,
      order_accuracy_rate: center.order_accuracy_percent,
      on_time_shipment_rate: ordersProcessed > 0 ? (onTimeShipments / ordersProcessed) * 100 : 0,
      capacity_utilization: center.capacity_utilization_percent,
      cost_per_order: ordersProcessed > 0 ? totalCosts / ordersProcessed : 0,
      revenue_generated: totalRevenue,
      top_products: [], // TODO: Implement top products analysis
      performance_trends: [], // TODO: Implement trend analysis
    };
  }

  async getFulfillmentRecommendations(centerId: string): Promise<FulfillmentRecommendations> {
    const center = await this.getFulfillmentCenter(centerId);
    if (!center) {
      throw new Error(`Fulfillment center ${centerId} not found`);
    }

    const inventory = await this.getInventoryByCenter(centerId);
    
    // Generate restock recommendations
    const restockRecommendations = inventory
      .filter(item => item.needs_restock)
      .map(item => ({
        sku: item.sku,
        current_stock: item.quantity_available,
        recommended_quantity: 50, // Simple logic - could be more sophisticated
        reason: 'Low stock level detected',
        urgency: item.quantity_available === 0 ? 'high' as const : 'medium' as const,
      }));

    // Generate capacity optimization recommendations
    const capacityRecommendations = [];
    if (center.capacity_utilization_percent > 90) {
      capacityRecommendations.push({
        center_id: centerId,
        issue: 'High capacity utilization',
        recommendation: 'Consider expanding storage capacity or transferring inventory',
        potential_savings: 1000, // Estimate
      });
    }

    // Generate performance improvement recommendations
    const performanceRecommendations = [];
    if (center.order_accuracy_percent < 95) {
      performanceRecommendations.push({
        metric: 'Order Accuracy',
        current_value: center.order_accuracy_percent,
        target_value: 99,
        action_items: [
          'Implement barcode scanning for picking',
          'Add quality control checkpoints',
          'Train staff on accuracy procedures'
        ],
      });
    }

    return {
      inventory_restock: restockRecommendations,
      capacity_optimization: capacityRecommendations,
      performance_improvements: performanceRecommendations,
    };
  }

  // Optimal Center Selection (Amazon-style routing)
  async selectOptimalFulfillmentCenter(
    customerAddress: {
      city: string;
      region: string;
      country_code: string;
      postal_code: string;
    },
    items: { sku: string; quantity: number }[],
    serviceLevel: 'standard' | 'express' | 'same_day' = 'standard'
  ): Promise<FulfillmentCenter | null> {
    // Get all active centers
    const centers = await this.listFulfillmentCenters({ 
      status: FulfillmentCenterStatus.ACTIVE 
    });

    // Filter centers that can fulfill the order
    const eligibleCenters = [];

    for (const center of centers) {
      // Check if center serves the customer's area
      const servesArea = this.checkServiceArea(center, customerAddress, serviceLevel);
      if (!servesArea) continue;

      // Check if center has required service capability
      const hasCapability = this.checkServiceCapability(center, serviceLevel);
      if (!hasCapability) continue;

      // Check inventory availability
      const canFulfill = await this.checkInventoryAvailability(center, items);
      if (!canFulfill) continue;

      // Check capacity constraints
      if (center.is_at_capacity) continue;

      eligibleCenters.push(center);
    }

    if (eligibleCenters.length === 0) return null;

    // Score centers based on multiple factors
    const scoredCenters = eligibleCenters.map(center => ({
      center,
      score: this.calculateCenterScore(center, customerAddress, serviceLevel),
    }));

    // Return the highest-scoring center
    scoredCenters.sort((a, b) => b.score - a.score);
    return scoredCenters[0].center;
  }

  private checkServiceArea(
    center: FulfillmentCenter, 
    customerAddress: any, 
    serviceLevel: string
  ): boolean {
    // Simple implementation - could be more sophisticated with geographic calculations
    const serviceAreas = center.service_areas[serviceLevel] || [];
    return serviceAreas.length === 0 || // No restrictions
           serviceAreas.includes(customerAddress.region) ||
           serviceAreas.includes(customerAddress.postal_code);
  }

  private checkServiceCapability(center: FulfillmentCenter, serviceLevel: string): boolean {
    switch (serviceLevel) {
      case 'same_day':
        return center.can_handle_same_day;
      case 'express':
        return center.can_handle_express;
      default:
        return true; // Standard shipping is always available
    }
  }

  private async checkInventoryAvailability(
    center: FulfillmentCenter, 
    items: { sku: string; quantity: number }[]
  ): Promise<boolean> {
    for (const item of items) {
      const inventory = await this.fulfillmentInventoryRepository_.findOne({
        fulfillment_center: center,
        sku: item.sku,
      });

      if (!inventory || inventory.quantity_available < item.quantity) {
        return false;
      }
    }
    return true;
  }

  private calculateCenterScore(
    center: FulfillmentCenter, 
    customerAddress: any, 
    serviceLevel: string
  ): number {
    let score = 0;

    // Distance factor (simplified - would use actual geographic calculation)
    if (center.region === customerAddress.region) score += 50;
    if (center.city === customerAddress.city) score += 25;

    // Performance factors
    score += center.order_accuracy_percent * 0.3;
    score += center.on_time_shipment_percent * 0.3;

    // Capacity factor
    score += (100 - center.capacity_utilization_percent) * 0.2;

    // Service level bonus
    if (serviceLevel === 'same_day' && center.can_handle_same_day) score += 20;
    if (serviceLevel === 'express' && center.can_handle_express) score += 10;

    return score;
  }
}





