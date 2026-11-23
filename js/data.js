/* data.js — Tablas de reglas: RN/IDX/K (recursos), B (edificios), T (tecnologías), SH (naves), BT/ST/ef (tiempos).
 * Lee: S solo dentro de ef. Escribe: nada.
 * NO debe: tener lógica de UI ni de guardado. Cambiar aquí = cambio de regla.
 * Movido tal cual de juego-espacial.html original; ver ARCHITECTURE.md. */
const RN={m:'Metal',c:'Cristal',g:'Gas'},IDX={m:0,c:1,g:2},K=[.5,.3,.15];
const B={z:{n:'Centro de mando',d:'Coordina la colonia.',b:{m:150,c:100},f:1.7,max:10},m:{n:'Mina de metal',d:'Produce metal.',b:{m:60,c:15},f:1.6},c:{n:'Mina de cristal',d:'Produce cristal.',b:{m:48,c:24},f:1.6},g:{n:'Extractor de gas',d:'Produce gas.',b:{m:75,c:30},f:1.6},
a:{n:'Almacén',d:'Aumenta la capacidad de recursos.',b:{m:100,c:50},f:1.8,max:12},
s:{n:'Astillero',d:'Nivel 1 construye exploradores; nivel 2, colonizadores.',b:{m:200,c:100},f:1.7,max:8},
l:{n:'Laboratorio',d:'Necesario para investigar en este planeta. Su nivel limita las tecnologías.',b:{m:150,c:200},f:1.7,max:10},
u:{n:'Universidad',d:'Cada nivel reduce un 8% los tiempos de este planeta y da +5% de producción.',b:{m:180,c:220},f:1.7,max:10},
h:{n:'Hangar de transporte',d:'Con la tecnología Redes de transporte, conecta este planeta a la red: sus recursos, su producción y su almacén se suman a los comunes.',b:{m:300,c:200,g:60},f:1,max:1},
o:{n:'Centro de ocio',d:'Reduce un 4% por nivel la rebelión hacia la que tiende este planeta.',b:{m:150,c:120},f:1.6,max:10},
k:{n:'Parque',d:'Reduce un 4% por nivel la rebelión hacia la que tiende este planeta.',b:{m:100,c:60},f:1.5,max:10},
w:{n:'Murallas',d:'Cada nivel reduce un 4% la probabilidad de que los rebeldes ganen un ataque.',b:{m:200,c:50},f:1.6,max:10},
t:{n:'Torretas láser',d:'Cada nivel reduce un 6% la probabilidad de que los rebeldes ganen un ataque.',b:{m:220,c:120,g:60},f:1.6,max:10},
p:{n:'Puerto comercial',d:'Cada nivel atrae un 15% más de visitas, aumenta un 5% lo que dejan los mercaderes y reduce la llegada de refugiados.',b:{m:200,c:150,g:30},f:1.7,max:5},
d:{n:'Fábrica de drones',d:'Cada nivel reduce un 8% los tiempos de este planeta y da +5% de producción.',b:{m:240,c:140,g:40},f:1.7,max:10}};
const T={p:{n:'Propulsión',d:'Más alcance (+2 de distancia) y viajes más rápidos.',b:{c:100,g:60},f:1.9,max:8},
c:{n:'Colonización',d:'Permite un planeta colonizado más por nivel.',b:{c:200,g:120},f:2,max:6},
m:{n:'Flotas coordinadas',d:'Una misión simultánea más por nivel.',b:{c:250,g:150},f:2,max:6},
n:{n:'Redes de transporte',d:'Permite conectar a una red de recursos compartidos los planetas que tengan Hangar de transporte.',b:{c:400,g:250},f:2,max:1},
x:{n:'Tácticas comerciales',d:'Reduce 3 puntos por nivel la comisión de los mercaderes (del 20% al 5% en el nivel 5). El nivel 1 desbloquea la sección Comercio.',b:{c:200,g:100},f:1.8,max:5},
d:{n:'Ingeniería defensiva',d:'Permite subir Murallas y Torretas láser hasta el doble del nivel de esta tecnología.',b:{m:200,c:150,g:60},f:2,max:5},
l:{n:'Logística',d:'Permite subir el Almacén y la Fábrica de drones hasta el doble del nivel de esta tecnología. El nivel 1 desbloquea la sección Colas.',b:{m:150,c:120},f:1.9,max:6},
y:{n:'Tácticas de combate',d:'Desbloquea la sección Saqueos y, con ella, la posibilidad de saquear puestos rivales.',b:{m:250,c:180,g:100},f:2,max:1},
q:{n:'Planificación',d:'Cada nivel añade un hueco en las colas de obras y de naves de todos tus planetas. Pagas al encolar y cancelar devuelve todo.',b:{m:200,c:200,g:80},f:2,max:5},
e:{n:'Eficiencia',d:'+10% de producción en todas las minas.',b:{m:200,c:200,g:100},f:1.9,max:10}};
const SH={e:{n:'Explorador',d:'Revela los recursos de un planeta.',b:{m:150,c:100,g:40},s:1},
c:{n:'Colonizador',d:'Funda una colonia en un planeta explorado.',b:{m:600,c:400,g:250},s:2},
r:{n:'Corsario',d:'Nave de combate: saquea planetas explorados y trae botín a tu primera colonia.',b:{m:300,c:200,g:100},s:2}};
const BT={m:15,c:15,g:15,a:40,s:60,l:60,u:50,d:50,h:60,o:40,k:30,w:40,t:50,p:50,z:40},ST={e:30,c:90,r:60},ef=p=>1+.1*S.tech.e+.08*(lv(p,'u')+lv(p,'d'));
