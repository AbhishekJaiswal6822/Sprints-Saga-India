# Sprints Saga India - LokRaja Marathon Platform

🌐 Live Website: [https://www.sprintssagaindia.com](https://www.sprintssagaindia.com)

[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Razorpay](https://img.shields.io/badge/Razorpay-02042B?logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-0F4C81?logo=node.js&logoColor=white)](https://nodemailer.com/)
[![AWS Amplify](https://img.shields.io/badge/AWS-Amplify-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/amplify/)
[![AWS App Runner](https://img.shields.io/badge/AWS-App%20Runner-232F3E?logo=amazonaws&logoColor=white)](https://aws.amazon.com/apprunner/)

Sprints Saga India is a full-stack marathon event platform designed to manage the complete LokRaja Marathon experience from public discovery to registration, secure payments, admin operations, email communication, and event logistics.

The platform provides a polished, responsive customer-facing experience while also giving organizers a powerful backend for registrations, coupon management, analytics, and operational workflows.

## Why This Platform Matters

- Delivers a modern digital experience for runners, volunteers, and organizers.
- Supports multi-category race participation including 5K, 10K, 35K, and Full 42K journeys.
- Combines marketing content, registration, payments, dashboards, and admin operations in one ecosystem.
- Built with production-minded architecture for scalability, maintainability, and real-world event operations.

## Core Features

### Customer Experience
- Responsive event landing experience and marathon information pages.
- Multi-step registration flows for individual and group participation.
- Protected user authentication and session management.
- Secure payment checkout with Razorpay integration.
- Post-registration invoice and confirmation workflows.

### Admin & Operations
- Admin dashboard with registration and user insights.
- Coupon code creation, activation, deactivation, and validation.
- Operational reporting through Excel/CSV-friendly workflows.
- Email and PDF-based confirmation and invoice generation.
- File upload support for identification documents and registration assets.

### Technical Highlights
- Global state management using React Context API.
- Role-aware route protection for users, admins, and volunteers.
- Structured REST API architecture with Express and MongoDB Atlas.
- Real-world integrations for payments, emails, PDF generation, and barcode/QR-related operations.

## Tech Stack

### Frontend
- [![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/) for the user interface
- [![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/) for fast development and builds
- [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/) for responsive styling
- [![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/) for client-side routing
- [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/) for animation
- [![Recharts](https://img.shields.io/badge/Recharts-18BFFF?logo=apacheecharts&logoColor=white)](https://recharts.org/) for analytics charts
- [![React Toastify](https://img.shields.io/badge/React_Toastify-FF5A5F?logo=react&logoColor=white)](https://fkhadra.github.io/react-toastify/) for notifications

### Backend
- [![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/) for server-side runtime
- [![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/) for REST API development
- [![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas) for database storage
- [![Mongoose](https://img.shields.io/badge/Mongoose-880000?logo=mongodb&logoColor=white)](https://mongoosejs.com/) for schema modeling
- [![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/) for authentication
- [![bcrypt](https://img.shields.io/badge/bcrypt-3388FF?logo=lock&logoColor=white)](https://www.npmjs.com/package/bcryptjs) for password hashing
- [![Multer](https://img.shields.io/badge/Multer-FF6B6B?logo=upload&logoColor=white)](https://github.com/expressjs/multer) for file uploads

### Payments, Messaging & Documents
- [![Razorpay](https://img.shields.io/badge/Razorpay-02042B?logo=razorpay&logoColor=white)](https://razorpay.com/) for secure payment processing
- [![Nodemailer](https://img.shields.io/badge/Nodemailer-0F4C81?logo=node.js&logoColor=white)](https://nodemailer.com/) for transactional email delivery
- [![PDFKit](https://img.shields.io/badge/PDFKit-FF6B6B?logo=adobeacrobatreader&logoColor=white)](https://pdfkit.org/) for invoice generation
- [![XLSX](https://img.shields.io/badge/XLSX-217346?logo=microsoftexcel&logoColor=white)](https://sheetjs.com/) for spreadsheet processing

### Hosting & Cloud
- [![AWS Amplify](https://img.shields.io/badge/AWS-Amplify-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/amplify/) for frontend hosting
- [![AWS App Runner](https://img.shields.io/badge/AWS-App%20Runner-232F3E?logo=amazonaws&logoColor=white)](https://aws.amazon.com/apprunner/) for backend hosting

## Architecture Overview

```mermaid
flowchart LR
    A[Runner / Admin User] --> B[React Frontend]
    B --> C[Express REST API]
    C --> D[(MongoDB Atlas)]
    C --> E[Razorpay Payments]
    C --> F[Email / PDF Services]
    C --> G[Admin Dashboard & Coupons]
```

## Repository Structure

```text
Sprints-Saga-India/
  frontend/          # React + Vite client application
  backend/           # Node.js + Express API services
  README.md          # Project overview and onboarding guide
```

## Getting Started

### Prerequisites
- Node.js 18+ recommended
- npm or pnpm
- MongoDB Atlas connection details
- Razorpay keys and email service configuration

### 1) Clone the repository

```bash
git clone https://github.com/AbhishekJaiswal6822/Sprints-Saga-India.git
cd Sprints-Saga-India
```

### 2) Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 3) Backend setup

```bash
cd ../backend
npm install
cp .env.example .env
npm start
```

## Environment Variables

Create environment files in both frontend and backend folders with values appropriate for your environment.

### Frontend
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

## Deployment

The platform is designed for production deployment with:
- Frontend hosted on AWS Amplify
- Backend hosted on AWS App Runner
- Database managed through MongoDB Atlas
- Email communications routed through secure mail services such as Zoho

## Project Highlights

- Modern responsive event portal
- Secure authentication and role-based access
- Advanced registration and payment workflows
- Admin coupon and dashboard management
- Automated invoicing and communication workflows
- Structured and extensible API foundation

## Contributing

Contributions are welcome. For significant changes, please open an issue first to discuss the proposed improvement.

## License

This project is intended for internal and commercial event platform use. Please review repository ownership and usage terms before redistribution.
