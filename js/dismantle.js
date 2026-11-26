/* dismantle.js — Desmantelar naves: botón en cada nave de Flota + modal de cantidad (qtyOpen, de ui-core); devuelve el 50% del coste (DSP) al planeta hogar.
 * Lee/Escribe: S.fleet y recursos de S.cs[0] (vía R). Estado propio de sesión, no se guarda: DSM (tipo y cantidad del modal abierto).
 * NO debe: tocar colas, Firebase ni fórmulas de rules. Acoplamientos: toast, change, closeM, qtyOpen (como actions/raids).
 */
const DSP=.5;let DSM=null;
const dsRet=(t,n)=>{const r={};for(const k of['m','c','g'])r[k]=Math.floor((SH[t].b[k]||0)*DSP*n);return r};
const dsPl=(t,n)=>{const s=SH[t].n.toLowerCase();return n===1?s:SH[t].pl||s+(/[aeiou]$/.test(s)?'s':'es')};
const dsTxt=(t,n)=>Object.entries(dsRet(t,n)).map(([x,v])=>fmt(v)+' '+RN[x].toLowerCase()).join(', ');
function dsUpd(){$('#dsr').textContent=dsTxt(DSM.t,DSM.n)}
function dsEx(t){return S.fleet[t]>0?`<button class=go style="margin-top:8px;background:#e8a86a" onclick="dsOpen('${t}')">Desmantelar</button>`:''}
function dsOpen(t){if(!(S.fleet[t]>0))return;DSM={t,n:1};
qtyOpen({t:`Desmantelar ${SH[t].n.toLowerCase()}`,i:`Disponibles ${S.fleet[t]} · recuperas el ${Math.round(DSP*100)}% del coste en ${U(S.cs[0].id).name}, al instante`,
rows:[{x:'<div class=st>Recibirás: <b id=dsr></b></div>',mn:1,mx:()=>S.fleet[DSM.t],get:()=>DSM.n,set:v=>{DSM.n=Math.max(1,Math.min(S.fleet[DSM.t],Math.floor(+v||1)))},fm:n=>n+' '+dsPl(DSM.t,n)}],gt:'Desmantelar',go:'dsSend()',u:dsUpd})}
function dsSend(){const t=DSM.t,n=DSM.n;DSM=null;closeM();dismantle(t,n)}
function dismantle(t,n){n=Math.min(n|0,S.fleet[t]);if(n<1)return;const h=S.cs[0],c=dsRet(t,n);S.fleet[t]-=n;for(const k in c)R(h)[k]+=c[k];
toast(`Desmantelad${SH[t].fm?(n===1?'a':'as'):(n===1?'o':'os')} ${n} ${dsPl(t,n)}: +${c.m} de metal, ${c.c} de cristal y ${c.g} de gas en ${U(h.id).name}`);const y=window.scrollY;change();window.scrollTo(0,y)}
