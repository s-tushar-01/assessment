# Car Dealership Inventory System

This project is a full-stack car dealership inventory system created for the
TDD Kata assessment.

## Technology stack

- Backend: Node.js, TypeScript, Express
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT and bcrypt
- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- Testing: Vitest, Supertest, React Testing Library, and Playwright

## Implemented functionality

- User registration and login
- Token-protected vehicle management
- Vehicle search by make, model, category, and price range
- Vehicle purchasing and stock reduction
- Admin-only deletion and restocking
- Responsive React single-page application

## Development approach

Features will be developed using Test-Driven Development:

1. Write a failing test.
2. Implement the minimum code required to pass it.
3. Refactor while keeping the tests passing.

Git history will document the Red-Green-Refactor process.

## Setup

Prerequisites:

- Node.js 24 or later
- npm
- Docker Desktop, for PostgreSQL

Start PostgreSQL from the repository root. This project uses host port `5433`
to avoid conflicts with an existing local PostgreSQL installation:

```bash
docker compose up -d postgres
```

Set up the backend:

```bash
cd backend
copy .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

Set up the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

## Testing

Backend tests:

```bash
cd backend
npm test
```

Frontend tests and production build:

```bash
cd frontend
npm run build
npm test
```

See [TEST_REPORT.md](TEST_REPORT.md) for the latest automated verification.

The final verification currently passes 37 backend tests and 16 frontend tests,
along with both production builds and frontend lint.

## Admin account setup

New registrations are intentionally created with the `USER` role. The first
authorized administrator must be promoted in the deployed PostgreSQL database
through the database provider's SQL console or an approved client such as
pgAdmin. The production database is accessed externally for this one-time role
change; database credentials must never be committed or shared.

After registering the account, run the following statement against the
deployed database, replacing the email with the authorized account:

```sql
UPDATE public."User"
SET "role" = 'ADMIN'
WHERE "email" = 'admin@example.com';
```

Verify the role before signing in again:

```sql
SELECT "email", "role"
FROM public."User"
WHERE "email" = 'admin@example.com';
```

The backend includes the database role in the JWT and enforces admin access on
delete and restock routes. The frontend only displays admin controls when the
authenticated backend response identifies the user as `ADMIN`.

## Deployment configuration

For a deployed backend, configure `DATABASE_URL`, `JWT_SECRET`, `PORT`, and
`FRONTEND_URL` in the hosting provider's environment settings. `FRONTEND_URL`
must contain the deployed frontend origin. Apply Prisma migrations during the
backend build or release step with `npx prisma migrate deploy` before starting
the server. Never put production secrets in `.env.example`, source code, or
the frontend bundle.

## My AI Usage

This project is being developed with assistance from OpenAI Codex. AI is being
used for planning, test suggestions, implementation support, debugging, code
review, and documentation. All generated suggestions are reviewed, adapted,
tested, and explained by the project owner. The complete AI prompt history is
maintained in `PROMPTS.md`.
