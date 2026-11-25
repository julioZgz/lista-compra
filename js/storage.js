/* storage.js — Persistencia: Firebase (juego_espacial/<code>, juego_espacial_copias), copias y archivos, migración de partidas (norm, prep), load/save/logout.
 * localStorage: je_code, je_sp (lee), je_bk_<code>. Escribe S al cargar.
 * NO debe: contener reglas de juego. Campos nuevos de S: valor por defecto en norm/prep, nunca renombrar.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */

const DB='https://lista-compra-3e6a2-default-rtdb.europe-west1.firebasedatabase.app';
function norm(p){p.bq=p.bq||[];p.sqq=p.sqq||[];for(const k of['o','k','w','t','p','v'])p.b[k]=p.b[k]||0;if(p.b.z==null)p.b.z=Math.min(10,Math.max(0,Math.max(...['m','c','g','a','s','l','u','d','h','w','t','p'].map(x=>p.b[x]||0))-2));p.rb0=p.rb0??(p.id?8+(p.id*7)%23:10);p.rb=p.rb??p.rb0;p.dm=p.dm||[];p.st=p.st||0;if(p.q&&p.q.rep){p.rr={k:p.q.k,end:Math.min(p.q.end,Date.now()+repT(p,p.q.k)*1000),c:p.q.c};delete p.q}}
const key=()=>encodeURIComponent(code.replace(/[.$#\[\]\/]/g,'_'));
let ET=null,SV=0,CK=0;
async function save(){if(!S||!code||SV)return;SV=1;advance(Date.now());
try{const r=await fetch(`${DB}/juego_espacial/${key()}.json`,{method:'PUT',headers:ET?{'if-match':ET}:{},body:JSON.stringify(S),keepalive:true});
if(r.status===412){SV=0;st='Partida actualizada en otro dispositivo';setSt();toast('Partida actualizada en otro dispositivo: recargando');load(code);return}
if(!r.ok)throw 0;ET=r.headers.get('ETag');dirty=false;st='Guardado';autoBackup()}
catch(e){st='Sin guardar (revisa la conexión o las reglas de Firebase)'}SV=0;setSt()}
async function checkNew(){if(!S||!code||dirty||!ET||SV||CK)return;CK=1;
try{const r=await fetch(`${DB}/juego_espacial/${key()}.json`,{headers:{'X-Firebase-ETag':'true'}});const e=r.headers.get('ETag');if(r.ok&&e&&e!==ET&&!dirty&&!SV){CK=0;load(code);return}}catch(e){}CK=0}
let BK={};
async function autoBackup(){const n=Date.now(),lk='je_bk_'+code;if(n-(+localStorage.getItem(lk)||0)<18e5)return;
try{const r=await fetch(`${DB}/juego_espacial_copias/${key()}/s${Math.floor(n/18e5)%3}.json`,{method:'PUT',body:JSON.stringify(S)});if(r.ok)localStorage.setItem(lk,n)}catch(e){}}
function dlBackup(){advance(Date.now());const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download=`colonias-${code}-${new Date().toISOString().slice(0,16).replace(/[:T]/g,'-')}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),5000)}
function restState(d){if(!d||!d.cs||!d.u||!d.tech){toast('El archivo no es una partida válida');return}
if(!confirm('Esto reemplazará tu partida actual por la copia. Antes se guardará una copia "previa" de la actual. ¿Continuar?'))return;
closeM();try{fetch(`${DB}/juego_espacial_copias/${key()}/previa.json`,{method:'PUT',body:JSON.stringify(S)})}catch(e){}
S=JSON.parse(JSON.stringify(d));prep();S.t=Date.now();SP=S.cs.some(c=>c.id===SP)?SP:S.cs[0].id;dirty=true;ET=null;toast('Copia restaurada');save();render()}
function restFile(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{restState(JSON.parse(r.result))}catch(e){toast('El archivo no es una partida válida')}};r.readAsText(f)}
async function openBk(){const m=$('#md');m.style.display='flex';let lst='';
try{const r=await fetch(`${DB}/juego_espacial_copias/${key()}.json`);BK=(await r.json())||{};const it=Object.entries(BK).filter(([k,v])=>v&&v.cs).sort((a,b)=>b[1].t-a[1].t);
lst=it.length?it.map(([k,v])=>`<button class=go style="margin-top:8px;background:#26344f;color:var(--tx)" onclick="restState(BK.${k})">${k==='previa'?'Restaurar la partida previa a la última restauración':'Restaurar copia de hace '+fmtT(Math.round((Date.now()-v.t)/1000))}</button>`).join(''):'<p class=st>Aún no hay copias automáticas.</p>'}catch(e){lst='<p class=st>No se pudieron leer las copias automáticas.</p>'}
m.innerHTML=`<div class=card style="width:100%;max-width:420px;max-height:80vh;overflow:auto"><b>Copias de seguridad</b><p class=st>Además de tu partida, se guarda una copia automática cada 30 minutos (las 3 últimas).</p><button class=go onclick="dlBackup()">Descargar copia (archivo)</button><button class=go style="margin-top:8px;background:#26344f;color:var(--tx)" onclick="$('#bf').click()">Restaurar desde archivo</button><input type=file id=bf accept=".json,application/json" style="display:none" onchange="restFile(this)"><div class=st style="margin-top:12px">Copias automáticas</div>${lst}<button class=go style="margin-top:12px;background:none;color:var(--mu);border:1px solid var(--ln)" onclick="closeM()">Cerrar</button></div>`}
function setSt(){const e=$('#st');if(e)e.textContent=st}
function prep(){S.mis=S.mis||[];S.known=S.known||[0];S.fleet.r=S.fleet.r||0;for(const k of['f','k','a','s'])S.fleet[k]=S.fleet[k]||0;S.un=S.un||{};S.rd=S.rd||{};S.wr=S.wr||{};for(const k in S.rd)if(!S.wr[k])S.wr[k]={w:S.rd[k],t:Date.now()};S.ru=S.ru||genRU();S.rk=S.rk||[];for(const k in T)S.tech[k]=S.tech[k]||0;S.cs.forEach(norm);S.cs.forEach(p=>{p.b.u=p.b.u||0;p.b.d=p.b.d||0;p.b.h=p.b.h||0});S.net=S.net||{m:0,c:0,g:0};if(S.rq){S.cs[0].rq=S.rq;delete S.rq}if(S.sq){S.cs[0].sq=S.sq;delete S.sq}S.nv=S.nv||Date.now()+(300+Math.random()*300)*1000;{const sv=+localStorage.getItem('je_sp');SP=S.cs.some(c=>c.id===sv)?sv:S.cs[0].id}S.cnt=S.cnt||{};for(const k of['rep','sac','trd','ref','cor','rp'])S.cnt[k]=S.cnt[k]||0;S.cnt.sacT=S.cnt.sacT||[];S.acc=S.acc||0;S.sh=S.sh||0;S.ne=S.ne||Date.now()+(1200+Math.random()*1200)*1000;S.hist=S.hist||[];S.cx=S.cx||[];
if(!S.ob){S.ob={};for(const c of OB){let i=0;while(i<c.l.length&&obOk(c.l[i]))i++;S.ob[c.id]=i}}}
async function load(c){code=c.trim();if(!code)return;localStorage.setItem('je_code',code);err='';st='Cargando…';S=null;render();
try{let r;try{r=await fetch(`${DB}/juego_espacial/${key()}.json`,{headers:{'X-Firebase-ETag':'true'}})}catch(e){r=await fetch(`${DB}/juego_espacial/${key()}.json`)}
if(!r.ok)throw 0;ET=r.headers.get('ETag');const d=await r.json();
S=d||newGame();prep();const away=d?Date.now()-S.t:0,t0=tot();LOG=[];advance(Date.now());const evl=LOG;LOG=null;dirty=!d;if(away>9e5)showAway(away,t0,evl);st=d?'Partida cargada':'Partida nueva';if(!d)save()}
catch(e){S=null;err='No se pudo conectar con Firebase. Comprueba las reglas de la base de datos.'}render()}
function logout(){code='';S=null;localStorage.removeItem('je_code');render()}

/* Vistas */
