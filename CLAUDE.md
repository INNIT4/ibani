# IBANI Digital — Landing Page

## Stack
- HTML/CSS/JS estático, sin framework ni build step
- Hosteado en Vercel, dominio ibanidigital.com
- Repo: github.com/INNIT4/ibani

## Ramas y deploy
- `main` → preview en `ibanidemo.vercel.app` (demo)
- `master` → producción `ibanidigital.com`
- **Siempre hacer push solo a master:** `git checkout master && git merge main --no-edit && git push origin master && git checkout main`
- Los deploys NO se activan automáticamente — verificar config en Vercel dashboard
- Para forzar deploy: hacer commit vacío con `git commit --allow-empty` en master

## Archivos clave
- `index.html` — página principal
- `css/all.min.css` — CSS compilado (el que se sirve en producción)
- `css/base.css`, `css/components.css`, `css/sections.css` — fuentes CSS (editar aquí, recompilar en all.min.css)
- `js/main.min.js` — JS compilado (el que se sirve; `js/main.js` es la fuente)
- `servicios/` — páginas individuales: `landing-pages.html`, `tiendas.html`, `rifas.html`, `corporativos.html`
- `privacidad.html` — aviso de privacidad LFPDPPP
- `obregon.html` — página SEO local para Ciudad Obregón (indexable, con schema propio)
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
- `obregon.html` tiene su propio ProfessionalService schema con geo de Obregón
- `sitemap.xml` y `robots.txt` en raíz
- `og:image` generada desde `og-image.html` vía Playwright (1200×630px)
- Google Business Profile creado como negocio de área de servicio (sin dirección pública)
- URL canónica: siempre `https://www.ibanidigital.com/` (con www)

## Gotchas
- No editar `all.min.css` ni `main.min.js` directamente — son compilados. Para CSS puntual en un HTML, usar un `<style>` en el `<head>`.
- `.svc-card` tiene `position:relative; overflow:hidden` — el patrón stretched-link funciona con `::after { position:absolute; inset:0 }` en el link interior.
- `vercel.json` tiene `cleanUrls:true` — URLs como `/servicios/rifas` sirven `servicios/rifas.html` automáticamente.
