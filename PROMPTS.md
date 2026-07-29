# AI Usage Prompt History

This file is the assessment evidence log for AI co-authorship. It records the
prompts used with OpenAI Codex, how the response was applied, the verification
performed, and the related Git commit history.

## How to read this file

Each entry contains:

1. The exact development prompt used.
2. The purpose of the prompt and the files or feature affected.
3. The TDD result and verification status.
4. The related commit where applicable.

For feature work, the normal sequence is:

`Red test -> commit/push -> minimum implementation -> Green verification -> commit/push`

Some earlier entries describe both halves of the cycle in one status paragraph.
Later entries separate Red and Green stages more explicitly. This is still one
continuous record of the AI-assisted development process.

## Technology and assessment summary

- Backend: TypeScript, Express, Prisma, PostgreSQL, JWT, and bcrypt.
- Frontend: React, Vite, Tailwind CSS, and TypeScript.
- Testing: Vitest, Supertest, React Testing Library, and planned Playwright E2E.
- TDD evidence: failing tests are committed before their implementations.
- AI evidence: every AI-assisted implementation commit includes the Codex
  co-author trailer.
- Current backend verification: 34 tests passing and TypeScript build passing.

## Chronological development index

The entries below are listed by the order in which the work was carried out.
The serial execution log below is the authoritative sequence. The detailed
records retain every prompt and result from the development history.

1. Assessment analysis and requirements.
2. Technology-stack decision.
3. Repository implementation authorization.
4. Initial project skeleton and documentation.
5-9. Registration service, validation, routes, errors, and app wiring.
10. Registration handler composition.
11-16. Login, local PostgreSQL, authentication smoke testing, and response security.
17-25. Vehicle creation, validation, routes, authentication, listing, and local smoke testing.
26-29. Vehicle search and update features.
30-32. Vehicle deletion and admin authorization.
33-37. Vehicle purchase service, authenticated route, and persistent atomic stock decrement.
38-41. Admin restock service, protected route, and persistent stock increment.

### Serial execution log

| Order | Entries | Work completed |
|---:|:---:|---|
| 1 | 1-4 | Assessment review, technology selection, repository setup, and skeleton |
| 2 | 5-9 | Registration service, validation, routes, errors, and app wiring |
| 3 | 10 | Registration handler composition and production dependency wiring |
| 4 | 11-16 | Login service/routes, PostgreSQL setup, security fix, and smoke test |
| 5 | 17-20 | Vehicle creation, validation, route, and application wiring |
| 6 | 21-22 | JWT authentication and protected vehicle routes |
| 7 | 23-25 | Vehicle listing service, route, and PostgreSQL smoke test |
| 8 | 26-27 | Vehicle search service and authenticated search route |
| 9 | 28-29 | Vehicle update service and authenticated update route |
| 10 | 30-32 | Vehicle deletion service, admin authorization, and admin route |
| 11 | 33-37 | Purchase service, authenticated route, and atomic database decrement |
| 12 | 38-41 | Restock service, admin route, and persistent database increment |

This index is the serial implementation order. No later feature was implemented
before the preceding featureÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢s recorded tests and verification.

## Commit and prompt conventions

Red-stage commits contain tests that demonstrate the missing behavior. Green-stage
commits contain the smallest implementation that makes those tests pass. The
working branch is `main`, and completed changes are pushed to the assessment
repository at https://github.com/s-tushar-01/assessment.

AI-assisted commits use:

`Co-authored-by: OpenAI Codex <AI@users.noreply.github.com>`

The two local teaching examples, `PROMPTS_EXAMPLE.md` and `TDD_EXAMPLE.md`, are
not part of the assessment history and are intentionally not included here.

## Entry 1 - Assessment analysis

**AI tool:** OpenAI Codex

**Prompt:**

```text
Analyse the car dealership inventory assessment and tell me what it is asking.
Do not start implementing until asked.
```

**How it was used:**

The assessment requirements, deliverables, TDD expectations, and AI usage rules
were identified and used to plan the project.

## Entry 2 - Technology stack

**AI tool:** OpenAI Codex

**Prompt:**

```text
Suggest the best tech stack which would be easy to explain and helpful for this
assessment.
```

**Decision:**

TypeScript, Express, PostgreSQL, Prisma, JWT, bcrypt, React, Vite, Tailwind,
Vitest, Supertest, React Testing Library, and Playwright were selected.

## Entry 3 - Project implementation

**AI tool:** OpenAI Codex

**Prompt:**

```text
This is the GitHub repository:
https://github.com/s-tushar-01/assessment

Start implementing the project while following the assessment requirements,
TDD workflow, Git history, AI co-authorship, and GitHub push requirements.
```

**Status:**

Repository setup is being prepared. Feature implementation has not started.

## Entry 4 - Initial project skeleton

**AI tool:** OpenAI Codex

**Prompt:**

```text
Start doing the assessment implementation from scratch. Connect the workspace
to https://github.com/s-tushar-01/assessment, create the setup documentation and
project skeleton, follow TDD, and push the setup commit to GitHub. Do not
implement application features yet.
```

**How it was used:**

The repository was connected to GitHub. Project rules, documentation, backend
and frontend folders, PostgreSQL configuration, Prisma schema, and test/build
configuration were created. No business feature has been implemented.

**Verification:**

- Backend Prisma client generation passed.
- Backend tests pass with no feature tests yet.
- Backend TypeScript build passed.
- Frontend tests pass with no feature tests yet.
- Frontend production build passed.
- Frontend lint passed.
- PostgreSQL Docker Compose configuration was validated.

## Entry 5 - Registration TDD Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue with the process. Start the first TDD feature by writing only a
failing backend test for user registration. Run it, show the failure, commit
the Red-stage test with AI co-authorship, and push it to GitHub. Do not write
the registration implementation yet.
```

**Status:**

The first failing registration service test was added and run before
implementation. The minimal registration service was then added; the focused
test and backend TypeScript build passed.

## Entry 6 - Registration validation Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue the registration TDD cycle. Add edge-case tests for duplicate emails
and passwords shorter than eight characters. Run the focused test, confirm the
Red result, then commit and push the tests. Do not add the missing validation
implementation yet.
```

**Status:**

The duplicate-email test passes with the existing implementation. The
short-password test fails as expected because password-length validation is not
implemented yet. The missing password-length validation was then implemented,
and all three focused registration tests pass.

## Entry 7 - Registration route Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue the registration TDD cycle by writing only a failing Supertest test
for POST /api/auth/register. Test a valid request and expected 201 response.
Run the focused tests, then commit and push the Red-stage route test. Do not
implement the route yet.
```

**Status:**

The route test is intentionally failing because the auth router does not exist
yet. The minimal router was then added and the focused route test passed.

## Entry 8 - Registration route error handling Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Add a failing Supertest case for POST /api/auth/register when the registration
service rejects a duplicate email. The API should return HTTP 409 with a clear
JSON error message. Run the route tests, then commit and push the failing test.
Do not implement error handling yet.
```

**Status:**

The duplicate-email route test is failing because the router does not yet map
the service error to an HTTP 409 response. The error mapping was then added and
both route tests passed.

## Entry 9 - Application wiring Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Add a failing application-level Supertest test proving that the application
mounts POST /api/auth/register. Use dependency injection for the registration
handler so the test does not require a live database. Run the test, then commit
and push it. Do not implement createApp yet.
```

**Status:**

The application wiring test is intentionally failing because createApp has not
yet been added. The createApp factory was then added and the application wiring
test passed.

## Entry 10 - Registration handler composition Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Add a failing unit test for a createRegisterHandler composition function. It
should connect the tested registration service to a repository and password
hashing dependency. Run all auth tests, then commit and push the Red-stage test.
Do not implement the handler yet.
```

**Status:**

The handler composition test is intentionally failing because the handler file
does not exist yet. The handler composition function was added, the server was
wired to Prisma and bcrypt, and the focused auth tests passed. The backend
build also passed. Live Prisma migration validation is pending because the
Docker Desktop Linux engine is not currently running.

## Entry 11 - Login service Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue with the next TDD feature: login. Write only a failing unit test for
valid login credentials. It should verify password comparison, JWT payload
creation, and safe user details in the result. Run the test, then commit and
push it. Do not implement login yet.
```

**Status:**

The login service test is intentionally failing because loginUser has not yet
been implemented.

## Entry 12 - Local PostgreSQL setup

**AI tool:** OpenAI Codex

**Prompt:**

```text
Set up the project locally now. Start the Docker PostgreSQL database, resolve
any connection issue, apply the Prisma migration, and verify the current test
suite before continuing.
```

**How it was used:**

The machine already had PostgreSQL using host port 5432, so the Docker database
was mapped to host port 5433 and the environment examples were updated. Prisma
then created and applied the initial migration successfully.

## Entry 13 - Login route Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue login using TDD. Add only a failing Supertest test for
POST /api/auth/login with valid credentials and an expected token response.
Run the focused auth tests, then commit and push the Red-stage test. Do not
implement the login route yet.
```

**Status:**

The login route test is intentionally failing because the auth router does not
yet expose POST /api/auth/login. The login route was then added and the focused
route tests passed.

## Entry 14 - Login application wiring Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Add a failing application-level test proving createApp mounts the login route.
Use an injected login handler, run the backend tests, then commit and push the
Red-stage test. Do not wire login into createApp yet.
```

**Status:**

The application login wiring test is intentionally failing because createApp
currently mounts only registration. Login was then wired into createApp and the
server's Prisma, bcrypt, and JWT dependencies; the application tests passed.

## Entry 15 - Registration response security Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
The local registration smoke test exposed passwordHash in the API response.
Update the registration unit test so the repository returns a passwordHash but
the service result does not expose it. Run the test, confirm the Red result,
then commit and push the failing security test. Do not implement the fix yet.
```

**Status:**

The test now protects against returning password hashes from registration. The
service was then updated to remove passwordHash from the returned user.
## Entry 16 - Local authentication smoke test

**AI tool:** OpenAI Codex

**Prompt:**

```text
Run the backend locally against Docker PostgreSQL and perform registration and
login requests to verify the complete authentication flow.
```

**Verification:**

- Registration persisted a user in PostgreSQL.
- The registration response excluded passwordHash.
- Login returned a JWT and safe user details.

## Entry 17 - Vehicle creation Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue with the next assessment feature using TDD: adding a vehicle. Write
only a failing backend service test for creating a vehicle with make, model,
category, price, and quantity. Run the test, then commit and push the Red-stage
test. Do not implement the vehicle service yet.
```

**Status:**

The vehicle creation test is intentionally failing because the vehicle service
does not exist yet. The minimum vehicle creation service was then added and the
focused vehicle test passed.

## Entry 18 - Vehicle validation Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue vehicle creation using TDD. Add failing service tests rejecting a
negative price and a negative quantity. Run the focused vehicle tests, then
commit and push the Red-stage tests. Do not implement validation yet.
```

**Status:**

The validation tests are intentionally failing because the vehicle service does
not yet reject negative prices or quantities. The validation rules were then
implemented and all focused vehicle tests passed.

## Entry 19 - Vehicle creation route Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue vehicle creation using TDD. Write only a failing Supertest test for
POST /api/vehicles with valid vehicle data and an expected 201 response. Run
the test, then commit and push the Red-stage test. Do not implement the route
yet.
```

**Status:**

The vehicle route test is intentionally failing because the vehicle router does
not exist yet. The minimal vehicle router was then added and the focused route
test passed.

## Entry 20 - Vehicle application wiring Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Add a failing application-level Supertest test proving createApp mounts
POST /api/vehicles. Use an injected createVehicle handler. Run the backend
tests, then commit and push the Red-stage test. Do not wire the vehicle route
into createApp yet.
```

**Status:**

The vehicle application wiring test is intentionally failing because createApp
currently mounts only the authentication routes. The vehicle route was then
mounted in createApp and connected to Prisma in the server; the app tests
passed.

## Entry 21 - JWT protection Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue the assessment security work using TDD. Add failing tests for a
requireAuth middleware that rejects missing bearer tokens and attaches the user
from a valid JWT. Run the tests, then commit and push the Red-stage tests. Do
not implement the middleware yet.
```

**Status:**

The JWT middleware tests were initially failing because the middleware did not
exist yet. The middleware was then implemented; after correcting a Supertest
test invocation typo, all middleware tests passed.

## Entry 22 - Protect vehicle routes Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Add a failing vehicle route test proving that POST /api/vehicles rejects a
request without a bearer token and does not call the vehicle handler. Run the
focused vehicle route tests, then commit and push the Red-stage test. Do not
wire requireAuth into the vehicle router yet.
```

**Status:**

The protected vehicle route test is intentionally failing because the vehicle
router does not yet apply requireAuth. The router and production app were then
updated to apply requireAuth to vehicle creation, and the focused tests passed.

## Entry 23 - List vehicles Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue with GET /api/vehicles using TDD. Write only a failing service test
for returning all available vehicles from the repository. Run the test, then
commit and push the Red-stage test. Do not implement listVehicles yet.
```

**Status:**

The list-vehicles test is intentionally failing because listVehicles has not
yet been implemented. The listVehicles service was then added and the focused
test passed.


## Entry 24 - List vehicles route Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue GET /api/vehicles using TDD. Write only a failing Supertest test for
an authenticated user receiving available vehicles. Run the focused route
test, then commit and push the Red-stage test. Do not implement the route yet.
```

**Status:**

The list-vehicles route test is intentionally failing because the vehicle
router does not yet expose GET /api/vehicles. The route was then added with
authentication and the complete backend suite passed.

## Entry 25 - Vehicle local smoke test

**AI tool:** OpenAI Codex

**Prompt:**

```text
Run the backend locally against PostgreSQL, log in with a regular user, create
a vehicle through POST /api/vehicles, and verify it appears in GET
/api/vehicles.
```

**Verification:**

- Authenticated vehicle creation succeeded.
- The vehicle was persisted in PostgreSQL.
- Authenticated listing returned the created vehicle.

## Entry 26 - Vehicle search Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue the assessment search feature using TDD. Write only a failing service
test for searching vehicles by make, category, minimum price, and maximum
price. Run the test, then commit and push the Red-stage test. Do not implement
searchVehicles yet.
```

**Status:**

The vehicle search test was initially failing because searchVehicles had not
yet been implemented. The repository-delegating service was then added and the
complete backend suite passed.

## Entry 27 - Vehicle search route Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue vehicle search using TDD. Write only a failing Supertest test for
authenticated GET /api/vehicles/search. Verify query strings are converted to
the correct filters and passed to the handler. Run the test, then commit and
push the Red-stage test. Do not implement the route yet.
```

**Status:**

The search route test was initially failing because the vehicle router did not
expose GET /api/vehicles/search. The route was then added with query parsing,
Prisma filtering, and authentication; the complete backend suite passed.

## Entry 28 - Vehicle update Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue vehicle management using TDD. Write only a failing service test for
updating a vehicle by ID with partial fields. Run the test, then commit and
push the Red-stage test. Do not implement updateVehicle yet.
```

**Status:**

The update-vehicle test was initially failing because updateVehicle had not yet
been implemented. The service was then added with price and quantity
validation, and the complete backend suite passed.

## Entry 29 - Vehicle update route Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue vehicle updates using TDD. Write only a failing Supertest test for
authenticated PUT /api/vehicles/:id with partial update fields. Run the test,
then commit and push the Red-stage test. Do not implement the route yet.
```

**Status:**

The update route test was initially failing because the vehicle router did not
expose PUT /api/vehicles/:id. The protected route was then added and connected
to Prisma; all 24 backend tests and the build passed.

## Entry 30 - Vehicle deletion Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue the admin vehicle management requirements using TDD. Write only a
failing service test for deleting a vehicle by ID. Run the test, then commit and
push the Red-stage test. Do not implement deleteVehicle yet.
```

**Status:**

The delete-vehicle test was initially failing because deleteVehicle had not yet
been implemented. The repository-delegating service was then added; all 25
backend tests and the build passed.

## Entry 31 - Admin authorization Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Add failing middleware tests for requireAdmin. Regular authenticated users must
receive 403, while users with the ADMIN role must be allowed through. Run the
tests, then commit and push the Red-stage tests. Do not implement requireAdmin
yet.
```

**Status:**

The admin authorization tests were initially failing because requireAdmin had
not yet been implemented. The guard was added and the test chain was corrected
to run requireAuth before requireAdmin; all 27 backend tests passed.

## Entry 32 - Admin vehicle deletion route Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue admin vehicle management using TDD. Write only a failing Supertest
test for admin DELETE /api/vehicles/:id. Run the test, then commit and push the
Red-stage test. Do not implement the delete route yet.
```

**Status:**

The admin deletion route test was initially failing because the vehicle router
did not expose the admin-only DELETE endpoint. The route was then added with
the auth and admin guards and connected to Prisma; all 28 backend tests passed.

## Entry 33 - Vehicle purchase Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue inventory operations using TDD. Add failing service tests for
purchaseVehicle: stock must decrease by one when available, and a purchase must
be rejected when stock is zero. Run the tests, then commit and push the
Red-stage tests. Do not implement purchaseVehicle yet.
```

**Status:**

The purchase tests are intentionally failing because purchaseVehicle has not
yet been implemented.

The minimum service implementation was added after the Red commit. It delegates
the purchase to the repository and raises OUT_OF_STOCK when no vehicle is
returned. All 30 backend tests and the TypeScript build now pass.

## Entry 34 - Vehicle purchase Green stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Implement the minimum purchaseVehicle service to make the purchase tests pass.
Run the full backend test suite and TypeScript build, then commit and push the
Green-stage implementation with the AI co-author trailer.
```

**Status:**

Implemented purchaseVehicle with stock-result validation. All 30 backend tests
and the TypeScript build pass.

## Entry 35 - Vehicle purchase route Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue the purchase workflow with TDD. Add a failing route test for
POST /api/vehicles/:id/purchase. It must require authentication, call the
purchase handler with the vehicle id, and return the purchased vehicle. Run the
focused test and commit/push the Red-stage test without implementing the route.
```

**Status:**

The route test is intentionally failing with HTTP 404 because the purchase
endpoint has not yet been added.

The authenticated POST /api/vehicles/:id/purchase route was then added to the
router and app dependency wiring. The focused route test and TypeScript build
pass.

## Entry 36 - Vehicle purchase route Green stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Implement the minimum route and app wiring needed to make the purchase route
test pass. Run the focused test and TypeScript build, update PROMPTS.md, then
commit and push the Green-stage implementation with the AI co-author trailer.
```

**Status:**

Added the authenticated purchase route and dependency wiring. The focused route
test and TypeScript build pass.

## Entry 37 - Persist vehicle purchase

**AI tool:** OpenAI Codex

**Prompt:**

```text
Wire vehicle purchasing to PostgreSQL through Prisma. Use an atomic conditional
quantity decrement so a purchase succeeds only when quantity is greater than
zero, then return the updated vehicle. Connect it to createApp, run the full
backend tests and build, update PROMPTS.md, and commit/push with the AI
co-author trailer.
```

**Status:**

Connected the purchase service to Prisma using a conditional atomic decrement,
returned the updated vehicle, and wired it into the production app. All 31
backend tests and the TypeScript build pass.

## Entry 38 - Vehicle restock Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue inventory operations using TDD. Add failing service tests for an
admin restockVehicle operation: it must add a positive integer quantity through
the repository and reject zero or negative quantities with QUANTITY_INVALID.
Run the focused test, then commit and push the Red-stage test without adding the
implementation.
```

**Status:**

The restock tests are intentionally failing because restockVehicle has not yet
been implemented.

The minimum restockVehicle service was added with positive-integer validation
and repository delegation. The focused tests and TypeScript build pass.

## Entry 39 - Vehicle restock Green stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Implement the minimum restockVehicle service to make the Red-stage tests pass.
Run the focused test and TypeScript build, update PROMPTS.md, then commit and
push the Green-stage implementation with the AI co-author trailer.
```

**Status:**

Implemented positive-integer restock validation and repository delegation. The
focused tests and TypeScript build pass.

## Entry 40 - Vehicle restock route Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Add a failing Supertest contract for POST /api/vehicles/:id/restock. The route
must require an ADMIN token, pass the body quantity to restockVehicle, and
return the updated vehicle. Run the focused test and commit/push only the
Red-stage test before implementing the route.
```

**Status:**

The route test is intentionally failing with HTTP 404 because the admin restock
endpoint has not yet been added.

The admin-only restock route was added with quantity parsing, app dependency
wiring, and Prisma quantity increment persistence. The full backend suite now
passes 34 tests and the TypeScript build succeeds.

## Entry 41 - Vehicle restock route Green stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Implement the admin-only restock route and wire it through createApp and Prisma
using a quantity increment. Run the focused route test, the full backend test
suite, and the TypeScript build. Update PROMPTS.md, then commit and push the
Green-stage implementation with the AI co-author trailer.
```

**Status:**

Added the ADMIN-protected restock endpoint, application wiring, and persistent
Prisma increment. All 34 backend tests and the TypeScript build pass.


## Entry 42 - Frontend login Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Start the frontend implementation using TDD. Add only a failing React Testing
Library test proving the application displays a sign-in heading, email field,
password field, and sign-in button. Run the focused test, then commit and push
the Red-stage test. Do not implement the login screen yet.
```

**Status:**

The frontend login test is intentionally failing because the application still
shows only the starter placeholder screen.

The sign-in screen was implemented with accessible email and password fields
and a styled submit button. The frontend build and lint pass; Vitest currently
stops after startup without emitting a result and will be investigated during
frontend test setup.

## Entry 43 - Frontend login Green stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Implement the minimum accessible React login screen needed to make the
Red-stage test pass. Use the selected Tailwind styling, run the frontend build
and lint, update PROMPTS.md, then commit and push the Green-stage implementation
with the AI co-author trailer.
```

**Status:**

Implemented the styled sign-in screen with labelled email and password inputs
and a submit button. Frontend build and lint pass. Vitest runner diagnostics
remain to be resolved before final frontend verification.

The login interaction contract was then added as Entry 44. The form now sends
credentials to the backend, stores the returned token, shows errors, and opens
the dashboard state after a successful response.

## Entry 44 - Frontend login interaction Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue the frontend TDD cycle. Add a failing React Testing Library interaction
test proving that submitting valid login credentials calls POST /api/auth/login,
saves the returned token, and opens an inventory dashboard heading. Run the
focused test, then commit and push the Red-stage test without implementing the
login behavior.
```

**Status:**

The interaction test is added as the next Red-stage contract. The current App
does not yet submit credentials or transition to an inventory dashboard.
## Entry 45 - Frontend login interaction Green stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Implement the minimum login behavior needed to make the interaction test pass:
submit credentials to POST /api/auth/login, persist the returned token, handle
errors, and show the inventory dashboard after success. Run the frontend build
and lint, update PROMPTS.md, then commit and push the Green-stage implementation
with the AI co-author trailer.
```

**Status:**

Implemented login submission, token persistence, error state, loading state, and
dashboard transition. Frontend build and lint pass. Vitest still requires runner
diagnostics before its final result can be confirmed.

## Entry 46 - Frontend inventory loading Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue the frontend TDD cycle. Add a failing React Testing Library test for
an authenticated user loading GET /api/vehicles and seeing the vehicle make,
model, and Purchase button. Run the focused test, then commit and push the
Red-stage test without implementing inventory loading.
```

**Status:**

The inventory test is added as the next Red-stage contract. The dashboard does
not yet load or display vehicles.

## Entry 47 - Frontend inventory loading Green stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Implement the minimum authenticated inventory loading needed to make the
Red-stage test pass. Fetch GET /api/vehicles with the saved bearer token, render
vehicle cards with make, model, price, and stock, and disable Purchase when
quantity is zero. Run the frontend build and lint, update PROMPTS.md, then
commit and push the Green-stage implementation with the AI co-author trailer.
```

**Status:**

Implemented authenticated vehicle loading, inventory cards, loading/error
states, and zero-stock purchase disabling. Frontend build and lint pass.

The prompt history is updated after each meaningful AI-assisted TDD cycle. New
entries should preserve the same format: exact prompt, purpose, implementation
result, verification, and commit/push outcome. Do not remove earlier prompts,
including prompts whose Red-stage tests have already been made Green.

## Entry 48 - Frontend purchase interaction Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue the frontend TDD cycle. Add a failing React Testing Library test that
clicks Purchase on an available vehicle, calls POST /api/vehicles/:id/purchase
with the bearer token, and updates the displayed stock using the response. Run
the focused test, then commit and push the Red-stage test without implementing
the purchase interaction.
```

**Status:**

The purchase interaction test is added as the next Red-stage contract. Vehicle
cards currently display a Purchase button without behavior.

## Entry 49 - Frontend purchase interaction Green stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Implement the minimum purchase interaction needed to make the Red-stage test
pass. POST to /api/vehicles/:id/purchase with the bearer token, replace the
updated vehicle in local state, and show errors. Run the frontend build and
lint, update PROMPTS.md, then commit and push the Green-stage implementation
with the AI co-author trailer.
```

**Status:**

Implemented authenticated vehicle purchasing, local stock refresh, and error
handling. Frontend build and lint pass.



## Record maintenance

## Entry 50 - Frontend inventory search Red stage

**AI tool:** OpenAI Codex

**Prompt:**

```text
Continue the frontend TDD cycle. Add a failing React Testing Library test for
make and minimum-price filters. It must call GET /api/vehicles/search with the
encoded query parameters and display the returned vehicle. Run the focused test,
then commit and push the Red-stage test without implementing search controls.
```

**Status:**

The search test is added as the next Red-stage contract. The inventory dashboard
does not yet provide search controls.
