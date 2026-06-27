# Sprints Saga India - Core API Backend

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![AWS App Runner](https://img.shields.io/badge/AWS-App%20Runner-232F3E?logo=amazonaws&logoColor=white)](https://aws.amazon.com/apprunner/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-0F4C81?logo=node.js&logoColor=white)](https://nodemailer.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-02042B?logo=razorpay&logoColor=white)](https://razorpay.com/)
[![PDFKit](https://img.shields.io/badge/PDFKit-FF6B6B?logo=adobeacrobatreader&logoColor=white)](https://pdfkit.org/)
[![Zoho](https://img.shields.io/badge/Zoho-Email%20%26%20Branding-FC4C02)](https://www.zoho.com/)

## Overview

This backend powers the API layer for the Sprints Saga India marathon platform. It handles user authentication, race registration intake, payment coordination, coupon management, admin analytics, and event-related operations through a secure and modular Express-based architecture.

The service is designed to support both public-facing registration workflows and internal operational needs while remaining maintainable as the platform grows.

## System Architecture

The backend is organized as a layered REST API service that accepts client requests, routes them to controllers, applies business logic, and persists data in MongoDB Atlas.

```text
Client Request
  -> Express Router
  -> Controller Layer
  -> Middleware / Validation
  -> Mongoose Models / Database
  -> Structured Response
```

This structure keeps the service modular and makes it easier to evolve authentication, registration, payment, and admin functionality independently.

## Core Backend Capabilities

- Secure user registration and login flows.
- Marathon registration intake with structured Mongoose models for individual, group, and charity-style submissions.
- Protected admin and user routes with middleware-based authorization.
- Payment order creation, verification, and invoice-related workflows through Razorpay.
- Admin coupon code creation, activation, deactivation, and validation.
- Email communication and invoice delivery using Nodemailer and Zoho-based mail routing.
- PDF invoice generation and QR-based operational outputs using PDFKit and QR libraries.
- File upload handling for ID proof documents and registration assets.
- Admin dashboard data aggregation for registrations, users, and revenue insights.
- Excel/CSV-compatible processing for operational reporting and data handling.

## API Surface

The backend supports both public and administrator-driven actions, including transactional and operational workflows.

The backend exposes a focused set of REST endpoints for public and protected workflows.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/signin` | Authenticate a user and return access data |
| POST | `/api/register` | Submit a marathon registration |
| GET | `/api/register/my-registration` | Retrieve the authenticated user’s registration data |
| GET | `/api/admin/dashboard-data` | Provide admin dashboard metrics and listings |
| POST | `/api/payment/order` | Create a payment order |
| POST | `/api/payment/verify` | Verify payment status |
| POST | `/api/coupons` | Create and manage coupon codes from the admin panel |
| PATCH | `/api/coupons/:id/status` | Toggle a coupon’s active state |
| DELETE | `/api/coupons/:id` | Remove a coupon |
| GET | `/api/coupons/validate/:code` | Validate a coupon code |

## Project Structure

```text
backend/
  controllers/      # Request handlers and business logic
  models/           # Mongoose schemas for users, registrations, coupons, and related entities
  routes/           # Express endpoints for auth, registration, payments, admin, and coupons
  middleware/       # Authentication and authorization layers
  services/         # Email, invoice, and other operational services
  config/           # Environment and integration configuration
  uploads/          # Uploaded files such as ID proofs
```

## Environment Configuration

Create a `.env` file in the backend root with values in the following style:

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

## Local Development

### Install dependencies

```bash
cd backend
npm install
```

### Start the server

```bash
npm start
```

The API will run on `http://localhost:8000` by default.

## Production Deployment on AWS App Runner

### Recommended deployment flow

1. Create an AWS App Runner service for this backend repository.
2. Configure the build and start commands for the service.
3. Inject environment variables through the App Runner service configuration.
4. Enable health checks and network access so the frontend can reach the API reliably.
5. Point the frontend environment to the deployed backend endpoint.

### Example production startup

```bash
npm install
NODE_ENV=production npm start
```

## Operational Notes

- Keep secrets out of version control.
- Use MongoDB Atlas access controls and strong credentials.
- Enforce HTTPS in production for authentication and payment-related traffic.
- Monitor service logs and application health regularly.
