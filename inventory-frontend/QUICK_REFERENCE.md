# 🚀 Quick Reference Card

## Start Everything

```bash
# Backend (4 terminals)
cd "D:\All Projects\Projects\Django\Smart Multi-Vendor Inventory API"
python manage.py runserver                    # Terminal 1
celery -A config worker --pool=solo -l info   # Terminal 2
celery -A config beat -l info                 # Terminal 3
redis-server --port 6380                      # Terminal 4

# Frontend (1 terminal)
cd "D:\All Projects\Projects\Django\React\inventory-frontend"
npm run dev
```

## URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api/v1/
- **Admin:** http://localhost:8000/admin

## New Frontend Pages

| Page | URL | Description |
|------|-----|-------------|
| Analytics | `/analytics` | Business metrics dashboard |
| Customers | `/customers` | Customer management |
| Bulk Ops | `/bulk-operations` | Import/Export |
| Promotions | `/promotions` | Discounts & promos |
| Warehouses | `/warehouses` | Warehouse management |

## API Service Usage

```javascript
// Import services
import { 
  analyticsAPI, 
  customerAPI, 
  bulkAPI, 
  promotionAPI, 
  warehouseAPI 
} from '../services/extendedApi';

// Get analytics
const metrics = await analyticsAPI.getDashboard(30);

// Get customers
const customers = await customerAPI.getAll();

// Import products
await bulkAPI.importProducts(file);

// Export products
const blob = await bulkAPI.exportProducts();

// Create promotion
await promotionAPI.create(data);

// Create warehouse
await warehouseAPI.create(data);
```

## CSV Formats

### Products Import
```csv
name,sku,category,price,cost,quantity,reorder_level,barcode,is_active
Widget A,WID-001,Electronics,99.99,50.00,100,10,123456789,true
```

### Customers Import
```csv
name,email,phone,customer_type,address_line1,city,state,postal_code,country
John Doe,john@example.com,555-1234,retail,123 Main St,New York,NY,10001,USA
```

## File Locations

### Frontend
```
src/
├── services/extendedApi.js          # NEW API services
├── pages/
│   ├── AnalyticsDashboard.jsx       # NEW
│   ├── Customers.jsx                # NEW
│   ├── BulkOperations.jsx           # NEW
│   ├── Promotions.jsx               # NEW
│   └── Warehouses.jsx               # NEW
├── components/Sidebar.jsx           # UPDATED
└── App.jsx                          # UPDATED
```

### Backend
```
apps/inventory/
├── models_extended.py               # NEW models
├── serializers_extended.py          # NEW serializers
├── views_extended.py                # NEW views
├── urls_extended.py                 # NEW routes
├── analytics.py                     # NEW service
├── bulk_operations.py               # NEW service
├── notifications.py                 # NEW service
└── tasks.py                         # NEW Celery tasks
```

## Common Commands

```bash
# Backend migrations
python manage.py makemigrations
python manage.py migrate --skip-checks

# Create superuser
python manage.py createsuperuser

# Frontend
npm install                          # Install dependencies
npm run dev                          # Start dev server
npm run build                        # Build for production
```

## Test Credentials

```
Email: admin@acme.com
Password: [your password]
Subdomain: acme
```

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Re-login to get new token |
| CORS Error | Backend already configured for localhost:5173 |
| Import fails | Check CSV format matches template |
| Page not found | Ensure backend is running |
| Celery not working | Check Redis is running on port 6380 |

## Feature Checklist

- [x] Analytics Dashboard
- [x] Customer Management
- [x] Bulk Import/Export
- [x] Promotions
- [x] Warehouses
- [ ] Product Variants (API ready)
- [ ] Returns/Refunds (API ready)
- [ ] Webhooks (API ready)
- [ ] Audit Logs (API ready)

## Documentation Files

1. `COMPLETE_SUMMARY.md` - Overall summary
2. `FRONTEND_IMPLEMENTATION.md` - Frontend details
3. `EXTENDED_FEATURES.md` - Backend features (in Django project)
4. `API_TESTING_GUIDE.md` - API testing (in Django project)
5. `QUICK_START.md` - Setup guide (in Django project)

## Support

- Backend docs: `Smart Multi-Vendor Inventory API/DOCUMENTATION_INDEX.md`
- Frontend docs: `inventory-frontend/FRONTEND_IMPLEMENTATION.md`
- API docs: http://localhost:8000/api/docs/ (if configured)

---

**Quick Start:** Run all 5 terminals → Open http://localhost:5173 → Login → Test features! 🚀
