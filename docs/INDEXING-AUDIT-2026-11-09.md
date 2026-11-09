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

## Problemas comprobados y correcciones publicadas

| Hallazgo inicial | Corrección técnica |
| --- | --- |
| Los índices `/es/guias/` y `/en/guides/` mostraban tarjetas cuyo enlace abría la ficha del destino, sin enlazar directamente desde ese listado a las guías. | Utilizar las guías publicadas para las tarjetas del índice: 186 artículos por idioma, cada uno con su URL y título propios. El enlace se entrega como HTML `<a href>` y conserva la presentación de las tarjetas. |
| 82 URLs de países no tenían un recorrido de enlaces desde las portadas. Sus enlaces cruzados de idioma formaban pares aislados del recorrido principal. | Convertir las referencias de país existentes en enlaces HTML a sus páginas de país, manteniendo la organización por países, ciudades y destinos. |
| 118 páginas de navegación compartían metadescripciones genéricas: 59 en español y 59 en inglés. | Preparar descripciones localizadas y específicas del tipo de colección, país, continente o categoría, usando el contenido realmente publicado. Conservar las descripciones editoriales propias de los artículos. |
| 18 páginas informativas existentes, actualmente indexables por su configuración revisada, no se incluían en el sitemap. | Incorporarlas al sitemap existente, sin generar páginas ni URLs nuevas. El resultado esperado es de 882 entradas y debe conservar las 864 anteriores. |
| Faltaban alternates en algunas colecciones del sitemap y fechas de modificación derivadas del contenido de esas colecciones. | Incluir los idiomas disponibles y calcular lastmod a partir de las fechas reales de sus artículos. No utilizar la hora de compilación para aparentar novedades. |
| El tipo Open Graph podía marcar como artículo una colección por el mero hecho de tener datos estructurados. | Distinguir páginas de colección (`website`) y artículos (`article`), manteniendo Article JSON-LD para las guías y datos de colección apropiados para los índices. |

Las 82 URLs de países no se equiparan con las 79 URLs descubiertas de Search Console: son conjuntos cuya relación no se puede establecer sin los ejemplos del informe. El sitemap permitía descubrir esos países, pero faltaba un recorrido de navegación desde las portadas.

**Estado de estas correcciones:** publicadas y verificadas. La sección final registra pruebas, despliegues y comprobaciones HTTPS. Esto no acredita un cambio en los estados privados de Search Console.

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

### Revisión de utilidad de fichas de país y destino

El inventario de solo lectura examinó las 462 páginas de archivo localizadas: 100 de países y 362 de destinos. Hay 176 destinos con una sola guía —352 fichas localizadas— y 17 países con una sola guía —34 páginas localizadas—. Las introducciones breves de 92 páginas de países comparten dos textos, uno por idioma. Las fichas de destino resumen el título de su propia guía y enlazan al artículo completo.

Son candidatos para una futura revisión editorial de utilidad y diferenciación: contexto propio, organización clara y enlaces pertinentes. Una ficha con una única guía no es automáticamente una página errónea o de poco valor. Estos datos no identifican la causa de las 79 URLs descubiertas o las 11 rastreadas del informe privado. No se añadieron párrafos de relleno, páginas artificiales, redirecciones ni exclusiones noindex por estos recuentos. El informe completo se conserva con su hash en la evidencia, sin copiar su inventario extenso al registro de publicación.

## Robots.txt, noindex y errores 404

Robots.txt permite el sitio y restringe únicamente `/es/buscar/` y `/en/search/`. Son páginas de resultados internos, no artículos. Mantener esas restricciones evita ampliar el rastreo a combinaciones ilimitadas de búsquedas.

En la compilación inicial hay seis rutas noindex previstas: la entrada `/`, la respuesta 404, los dos buscadores y las dos colecciones vacías de la Antártida. La entrada detecta el idioma y dirige a `/es/` o `/en/`, que sí son indexables. No se retiraron estas exclusiones para reducir artificialmente el recuento gris de Search Console. Estas seis rutas locales no identifican necesariamente las seis URLs de su informe, que puede reflejar un rastreo anterior o variantes de URL.

No apareció ningún error 404 entre las 864 entradas iniciales del sitemap. La URL 404 de Search Console no está identificada. No se creó una redirección general hacia la portada: una página inexistente debe seguir devolviendo 404 cuando no tiene una sustituta pertinente. Si se identifica una URL antigua con reemplazo real, corresponde una redirección permanente específica hacia ese contenido.

## Cloudflare y Googlebot

Se hicieron 24 comprobaciones HTTP sobre ocho rutas, con tres agentes de usuario, incluidas cadenas de Googlebot y Google Inspection Tool. Todas respondieron HTTP 200, sin desafío de navegador, y los documentos HTML comparados ofrecieron el mismo contenido principal y las mismas directivas.

Estas solicitudes proceden del ejecutor de auditoría, no de direcciones IP verificadas de Google. Por ello, el resultado no descarta todas las reglas posibles aplicadas al Googlebot real.

El acceso autorizado permitió consultar la zona y los proyectos Pages. Las lecturas de controles de seguridad, bots y reglas devolvieron HTTP 403 por falta de permisos; Analytics tampoco permitió consultar los datos solicitados. No se desactivaron protecciones ni se modificaron Cloudflare, DNS o sus proyectos para eludir esa limitación. No se pudieron obtener los registros de Googlebot real o la ruta 404 del informe mediante esas interfaces.

### Comprobación posterior del acceso al sitemap

Una solicitud con el agente predeterminado `Python-urllib/3.12` recibió HTTP 403 y un cuerpo de 17 bytes con `error code: 1010`. Se conserva este fallo. Otras dos solicitudes al mismo sitemap, identificadas como `MaletaFeliz-Indexability-Audit/1.0` y `Googlebot/2.1`, respondieron HTTP 200 con la misma huella SHA-256 del XML.

La [documentación de Cloudflare sobre el error 1010](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/) describe comprobaciones de firma del navegador, incluidas las gestionadas para dominios personalizados de Pages, y recomienda un agente de usuario descriptivo para clientes HTTP. El auditor descriptivo ya se utilizaba en la comprobación inicial. No se alteraron ajustes de seguridad para estas pruebas. El error observado para Python no demuestra que Cloudflare bloquee las IP verificadas de Google ni que explique los estados privados de Search Console.

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

Verificado el 2026-11-09 11:37 EST. El commit de aplicación `7d7a8c83db5f43beb9148ce4adf62646a44bab98` completó ambos proyectos existentes de Cloudflare, con checkout confirmado en sus registros. La evidencia pública está en `editorial/verification/2026-11-09-indexing-publication.json`. Un commit posterior guarda únicamente este registro y la documentación.

| Control | Resultado verificado |
| --- | --- |
| Tipos | 0 errores |
| Pruebas unitarias locales | 80 aprobadas |
| Navegación local | 28 aprobadas |
| Compilación normal y `npm run build:release` | 888 páginas en cada compilación |
| Producción local seleccionada | 52 aprobadas |
| Batería completa de GitHub Actions | 80 unitarias + 28 de navegación + 796 de producción: 904 aprobadas |
| Auditoría HTTPS posterior | 882 de 882 URLs con HTTP 200 y sin problemas de indexabilidad detectados |
| Sitemap | Las 864 entradas anteriores conservadas y 18 páginas informativas ya existentes incorporadas |
| Enlaces HTML | 186 guías por idioma enlazadas directamente desde el índice; todas las guías a dos clics o menos desde una portada |
| Países sin recorrido desde portadas | 82 antes; 0 después |
| Metadescripciones del grupo repetido | Las 118 ahora distintas; 116 ajustadas y las dos portadas conservadas |
| Navegador | 24 registros privados y 26 públicos; la repetición pública completó 236 solicitudes HTTP y 10 capturas, con escritorio, móvil y directorios sin JavaScript |
| Conservación | 372 artículos, sus fechas, 821 fotos y las 888 rutas HTML existentes conservados |

GitHub Actions: [corrida verificada](https://github.com/luiscazorla97-creator/maletafeliz-/actions/runs/42652405361). Se conservan huellas de los registros completos, las capturas revisadas y los resultados por URL en la evidencia. No se publicaron artículos o rutas nuevos y no se modificaron reservas, programación, diseño 3D, anuncios, Analytics ni consentimiento.

El primer intento público agotó la espera de 30 segundos al cargar la portada de Barcelona. Ese intento no conservó el estado HTTP de la solicitud que falló, y queda registrado. La comprobación posterior con el mismo agente de usuario obtuvo HTTP 200 y las huellas exactas del manifiesto para 4 archivos de la portada. La repetición de la prueba, con las mismas condiciones y persistencia de diagnóstico, pasó los 26 registros y 236 solicitudes, con diez capturas revisadas y sin errores de navegador. No se atribuye una causa al primer timeout ni se afirma haber reparado una imagen rota reproducible.

La entrada `/` respondió HTTP 200 con noindex previsto. Una ruta sintética inexistente respondió HTTP 404 con noindex. Esta prueba comprueba un 404 auténtico; no identifica la URL privada con error 404 de Search Console.

El cambio técnico está publicado y comprobado. La cuenta privada de Search Console no está conectada: los estados de sus 79 URLs descubiertas, 11 rastreadas y la URL con error 404 no se dan por resueltos. Las acciones manuales indicadas arriba siguen siendo necesarias para comprobar el siguiente rastreo de Google. No se promete indexación, plazos o visitas.

## Títulos de las fichas de navegación

Los títulos de los 372 artículos son únicos. Se registran tres pares de fichas de ciudad y país que comparten nombre propio: Singapore en inglés, Singapur en español y Túnez en español. Sus descripciones y URLs canónicas son distintas. Se conserva la organización por país y ciudad; esta coincidencia de nombres no demuestra que los artículos estén duplicados ni identifica las URLs excluidas de Search Console.

## Documentación de Google consultada

- [Informe de indexación de páginas de Search Console](https://support.google.com/webmasters/answer/7440203?hl=es): significado de los estados, exclusiones válidas y necesidad de inspeccionar URLs concretas.
- [Prácticas recomendadas para enlaces rastreables](https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=es): enlaces HTML y textos descriptivos que permiten descubrir el contenido.
- [Crear y enviar sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=es): URLs canónicas, formatos, envío y uso correcto de las fechas.
