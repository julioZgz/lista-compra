/* convoy.js — Colonizar: modal para elegir cuántos colonizadores envías (con el % de éxito) y, con Convoyes de colonización, los recursos que viajan con ellos (cvOpen, cvUpd, cvSend, sobre qtyOpen de ui-core); cvTake los descuenta del planeta de origen.
 * Lee: S.tech, S.fleet y los recursos del planeta seleccionado. Escribe: esos recursos (solo en cvTake). Estado propio: CVM.
 * NO debe: tocar colas ni guardado, ni definir fórmulas (cvMax y exPc están en rules).
 */
let CVM=null;
const cvLim=()=>{const p=P(SP),m=cvMax(),o={};for(const k of['m','c','g'])o[k]=Math.max(0,Math.min(m,Math.floor(R(p)[k])));return o};
function cvTake(res){const mx=cvLim(),p=P(SP),r={};let t=0;for(const k of['m','c','g']){r[k]=Math.max(0,Math.min(mx[k],Math.floor(+(res&&res[k])||0)));t+=r[k]}
if(!t)return null;for(const k in r)R(p)[k]-=r[k];return r}
function cvUpd(){$('#cvl').innerHTML=exLn('c',CVM.to,CVM.n);if(!cvMax())return;const o=[];for(const k of['m','c','g'])if(CVM.r[k])o.push(fmt(CVM.r[k])+' de '+RN[k].toLowerCase());$('#cvt').textContent=o.length?o.join(', '):'ninguno'}
function cvOpen(to){const mx=cvLim(),u=U(to),h=U(P(SP).id),nx=S.fleet.c,rs=cvMax()>0;CVM={to,n:1,r:{m:0,c:0,g:0}};
qtyOpen({t:`Colonizar ${u.name}`,i:`Tienes ${nx} colonizador${nx>1?'es':''}. Con varios, la probabilidad total sube (Colonización ${S.tech.c}).${rs?` Los recursos salen de ${h.name} y se suman a la colonia nueva. Máx. ${fmt(cvMax())} de cada uno (Convoyes de colonización ${S.tech.i}).`:''}`,
rows:[{x:'<div class=st id=cvl style="margin-bottom:8px"></div>',mn:1,mx:()=>S.fleet.c,get:()=>CVM.n,set:v=>{CVM.n=Math.max(1,Math.min(S.fleet.c,Math.floor(+v||1)))}},
...(rs?['m','c','g'].map(k=>({h:`<div class=st style="margin-top:8px">${RN[k]} · disponibles ${fmt(mx[k])}</div>`,mn:0,mx:()=>cvLim()[k],get:()=>CVM.r[k],set:v=>{CVM.r[k]=Math.max(0,Math.min(cvLim()[k],Math.floor(+v||0)))}})):[])],
post:rs?'<div class=st style="margin-top:8px">Viajan: <b id=cvt></b></div>':'',gt:'Colonizar',go:'cvSend()',gm:10,u:cvUpd})}
function cvSend(){const t=CVM.to,n=CVM.n,r={...CVM.r};CVM=null;closeM();send('c',t,r,n)}
