# AI Usage Prompt History

This file records the AI-assisted development history for the assessment.
Prompts and relevant responses will be added throughout the project.

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

## Future entries

For each AI interaction, record the exact prompt, relevant response, decision,
files changed, tests run, and related commit.

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
