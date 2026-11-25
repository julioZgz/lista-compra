/* raids.js — Saqueos y misiones de corsarios: raid, modal de envío (MR, openRaid, mStep, mSl, sendRaid), pctN.
 * Escribe: S.fleet, S.mis (vía raid). Estado propio: MR (flota elegida por modelo).
 * NO debe: tocar colas de obras/investigación ni guardado.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
function raid(to,f){const u=U(to),n=rdN(f);if(S.tech.p<need(u)||n<1||rdTy().some(t=>(f[t]||0)<0||(S.fleet[t]||0)<(f[t]||0))||S.mis.length>=1+S.tech.m||S.mis.some(m=>m.to===to))return;
const fl={};rdTy().forEach(t=>{if(f[t]>0){fl[t]=f[t];S.fleet[t]-=f[t]}});
S.mis.push({k:'r',to,n,f:fl,end:Date.now()+2*Math.ceil(u.dist*20/(1+.25*S.tech.p))*1000});change()}
let MR=null;
const pctN=(f,u)=>Math.round(100*rdPct(f,u));
const mFix=t=>{if(rdN(MR.f)<1)MR.f[t]=1};
function mUpd(){const u=U(MR.id),r=rdLoot(MR.f,u);for(const t in MR.f){$('#mn'+t).textContent=MR.f[t];$('#ms'+t).value=MR.f[t]}$('#mp').textContent=pctN(MR.f,u)+'%';$('#mxm').textContent=fmt(r.t);$('#mxc').textContent=fmt(r.cap);$('#mxr').textContent=`${fmt(r.real.m)} metal · ${fmt(r.real.c)} cristal · ${fmt(r.real.g)} gas${r.cap<r.t?' (limitado por la carga)':''}`}
function openRaid(id){const u=U(id),h={};rdTy().forEach(t=>{if(S.fleet[t]>0)h[t]=S.fleet[t]});const ts=Object.keys(h);if(!ts.length)return;MR={id,f:{...h}};const m=$('#md');m.style.display='flex';
m.innerHTML=`<div class=card style="width:100%;max-width:420px"><b>Saquear ${u.name}</b><p class=st>Defensa ${Math.ceil(u.dist/2)+1} · ida y vuelta ${fmtT(2*Math.ceil(u.dist*20/(1+.25*S.tech.p)))}</p>
${ts.map(t=>`${ts.length>1?`<div class=st style="margin-top:8px">${SH[t].n} · poder ${SH[t].pw} · carga ${SH[t].cg} · disponibles ${h[t]}</div>`:''}<div class=row style="margin:10px 0"><button class=tab onclick="mStep('${t}',-1)">−</button><b style="font-size:22px"><span id=mn${t}></span> ${SH[t].n.toLowerCase()}s</b><button class=tab onclick="mStep('${t}',1)">+</button></div><input type=range id=ms${t} min=${ts.length>1?0:1} max=${h[t]} step=1 oninput="mSl('${t}',this.value)">`).join('')}
<div class=st style="margin-top:8px">Probabilidad de éxito: <b id=mp></b></div>
<div class=st>Robo máximo del planeta: <b id=mxm></b></div><div class=st>Capacidad de carga: <b id=mxc></b></div><div class=st>Robo real: <b id=mxr></b></div>
<div class=row style="gap:8px;margin-top:6px"><button class=go style="background:#26344f;color:var(--tx)" onclick="closeM()">Cancelar</button><button class=go style="background:#e8a86a" onclick="sendRaid()">Enviar</button></div></div>`;
mUpd()}
function mStep(t,d){MR.f[t]=Math.max(Object.keys(MR.f).length>1?0:1,Math.min(S.fleet[t],MR.f[t]+d));mFix(t);mUpd()}
function mSl(t,v){MR.f[t]=Math.max(0,Math.min(S.fleet[t],Math.floor(+v||0)));mFix(t);mUpd()}
function closeM(){$('#md').style.display='none';MR=null}
function sendRaid(){const f={...MR.f},id=MR.id;closeM();raid(id,f)}
