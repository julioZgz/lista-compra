/* render.js — render(): pinta toda la app; tick(): refresco por segundo de contadores y botones.
 * Lee: S. Escribe: DOM.
 * NO debe: mutar S salvo llamar a advance en tick.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
function render(){const a=$('#app');
if(!S){a.innerHTML=`<div style="text-align:center">${planet(0,130)}</div><h1>Colonias Estelares</h1><p class=st>Escribe el nombre de tu partida. Si no existe, se crea una nueva.</p><input id=cd placeholder="Nombre de la partida" value="${code}" autocapitalize=off><button class=go onclick="load($('#cd').value)">Entrar</button><p class=st>${err||st}</p>`;return}
const p=P(SP);
a.innerHTML=`<div class=top><h1>📍 ${U(SP).name}</h1><div class=st><span id=st>${st}</span> <button onclick="openBk()" style="background:none;border:0;color:var(--mu);text-decoration:underline">Copias</button> <button onclick="logout()" style="background:none;border:0;color:var(--mu);text-decoration:underline">Salir</button></div></div>
<div class=hd><div class=tabs>${S.cs.map(c=>`<button class="tab ${c.id===SP?'on':''}${warn(c)?' warn':''}" onclick="selPlanet(${c.id})">${orb(c.id)}${warn(c)?'⚠ ':''}${U(c.id).name}<span class=ind>${[['🔧',c.q||c.rr],['🚀',c.sq],['🧪',c.rq]].map(([i,a])=>`<i class="${a?'on':''}">${i}</i>`).join('')}</span></button>`).join('')}</div>
<div class=row style="min-height:30px;margin:2px 0"><div class=st>${arkIc(p)}${p.nj?'🔗 Recursos de la red interplanetaria':''}</div><div onclick="openObj()" style="cursor:pointer;display:flex;align-items:center;gap:6px;flex:none"><span id=obn class=obn></span><span style="font-size:22px">🏅</span></div></div><div class=res>${[0,1,2].map(i=>`<div class=rs><span class="${'mcg'[i]}">${RN['mcg'[i]]}</span><strong id=rv${i}></strong><small id=rp${i}></small></div>`).join('')}</div><div class=st id=rbi style="margin:-6px 0 6px"></div></div>
${rfCard()}
${view(p)}
<nav>${[['b','Colonia'],['i','Laboratorio'],['f','Astillero'],['p','Puerto'],['e','Imperio']].filter(([k])=>tabVis(k)).map(([k,n])=>`<button class="${V===k?'on':''}" ${tabAct(k,p)?'':'disabled'} onclick="tabGo('${k}')">${n}</button>`).join('')}</nav>`;const tb=document.querySelector('.tabs'),ta=document.querySelector('.tab.on');if(tb&&ta)tb.scrollLeft=ta.offsetLeft-tb.clientWidth/2+ta.offsetWidth/2;tick(true)}
function tick(skip){if(!S)return;if(!skip&&advance(Date.now()))dirty=true,render();
const p=P(SP),rp=p;
const nb=$('#obn');if(nb)nb.textContent=obReady()?'¡Recompensa disponible!':'';
const ri=$('#rbi');if(ri){ri.textContent=(p.rb>=40?'⚠ ':'')+`Rebelión ${p.rb.toFixed(0)}% (→ ${rbT(p).toFixed(0)}%) · Defensas −${Math.round(defRed(p)*100)}% a los rebeldes`+(p.rb>50?` · éxito rebelde ${Math.round(rebWin(p)*100)}%`:' · sin ataques')+(S.sh>0?` · 🛡️ ${fmtT(Math.round(S.sh/1000))}`:'')+(lv(p,'v')>0?` · Preaviso ${Math.round(warnP(p)*100)}%`:'')+(p.st>Date.now()?` · ⛈ tormenta ${fmtT(Math.ceil((p.st-Date.now())/1000))}`:'');ri.style.color=p.rb>50?'#ff8a8a':p.rb>=40?'#ffb547':''}
for(let i=0;i<3;i++){const k='mcg'[i],r=R(p)[k],c=capN(p,k),e=$('#rv'+i);if(e){e.textContent=fmt(r)+' / '+fmt(c);e.className=r>=c?'full':'';$('#rp'+i).textContent='+'+prodN(p,i).toFixed(1)+'/s'}}
document.querySelectorAll('[data-cost]').forEach(b=>{if(!b.dataset.off){const c=JSON.parse(b.dataset.cost);b.disabled=!afford(R(rp),c);avSet(b,c,rp)}});
document.querySelectorAll('.ch[data-n]').forEach(e=>{const k=e.dataset.k,n=+e.dataset.n,miss=n-R(rp)[k];let t=`${fmt(n)} ${RN[k]}`;
if(miss>0){t+=n>capN(rp,k)?' · mejora el almacén':` · faltan ${fmt(Math.ceil(miss))}`;const pr=prodN(rp,IDX[k]);if(n<=capN(rp,k)&&pr>0)t+=` (${fmtT(Math.ceil(miss/pr))})`}
e.textContent=t;e.classList.toggle('lack',miss>0)});tp();
document.querySelectorAll('[data-end]').forEach(e=>e.textContent=fmtT(Math.max(0,Math.ceil((e.dataset.end-Date.now())/1000))))}
const avTx=s=>s<60?Math.ceil(s)+' s':s<3600?Math.ceil(s/60)+' min':Math.ceil(s/3600)+' h';
function avSet(b,c,p){if(b.children.length||!/^(build|research|ship)\(/.test(b.getAttribute('onclick')||''))return;if(b.dataset.t0===undefined)b.dataset.t0=b.textContent;let x='';if(b.disabled){const t=avT(p,c);x=t===-1?'Sube el Almacén':t===-2?'Sin producción':t>0?'en '+avTx(t):''}const s=x?b.dataset.t0+' · '+x:b.dataset.t0;if(b.textContent!==s)b.textContent=s}
