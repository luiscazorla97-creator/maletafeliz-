# GitHub y Cloudflare Pages

## Arquitectura comprobada

Astro genera HTML estático y archivos de búsqueda para español e inglés. React se carga solamente en el buscador. Tailwind y CSS propio resuelven el diseño. No hay servidor Node en producción, Supabase, adaptador SSR beta, cuentas editoriales web ni APIs de IA. Se verificó la guía oficial de Cloudflare Pages el 28-10-2026 a través del repositorio oficial:
https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/pages/framework-guides/deploy-an-astro-site.mdx

La salida `dist` es compatible con Pages; esta compatibilidad no equivale a un despliegue comprobado en maletafeliz.com. El build estático local sí debe comprobarse antes de publicar.

## Publicar desde este entorno

La compra del dominio no crea un proyecto Pages ni concede acceso al agente. Configurar los dos valores de «Conexión segura pendiente» y aplicar/publicar la configuración del entorno antes de desplegar.

1. Ejecutar `npm run check`, `npm test`, `npm run build:release` y `npm run test:release`. El lanzamiento exige los veinte originales, cuarenta versiones, fuentes, fotografías, revisiones y datos legales completos. No desactivar el control para obtener una portada incompleta.
2. Ejecutar `npm run deploy`. El script comprueba acceso a la zona y registros existentes, crea el proyecto Pages `maletafeliz` si hace falta, publica `dist` en la rama de producción `main` y asocia `maletafeliz.com`. Solo crea un CNAME cuando no hay un registro de sitio incompatible; conserva los registros de correo. Si detecta un sitio existente que necesitaría reemplazarse, se detiene para inspeccionarlo.
3. Esperar a que el dominio personalizado y su certificado estén activos. Ejecutar `npm run verify:live`: comprueba HTTPS en ambos idiomas, todas las guías, sitemap, robots y respuesta 404. Guarda el resultado en `/tmp/maletafeliz-live-verification.json`. Un despliegue enviado a la API no equivale a una web pública verificada.
4. Confirmar en el navegador fotos, cambio de idioma y navegación desde el dominio real. Si el DNS o certificado aún se está propagando, repetir la verificación sin volver a publicar innecesariamente.

El comando `npm run build` genera una vista previa no indexable; producción siempre utiliza `npm run build:release`. Node 24.19.0 y salida `dist`. No se ha creado el proyecto ni ejecutado un despliegue desde esta sesión porque faltan credenciales.

Como alternativa al despliegue directo, el titular puede conectar el repositorio desde Workers & Pages en Cloudflare con la integración oficial de GitHub. Elegir rama `main`, comando `npm run build:release` y directorio `dist`; asociar el dominio mediante el panel de Pages. Elegir una vía de despliegue por proyecto. El workflow opcional descrito abajo es para el flujo de despliegue directo.

## Datos legales y analítica

Nombre, correo público y residencia en Argentina ya incorporados según los datos del usuario. En `editorial/site.json` se registró la revisión técnica/editorial de los textos por Codex, sin afirmar asesoría legal profesional ni revisión humana independiente. Personalizar los textos en `src/data/legal.ts`; una vez revisados registrar su SHA-256 en `legalContentHash`. El requisito técnico de estos campos no sustituye la revisión legal.

No hay Google Analytics, anuncios ni píxeles activados. Después de lanzar, verificar una propiedad de dominio en Search Console con el TXT exacto entregado por Google (sin inventar su valor) y enviar `https://maletafeliz.com/sitemap.xml`. Revisar indexación y alternancias de idiomas sin prometer posicionamiento.

Antes de integrar GA4 o AdSense: obtener identificadores reales, revisar privacidad y consentimiento, e instalar una solución apropiada que mantenga apagados los scripts opcionales hasta la decisión aplicable. Usar `rel="sponsored nofollow"` para afiliados reales e identificar colaboraciones. El sitio no garantiza aprobación ni tráfico.

## Costos y recuperación

No se contratan APIs de IA ni servicios de redacción. Codex consume la cuota de la suscripción, cuyo saldo no está disponible para el agente. Hosting estático y GitHub pueden encajar en planes gratuitos, sujetos a límites y términos vigentes de cada cuenta; no se ha comprado ningún plan ni crédito. Dominio, límites de builds, almacenamiento de fotografías y tráfico deben revisarse en los paneles reales.

Git versiona artículos, investigación, licencias y revisiones; mantener una copia del repositorio con imágenes y Git LFS si crecen demasiado. Cloudflare permite recuperar un despliegue anterior desde su panel. Antes de restaurar, identificar el commit y verificar de nuevo contenido y rutas. No afirmar que existe una copia remota hasta comprobar el push.

## Conexión segura pendiente

En los ajustes del entorno se declararon `CLOUDFLARE_API_TOKEN` (secreto, destino api.cloudflare.com) y `CLOUDFLARE_ACCOUNT_ID`. Completar los valores allí, nunca en el chat o Git. En Cloudflare crear un token limitado a la cuenta correspondiente con **Account → Cloudflare Pages → Edit**, y a la zona maletafeliz.com con **Zone → Zone → Read** y **Zone → DNS → Edit**. El Account ID figura en el resumen de la cuenta/zona. Después de guardar/aplicar la configuración, verificar `wrangler whoami` y ejecutar `npm run deploy` solo con la compilación y pruebas de producción aprobadas.

La necesidad de Pages Edit y Account ID se verificó en la documentación oficial: https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/ . La lectura de zona y edición DNS permiten asociar el dominio sin cambiar registros de correo.

Para despliegues automáticos desde GitHub, el workflow `deploy.yml` queda preparado pero inactivo: requiere los mismos nombres de secretos en GitHub, la variable `CLOUDFLARE_DEPLOY_ENABLED=true` y probar un despliegue. Se ejecuta después de las comprobaciones sobre main, vuelve a exigir build:release y pruebas del sitio compilado. No ejecuta Codex ni genera artículos. No confundir esta capacidad con la tarea de redacción diaria de las 07:00.
