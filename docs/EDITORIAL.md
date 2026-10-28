# Operación editorial sin APIs de pago

## PUBLICAR 5 ARTÍCULOS

Esta orden inicia trabajo real de Codex, no un generador por plantilla. El flujo es el mismo para las primeras veinte guías y para futuras tandas:

1. Leer `editorial/plan.json`, `editorial/site.json`, informes y lotes existentes. Ejecutar `npm run editorial:report`. Comprobar fecha real. Antes de ampliar, terminar la selección inicial de veinte destinos.
2. Reservar hasta cinco temas: `npm run editorial:batch -- 5`. La reserva diaria usa la fecha de America/New_York y creación exclusiva del archivo; ejecuciones repetidas reutilizan el lote. El comando no redacta, no publica y no consume APIs. Reducir a 1–4 si el tiempo o la cuota lo aconsejan.
3. Investigar fuentes oficiales accesibles. Las URLs de `researchCandidates` son candidatas, NO fuentes consultadas. Si la red bloquea una web, registrar el bloqueo y no simular la consulta. Mantener la investigación compartida entre ambos idiomas.
4. Capturar fuentes con `npm run research:capture -- fuente-id https://sitio-oficial/ruta`. El programa conserva fecha, URL final, estado HTTP y huella del documento. `facts` empieza vacío: leer el documento e incorporar hechos concretos con respaldo y ubicación/extracto. La descarga no certifica exactitud. Una fuente existente no se sobrescribe sin revisar y preservar su historial.
5. Obtener fotografías reales pertinentes y leer la licencia específica del archivo. Registrar autor/crédito, URL original, licencia y URL de licencia, fecha de verificación, destinos compatibles, dimensiones, ALT es/en y SHA-256 de los bytes que se sirven. Guardar derivados optimizados en `public/images/`. Para Commons, una búsqueda no demuestra la licencia: visitar la página del archivo. Conservar atribución y condiciones de compartir igual si corresponden. No descargar imágenes mediante proxies alternativos para eludir restricciones de red.
6. Redactar `content/articles/<id>.es.json` y `<id>.en.json`. El esquema ejecutable está en `scripts/lib/content.mjs` y sus tipos en `src/lib/content.ts`. JSON estructurado se escapa al renderizar; no permite HTML arbitrario. Cada lugar tiene sección individual `kind: place`, al menos dos párrafos con desarrollo real y fuentes. Agregar introducción, resumen, itinerario, preguntas y conclusión útiles. El mínimo de 1.200 palabras es un control de profundidad, no una instrucción de relleno.
7. Traducir/localizar conservando hechos, no regenerar la investigación. Revisar naturalidad, nombres propios, consultas y slugs. Añadir enlaces relacionados a IDs que se publicarán en ambos idiomas.
8. Revisar exactitud, relevancia de fuentes, permisos/pertinencia de imágenes, idioma, originalidad, utilidad, datos sensibles al tiempo y enlaces. Las aprobaciones en `content/reviews/<id>.<locale>.json` deben identificar verazmente quién revisó, fecha ISO y SHA-256 obtenido con `hashArticle` del documento final. Los nueve campos `checks` están enumerados en el validador. No rellenar `true` sin realizar la comprobación. Alterar el documento invalida su revisión.
9. Cambiar `status` a `published` solo para el contenido aprobado y asignar fecha real; después calcular la huella del documento definitivo y registrar la revisión. Es un estado de selección para la compilación, no una afirmación de despliegue público. Las dos versiones deben aprobarse juntas. Registrar URL pública efectiva solamente después del despliegue verificado.
10. Ejecutar comprobaciones y revisar HTML, fotografías, selector al mismo artículo, metadatos, enlaces y móvil. Corregir solo lo necesario. Los fixtures de tests nunca cuentan como artículos.
11. Actualizar lote, cobertura e historial. Guardar cambios en GitHub; Cloudflare debe usar `npm run build:release`. Verificar las URLs finales y el sitemap después del despliegue.

## Archivos de aprobación y límites

`contentHash` es SHA-256 de `JSON.stringify(article)`; orden de campos preservado. Ejemplo de cálculo: importar `hashArticle` desde `scripts/lib/content.mjs` y pasar el JSON exacto. Las comprobaciones automáticas detectan ausencias, duplicados exactos, relaciones inválidas, fotografías modificadas, fuentes demasiado antiguas y revisión caducada. No demuestran por sí solas la veracidad, la licencia, la naturalidad lingüística o la ausencia de plagio semántico. Esas comprobaciones requieren revisión documentada.

Las fuentes se revisan al menos cada 180 días; datos temporales necesitan revisión más frecuente según su vigencia. El registro permite controlar cobertura de regiones y destinos naturales ampliando el plan. La Antártida requiere fuentes de expediciones y conservación; no ciudades ficticias.

## Edición y mantenimiento

Editar el JSON del artículo en GitHub o localmente, conservar el ID/slug cuando proceda y volver a investigar solo los datos afectados. Invalidar revisión al modificar contenido; actualizar ambas versiones cuando cambien hechos. Usar historial Git y PRs para revisión y recuperación. Si una URL cambia, añadir una redirección específica en `public/_redirects` y comprobar ausencia de bucles antes de publicar.

`editorial/activity.jsonl` conserva incidencias. Los informes muestran pendientes separados de publicados. La revisión inicial no contiene ninguna guía terminada ni fotografía aprobada.

## Programación solicitada: 07:00 America/New_York

No existe una herramienta de tareas recurrentes de Codex expuesta en esta sesión; tampoco una lectura del porcentaje de cuota. Esto no demuestra que la cuenta carezca de todas esas funciones, sino que aquí no pueden configurarse ni comprobarse. No hay cron oculto ni APIs de tokens. El flujo disponible es solicitar `PUBLICAR 5 ARTÍCULOS` en una nueva tarea con este repositorio y acceso a las fuentes.

Si posteriormente la cuenta ofrece automatizaciones, confirmar primero que son **en la nube**, que acceden a este repositorio e Internet y utilizan la suscripción sin cobro externo. Configurar la zona IANA `America/New_York`, que ajusta horario de verano; no fijar simplemente 12:00 UTC. Ejecutar una tanda real, verificar commits, informes y publicación con el cliente cerrado antes de afirmar autonomía. Si solo se ofrecen automatizaciones locales, necesitan el equipo encendido y no cumplen el objetivo solicitado.
