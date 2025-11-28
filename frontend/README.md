# HarvestGuard 🌾

A comprehensive food loss prevention platform built with React, Vite, and Tailwind CSS. HarvestGuard helps Bangladeshi farmers monitor crop storage conditions, receive AI-powered alerts, and reduce post-harvest losses through real-time monitoring and predictive analytics.

## 🌟 Features

### 🏠 Homepage
- **Hero Section**: Dynamic background carousel with farming imagery
- **Supply Chain Visualization**: Interactive "Where Food Loss Happens" animation
- **About Us Section**: Mission, Vision, Our Story, and Impact Statistics
- **Features Showcase**: 6 key features with detailed descriptions
- **Contact Section**: Contact form and information cards
- **Bilingual Support**: Full English/Bengali language toggle
- **Scroll Animations**: Smooth fade-in effects on scroll
- **Responsive Design**: Mobile-first approach for all devices

### 📄 Dedicated Pages
- **About Us**: Separate page with detailed company information, team, and impact metrics
- **Features**: Comprehensive feature list with "Sign In Required" notice
- **Contact**: Contact form, information cards, and map placeholder
- All pages feature consistent white-greenish gradient backgrounds

### 🔐 Authentication System
- **Login Modal**: Email/password authentication with demo credentials
- **Mock Authentication**: Test with demo@harvestguard.com / demo123
- **Social Login Options**: Google and Facebook integration ready
- **Signup Modal**: User registration with bilingual forms
- **Error Handling**: Clear error messages for invalid credentials
- **Remember Me**: Session persistence option

### 📊 Dashboard
- **Welcome Section**: Personalized user greeting in both languages
- **Real-time Statistics**: 
  - Total Crops (12)
  - Active Alerts (3)
  - Storage Usage (68%)
  - Success Rate (95%)
- **Quick Actions**: 6 action buttons for common tasks
  - Register New Crop
  - View Analytics
  - View Alerts
  - Weather Forecast
  - Risk Prediction
  - Health Scanner
- **Recent Crops List**: Status indicators and quick access
- **Profile Management**: User settings and farm details
- **Language Toggle**: Switch between English and Bengali

### 🌱 Crop Management
- **Crop Registration**: 
  - Crop type and variety selection
  - Quantity and unit specification
  - Harvest date picker
  - Storage location and type
  - Expected storage duration
  - Additional notes
- **Crop Details Modal**: 
  - Comprehensive crop information
  - Storage conditions display
  - Timeline visualization
  - Status indicators
- **Crop Health Scanner**: AI-powered image recognition for disease detection

### 🔔 Alerts & Notifications
- **Real-time Monitoring**: Temperature, humidity, and storage conditions
- **Priority Levels**: High, Medium, Low categorization
- **Alert Types**:
  - Temperature warnings
  - Humidity alerts
  - Storage condition notifications
  - Weather-based alerts
- **Actionable Notifications**: Dismiss and action buttons
- **Bilingual Messages**: All alerts in English and Bengali

### 📈 Analytics Dashboard
- **Performance Metrics**:
  - Total crops and quantity tracking
  - Success and loss rate analysis
  - Average storage duration
  - Crop distribution charts
- **Visualizations**:
  - Monthly performance trends
  - Crop type distribution
  - Success/loss comparison
- **Time Range Filters**: Week, Month, Year views
- **Key Insights**: AI-generated recommendations
- **Export Ready**: Data export functionality prepared

### 🌤️ Weather Integration
- **5-Day Forecast**: Local weather predictions
- **Temperature & Humidity**: Real-time conditions
- **Weather Alerts**: Storm and extreme weather warnings
- **Bilingual Display**: Weather information in both languages

### 🎯 Risk Prediction
- **ETCL Calculation**: Expected Time to Critical Loss
- **AI Predictions**: Machine learning-based risk assessment
- **Recommendations**: Actionable steps to prevent loss
- **Risk Levels**: Visual indicators for different risk categories

### 👤 Profile Management
- **User Information**: Name, email, phone, location
- **Farm Details**: Farm size, crop types, experience
- **Statistics Overview**: Personal performance metrics
- **Avatar Display**: User profile picture
- **Edit Functionality**: Update profile information

### 🦶 Footer (Persistent)
- **Brand Section**: Logo and tagline
- **Quick Links**: Navigation to all pages
- **Features List**: Quick overview
- **Contact Info**: Address, email, phone with icons
- **Social Media**: Facebook, Twitter, Instagram links
- **Copyright**: Bilingual copyright notice
- **Appears on All Pages**: Consistent across the entire app

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation (if needed)

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── AnimatedSupplyChain.jsx   # Supply chain visualization with animations
│   ├── WorkflowCard.jsx          # Workflow step cards
│   ├── Login.jsx                 # Login modal with mock auth
│   ├── Signup.jsx                # Signup modal
│   ├── CropRegistration.jsx     # Crop registration form
│   ├── CropDetails.jsx           # Detailed crop view modal
│   ├── Profile.jsx               # User profile management
│   ├── Alerts.jsx                # Alerts & notifications system
│   ├── Analytics.jsx             # Analytics dashboard with charts
│   ├── Weather.jsx               # Weather forecast component
│   ├── RiskPrediction.jsx        # ETCL and risk assessment
│   ├── CropHealthScanner.jsx    # AI-powered crop health detection
│   └── Footer.jsx                # Persistent footer component
├── pages/
│   ├── Homepage.jsx              # Landing page with all sections
│   ├── Dashboard.jsx             # Main dashboard (authenticated)
│   ├── AboutUs.jsx               # About Us page
│   ├── Features.jsx              # Features page
│   └── Contact.jsx               # Contact page
├── context/
│   └── LanguageContext.jsx       # Language state management
├── App.jsx                       # Main app with routing
├── main.jsx                      # Entry point
└── index.css                     # Global styles with animations
```

## Features in Detail

### Crop Registration
Register crops with:
- Crop type and variety
- Quantity and unit
- Harvest date
- Storage location and type
- Expected storage duration
- Additional notes

### Alerts System
Monitor:
- Temperature alerts
- Humidity checks
- Storage condition status
- Real-time notifications

### Analytics Dashboard
Track:
- Total crops and quantity
- Success and loss rates
- Average storage duration
- Crop distribution
- Monthly performance trends

## 🔑 Demo Credentials

For testing the application, use these mock credentials:

- **Email**: `demo@harvestguard.com`
- **Password**: `demo123`

Alternative test accounts:
- `farmer@harvestguard.com` / `password123`
- `test@test.com` / `test123`

## 🎨 Design Features

- **Consistent Color Scheme**: White-greenish gradients throughout
- **Smooth Animations**: Fade-in, slide-in, and scale effects
- **Scroll-Triggered Animations**: Content appears as you scroll
- **Responsive Design**: Mobile-first approach
- **Bilingual UI**: Seamless English/Bengali switching
- **Accessibility**: ARIA labels and keyboard navigation
- **Modern UI**: Clean, professional interface

## 🌐 Language Support

The app supports full bilingual functionality:
- **English**: Default language
- **Bengali (বাংলা)**: Complete translation
- **Toggle Button**: Easy language switching in header
- **Persistent Selection**: Language preference maintained across pages
- **Context API**: Centralized language management

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components are fully responsive and tested across devices.

## 🚀 Development Notes

- **Mock Authentication**: Login system uses client-side validation
- **No Backend Required**: All data is mock/static for demo purposes
- **Modals**: Click-outside-to-close functionality
- **Smooth Scrolling**: Auto-scroll to top on page navigation
- **Intersection Observer**: Used for scroll animations
- **Tailwind CSS**: Utility-first styling approach
- **Component-Based**: Modular and reusable components

## 🔄 Navigation Flow

```
Homepage (Landing)
├── Hero Section
├── Supply Chain Animation
├── About Us Content
├── Features Content
└── Contact Content

Separate Routes:
├── /about → About Us Page
├── /features → Features Page (with sign-in notice)
├── /contact → Contact Page
└── /dashboard → Dashboard (requires login)

Dashboard (Authenticated):
├── Statistics Overview
├── Quick Actions
├── Recent Crops
└── Modals:
    ├── Crop Registration
    ├── Crop Details
    ├── Profile
    ├── Alerts
    ├── Analytics
    ├── Weather
    ├── Risk Prediction
    └── Health Scanner
```

## 🛠️ Future Enhancements

### Phase 1 (Backend Integration)
- [ ] Real authentication with JWT
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] API endpoints for CRUD operations
- [ ] User session management

### Phase 2 (IoT Integration)
- [ ] Real IoT sensor data integration
- [ ] WebSocket for real-time updates
- [ ] MQTT protocol for sensor communication
- [ ] Historical data storage and retrieval

### Phase 3 (Advanced Features)
- [ ] SMS/Email alert notifications
- [ ] Advanced analytics with ML predictions
- [ ] Export reports (PDF/Excel)
- [ ] Multi-farm management
- [ ] Team collaboration features
- [ ] Mobile app (React Native)

### Phase 4 (AI/ML)
- [ ] Crop disease detection with TensorFlow
- [ ] Predictive analytics for harvest timing
- [ ] Weather-based risk modeling
- [ ] Automated recommendations engine

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

HarvestGuard is built to help Bangladeshi farmers reduce post-harvest food loss and ensure food security.

---

**Built with ❤️ for Bangladeshi Farmers**
