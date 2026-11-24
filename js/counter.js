/* counter.js — Contraataques rivales: tras saquear mucho un puesto, este puede devolver el golpe; se resuelve solo con el escudo y las defensas (defRed).
 * Lee/Escribe: S.cx, S.rd, S.sh, S.cs, S.ev y recursos/edificios de la colonia atacada. Lo llama engine (cxPlan en done, cxRun en advance).
 * NO debe: construir HTML, leer localStorage ni guardar. */
function cxPlan(to,n){if(n<3||Math.random()>=Math.min(.6,.15+.1*(n-3)))return;S.cx.push({from:to,n,end:Date.now()+(300+Math.random()*300)*1000})}
function cxHit(c){const p=S.cs[Math.floor(Math.random()*S.cs.length)],r=U(c.from).name,z=U(p.id).name;let x;
if(S.sh>0)x=`Contraataque de ${r} contra ${z}: el escudo lo detiene.`;
else if(Math.random()>=Math.min(.85,.3+.05*(c.n-2))*(1-defRed(p)))x=`Contraataque de ${r} contra ${z}: tus defensas lo repelen.`;
else{const pool=R(p),lo={};for(const k of['m','c','g']){lo[k]=Math.floor(pool[k]*.2);pool[k]-=lo[k]}
const ok=Object.keys(p.b).filter(k=>p.b[k]>0&&!p.dm.includes(k));let d='';if(ok.length){const k=ok[Math.floor(Math.random()*ok.length)];p.dm.push(k);d=` ${B[k].n} dañado.`}
x=`Contraataque de ${r} en ${z}: roban ${lo.m} de metal, ${lo.c} de cristal y ${lo.g} de gas.${d}`}
S.ev=x;histAdd('c',p.id,x);toast(x,p.id,'b')}
function cxRun(now,dt){if(!S.cx.length)return false;
if(dt>120){S.cx.forEach(c=>{if(c.end<=now)c.end=now+120000});return false}
let ch=false;S.cx=S.cx.filter(c=>{if(c.end>now)return true;ch=true;cxHit(c);return false});return ch}
