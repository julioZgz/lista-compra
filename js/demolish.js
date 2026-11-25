/* demolish.js — Desmantelar edificios: botón en la tarjeta de cada edificio (Edificios) + modal de confirmación; baja un nivel y devuelve el 50% del coste de ese nivel (DBP).
 * Lee/Escribe: p.b del planeta seleccionado y sus recursos (vía R). Estado propio de sesión, no se guarda: DBM (edificio del modal abierto).
 * NO debe: tocar colas, Firebase ni fórmulas de rules. Acoplamientos: toast, change, closeM (como dismantle), RQ, vb, cost (solo lectura).
 */
const DBP=.5;let DBM=null;
function dbWhy(p,k){const b=vb(p);if(p.q&&p.q.k===k||(p.bq||[]).some(i=>i.k===k))return'Tiene obras en curso o en cola';if(k==='h'&&p.nj)return'La colonia está unida a la red';
b[k]--;for(const j in B)if(j!==k&&b[j]>0){const m=RQ(p,j,b[j],b).find(s=>s.indexOf(B[k].n+' ')===0);if(m)return`Lo necesita ${B[j].n} ${b[j]} (${m})`}return''}
const dbRet=(p,k)=>{const c=cost(B[k].b,B[k].f,p.b[k]-1),r={};for(const x in c)r[x]=Math.floor(c[x]*DBP);return r};
const dbTx=c=>Object.entries(c).map(([x,v])=>fmt(v)+' '+RN[x].toLowerCase()).join(', ');
function dbEx(p,k){if(!(p.b[k]>0))return'';const w=dbWhy(p,k);return`<button class=go style="margin-top:8px;background:#e8a86a" ${w?'disabled':''} onclick="dbOpen('${k}')">${w||'Desmantelar nivel '+p.b[k]}</button>`}
function dbOpen(k){const p=P(SP);if(!p||!(p.b[k]>0)||dbWhy(p,k))return;DBM={k};const L=p.b[k],c=dbRet(p,k),m=$('#md');m.style.display='flex';
const wa=k==='a'&&!p.nj&&Object.keys(CM).some(x=>R(p)[x]+(c[x]||0)>Math.round(CM[x]*Math.round(1000*Math.pow(1.7,L-1))))?`<p class=st style="color:#ff8a8a">La capacidad de metal baja a ${fmt(Math.round(1000*Math.pow(1.7,L-1)))} (cristal 75%, gas 50%): lo que tengas por encima puede perderse.</p>`:'';
m.innerHTML=`<div class=card style="width:100%;max-width:420px"><b>Desmantelar un nivel de ${B[k].n.toLowerCase()}</b><p class=st>Nivel ${L} → ${L-1} · recuperas el ${Math.round(DBP*100)}% del coste de ese nivel en ${U(p.id).name}, al instante. No se puede deshacer.</p>
<div class=st>Recibirás: <b>${dbTx(c)}</b></div>${wa}
<div class=row style="gap:8px;margin-top:6px"><button class=go style="background:#26344f;color:var(--tx)" onclick="closeM()">Cancelar</button><button class=go style="background:#e8a86a" onclick="dbSend()">Desmantelar</button></div></div>`}
function dbSend(){const k=DBM.k;DBM=null;closeM();demolish(k)}
function demolish(k){const p=P(SP);if(!p||!(p.b[k]>0)||dbWhy(p,k))return;const L=p.b[k],c=dbRet(p,k);p.b[k]--;for(const x in c)R(p)[x]+=c[x];
toast(`Desmantelado un nivel de ${B[k].n} (${L} → ${L-1}): +${dbTx(c)} en ${U(p.id).name}`);const y=window.scrollY;change();window.scrollTo(0,y)}
