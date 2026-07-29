# Car Dealership Inventory System

This project is a full-stack car dealership inventory system created for the
TDD Kata assessment.

## Planned technology stack

- Backend: Node.js, TypeScript, Express
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT and bcrypt
- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- Testing: Vitest, Supertest, React Testing Library, and Playwright

## Planned functionality

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

Start PostgreSQL from the repository root:

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

The final test report will be added before delivery.

## My AI Usage

This project is being developed with assistance from OpenAI Codex. AI is being
used for planning, test suggestions, implementation support, debugging, code
review, and documentation. All generated suggestions are reviewed, adapted,
tested, and explained by the project owner. The complete AI prompt history is
maintained in `PROMPTS.md`.
