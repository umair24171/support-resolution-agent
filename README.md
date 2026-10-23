# Work in progress: Support resolution agent

Synthetic BuildZn portfolio project. Tickets produce guarded store actions, not just replies. Ownership, refund policy, idempotency and audit records are enforced in a PostgreSQL-backed mock store API. No real refunds, store integration or messages.

```mermaid
flowchart TD
  A[Verified ticket principal] --> B[Untrusted intent provider]
  B --> C[Validate proposed intent]
  C --> D[Guarded mock store API]
  D --> E[Transactional mutation and idempotency ledger]
  C --> F[Human escalation]
  D --> F
  E --> G[Audit and replay evaluation]
```

## Run

Node 24 and Docker Compose:

```sh
git clone <repository-url>
cd support-resolution-agent
docker compose up -d db
npm ci
DATABASE_URL=postgres://portfolio:synthetic-local-only@localhost:55432/portfolio npm run demo
```

Or `docker compose up --build --abort-on-container-exit --exit-code-from app`. The synthetic local database password is public demo configuration. Tests truncate data; use disposable databases. Replay fixtures require a fresh database, and running replay twice against the same database intentionally rejects duplicate fixture IDs.

```sh
npm run build
DATABASE_URL=postgres://portfolio:synthetic-local-only@localhost:55432/portfolio npm test
DATABASE_URL=postgres://portfolio:synthetic-local-only@localhost:55432/portfolio npm run replay
```

Supplemental cloud path: `TEST_PGLITE=1 npm test`, `TEST_PGLITE=1 npm run demo`, `TEST_PGLITE=1 npm run replay`. Each default embedded invocation creates a new in-memory database.

## Measured results

33 tests passed, zero failed or skipped, on embedded PostgreSQL. TypeScript check passed. Synthetic replay: 160 tickets, 50 resolved (31.25%), 110 escalated (68.75%), zero wrong-action/state/label mismatches. docs/test-output.txt and docs/replay-output.txt contain the real output. These are 16 policy templates with 10 distinct synthetic identities per template. They are a regression fixture set, not a representative customer-service benchmark. Rates use the deterministic mock, not Claude. Native PostgreSQL concurrency and Docker CI remain pending; no green Actions claim.

## Tradeoffs and limits

The mock store is an in-process API boundary with atomic action and ledger commits. Lost-response tests simulate a remote timeout after commit; no HTTP store service is included. A real provider must implement the same persistent idempotency semantics. One automatic refund per order is conservative; partial follow-up refunds escalate. The verified principal is supplied by a trusted caller; this CLI has no public auth server. Never take identity from ticket text or model output.

Known injection phrases escalate early, but regex detection is not the security boundary. Even a malicious intent provider cannot select a different order or bypass ownership, amount and policy guards. Draft text and tool proposals are untrusted. Broader semantic injection and model quality remain unevaluated. Malicious requests within ordinary policy bounds cannot be reliably distinguished from ordinary requests by this fixture suite alone.

Audit records are append-only in application code; database administrators can alter them. The replay reports wrong-action/state/label mismatches together, a stricter fixture regression count than wrong writes alone. See docs/PLAN.md, docs/ASSUMPTIONS.md and docs/BLOCKERS.md. Claude adapter needs ANTHROPIC_API_KEY and CLAUDE_MODEL only when explicitly constructed; no paid calls were run.
