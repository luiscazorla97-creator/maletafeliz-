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
