# Mwananchi & Kiongozi Developer Plan

This document outlines a **step-by-step developer plan** for building the Mwananchi (volunteer) app and Kiongozi (HQ dashboard) system, including recommended **free resources** for MVP development.

---

## Step 1: Define Requirements & Architecture

**Features:**

**Mwananchi App (Volunteer):**

* Map with daily missions (pins)
* Check-In button: GPS + timestamp + 30-second voice note
* Optional photo upload
* Short surveys (yes/no, multiple choice)
* Leaderboard & badges
* Offline-first mode

**Kiongozi Dashboard (HQ):**

* Real-time heatmap (green/red areas)
* Vibe feed (voice notes/photos)
* Live pledged vote counter
* Coverage charts & analytics
* Alerts for undercovered areas
* Volunteer leaderboard
* Multi-level campaign support

**Architecture:**

* Client: React Native (Mwananchi), React/Next.js (Kiongozi)
* Backend: Node.js/NestJS + REST APIs + WebSocket for real-time
* Database: PostgreSQL (structured) + MongoDB (media / surveys)
* Media Storage: AWS S3 / Supabase Storage
* Map Component: mapcn (web & mobile)

**Free Resources:**

* mapcn, OpenStreetMap, MapLibre GL
* Supabase (DB + Realtime + Storage + Auth)
* Firebase (Firestore + FCM)
* React / React Native / Next.js
* Chart.js / Recharts
* Open-source AI: Whisper / Coqui / Hugging Face Transformers

---

## Step 2: Database & Models

**Tables / Collections:**

**Volunteers**

```
id, name, email/phone, role, points, badges[], team_id
```

**Teams**

```
id, name, members[]
```

**Missions / Targets**

```
id, ward_id, house_address/geo_location, assigned_volunteer_id, status, scheduled_date
```

**Check-ins**

```
id, volunteer_id, mission_id, gps_lat, gps_lng, timestamp, voice_note_url, photo_urls[], survey_answers json
```

**Wards / Constituencies**

```
id, name, county, geometry (polygon for heatmap)
```

**Pledged Votes**

```
id, ward_id, volunteer_id, support_type, timestamp
```

**Notifications / Alerts**

```
id, message, type, target_team, read_status
```

**Free Resources:**

* Supabase PostgreSQL for structured data
* MongoDB Atlas for unstructured media/surveys (512MB free)

---

## Step 3: Backend Development

**Tasks:**

1. Set up Node.js / NestJS project
2. Implement REST APIs:

   * POST /api/checkins
   * GET /api/missions
   * GET /api/reports/latest
   * GET /api/wards/:id/coverage
   * GET /api/pledges/stats
   * GET /api/leaderboard
3. Real-Time WebSocket / Realtime updates using Socket.IO or Supabase Realtime
4. Media Handling (Supabase Storage or Firebase Storage)
5. Offline Sync Logic
6. Authentication & Role-based Access Control

**Free Resources:**

* Supabase Realtime
* Firebase Auth & FCM
* Node.js / NestJS (free open-source)
* AWS Free tier / Supabase Storage

---

## Step 4: Mwananchi Mobile App (React Native)

**Tasks:**

1. Set up React Native project (TypeScript + Expo)
2. Map Integration using mapcn React Native component
3. Check-In Flow: GPS + timestamp + voice note + optional photo/survey
4. Leaderboard & Badges (API fetch)
5. Offline-first caching with Redux Persist or WatermelonDB
6. Push Notifications via FCM

**Free Resources:**

* React Native + Expo
* mapcn
* Redux Persist / WatermelonDB
* Firebase Cloud Messaging

---

## Step 5: Kiongozi Dashboard (React/Next.js)

**Tasks:**

1. Set up Next.js project
2. Heatmap using mapcn + ward polygons + coverage data
3. Vibe Feed (scrollable list of voice notes/photos)
4. Live Pledged Vote Counter (API + WebSocket)
5. Analytics & Charts (Chart.js / Recharts)
6. Role-Based Access & Secure Auth

**Free Resources:**

* Next.js
* mapcn
* Recharts / Chart.js
* Supabase Auth + Realtime

---

## Step 6: Integration

1. Connect Mwananchi app to backend APIs (missions, check-ins, leaderboard)
2. Connect Kiongozi dashboard to backend (heatmap, vibe feed, vote counter)
3. Test real-time updates via WebSocket / Supabase Realtime
4. Offline sync testing for Mwananchi

---

## Step 7: Testing

1. Unit Tests: backend APIs + front-end components
2. Integration Tests: end-to-end check-in → sync → dashboard
3. Offline Tests: Mwananchi app offline → data sync when online
4. Security Tests: authentication, role-based access, encrypted storage

**Free Resources:**

* Jest (unit/integration testing)
* React Native Testing Library
* Cypress / Playwright for dashboard UI

---

## Step 8: Deployment

**Backend:**

* Supabase / Railway / Render free tier

**Frontend (Dashboard):**

* Vercel / Netlify free tier

**Mobile App:**

* Expo Go for testing, build APK/IPA for Android/iOS
* Firebase for push notifications

---

## Step 9: Optional Enhancements

* Voice note AI transcription & sentiment analysis (Whisper / Hugging Face / Coqui)
* SMS / USSD fallback for very low connectivity areas
* Multi-level campaign dashboards (ward → county → governor)
* Volunteer team challenges & mini competitions

---

**End of Developer Plan**
