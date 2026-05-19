# Frontend Cleanup Script
# Deletes ALL unused documentation and debug files
# Keeps ONLY essential project files

$frontendPath = "D:\All Projects\Projects\Django\Smart Multi Vendor Inventory\Frontend"

# Files to delete from Frontend root (ALL .md files except README.md)
$filesToDelete = @(
    "ADD_SAMPLE_DATA.md",
    "ALL_APIS_FIXED_FINAL.md",
    "ANALYTICS_VENDOR_ISSUE.md",
    "API_ENDPOINTS_FIXED.md",
    "AUTOMATED_IMPLEMENTATION_SUMMARY.md",
    "BACKEND_REGISTRATION_CODE.md",
    "CATEGORY_CREATION_FAILING.md",
    "CATEGORY_ID_26_ISSUE.md",
    "CATEGORY_PARENT_FIXED.md",
    "CHANGES_APPLIED.md",
    "CLEANUP_GUIDE.md",
    "CLEAR_CACHE_NOW.md",
    "COLOR_PALETTE_GUIDE.md",
    "CREATE_USER_MANUALLY.md",
    "DATABASE_EMPTY_FIX.md",
    "DESIGN_IMPROVEMENT_EXECUTIVE_SUMMARY.md",
    "DESIGN_IMPROVEMENT_GUIDE.md",
    "DESIGN_TRANSFORMATION_SUMMARY.md",
    "FINAL_CATEGORY_FIX.md",
    "GITHUB_QUICK_REFERENCE.md",
    "GITHUB_SECURITY_GUIDE.md",
    "IMPLEMENTATION_CHECKLIST.md",
    "MODERN_DESIGN_README.md",
    "QUICK_FIX.md",
    "QUICK_START_MODERN_DESIGN.md",
    "REGISTRATION_FIX.md",
    "REGISTRATION_IMPLEMENTED.md",
    "TESTING_GUIDE.md",
    "TROUBLESHOOTING_DASHBOARD.md",
    "VENDOR_FIX.md",
    "package-lock.json",
    "package.json"
)

Write-Host "`n🗑️  Frontend Cleanup Script" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray
Write-Host "`nDeleting unused documentation files...`n" -ForegroundColor Yellow

$deletedCount = 0

# Delete files from Frontend root
foreach ($file in $filesToDelete) {
    $filePath = Join-Path $frontendPath $file
    if (Test-Path $filePath) {
        try {
            Remove-Item $filePath -Force
            Write-Host "✓ Deleted: $file" -ForegroundColor Green
            $deletedCount++
        } catch {
            Write-Host "✗ Failed to delete: $file" -ForegroundColor Red
        }
    }
}

# Delete files from inventory-frontend
$inventoryPath = Join-Path $frontendPath "inventory-frontend"
$inventoryFiles = @("COMPLETE_SUMMARY.md", "FRONTEND_IMPLEMENTATION.md", "QUICK_REFERENCE.md")

foreach ($file in $inventoryFiles) {
    $filePath = Join-Path $inventoryPath $file
    if (Test-Path $filePath) {
        try {
            Remove-Item $filePath -Force
            Write-Host "✓ Deleted: inventory-frontend/$file" -ForegroundColor Green
            $deletedCount++
        } catch {
            Write-Host "✗ Failed to delete: inventory-frontend/$file" -ForegroundColor Red
        }
    }
}

Write-Host "`n" + "=" * 50 -ForegroundColor Gray
Write-Host "✨ Cleanup complete!" -ForegroundColor Cyan
Write-Host "📊 Total files deleted: $deletedCount" -ForegroundColor Green
Write-Host "`nKeeping ONLY essential files:" -ForegroundColor Yellow
Write-Host "  ✓ README.md (main documentation)" -ForegroundColor White
Write-Host "  ✓ .env.example (environment template)" -ForegroundColor White
Write-Host "  ✓ .gitignore (git rules)" -ForegroundColor White
Write-Host "  ✓ inventory-frontend/ (React application)" -ForegroundColor White
Write-Host "  ✓ cleanup.ps1 (this script)" -ForegroundColor White
Write-Host "`n"
