# Plan de Acción SEO — ibanidigital.com
**Score actual: 76/100** | **Objetivo: 86/100**
**Fecha:** 3 de abril de 2026 | **Sesión 3**

---

## CRÍTICO — Hacer hoy (menos de 30 min en total)

### C-1: Forzar redeploy para publicar plataforma-rifas-online
**Archivo:** Terminal / git
**Tiempo:** 2 min
**Problema:** `plataforma-rifas-online.html` existe en el branch `master` pero la URL https://www.ibanidigital.com/plataforma-rifas-online devuelve 404. El deploy de Vercel está desactualizado. La URL sigue en el sitemap, y Google la procesa recibiendo un 404.
**Fix:**
```bash
git checkout master
git commit --allow-empty -m "chore: force redeploy — publicar plataforma-rifas-online"
git push origin master
git checkout main
```
Verificar después que https://www.ibanidigital.com/plataforma-rifas-online retorne 200.

---

### C-2: Corregir 4 canonicals rotos en servicios/landing-pages/
**Archivos:** `servicios/landing-pages/emprendedor-avanzado.html`, `emprendedor-plus.html`, `emprendedor-pro.html`, `emprendedor-elite.html`
**Tiempo:** 8 min
**Problema:** Los archivos fueron renombrados pero sus canonicals apuntan a URLs que no existen. Google puede marcarlos como señal mixta.
**Fix — línea 8 en cada archivo:**
- `emprendedor-avanzado.html` → `<link rel="canonical" href="https://www.ibanidigital.com/servicios/landing-pages/emprendedor-avanzado">`
- `emprendedor-plus.html` → `<link rel="canonical" href="https://www.ibanidigital.com/servicios/landing-pages/emprendedor-plus">`
- `emprendedor-pro.html` → `<link rel="canonical" href="https://www.ibanidigital.com/servicios/landing-pages/emprendedor-pro">`
- `emprendedor-elite.html` → `<link rel="canonical" href="https://www.ibanidigital.com/servicios/landing-pages/emprendedor-elite">`

---

### C-3: Eliminar propiedad `founder` duplicada en index.html
**Archivo:** `index.html` línea 96
**Tiempo:** 2 min
**Problema:** El objeto `ProfessionalService` declara `"founder"` dos veces (líneas 96 y 143). El parser JSON silencia la primera instancia.
**Fix:** Eliminar línea 96:
```json
"founder": { "@id": "https://www.ibanidigital.com/#founder" },
```
(Mantener únicamente la línea 143.)

---

## ALTO — Esta semana

### A-1: Agregar noindex a las 16 páginas de planes
**Archivos:** `servicios/landing-pages/*.html` (6), `servicios/rifas/*.html` (2), `servicios/tiendas/*.html` (4), `servicios/software-administrativo/*.html` (4)
**Tiempo:** 15 min (buscar y reemplazar en el editor)
**Problema:** 16 páginas de plan individual sin `noindex` y fuera del sitemap. Google puede indexarlas autónomamente y si el contenido es thin, diluye la autoridad del dominio.
**Fix:** Agregar en el `<head>` de cada archivo:
```html
<meta name="robots" content="noindex, follow">
```

---

### A-2: Agregar 6 páginas de servicio nivel-2 al sitemap
**Archivo:** `sitemap.xml`
**Tiempo:** 5 min
**Problema:** Solo `/servicios/sitios-corporativos` está en el sitemap. Las 6 páginas restantes existen con contenido completo.
**Fix:** Agregar al `sitemap.xml` (antes del `</urlset>`):
```xml
<url><loc>https://www.ibanidigital.com/servicios/landing-pages</loc><lastmod>2026-04-03</lastmod></url>
<url><loc>https://www.ibanidigital.com/servicios/rifas</loc><lastmod>2026-04-03</lastmod></url>
<url><loc>https://www.ibanidigital.com/servicios/tiendas</loc><lastmod>2026-04-03</lastmod></url>
<url><loc>https://www.ibanidigital.com/servicios/software-administrativo</loc><lastmod>2026-04-03</lastmod></url>
<url><loc>https://www.ibanidigital.com/servicios/reservaciones</loc><lastmod>2026-04-03</lastmod></url>
<url><loc>https://www.ibanidigital.com/servicios/sistemas-a-medida</loc><lastmod>2026-04-03</lastmod></url>
```

---

### A-3: Agregar canonical a portafolio.html, proceso.html y blog.html
**Archivos:** `portafolio.html`, `proceso.html`, `blog.html`
**Tiempo:** 5 min
**Problema:** Las 3 páginas creadas en la sesión anterior no tienen canonical tag confirmado.
**Fix:** Agregar en el `<head>` de cada archivo:
- `portafolio.html` → `<link rel="canonical" href="https://www.ibanidigital.com/portafolio">`
- `proceso.html` → `<link rel="canonical" href="https://www.ibanidigital.com/proceso">`
- `blog.html` → `<link rel="canonical" href="https://www.ibanidigital.com/blog">`

---

### A-4: Corregir IndexNow — referenciar clave activa en robots.txt
**Archivos:** `robots.txt`, eliminar `361da0c5c6aa49dba10859713f581f5c.txt`
**Tiempo:** 5 min
**Problema:** La clave activa `e8eed06c576f819a4f9f8391c59421ad` no está referenciada en robots.txt. Bing/Yandex no pueden descubrir el soporte automáticamente.
**Fix:**
1. Agregar en `robots.txt` (después del último `Allow: /`):
```
IndexNow-key: https://www.ibanidigital.com/e8eed06c576f819a4f9f8391c59421ad.txt
```
2. Descomentar la línea `# Llms-Txt:` para que sea directiva activa.
3. Eliminar `361da0c5c6aa49dba10859713f581f5c.txt` del repositorio.

---

### A-5: Agregar preload LCP en sobre-nosotros.html
**Archivo:** `sobre-nosotros.html` — dentro del `<head>`, antes del `preconnect`
**Tiempo:** 3 min
**Problema:** `foto-fundado.jpg` es el candidato LCP en esta página y no tiene preload. El navegador la descubre tarde (+200-400ms al LCP).
**Fix:** Agregar en el `<head>`:
```html
<link rel="preload" as="image" fetchpriority="high" href="/foto-fundado.jpg">
```

---

### A-6: Corregir foto-fundado.jpg en index.html — quitar fetchpriority alto
**Archivo:** `index.html` — sección #nosotros
**Tiempo:** 2 min
**Problema:** La imagen del fundador tiene `loading="eager" fetchpriority="high"` pero está below-the-fold. Compite con el render del `<h1>` (LCP real).
**Fix:** Cambiar atributos:
```html
loading="lazy"
```
Eliminar el atributo `fetchpriority="high"`.

---

### A-7: Corregir `og:type="profile"` en sobre-nosotros.html
**Archivo:** `sobre-nosotros.html` línea 12
**Tiempo:** 1 min
**Fix:** Cambiar `content="profile"` por `content="article"`.

---

### A-8: Mover onmouseover/onmouseout del footer a CSS puro
**Archivo:** `index.html` líneas 650-651, 692, 921-922 + `css/components.css`
**Tiempo:** 15 min
**Problema:** La CSP bloquea inline event handlers. Los efectos hover en el footer son silenciados.
**Fix:** En `css/components.css` o en `<style>` del head de index.html:
```css
.footer-contact a { color: rgba(255,255,255,.45); transition: color .2s; }
.footer-contact a:hover { color: #fff; }
.footer-privacy a { color: rgba(255,255,255,.25); transition: color .2s; }
.footer-privacy a:hover { color: rgba(255,255,255,.6); }
```
Eliminar los atributos `style`, `onmouseover` y `onmouseout` de los elementos afectados.

---

### A-9: Corregir inconsistencia de precios en artículo de precios
**Archivo:** `cuanto-cuesta-pagina-web-sonora.html` — tabla de rangos
**Tiempo:** 10 min
**Problema:** La tabla muestra "landing page $5,000–$12,000" como rango de mercado. Los precios de IBANI parten de $3,500. Un usuario puede interpretar la tabla como los precios de IBANI.
**Fix:** Agregar una nota visible antes de la tabla (ejemplo):
```html
<p class="nota-aclaratoria">Los rangos de abajo reflejan el mercado general de Sonora. Los precios de IBANI Digital parten desde $3,500 MXN — <a href="/servicios/landing-pages">ver planes aquí</a>.</p>
```

---

## MEDIO — Este mes

### M-1: Agregar schema a 5 páginas de servicio sin marcado
**Archivos:** `servicios/landing-pages.html`, `servicios/sitios-corporativos.html`, `servicios/tiendas.html`, `servicios/software-administrativo.html`, `servicios/sistemas-a-medida.html`
**Tiempo:** 45 min
**Schema recomendado para cada una:**
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.ibanidigital.com/servicios/{slug}#webpage",
      "url": "https://www.ibanidigital.com/servicios/{slug}",
      "name": "{Título de la página}",
      "inLanguage": "es-MX",
      "isPartOf": { "@id": "https://www.ibanidigital.com/#website" }
    },
    {
      "@type": "Service",
      "name": "{Nombre del servicio}",
      "provider": { "@id": "https://www.ibanidigital.com/#business" },
      "areaServed": { "@type": "State", "name": "Sonora" },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Planes de {servicio}",
        "itemListElement": [
          { "@type": "Offer", "name": "Plan Básico", "price": "XXXX", "priceCurrency": "MXN" }
        ]
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.ibanidigital.com/" },
        { "@type": "ListItem", "position": 2, "name": "Servicios", "item": "https://www.ibanidigital.com/servicios" },
        { "@type": "ListItem", "position": 3, "name": "{Nombre}", "item": "https://www.ibanidigital.com/servicios/{slug}" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": []
    }
  ]
}
```

---

### M-2: Agregar nodo WebPage a @graph de index.html
**Archivo:** `index.html` — primer bloque JSON-LD, dentro de `@graph`
**Tiempo:** 5 min
**Fix:** Agregar al inicio del array `@graph`:
```json
{
  "@type": "WebPage",
  "@id": "https://www.ibanidigital.com/#webpage",
  "url": "https://www.ibanidigital.com/",
  "name": "IBANI Digital — Diseño Web para Negocios en Sonora",
  "inLanguage": "es-MX",
  "isPartOf": { "@id": "https://www.ibanidigital.com/#website" }
},
```

---

### M-3: Mover OfferCatalog al mismo @graph que ProfessionalService en index.html
**Archivo:** `index.html` — segundo bloque JSON-LD
**Tiempo:** 10 min
**Problema:** `ProfessionalService.hasOfferCatalog` referencia un `@id` en un bloque `<script>` separado. Google no vincula `@id` entre bloques distintos.
**Fix:** Mover el objeto `OfferCatalog` del segundo bloque al primer bloque (mismo `@graph`).

---

### M-4: Agregar nodo WebPage como intermediario en BlogPosting/Article
**Archivos:** `cuanto-cuesta-pagina-web-sonora.html`, `caso-sorteos-jans.html`
**Tiempo:** 10 min
**Problema:** `BlogPosting.isPartOf` apunta a `#website` directamente. El patrón correcto es `BlogPosting > WebPage > WebSite`.

---

### M-5: Agregar `@id` a BreadcrumbList y FAQPage en todas las páginas
**Archivos:** `hermosillo.html`, `obregon.html`, `cuanto-cuesta`, `sobre-nosotros`, `caso-sorteos-jans`
**Tiempo:** 20 min
**Fix:** En cada nodo, agregar:
```json
"@id": "https://www.ibanidigital.com/{slug}#breadcrumb"
"@id": "https://www.ibanidigital.com/{slug}#faq"
```

---

### M-6: Asignar reseñas geográficamente correctas en páginas de ciudad
**Archivos:** `hermosillo.html`, `obregon.html`
**Tiempo:** 15 min
**Problema:** Las mismas 3 reseñas aparecen en todas las páginas. Carlos Arias (Casa Arias, Hermosillo) tiene su reseña en la página de Obregón.
**Fix:**
- `hermosillo.html`: Mantener Alejandra Ferraris + Carlos Arias.
- `obregon.html`: Mantener Ramón Flores. Eliminar la reseña de Carlos Arias. Agregar reseña de cliente de Obregón si disponible.

---

### M-7: Expandir sitemap-images.xml
**Archivo:** `sitemap-images.xml`
**Tiempo:** 15 min
**Acción:** Agregar bloques `<url>` para `/hermosillo`, `/obregon`, `/caso-sorteos-jans`, `/plataforma-rifas-online` con sus imágenes relevantes.

---

### M-8: Corregir X-Frame-Options vs frame-ancestors
**Archivo:** `vercel.json` línea correspondiente a `X-Frame-Options`
**Tiempo:** 2 min
**Fix:** Cambiar `"X-Frame-Options"` de `"SAMEORIGIN"` a `"DENY"` para consistencia con `frame-ancestors 'none'`.

---

### M-9: Corregir Person.image en sobre-nosotros para usar ImageObject
**Archivo:** `sobre-nosotros.html` — nodo `Person` en JSON-LD
**Tiempo:** 5 min
**Fix:**
```json
"image": {
  "@type": "ImageObject",
  "@id": "https://www.ibanidigital.com/#founder-image",
  "url": "https://www.ibanidigital.com/foto-fundado.jpg",
  "width": 399,
  "height": 399
}
```

---

### M-10: Agregar schema a portafolio, proceso y blog
**Archivos:** `portafolio.html`, `proceso.html`, `blog.html`
**Tiempo:** 20 min
**Fix:**
- `portafolio.html` → `CollectionPage` + `ItemList` de proyectos
- `proceso.html` → `HowTo` con 4 steps (cotización, diseño, desarrollo, entrega)
- `blog.html` → `Blog` + `ItemList` de artículos

---

## BAJO — Backlog

### B-1: Convertir foto-fundado.jpg a WebP/AVIF
**Impacto:** Reduce ~35% el peso. Mejora LCP de sobre-nosotros.html.
**Acción:** Generar versiones WebP y AVIF, usar `<picture>` en index.html y sobre-nosotros.html.

### B-2: Agregar preload de fuente woff2 en cuanto-cuesta y sobre-nosotros
**Acción:** Copiar las 2 líneas `<link rel="preload" as="font">` de Fraunces que tiene index.html.

### B-3: Agregar Source AVIF a imagen Sorteos Jans en plataforma-rifas-online
Si la página se re-publica correctamente (después de C-1), actualizar la imagen con `<picture>` AVIF+WebP.

### B-4: Corregir Article.offers.price:"0" en caso-sorteos-jans
**Fix:** Eliminar el bloque `"offers"` del `SoftwareApplication` en el JSON-LD.

### B-5: Eliminar changefreq/priority del sitemap o agregar a todas
**Archivo:** `sitemap.xml` — la única entrada con estos valores es `/servicios/sitios-corporativos`. Quitar para consistencia.

### B-6: Agregar fuentes externas verificables al artículo de precios
**Archivo:** `cuanto-cuesta-pagina-web-sonora.html`
**Acción:** Agregar al menos una referencia (Think with Google, INEGI, AMITI) para los claims sobre comportamiento del consumidor sonorense.

---

## CONTENIDO — Mediano plazo

### N-1: Obtener y publicar testimonio de Sorteos Jans
**Impacto:** Mayor ganancia E-E-A-T posible en el sitio.
**Acción:** Pedir una cita en primera persona al organizador de Sorteos Jans. Publicar en `caso-sorteos-jans.html` y `plataforma-rifas-online.html`.

### N-2: Escribir 2 artículos de blog dedicados (no páginas de ciudad)
**Temas sugeridos:**
- "Cómo elegir el mejor dominio para tu negocio en Sonora"
- "5 errores de diseño web que alejan clientes en México"
**Impacto:** Señaliza autoridad temática a Google. Cada artículo nuevo = señal de sitio activo.

### N-3: Agregar métricas cuantitativas al caso de estudio
**Archivo:** `caso-sorteos-jans.html`
**Acción:** Agregar: tiempo ahorrado por evento, número de boletos gestionados, reducción de errores (si Sorteos Jans los tiene disponibles).

### N-4: Agregar testimonios visibles en sobre-nosotros.html
**Acción:** 2-3 testimonios de clientes en formato visual (no solo en JSON-LD), preferiblemente mencionando al fundador por nombre.

---

## Orden de ejecución recomendado

```
Hoy (30 min):    C-1 → C-2 → C-3
Esta semana:     A-1 → A-2 → A-3 → A-4 → A-5 → A-6 → A-7
Este mes:        M-1 → M-2/M-3/M-4/M-5 → M-6/M-7/M-8/M-9/M-10
Backlog:         B-1 → B-2 → B-3 → B-4 → B-5 → B-6
Contenido:       N-1 → N-2 → N-3 → N-4
```
