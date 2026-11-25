# INDEX — qué hay en cada módulo (generado del código)

Formato: `nombre(params)` — qué campos de S toca (lee o escribe) · efectos · llamadas a funciones de otros módulos.
Orden de carga = orden de este índice. Helpers pequeños declarados en la misma sentencia que otro (p. ej. `ST`, `ef`, `IDX`, `K`, `U`, `mem`, `capK`, `used`, `rebWin`, `repT`) viven en el mismo sitio que su vecino.

## util.js
- `$(s)`
- `afford(r,c)`
- `fmt(n)`
- `fmtT(s)`
- `rng(a)`

## state.js
- `S` · localStorage getItem:je_v,getItem:je_code
- `P(id)` · S.cs,S.u,S.ru
- `R(p)` · S.net,S.cs · p.nj,p.r
- `LOG`

## data.js
- `RN`
- `B`
- `T`
- `SH`
- `BT` · S.tech

## rules.js
- `tB(k,L,p)`
- `tT(k,L,p)`
- `tS(t,p)`
- `cost(b,f,L)`
- `cap(p)` · p.dm,p.b
- `prod(p,i)` · S.tech · p.st
- `lv(p,k)` · p.dm,p.b
- `rbT(p)` · p.rb0,p.b
- `defRed(p)` · p.rb,p.b
- `RQ(p,k,tL,b=p.b)` · S.tech · p.b
- `reqTxt(k)`
- `repC(p,k)` · p.b
- `CM()` · p.nj
- `maxL(p,k)`
- `tot()` · S.cs,S.net · p.nj,p.r
- `slots()` · S.tech · p.q,p.bq,p.sq,p.sqq
- `vb(p)` · p.b,p.q,p.bq
- `need(u)`
- `rdPct(fl,u)` · S.tech · % de éxito de un saqueo según el poder de la flota `fl` (usa Armamento); `rdLost(n,t)` · S.tech · pérdidas esperadas de `n` naves del modelo `t` si falla (Blindaje)
- `rdLoot(fl,u)` · S.tech,S.wr · botín máximo fijo del planeta (calculado con `RDN`=10 naves y su desgaste), capacidad de carga (suma por modelo) y botín real = el menor de ambos (Bodegas, Rutas) · `wrW(id,now)` · S.wr · desgaste actual en saqueos (baja lineal hasta 0 en 24 h) · `wrP(id)` · S.tech,S.wr · % de reducción del botín
- `trq(k,L)` · S.cnt,S.tech · texto del requisito de una tecnología ('' si se cumple): saqueos (f, r), niveles de mejoras de saqueo (v) o de Colonización y Propulsión (i); `trN()` · S.tech · lo que falta para Ingeniería naval
- `rdTy()` modelos de saqueo (los de `SH` con `pw`) · `rdN(fl)` nº de naves · `rdPw(fl)` poder · `rdCg(fl)` carga base · `mFl(m)` flota de una misión (`m.f`, o `{r:m.n}` si es antigua) · `mTx(m)` texto «N corsarios/naves»
- `shUn(t)` · S.cnt,S.un,S.tech · ¿modelo desbloqueado? · `shUnT(t)` · texto de cómo se desbloquea, con progreso
- `trC(L)` · S.tech · lo que falta de Colonización y Propulsión para el nivel L+1 de Convoyes ('' si se cumple; lo usa `trq`) · `cvMax()` · S.tech · carga máxima por recurso de un colonizador (0 / 500 / 1.500 / 3.000 según el nivel de Convoyes)
- `SUC` carga por nave de suministros (500) · `SUR` riesgo en ruta `{tot .1, par .2, lo [.3,.7], ship .3}` · `spT(to)` · S.tech · segundos de viaje de un envío de suministros (como las demás misiones, con la distancia del destino, mínimo 1, ×1,5) · `spTx(m)` texto «(N naves)» de una misión de suministros

## engine.js
- `sync()` · S.cs,S.tech,S.net · p.nj,p.b · → toast
- `newGame()` · → rng
- `done(m)` · S.rk,S.known,S.fleet,S.rd,S.wr,S.cnt,S.cs,S.ev,S.tech,S.un · saqueo con flota mixta; en éxito, 12 % de desbloquear el Carguero; colonización: los recursos del convoy (`m.res`) se suman a la colonia nueva o, sin hueco, vuelven al planeta de origen (`m.o`) · → norm,toast,rdPct,rdLoot,rdLost,rdTy,mFl,cxPlan,P,R,supDone
- `supDone(m)` · S.fleet,S.ev · llegada de una misión de suministros (`m.k==='s'`): 70 % llega todo y las naves vuelven; 20 % saqueo parcial (se pierde 30-70 % de la carga, cada nave 30 %); 10 % pérdida total · suma la carga a `R(destino)` (si el destino ya no existe, al origen o al hogar) · → toast,P,R,U
- `visitor()` · S.cs,S.rf,S.ev,S.tech · p.b · el botín ignora la tecnología `i` (Convoyes) al sumar niveles · → toast,histAdd
- `attack(p)` · S.cnt,S.ev · p.rb,p.b,p.dm · → toast,histAdd
- `advance(now)` · S.t,S.sh,S.cs,S.net,S.tech,S.fleet,S.cnt,S.mis,S.rf,S.nv · p.nj,p.rr,p.dm,p.q,p.b,p.rb,p.rq,p.sq · → prod,rbT,toast,startNext,nextShip,evento,histRes,cxRun
- `genRU()` · → rng

## events.js
- `warnP(p)` · p.b,p.dm
- `evento(now,dt)` · S.ne,S.ev,S.cs,S.tech · p.st,p.dm,p.b · → warnP,prod,toast,histAdd

## counter.js
- `cxPlan(to,n)` · S.cx · con n≥3 saqueos con éxito, probabilidad 15 % +10 % por saqueo extra (máx. 60 %); programa el golpe a 5-10 min
- `cxHit(c)` · S.cx,S.sh,S.cs,S.ev · p.dm · resuelve: escudo → nada; si no, 30 % +5 % por saqueo sobre 2 (máx. 85 %) × (1−defRed); roba 20 % y daña un edificio · → defRed,histAdd,toast
- `cxRun(now,dt)` · S.cx · lanza los pendientes; si dt>120 (ausente) los aplaza 2 min

## actions.js
- `change()` · → render
- `reval(p)` · p.b,p.q,p.bq · → maxL,toast
- `startNext(p,t)` · p.q,p.bq
- `nextShip(p,t)` · p.sq,p.sqq
- `build(k)` · p.dm,p.q,p.bq · → cost,afford,maxL,slots
- `cancelQ(i)` · p.bq
- `cancelSQ(i)` · p.sqq
- `research(k)` · S.tech,S.cs · p.rq · → cost,afford,trq
- `ship(t)` · p.sq,p.sqq · → afford,slots,shUn
- `repair(k)` · p.rr,p.dm · → afford,repC
- `accel()` · p.rr · → afford,repC
- `cancelRR()` · p.rr
- `refugee(a)` · S.rf,S.cnt,S.ev · p.rb,p.rb0 · → toast,histRes
- `cancelB()` · p.q
- `cancelR()`
- `cancelS()` · p.sq
- `send(k,to,res)` · S.tech,S.mis,S.fleet,S.cs · `res` {m,c,g} opcional, solo al colonizar: se descuenta del planeta seleccionado y la misión guarda `res` y `o` (origen) · → need,cvTake
- `sendSupply(to,o,n,res)` · S.fleet,S.mis · lanza una misión `{k:'s',to,end,n,res,o}`; valida destino sin red, origen distinto y hueco de misión; la carga se descuenta del origen con `spTake` y las naves de `S.fleet.s` · → spTake,spT,change
- `refundOf(p)` · p.b,p.q,p.rq,p.sq,p.rr · → cost
- `abandon()` · S.mis,S.cs · → toast,selPlanet
- `useAcc(kind)` · S.acc

## dismantle.js
- `DSP`
- `DSM`
- `dsRet(t,n)`
- `dsPl(t,n)` · SH · plural; usa `SH[t].pl` si existe
- `dsTxt(t,n)` · → dsRet,fmt
- `dsUpd()` · → dsTxt
- `dsEx(t)` · S.fleet
- `dsOpen(t)` · S.fleet,S.cs · → dsUpd
- `dsStep(d)` · S.fleet · → dsUpd
- `dsSl(v)` · S.fleet · → dsUpd
- `dsSend()` · → closeM,dismantle
- `dismantle(t,n)` · S.fleet,S.cs · → dsRet,toast,change

## demolish.js
- `DBP`
- `DBM` (estado del modal: edificio; no se guarda)
- `dbWhy(p,k)` · p.b,p.q,p.bq,p.nj · motivo por el que no se puede bajar un nivel ('' si se puede): obra o cola del propio edificio, Hangar con la colonia en red, o requisito de otro edificio (incluidos los encolados) · → vb,RQ
- `dbRet(p,k)` · p.b · 50 % del coste del nivel que se quita · → cost
- `dbTx(c)` · → fmt
- `dbEx(p,k)` · p.b · botón «Desmantelar nivel N» de la tarjeta (deshabilitado con el motivo; nada si el nivel es 0) · → dbWhy
- `dbOpen(k)` · p.b · modal de confirmación; con el Almacén avisa si la capacidad nueva queda por debajo de lo almacenado · → dbWhy,dbRet,dbTx,fmt,U,P,CM
- `dbSend()` · → closeM,demolish
- `demolish(k)` · p.b · R(p) · baja un nivel y suma el 50 % del coste a los recursos de la colonia · → dbWhy,dbRet,dbTx,toast,change

## convoy.js
- `CVM`
- `cvLim()` · S.tech,S.cs · máximo por recurso: carga máxima del nivel y lo disponible en el planeta seleccionado · → cvMax
- `cvTake(res)` · S.cs · descuenta `res` (acotado) del planeta seleccionado y lo devuelve; null si no queda nada · → cvLim
- `cvUpd()` · → fmt
- `cvOpen(to)` · S.tech,S.cs · una fila −/+ y un slider por recurso, inicial 0 · → cvLim,cvMax,fmt,U,P
- `cvStep(k,d)` · → cvLim,cvUpd
- `cvSl(k,v)` · → cvLim,cvUpd
- `cvSend()` · → closeM,send

## supply.js
- `SUM` (estado del modal: destino, origen, naves y carga; no se guarda)
- `spOs()` colonias que pueden ser origen (todas menos el destino) · `spLim(k)` · S.fleet,S.cs · máximo de un recurso: lo que tenga el origen (`R`: la red si está conectado) y el hueco de carga (500 × naves)
- `spTake(p,n,res)` · descuenta `res` (acotado a lo disponible y a 500 × n) de `R(p)` y lo devuelve; null si no queda nada
- `spFix()` recorta la carga al cambiar origen o naves · `spUpd()` · → fmt,spLim
- `spOpen(to)` · S.fleet,S.cs · modal con origen (botones), naves y una fila −/+ y un slider por recurso (−/+ de 10 en 10) · → spT,fmtT,fmt,U,P
- `spPick(o)` · `spSet(k,v)` · `spStep(k,d)` · `spSl(k,v)`
- `spSend()` · → closeM,sendSupply
- `spEx(t)` · S.cs,S.fleet,S.mis · botón «Pedir suministros» de la ficha de la nave `s` en Flota (deshabilitado con el motivo si la colonia está en red, falta nave, otra colonia o hueco de misión) · → spT,fmtT

## storage.js
- `DB`
- `norm(p)` · p.bq,p.sqq,p.b,p.rb0,p.rb,p.dm,p.q,p.rr,p.st
- `key()`
- `ET` (ETag de la última carga/guardado; global de módulo, no va en S), `SV` (guardando), `CK` (comprobando)
- `save()` · Firebase · PUT con if-match=ET; si responde 412 avisa y recarga · → advance,toast,load
- `checkNew()` · Firebase · al volver a primer plano, sin cambios pendientes, recarga si el ETag cambió · → load
- `BK`
- `autoBackup()` · Firebase; localStorage getItem:lk,setItem:lk
- `dlBackup()` · → advance
- `restState(d)` · S.t,S.cs · Firebase · → toast,closeM,render
- `restFile(inp)` · → toast
- `openBk()` · Firebase · → fmtT,closeM
- `setSt()`
- `prep()` · S.mis,S.known,S.fleet,S.rd,S.ru,S.rk,S.tech,S.cs,S.net,S.rq,S.sq,S.nv,S.cnt,S.acc,S.sh,S.ob,S.ne,S.hist,S.cx,S.un,S.wr · p.b · localStorage getItem:je_sp · → genRU,obOk
- `load(c)` · S.t · Firebase (guarda el ETag en ET); localStorage setItem:je_code · → tot,showAway,newGame,advance,render
- `logout()` · localStorage removeItem:je_code · → render

## raids.js
- `raid(to,f)` · S.tech,S.fleet,S.mis · `f` = {modelo:cantidad}; la misión guarda `n` (total) y `f` · → change,need,rdN,rdTy
- `MR`
- `pctN(fl,u)` · → rdPct
- `mUpd()` · → rdLoot,pctN,fmt
- `openRaid(id)` · S.fleet,S.tech · una fila −/+ y un slider por modelo en casa · → fmtT,rdTy
- `mStep(t,d)` · S.fleet · → mFix
- `mSl(t,v)` · S.fleet · → mFix
- `mFix(t)` · deja al menos 1 nave en el envío
- `closeM()`
- `sendRaid()`

## trade.js
- `TF`
- `W`
- `comm()` · S.tech
- `tf(k)` · → render
- `tt(k)` · → render
- `tin(v)`
- `tmax()` · → render
- `tp()`
- `trade()` · S.cnt · → toast,change

## objectives.js
- `lvM(k)` · S.cs · p.b
- `OB` · S.known,S.cs,S.tech,S.cnt · p.nj,p.rb
- `obOk(o)`
- `rwd(i)`
- `rwAmt(i)` · S.cs · → prod
- `obReady()` · S.ob
- `claim(id)` · S.ob,S.cs,S.acc,S.sh · → toast,render
- `obCard(c)` · S.ob · → fmt
- `openObj()` · S.acc,S.sh · → fmtT,closeM

## history.js
- `HLBL`
- `histAdd(k,pid,x,f)` · S.hist · guarda una entrada (`k` n/v/a/c) y deja las 5 últimas de ese tipo; `f` marca refugiados sin decidir
- `histRes(x)` · S.hist · pone el resultado en la última entrada con `f`
- `histOpen()` · S.hist · → $,U,fmtT

## ui-art.js
- `icon(p,c)`
- `SPM`
- `SPR`
- (arranque) if(typeof Image!=='undefined'){const spr=new Image();spr.onl
- `bic(k,L,dm)`
- `BI`
- `TI`
- `SI`
- `gid`
- `planet(id,sz,unk)` · → rng
- `orb(id)`

## ui-core.js
- `tabVis(k)` · S.cs,S.tech · p.b
- `tabAct(k,p)` · p.b
- `warn(p)` · p.rb,p.dm
- `chips(c)` · → fmt
- `chipsS(c)` · → fmt
- `card()` · → fmtT
- `showAway(ms,t0,ev)` · S.rf · → fmt,fmtT,tot,closeM
- `toast(t,pid,v)` · localStorage setItem:je_sp · → render
- `QO`
- `qBlock(h,sm,inner)`
- `qToggle()`
- `bqList(p)` · p.bq · → cancelQ
- `sqList(p)` · p.sqq · → cancelSQ
- `rrCard(p)` · p.rr · → repC,accel,cancelRR
- `rfCard()` · S.rf · → refugee
- `qe(t)`
- `qc(t,e,f)` · S.acc · → cancelB,cancelR,cancelS,useAcc
- `strip()` · S.mis,S.cs · p.q,p.rr,p.rq,p.sq
- `goTo(pid,v)` · localStorage setItem:je_sp
- `go(v)` · localStorage setItem:je_v · → render
- `selPlanet(id)` · localStorage setItem:je_sp · → render

## ui-views.js
- `queueView()` · S.cs,S.tech,S.mis,S.rk · p.q,p.b,p.rr,p.rq,p.sq,p.bq,p.sqq · → goTo,mTx,spTx
- `raidView()` · S.fleet,S.mis,S.tech,S.ru,S.rk,S.wr · desgaste del planeta con color (verde <10 %, amarillo <30 %, rojo) · → fmtT,planet,need,send,openRaid,rdTy,rdN,wrP
- `view(p)` · S.tech,S.cs,S.fleet,S.mis,S.net,S.u,S.known · p.q,p.b,p.rr,p.rq,p.sq,p.dm · → cost,fmt,fmtT,prod,reqTxt,trq,shUn,shUnT,tabVis,tabAct,repC,maxL,icon,bic,planet,card,slots,build,qBlock,bqList,sqList,research,ship,repair,cancelRR,rrCard,cancelB,cancelR,cancelS,need,send,selPlanet,comm,tin,tmax,trade,abandon,dsEx,histOpen,cvOpen,spEx,dbEx

## render.js
- `render()` · S.cs · p.nj · → tabVis,tabAct,warn,planet,orb,rfCard,selPlanet,openBk,openObj,load,logout,view
- `tick(skip)` · S.sh · p.rb,p.st,p.b · → warnP,lv,afford,fmt,fmtT,rbT,defRed,advance,obReady

## main.js
- (arranque) setInterval(()=>tick(),1000);
- (arranque) setInterval(()=>{if(dirty)save()},15000);
- (arranque) document.addEventListener('visibilitychange',()=>{if(documen… (oculta: guarda si dirty; visible: checkNew)
- (arranque) render();
- (arranque) if(code)load(code);
