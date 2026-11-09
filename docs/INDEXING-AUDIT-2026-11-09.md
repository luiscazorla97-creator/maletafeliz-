# Auditoría técnica de indexación — 9 de noviembre de 2026

Se auditó el sitio público y el repositorio existente de MaletaFeliz.com. La revisión encontró deficiencias de enlaces internos, metadescripciones y cobertura del sitemap que se pueden corregir técnicamente. Las 372 versiones de artículos examinadas están completas en el HTML servido y no presentaron bloqueos de indexación en esta comprobación.

La corrección técnica y el resultado de Google son comprobaciones diferentes. Esta auditoría no acredita que Google haya indexado las páginas pendientes ni garantiza una fecha para hacerlo.

## Datos de partida y alcance

El titular informa estos estados en Google Search Console:

| Motivo | URLs informadas |
| --- | ---: |
| Descubierta: actualmente sin indexar | 79 |
| Rastreada: actualmente sin indexar | 11 |
| Excluida por noindex | 6 |
| Bloqueada por robots.txt | 2 |
| No se ha encontrado: 404 | 1 |

No hay una conexión directa a la propiedad de Search Console ni una lista de sus URLs de ejemplo en este ejecutor. Por tanto, no se pueden atribuir esos estados a artículos concretos, inspeccionar el último rastreo de Google o declarar resueltas esas filas del informe. Se examinó el conjunto público de URLs para corregir lo comprobable sin depender de esos ejemplos.

La auditoría inicial comprende 864 URLs del sitemap: las 864 respondieron HTTP 200, permitieron rastreo, utilizaron canonical hacia su propia URL y no mostraron noindex ni contradicciones de hreflang. Se analizaron también los enlaces HTML y el recorrido desde las portadas española e inglesa. Los archivos de evidencia se conservan en `/workspace/artifacts/maletafeliz-indexing-n9/`.

## Problemas comprobados y correcciones preparadas

| Hallazgo inicial | Corrección técnica |
| --- | --- |
| Los índices `/es/guias/` y `/en/guides/` mostraban tarjetas cuyo enlace abría la ficha del destino, sin enlazar directamente desde ese listado a las guías. | Utilizar las guías publicadas para las tarjetas del índice: 186 artículos por idioma, cada uno con su URL y título propios. El enlace se entrega como HTML `<a href>` y conserva la presentación de las tarjetas. |
| 82 URLs de países no tenían un recorrido de enlaces desde las portadas. Sus enlaces cruzados de idioma formaban pares aislados del recorrido principal. | Convertir las referencias de país existentes en enlaces HTML a sus páginas de país, manteniendo la organización por países, ciudades y destinos. |
| 118 páginas de navegación compartían metadescripciones genéricas: 59 en español y 59 en inglés. | Preparar descripciones localizadas y específicas del tipo de colección, país, continente o categoría, usando el contenido realmente publicado. Conservar las descripciones editoriales propias de los artículos. |
| 18 páginas informativas existentes, actualmente indexables por su configuración revisada, no se incluían en el sitemap. | Incorporarlas al sitemap existente, sin generar páginas ni URLs nuevas. El resultado esperado es de 882 entradas y debe conservar las 864 anteriores. |
| Faltaban alternates en algunas colecciones del sitemap y fechas de modificación derivadas del contenido de esas colecciones. | Incluir los idiomas disponibles y calcular lastmod a partir de las fechas reales de sus artículos. No utilizar la hora de compilación para aparentar novedades. |
| El tipo Open Graph podía marcar como artículo una colección por el mero hecho de tener datos estructurados. | Distinguir páginas de colección (`website`) y artículos (`article`), manteniendo Article JSON-LD para las guías y datos de colección apropiados para los índices. |

Las 82 URLs de países no se equiparan con las 79 URLs descubiertas de Search Console: son conjuntos cuya relación no se puede establecer sin los ejemplos del informe. El sitemap permitía descubrir esos países, pero faltaba un recorrido de navegación desde las portadas.

**Estado de estas correcciones:** preparadas en el código. Las comprobaciones posteriores, los commits y el despliegue deberán registrarse en la sección final antes de considerar cerrado este trabajo.

## Revisión de todos los artículos

Se examinaron los 186 originales, con sus 372 versiones completas en español e inglés, y sus cuerpos HTML descargados por HTTPS. El informe `content-audit.json` conserva el resultado por artículo.

- Cada artículo tiene un H1 y sus encabezados H2 de lugares y consejos prácticos en el HTML servido.
- Se encontraron en ese HTML las introducciones, párrafos, itinerarios, preguntas, respuestas y conclusiones de los manuscritos. El contenido principal no necesita JavaScript para aparecer. Las FAQ plegables conservan sus respuestas en HTML.
- Se comprobaron títulos, metadescripciones, canonical, hreflang recíprocos y Article JSON-LD: titular, idioma, URL y fechas coinciden con el artículo.
- Los 186 pares conservan la misma cobertura de lugares, fotografías y fuentes entre idiomas. No se detectaron traducciones ausentes o versiones reducidas a un resumen.
- Pasaron las verificaciones de 872 enlaces relacionados localizados y 1.638 espacios fotográficos documentales, correspondientes a 819 recomendaciones en ambos idiomas.
- Las huellas de los artículos coinciden con sus aprobaciones. Los textos y las fechas anteriores se conservaron.
- No se encontraron cuerpos completos, párrafos significativos, títulos o metadescripciones de artículos duplicados. La comparación de secuencias de ocho palabras no produjo candidatos que superaran los umbrales de revisión documentados; esa medida no es una puntuación de Google.
- El rango observado es de 1.067 a 2.393 palabras útiles. Las 16 versiones inferiores a 1.200 palabras, pertenecientes a 13 originales, tienen listas o selecciones desarrolladas, planificación y FAQ específicas. Su longitud no acredita contenido de poco valor. No se rellenaron, borraron ni marcaron noindex por ese motivo.

Esta revisión detecta integridad técnica, estructura y posibles duplicaciones. No sustituye una evaluación editorial independiente de cada experiencia ni una nueva consulta de todas las fuentes externas. Tampoco demuestra que Google deba indexar cualquier página que responda HTTP 200.

## Robots.txt, noindex y errores 404

Robots.txt permite el sitio y restringe únicamente `/es/buscar/` y `/en/search/`. Son páginas de resultados internos, no artículos. Mantener esas restricciones evita ampliar el rastreo a combinaciones ilimitadas de búsquedas.

En la compilación inicial hay seis rutas noindex previstas: la entrada `/`, la respuesta 404, los dos buscadores y las dos colecciones vacías de la Antártida. La entrada detecta el idioma y dirige a `/es/` o `/en/`, que sí son indexables. No se retiraron estas exclusiones para reducir artificialmente el recuento gris de Search Console. Estas seis rutas locales no identifican necesariamente las seis URLs de su informe, que puede reflejar un rastreo anterior o variantes de URL.

No apareció ningún error 404 entre las 864 entradas iniciales del sitemap. La URL 404 de Search Console no está identificada. No se creó una redirección general hacia la portada: una página inexistente debe seguir devolviendo 404 cuando no tiene una sustituta pertinente. Si se identifica una URL antigua con reemplazo real, corresponde una redirección permanente específica hacia ese contenido.

## Cloudflare y Googlebot

Se hicieron 24 comprobaciones HTTP sobre ocho rutas, con tres agentes de usuario, incluidas cadenas de Googlebot y Google Inspection Tool. Todas respondieron HTTP 200, sin desafío de navegador, y los documentos HTML comparados ofrecieron el mismo contenido principal y las mismas directivas.

Estas solicitudes proceden del ejecutor de auditoría, no de direcciones IP verificadas de Google. Por ello, el resultado no descarta todas las reglas posibles aplicadas al Googlebot real.

El acceso autorizado permitió consultar la zona y los proyectos Pages. Las lecturas de controles de seguridad, bots y reglas devolvieron HTTP 403 por falta de permisos; Analytics tampoco permitió consultar los datos solicitados. No se desactivaron protecciones ni se modificaron Cloudflare, DNS o sus proyectos para eludir esa limitación. No se pudieron obtener los registros de Googlebot real o la ruta 404 del informe mediante esas interfaces.

## Incorporación automática de futuras publicaciones

Los índices y el sitemap se derivan del catálogo de artículos publicados. Las correcciones mantienen ese modelo: una guía nueva válida debe aparecer con su URL localizada en el índice HTML y en el sitemap; las traducciones disponibles deben enlazarse recíprocamente. Los borradores y las colecciones vacías permanecen excluidos del sitemap de producción.

Las pruebas añadidas cubren publicaciones futuras mediante datos sintéticos aislados, traducciones ausentes, borradores, modo de vista previa y conservación de las fechas reales. Los datos de prueba no se publican como contenido.

## Acciones manuales en Google Search Console

1. En **Sitemaps**, volver a enviar `https://maletafeliz.com/sitemap.xml` cuando el despliegue corregido esté verificado. Se conserva esa misma dirección.
2. En **Inspección de URLs**, probar en directo una selección de guías importantes de cada idioma. Comprobar respuesta, acceso de Google, canonical declarado/elegido y HTML renderizado. Solicitar indexación de las URLs importantes que realmente lo necesiten.
3. Abrir las categorías de las 79 descubiertas y las 11 rastreadas, revisar sus ejemplos y la fecha del último rastreo. Distinguir artículos, índices, fichas de destino y versiones antiguas antes de decidir una corrección adicional.
4. Utilizar **Validar corrección** para problemas concretos corregidos, cuando esa acción esté disponible. Las exclusiones intencionales de buscadores, entrada y páginas vacías no deben presentarse como errores resueltos mediante una apertura indiscriminada del rastreo.
5. Identificar la URL del único 404. Corregir un enlace que siga apuntando a ella o preparar una redirección específica si existe una sustituta equivalente. Conservar un 404 verdadero cuando la página no existe y carece de reemplazo.
6. Si una inspección en directo muestra un bloqueo de Cloudflare, contrastar su hora, URL y agente verificado en los eventos de seguridad de la cuenta. No cambiar reglas de protección de forma general basándose únicamente en el nombre del agente de usuario.

El sitemap y la solicitud de rastreo ayudan a Google a descubrir y revisar contenido. No fuerzan la indexación ni garantizan plazos o visitas.

## Pruebas y publicación de las correcciones

**Pendiente de completar por el responsable de la publicación:**

- Resultado de tipos, pruebas unitarias, compilación normal, navegación y la compilación obligatoria `npm run build:release`.
- Comprobación posterior de las 882 entradas esperadas, conservación de las 864 iniciales, enlaces directos a todas las guías y accesibilidad de los países desde las portadas.
- Revisión de escritorio y móvil, HTML sin JavaScript, metadatos y datos estructurados.
- Auditoría de conservación de todos los artículos, fechas, imágenes, diseño 3D, anuncios, Analytics, consentimiento, rutas y sistema de publicación.
- Commit publicado, resultados de GitHub Actions y despliegues de los proyectos existentes de Cloudflare, con comprobaciones HTTPS posteriores.

Hasta incorporar esos resultados no se afirma que las correcciones estén desplegadas ni que los estados privados de Search Console hayan cambiado.

## Documentación de Google consultada

- [Informe de indexación de páginas de Search Console](https://support.google.com/webmasters/answer/7440203?hl=es): significado de los estados, exclusiones válidas y necesidad de inspeccionar URLs concretas.
- [Prácticas recomendadas para enlaces rastreables](https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=es): enlaces HTML y textos descriptivos que permiten descubrir el contenido.
- [Crear y enviar sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=es): URLs canónicas, formatos, envío y uso correcto de las fechas.
