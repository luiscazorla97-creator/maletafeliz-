# GitHub y Cloudflare Pages

## Publicación activa

La revista está publicada en https://maletafeliz.com, con rutas /es/ y /en/. Las cuarenta guías, sitemap, robots y respuesta 404 fueron comprobados por HTTPS. www.maletafeliz.com devuelve HTTP 301 al dominio principal conservando la ruta y los parámetros.

Los proyectos Pages usan la integración oficial de GitHub con `luiscazorla97-creator/maletafeliz-`, rama de producción `main`:

| Proyecto        | Dominio             | Carpeta raíz         | Compilación           | Salida |
| --------------- | ------------------- | -------------------- | --------------------- | ------ |
| maletafeliz-web | maletafeliz.com     | raíz del repositorio | npm run build:release | dist   |
| maletafeliz-www | www.maletafeliz.com | redirect-www         | sin compilación       | .      |

El proyecto principal usa Node 24.19.0. El segundo es estático y contiene la regla relativa `/* https://maletafeliz.com/:splat 301`. Pages no admite condiciones por hostname en el origen de `_redirects`; separar la redirección permite mantener la revista estática sin Functions ni un Worker. El proyecto www solo sigue cambios en redirect-www/*.

El token fue validado y el despliegue desde GitHub completó clonación, compilación y publicación. La subida directa de assets con Wrangler encontró una incompatibilidad con la inyección de credenciales del entorno; la integración Git evita ese paso usando el servicio oficial de compilación de Cloudflare.

## Actualizar la revista

1. Investigar y revisar el contenido según `EDITORIAL.md`, con las dos versiones y sus aprobaciones.
2. Ejecutar los controles pertinentes: `npm run check`, `npm test`, `npm run build:release` y `npm run test:release` cuando haya cambios de sitio/contenido que deban comprobarse.
3. Guardar los archivos y subir los cambios aprobados a main. Solicitar la publicación con `npm run deploy`, que inicia los builds desde GitHub mediante la API de Cloudflare. El build mantiene el control editorial de lanzamiento. GitHub Actions también comprueba la calidad, sin generar contenido ni utilizar APIs de IA.
4. Esperar a que el despliegue de Cloudflare termine correctamente y ejecutar `npm run verify:live`. Comprueba ambos idiomas, las cuarenta guías, sitemap, robots, 404 y las redirecciones www. El resultado queda en `/tmp/maletafeliz-live-verification.json`.

`npm run deploy` sirve para solicitar una nueva compilación de la main remota y comprobar la configuración de dominios. No sube archivos locales sin push. El script valida ambos proyectos, la rama y los CNAME antes de mutar, conserva MX y no sustituye registros incompatibles. Su respuesta indica que el build fue solicitado; la comprobación HTTP posterior acredita la publicación real.

`npm run build` sigue generando una vista previa no indexable. No usarlo como comando de producción. Los requisitos de fuentes, licencias, profundidad, idiomas y revisiones no deben quitarse para publicar contenido incompleto.

## Credenciales

Los valores se conservan en los ajustes seguros del entorno, nunca en Git ni en código del navegador. CLOUDFLARE_ACCOUNT_ID es el ID de la cuenta. CLOUDFLARE_API_TOKEN requiere Cloudflare Pages → Edit en esa cuenta, Zone → Read y DNS → Edit para maletafeliz.com. El token ya está disponible y el acceso necesario fue comprobado.

No se requiere copiar estos secretos a GitHub Actions: Cloudflare utiliza su propia conexión autorizada con GitHub para publicar los commits. El script manual utiliza las credenciales del entorno para la API de Cloudflare.

## Analítica y monetización

Los datos del titular están incorporados según lo facilitado por el usuario. La revisión técnica/editorial de los textos por Codex no se presenta como asesoría legal profesional. Las fotografías mantienen su atribución y licencia específica.

Search Console, Google Analytics, anuncios y afiliados no están activados. Para Search Console, utilizar el TXT real que entregue Google y enviar https://maletafeliz.com/sitemap.xml. Antes de integrar analítica o anuncios, obtener los identificadores reales y revisar privacidad y consentimiento. No se prometen posiciones en Google ni aprobación de AdSense.

## Automatización, costos y recuperación

La publicación desde GitHub funciona al activar el build desde Codex. Aunque la integración tiene habilitados los despliegues de producción, no se observó un nuevo build automático tras un push durante esta verificación; no depender de ese disparador hasta comprobarlo. La investigación y redacción diaria con Codex no están programadas: esta sesión no expone un programador cloud ni el porcentaje de cuota. Se mantiene el flujo manual PUBLICAR 5 ARTÍCULOS y el objetivo futuro de las 07:00 America/New_York, sin APIs de IA facturadas aparte.

Los dos proyectos son estáticos. No se ha comprado ningún plan ni crédito. Los límites aplicables dependen de la cuenta del titular. Git conserva código, guías, fuentes, imágenes y revisiones. Cloudflare permite recuperar un despliegue anterior desde su panel; verificar contenido y rutas después de cualquier restauración.
