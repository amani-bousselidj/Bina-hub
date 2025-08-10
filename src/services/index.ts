// Barrel exports for service instances
export { default as authService } from './auth';
export { default as baseService } from './base-service';
export { default as cartService } from './cart';
export { default as orderService } from './order';
export { default as marketplaceService } from './marketplace';
export { default as concreteSupplyService } from './concreteSupplyService';
export { default as constructionService } from './construction';
export { default as constructionIntegrationService } from './constructionIntegrationService';
export { default as constructionPDFAnalyzer } from './constructionPDFAnalyzer';
export { default as equipmentRentalService } from './equipmentRentalService';
export { default as fatoorahService } from './fatoorah-service';
export { default as platformDataService } from './platform-data-service';
export { default as projectPurchaseService, ProjectPurchaseService } from './project-purchase';
export { default as projectTrackingService } from './projectTrackingService';
export { default as supabaseDataService } from './supabase-data-service';
export { default as supabaseService } from './supabaseDataService';
export { default as supervisorService } from './supervisor-service';
export { default as unifiedBookingService } from './unifiedBookingService';
export { default as wasteManagementService } from './wasteManagementService';
export { default as constructionGuidanceService, ConstructionGuidanceService } from './constructionGuidanceService';

// Type exports for integration models
export type { ArchitecturalPlan, InsuranceQuote, LandListing } from './constructionIntegrationService';
// Export concrete-supply service types
export type { ConcreteOrder, ConcreteType, ConcreteRequirement, ConcreteSupplier, DeliveryStatusInfo, DeliveryStatus } from './concreteSupplyService';
export type { EquipmentType, EquipmentBooking, BookingFilters } from './equipmentRentalService';
// Export cart service types
export type { CartItem, CartSummary } from './cart';
export type { PurchaseAllocation } from './project-purchase';
export type { BookingService, Booking, BookingCalendarEvent, ConflictResolution, SchedulingRecommendation } from './unifiedBookingService';
