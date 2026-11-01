# Publicar cinco guías diarias de MaletaFeliz

Configuración solicitada: todos los días a las **00:00 (medianoche), America/New_York**, con ejecución en la nube. Repositorio: `luiscazorla97-creator/maletafeliz-`, rama de publicación `main`.

## Instrucción para la tarea

Publicá cinco guías de viaje originales nuevas en https://maletafeliz.com, cada una completa en español e inglés. El usuario autoriza seleccionar los temas, investigar, redactar, revisar, guardar en GitHub y desplegar en los proyectos existentes de Cloudflare, sin pedir confirmación por cada tanda.

Trabajá en el entorno en la nube configurado para este repositorio. Leé `AGENTS.md`, `docs/EDITORIAL.md`, `editorial/site.json` y el historial vigente; sincronizá `main` antes de editar sin descartar trabajo ajeno. Usá las credenciales configuradas únicamente para sus servicios, sin mostrarlas ni guardarlas en Git.

1. Determiná la fecha del lote en America/New_York. Consultá los lotes existentes: si el de hoy ya tiene cinco originales publicados y verificados, no dupliques la publicación. Si está incompleto, retomalo. El comando `npm run editorial:batch -- 5` solo reserva temas; no escribe ni publica.
2. Compará el catálogo y el plan editorial. Elegí cinco necesidades de búsqueda distintas que no dupliquen las existentes. Cubrí progresivamente América, Europa, Asia, África y Oceanía, ajustando la selección cuando exista una razón editorial concreta. Priorizá guías útiles y duraderas; no inventes rankings ni cifras de búsquedas.
3. Investigá fuentes oficiales accesibles y conservá evidencia con hechos y extractos leídos. Registrá bloqueos; no presentes una URL candidata como fuente consultada. Reutilizá los hechos entre idiomas.
4. Redactá cada guía con desarrollo original suficiente, entre 1.200 y 2.500 palabras útiles por idioma cuando corresponda a su alcance. Incluí ubicación, qué hacer, organización de traslados, reservas, contexto, itinerario, preguntas frecuentes y enlaces pertinentes. No rellenes con párrafos repetidos ni publiques precios, horarios o eventos sin respaldo actual.
5. Cada lugar recomendado en una sección `kind: place` debe llevar su propia fotografía documental pertinente. Verificá el archivo y la licencia específica, conservá crédito y condiciones, generá derivados optimizados y ALT en ambos idiomas. La portada no sustituye esas fotos. No uses imágenes generadas como documentación de destinos. Respetá límites de las fuentes y esperas indicadas; no uses métodos alternativos para eludirlos.
6. Revisá los dos idiomas, la intención, la originalidad, los enlaces y todas las fotos. Asigná fechas reales y aprobaciones vinculadas al contenido final solo después de la revisión. Conservá las fechas de artículos anteriores que no cambien. El estado local `published` significa selección para compilar, no publicación pública verificada.
7. Ejecutá los controles requeridos del repositorio, incluida obligatoriamente `npm run build:release`, y las pruebas apropiadas de navegación, SEO, imágenes, idiomas y móvil. No rebajes las comprobaciones. Conservá banners, consentimiento de Analytics y popunder desactivado, salvo una instrucción posterior explícita del usuario.
8. Guardá los cambios en GitHub sin sobrescribir commits ajenos. Desplegá mediante el flujo existente de Cloudflare Pages y verificá que ambos proyectos completen el commit correcto. No sustituyas proyectos ni registros DNS existentes por conveniencia.
9. Comprobá HTTPS, los diez artículos localizados, fotos, canonical, hreflang, búsqueda, destinos, sitemap y redirección www. Registrá lote, historial y publicación únicamente después de comprobar el despliegue. Respondé con las cinco URLs españolas y el resultado real.

Usá la capacidad de Codex incluida en la tarea, sin contratar APIs de IA, servicios de redacción, créditos ni imágenes de pago. No envíes mensajes por correo o servicios externos. Si falta una capacidad, credencial, fuente o comprobación imprescindible, conservá lo terminado y explicá el bloqueo real; no afirmes una publicación ni una ejecución automática que no se haya verificado.

## Parámetros de calendario para un programador compatible

- Zona IANA: `America/New_York`.
- Hora local: `00:00`.
- Recurrencia: `FREQ=DAILY;BYHOUR=0;BYMINUTE=0;BYSECOND=0`.
- Cinco originales / diez versiones por ejecución diaria.
- Ejecutar en la nube con acceso al repositorio y al entorno configurado.
- No sustituir por una hora UTC fija: Nueva York cambia con el horario de verano.

Este archivo es una especificación y un texto listo para una tarea; por sí solo **no crea ni activa una automatización**.

El titular informó que su app ofrece ejecución de automatizaciones en la nube. Esta sesión no expone una herramienta para crearlas ni para manejar esa pantalla; la activación y la primera ejecución siguen pendientes de comprobación.

## Texto breve para pegar en la automatización

> En el repositorio luiscazorla97-creator/maletafeliz-, sincronizá main y ejecutá docs/DAILY-PUBLISHING.md: elegí, investigá y publicá cinco guías originales nuevas en español e inglés, sin repetir destinos ni intenciones. Cada lugar recomendado debe tener una foto real pertinente y acreditada. Aplicá los controles editoriales y SEO, ejecutá build:release y las pruebas necesarias, guardá en GitHub, desplegá en los proyectos existentes de Cloudflare y verificá las URLs públicas. Evitá duplicar el lote del día en America/New_York. Usá el entorno en la nube configurado y la capacidad de Codex, sin APIs de IA de pago. El titular autoriza publicar sin una confirmación adicional por tanda. Informá los enlaces y cualquier bloqueo real.

Al crearla en la app, elegir el repositorio, ejecución en la nube, todos los días, 00:00 y zona America/New_York. La hora es de inicio del trabajo; investigar, revisar y desplegar requiere tiempo antes de que las guías aparezcan en público.
