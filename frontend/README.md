# Sprints Saga India - LokRaja Marathon Frontend

[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Recharts](https://img.shields.io/badge/Recharts-18BFFF?logo=apacheecharts&logoColor=white)](https://recharts.org/)
[![AWS Amplify](https://img.shields.io/badge/Hosted%20on-AWS%20Amplify-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/amplify/)

## Overview

This frontend delivers the digital experience for the LokRaja Marathon ecosystem under the Sprints Saga India brand. It combines a modern marketing site, event information modules, registration workflows, payment handoff, and role-based administrative views into a single responsive web application.

Built for performance and clarity, the interface supports runners, volunteers, and organizers while keeping the user journey simple from discovery to registration and post-event engagement.

## What This Frontend Does

- Presents event information, campaign storytelling, race categories, and community content.
- Supports race registration journeys for 5K, 10K, 35K, and Full 42K participation paths.
- Provides protected routes for authenticated users and role-based access for administrators and volunteers.
- Uses a global React Context-based session layer for authentication state and user access without prop drilling.
- Includes admin-facing analytics views, coupon management, payment-related screens, and user dashboard flows.
- Supports QR-based interactions, animated UI experiences, and rich dashboard visualizations.
- Provides accommodation and race-day related experiences with modern form-driven interfaces.

## Architecture at a Glance

The frontend follows a route-driven architecture built around a central auth provider and a shared API layer.

```text
Browser
  -> React Router
  -> AuthProvider (global session + auth context)
  -> ProtectedRoute / Public Route Guards
  -> Page Components (Home, Register, Payment, Dashboard, Admin)
  -> Shared API Utility -> Backend API
```

This provider-based design ensures that login status, user role, and session state remain accessible across nested components in a clean and maintainable way.

## Key Frontend Capabilities

- Responsive landing pages and event sections styled with Tailwind CSS.
- Reusable UI patterns for forms, cards, badges, and dashboard layouts.
- Unified footer and navigation experience across public and authenticated areas.
- Toast-based user feedback and client-side route handling for a smoother experience.
- Integration with backend endpoints for auth, registration, payments, coupons, and admin analytics.
- Interactive charts and analytics dashboards using Recharts.
- Motion-enhanced UI transitions with Framer Motion.
- QR code support, camera-based interactions, and Excel/CSV-friendly reporting experiences.

## Project Structure

```text
frontend/
  src/
    App.jsx                 # Main app shell and route configuration
    AuthProvider.jsx        # React Context auth/session provider
    ProtectedRoute.jsx      # Auth and role guard wrapper
    api.js                  # Shared API helper for backend communication
    pages/                  # Route-level features such as payment, dashboard, race day
    constants/              # Race pricing and static configuration data
    assets/                 # Static images, charts, and visual assets
```

## Local Development Setup

### 1) Install dependencies

```bash
cd frontend
npm install
```

### 2) Configure environment variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3) Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Production Build

```bash
npm run build
```

## Deployment Notes

- The frontend is deployed on AWS Amplify.
- Production environments should use a stable `VITE_API_BASE_URL` that points to the deployed backend service.
- Environment variables should be managed in the Amplify hosting environment rather than embedded directly in the source.
