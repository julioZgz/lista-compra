/* routes.js — Rutas de suministro recurrentes: repiten solas un envío de Naves de suministros entre dos colonias (rtOf, rtAdd, rtRun, rtEx, rtTog, rtDel).
 * Lee: S.rt, S.fleet.s, S.mis, S.tech.m y los recursos del origen (vía R). Escribe: S.rt; al relanzar, S.mis, S.fleet.s y los recursos del origen (con spTake).
 * NO debe: tocar colas ni guardado, ni definir fórmulas (SUC, SUR y spT están en rules; la llegada se resuelve en engine: supDone). rtRun la llama advance después del filter de S.mis.
 */
const rtOf=to=>S.rt.find(r=>r.to===to),rtP=id=>S.cs.find(c=>c.id===id);
function rtAdd(to,o,n,res){S.rt=S.rt.filter(r=>r.to!==to);S.rt.push({to,o,n,res:{m:res.m||0,c:res.c||0,g:res.g||0},on:1,w:''});change()}
function rtRun(now){let ch=false;
S.rt=S.rt.filter(r=>{const d=rtP(r.to),o=rtP(r.o);if(d&&o&&!d.nj)return true;toast(`Ruta de suministros a ${U(r.to).name} cancelada: ${!d?'la colonia ya no existe':!o?'el origen ya no existe':'ahora comparte recursos (red)'}.`,null,'f');ch=true;return false});
S.rt.forEach(r=>{if(!r.on||S.mis.some(m=>m.k==='s'&&m.to===r.to))return;const o=rtP(r.o),
w=S.fleet.s<r.n?'faltan naves de suministros':S.mis.length>=1+S.tech.m?'sin misiones libres (Flotas coordinadas)':['m','c','g'].some(k=>Math.floor(R(o)[k])<r.res[k])?`${U(o.id).name} no tiene la carga completa`:'';
if(w){r.on=0;r.w=w;toast(`Ruta de suministros a ${U(r.to).name} pausada: ${w}.`,r.to,'f');ch=true;return}
const x=spTake(o,r.n,r.res);if(!x)return;S.fleet.s-=r.n;S.mis.push({k:'s',to:r.to,end:now+spT(r.to)*1000,n:r.n,res:x,o:r.o});ch=true});
return ch}
function rtEx(p){return S.rt.filter(r=>r.to===p.id||r.o===p.id).map(r=>{const c=['m','c','g'].filter(k=>r.res[k]).map(k=>`${fmt(r.res[k])} de ${RN[k].toLowerCase()}`).join(', ');
return `<div class=st style="margin-top:8px">🔁 Ruta ${U(r.o).name} → ${U(r.to).name} · ${r.n} ${r.n>1?'naves':'nave'} · ${c} · <b>${r.on?'activa':'pausada: '+r.w}</b></div><div style="display:flex;gap:8px;margin-top:6px"><button class=go style="background:#26344f;color:var(--tx)" onclick="rtTog(${r.to})">${r.on?'Pausar ruta':'Reanudar ruta'}</button><button class=go style="background:#26344f;color:var(--tx)" onclick="rtDel(${r.to})">Cancelar ruta</button></div>`}).join('')}
function rtTog(to){const r=rtOf(to);if(!r)return;r.on=r.on?0:1;r.w=r.on?'':'la pausaste tú';change()}
function rtDel(to){S.rt=S.rt.filter(r=>r.to!==to);change()}
