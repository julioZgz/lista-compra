/* state.js — Globales de sesión: S (partida), SP (planeta elegido), V (pestaña: b Colonia, i Laboratorio, f Astillero, p Puerto, e Imperio), SUBP/SUBE (sub-pestaña de Puerto e Imperio; no se guardan), TABMAP (ids antiguos m,r,x,q → [pestaña, sub-pestaña]), code, dirty, st, err; accesores P/U/R; LOG.
 * Lee al arrancar localStorage: je_v, je_code. Escribe: nada más (S lo escriben engine/actions/storage).
 * NO debe: contener lógica de reglas ni HTML.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
const TABMAP={m:['p','c'],r:['p','s'],x:['e','x'],q:['e','q']},TABLS=localStorage.getItem('je_v'),TABX=TABMAP[TABLS];
let S=null,SP=0,SUBP=TABX&&TABX[0]==='p'?TABX[1]:'c',SUBE=TABX&&TABX[0]==='e'?TABX[1]:'x',V=['b','i','f','p','e'].includes(TABLS)?TABLS:TABX?TABX[0]:'b',code=localStorage.getItem('je_code')||'',dirty=false,st='',err='';
const P=id=>S.cs.find(c=>c.id===id),U=id=>S.u.find(p=>p.id===id)||S.ru.find(p=>p.id===id);
const R=p=>p.nj?S.net:p.r,mem=()=>S.cs.filter(p=>p.nj);
let LOG=null;
