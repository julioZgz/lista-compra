/* supply.js — Naves de suministros: botón en Flota (spEx) y modal para elegir origen, naves y carga hacia una colonia sin red (spOpen, spPick, spStep, spSl, spSend); spTake descuenta la carga del origen (o de la red si está conectado).
 * Lee: S.fleet.s y los recursos del origen (vía R). Escribe: esos recursos (solo en spTake). Estado propio, no se guarda: SUM (destino, origen, naves y carga).
 * NO debe: tocar colas ni guardado, ni definir fórmulas (SUC, SUR y spT están en rules; la llegada se resuelve en engine: supDone).
 */
let SUM=null;
const spOs=()=>S.cs.filter(c=>c.id!==SUM.to),spLim=k=>{let o=0;for(const x of['m','c','g'])if(x!==k)o+=SUM.r[x];return Math.max(0,Math.min(Math.floor(R(P(SUM.o))[k]),SUC*SUM.n-o))};
function spTake(p,n,res){const cp=SUC*n,r={};let t=0;for(const k of['m','c','g']){r[k]=Math.max(0,Math.min(Math.floor(R(p)[k]),Math.floor(+(res&&res[k])||0),cp-t));t+=r[k]}
if(!t)return null;for(const k in r)R(p)[k]-=r[k];return r}
function spFix(){let t=0;for(const k of['m','c','g']){SUM.r[k]=Math.max(0,Math.min(SUM.r[k],Math.floor(R(P(SUM.o))[k]),SUC*SUM.n-t));t+=SUM.r[k]}}
function spUpd(){const o=P(SUM.o);let t=0;$('#spnn').textContent=SUM.n;$('#spln').value=SUM.n;
for(const k of['m','c','g']){t+=SUM.r[k];$('#spn'+k).textContent=SUM.r[k];$('#spl'+k).max=spLim(k);$('#spl'+k).value=SUM.r[k];$('#spa'+k).textContent=fmt(Math.floor(R(o)[k]))}
$('#spt').textContent=fmt(t)+' de '+fmt(SUC*SUM.n);$('#spw').textContent=o.nj?'Los recursos salen de la red compartida.':'Los recursos salen de '+U(o.id).name+'.';$('#spgo').disabled=!t;
spOs().forEach(c=>{$('#spo'+c.id).className='tab'+(c.id===SUM.o?' on':'')})}
function spOpen(to){const d=P(to),o=S.cs.find(c=>c.id!==to);if(!d||d.nj||!o||!(S.fleet.s>0))return;SUM={to,o:o.id,n:1,r:{m:0,c:0,g:0}};const m=$('#md');m.style.display='flex';
const rw=(k,lab,mn,mx)=>`<div class=st style="margin-top:8px">${lab}</div><div class=row style="margin:10px 0"><button class=tab onclick="spStep('${k}',-1)">−</button><b style="font-size:22px"><span id=spn${k}></span></b><button class=tab onclick="spStep('${k}',1)">+</button></div><input type=range id=spl${k} min=${mn} max=${mx} step=1 oninput="spSl('${k}',this.value)">`;
m.innerHTML=`<div class=card style="width:100%;max-width:420px;max-height:85vh;overflow:auto"><b>Pedir suministros para ${U(to).name}</b><p class=st>Disponibles ${S.fleet.s} · carga ${fmt(SUC)} por nave · viaje de ${fmtT(spT(to))}. Riesgo en ruta: ${Math.round(SUR.tot*100)}% de perderlo todo y ${Math.round(SUR.par*100)}% de saqueo parcial.</p>
<div class=st>Enviar desde</div><div class=tabs>${spOs().map(c=>`<button class=tab id=spo${c.id} onclick="spPick(${c.id})">${U(c.id).name}${c.nj?' · red':''}</button>`).join('')}</div><p class=st id=spw></p>
${rw('n','Naves',1,S.fleet.s)}${['m','c','g'].map(k=>rw(k,`${RN[k]} · en el origen <span id=spa${k}></span>`,0,0)).join('')}
<div class=st style="margin-top:8px">Carga: <b id=spt></b></div>
<div class=row style="gap:8px;margin-top:6px"><button class=go style="background:#26344f;color:var(--tx)" onclick="closeM()">Cancelar</button><button class=go id=spgo style="background:#e8a86a" onclick="spSend()">Enviar</button></div></div>`;
spUpd()}
function spPick(o){SUM.o=o;spFix();spUpd()}
function spSet(k,v){v=Math.floor(+v||0);if(k==='n'){SUM.n=Math.max(1,Math.min(S.fleet.s,v));spFix()}else SUM.r[k]=Math.max(0,Math.min(spLim(k),v));spUpd()}
function spStep(k,d){spSet(k,k==='n'?SUM.n+d:SUM.r[k]+10*d)}
function spSl(k,v){spSet(k,v)}
function spSend(){const s=SUM;SUM=null;closeM();sendSupply(s.to,s.o,s.n,s.r)}
function spEx(t){if(t!=='s')return'';const p=P(SP),off=S.cs.length<2?'Necesitas otra colonia':p.nj?'Esta colonia ya comparte recursos (red)':S.fleet.s<1?'Necesitas una nave de suministros':S.mis.length>=1+S.tech.m?'Sin misiones libres (Flotas coordinadas)':'';
return `<button class=go style="margin-top:8px" ${off?'disabled':''} onclick="spOpen(${p.id})">${off||`Pedir suministros (${fmtT(spT(p.id))})`}</button>`}
