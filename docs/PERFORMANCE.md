# Rendimiento móvil de MaletaFeliz

Referencia: `https://maletafeliz.com/en/`, 4 de noviembre de 2026, America/New_York.

El informe aportado por el titular registraba 67/100, FCP 4,1 s, LCP 6,3 s, TBT 10 ms y CLS 0. Otra captura mostraba 63/100 al iniciar desde la raíz, que detecta idioma mediante JavaScript y lleva a `/en/`. Esos resultados aportados no constituyen una medición nuestra antes/después con condiciones idénticas.

## Método y límites

Lighthouse 13.6.0 y Chromium 154, configuración móvil predeterminada, tres corridas frías consecutivas por versión. Se compara la mediana sobre la compilación de producción servida localmente. Se conservan las etiquetas publicitarias: recursos externos se solicitan mediante el proxy de Node con validación TLS. No se cambió la confianza de certificados de Chromium ni se desactivó TLS.

La API pública de PageSpeed respondió HTTP 429 por cuota diaria agotada; no se reintentó ni se usaron claves alternativas. El laboratorio local no reproduce la latencia/caché de Cloudflare ni todas las condiciones de Google. Las solicitudes publicitarias pueden variar. Sus puntuaciones se identifican como laboratorio, sin afirmar un resultado de 90 en Google. Las subfases del LCP proceden de la traza sin ralentizar; el LCP numérico es la estimación móvil de Lighthouse.

## Diagnóstico confirmado

El LCP es `img.earth`, el globo de la portada: caja CSS 412×365 en el dispositivo emulado, archivo WebP 1536×1024 de 301.612 bytes, sin `fetchpriority=high` ni versiones responsive. La mediana local inicial fue 90/100, LCP 3,254 s, FCP 0,758 s, TBT 156,5 ms y CLS 0.

En la primera traza de cada versión, sin simulación de red lenta, las subfases antes/después fueron: TTFB 17,6/20,8 ms; espera para iniciar el recurso 38,5/40,4 ms; descarga 52,9/39,0 ms; espera de renderizado 130,6/133,7 ms. No se observa una reducción de la espera de renderizado en esa muestra. El beneficio principal es la menor transferencia del globo bajo la simulación móvil; estas subfases locales no deben sumarse para explicar el LCP simulado de 3,254/2,113 s.

La auditoría de accesibilidad 96/100 identificó dos contrastes en el bloque editorial: párrafo #6e7468 sobre #edf3ed (4,27:1) y enlace #087e83 (4,31:1). Las prácticas recomendadas 96/100 fallaron por respuestas 403 de los scripts de Adsterra en este entorno. Se mantienen las unidades, sus códigos y dimensiones; no se suprimen peticiones ni errores para mejorar el resultado.

El CSS bloqueante transfería aproximadamente 11,4 KB, con 152 ms estimados; las fuentes ya son de sistema. El consentimiento de Analytics condiciona correctamente la carga. Los anuncios de Adsterra requieren el orden de parser/document.write y no se convierten indiscriminadamente en async/defer.

## Cambios

- Versiones AVIF 768/1023/1536 del mismo globo, alternativas WebP 768/1023 y fallback al original, que conserva sus bytes y URL. Los tamaños incluyen el recorte existente de object-fit para evitar perder densidad de imagen. El AVIF 1023 pesa 115.586 bytes: 61,7% menos que el original. La comparación de esa conversión con la referencia redimensionada obtuvo PSNR 39,25 dB y se revisó visualmente.
- Preload responsive y prioridad alta solo en portadas localizadas, con la misma selección usada por picture. El globo visible es eager. No se precargan ambas codificaciones ni se añaden librerías al cliente.
- Tamaños de entrega ajustados a rejillas, columnas publicitarias y espacio de artículos. Se reutilizan las fotografías y derivados existentes, conservando sus archivos, registros, créditos, ALT y URLs.
- Decodificación asíncrona en imágenes diferidas y lazy para el icono decorativo inferior. Se conservan medidas explícitas y geometría.
- Los dos textos del bloque editorial pasan a #666d60 y #08797e. No cambian tipografías, posiciones ni el diseño 3D.
- La raíz conserva detección automática, preferencia guardada, consulta y fragmento. Su portada sin JavaScript queda en noscript para evitar que la navegación automática descargue imágenes de una portada que va a abandonar. El aviso de redirección de PageSpeed sigue siendo esperable al medir `/`; la comparación principal usa `/en/`.

No se modifican artículos, revisiones, imágenes editoriales, logo, categorías, canonical, hreflang, robots, sitemap, anuncios, consentimiento ni frecuencia de publicación. Los activos nuevos usan URLs de contenido generado por Astro y su política de caché existente.

## Resultado y publicación

Medianas de tres corridas frías con el mismo método local:

| Métrica | Antes | Después |
| --- | ---: | ---: |
| Rendimiento | 90 | 98 |
| Accesibilidad | 96 | 100 |
| Prácticas recomendadas | 96 | 96 |
| SEO | 100 | 100 |
| FCP | 0,758 s | 0,761 s |
| LCP | 3,254 s | 2,113 s |
| TBT | 156,5 ms | 138,2 ms |
| CLS | 0 | 0 |
| Speed Index | 1,777 s | 1,615 s |

Las puntuaciones individuales fueron 90, 84 y 91 antes, y 98, 98 y 89 después; se conservan todas las corridas. El TBT posterior osciló entre 120 y 398 ms. La reducción de la mediana del LCP es del 35,1 % en este laboratorio. La descarga del globo usa AVIF 1023 con prioridad alta y una sola petición en móvil. Los nueve anchos comprobados, de 320 a 1920 px, conservan densidad suficiente sin desbordamiento. Las cajas de encabezado, logo, hero, globo, tarjetas y anuncios coinciden antes/después en 390, 412 y 1440 px. Se revisaron capturas móviles y de escritorio.

Pasaron `npm run check`, 33 pruebas unitarias, 28 de navegación, ambas compilaciones de 718 páginas —incluida obligatoriamente `npm run build:release`—, 50 pruebas seleccionadas de producción, 44 comprobaciones adicionales de artículos y 13 comprobaciones de prioridad, tamaños e idioma. Los 721 hashes de contenido/metadatos/archivos SEO coinciden. Se preservan byte a byte 4.300 archivos protegidos, incluidos artículos, fechas, fotografías, anuncios, consentimiento y configuración editorial.

Los cuatro puntos de prácticas recomendadas restantes proceden de respuestas HTTP 403 de Adsterra en el entorno de medición. No se ocultan ni se retiran los anuncios. La API pública de Google sigue sin medición disponible por HTTP 429; hace falta repetir PageSpeed en `/en/` después de publicar para conocer su puntuación real. Estos números no acreditan Core Web Vitals de usuarios reales ni garantizan posicionamiento.

Datos: [antes](performance/2026-11-04-before.json), [después](performance/2026-11-04-after.json), [derivados](performance/2026-11-04-hero-variants.json). La evidencia pública del despliegue se registra, una vez comprobado, en `editorial/verification/2026-11-04-mobile-performance-publication.json`.


Publicación comprobada: los proyectos `maletafeliz-web` y `maletafeliz-www` completaron el commit `690d24f03b5c6fc77f97c6efcf59d5f8c569c8e2`. Las 284 páginas de portadas/artículos coinciden semánticamente con la compilación final. Los cinco recursos nuevos entregan los bytes esperados y `Cache-Control: public, max-age=31536000, immutable`. Pasaron además 290 comprobaciones de catálogo/redirecciones, 48 de guías/idiomas/fotos/descubrimiento y 13 de tamaños/prioridad/idioma. AdSense, su metaetiqueta y ads.txt están comprobados públicamente sin duplicaciones; no se acredita aprobación de la cuenta por Google.

Archivos de implementación: `src/components/{Article,DestinationCard,Home,TravelGlobe}.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/styles/global.css`, `src/lib/{hero-image,image-sizes}.ts` y cinco derivados en `src/assets/atlas/`. Documentación y pruebas conservadas en este documento, `docs/performance/` y las verificaciones `2026-11-04-mobile-performance-*.json`. Los registros de despliegue y actividad se actualizan por separado, sin añadir temas al lote.


## Primera revisión del 9 de noviembre de 2026

Esta sección registra la primera revisión, commit `574c3a891f35a1d262bf72fefb4fcf00ab4e58ec`. La segunda revisión de abajo añade la protección de scripts y tiene sus propias mediciones finales.

Página medida: `https://maletafeliz.com/en/`. El informe real aportado por el titular (ID `01qu6wdoid`, 16:58 de Nueva York) se descargó y leyó completo: rendimiento 46, FCP 4,047 s, LCP 6,017 s, CLS 0,447 y TBT 1 ms. La captura identifica `img.earth`; su AVIF ya tenía carga anticipada, prioridad alta y carga inmediata. En la traza observada aparecen 106 ms de espera, 226 ms de descarga y 2.001 ms de demora de renderizado. Esas subfases sin simulación no se suman para explicar el LCP móvil simulado. El único desplazamiento señalado afecta a `body`; no se reprodujo en las mediciones instrumentadas, por lo que no se atribuye a una causa de aplicación confirmada ni se afirma haber corregido ese valor de Google.

Cambios finales: 73 derivados AVIF para quince fotografías existentes del inicio y un AVIF adicional de 960×640 del mismo globo ilustrado. Se conservan los WebP, todos los originales y variantes anteriores, los créditos, las licencias, los ALT, las medidas, las rutas y el diseño 3D. El nuevo globo pesa 92.856 bytes frente a 115.586: 19,7 % menos y resolución suficiente para los 959 píxeles requeridos por el móvil emulado. La carga anticipada usa el mismo conjunto de tamaños que la imagen; se comprobó una única petición del globo con prioridad alta. Los demás navegadores mantienen su alternativa WebP.

La hoja CSS compartida permanece en caché. Se probó incrustarla completa en las portadas y se descartó porque aumentaba el HTML sin una mejora global consistente. Los informes experimentales permanecen separados. El nuevo contenedor de imágenes requiere ocultar su etiqueta auxiliar `source`: de otro modo Chromium la cuenta como un elemento vacío entre las miniaturas y sus títulos. La regla afecta solo a esa etiqueta auxiliar, mantiene la selección AVIF y restaura las cajas originales. No se modifican anuncios, orden de scripts, consentimiento de Analytics ni frecuencia de publicación.

Comparación controlada: Lighthouse 13.6.0 y Chrome 157.0.8103.38, configuración móvil de 412×823 y densidad 1,75, tres perfiles nuevos consecutivos por versión. Los archivos locales se descargan de forma nativa desde el mismo servidor HTTP; las solicitudes externas reciben sus respuestas reales mediante Node con proxy y confianza TLS heredados. No hay anuncios simulados ni bloqueados para estas métricas. No se ejecutan compilaciones ni codificaciones al mismo tiempo. Este laboratorio no reproduce la compresión, ubicación ni caché de Google o Cloudflare.

| Métrica, mediana local | Antes | Después |
| --- | ---: | ---: |
| Rendimiento | 95 | 97 |
| Accesibilidad | 100 | 100 |
| Prácticas recomendadas | 96 | 96 |
| SEO | 100 | 100 |
| FCP | 1.207 s | 1.205 s |
| LCP | 2.633 s | 2.406 s |
| TBT | 140 ms | 118 ms |
| CLS | 0 | 0 |
| Speed Index | 2.284 s | 2.117 s |

Las puntuaciones finales fueron 95, 97 y 97; los tres LCP finales quedaron por debajo de 2,5 s. La reducción de la mediana del LCP es del 8,6 %. Las imágenes propias observadas en cada corrida pasaron de 1,055,348 a 738,379 bytes, un 30.0 % menos; esta cifra incluye las imágenes activadas por la corrida y no es el peso de todo el catálogo ni un presupuesto exclusivo de la primera pantalla. El TBT de terceros varía: no se atribuye una reducción causal del JavaScript del sitio, que permanece igual.

La comparación estática cubre las 896 páginas, conserva los 188 originales y sus 376 versiones, 831 registros fotográficos y las 890 URLs del sitemap. Canonical, hreflang, títulos, metadescripciones, JSON-LD, fechas, textos, anuncios y atributos originales de imágenes se conservan; la excepción documentada es el nuevo candidato del globo y su indicación de carga. Se revisaron geometría y capturas a 390, 412 y 1440 px en ambos idiomas. Pasaron tipos, 80 pruebas unitarias y 64 pruebas locales de producción seleccionadas, incluidas publicidad, consentimiento, formatos y reserva de espacio. La compilación final obligatoria `npm run build:release` generó 896 páginas. El build normal y las 28 pruebas de navegación previas corresponden a la implementación preliminar; la comprobación del código final en GitHub deberá completar ambas compilaciones y toda la batería antes de registrar éxito público. Las pruebas funcionales aíslan proveedores; sus resultados no se usan como métricas de rendimiento real.

Los cuatro puntos de prácticas recomendadas del informe de Google corresponden a tres respuestas HTTP 402 del proveedor publicitario `bauval.org`; las peticiones reales desde este laboratorio devolvieron 403. Se conservan los anuncios y no se ocultan esos fallos. La API de PageSpeed devolvió HTTP 429 por cuota; no se reintentó ni se cambiaron claves o cuentas para evitarlo. Por eso no hay una nueva puntuación de Google comprobada y estos resultados no deben presentarse como una subida de 46 a 97 en PageSpeed ni como datos de usuarios reales.

El titular pidió instalar el complemento APO que compró. La [documentación oficial de Cloudflare](https://developers.cloudflare.com/automatic-platform-optimization/) exige el plugin de WordPress. Este proyecto utiliza Astro y Cloudflare Pages, no WordPress: el complemento no se instaló, no se cambió el alojamiento y no se modificó la suscripción ni la facturación.

Datos de la primera revisión: [antes](performance/2026-11-09-before.json), [después](https://github.com/luiscazorla97-creator/maletafeliz-/blob/574c3a891f35a1d262bf72fefb4fcf00ab4e58ec/docs/performance/2026-11-09-after.json), [fotos](performance/2026-11-09-photo-variants.json), [globo](performance/2026-11-09-hero-variant.json) y [validación previa al despliegue](performance/2026-11-09-validation.json). La publicación pública se acredita por separado después de los despliegues y las comprobaciones HTTPS.


## Segunda revisión: conservar la ejecución de scripts con Rocket Loader

La primera revisión completó ambos proyectos Pages y 916 pruebas CI. Las 384 rutas HTTPS, 74 AVIF y CSS eran correctos, pero la comprobación estricta detectó Rocket Loader activado en la respuesta pública: reescribía once scripts e inyectaba su cargador. Esa transformación no estaba en el HTML público inicial ni en las 34 solicitudes del informe original de Google. No se atribuye a ella el CLS original de 0,447. La evidencia parcial se conservó expresamente como no aprobada.

La consulta de la zona por la API de Cloudflare devolvió HTTP403; no se cambió ningún ajuste de zona, seguridad, caché, APO, DNS ni facturación. La alternativa oficial es añadir `data-cfasync="false"` antes de `src`, también en dependencias. Un hook de compilación lo inserta después de que Astro genere sus módulos. `parse5` 8.1.1 se usa exclusivamente en el proceso de build, nunca en el navegador. No se añaden atributos directamente a scripts Astro porque eso podría desactivar su compilación. Se conservan cuerpos, orden, IDs, URLs, dimensiones y anuncios; JSON-LD, mapas de importación y scripts inertes quedan idénticos. Los atributos existentes con posiciones o valores incompatibles hacen fallar el build.

El revisor independiente reconstruyó el HTML anterior retirando solo las inserciones verificadas y comprobó las 896 páginas, los archivos JavaScript y todos los contenidos protegidos. Pasaron tipos, 87 pruebas unitarias y 64 pruebas locales de producción; la compilación obligatoria volvió a generar 896 páginas. El build normal y la navegación local siguen siendo preliminares: el código final deberá completar ambos builds y las 28 pruebas de navegación más 808 de producción en CI antes del cierre público.

Tres nuevas corridas finales con el mismo Chrome, Lighthouse y configuración: rendimiento mediano 96; LCP 2.404 s; FCP 1.205 s; TBT 126.5 ms; CLS 0. La referencia controlada sigue en 95 puntos y LCP 2.633 s. Son mediciones locales, no una nueva puntuación de Google. La API pública respondió429 y no se eludió su cuota.

Datos de esta revisión: [antes](performance/2026-11-09-before.json), [después](performance/2026-11-09-after.json), [exclusión de scripts](performance/2026-11-09-rocket-loader-exclusion.json) y [validación privada](performance/2026-11-09-validation.json). Los informes anteriores, incluidos los 97 puntos y 2,406 s de la primera revisión, se conservan en el commit `574c3a8` y sus artefactos separados. La publicación y compatibilidad pública de esta revisión siguen pendientes en este registro previo al despliegue.
