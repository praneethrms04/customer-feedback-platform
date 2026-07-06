# Engineering Decision Log

## 1. Why did you choose this technology stack?

**Next.js (App Router) + Express + MongoDB + Tailwind CSS + shadcn/ui.**

- Next.js gives SSR, file-based routing, and API routes out of the box — a natural fit for a product that needs both public pages and an authenticated admin panel.
- Express is minimal and well-understood; separating it from Next.js keeps the backend decoupled, testable, and deployable independently.
- MongoDB (with Mongoose) was chosen for its flexible schema — feedback entries have varying optional fields and the data shape evolves quickly during early development. No migrations needed.
- Tailwind + shadcn/ui provide a polished, accessible component library with zero design debt. shadcn delivers production-grade components (modals, selects, toasts) without locking us into a heavy framework.

## 2. Why did you choose this database?

**MongoDB (via Mongoose ODM).**

Feedback data is document-oriented: each submission is a self-contained record with nested metadata (rating, category, status history). A relational schema would require JOINs for what is naturally a single document. MongoDB's schema-less nature also meant we could add fields like `status` mid-development without a migration. The trade-off is weaker consistency guarantees and no built-in referential integrity, but those aren't critical for a feedback collection system.

## 3. Why did you structure your application this way?

**Monorepo with `client/` (Next.js) and `server/` (Express) as separate packages.**

- **Separation of concerns**: The API is a standalone Express app that can be tested, versioned, and deployed without tying it to the frontend framework.
- **Feature-based frontend**: `client/features/feedback/` keeps the form component, validation schema, and API client co-located, making it easy to find and modify.
- **Layered backend**: Controllers handle HTTP, services hold business logic, models define data shape — each layer can be tested in isolation.
- **Next.js App Router**: Each route is a self-contained directory; error, loading, and layout boundaries are co-located with the page they affect.

## 4. What trade-offs did you make due to time constraints?

- **No E2E tests**: Only unit/integration tests on the server. The frontend has no tests.
- **No CI/CD pipeline**: Manual deployment only.
- **No Docker**: Environment setup is manual.
- **Minimal monitoring**: Winston logging with no APM, alerting, or structured error aggregation.
- **No pagination on the public form**: The admin panel paginates; the submission endpoint is unbounded.
- **Star rating is a `<select>`**: Interactive star widgets exist in the dependency set (shadcn) but weren't implemented.
- **Password hashing uses bcrypt's defaults**: No cost parameter tuning for production.

## 5. What would you improve if you had one more week?

1. **E2E tests with Playwright** covering the full submit → admin review → status update flow.
2. **Rate limiting with Redis** instead of in-memory (doesn't survive server restart and doesn't work across instances).
3. **Admin notification system** — real-time toast when new feedback arrives (SSE or WebSocket).
4. **File/image upload** for feedback attachments.
5. **Interactive star rating component** to replace the dropdown.
6. **Docker Compose** setup (MongoDB + API + Client) for one-command development.
7. **CSV export** of feedback data from the admin panel.

## 6. What was the most difficult technical challenge you faced?

**Jest mocking of Mongoose models with TypeScript.**

Mongoose models are complex objects (constructor, prototype methods, static methods). Setting up `jest.mock()` to return the right mock functions without TypeScript screaming about types — while also ensuring that `mockResolvedValueOnce` chains from `beforeEach` don't leak between tests — was surprisingly fiddly. The `jest.resetAllMocks()` vs `jest.clearAllMocks()` distinction (the former clears implementation queues, the latter does not) caused two test failures that took several iterations to diagnose.

## 7. Which AI tools did you use?

Claude (opencode).

## 8. Share one instance where AI helped you.

Setting up the JWT authentication flow — the AI generated the `authService.ts`, `authController.ts`, middleware, route wiring, and the client-side auth provider in a single coherent pass, correctly handling asyncHandler wrappers, cookie vs header token extraction, and TypeScript types across the full stack. Doing this manually would have taken multiple rounds of debugging mismatches between frontend and backend.

## 9. Share one instance where you disagreed with AI and why.

The AI initially wrote the client-side auth provider as a plain `.jsx` file. When the TypeScript build failed, the AI attempted to rename it to `.tsx` but the import path in the admin layout wasn't updated, causing a compile error. I disagreed with the AI's quick-fix approach — it should have verified all import references before applying the rename. The correct approach was to plan the rename and update all consumers in a single operation.

## 10. What would break first if this application suddenly had 100,000 users?

1. **In-memory rate limiter** — It's per-process; would reset on every restart and not work across multiple server instances. A Redis-backed store would be needed.
2. **MongoDB without indexing** — The analytics aggregation pipeline scans all documents. Without indexes on `createdAt`, `status`, and `category`, queries would degrade quickly.
3. **No connection pooling tuning** — Mongoose defaults may exhaust connection limits under load.
4. **No CDN or caching** — All assets and API responses hit the origin server directly.
5. **Single-process Express** — No clustering or horizontal scaling configured.

## 11. What is one thing in this assignment that you would improve, change, or challenge?

The feedback assignment doesn't specify a data retention policy or GDPR/privacy considerations. For a production system, there should be a requirement to:
- Anonymize or delete feedback after a configurable period
- Allow users to request deletion of their submissions
- Log consent for data collection
- Exclude PII (name, email) from analytics exports

This should be part of the specification rather than an afterthought, because retrofitting privacy into a live system is significantly harder than designing for it from the start.
