/* actions.js — Órdenes del jugador: construir, investigar, naves, reparar, cancelar colas, refugiados, enviar, abandonar, aceleradores.
 * Escribe: S; casi todas terminan en change() (dirty + render). Pueden llamar a toast.
 * NO debe: guardar en Firebase directamente ni definir fórmulas (están en rules).
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
function change(){dirty=true;render()}
function reval(p){const b={...p.b};if(p.q)b[p.q.k]++;const keep=[];let n=0;(p.bq||[]).forEach(it=>{if(it.L===b[it.k]&&it.L<maxL(p,it.k)&&!RQ(p,it.k,it.L+1,b).length){b[it.k]++;keep.push(it)}else{for(const x in it.c)R(p)[x]+=it.c[x];n++}});p.bq=keep;if(n)toast(`Se cancelaron ${n} obra(s) en cola de ${U(p.id).name} que ya no se podían hacer (materiales devueltos)`,p.id,'b')}
function startNext(p,t){reval(p);if(!p.q&&p.bq.length){const it=p.bq.shift();p.q={k:it.k,end:t+tB(it.k,it.L,p)*1000,c:it.c}}}
const nextShip=(p,t)=>{if(!p.sq&&p.sqq&&p.sqq.length){const it=p.sqq.shift();p.sq={t:it.t,end:t+tS(it.t,p)*1000,c:it.c}}};
function build(k){const p=P(SP),b=vb(p),L=b[k];if(used(p)>=slots()||p.dm.includes(k)||L>=maxL(p,k)||RQ(p,k,L+1,b).length)return;const c=cost(B[k].b,B[k].f,L);if(!afford(R(p),c))return;for(const x in c)R(p)[x]-=c[x];
if(!p.q)p.q={k,end:Date.now()+tB(k,L,p)*1000,c};else p.bq.push({k,L,c});change()}
function cancelQ(i){const p=P(SP),it=p.bq[i];if(!it)return;for(const x in it.c)R(p)[x]+=it.c[x];p.bq.splice(i,1);reval(p);change()}
function cancelSQ(i){const p=P(SP),it=p.sqq[i];if(!it)return;for(const x in it.c)R(p)[x]+=it.c[x];p.sqq.splice(i,1);change()}
function research(k){const p=P(SP),L=S.tech[k];if(p.rq||S.cs.some(q=>q.rq&&q.rq.k===k)||L>=T[k].max||lv(p,'l')<L+1||trq(k,L))return;const c=cost(T[k].b,T[k].f,L);if(!afford(R(p),c))return;for(const x in c)R(p)[x]-=c[x];p.rq={k,end:Date.now()+tT(k,L,p)*1000,c};change()}
function ship(t){const p=P(SP),d=SH[t];if(!shUn(t)||sUsed(p)>=slots()||lv(p,'s')<d.s||!afford(R(p),d.b))return;for(const x in d.b)R(p)[x]-=d.b[x];if(!p.sq)p.sq={t,end:Date.now()+tS(t,p)*1000,c:d.b};else p.sqq.push({t,c:d.b});change()}
function repair(k){const p=P(SP);if(p.rr||!p.dm.includes(k))return;const c=repC(p,k);if(!afford(R(p),c))return;for(const x in c)R(p)[x]-=c[x];p.rr={k,end:Date.now()+repT(p,k)*1000,c};change()}
function accel(){const p=P(SP),r=p.rr;if(!r||r.acc)return;const c=repC(p,r.k);if(!afford(R(p),c))return;for(const x in c){R(p)[x]-=c[x];r.c[x]=(r.c[x]||0)+c[x]}r.acc=1;r.end=Date.now()+Math.max(0,r.end-Date.now())/2;change()}
function cancelRR(){const p=P(SP);if(!p.rr)return;for(const x in p.rr.c)R(p)[x]+=p.rr.c[x];delete p.rr;change()}
function refugee(a){const f=S.rf;if(!f)return;const p=P(f.pid);delete S.rf;
if(a&&p){const pool=R(p);for(const k in f.c)pool[k]=Math.max(0,pool[k]-f.c[k]);p.rb=Math.max(0,p.rb-8);p.rb0=Math.max(0,p.rb0-2);S.cnt.ref++;S.ev=`Has acogido a los refugiados en ${U(p.id).name}: baja la rebelión.`}else S.ev='Has rechazado a los refugiados.';histRes(S.ev);toast(S.ev);change()}
function cancelB(){const p=P(SP);if(!p.q)return;for(const x in p.q.c)R(p)[x]+=p.q.c[x];delete p.q;startNext(p,Date.now());change()}
function cancelR(){const h=P(SP);if(!h.rq)return;for(const x in h.rq.c)R(h)[x]+=h.rq.c[x];delete h.rq;change()}
function cancelS(){const p=P(SP);if(!p.sq)return;for(const x in p.sq.c)R(p)[x]+=p.sq.c[x];delete p.sq;nextShip(p,Date.now());change()}
function send(k,to,res){const u=U(to);let rs=null;if(S.tech.p<need(u)||S.mis.length>=1+S.tech.m)return;
if(k==='x'){if(S.fleet.e<1)return;S.fleet.e--}
else{if(S.fleet.c<1||S.cs.length+S.mis.filter(m=>m.k==='c').length>=1+S.tech.c)return;rs=cvTake(res);S.fleet.c--}
const ms={k,to,end:Date.now()+Math.ceil(u.dist*20/(1+.25*S.tech.p))*1000};if(rs){ms.res=rs;ms.o=SP}S.mis.push(ms);change()}

function refundOf(p){const r={m:0,c:0,g:0};for(const k in B)for(let l=0;l<p.b[k];l++){const c=cost(B[k].b,B[k].f,l);for(const x in c)r[x]+=Math.floor(c[x]/2)}for(const x in r)r[x]+=Math.floor(R(p)[x]);for(const q of[p.q,p.rq,p.sq,p.rr])if(q)for(const x in q.c)r[x]+=q.c[x];return r}
function abandon(){const p=P(SP);if(!p||!p.id||S.mis.some(m=>m.to===p.id))return toast('No puedes abandonarla con misiones en curso hacia ella');const r=refundOf(p);
if(!confirm(`Abandonar ${U(p.id).name}? Recibirás en ${U(S.cs[0].id).name}: ${r.m} de metal, ${r.c} de cristal y ${r.g} de gas (la mitad de lo invertido en edificios más lo almacenado). No se puede deshacer.`))return;
for(const x in r)R(S.cs[0])[x]+=r[x];S.cs=S.cs.filter(c=>c.id!==p.id);dirty=true;selPlanet(S.cs[0].id)}
/* Guardado en Firebase */
function useAcc(kind){const p=P(SP),q=p[kind];if(!q||S.acc<1)return;S.acc--;q.end=Date.now()+Math.max(0,q.end-Date.now())/2;change()}
