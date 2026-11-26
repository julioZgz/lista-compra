/* convoy.js — Colonizar: modal para elegir cuántos colonizadores envías (con el % de éxito) y, con Convoyes de colonización, los recursos que viajan con ellos (cvOpen, cvQ, cvQs, cvStep, cvSl, cvSend); cvTake los descuenta del planeta de origen.
 * Lee: S.tech, S.fleet y los recursos del planeta seleccionado. Escribe: esos recursos (solo en cvTake). Estado propio: CVM.
 * NO debe: tocar colas ni guardado, ni definir fórmulas (cvMax y exPc están en rules).
 */
let CVM=null;
const cvLim=()=>{const p=P(SP),m=cvMax(),o={};for(const k of['m','c','g'])o[k]=Math.max(0,Math.min(m,Math.floor(R(p)[k])));return o};
function cvTake(res){const mx=cvLim(),p=P(SP),r={};let t=0;for(const k of['m','c','g']){r[k]=Math.max(0,Math.min(mx[k],Math.floor(+(res&&res[k])||0)));t+=r[k]}
if(!t)return null;for(const k in r)R(p)[k]-=r[k];return r}
function cvUpd(){$('#cvq').textContent=CVM.n;$('#cvqs').value=CVM.n;$('#cvl').innerHTML=exLn('c',CVM.to,CVM.n);if(!cvMax())return;const o=[];for(const k of['m','c','g']){$('#cvn'+k).textContent=CVM.r[k];$('#cvs'+k).value=CVM.r[k];if(CVM.r[k])o.push(fmt(CVM.r[k])+' de '+RN[k].toLowerCase())}$('#cvt').textContent=o.length?o.join(', '):'ninguno'}
function cvOpen(to){const mx=cvLim(),u=U(to),h=U(P(SP).id),nx=S.fleet.c,rs=cvMax()>0;CVM={to,n:1,r:{m:0,c:0,g:0}};const m=$('#md');m.style.display='flex';
m.innerHTML=`<div class=card style="width:100%;max-width:420px"><b>Colonizar ${u.name}</b><p class=st>Tienes ${nx} colonizador${nx>1?'es':''}. Con varios, la probabilidad total sube (Colonización ${S.tech.c}).${rs?` Los recursos salen de ${h.name} y se suman a la colonia nueva. Máx. ${fmt(cvMax())} de cada uno (Convoyes de colonización ${S.tech.i}).`:''}</p>
<div class=row style="margin:10px 0"><button class=tab onclick="cvQ(-1)">−</button><b style="font-size:22px"><span id=cvq></span></b><button class=tab onclick="cvQ(1)">+</button></div>
<div class=st id=cvl style="margin-bottom:8px"></div><input type=range id=cvqs min=1 max=${nx} step=1 oninput="cvQs(this.value)">
${rs?`${['m','c','g'].map(k=>`<div class=st style="margin-top:8px">${RN[k]} · disponibles ${fmt(mx[k])}</div><div class=row style="margin:10px 0"><button class=tab onclick="cvStep('${k}',-1)">−</button><b style="font-size:22px"><span id=cvn${k}></span></b><button class=tab onclick="cvStep('${k}',1)">+</button></div><input type=range id=cvs${k} min=0 max=${mx[k]} step=1 oninput="cvSl('${k}',this.value)">`).join('')}
<div class=st style="margin-top:8px">Viajan: <b id=cvt></b></div>`:''}
<div class=row style="gap:8px;margin-top:10px"><button class=go style="background:#26344f;color:var(--tx)" onclick="closeM()">Cancelar</button><button class=go style="background:#e8a86a" onclick="cvSend()">Colonizar</button></div></div>`;
cvUpd()}
function cvQ(d){CVM.n=Math.max(1,Math.min(S.fleet.c,CVM.n+d));cvUpd()}
function cvQs(v){CVM.n=Math.max(1,Math.min(S.fleet.c,Math.floor(+v||1)));cvUpd()}
function cvStep(k,d){CVM.r[k]=Math.max(0,Math.min(cvLim()[k],CVM.r[k]+d));cvUpd()}
function cvSl(k,v){CVM.r[k]=Math.max(0,Math.min(cvLim()[k],Math.floor(+v||0)));cvUpd()}
function cvSend(){const t=CVM.to,n=CVM.n,r={...CVM.r};CVM=null;closeM();send('c',t,r,n)}
