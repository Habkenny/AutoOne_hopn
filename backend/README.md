# AutoOne Backend

Production backend for the AutoOne marketplace frontend.

## Stack

- NestJS
- PostgreSQL
- Prisma
- JWT auth with role guards
- Seeded marketplace data matching the current frontend mock API

## Run Locally

```bash
cd backend
npm install
cp .env.example .env
docker compose up -d
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The API runs on `http://localhost:4000` by default. Set `VITE_API_BASE_URL=http://localhost:4000` for the frontend.

## Test Users

- Customer: `alex@autoone.app` / `password`
- Partner: `partner@autoone.app` / `password`

## Main API Areas

- `/auth/*` for registration, login, refresh, logout, and profile.
- `/service-types`, `/providers`, and `/search/providers` for marketplace discovery.
- `/bookings` for customer bookings and partner booking decisions.
- `/partner/*` for dashboard and service management.
- `/rentals`, `/imports`, and `/finance` for the beta service lines.
- `/notifications` for read/unread notification state.
