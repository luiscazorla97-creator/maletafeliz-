# MaletaFeliz

Revista de viajes estática en **español e inglés**, diseñada para Cloudflare Pages. Código, artículos estructurados, investigación y licencias se versionan en GitHub. Sin base de datos, APIs de IA de pago ni automatización ficticia.

**Publicado y verificado en [maletafeliz.com](https://maletafeliz.com/es/).** Hay **50 guías originales, 100 versiones completas en español e inglés y 337 fotografías acreditadas**, con fuentes y revisiones vinculadas al contenido final. Cada uno de los 335 lugares recomendados tiene una fotografía en ambos idiomas. `www.maletafeliz.com` redirige con HTTP 301 al dominio principal, conservando rutas y parámetros. Cloudflare compila desde GitHub mediante la activación del despliegue desde Codex; la redacción diaria de guías continúa siendo manual.

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
- `content/articles`: guías JSON, una por versión lingüística.
- `content/research`: fuentes consultadas y hechos verificados, compartidos por idiomas.
- `content/images/manifest.json`: derechos, atribuciones, dimensiones y hashes de fotografías y sus variantes responsive.
- `content/reviews`: aprobaciones vinculadas a la huella del contenido.
- `editorial/plan.json`: temas, países, ciudades, continentes, categorías, intención, idiomas y estado.
- `editorial/site.json`: datos del titular, revisión de textos legales y estado real de automatización.
- `scripts`: auditoría editorial, informe y reserva idempotente de tandas.
- `.github/workflows/quality.yml`: comprobaciones de código; no escribe artículos ni utiliza APIs de IA.
- `redirect-www`: redirección estática del host www, desplegada en un proyecto Pages separado.
- Cloudflare Pages está conectado con la rama main; GitHub Actions verifica la calidad.

## Lanzamiento

```bash
npm run launch:check
npm run build:release
npm run test:release
```

El control exige la selección inicial completa y debe mantenerse activo. Cloudflare ejecuta `npm run build:release` y sirve `dist` desde el proyecto `maletafeliz-web`. Después de subir los cambios aprobados a main, `npm run deploy` solicita la compilación de la main remota; no sube archivos locales sin commit/push. `npm run verify:live` comprueba las URLs públicas y la redirección www.

La auditoría comprueba todas las versiones seleccionadas, fuentes con evidencia, revisiones al día, fotografías locales con metadatos/licencia/huella, duplicados, profundidad por lugar, fechas y enlaces relacionados. Requiere revisión editorial documentada: un modelo o un test no puede garantizar por sí solo exactitud, originalidad y permisos.

## Documentación y continuidad

- [Requisitos vigentes](docs/requirements.md)
- [Registro de tareas y bloqueos](docs/STATUS.md)
- [Investigación, edición y PUBLICAR 5 ARTÍCULOS](docs/EDITORIAL.md)
- [GitHub, Cloudflare, Google y monetización](docs/DEPLOYMENT.md)

`npm run editorial:report` muestra cobertura y pendientes. `npm run editorial:batch -- 5` reserva temas sin generarlos ni publicarlos. Las tareas futuras deben leer `AGENTS.md`.

## Límites externos comprobados

La red permite investigar fuentes oficiales y archivos con licencia; la investigación inicial se conserva en el repositorio. `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` están disponibles y el despliegue mediante la integración GitHub de Cloudflare quedó verificado. No hay herramientas expuestas para crear tareas recurrentes de Codex en la nube ni consultar el porcentaje de cuota. La publicación diaria a las 07:00 America/New_York no está activa; queda documentado el flujo manual sin APIs facturadas aparte.
