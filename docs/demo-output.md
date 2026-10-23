# Recorded native and Docker demo output

All data synthetic. [Verified Actions run](https://github.com/umair24171/support-resolution-agent/actions/runs/40030071043). No hosting deployment.

## Native PostgreSQL demo

```text
##[group]Run npm run demo
npm run demo
shell: /usr/bin/bash -e {0}
env:
  DATABASE_URL: ***localhost:5432/portfolio
##[endgroup]

> buildzn-support-resolution-agent@0.1.0 demo
> node --import tsx src/demo.ts

All data synthetic. No real store or money.
Guarded tool result: {
  status: 'resolved',
  action: { orderId: 'synthetic-demo-order', kind: 'refund', amount: 1000 }
}
Idempotent replay: {
  action: { kind: 'refund', amount: 1000, orderId: 'synthetic-demo-order' },
  status: 'resolved'
}
Order state: [ { id: 'synthetic-demo-order', refunded: 1000 } ]
Audit: [
  {
    ticket: 'ticket',
    event: 'tool-error',
    detail: 'Valid tool clock required'
  },
  {
    ticket: 'synthetic-demo-ticket',
    event: 'action',
    detail: '{"orderId":"synthetic-demo-order","kind":"refund","amount":1000}'
  }
]
```

## Docker Compose demo

```text
app-1  |
app-1  | > buildzn-support-resolution-agent@0.1.0 demo
app-1  | > node --import tsx src/demo.ts
app-1  |
app-1  | All data synthetic. No real store or money.
app-1  | Guarded tool result: {
app-1  |   status: 'resolved',
app-1  |   action: { orderId: 'synthetic-demo-order', kind: 'refund', amount: 1000 }
app-1  | }
app-1  | Idempotent replay: {
app-1  |   action: { kind: 'refund', amount: 1000, orderId: 'synthetic-demo-order' },
app-1  |   status: 'resolved'
app-1  | }
app-1  | Order state: [ { id: 'synthetic-demo-order', refunded: 1000 } ]
app-1  | Audit: [
app-1  |   {
app-1  |     ticket: 'synthetic-demo-ticket',
app-1  |     event: 'action',
app-1  |     detail: '{"orderId":"synthetic-demo-order","kind":"refund","amount":1000}'
app-1  |   }
app-1  | ]
```
