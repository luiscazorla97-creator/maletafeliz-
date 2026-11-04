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
