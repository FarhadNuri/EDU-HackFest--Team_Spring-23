# HarvestGuard 🌾

A comprehensive food loss prevention platform built with React, Vite, and Tailwind CSS. HarvestGuard helps farmers monitor crop storage conditions, receive alerts, and reduce post-harvest losses.

## Features

### 🏠 Homepage
- Dynamic background carousel with farming imagery
- Bilingual content (English/Bengali)
- Animated workflow visualization (Data → Warning → Action → Saved Food)
- Interactive supply chain stages
- Responsive design for all devices

### 🔐 Authentication
- Login and Signup modals
- Social login options (Google, Facebook)
- Bilingual forms
- Development bypass for testing

### 📊 Dashboard
- Welcome section with user greeting
- Real-time statistics (Total Crops, Active Alerts, Storage Usage, Success Rate)
- Quick action buttons
- Recent crops list with status indicators
- Profile management

### 🌱 Crop Management
- **Crop Registration**: Add new crops with details (type, variety, quantity, harvest date, storage info)
- **Crop Details**: View comprehensive information about each crop including storage conditions and timeline
- Click on any crop to view detailed information

### 🔔 Alerts & Notifications
- Real-time storage condition alerts
- Priority-based categorization (High, Medium, Low)
- Temperature and humidity warnings
- Actionable notifications with dismiss options
- Bilingual alert messages

### 📈 Analytics
- Performance metrics dashboard
- Crop distribution visualization
- Monthly performance charts
- Success/loss rate tracking
- Key insights and recommendations
- Time range filters (Week, Month, Year)

### 👤 Profile Management
- User information display and editing
- Farm details management
- Statistics overview
- Avatar display

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

## Project Structure

```
src/
├── components/
│   ├── AnimatedSupplyChain.jsx  # Supply chain visualization
│   ├── WorkflowCard.jsx          # Workflow step cards
│   ├── Login.jsx                 # Login modal
│   ├── Signup.jsx                # Signup modal
│   ├── CropRegistration.jsx     # Crop registration form
│   ├── CropDetails.jsx           # Detailed crop view
│   ├── Profile.jsx               # User profile
│   ├── Alerts.jsx                # Alerts & notifications
│   └── Analytics.jsx             # Analytics dashboard
├── pages/
│   ├── Homepage.jsx              # Landing page
│   └── Dashboard.jsx             # Main dashboard
├── App.jsx                       # Main app component
├── main.jsx                      # Entry point
└── index.css                     # Global styles
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

## Development Notes

- Authentication is bypassed for development (click "Continue as Guest")
- All modals are responsive and mobile-friendly
- Bilingual support (English/Bengali) throughout the app
- Smooth animations and transitions
- Click-outside-to-close modal functionality

## Future Enhancements

- Backend integration for data persistence
- Real IoT sensor integration
- SMS/Email alert notifications
- Advanced analytics with ML predictions
- Multi-language support expansion
- Export reports functionality
