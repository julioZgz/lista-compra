/* dismantle.js — Desmantelar naves: botón en cada nave de Flota + modal con slider (como el de saqueos); devuelve el 50% del coste (DSP) al planeta hogar.
 * Lee/Escribe: S.fleet y recursos de S.cs[0] (vía R). Estado propio de sesión, no se guarda: DSM (tipo y cantidad del modal abierto).
 * NO debe: tocar colas, Firebase ni fórmulas de rules. Acoplamientos: toast, change, closeM (como actions/raids).
 */
const DSP=.5;let DSM=null;
const dsRet=(t,n)=>{const r={};for(const k of['m','c','g'])r[k]=Math.floor((SH[t].b[k]||0)*DSP*n);return r};
const dsPl=(t,n)=>{const s=SH[t].n.toLowerCase();return n===1?s:s+(/[aeiou]$/.test(s)?'s':'es')};
const dsTxt=(t,n)=>Object.entries(dsRet(t,n)).map(([x,v])=>fmt(v)+' '+RN[x].toLowerCase()).join(', ');
function dsUpd(){$('#dsn').textContent=DSM.n+' '+dsPl(DSM.t,DSM.n);$('#dsr').textContent=dsTxt(DSM.t,DSM.n);$('#dsl').value=DSM.n}
function dsEx(t){return S.fleet[t]>0?`<button class=go style="margin-top:8px;background:#e8a86a" onclick="dsOpen('${t}')">Desmantelar</button>`:''}
function dsOpen(t){if(!(S.fleet[t]>0))return;DSM={t,n:1};const m=$('#md');m.style.display='flex';
m.innerHTML=`<div class=card style="width:100%;max-width:420px"><b>Desmantelar ${SH[t].n.toLowerCase()}</b><p class=st>Disponibles ${S.fleet[t]} · recuperas el ${Math.round(DSP*100)}% del coste en ${U(S.cs[0].id).name}, al instante</p>
<div class=row style="margin:10px 0"><button class=tab onclick="dsStep(-1)">−</button><b style="font-size:22px"><span id=dsn></span></b><button class=tab onclick="dsStep(1)">+</button></div>
<div class=st>Recibirás: <b id=dsr></b></div>
<input type=range id=dsl min=1 max=${S.fleet[t]} step=1 oninput="dsSl(this.value)">
<div class=row style="gap:8px;margin-top:6px"><button class=go style="background:#26344f;color:var(--tx)" onclick="closeM()">Cancelar</button><button class=go style="background:#e8a86a" onclick="dsSend()">Desmantelar</button></div></div>`;dsUpd()}
function dsStep(d){DSM.n=Math.max(1,Math.min(S.fleet[DSM.t],DSM.n+d));dsUpd()}
function dsSl(v){DSM.n=Math.max(1,Math.min(S.fleet[DSM.t],Math.floor(+v||1)));dsUpd()}
function dsSend(){const t=DSM.t,n=DSM.n;DSM=null;closeM();dismantle(t,n)}
function dismantle(t,n){n=Math.min(n|0,S.fleet[t]);if(n<1)return;const h=S.cs[0],c=dsRet(t,n);S.fleet[t]-=n;for(const k in c)R(h)[k]+=c[k];
toast(`Desmantelad${n===1?'o':'os'} ${n} ${dsPl(t,n)}: +${c.m} de metal, ${c.c} de cristal y ${c.g} de gas en ${U(h.id).name}`);const y=window.scrollY;change();window.scrollTo(0,y)}
