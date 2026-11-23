# STATE — estado, guardado y localStorage

## Dónde se guarda
- **Firebase** (base en `DB`, REST): `juego_espacial/<key>.json` = partida completa `S`; `juego_espacial_copias/<key>/s0..s2.json` = copias rotativas (cada 30 min tras guardar); `…/previa.json` = copia de la partida actual antes de restaurar otra. `<key>` = el código de partida saneado (`key()`).
- **localStorage**: `je_code` (código de partida), `je_sp` (planeta seleccionado), `je_v` (pestaña), `je_bk_<code>` (hora de la última copia automática). Escriben: `je_code` storage (`load`, `logout`); `je_sp`/`je_v` navegación en `ui-core` (`go`, `selPlanet`, `goTo`, `toast`); lectura al arrancar en `state.js` y `prep`.
- Guardado: `save()` (storage) tras `advance(Date.now())`; automático cada 15 s si `dirty`, y al ocultar la pestaña (`main.js`).

## Forma de `S` (partida)
`t` último avance (ms) · `net {m,c,g}` recursos compartidos de colonias en red · `u` planetas del universo (id, name, dist, rich[3]) · `ru` planetas rivales (`genRU`) · `rk` rivales explorados · `known` planetas explorados · `tech {p,c,m,n,x,d,l,y,q,e}` niveles · `fleet {e,c,r}` exploradores/colonizadores/corsarios · `mis[]` misiones en vuelo `{k,to,end,n?}` · `cs[]` colonias · `ev` último texto de evento · `rf` refugiados pendientes `{pid,c,exp}` · `nv` próximo visitante (ms) · `rd` saqueos por planeta (`'p'+id`) · `cnt {rep,sac,trd,ref,cor,sacT[]}` contadores · `ob` nivel por objetivo · `acc` aceleradores · `sh` escudo restante (ms).

## Forma de una colonia `p` (`S.cs[i]`)
`id` · `b` niveles por edificio (z m c g a s l u h o k w t p d) · `r {m,c,g}` recursos · `q` obra en curso `{k,end,c}` · `bq[]` cola de obras `{k,L,c}` · `sq/sqq` nave en curso / cola · `rq` investigación en curso `{k,end,c}` · `rr` reparación en curso · `dm[]` edificios dañados · `nj` unida a la red (recursos en `S.net`) · `rb` rebelión actual · `rb0` base.

## Reglas de compatibilidad (obligatorias)
1. Nunca renombrar ni borrar campos de `S` o de `p`.
2. Campo nuevo ⇒ valor por defecto en `prep()` (global) o `norm()` (por colonia) en `storage.js`.
3. Cada cambio que toque estado se prueba cargando un JSON de partida real (exportado) antes de darlo por bueno.
