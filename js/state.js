/* state.js — Globales de sesión: S (partida), SP (planeta elegido), V (pestaña), code, dirty, st, err; accesores P/U/R; LOG.
 * Lee al arrancar localStorage: je_v, je_code. Escribe: nada más (S lo escriben engine/actions/storage).
 * NO debe: contener lógica de reglas ni HTML.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
let S=null,SP=0,V=(['b','i','f','m','r','x','q'].includes(localStorage.getItem('je_v'))?localStorage.getItem('je_v'):'b'),code=localStorage.getItem('je_code')||'',dirty=false,st='',err='';
const P=id=>S.cs.find(c=>c.id===id),U=id=>S.u.find(p=>p.id===id)||S.ru.find(p=>p.id===id);
const R=p=>p.nj?S.net:p.r,mem=()=>S.cs.filter(p=>p.nj);
let LOG=null;
