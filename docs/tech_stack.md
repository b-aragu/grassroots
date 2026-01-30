# Grassroots Technology Stack

## Overview
This document defines the technology stack for the Grassroots project, enabling the "Mwananchi" volunteer app and "Kiongozi" HQ dashboard.

## 1. Backend API
- **Language:** TypeScript
- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
  - Modular architecture
  - Dependency Injection
  - Built-in support for REST APIs and WebSockets
- **Database:**
  - **Relational:** PostgreSQL (via Supabase or self-hosted) for structured data (Users, Missions, Wards).
  - **NoSQL:** MongoDB (optional, or JSONB in Postgres) for unstructured surveys/media metadata.
- **ORM:** Prisma or TypeORM (Recommended: Prisma for type safety).
- **Real-time:** Socket.IO or Supabase Realtime for live dashboard updates.
- **Authentication:** Supabase Auth or Firebase Auth.

## 2. Mobile App (Mwananchi - Volunteer)
- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
  - Managed workflow for easy build and deployment.
- **Language:** TypeScript
- **Mapping:** `react-native-maps` or `mapcn` (as mentioned in docs).
- **State Management:** React Query (TanStack Query) for server state + Zustand/Redux for local state.
- **Offline Storage:** WatermelonDB or mmKV + Redux Persist.
- **UI Library:** NativeWind (Tailwind CSS for React Native) or Tamagui.

## 3. Web Dashboard (Kiongozi - HQ)
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS.
- **Components:** Shadcn/ui (for premium, accessible UI components).
- **Mapping:** MapLibre GL JS or Mapbox GL.
- **Charts:** Recharts or Chart.js for analytics.

## 4. Infrastructure & DevOps
- **Containerization:** Docker for backend services.
- **Version Control:** Git.
- **CI/CD:** GitHub Actions (future setup).
