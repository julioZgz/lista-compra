/* expedition.js — Explorar con varios exploradores: modal para elegir cuántos envías y ver el % de éxito (exOpen, exStep, exSl, exSend) y exLn, la línea de % y gasto que también usa convoy.js.
 * Lee: S.fleet y S.tech (vía rules). Escribe: nada (la orden real es send, en actions). Estado propio: EXM.
 * NO debe: tocar colas ni guardado, ni definir fórmulas (exPc/exDf están en rules).
 */
let EXM=null;
const exLn=(k,to,n)=>{const u=k==='x'?'explorador':'colonizador';return`Éxito: <b>${Math.round(100*exPc(k,to,n))} %</b> · dificultad del planeta <b>${exDf(to)}/5</b><br>Se ${n>1?'gastan':'gasta'} <b>${n}</b> ${u}${n>1?'es':''} al llegar, salga bien o mal.`};
function exUpd(){$('#exn').textContent=EXM.n;$('#exs').value=EXM.n;$('#exl').innerHTML=exLn('x',EXM.to,EXM.n)}
function exOpen(to){const mx=S.fleet.e;if(mx<1)return;EXM={to,n:1};const m=$('#md');m.style.display='flex';
m.innerHTML=`<div class=card style="width:100%;max-width:420px"><b>Explorar ${to>=100?'un puesto rival':'un planeta'}</b><p class=st>Tienes ${mx} explorador${mx>1?'es':''}. Con varios, la probabilidad total sube (Espionaje ${S.tech.s||0}).</p>
<div class=row style="margin:10px 0"><button class=tab onclick="exStep(-1)">−</button><b style="font-size:22px"><span id=exn></span></b><button class=tab onclick="exStep(1)">+</button></div>
<div class=st id=exl style="margin-bottom:8px"></div><input type=range id=exs min=1 max=${mx} step=1 oninput="exSl(this.value)">
<div class=row style="gap:8px;margin-top:10px"><button class=go style="background:#26344f;color:var(--tx)" onclick="closeM()">Cancelar</button><button class=go style="background:#e8a86a" onclick="exSend()">Explorar</button></div></div>`;
exUpd()}
function exStep(d){EXM.n=Math.max(1,Math.min(S.fleet.e,EXM.n+d));exUpd()}
function exSl(v){EXM.n=Math.max(1,Math.min(S.fleet.e,Math.floor(+v||1)));exUpd()}
function exSend(){const t=EXM.to,n=EXM.n;EXM=null;closeM();send('x',t,null,n)}
