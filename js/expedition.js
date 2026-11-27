/* expedition.js — Explorar con varios exploradores: modal para elegir cuántos envías y ver el % de éxito (exOpen, exUpd, exSend, sobre qtyOpen de ui-core) y exLn, la línea de % y gasto que también usa convoy.js.
 * Lee: S.fleet y S.tech (vía rules). Escribe: nada (la orden real es send, en actions). Estado propio: EXM.
 * NO debe: tocar colas ni guardado, ni definir fórmulas (exPc/exDf están en rules).
 */
let EXM=null;
const exLn=(k,to,n)=>{const u=k==='x'?'explorador':'colonizador';return`Éxito: <b>${Math.round(100*exPc(k,to,n))} %</b> · dificultad del planeta <b>${exDf(to)}/5</b><br>Se ${n>1?'gastan':'gasta'} <b>${n}</b> ${u}${n>1?'es':''} al llegar, salga bien o mal.${k==='x'?`<br>Si sale bien, <b>${Math.round(100*exEvP())} %</b> de hallazgo (anomalía, ruinas o piratas).`:''}`};
function exUpd(){$('#exl').innerHTML=exLn('x',EXM.to,EXM.n)}
function exOpen(to){const mx=S.fleet.e;if(mx<1)return;EXM={to,n:1};
qtyOpen({t:`Explorar ${to>=100?'un puesto rival':'un planeta'}`,i:`Tienes ${mx} explorador${mx>1?'es':''}. Con varios, la probabilidad total sube (Espionaje ${S.tech.s||0}).`,
rows:[{x:'<div class=st id=exl style="margin-bottom:8px"></div>',mn:1,mx:()=>S.fleet.e,get:()=>EXM.n,set:v=>{EXM.n=Math.max(1,Math.min(S.fleet.e,Math.floor(+v||1)))}}],gt:'Explorar',go:'exSend()',gm:10,u:exUpd})}
function exSend(){const t=EXM.to,n=EXM.n;EXM=null;closeM();send('x',t,null,n)}
