/* ui-views.js — Vistas de cada pestaña: view (Edificios/Investigar/Flota/Mapa/Comercio…), queueView, raidView.
 * Lee: S. Solo genera HTML con botones onclick hacia actions/raids/trade.
 * NO debe: mutar S directamente.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
function queueView(){const a=[];
S.cs.forEach(p=>{const n=U(p.id).name;
p.q&&a.push({e:p.q.end,t:`${B[p.q.k].n} → nivel ${p.b[p.q.k]+1}`,w:n,pid:p.id,v:'b',i:'🔧'});
p.rr&&a.push({e:p.rr.end,t:`Reparando ${B[p.rr.k].n}`,w:n,pid:p.id,v:'b',i:'🛠️'});
p.rq&&a.push({e:p.rq.end,t:`Investigando ${T[p.rq.k].n} → nivel ${S.tech[p.rq.k]+1}`,w:n,pid:p.id,v:'i',i:'🧪'});
p.sq&&a.push({e:p.sq.end,t:`Construyendo ${SH[p.sq.t].n}`,w:n,pid:p.id,v:'f',i:'🚀'});(p.bq||[]).forEach((it,i)=>a.push({e:1e15+i,t:`En cola: ${B[it.k].n} → nivel ${it.L+1}`,w:n,pid:p.id,v:'b',i:'⏳'}));(p.sqq||[]).forEach((it,i)=>a.push({e:1e15+i,t:`En cola: ${SH[it.t].n}`,w:n,pid:p.id,v:'f',i:'⏳'}))});
S.mis.forEach(m=>{const u=U(m.to),oc=m.to>=100&&!S.rk.includes(m.to);a.push({e:m.end,t:`${{x:'Explorando',c:'Colonizando',r:'Saqueando'}[m.k]} ${oc?'un puesto rival':u.name}${m.k==='r'?` (${m.n} corsarios)`:''}`,w:'Misión',pid:null,v:m.to>=100?'r':'m',i:m.k==='r'?'⚔️':m.k==='c'?'🪐':'🔭'})});
a.sort((x,y)=>x.e-y.e);
return a.length?`<p class=st>En marcha en todos tus planetas: ${a.length}. Toca una para ir a ella.</p>`+a.map(x=>`<div class=card style="cursor:pointer" onclick="goTo(${x.pid===null?'null':x.pid},'${x.v}')"><div class=row><div class=pl><b style="font-size:20px">${x.i}</b><div><b>${x.t}</b><div class=st>${x.w}</div></div></div><span class=lv ${x.e>1e14?'':`data-end="${x.e}"`}>${x.e>1e14?'en cola':''}</span></div></div>`).join(''):'<p class=st>No hay nada en marcha.</p>'}
function raidView(){let h=`<p class=st>Corsarios: ${S.fleet.r} · Misiones: ${S.mis.length}/${1+S.tech.m}</p>`;
S.ru.forEach(u=>{const kn=S.rk.includes(u.id),bm=S.mis.find(m=>m.to===u.id),n=need(u),secs=Math.ceil(u.dist*20/(1+.25*S.tech.p)),cnt=S.rd['p'+u.id]||0;
const fr=S.mis.length>=1+S.tech.m?'Sin misiones libres (Flotas coordinadas)':S.tech.p<n?`Fuera de alcance: Propulsión ${n}`:'';let btn;
if(bm)btn=`<button class=go disabled>${{x:'Explorando',r:'Saqueando'}[bm.k]} (<span data-end="${bm.end}"></span>)</button>`;
else if(!kn){const off=fr||(S.fleet.e<1?'Necesitas un explorador':'');btn=`<button class=go ${off?'disabled':''} onclick="send('x',${u.id})">${off||`Explorar (${fmtT(secs)})`}</button>`}
else{const off=fr||(S.fleet.r<1?'Necesitas corsarios':'');btn=`<button class=go style="background:#e8a86a" ${off?'disabled':''} onclick="openRaid(${u.id})">${off||'Saquear'}</button>`}
h+=`<div class=card><div class=pl>${planet(u.id,60,!kn)}<div><b>${kn?u.name:'Puesto sin explorar'}</b><div class=st>Distancia ${u.dist}${kn?` · Defensa ${Math.ceil(u.dist/2)+1}${cnt?' · botín reducido':''}`:''}</div></div></div><div style="margin-top:8px">${btn}</div></div>`});return h}
function view(p){if(!tabVis(V)||!tabAct(V,p))V='b';let h=(V==='b'&&p.st>Date.now()?`<div class=card>⛈️ Tormenta solar: las minas van al 50% (<span data-end="${p.st}"></span>)</div>`:'')+(V==='b'?qBlock(`Cola de obras ${used(p)}/${slots()}`,p.q?`${B[p.q.k].n} · <span data-end="${p.q.end}"></span>`:'vacía',(p.q?qc(`Construyendo ${B[p.q.k].n} (nivel ${p.b[p.q.k]+1})`,p.q.end,'cancelB()'):qe('Nada en construcción'))+bqList(p)):'')+(V==='b'&&p.rr?rrCard(p):'')+(V==='i'?(p.rq?qc(`Investigando ${T[p.rq.k].n} (nivel ${S.tech[p.rq.k]+1})`,p.rq.end,'cancelR()'):qe('Nada en investigación')):'')+(V==='f'?qBlock(`Cola de naves ${sUsed(p)}/${slots()}`,p.sq?`${SH[p.sq.t].n} · <span data-end="${p.sq.end}"></span>`:'vacía',(p.sq?qc(`Construyendo ${SH[p.sq.t].n}`,p.sq.end,'cancelS()'):qe('Nada en construcción de naves'))+sqList(p)):'');
if(V==='b')for(const k in B){const L=p.b[k],mx=maxL(p,k),i=IDX[k],vbb=vb(p),Lq=vbb[k];if(p.dm.includes(k)){h+=p.rr&&p.rr.k===k?card(B[k].n,`Nivel ${L}/${mx}`,'⚠ Reparándose.',p.rr.c,`Cancelar reparación (<span data-end="${p.rr.end}"></span>)`,'cancelRR()','',bic(k,L,true),repT(p,k),undefined,1):card(B[k].n,`Nivel ${L}/${mx}`,'⚠ Dañado: no funciona hasta que lo repares.',repC(p,k),'Reparar',`repair('${k}')`,p.rr?`Reparación en curso (<span data-end="${p.rr.end}"></span>)`:'',bic(k,p.b[k],p.dm.includes(k)),repT(p,k));continue}
let d=B[k].d+(i!==undefined?` Ahora: ${prod(p,i).toFixed(1)}/s. Este planeta limita la mina al nivel ${mx}. Más nivel, más rebelión.`:'');
if(k==='v')d+=` Ahora: ${Math.round(warnP(p)*100)}% de preaviso.`;
d+=reqTxt(k);
const cq=Lq<mx?cost(B[k].b,B[k].f,Lq):null,rq=Lq>=mx?'Nivel máximo':RQ(p,k,Lq+1,vbb).length?'Requiere '+RQ(p,k,Lq+1,vbb).join(', '):used(p)>=slots()?`Cola llena (${used(p)}/${slots()})`:'';
const eq=`<button class=go style="margin-top:8px" ${rq?'disabled data-off=1':`data-cost='${JSON.stringify(cq)}'`} onclick="build('${k}')">${rq||`Encolar nivel ${Lq+1} · ${Object.entries(cq).map(([x,v])=>fmt(v)+' '+RN[x].toLowerCase()).join(', ')}`}</button>`;
if(p.q&&p.q.k===k){h+=card(B[k].n,`Nivel ${L}/${mx}${Lq>L?` (→${Lq})`:''}`,d,p.q.c,`Cancelar construcción (<span data-end="${p.q.end}"></span>)`,'cancelB()','',bic(k,L,false),tB(k,L,p),undefined,1,eq);continue}
h+=card(B[k].n,`Nivel ${L}/${mx}${Lq>L?` (→${Lq})`:''}`,d,cq,p.q?'Encolar':'Mejorar',`build('${k}')`,rq,bic(k,p.b[k],p.dm.includes(k)),Lq<mx?tB(k,Lq,p):0)}
else if(V==='i')for(const k in T){const L=S.tech[k],lab=lv(p,'l');
if(p.rq&&p.rq.k===k){h+=card(T[k].n,`Nivel ${L}/${T[k].max}`,T[k].d,p.rq.c,`Cancelar investigación (<span data-end="${p.rq.end}"></span>)`,'cancelR()','',icon(TI[k]),tT(k,L,p),undefined,1);continue}
h+=card(T[k].n,`Nivel ${L}/${T[k].max}`,T[k].d,L<T[k].max?cost(T[k].b,T[k].f,L):null,'Investigar',`research('${k}')`,L>=T[k].max?'Nivel máximo':p.rq?`Investigación en curso (<span data-end="${p.rq.end}"></span>)`:S.cs.some(q=>q.rq&&q.rq.k===k)?'Ya se investiga en otro planeta':lab<L+1?`Requiere laboratorio nivel ${L+1}`:'',icon(TI[k]),L<T[k].max?tT(k,L,p):0)}
else if(V==='f'){for(const t in SH){const d=SH[t];const eqS=(()=>{const off=lv(p,'s')<d.s?`Requiere astillero nivel ${d.s}`:sUsed(p)>=slots()?`Cola llena (${sUsed(p)}/${slots()})`:'';return `<button class=go style="margin-top:8px" ${off?'disabled data-off=1':`data-cost='${JSON.stringify(d.b)}'`} onclick="ship('${t}')">${off||`Encolar otro ${d.n.toLowerCase()}`}</button>`})();
if(p.sq&&p.sq.t===t){h+=card(d.n,`Disponibles: ${S.fleet[t]}`,d.d,p.sq.c,`Cancelar construcción (<span data-end="${p.sq.end}"></span>)`,'cancelS()','',icon(SI[t]),tS(t,p),undefined,1,eqS+dsEx(t));continue}
h+=card(d.n,`Disponibles: ${S.fleet[t]}`,d.d,d.b,p.sq?'Encolar':'Construir',`ship('${t}')`,lv(p,'s')<d.s?`Requiere astillero nivel ${d.s}`:sUsed(p)>=slots()?`Cola llena (${sUsed(p)}/${slots()})`:'',icon(SI[t]),tS(t,p),undefined,undefined,dsEx(t))}
h+='<b>Misiones en curso</b>'+(S.mis.length?S.mis.map(m=>`<div class=card><div class=row><b>${{x:'Explorando',c:'Colonizando',r:'Saqueando'}[m.k]} ${U(m.to).name}${m.k==='r'?' ('+m.n+')':''}</b><span class=lv data-end=${m.end}></span></div></div>`).join(''):'<p class=st>No hay misiones en curso.</p>')}
else if(V==='q'){h+=queueView()}else if(V==='r'){h+=raidView()}else if(V==='x'){const ch=(f,cur)=>RS.map(k=>`<button class="tab ${k===cur?'on':''}" onclick="${f}('${k}')"><span class="${k}">${RN[k]}</span></button>`).join('');
h=`<div class=card><b>Comercio en ${U(p.id).name}</b><p>Los mercaderes cambian recursos con una comisión del ${Math.round(comm()*100)}%. Los valores relativos son: 1 metal, 1,7 cristal y 3,4 gas.</p><div class=st>Dar</div><div class=tabs>${ch('tf',TF)}</div><div class=st>Recibir</div><div class=tabs>${ch('tt',TT)}</div><div class=st>Cantidad (tienes ${fmt(R(p)[TF])})</div><input id=ta type=number inputmode=numeric min=0 value="${TA}" oninput="tin(this.value)"><button class="tab" type=button onclick="tmax()">Todo</button><p id=tp style="margin-top:10px"></p><button class=go onclick="trade()">Cambiar</button></div>`}
else{const tt2={m:0,c:0,g:0},pp=[0,0,0];S.cs.forEach(q=>{for(let i=0;i<3;i++){if(!q.nj)tt2['mcg'[i]]+=R(q)['mcg'[i]];pp[i]+=prod(q,i)}});if(S.cs.some(q=>q.nj))for(const k in tt2)tt2[k]+=S.net[k];
h+=`<p class=st>Alcance actual: distancia ${2+2*S.tech.p}. Misiones: ${S.mis.length}/${1+S.tech.m}. Colonias: ${S.cs.length}/${1+S.tech.c}.</p>`;
S.u.filter(u=>u.id).forEach(u=>{const own=P(u.id),kn=S.known.includes(u.id),bm=S.mis.find(m=>m.to===u.id),busy=!!bm,n=need(u),secs=Math.ceil(u.dist*20/(1+.25*S.tech.p));
let info=kn?`Máx. de minas: metal ${u.rich[0]}, cristal ${u.rich[1]}, gas ${u.rich[2]}`:'Recursos desconocidos',btn;
if(own)btn=`<button class=go onclick="selPlanet(${u.id});go('b')">Ir a la colonia</button>`;
else{const k=kn?'c':'x',lab=kn?'Colonizar':'Explorar',have=kn?S.fleet.c:S.fleet.e,slot=!kn||S.cs.length+S.mis.filter(m=>m.k==='c').length<1+S.tech.c;
const off=busy?`En camino (<span data-end="${bm.end}"></span>)`:S.mis.length>=1+S.tech.m?'Sin misiones libres (Flotas coordinadas)':S.tech.p<n?`Fuera de alcance: Propulsión ${n}`:have<1?`Necesitas un ${kn?'colonizador':'explorador'}`:!slot?'Sin capacidad: investiga Colonización':'';
btn=`<button class=go ${off?'disabled':''} onclick="send('${k}',${u.id})">${off||lab+' ('+fmtT(secs)+')'}</button>`}
h+=`<div class=card><div class=pl>${planet(u.id,60,!kn&&!own)}<div><b>${kn||own?u.name:'Planeta sin explorar'}</b><div class=st>Distancia ${u.dist} · ${info}</div></div></div>${own?'<div class=tag>Colonizado</div>':''}<div style="margin-top:8px">${btn}</div></div>`})}
if(V==='b'&&p.id)h+=`<button class=go style="background:#ff8a8a" onclick="abandon()">Abandonar colonia</button>`;
return h}
