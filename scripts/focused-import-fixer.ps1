# Focused Import Error Fixer
# Targets the specific remaining TypeScript import errors

Write-Host "=== Focused Import Error Fixer ===" -ForegroundColor Green

# 1. Fix missing integrations and store barrel exports
Write-Host "`n1. Creating missing integrations/index.ts..." -ForegroundColor Cyan

$integrationsIndexPath = "src/components/admin/integrations/index.ts"
$integrationsIndexContent = @"
// Integration component exports
export { default as ConcreteSupplyIntegration } from './ConcreteSupplyIntegration';
export { default as ContractorSelectionIntegration } from './ContractorSelectionIntegration';
export { default as EquipmentRentalIntegration } from './EquipmentRentalIntegration';
export { default as InsuranceIntegration } from './InsuranceIntegration';
export { default as LandPurchaseIntegration } from './LandPurchaseIntegration';
"@

Set-Content $integrationsIndexPath -Value $integrationsIndexContent
Write-Host "✅ Created integrations/index.ts" -ForegroundColor Green

# 2. Create store barrel export
Write-Host "`n2. Creating missing store/index.ts..." -ForegroundColor Cyan

$storeIndexPath = "src/components/admin/store/index.ts" 
$storeIndexContent = @"
// Store component exports
export { default as CustomerSearchWidget } from './CustomerSearchWidget';
"@

Set-Content $storeIndexPath -Value $storeIndexContent
Write-Host "✅ Created store/index.ts" -ForegroundColor Green

# 3. Fix the ConcreteSupplyService import issue
Write-Host "`n3. Fixing ConcreteSupplyService import..." -ForegroundColor Cyan

$concreteIntegrationFile = "src/components/admin/integrations/ConcreteSupplyIntegration.tsx"
if (Test-Path $concreteIntegrationFile) {
    $content = Get-Content $concreteIntegrationFile -Raw
    
    # Replace the import line to use the correct export name
    $content = $content -replace "import \{ ConcreteSupplyService \} from '@/services/concreteSupplyService';", "import { concreteSupplyService } from '@/services/concreteSupplyService';"
    
    # Replace all usage of ConcreteSupplyService with concreteSupplyService
    $content = $content -replace "ConcreteSupplyService\.", "concreteSupplyService."
    
    Set-Content $concreteIntegrationFile -Value $content -NoNewline
    Write-Host "✅ Fixed ConcreteSupplyService import and usage" -ForegroundColor Green
}

# 4. Check and fix other service files for proper exports
Write-Host "`n4. Ensuring proper service exports..." -ForegroundColor Cyan

$servicesToCheck = @(
    @{Path = "src/services/concreteSupplyService.ts"; InstanceName = "concreteSupplyService"},
    @{Path = "src/services/equipmentRentalService.ts"; InstanceName = "equipmentRentalService"},
    @{Path = "src/services/constructionIntegrationService.ts"; InstanceName = "constructionIntegrationService"}
)

foreach ($service in $servicesToCheck) {
    if (Test-Path $service.Path) {
        $content = Get-Content $service.Path -Raw
        
        # Check if it has proper instance export
        if (-not ($content -match "export const $($service.InstanceName)")) {
            # Add instance export at the end
            $content += "`n`n// Instance export for easy importing`nexport const $($service.InstanceName) = new $($service.InstanceName.Substring(0,1).ToUpper() + $service.InstanceName.Substring(1) -replace 'Service$', 'Service')();"
            Set-Content $service.Path -Value $content -NoNewline
            Write-Host "✅ Added instance export to $($service.Path)" -ForegroundColor Green
        } else {
            Write-Host "✅ $($service.Path) already has instance export" -ForegroundColor Green
        }
    }
}

# 5. Run a final TypeScript check to measure improvement
Write-Host "`n5. Measuring improvement..." -ForegroundColor Cyan

$finalErrors = (npx tsc --noEmit 2>&1 | Select-String "error TS").Count
Write-Host "Remaining TypeScript errors: $finalErrors" -ForegroundColor Yellow

if ($finalErrors -lt 379) {
    $improvement = 379 - $finalErrors
    Write-Host "✅ Fixed $improvement additional errors!" -ForegroundColor Green
} else {
    Write-Host "⚠️  No additional errors fixed - may need manual intervention" -ForegroundColor Yellow
}

Write-Host "`n🏁 Focused import fixes completed!" -ForegroundColor Green
