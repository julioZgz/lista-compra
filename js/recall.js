/* recall.js — Cancelar misiones en vuelo (explorar, colonizar, saquear): botón en Flota → Misiones en curso + modal de confirmación; la misión pasa a una de vuelta (k:'b') que dura el tiempo ya recorrido y al llegar devuelve naves y recursos.
 * Lee/Escribe: S.mis, S.fleet y recursos del planeta de origen (vía R). Estado propio de sesión, no se guarda: RCM (misión del modal abierto).
 * NO debe: tocar colas, Firebase ni fórmulas de rules. Acoplamientos: toast, change, closeM (como dismantle/convoy); engine→rcDone.
 */
let RCM=null;
const rcFind=(to,end)=>S.mis.find(m=>m.to===to&&m.end===end&&'xcr'.includes(m.k));
const rcT=m=>{const t=Math.ceil(U(m.to).dist*20/(1+.25*S.tech.p));return m.k==='r'?2*t:t};
const rcEl=(m,now=Date.now())=>Math.max(0,Math.min(rcT(m),rcT(m)-(m.end-now)/1000));
const rcOff=m=>m.k==='r'&&2*rcEl(m)>rcT(m);
const rcNm=m=>m.to>=100&&!S.rk.includes(m.to)?'un puesto rival':U(m.to).name;
const RCK={x:'exploración',c:'colonización',r:'saqueo'};
function rcEx(m){if(!'xcr'.includes(m.k))return'';const off=rcOff(m);return`<button class=go style="margin-top:8px;background:#e8a86a" ${off?'disabled':''} onclick="rcOpen(${m.to},${m.end})">${off?'Ya está de vuelta':'Cancelar misión'}</button>`}
function rcOpen(to,end){const m=rcFind(to,end);if(!m)return;if(rcOff(m))return toast('Ya está de vuelta: no se puede cancelar');RCM={to,end};const o=m.res?P(m.o)||S.cs[0]:null,md=$('#md');md.style.display='flex';
md.innerHTML=`<div class=card style="width:100%;max-width:420px"><b>Cancelar ${RCK[m.k]} de ${rcNm(m)}</b><p class=st>${m.k==='r'?'Vuelven tus '+mTx(m):m.k==='c'?(m.n>1?'Vuelven los '+m.n+' colonizadores':'Vuelve el colonizador'):(m.n>1?'Vuelven los '+m.n+' exploradores':'Vuelve el explorador')} en <b>${fmtT(Math.round(rcEl(m)))}</b> (el tiempo ya recorrido). No pierdes nada${m.k==='r'?' y el saqueo no se llega a hacer':''}.${o?` Los recursos del convoy vuelven a ${U(o.id).name}.`:''}</p>
<div class=row style="gap:8px;margin-top:6px"><button class=go style="background:#26344f;color:var(--tx)" onclick="closeM()">Mantener</button><button class=go style="background:#e8a86a" onclick="rcSend()">Cancelar misión</button></div></div>`}
function rcSend(){const r=RCM;RCM=null;closeM();if(r)recall(r.to,r.end)}
function recall(to,end){const m=rcFind(to,end);if(!m||rcOff(m))return;const el=Math.round(rcEl(m)),r={k:'b',w:m.k,to:m.to,end:Date.now()+el*1000};for(const x of['n','f','res','o'])if(m[x]!=null)r[x]=m[x];S.mis[S.mis.indexOf(m)]=r;
toast(`Misión cancelada (${RCK[m.k]} de ${rcNm(m)}): vuelven en ${fmtT(el)}`);const y=window.scrollY;change();window.scrollTo(0,y)}
function rcDone(m){const nm=rcNm(m);let t;
if(m.w==='r'){const fl=mFl(m);rdTy().forEach(x=>{S.fleet[x]=(S.fleet[x]||0)+(fl[x]||0)});t=`La flota de saqueo ha vuelto de ${nm}`}
else if(m.w==='x'){S.fleet.e+=m.n||1;t=m.n>1?`Los ${m.n} exploradores han vuelto de ${nm}`:`El explorador ha vuelto de ${nm}`}
else{S.fleet.c+=m.n||1;t=m.n>1?`Los ${m.n} colonizadores han vuelto de ${nm}`:`El colonizador ha vuelto de ${nm}`;if(m.res){const o=P(m.o)||S.cs[0];for(const k in m.res)R(o)[k]+=m.res[k];t+=`; los recursos vuelven a ${U(o.id).name}`}}
toast(t,null,'f')}
