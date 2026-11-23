/* raids.js — Saqueos y misiones de corsarios: raid, modal de envío (MR, openRaid, mStep, mSl, sendRaid), pctN.
 * Escribe: S.fleet, S.mis (vía raid). Estado propio: MR.
 * NO debe: tocar colas de obras/investigación ni guardado.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
function raid(to,n){const u=U(to);if(S.tech.p<need(u)||n<1||S.fleet.r<n||S.mis.length>=1+S.tech.m||S.mis.some(m=>m.to===to))return;S.fleet.r-=n;
S.mis.push({k:'r',to,n,end:Date.now()+2*Math.ceil(u.dist*20/(1+.25*S.tech.p))*1000});change()}
let MR=null;
const pctN=(n,u)=>Math.round(100*Math.max(.15,Math.min(.95,.5+.15*(n-(Math.ceil(u.dist/2)+1)))));
function mUpd(){const u=U(MR.id);$('#mn').textContent=MR.n;$('#mp').textContent=pctN(MR.n,u)+'%'}
function openRaid(id){const u=U(id);if(S.fleet.r<1)return;MR={id,n:S.fleet.r};const m=$('#md');m.style.display='flex';
m.innerHTML=`<div class=card style="width:100%;max-width:420px"><b>Saquear ${u.name}</b><p class=st>Defensa ${Math.ceil(u.dist/2)+1} · ida y vuelta ${fmtT(2*Math.ceil(u.dist*20/(1+.25*S.tech.p)))}</p>
<div class=row style="margin:10px 0"><button class=tab onclick="mStep(-1)">−</button><b style="font-size:22px"><span id=mn></span> corsarios</b><button class=tab onclick="mStep(1)">+</button></div>
<div class=st>Probabilidad de éxito: <b id=mp></b></div>
<input type=range id=ms min=${pctN(1,u)} max=${pctN(S.fleet.r,u)} step=1 oninput="mSl(this.value)">
<div class=row style="gap:8px;margin-top:6px"><button class=go style="background:#26344f;color:var(--tx)" onclick="closeM()">Cancelar</button><button class=go style="background:#e8a86a" onclick="sendRaid()">Enviar</button></div></div>`;
$('#ms').value=pctN(MR.n,u);mUpd()}
function mStep(d){MR.n=Math.max(1,Math.min(S.fleet.r,MR.n+d));$('#ms').value=pctN(MR.n,U(MR.id));mUpd()}
function mSl(v){const u=U(MR.id);let n=1;while(n<S.fleet.r&&pctN(n,u)<+v)n++;MR.n=n;mUpd()}
function closeM(){$('#md').style.display='none';MR=null}
function sendRaid(){const n=MR.n,id=MR.id;closeM();raid(id,n)}
