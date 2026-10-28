# MaletaFeliz

Revista de viajes estática en **español e inglés**, diseñada para Cloudflare Pages. Código, artículos estructurados, investigación y licencias se versionan en GitHub. Sin base de datos, APIs de IA de pago ni automatización ficticia.

**Contenido inicial preparado; despliegue público pendiente.** Hay **20 guías originales, 40 versiones completas en español e inglés y 40 fotografías acreditadas**, con fuentes y revisiones vinculadas al contenido final. El control editorial de lanzamiento pasa. Las credenciales de Cloudflare ya están conectadas, pero Pages devuelve HTTP 403; falta habilitar su acceso para desplegar y verificar el dominio.

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
- `content/articles`: cuarenta guías JSON, una por versión lingüística.
- `content/research`: fuentes consultadas y hechos verificados, compartidos por idiomas.
- `content/images/manifest.json`: derechos, atribuciones, dimensiones y hashes de cuarenta fotos y sus variantes responsive.
- `content/reviews`: aprobaciones vinculadas a la huella del contenido.
- `editorial/plan.json`: veinte temas iniciales, países, ciudades, continentes, categorías, intención, idiomas y estado.
- `editorial/site.json`: datos del titular, revisión de textos legales y estado real de automatización.
- `scripts`: auditoría editorial, informe y reserva idempotente de tandas.
- `.github/workflows/quality.yml`: comprobaciones de código; no escribe artículos ni utiliza APIs de IA.
- `.github/workflows/deploy.yml`: despliegue opcional desde main, inactivo hasta configurar los secretos y habilitarlo.

## Lanzamiento

```bash
npm run launch:check
npm run build:release
npm run test:release
```

El control exige la selección inicial completa y debe mantenerse activo. Cloudflare debe ejecutar `npm run build:release` y servir `dist`. Con las credenciales disponibles, `npm run deploy` prepara Pages y el dominio; `npm run verify:live` verifica las URLs públicas. No se ha creado el proyecto ni configurado DNS ni desplegado el dominio desde esta sesión.

La auditoría comprueba las cuarenta versiones, fuentes con evidencia, revisiones al día, fotografías locales con metadatos/licencia/huella, duplicados, profundidad por lugar, fechas y enlaces relacionados. Requiere revisión editorial documentada: un modelo o un test no puede garantizar por sí solo exactitud, originalidad y permisos.

## Documentación y continuidad

- [Requisitos vigentes](docs/requirements.md)
- [Registro de tareas y bloqueos](docs/STATUS.md)
- [Investigación, edición y PUBLICAR 5 ARTÍCULOS](docs/EDITORIAL.md)
- [GitHub, Cloudflare, Google y monetización](docs/DEPLOYMENT.md)

`npm run editorial:report` muestra cobertura y pendientes. `npm run editorial:batch -- 5` reserva temas sin generarlos ni publicarlos. Las tareas futuras deben leer `AGENTS.md`.

## Límites externos comprobados

La red permite investigar fuentes oficiales y archivos con licencia; la investigación inicial se conserva en el repositorio. `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` están disponibles: el token está activo y accede a la zona, pero Pages rechaza las llamadas con HTTP 403. Revisar el permiso de cuenta Cloudflare Pages → Edit. El intento no modificó el proyecto ni DNS. No hay herramientas expuestas para crear tareas recurrentes de Codex en la nube ni consultar el porcentaje de cuota. La publicación diaria a las 07:00 America/New_York no está activa; queda documentado el flujo manual sin APIs facturadas aparte.
