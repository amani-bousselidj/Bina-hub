# Batch Redundancy Resolution Log

**Started:** 2025-08-05T05:44:40.011Z

🚀 Starting Batch Redundancy Resolution...


## 🎯 Resolving UI Component Duplicates

✅ breadcrumb.tsx - No redundancy (1 file exists)
🔄 data-table.tsx:
   Keep: src/core/shared/components/ui/data-table.tsx
   ❌ Removed: src/components/ui/data-table.tsx
🔄 card.tsx:
   Keep: src/components/ui/card.tsx
   ❌ Removed: src/core/shared/components/card.tsx
🔄 input.tsx:
   Keep: src/components/ui/input.tsx
   ❌ Removed: src/core/shared/components/input.tsx
🔄 label.tsx:
   Keep: src/core/shared/components/ui/label.tsx
   ❌ Removed: src/core/shared/components/label.tsx
🔄 select.tsx:
   Keep: src/core/shared/components/ui/select.tsx
   ❌ Removed: src/core/shared/components/select.tsx
🔄 textarea.tsx:
   Keep: src/core/shared/components/ui/textarea.tsx
   ❌ Removed: src/components/ui/textarea.tsx
🔄 tooltip.tsx:
   Keep: src/core/shared/components/ui/tooltip.tsx
   ❌ Removed: src/components/ui/tooltip.tsx
🔄 popover.tsx:
   Keep: src/core/shared/components/ui/popover.tsx
   ❌ Removed: src/core/shared/components/popover.tsx
🔄 sheet.tsx:
   Keep: src/core/shared/components/ui/sheet.tsx
   ❌ Removed: src/core/shared/components/sheet.tsx
🔄 separator.tsx:
   Keep: src/core/shared/components/ui/separator.tsx
   ❌ Removed: src/core/shared/components/separator.tsx
🔄 tabs.tsx:
   Keep: src/core/shared/components/ui/tabs.tsx
   ❌ Removed: src/core/shared/components/tabs.tsx
🔄 switch.tsx:
   Keep: src/core/shared/components/ui/switch.tsx
   ❌ Removed: src/core/shared/components/switch.tsx
🔄 progress.tsx:
   Keep: src/core/shared/components/ui/progress.tsx
   ❌ Removed: src/components/ui/progress.tsx
🔄 badge.tsx:
   Keep: src/components/ui/badge.tsx
   ❌ Removed: src/core/shared/components/badge.tsx

## 📝 Resolving Type Definition Duplicates

🔄 auth.ts:
   Keep: src/app\api\middleware\auth.ts
   ⏭️  Skipped: src/core\shared\services\auth.ts (different content)
   ⏭️  Skipped: src/services\auth.ts (different content)
🔄 database.ts:
   Keep: src/core\shared\utils\database.ts
   ⏭️  Skipped: src/types\database.ts (different content)
🔄 cache.ts:
   Keep: src/app\api\admin\cache.ts
   ⏭️  Skipped: src/core\shared\utils\cache.ts (different content)
🔄 constants.ts:
   Keep: src/app\store\api-key-management\common\constants.ts
   ⏭️  Skipped: src/app\store\campaigns\campaign-detail\constants.ts (different content)
   ⏭️  Skipped: src/app\store\customer-groups\customer-group-detail\constants.ts (different content)
   ⏭️  Skipped: src/app\store\locations\common\constants.ts (different content)
   ⏭️  Skipped: src/app\store\locations\location-detail\constants.ts (different content)
   ⏭️  Skipped: src/app\store\locations\location-list\constants.ts (different content)
   ⏭️  Skipped: src/app\store\locations\location-service-zone-shipping-option-create\constants.ts (different content)
   ⏭️  Skipped: src/app\store\price-lists\common\constants.ts (different content)
   ⏭️  Skipped: src/app\store\product-variants\constants.ts (different content)
   ⏭️  Skipped: src/app\store\product-variants\product-variant-detail\constants.ts (different content)
🔄 types.ts:
   Keep: src/app\store\locations\common\types.ts
   ⏭️  Skipped: src/app\store\tax-regions\tax-region-tax-override-edit\types.ts (different content)
   ⏭️  Skipped: src/app\store\workflow-executions\types.ts (different content)
   ⏭️  Skipped: src/core\shared\components\types.ts (different content)
   ⏭️  Skipped: src/types\types.ts (different content)
🔄 index.ts:
   Keep: src/app\store\api-key-management\api-key-management-create\index.ts
   ⏭️  Skipped: src/app\store\api-key-management\api-key-management-detail\index.ts (different content)
   ⏭️  Skipped: src/app\store\api-key-management\api-key-management-edit\index.ts (different content)
   ⏭️  Skipped: src/app\store\api-key-management\api-key-management-list\index.ts (different content)
   ⏭️  Skipped: src/app\store\api-key-management\api-key-management-sales-channels\index.ts (different content)
   ⏭️  Skipped: src/app\store\campaigns\add-campaign-promotions\index.ts (different content)
   ⏭️  Skipped: src/app\store\campaigns\campaign-budget-edit\index.ts (different content)
   ⏭️  Skipped: src/app\store\campaigns\campaign-configuration\index.ts (different content)
   ⏭️  Skipped: src/app\store\campaigns\campaign-create\index.ts (different content)
   ⏭️  Skipped: src/app\store\campaigns\campaign-detail\index.ts (different content)

## 📊 Batch Resolution Summary

- **Resolved:** 14 files
- **Skipped:** 27 files  
- **Errors:** 0 files
- **Total Processed:** 41 files

**Completion Rate:** 34.1%

---
**Completed:** 2025-08-05T05:44:51.872Z

