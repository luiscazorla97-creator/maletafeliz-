# Estado del proyecto

Actualizado: 28 de octubre de 2026. Especificación vigente: `requirements.md` (dos idiomas, archivos, sin APIs de IA de pago).

## Implementado localmente

- Astro estático, TypeScript, React para búsqueda, Tailwind/CSS, lockfile y CI.
- Marca original de maleta naranja sonriente, favicon, portada responsive, navegación, continentes, países, destinos y categorías.
- Interfaz es/en, rutas localizadas, cambio de idioma conservando destino, canonical y hreflang recíprocos.
- Buscador local por ciudad, país, categoría/continente con filtros, normalización de acentos y URL compartible.
- Plantilla de artículo con índice, secciones individuales, resumen, fotografías acreditadas, itinerario, FAQ, fuentes, relacionados y JSON-LD. Pendiente de validación end-to-end con guías reales.
- Sitemap de contenido publicado, exclusión de borradores, robots de preview, 404, noindex en búsqueda y páginas incompletas.
- Ocho páginas legales/editoriales por idioma, marcadas para revisión del titular; no inventan identidad o contacto.
- Registro geográfico de los veinte temas actuales. Estado real: 0 originales completos, 0 versiones publicadas, 0 fotografías aprobadas.
- Validación que bloquea lanzamiento incompleto, duplicados, traducciones ausentes, fuentes sin evidencia, imágenes sin derechos/atribución/huella, poca profundidad y revisión inválida tras cambios.
- Flujo manual `PUBLICAR 5 ARTÍCULOS`, reserva idempotente de lotes y reporte de cobertura. No es una automatización activa.

## Verificado

- TypeScript/Astro sin errores.
- 16 pruebas unitarias: controles editoriales, búsqueda y reserva idempotente de tandas.
- 10 pruebas Playwright en Chromium: móvil/escritorio, navegación, búsqueda, filtros, idioma, canonical/hreflang de destinos, enlaces de portada, 404 y sitemap vacío de preview.
- Compilación estática local correcta. Todas sus páginas son de diseño/directorio/legales, no se cuentan como artículos.
- Inspección visual de capturas móvil/escritorio. Las imágenes de diseño son ilustraciones, no fotografías aprobadas.
- Dependencias de producción sin vulnerabilidades reportadas por `npm audit --omit=dev` tras actualización de Astro/Zod.
- Compatibilidad de salida estática con Cloudflare documentada desde la guía oficial.

## Pendiente y bloqueos

1. **Red:** aplicar la lista de dominios ya guardada en el borrador del entorno. HTTP 403 observado para `commons.wikimedia.org` y `www.gotokyo.org`. No se investigaron las veinte guías ni se verificaron fotografías; no existen fuentes fingidas.
2. **Contenido:** investigar los veinte destinos, redactar 20 guías y localizar al inglés, conseguir fotografías, completar revisiones y verificar las cuarenta URLs. Publicar solo al cumplir el conjunto inicial.
3. **Titular:** nombre, correo público y residencia en Argentina incorporados según los datos del usuario. Textos legales preparados para revisión antes del lanzamiento.
4. **Cloudflare:** cuenta/proyecto Pages, conexión autorizada al repositorio y dominio personalizado. Sin credenciales disponibles para ejecutar el despliegue aquí. DNS, TLS, rendimiento real y las URLs públicas no están verificados.
5. **Automatización:** ninguna tarea de Codex Cloud recurrente configurada o probada. Las herramientas de esta sesión no exponen esa capacidad ni el saldo porcentual de cuota. Horario deseado conservado: 07:00 America/New_York. No se sustituyó por APIs de pago.
6. **Medición/monetización:** Search Console, GA4, anuncios y afiliados no activados. Primero lanzamiento completo, datos reales y revisión de privacidad/consentimiento.

## Criterio de cierre

Este proyecto NO está lanzado ni editorialmente terminado. Los tests y el build verifican la infraestructura implementada; no prueban la veracidad de artículos inexistentes, permisos de fotografías pendientes, publicación en el dominio ni ejecución diaria con el equipo apagado.
