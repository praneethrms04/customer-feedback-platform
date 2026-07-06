# Customer Feedback Platform

A full-stack customer feedback management system built with Next.js 16 and Express. Users can submit feedback via a public form, and admins manage submissions through a protected dashboard with analytics, filtering, and status management.

## Tech Stack

**Client** — Next.js 16 (App Router), React 19, TypeScript, TanStack React Query, React Hook Form + Zod, Base UI (shadcn/ui), Recharts, Tailwind CSS 4, Sonner

**Server** — Express 5, TypeScript, Mongoose, MongoDB, JWT (HttpOnly cookies), Zod validation, Winston logging, Helmet, Rate limiting

**Testing** — Jest, Supertest, mongodb-memory-server (23 tests)

## Getting Started

### Prerequisites

- Node.js 24+
- MongoDB (local or Atlas)

### Setup

```bash
# Install dependencies
cd client && npm install
cd ../server && npm install
```

### Server

```bash
cd server

# Copy environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start dev server
npm run dev

# Run tests
npm test
```

### Client

```bash
cd client

# Start dev server
npm run dev
```

The client runs on `http://localhost:3000`, the server on `http://localhost:5000`.

### Default Admin

On first run, the server seeds a default admin:

- Email: `admin@example.com`
- Password: `admin123`

**Change this in production.**

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` | Environment |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/customer-feedback-platform` | MongoDB connection |
| `JWT_SECRET` | `dev-secret-change-in-production` | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiry |

## Architecture

- **Auth**: HttpOnly cookies — token is invisible to JavaScript, immune to XSS
- **Data fetching**: Custom hooks (`useFeedbackList`, `useAnalytics`, etc.) encapsulate all TanStack Query logic — pages don't import from `@tanstack/react-query` directly
- **Types**: Single source of truth in `client/types/`, imported by services and hooks
- **Constants**: Shared in `client/lib/constants.ts` — statuses, categories, ratings, config values
- **UI**: shadcn/ui components built on Base UI — accessible by default, no raw form elements

## Project Structure

```
├── client/                # Next.js 16 frontend
│   ├── app/               # App Router pages
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature-specific components
│   ├── hooks/             # Custom data-fetching hooks
│   ├── lib/               # Utilities and constants
│   ├── providers/         # React context providers
│   ├── services/          # API client functions
│   └── types/             # Shared TypeScript types
├── server/                # Express 5 backend
│   ├── __tests__/         # Jest tests
│   ├── config/            # Environment and DB config
│   ├── controllers/       # Route handlers
│   ├── middlewares/        # Auth, error handler, rate limiting
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── services/          # Business logic
│   ├── utils/             # JWT, logger, helpers
│   └── validators/        # Zod schemas
└── TEACH_US.md            # Accessibility philosophy
```
