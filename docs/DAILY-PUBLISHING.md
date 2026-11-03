# Publicar dos guías diarias de MaletaFeliz

Configuración solicitada: todos los días a las **12:00 del mediodía de Miami, America/New_York**, con ejecución en la nube. Repositorio: `luiscazorla97-creator/maletafeliz-`, rama de publicación `main`.

El pedido del 2 de noviembre de 2026 reemplaza el objetivo anterior de cinco originales a las 09:00. Son dos temas y cuatro versiones por tanda. El titular aclaró que hasta ahora iniciaba las publicaciones escribiendo en el chat.

## Instrucción para la tarea

Publicá dos guías de viaje originales nuevas en https://maletafeliz.com, cada una completa en español e inglés. El usuario autoriza seleccionar los temas, investigar, redactar, revisar, guardar en GitHub y desplegar en los proyectos existentes de Cloudflare, sin pedir confirmación por cada tanda.

Trabajá en el entorno en la nube configurado para este repositorio, sin depender de la PC del titular. Comprobá al inicio acceso efectivo al ejecutor, GitHub, fuentes públicas y Cloudflare. Leé `AGENTS.md`, `docs/EDITORIAL.md`, `editorial/site.json` y el historial vigente; sincronizá `main` antes de editar sin descartar trabajo ajeno. Usá las credenciales configuradas únicamente para sus servicios, sin mostrarlas ni guardarlas en Git.

1. Determiná la fecha del lote en America/New_York. Consultá todos los lotes y verificaciones del día, incluidos pedidos manuales, y contá temas únicos publicados por primera vez: si el de hoy ya tiene al menos dos originales publicados y verificados, no dupliques la publicación. Si está incompleto, retomalo y completá únicamente lo que falte para llegar a dos. No dupliques reservas ni ejecuciones concurrentes; revisá el lote devuelto por el comando antes de trabajar. El comando `npm run editorial:batch -- 2` solo reserva temas; no escribe ni publica.
2. Compará el catálogo y el plan editorial. Elegí dos necesidades de búsqueda distintas que no dupliquen las existentes. Alterná progresivamente América, Europa, Asia, África y Oceanía según la cobertura del historial, ajustando la selección cuando exista una razón editorial concreta. La tarea general no queda limitada a egresados ni a Argentina. Priorizá guías útiles y duraderas; no inventes rankings ni cifras de búsquedas.
3. Investigá fuentes oficiales accesibles y conservá evidencia con hechos y extractos leídos. Registrá bloqueos; no presentes una URL candidata como fuente consultada. Reutilizá los hechos entre idiomas.
4. Redactá cada guía con desarrollo original suficiente, entre 1.200 y 2.500 palabras útiles por idioma cuando corresponda a su alcance. Incluí ubicación, qué hacer, organización de traslados, reservas, contexto, itinerario, preguntas frecuentes y enlaces pertinentes. No rellenes con párrafos repetidos ni publiques precios, horarios o eventos sin respaldo actual.
5. Cada lugar recomendado en una sección `kind: place` debe llevar su propia fotografía documental pertinente. Verificá el archivo y la licencia específica, conservá crédito y condiciones, generá derivados optimizados y ALT en ambos idiomas. La portada no sustituye esas fotos. No uses imágenes generadas como documentación de destinos. Respetá límites de las fuentes y esperas indicadas; no uses métodos alternativos para eludirlos.
6. Revisá los dos idiomas, la intención, la originalidad, los enlaces y todas las fotos. Asigná fechas reales y aprobaciones vinculadas al contenido final solo después de la revisión. Conservá las fechas de artículos anteriores que no cambien. El estado local `published` significa selección para compilar, no publicación pública verificada.
7. Ejecutá los controles requeridos del repositorio, incluida obligatoriamente `npm run build:release`, y las pruebas apropiadas de navegación, SEO, imágenes, idiomas y móvil. No rebajes las comprobaciones. Conservá banners, consentimiento de Analytics y popunder desactivado, salvo una instrucción posterior explícita del usuario.
8. Guardá los cambios en GitHub sin sobrescribir commits ajenos. Desplegá mediante el flujo existente de Cloudflare Pages y verificá que ambos proyectos completen el commit correcto. No sustituyas proyectos ni registros DNS existentes por conveniencia.
9. Comprobá HTTPS, los cuatro artículos localizados, fotos, canonical, hreflang, búsqueda, destinos, sitemap y redirección www. Registrá lote, historial y publicación únicamente después de comprobar el despliegue. Respondé con las dos URLs españolas y el resultado real.

Usá la capacidad de Codex incluida en la tarea, sin contratar APIs de IA, servicios de redacción, créditos ni imágenes de pago. No envíes mensajes por correo o servicios externos. Si falta una capacidad, credencial, fuente o comprobación imprescindible, conservá lo terminado y explicá el bloqueo real; no afirmes una publicación ni una ejecución automática que no se haya verificado.

## Calendario configurado

- Inicio del trabajo: todos los días a las **12:00 del mediodía de Miami**.
- Zona IANA: `America/New_York`, con ajuste automático del horario de verano; no fijar una hora UTC constante.
- Recurrencia: `FREQ=DAILY;BYHOUR=12;BYMINUTE=0;BYSECOND=0`.
- Primer inicio programado: **3 de noviembre de 2026, 12:00 de Miami**.
- Objetivo: dos originales nuevos, completos en español e inglés (cuatro versiones).
- Título de la tarea: «Publicar 2 artículos de viajes».

La creación y lectura posterior del programador confirmaron la tarea habilitada, zona y horario exactos. La evidencia está en `editorial/verification/2026-11-02-daily-two-schedule.json`; el identificador de mantenimiento, en `editorial/site.json`.

El 3 de noviembre de 2026 se verificó una publicación real desde el entorno en la nube, con acceso efectivo a GitHub, ambos proyectos de Cloudflare y las cuatro URLs nuevas. La evidencia está en `editorial/verification/2026-11-03-publication.json`. El programador registra un inicio hoy a las 17:01 UTC, pero no expone el identificador de corrida ni su vínculo con este chat; esa atribución sigue pendiente. No confundir configuración confirmada con publicación automática comprobada. La hora es el inicio del trabajo: las guías aparecen después de investigar, redactar, revisar y desplegar. No iniciar una tanda adicional ahora como prueba si el titular solo pidió programar.

El programador conectado no mostró una tarea previa de MaletaFeliz. Tras la consulta, el titular aclaró que las publicaciones anteriores se iniciaban escribiendo en el chat. Se creó una única tarea para este sitio, sin modificar tareas de otros proyectos. Si una ejecución futura encuentra un bloqueo, debe informar el resultado real y conservar el trabajo verificable.
