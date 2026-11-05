# Ambientación ilustrativa en futuros artículos festivos

Pedido del titular: 5 de noviembre de 2026. Implementación optativa, no un generador automático ni un servicio de pago. `editorial/festive-images.json` fija la fecha de implementación y excluye los 163 originales que ya existían. Omitir `festive_image_enhancement` equivale a `false`; no se reescriben JSON ni hashes históricos para añadir un valor predeterminado.

## Qué está operativo

- Portada ilustrativa opcional en el artículo y fotografías ilustrativas adicionales en secciones seleccionadas.
- Etiqueta visible en español: **Imagen real con ambientación ilustrativa generada mediante IA**. En inglés: **Real photograph with illustrative AI-generated festive enhancements**. Se muestran cambios, enlace al original, atribución y licencia.
- El original documental sigue en `coverImageId` y en cada `kind: place.imageId`. Una ilustración nunca sustituye la foto obligatoria del lugar. Las tarjetas, miniaturas, páginas de destinos, Open Graph y Article JSON-LD siguen utilizando la fotografía documental: no se distribuyen ilustraciones sin identificación fuera del artículo. Las ilustraciones añadidas al registro de créditos también llevan identificación y procedencia.
- Un mismo recurso y sus derivados se comparten entre español e inglés, con ALT localizado. No se genera dos veces.
- Registro con `npm run images:festive -- /ruta/paquete-revisado.json`: conserva original y edición, crea WebP responsive, comprueba hashes y revisión, añade únicamente una entrada nueva al manifiesto. No altera artículos, fotografías antiguas, URLs ni aprobaciones editoriales. Rechaza sobrescrituras y otra ejecución de este comando mediante bloqueo exclusivo. Si falla, retira solo los archivos que acaba de crear.
- El control editorial y ambas compilaciones rechazan ilustraciones sin permiso, procedencia o revisión, asignaciones distintas entre idiomas y usos en espacios documentales. Los controles existentes siguen siendo obligatorios.

## Capacidad de edición y límites

En esta sesión se confirmó la disponibilidad de `image_gen.imagegen` dentro de Codex. **No se ha ejecutado una transformación de una fotografía en esta implementación**: no se pidió crear un artículo ni seleccionar una nueva imagen. Los rectángulos sintéticos de las pruebas no son fotografías ni contenido del sitio.

La edición la realiza Codex con la herramienta disponible y archivos locales de referencia, después de inspeccionar la foto. El comando del repositorio **no llama a APIs de IA, no compra créditos, no guarda credenciales y no inicia un editor desatendido**. Comprobar la disponibilidad real en cada ejecución futura. Si falta, falla o requiere contratar algo, usar la foto documental original sin ambientar y registrar el motivo. No habilitar el indicador ni inventar datos de generación.

## Selección y permisos, antes de editar

1. Reservar un tema nuevo sin duplicar una guía. Debe tratar Navidad, Halloween, Año Nuevo, celebraciones de invierno, festivales de luces u otra festividad turística. Para guías normales, conservar fotografías documentales.
2. Priorizar fotos auténticas de los eventos cuando se informe de instalaciones, espectáculos o decoraciones concretas. Una ambientación no demuestra existencia, apertura, fechas, aforo ni condiciones actuales. No presentarla como una edición real del evento.
3. Leer la página individual y las condiciones del proveedor/licencia; confirmar uso comercial, modificaciones, atribución y compartir igual. El filtro de búsqueda no basta. Las licencias NC, ND y «todos los derechos reservados» son incompatibles con este flujo. Guardar consulta real con HTTP, fecha, URL final, hash y extractos; explicar condiciones adicionales y por qué la edición está permitida.
4. Registrar la foto documental como siempre. Conservar el SHA-256 original descargado (`originalSha256`), crédito, fuente, licencia, dimensiones y destinos. Guardar los bytes originales intactos. No descargar imágenes arbitrariamente de Google ni eludir restricciones o esperas.
5. Evaluar si la ambientación aporta algo y preserva el destino. No editar todas las fotos; las interiores deben ofrecer documentación real y variedad.

## Preparar ambas versiones nuevas

Crear los dos borradores, con el mismo ID de tema y configuración. Ejemplo parcial, **no un artículo publicable**:

```json
{
  "id": "tema-festivo-nuevo",
  "createdAt": "FECHA_ISO_REAL_POSTERIOR_A_LA_IMPLEMENTACION",
  "festive_image_enhancement": true,
  "festivity": "christmas",
  "coverImageId": "foto-documental-original",
  "festiveCoverImageId": "tema-festivo-nuevo-portada-ia"
}
```

`festivity` admite `christmas`, `halloween`, `new-year`, `winter-celebration`, `festival-of-lights` y `other-festivity`. La creación debe ser real, posterior al corte y no posterior a la publicación. Un ID histórico permanece excluido aunque se cambie su fecha. El registrador exige ambos borradores y rechaza artículos ya seleccionados como `published`.

Para una ilustración interior, seleccionar `illustrationImageId` en la sección de ambos idiomas, en la misma posición. En `kind: place` se conserva además `imageId` con la foto documental; la ilustración aparece como figura adicional. Los anclajes pueden estar localizados. Una portada ambientada debe derivar de `coverImageId`; la ilustración de un lugar, de su propio `imageId`.

## Editar y revisar con Codex

Inspeccionar la fotografía con el visor y pasarla como archivo de referencia al editor. Conservar arquitectura, monumentos, calles, paisaje, geografía, proporciones e identidad. Añadir detalles festivos realistas y discretos; no inventar estructuras permanentes, distorsionar monumentos ni incrustar títulos. No atribuir fuegos artificiales inventados a un espectáculo real.

Guardar el resultado en un archivo nuevo. Conservar el prompt efectivamente utilizado, herramienta y fecha real. Inspeccionar la salida a tamaño completo y en el recorte previsto. Si hay deformaciones, elementos imposibles, licencia dudosa o riesgo de confusión, descartar la edición y usar el original. No marcar comprobaciones por defecto.

El paquete contiene estos campos; los marcadores no son valores válidos:

```json
{
  "originalInput": "/ruta/al/original-descargado.jpg",
  "editedInput": "/ruta/a/la/salida-real-del-editor.png",
  "alt": {
    "es": "Destino reconocible con detalles festivos ilustrativos añadidos mediante IA",
    "en": "Recognizable destination with illustrative festive details added using AI"
  },
  "record": {
    "version": 1,
    "imageId": "tema-festivo-nuevo-portada-ia",
    "articleId": "tema-festivo-nuevo",
    "originalPhotoId": "foto-documental-original",
    "originalFile": "content/images/originals/tema-festivo-nuevo-original.jpg",
    "originalSha256": "SHA256_DEL_ORIGINAL_SIN_CAMBIOS",
    "editedFile": "content/images/edits/tema-festivo-nuevo-edicion.png",
    "editedSha256": "SHA256_DE_LA_SALIDA_REAL_DEL_EDITOR",
    "modifications": {
      "es": "Descripción precisa de los elementos añadidos y límites de la ilustración.",
      "en": "Precise description of additions and limits of this illustration."
    },
    "generation": {
      "tool": "image_gen.imagegen",
      "editedAt": "FECHA_ISO_REAL",
      "prompt": "PROMPT_REAL_UTILIZADO_CON_LA_FOTOGRAFIA_DE_REFERENCIA"
    },
    "rights": {
      "commercialUse": true,
      "derivativesAllowed": true,
      "evidenceFile": "content/research/permiso-foto-concreta.json",
      "evidenceSha256": "SHA256_DEL_ARCHIVO_DE_EVIDENCIA",
      "checkedAt": "FECHA_ISO_REAL",
      "explanation": "Condiciones específicas leídas, atribución y licencia de la adaptación."
    },
    "review": {
      "reviewer": "REVISOR_REAL",
      "reviewedAt": "FECHA_ISO_REAL_POSTERIOR_A_LA_EDICION",
      "editedSha256": "SHA256_DE_LA_SALIDA_REAL_REVISADA",
      "checks": {
        "recognizablePlace": false,
        "architecturePreserved": false,
        "geographyPreserved": false,
        "proportionsPreserved": false,
        "noInventedPermanentStructures": false,
        "noMisleadingEventClaim": false,
        "noUnnecessaryText": false,
        "licenseAndAttribution": false,
        "disclosureAndAlt": false,
        "visualQuality": false
      },
      "notes": "Observaciones concretas de la inspección visual y la licencia."
    }
  }
}
```

Las comprobaciones comienzan pendientes. El registrador las exige verdaderas **solo después de comprobarlas realmente**. Fechas, hashes, fuentes, notas y prompt deben corresponder al trabajo efectivo. La procedencia se guarda en `content/images/enhancements/<imageId>.json`. Originales y salidas sin compresión adicional se conservan en `content/images/originals/` y `content/images/edits/`. No guardar credenciales ni datos personales innecesarios.

## Registro, aprobación y publicación

```sh
npm run images:festive -- /ruta/paquete-revisado.json
npm run check
npm test
npm run build
npm run test:e2e
npm run build:release
```

El registrador usa creación exclusiva y comprobación de concurrencia del manifiesto. Todos los escritores deben respetar `content/images/.festive-images.lock`; si existe, revisar quién trabaja y esperar, nunca borrarlo automáticamente para forzar una ejecución. No ejecutar el regenerador global `images:responsive` para esta tarea: recorre fotos históricas. El comando nuevo genera solo los derivados de la imagen seleccionada, conserva dimensiones explícitas y no amplía fotos pequeñas.

El registro no publica ni aprueba artículos. Completar investigación, traducción, fuentes, fotografías documentales y revisión por hash final según `EDITORIAL.md`. Revisar en escritorio y móvil: imagen y recorte, etiqueta legible, original, licencia, ALT, dimensiones, lazy loading interior y prioridad de portada. Revisar la página de créditos. Si falla una edición, retirar su selección y usar el original antes de aprobar; no dejar referencias rotas.

Después del flujo GitHub y Cloudflare existente, comprobar ambas versiones por HTTPS. Este cambio no crea artículos ni cambia la frecuencia diaria o la configuración externa del programador.
