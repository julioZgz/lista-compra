/* dismantle.js — Desmantelar naves: devuelve el 50% del coste (DSP) al planeta hogar, con cantidad elegible en la caja de cada nave (Flota).
 * Lee/Escribe: S.fleet y recursos de S.cs[0] (vía R). Estado propio de sesión, no se guarda: DSQ (cantidad elegida por tipo de nave).
 * NO debe: tocar colas, Firebase ni fórmulas de rules. Acoplamientos: toast, change (como actions).
 */
const DSP=.5;let DSQ={e:1,c:1,r:1};
const dsRet=(t,n)=>{const r={};for(const k of['m','c','g'])r[k]=Math.floor((SH[t].b[k]||0)*DSP*n);return r};
const dsFix=t=>DSQ[t]=Math.max(1,Math.min(DSQ[t]||1,S.fleet[t]));
const dsLab=t=>{const n=DSQ[t]|0;return n>0?`Desmantelar ${n} · +${Object.entries(dsRet(t,n)).map(([x,v])=>fmt(v)+' '+RN[x].toLowerCase()).join(', ')}`:'Elige una cantidad'};
function dsUpd(t){const i=$('#dq'+t),b=$('#db'+t);if(i&&+i.value!==DSQ[t])i.value=DSQ[t];if(b){b.textContent=dsLab(t);b.disabled=!(DSQ[t]>0)}}
function dsStep(t,d){DSQ[t]=Math.max(1,Math.min(S.fleet[t],(DSQ[t]|0)+d));dsUpd(t)}
function dsIn(t,v){DSQ[t]=Math.max(0,Math.min(Math.floor(+v||0),S.fleet[t]));dsUpd(t)}
function dsAll(t){DSQ[t]=S.fleet[t];dsUpd(t)}
function dsEx(t){if(!(S.fleet[t]>0))return'';const n=dsFix(t);
return `<div class=st style="margin-top:10px">Desmantelar: recuperas el ${Math.round(DSP*100)}% del coste en ${U(S.cs[0].id).name}.</div><div style="display:flex;gap:6px;align-items:center;margin-top:6px"><button class=tab type=button onclick="dsStep('${t}',-1)">−</button><input id=dq${t} type=number inputmode=numeric min=1 max=${S.fleet[t]} value=${n} style="width:64px" oninput="dsIn('${t}',this.value)"><button class=tab type=button onclick="dsStep('${t}',1)">+</button><button class=tab type=button onclick="dsAll('${t}')">Todas</button></div><button id=db${t} class=go style="margin-top:8px;background:#e8a86a" onclick="dismantle('${t}')">${dsLab(t)}</button>`}
function dismantle(t){const n=Math.min(DSQ[t]|0,S.fleet[t]);if(n<1)return;const h=S.cs[0],c=dsRet(t,n),nm=`${n} × ${SH[t].n.toLowerCase()}`;
if(!confirm(`¿Desmantelar ${nm}? Recibirás en ${U(h.id).name}: ${c.m} de metal, ${c.c} de cristal y ${c.g} de gas (el ${Math.round(DSP*100)}% del coste). No se puede deshacer.`))return;
S.fleet[t]-=n;for(const k in c)R(h)[k]+=c[k];toast(`Desmantelados ${nm}: +${c.m} de metal, ${c.c} de cristal y ${c.g} de gas en ${U(h.id).name}`);const y=window.scrollY;change();window.scrollTo(0,y)}
