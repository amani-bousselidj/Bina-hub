# Master Import Fixer Script
# Runs all import path fixes in the correct order and measures progress

Write-Host "=== Master TypeScript Import Fixer ===" -ForegroundColor Green
Write-Host "Running comprehensive import path fixes based on TypeScript compilation errors" -ForegroundColor Yellow

# Get initial error count
Write-Host "`n📊 Getting baseline error count..." -ForegroundColor Cyan
$initialErrors = (npx tsc --noEmit 2>&1 | Select-String "error TS").Count
Write-Host "Initial TypeScript errors: $initialErrors" -ForegroundColor Yellow

# 1. Run service import fixes first
Write-Host "`n🔧 Step 1: Fixing service import patterns..." -ForegroundColor Cyan
& "$PSScriptRoot\fix-service-imports.ps1"

# 2. Run component and context path fixes
Write-Host "`n🔧 Step 2: Fixing component and context paths..." -ForegroundColor Cyan  
& "$PSScriptRoot\fix-component-paths.ps1"

# 3. Run general import path fixes
Write-Host "`n🔧 Step 3: Running general import path fixes..." -ForegroundColor Cyan
& "$PSScriptRoot\fix-import-paths.ps1"

# 4. Additional specific fixes based on common patterns
Write-Host "`n🔧 Step 4: Additional pattern-based fixes..." -ForegroundColor Cyan

# Fix Input component casing issues (if any remain)
Get-ChildItem -Recurse -Path "src" -Include "*.tsx","*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "from '@/components/ui/input'") {
        $newContent = $content -replace "from '@/components/ui/input'", "from '@/components/ui/Input'"
        Set-Content $_.FullName -Value $newContent -NoNewline
        Write-Host "✅ Fixed Input casing in $($_.Name)" -ForegroundColor Green
    }
}

# Fix auth service imports
Get-ChildItem -Recurse -Path "src" -Include "*.tsx","*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "from '@/core/shared/services/auth'") {
        $newContent = $content -replace "from '@/core/shared/services/auth'", "from '@/core/shared/auth/AuthProvider'"
        Set-Content $_.FullName -Value $newContent -NoNewline
        Write-Host "✅ Fixed auth import in $($_.Name)" -ForegroundColor Green
    }
}

# 5. Get final error count and calculate improvement
Write-Host "`n📊 Measuring results..." -ForegroundColor Cyan
Start-Sleep -Seconds 2  # Give file system time to update

$finalErrors = (npx tsc --noEmit 2>&1 | Select-String "error TS").Count
$errorsFixed = $initialErrors - $finalErrors
$percentageImprovement = if ($initialErrors -gt 0) { [math]::Round(($errorsFixed / $initialErrors) * 100, 1) } else { 0 }

# Display results
Write-Host "`n" + "="*50 -ForegroundColor Green
Write-Host "🎯 IMPORT FIX RESULTS" -ForegroundColor Green
Write-Host "="*50 -ForegroundColor Green
Write-Host "Initial errors:     $initialErrors" -ForegroundColor Yellow
Write-Host "Final errors:       $finalErrors" -ForegroundColor Yellow  
Write-Host "Errors fixed:       $errorsFixed" -ForegroundColor Green
Write-Host "Improvement:        $percentageImprovement%" -ForegroundColor Green
Write-Host "="*50 -ForegroundColor Green

if ($errorsFixed -gt 0) {
    Write-Host "✅ SUCCESS! Reduced TypeScript errors by $errorsFixed ($percentageImprovement%)" -ForegroundColor Green
    
    if ($finalErrors -gt 0) {
        Write-Host "`n🔍 To see remaining errors, run:" -ForegroundColor Cyan
        Write-Host "npx tsc --noEmit | Select-Object -First 20" -ForegroundColor White
    } else {
        Write-Host "`n🎉 ALL TYPESCRIPT ERRORS FIXED!" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  No errors were fixed. Manual investigation needed." -ForegroundColor Yellow
    Write-Host "Run 'npx tsc --noEmit | Select-Object -First 10' to see current errors" -ForegroundColor White
}

Write-Host "`n📁 Generated fix scripts in scripts/ directory:" -ForegroundColor Cyan
Write-Host "- fix-service-imports.ps1 (Service export patterns)" -ForegroundColor White
Write-Host "- fix-component-paths.ps1 (Component/context paths)" -ForegroundColor White  
Write-Host "- fix-import-paths.ps1 (General import fixes)" -ForegroundColor White

Write-Host "`n🏁 Master import fixer completed!" -ForegroundColor Green
