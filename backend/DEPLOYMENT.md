# Backend Deployment Notes

## Required Environment

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: strong access-token signing secret.
- `JWT_REFRESH_SECRET`: strong refresh-token signing secret.
- `JWT_EXPIRES_IN`: access-token lifetime, for example `15m`.
- `JWT_REFRESH_EXPIRES_IN`: refresh-token lifetime, for example `7d`.
- `FRONTEND_ORIGIN`: deployed frontend origin for CORS.
- `PORT`: API port.

## MVP Deployment Flow

1. Provision PostgreSQL.
2. Set environment variables on the host.
3. Run `npm install`.
4. Run `npm run prisma:generate`.
5. Run `npm run prisma:deploy`.
6. Run `npm run prisma:seed` only for non-production demo data.
7. Run `npm run build`.
8. Start with `npm run start`.

## Production Hardening

- Replace demo seed credentials before launch.
- Store refresh-token hashes server-side if long-lived sessions are required.
- Add Redis-backed rate limiting before exposing auth endpoints publicly.
- Add object storage for provider/car images and finance/import documents.
- Put payments, email, and SMS providers behind service adapters.
