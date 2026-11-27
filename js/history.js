/* history.js — Historial de eventos recientes: histAdd/histRes guardan los últimos 5 de cada tipo (naturales, visitas, ataques rebeldes, contraataques rivales, saqueos, exploración y colonización, suministros); histView pinta la lista en la sub-pestaña Eventos de Imperio (histOpen lleva a ella).
 * Lee/Escribe: S.hist (valor por defecto en prep). Lo llaman engine, events y actions; la sub-pestaña la pinta ui-views (empireView).
 * NO debe: tocar colas, recursos, reglas ni S.ev, ni guardar. */
const HLBL={n:'Eventos naturales',v:'Visitas',a:'Ataques rebeldes',c:'Contraataques rivales',r:'Saqueos',x:'Exploración y colonización',s:'Suministros'};
function histAdd(k,pid,x,f){S.hist.push(f?{k,t:Date.now(),pid,x,f:1}:{k,t:Date.now(),pid,x});const a=S.hist.filter(e=>e.k===k);if(a.length>5)S.hist=S.hist.filter(e=>e!==a[0])}
function histRes(x){const e=[...S.hist].reverse().find(e=>e.f);if(e){e.x=x;delete e.f}}
function histView(){const now=Date.now(),
blk=k=>{const a=S.hist.filter(e=>e.k===k).reverse();return `<div class=st style="margin-top:12px"><b>${HLBL[k]}</b></div>`+(a.length?a.map(e=>`<div class=card style="margin-top:6px"><div class=st>${U(e.pid).name} · hace ${fmtT(Math.round((now-e.t)/1000))}</div><div>${e.x}</div></div>`).join(''):'<p class=st>Nada todavía.</p>')};
return `<p class=st>Los últimos 5 de cada tipo, con dónde ocurrieron y qué resultado tuvieron.</p>${blk('n')}${blk('v')}${blk('a')}${blk('c')}${blk('r')}${blk('x')}${blk('s')}`}
function histOpen(){SUBE='h';go('e')}
