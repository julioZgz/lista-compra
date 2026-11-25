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
const repC=(p,k)=>Object.fromEntries(Object.entries(cost(B[k].b,B[k].f,p.b[k]-1)).map(([x,v])=>[x,Math.ceil(v/10)])),repT=(p,k)=>Math.max(5,Math.round(.25*tB(k,Math.max(0,p.b[k]-1),p)*(1-.15*(S.tech.h||0))));
const CM={m:1,c:.75,g:.5},capK=(p,k)=>Math.round(CM[k]*cap(p)),capN=(p,k)=>p.nj?mem().reduce((a,q)=>a+capK(q,k),0):capK(p,k),prodN=(p,i)=>p.nj?mem().reduce((a,q)=>a+prod(q,i),0):prod(p,i);
const maxL=(p,k)=>k in IDX?U(p.id).rich[IDX[k]]:B[k].max;
const tot=()=>{const r={m:0,c:0,g:0};S.cs.forEach(p=>{if(!p.nj)for(const k in r)r[k]+=p.r[k]});for(const k in r)r[k]+=S.net[k]||0;return r};
const slots=()=>1+(S.tech.q||0),used=p=>(p.q?1:0)+(p.bq||[]).length,sUsed=p=>(p.sq?1:0)+(p.sqq||[]).length;
const vb=p=>{const b={...p.b};if(p.q)b[p.q.k]++;(p.bq||[]).forEach(it=>b[it.k]++);return b};
const need=u=>Math.max(0,Math.ceil((u.dist-2)/2));
const rdPct=(fl,u)=>Math.max(.15,Math.min(.95,.5+.15*(rdPw(fl)*(1+.1*(S.tech.a||0))-(Math.ceil(u.dist/2)+1)))),rdLost=(n,t)=>n*SH[t].ls*(50-10*(S.tech.f||0))/5000;
const RDN=10,wrW=(id,now=Date.now())=>{const e=S.wr&&S.wr['p'+id];return e?e.w*Math.max(0,Math.min(1,1-(now-e.t)/864e5)):0},wrP=id=>Math.round(100*(1-Math.pow(.85+.03*(S.tech.r||0),wrW(id))));
const rdLoot=(fl,u)=>{const f=Math.pow(.85+.03*(S.tech.r||0),wrW(u.id)),mx={},real={};let t=0;[0,1,2].forEach(i=>{const v=Math.round(RDN*(40+25*u.dist)*u.rich[i]/6*f*(i===2?.5:1));mx['mcg'[i]]=v;t+=v});const cp=Math.round(rdCg(fl)*(1+.25*(S.tech.b||0))),q=Math.min(1,cp/Math.max(1,t));for(const k in mx)real[k]=Math.round(mx[k]*q);return{mx,real,t,cap:cp}};
const trq=(k,L)=>k==='f'&&S.cnt.sac<3*(L+1)?`Requiere ${3*(L+1)} saqueos exitosos (llevas ${S.cnt.sac})`:k==='r'&&S.cnt.sacT.length<L+2?`Requiere haber saqueado con éxito ${L+2} planetas rivales distintos (llevas ${S.cnt.sacT.length})`:k==='v'&&trN()?'Requiere '+trN():k==='i'&&trC(L)?'Requiere '+trC(L):k==='h'&&(S.cnt.rp||0)<[3,8,15,25][L]?`Requiere ${[3,8,15,25][L]} reparaciones (llevas ${S.cnt.rp||0})`:'';
const trN=()=>[['b',5],['a',5],['f',3],['r',3]].filter(([k,m])=>(S.tech[k]||0)<m).map(([k,m])=>`${T[k].n} ${m} (tienes ${S.tech[k]||0})`).join(', ');
const rdTy=()=>Object.keys(SH).filter(t=>SH[t].pw),rdN=fl=>rdTy().reduce((a,t)=>a+(fl[t]||0),0),rdPw=fl=>rdTy().reduce((a,t)=>a+(fl[t]||0)*SH[t].pw,0),rdCg=fl=>rdTy().reduce((a,t)=>a+(fl[t]||0)*SH[t].cg,0);
const mFl=m=>m.f||{r:m.n},mTx=m=>m.f&&Object.keys(m.f).some(t=>t!=='r')?m.n+' naves':m.n+' corsarios';
const shUn=t=>t==='f'?S.cnt.sac>=10:t==='k'?!!(S.un&&S.un.k):t==='a'?(S.tech.v||0)>=1:true;
const shUnT=t=>t==='f'?`Se desbloquea con 10 saqueos exitosos (llevas ${S.cnt.sac})`:t==='k'?'Se consigue como recompensa al saquear con éxito':t==='a'?'Se desbloquea investigando Ingeniería naval':'';
const trC=L=>['c','p'].filter(k=>(S.tech[k]||0)<2*(L+1)).map(k=>`${T[k].n} ${2*(L+1)} (tienes ${S.tech[k]||0})`).join(', '),cvMax=()=>[0,500,1500,3000][S.tech.i||0]||0;
const SUC=500,SUR={tot:.1,par:.2,lo:[.3,.7],ship:.3},spT=to=>Math.ceil(Math.max(1,U(to).dist)*20/(1+.25*S.tech.p)*1.5),spTx=m=>' ('+m.n+(m.n>1?' naves':' nave')+')';
