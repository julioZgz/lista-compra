/* confirm.js — Modal de confirmación propia (sustituye a confirm() nativo): cfOpen({t,i,g,f,c?,x?}), cfGo.
 * Estado propio: CFM (confirmación pendiente; no se guarda). No lee ni escribe S.
 * NO debe: decidir qué se confirma ni ejecutar la acción por sí misma (la pasa quien llama en `f`), tocar colas ni guardado. */
let CFM=null;
function cfOpen(o){CFM=o;const m=$('#md');m.style.display='flex';m.innerHTML=`<div class=card style="width:100%;max-width:420px"><b>${o.t}</b><p class=st>${o.i}</p><div style="display:flex;gap:8px;margin-top:12px"><button class=go style="flex:1;background:#26344f;color:var(--tx)" onclick="${o.x||'closeM()'}">Cancelar</button><button class=go style="flex:1;background:${o.c||'#e8a86a'}" onclick="cfGo()">${o.g}</button></div></div>`}
function cfGo(){const f=CFM&&CFM.f;CFM=null;closeM();if(f)f()}
