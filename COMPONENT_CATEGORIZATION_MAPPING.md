# 🗂️ **COMPONENT CATEGORIZATION MAPPING**

**Date:** January 2025  
**Purpose:** Systematic component migration from `src/core/shared/components/` to domain-specific locations

## 📊 **MIGRATION MAP**

### 🏢 **ERP Domain Components** → `src/domains/erp/components/`
**Target:** `src/domains/erp/components/`
```
✅ ERP Core Systems:
- CompleteERPDashboard.tsx
- CompleteERPSystem.tsx
- ERPProjectOrderComponent.tsx
- ERPStoreDashboard.tsx
- ERPSystemIntegration.tsx
- SupabaseERPSystem.tsx

✅ Advanced Management Modules:
- AdvancedCRMManagement.tsx
- AdvancedFinancialManagement.tsx
- AdvancedInventoryManagement.tsx
- AdvancedReportingEngine.tsx
```

### 💰 **POS Domain Components** → `src/domains/pos/components/`
**Target:** `src/domains/pos/components/`
```
✅ POS Core System:
- POSApp.tsx
- ComprehensivePOSSystem.tsx
- OfflinePOS.tsx

✅ POS Navigation & UI:
- POSNavbar.tsx
- POSUserSearch.tsx

✅ POS Hardware Integration:
- BarcodeScannerPOS.tsx
- ReceiptPrinter.tsx
```

### 📦 **Inventory Domain Components** → `src/domains/inventory/components/`
**Target:** `src/domains/inventory/components/`
```
✅ Inventory Management:
- InventoryManagement.tsx
- InventoryWidget.tsx
- StockMovements.tsx
- StockApp.tsx

✅ Inventory Forms & Kits:
- inventory-kit-tab.tsx
- product-create-inventory-kit-form.tsx
- product-create-inventory-kit-section.tsx
- manage-variant-inventory-items-form/
```

### 📈 **Analytics Domain Components** → `src/domains/analytics/components/`
**Target:** `src/domains/analytics/components/`
```
✅ Dashboard Analytics:
- analytics-dashboard.tsx
- analytics-metrics.tsx
- AnalyticsWidget.tsx

✅ Specific Analytics:
- customer-analytics.tsx
- product-analytics.tsx
- vendor-analytics.tsx
- MarketAnalytics.tsx
```

### 💼 **CRM Domain Components** → `src/domains/crm/components/`
**Target:** `src/domains/crm/components/`
```
✅ CRM Widgets:
- CRMWidget.tsx
- customer-info.tsx
- customer-list-table.tsx

✅ Customer Management:
- add-customers-form/
- customer-group-*
- customer-cell.tsx
```

### 🛍️ **Store Domain Components** → `src/domains/store/components/`
**Target:** `src/domains/store/components/`
```
✅ Store Management:
- store-general-section/
- store-currency-section/
- StorePermissionSystem.tsx

✅ Store Operations:
- edit-store-form/
- sales-channel-*
```

### 📱 **UI Components** → `src/components/ui/`
**Target:** `src/components/ui/` (Already exists, consolidate)
```
✅ Pure UI Components:
- Modal.tsx
- ErrorBoundary.tsx
- LoadingComponents.tsx
- DataCard.tsx
- ActionButton.tsx

✅ Form Components:
- FileUpload.tsx
- date-range-picker.tsx
- country-select.tsx
- province-select.tsx
```

### 🔧 **Shared Utilities** → `src/lib/shared/`
**Target:** `src/lib/shared/`
```
✅ Utility Components:
- error-boundary.tsx
- ErrorHandler.tsx
- FeatureToggle.tsx
- LayoutProvider.tsx
- ProtectedRoute.tsx
```

### ❌ **Components to Remove** (Test-Only or Unused)
```
🗑️ Test-Only Components:
- BooksApp.tsx (only used in tests)
- StockApp.tsx (only used in tests) 
- POSApp.tsx (check if used in production)

🗑️ Already Cleaned:
- BarcodeScanner_old.tsx ✅ REMOVED
```

## 🎯 **MIGRATION PRIORITY**

### Phase 1: High-Impact Domains (Day 2)
1. **ERP Domain** - 10 components (largest business impact)
2. **POS Domain** - 6 components (hardware integration critical)
3. **Analytics Domain** - 7 components (performance sensitive)

### Phase 2: Supporting Domains (Day 3)
1. **Inventory Domain** - 8 components
2. **CRM Domain** - 6 components  
3. **Store Domain** - 5 components

### Phase 3: Infrastructure (Day 3-4)
1. **UI Components** - Consolidate into existing structure
2. **Shared Utilities** - Move to lib/shared
3. **Remove Unused** - Clean up test-only components

## 📋 **IMPLEMENTATION CHECKLIST**

### Pre-Migration Setup:
- [ ] Create domain directories if they don't exist
- [ ] Backup current structure
- [ ] Document current import patterns

### Migration Process:
- [ ] Move components using `git mv` to preserve history
- [ ] Update import paths in moved components
- [ ] Update import paths in consuming files
- [ ] Update path aliases in tsconfig.json
- [ ] Run build test after each domain migration

### Post-Migration Validation:
- [ ] Full build process succeeds
- [ ] All tests pass
- [ ] No broken imports remain
- [ ] Performance validation

---

**Status:** Ready for systematic migration  
**Next Action:** Begin ERP domain component migration
