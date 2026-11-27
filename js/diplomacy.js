/* diplomacy.js — Diplomacia con puestos rivales: botón en Saqueos y modal para pagar un tributo que «hace olvidar» saqueos al puesto y baja el riesgo de contraataque (cxPct en rules.js).
 * Lee: S.rd, S.tr, S.tech y los recursos de la colonia seleccionada (R(P(SP))). Escribe: S.tr y esos recursos (solo en dpPay). Estado propio: DPM.
 * NO debe: tocar S.rd, S.cx ni colas; guardado; fórmulas (las de rules.js).
 */
let DPM=null,DPT=0;
function dpLack(k,v,p){const r=R(p),m=v-r[k],t=RN[k].toLowerCase();if(m<=0)return `<span class=${k}>${fmt(v)} ${t}</span>`;const q=prodN(p,IDX[k]);
return `<span class=lack style="color:#ff8a8a">${fmt(v)} ${t} · ${v>capN(p,k)?'mejora el almacén':q>0?`faltan ${fmt(m)} (${fmtT(Math.ceil(m/q))})`:`faltan ${fmt(m)}`}</span>`}
function dpUpd(){if(!DPM||!$('#dpc')){clearInterval(DPT);DPT=0;return}
const id=DPM.id,n=cxN(id),a=Math.round(100*cxPct(n+1)),b=Math.round(100*cxPct(n-DPM.n+1)),c=dpCost(U(id),DPM.n),p=P(SP);
$('#dpa').textContent=a+'%';$('#dpa').style.color=semC(a,20,40);$('#dpb').textContent=b+'%';$('#dpb').style.color=semC(b,20,40);
$('#dpc').innerHTML=Object.keys(c).filter(k=>c[k]>0).map(k=>dpLack(k,c[k],p)).join(' · ')||'sin coste'}
function dpOpen(id){const u=U(id),m=cxN(id);if(m<1)return;DPM={id,n:1};
qtyOpen({t:`Pagar tributo a ${u.name}`,i:`El puesto recuerda ${m} ${m>1?'saqueos':'saqueo'}. Cada saqueo que le pagues por olvidar baja el riesgo de contraataque; si sigues saqueando, vuelve a subir. El pago es definitivo.`,
rows:[{mn:1,mx:()=>cxN(DPM.id),get:()=>DPM.n,set:v=>{DPM.n=Math.max(1,Math.min(cxN(DPM.id),Math.floor(+v||1)))},fm:n=>n+(n>1?' saqueos olvidados':' saqueo olvidado')}],
post:`<div class=st style="margin-top:8px">Riesgo de contraataque ahora: <b id=dpa></b></div><div class=st>Con este tributo: <b id=dpb></b></div><div class=st style="margin-top:8px">Coste: <span id=dpc></span></div>`,gt:'Pagar tributo',go:'dpSend()',u:dpUpd});
clearInterval(DPT);DPT=setInterval(dpUpd,1000)}
function dpSend(){const id=DPM.id,n=DPM.n;if(!afford(R(P(SP)),dpCost(U(id),n))){toast('Te faltan recursos para este tributo');return}DPM=null;closeM();dpPay(id,n)}
function dpPay(id,n){const r=R(P(SP)),c=dpCost(U(id),n);if(n<1||n>cxN(id)||!afford(r,c))return;const a=Math.round(100*cxPct(cxN(id)+1));
for(const k in c)r[k]-=c[k];S.tr['p'+id]=(S.tr['p'+id]||0)+n;
toast(`Tributo pagado a ${U(id).name}: ${n} ${n>1?'saqueos olvidados':'saqueo olvidado'}. Riesgo de contraataque ${a}% → ${Math.round(100*cxPct(cxN(id)+1))}%`);
const y=window.scrollY;change();window.scrollTo(0,y)}
function dpEx(id){const off=cxPct(cxN(id)+1)>0?'':'Sin riesgo de contraataque';return `<button class=go style="margin-top:8px;${off?'background:#26344f;color:var(--tx)':'background:#6fcf97'}" ${off?'disabled':''} onclick="dpOpen(${id})">${off?`Diplomacia · ${off}`:'Diplomacia'}</button>`}
