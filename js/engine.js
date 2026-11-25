/* engine.js — Simulación: advance(now) avanza el tiempo, termina colas y misiones, eventos (visitantes, rebeldes); newGame, genRU, sync de red.
 * Lee/Escribe: S. Acoplamientos conocidos: toast (ui-core), norm/key (storage), startNext/nextShip (actions).
 * NO debe: construir HTML ni leer localStorage.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
function sync(){S.cs.forEach(p=>{if(!p.nj&&S.tech.n>=1&&p.b.h>=1){for(const k of['m','c','g']){S.net[k]+=R(p)[k];R(p)[k]=0}p.nj=1;toast('Conectado a la red: '+U(p.id).name,p.id,'b')}})}
function newGame(){const r=rng(Date.now()),sy=['Kor','Vex','Ael','Zan','Tir','Oru','Nex','Lum','Yra','Dax','Pel','Mor'];
const u=[{id:0,name:'Hogar',dist:0,rich:[8,6,4]}];
for(let i=1;i<=14;i++){const dist=i+(i>2&&r()<.4?1:0);
u.push({id:i,name:sy[Math.floor(r()*12)]+sy[Math.floor(r()*12)].toLowerCase()+'-'+(1+Math.floor(r()*9)),dist,
rich:[0,1,2].map(()=>Math.max(2,Math.min(12,Math.round(2+r()*6+dist*.35))))})}
return{t:Date.now(),net:{m:0,c:0,g:0},u,tech:{p:0,c:0,e:0},fleet:{e:1,c:0},known:[0],mis:[],
cs:[{id:0,b:{m:1,c:1,g:0,a:0,s:0,l:0,u:0,d:0,h:0,o:0,k:0,w:0,t:0},r:{m:400,c:200,g:0}}]}}

function done(m){const u=U(m.to);
if(m.k==='x'){const kl=m.to>=100?S.rk:S.known;if(!kl.includes(m.to))kl.push(m.to);S.fleet.e++;toast('Exploración de '+u.name+' completada',null,m.to>=100?'r':'m')}
else if(m.k==='r'){const fl=mFl(m),ch=rdPct(fl,u),key='p'+m.to,cnt=S.rd[key]||0;
if(Math.random()<ch){const l=rdLoot(fl,u).real;S.rd[key]=cnt+1;S.wr[key]={w:wrW(m.to,m.end)+1,t:m.end};cxPlan(m.to,cnt+1);S.cnt.sac++;if(!S.cnt.sacT.includes(m.to))S.cnt.sacT.push(m.to);const t=S.cs[0];for(const k in l)R(t)[k]+=l[k];rdTy().forEach(x=>{S.fleet[x]=(S.fleet[x]||0)+(fl[x]||0)});
S.ev=`Saqueo en ${u.name}: botín de ${l.m} de metal, ${l.c} de cristal y ${l.g} de gas.`;if(!S.un.k&&Math.random()<.12){S.un.k=1;S.ev+=' ¡Recompensa del saqueo: has desbloqueado el Carguero!'}toast(S.ev,null,'r')}
else{const lo={};rdTy().forEach(x=>{const n=fl[x]||0,e=rdLost(n,x),i=Math.floor(e);lo[x]=Math.min(n,x==='r'?Math.ceil(e):i+(Math.random()<e-i?1:0));S.fleet[x]=(S.fleet[x]||0)+n-lo[x]});const lt=rdTy().filter(x=>lo[x]>0).map(x=>`${lo[x]} ${SH[x].n.toLowerCase()}${lo[x]>1?'s':''}`);S.ev=`Saqueo fallido en ${u.name}: `+(m.f?(lt.length?`pierdes ${lt.join(', ')}.`:'no pierdes ninguna nave.'):`pierdes ${lo.r} corsario(s).`);toast(S.ev,null,'r')}}
else if(S.cs.length<1+S.tech.c){S.cs.push({id:m.to,b:{m:0,c:0,g:0,a:0,s:0,l:0,u:0,d:0,h:0,o:0,k:0,w:0,t:0},r:{m:150,c:80,g:0}});norm(S.cs[S.cs.length-1]);toast('Nueva colonia: '+u.name,m.to,'b')}
else{S.fleet.c++;toast('No hay capacidad para colonizar '+u.name,null,'m')}}
function visitor(){const lvl=S.cs.reduce((a,p)=>a+lv(p,'p'),0);
if(!S.rf&&Math.random()<.3/(1+.1*lvl)){const q=S.cs[Math.floor(Math.random()*S.cs.length)],pool=R(q),c={};for(const k of['m','c','g'])c[k]=Math.floor(pool[k]*.15);
S.rf={pid:q.id,c,exp:Date.now()+600000};S.ev=`Llegan refugiados a ${U(q.id).name}: decide si los aceptas.`;histAdd('v',q.id,S.ev,1);toast(S.ev,q.id,'b');return}
let pw=0;S.cs.forEach(p=>{for(const k in p.b)if(k!=='v')pw+=p.b[k]});for(const k in S.tech)pw+=2*S.tech[k];
const f=(.6+Math.random()*.8)*(1+.05*lvl),g={m:Math.round((40+pw*14)*f),c:Math.round((30+pw*10)*f),g:Math.round((12+pw*4)*f)};
const p=S.cs[Math.floor(Math.random()*S.cs.length)],who=['Unos mercaderes','Unos peregrinos','Una nave a la deriva'][Math.floor(Math.random()*3)];
for(const k in g)R(p)[k]+=g[k];
S.ev=`${who} han visitado ${U(p.id).name} y dejan ${g.m} de metal, ${g.c} de cristal y ${g.g} de gas.`;histAdd('v',p.id,S.ev);toast(S.ev,p.id,'b')}
function attack(p){const n=U(p.id).name;
if(Math.random()>=rebWin(p)){p.rb=Math.max(0,p.rb-3);S.cnt.rep++;S.ev=`Ataque separatista repelido en ${n}.`;histAdd('a',p.id,S.ev);toast(S.ev,p.id,'b');return}
const pool=R(p),st={};for(const k of['m','c','g']){st[k]=Math.floor(pool[k]*.2);pool[k]-=st[k]}
const ok=Object.keys(p.b).filter(k=>p.b[k]>0&&!p.dm.includes(k));let d='';if(ok.length){const k=ok[Math.floor(Math.random()*ok.length)];p.dm.push(k);d=` ${B[k].n} dañado.`}
S.ev=`Ataque separatista en ${n}: roban ${st.m} de metal, ${st.c} de cristal y ${st.g} de gas.${d}`;histAdd('a',p.id,S.ev);toast(S.ev,p.id,'b')}
function advance(now){const dt=Math.min((now-S.t)/1000,172800);S.t=now;if(dt<=0)return false;if(S.sh>0&&dt<=120)S.sh=Math.max(0,S.sh-dt*1000);
S.cs.forEach(p=>{if(p.nj)return;for(let i=0;i<3;i++){const k='mcg'[i],c=capK(p,k);if(R(p)[k]<c)R(p)[k]=Math.min(c,R(p)[k]+prod(p,i)*dt)}});
if(S.cs.some(p=>p.nj)){const m=mem();for(let i=0;i<3;i++){const k='mcg'[i],c=m.reduce((a,p)=>a+capK(p,k),0);if(S.net[k]<c)S.net[k]=Math.min(c,S.net[k]+m.reduce((a,p)=>a+prod(p,i),0)*dt)}}
let ch=false;
S.cs.forEach(p=>{if(p.rr&&p.rr.end<=now){p.dm=p.dm.filter(x=>x!==p.rr.k);toast(`${B[p.rr.k].n} de ${U(p.id).name} reparado`,p.id,'b');delete p.rr;ch=true}
while(p.q&&p.q.end<=now){const e=p.q.end;p.b[p.q.k]++;toast(`${B[p.q.k].n} de ${U(p.id).name} mejorado`,p.id,'b');delete p.q;startNext(p,e);ch=true}
p.rb+=(rbT(p)-p.rb)*Math.min(1,dt/600);if(dt<=120&&!(S.sh>0)&&p.rb>50&&Math.random()<1-Math.exp(-dt*(p.rb-50)/45000)){attack(p);ch=true}});
S.cs.forEach(p=>{if(p.rq&&p.rq.end<=now){S.tech[p.rq.k]++;toast('Investigación completada: '+T[p.rq.k].n,p.id,'i');delete p.rq;ch=true}while(p.sq&&p.sq.end<=now){const e=p.sq.end;S.fleet[p.sq.t]++;if(p.sq.t==='r')S.cnt.cor++;toast(SH[p.sq.t].n+(SH[p.sq.t].fm?' construida':' construido'),p.id,'f');delete p.sq;nextShip(p,e);ch=true}});
S.mis=S.mis.filter(m=>{if(m.end>now)return true;ch=true;done(m);return false});if(S.rf&&S.rf.exp<=now){histRes('Los refugiados se marcharon sin que decidieras.');delete S.rf;ch=true}if(S.nv<=now){visitor();S.nv=now+(300+Math.random()*300)*1000/(1+.15*S.cs.reduce((a,p)=>a+lv(p,'p'),0));ch=true}if(evento(now,dt))ch=true;if(cxRun(now,dt))ch=true;sync();return ch}

function genRU(){const r=rng(Date.now()),sy=['Gor','Skar','Vyl','Drax','Nor','Hesk','Ruk','Thal'];return Array.from({length:8},(_,i)=>{const d=i+1+(i>1&&r()<.4?1:0);return{id:100+i,name:sy[Math.floor(r()*8)]+sy[Math.floor(r()*8)].toLowerCase()+'-R'+(i+1),dist:d,rich:[0,1,2].map(()=>Math.max(2,Math.min(12,Math.round(2+r()*6+d*.35))))}})}
