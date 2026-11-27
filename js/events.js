/* events.js — Eventos aleatorios (tormenta solar, meteorito, hallazgo de recursos, tecnología gratis), preaviso de la Estación de vigilancia y eventos de exploración (anomalía, ruinas, piratas).
 * Lee/Escribe: S.ne, S.ev, S.hist (vía histAdd), S.tech, S.bo, S.sh (lee), p.st, p.dm y recursos de la colonia afectada. Lo llama advance (engine); exEvt la llama done (engine).
 * NO debe: construir HTML, leer localStorage ni guardar. */
const warnP=p=>Math.min(.8,.08*lv(p,'v'));
function evento(now,dt){if(S.ne>now)return false;S.ne=now+(1200+Math.random()*1200)*1000;if(dt>120)return false;
const p=S.cs[Math.floor(Math.random()*S.cs.length)],n=U(p.id).name,w=Math.random()<warnP(p),r=Math.random();let t=null;
if(r>=.95){const c=Object.keys(T).filter(k=>T[k].max>1&&S.tech[k]<T[k].max&&!S.cs.some(q=>q.rq&&q.rq.k===k));if(c.length)t=c[Math.floor(Math.random()*c.length)]}
if(r<.35){p.st=Math.max(p.st||0,now+(w?300:600)*1000);S.ev=w?`Tormenta solar en ${n}: la estación de vigilancia la anticipó y las minas van al 50% solo 5 min.`:`Tormenta solar en ${n}: las minas van al 50% durante 10 min.`}
else if(r<.65){const ok=Object.keys(p.b).filter(k=>p.b[k]>0&&!p.dm.includes(k));
if(w||!ok.length)S.ev=`Cae un meteorito cerca de ${n}${w?': la estación de vigilancia lo detectó a tiempo y no causa daños':' sin causar daños'}.`;
else{const k=ok[Math.floor(Math.random()*ok.length)];p.dm.push(k);S.ev=`Un meteorito impacta en ${n}: ${B[k].n} dañado.`}}
else if(t){S.tech[t]++;S.ev=`Hallazgo en ${n}: unos restos antiguos te dan ${T[t].n} nivel ${S.tech[t]} gratis.`}
else{const g={};for(let i=0;i<3;i++){g['mcg'[i]]=Math.round(600*prod(p,i));R(p)['mcg'[i]]+=g['mcg'[i]]}S.ev=`Hallazgo en ${n}: encuentras ${g.m} de metal, ${g.c} de cristal y ${g.g} de gas.`}
histAdd('n',p.id,S.ev);toast(S.ev,p.id,'b');return true}
/* Evento al explorar con éxito (prob. exEvP en rules): piratas (25 % - 3 pts x Espionaje), anomalía o ruinas (40:35). Devuelve el texto ('' si no hay evento); lo anota done en el historial y el aviso. */
function exEvt(to,end){if(Math.random()>=exEvP())return'';const es=S.tech.s||0,p=S.cs[0],n=U(p.id).name;
if(Math.random()*100<25-3*es){if(S.sh>0)return'Unos piratas rondaban la ruta, pero tu escudo los ha ahuyentado.';const f=Math.max(2,12-2*es)/100,l={};for(const k of['m','c','g']){l[k]=Math.floor(R(p)[k]*f);R(p)[k]-=l[k]}return`Piratas en la ruta: roban ${l.m} de metal, ${l.c} de cristal y ${l.g} de gas de ${n}.`}
if(Math.random()<40/75){const d=20+5*es;S.bo=Math.max(S.bo||0,end+d*60000);return`Anomalía detectada: +25 % de producción en todas tus colonias durante ${d} min.`}
const t=15+5*es,g={};for(let i=0;i<3;i++){g['mcg'[i]]=Math.round(60*t*prod(p,i));R(p)['mcg'[i]]+=g['mcg'[i]]}return`Ruinas antiguas: encuentras ${g.m} de metal, ${g.c} de cristal y ${g.g} de gas en ${n} (${t} min de producción).`}
