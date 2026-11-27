/* stats.js — Panel de estadísticas del Imperio: producción por hora por colonia, total de la red y almacenes (lleno/capacidad, tiempo hasta llenar).
 * Lee: S.cs, S.net (con prod, prodN, capK, capN, R). Escribe: solo el DOM de #stb (se repinta solo mientras la sub-pestaña está abierta).
 * NO debe: mutar S, guardar, tocar colas ni fórmulas. Solo lectura. */
const SK=['m','c','g'];let statsTm=null;
const statsFill=(h,cp,q)=>{if(h>=cp-.5)return{tx:'Almacén lleno',c:semC(0,120,30)};if(q<=0)return{tx:'Sin producción',c:'inherit'};const s=Math.ceil((cp-h)/q);return{tx:'Se llena en '+fmtT(s),c:semC(s/60,120,30)}};
const statsBox=(t,p,net)=>`<div class=card><b>${t}</b>`+SK.map((k,i)=>{const h=net?S.net[k]:p.r[k],cp=net?capN(p,k):capK(p,k),q=net?prodN(p,i):prod(p,i),f=statsFill(h,cp,q),pc=Math.min(100,Math.round(100*h/Math.max(1,cp)));return `<div style="margin-top:8px"><div class=row><span class="${k}">${RN[k]}</span><span>${fmt(Math.floor(h))} / ${fmt(cp)}</span></div><div style="height:6px;border-radius:3px;background:#26344f;margin:4px 0"><div style="height:6px;border-radius:3px;width:${pc}%;background:#4a6fa5"></div></div><div class=st><b style="color:${f.c}">${f.tx}</b> · +${fmt(Math.round(q*3600))}/h</div></div>`}).join('')+'</div>';
const statsTr=(n,f,b)=>`<tr${b?' style="font-weight:700;border-top:1px solid #26344f"':''}><td>${n}</td>`+SK.map((k,i)=>`<td style="text-align:right">${fmt(Math.round(f(i)*3600))}</td>`).join('')+'</tr>';
function statsBody(){const net=S.cs.filter(p=>p.nj),lo=S.cs.filter(p=>!p.nj),sm=(a,i)=>a.reduce((x,p)=>x+prod(p,i),0);
let h=`<div class=card><b>Producción por hora</b><table style="width:100%;margin-top:8px;border-collapse:collapse"><tr class=st><td></td>${SK.map(k=>`<td style="text-align:right"><span class="${k}">${RN[k]}</span></td>`).join('')}</tr>`+S.cs.map(p=>statsTr(U(p.id).name+(p.nj?' 🔗':''),i=>prod(p,i))).join('')+(net.length?statsTr('Total red 🔗',i=>sm(net,i),1):'')+(net.length&&lo.length?statsTr('Total imperio',i=>sm(S.cs,i),1):'')+`</table><p class=st>🔗 = unida a la red. Incluye tormentas solares y edificios dañados.</p></div>`;
if(net.length)h+=statsBox('Almacén de la red 🔗 ('+net.length+' colonias)',net[0],1);
lo.forEach(p=>{h+=statsBox('Almacén de '+U(p.id).name,p,0)});return h}
function statsLive(){const e=document.getElementById('stb');if(!e||V!=='e'||SUBE!=='s'){clearInterval(statsTm);statsTm=null;return}e.innerHTML=statsBody()}
function statsView(){if(!statsTm)statsTm=setInterval(statsLive,2000);return `<div id=stb>${statsBody()}</div>`}
