# TrustVerify — Product Verification & Authenticity Platform

## Overview
TrustVerify bridges the trust gap between manufacturers and customers by providing a platform for product registration, verification, and authenticity assurance.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, ShadCN UI
- **Backend**: Node.js, Express.js (REST API)
- **Database**: PostgreSQL (via Prisma ORM)
- **Auth**: NextAuth.js (JWT)
- **QR Code**: qrcode (generation), html5-qrcode (scanning)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation
```bash
# Install all dependencies
npm run install:all

# Set up environment variables
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Run database migrations
cd backend && npx prisma migrate dev

# Start development servers
npm run dev
```

### Project Structure
```
trustverify/
├── frontend/          # Next.js 14 App
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/ # Reusable components
│   │   ├── lib/       # Utility functions
│   │   └── styles/    # Global styles
│   └── public/        # Static assets
├── backend/           # Express.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── prisma/        # Database schema
└── package.json       # Root workspace config
```

## User Roles
1. **Company** — Register products, generate QR codes, track scans
2. **Admin** — Approve companies, monitor fraud, manage platform
3. **Customer** — Scan QR / enter code to verify product authenticity
