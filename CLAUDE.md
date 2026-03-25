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
- `css/base.css` — design tokens (colores, tipografía, espaciado)
- `css/components.css` — nav, botones, cards
- `css/sections.css` — secciones del landing
- `js/main.js` — scroll reveals, FAQ, animaciones
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
