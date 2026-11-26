/* util.js — Utilidades puras: $ (querySelector), afford, fmt, fmtT, rng, semC (color semántico).
 * Lee: nada del estado. Escribe: nada.
 * NO debe: depender de S ni de otros módulos.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
const $=s=>document.querySelector(s);
const afford=(r,c)=>Object.keys(c).every(k=>r[k]>=c[k]);
const fmt=n=>n>=1e9?(n/1e9).toFixed(2)+'MM':n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e4?(n/1e3).toFixed(1)+'k':Math.floor(n);
const fmtT=s=>{const d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60);return(d?d+'d ':'')+(d||h?h+'h ':'')+(d||h||m?m+'m ':'')+s%60+'s'};
const semC=(v,g,y)=>g>y?(v>=g?'#6fcf97':v>=y?'#f2c94c':'#ff8a8a'):(v<g?'#6fcf97':v<y?'#f2c94c':'#ff8a8a');
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
