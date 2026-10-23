# Assumptions

All data synthetic. CLI demo only, trusted authenticated principal passed out of band; no public identity service. Currency USD minor units. One automatic refund per order, maximum 5000 minor units and never above order value; subsequent refund requests escalate. Refunds only for delivered orders within 30 days of purchase. Address changes and reschedules only for pending orders. Dates use UTC and fixed replay time.

The mock store API is an in-process API boundary backed by PostgreSQL, not a real retailer or external HTTP service. Its idempotency ledger commits with its mutation. Simulated failures cover both precommit rollback and lost response after commit. No real refunds or messages.

Claude can propose intents; deterministic guards remain authoritative. Mock-provider replay measures this synthetic policy and fixture set, not Claude quality or a production resolution rate. No paid model calls. Unclear mixed-language requests escalate.

Owner/site placeholders resolved to verified umair24171 and umair24171/dev_umair. Cloud uses supplemental PGlite because Docker/native Postgres are unavailable. Native PostgreSQL CI remains unverified until repository creation and push are available.
