# Estado del proyecto

Verificado el 30 de octubre de 2026 en America/New_York. Especificación vigente: `requirements.md`.

## Publicación verificada

https://maletafeliz.com/es/ y /en/ responden por HTTPS. El host www redirige con HTTP 301 al dominio principal conservando rutas y parámetros. `editorial/publication.json` registra el despliegue y sus comprobaciones públicas.

- 50 guías originales y 100 versiones completas en español e inglés, con al menos 1.200 palabras útiles por versión, itinerarios, preguntas, fuentes y enlaces relacionados.
- 270 documentos de fuentes citadas con fechas, estado HTTP, huellas y hechos conservados. Las revisiones se identifican como asistidas por Codex; no se afirma revisión humana independiente.
- 337 fotografías publicadas con procedencia, autor, licencia, ALT bilingüe, dimensiones, hashes y derivados WebP. Las fotos de archivo no acreditan disponibilidad de un evento actual.
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

## Publicidad y consentimiento de Analytics

Actualización publicada: `891aef2fc6560191f668224f87b45cf8285c1a66`. Adsterra vuelve a estar habilitado por solicitud del titular, con banners de 300 × 250 arriba y abajo del contenido y dos laterales cuando el ancho inicial es de al menos 1920 píxeles. Los laterales no solicitan anuncios en pantallas menores y no cubren el contenido; se mantienen dentro del área anterior al pie. Las páginas legales y 404 excluyen anuncios. El código se ejecuta en orden, en el documento principal, sin un iframe envolvente adicional.

Google Analytics 4, propiedad `G-RQKZL13K0Z`, requiere aceptación explícita. Antes de aceptar no se carga gtag.js. Aceptar o rechazar se recuerda en almacenamiento local; el control del pie de página permite cambiar la decisión. Retirar el permiso detiene Analytics en ese navegador, elimina las cookies _ga accesibles al sitio y recarga el documento para retirar los manejadores de Google. Sin acceso al almacenamiento se vuelve a pedir una decisión en la siguiente visita. Las páginas legales también respetan esta preferencia. El permiso controla Analytics; no cambia la carga de los anuncios solicitados por el titular. Las vistas previas no incluyen la interfaz ni cargan Analytics o anuncios.

Se conserva el código de conexión de AdSense, la meta de cuenta y ads.txt del editor ca-pub-1382859681401211. No se afirma aprobación de Google, recepción de métricas en el panel ni entrega real de anuncios. La consulta a la etiqueta de Adsterra desde el entorno devolvió HTTP 403 sin contenido; eso no determina por sí solo qué reciben los visitantes. Las pruebas usan proveedores simulados, sin impresiones publicitarias ni eventos reales de Analytics.

Pasaron tipos, 33 pruebas unitarias, 10 de vista previa y 224 de producción. Se comprobó la disposición a 320, 390, 1440, 1919, 1920 y 2560 píxeles, junto con la aceptación, rechazo, retirada y fallo del almacenamiento. Se verificaron 317 respuestas públicas y ambos proyectos de Cloudflare. Evidencia: `editorial/verification/2026-10-30-analytics-adsterra.json`. La recepción de datos debe comprobarse en la propiedad de Analytics del titular y la retirada futura de Adsterra requiere conocer el resultado de AdSense; no hay un monitor de aprobación configurado.

## Operación y límites

Cloudflare Pages utiliza GitHub/main: `maletafeliz-web` sirve la revista y `maletafeliz-www` la redirección. El flujo operativo activa la compilación mediante la API de Cloudflare después de subir el commit. La activación automática por cada push no está acreditada. La subida directa de assets con Wrangler encontró una incompatibilidad con el token temporal del proxy; se utiliza la integración Git oficial.

El titular facilitó Luis Sebastian Cazorla Caruso, Argentina, luterapps@gmail.com. La revisión de textos legales es técnica y editorial, sin afirmar asesoría jurídica profesional. Search Console y afiliados requieren su configuración real. Analytics y el código de conexión de AdSense están instalados con los límites de verificación descritos arriba.

No hay una tarea recurrente de redacción de Codex Cloud configurada ni probada, ni una lectura de porcentaje de cuota. Se mantiene el flujo manual `PUBLICAR 5 ARTÍCULOS` y el objetivo documentado de las 07:00 America/New_York. No se usan APIs de IA de pago, bases de datos ni automatizaciones ficticias.

Las verificaciones de tandas anteriores permanecen en `editorial/verification/2026-10-28.json` y `2026-10-29.json`. El estado `published` de un artículo selecciona contenido para compilar; únicamente el registro de verificación pública acredita que está en el dominio.
