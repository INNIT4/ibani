# Auditoria SEO Completa — ibanidigital.com
**Fecha:** 25 de marzo de 2026
**Herramienta:** Claude Code SEO Audit (6 subagentes paralelos)
**Paginas analizadas:** index.html, obregon.html, privacidad.html

---

## SEO Health Score Global: 72 / 100

| Categoria | Peso | Puntos | Ponderado |
|---|---|---|---|
| Technical SEO | 25% | 79/100 | 19.75 |
| Content Quality & E-E-A-T | 25% | 61/100 | 15.25 |
| On-Page SEO | 20% | 78/100 | 15.60 |
| Schema / Structured Data | 10% | 72/100 | 7.20 |
| Performance (CWV) | 10% | 70/100 | 7.00 |
| Images | 5% | 82/100 | 4.10 |
| AI Search Readiness (GEO) | 5% | 72/100 | 3.60 |
| **TOTAL** | | | **72.5 / 100** |

---

## Tipo de negocio detectado

Agencia de diseno web local — ProfessionalService / LocalBusiness con area de servicio en Hermosillo y Ciudad Obregon, Sonora, Mexico. Mercado objetivo: negocios locales (salones de eventos, tiendas, plataformas de sorteos). Precio medio: $9,000 MXN por proyecto.

---

## Top 5 Problemas Criticos

1. **Coordenadas incorrectas en `sameAs` de schema** — las coords 29.3955, -111.7386 no corresponden a Hermosillo; los LLMs absorben este dato erroneo como hecho.
2. **CSS bloqueante (`all.css` en `<head>` sin async)** — bloquea el render; penaliza directamente el LCP.
3. **Ausencia de Content-Security-Policy** — unico header de seguridad faltante; exposicion a XSS.
4. **Doble preload conflictivo de Google Fonts** — lineas 325-326 hacen dos requests a Fraunces con rangos de peso diferentes, causando FOUT extendido.
5. **Logo en schema apunta a `og-image.jpg`** (1200x630) en lugar del logo real — puede impedir el Knowledge Panel correcto.

---

## Top 5 Quick Wins

1. Corregir URL de `sameAs` Google Maps en index.html — 5 min, impacto en GEO y Entity Graph.
2. Eliminar linea 325 del `<head>` (preload conflictivo de Fraunces) — 1 min, mejora LCP.
3. Anadir CSP en vercel.json — 15 min, critico de seguridad.
4. Eliminar bloque HowTo del segundo JSON-LD en index.html — deprecado desde sept. 2023, markup muerto.
5. Expandir llms.txt con testimonios y estadisticas — 30 min, mejora citabilidad en AI search.

---

## 1. Technical SEO — 79/100

### 1.1 Rastreabilidad

APROBADO.

- robots.txt bien configurado: Allow: / para todos los bots incluidos GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot.
- Directiva Sitemap apunta correctamente a https://www.ibanidigital.com/sitemap.xml
- llms.txt declarado en robots.txt (convencion emergente — inofensiva y util para AI crawlers).

### 1.2 Indexabilidad

| Pagina | robots meta | canonical | Estado |
|---|---|---|---|
| index.html | index, follow, max-snippet:-1, max-image-preview:large | https://www.ibanidigital.com/ | OK |
| obregon.html | index, follow, max-snippet:-1... | https://www.ibanidigital.com/obregon.html | OK |
| privacidad.html | noindex, follow | https://www.ibanidigital.com/privacidad.html | OK |

Problema medio: La meta description de index.html no incluye "Hermosillo" en los primeros ~120 caracteres — la keyword de mayor volumen no aparece en el snippet mobile de SERP.

### 1.3 Seguridad — Headers HTTP

| Header | Estado |
|---|---|
| X-Content-Type-Options: nosniff | OK |
| X-Frame-Options: SAMEORIGIN | OK |
| Referrer-Policy: strict-origin-when-cross-origin | OK |
| Permissions-Policy | OK |
| Strict-Transport-Security (2 anos, preload) | OK |
| Content-Security-Policy | AUSENTE — CRITICO |

CSP minimo recomendado para anadir en vercel.json:
```
default-src 'self'; script-src 'self' https://plausible.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://plausible.io; frame-ancestors 'none';
```

### 1.4 Movil

APROBADO. Viewport, theme-color, apple-touch-icon, breakpoints (1024/768/480px), targets tactiles >=44px, dvh en hero. Sin problemas detectados.

### 1.5 Renderizado JavaScript

APROBADO. El sitio es HTML/CSS/JS estatico puro (SSR). Todo el contenido semantico, headings, schema y meta tags estan en el HTML inicial. Googlebot indexa sin ejecutar JS.

### 1.6 IndexNow

NO IMPLEMENTADO. Bing (~5-8% del trafico en Mexico) no recibe notificaciones de cambios post-deploy. Implementacion trivial: generar clave UUID en bing.com/indexnow, crear [clave].txt en raiz, notificar via GET post-deploy.

### 1.7 Sitemap

APROBADO con mejoras menores.
- Formato XML valido, 2 URLs, cobertura 100% de paginas indexables.
- privacidad.html correctamente excluida (noindex).
- Mejoras: eliminar changefreq y priority (ignorados por Google desde 2023); corregir lastmod de "/" a 2026-03-21.

---

## 2. Content Quality & E-E-A-T — 61/100

### 2.1 Puntuacion E-E-A-T

| Factor | Peso | Puntuacion | Ponderado |
|---|---|---|---|
| Experience | 20% | 80/100 | 16.0 |
| Expertise | 25% | 64/100 | 16.0 |
| Authoritativeness | 25% | 44/100 | 11.0 |
| Trustworthiness | 30% | 70/100 | 21.0 |
| Total | | | 64/100 |

### 2.2 Experiencia — 80/100 (Fortaleza)

Senales positivas:
- Portfolio con 10 proyectos reales: nombres de clientes, ubicaciones especificas, URLs verificables.
- Voz en primera persona: "Cada proyecto lo trabajo directamente yo — sin subcontratistas."
- Referencias a herramientas del mercado mexicano: Stripe, Clip, Conekta.
- Mencion de "region del Yaqui" — detalle geografico de experiencia real.

Senales faltantes:
- Sin foto del fundador en la pagina.
- Testimonios sin foto ni enlace a resena original.
- Sin metricas de resultados para proyectos del portfolio.

### 2.3 Expertise — 64/100

Senales positivas:
- Descripciones tecnicas especificas: pasarelas de pago, panel dual admin/empleados, contador regresivo.
- FAQ tecnico con respuestas detalladas y precios exactos.

Senales faltantes:
- Sin formacion ni trayectoria del fundador visible en HTML.
- Seccion "Nosotros" insuficiente (2 parrafos cortos).
- Sin blog ni contenido educativo.

### 2.4 Authoritativeness — 44/100 (Brecha critica)

Senales positivas: 3 resenas reales en schema que coinciden con testimonios on-page. GBP activo.

Senales faltantes:
- Cero menciones de prensa o directorios externos.
- Sin YouTube, LinkedIn, Reddit, Wikipedia.
- Solo 3 reviews en aggregateRating.

### 2.5 Trustworthiness — 70/100

Senales positivas: email profesional, precio publico transparente, privacidad.html conforme a LFPDPPP, nombre completo del fundador en schema.

Senales faltantes: testimonios sin fecha visible, sin politica de reembolso formalizada.

### 2.6 Conteo de palabras

| Pagina | Palabras visibles | Evaluacion |
|---|---|---|
| index.html | ~2,155 | Adecuado |
| obregon.html | ~715 | Borderline — necesita 400-500 mas |
| privacidad.html | ~420 | Adecuado |

### 2.7 Contenido duplicado interno

PROBLEMA MEDIO: Las descripciones de los 3 proyectos de Ciudad Obregon (Floresta, Antigua Grecia, Lantana) son textualmente identicas entre index.html y obregon.html.

### 2.8 AI Citation Readiness — 52/100

Fortalezas: FAQ con 6 Q&A autocontenidas, datos numericos especificos (precios MXN, tiempos, comisiones).

Brechas: sin estadisticas con fuente atribuida, obregon.html no menciona "IBANI Digital" en los primeros 60 palabras, testimonios ausentes de llms.txt.

---

## 3. On-Page SEO — 78/100

### index.html

| Elemento | Valor | Estado |
|---|---|---|
| Title | "IBANI Digital — Diseno Web para Negocios en Sonora" (55 chars) | OK |
| Meta description | 148 chars, CTA "Cotiza hoy" | "Hermosillo" no en primeros 120 chars |
| H1 | "Paginas web que trabajan por tu negocio." (via aria-label) | OK |
| Alt text | "[Negocio] — [tipo] en [ciudad], Sonora" | Excelente |
| Twitter card | summary_large_image | OK |

### obregon.html

| Elemento | Estado |
|---|---|
| Breadcrumb HTML con schema BreadcrumbList | OK |
| Twitter Card | AUSENTE |
| "IBANI Digital" en primeros 60 palabras | FALTA |

---

## 4. Schema / Structured Data — 72/100

### index.html — Bloque 1 (@graph)

| Schema | Estado | Problema |
|---|---|---|
| WebSite | OK | Sin SearchAction |
| Person (fundador) | OK con advertencias | Sin url, sameAs, ni image |
| ProfessionalService | OK con errores | logo apunta a og-image.jpg; sameAs con coords erroneas |
| AggregateRating (3 resenas 5 estrellas) | OK | Datos coinciden con HTML |
| FAQPage (6 Q&A) | OK | Sin rich results para comerciales desde ago. 2023 |

### index.html — Bloque 2

| Schema | Estado | Problema |
|---|---|---|
| ItemList (10 portfolio) | OK | Sin image en CreativeWork |
| HowTo | DEPRECADO | Eliminado de Google rich results sept. 2023 — eliminar |
| OfferCatalog | OK | 2 Offers sin price |

### obregon.html

| Schema | Estado | Problema |
|---|---|---|
| WebPage | OK | |
| ProfessionalService | OK | Sin logo, sin aggregateRating, sin openingHoursSpecification |
| BreadcrumbList | OK | |

---

## 5. Performance / Core Web Vitals — 70/100

### LCP — RIESGO ALTO

- Elemento LCP probable: H1 del hero (text-LCP).
- Problema 1: css/all.css bloqueante en head — el navegador no puede pintar nada hasta descargar el CSS.
- Problema 2: Doble request a Google Fonts para Fraunces con rangos distintos (300..700 en preload vs 200..900 en async).
- Mitigacion ya implementada: Fallback font con size-adjust: 97% y ascent-override: 94%.

### CLS — BIEN MITIGADO

- Imagenes con width/height explicitos, aspect-ratio CSS en cards, animaciones compositor-only, fuente fallback con metricas ajustadas.

### INP — BAJO RIESGO

- defer en main.js, passive: true en scroll listener, IntersectionObserver para reveals, requestAnimationFrame en contador.

### Recursos

| Problema | Impacto |
|---|---|
| CSS sin minificar (~18-22 KB) | Medio |
| JS sin minificar (~5-6 KB) | Bajo |
| SVG WhatsApp inline duplicado (~1.2 KB) | Bajo |
| Sin AVIF (solo WebP + JPG) | Bajo-Medio |
| Sin GA, GTM ni Facebook Pixel | Excelente |

---

## 6. Images — 82/100

- picture con source WebP + fallback JPG en 10 tarjetas de portfolio
- loading="lazy" en todas las imagenes de portfolio
- Alt text descriptivo en todos los img
- width y height explicitos en todos los img
- Sin AVIF (oportunidad de 20-40% menos peso sobre WebP)
- Image Sitemap extension ausente

---

## 7. AI Search Readiness (GEO) — 72/100

### Accesibilidad tecnica para IA — 90/100 (Fortaleza)

- HTML estatico SSR: contenido completo sin necesitar JS
- GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot explicitamente permitidos
- llms.txt presente y bien estructurado
- Schema JSON-LD con 5 tipos diferentes
- Alt text descriptivo en todas las imagenes

### Senales de autoridad para IA — 65/100 (Brecha)

| Senal | Estado | Correlacion con citacion IA |
|---|---|---|
| YouTube | Ausente | ~0.737 (la mas alta) |
| Reddit | No verificable | Alto |
| Wikipedia | Ausente | Alto |
| LinkedIn (fundador) | Ausente en sameAs | Medio-alto |
| Google Business Profile | Presente | Medio |
| Facebook | Presente | Bajo |

### Problemas en llms.txt

- Seccion Optional mal utilizada (contiene FAQ y portfolio — deberia ser Pages).
- Sin testimonios.
- Sin seccion de estadisticas propias con fecha.

### Puntuaciones por plataforma IA

| Plataforma | Score estimado |
|---|---|
| Google AI Overviews | 68/100 |
| ChatGPT (web search) | 61/100 |
| Perplexity | 74/100 |
| Bing Copilot | 65/100 |

---

## Apendice — Archivos clave

| Archivo | Ruta |
|---|---|
| Homepage | index.html |
| Pagina local Obregon | obregon.html |
| Aviso de privacidad | privacidad.html |
| Design tokens | css/base.css |
| Componentes | css/components.css |
| Secciones | css/sections.css |
| JavaScript | js/main.js |
| Sitemap | sitemap.xml |
| Robots | robots.txt |
| AI context | llms.txt |
| Headers HTTP | vercel.json |
