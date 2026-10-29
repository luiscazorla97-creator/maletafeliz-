# Estado del proyecto

Actualizado: 29 de octubre de 2026 (UTC). Especificación vigente: `requirements.md` (español e inglés, archivos, sin APIs de IA de pago).

## Publicado en maletafeliz.com

La web responde por HTTPS en https://maletafeliz.com/es/ y /en/. www.maletafeliz.com redirige con HTTP 301 al dominio principal, conservando rutas y parámetros. La verificación pública completa está registrada en `editorial/publication.json`.

- Treinta guías originales y sesenta versiones completas, entre 1.343 y 2.512 palabras por idioma. Se desarrollan individualmente los lugares requeridos; cada guía incluye itinerario, preguntas, fuentes y enlaces relacionados.
- 228 documentos de fuentes citadas, con fecha, HTTP, huella y hechos conservados. Se rechazaron antiguos dominios turísticos con contenido ajeno; no se usan como fuentes editoriales.
- Sesenta fotografías reales con autor, licencia específica, procedencia, dimensiones, ALT bilingüe y hash. Derivados WebP responsive y créditos públicos. Las imágenes de archivo se identifican cuando corresponde.
- Sesenta revisiones editoriales identificadas como asistidas por Codex y vinculadas a los archivos finales. No se afirma revisión humana independiente.
- Astro estático, TypeScript, React para búsqueda, CSS/Tailwind, logo original, navegación móvil, destinos, continentes, países, categorías y páginas de información.
- Canonical y hreflang recíprocos, selector al mismo artículo traducido, JSON-LD, sitemap de contenido aprobado, robots de producción y respuesta 404. La búsqueda y las páginas vacías no se indexan.
- Datos del titular facilitados por el usuario: Luis Sebastian Cazorla Caruso, Argentina, luterapps@gmail.com. Textos legales revisados técnica y editorialmente por Codex; no se afirma asesoría legal profesional.
- Cloudflare Pages publica desde GitHub/main: `maletafeliz-web` sirve la revista y `maletafeliz-www` sirve la redirección estática. Los CNAME usan los subdominios reales de cada proyecto; los registros de correo se conservan.
- La integración Git de Cloudflare compila main al activar el build desde Codex. GitHub Actions ejecuta las comprobaciones de calidad. El disparo automático de un build por cada push aún no quedó verificado; el flujo operativo incluye `npm run deploy`.

## Verificado localmente

- `npm run launch:check`: 30 originales, 60 versiones, sin errores ni pendientes.
- `npm run check`: sin errores, advertencias ni sugerencias.
- `npm test`: 32 pruebas superadas, incluidos controles editoriales, búsqueda, idempotencia, archivos de imagen y protección DNS con API simulada.
- `npm run build` y `npm run build:release`: compilaciones estáticas correctas; 216 páginas en cada compilación, de las cuales 60 son páginas editoriales.
- `npm run test:e2e`: 10 pruebas de navegación en móvil/escritorio superadas.
- `npm run test:release`: 124 pruebas superadas sobre el sitio de producción compilado, incluidas las sesenta guías en ambos tamaños, traducciones, imágenes, metadatos, sitemap y búsqueda.
- Capturas de portada, Tokio, Cusco, Seúl en móvil y Nairobi en escritorio inspeccionadas. Sin desbordamiento horizontal en las sesenta guías.
- Todas las fotografías y variantes se decodifican y coinciden con dimensiones y hashes registrados.
- `npm audit --omit=dev`: 0 vulnerabilidades reportadas.

Además de estas verificaciones locales, se completaron **68 comprobaciones HTTP públicas**: portadas es/en, sesenta guías, sitemap, robots, una URL inexistente con 404 y tres redirecciones www con 301. Las guías son indexables y conservan sus canonical. Los builds de Cloudflare terminaron correctamente. Además se verificaron las diez nuevas fotografías públicas por hash y las cinco guías en portadas y sitemap: 13 peticiones adicionales, 81 en total. Las revisiones factuales y de licencias están documentadas por separado.

La tanda solicitada con `PUBLICAR 5 ARTÍCULOS` añadió Vancouver, Lucerna, Seúl, Nairobi y Hobart, con diez versiones completas y diez fotografías. El lote editorial `2026-10-28` usa America/New_York; su publicación y verificación ocurrieron el 29 de octubre en UTC. La evidencia permanente está en `editorial/verification/2026-10-28.json`.

La tanda del 29 de octubre añadió Québec, Edimburgo, Singapur, Stone Town y Wellington: diez versiones de entre 1.411 y 1.502 palabras y diez fotos acreditadas. También se inspeccionaron capturas de Québec en móvil y Wellington en escritorio. Evidencia: `editorial/verification/2026-10-29.json`.

## GitHub y operación

GitHub Actions confirmó todas las comprobaciones del commit publicado `e93d3f0`. La entrega completa quedó guardada en main, con artículos, fuentes, licencias, fotos, revisiones, código y pruebas. Los commits de contenido inicial y redirección están preservados remotamente. Los detalles del despliegue público verificado, proyectos y commits se conservan en `editorial/publication.json`.

Las credenciales están disponibles y funcionan. El fallo inicial 403 se resolvió al actualizar el token. La subida directa con Wrangler encontró una incompatibilidad del proxy con el token temporal de assets; el despliegue definitivo utiliza la integración oficial de GitHub de Cloudflare.

## Pendiente fuera del lanzamiento

- **Redacción diaria:** ninguna tarea recurrente de Codex Cloud está configurada o probada. Esta sesión no expone un programador cloud ni el porcentaje de cuota. Se conserva el objetivo de las 07:00 America/New_York y el flujo manual `PUBLICAR 5 ARTÍCULOS`, sin APIs de IA de pago. La publicación automática de commits de GitHub no redacta artículos.
- **Medición y monetización:** Search Console, GA4, anuncios y afiliados no están activados. Requieren datos reales y su configuración correspondiente.

El estado `published` de los JSON selecciona contenido para compilar; `editorial/publication.json` registra la comprobación del dominio real.
