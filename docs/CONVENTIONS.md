# CONVENTIONS

- **Cambios mínimos**: no reformatear ni reordenar código existente. El estilo denso actual se respeta; código nuevo legible pero corto, en español de España, nombres cortos como los actuales.
- **Dependencias y build**: por defecto no se añaden. Solo si un cambio las necesita de verdad, y entonces se propone antes con el motivo y la alternativa sin ellas. Todo debe seguir funcionando en GitHub Pages. ES modules no mientras haya `onclick` inline.
- **Dónde va cada cosa**: ver tabla de ARCHITECTURE.md. Funcionalidad nueva ⇒ archivo propio (p. ej. `js/flotas2.js`) con cabecera (qué hace / qué lee y escribe / qué no debe) y sus ganchos mínimos en los existentes.
- **Reglas del juego** (fórmulas, costes, tiempos, textos): no cambian como efecto colateral de otro cambio. Si lo pedido las implica, se dice claramente (qué regla, valor antes → después), se aplica con OK del usuario y se anota en CHANGELOG con `[regla]`.
- **Estado**: ver STATE.md. localStorage solo en las claves listadas.
- **Entrega de cada cambio**: archivos completos modificados (o buscar/reemplazar si superan ~15 KB) + línea de CHANGELOG + `?v=` subido + INDEX.md actualizado si cambian funciones.
- **Comprobación mínima** antes de darlo por bueno: carga partida real, recorrer las 7 pestañas, sin errores en consola, el cambio pedido visible, nada más distinto.
