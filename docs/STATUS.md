# Estado del proyecto

Verificado el 31 de octubre de 2026 en America/New_York. Especificación vigente: `requirements.md`.

## Publicación verificada

https://maletafeliz.com/es/ y /en/ responden por HTTPS. El host www redirige con HTTP 301 al dominio principal conservando rutas y parámetros. `editorial/publication.json` registra el despliegue y sus comprobaciones públicas.

- 65 guías originales y 130 versiones completas en español e inglés, con al menos 1.200 palabras útiles por versión, itinerarios, preguntas, fuentes y enlaces relacionados.
- 313 documentos de fuentes citadas con fechas, estado HTTP, huellas y hechos conservados. Las revisiones se identifican como asistidas por Codex; no se afirma revisión humana independiente.
- 377 fotografías publicadas con procedencia, autor, licencia, ALT bilingüe, dimensiones, hashes y derivados WebP. Las fotos de archivo no acreditan disponibilidad de un evento actual.
- La campaña de diez países para Halloween y cinco guías mexicanas de Día de Muertos está publicada en ambos idiomas. Tiene una categoría propia, enlaces desde la portada y presencia en el sitemap. No se afirma un ranking de volumen de búsquedas sin datos.
- Las guías distinguen fechas de 2026, eventos ya concluidos, productos separados y entradas agotadas. Oaxaca se presenta como estancia cultural: no se inventa un calendario local de comparsas ni ceremonias en Monte Albán.
- Canonical y hreflang recíprocos, selector al mismo artículo traducido, JSON-LD, sitemap, robots de producción y respuesta 404. Búsqueda y páginas vacías no indexables.

La campaña corresponde al commit `f2144ca1cb32dc36dfb91ea88c9452d336f529b9`. Los dos builds de Cloudflare terminaron correctamente. Se verificaron 98 rutas públicas y redirecciones, los dos índices de festividades y 114 variantes de fotografías nuevas por sus bytes exactos: 214 registros HTTP. Evidencia: `editorial/verification/2026-10-30-seasonal.json`.

## Comprobaciones del lote de festividades

- Chequeo de tipos sin errores, 32 pruebas unitarias y 10 pruebas de navegación de vista previa superadas.
- Compilaciones de vista previa y producción correctas; 284 páginas HTML, incluidas 90 páginas editoriales.
- 194 comprobaciones de navegador de producción: 192 superadas en la ejecución completa; las dos de portada asumían un único resultado para Tokio. Se ajustó esa suposición para permitir la nueva guía de Japón, conservando la comprobación de exclusión de resultados ajenos y navegación al artículo correcto; ambas pasaron al repetirse.
- Todas las guías se comprobaron en móvil y escritorio: fotografías, traducciones, metadatos y ausencia de desbordamiento. Portada y sección nueva inspeccionadas visualmente.
- Fuentes, licencias y pertinencia de fotografías revisadas por separado; las pruebas no sustituyen esas revisiones.

## Fotografías de todos los lugares

Ampliación anterior verificada: los 320 lugares recomendados de las 45 guías tienen fotografía en español e inglés (640 secciones localizadas). Las treinta guías anteriores recibieron 233 fotografías nuevas y 57 asignaciones de fotografías ya verificadas. Sus textos, fuentes y fechas originales de publicación se preservaron. Las imágenes tienen variantes WebP, ALT bilingüe, descripción visible y crédito; los archivos históricos se identifican como tales. La compilación rechaza cualquier lugar sin fotografía.

El commit `e51281241231569de6386c790c3082a7f29da954` se desplegó correctamente en ambos proyectos de Cloudflare. Pasaron el chequeo de tipos, 33 pruebas unitarias, 10 de vista previa y las 194 pruebas de producción en móvil y escritorio. Ambas compilaciones generaron 284 páginas. Se comprobaron 98 rutas y redirecciones públicas, las 640 fotografías dentro de sus 90 artículos y los bytes exactos de las 233 fotografías nuevas: 421 registros HTTP. Evidencia: `editorial/verification/2026-10-30-all-place-photos.json`.

## Cinco nuevas guías: 30 de octubre de 2026

Publicadas Madrid, Cartagena de Indias, Lúxor, Hong Kong y Melbourne, en español e inglés. Cada guía desarrolla tres lugares con fotografías individuales y más de 1.200 palabras por versión. Se incorporaron 15 fotografías, verificadas visualmente y con sus páginas de archivo/licencias consultadas. El total actual es de 335 lugares recomendados y 670 secciones localizadas con foto. Se conservan canonical, hreflang, datos estructurados, búsqueda, categorías y sitemap.

Las diez versiones nuevas incluyen itinerario, preguntas, fuentes y enlaces relacionados. Se indican los cierres consultados del Palacio de Cristal y de algunas salas de la NGV en 2026. La referencia general de Victoria Peak es secundaria y está identificada; no se inventan horarios o precios actuales del operador.

Commit publicado: `30c8c21817e2e384abf8adde67bccdd5a930e2e1`. Ambos proyectos de Cloudflare terminaron correctamente. Pasaron tipos, 33 pruebas unitarias y 10 de vista previa. Los 214 casos de producción quedaron aprobados: 212 pasaron en la ejecución completa y las 10 pruebas de publicidad se repitieron con éxito tras corregir el cierre de las interceptaciones de red del navegador de pruebas. Se verificaron 209 respuestas públicas, incluidas las diez guías nuevas, sus páginas de descubrimiento y las 60 variantes de fotos nuevas por sus bytes exactos. Evidencia: `editorial/verification/2026-10-30-five-guides.json`.

## Diez nuevas guías de viaje: octubre de 2026

Publicadas Estambul, Praga, Viena, Atenas, Dubái, Taipéi, Siem Reap y Angkor, El Cairo y Guiza, San Pedro de Atacama y Rotorua. Son diez destinos nuevos respecto de las cincuenta guías anteriores, con veinte versiones completas de 1.350–1.572 palabras, treinta fotografías reales y 33 documentos de fuentes consultadas. Cada lugar tiene fotografía propia, ALT bilingüe, crédito, licencia y variantes WebP. Se conservan las fechas y los textos de las guías anteriores.

La selección es editorial para viajar en esta época; no se presenta como un ranking mensual comprobado. Google Trends devolvió HTTP 429 y no se obtuvieron cifras de demanda. La incidencia, los reemplazos de fuentes y la comprobación de originalidad están registrados en la evidencia de selección. Muze.gen.tr se identifica como referencia complementaria, no como operador oficial. No se prometen precios, acceso, clima ni avistamientos.

Pasaron tipos sin errores, 33 pruebas unitarias, 10 de navegación de vista previa y 266 de producción, incluidas todas las guías en móvil y escritorio. Las compilaciones generan 366 páginas. Se revisaron visualmente las treinta fotos y ejemplos de artículos; los proveedores publicitarios y Analytics se simularon durante las pruebas. Se conservan la publicidad existente y el consentimiento de Analytics.

Commit de contenido publicado: `31cc5ddc164d5d470c145ca646861a397f9e6eaa`. Ambos proyectos de Cloudflare compilaron ese commit correctamente. Se verificaron 313 respuestas públicas: todas las guías, nuevas páginas de descubrimiento, sitemap, redirecciones www y las 120 variantes de fotos nuevas por SHA-256. Evidencia: `editorial/verification/2026-10-30-october-ten.json`. El sitio suma 60 originales, 120 versiones y 365 lugares recomendados con fotografía (730 secciones localizadas).

## Cinco nuevas guías: 31 de octubre de 2026

Publicadas Oporto, Copenhague, Budapest, Kuala Lumpur y Ottawa, sin repetir los sesenta destinos anteriores. Son diez versiones completas en español e inglés, de 1.486–1.587 palabras, con dos lugares desarrollados por guía, fotografía individual, itinerario, cuatro preguntas frecuentes, fuentes y enlaces relacionados. Se incorporan diez fotografías reales con cuarenta archivos WebP responsivos y diez documentos de fuentes leídas. Se conservan las fechas y el contenido de las guías anteriores.

Se describen las limitaciones de escaleras y ausencia de ascensor de Rosenborg, el cierre estacional del sitio histórico Rideau consultado el 31 de octubre y la necesidad de confirmar espacios urbanos mantenidos. No se recomienda entrar a instalaciones cerradas ni hielo no habilitado. Las fotos de archivo se identifican; Batu Caves muestra la escalera de 2015 y Petronas una panorámica de tomas fotográficas reales. Los fallos de acceso a fuentes candidatas constan en el registro; se usaron fuentes turísticas oficiales accesibles y no se inventaron tarifas ni disponibilidad.

Pasaron tipos sin errores, 33 pruebas unitarias, 10 de vista previa y 286 de producción, incluidas todas las guías en móvil y escritorio. Las compilaciones generan 392 páginas HTML. Fotos y ejemplos de artículos revisados visualmente; anuncios y Analytics simulados durante las pruebas. Se preserva la configuración existente de publicidad y consentimiento.

Commit de contenido publicado: `c42f1aa7216fc81cd9da3f0804214593081333da`. Ambos proyectos de Cloudflare compilaron ese commit correctamente. Se verificaron 213 respuestas públicas, incluidas todas las guías, descubrimiento, sitemap, redirecciones y los cuarenta archivos de las fotos nuevas por SHA-256. Evidencia: `editorial/verification/2026-10-31-five.json`. El total queda en 65 originales, 130 versiones y 375 lugares recomendados con fotografía, equivalentes a 750 secciones localizadas.

## Publicidad y consentimiento de Analytics

Actualización publicada: `891aef2fc6560191f668224f87b45cf8285c1a66`. Adsterra vuelve a estar habilitado por solicitud del titular, con banners de 300 × 250 arriba y abajo del contenido y dos laterales cuando el ancho inicial es de al menos 1920 píxeles. Los laterales no solicitan anuncios en pantallas menores y no cubren el contenido; se mantienen dentro del área anterior al pie. Las páginas legales y 404 excluyen anuncios. El código se ejecuta en orden, en el documento principal, sin un iframe envolvente adicional.

Google Analytics 4, propiedad `G-RQKZL13K0Z`, requiere aceptación explícita. Antes de aceptar no se carga gtag.js. Aceptar o rechazar se recuerda en almacenamiento local; el control del pie de página permite cambiar la decisión. Retirar el permiso detiene Analytics en ese navegador, elimina las cookies _ga accesibles al sitio y recarga el documento para retirar los manejadores de Google. Sin acceso al almacenamiento se vuelve a pedir una decisión en la siguiente visita. Las páginas legales también respetan esta preferencia. El permiso controla Analytics; no cambia la carga de los anuncios solicitados por el titular. Las vistas previas no incluyen la interfaz ni cargan Analytics o anuncios.

Se conserva el código de conexión de AdSense, la meta de cuenta y ads.txt del editor ca-pub-1382859681401211. No se afirma aprobación de Google, recepción de métricas en el panel ni entrega real de anuncios. La consulta a la etiqueta de Adsterra desde el entorno devolvió HTTP 403 sin contenido; eso no determina por sí solo qué reciben los visitantes. Las pruebas usan proveedores simulados, sin impresiones publicitarias ni eventos reales de Analytics.

Pasaron tipos, 33 pruebas unitarias, 10 de vista previa y 224 de producción. Se comprobó la disposición a 320, 390, 1440, 1919, 1920 y 2560 píxeles, junto con la aceptación, rechazo, retirada y fallo del almacenamiento. Se verificaron 317 respuestas públicas y ambos proyectos de Cloudflare. Evidencia: `editorial/verification/2026-10-30-analytics-adsterra.json`. La recepción de datos debe comprobarse en la propiedad de Analytics del titular y la retirada futura de Adsterra requiere conocer el resultado de AdSense; no hay un monitor de aprobación configurado.

## Banner nativo y popunder

Publicados por solicitud del titular en el commit `c19f28238d51c8c7acbd950cb81955b1bccba0e1`. El bloque nativo usa la etiqueta bauval.org/21/baf26907b67b4fd5cdb22901aa38108e y su contenedor único, antes del pie y después del banner inferior. Se identifica como Publicidad/Advertisement y el contenedor existe antes de ejecutar el script asíncrono.

El proveedor de popunder abscloud.org/1/7a7683e73ba102718744e3df1c9fbe35 se carga una sola vez por documento tras un clic primario real en el contenido. La inicialización excluye clics sintéticos, anuncios y controles de Analytics; no cancela enlaces ni abre ventanas por código propio. Una vez cargado, el proveedor controla las aperturas posteriores y su frecuencia; no se afirma que siempre se abra en el primer clic ni que se eludan los bloqueos del navegador. Ambos formatos se excluyen de páginas legales, 404 y vistas previas.

Google indica que sus anuncios no pueden mostrarse en sitios que activen popunders: https://support.google.com/adsense/answer/1346295?hl=es (consultado el 30 de octubre de 2026). Se informó al titular de este conflicto al implementar su solicitud. Debe retirarse el popunder antes de usar AdSense. El código de verificación existente sigue presente; no hay aprobación de Google verificada.

Tipos y 33 pruebas unitarias correctos; 10 pruebas de vista previa y 22 pruebas de producción centradas en publicidad y consentimiento superadas. No se repitió la suite completa de artículos, cuyo contenido no cambió. Se revisó el HTML de las 310 páginas y se verificaron 317 respuestas públicas. Ambas etiquetas nuevas devolvieron HTTP 403 sin contenido desde el entorno: la integración está comprobada, pero no la entrega real de anuncios ni aperturas. Evidencia: `editorial/verification/2026-10-30-native-popunder.json`.

## Banners laterales verticales: 31 de octubre de 2026

Publicado el formato Adsterra de 160 × 600 en ambos laterales, con la clave 1e5a2d407257849915d4433674f1978f facilitada por el titular. Sustituye exclusivamente los banners laterales anteriores. Arriba y abajo continúan los 300 × 250, junto con el nativo, popunder y código de verificación de AdSense existentes. Analytics mantiene aceptación explícita y se conservan las exclusiones legales, 404 y vista previa.

Los laterales se solicitan solo al abrir una página con ancho inicial de al menos 1.440 píxeles. La cuadrícula reserva 160 píxeles a cada lado y separa el contenido; no hay iframe envolvente adicional. Cada configuración se ejecuta junto a su etiqueta en orden de análisis del documento. En ventanas de menos de 700 píxeles de alto los laterales dejan de ser pegajosos para permitir recorrer el anuncio completo.

Pasaron tipos, 33 pruebas unitarias, 10 de vista previa y 286 pruebas de producción tras el cambio. Se verificaron dimensiones reales de 160 × 600, claves y URL correctas por posición, secuencia, límites de 1.439/1.440 píxeles, ausencia de peticiones laterales en móvil, no superposición al contenido ni al pie y el caso de ventana baja. Se inspeccionaron capturas con anuncios simulados. La entrega de creatividades reales no está acreditada; no se generaron impresiones de prueba ni eventos reales de Analytics.

Commit desplegado: `f2ba75e07f2f7ae7ffad59fc6392cbd45fa60fe5`. Los dos proyectos de Cloudflare completaron el mismo commit. Se comprobaron 158 respuestas públicas, incluidas todas las guías, las etiquetas nuevas, las exclusiones y los bytes del CSS publicado. Evidencia: `editorial/verification/2026-10-31-vertical.json`. Los cinco artículos del lote de hoy permanecen publicados, sin cambios en sus textos o fechas.

## Banner horizontal superior: 31 de octubre de 2026

El anuncio superior utiliza el formato Adsterra 728 × 90 y la clave 54722d11ca1374a1fe221435ad9001ac. Se muestra centrado, con su proporción reservada, y se reduce completo al ancho disponible mediante ResizeObserver sin recortar ni volver a solicitar la etiqueta al cambiar el tamaño de la ventana. La configuración del proveedor conserva 728×90. Se mantienen los dos laterales 160×600, el banner inferior 300×250, un único bloque nativo inferior y el popunder existente. No se duplica el identificador nativo. Analytics conserva su consentimiento explícito y las páginas legales, 404 y vista previa excluyen anuncios.

Pasaron tipos, 33 pruebas unitarias, 10 de vista previa y 22 pruebas de producción de publicidad y consentimiento. Se comprobó el HTML de las 392 páginas, la geometría en once anchos de 320 a 2560 píxeles, el límite de ancho del formato superior, los laterales y el redimensionamiento sin nuevas solicitudes. Los anuncios de prueba fueron simulados; las capturas de escritorio y móvil se inspeccionaron visualmente. No se afirma entrega real de creatividades. Los artículos y la cuadrícula global no cambiaron; no se repitió la suite editorial completa ya aprobada.

Commit desplegado: `24a86cef4d522fbc0c4b272bec746b764e1ee6ad`. Los dos proyectos de Cloudflare finalizaron correctamente. Se comprobaron 158 respuestas públicas, incluidas todas las guías, las tres claves de banners, las exclusiones y los bytes del CSS desplegado. Evidencia: `editorial/verification/2026-10-31-leaderboard.json`.

## Popunder desactivado: 31 de octubre de 2026

Se eliminó el componente de popunder y su inclusión en el layout. El sitio ya no añade el proveedor abscloud.org/1/7a7683e73ba102718744e3df1c9fbe35 mediante clics en el contenido. No se instala el manejador de interacción que lo inicializaba. Se mantienen el horizontal superior de 728 × 90, el inferior de 300 × 250, los dos laterales de 160 × 600 y el bloque nativo inferior. Los textos de privacidad y cookies en español e inglés reflejan esta configuración y tienen nueva revisión técnica vinculada al hash del texto. No se afirma aprobación de AdSense.

Pasaron tipos, 33 pruebas unitarias, 10 de vista previa y 22 de producción de publicidad y consentimiento. Las 392 páginas compiladas no contienen el dominio ni el cargador del popunder. Los clics reales y sintéticos del navegador no solicitaron ese proveedor ni abrieron ventanas; la navegación siguió en la misma pestaña. Los proveedores de banners se simularon, sin generar impresiones reales. Los formatos, tamaños, exclusiones legales y consentimiento de Analytics se conservaron.

Commit publicado: `683c1e105687c7c7e299b8f4053fb306f6086205`. Ambos proyectos de Cloudflare completaron el despliegue. Se verificaron 158 respuestas públicas, incluidas todas las guías, las etiquetas de banners, las páginas legales, la ausencia del popunder y el CSS por sus bytes exactos. Evidencia: `editorial/verification/2026-10-31-no-popunder.json`. Una pestaña que estuviera abierta con el código anterior debe recargarse para retirarlo de ese documento.

## Operación y límites

Cloudflare Pages utiliza GitHub/main: `maletafeliz-web` sirve la revista y `maletafeliz-www` la redirección. El flujo operativo activa la compilación mediante la API de Cloudflare después de subir el commit. La activación automática por cada push no está acreditada. La subida directa de assets con Wrangler encontró una incompatibilidad con el token temporal del proxy; se utiliza la integración Git oficial.

El titular facilitó Luis Sebastian Cazorla Caruso, Argentina, luterapps@gmail.com. La revisión de textos legales es técnica y editorial, sin afirmar asesoría jurídica profesional. Search Console y afiliados requieren su configuración real. Analytics y el código de conexión de AdSense están instalados con los límites de verificación descritos arriba.

No hay una tarea recurrente de redacción de Codex Cloud configurada ni probada, ni una lectura de porcentaje de cuota. Se mantiene el flujo manual `PUBLICAR 5 ARTÍCULOS` y el objetivo documentado de las 07:00 America/New_York. No se usan APIs de IA de pago, bases de datos ni automatizaciones ficticias.

Las verificaciones de tandas anteriores permanecen en `editorial/verification/2026-10-28.json` y `2026-10-29.json`. El estado `published` de un artículo selecciona contenido para compilar; únicamente el registro de verificación pública acredita que está en el dominio.
