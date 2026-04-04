# Reporte SEO Completo — ibanidigital.com
**Score: 76/100** | **Fecha: 1 de abril de 2026** | **Auditoría post-implementación (sesión 2)**

---

## Resumen Ejecutivo

| Categoría | Peso | Score | Aportación |
|---|---|---|---|
| Technical SEO | 25% | 74/100 | 18.5 |
| Content Quality / E-E-A-T | 25% | 72/100 | 18.0 |
| On-Page SEO | 20% | 80/100 | 16.0 |
| Schema / Structured Data | 10% | 65/100 | 6.5 |
| Performance (CWV) | 10% | 82/100 | 8.2 |
| Images | 5% | 80/100 | 4.0 |
| AI Search Readiness | 5% | 75/100 | 3.75 |
| **TOTAL** | 100% | **76/100** | |

**Evolución:** 73 → 76 (+3 puntos). Las páginas nuevas (sobre-nosotros, caso-sorteos-jans, plataforma-rifas-online) y las correcciones C1-C5 / A1-A6 / M1-M9 / B1-B5 elevaron el score. El avance es menor de lo proyectado porque emergieron 3 problemas críticos nuevos no detectados en la primera auditoría.

### Top 5 problemas críticos activos

1. **Sitemap con 3 URLs 404** — `/portafolio`, `/proceso`, `/blog` en sitemap.xml sin archivo HTML correspondiente
2. **3 canonicals rotos en páginas de planes** — `emprendedor-avanzado.html` → canonical `/pyme` (inexistente), `emprendedor-plus.html` → `/microempresa`, `emprendedor-pro.html` → `/negocios`
3. **Propiedad `founder` duplicada en index.html** — JSON-LD inválido; la clave duplicada silencia al primer nodo
4. **14 páginas de planes sin noindex y sin sitemap** — estado de indexabilidad indefinido
5. **CSP bloquea inline event handlers** — `onmouseover`/`onmouseout` en footer de index.html bloqueados por la política propia

---

## TECHNICAL SEO — 74/100

### Críticos

#### C-1: Sitemap con 3 URLs que retornan 404
**Archivo:** `sitemap.xml` líneas 23-34
```xml
<loc>https://www.ibanidigital.com/portafolio</loc>
<loc>https://www.ibanidigital.com/proceso</loc>
<loc>https://www.ibanidigital.com/blog</loc>
```
No existen `portafolio.html`, `proceso.html` ni `blog.html` como archivos independientes. Con `cleanUrls: true`, Vercel retorna 404 para estas URLs. Google ya las tiene en el sitemap y puede intentar indexarlas, recibir 404 y marcarlas como errores en Search Console.

**Fix:** Eliminar las 3 entradas. Si `/portafolio` y `/proceso` son secciones de index.html, los links internos deben apuntar al ancla (`/#portafolio`), no a la URL.

#### C-2: 3 canonicals rotos en servicios/landing-pages/
**Archivos:** `servicios/landing-pages/emprendedor-avanzado.html` (canonical → `/pyme`), `emprendedor-plus.html` (→ `/microempresa`), `emprendedor-pro.html` (→ `/negocios`), `emprendedor-elite.html` (→ `/empresarial`)

Los archivos fueron renombrados en disco pero los canonicals no se actualizaron. El canonical apunta a una URL que no existe → Vercel retorna 404. Google ignora un canonical roto y canonicaliza la URL real — pero la configuración genera señales mixtas.

**Fix:** Actualizar los 4 canonicals:
- `emprendedor-avanzado.html` → `/servicios/landing-pages/emprendedor-avanzado`
- `emprendedor-plus.html` → `/servicios/landing-pages/emprendedor-plus`
- `emprendedor-pro.html` → `/servicios/landing-pages/emprendedor-pro`
- `emprendedor-elite.html` → `/servicios/landing-pages/emprendedor-elite`

### Altos

#### A-1: CSP bloquea inline event handlers en index.html
**Archivo:** `index.html` líneas 855-856 (footer)
La política CSP en `vercel.json` (`script-src 'self' https://plausible.io`) bloquea los atributos `onmouseover`/`onmouseout` en el footer. Los efectos de hover implementados con handlers inline son silenciados en navegadores con CSP estricto.
**Fix:** Mover los efectos hover a CSS puro (`:hover` en `css/components.css`).

#### A-2: 14 páginas de planes sin noindex y sin sitemap
**Archivos:** `servicios/landing-pages/*.html` (6), `servicios/rifas/*.html` (2), `servicios/tiendas/*.html` (4), `servicios/software-administrativo/*.html` (4)
Ninguna tiene `<meta name="robots" content="noindex">` y ninguna está en `sitemap.xml`. Google puede rastrearlas y decidir indexarlas de forma autónoma. Si el contenido es thin, diluye el dominio.
**Fix recomendado:** Agregar `noindex` a todas mientras se evalúa el contenido caso por caso.

#### A-3: 4 páginas de servicio nivel-2 ausentes del sitemap
**Faltantes en sitemap.xml:** `/servicios/landing-pages`, `/servicios/rifas`, `/servicios/tiendas`, `/servicios/software-administrativo`

#### A-4: 2 claves IndexNow en el repo, ninguna en robots.txt
**Archivos:** `361da0c5c6aa49dba10859713f581f5c.txt` (antigua), `e8eed06c576f819a4f9f8391c59421ad.txt` (activa)
IndexNow no funciona operativamente. Bing/Yandex no pueden descubrir el soporte automáticamente.
**Fix:** Eliminar la clave antigua. Agregar a `robots.txt`: `IndexNow-key: https://www.ibanidigital.com/e8eed06c576f819a4f9f8391c59421ad.txt`

#### A-5: `foto-fundado.jpg` en index.html con fetchpriority alto siendo below-the-fold
**Archivo:** `index.html` sección #nosotros
La imagen tiene `loading="eager" fetchpriority="high"` pero está en la segunda sección visible (below-the-fold). El LCP real de index.html es el `<h1>` de texto. El fetchpriority alto compite con recursos críticos del render path.
**Fix:** Cambiar a `loading="lazy"` y eliminar `fetchpriority="high"`.

### Medios

#### M-1: sitemap-images.xml cubre solo la homepage
Todas las imágenes de portafolio están bajo `<loc>https://www.ibanidigital.com/</loc>`. Las páginas `/hermosillo`, `/obregon`, `/caso-sorteos-jans` y `/plataforma-rifas-online` también tienen imágenes relevantes.

#### M-2: Referencia a llms.txt comentada en robots.txt
`# Llms-txt: https://www.ibanidigital.com/llms.txt` — comentada. Si se quiere que crawlers de IA la descubran vía robots.txt, descomentar.

#### M-3: X-Frame-Options inconsistente con frame-ancestors
`vercel.json`: `X-Frame-Options: SAMEORIGIN` (permite iframes del mismo origen) + `frame-ancestors 'none'` (bloquea todos). Contradictorios. Cambiar `X-Frame-Options` a `DENY`.

### Bajos

#### B-1: `changefreq` y `priority` en una sola entrada del sitemap
Solo `/servicios/sitios-corporativos` los tiene. Google los ignora; quitar para consistencia o agregar a todas.

---

## CONTENT QUALITY / E-E-A-T — 72/100

### Score por página
| Página | Score | Palabras | Principal brecha E-E-A-T |
|---|---|---|---|
| index.html | 7.5/10 | ~1,200 | Solo 3 reseñas para 10+ proyectos |
| hermosillo.html | 6.5/10 | ~900 | 65% contenido duplicado con obregon, reseñas no localizadas |
| obregon.html | 6.5/10 | ~900 | Carlos Arias (Hermosillo) en página de Obregón |
| cuanto-cuesta-pagina-web-sonora.html | 8.5/10 | ~1,450 | Sin fuentes externas, precio inconsistente con homepage |
| sobre-nosotros.html | 7.0/10 | ~700 | Sin testimonios visibles, sin credenciales formales |
| caso-sorteos-jans.html | 8.0/10 | ~900 | Sin cita del cliente, sin métricas cuantitativas |
| plataforma-rifas-online.html | 7.0/10 | ~900 | Features sin H3 (semánticamente planas) |

**E-E-A-T global: 69.85/100**
- Experience: 72/100 — proyectos verificables, bio en primera persona, URLs de clientes en vivo
- Expertise: 78/100 — precios concretos, stack técnico, tiempos documentados
- Authoritativeness: 55/100 — **punto más débil**: 3 reseñas, sin menciones de prensa, sin validación del cliente más importante (Sorteos Jans), todo el contenido es autopresentación
- Trustworthiness: 74/100 — contact info completo, HTTPS, aviso de privacidad, horario, LinkedIn

### Críticos de contenido

#### CC-1: Inconsistencia de precios entre artículo y homepage
El artículo muestra "landing page $5,000-$12,000" (rango de mercado) pero el schema del homepage lista el plan Básico de IBANI en $3,500. Un usuario que lee ambas páginas detecta la contradicción. Daña Trustworthiness en el QRG.

#### CC-2: Las mismas 3 reseñas en 4 páginas distintas
`hermosillo.html`, `obregon.html`, `index.html`, `cuanto-cuesta` — mismo bloque de reviews verbatim. Carlos Arias (Casa Arias, Hermosillo) aparece como reviewer en la página de Obregón. Google puede detectar contenido duplicado en datos estructurados.

### Altos de contenido

#### AC-1: Sin cita del cliente en caso-sorteos-jans
Todo el caso de estudio es narrado por el proveedor. Sin una cita directa del organizador de Sorteos Jans, el contenido es autopublicitario. Es el cambio de mayor impacto E-E-A-T disponible en el sitio.

#### AC-2: Features de plataforma-rifas-online sin H3
Las 6 características de la plataforma usan `<p class="obr-card__title">` en lugar de `<h3>`. Son semánticamente invisibles para crawlers y LLMs.

#### AC-3: sobre-nosotros sin testimonios visibles
La página del fundador no tiene prueba social visual. Los testimonios existen solo en JSON-LD de index.html.

---

## SCHEMA / STRUCTURED DATA — 65/100

### Críticos

#### SC-1: Propiedad `founder` duplicada en index.html
**Líneas 96 y 143** del mismo objeto `ProfessionalService`. JSON con clave duplicada: la segunda instancia sobrescribe a la primera silenciosamente. Google Rich Results Test puede marcar el schema como inválido.

### Medios

#### SM-1: Missing `@id` en BreadcrumbList y FAQPage en 6 páginas
`hermosillo.html`, `obregon.html`, `cuanto-cuesta`, `sobre-nosotros`, `caso-sorteos-jans`, `plataforma-rifas-online` — ninguna declara `@id` en sus nodos `BreadcrumbList` ni `FAQPage`. Sin `@id`, los nodos flotan sin conexión explícita a la `WebPage`.

#### SM-2: `hasOfferCatalog` referencia entre bloques JSON-LD separados
**index.html** — `ProfessionalService.hasOfferCatalog` referencia `{ "@id": ".../#servicios" }` que está en un segundo bloque `<script>` independiente. Google no vincula `@id` entre bloques separados.

#### SM-3: index.html sin nodo `WebPage` en @graph
Es la única página sin `WebPage` en su `@graph`. Todas las subpáginas sí lo tienen. Rompe la cadena canónica del schema.

#### SM-4: BlogPosting.isPartOf apunta a WebSite directamente
**cuanto-cuesta** y **caso-sorteos-jans** — el patrón correcto es `BlogPosting > WebPage > WebSite`. Estas páginas saltan la `WebPage`.

#### SM-5: `og:type="profile"` en sobre-nosotros sin propiedades requeridas
Requiere `og:profile:first_name` y `og:profile:last_name`. Sin ellas, Meta hace fallback a tipo genérico. Cambiar a `og:type="article"`.

### Bajos

#### SB-1: Person.image en sobre-nosotros como string, no como ImageObject
Inconsistente con index.html donde el mismo nodo `#founder` usa `ImageObject` con width/height.

#### SB-2: Article.about.SoftwareApplication.offers.price:"0" en caso-sorteos-jans
Implica que el software es gratuito (incorrecto). Eliminar el bloque `offers` del `SoftwareApplication`.

---

## PERFORMANCE — 82/100

| Página | LCP candidato | Estimación | Problema |
|---|---|---|---|
| index.html | `<h1>` texto | Bueno | foto-fundado con fetchpriority alto innecesario |
| hermosillo.html | `<h1>` texto | Bueno | — |
| obregon.html | `<h1>` texto | Bueno | — |
| cuanto-cuesta | `<h1>` texto | Bueno | Sin preload de fuente woff2 |
| sobre-nosotros | `foto-fundado.jpg` | **Necesita mejora** | Sin preload de imagen, sin WebP |
| plataforma-rifas | `<h1>` texto | Bueno | Sin preload de fuente woff2 |

**P1:** `sobre-nosotros.html` — LCP candidate sin `<link rel="preload">`. Añadir: `<link rel="preload" as="image" fetchpriority="high" href="/foto-fundado.jpg">`

**P2:** `foto-fundado.jpg` solo en JPEG. Convertir a WebP reduce ~35% el peso.

**P3:** `cuanto-cuesta`, `sobre-nosotros`, `plataforma-rifas` sin preload woff2 de Fraunces. Solo tienen `preconnect`. Añadir las 2 líneas de preload de font que tienen index.html, hermosillo.html y obregon.html.

**P4:** `index.html` — `foto-fundado.jpg` con `loading="eager" fetchpriority="high"` below-the-fold. Cambiar a `loading="lazy"`.

**Lo que funciona bien:** JS 100% deferido, Plausible con defer, patrón media="print" onload en todas las páginas, @font-face fallback métrico con size-adjust, imágenes de portafolio con AVIF+WebP+srcset+lazy loading.

---

## IMAGES — 80/100

**Correcto:** Portfolio con `<picture>` AVIF+WebP+JPG, srcset 2 resoluciones, width/height explícitos, lazy loading. `og:image:alt` en todas las páginas indexables.

**Problemas:**
- `foto-fundado.jpg`: solo JPEG, afecta index.html y sobre-nosotros.html
- `plataforma-rifas-online.html`: imagen Sorteos Jans sin source AVIF
- `sitemap-images.xml`: solo cubre homepage

---

## AI SEARCH READINESS — 75/100

**Fortalezas:** `llms.txt` actualizado, robots.txt con Allow explícito para 4 bots de IA, FAQPage en 5 páginas, tabla de precios citable, patrón problema/solución/resultado en caso de estudio.

**Debilidades:** IndexNow no operativo, sin fuentes externas verificables, sin menciones de prensa, sin testimonio de Sorteos Jans.

---

## SITEMAP — Estado de cobertura

| URL | Estado |
|---|---|
| `/` | Correcto |
| `/hermosillo` | Correcto |
| `/obregon` | Correcto |
| `/cuanto-cuesta-pagina-web-sonora` | Correcto |
| `/servicios` | Correcto |
| `/portafolio` | **404 — eliminar** |
| `/proceso` | **404 — eliminar** |
| `/blog` | **404 — eliminar** |
| `/sobre-nosotros` | Correcto |
| `/caso-sorteos-jans` | Correcto |
| `/plataforma-rifas-online` | Correcto |
| `/servicios/sitios-corporativos` | Correcto |
| `/servicios/landing-pages` | **Falta** |
| `/servicios/rifas` | **Falta** |
| `/servicios/tiendas` | **Falta** |
| `/servicios/software-administrativo` | **Falta** |

## Canonicals rotos en servicios/landing-pages/

| Archivo | Canonical actual | Canonical correcto |
|---|---|---|
| emprendedor-avanzado.html | `/servicios/landing-pages/pyme` | `/servicios/landing-pages/emprendedor-avanzado` |
| emprendedor-plus.html | `/servicios/landing-pages/microempresa` | `/servicios/landing-pages/emprendedor-plus` |
| emprendedor-pro.html | `/servicios/landing-pages/negocios` | `/servicios/landing-pages/emprendedor-pro` |
| emprendedor-elite.html | `/servicios/landing-pages/empresarial` | `/servicios/landing-pages/emprendedor-elite` |

---

## Proyección de score

| Fase | Acciones | Score estimado |
|---|---|---|
| Actual | — | **76/100** |
| Críticos resueltos | C1-C4 sitemap + canonicals + founder | **79/100** |
| Altos resueltos | A1-A8 performance + schema + IndexNow | **81/100** |
| Medios resueltos | M1-M9 schema chain + contenido | **84/100** |
| Bajos + Contenido | B1-B5 + N1-N5 testimonio Jans + reviews | **86/100** |
