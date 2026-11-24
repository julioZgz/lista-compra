# ARCHITECTURE — Colonias Estelares

Juego estático (HTML + JS clásico + CSS); hoy sin build ni librerías. Publicado en GitHub Pages (https://juliozgz.github.io/utilidades/). Persistencia: Firebase Realtime Database por REST (`fetch`, sin SDK) + localStorage. Única petición externa: Google Fonts.

## Orden de carga y reglas por módulo
Los scripts se cargan en este orden desde `index.html` (`js/<m>.js?v=N`). Un módulo solo puede usar lo de los anteriores **al cargarse**; en ejecución todo es global.

| # | Módulo | Qué es | No debe |
|---|--------|--------|---------|
| 1 | util | helpers puros (`$`, `fmt`, `fmtT`, `afford`, `rng`) | depender de S |
| 2 | state | globales de sesión (`S SP V code dirty st err LOG`), `P U R mem` | lógica o HTML |
| 3 | data | tablas: recursos, `B` edificios, `T` tecnologías, `SH` naves, tiempos | lógica de UI/guardado |
| 4 | rules | fórmulas (coste, tiempo, producción, capacidad, rebelión, requisitos) | mutar S, DOM, toast |
| 5 | engine | `advance(now)`: tiempo, colas, misiones, eventos; `newGame`, `genRU`, `sync` | HTML, localStorage |
| 6 | events | eventos aleatorios (tormenta, meteorito, hallazgos) y preaviso de la estación de vigilancia | HTML, localStorage, guardado |
| 7 | actions | órdenes del jugador; casi todas acaban en `change()` | fórmulas, Firebase |
| 8 | dismantle | desmantelar naves: botón + modal con slider; devuelve el 50 % del coste al planeta hogar (`dismantle`, `ds*`) | tocar colas, guardado, fórmulas |
| 9 | storage | Firebase, copias, archivos, migración (`norm`, `prep`), `load/save/logout` | reglas de juego |
| 10 | raids | saqueos: `raid`, modal de envío | colas, guardado |
| 11 | trade | comercio | colas, guardado |
| 12 | objectives | objetivos y recompensas | colas, guardado |
| 13 | history | historial de eventos recientes (`histAdd`, `histRes`, `histOpen`, `HLBL`): últimos 5 naturales, visitas y ataques; modal desde Mapa | tocar colas, recursos, reglas, `S.ev`, guardado |
| 14 | ui-art | iconos SVG, sprite, planetas | mutar S |
| 15 | ui-core | componentes (`card`, `toast`…), colas, navegación | fórmulas |
| 16 | ui-views | contenido de cada pestaña (`view`, `queueView`, `raidView`) | mutar S directo |
| 17 | render | `render()` y `tick()` (cada segundo) | lógica de juego |
| 18 | main | temporizadores y arranque (`render()`, `load(code)`) | cualquier otra cosa |

Dirección de dependencias: `util/state/data/rules` no llaman a nada de arriba. Acoplamientos que ya existían y se mantienen: `engine`→`toast`, `norm`, `key`, `startNext`, `nextShip`; `actions`→`toast`, `selPlanet`, `render`; `storage`→`card`, `showAway`, `toast`, `closeM`, `render`; `ui-core`→`actions` (botones). Nuevos: `engine`→`evento` y `events`→`toast` (mismo patrón que `visitor`/`attack`); `dismantle`→`toast`, `change`, `closeM` (mismo patrón que `actions`/`raids`). `engine`, `events` y `actions` → `histAdd`/`histRes` (history.js se carga después; solo se llaman en ejecución) y `history`→`closeM`, `fmtT`, `U` (mismo patrón que `dismantle`). No “arreglarlos” sin pedirlo.

## Convenciones técnicas que no se pueden romper
- Cientos de `onclick="fn(...)"` inline → toda función llamada desde HTML debe ser **global** (declaración top-level). Nada de ES modules ni `type="module"`.
- Nombres top-level únicos en todo el juego (comparten ámbito).
- Pestañas (`V`): b Edificios · i Investigar · f Flota · m Mapa · r Saqueos · x Comercio · q Colas (`tabVis` decide cuáles se ven).
- Imágenes en `img/`. Rutas: en CSS son relativas a `css/` (`../img/x`); en JS, relativas a `index.html` (`img/x`).
- Sprite `img/edificios.webp`: 1000×1000, cuadrícula 5×5. Fila = edificio (`SPM`: l laboratorio 0, s astillero 1, c mina de cristal 2, g gas 3, a almacén 4); columna = `floor((nivel-1)/2)` limitado a 0–4. Los demás edificios usan icono SVG (`BI`).- Nombres de archivo `.js` en inglés (nuevos y renombrados; las funciones nuevas también). Los nombres antiguos en español (`evento`, `warnP`…) no se renombran sin pedirlo.
- Caché: al cambiar un .js o el CSS, subir su `?v=` en `index.html`.
- Archivo nuevo: `js/x.js` con cabecera de 3 líneas + su `<script>` en el sitio correcto del orden (antes de `render.js` si es lógica o vista).

## Zonas sensibles (reglas y compatibilidad)
`data.js`, `rules.js`, `engine.js`, `norm`/`prep` en `storage.js` y los textos de juego. Se tocan solo si lo pedido lo requiere, avisando antes de qué cambia exactamente; el resto debe quedar idéntico.
