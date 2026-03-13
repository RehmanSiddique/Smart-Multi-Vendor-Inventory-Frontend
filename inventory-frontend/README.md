# Smart Multi-Vendor Inventory System — Frontend

A modern, responsive inventory management dashboard built with **React + Vite**. Supports multi-vendor SaaS architecture with real-time analytics, CRUD for all entities, and a premium UI design.

---

## 🚀 Tech Stack

| Layer       | Technology                     |
|-------------|-------------------------------|
| Framework   | React 18 + Vite                |
| Routing     | React Router v6                |
| HTTP Client | Axios                          |
| Charts      | Chart.js + react-chartjs-2     |
| Icons       | react-icons (Feather set)      |
| Styling     | Vanilla CSS + CSS variables    |

---

## 📁 Project Structure

```
inventory-frontend/
├── public/
├── src/
│   ├── components/        # Reusable UI components (Layout, Sidebar, Navbar)
│   ├── pages/             # One file per route
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── Sales.jsx
│   │   ├── Inventory.jsx
│   │   ├── Customers.jsx
│   │   ├── PurchaseOrders.jsx
│   │   ├── Suppliers.jsx
│   │   ├── Reports.jsx
│   │   ├── AnalyticsDashboard.jsx
│   │   └── ...
│   ├── services/
│   │   ├── api.js         # Core API service (auth, products, sales, inventory)
│   │   └── extendedApi.js # Extended API (analytics, customers, warehouses, bulk)
│   ├── styles/            # Global and component-level stylesheets
│   └── App.jsx            # Root router
├── .env.example
├── package.json
└── vite.config.js
```

---

## ⚡ Quick Setup

### 1. Install dependencies
```bash
cd inventory-frontend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Set VITE_API_URL to point to your backend
```

### 3. Start dev server
```bash
npm run dev
```

Available at `http://localhost:5173`

---

## 🛠️ Key Features

- **Authentication**: JWT-based login with protected routes
- **Dashboard**: Real-time stats — total products, low stock, today's revenue, recent sales
- **Analytics**: Charts for sales trends, revenue, category distribution, top products
- **Products**: Full CRUD with category, supplier association and stock tracking
- **Sales**: Create, view, and manage sales orders with inventory auto-adjustment
- **Purchase Orders**: Full receive workflow (receive all / receive individual items)
- **Customers**: Full CRUD with purchase history
- **Inventory**: Stock level monitoring with low stock and out-of-stock badges
- **Reports**: Time-range selectable charts (Daily / Weekly / Monthly / Yearly)

---

## 🌐 Environment Variables

| Variable      | Description                         | Default                    |
|---------------|-------------------------------------|----------------------------|
| VITE_API_URL  | Backend API base URL                | http://localhost:8000      |

---

## 📄 License

MIT
