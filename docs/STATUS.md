# Estado del proyecto

Actualizado: 28 de octubre de 2026. Especificación vigente: `requirements.md` (español e inglés, archivos, sin APIs de IA de pago).

## Preparado para desplegar

- Veinte guías originales y cuarenta versiones completas, entre 1.343 y 2.512 palabras por idioma. Se desarrollan individualmente los lugares requeridos; cada guía incluye itinerario, preguntas, fuentes y enlaces relacionados.
- 164 documentos de fuentes citadas, con fecha, HTTP, huella y hechos conservados. Se rechazaron antiguos dominios turísticos con contenido ajeno; no se usan como fuentes editoriales.
- Cuarenta fotografías reales con autor, licencia específica, procedencia, dimensiones, ALT bilingüe y hash. Derivados WebP responsive y créditos públicos. Las imágenes de archivo se identifican cuando corresponde.
- Cuarenta revisiones editoriales identificadas como asistidas por Codex y vinculadas a los archivos finales. No se afirma revisión humana independiente.
- Astro estático, TypeScript, React para búsqueda, CSS/Tailwind, logo original, navegación móvil, destinos, continentes, países, categorías y páginas de información.
- Canonical y hreflang recíprocos, selector al mismo artículo traducido, JSON-LD, sitemap de contenido aprobado, robots de producción y respuesta 404. La búsqueda y las páginas vacías no se indexan.
- Datos del titular facilitados por el usuario: Luis Sebastian Cazorla Caruso, Argentina, luterapps@gmail.com. Textos legales revisados técnica y editorialmente por Codex; no se afirma asesoría legal profesional.
- Despliegue directo preparado para Cloudflare Pages. Usa el subdominio real asignado por Cloudflare, rama main y dominio maletafeliz.com; conserva MX y se detiene ante registros de otro sitio.
- Workflow de despliegue opcional, desactivado hasta configurar secretos y habilitarlo. Solo admite main del mismo repositorio, después de verificaciones o por ejecución manual autorizada.

## Verificado localmente

- `npm run launch:check`: 20 originales, 40 versiones, sin errores ni pendientes.
- `npm run check`: sin errores, advertencias ni sugerencias.
- `npm test`: 24 pruebas superadas, incluidos controles editoriales, búsqueda, idempotencia, archivos de imagen y protección DNS con API simulada.
- `npm run build` y `npm run build:release`: compilaciones estáticas correctas; 164 páginas en cada compilación, de las cuales 40 son páginas editoriales.
- `npm run test:e2e`: 10 pruebas de navegación en móvil/escritorio superadas.
- `npm run test:release`: 84 pruebas superadas sobre el sitio de producción compilado, incluidas las cuarenta guías en ambos tamaños, traducciones, imágenes, metadatos, sitemap y búsqueda.
- Capturas de portada, guía de Tokio y portada de Cusco inspeccionadas. Sin desbordamiento horizontal en las cuarenta guías.
- Todas las fotografías y variantes se decodifican y coinciden con dimensiones y hashes registrados.
- `npm audit --omit=dev`: 0 vulnerabilidades reportadas.

Estas verificaciones prueban la compilación local. No acreditan disponibilidad en el dominio público ni sustituyen la revisión factual y de licencias documentada.

## Publicación y tareas externas pendientes

1. **Cloudflare:** CLOUDFLARE_API_TOKEN y CLOUDFLARE_ACCOUNT_ID están vinculados y disponibles. El token de cuenta está activo; la lectura de la zona maletafeliz.com responde HTTP 200 y su cuenta coincide. El intento de despliegue se detuvo en la primera llamada a Pages: HTTP 403, código 10000, tanto al consultar el proyecto como al listar proyectos. Revisar Account → Cloudflare Pages → Edit para esa cuenta. No se crearon proyectos ni cambiaron registros DNS.
2. **Dominio:** los NS son de Cloudflare, pero la comprobación DNS no encontró A, AAAA ni CNAME en el dominio raíz. La verificación HTTPS pública no tuvo éxito. Después de desplegar, ejecutar `npm run verify:live` y confirmar DNS, certificado, guías, sitemap, robots y 404 reales.
3. **GitHub:** entrega completa guardada en main, commit `ce45f1e`, con push confirmado. Incluye artículos, fuentes, licencias, fotos, revisiones, código y pruebas. Las pruebas descritas arriba son locales; no se afirma resultado de CI remoto sin consultarlo.
4. **Publicación diaria:** ninguna tarea recurrente de Codex Cloud está configurada o probada. No hay herramienta expuesta para programarla ni consultar porcentaje de cuota. Se conserva el objetivo de las 07:00 America/New_York y el flujo manual `PUBLICAR 5 ARTÍCULOS`, sin APIs de pago.
5. **Medición y monetización:** Search Console, GA4, anuncios y afiliados no están activados. Requieren datos reales y la configuración correspondiente después del lanzamiento.

El estado `published` de los JSON significa selección para compilación. **MaletaFeliz todavía no tiene un lanzamiento público verificado.**
