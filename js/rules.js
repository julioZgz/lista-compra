/* rules.js — Fórmulas del juego: costes, tiempos, producción, capacidad, rebelión/defensa, requisitos, huecos de cola.
 * Lee: S. Escribe: nada. Sin DOM.
 * NO debe: mutar S, llamar a toast/render ni tocar storage.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
const tB=(k,L,p)=>Math.max(5,Math.round(BT[k]*Math.pow(1.5,L)/ef(p)));
const tT=(k,L,p)=>Math.max(5,Math.round(90*Math.pow(1.8,L)/(1+.15*lv(p,'l'))/ef(p)));
const tS=(t,p)=>Math.max(5,Math.round(ST[t]/(1+.15*lv(p,'s'))/ef(p)));
const cost=(b,f,L)=>Object.fromEntries(Object.entries(b).map(([k,v])=>[k,Math.round(v*Math.pow(f,L))]));
const cap=p=>Math.round(1000*Math.pow(1.7,p.dm&&p.dm.includes('a')?Math.floor(p.b.a/2):p.b.a));
const prod=(p,i)=>{const L=lv(p,'mcg'[i]);return K[i]*(L*Math.pow(1.15,L)*(1+.1*S.tech.e+.05*(lv(p,'u')+lv(p,'d')))+.2)*(p.st>Date.now()?.5:1)};
const lv=(p,k)=>p.dm&&p.dm.includes(k)?0:p.b[k];
const rbT=p=>Math.max(0,Math.min(100,p.rb0+1.5*(p.b.m+p.b.c+p.b.g)-4*(lv(p,'o')+lv(p,'k'))));
const defRed=p=>Math.min(.9,.04*lv(p,'w')+.06*lv(p,'t')),rebWin=p=>Math.max(.05,Math.min(.95,.5+(p.rb-50)/100+(p.b.m+p.b.c+p.b.g)/100))*(1-defRed(p));
const RQ=(p,k,tL,b=p.b)=>{const o=[],nd=(x,n)=>{if((b[x]||0)<n)o.push(`${B[x].n} ${n}`)};
if(!'zok'.includes(k))nd('z',tL-2);
if(k in IDX&&tL>1&&(b.a||0)<10)nd('a',Math.ceil(tL/2));
if(k==='l')nd('u',tL-2);
if(k==='h'){nd('a',5);nd('s',1)}
if(k==='p'){nd('a',4);nd('s',2)}
if(k==='w')nd('m',3);
if(k==='v')nd('l',2);
if((k==='w'||k==='t')&&tL>2*(S.tech.d||0))o.push(`Ingeniería defensiva ${Math.ceil(tL/2)}`);
if((k==='a'||k==='d')&&tL>2*(S.tech.l||0))o.push(`Logística ${Math.ceil(tL/2)}`);
if(k==='t'){nd('l',4);nd('w',tL)}
return o};
const reqTxt=k=>(!'zok'.includes(k)?' Máx. nivel: Centro de mando + 2.':'')+({m:' Máx. nivel: el doble del Almacén (sin límite con Almacén 10).',c:' Máx. nivel: el doble del Almacén (sin límite con Almacén 10).',g:' Máx. nivel: el doble del Almacén (sin límite con Almacén 10).',l:' Máx. nivel: Universidad + 2.',h:' Requiere Almacén 5 y Astillero 1.',v:' Requiere Laboratorio 2.',p:' Requiere Almacén 4 y Astillero 2.',w:' Requiere Mina de metal 3. Máx. nivel: el doble de Ingeniería defensiva.',a:' Máx. nivel: el doble de Logística.',d:' Máx. nivel: el doble de Logística.',t:' Requiere Laboratorio 4 y nivel igual o menor que las Murallas. Máx. nivel: el doble de Ingeniería defensiva.'}[k]||'');
const repC=(p,k)=>Object.fromEntries(Object.entries(cost(B[k].b,B[k].f,p.b[k]-1)).map(([x,v])=>[x,Math.ceil(v/10)])),repT=(p,k)=>Math.max(30,Math.round(300/ef(p)));
const CM={m:1,c:.75,g:.5},capK=(p,k)=>Math.round(CM[k]*cap(p)),capN=(p,k)=>p.nj?mem().reduce((a,q)=>a+capK(q,k),0):capK(p,k),prodN=(p,i)=>p.nj?mem().reduce((a,q)=>a+prod(q,i),0):prod(p,i);
const maxL=(p,k)=>k in IDX?U(p.id).rich[IDX[k]]:B[k].max;
const tot=()=>{const r={m:0,c:0,g:0};S.cs.forEach(p=>{if(!p.nj)for(const k in r)r[k]+=p.r[k]});for(const k in r)r[k]+=S.net[k]||0;return r};
const slots=()=>1+(S.tech.q||0),used=p=>(p.q?1:0)+(p.bq||[]).length,sUsed=p=>(p.sq?1:0)+(p.sqq||[]).length;
const vb=p=>{const b={...p.b};if(p.q)b[p.q.k]++;(p.bq||[]).forEach(it=>b[it.k]++);return b};
const need=u=>Math.max(0,Math.ceil((u.dist-2)/2));
