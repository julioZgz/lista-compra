# ARCHITECTURE — Colonias Estelares

Juego estático (HTML + JS clásico + CSS); hoy sin build ni librerías. Publicado en GitHub Pages (https://juliozgz.github.io/utilidades/). Persistencia: Firebase Realtime Database por REST (`fetch`, sin SDK) + localStorage. Única petición externa: Google Fonts.

## Orden de carga y reglas por módulo
Los scripts se cargan en este orden desde la lista `MODS` de `index.html` (un `<script>` inline escribe `js/<m>.js?v=BUILD`). Un módulo solo puede usar lo de los anteriores **al cargarse**; en ejecución todo es global.

| # | Módulo | Qué es | No debe |
|---|--------|--------|---------|
| 1 | util | helpers puros (`$`, `fmt`, `fmtT`, `afford`, `rng`) | depender de S |
| 2 | state | globales de sesión (`S SP V code dirty st err LOG`), `P U R mem` | lógica o HTML |
| 3 | data | tablas: recursos, `B` edificios, `T` tecnologías, `SH` naves, tiempos | lógica de UI/guardado |
| 4 | rules | fórmulas (coste, tiempo, producción, capacidad, rebelión, requisitos) | mutar S, DOM, toast |
| 5 | engine | `advance(now)`: tiempo, colas, misiones, eventos; `newGame`, `genRU`, `sync` | HTML, localStorage |
| 6 | events | eventos aleatorios (tormenta, meteorito, hallazgos) y preaviso de la estación de vigilancia | HTML, localStorage, guardado |
| 7 | counter | contraataques rivales tras saquear mucho un puesto (`cxPlan`, `cxHit`, `cxRun`); se resuelven solos con escudo y defensas | HTML, localStorage, guardado, fórmulas (usa `defRed`) |
| 8 | actions | órdenes del jugador; casi todas acaban en `change()` | fórmulas, Firebase |
| 9 | dismantle | desmantelar naves: botón + modal con slider; devuelve el 50 % del coste al planeta hogar (`dismantle`, `ds*`) | tocar colas, guardado, fórmulas |
| 10 | convoy | convoyes de colonización: botón de colonizar + modal para elegir los recursos que viajan con el colonizador (`cvOpen`, `cvTake`, `cv*`); salen del planeta de origen | tocar colas, guardado, fórmulas |
| 11 | supply | naves de suministros: botón en Flota (`spEx`) y modal para elegir origen, naves y carga hacia una colonia sin red (`spOpen`, `spTake`, `sp*`); la misión sale con `k:'s'` y la llegada se resuelve en engine (`supDone`) | tocar colas, guardado, fórmulas |
| 12 | storage | Firebase, copias, archivos, migración (`norm`, `prep`), `load/save/logout` | reglas de juego |
| 13 | raids | saqueos: `raid`, modal de envío | colas, guardado |
| 14 | trade | comercio | colas, guardado |
| 15 | objectives | objetivos y recompensas | colas, guardado |
| 16 | history | historial de eventos recientes (`histAdd`, `histRes`, `histOpen`, `HLBL`): últimos 5 naturales, visitas, ataques rebeldes y contraataques rivales; modal desde Mapa | tocar colas, recursos, reglas, `S.ev`, guardado |
| 17 | ui-art | iconos SVG, sprite, planetas | mutar S |
| 18 | ui-core | componentes (`card`, `toast`…), colas, navegación | fórmulas |
| 19 | ui-views | contenido de cada pestaña (`view`, `queueView`, `raidView`) | mutar S directo |
| 20 | render | `render()` y `tick()` (cada segundo) | lógica de juego |
| 21 | main | temporizadores y arranque (`render()`, `load(code)`) | cualquier otra cosa |

Dirección de dependencias: `util/state/data/rules` no llaman a nada de arriba. Acoplamientos que ya existían y se mantienen: `engine`→`toast`, `norm`, `key`, `startNext`, `nextShip`; `actions`→`toast`, `selPlanet`, `render`; `storage`→`card`, `showAway`, `toast`, `closeM`, `render`; `ui-core`→`actions` (botones). Nuevos: `engine`→`evento` y `events`→`toast` (mismo patrón que `visitor`/`attack`); `dismantle`→`toast`, `change`, `closeM` (mismo patrón que `actions`/`raids`). `engine`→`cxPlan`/`cxRun` y `counter`→`toast`, `histAdd` (mismo patrón que `events`); `engine`, `events`, `counter` y `actions` → `histAdd`/`histRes` (history.js se carga después; solo se llaman en ejecución) y `history`→`closeM`, `fmtT`, `U` (mismo patrón que `dismantle`). `convoy`→`send`, `closeM`, `fmt`, `U`, `P`, `R` (mismo patrón que `dismantle`); `actions`→`cvTake` y `ui-views`→`cvOpen` (solo en ejecución). `supply`→`sendSupply`, `closeM`, `fmt`, `fmtT`, `U`, `P`, `R` (mismo patrón que `convoy`); `actions`→`spTake` y `ui-views`→`spEx` (solo en ejecución). No “arreglarlos” sin pedirlo.

## Convenciones técnicas que no se pueden romper
- Cientos de `onclick="fn(...)"` inline → toda función llamada desde HTML debe ser **global** (declaración top-level). Nada de ES modules ni `type="module"`.
- Nombres top-level únicos en todo el juego (comparten ámbito).
- Pestañas (`V`): b Edificios · i Investigar · f Flota · m Mapa · r Saqueos · x Comercio · q Colas (`tabVis` decide cuáles se ven).
- Imágenes en `img/`. Rutas: en CSS son relativas a `css/` (`../img/x`); en JS, relativas a `index.html` (`img/x`).
- Sprite `img/edificios.webp`: 1000×1000, cuadrícula 5×5. Fila = edificio (`SPM`: l laboratorio 0, s astillero 1, c mina de cristal 2, g gas 3, a almacén 4); columna = `floor((nivel-1)/2)` limitado a 0–4. Los demás edificios usan icono SVG (`BI`).- Nombres de archivo `.js` en inglés (nuevos y renombrados; las funciones nuevas también). Los nombres antiguos en español (`evento`, `warnP`…) no se renombran sin pedirlo.
- Caché: al cambiar cualquier .js o el CSS, subir `BUILD` en `index.html` (un solo número para todos los JS y el CSS; `BUILD` y `MODS` son globales de index.html).
- Archivo nuevo: `js/x.js` con cabecera de 3 líneas + su nombre en la lista `MODS` de `index.html`, en el sitio correcto del orden (antes de `render` si es lógica o vista).

## Zonas sensibles (reglas y compatibilidad)
`data.js`, `rules.js`, `engine.js`, `norm`/`prep` en `storage.js` y los textos de juego. Se tocan solo si lo pedido lo requiere, avisando antes de qué cambia exactamente; el resto debe quedar idéntico.
