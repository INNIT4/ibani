# IBANI Digital — Landing Page

## Stack
- HTML/CSS/JS estático, sin framework ni build step
- Hosteado en Vercel, dominio ibanidigital.com
- Repo: github.com/INNIT4/ibani

## Deploy
```bash
git push origin main  # Vercel despliega automáticamente
```

## Archivos clave
- `index.html` — página principal
- `css/base.css` — design tokens (colores, tipografía, espaciado)
- `css/components.css` — nav, botones, cards
- `css/sections.css` — secciones del landing
- `js/main.js` — scroll reveals, FAQ, animaciones
- `privacidad.html` — aviso de privacidad LFPDPPP

## Diseño
- Paleta: crema cálido (`#FAF8F1`) + terracotta (`#C85A28`) + tinta oscura (`#1A1714`)
- Tipografía: Fraunces (display) + Plus Jakarta Sans (body)
- Google Fonts cargadas con `media="print" onload` para no bloquear render

## SEO
- JSON-LD: `@graph` con WebSite + ProfessionalService + FAQPage + Reviews
- `sitemap.xml` y `robots.txt` en raíz
- `og:image` generada desde `og-image.html` vía Playwright (1200×630px)
- Google Business Profile creado como negocio de área de servicio (sin dirección pública)
