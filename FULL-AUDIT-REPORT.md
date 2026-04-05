# Reporte SEO Completo — ibanidigital.com
**Score: 76/100 → 82/100 proyectado** | **Fecha: 4 de abril de 2026** | **Auditoría + implementación (sesión 3)**

---

## Resumen Ejecutivo

| Categoría | Peso | Score | Aportación |
|---|---|---|---|
| Technical SEO | 25% | 74/100 | 18.5 |
| Content Quality / E-E-A-T | 25% | 72/100 | 18.0 |
| On-Page SEO | 20% | 79/100 | 15.8 |
| Schema / Structured Data | 10% | 66/100 | 6.6 |
| Performance (CWV) | 10% | 82/100 | 8.2 |
| Images | 5% | 80/100 | 4.0 |
| AI Search Readiness | 5% | 75/100 | 3.75 |
| **TOTAL** | 100% | **76/100** | |

**Evolución:** 76 → 76 (sin cambio neto). La creación de portafolio.html, proceso.html y blog.html resolvió el C-1 de la sesión anterior (+2 técnico). Sin embargo, plataforma-rifas-online ahora devuelve 404 en producción mientras sigue en el sitemap (-1 técnico), y 2 páginas nuevas de servicios (reservaciones, sistemas-a-medida) quedaron fuera del sitemap (-0.5 on-page). Las 5 tareas críticas de sesiones anteriores (C-2, C-3, y otras) permanecen sin aplicar.

### Lo que se corrigió desde la sesión anterior
| Issue | Estado |
|---|---|
| C-1: portafolio/proceso/blog como 404 en sitemap | ✅ RESUELTO — páginas creadas |
| Página reservaciones.html con schema | ✅ NUEVO — bien implementado |
| Página sistemas-a-medida.html | ✅ NUEVO — agregada |

### Top 5 problemas críticos activos
1. **plataforma-rifas-online en sitemap → 404 en producción** — archivo existe en master pero Vercel no lo sirve
2. **4 canonicals rotos en servicios/landing-pages/** — apuntan a URLs que no existen (pyme/microempresa/negocios/empresarial)
3. **Propiedad `founder` duplicada en index.html** — JSON-LD inválido; la clave duplicada en líneas 96 y 143
4. **16 páginas de planes sin noindex y sin sitemap** — indexabilidad indefinida
5. **6 páginas de servicio nivel-2 ausentes del sitemap** — landing-pages, rifas, tiendas, software-administrativo, reservaciones, sistemas-a-medida

---

## TECHNICAL SEO — 74/100

### Críticos

#### C-1: plataforma-rifas-online devuelve 404 en producción (EN SITEMAP)
**Archivo:** `sitemap.xml` línea 44 / `plataforma-rifas-online.html` (existe en master, no deployado)
El archivo `plataforma-rifas-online.html` existe en el branch `master` (verificado con `git ls-tree master`) pero la URL https://www.ibanidigital.com/plataforma-rifas-online devuelve HTTP 404. El deploy de Vercel en producción (ibanidigital.com) está desactualizado respecto al branch master. Mientras tanto, la URL sigue en el sitemap, lo que hace que Google la procese y reciba un 404.

**Fix:** Dos opciones:
- **Opción A (recomendada):** Forzar redeploy desde master con `git commit --allow-empty -m "chore: force redeploy" && git push origin master`
- **Opción B:** Eliminar la entrada del sitemap si la página se eliminará intencionalmente

#### C-2: 4 canonicals rotos en servicios/landing-pages/
**Archivos verificados localmente:**
- `servicios/landing-pages/emprendedor-avanzado.html` → canonical apunta a `/servicios/landing-pages/pyme` (404)
- `servicios/landing-pages/emprendedor-plus.html` → canonical apunta a `/servicios/landing-pages/microempresa` (404)
- `servicios/landing-pages/emprendedor-pro.html` → canonical apunta a `/servicios/landing-pages/negocios` (404)
- `servicios/landing-pages/emprendedor-elite.html` → canonical apunta a `/servicios/landing-pages/empresarial` (404)

Los archivos fueron renombrados en disco pero los canonicals no se actualizaron. Google ignora canonicals rotos y canonicaliza la URL real — pero genera señales mixtas y puede descartarlas.

**Fix:** Actualizar los 4 canonicals al path correcto (ver ACTION-PLAN.md C-2).

#### C-3: Propiedad `founder` duplicada en index.html
**Archivo:** `index.html` líneas 96 y 143
El objeto `ProfessionalService` declara `"founder"` dos veces. JSON con clave duplicada: el parser puede silenciar el primer nodo o lanzar un error. Google Rich Results Test puede marcar el schema como inválido.
**Fix:** Eliminar la línea 96 (`"founder": { "@id": "https://www.ibanidigital.com/#founder" },`).

### Altos

#### A-1: 16 páginas de planes sin noindex
**Archivos:** `servicios/landing-pages/*.html` (6), `servicios/rifas/*.html` (2), `servicios/tiendas/*.html` (4), `servicios/software-administrativo/*.html` (4)
Ninguna tiene `<meta name="robots" content="noindex">` y ninguna está en el sitemap. Google puede rastrear e indexar estas páginas de forma autónoma. Si el contenido es thin (solo precio + CTA), diluye la autoridad del dominio.
**Fix:** Agregar `<meta name="robots" content="noindex, follow">` a las 16 páginas.

#### A-2: 6 páginas de servicio nivel-2 ausentes del sitemap
**Ausentes:** `/servicios/landing-pages`, `/servicios/rifas`, `/servicios/tiendas`, `/servicios/software-administrativo`, `/servicios/reservaciones`, `/servicios/sistemas-a-medida`
Solo `/servicios/sitios-corporativos` está en el sitemap. Las 6 restantes existen como páginas completas con contenido y precios.
**Fix:** Agregar las 6 URLs al sitemap.xml.

#### A-3: IndexNow no operativo
**Archivo:** `robots.txt` — sin directiva IndexNow
Solo hay un comentario `# Llms-Txt:` y no hay directiva de IndexNow. La clave activa `e8eed06c576f819a4f9f8391c59421ad.txt` no está referenciada.
**Fix:** Agregar en `robots.txt`:
```
IndexNow-key: https://www.ibanidigital.com/e8eed06c576f819a4f9f8391c59421ad.txt
```
Y eliminar la clave antigua `361da0c5c6aa49dba10859713f581f5c.txt` del repositorio.

#### A-4: inline onmouseover/onmouseout en index.html bloqueados por CSP
**Archivo:** `index.html` líneas 650-651, 692, 921-922
La CSP en `vercel.json` (`script-src 'self'`) bloquea los atributos `onmouseover`/`onmouseout` en el footer. Los efectos hover son silenciados en navegadores con CSP activa.
**Fix:** Mover los efectos hover a CSS puro (`:hover` en `css/components.css` → `color:rgba(255,255,255,.45)` + `:hover { color:#fff }`).

### Medios

#### M-1: sitemap.xml sin changefreq/priority en 11 de 12 URLs
Solo `/servicios/sitios-corporativos` tiene estos valores. Google los ignora pero la inconsistencia es descuidada.
**Fix:** Quitar changefreq y priority de la única entrada que los tiene, o agregarlos a todas con valores coherentes.

#### M-2: X-Frame-Options inconsistente con frame-ancestors
`vercel.json`: `X-Frame-Options: SAMEORIGIN` + `frame-ancestors 'none'` — contradictorios.
**Fix:** Cambiar `X-Frame-Options` a `"DENY"`.

#### M-3: Referencia a llms.txt comentada en robots.txt
`# Llms-Txt: https://...` está comentada. Si se quiere que crawlers de IA descubran el archivo vía robots.txt, descomentar la línea.

#### M-4: portafolio/proceso/blog nuevas páginas sin canonical confirmado
Las 3 páginas creadas en la sesión anterior no tienen canonical tag confirmado en el markup HTML.
**Fix:** Agregar `<link rel="canonical" href="https://www.ibanidigital.com/{slug}">` a cada una.

### Bajos

#### B-1: lastmod uniforme en sitemap (2026-03-31 en todas las URLs)
Todas las URLs tienen la misma fecha. Si el contenido varía por página, las fechas individuales ayudan a Google a priorizar el crawl.

---

## CONTENT QUALITY / E-E-A-T — 72/100

### Score por página
| Página | Score | Palabras | Principal brecha E-E-A-T |
|---|---|---|---|
| index.html | 7.5/10 | ~1,200 | Solo 3 reseñas para 10+ proyectos |
| hermosillo.html | 6.5/10 | ~900 | ~65% contenido duplicado con obregon |
| obregon.html | 6.5/10 | ~900 | Carlos Arias (Hermosillo) aparece en página de Obregón |
| cuanto-cuesta-pagina-web-sonora.html | 8.5/10 | ~1,800 | Sin fuentes externas; precio inconsistente con homepage |
| sobre-nosotros.html | 7.0/10 | ~1,200 | Sin testimonios visibles en la página |
| caso-sorteos-jans.html | 8.0/10 | ~1,400 | Sin cita directa del cliente |
| blog.html | 5.0/10 | ~400 | Solo 3 artículos (2 son páginas de ciudad) |
| portafolio.html | 6.0/10 | ~600 | Solo muestra capturas, sin métricas de negocio |
| proceso.html | 6.5/10 | ~500 | 4 pasos sin casos de uso específicos |

**E-E-A-T global: 69/100**
- Experience: 72/100 — proyectos verificables, bio en primera persona, URLs de clientes en vivo
- Expertise: 78/100 — precios concretos, stack técnico, tiempos documentados
- Authoritativeness: 54/100 — punto más débil: 3 reseñas, sin menciones externas, todo es autopresentación
- Trustworthiness: 74/100 — HTTPS, aviso de privacidad, contact info completo, horario, LinkedIn

### Críticos de contenido

#### CC-1: Inconsistencia de precios entre artículo y homepage
El artículo `/cuanto-cuesta` muestra "landing page $5,000–$12,000" (rango de mercado sonorense). Los servicios de IBANI parten de $3,500. Un usuario que lee ambas páginas percibe una contradicción. Daña el pilar Trustworthiness del QRG.
**Fix:** Agregar nota aclaratoria explícita en la tabla del artículo indicando que es un rango del mercado general de Sonora, y que los precios de IBANI aparecen en la sección de cierre.

#### CC-2: Las mismas 3 reseñas en 4 páginas distintas
`hermosillo.html`, `obregon.html`, `index.html`, `cuanto-cuesta` — mismo bloque de reviews verbatim. Carlos Arias (Casa Arias, Hermosillo) aparece como reviewer en la página de Ciudad Obregón. Señal negativa de contenido duplicado en datos estructurados.

### Altos de contenido

#### AC-1: Sin cita del cliente en caso-sorteos-jans
Todo el caso de estudio es narrado por el proveedor. Sin una cita directa del organizador de Sorteos Jans, el contenido es autopublicitario. Es el cambio de mayor impacto E-E-A-T disponible en el sitio.

#### AC-2: Blog con solo 3 "artículos" (dos son páginas de ciudad)
El blog muestra hermosillo, obregon y cuanto-cuesta como posts. No hay artículos dedicados sobre temas de diseño web. Un blog activo con 1-2 artículos nuevos por mes señaliza autoridad temática a Google.

#### AC-3: sobre-nosotros sin testimonios visibles
Los testimonios existen solo en JSON-LD de index.html. La página del fundador no tiene prueba social visual.

---

## SCHEMA / STRUCTURED DATA — 66/100

### Cobertura de schema por página
| Página | Schema presente | Estado |
|---|---|---|
| index.html | WebSite, ProfessionalService, FAQPage, Person, ItemList, OfferCatalog | ⚠️ founder duplicado; OfferCatalog en bloque separado |
| hermosillo.html | WebPage, ProfessionalService, BreadcrumbList, FAQPage, AggregateRating, Review | ✅ Bien |
| obregon.html | WebPage, ProfessionalService, BreadcrumbList, FAQPage, AggregateRating, Review | ✅ Bien |
| cuanto-cuesta | BlogPosting, BreadcrumbList, FAQPage | ⚠️ isPartOf salta WebPage |
| sobre-nosotros | Person, WebPage, BreadcrumbList | ✅ Bien |
| caso-sorteos-jans | Article, BreadcrumbList, SoftwareApplication, Offer | ⚠️ Offer.price:"0" incorrecto |
| servicios/rifas | WebPage, Service, BreadcrumbList, FAQPage | ✅ Bien |
| servicios/reservaciones | Service, Organization, BreadcrumbList, FAQPage | ✅ Bien |
| servicios/landing-pages | Ninguno | ❌ |
| servicios/sitios-corporativos | Ninguno | ❌ |
| servicios/tiendas | Ninguno | ❌ |
| servicios/software-administrativo | Ninguno | ❌ |
| servicios/sistemas-a-medida | Sin confirmar | ❓ |
| servicios.html | Ninguno | ❌ |
| portafolio.html | Ninguno | ❌ |
| proceso.html | Ninguno | ❌ |
| blog.html | Ninguno | ❌ |

### Críticos de schema

#### SC-1: Propiedad `founder` duplicada en index.html
**Líneas 96 y 143** del mismo objeto `ProfessionalService`. JSON con clave duplicada: la segunda instancia puede sobrescribir a la primera. Google Rich Results Test puede marcar el schema como inválido.

### Medios de schema

#### SM-1: 5 páginas de servicio sin schema
`servicios/landing-pages`, `servicios/sitios-corporativos`, `servicios/tiendas`, `servicios/software-administrativo`, `servicios/sistemas-a-medida` — sin ningún marcado estructurado. Oportunidad perdida para Service + OfferCatalog + FAQPage en cada una.

#### SM-2: Missing `@id` en BreadcrumbList y FAQPage en 6+ páginas
Sin `@id`, los nodos no se vinculan explícitamente a la `WebPage` del @graph. Impide el Knowledge Graph completo.

#### SM-3: `OfferCatalog` en segundo bloque JSON-LD separado de `ProfessionalService`
**index.html** — `ProfessionalService.hasOfferCatalog` referencia `{ "@id": ".../#servicios" }` en un bloque `<script>` separado. Google no vincula `@id` entre bloques distintos.

#### SM-4: index.html sin nodo `WebPage` en @graph
Es la única página sin `WebPage` en su @graph. Todas las subpáginas sí lo tienen.

#### SM-5: BlogPosting.isPartOf apunta a WebSite directamente
`cuanto-cuesta` y `caso-sorteos-jans` — el patrón correcto es `BlogPosting > WebPage > WebSite`. Estas páginas saltan la `WebPage`.

#### SM-6: `Article.about.SoftwareApplication.offers.price:"0"` en caso-sorteos-jans
Implica que el software es gratuito (incorrecto). Eliminar el bloque `offers` del `SoftwareApplication`.

### Bajos de schema

#### SB-1: `og:type="profile"` en sobre-nosotros sin propiedades requeridas
`og:type="profile"` requiere `og:profile:first_name` y `og:profile:last_name`. Sin ellas, Meta/Facebook hace fallback a tipo genérico.
**Fix:** Cambiar a `og:type="article"`.

#### SB-2: Person.image en sobre-nosotros como string
Inconsistente con index.html donde el mismo nodo `#founder` usa `ImageObject` con width/height.

#### SB-3: Oportunidades de schema en páginas nuevas
- `portafolio.html` → `CollectionPage` + `ItemList`
- `proceso.html` → `HowTo` (4 pasos con nombre, descripción, imagen)
- `blog.html` → `Blog` + `ItemList` de artículos
- `servicios.html` → `WebPage` + `OfferCatalog`

---

## PERFORMANCE — 82/100

| Página | LCP candidato | Estimación | Problema |
|---|---|---|---|
| index.html | `<h1>` texto | Bueno | foto-fundado con fetchpriority alto innecesario |
| hermosillo.html | `<h1>` texto | Bueno | — |
| obregon.html | `<h1>` texto | Bueno | — |
| cuanto-cuesta | `<h1>` texto | Bueno | Sin preload de fuente woff2 |
| sobre-nosotros | `foto-fundado.jpg` | **Necesita mejora** | Sin preload de imagen ni WebP |
| portafolio.html | imagen hero? | Sin confirmar | Verificar preload |

**P-1 (Alto):** `sobre-nosotros.html` — `foto-fundado.jpg` es el candidato LCP y no tiene `<link rel="preload">`. El navegador la descubre tarde (+200-400ms al LCP). Además, el archivo solo existe en JPEG (sin WebP ni AVIF).

**P-2 (Alto):** `index.html` — `foto-fundado.jpg` con `loading="eager" fetchpriority="high"` pero está below-the-fold en la sección #nosotros. Compite con recursos del render path del `<h1>` (LCP real).

**P-3 (Medio):** `cuanto-cuesta`, `sobre-nosotros` — sin preload woff2 de Fraunces. Solo tienen `preconnect`. Añade ~100-200ms al render de texto.

**Lo que funciona bien:** JS 100% deferido, Plausible con defer, patrón `media="print" onload` en todas las páginas, @font-face fallback métrico con size-adjust, imágenes de portafolio con AVIF+WebP+srcset+lazy loading en páginas que lo implementan.

---

## IMAGES — 80/100

**Correcto:** Portfolio con `<picture>` AVIF+WebP+JPG, srcset 2 resoluciones, width/height explícitos, lazy loading. `og:image:alt` en páginas indexables. `sitemap-images.xml` con 10 imágenes con captions descriptivos y datos geo.

**Problemas:**
- `foto-fundado.jpg`: solo JPEG — afecta index.html y sobre-nosotros.html. Conversión a WebP reduce ~35% el peso.
- `sitemap-images.xml`: cubre solo la homepage. Las imágenes de hermosillo, obregon, caso-sorteos-jans no están incluidas.
- Nuevas páginas (portafolio.html, proceso.html) no confirmadas en sitemap-images.xml.

---

## AI SEARCH READINESS — 75/100

**Fortalezas:**
- `llms.txt` activo con descripción detallada de servicios, precios y diferenciadores
- `robots.txt` con Allow explícito para GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot
- FAQPage schema en 5+ páginas
- Tabla de precios citable por servicios en múltiples páginas
- Patrón problema/solución/resultado en caso-sorteos-jans
- ProfessionalService con areaServed, geo coordinates, aggregateRating

**Debilidades:**
- llms.txt referenciado como comentario en robots.txt (`# Llms-Txt:`) — descomentar para que sea directiva real
- IndexNow no operativo — los cambios no se notifican a Bing/Yandex automáticamente
- Sin fuentes externas verificables en artículo de precios
- plataforma-rifas-online (página más técnica sobre rifas) inaccessible por 404
- Solo 3 reviews en schema (poca señal de autoridad)
- Todo el contenido es autopublicitario — sin menciones de prensa ni backlinks verificables

---

## SITEMAP — Estado de cobertura

### sitemap.xml (12 URLs)
| URL | Estado | Acción |
|---|---|---|
| `/` | ✅ Correcto | — |
| `/hermosillo` | ✅ Correcto | — |
| `/obregon` | ✅ Correcto | — |
| `/cuanto-cuesta-pagina-web-sonora` | ✅ Correcto | — |
| `/servicios` | ✅ Correcto | — |
| `/portafolio` | ✅ Correcto (página ahora existe) | — |
| `/proceso` | ✅ Correcto (página ahora existe) | — |
| `/blog` | ✅ Correcto (página ahora existe) | — |
| `/sobre-nosotros` | ✅ Correcto | — |
| `/caso-sorteos-jans` | ✅ Correcto | — |
| `/plataforma-rifas-online` | **⚠️ 404 en producción** | Forzar redeploy o eliminar |
| `/servicios/sitios-corporativos` | ✅ Correcto | — |
| `/servicios/landing-pages` | **❌ Falta** | Agregar |
| `/servicios/rifas` | **❌ Falta** | Agregar |
| `/servicios/tiendas` | **❌ Falta** | Agregar |
| `/servicios/software-administrativo` | **❌ Falta** | Agregar |
| `/servicios/reservaciones` | **❌ Falta** | Agregar |
| `/servicios/sistemas-a-medida` | **❌ Falta** | Agregar |

### sitemap-images.xml (10 imágenes)
Cubre solo la homepage. Oportunidad para agregar imágenes de hermosillo, obregon, caso-sorteos-jans.

---

## Canonicals rotos en servicios/landing-pages/

| Archivo | Canonical actual | Canonical correcto |
|---|---|---|
| emprendedor-avanzado.html | `/servicios/landing-pages/pyme` | `/servicios/landing-pages/emprendedor-avanzado` |
| emprendedor-plus.html | `/servicios/landing-pages/microempresa` | `/servicios/landing-pages/emprendedor-plus` |
| emprendedor-pro.html | `/servicios/landing-pages/negocios` | `/servicios/landing-pages/emprendedor-pro` |
| emprendedor-elite.html | `/servicios/landing-pages/empresarial` | `/servicios/landing-pages/emprendedor-elite` |

---

## Proyección de score

| Acción | Score actual | Score esperado |
|---|---|---|
| Baseline actual | 76 | — |
| Fix C-1 (redeploy) + C-2 (canonicals) + C-3 (founder) | — | +3 → 79 |
| + A-1 (noindex plan pages) + A-2 (sitemap) + A-3 (IndexNow) | — | +2 → 81 |
| + SM-1 (schema en 5 service pages) + SM-3/4/5 | — | +2 → 83 |
| + P-1/P-2 (foto-fundado preload/lazy) | — | +1 → 84 |
| + contenido (testimonio Sorteos Jans, blog posts) | — | +2 → 86 |
| **Objetivo realista Q2 2026** | | **86/100** |
