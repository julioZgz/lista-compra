/* eventos.js — Eventos aleatorios (tormenta solar, meteorito, hallazgo de recursos, tecnología gratis) y preaviso de la Estación de vigilancia.
 * Lee/Escribe: S.ne, S.ev, S.tech, p.st, p.dm y recursos de la colonia afectada. Lo llama advance (engine).
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
toast(S.ev,p.id,'b');return true}
