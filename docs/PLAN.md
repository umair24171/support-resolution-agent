# Support resolution agent plan

## Scope
Resolve synthetic store tickets through guarded refund, address change and reschedule tools. Model proposals are untrusted. Ownership, policy and limits are enforced inside transactional mock store tools. Ambiguous inputs escalate. Replay at least 150 synthetic tickets with independent expected actions.

## Data model
Store orders with trusted owner, amount, status, refund total, address and delivery date. Ticket runs keyed by ID and immutable input fingerprint. Actions with idempotency key, request fingerprint, result. Append-only audit records for allowed and denied attempts. No real store, customers or messaging.

## Tools
TypeScript CLI; PostgreSQL; mock store API backed by transactions; Claude Messages intent provider and deterministic mock provider; Node unit, integration and adversarial tests; 160-ticket replay; Docker Compose; GitHub Actions PostgreSQL service.

## Edge cases, each mapped to a named test
1. Ticket injection cannot bypass guards, even with a malicious proposal provider.
2. Someone else's order denied, including idempotency key replay.
3. Per-action refund cap and order value enforced.
4. Repeated input replays once; same ticket ID with conflicting input escalates.
5. Conflicting intent escalates.
6. Tool failure before commit rolls back; timeout after commit retries once.
7. Already refunded order escalates.
8. Missing order ID escalates.
9. Angry or abusive text never expands tool authority.
10. Mixed Urdu/English request handled or escalated safely.
11. Address change on shipped order denied; reschedule date must be future and pending.
12. Malformed provider output, missing verification, negative/noninteger amounts denied.
13. Audit emitted for success, denial and escalation. Concurrent refunds cannot exceed policy.
14. Replay metrics checked against independent synthetic labels and resulting store state.
