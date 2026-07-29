# Test Report

## Final automated verification

| Area | Result |
|---|---|
| Backend Vitest | 35 tests passed across 20 test files |
| Backend TypeScript build | Passed |
| Frontend Vitest | 8 tests passed |
| Frontend production build | Passed |
| Frontend lint | Passed |
| Playwright browser smoke test | Passed |
| Optional Playwright user-flow test | Passed |

## Coverage included

- Registration and login flows
- JWT authentication and ADMIN authorization
- Vehicle creation, listing, search, update, deletion, purchase, and restocking
- Atomic stock reduction and persistent stock increments
- React login and registration screens
- Authenticated inventory loading and filtering
- Purchase stock refresh and zero-stock button disabling
- ADMIN-only restock and delete controls
- ADMIN-only add and edit controls
- API CORS preflight for the Vite frontend origin

## Browser evidence

The Playwright smoke test in `e2e/smoke.py` created a unique account, signed
in, opened the inventory dashboard, and captured:

- `artifacts/login.png`
- `artifacts/inventory-dashboard.png`

- `artifacts/optional-purchase-flow.png`

The broader optional flow is documented in `e2e/README.md` and covers vehicle
creation, search, purchase, stock reduction, and a purchase screenshot.

## Notes

Frontend Vitest is configured to use a single thread for reliable local
execution on Windows. The full test commands are documented in `README.md`.
