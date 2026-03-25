# Plan de Accion SEO — ibanidigital.com
**Score actual: 73/100** | **Objetivo a 90 dias: 85/100**
**Fecha:** 25 de marzo de 2026

---

## CRITICO — Hacer hoy (menos de 30 min en total)

### C-1: Corregir precio en meta description de index.html
**Archivo:** `index.html`, linea 7
**Tiempo:** 2 min
**Problema:** Dice "desde $9,000 MXN" cuando el precio de entrada es $3,500 MXN (Plan Basico). Los crawlers de IA leen la meta description primero y citaran el precio incorrecto.
**Fix:**
```html
<!-- Cambiar: -->
<meta name="description" content="Diseno web en Hermosillo y Sonora: landing pages, tiendas online y sitios corporativos desde $9,000 MXN. Entrega garantizada en 3 dias.">
<!-- Por: -->
<meta name="description" content="Diseno web en Hermosillo y Sonora: landing pages, tiendas online y sitios corporativos desde $3,500 MXN. Entrega garantizada en 3 dias habiles.">
```

---

### C-2: Corregir Google Fonts render-blocking en hermosillo.html
**Archivo:** `hermosillo.html`, linea 140
**Tiempo:** 3 min
**Problema:** Fuentes cargadas con `<link rel="stylesheet">` directo — bloquea el render, penaliza LCP y FCP directamente.
**Fix:** Anadir `media="print" onload` y agregar `<noscript>` fallback. Copiar el patron de index.html:
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200..900;1,9..144,200..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200..900;1,9..144,200..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"></noscript>
```

---

### C-3: Corregir Google Fonts render-blocking en cuanto-cuesta-pagina-web-sonora.html
**Archivo:** `cuanto-cuesta-pagina-web-sonora.html`, linea 95
**Tiempo:** 3 min
**Problema:** Mismo que C-2. La pagina con mayor potencial editorial tiene las fuentes bloqueando el render.
**Fix:** Aplicar el mismo patron `media="print" onload` con `<noscript>` fallback.

---

### C-4: Anadir `noindex, nofollow` a og-image.html
**Archivo:** `og-image.html`
**Tiempo:** 2 min
**Problema:** Plantilla HTML para generar la imagen OG via Playwright. Si Vercel la sirve (lo hace por defecto), Google puede indexarla como pagina sin contenido util.
**Fix:** Anadir en el `<head>`:
```html
<meta name="robots" content="noindex, nofollow">
```

---

### C-5: Anadir propiedad `image` al schema BlogPosting
**Archivo:** `cuanto-cuesta-pagina-web-sonora.html`, bloque JSON-LD BlogPosting
**Tiempo:** 10 min
**Problema:** Sin esta propiedad, el articulo no es elegible para Article rich results ni Google Discover.
**Fix:** Dentro del objeto BlogPosting, anadir:
```json
"image": {
  "@type": "ImageObject",
  "url": "https://www.ibanidigital.com/og-image.jpg",
  "width": 1200,
  "height": 630
}
```

---

## ALTO — Esta semana

### A-1: Corregir AggregateRating en paginas de ciudad
**Archivos:** `obregon.html` y `hermosillo.html`, bloque ProfessionalService JSON-LD
**Tiempo:** 30 min
**Problema:** `aggregateRating` declarado (5 estrellas, 3 reviews) sin incluir los objetos `Review` que lo sustentan. Google puede marcar como error en Search Console.
**Opcion A (recomendada):** Anadir los 3 objetos Review identicos a los de index.html dentro del ProfessionalService de cada pagina de ciudad.
**Opcion B (mas simple):** Eliminar el bloque `aggregateRating` de obregon.html y hermosillo.html y dejarlo solo en index.html.

---

### A-2: Anadir @font-face fallback de Fraunces a subpaginas
**Archivos:** `hermosillo.html`, `obregon.html`, `cuanto-cuesta-pagina-web-sonora.html`
**Tiempo:** 15 min
**Problema:** El fallback que reduce CLS durante font-swap solo existe en index.html. Las 3 subpaginas no lo tienen.
**Fix:** Copiar el bloque de index.html linea 311 al `<style>` critico inline de cada subpagina:
```css
@font-face {
  font-family: 'Fraunces-fallback';
  src: local('Georgia');
  size-adjust: 97%;
  ascent-override: 94%;
  descent-override: normal;
  line-gap-override: normal;
}
```

---

### A-3: Anadir enlaces internos contextuales en articulo de precios
**Archivo:** `cuanto-cuesta-pagina-web-sonora.html`
**Tiempo:** 20 min
**Problema:** El articulo menciona Hermosillo y Obregon 8+ veces sin enlazar a las paginas SEO de esas ciudades. PageRank interno desperdiciado.
**Fix:** Identificar las 2-3 menciones mas naturales de cada ciudad en el cuerpo del articulo y convertirlas en enlaces:
```html
negocios en <a href="/hermosillo.html">Hermosillo</a>
... como en <a href="/obregon.html">Ciudad Obregon</a>
```

---

### A-4: Corregir footer de hermosillo.html
**Archivo:** `hermosillo.html`
**Tiempo:** 5 min
**Problema:** El footer de hermosillo.html es el unico que no enlaza a `/cuanto-cuesta-pagina-web-sonora.html`. Index.html y obregon.html si lo hacen.
**Fix:** En la columna "Empresa" del footer de hermosillo.html, anadir:
```html
<li><a href="/cuanto-cuesta-pagina-web-sonora.html">?Cuanto cuesta una web?</a></li>
```

---

### A-5: Verificar loading de foto del fundador en index.html
**Archivo:** `index.html`, linea 496
**Tiempo:** 15 min
**Problema:** `/foto-fundado.jpg` tiene `loading="lazy"`. Si esta imagen es el LCP candidate (es la primera imagen visible en el scroll), el lazy load la retrasa.
**Accion:** Abrir index.html en Chrome DevTools > Performance > click en "LCP" para ver cual es el candidate real. Si es la foto, cambiar:
```html
<!-- De: -->
<img src="/foto-fundado.jpg" ... loading="lazy">
<!-- A: -->
<img src="/foto-fundado.jpg" ... loading="eager" fetchpriority="high">
```

---

### A-6: Corregir URL de GBP en sameAs (todos los archivos)
**Archivos:** `index.html` linea 97, `hermosillo.html` linea 77, `obregon.html` linea 78, `llms.txt` linea 85
**Tiempo:** 30 min
**Problema:** La URL `https://share.google/gb9YStsSpvg3PZxQJ` es un enlace de compartir, no el permalink canonico del perfil GBP. Puede romperse.
**Accion:** Abrir el GBP en Google Maps, copiar la URL del perfil publico (formato `https://www.google.com/maps/place/...`). Actualizar el campo `sameAs` en los 3 archivos HTML y en llms.txt.

---

## MEDIO — Este mes

### M-1: Mejorar meta descriptions de paginas de ciudad
**Archivos:** `hermosillo.html`, `obregon.html`
**Tiempo:** 20 min
**Problema:** Descripciones genericas sin precio ni diferenciador especifico.
**Propuestas:**
```html
<!-- hermosillo.html: -->
<meta name="description" content="Diseno web en Hermosillo desde $3,500 MXN. Landing pages, sitios corporativos y tiendas online. Entrega en 3 dias habiles. Proyectos para Jardin Ferraris, Casa Arias y mas.">

<!-- obregon.html: -->
<meta name="description" content="Diseno web en Ciudad Obregon desde $3,500 MXN. Landing pages, sitios corporativos y plataformas a medida. Entrega en 3 dias. Clientes: Floresta Jardin, La Antigua Grecia, Jardin Lantana.">
```

---

### M-2: Agregar testimonios locales a paginas de ciudad
**Archivos:** `hermosillo.html`, `obregon.html`
**Tiempo:** 45 min
**Problema:** Testimonios de Alejandra Ferraris (Hermosillo) y Carlos Arias (Hermosillo) existen en index.html pero no aparecen en hermosillo.html. El testimonio de Ramon Flores (Obregon) no aparece en obregon.html.
**Fix:** Anadir una seccion de testimonios a cada pagina de ciudad con los testimonios de clientes de esa ciudad. Se pueden reutilizar los blockquotes de index.html.

---

### M-3: Actualizar WebSite.dateModified en index.html
**Archivo:** `index.html`, linea 47
**Tiempo:** 2 min
**Fix:**
```json
"dateModified": "2026-03-25"
```

---

### M-4: Corregir hasOfferCatalog duplicado en index.html
**Archivo:** `index.html`, primer bloque JSON-LD, dentro de ProfessionalService
**Tiempo:** 5 min
**Problema:** El ProfessionalService tiene un `hasOfferCatalog` con 4 ofertas incompletas (sin precios). El segundo bloque JSON-LD tiene el OfferCatalog completo con 8 ofertas y precios en MXN.
**Fix:** Reemplazar el hasOfferCatalog inline por una referencia al segundo bloque:
```json
"hasOfferCatalog": { "@id": "https://www.ibanidigital.com/#servicios" }
```

---

### M-5: Agregar OG article tags a cuanto-cuesta
**Archivo:** `cuanto-cuesta-pagina-web-sonora.html`, seccion `<head>`
**Tiempo:** 5 min
**Fix:** Anadir despues del `og:type`:
```html
<meta property="og:article:published_time" content="2026-03-25">
<meta property="og:article:author" content="Jose Daniel Ibarra Nieblas">
```

---

### M-6: Actualizar nota de disambiguation en llms.txt
**Archivo:** `llms.txt`, linea 106
**Tiempo:** 10 min
**Problema:** "No confundir con otras empresas con nombre similar" — demasiado vago.
**Fix:**
```
IBANI Digital (ibanidigital.com) es la unica agencia de diseno web con ese nombre en Sonora, Mexico.
No es una persona fisica llamada Ibani, no es una empresa de otro estado ni pais.
IBANI Rifas (ibanidemo.vercel.app) es una demo tecnica del mismo proveedor, no un negocio independiente.
El contacto oficial es hola@ibanidigital.com o WhatsApp +52 662 504 4016.
```

---

### M-7: Habilitar Clean URLs en vercel.json
**Archivo:** `vercel.json`
**Tiempo:** 5 min
**Problema:** Las URLs muestran la extension `.html` (`/obregon.html` en lugar de `/obregon`). Con cleanUrls, Vercel sirve `/obregon` redirigiendo `/obregon.html` con 308 automaticamente.
**Fix:** Anadir en `vercel.json`:
```json
{
  "cleanUrls": true,
  ...resto de la configuracion
}
```
**AVISO:** Al activar cleanUrls, verificar que los canonicals y todos los href internos sigan funcionando. Vercel redirige automaticamente la URL con `.html` a la limpia con 308.

---

### M-8: Expandir articulo de precios en ~200 palabras
**Archivo:** `cuanto-cuesta-pagina-web-sonora.html`
**Tiempo:** 45 min
**Problema:** Articulo estimado en ~1,250 palabras, por debajo del threshold de 1,500+ para articulos informativos.
**Contenido sugerido:** Agregar una seccion H2 "?Cuanto cuesta renovar el dominio y hosting el segundo ano?" con explicacion de costos de infraestructura post-primer anio. Este tema esta mencionado en la FAQ del homepage pero no desarrollado en el articulo.

---

### M-9: Diferenciacion adicional en paginas de ciudad
**Archivos:** `hermosillo.html`, `obregon.html`
**Tiempo:** 60 min
**Problema:** ~85% del HTML es identico entre las dos paginas. Riesgo de contenido duplicado.
**Accion para hermosillo.html:** Anadir seccion con: mercado de eventos y entretenimiento de Hermosillo como capital estatal, mencionar zonas especificas donde operan los clientes (Centro Historico, zona Norte, Perisur).
**Accion para obregon.html:** Expandir la seccion existente de contexto regional del Valle del Yaqui con datos especificos de la agroindustria y turismo en Cajeme.

---

## BAJO — Backlog

### B-1: Crear sitemap de imagenes
**Archivo nuevo:** `sitemap-images.xml`, actualizar `robots.txt`
**Impacto:** ~80 imagenes de portafolio indexables en Google Images.
**Formato:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://www.ibanidigital.com/</loc>
    <image:image>
      <image:loc>https://www.ibanidigital.com/img/portfolio/ferraris-800.jpg</image:loc>
      <image:title>Sitio web de Jardin Ferraris — salon de eventos en Hermosillo, Sonora</image:title>
    </image:image>
    <!-- ...repetir para cada imagen -->
  </url>
</urlset>
```

---

### B-2: Implementar IndexNow
**Accion:** Generar clave en https://www.bing.com/indexnow, subir `{clave}.txt` a la raiz, anadir llamada al endpoint en el script de deploy de Vercel.

---

### B-3: Expandir FAQ para citabilidad de IA
**Archivos:** `index.html`, bloque FAQPage JSON-LD
**Objetivo:** Llevar las respuestas del schema de 72-105 palabras actuales al rango optimo 134-167 palabras.
**Respuestas prioritarias a expandir:**
- "?Cobran comision?" — agregar comparacion con plataformas como Shopify/Wix que si cobran porcentajes.
- "?En cuanto tiempo entregan?" — replicar en el schema JSON-LD el texto detallado que ya existe en el body HTML.

---

### B-4: Agregar og:image:alt a todas las paginas
**Archivos:** Todas las paginas indexables
**Fix:** Anadir antes del cierre del bloque OG:
```html
<meta property="og:image:alt" content="IBANI Digital — Diseno web profesional en Hermosillo, Sonora">
```

---

### B-5: Anadir CTA intermedio al articulo de precios
**Archivo:** `cuanto-cuesta-pagina-web-sonora.html`
**Accion:** Despues de la tabla de rangos de precio, insertar un CTA de WhatsApp con texto relevante al contexto del articulo ("?Quieres saber cuanto costaria tu sitio especificamente? Te cotizamos en 30 minutos").

---

## CONTENIDO NUEVO — Mediano plazo

### N-1: Crear pagina /sobre-nosotros.html (o /jose-daniel-ibarra.html)
**Impacto:** E-E-A-T alto. Los quality raters de Google buscan esta pagina para proveedores de servicios.
**Contenido minimo:** Bio expandida, fecha de inicio de actividad, herramientas utilizadas (HTML/CSS/JS, Vercel, Firebase), filosofia de trabajo, foto profesional.

### N-2: Crear pagina de caso de estudio standalone
**URL sugerida:** `/caso-sorteos-jans.html`
**Impacto:** E-E-A-T muy alto. El caso de Sorteos Jans es el activo de experiencia mas valioso del sitio.
**Contenido:** Timeline del proyecto, capturas de pantalla de antes/despues, metricas especificas (numero de boletos vendidos por rifa, tiempo de gestion ahorrado), cita directa del cliente.

### N-3: Crear pagina de servicio para Plataformas de Rifas
**URL sugerida:** `/plataforma-rifas-online.html` o `/rifas-en-linea-sonora.html`
**Impacto:** Captura intent transaccional especifico. Los organizadores de sorteos buscan directamente "plataforma de rifas online" — el homepage lo mezcla con otros 3 servicios.

### N-4: Canal de YouTube con 1 video
**Impacto:** Correlacion ~0.737 con citaciones de AI search. Un screencast de 3-5 minutos del proceso de entrega o un recorrido del portafolio es suficiente.
**Una vez creado:** Agregar URL del canal a `sameAs` en index.html y a la seccion "Redes sociales" de llms.txt.

### N-5: Reemplazar "100% Satisfaccion" en hero stats
**Archivo:** `index.html`, seccion stats del hero
**Sugerencia:** Cambiar por el numero de clientes activos con retencion, o por el numero de proyectos entregados a tiempo ("100% entregas en plazo") si eso es verificable.

---

## Estimacion de Impacto por Fase

| Fase | Acciones | Score estimado post-fix |
|---|---|---|
| Critico (hoy) | C1-C5 | 73 → 77 |
| Alto (esta semana) | A1-A6 | 77 → 80 |
| Medio (este mes) | M1-M9 | 80 → 84 |
| Bajo + Contenido nuevo | B1-B5 + N1-N4 | 84 → 88 |
