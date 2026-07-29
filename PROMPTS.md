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
