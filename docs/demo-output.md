# Recorded demo output

All data synthetic. Actual command: `TEST_PGLITE=1 npm run demo`. Embedded PostgreSQL. Native Docker demo remains unverified.

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

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
    ticket: 'synthetic-demo-ticket',
    event: 'action',
    detail: '{"orderId":"synthetic-demo-order","kind":"refund","amount":1000}'
  }
]
```
