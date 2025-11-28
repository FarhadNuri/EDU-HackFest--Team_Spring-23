# 🌾 HarvestGuard - Smart Crop Management System

**A comprehensive farmer and crop management system with offline-first architecture, designed for rural Bangladesh.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### A2: Farmer & Crop Management
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 👤 **Bilingual Profiles** - Toggle between Bangla and English
- 🌾 **Crop Batch Registration** - Register crops with detailed information
- 💾 **Offline Registration** - Register crops without internet connection
- 🔄 **Auto Sync** - Automatic synchronization when online
- 📊 **Data Export** - Export crop data as CSV or JSON

### A3: Hyper-Local Weather Integration
- 🌍 **Location-Based Weather** - 64 districts, 544 upazilas from CSV
- ⚡ **Redis Caching** - 95% reduction in API calls (4-hour cache)
- 📱 **Offline Weather Access** - View weather data without internet
- 🇧🇩 **Bangla Advisories** - 20+ context-aware farming recommendations
- 🌦️ **5-Day Forecast** - Detailed weather predictions
- 📍 **OpenWeatherMap Integration** - Real-time weather data

### A4: Risk Prediction & Forecasting
- 🎯 **ETCL Calculation** - Estimated Time to Critical Loss
- 📈 **Mock Sensor Data** - Temperature, moisture, humidity tracking
- 🔮 **Weather Integration** - 7-day forecast analysis
- 🏭 **Storage Factors** - Consider storage type in predictions
- 💨 **Multi-Layer Caching** - In-memory + Redis + LocalStorage
- 📋 **Risk Summaries** - Human-readable recommendations

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5
- **Database**: MongoDB Atlas
- **Caching**: Redis (Upstash)
- **Authentication**: JWT + bcryptjs
- **API Integration**: OpenWeatherMap API
- **File Processing**: CSV parsing

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3.4
- **State Management**: Context API
- **HTTP Client**: Axios
- **Routing**: React Router 7

### DevOps
- **Deployment**: Render
- **Version Control**: Git/GitHub
- **Environment**: dotenv

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account
- Upstash Redis account
- OpenWeather API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FarhadNuri/EDU-HackFest--Team_Spring-23.git
   cd EDU-HackFest--Team_Spring-23
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (backend + frontend)
   npm run install:all
   
   # Or install separately
   npm run install:backend
   npm run install:frontend
   ```

3. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/harvestguard
   JWT_SECRET=your_super_secret_jwt_key_here
   OPENWEATHER_API_KEY=your_openweather_api_key
   UPSTASH_REDIS_URL=redis://:password@endpoint.upstash.io:port
   PORT=5000
   NODE_ENV=development
   ```

   **Frontend** (`frontend/.env`):
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the application**

   **Development mode** (both backend and frontend):
   ```bash
   npm run dev
   ```

   **Or run separately**:
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend

   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

---

## 🌐 Deployment

### Deploy to Render

See [README_DEPLOYMENT.md](./README_DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**

1. Push to GitHub
2. Connect to Render
3. Add environment variables
4. Deploy automatically

**Environment Variables Required:**
- `MONGODB_URI`
- `JWT_SECRET`
- `OPENWEATHER_API_KEY`
- `UPSTASH_REDIS_URL`
- `NODE_ENV=production`
- `PORT` (auto-assigned by Render)

---

## 📁 Project Structure

```
EDU-HackFest--Team_Spring-23/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Custom middlewares
│   │   ├── lib/              # Utilities (Redis, DB, etc.)
│   │   └── server.js         # Entry point
│   ├── db_geocode.csv        # Upazila geocoding data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # Context providers
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   └── package.json
├── render.yaml               # Render deployment config
├── .env.example              # Environment template
├── README_DEPLOYMENT.md      # Deployment guide
└── package.json              # Root package
```

---

## 📚 API Documentation

### Authentication
```
POST   /api/auth/signup       - Register new user
POST   /api/auth/login        - Login user
POST   /api/auth/logout       - Logout user
GET    /api/auth/check        - Check auth status
```

### Profile
```
GET    /api/profile/:id       - Get user profile
PUT    /api/profile/:id       - Update profile
```

### Crop Management
```
POST   /api/crop/reg-batch    - Register crop batch
GET    /api/crop/list         - Get all crops
GET    /api/crop/:id          - Get crop by ID
PUT    /api/crop/:id          - Update crop
DELETE /api/crop/:id          - Delete crop
```

### Weather
```
GET    /api/weather/forecast  - Get weather forecast
GET    /api/weather/advisory  - Get weather advisories
GET    /api/weather/districts - Get all districts
PUT    /api/weather/location  - Update user location
```

### Predictions
```
GET    /api/prediction/crop/:id      - Get crop prediction
GET    /api/prediction/all           - Get all predictions
GET    /api/prediction/analytics/:id - Get crop analytics
```

### Export & Sync
```
GET    /api/export?format=csv    - Export data as CSV
GET    /api/export?format=json   - Export data as JSON
POST   /api/sync/offline         - Sync offline data
```

---

## 🎯 Key Features Explained

### Offline-First Architecture

**How it works:**
1. User registers crop without internet
2. Data saved to `localStorage`
3. Background sync when connection restored
4. Visual indicator shows pending items

**Code Location:**
- `frontend/src/hooks/useOfflineSync.js`
- `frontend/src/components/CropRegistration.jsx`
- `backend/src/controllers/sync.controller.js`

### Redis Caching Strategy

**Cache Layers:**
1. **Redis** (4 hours) - Weather data
2. **In-Memory** (5-10 min) - ETCL calculations
3. **LocalStorage** - Offline access

**Performance:**
- 95% reduction in API calls
- <100ms response time (cached)
- ~800ms response time (fresh API)

**Code Location:**
- `backend/src/lib/redis.lib.js`
- `backend/src/controllers/weather.controller.js`
- `backend/src/lib/prediction.lib.js`

### CSV-Based Geocoding

**Why CSV?**
- No database queries needed
- Instant lookups
- 544 upazilas with lat/long
- Smaller footprint

**Code Location:**
- `backend/db_geocode.csv`
- `backend/src/lib/districts.lib.js`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Team Spring-23**
- EDU-HackFest Participants
- Built for rural farmers in Bangladesh

---

## 🙏 Acknowledgments

- OpenWeatherMap for weather API
- MongoDB Atlas for database hosting
- Upstash for Redis caching
- Render for deployment platform
- All open-source contributors

---

## 📞 Support

For support, email support@harvestguard.com or open an issue on GitHub.

---

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Gamification badges
- [ ] SMS notifications for weather alerts
- [ ] Machine learning for better predictions
- [ ] Real sensor hardware integration
- [ ] Multi-language support (beyond Bangla/English)
- [ ] Farmer community forum
- [ ] Marketplace integration

---

**Built with ❤️ for Bangladeshi farmers**
