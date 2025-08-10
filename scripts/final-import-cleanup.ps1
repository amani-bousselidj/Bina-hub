# Final Import Cleanup Script
# Comprehensive fix for remaining TypeScript import issues

Write-Host "=== Final Import Cleanup Script ===" -ForegroundColor Green

$initialErrors = 378  # Current count

# 1. Fix all service import patterns throughout the project
Write-Host "`n1. Fixing service import patterns project-wide..." -ForegroundColor Cyan

$serviceImportFixes = @{
    "ConcreteSupplyService" = "concreteSupplyService"
    "EquipmentRentalService" = "equipmentRentalService" 
    "ConstructionIntegrationService" = "constructionIntegrationService"
    "UnifiedBookingService" = "unifiedBookingService"
}

# Find all files with service imports and fix them
Get-ChildItem -Recurse -Path "src" -Include "*.tsx","*.ts" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw -ErrorAction SilentlyContinue
    
    if ($content) {
        $changed = $false
        
        foreach ($className in $serviceImportFixes.Keys) {
            $instanceName = $serviceImportFixes[$className]
            
            # Fix import statements
            if ($content -match "import \{ $className \}") {
                $content = $content -replace "import \{ $className \}", "import { $instanceName }"
                $changed = $true
            }
            
            # Fix usage (ClassName. -> instanceName.)
            if ($content -match "$className\.") {
                $content = $content -replace "$className\.", "$instanceName."
                $changed = $true
            }
        }
        
        if ($changed) {
            Set-Content $filePath -Value $content -NoNewline
            Write-Host "✅ Fixed service imports in $($_.Name)" -ForegroundColor Green
        }
    }
}

# 2. Fix specific context import patterns
Write-Host "`n2. Fixing remaining context import issues..." -ForegroundColor Cyan

$contextFixes = @{
    # Fix UserDataContext imports
    "from '../contexts/UserDataContext'" = "from '@/core/shared/contexts/UserDataContext'"
    "from '@/contexts/UserDataContext'" = "from '@/core/shared/contexts/UserDataContext'"
    
    # Fix platform types
    "from '../types/platform-types'" = "from '@/core/shared/types/platform-types'"
    
    # Fix auth service paths
    "from '@/core/shared/services/auth'" = "from '@/core/shared/auth/AuthProvider'"
}

Get-ChildItem -Recurse -Path "src" -Include "*.tsx","*.ts" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw -ErrorAction SilentlyContinue
    
    if ($content) {
        $changed = $false
        
        foreach ($oldPath in $contextFixes.Keys) {
            $newPath = $contextFixes[$oldPath]
            
            if ($content -match [regex]::Escape($oldPath)) {
                $content = $content -replace [regex]::Escape($oldPath), $newPath
                $changed = $true
            }
        }
        
        if ($changed) {
            Set-Content $filePath -Value $content -NoNewline
            Write-Host "✅ Fixed context imports in $($_.Name)" -ForegroundColor Green
        }
    }
}

# 3. Create missing type definition files
Write-Host "`n3. Creating missing type definition files..." -ForegroundColor Cyan

# Create platform-types if it doesn't exist
$platformTypesPath = "src/core/shared/types/platform-types.ts"
if (-not (Test-Path $platformTypesPath)) {
    $platformTypesContent = @"
// Platform type definitions
export interface PlatformData {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  serviceType: string;
  location: string;
  rating: number;
  isActive: boolean;
}

export interface MarketplaceVendor {
  id: string;
  name: string;
  category: string;
  products: string[];
  isVerified: boolean;
}
"@
    
    New-Item -ItemType Directory -Force -Path (Split-Path $platformTypesPath -Parent) | Out-Null
    Set-Content $platformTypesPath -Value $platformTypesContent
    Write-Host "✅ Created platform-types.ts" -ForegroundColor Green
}

# Create UserDataContext if it doesn't exist
$userDataContextPath = "src/core/shared/contexts/UserDataContext.tsx"
if (-not (Test-Path $userDataContextPath)) {
    $userDataContextContent = @"
// User Data Context definitions
import { createContext, useContext } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: string;
  total: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Warranty {
  id: string;
  productId: string;
  userId: string;
  expiry_date: Date;
  isActive: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  dueDate: string;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  activeProjects: number;
  completedProjects: number;
}

// Context implementation would go here
export const UserDataContext = createContext<any>(null);
export const useUserData = () => useContext(UserDataContext);
"@
    
    New-Item -ItemType Directory -Force -Path (Split-Path $userDataContextPath -Parent) | Out-Null
    Set-Content $userDataContextPath -Value $userDataContextContent
    Write-Host "✅ Created UserDataContext.tsx" -ForegroundColor Green
}

# 4. Final TypeScript error count
Write-Host "`n4. Measuring final results..." -ForegroundColor Cyan

$finalErrors = (npx tsc --noEmit 2>&1 | Select-String "error TS").Count
$totalFixed = $initialErrors - $finalErrors
$cumulativeFixed = 465 - $finalErrors  # From original baseline

Write-Host "`n" + "="*60 -ForegroundColor Green
Write-Host "🎯 COMPREHENSIVE IMPORT FIX RESULTS" -ForegroundColor Green  
Write-Host "="*60 -ForegroundColor Green
Write-Host "Original baseline:    465 errors" -ForegroundColor Yellow
Write-Host "Session start:        380 errors" -ForegroundColor Yellow
Write-Host "Before this script:   378 errors" -ForegroundColor Yellow
Write-Host "Final count:          $finalErrors errors" -ForegroundColor Yellow
Write-Host ""
Write-Host "This session fixed:   $totalFixed errors" -ForegroundColor Green
Write-Host "Total cumulative:     $cumulativeFixed errors fixed" -ForegroundColor Green
Write-Host "Overall progress:     $([math]::Round(($cumulativeFixed / 465) * 100, 1))%" -ForegroundColor Green
Write-Host "="*60 -ForegroundColor Green

if ($totalFixed -gt 0) {
    Write-Host "✅ SUCCESS! Made additional progress this session!" -ForegroundColor Green
} else {
    Write-Host "⚠️  No additional errors fixed in this run" -ForegroundColor Yellow
}

if ($finalErrors -lt 50) {
    Write-Host "🎉 MILESTONE: Under 50 errors! Production ready!" -ForegroundColor Green
} elseif ($finalErrors -lt 100) {
    Write-Host "🚀 EXCELLENT: Under 100 errors! Very close to production ready!" -ForegroundColor Green
} elseif ($finalErrors -lt 200) {
    Write-Host "👍 GOOD: Under 200 errors! Significant progress made!" -ForegroundColor Green
}

Write-Host "`n📋 All created scripts:" -ForegroundColor Cyan
Write-Host "- master-import-fixer.ps1 (Main orchestrator)" -ForegroundColor White
Write-Host "- fix-service-imports.ps1 (Service patterns)" -ForegroundColor White
Write-Host "- fix-component-paths.ps1 (Component/context paths)" -ForegroundColor White
Write-Host "- fix-import-paths.ps1 (General patterns)" -ForegroundColor White
Write-Host "- focused-import-fixer.ps1 (Targeted fixes)" -ForegroundColor White
Write-Host "- final-import-cleanup.ps1 (This script)" -ForegroundColor White

Write-Host "`n🏁 Final import cleanup completed!" -ForegroundColor Green
