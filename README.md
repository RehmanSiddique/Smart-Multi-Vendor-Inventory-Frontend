# Smart Multi-Vendor Inventory Management System - Frontend

A modern, responsive React-based frontend for the Smart Multi-Vendor Inventory Management System. Built with React 19, Vite, and professional UI components.

## 🚀 Features

### Core Functionality
- **Dashboard**: Real-time analytics and key metrics
- **Product Management**: Complete CRUD operations with advanced filtering
- **Category Management**: Hierarchical category structure with tree view
- **Supplier Management**: Comprehensive supplier database with contact management
- **Purchase Orders**: Advanced order management with status tracking
- **Sales Management**: Transaction recording and sales analytics
- **Inventory Tracking**: Real-time stock levels and low stock alerts

### Extended Features
- **Analytics Dashboard**: Professional charts and data visualization
- **Customer Management**: Customer database and relationship management
- **Warehouse Management**: Multi-location inventory tracking
- **Promotions**: Discount and promotion management
- **Bulk Operations**: Mass data operations and imports
- **Reports**: Comprehensive reporting with animated charts (daily, weekly, monthly, yearly)

### Technical Features
- **Responsive Design**: Mobile-first approach with professional UI
- **Real-time Updates**: Live data synchronization
- **Advanced Search & Filtering**: Powerful search capabilities
- **Export Functionality**: Data export in multiple formats
- **Professional Charts**: Animated charts using Chart.js
- **Modern Authentication**: JWT-based secure authentication
- **Error Handling**: Comprehensive error management
- **Loading States**: Professional loading indicators

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Charts**: Chart.js with react-chartjs-2
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Emoji-based icon system

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/RehmanSiddique/Smart-Multi-Vendor-Inventory-Frontend.git
   cd Smart-Multi-Vendor-Inventory-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_APP_NAME=Inventory Management System
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout wrapper
│   └── Layout.css      # Layout styles
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Products.jsx    # Product management
│   ├── Categories.jsx  # Category management
│   ├── Suppliers.jsx   # Supplier management
│   ├── Reports.jsx     # Analytics and reports
│   └── ...            # Other pages
├── services/           # API services
│   └── api.js         # Axios configuration and API calls
├── styles/            # Global styles
│   └── main.css       # Main stylesheet
└── App.jsx            # Root component with routing
```

## 🎨 UI/UX Features

### Design System
- **Modern Color Palette**: Professional blue and green theme
- **Typography**: Inter and Poppins fonts for readability
- **Consistent Spacing**: CSS Grid and Flexbox layouts
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Breakpoints**: Mobile, tablet, and desktop optimized

### Interactive Elements
- **Hover Effects**: Subtle animations on interactive elements
- **Loading States**: Professional spinners and skeleton screens
- **Form Validation**: Real-time validation with error states
- **Status Indicators**: Color-coded badges and status displays
- **Action Buttons**: Contextual actions with icon support

## 📊 Charts and Analytics

The Reports page features professional animated charts:

- **Line Charts**: Sales trends over time
- **Bar Charts**: Revenue analysis
- **Doughnut Charts**: Category distribution
- **Performance Metrics**: Custom progress indicators
- **Time Range Selection**: Daily, weekly, monthly, yearly views
- **Real-time Updates**: Charts automatically update with new data

## 🔐 Authentication

- **JWT Token Management**: Secure token storage and refresh
- **Protected Routes**: Route-level authentication guards
- **Auto-logout**: Automatic logout on token expiration
- **Login/Register**: Complete authentication flow

## 🌐 API Integration

### Endpoints Covered
- Authentication (login, register, refresh)
- Products (CRUD, inventory, low stock)
- Categories (CRUD, tree structure)
- Suppliers (CRUD, purchase orders)
- Purchase Orders (CRUD, receiving)
- Sales (CRUD, analytics)
- Reports (dashboard, analytics)

### Error Handling
- Network error detection
- Token refresh automation
- User-friendly error messages
- Retry mechanisms

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Enhanced tablet experience
- **Desktop**: Full-featured desktop interface
- **Touch Friendly**: Large touch targets for mobile
- **Keyboard Navigation**: Full keyboard accessibility

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Efficient image handling
- **Bundle Optimization**: Vite's optimized bundling
- **Caching**: Intelligent API response caching
- **Minimal Dependencies**: Lightweight package selection

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration for code quality
- Consistent naming conventions
- Component-based architecture
- Modular CSS organization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: [Your Email]
- Documentation: [Link to docs]

## 🔗 Related Repositories

- **Backend API**: [Smart-Multi-Vendor-Inventory-API](https://github.com/RehmanSiddique/Smart-Multi-Vendor-Inventory-API)

## 📈 Roadmap

- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced reporting features
- [ ] Mobile app version
- [ ] Real-time notifications
- [ ] Advanced user permissions

---

**Built with ❤️ using React and modern web technologies**