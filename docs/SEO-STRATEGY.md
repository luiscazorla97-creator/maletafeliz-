# Estrategia editorial y SEO: primera etapa

Vigente desde el 5 de noviembre de 2026 por instrucción explícita del titular. Complementa los requisitos originales y reemplaza la rotación mundial como prioridad inicial. El sitio sigue siendo internacional: no borrar, desindexar ni cambiar URLs de artículos sobre otros países.

## Prioridades y meta progresiva

Italia: 30 originales; Japón: 25; México: 25; Estados Unidos: 20. Cada original tiene versiones completas ES/EN. El inventario previo suma respectivamente 6, 7, 6 y 11 originales, incluidas intenciones estacionales diferenciadas: 30 originales, 60 versiones. Faltan 70 originales para la meta inicial conjunta. La auditoría y el último informe de publicación registran los resultados reales; no confundir candidatos con artículos publicados.

`editorial/seo-strategy.json` conserva la política y 70 necesidades candidatas distintas, incluidas las cinco de esta tanda. No ordena generar cien artículos ni permite rellenar una cuota. Cada candidato debe superar revisión de utilidad, solapamiento, fuentes e imágenes antes de pasar al plan y a una reserva. Si una intención resulta redundante o carece de fuentes suficientes, reemplazarla con justificación, sin producir contenido de relleno.

Los primeros grupos son Roma, Venecia, Florencia, Milán y Costa Amalfitana; Tokio, Kioto, Osaka, Nara y Monte Fuji; Cancún, Riviera Maya, Ciudad de México, Oaxaca y Los Cabos; Miami, Nueva York, Orlando, Las Vegas y Los Ángeles. Mantener también el contenido relevante ya publicado de otros destinos de estos países.

## Arquitectura existente y grupos temáticos

El sitio usa generación estática de Astro, JSON bilingüe, plan editorial, evidencia de investigación, manifiesto fotográfico y revisiones vinculadas al hash del artículo final. No requiere una reconstrucción, una base de datos ni servicios de pago.

Las páginas pilar utilizan las rutas ya existentes `/es/explorar/country-it/`, `country-jp`, `country-mx`, `country-us` y sus equivalentes `/en/explore/`. No crear un segundo índice que compita con esas URLs. `src/data/country-guides.ts` define sus textos localizados y agrupaciones; `CountryGuide.astro` muestra únicamente grupos con artículos publicados. Todos los artículos correspondientes tienen enlaces directos, con distinción de contenidos estacionales en los títulos. Los itinerarios enlazan a secciones reales de guías existentes. No enlazar al backlog ni crear páginas vacías para futuras categorías.

Los artículos de los cuatro países enlazan a su guía pilar desde la ruta de navegación y un enlace contextual. Se preservan sus enlaces relacionados. Las páginas pilar usan metadatos propios, CollectionPage/ItemList y BreadcrumbList; los artículos conservan Article y sus fechas, con breadcrumb de país cuando corresponde. El sitemap conserva las URLs y añade alternates de idioma para los países.

Para un artículo especializado nuevo, el tema tiene ID, intención, títulos y slugs propios y puede declarar `destinationId` con el ID de una ciudad ya existente. Su `placeCount` pertenece al tema. El destino compartido no genera otra ficha de ciudad; su página reúne todas sus guías. Las fotos se verifican contra el destino real. Los temas antiguos mantienen sus IDs y URLs: no migrarlos por conveniencia.

## Selección y publicación

La programación se conserva: dos originales nuevos al día a las 12:00 de Miami, America/New_York. Una tanda manual mayor solo se realiza por pedido explícito. Contar todos los temas nuevos únicos verificados en la fecha local, incluidos los manuales, y evitar repeticiones de una ejecución diaria. Conservar leases y archivos de reservas anteriores.

Antes de reservar, inventariar el país y la intención, revisar el backlog y añadir los temas elegidos al plan. `npm run editorial:batch -- 2` solo reserva y puede devolver un lote anterior: inspeccionarlo. La política de selección del repositorio prioriza los cuatro países, alterna según las publicaciones anteriores y favorece el progreso de los grupos. No modifica una tarea externa ni genera artículos automáticamente.

Variar listas útiles de cinco, siete, diez u otra cantidad de lugares, artículos especializados e itinerarios de tres, cinco, siete o diez días cuando su alcance los justifique. No usar siempre «en dos días». El número de una lista debe coincidir con los lugares realmente investigados y desarrollados, cada uno con fotografía propia pertinente.

## Calidad, alcance y SEO

No existe una cantidad fija de palabras que garantice el posicionamiento en Google. Elegir la profundidad según la consulta; omitir repeticiones y relleno. Un tema complejo puede necesitar 1.500–3.000 palabras o más y una pregunta concreta puede resolverse con menos. Conservar las comprobaciones de estructura, fuentes actuales, licencias, originalidad, traducciones completas y revisión editorial; la longitud por sí sola no acredita calidad.

Cada publicación debe tener intención distinta, keyword y términos relacionados naturales, títulos y metadescripciones únicos por idioma, un H1, encabezados organizados, slugs localizados, canonical, hreflang recíprocos, JSON-LD pertinente, índice si resulta útil, imágenes optimizadas con ALT y dimensiones, breadcrumbs y enlaces internos existentes y relevantes. No refrescar fechas de artículos anteriores sin cambios sustantivos.

Investigar fuentes oficiales y conservar HTTP, URL final, fecha, hashes, hechos y extractos leídos. Registrar fallos, no inventar precios, horarios, direcciones, visados, experiencia personal, volumen de búsquedas ni rankings. Identificar incertidumbre u omitir el dato. Comparar entradas y condiciones reales; no reutilizar precios antiguos por comodidad.

Solo fotografías documentales pertinentes con derechos comprobados, crédito y derivados optimizados. Una licencia de una foto no convierte una imagen en evidencia de un evento o condición actual. No usar imágenes generadas como documentación real.

## Automatización externa

La lectura del programador confirmó la tarea «Publicar 2 artículos de viajes» habilitada y con su horario de mediodía de Miami. Su prompt guardado todavía pide rotación mundial. No se modificaron la tarea, sus credenciales ni su horario. `docs/DAILY-PUBLISHING-PROMPT.md` contiene el texto para sustituir únicamente el prompt en la misma tarea externa. No crear otra automatización. El repositorio actualiza sus instrucciones y selector editorial, pero no administra el programador externo.

No inferir autonomía desatendida de `last_run_time`: la consulta no expone un registro de corrida ni un resultado atribuible a este chat. Verificar una ejecución real y ambos despliegues antes de afirmar publicación. Las URLs deben probarse por HTTPS con fotos, búsqueda, destinos, idiomas, metadatos, sitemap y redirección www. Un push y el estado local `published` no acreditan éxito público.

## Preservación y comprobación

Conservar artículos, fechas, fotos, URLs, categorías, buscador, menús, selector de idiomas, identidad y diseño 3D. Mantener íntegros Adsterra y AdSense, posiciones, códigos y dimensiones; Analytics y su consentimiento; popunder desactivado; ambos proyectos existentes de Cloudflare y DNS.

Ejecutar los controles del repositorio y `npm run build:release`, más pruebas de grupos temáticos, enlaces, metadatos, idiomas y móvil. Revisar todo el catálogo por desapariciones y conservar evidencia del commit servido por ambos proyectos. No prometer indexación rápida ni visitas. Search Console es la fuente para evaluar resultados cuando exista acceso real a sus datos; no contratar APIs ni servicios nuevos para sustituirlo.

## Resultado verificado de la primera implementación

El 5 de noviembre de 2026, la tanda manual de cinco añadió Milán, Costa Amalfitana, entorno del Fuji, Cancún y Orlando. Ambos proyectos de Cloudflare y las diez versiones se verificaron públicamente. El inventario prioritario queda en Italia: 8/30; Japón: 8/25; México: 7/25; Estados Unidos: 12/20. Son 35 originales y 70 versiones; faltan 65 originales. El catálogo internacional conserva 153 originales y 306 versiones. La auditoría inicial de 30/100 y sus 70 candidatos se conservan como punto de partida; cinco candidatos ahora están publicados y 65 pendientes de investigación. Ver `editorial/verification/2026-11-05-priority-five-publication.json` y `docs/STATUS.md`.

## Siete adicionales verificados el 5 de noviembre

Por pedido manual explícito se añadieron Verona, Pisa, Kanazawa, Riviera Maya, Oaxaca, Los Cabos y Los Ángeles, con catorce versiones completas y 39 lugares fotografiados. Los títulos responden a consultas de qué ver y listas de cinco/siete lugares; no son un ranking de demanda. La cobertura prioritaria sube a Italia 10/30, Japón 9/25, México 10/25 y Estados Unidos 13/20: 42/100, con 58 pendientes. El catálogo internacional conserva todo lo anterior y llega a 160 originales/320 versiones. Los candidatos sustituidos se conservan aplazados con su motivo; no se confunden con publicaciones. Ambos proyectos y las catorce URLs fueron comprobados. Evidencia: `editorial/verification/2026-11-05-seven-more-publication.json`. La tarea externa y la frecuencia diaria no cambiaron.

## Tres temas navideños adicionales verificados

El 5 de noviembre se publicaron Venecia, Osaka y Miami para Navidad, con seis versiones completas y nueve fotos documentales. Se usan las ciudades existentes y se preservan las consultas permanentes del backlog, sin marcarlas falsamente como resueltas por guías estacionales. La cobertura queda en Italia 11/30, Japón 10/25, México 10/25 y Estados Unidos 14/20: 45/100, con 55 originales para la meta. El catálogo global suma 163 originales y 326 versiones. Ambos proyectos y las seis URLs se verificaron. La frecuencia diaria permanece igual. Evidencia: `editorial/verification/2026-11-05-christmas-three-publication.json`.

## Tres ciudades nuevas verificadas

El 5 de noviembre se publicaron Guanajuato, Lucca y Nikko: tres guías con cinco lugares cada una y seis versiones completas ES/EN, 18 documentos oficiales y 15 fotos documentales. Cobertura: Italia 12/30, Japón 11/25, México 11/25 y Estados Unidos 14/20: 48/100, faltan 52. El backlog previo permanece íntegro. El catálogo suma 166 originales y 332 versiones. Ambos proyectos, seis URLs, fotos, descubrimiento interno y metadatos se verificaron. Frecuencia diaria sin cambios. Evidencia: `editorial/verification/2026-11-05-new-three-publication.json`.

## Dos temas verificados el 6 de noviembre

San Diego y San Miguel de Allende se publicaron con cuatro versiones completas y doce lugares fotografiados. La instrucción posterior de dos prevaleció sobre la reserva inicial de tres; Siena queda pendiente fuera de las páginas y activos públicos. Cobertura real: Italia 12/30, Japón 11/25, México 12/25 y Estados Unidos 15/20: 50/100, faltan 50. Se preservan los 73 candidatos previos y todos los contenidos publicados. Catálogo 168 originales/336 versiones. Ambos proyectos y las cuatro URLs se verificaron. La frecuencia diaria no cambió. Evidencia: `editorial/verification/2026-11-06-two-publication.json`.

## Cinco originales navideños adicionales, 6 de noviembre

Turín, Nápoles, Yokohama, Boston y San Francisco tienen diez versiones completas y quince lugares con fotografías documentales propias. Títulos, slugs y metadatos localizados, calendarios confirmados y diferencias prácticas de acceso. La solicitud manual expresa de cinco es adicional a los dos temas verificados antes; no cambia la frecuencia diaria. Cobertura real: Italia 14/30, Japón 12/25, México 12/25 y Estados Unidos 17/20: 55/100, faltan 45. Se preservan los 73 candidatos previos, las reservas y todo el contenido publicado. Catálogo: 173 originales/346 versiones; Navidad: 50 originales. Ambos proyectos y las diez URLs se verificaron. Evidencia: `editorial/verification/2026-11-06-christmas-five-publication.json`.

## Dos originales verificados el 7 de noviembre

Siena y el traslado Osaka–Nara tienen cuatro versiones completas y siete lugares/estaciones con fotografías documentales propias. Siena reutiliza su preparación conservada y Nara añade una consulta de transporte diferenciada de la guía de visitas. Las páginas y portadas de destinos previos se preservan. Censo inicial del día de Nueva York: cero; final: dos. Cobertura: Italia 15/30, Japón 13/25, México 12/25 y Estados Unidos 17/20: 57/100, faltan 43. Los 73 candidatos anteriores permanecen intactos; el alcance publicado de Osaka–Nara queda documentado sin dar por resueltas otras consultas de transporte. Catálogo: 175 originales/350 versiones. Ambos proyectos, cuatro URLs, sitemap, fotos y navegación verificados. Frecuencia y tarea externa sin cambios. Evidencia: `editorial/verification/2026-11-07-two-publication.json`.

## Cuatro guías permanentes y tres de Navidad, pedido manual adicional

El 7 de noviembre se verificaron Bolonia, Takayama, Puebla y Washington D. C., más Navidad en Verona, Fukuoka y Filadelfia: siete originales, catorce versiones y 29 lugares con foto documental. El pedido explícito es adicional a los dos originales diarios anteriores; no cambia frecuencia ni tarea externa. Cobertura: Italia 17/30, Japón 15/25, México 13/25 y Estados Unidos 19/20: 64/100, faltan 36. Se conservan los 73 candidatos y todos los artículos y fechas previos; las guías estacionales no dan por resueltas consultas permanentes ajenas. Catálogo: 182 originales/364 versiones; Navidad: 53 originales. Ambos proyectos, catorce URLs, fotos, descubrimiento interno y SEO verificados. Evidencia: `editorial/verification/2026-11-07-seven-publication.json`.

## Dos ciudades nuevas, 8 de noviembre de 2026

Verificadas Querétaro y Padua, dos originales diarios y cuatro versiones, con cinco lugares y foto documental individual por guía. Consultas nuevas de ciudades ausentes del catálogo; se conserva el backlog de 73 candidatos y todo el contenido anterior. Cobertura: Italia 18/30, Japón 15/25, México 14/25 y Estados Unidos 19/20: 66/100, faltan 34. Catálogo: 184 originales/368 versiones; Navidad: 53 originales anteriores conservados. Ambos proyectos, las cuatro URLs, imágenes, descubrimiento interno y SEO verificados. La tarea de dos originales a las 12:00 de Miami no cambia. Evidencia: `editorial/verification/2026-11-08-two-publication.json`.
