# Dealership Inventory Frontend

This React and TypeScript frontend provides the sign-in, account creation,
inventory search, purchase, and role-aware administration screens for the
dealership inventory system.

## Local development

From this directory:

```powershell
npm install
npm run dev
```

The Vite development server uses `http://localhost:5173` by default. Set
`VITE_API_URL` when the backend is not running at `http://localhost:3000`.

## Verification

```powershell
npm test
npm run build
npm run lint
```

The backend remains responsible for JWT validation and admin authorization; the
frontend only renders controls based on the authenticated role returned by the
backend.
