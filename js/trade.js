/* trade.js — Comercio con mercaderes: TF/TT/TA, tf, tt, tin, tmax, tp, trade, comm/rate.
 * Escribe: recursos del planeta activo (vía trade) y S.cnt. Estado propio: TF/TT/TA, W, RS.
 * NO debe: tocar colas ni guardado.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
let TF='m',TT='c',TA=100;
const W={m:1,c:1.7,g:3.4},RS=['m','c','g'];
const comm=()=>.2-.03*S.tech.x,rate=()=>Math.floor(TA*W[TF]/W[TT]*(1-comm()));
function tf(k){TF=k;if(TT===k)TT=RS.find(x=>x!==k);render()}
function tt(k){TT=k;if(TF===k)TF=RS.find(x=>x!==k);render()}
function tin(v){TA=Math.max(0,Math.floor(+v||0));tp()}
function tmax(){TA=Math.floor(R(P(SP))[TF]);render()}
function tp(){const e=$('#tp');if(e)e.textContent=`Recibes ${rate()} de ${RN[TT]}`}
function trade(){const p=P(SP),g=rate();if(TA<1||g<1||R(p)[TF]<TA){toast('No tienes suficiente '+RN[TF]);return}
R(p)[TF]-=TA;R(p)[TT]+=g;S.cnt.trd++;toast(`Cambiados ${TA} de ${RN[TF]} por ${g} de ${RN[TT]}`);const y=window.scrollY;change();window.scrollTo(0,y)}