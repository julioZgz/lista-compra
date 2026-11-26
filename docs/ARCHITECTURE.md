# ARCHITECTURE — Colonias Estelares

Juego estático (HTML + JS clásico + CSS); hoy sin build ni librerías. Publicado en GitHub Pages (https://juliozgz.github.io/utilidades/). Persistencia: Firebase Realtime Database por REST (`fetch`, sin SDK) + localStorage. Única petición externa: Google Fonts.

## Orden de carga y reglas por módulo
Los scripts se cargan en este orden desde la lista `MODS` de `index.html` (un `<script>` inline escribe `js/<m>.js?v=BUILD`). Un módulo solo puede usar lo de los anteriores **al cargarse**; en ejecución todo es global.

| # | Módulo | Qué es | No debe |
|---|--------|--------|---------|
| 1 | util | helpers puros (`$`, `fmt`, `fmtT`, `afford`, `rng`, `semC`) | depender de S |
| 2 | state | globales de sesión (`S SP V code dirty st err LOG`), `P U R mem` | lógica o HTML |
| 3 | data | tablas: recursos, `B` edificios, `T` tecnologías, `SH` naves, tiempos | lógica de UI/guardado |
| 4 | rules | fórmulas (coste, tiempo, producción, capacidad, rebelión, requisitos) | mutar S, DOM, toast |
| 5 | engine | `advance(now)`: tiempo, colas, misiones, eventos; `newGame`, `genRU`, `sync` | HTML, localStorage |
| 6 | events | eventos aleatorios (tormenta, meteorito, hallazgos) y preaviso de la estación de vigilancia | HTML, localStorage, guardado |
| 7 | counter | contraataques rivales tras saquear mucho un puesto (`cxPlan`, `cxHit`, `cxRun`); se resuelven solos con escudo y defensas | HTML, localStorage, guardado, fórmulas (usa `defRed`) |
| 8 | actions | órdenes del jugador; casi todas acaban en `change()` | fórmulas, Firebase |
| 9 | dismantle | desmantelar naves: botón + modal con slider; devuelve el 50 % del coste al planeta hogar (`dismantle`, `ds*`) | tocar colas, guardado, fórmulas |
| 10 | demolish | desmantelar edificios: botón en la tarjeta del edificio + modal de confirmación; baja un nivel y devuelve el 50 % del coste de ese nivel a la propia colonia (`demolish`, `db*`) | tocar colas, guardado, fórmulas |
| 11 | convoy | convoyes de colonización: botón de colonizar + modal para elegir los recursos que viajan con el colonizador (`cvOpen`, `cvTake`, `cv*`); salen del planeta de origen | tocar colas, guardado, fórmulas |
| 12 | supply | naves de suministros: botón en Flota (`spEx`) y modal para elegir origen, naves y carga hacia una colonia sin red (`spOpen`, `spTake`, `sp*`; con casilla opcional para crear una ruta recurrente, ver `routes`); la misión sale con `k:'s'` y la llegada se resuelve en engine (`supDone`) | tocar colas, guardado, fórmulas |
| 13 | routes | rutas de suministro recurrentes: la casilla «Repetir envío» del modal de supply crea una ruta (`rtAdd`); `rtRun`, llamada desde `advance` después del `filter` de `S.mis`, relanza el envío cuando no hay misión `k:'s'` de la ruta en vuelo (todo o nada; si falta algo, se pausa con aviso); una ruta por colonia destino; se cancela sola si el destino entra en la red o desaparece; las rutas se ven y se controlan en la ficha de la nave de suministros en Flota (`rtEx`, `rtTog`, `rtDel`); estado en `S.rt` | tocar colas, guardado, fórmulas |
| 14 | recall | cancelar misiones en vuelo (explorar, colonizar, saquear): botón en Flota → Misiones en curso (`rcEx`) + modal de confirmación; la misión pasa a una de vuelta `k:'b'` que dura el tiempo ya recorrido y al llegar devuelve naves y recursos (`recall`, `rcDone`, `rc*`) | tocar colas, guardado, fórmulas |
| 15 | expedition | explorar con varios exploradores: modal de cantidad con % de éxito y dificultad (`exOpen`, `ex*`, `exLn`); la misión sale con `n` y `pr` (probabilidad en rules: `exDf`, `exPc`) y se resuelve en engine (`done`) | tocar colas, guardado, fórmulas |
| 16 | storage | Firebase, copias, archivos, migración (`norm`, `prep`), `load/save/logout` | reglas de juego |
| 17 | session | sesión única: al entrar anota un id de sesión en Firebase (`seClaim`); si otro dispositivo entra después, este deja de guardar y vuelve al login (`seCheck`, `seOk`, `seKick`, `seBack`) | reglas de juego, colas, localStorage, tocar `S` salvo para expulsar |
| 18 | raids | saqueos: `raid`, modal de envío | colas, guardado |
| 19 | trade | comercio | colas, guardado |
| 20 | objectives | objetivos y recompensas | colas, guardado |
| 21 | history | historial de eventos recientes (`histAdd`, `histRes`, `histOpen`, `HLBL`): últimos 5 naturales, visitas, ataques rebeldes y contraataques rivales; modal desde Mapa | tocar colas, recursos, reglas, `S.ev`, guardado |
| 22 | ark | El Arca: proyecto final por partes y niveles (Superestructura, Motores, Criogenia, Hábitat, Coraza, Armamento); botón en Edificios (`arkBtn`), ventana dedicada (`arkOpen`) y compra instantánea de niveles con los recursos de la red (`arkBuy`) y repintado en rojo de lo que falta mientras está abierta (`arkLive`); estado en `S.ark`; solo se puede construir en el Hogar (en otras colonias los botones salen apagados) y para empezar exige Almacén, Hangar, Laboratorio, Centro de mando y Astillero al máximo en el Hogar; por ahora sin efectos de juego | tocar colas, motor, guardado, fórmulas existentes |
| 23 | ui-art | iconos SVG, sprite, planetas | mutar S |
| 24 | ui-core | componentes (`card`, `toast`…), colas, navegación | fórmulas |
| 25 | ui-views | contenido de cada pestaña (`view`, `queueView`, `raidView`) | mutar S directo |
| 26 | render | `render()` y `tick()` (cada segundo) | lógica de juego |
| 27 | main | temporizadores y arranque (`render()`, `load(code)`) | cualquier otra cosa |

Fuera de `MODS`: `test/smoke.html` (smoke test; carga el juego en un iframe, no guarda en Firebase y no es un módulo).

Dirección de dependencias: `util/state/data/rules` no llaman a nada de arriba. Acoplamientos que ya existían y se mantienen: `engine`→`toast`, `norm`, `startNext`, `nextShip`; `actions`→`toast`, `selPlanet`, `render`; `storage`→`card`, `showAway`, `toast`, `closeM`, `render`; `ui-core`→`actions` (botones). Nuevos: `engine`→`evento` y `events`→`toast` (mismo patrón que `visitor`/`attack`); `dismantle`→`toast`, `change`, `closeM` (mismo patrón que `actions`/`raids`). `engine`→`cxPlan`/`cxRun` y `counter`→`toast`, `histAdd` (mismo patrón que `events`); `engine`, `events`, `counter` y `actions` → `histAdd`/`histRes` (history.js se carga después; solo se llaman en ejecución) y `history`→`closeM`, `fmtT`, `U` (mismo patrón que `dismantle`). `convoy`→`send`, `closeM`, `fmt`, `U`, `P`, `R` (mismo patrón que `dismantle`); `actions`→`cvTake` y `ui-views`→`cvOpen` (solo en ejecución). `supply`→`sendSupply`, `closeM`, `fmt`, `fmtT`, `U`, `P`, `R` (mismo patrón que `convoy`); `actions`→`spTake` y `ui-views`→`spEx` (solo en ejecución). `demolish`→`toast`, `change`, `closeM`, `RQ`, `vb`, `cost`, `fmt`, `U`, `P`, `R` (mismo patrón que `dismantle`); `ui-views`→`dbEx` (solo en ejecución). `recall`→`toast`, `change`, `closeM`, `fmtT`, `U`, `P`, `R`, `mFl`, `mTx`, `rdTy` (mismo patrón que `convoy`); `routes`→`change`, `toast`, `fmt`, `RN`, `U`, `R`, `spTake`, `spT` (mismo patrón que `supply`); `supply`→`rtAdd`, `rtOf`, `rtEx` y `engine`→`rtRun` (solo en ejecución). `engine`→`rcDone` y `ui-views`→`rcEx` (solo en ejecución). `expedition`→`send`, `closeM`, `exPc`, `exDf`, `U` (mismo patrón que `convoy`); `convoy`→`exLn` y `ui-views`→`exOpen` (solo en ejecución). `ark`→`toast`, `closeM`, `fmt`, `R`, `capN`, `$`, `render` (mismo patrón que `objectives`); `ui-views`→`arkBtn` (solo en ejecución). `session`→`DB`, `key`, `SV`, `render`, `checkNew` (mismo patrón que `storage`); `storage`→`seOk`/`seClaim` y `main`→`seBack`/`seCheck` (solo en ejecución). No “arreglarlos” sin pedirlo.

## Convenciones técnicas que no se pueden romper
- Cientos de `onclick="fn(...)"` inline → toda función llamada desde HTML debe ser **global** (declaración top-level). Nada de ES modules ni `type="module"`.
- Nombres top-level únicos en todo el juego (comparten ámbito).
- Pestañas (`V`): b Edificios · i Investigar · f Flota · m Mapa · r Saqueos · x Comercio · q Colas (`tabVis` decide cuáles se ven).
- Imágenes en `img/`. Rutas: en CSS son relativas a `css/` (`../img/x`); en JS, relativas a `index.html` (`img/x`).
- Sprite `img/edificios.webp`: 1000×1000, cuadrícula 5×5. Fila = edificio (`SPM`: l laboratorio 0, s astillero 1, c mina de cristal 2, g gas 3, a almacén 4); columna = `floor((nivel-1)/2)` limitado a 0–4. Los demás edificios usan icono SVG (`BI`).
- Nombres de archivo `.js` en inglés (nuevos y renombrados; las funciones nuevas también). Los nombres antiguos en español (`evento`, `warnP`…) no se renombran sin pedirlo.
- Caché: al cambiar cualquier .js o el CSS, subir `BUILD` en `index.html` (un solo número para todos los JS y el CSS; `BUILD` y `MODS` son globales de index.html).
- Archivo nuevo: `js/x.js` con cabecera de 3 líneas + su nombre en la lista `MODS` de `index.html`, en el sitio correcto del orden (antes de `render` si es lógica o vista).

## Zonas sensibles (reglas y compatibilidad)
`data.js`, `rules.js`, `engine.js`, `norm`/`prep` en `storage.js` y los textos de juego. Se tocan solo si lo pedido lo requiere, avisando antes de qué cambia exactamente; el resto debe quedar idéntico.
