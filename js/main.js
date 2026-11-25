/* main.js — Arranque: temporizadores (tick 1s, guardado 15s), visibilitychange, primer render y carga de partida.
 * Último script en cargar.
 * NO debe: contener lógica; solo arranque.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
setInterval(()=>tick(),1000);
setInterval(()=>{if(dirty)save()},15000);
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(dirty)save()}else seBack()});
setInterval(()=>{if(!document.hidden)seCheck()},20000);
render();
if(code)load(code);
