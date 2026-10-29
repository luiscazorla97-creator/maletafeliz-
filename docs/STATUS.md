# Estado del proyecto

Actualizado: 28 de octubre de 2026. Especificación vigente: `requirements.md` (español e inglés, archivos, sin APIs de IA de pago).

## Publicado en maletafeliz.com

La web responde por HTTPS en https://maletafeliz.com/es/ y /en/. www.maletafeliz.com redirige con HTTP 301 al dominio principal, conservando rutas y parámetros. La verificación pública completa está registrada en `editorial/publication.json`.

- Veinte guías originales y cuarenta versiones completas, entre 1.343 y 2.512 palabras por idioma. Se desarrollan individualmente los lugares requeridos; cada guía incluye itinerario, preguntas, fuentes y enlaces relacionados.
- 164 documentos de fuentes citadas, con fecha, HTTP, huella y hechos conservados. Se rechazaron antiguos dominios turísticos con contenido ajeno; no se usan como fuentes editoriales.
- Cuarenta fotografías reales con autor, licencia específica, procedencia, dimensiones, ALT bilingüe y hash. Derivados WebP responsive y créditos públicos. Las imágenes de archivo se identifican cuando corresponde.
- Cuarenta revisiones editoriales identificadas como asistidas por Codex y vinculadas a los archivos finales. No se afirma revisión humana independiente.
- Astro estático, TypeScript, React para búsqueda, CSS/Tailwind, logo original, navegación móvil, destinos, continentes, países, categorías y páginas de información.
- Canonical y hreflang recíprocos, selector al mismo artículo traducido, JSON-LD, sitemap de contenido aprobado, robots de producción y respuesta 404. La búsqueda y las páginas vacías no se indexan.
- Datos del titular facilitados por el usuario: Luis Sebastian Cazorla Caruso, Argentina, luterapps@gmail.com. Textos legales revisados técnica y editorialmente por Codex; no se afirma asesoría legal profesional.
- Cloudflare Pages publica desde GitHub/main: `maletafeliz-web` sirve la revista y `maletafeliz-www` sirve la redirección estática. Los CNAME usan los subdominios reales de cada proyecto; los registros de correo se conservan.
- La integración Git de Cloudflare publica los cambios de main. GitHub Actions ejecuta las comprobaciones de calidad; el flujo manual permite solicitar un nuevo build de ambos proyectos sin subir archivos desde el entorno.

## Verificado localmente

- `npm run launch:check`: 20 originales, 40 versiones, sin errores ni pendientes.
- `npm run check`: sin errores, advertencias ni sugerencias.
- `npm test`: 32 pruebas superadas, incluidos controles editoriales, búsqueda, idempotencia, archivos de imagen y protección DNS con API simulada.
- `npm run build` y `npm run build:release`: compilaciones estáticas correctas; 164 páginas en cada compilación, de las cuales 40 son páginas editoriales.
- `npm run test:e2e`: 10 pruebas de navegación en móvil/escritorio superadas.
- `npm run test:release`: 84 pruebas superadas sobre el sitio de producción compilado, incluidas las cuarenta guías en ambos tamaños, traducciones, imágenes, metadatos, sitemap y búsqueda.
- Capturas de portada, guía de Tokio y portada de Cusco inspeccionadas. Sin desbordamiento horizontal en las cuarenta guías.
- Todas las fotografías y variantes se decodifican y coinciden con dimensiones y hashes registrados.
- `npm audit --omit=dev`: 0 vulnerabilidades reportadas.

Además de estas verificaciones locales, se completaron **48 comprobaciones HTTP públicas**: portadas es/en, cuarenta guías, sitemap, robots, una URL inexistente con 404 y tres redirecciones www con 301. Las guías son indexables y conservan sus canonical. Los builds de Cloudflare terminaron correctamente. Las revisiones factuales y de licencias están documentadas por separado.

## GitHub y operación

La entrega completa quedó guardada en main, con artículos, fuentes, licencias, fotos, revisiones, código y pruebas. Los commits de contenido inicial y redirección están preservados remotamente. Los detalles del despliegue público verificado, proyectos y commits se conservan en `editorial/publication.json`.

Las credenciales están disponibles y funcionan. El fallo inicial 403 se resolvió al actualizar el token. La subida directa con Wrangler encontró una incompatibilidad del proxy con el token temporal de assets; el despliegue definitivo utiliza la integración oficial de GitHub de Cloudflare.

## Pendiente fuera del lanzamiento

- **Redacción diaria:** ninguna tarea recurrente de Codex Cloud está configurada o probada. Esta sesión no expone un programador cloud ni el porcentaje de cuota. Se conserva el objetivo de las 07:00 America/New_York y el flujo manual `PUBLICAR 5 ARTÍCULOS`, sin APIs de IA de pago. La publicación automática de commits de GitHub no redacta artículos.
- **Medición y monetización:** Search Console, GA4, anuncios y afiliados no están activados. Requieren datos reales y su configuración correspondiente.

El estado `published` de los JSON selecciona contenido para compilar; `editorial/publication.json` registra la comprobación del dominio real.
