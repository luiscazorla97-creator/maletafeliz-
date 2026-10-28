# GitHub y Cloudflare Pages

## Arquitectura comprobada

Astro genera HTML estático y archivos de búsqueda para español e inglés. React se carga solamente en el buscador. Tailwind y CSS propio resuelven el diseño. No hay servidor Node en producción, Supabase, adaptador SSR beta, cuentas editoriales web ni APIs de IA. Se verificó la guía oficial de Cloudflare Pages el 28-10-2026 a través del repositorio oficial:
https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/pages/framework-guides/deploy-an-astro-site.mdx

La salida `dist` es compatible con Pages; esta compatibilidad no equivale a un despliegue comprobado en maletafeliz.com. El build estático local sí debe comprobarse antes de publicar.

## Configuración después de completar el contenido

1. En Cloudflare, Workers & Pages → crear proyecto Pages → conectar `luiscazorla97-creator/maletafeliz-` con la cuenta autorizada. La compra del dominio por sí sola no crea el proyecto ni concede acceso al agente.
2. Rama de producción `main`. Comando **`npm run build:release`**. Directorio de salida **`dist`**. Node **24.19.0**. No elegir `npm run build` para producción: produce una vista de diseño no indexable.
3. El comando de lanzamiento debe fallar mientras falten cualquiera de las cuarenta versiones, revisiones, fotografías, datos legales o fuentes verificadas. No quitar el control para mostrar una portada incompleta. El proyecto de Pages no se ha creado desde esta sesión.
4. Al pasar los controles, crear el despliegue. En dominios personalizados agregar `maletafeliz.com` dentro de Pages y aplicar el DNS que indique Cloudflare. No sobrescribir registros de correo ni otros servicios. Revisar si `www` debe redirigir al dominio canónico. Confirmar HTTPS, sin contenido mixto.
5. Hacer solicitudes reales a `/es/`, `/en/`, varias guías, `/sitemap.xml`, `/robots.txt` y una ruta inexistente (HTTP 404). Comprobar que no se publica `noindex` en guías aprobadas y que hay canonical/hreflang recíprocos.
6. Con integración Git, nuevos commits aprobados desencadenan nuevos builds. GitHub Actions comprueba archivos y conserva evidencia, pero **no genera contenido** ni configura tareas de Codex.

Alternativa CLI con autorización segura de Cloudflare: `npm run deploy`, usando el proyecto Pages `maletafeliz` ya creado. La CLI recibe credenciales de su propio entorno seguro; nunca escribir tokens en el repositorio. No hay un token disponible en esta sesión y no se ha ejecutado un despliegue.

## Datos legales y analítica

Nombre del titular y correo público ya incorporados con autorización. Completar en `editorial/site.json` la jurisdicción pendiente y la fecha de revisión. Personalizar los textos en `src/data/legal.ts`; una vez revisados registrar su SHA-256 en `legalContentHash`. El requisito técnico de estos campos no sustituye la revisión legal.

No hay Google Analytics, anuncios ni píxeles activados. Después de lanzar, verificar una propiedad de dominio en Search Console con el TXT exacto entregado por Google (sin inventar su valor) y enviar `https://maletafeliz.com/sitemap.xml`. Revisar indexación y alternancias de idiomas sin prometer posicionamiento.

Antes de integrar GA4 o AdSense: obtener identificadores reales, revisar privacidad y consentimiento, e instalar una solución apropiada que mantenga apagados los scripts opcionales hasta la decisión aplicable. Usar `rel="sponsored nofollow"` para afiliados reales e identificar colaboraciones. El sitio no garantiza aprobación ni tráfico.

## Costos y recuperación

No se contratan APIs de IA ni servicios de redacción. Codex consume la cuota de la suscripción, cuyo saldo no está disponible para el agente. Hosting estático y GitHub pueden encajar en planes gratuitos, sujetos a límites y términos vigentes de cada cuenta; no se ha comprado ningún plan ni crédito. Dominio, límites de builds, almacenamiento de fotografías y tráfico deben revisarse en los paneles reales.

Git versiona artículos, investigación, licencias y revisiones; mantener una copia del repositorio con imágenes y Git LFS si crecen demasiado. Cloudflare permite recuperar un despliegue anterior desde su panel. Antes de restaurar, identificar el commit y verificar de nuevo contenido y rutas. No afirmar que existe una copia remota hasta comprobar el push.
