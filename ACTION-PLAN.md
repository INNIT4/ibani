# Plan de Accion SEO — ibanidigital.com
**Score actual: 76/100** | **Objetivo: 86/100**
**Fecha:** 1 de abril de 2026

---

## CRITICO — Hacer hoy (menos de 45 min en total)

### C-1: Eliminar 3 URLs 404 del sitemap
**Archivo:** `sitemap.xml`
**Tiempo:** 5 min
**Problema:** `/portafolio`, `/proceso` y `/blog` aparecen en el sitemap pero no existen como archivos HTML. Vercel retorna 404. Google ya las tiene registradas.
**Fix:** Eliminar las 3 entradas `<url>...</url>` correspondientes de `sitemap.xml`.

---

### C-2: Corregir 4 canonicals rotos en servicios/landing-pages/
**Archivos:** `servicios/landing-pages/emprendedor-avanzado.html`, `emprendedor-plus.html`, `emprendedor-pro.html`, `emprendedor-elite.html`
**Tiempo:** 10 min
**Problema:** Los archivos fueron renombrados en disco pero sus canonicals apuntan a URLs anteriores que ya no existen.
**Fix:**
- `emprendedor-avanzado.html` → `href="https://www.ibanidigital.com/servicios/landing-pages/emprendedor-avanzado"`
- `emprendedor-plus.html` → `href="https://www.ibanidigital.com/servicios/landing-pages/emprendedor-plus"`
- `emprendedor-pro.html` → `href="https://www.ibanidigital.com/servicios/landing-pages/emprendedor-pro"`
- `emprendedor-elite.html` → `href="https://www.ibanidigital.com/servicios/landing-pages/emprendedor-elite"`

---

### C-3: Eliminar propiedad `founder` duplicada en index.html
**Archivo:** `index.html` línea 96 (eliminar la primera ocurrencia)
**Tiempo:** 2 min
**Problema:** El objeto `ProfessionalService` declara `"founder"` en dos líneas distintas (96 y 143). JSON con clave duplicada invalida el schema.
**Fix:** Eliminar la línea 96: `"founder": { "@id": "https://www.ibanidigital.com/#founder" },`

---

### C-4: Decidir indexabilidad de las 14 páginas de planes
**Archivos:** `servicios/landing-pages/*.html` (6), `servicios/rifas/*.html` (2), `servicios/tiendas/*.html` (4), `servicios/software-administrativo/*.html` (4)
**Tiempo:** 15 min
**Problema:** 14 páginas sin `noindex` y sin entrada en sitemap — Google puede indexarlas o no, sin control del sitio.
**Decisión a tomar:** Si el contenido de cada página es solo precio + CTA (thin), agregar `noindex`. Si tiene contenido diferenciado, agregarlas al sitemap.
**Fix recomendado (opción rápida):** Agregar `<meta name="robots" content="noindex, follow">` a las 14 páginas mientras se evalúa el contenido.

---

## ALTO — Esta semana

### A-1: Corregir `foto-fundado.jpg` en index.html — quitar fetchpriority alto de elemento below-the-fold
**Archivo:** `index.html` línea ~537
**Tiempo:** 2 min
**Problema:** La imagen del fundador en la sección `#nosotros` tiene `loading="eager" fetchpriority="high"` pero está below-the-fold. Compite con recursos del render path. El LCP real en index.html es el `<h1>` de texto.
**Fix:** Cambiar a `loading="lazy"` y eliminar `fetchpriority="high"`.

---

### A-2: Agregar preload de imagen LCP en sobre-nosotros.html
**Archivo:** `sobre-nosotros.html` — dentro del `<head>`, antes del `preconnect`
**Tiempo:** 5 min
**Problema:** La imagen `foto-fundado.jpg` es el candidato LCP en esta página y no tiene `<link rel="preload">`. El navegador la descubre tarde, añadiendo 200-400ms al LCP.
**Fix:**
```html
<link rel="preload" as="image" fetchpriority="high" href="/foto-fundado.jpg">
```

---

### A-3: Agregar preload de fuente woff2 en 3 páginas
**Archivos:** `cuanto-cuesta-pagina-web-sonora.html`, `sobre-nosotros.html`, `plataforma-rifas-online.html`
**Tiempo:** 10 min
**Problema:** Solo tienen `preconnect` a gstatic.com pero no el preload directo del archivo de fuente. Añade ~100-200ms al render de texto con Fraunces.
**Fix:** Agregar en el `<head>` de cada archivo (antes del preconnect), copiando de index.html:
```html
<link rel="preload" as="font" type="font/woff2" crossorigin href="https://fonts.gstatic.com/s/fraunces/v38/6NU58FyLNQOQZAnv9ZwNjucMHVn85Ni7emAe9lKqZTnbB-gzTK0K1ChjeveQ.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="https://fonts.gstatic.com/s/fraunces/v38/6NU78FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0KxC9TeA.woff2">
```

---

### A-4: Corregir IndexNow — limpiar clave duplicada y referenciar en robots.txt
**Archivos:** `robots.txt`, eliminar `361da0c5c6aa49dba10859713f581f5c.txt`
**Tiempo:** 5 min
**Problema:** Hay 2 archivos de clave IndexNow en el repo. La clave activa es `e8eed06c576f819a4f9f8391c59421ad`. Ninguna está referenciada en robots.txt.
**Fix:**
1. Eliminar `361da0c5c6aa49dba10859713f581f5c.txt` del repo
2. Agregar en `robots.txt`:
```
IndexNow-key: https://www.ibanidigital.com/e8eed06c576f819a4f9f8391c59421ad.txt
```
3. Descomentar la línea de `Llms-txt` en robots.txt si quieres que los crawlers la descubran

---

### A-5: Agregar 4 páginas de servicio nivel-2 al sitemap
**Archivo:** `sitemap.xml`
**Tiempo:** 5 min
**Problema:** `servicios/landing-pages.html`, `servicios/rifas.html`, `servicios/tiendas.html`, `servicios/software-administrativo.html` no están en el sitemap.
**Fix:** Agregar las 4 entradas:
```xml
<url><loc>https://www.ibanidigital.com/servicios/landing-pages</loc><lastmod>2026-04-01</lastmod></url>
<url><loc>https://www.ibanidigital.com/servicios/rifas</loc><lastmod>2026-04-01</lastmod></url>
<url><loc>https://www.ibanidigital.com/servicios/tiendas</loc><lastmod>2026-04-01</lastmod></url>
<url><loc>https://www.ibanidigital.com/servicios/software-administrativo</loc><lastmod>2026-04-01</lastmod></url>
```

---

### A-6: Agregar `@id` a BreadcrumbList y FAQPage en todas las páginas
**Archivos:** `hermosillo.html`, `obregon.html`, `cuanto-cuesta-pagina-web-sonora.html`, `sobre-nosotros.html`, `caso-sorteos-jans.html`, `plataforma-rifas-online.html`
**Tiempo:** 20 min
**Fix:** En cada BreadcrumbList y FAQPage del @graph, agregar:
```json
"@id": "https://www.ibanidigital.com/{slug}#breadcrumb"
"@id": "https://www.ibanidigital.com/{slug}#faq"
```

---

### A-7: Corregir `og:type="profile"` en sobre-nosotros.html
**Archivo:** `sobre-nosotros.html` línea 12
**Tiempo:** 2 min
**Fix:** Cambiar `content="profile"` por `content="article"`.

---

### A-8: Corregir inconsistencia de precios entre artículo y homepage
**Archivo:** `cuanto-cuesta-pagina-web-sonora.html` — tabla "Rangos de precio en Sonora (2026)"
**Tiempo:** 15 min
**Problema:** La tabla del artículo muestra "landing page $5,000-$12,000" como rango del mercado, pero un usuario puede interpretar que ese es el precio de IBANI, que en realidad parte de $3,500. Agregar una nota aclaratoria explícita de que la tabla refleja el mercado sonorense en general, y que los precios de IBANI están al final del artículo.

---

## MEDIO — Este mes

### M-1: Agregar nodo WebPage a @graph de index.html
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

### M-2: Mover OfferCatalog al mismo @graph que ProfessionalService en index.html
**Archivo:** `index.html` — segundo bloque JSON-LD
**Tiempo:** 10 min
**Problema:** `ProfessionalService.hasOfferCatalog` referencia un `@id` que está en un bloque `<script>` separado. Google no vincula `@id` entre bloques distintos.
**Fix:** Mover el objeto `OfferCatalog` del segundo bloque al primer bloque (mismo `@graph` que el `ProfessionalService`).

---

### M-3: Agregar nodo WebPage a cuanto-cuesta y caso-sorteos-jans
**Archivos:** `cuanto-cuesta-pagina-web-sonora.html`, `caso-sorteos-jans.html`
**Tiempo:** 10 min
**Problema:** `BlogPosting.isPartOf` apunta directamente a `#website`, saltándose la `WebPage`. El patrón correcto es `BlogPosting > WebPage > WebSite`.

---

### M-4: Agregar H3 a features de plataforma-rifas-online.html
**Archivo:** `plataforma-rifas-online.html` — sección "Todo lo que necesita tu sorteo"
**Tiempo:** 10 min
**Problema:** Las 6 características de la plataforma usan `<p class="obr-card__title">` en lugar de `<h3>`. Son semánticamente invisibles para crawlers.
**Fix:** Cambiar cada `<p class="obr-card__title">` por `<h3 class="obr-card__title">`.

---

### M-5: Añadir testimonios visibles en sobre-nosotros.html
**Archivo:** `sobre-nosotros.html`
**Tiempo:** 30 min
**Acción:** Agregar 2-3 testimonios de clientes en formato visual (no solo en JSON-LD), preferiblemente de clientes que mencionen directamente al fundador por nombre.

---

### M-6: Asignar reseñas geográficamente correctas en páginas de ciudad
**Archivos:** `hermosillo.html`, `obregon.html`
**Tiempo:** 15 min
**Problema:** Las mismas 3 reseñas aparecen en todas las páginas. Carlos Arias (Casa Arias, Hermosillo) tiene su reseña en la página de Obregón.
**Fix:**
- `hermosillo.html`: Mantener Alejandra Ferraris + Carlos Arias. Agregar una reseña de El Marqués si disponible.
- `obregon.html`: Mantener Ramón Flores. Agregar reseñas de Floresta Jardín o La Antigua Grecia si disponibles. Eliminar la reseña de Carlos Arias.

---

### M-7: Expandir sitemap-images.xml para cubrir más páginas
**Archivo:** `sitemap-images.xml`
**Tiempo:** 20 min
**Acción:** Agregar bloques `<url>` para `/hermosillo`, `/obregon`, `/caso-sorteos-jans`, `/plataforma-rifas-online` con sus imágenes relevantes además de la homepage.

---

### M-8: Corregir X-Frame-Options vs frame-ancestors contradicción
**Archivo:** `vercel.json`
**Tiempo:** 2 min
**Fix:** Cambiar `"X-Frame-Options"` de `"SAMEORIGIN"` a `"DENY"` para que sea consistente con `frame-ancestors 'none'` en el CSP.

---

### M-9: Corregir Person.image en sobre-nosotros para usar ImageObject
**Archivo:** `sobre-nosotros.html` — nodo `Person` en JSON-LD
**Tiempo:** 5 min
**Fix:** Cambiar el valor string por el objeto completo:
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

## BAJO — Backlog

### B-1: Mover onmouseover/onmouseout del footer a CSS puro
**Archivo:** `index.html` líneas 855-856, `css/components.css`
**Impacto:** Elimina la violación CSP y mejora la consistencia del código.

### B-2: Convertir foto-fundado.jpg a WebP/AVIF
**Impacto:** Reduce el peso ~35%, mejora LCP de sobre-nosotros.html en conexiones lentas.
**Acción:** Generar versiones WebP y AVIF, servir con `<picture>` en index.html y sobre-nosotros.html.

### B-3: Agregar source AVIF a imagen Sorteos Jans en plataforma-rifas-online
**Archivo:** `plataforma-rifas-online.html` — `<picture>` de la imagen del caso de estudio.

### B-4: Agregar fuentes externas verificables al artículo de precios
**Archivo:** `cuanto-cuesta-pagina-web-sonora.html`
**Acción:** Agregar al menos una referencia (Think with Google, INEGI, AMITI) para los claims sobre comportamiento del consumidor sonorense.

### B-5: Eliminar changefreq/priority de sitemap o agregarlos a todas las entradas
**Archivo:** `sitemap.xml` líneas 50-51.

---

## CONTENIDO — Mediano plazo

### N-1: Obtener y publicar testimonio de Sorteos Jans
**Impacto:** Mayor impacto E-E-A-T posible. Convierte el caso de estudio de autopublicitario a validado externamente.
**Acción:** Pedir una cita en primera persona al organizador de Sorteos Jans con nombre real. Publicar en `caso-sorteos-jans.html` y `plataforma-rifas-online.html`.

### N-2: Agregar métricas cuantitativas al caso de estudio
**Archivo:** `caso-sorteos-jans.html`
**Acción:** Documentar al menos 1 métrica real: boletos por rifa antes/después, tiempo de gestión reducido, o número de rifas realizadas en la plataforma.

### N-3: Aumentar reviewCount a 5+
**Impacto:** 3 reseñas es bajo proporcionalmente para 10+ proyectos. Solicitar reseñas en Google Business Profile de clientes actuales.

### N-4: Canal de YouTube con 1 video
**Impacto:** Correlación alta con citaciones de AI search. Un screencast de 3-5 min del proceso de entrega o recorrido del portafolio.
**Una vez creado:** Agregar URL a `sameAs` en index.html y a "Redes sociales" en llms.txt.

### N-5: Reescribir texto duplicado "Precio fijo" en hermosillo/obregon
**Archivos:** `hermosillo.html`, `obregon.html`
**Acción:** Redactar variante distinta del mismo mensaje en al menos una de las dos páginas para reducir similitud textual del 65% actual.

---

## Estimacion de impacto por fase

| Fase | Acciones | Score estimado |
|---|---|---|
| Críticos (hoy) | C1-C4 | 76 → 79 |
| Altos (esta semana) | A1-A8 | 79 → 81 |
| Medios (este mes) | M1-M9 | 81 → 84 |
| Bajos + Contenido | B1-B5 + N1-N5 | 84 → 86 |
