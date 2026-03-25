# Plan de Accion SEO — ibanidigital.com
**Score actual: 72/100** | **Objetivo a 90 dias: 85/100**
**Fecha:** 25 de marzo de 2026

---

## CRITICO — Hacer hoy (menos de 30 min cada uno)

### C-1 - Corregir coordenadas del sameAs en index.html
**Archivo:** index.html — ProfessionalService.sameAs
**Problema:** URL de Google Maps con coordenadas 29.3955, -111.7386 que NO corresponden a Hermosillo. Dato erroneo absorbido por LLMs como hecho.
**Fix:** Reemplazar por la URL corta del GBP: https://share.google/gb9YStsSpvg3PZxQJ (la misma que ya usa obregon.html).

### C-2 - Eliminar linea 325 del head en index.html
**Archivo:** index.html linea 325
**Problema:** `<link rel="preload" as="style">` para Fraunces con rango 300..700 genera un segundo request a Google Fonts distinto al de la carga async (linea 326 usa 200..900). Causa FOUT extendido y penaliza LCP.
**Fix:** Eliminar completamente la linea 325. La carga async de la linea 326 es suficiente.

### C-3 - Anadir Content-Security-Policy en vercel.json
**Archivo:** vercel.json
**Problema:** Unico header de seguridad faltante. Sin CSP, cualquier XSS puede ejecutar scripts arbitrarios.
**Fix:** Anadir en el array de headers:
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' https://plausible.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://plausible.io; frame-ancestors 'none';"
}
```

### C-4 - Eliminar bloque HowTo del segundo JSON-LD en index.html
**Archivo:** index.html — segundo script type application/ld+json
**Problema:** HowTo fue eliminado de los Google rich results en septiembre 2023. Markup muerto que solo anade peso.
**Fix:** Eliminar el tipo HowTo completo del @graph del segundo bloque.

---

## ALTO — Esta semana (menos de 2h cada uno)

### A-1 - Corregir logo en ProfessionalService schema
**Archivo:** index.html — ProfessionalService.logo
**Problema:** logo apunta a og-image.jpg (1200x630) — Google espera imagen cuadrada para Knowledge Panel.
**Fix:** Crear logo-ibani.png (512x512px, fondo blanco) y actualizar:
```json
"logo": {
  "@type": "ImageObject",
  "@id": "https://www.ibanidigital.com/#logo",
  "url": "https://www.ibanidigital.com/logo-ibani.png",
  "width": 512,
  "height": 512
}
```
Referenciar el mismo @id desde obregon.html.

### A-2 - Hacer CSS no bloqueante
**Archivo:** index.html — link rel="stylesheet" href="css/all.css"
**Problema:** CSS bloqueante = el navegador no puede pintar nada hasta descargarlo. Penaliza LCP.
**Fix:**
```html
<link rel="stylesheet" href="css/all.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="css/all.css"></noscript>
```
Extraer ~60-80 lineas de CSS critico (variables :root, reset, .hero, .header) en un style inline en el head.

### A-3 - Expandir llms.txt con testimonios y estadisticas
**Archivo:** llms.txt
**Fix:** Anadir dos secciones nuevas:
```
## Testimonios
- Alejandra Ferraris (Jardin Ferraris, Hermosillo): "El sitio quedo listo en 3 dias y ya recibimos consultas de clientes nuevos cada semana."
- Carlos Arias (Casa Arias, Hermosillo): "Teniamos urgencia y lo entregaron antes del plazo. El diseno supero lo que esperabamos."
- Ramon Flores (Floresta Jardin, Ciudad Obregon): "Ahora aparecemos en Google cuando buscan salones en Obregon. Vale cada peso."

## Estadisticas (actualizado marzo 2026)
- 10 proyectos entregados en produccion
- Promedio de entrega: 3 dias habiles
- 0 comisiones cobradas sobre ventas de clientes
- 3 ciudades atendidas en Sonora: Hermosillo, Ciudad Obregon, municipios aledanos
- Precio desde $9,000 MXN por proyecto completo
```

### A-4 - Anadir parrafo definitorio en hero de obregon.html
**Archivo:** obregon.html — seccion hero, despues del subtitulo
**Problema:** "IBANI Digital" no aparece en los primeros 60 palabras de contenido visible.
**Fix:** Anadir parrafo (50-70 palabras):
"IBANI Digital es una agencia de diseno web con presencia activa en Ciudad Obregon. Hemos entregado sitios para Floresta Jardin, La Antigua Grecia y Jardin Lantana — negocios locales que hoy reciben clientes desde Google. Precio desde $9,000 MXN, entrega en 3 dias habiles, sin comisiones."

### A-5 - Anadir foto del fundador y ampliar seccion Nosotros
**Archivo:** index.html — seccion #nosotros
**Problema:** Sin foto real del fundador — la senal de E-E-A-T con mayor ROI disponible.
**Fix:**
1. Anadir img con foto de Jose Daniel Ibarra Nieblas (WebP, minimo 400x400px).
2. Ampliar texto con 2-3 lineas sobre trayectoria.
3. Anadir image y url al schema Person en JSON-LD.

### A-6 - Reformular meta description con "Hermosillo" en primeros 100 chars
**Archivo:** index.html — meta name="description"
**Fix:** "Diseno web en Hermosillo y Sonora: landing pages, tiendas online y sitios corporativos desde $9,000 MXN. Entrega garantizada en 3 dias."

---

## MEDIO — Este mes (entre 30 min y 4h cada uno)

### M-1 - Expandir obregon.html con contenido unico (+400-500 palabras)
**Problema:** Borderline en conteo (~715 palabras), descripciones de portfolio duplicadas con index.html.
**Fix:**
- Reescribir las 3 descripciones de portfolio con detalles unicos y resultado especifico de cada proyecto.
- Anadir FAQ especifico de Obregon: "Cuanto cuesta una pagina web en Ciudad Obregon?"
- Anadir texto sobre agroindustria y comercio local de la region del Yaqui.

### M-2 - Completar schema de obregon.html
**Archivo:** obregon.html — ProfessionalService
**Fix:**
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": 5,
  "reviewCount": 3,
  "bestRating": 5,
  "worstRating": 1
},
"openingHoursSpecification": [{
  "@type": "OpeningHoursSpecification",
  "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
  "opens": "09:00",
  "closes": "18:00"
}]
```

### M-3 - Anadir Twitter Card en obregon.html
**Fix:** Anadir los 4 meta tags: twitter:card, twitter:title, twitter:description, twitter:image.

### M-4 - Implementar IndexNow
**Fix:**
1. Generar clave en https://www.bing.com/indexnow
2. Crear [clave].txt en la raiz del repo.
3. Notificar via GET post-deploy: curl "https://api.indexnow.org/indexnow?url=https://www.ibanidigital.com/&key=[clave]"

### M-5 - Corregir sitemap.xml
**Fix:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.ibanidigital.com/</loc>
    <lastmod>2026-03-21</lastmod>
  </url>
  <url>
    <loc>https://www.ibanidigital.com/obregon.html</loc>
    <lastmod>2026-03-25</lastmod>
  </url>
</urlset>
```
Eliminar changefreq y priority (ignorados por Google). Corregir lastmod de /.

### M-6 - Anadir fechas visibles a testimonios
**Archivo:** index.html — seccion testimonios
**Fix:** Mostrar mes/ano de cada resena junto al nombre. Si existen en Google Maps, anadir enlace "Ver resena".

### M-7 - Enriquecer Person schema (fundador)
**Archivo:** index.html — JSON-LD Person
**Fix:**
```json
"image": "https://www.ibanidigital.com/foto-fundador.webp",
"url": "https://www.ibanidigital.com/",
"knowsAbout": ["Diseno web", "SEO local", "E-commerce", "Desarrollo frontend"],
"sameAs": ["https://www.linkedin.com/in/[tu-perfil]"]
```

### M-8 - Anadir preload de woff2 de Fraunces
**Problema:** Sin preload directo del archivo de fuente, el LCP espera a que el CSS lo solicite.
**Fix:** Identificar la URL exacta del .woff2 de Fraunces inspeccionando el network y anadir:
```html
<link rel="preload" as="font" type="font/woff2" crossorigin href="https://fonts.gstatic.com/s/fraunces/[hash].woff2">
```

### M-9 - Eliminar SVG WhatsApp duplicado
**Archivo:** index.html (aparece en lineas ~418 y ~1093)
**Fix:** Declarar como `<symbol id="icon-wa">` y referenciar con `<use href="#icon-wa">` en ambas instancias.

---

## BAJO — Backlog (impacto a mediano/largo plazo)

### B-1 - Crear presencia en YouTube (2-3 videos cortos)
Correlacion de YouTube con citacion de IA es la mas alta (~0.737). Demo de 60-90 segundos por proyecto mencionando "IBANI Digital — diseno web Hermosillo, Sonora". Anadir URL del canal a sameAs en schema y llms.txt.

### B-2 - Crear hermosillo.html
Hermosillo es la ciudad sede declarada pero no tiene pagina de SEO local dedicada. Misma estructura que obregon.html con contenido unico, 3-4 proyectos de Hermosillo del portfolio, schema ProfessionalService con geo de Hermosillo.

### B-3 - Crear un caso de estudio minimo
Formato: cliente + problema + solucion + resultado medible (posicion en Google, consultas recibidas, tiempo). Candidato: Floresta Jardin o Sorteos Jans.

### B-4 - Anadir AVIF a imagenes de portfolio
Generar version .avif de cada imagen WebP y anadir `<source type="image/avif">` antes del WebP en cada picture.

### B-5 - Crear perfil LinkedIn del fundador
Titulo: "Fundador — IBANI Digital | Diseno web Hermosillo, Sonora". Anadir URL a schema Person.sameAs y llms.txt.

### B-6 - Minificacion CSS/JS como paso de build
Opciones: lightningcss (CLI) para CSS + terser (CLI) para JS. Configurable como scripts npm en Vercel build phase.

### B-7 - Articulo de blog sobre precio
Titulo sugerido: "Cuanto cuesta una pagina web para negocio local en Sonora? (2026)". Capta trafico informacional y es muy citado por sistemas de IA.

### B-8 - Listado en Clutch.co y directorios locales de Sonora
Fuente externa que cita a IBANI Digital = senal de autoridad para LLMs.

---

## Resumen de prioridades

| # | Accion | Esfuerzo | Impacto |
|---|---|---|---|
| C-1 | Corregir coordenadas sameAs | 5 min | Critico GEO |
| C-2 | Eliminar preload conflictivo Fraunces | 1 min | LCP |
| C-3 | Anadir CSP en vercel.json | 15 min | Seguridad |
| C-4 | Eliminar HowTo deprecado | 5 min | Schema |
| A-1 | Corregir logo en schema | 30 min | Knowledge Panel |
| A-2 | CSS no bloqueante | 1h | LCP |
| A-3 | Expandir llms.txt | 30 min | AI citacion |
| A-4 | Parrafo definitorio obregon.html | 15 min | GEO / E-E-A-T |
| A-5 | Foto fundador + ampliar Nosotros | 2h | E-E-A-T |
| A-6 | Meta description con Hermosillo | 5 min | CTR SERP |
| M-1 | Expandir obregon.html | 3h | Contenido |
| M-2 | Schema obregon.html completo | 30 min | Rich results |
| M-3 | Twitter Card obregon.html | 10 min | Social sharing |
| M-4 | IndexNow | 30 min | Indexacion Bing |
| M-5 | Corregir sitemap.xml | 10 min | Tecnico |
| M-6 | Fechas visibles en testimonios | 30 min | Trustworthiness |
| M-7 | Enriquecer Person schema | 20 min | E-E-A-T |
| M-8 | Preload woff2 Fraunces | 20 min | LCP |
| M-9 | SVG WhatsApp unico | 20 min | Performance |
| B-1 | Canal YouTube | 2 dias | AI autoridad |
| B-2 | hermosillo.html | 4h | SEO local |
| B-3 | Caso de estudio | 3h | E-E-A-T |
| B-4 | AVIF imagenes | 1h | Performance |
| B-5 | LinkedIn fundador | 1h | Autoridad |
| B-6 | Minificacion build | 2h | Performance |
| B-7 | Blog / articulo precio | 4h | Trafico informacional |
| B-8 | Clutch / directorios | 2h | Autoridad |

---

## Impacto esperado en score

| Acciones completadas | Score estimado |
|---|---|
| Solo Criticos (C-1 a C-4) | 74/100 |
| Criticos + Altos (C + A) | 79/100 |
| Todos hasta Media prioridad (C + A + M) | 85/100 |
| Mas backlog (B-1 a B-8) | 90+/100 |
