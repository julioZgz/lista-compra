# INDEX — qué hay en cada módulo (generado del código)

Formato: `nombre(params)` — qué campos de S toca (lee o escribe) · efectos · llamadas a funciones de otros módulos.
Orden de carga = orden de este índice. Helpers pequeños declarados en la misma sentencia que otro (p. ej. `ST`, `ef`, `IDX`, `K`, `U`, `mem`, `capK`, `used`, `rebWin`, `repT`) viven en el mismo sitio que su vecino.

## util.js
- `$(s)`
- `afford(r,c)`
- `fmt(n)`
- `fmtT(s)`
- `rng(a)`
- `semC(v,g,y)` · color semántico (verde `#6fcf97` / amarillo `#f2c94c` / rojo `#ff8a8a`): con `g>y` más alto es mejor (≥g verde, ≥y amarillo), con `g<y` más bajo es mejor (<g verde, <y amarillo); lo usan `raidView` (desgaste) y `mUpd` (éxito)

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
- `avT(p,c)` · S.net · p.nj,p.r · segundos hasta poder pagar el coste `c` (máximo de los recursos que faltan; con red usa `R`, `capN`, `prodN`); 0 si ya se puede, -1 si `c` supera la capacidad del almacén, -2 si falta un recurso sin producción
- `rdDef(u)` · poder del puesto rival, `⌈dist²/2⌉+2` (3, 4, 7, 10, 15, 20, 27, 34 para dist 1-8); lo usan `rdPct` y la etiqueta «Defensa» de Saqueos
- `rdPct(fl,u)` · S.tech · % de éxito de un saqueo según el poder de la flota `fl` (usa Armamento) frente a `rdDef(u)`; `rdLost(n,t)` · S.tech · pérdidas esperadas de `n` naves del modelo `t` si falla (Blindaje)
- `rdLoot(fl,u)` · S.tech,S.wr · botín máximo fijo del planeta (calculado con `RDN`=10 naves y su desgaste), capacidad de carga (suma por modelo) y botín real = el menor de ambos (Bodegas, Rutas) · `wrW(id,now)` · S.wr · desgaste actual en saqueos (baja lineal hasta 0 en 24 h) · `wrP(id)` · S.tech,S.wr · % de reducción del botín
- `trq(k,L)` · S.cnt,S.tech · texto del requisito de una tecnología ('' si se cumple): saqueos (f, r), niveles de mejoras de saqueo (v) o de Colonización y Propulsión (i); `trN()` · S.tech · lo que falta para Ingeniería naval
- `rdTy()` modelos de saqueo (los de `SH` con `pw`) · `rdN(fl)` nº de naves · `rdPw(fl)` poder · `rdCg(fl)` carga base · `mFl(m)` flota de una misión (`m.f`, o `{r:m.n}` si es antigua) · `mTx(m)` texto «N corsarios/naves»
- `shUn(t)` · S.cnt,S.un,S.tech · ¿modelo desbloqueado? · `shUnT(t)` · texto de cómo se desbloquea, con progreso
- `trC(L)` · S.tech · lo que falta de Colonización y Propulsión para el nivel L+1 de Convoyes ('' si se cumple; lo usa `trq`) · `cvMax()` · S.tech · carga máxima por recurso de un colonizador (0 / 500 / 1.500 / 3.000 según el nivel de Convoyes)
- `SUC` carga por nave de suministros (500) · `SUR` riesgo en ruta `{tot .1, par .2, lo [.3,.7], ship .3}` · `spT(to)` · S.tech · segundos de viaje de un envío de suministros (como las demás misiones, con la distancia del destino, mínimo 1, ×1,5) · `spTx(m)` texto «(N naves)» de una misión de suministros

- `exDf(id)` dificultad 1-5 de un planeta (sale de su id; no se guarda) · `exPc(k,id,n)` · S.tech · probabilidad de éxito de explorar (`x`: 50 % + 8 pts × Espionaje) o colonizar (`c`: 40 % + 8 pts × Colonización) con `n` unidades: por unidad, menos 8 pts por punto de dificultad sobre 1 (10 %-90 %); total 1−(1−p)ⁿ, máx. 95 % · `exTx(m)` texto « (N)» de una misión de exploración o colonización con varias unidades

## engine.js
- `sync()` · S.cs,S.tech,S.net · p.nj,p.b · → toast
- `newGame()` · → rng
- `done(m)` · S.rk,S.known,S.fleet,S.rd,S.wr,S.cnt,S.cs,S.ev,S.tech,S.un · exploración y colonización con `n`/`pr`: tirada con `m.pr`, se gastan todas las unidades (si falla una colonización, los recursos del convoy vuelven al origen; sin hueco de colonia vuelven los colonizadores; sin `n` = misión antigua, éxito seguro) · saqueo con flota mixta; en éxito, 12 % de desbloquear el Carguero; colonización: los recursos del convoy (`m.res`) se suman a la colonia nueva o, sin hueco, vuelven al planeta de origen (`m.o`) · misiones de vuelta (`k:'b'`) → `rcDone` · → norm,toast,rdPct,rdLoot,rdLost,rdTy,mFl,cxPlan,P,R,supDone,rcDone
- `supDone(m)` · S.fleet,S.ev · llegada de una misión de suministros (`m.k==='s'`): 70 % llega todo y las naves vuelven; 20 % saqueo parcial (se pierde 30-70 % de la carga, cada nave 30 %); 10 % pérdida total · suma la carga a `R(destino)` (si el destino ya no existe, al origen o al hogar) · → toast,P,R,U
- `visitor()` · S.cs,S.rf,S.ev,S.tech · p.b · el botín ignora las tecnologías `i` (Convoyes), `h` (Mantenimiento) y `s` (Espionaje) al sumar niveles de tecnología, y el edificio `v` (Estación de vigilancia) al sumar niveles de edificios · → toast,histAdd
- `attack(p)` · S.cnt,S.ev · p.rb,p.b,p.dm · → toast,histAdd
- `advance(now)` · próxima visita a los 15-30 min (÷ (1 + 0,15 × niveles de Puerto comercial)) · S.t,S.sh,S.cs,S.net,S.tech,S.fleet,S.cnt,S.mis,S.rf,S.nv · p.nj,p.rr,p.dm,p.q,p.b,p.rb,p.rq,p.sq · → prod,rbT,toast,startNext,nextShip,evento,histRes,cxRun
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
- `send(k,to,res,n)` · S.tech,S.mis,S.fleet,S.cs · `res` {m,c,g} opcional, solo al colonizar: se descuenta del planeta seleccionado y la misión guarda `res` y `o` (origen) · `n` unidades (1 por defecto) se descuentan de golpe y la misión guarda `n` y `pr` (con `exPc`) · → need,cvTake,exPc
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
- `dbEx(p,k)` · p.b · botón «Desmantelar nivel N» de la tarjeta (deshabilitado: «Desmantelar nivel N · motivo»; nada si el nivel es 0) · → dbWhy
- `dbOpen(k)` · p.b · modal de confirmación; con el Almacén avisa si la capacidad nueva queda por debajo de lo almacenado · → dbWhy,dbRet,dbTx,fmt,U,P,CM
- `dbSend()` · → closeM,demolish
- `demolish(k)` · p.b · R(p) · baja un nivel y suma el 50 % del coste a los recursos de la colonia · → dbWhy,dbRet,dbTx,toast,change

## convoy.js
- `CVM` (estado del modal: destino, nº de colonizadores `n` y recursos; no se guarda)
- `cvLim()` · S.tech,S.cs · máximo por recurso: carga máxima del nivel y lo disponible en el planeta seleccionado · → cvMax
- `cvTake(res)` · S.cs · descuenta `res` (acotado) del planeta seleccionado y lo devuelve; null si no queda nada · → cvLim
- `cvUpd()` · → fmt,exLn
- `cvOpen(to)` · S.tech,S.cs · cantidad de colonizadores (−/+ y slider, inicial 1) con % de éxito y, si hay Convoyes, una fila −/+ y un slider por recurso, inicial 0 · → cvLim,cvMax,exLn,fmt,U,P
- `cvStep(k,d)` · → cvLim,cvUpd
- `cvSl(k,v)` · → cvLim,cvUpd
- `cvQ(d)` · `cvQs(v)` · cantidad de colonizadores
- `cvSend()` · → closeM,send

## supply.js
- `SUM` (estado del modal: destino, origen, naves y carga; no se guarda)
- `spOs()` colonias que pueden ser origen (todas menos el destino) · `spLim(k)` · S.fleet,S.cs · máximo de un recurso: lo que tenga el origen (`R`: la red si está conectado) y el hueco de carga (500 × naves)
- `spTake(p,n,res)` · descuenta `res` (acotado a lo disponible y a 500 × n) de `R(p)` y lo devuelve; null si no queda nada
- `spFix()` recorta la carga al cambiar origen o naves · `spUpd()` · → fmt,spLim
- `spOpen(to)` · S.fleet,S.cs · modal con origen (botones), naves y una fila −/+ y un slider por recurso (−/+ de 10 en 10) · → spT,fmtT,fmt,U,P
- `spPick(o)` · `spSet(k,v)` · `spStep(k,d)` · `spSl(k,v)`
- `spSend()` · → closeM,sendSupply
- `spEx(t)` · S.cs,S.fleet,S.mis · botón «Pedir suministros» de la ficha de la nave `s` en Flota (deshabilitado «Pedir suministros · motivo» si la colonia está en red, falta nave, otra colonia o hueco de misión) · → spT,fmtT

## recall.js
- `RCM` (estado del modal: misión elegida por `to` y `end`; no se guarda)
- `rcFind(to,end)` · S.mis · misión de exploración, colonización o saqueo identificada por objetivo y hora de llegada (no por posición)
- `rcT(m)` · S.tech · segundos totales de la misión (×2 en saqueos) · `rcEl(m)` · tiempo ya recorrido (con la Propulsión actual, acotado) · `rcOff(m)` · saqueo ya pasada la mitad (ya vuelve; no se puede cancelar) · `rcNm(m)` nombre del objetivo
- `rcEx(m)` · S.mis · botón «Cancelar misión» de cada misión en Flota (deshabilitado «Cancelar misión · Ya está de vuelta» en saqueos pasada la mitad)
- `rcOpen(to,end)` · S.mis · modal de confirmación con el tiempo de vuelta · → rcFind,rcOff,rcEl,fmtT,mTx,U,P
- `rcSend()` · → closeM,recall
- `recall(to,end)` · S.mis · sustituye la misión por una de vuelta `{k:'b',w,to,end,n?,f?,res?,o?}` que llega en el tiempo ya recorrido · → rcFind,rcOff,rcEl,toast,change
- `rcDone(m)` · S.fleet · llegada de una misión de vuelta: `n` exploradores, `n` colonizadores (y sus recursos a `R(origen)`) o flota de saqueo vuelven a `S.fleet` · → toast,mFl,rdTy,P,R,U

## expedition.js
- `EXM` (estado del modal: destino y nº de exploradores; no se guarda)
- `exLn(k,to,n)` · línea «Éxito X % · dificultad D/5» y gasto de unidades; la usa también convoy · → exPc,exDf
- `exUpd()` · → exLn
- `exOpen(to)` · S.fleet,S.tech · modal para elegir cuántos exploradores enviar (inicial 1) con % de éxito; avisa de que se gastan todos · → exUpd,exLn
- `exStep(d)` · `exSl(v)` · S.fleet · → exUpd
- `exSend()` · → closeM,send

## storage.js
- `DB`
- `norm(p)` · p.bq,p.sqq,p.b,p.rb0,p.rb,p.dm,p.q,p.rr,p.st
- `key()`
- `ET` (ETag de la última carga/guardado; global de módulo, no va en S), `SV` (guardando), `CK` (comprobando)
- `save()` · Firebase · PUT con if-match=ET; antes comprueba la sesión (`seOk`); si responde 412 avisa y recarga · → seOk,advance,toast,load
- `checkNew()` · Firebase · al volver a primer plano, sin cambios pendientes, recarga si el ETag cambió · → load
- `BK`
- `autoBackup()` · Firebase; localStorage getItem:lk,setItem:lk
- `dlBackup()` · → advance
- `restState(d)` · S.t,S.cs · Firebase · → toast,closeM,render
- `restFile(inp)` · → toast
- `openBk()` · Firebase · → fmtT,closeM
- `setSt()`
- `prep()` · S.mis,S.known,S.fleet,S.rd,S.ru,S.rk,S.tech,S.cs,S.net,S.rq,S.sq,S.nv,S.cnt,S.acc,S.sh,S.ob,S.ne,S.hist,S.cx,S.un,S.wr · p.b · localStorage getItem:je_sp · pone a 0 en `S.ob` las categorías de `OB` que falten y en `S.ark` las seis partes del Arca · S.ark · → genRU,obOk
- `load(c)` · S.t · Firebase (guarda el ETag en ET); localStorage setItem:je_code · si `S` era nulo (login/arranque) reclama la sesión con `seClaim` · → seClaim,tot,showAway,newGame,advance,render
- `logout()` · localStorage removeItem:je_code · → render

## session.js
- `SES` (id de esta carga de página, `ok` reclamada, `at` última comprobación, `out` expulsado; no se guarda) · `seUrl()`
- `seClaim()` · Firebase PUT `juego_espacial_sesion/<key>` = `{sid,ts}`; reinicia `SES.out`
- `seCheck()` · Firebase GET; si el `sid` es otro → `seKick`; si la reclamación falló, la reintenta; un fallo de red no expulsa · → seClaim,seKick
- `seOk()` · ¿se puede guardar? usa la última comprobación si tiene <10 s o la pestaña está oculta · → seCheck
- `seKick()` / `seDrop()` · S,dirty,err · expulsa: espera a que acabe un guardado en curso (`SV`), descarta lo pendiente y vuelve al login con aviso · → render
- `seBack()` · al volver a primer plano: comprueba la sesión y luego `checkNew` · → seCheck,checkNew

## raids.js
- `raid(to,f)` · S.tech,S.fleet,S.mis · `f` = {modelo:cantidad}; la misión guarda `n` (total) y `f` · → change,need,rdN,rdTy
- `MR`
- `pctN(fl,u)` · → rdPct
- `mUpd()` · → rdLoot,pctN,fmt,semC · pinta el % de éxito con `semC(pc,70,40)`
- `openRaid(id)` · S.fleet,S.tech · modal sobre el componente `qtyOpen` (según la cabecera de raids.js; no revisado en ui-core): una fila −/+ y un slider por modelo en casa · → qtyOpen,fmtT,rdTy
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
- `OB` · S.known,S.cs,S.tech,S.cnt · p.nj,p.rb · 7 categorías; la última, Maestría (`mae`), tiene 6 niveles de fin de partida
- `obOk(o)`
- `rwd(i,id)` · recompensa del nivel `i`; la categoría `mae` tiene tabla propia (60-180 min de producción, aceleradores y escudo)
- `rwAmt(i,id)` · S.cs · → rwd,prod
- `obReady()` · S.ob
- `claim(id)` · S.ob,S.cs,S.acc,S.sh · → toast,render
- `obCard(c)` · S.ob · → fmt,rwd,rwAmt
- `openObj()` · S.acc,S.sh · → fmtT,closeM

## history.js
- `HLBL`
- `histAdd(k,pid,x,f)` · S.hist · guarda una entrada (`k` n/v/a/c) y deja las 5 últimas de ese tipo; `f` marca refugiados sin decidir
- `histRes(x)` · S.hist · pone el resultado en la última entrada con `f`
- `histOpen()` · S.hist · → $,U,fmtT

## ark.js
- `ARKIMG` (false hasta que existan las imágenes `img/arca/<parte><nivel>.webp`) · `AKC` coste por nivel (igual para todas las partes: 120k/90k/60k, 240k/180k/120k, 480k/360k/240k, 960k/720k/480k, 1,92M/1,44M/960k de metal/cristal/gas) · `AK` las 6 partes `{k,n,i,d,l}` (s Superestructura, m Motores, c Criogenia, h Hábitat, w Coraza, a Armamento; 5 niveles con nombre cada una; la parte i exige Superestructura i)
- `arkLv(k)` · S.ark · `arkN()` niveles sumados · `arkPct()` % del Arca
- `arkReq()` · S.cs · edificios del Hogar exigidos para iniciar el Arca (Almacén, Hangar, Laboratorio, Centro de mando, Astillero): `[nombre, nivel, máximo]`, con el máximo de `maxL` · → maxL
- `arkWhy(i)` · S.cs · motivo por el que no se puede subir la parte i ('' si se puede): nivel máximo, mientras `arkN()==0` los edificios del Hogar que falten según `arkReq` («Requiere Almacén 12 (tienes 9)»), Hogar fuera de la red, Superestructura insuficiente, `capN` por debajo del coste («Sube el Almacén») o recursos de `R(Hogar)` insuficientes · → R,capN
- `arkSvg()` dibujo provisional con una capa por parte (opacidad según nivel) · `arkImg()` capas `img/arca/` si `ARKIMG`, si no `arkSvg`
- `arkBtn()` · S.ark · botón «🛸 El Arca · X %» (lo pone `view` al principio de Edificios) · `arkCard(x,i)` tarjeta de una parte; los chips de coste llevan `data-ak`/`data-an` (para que `tick` no los toque) y usan la clase `lack` si falta ese recurso en `R(Hogar)`; `arkTx(k,n)` da el texto, igual que `tick`
- `arkLive()` · S.cs · mientras `#md` muestra el Arca, cada segundo (intervalo `AKT`, se para solo al cerrar) repinta los chips (`lack` y texto con `arkTx`) y habilita/deshabilita los botones con `arkWhy` · → R,arkWhy
- `arkOpen()` · S.ark,S.cs · ventana dedicada sobre `#md`: dibujo, progreso global, recursos de la red, sin iniciar la línea «Para empezar, en el Hogar: …» y una tarjeta por parte · → arkImg,arkCard,arkReq,R,fmt · arranca `arkLive`
- `arkBuy(k)` · S.ark · R(Hogar) · paga el coste del siguiente nivel, sube la parte, toast, `dirty`, reabre la ventana conservando el scroll y `render()` · → arkWhy,toast,arkOpen,render

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
- `aR(a,r)` · antepone la acción al motivo de un botón deshabilitado («Encolar nivel 3 · Requiere Almacén 2»); '' si no hay motivo; helper declarado junto a `DW`
- `queueView()` · S.cs,S.tech,S.mis,S.rk · p.q,p.b,p.rr,p.rq,p.sq,p.bq,p.sqq · → goTo,mTx,spTx,exTx
- `raidView()` · S.fleet,S.mis,S.tech,S.ru,S.rk,S.wr · desgaste del planeta con color (`semC(wp,10,30)`: verde <10 %, amarillo <30 %, rojo) · → fmtT,planet,need,exOpen,openRaid,rdTy,rdN,wrP,rdDef,semC
- `view(p)` · S.tech,S.cs,S.fleet,S.mis,S.net,S.u,S.known · p.q,p.b,p.rr,p.rq,p.sq,p.dm · → arkBtn,cost,fmt,fmtT,prod,reqTxt,trq,shUn,shUnT,tabVis,tabAct,repC,maxL,icon,bic,planet,card,slots,build,qBlock,bqList,sqList,research,ship,repair,cancelRR,rrCard,cancelB,cancelR,cancelS,need,send,selPlanet,comm,tin,tmax,trade,abandon,dsEx,histOpen,cvOpen,exOpen,spEx,dbEx,rcEx

## render.js
- `render()` · S.cs · p.nj · → tabVis,tabAct,warn,planet,orb,rfCard,selPlanet,openBk,openObj,load,logout,view
- `tick(skip)` · S.sh · p.rb,p.st,p.b · → warnP,lv,afford,fmt,fmtT,rbT,defRed,advance,obReady,avSet
- `avTx(s)` · texto corto de un tiempo (45 s, 3 min, 2 h) · `avSet(b,c,p)` · añade « · en X» / «Sube el Almacén» / «Sin producción» al botón deshabilitado por recursos (solo `build`, `research`, `ship`, sin hijos); guarda el texto original en `data-t0` y lo restaura al poder pagar · → avT,avTx

## main.js
- (arranque) setInterval(()=>tick(),1000);
- (arranque) setInterval(()=>{if(dirty)save()},15000);
- (arranque) document.addEventListener('visibilitychange',()=>{if(documen… (oculta: guarda si dirty; visible: seBack)
- (arranque) setInterval(()=>{if(!document.hidden)seCheck()},20000);
- (arranque) render();
- (arranque) if(code)load(code);

## test/smoke.html (herramienta aparte; no es un módulo ni entra en `MODS`)
- (script inline) `run()` · abre `../index.html` en un iframe, anula `fetch`/`save`/`seClaim`/`seCheck`/`checkNew`/`autoBackup` dentro de él, inyecta el JSON elegido en `S` (`prep`, `norm` por colonia, `advance`) y recorre colonias × pestañas (`selPlanet`, `go`, `tick`) y los modales `openObj`/`histOpen` · localStorage: guarda, borra y restaura `je_code`,`je_v`,`je_sp` · informa de errores de JS, pestañas vacías y textos con undefined/NaN
