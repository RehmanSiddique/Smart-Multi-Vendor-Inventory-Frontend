import os

backend_root = r"d:\All Projects\Projects\Django\Latest working\Backend"
frontend_root = r"d:\All Projects\Projects\Django\Latest working\Frontend\inventory-frontend"

backend_files_to_delete = [
    "debug_api.py", "debug_categories.py", "debug_category_mismatch.py",
    "debug_filter.py", "debug_sales.py", "debug_vendor_categories.py",
    "deep_analysis.py", "comprehensive_check.py",
    "check_customers.py", "check_db_state.py", "check_tenancy_data.py", "check_users_vendors.py",
    "MANUAL_TEST.py", "final_test.py", "quick_test.py", "simple_test_po.py",
    "test_api.py", "test_api_categories.py", "test_api_data.py", "test_auth_creds.py",
    "test_backend.py", "test_dashboard_data.py", "test_frontend.py", "test_inventory.py",
    "test_phase6.py", "test_po_update.py", "test_product_creation.py", "test_purchase_orders.py",
    "test_sale_with_items.py", "test_sales_api.py", "test_system.py", "verify_system.py",
    "frontend_diagnostic.py", "frontend_debug_guide.py", "frontend_fix_exact.js", "frontend_fixes.js",
    "fix_orphaned_data.py", "add_sample_data.py", "create_dashboard_data.py", "create_products.py",
    "clear_customers.py", "seed_customers.py", "seed_data.py", "set_password.py", "get_beta_ids.py",
    "DASHBOARD_TEST_RESULTS.md", "FILTER_FIX_INSTRUCTIONS.md", "FINAL_SUMMARY.md",
    "FIXES_COMPLETE.md", "IMPLEMENTATION_SUMMARY.md", "MIGRATION_FIX.md",
    "PRODUCTS_NOT_SHOWING_FIXED.md", "START_HERE.md",
    "setup_extended.bat",
]

frontend_files_to_delete = [
    "COMPLETE_SUMMARY.md", "FRONTEND_IMPLEMENTATION.md", "QUICK_REFERENCE.md",
]

print("="*60)
print("BACKEND CLEANUP")
print("="*60)
deleted_count = 0
for f in backend_files_to_delete:
    p = os.path.join(backend_root, f)
    if os.path.exists(p):
        os.remove(p)
        print(f"  [DELETED] {f}")
        deleted_count += 1
    else:
        print(f"  [SKIP]    {f}")
print(f"\nBackend: {deleted_count} file(s) deleted.")

print("\n" + "="*60)
print("FRONTEND CLEANUP")
print("="*60)
fe_deleted = 0
for f in frontend_files_to_delete:
    p = os.path.join(frontend_root, f)
    if os.path.exists(p):
        os.remove(p)
        print(f"  [DELETED] {f}")
        fe_deleted += 1
    else:
        print(f"  [SKIP]    {f}")
print(f"\nFrontend: {fe_deleted} file(s) deleted.")
print("\nCleanup complete!")
