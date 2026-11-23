# CONVENTIONS

- **Cambios mínimos**: no reformatear ni reordenar código existente. El estilo denso actual se respeta; código nuevo legible pero corto, en español de España, nombres cortos como los actuales.
- **Sin dependencias nuevas**, sin build, sin ES modules. Todo debe funcionar abriendo el HTML en GitHub Pages.
- **Dónde va cada cosa**: ver tabla de ARCHITECTURE.md. Funcionalidad nueva ⇒ archivo propio (p. ej. `js/flotas2.js`) con cabecera (qué hace / qué lee y escribe / qué no debe) y sus ganchos mínimos en los existentes.
- **Reglas del juego**: fórmulas, costes, tiempos y textos son “congelados”; solo cambian con la petición “cambio de regla” y el valor nuevo explícito.
- **Estado**: ver STATE.md. localStorage solo en las claves listadas.
- **Entrega de cada cambio**: archivos completos modificados (o buscar/reemplazar si superan ~15 KB) + línea de CHANGELOG + `?v=` subido + INDEX.md actualizado si cambian funciones.
- **Comprobación mínima** antes de darlo por bueno: carga partida real, recorrer las 7 pestañas, sin errores en consola, el cambio pedido visible, nada más distinto.
