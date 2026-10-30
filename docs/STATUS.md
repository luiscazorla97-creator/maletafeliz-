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

## Publicidad

Adsterra está desactivado por solicitud del titular: ninguna página compilada incluye su script, configuración ni contenedor de banner. El componente histórico permanece sin uso en el repositorio.

Las páginas de contenido de producción cargan el script asíncrono de Google AdSense con el editor ca-pub-1382859681401211. Las páginas legales y 404 excluyen ese script. Se incluye la meta de cuenta y ads.txt con google.com, pub-1382859681401211, DIRECT, f08c47fec0942fa0. Las políticas de privacidad y cookies reflejan el cambio.

El código público y ads.txt están verificados; no se afirma aprobación de Google ni entrega de anuncios. Las pruebas interceptan ambos proveedores para evitar impresiones reales y comprueban la ausencia de Adsterra, las exclusiones legales, la carga de AdSense y la continuidad editorial si Google falla. Evidencia: editorial/verification/2026-10-30-five-guides.json.

## Operación y límites

Cloudflare Pages utiliza GitHub/main: `maletafeliz-web` sirve la revista y `maletafeliz-www` la redirección. El flujo operativo activa la compilación mediante la API de Cloudflare después de subir el commit. La activación automática por cada push no está acreditada. La subida directa de assets con Wrangler encontró una incompatibilidad con el token temporal del proxy; se utiliza la integración Git oficial.

El titular facilitó Luis Sebastian Cazorla Caruso, Argentina, luterapps@gmail.com. La revisión de textos legales es técnica y editorial, sin afirmar asesoría jurídica profesional. Search Console, GA4 y afiliados requieren su configuración real; el código de conexión de AdSense descrito arriba ya está instalado.

No hay una tarea recurrente de redacción de Codex Cloud configurada ni probada, ni una lectura de porcentaje de cuota. Se mantiene el flujo manual `PUBLICAR 5 ARTÍCULOS` y el objetivo documentado de las 07:00 America/New_York. No se usan APIs de IA de pago, bases de datos ni automatizaciones ficticias.

Las verificaciones de tandas anteriores permanecen en `editorial/verification/2026-10-28.json` y `2026-10-29.json`. El estado `published` de un artículo selecciona contenido para compilar; únicamente el registro de verificación pública acredita que está en el dominio.
