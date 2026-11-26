/* raids.js — Saqueos y misiones de corsarios: raid, modal de envío (MR, openRaid, mUpd, sendRaid) sobre el componente qtyOpen de ui-core, pctN.
 * Escribe: S.fleet, S.mis (vía raid). Estado propio: MR (flota elegida por modelo).
 * NO debe: tocar colas de obras/investigación ni guardado.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
function raid(to,f){const u=U(to),n=rdN(f);if(S.tech.p<need(u)||n<1||rdTy().some(t=>(f[t]||0)<0||(S.fleet[t]||0)<(f[t]||0))||S.mis.length>=1+S.tech.m||S.mis.some(m=>m.to===to))return;
const fl={};rdTy().forEach(t=>{if(f[t]>0){fl[t]=f[t];S.fleet[t]-=f[t]}});
S.mis.push({k:'r',to,n,f:fl,end:Date.now()+2*Math.ceil(u.dist*20/(1+.25*S.tech.p))*1000});change()}
let MR=null;
const pctN=(f,u)=>Math.round(100*rdPct(f,u));
const mFix=t=>{if(rdN(MR.f)<1)MR.f[t]=1};
function mUpd(){const u=U(MR.id),r=rdLoot(MR.f,u);const pc=pctN(MR.f,u);$('#mp').textContent=pc+'%';$('#mp').style.color=semC(pc,70,40);$('#mxm').textContent=fmt(r.t);$('#mxc').textContent=fmt(r.cap);$('#mxr').textContent=`${fmt(r.real.m)} metal · ${fmt(r.real.c)} cristal · ${fmt(r.real.g)} gas${r.cap<r.t?' (limitado por la carga)':''}`}
function openRaid(id){const u=U(id),h={};rdTy().forEach(t=>{if(S.fleet[t]>0)h[t]=S.fleet[t]});const ts=Object.keys(h);if(!ts.length)return;MR={id,f:{...h}};
qtyOpen({t:`Saquear ${u.name}`,i:`Defensa ${rdDef(u)} · ida y vuelta ${fmtT(2*Math.ceil(u.dist*20/(1+.25*S.tech.p)))}`,
rows:ts.map(t=>({h:ts.length>1?`<div class=st style="margin-top:8px">${SH[t].n} · poder ${SH[t].pw} · carga ${SH[t].cg} · disponibles ${h[t]}</div>`:'',mn:ts.length>1?0:1,mx:()=>S.fleet[t],get:()=>MR.f[t],set:v=>{MR.f[t]=Math.max(0,Math.min(S.fleet[t],Math.floor(+v||0)));mFix(t)},fm:n=>n+' '+SH[t].n.toLowerCase()+'s'})),
post:`<div class=st style="margin-top:8px">Probabilidad de éxito: <b id=mp></b></div>
<div class=st>Robo máximo del planeta: <b id=mxm></b></div><div class=st>Capacidad de carga: <b id=mxc></b></div><div class=st>Robo real: <b id=mxr></b></div>`,gt:'Enviar',go:'sendRaid()',u:mUpd})}
function closeM(){$('#md').style.display='none';MR=null}
function sendRaid(){const f={...MR.f},id=MR.id;closeM();raid(id,f)}
