# IBANI Digital — Landing Page

## Stack
- HTML/CSS/JS estático, sin framework ni build step
- Hosteado en Vercel, dominio ibanidigital.com
- Repo: github.com/INNIT4/ibani

## Ramas y deploy
- `main` → producción `ibanidigital.com` (rama única, master eliminado)
- **Hacer push a main:** `git push origin main`
- Los deploys se activan automáticamente en cada push a `main`
- Para forzar deploy: hacer commit vacío con `git commit --allow-empty -m "chore: force redeploy"` en main

## Archivos clave
- `index.html` — página principal
- `servicios.html` — 7 bloques de servicios con IDs: `#landing`, `#tiendas`, `#rifas`, `#software`, `#citas`, `#asistencia`, `#sistemas`
- `img/` — imágenes de servicios en WebP: `landing`, `tiendaonline`, `sorteos`, `gestion`, `reserva`, `codigoqr`, `logoahorro`
- `css/all.min.css` — CSS compilado (el que se sirve en producción)
- `css/base.css`, `css/components.css`, `css/sections.css` — fuentes CSS (editar aquí, recompilar en all.min.css)
- `js/main.min.js` — JS compilado (el que se sirve; `js/main.js` es la fuente)
- `servicios/` — hub pages: `landing-pages.html`, `rifas.html`, `tiendas.html`, `software-administrativo.html`, `sitios-corporativos.html` + subdirectorios con planes individuales (`landing-pages/*.html`, `rifas/*.html`, `tiendas/*.html`, `software-administrativo/*.html`)
- `hermosillo.html` — página SEO local para Hermosillo (indexable, con schema propio)
- `obregon.html` — página SEO local para Ciudad Obregón (indexable, con schema propio)
- `cuanto-cuesta-pagina-web-sonora.html` — artículo de precios (BlogPosting schema, indexable)
- `por-que-negocio-no-aparece-google-sonora.html` — artículo SEO local (BlogPosting schema)
- `landing-page-vs-sitio-web.html` — artículo comparativo (BlogPosting schema)
- `sobre-nosotros.html`, `caso-sorteos-jans.html` — páginas de contenido (indexables)
- `BLOG-AI-GUIDE.md` — briefing de contenido para producción de artículos con IA
- `portafolio.html`, `proceso.html`, `blog.html` — páginas independientes indexables (en sitemap)
- `privacidad.html` — aviso de privacidad LFPDPPP
- `e8eed06c576f819a4f9f8391c59421ad.txt` — clave IndexNow activa (la otra clave en el repo es obsoleta)
- `llms.txt` — contexto para crawlers de IA (GPTBot, ClaudeBot, PerplexityBot)
- `FULL-AUDIT-REPORT.md` — auditoría SEO completa (actualizar tras cambios mayores)
- `ACTION-PLAN.md` — plan de acción SEO priorizado

## Diseño
- Paleta: crema cálido (`#FAF8F1`) + terracotta (`#C85A28`) + tinta oscura (`#1A1714`)
- Tipografía: Fraunces (display) + Plus Jakarta Sans (body)
- Google Fonts cargadas con `media="print" onload` para no bloquear render

## SEO
- JSON-LD: `@graph` con WebSite + ProfessionalService + FAQPage + Reviews
- Segundo bloque JSON-LD: ItemList (portfolio) + OfferCatalog
- `hermosillo.html` y `obregon.html` tienen su propio ProfessionalService schema con geo local
- `sitemap.xml`, `sitemap-images.xml` y `robots.txt` en raíz
- `og:image` generada desde `og-image.html` vía Playwright (1200×630px)
- Google Business Profile creado como negocio de área de servicio (sin dirección pública)
- URL canónica: siempre `https://www.ibanidigital.com/` (con www)

## Blog — checklist para artículo nuevo
Al publicar un artículo, actualizar siempre estos 4 archivos:
1. `sitemap.xml` — agregar `<url>` con la nueva ruta
2. `llms.txt` — agregar enlace en sección "Páginas disponibles" y actualizar fecha
3. `blog.html` — agregar card visual + entrada en el schema `ItemList`
4. `sitemap-images.xml` — agregar entrada si el artículo tiene imágenes propias

## Gotchas
- `.svc-img-frame` usa `aspect-ratio: 4/3` + `object-fit: cover`. A 1280px: col. angosta (45fr) ≈ 518×389px, col. ancha (55fr) ≈ 634×476px
- No levantar servidor local — el usuario prefiere no ejecutar `npx serve` u otros servidores de desarrollo
- No editar `all.min.css` ni `main.min.js` directamente — son compilados. Para CSS puntual en un HTML, usar un `<style>` en el `<head>`.
- `.svc-card` tiene `position:relative; overflow:hidden` — el patrón stretched-link funciona con `::after { position:absolute; inset:0 }` en el link interior.
- `vercel.json` tiene `cleanUrls:true` — URLs como `/servicios/rifas` sirven `servicios/rifas.html` automáticamente.
- `vercel.json` tiene rewrites: `/servicios` → `servicios.html`, `/blog` → `blog.html` (sin estos retornan 404).
- `/portafolio` y `/proceso` son páginas HTML independientes con canonical propio — sí están en el sitemap.
- `servicios/landing-pages/*.html` — al renombrar archivos, actualizar el canonical `<link>` para que coincida con el nuevo nombre.
- `foto-fundado.jpg` existe solo en JPEG (sin WebP/AVIF). Al agregar `<picture>` en el futuro, generar las versiones modernas primero.
- `includes/header.html` es una copia de referencia, NO un include automático. Los artículos de blog tienen el header copiado directamente en su HTML. Cambiar `includes/header.html` no actualiza las páginas individuales — hay que editar cada una por separado.
- `hermosillo.html` y `obregon.html` ya tienen `GeoCoordinates` en su schema `ProfessionalService` — no agregar de nuevo.
