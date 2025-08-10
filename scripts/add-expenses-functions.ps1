#!/usr/bin/env pwsh

# Add SQL functions to Supabase
Write-Host "Adding user expenses functions to Supabase..." -ForegroundColor Green

# Read the SQL file
$sqlContent = Get-Content -Path "database/user-expenses-functions.sql" -Raw

# Try to execute using psql if available
$env:PGPASSWORD = $env:SUPABASE_DB_PASSWORD
$dbUrl = $env:SUPABASE_DB_URL

if ($dbUrl) {
    Write-Host "Executing SQL using database URL..." -ForegroundColor Yellow
    $sqlContent | psql $dbUrl
} else {
    Write-Host "Database URL not found. Please run this SQL manually in your Supabase dashboard:" -ForegroundColor Red
    Write-Host $sqlContent -ForegroundColor Cyan
}

Write-Host "Done!" -ForegroundColor Green
