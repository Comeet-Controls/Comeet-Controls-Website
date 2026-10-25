# Comeet Controls Pvt. Ltd.

> **Engineering Tomorrow's Industrial Automation**  
> Official web platform for Comeet Controls Pvt. Ltd. (Pune, Maharashtra, India).

[![CI — Test, Lint & Build](https://github.com/Comeet-Controls/Comeet-Controls-Website/actions/workflows/ci.yml/badge.svg)](https://github.com/Comeet-Controls/Comeet-Controls-Website/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-4169E1?logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## Overview

Comeet Controls Pvt. Ltd. delivers custom industrial automation architectures and turnkey engineering solutions across India and globally. Capabilities include:
- **Special Purpose Machines (SPMs)**: Custom design, fabrication, assembly, and commissioning.
- **PLC & HMI Programming**: Siemens, Allen-Bradley, Mitsubishi, Delta, Schneider, and Omron.
- **SCADA Development**: Real-time telemetry, plant data acquisition, and OEE monitoring.
- **Electrical Control Panels**: CE & ISO aligned power distribution and automation panels.

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Database**: [Neon](https://neon.tech/) Serverless PostgreSQL with connection pooling
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Testing**:
  - **Unit & Integration**: Jest (`tests/api/`)
  - **End-to-End**: Playwright (`tests/e2e/`)
  - **Load Testing**: k6 (`tests/load/`)
- **CI/CD**: GitHub Actions automated pipeline (Lint, DB/API Integration, E2E, Security Headers, Build Check)

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20 LTS
- npm 9+

### Installation
```bash
git clone https://github.com/Comeet-Controls/Comeet-Controls-Website.git
cd Comeet-Controls-Website
npm install
```

### Environment Variables
Create `.env.local` based on `.env.local.example`:
```bash
cp .env.local.example .env.local
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Automated Testing

```bash
# Run ESLint
npm run lint

# Run API & Database Integration tests
npm run test:api

# Run Playwright End-to-End browser tests
npm run test:e2e
```

---

## License & Credits

Developed with precision for **Comeet Controls Pvt. Ltd.**  
Shop No. 34, Mahasainik Industrial Estate Rd, MIDC, Bhosari, Pune, MH 411026.
