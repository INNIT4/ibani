# Auditoria SEO Completa — ibanidigital.com
**Fecha:** 25 de marzo de 2026
**Herramienta:** Claude Code SEO Audit (6 subagentes paralelos)
**Paginas analizadas:** 5 (index, hermosillo, obregon, cuanto-cuesta, privacidad)
**Stack:** HTML/CSS/JS estatico, Vercel, sin framework

---

## SEO Health Score Global: 73 / 100

| Categoria | Peso | Puntuacion | Ponderado |
|---|---|---|---|
| Technical SEO | 25% | 74/100 | 18.5 |
| Content Quality & E-E-A-T | 25% | 71/100 | 17.75 |
| On-Page SEO | 20% | 76/100 | 15.2 |
| Schema / Structured Data | 10% | 72/100 | 7.2 |
| Performance (CWV) | 10% | 62/100 | 6.2 |
| Imagenes | 5% | 82/100 | 4.1 |
| AI Search Readiness (GEO) | 5% | 71/100 | 3.55 |
| **TOTAL** | | | **72.5 / 100** |

---

## Tipo de negocio detectado

Agencia de diseno web unipersonal — ProfessionalService / LocalBusiness con area de servicio principal en Hermosillo y Ciudad Obregon, Sonora, Mexico. Mercado objetivo: negocios locales (salones de eventos, tiendas online, plataformas de sorteos). Fundador visible: Jose Daniel Ibarra Nieblas. Precios desde $3,500 MXN.

---

## Top 5 Problemas Criticos

1. **Meta description de index.html dice "desde $9,000 MXN"** cuando el precio real de entrada es $3,500 MXN — misleads usuarios, motores de busqueda y crawlers de IA.
2. **Google Fonts render-blocking en hermosillo.html** — falta `media="print" onload`. Bloquea el render directamente, penaliza LCP y FCP.
3. **Google Fonts render-blocking en cuanto-cuesta-pagina-web-sonora.html** — mismo problema. Carga bloqueante en la pagina con mayor potencial editorial.
4. **AggregateRating en paginas de ciudad sin objetos Review** — obregon.html y hermosillo.html declaran un rating de 5 estrellas sin incluir los reviews que lo sustentan. Google puede marcar esto como error de schema en Search Console.
5. **BlogPosting sin propiedad `image`** — el articulo de precios no puede aparecer como Article rich result ni en Google Discover sin esta propiedad.

---

## Top 5 Quick Wins (menos de 30 min cada uno)

1. **Corregir meta description en index.html** — cambiar "desde $9,000 MXN" por "desde $3,500 MXN". 5 minutos. Impacto: CTR, confianza, precision en AI search.
2. **Corregir Google Fonts en hermosillo.html** — anadir `media="print" onload="this.media='all'"`. 2 minutos. Impacto: LCP/FCP directo.
3. **Corregir Google Fonts en cuanto-cuesta-pagina-web-sonora.html** — mismo fix. 2 minutos.
4. **Anadir `noindex, nofollow` a og-image.html** — evita que se indexe una pagina de plantilla sin contenido util. 2 minutos.
5. **Anadir `image` al schema BlogPosting** en cuanto-cuesta-pagina-web-sonora.html. 10 minutos. Desbloquea Article rich results.

---

## 1. Technical SEO — 74/100

### 1.1 Rastreabilidad

**Estado: PASS**

- `robots.txt` bien configurado: permite todos los bots, lista explicitamente GPTBot, ClaudeBot, OAI-SearchBot, PerplexityBot.
- Directiva `Llms-txt: https://www.ibanidigital.com/llms.txt` presente — practica de vanguardia.
- Sitemap referenciado correctamente.
- WARN: `og-image.html` en la raiz no tiene `noindex` — plantilla de generacion de imagen OG, no deberia indexarse.

### 1.2 Indexabilidad

**Estado: PASS con observaciones**

- Canonicals correctos en las 5 paginas.
- `privacidad.html` tiene `noindex, follow` — correcto.
- www vs non-www: Vercel deberia manejar esto automaticamente pero no se pudo verificar sin curl live.
- **WARN:** hermosillo.html y obregon.html comparten ~85% de estructura HTML identica. El contenido diferenciado (portafolio local, textos geo-especificos) es suficiente para evitar doorway page, pero es ajustado.

### 1.3 Seguridad

**Estado: PASS**

- HTTPS + HSTS con `max-age=63072000; includeSubDomains; preload` — configuracion optima.
- CSP presente en vercel.json con `frame-ancestors 'none'`, `default-src 'self'`.
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`.
- WARN menor: CSP usa `'unsafe-inline'` en `style-src` (necesario para los estilos inline del HTML). No critico pero reduce la proteccion XSS.
- LOW: Ausente `X-XSS-Protection` — deprecado pero algunos scanners lo senalan.

### 1.4 Estructura de URLs

**Estado: WARN**

- Todas las subpaginas exponen `.html` en la URL (`/obregon.html`, `/hermosillo.html`).
- `vercel.json` no tiene `"cleanUrls": true` — las URLs limpias (`/obregon`) son mas shareables.
- La URL del articulo (`/cuanto-cuesta-pagina-web-sonora.html`) es descriptiva con keywords — buen trabajo.

### 1.5 Rendimiento y Core Web Vitals (senales desde HTML)

**Estado: WARN — 2 problemas criticos**

**LCP:**
- index.html: Fuentes no bloqueantes (media="print" onload + preload woff2 + preconnect). Excelente. CSS critico inline. JS con `defer`.
- **CRITICO — hermosillo.html:** Google Fonts cargadas con `<link rel="stylesheet">` directo sin `media="print"` — RENDER-BLOCKING. Linea 140.
- **CRITICO — cuanto-cuesta-pagina-web-sonora.html:** Mismo problema. Linea 95.
- `obregon.html` y `privacidad.html`: Fuentes con patron correcto.
- WARN: `/foto-fundado.jpg` (foto del fundador, above-the-fold en desktop) tiene `loading="lazy"`. Si es el LCP candidate real, esto lo retrasa. Verificar en DevTools.

**CLS:**
- Imagenes de portafolio tienen `width` y `height` explicitos — PASS.
- Bloque `@font-face` de Fraunces fallback con `size-adjust: 97%` solo existe en `index.html`. Ausente en las 3 subpaginas. Sin el fallback, el font-swap genera CLS mayor.

**Imagenes:**
- Formato: Portfolio usa `<picture>` con AVIF > WebP > JPG, srcset 400w/800w, lazy loading — excelente.
- WARN: No hay sitemap de imagenes. El portafolio tiene ~80 imagenes relevantes para busquedas de imagen.

### 1.6 JavaScript Rendering

**Estado: PASS**

- HTML completamente pre-renderizado (SSR estatico). Googlebot puede indexar todo sin ejecutar JS.
- `js/main.min.js` cargado con `defer` en todas las paginas.
- Plausible Analytics con `defer` — no bloquea render.

### 1.7 Estructura de Encabezados

**Estado: PASS**

| Pagina | H1 | H2 count | Issues |
|---|---|---|---|
| index.html | "Paginas web que trabajan por tu negocio" (aria-label correcto) | 8 | Ninguno |
| hermosillo.html | "Diseno web en Hermosillo" | 4 | Ninguno |
| obregon.html | "Diseno web en Ciudad Obregon" | 5 | Ninguno |
| cuanto-cuesta | "?Cuanto cuesta una pagina web para negocio local en Sonora? (2026)" | 6 | Ninguno |

### 1.8 Enlazado Interno

**Estado: WARN — oportunidades perdidas**

- index → hermosillo, obregon, cuanto-cuesta: PASS (footer).
- hermosillo ↔ obregon: PASS (footer mutuo).
- **MISS:** `cuanto-cuesta-pagina-web-sonora.html` menciona Hermosillo y Obregon 8+ veces sin enlazar a sus paginas SEO dedicadas.
- **MISS:** Footer de `hermosillo.html` no enlaza a `/cuanto-cuesta-pagina-web-sonora.html` (footer de index y obregon si lo hacen).
- Todos los links externos usan `rel="noopener noreferrer"` — correcto.
- WARN: URLs de portafolio de clientes (ferraris.web.app, casaarias.web.app, etc.) estan en Firebase Hosting de los clientes — si cancela el cliente, el link 404 sin control de IBANI.

### 1.9 Open Graph y Social

**Estado: PASS con observaciones**

- OG tags completos en todas las paginas.
- Twitter/X cards presentes.
- og:image (1200x630 JPEG) correcta en todas las paginas.
- **MEDIUM:** `cuanto-cuesta-pagina-web-sonora.html` tiene `og:type="article"` pero falta `og:article:published_time` y `og:article:author`.
- **LOW:** Ninguna pagina tiene `og:image:alt`.

### 1.10 IndexNow

**Estado: NO IMPLEMENTADO (LOW)**

No hay clave IndexNow en la raiz ni llamadas al endpoint. Implementacion sencilla via script post-deploy en Vercel para notificar a Bing/Yandex/Naver.

---

## 2. Content Quality & E-E-A-T — 71/100

### 2.1 Puntuaciones por Pagina

| Pagina | Contenido | E-E-A-T | AI Citabilidad |
|---|---|---|---|
| index.html | 78/100 | 74/100 | 72/100 |
| hermosillo.html | 61/100 | 58/100 | 55/100 |
| obregon.html | 63/100 | 60/100 | 57/100 |
| cuanto-cuesta | 82/100 | 76/100 | 85/100 |

### 2.2 Senales E-E-A-T Fuertes

- Fundador nombrado con foto, LinkedIn, bio personal.
- 10 proyectos de portafolio con URLs verificables publicamente.
- Caso de estudio estructurado (Sorteos Jans: problema/solucion/resultado).
- 3 testimonios con fechas, nombre completo y negocio del cliente.
- Precios especificos y transparentes, incluyendo costos de infraestructura.
- FAQ extenso con 6 preguntas y respuestas detalladas.
- Google Business Profile activo.
- Schema `Person` con LinkedIn.

### 2.3 Debilidades E-E-A-T

- Testimonios con 13-14 meses de antiguedad (enero-febrero 2025). Reviews viejos se deprecian.
- Solo 3 testimonios — bajo para construir autoridad.
- Sin certificaciones, premios ni menciones en medios externos.
- Sin pagina `/sobre-nosotros.html` — quality raters notan la ausencia para un proveedor de servicios individual.
- "100% Satisfaccion" en las estadisticas del hero es afirmacion no verificable.
- No hay metricas cuantificadas en el caso de estudio (% de boletos vendidos, tiempo ahorrado).

### 2.4 Unicidad de Contenido entre Paginas de Ciudad

**WARN — alta similitud entre hermosillo.html y obregon.html**

Los bloques identicos (palabra por palabra) representan aproximadamente el 60% del cuerpo visible:
- Hero subtitle con solo el nombre de ciudad cambiado.
- Tarjetas de ventajas competitivas.
- CTA final.
- Secciones de servicios (4 filas).
- FAQ con respuestas casi identicas.

El contenido diferenciado (portafolio con proyectos distintos por ciudad, seccion de contexto regional) representa ~40% y es genuinamente unico. Riesgo de doorway page: BAJO pero real. Se recomienda anadir al menos 2-3 parrafos de texto unico por pagina.

### 2.5 Keyword Targeting

| KW Principal | Pagina | Cobertura | Gaps |
|---|---|---|---|
| "diseno web en Hermosillo" | hermosillo.html | Titulo, H1, meta, schema, cuerpo | "agencia web Hermosillo", "crear pagina web Hermosillo" |
| "diseno web en Ciudad Obregon" | obregon.html | Titulo, H1, meta, schema, cuerpo | "agencia web Obregon", KW precio Obregon en headings |
| "cuanto cuesta una pagina web en Sonora" | cuanto-cuesta | Titulo, H1, meta, schema, cuerpo | Sin fuentes externas para respaldo de rangos de precio |
| "diseno web en Sonora" | index.html | Hero, H2 servicios, schema | Profundidad editorial insuficiente para competir vs. paginas dedicadas |

### 2.6 Contenido Faltante — Prioridad Alta

1. **Pagina standalone de caso de estudio** (Sorteos Jans) con metricas especificas — activo de E-E-A-T mas valioso posible.
2. **Testimonios de clientes locales en sus paginas de ciudad** — Alejandra Ferraris y Carlos Arias son de Hermosillo pero no aparecen en hermosillo.html. Ramon Flores es de Obregon pero no aparece en obregon.html.
3. **Expandir cuanto-cuesta ~200 palabras** — articulo esta ~1,250 palabras vs. threshold recomendado de 1,500+. Gap tematico: comparacion "por proyecto" vs. "suscripcion mensual" y costo real del segundo ano.
4. **Pagina de servicio dedicada a Plataformas de Rifas** — es el producto mas diferenciado del portafolio.
5. **Pagina /sobre-nosotros.html** con bio expandida, fecha de fundacion, herramientas, filosofia.

### 2.7 Legibilidad

- Espanol correcto, natural y adecuado para el publico objetivo (negocios locales en Sonora).
- Oraciones cortas, vocabulario accesible, tono de primera persona autentico.
- Las listas con negritas al inicio son faciles de escanear.
- Ninguna pagina muestra patrones tipicos de contenido AI de baja calidad.

---

## 3. On-Page SEO — 76/100

### 3.1 Titulos

| Pagina | Titulo | Chars | Evaluacion |
|---|---|---|---|
| index.html | "IBANI Digital — Diseno Web para Negocios en Sonora" | 51 | PASS — dentro del rango 50-60 chars |
| hermosillo.html | "Diseno Web en Hermosillo — IBANI Digital" | 41 | PASS |
| obregon.html | "Diseno Web en Ciudad Obregon — IBANI Digital" | 45 | PASS |
| cuanto-cuesta | "?Cuanto cuesta una pagina web en Sonora? (2026) — IBANI Digital" | 63 | WARN — levemente largo |
| privacidad.html | N/A (noindex) | - | N/A |

### 3.2 Meta Descriptions

| Pagina | Meta Description | Evaluacion |
|---|---|---|
| index.html | "Diseno web en Hermosillo y Sonora: landing pages, tiendas online y sitios corporativos **desde $9,000 MXN**." | **CRITICO — precio incorrecto. El plan Basico es $3,500 MXN, no $9,000 MXN.** |
| hermosillo.html | "Diseno y desarrollo web profesional para negocios en Hermosillo, capital de Sonora." | WARN — generica, sin precio ni diferenciador |
| obregon.html | "Diseno y desarrollo web profesional para negocios en Ciudad Obregon, Sonora." | WARN — identica estructura a hermosillo, sin precio |
| cuanto-cuesta | "Guia completa de precios para paginas web en Sonora en 2026..." | PASS |

### 3.3 Enlazado Interno — Mapa Completo

```
/ (index)
├── /hermosillo.html [footer]
├── /obregon.html [footer]
├── /cuanto-cuesta-pagina-web-sonora.html [footer]
└── /privacidad.html [footer]

/hermosillo.html
├── / [header logo]
├── /obregon.html [footer]
├── /privacidad.html [footer]
└── [MISS] /cuanto-cuesta-pagina-web-sonora.html — ausente en footer

/obregon.html
├── / [header logo]
├── /hermosillo.html [footer]
├── /cuanto-cuesta-pagina-web-sonora.html [footer]
└── /privacidad.html [footer]

/cuanto-cuesta-pagina-web-sonora.html
├── / [header logo + breadcrumb]
├── /hermosillo.html [footer]
├── /obregon.html [footer]
└── [MISS] sin enlaces contextuales dentro del cuerpo del articulo
```

---

## 4. Schema / Structured Data — 72/100

### 4.1 Inventario

| Archivo | Tipos de schema presentes |
|---|---|
| index.html | WebSite, Person, ProfessionalService (con AggregateRating + 3 Review + OpeningHours + OfferCatalog), FAQPage (6Q), ItemList (10 proyectos), OfferCatalog (8 ofertas con precios en MXN) |
| hermosillo.html | WebPage, ProfessionalService (con AggregateRating), BreadcrumbList, FAQPage (3Q) |
| obregon.html | WebPage, ProfessionalService (con AggregateRating), BreadcrumbList, FAQPage (3Q) |
| cuanto-cuesta | BlogPosting, BreadcrumbList, FAQPage (3Q) |

### 4.2 Problemas por Severidad

**CRITICO:**

- **C1: AggregateRating sin Review objects en paginas de ciudad.** obregon.html y hermosillo.html declaran `aggregateRating` (5 estrellas, 3 reviews) sin incluir los objetos `Review`. Google puede marcar esto como error en Search Console y desactivar el rich snippet de estrellas. Fix: anadir los 3 objetos Review (identicos a los de index.html) o eliminar el `aggregateRating` de las paginas locales.

**ADVERTENCIA:**

- **W1: BlogPosting sin propiedad `image`** — requerida por Google para eligibilidad en Article rich results y Google Discover. Fix: anadir `"image": { "@type": "ImageObject", "url": "https://www.ibanidigital.com/og-image.jpg", "width": 1200, "height": 630 }`.
- **W2: `hasOfferCatalog` duplicado en ProfessionalService de index.html** — el primer bloque tiene 4 ofertas sin precios; el segundo bloque tiene un OfferCatalog completo con 8 ofertas y precios. Fix: reemplazar el `hasOfferCatalog` inline del primer bloque por `"hasOfferCatalog": { "@id": "https://www.ibanidigital.com/#servicios" }`.
- **W3: `Person.image` como string URL**, no como `ImageObject`. Google prefiere el objeto completo con dimensiones.
- **W4: `WebSite.dateModified` dice `2026-03-21`** pero el sitemap y los archivos tienen `2026-03-25`. Actualizar.
- **W5: FAQPage comercial no genera rich results** en Google desde agosto 2023 (solo govs/salud). El schema es valido y util para GEO/AI search, pero no aparecera como accordion en SERPs.

**INFO:**

- `foto-fundado.jpg` — confirmado que el archivo existe con ese nombre. No es un typo.
- La URL del GBP en `sameAs` (`https://share.google/gb9YStsSpvg3PZxQJ`) es un enlace de compartir, no el permalink canonico. Si Google rota esa URL, el schema pierde la conexion al GBP. Obtener la URL de formato `https://www.google.com/maps/place/?q=place_id:XXXX`.
- FAQPage sin `@id` en paginas de ciudad y articulo — menor, facilita referencias futuras pero no es urgente.

### 4.3 Lo que funciona bien

- Schema `@graph` con IDs (`#website`, `#business`, `#founder`) que permiten referencias cruzadas correctas entre bloques.
- OfferCatalog con precios exactos en MXN — inusualmente completo para un negocio local.
- ItemList de portafolio con 10 items y LocalBusiness anidado.
- `areaServed` con tres entidades: Hermosillo, Ciudad Obregon, Sonora.
- `openingHoursSpecification` correcto.
- `aggregateRating` con `review` objects en index.html — autenticidad reforzada porque los nombres de clientes coinciden con proyectos del portafolio.
- BreadcrumbList en todas las subpaginas.
- BlogPosting con `author` y `publisher` referenciando las entidades del grafo principal.

---

## 5. Performance / Core Web Vitals — 62/100

### 5.1 Estado por Pagina

| Pagina | Fonts blocking | JS blocking | @font-face fallback | LCP candidate |
|---|---|---|---|---|
| index.html | NO (media=print onload) | NO (defer) | SI | H1 o foto-fundado.jpg (lazy — WARN) |
| hermosillo.html | **SI — CRITICO** | NO (defer) | NO | H1 probablemente |
| obregon.html | NO | NO (defer) | NO | H1 probablemente |
| cuanto-cuesta | **SI — CRITICO** | NO (defer) | NO | H1 probablemente |
| privacidad.html | NO | NO | — | — |

### 5.2 Recomendaciones de Performance

1. Fix render-blocking en hermosillo.html (linea 140):
   ```html
   <!-- Cambiar esto: -->
   <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
   <!-- Por esto: -->
   <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet" media="print" onload="this.media='all'">
   <noscript><link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet"></noscript>
   ```

2. Mismo fix en cuanto-cuesta-pagina-web-sonora.html (linea 95).

3. Anadir bloque `@font-face` fallback de Fraunces (que esta en index.html linea 311) al `<style>` critico inline de las 3 subpaginas.

4. Verificar si `/foto-fundado.jpg` en index.html es el LCP candidate con DevTools. Si lo es, cambiar a `loading="eager" fetchpriority="high"`.

---

## 6. Imagenes — 82/100

### 6.1 Fortalezas

- Portfolio: `<picture>` con AVIF > WebP > JPG, srcset 400w/800w, `lazy loading`, `width` y `height` explicitos. Excelente practica.
- Foto del fundador: dimensiones especificadas (399x399), `loading="lazy"` (ver advertencia en LCP).
- `og-image.jpg` presente y correctamente dimensionada (1200x630).

### 6.2 Problemas

- No hay sitemap de imagenes. Con ~80 imagenes de portafolio, un `sitemap-images.xml` mejoraria la visibilidad en Google Images.
- `og-image.html` (plantilla generadora) no tiene `noindex` — puede indexarse como pagina sin contenido util.
- `og:image:alt` ausente en todas las paginas — recomendado por Open Graph spec.

---

## 7. AI Search Readiness (GEO) — 71/100

### 7.1 Score por Dimension

| Dimension | Score | Nota |
|---|---|---|
| Accesibilidad tecnica para IA | 90/100 | HTML estatico, todos los crawlers permitidos, schemas completos |
| Legibilidad estructural | 82/100 | FAQ bien estructuradas, precios especificos, schema JSON-LD |
| Citabilidad (passage-level) | 76/100 | Pasajes con hechos especificos pero algo cortos para el rango optimo 134-167 palabras |
| Autoridad y senales de marca | 58/100 | Sin YouTube, GBP URL fragil, solo 3 reviews, sin menciones externas |
| Contenido multi-modal | 42/100 | Sin video, sin infografias, sin contenido comparativo estructurado |

### 7.2 llms.txt — Evaluacion

**Muy bueno** — de los mejores para un negocio local en Mexico:
- Bloque descriptivo inicial denso en hechos (47 palabras con precio, entrega, contacto, sede, especialidades).
- Precios listados para todos los niveles de servicio.
- Portafolio de 10 clientes con URLs.
- Testimonios con nombre y negocio atribuido.
- Seccion "Notas para sistemas de IA" con licencia explicita.
- Fecha de actualizacion coincide con sitemap — consistencia valorada por modelos.

**Problemas:**
- Nota de disambiguation demasiado vaga: "No confundir con otras empresas con nombre similar" sin especificar cuales. Un modelo no puede resolver la ambiguedad con esta instruccion.
- Estadisticas como bullets cortos (1 linea cada uno) — un parrafo cohesivo de ~140 palabras seria mas citable.
- `privacidad.html` listada en "Paginas disponibles" — no aporta citabilidad, se puede omitir.

### 7.3 Cobertura de Consultas Comunes de IA

| Consulta | Cobertura | Calidad |
|---|---|---|
| "?Cuanto cuesta una pagina web en Hermosillo?" | SI — FAQ schema + llms.txt | Excelente |
| "?En cuanto tiempo hacen una pagina web?" | SI — FAQ schema + llms.txt | Excelente |
| "?Cobran comision sobre ventas?" | SI — FAQ schema + llms.txt | Excelente |
| "?Cual es el proceso de trabajo?" | SI — proceso 4 pasos + llms.txt | Muy bueno |
| "?Tienen clientes reales en Sonora?" | SI — ItemList con 10 proyectos | Bueno |
| "?Hacen tiendas con Mercado Pago?" | NO — solo Stripe/Clip/Conekta mencionados | Gap |
| "?Por que elegir IBANI vs Wix?" | Parcial — articulo de precios lo roza | Mejorar |
| "?IBANI Digital vs agencia grande?" | Parcial | Mejorar |

### 7.4 Scores Estimados por Plataforma

| Plataforma | Score | Razon |
|---|---|---|
| Google AIO | 68/100 | FAQPage + GBP, pero sin autoridad externa (YouTube, backlinks) |
| Perplexity | 74/100 | Valora datos numericos especificos y fechas — sitio tiene ambos |
| ChatGPT (busqueda) | 62/100 | Sin YouTube, pocas backlinks, marca reciente |
| Bing Copilot | 70/100 | Valora schema estructurado y SSR — ambos presentes |

### 7.5 Gaps de GEO Prioritarios

1. **Meta description dice "desde $9,000 MXN"** — es lo primero que lee un crawler. Puede citar ese precio incorrecto. Fix inmediato.
2. **Sin presencia en YouTube** — correlacion ~0.737 con citaciones de IA. No requiere produccion profesional.
3. **URL de GBP en `sameAs`** es enlace de compartir (`share.google/...`), no permalink canonico. Puede romperse.
4. **Pasajes de FAQ demasiado cortos** para el rango optimo de citacion (134-167 palabras). Las respuestas actuales tienen 72-105 palabras en schema.
5. **Disambiguation note vaga** en llms.txt.

---

## 8. Sitemap — PASS

- XML valido. 4 URLs correctas.
- `privacidad.html` correctamente excluida (tiene `noindex`).
- `og-image.html` no en sitemap — bien, pero deberia tener `noindex` en el propio HTML.
- `changefreq` y `priority` ausentes — correcto (Google los ignora desde hace varios anos).
- `lastmod` identico para todas las URLs (2026-03-25) — actualizar por pagina cuando cambie el contenido.
- Sitemap referenciado en robots.txt — correcto.
- **MISS menor:** hermosillo.html no enlaza de vuelta al articulo de precios (footer). El articulo enlaza a ambas ciudades pero no recibe el enlace de vuelta desde hermosillo.

---

## 9. Hallazgos por Archivo

### index.html
- CRITICO: meta description precio incorrecto ("$9,000 MXN" en lugar de "$3,500 MXN")
- MEDIUM: `WebSite.dateModified` desactualizado (2026-03-21 en lugar de 2026-03-25)
- MEDIUM: `hasOfferCatalog` duplicado en ProfessionalService
- LOW: `Person.image` como string en lugar de ImageObject con dimensiones
- LOW: `foto-fundado.jpg` tiene `loading="lazy"` — potencial LCP issue si es above-the-fold
- INFO: "100% Satisfaccion" en estadisticas del hero — afirmacion sin respaldo

### hermosillo.html
- CRITICO: Google Fonts render-blocking (linea 140)
- CRITICO: `AggregateRating` sin objetos `Review`
- MEDIUM: Footer no enlaza a `/cuanto-cuesta-pagina-web-sonora.html`
- MEDIUM: Sin @font-face fallback de Fraunces
- MEDIUM: Meta description generica sin precio ni diferenciador fuerte
- MEDIUM: Sin testimonios de clientes hermosillenses (Alejandra Ferraris, Carlos Arias estan en index.html pero no aqui)

### obregon.html
- CRITICO: `AggregateRating` sin objetos `Review`
- MEDIUM: Sin @font-face fallback de Fraunces
- MEDIUM: Meta description generica
- MEDIUM: Sin testimonio de Ramon Flores de Floresta Jardin (existe en index.html, no aqui)
- LOW: `ProfessionalService` sin propiedad `founder`

### cuanto-cuesta-pagina-web-sonora.html
- CRITICO: Google Fonts render-blocking (linea 95)
- HIGH: `BlogPosting` sin propiedad `image` — inelegible para Article rich results
- MEDIUM: Sin @font-face fallback de Fraunces
- MEDIUM: `og:article:published_time` y `og:article:author` ausentes
- MEDIUM: Sin enlaces contextuales a /hermosillo.html y /obregon.html dentro del cuerpo
- LOW: ~1,250 palabras vs. threshold recomendado 1,500+

### og-image.html
- HIGH: Sin `<meta name="robots" content="noindex, nofollow">` — puede indexarse como pagina sin contenido util.

### llms.txt
- MEDIUM: Nota de disambiguation demasiado vaga
- LOW: Estadisticas como bullets cortos en lugar de parrafo cohesivo
- LOW: privacidad.html listada — no aporta citabilidad

### robots.txt
- PASS — sin problemas

### sitemap.xml
- PASS — sin problemas

---

## 10. Resumen de Issues por Severidad

### CRITICOS (5)
| ID | Problema | Archivo | Esfuerzo |
|---|---|---|---|
| C1 | Meta description dice "desde $9,000 MXN" — precio incorrecto | index.html linea 7 | 5 min |
| C2 | Google Fonts render-blocking | hermosillo.html linea 140 | 5 min |
| C3 | Google Fonts render-blocking | cuanto-cuesta linea 95 | 5 min |
| C4 | AggregateRating sin Review objects | obregon.html + hermosillo.html | 30 min |
| C5 | BlogPosting sin propiedad `image` | cuanto-cuesta | 10 min |

### ALTOS (6)
| ID | Problema | Archivo | Esfuerzo |
|---|---|---|---|
| H1 | og-image.html sin noindex | og-image.html | 2 min |
| H2 | @font-face fallback ausente en subpaginas | hermosillo, obregon, cuanto-cuesta | 15 min |
| H3 | foto-fundado.jpg con loading=lazy (posible LCP) | index.html | 5 min + verificar |
| H4 | Sin image sitemap para portfolio de ~80 imagenes | Nuevo archivo | 1-2h |
| H5 | URL GBP en sameAs es enlace de compartir fragil | index, hermosillo, obregon + llms.txt | 30 min |
| H6 | Sin enlaces contextuales en articulo de precios a paginas de ciudad | cuanto-cuesta | 15 min |

### MEDIOS (10)
| ID | Problema | Archivo |
|---|---|---|
| M1 | hasOfferCatalog duplicado en ProfessionalService | index.html |
| M2 | WebSite.dateModified desactualizado | index.html |
| M3 | Footer de hermosillo.html sin enlace al articulo de precios | hermosillo.html |
| M4 | Meta descriptions genericas en paginas de ciudad | hermosillo.html, obregon.html |
| M5 | Testimonios locales ausentes de paginas de ciudad | hermosillo.html, obregon.html |
| M6 | OG article tags incompletos | cuanto-cuesta |
| M7 | Clean URLs no configuradas (.html visible) | vercel.json |
| M8 | Disambiguation vaga en llms.txt | llms.txt |
| M9 | Person.image como string no ImageObject | index.html |
| M10 | Alta similitud estructural entre paginas de ciudad | hermosillo.html, obregon.html |

### BAJOS (8)
| ID | Problema |
|---|---|
| L1 | og:image:alt ausente en todas las paginas |
| L2 | IndexNow no implementado |
| L3 | FAQ passages por debajo de 134-167 palabras optimas para citacion IA |
| L4 | Estadisticas del hero ("100% Satisfaccion") sin respaldo verificable |
| L5 | Sin presencia en YouTube (correlacion alta con citaciones de IA) |
| L6 | Reviews en schema con 13+ meses de antiguedad |
| L7 | Sin pagina /sobre-nosotros.html |
| L8 | Sin pagina de servicio dedicada a Plataformas de Rifas |

---

## Apendice: Paginas Auditadas

| URL | Indexable | En sitemap | Schema |
|---|---|---|---|
| https://www.ibanidigital.com/ | SI | SI | WebSite, Person, ProfessionalService, FAQPage, ItemList, OfferCatalog |
| https://www.ibanidigital.com/hermosillo.html | SI | SI | WebPage, ProfessionalService, BreadcrumbList, FAQPage |
| https://www.ibanidigital.com/obregon.html | SI | SI | WebPage, ProfessionalService, BreadcrumbList, FAQPage |
| https://www.ibanidigital.com/cuanto-cuesta-pagina-web-sonora.html | SI | SI | BlogPosting, BreadcrumbList, FAQPage |
| https://www.ibanidigital.com/privacidad.html | NO (noindex) | NO | — |
| https://www.ibanidigital.com/og-image.html | Sin noindex (BUG) | NO | — |
