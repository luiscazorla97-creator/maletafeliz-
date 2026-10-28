# MaletaFeliz

Revista de viajes estática en **español e inglés**, diseñada para Cloudflare Pages. Código, artículos estructurados, investigación y licencias se versionan en GitHub. Sin base de datos, APIs de IA de pago ni automatización ficticia.

**Estado: implementación local, NO lanzamiento.** La portada es una vista de diseño no indexable. Hay 20 destinos planificados, **0 guías verificadas y 0 fotografías aprobadas**. Las ilustraciones son marcadores de diseño y no representan fotografías documentales. La compilación de producción está bloqueada hasta completar cuarenta versiones editoriales y la revisión legal.

## Ejecutar

Node 24.19 o posterior compatible. En un entorno normal:

```bash
npm ci
npm run dev
```

En el entorno administrado con directorio personal de solo lectura:

```bash
NPM_CONFIG_CACHE=/workspace/.npm-cache npm ci
npm run dev
```

`npm run check` comprueba TypeScript/Astro. `npm test` ejecuta los controles editoriales y búsqueda. `npm run build` genera una vista estática de diseño, noindex. `npm run preview` sirve esa compilación. `npm run test:e2e` abre Chromium y comprueba móvil/escritorio; usa `/usr/bin/chromium` si existe, o el navegador de Playwright instalado con `npx playwright install chromium`. `CHROMIUM_PATH` permite indicar otro ejecutable.

## Estructura

- `src/pages`: HTML estático, idiomas, destinos, categorías, buscador, artículos, sitemap, robots y 404.
- `src/components`: diseño, logo, búsqueda React y plantilla editorial.
- `src/i18n`: navegación y textos de interfaz es/en.
- `content/articles`: guías JSON, una por versión. Vacío hasta terminar la investigación.
- `content/research`: fuentes consultadas y hechos verificados, compartidos por idiomas.
- `content/images/manifest.json`: derechos y atribuciones por fotografía; actualmente vacío.
- `content/reviews`: aprobaciones vinculadas a la huella del contenido.
- `editorial/plan.json`: veinte temas iniciales, países, ciudades, continentes, categorías, intención, idiomas y estado.
- `editorial/site.json`: datos legales pendientes y estado real de automatización.
- `scripts`: auditoría editorial, informe y reserva idempotente de tandas.
- `.github/workflows/quality.yml`: comprobaciones de código; no escribe artículos ni utiliza APIs de IA.

## Lanzamiento

```bash
npm run launch:check
npm run build:release
```

El primer comando **debe fallar ahora**: faltan artículos reales, fuentes, fotografías y datos legales. No lo desactivar. Cloudflare debe ejecutar `npm run build:release` y servir `dist`. No se ha creado el proyecto ni configurado DNS ni desplegado el dominio desde esta sesión.

La auditoría comprueba las cuarenta versiones, fuentes con evidencia, revisiones al día, fotografías locales con metadatos/licencia/huella, duplicados, profundidad por lugar, fechas y enlaces relacionados. Requiere revisión editorial documentada: un modelo o un test no puede garantizar por sí solo exactitud, originalidad y permisos.

## Documentación y continuidad

- [Requisitos vigentes](docs/requirements.md)
- [Registro de tareas y bloqueos](docs/STATUS.md)
- [Investigación, edición y PUBLICAR 5 ARTÍCULOS](docs/EDITORIAL.md)
- [GitHub, Cloudflare, Google y monetización](docs/DEPLOYMENT.md)

`npm run editorial:report` muestra cobertura y pendientes. `npm run editorial:batch -- 5` reserva temas sin generarlos ni publicarlos. Las tareas futuras deben leer `AGENTS.md`.

## Límites externos comprobados

El proxy del entorno devuelve HTTP 403 para Wikimedia y fuentes turísticas; hay dominios añadidos al borrador de configuración, pero el borrador no aplica cambios a la máquina. El propietario debe revisar/guardar y publicar esa configuración. No hay herramientas expuestas para crear tareas recurrentes de Codex en la nube ni consultar el porcentaje de cuota. No se ha activado la publicación a las 07:00 America/New_York; queda documentado un flujo manual sin APIs facturadas aparte.
