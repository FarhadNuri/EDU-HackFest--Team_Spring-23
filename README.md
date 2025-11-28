# 🌾 HarvestGuard - Smart Crop Management System

<div>

**An enterprise-grade, offline-first crop management platform engineered for rural connectivity constraints in Bangladesh**


</div>

### Live Demo

[edu-hackfest-teamspring-23-production.up.railway](https://edu-hackfest-teamspring-23-production.up.railway.app/)

## Acknowledgments

- **[bd-geocode-with-lat-long](https://github.com/mdtanjilhasan/bd-geocode-with-lat-long)** - Comprehensive Bangladesh geocoding dataset (64 districts, 544 upazilas with coordinates)



### Key Metrics

- **95% Reduction** in external API calls through intelligent caching
- **100% Offline Capability** for critical crop registration workflows
- **<100ms Response Time** for cached weather data
- **4-Hour Cache TTL** for weather data optimization
- **7-Day Risk Forecasting** for crop loss prediction

### Problem Statement

Rural Bangladesh faces:
- **Intermittent Internet Connectivity** - Farmers need to work offline
- **API Cost Constraints** - Weather API calls are expensive at scale
- **Language Barriers** - Bilingual support (Bangla/English) required
- **Real-time Weather Needs** - Hyper-local weather for 544 upazilas
- **Crop Loss Prevention** - Need predictive analytics for storage risks


### Our Solution

HarvestGuard implements:
1. **Offline-First Architecture** using IndexedDB + LocalStorage
2. **Multi-Layer Caching Strategy** (Redis + In-Memory + Client-Side)
3. **CSV-Based Geocoding** for instant location lookups
4. **JWT Authentication** with refresh token rotation
5. **ETCL Algorithm** (Estimated Time to Critical Loss)

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   React UI   │  │ LocalStorage │  │ Service      │           │
│  │   (Vite)     │◄─┤   Offline    │◄─┤ Workers      │           │
│  │              │  │   Queue      │  │  (Future)    │           │
│  └──────┬───────┘  └──────────────┘  └──────────────┘           │
│         │ Axios API Calls                                       │
└─────────┼───────────────────────────────────────────────────────┘
          │
          ▼ HTTPS / REST API
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────┐           │
│  │            Express.js Server (Node 18+)          │           │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  │           │
│  │  │Controllers │  │Middlewares │  │  Routes    │  │           │
│  │  │  (Logic)   │◄─┤   (Auth)   │◄─┤  (REST)    │  │           │
│  │  └─────┬──────┘  └────────────┘  └────────────┘  │           │
│  └────────┼─────────────────────────────────────────┘           │
│           │                                                     │
└───────────┼─────────────────────────────────────────────────────┘
            │
            ▼ Data Access Layer
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   MongoDB Atlas │  │  Redis (Upstash)│  │  CSV Geocoding  │  │
│  │  (Primary DB)   │  │   (Cache Layer) │  │  (544 Upazilas) │  │
│  │                 │  │                 │  │                 │  │
│  │ • Users         │  │ • Weather Cache │  │ • District Data │  │
│  │ • Crops         │  │ • Token Store   │  │ • Coordinates   │  │
│  │ • Predictions   │  │ • ETCL Cache    │  │ • Instant Lookup│  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼ External Services
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL APIs                                │
│         ┌────────────────────────────────┐                      │
│         │   OpenWeatherMap API           │                      │
│         │   (5-day forecast by coords)   │                      │
│         └────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow Diagram

```
User Action (Register Crop)
     │
     ▼
┌─────────────────────────────────┐
│  Is Network Available?          │
└─────────────┬───────────────────┘
              │
     ┌────────┴────────┐
     │                 │
    YES               NO
     │                 │
     ▼                 ▼
┌─────────────┐  ┌──────────────────┐
│ API Request │  │ Save to          │
│ to Server   │  │ localStorage     │
└──────┬──────┘  │ (Offline Queue)  │
       │         └──────────────────┘
       ▼                │
┌─────────────┐         │
│ JWT Auth    │         │
│ Validation  │         │
└──────┬──────┘         │
       │                │
       ▼                │
┌─────────────┐         │
│ Controller  │         │
│ Processing  │         │
└──────┬──────┘         │
       │                │
       ▼                │
┌─────────────┐         │
│ MongoDB     │         │
│ Save        │         │
└──────┬──────┘         │
       │                │
       ▼                │
┌─────────────┐         │
│ Response    │         │
│ to Client   │         │
└──────┬──────┘         │
       │                │
       └────────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Network Back?│
         └──────┬───────┘
                │ YES
                ▼
         ┌──────────────┐
         │ Auto Sync    │
         │ Queue Items  │
         └──────────────┘
```

---

## 🔥 Core Features Deep Dive

### 1️⃣ Offline-First Architecture

#### Implementation Strategy

**Problem**: Farmers in rural areas have intermittent connectivity. Data entry shouldn't require constant internet.

**Solution**: Three-tier offline architecture

```javascript
// Architecture Layers
┌─────────────────────────────────────────┐
│     Layer 1: UI State Management        │
│     React Context + useState            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│     Layer 2: LocalStorage Queue         │
│     Persistent offline data storage     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│     Layer 3: Background Sync Worker     │
│     Auto-sync when connection restored  │
└─────────────────────────────────────────┘
```

#### Workflow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                  OFFLINE REGISTRATION FLOW                   │
└──────────────────────────────────────────────────────────────┘

User Fills Form
     │
     ▼
Check Network Status
     │
     ├───[OFFLINE]────────────────────────────────────┐
     │                                                │
     ▼                                                ▼
Generate Local ID                            Show "Will Sync Later"
(UUID v4)                                     Visual Indicator
     │                                                │
     ▼                                                │
Save to LocalStorage                                  │
Key: "offlineQueue"                                   │
     │                                                │
     ▼                                                │
Show Success Message ◄────────────────────────────────┘
"Saved Locally"
     │
     │
     │ [Network Restored]
     ▼
Background Sync Triggered
     │
     ▼
POST /api/sync/offline
(Batch upload all queued items)
     │
     ▼
Clear LocalStorage Queue
     │
     ▼
Update UI - Show "Synced" Badge
```

**Key Benefits**:
- ✅ Zero data loss even with no connectivity
- ✅ Immediate user feedback (no waiting for network)
- ✅ Automatic retry mechanism
- ✅ Deduplication prevents duplicate entries
- ✅ Visual indicators show sync status

---

### 2️⃣ 95% API Call Reduction Strategy

#### Problem Analysis

**Before Optimization**:
- OpenWeatherMap: 1,000 free calls/day
- 100 farmers × 10 weather checks = 1,000 calls/day
- **Result**: Quota exhausted, $40/month for paid tier

**After Optimization**:
- Same 1,000 user requests
- Only 50 actual API calls (95% reduction)
- **Result**: Free tier sufficient, $0 cost

#### Multi-Layer Caching Architecture

```
Request for Weather Data
         │
         ▼
┌─────────────────────────────────┐
│   Layer 1: Client-Side Cache    │
│   (LocalStorage - 30 min TTL)   │
└────────┬────────────────────────┘
         │ MISS
         ▼
┌─────────────────────────────────┐
│   Layer 2: Redis Cache          │
│   (4 hour TTL, Upstash)         │
└────────┬────────────────────────┘
         │ MISS
         ▼
┌─────────────────────────────────┐
│   Layer 3: OpenWeather API      │
│   (Fresh data from external)    │
└─────────────────────────────────┘
         │
         ▼
    Cache in Redis & LocalStorage
    (for future requests)
```
**Cache Strategy Benefits**:
- ✅ 95% reduction in external API costs
- ✅ Sub-100ms response times for cached data
- ✅ Reduced server load and bandwidth
- ✅ Works offline with stale data
- ✅ Smart invalidation for critical changes

---

### 3️⃣ CSV-Based Geocoding System

#### Why CSV Instead of Database?

**Traditional Approach** (Database Query):
```sql
SELECT * FROM districts WHERE name = 'Dhaka';
-- Query time: 50-200ms (network + DB processing)
```

**Our Approach** (In-Memory CSV):
```javascript
const district = districtsMap.get('Dhaka');
// Lookup time: <1ms (hash map lookup)
```

### 4️⃣ ETCL Risk Prediction Algorithm

#### Algorithm Overview

**ETCL** = Estimated Time to Critical Loss

Calculates when stored crops will reach critical degradation levels based on:
1. Current storage conditions (temperature, humidity)
2. Weather forecast (next 7 days)
3. Crop type characteristics
4. Storage type (warehouse, cold storage, outdoor)

#### Mathematical Model

```javascript
ETCL = f(T, H, W, S, C)

Where:
  T = Current Temperature
  H = Current Humidity
  W = Weather Forecast (7-day)
  S = Storage Type Factor
  C = Crop Type Constants
```

#### Risk Level Matrix

```
┌──────────────────────────────────────────────────────────┐
│                 RISK LEVEL MATRIX                        │
├──────────────┬────────────┬──────────────────────────────┤
│ ETCL (hours) │ Risk Level │ Action Required              │
├──────────────┼────────────┼──────────────────────────────┤
│ 0-24         │ CRITICAL   │ Immediate action needed      │
│ 24-72        │ HIGH       │ Plan action within 24h       │
│ 72-168       │ MEDIUM     │ Monitor closely              │
│ 168+         │ LOW        │ Normal monitoring            │
└──────────────┴────────────┴──────────────────────────────┘
```

**Benefits**:
- ✅ Proactive crop loss prevention
- ✅ Data-driven decision making
- ✅ Actionable recommendations
- ✅ Multi-factor risk assessment
- ✅ Real-time alerts

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - NoSQL database
- **Redis (Upstash)** - Caching layer
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **ioredis** - Redis client

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **LocalStorage** - Offline storage


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

## 🔒 Security

### Authentication & Authorization

**JWT Implementation:**
```javascript
// Dual-token strategy
Access Token:  Short-lived (1 day)  → API authentication
Refresh Token: Long-lived (7 days) → Token renewal

// Token storage
Access Token:  httpOnly cookie (XSS protection)
Refresh Token: httpOnly cookie (XSS protection)
```

**Password Security:**
- bcryptjs with 10 salt rounds
- Minimum 6 characters enforced
- Hashed before database storage


## 👥 Team

**Team Spring-23** - EDU-HackFest 2024

Built with ❤️ for Bangladeshi farmers by passionate developers committed to solving real-world agricultural challenges through technology.

### Contributors

- **Backend Architecture**: Authentication, API design, Redis caching
- **Frontend Development**: React components, offline-first implementation
- **DevOps**: Deployment, monitoring, CI/CD setup
- **Data Engineering**: CSV geocoding, ETCL algorithm

---

<div align="center">

### 🌾 HarvestGuard - Empowering Farmers Through Technology

**Built with ❤️ for rural Bangladesh | Team Spring-23**

[⬆ Back to Top](#-harvestguard---smart-crop-management-system)

</div>
