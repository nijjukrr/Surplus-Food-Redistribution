# FoodBridge AI – Smart Surplus Food Redistribution Platform 🍲🤖

FoodBridge AI is a full-stack, AI-powered web application built to eliminate food waste and fight hunger in real-time. It connects **Restaurants, Hotels, Supermarkets, NGOs, and Volunteer Couriers**, using **Google Gemini AI** to evaluate donation urgency, calculate priority, recommend optimal NGO matches, and estimate meal impacts.

---

## 🌟 Key Features

1. **AI-Powered Priority Prediction & NGO Matching (Google Gemini API):**
   - Analyzes quantity, category, cooked time, shelf-life, and nearby NGO capacities.
   - Outputs structured JSON priority flags (`High`, `Medium`, `Low`), urgency scores (0-100%), estimated meals served, and AI reasoning.
2. **Multi-Role Portals:**
   - **Restaurant Portal:** Post surplus food donations, view AI predictions, and track donation progress.
   - **NGO Portal:** View nearby AI-prioritized donation feed, accept donations, and request pickups.
   - **Volunteer Courier Portal:** Discover claimed deliveries, navigate routes using interactive maps, and update pickup/delivery milestones.
   - **Admin Analytics Control Center:** System KPI metrics (food saved in kg, total meals served, average pickup/delivery lag times, entity leaderboards).
3. **Interactive Maps & Route Guidance:**
   - Built with Leaflet + OpenStreetMap (with support for Google Maps API overlay via `.env`).
4. **9 Extended Database Tables (Supabase PostgreSQL):**
   - `profiles`, `restaurants`, `ngos`, `volunteers`, `food_donations`, `ai_predictions`, `pickup_requests`, `deliveries`, `notifications`.

---

## 🏗️ System Architecture

```text
               ┌──────────────────────────────┐
               │    React + Vite Frontend     │
               │   (Tailwind CSS + Leaflet)   │
               └──────────────┬───────────────┘
                              │ REST API
                              ▼
               ┌──────────────────────────────┐
               │    Node.js + Express Backend │
               └──────┬───────┬───────┬───────┘
                      │       │       │
      ┌───────────────┘       │       └──────────────┐
      ▼                       ▼                      ▼
┌───────────┐         ┌──────────────┐      ┌─────────────────┐
│ Gemini AI │         │ Supabase Auth│      │  Supabase DB    │
│    SDK    │         │  & Storage   │      │  (PostgreSQL)   │
└───────────┘         └──────────────┘      └─────────────────┘
```

---

## 📁 Repository Directory Structure

```text
Surplus-Food-Redistribution/
 ├── database/
 │    └── schema.sql                # Complete 9-table Supabase PostgreSQL Schema & Seeds
 ├── server/                        # Express Backend
 │    ├── config/                   # Supabase & Gemini SDK Clients
 │    ├── middleware/               # Auth, Role Authorization, Error Handler
 │    ├── services/                 # Business Logic (AI, Donations, NGO, Volunteer, Analytics)
 │    ├── controllers/              # HTTP Request/Response Controllers
 │    ├── routes/                   # Endpoint Definitions
 │    ├── utils/                    # Geo distance & Formatter helpers
 │    ├── index.js                  # Entry Point (Port 5000)
 │    └── package.json
 ├── client/                        # React + Vite Frontend
 │    ├── src/
 │    │    ├── components/          # Navbar, Footer, InteractiveMap, Badges
 │    │    ├── context/             # AuthContext with instant Role Switcher
 │    │    ├── pages/               # LandingPage, AuthPage, Restaurant, NGO, Volunteer, Admin
 │    │    └── services/            # Axios API Client
 │    ├── index.html
 │    ├── vite.config.js
 │    └── package.json
 └── README.md
```

---

## 🚀 Quickstart & Local Setup

### 1. Database Setup (Supabase)
1. Open your [Supabase Dashboard](https://supabase.com/).
2. Navigate to **SQL Editor**.
3. Copy the contents of [`database/schema.sql`](file:///c:/Users/Nishanth.KR/OneDrive/Desktop/New%20folder/food/database/schema.sql) and execute it.

### 2. Backend Setup
```bash
cd server
cp .env.example .env
# Add your SUPABASE_URL, SUPABASE_ANON_KEY, and GEMINI_API_KEY to .env
npm install
npm run dev
# Server listens at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
# Frontend available at http://localhost:3000
```

---

## ⚡ API Endpoints

- `GET /` - API Health check
- `POST /api/donations` - Create new food donation & trigger Gemini AI analysis
- `GET /api/donations` - List all food donations
- `POST /api/ngo/accept-donation/:id` - NGO accepts donation & creates pickup request
- `POST /api/volunteer/claim-delivery/:id` - Volunteer claims pickup task
- `POST /api/volunteer/update-step/:id` - Update delivery status (`Picked Up`, `Delivered`)
- `GET /api/admin/analytics` - Fetch platform throughput KPIs & leaderboards

---

## 🌐 Deployment Instructions

- **Frontend:** Deploy `client/` to [Vercel](https://vercel.com).
- **Backend:** Deploy `server/` to [Render](https://render.com).
- **Database & Auth:** Hosted on [Supabase](https://supabase.com).
