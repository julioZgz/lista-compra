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

## engine.js
- `sync()` · S.cs,S.tech,S.net · p.nj,p.b · → toast
- `newGame()` · → rng
- `done(m)` · S.rk,S.known,S.fleet,S.rd,S.cnt,S.cs,S.ev,S.tech · → norm,toast
- `visitor()` · S.cs,S.rf,S.ev,S.tech · p.b · → toast
- `attack(p)` · S.cnt,S.ev · p.rb,p.b,p.dm · → toast
- `advance(now)` · S.t,S.sh,S.cs,S.net,S.tech,S.fleet,S.cnt,S.mis,S.rf,S.nv · p.nj,p.rr,p.dm,p.q,p.b,p.rb,p.rq,p.sq · → prod,rbT,toast,startNext,nextShip,evento
- `genRU()` · → rng

## eventos.js
- `warnP(p)` · p.b,p.dm
- `evento(now,dt)` · S.ne,S.ev,S.cs,S.tech · p.st,p.dm,p.b · → warnP,prod,toast

## actions.js
- `change()` · → render
- `reval(p)` · p.b,p.q,p.bq · → maxL,toast
- `startNext(p,t)` · p.q,p.bq
- `nextShip(p,t)` · p.sq,p.sqq
- `build(k)` · p.dm,p.q,p.bq · → cost,afford,maxL,slots
- `cancelQ(i)` · p.bq
- `cancelSQ(i)` · p.sqq
- `research(k)` · S.tech,S.cs · p.rq · → cost,afford
- `ship(t)` · p.sq,p.sqq · → afford,slots
- `repair(k)` · p.rr,p.dm · → afford,repC
- `accel()` · p.rr · → afford,repC
- `cancelRR()` · p.rr
- `refugee(a)` · S.rf,S.cnt,S.ev · p.rb,p.rb0 · → toast
- `cancelB()` · p.q
- `cancelR()`
- `cancelS()` · p.sq
- `send(k,to)` · S.tech,S.mis,S.fleet,S.cs · → need
- `refundOf(p)` · p.b,p.q,p.rq,p.sq,p.rr · → cost
- `abandon()` · S.mis,S.cs · → toast,selPlanet
- `useAcc(kind)` · S.acc

## dismantle.js
- `DSP`
- `DSM`
- `dsRet(t,n)`
- `dsPl(t,n)`
- `dsTxt(t,n)` · → dsRet,fmt
- `dsUpd()` · → dsTxt
- `dsEx(t)` · S.fleet
- `dsOpen(t)` · S.fleet,S.cs · → dsUpd
- `dsStep(d)` · S.fleet · → dsUpd
- `dsSl(v)` · S.fleet · → dsUpd
- `dsSend()` · → closeM,dismantle
- `dismantle(t,n)` · S.fleet,S.cs · → dsRet,toast,change

## storage.js
- `DB`
- `norm(p)` · p.bq,p.sqq,p.b,p.rb0,p.rb,p.dm,p.q,p.rr,p.st
- `key()`
- `save()` · Firebase · → advance
- `BK`
- `autoBackup()` · Firebase; localStorage getItem:lk,setItem:lk
- `dlBackup()` · → advance
- `restState(d)` · S.t,S.cs · Firebase · → toast,closeM,render
- `restFile(inp)` · → toast
- `openBk()` · Firebase · → fmtT,closeM
- `setSt()`
- `prep()` · S.mis,S.known,S.fleet,S.rd,S.ru,S.rk,S.tech,S.cs,S.net,S.rq,S.sq,S.nv,S.cnt,S.acc,S.sh,S.ob,S.ne · p.b · localStorage getItem:je_sp · → genRU,obOk
- `load(c)` · S.t · Firebase; localStorage setItem:je_code · → tot,showAway,newGame,advance,render
- `logout()` · localStorage removeItem:je_code · → render

## raids.js
- `raid(to,n)` · S.tech,S.fleet,S.mis · → change,need
- `MR`
- `pctN(n,u)`
- `mUpd()`
- `openRaid(id)` · S.fleet,S.tech · → fmtT
- `mStep(d)` · S.fleet
- `mSl(v)` · S.fleet
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
- `queueView()` · S.cs,S.tech,S.mis,S.rk · p.q,p.b,p.rr,p.rq,p.sq,p.bq,p.sqq · → goTo
- `raidView()` · S.fleet,S.mis,S.tech,S.ru,S.rk,S.rd · → fmtT,planet,need,send,openRaid
- `view(p)` · S.tech,S.cs,S.fleet,S.mis,S.net,S.u,S.known · p.q,p.b,p.rr,p.rq,p.sq,p.dm · → cost,fmt,fmtT,prod,reqTxt,tabVis,tabAct,repC,maxL,icon,bic,planet,card,slots,build,qBlock,bqList,sqList,research,ship,repair,cancelRR,rrCard,cancelB,cancelR,cancelS,need,send,selPlanet,comm,tin,tmax,trade,abandon,dsEx

## render.js
- `render()` · S.cs · p.nj · → tabVis,tabAct,warn,planet,orb,rfCard,selPlanet,openBk,openObj,load,logout,view
- `tick(skip)` · S.sh · p.rb,p.st,p.b · → warnP,lv,afford,fmt,fmtT,rbT,defRed,advance,obReady

## main.js
- (arranque) setInterval(()=>tick(),1000);
- (arranque) setInterval(()=>{if(dirty)save()},15000);
- (arranque) document.addEventListener('visibilitychange',()=>{if(documen
- (arranque) render();
- (arranque) if(code)load(code);
