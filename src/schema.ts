import type { Query } from "./db.js";
export async function migrate(q: Query) {
  for (const s of [
    `CREATE TABLE IF NOT EXISTS orders(id text PRIMARY KEY, owner text NOT NULL, amount integer NOT NULL CHECK(amount>0), refunded integer NOT NULL DEFAULT 0 CHECK(refunded>=0 AND refunded<=amount), status text NOT NULL CHECK(status IN ('pending','shipped','delivered')), purchased_at timestamptz NOT NULL, address text NOT NULL, delivery_date date)`,
    `CREATE TABLE IF NOT EXISTS actions(key text PRIMARY KEY, fingerprint text NOT NULL, owner text NOT NULL, order_id text NOT NULL REFERENCES orders(id), kind text NOT NULL, result jsonb NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS tickets(id text PRIMARY KEY, fingerprint text NOT NULL, result jsonb)`,
    `CREATE TABLE IF NOT EXISTS audit(id bigserial PRIMARY KEY, ticket text NOT NULL, principal text NOT NULL, event text NOT NULL, detail text NOT NULL, at timestamptz NOT NULL DEFAULT now())`,
  ])
    await q.query(s);
}
