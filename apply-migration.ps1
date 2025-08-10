# Script to apply the authenticated checkout migration
# You'll need to run this manually in your Supabase SQL editor

Write-Host "=== AUTHENTICATED CHECKOUT MIGRATION ===" -ForegroundColor Green
Write-Host "Please copy and paste the following SQL into your Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host ""

$sqlContent = Get-Content "database/migrations/20250810_authenticated_checkout_expenses.sql" -Raw
Write-Host $sqlContent -ForegroundColor Cyan

Write-Host ""
Write-Host "=== INSTRUCTIONS ===" -ForegroundColor Green
Write-Host "1. Go to your Supabase Dashboard" -ForegroundColor White
Write-Host "2. Navigate to SQL Editor" -ForegroundColor White  
Write-Host "3. Copy and paste the SQL code above" -ForegroundColor White
Write-Host "4. Execute the SQL" -ForegroundColor White
Write-Host "5. Test the authenticated checkout functionality" -ForegroundColor White

Read-Host "Press Enter to continue..."
