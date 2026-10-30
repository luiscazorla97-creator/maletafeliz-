# Estado del proyecto

Verificado el 29 de octubre de 2026 en America/New_York (30 de octubre en UTC). Especificación vigente: `requirements.md`.

## Publicación verificada

https://maletafeliz.com/es/ y /en/ responden por HTTPS. El host www redirige con HTTP 301 al dominio principal conservando rutas y parámetros. `editorial/publication.json` registra el despliegue y sus comprobaciones públicas.

- 45 guías originales y 90 versiones completas en español e inglés, con al menos 1.200 palabras útiles por versión, itinerarios, preguntas, fuentes y enlaces relacionados.
- 254 documentos de fuentes citadas con fechas, estado HTTP, huellas y hechos conservados. Las revisiones se identifican como asistidas por Codex; no se afirma revisión humana independiente.
- 322 fotografías publicadas con procedencia, autor, licencia, ALT bilingüe, dimensiones, hashes y derivados WebP. Las fotos de archivo no acreditan disponibilidad de un evento actual.
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

Publicado y verificado: los 320 lugares recomendados de las 45 guías tienen fotografía en español e inglés (640 secciones localizadas). Las treinta guías anteriores recibieron 233 fotografías nuevas y 57 asignaciones de fotografías ya verificadas. Sus textos, fuentes y fechas originales de publicación se preservaron. Las imágenes tienen variantes WebP, ALT bilingüe, descripción visible y crédito; los archivos históricos se identifican como tales. La compilación rechaza cualquier lugar sin fotografía.

El commit `e51281241231569de6386c790c3082a7f29da954` se desplegó correctamente en ambos proyectos de Cloudflare. Pasaron el chequeo de tipos, 33 pruebas unitarias, 10 de vista previa y las 194 pruebas de producción en móvil y escritorio. Ambas compilaciones generaron 284 páginas. Se comprobaron 98 rutas y redirecciones públicas, las 640 fotografías dentro de sus 90 artículos y los bytes exactos de las 233 fotografías nuevas: 421 registros HTTP. Evidencia: `editorial/verification/2026-10-30-all-place-photos.json`.

## Publicidad

Se mantiene un banner Adsterra 300 × 250 por página de contenido. Privacidad, términos, cookies, licencias de fotografías y 404 quedan excluidas; las nuevas guías y categorías sí incluyen banner. Las etiquetas del proveedor cargan directamente y en orden, sin iframe adicional restrictivo ni async/defer. Las políticas CSP correspondientes se conservan. No se añadió un diálogo de autorización, conforme a la instrucción del titular.

Las pruebas de publicidad simulan al proveedor para no generar impresiones reales. La integración publicada está verificada; la entrega de anuncios reales no está confirmada desde este entorno. Evidencia histórica: `editorial/verification/2026-10-30-sitewide-advertising.json`.

## Operación y límites

Cloudflare Pages utiliza GitHub/main: `maletafeliz-web` sirve la revista y `maletafeliz-www` la redirección. El flujo operativo activa la compilación mediante la API de Cloudflare después de subir el commit. La activación automática por cada push no está acreditada. La subida directa de assets con Wrangler encontró una incompatibilidad con el token temporal del proxy; se utiliza la integración Git oficial.

El titular facilitó Luis Sebastian Cazorla Caruso, Argentina, luterapps@gmail.com. La revisión de textos legales es técnica y editorial, sin afirmar asesoría jurídica profesional. Search Console, GA4 y afiliados requieren su configuración real; la integración de anuncios descrita arriba sí está activa.

No hay una tarea recurrente de redacción de Codex Cloud configurada ni probada, ni una lectura de porcentaje de cuota. Se mantiene el flujo manual `PUBLICAR 5 ARTÍCULOS` y el objetivo documentado de las 07:00 America/New_York. No se usan APIs de IA de pago, bases de datos ni automatizaciones ficticias.

Las verificaciones de tandas anteriores permanecen en `editorial/verification/2026-10-28.json` y `2026-10-29.json`. El estado `published` de un artículo selecciona contenido para compilar; únicamente el registro de verificación pública acredita que está en el dominio.
