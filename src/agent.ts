import {createHash} from 'node:crypto';import type {Database} from './db.js';import {validate,type Intent,type IntentProvider} from './provider.js';
export interface Ticket{id:string;principal:string;verified:boolean;orderId?:string;text:string}
export type Result={status:'resolved';action:Record<string,unknown>}|{status:'escalated';reason:string};
const hash=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
export class MockStoreAPI{
 constructor(private db:Database){}
 async apply(t:Ticket,intent:Exclude<Intent,{kind:'escalate'}>,now:string,fault?:'before-commit'|'lost-response'){
 const key=`ticket:${t.id}:action`,fingerprint=hash([t.principal,t.orderId,intent]);
 const result=await this.db.tx(async q=>{
  if(!t.verified)throw new Error('Identity not verified');
  const [o]=await q.query('SELECT * FROM orders WHERE id=$1 FOR UPDATE',[t.orderId]);if(!o||o.owner!==t.principal)throw new Error('Order not accessible');
  const [prior]=await q.query('SELECT * FROM actions WHERE key=$1',[key]);if(prior){if(prior.owner!==t.principal||prior.fingerprint!==fingerprint)throw new Error('Conflicting idempotency key');return prior.result;}
  if(intent.kind==='refund'){
   if(intent.amount>5000||intent.amount>o.amount)throw new Error('Refund exceeds limit');if(o.refunded>0)throw new Error('Already refunded');
   const age=Date.parse(now)-new Date(o.purchased_at).getTime();if(o.status!=='delivered'||age<0||age>30*86400000)throw new Error('Refund policy denied');
   await q.query('UPDATE orders SET refunded=$2 WHERE id=$1',[o.id,intent.amount]);
  }else{
   if(o.status!=='pending')throw new Error('Order already shipped');
   if(intent.kind==='address')await q.query('UPDATE orders SET address=$2 WHERE id=$1',[o.id,intent.address]);
   else{if(Date.parse(intent.date)<=Date.parse(now))throw new Error('Future date required');await q.query('UPDATE orders SET delivery_date=$2 WHERE id=$1',[o.id,intent.date]);}
  }
  const action={orderId:o.id,...intent};await q.query('INSERT INTO actions VALUES($1,$2,$3,$4,$5,$6)',[key,fingerprint,t.principal,o.id,intent.kind,JSON.stringify(action)]);
  await q.query('INSERT INTO audit(ticket,principal,event,detail) VALUES($1,$2,$3,$4)',[t.id,t.principal,'action',JSON.stringify(action)]);
  if(fault==='before-commit')throw new Error('Tool failure before commit');return action;
 });
 if(fault==='lost-response')throw new Error('Tool timeout after commit');return result;
 }
}
export class SupportAgent{
 constructor(private db:Database,private provider:IntentProvider,private store=new MockStoreAPI(db)){}
 async resolve(t:Ticket,now='2026-01-20T00:00:00Z',fault?:'before-commit'|'lost-response'):Promise<Result>{
 const fingerprint=hash(t);
 const escalate=async(reason:string):Promise<Result>=>{await this.db.query('INSERT INTO audit(ticket,principal,event,detail) VALUES($1,$2,$3,$4)',[t.id,t.principal,'escalation',reason]);return {status:'escalated',reason};};
 if(!t.id||!t.principal||!t.verified||!t.orderId||!t.text.trim()||t.text.length>20000)return escalate('Missing verified identity, order ID or valid text');
 await this.db.query('INSERT INTO tickets(id,fingerprint) VALUES($1,$2) ON CONFLICT DO NOTHING',[t.id,fingerprint]);
 const [prior]=await this.db.query('SELECT * FROM tickets WHERE id=$1',[t.id]);if(prior!.fingerprint!==fingerprint)return escalate('Conflicting ticket input');
 if(prior!.result)return prior!.result as Result;
 try{
  const intent=validate(await this.provider.propose(t.text));if(intent.kind==='escalate')return escalate(intent.reason);
  const action=await this.store.apply(t,intent,now,fault);const result:Result={status:'resolved',action};
  await this.db.query('UPDATE tickets SET result=$2 WHERE id=$1',[t.id,JSON.stringify(result)]);return result;
 }catch(e){return escalate(e instanceof Error?e.message:'Unknown tool failure');}
 }
}
