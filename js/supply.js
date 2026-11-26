/* supply.js — Naves de suministros: botón en Colonia (spEx, lo pinta view) y modal para elegir origen, naves y carga hacia una colonia sin red (spOpen, spPick, spSet, spUpd, spSend, sobre qtyOpen de ui-core); spTake descuenta la carga del origen (o de la red si está conectado). La casilla «Repetir envío» crea una ruta recurrente (routes.js: rtAdd); spEx añade las rutas de la colonia (rtEx; en colonias en red view llama solo a rtEx).
 * Lee: S.fleet.s y los recursos del origen (vía R). Escribe: esos recursos (solo en spTake). Estado propio, no se guarda: SUM (destino, origen, naves y carga).
 * NO debe: tocar colas ni guardado, ni definir fórmulas (SUC, SUR y spT están en rules; la llegada se resuelve en engine: supDone).
 */
let SUM=null;
const spOs=()=>S.cs.filter(c=>c.id!==SUM.to),spLim=k=>{let o=0;for(const x of['m','c','g'])if(x!==k)o+=SUM.r[x];return Math.max(0,Math.min(Math.floor(R(P(SUM.o))[k]),SUC*SUM.n-o))};
function spTake(p,n,res){const cp=SUC*n,r={};let t=0;for(const k of['m','c','g']){r[k]=Math.max(0,Math.min(Math.floor(R(p)[k]),Math.floor(+(res&&res[k])||0),cp-t));t+=r[k]}
if(!t)return null;for(const k in r)R(p)[k]-=r[k];return r}
function spFix(){let t=0;for(const k of['m','c','g']){SUM.r[k]=Math.max(0,Math.min(SUM.r[k],Math.floor(R(P(SUM.o))[k]),SUC*SUM.n-t));t+=SUM.r[k]}}
function spUpd(){const o=P(SUM.o);let t=0;
for(const k of['m','c','g']){t+=SUM.r[k];$('#spa'+k).textContent=fmt(Math.floor(R(o)[k]))}
$('#spt').textContent=fmt(t)+' de '+fmt(SUC*SUM.n);$('#spw').textContent=o.nj?'Los recursos salen de la red compartida.':'Los recursos salen de '+U(o.id).name+'.';$('#spgo').disabled=!t;
spOs().forEach(c=>{$('#spo'+c.id).className='tab'+(c.id===SUM.o?' on':'')})}
function spOpen(to){const d=P(to),o=S.cs.find(c=>c.id!==to);if(!d||d.nj||!o||!(S.fleet.s>0))return;SUM={to,o:o.id,n:1,r:{m:0,c:0,g:0},rp:false};
qtyOpen({sc:1,t:`Pedir suministros para ${U(to).name}`,i:`Disponibles ${S.fleet.s} · carga ${fmt(SUC)} por nave · viaje de ${fmtT(spT(to))}. Riesgo en ruta: ${Math.round(SUR.tot*100)}% de perderlo todo y ${Math.round(SUR.par*100)}% de saqueo parcial.`,
pre:`<div class=st>Enviar desde</div><div class=tabs>${spOs().map(c=>`<button class=tab id=spo${c.id} onclick="spPick(${c.id})">${U(c.id).name}${c.nj?' · red':''}</button>`).join('')}</div><p class=st id=spw></p>`,
rows:[{h:'<div class=st style="margin-top:8px">Naves</div>',mn:1,mx:()=>S.fleet.s,get:()=>SUM.n,set:v=>spSet('n',v)},
...['m','c','g'].map(k=>({h:`<div class=st style="margin-top:8px">${RN[k]} · en el origen <span id=spa${k}></span></div>`,mn:0,mx:()=>spLim(k),get:()=>SUM.r[k],set:v=>spSet(k,v),st:10}))],
post:'<div class=st style="margin-top:8px">Carga: <b id=spt></b></div><label class=st style="display:block;margin-top:8px"><input type=checkbox onchange="spRp(this.checked)"> Repetir el envío automáticamente</label><div class=st>Al llegar, se relanza solo con la misma carga si hay naves, recursos y una misión libre; si falta algo, la ruta se pausa y te avisa.'+(rtOf(to)?' Sustituye la ruta actual a este destino.':'')+'</div>',gid:'spgo',gt:'Enviar',go:'spSend()',u:spUpd})}
function spPick(o){SUM.o=o;spFix();qtyUpd()}
function spSet(k,v){v=Math.floor(+v||0);if(k==='n'){SUM.n=Math.max(1,Math.min(S.fleet.s,v));spFix()}else SUM.r[k]=Math.max(0,Math.min(spLim(k),v))}
function spRp(v){if(SUM)SUM.rp=v}
function spSend(){const s=SUM,l=S.mis.length;SUM=null;closeM();sendSupply(s.to,s.o,s.n,s.r);if(s.rp&&S.mis.length>l){const m=S.mis[S.mis.length-1];rtAdd(m.to,m.o,m.n,m.res)}}
function spEx(t){if(t!=='s')return'';const p=P(SP),off=S.cs.length<2?'Necesitas otra colonia':p.nj?'Esta colonia ya comparte recursos (red)':S.fleet.s<1?'Necesitas una nave de suministros':S.mis.length>=1+S.tech.m?'Sin misiones libres (Flotas coordinadas)':'';
return `<button class=go style="margin-top:8px" ${off?'disabled':''} onclick="spOpen(${p.id})">${off?`Pedir suministros · ${off}`:`Pedir suministros (${fmtT(spT(p.id))})`}</button>`+rtEx(p)}
