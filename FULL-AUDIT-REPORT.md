# Auditoría SEO Completa — ibanidigital.com
**Fecha:** 2026-03-21
**Auditado por:** Claude Code SEO Agent
**URL analizada:** https://www.ibanidigital.com/

---

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **SEO Health Score** | **72 / 100** |
| Tipo de negocio detectado | Agencia de servicios web — Local Business (Sonora, México) |
| Páginas crawleadas | 2 (index + privacidad.html) |
| Problemas críticos | 2 |
| Problemas de alta prioridad | 6 |
| Problemas de prioridad media | 8 |
| Problemas de baja prioridad | 5 |

### Desglose de puntuación

| Categoría | Peso | Puntuación | Ponderado |
|-----------|------|-----------|-----------|
| Technical SEO | 25% | 72/100 | 18.0 |
| Content Quality (E-E-A-T) | 25% | 74/100 | 18.5 |
| On-Page SEO | 20% | 70/100 | 14.0 |
| Schema / Structured Data | 10% | 82/100 | 8.2 |
| Performance (CWV estimado) | 10% | 68/100 | 6.8 |
| Images | 5% | 35/100 | 1.75 |
| AI Search Readiness (GEO) | 5% | 88/100 | 4.4 |
| **TOTAL** | | | **72/100** |

### Top 5 problemas críticos/altos

1. **favicon.svg devuelve 404** — error de consola en cada visita
2. **Sitemap incompleto** — falta /privacidad.html
3. **Sólo 3 reseñas en AggregateRating** — Google requiere 5+ para mostrar estrellas en SERPs
4. **Portfolio links a dominios externos (vercel.app)** — dilución de autoridad, 0 subpáginas propias indexables
5. **H1 sin keyword geográfica en texto visible** — el texto visible no incluye "Hermosillo" ni "Sonora"

### Top 5 quick wins

1. Corregir el favicon.svg (2 min)
2. Agregar /privacidad.html al sitemap.xml (2 min)
3. Agregar meta description a privacidad.html (5 min)
4. Agregar HSTS header en vercel.json (5 min)
5. Recortar meta description a <160 caracteres (5 min)

---

## 1. Technical SEO

### 1.1 Crawlabilidad e Indexabilidad

| Check | Estado | Detalle |
|-------|--------|---------|
| robots.txt accesible | ✅ OK | Permite todos los bots |
| meta robots | ✅ OK | `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1` |
| Canonical tag | ✅ OK | `https://www.ibanidigital.com/` (con www) |
| Sitemap.xml accesible | ✅ OK | Referenciado en robots.txt |
| Sitemap URLs completas | ❌ FALLA | Solo incluye `/` — falta `/privacidad.html` |
| www vs non-www | ⚠️ VERIFICAR | Canonical apunta a www; verificar que non-www redirige a www |
| AI bots permitidos | ✅ EXCELENTE | GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot explícitamente permitidos |

### 1.2 URLs y estructura

- Solo 2 páginas indexables: `/` y `/privacidad.html`
- Todas las "subpáginas" del portafolio son dominios externos (`vercel.app`) — no indexables bajo ibanidigital.com
- URL estructura: limpia, sin parámetros ni fragmentos en sitemap

### 1.3 Seguridad y Headers HTTP

| Header | Estado | Valor actual |
|--------|--------|-------------|
| X-Content-Type-Options | ✅ OK | `nosniff` |
| X-Frame-Options | ✅ OK | `SAMEORIGIN` |
| Referrer-Policy | ✅ OK | `strict-origin-when-cross-origin` |
| Permissions-Policy | ✅ OK | geolocation, microphone, camera desactivados |
| **Strict-Transport-Security (HSTS)** | ❌ FALTA | No configurado en vercel.json |
| **Content-Security-Policy** | ❌ FALTA | No configurado |
| HTTPS | ✅ OK | Vercel provee SSL automático |

### 1.4 Recursos

| Recurso | Estado | Detalle |
|---------|--------|---------|
| favicon.svg | ❌ 404 | Archivo no existe en el servidor |
| favicon.ico | ⚠️ No verificado | Declarado como fallback en HTML |
| apple-touch-icon.png | ⚠️ No verificado | Declarado en HTML |
| og:image (.jpg) | ✅ OK | Existe, ~47KB (formato JPEG) |
| CSS files | ⚠️ 3 archivos | base.css + components.css + sections.css = 3 HTTP requests |

### 1.5 Mobile

- ✅ `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- ✅ Menú hamburguesa con `aria-expanded` para móvil
- ✅ Responsive design verificado en código
- ✅ Smooth scroll con offset de 72px para header fijo

---

## 2. Content Quality & E-E-A-T

### 2.1 Experience (Experiencia)

| Signal | Estado | Detalle |
|--------|--------|---------|
| Portfolio real | ✅ BUENO | 6 proyectos con nombre, ciudad y descripción |
| Clientes nombrados | ✅ BUENO | Alejandra Ferraris, Carlos Arias, Ramón Flores |
| Casos de uso específicos | ✅ BUENO | Salones de eventos, e-commerce, rifas |
| Número de proyectos | ⚠️ BAJO | "6+" — poco para construir autoridad fuerte |
| Imágenes de proyectos reales | ❌ FALTA | Portafolio usa gradientes CSS, sin capturas de pantalla |

### 2.2 Expertise (Pericia)

| Signal | Estado | Detalle |
|--------|--------|---------|
| Fundador identificado | ✅ OK | Jose Daniel Ibarra Nieblas, Hermosillo, Sonora |
| Contenido técnico | ✅ OK | Descripción detallada de proceso y tecnologías |
| Precios transparentes | ✅ EXCELENTE | $9,000 MXN / $6,000 MXN mensual, sin letra chica |
| FAQ detallado | ✅ BUENO | 6 preguntas con respuestas extensas |
| Blog / contenido educativo | ❌ FALTA | Sin ningún artículo, guía ni recurso |

### 2.3 Authoritativeness (Autoridad)

| Signal | Estado | Detalle |
|--------|--------|---------|
| Google Business Profile | ✅ OK | `sameAs` apunta a GBP |
| Facebook | ✅ OK | Perfil enlazado en schema |
| Backlinks generados | ❌ CERO | Portfolio en vercel.app no enlaza de regreso a ibanidigital.com |
| Twitter/X | ❌ FALTA | No enlazado en sameAs |
| LinkedIn | ❌ FALTA | No mencionado |

### 2.4 Trustworthiness (Confianza)

| Signal | Estado | Detalle |
|--------|--------|---------|
| Aviso de privacidad LFPDPPP | ✅ OK | /privacidad.html existe y tiene contenido válido |
| Datos de contacto en schema | ✅ OK | Teléfono + email en ProfessionalService |
| SSL / HTTPS | ✅ OK | Vercel automático |
| Meta description privacidad.html | ❌ FALTA | Página sin meta description |

### 2.5 Readability

- ✅ Lenguaje claro y directo, dirigido a negocios locales
- ✅ Párrafos cortos, bullets en pricing, pasos numerados en proceso
- ✅ Uso de `<strong>` para resaltar datos clave
- ⚠️ Todo el contenido en una sola página — sin estructura de contenido para long-tail keywords

---

## 3. On-Page SEO

### 3.1 Title Tags

| Página | Title | Longitud | Estado |
|--------|-------|---------|--------|
| Homepage | "IBANI Digital — Diseño Web para Negocios en Sonora" | 54 chars | ✅ OK |
| Privacidad | "Aviso de Privacidad — IBANI Digital" | 36 chars | ✅ OK |

### 3.2 Meta Descriptions

| Página | Description | Longitud | Estado |
|--------|-------------|---------|--------|
| Homepage | "Páginas web profesionales en Hermosillo y Sonora: landing pages, tiendas online, plataformas de rifas y sitios corporativos. Entrega en 3 días hábiles. Cotiza hoy." | **164 chars** | ⚠️ LARGO (>160) |
| Privacidad | (sin meta description) | — | ❌ FALTA |

### 3.3 Heading Structure

```
H1: "Páginas web que trabajan por tu negocio"  ← sin geo en texto visible
  H2: "Detrás de IBANI Digital"
  H2: "Lo que hacemos"                          ← sin keyword SEO
    H3: Landing Pages
    H3: Tiendas Online
    H3: Plataformas de Rifas
    H3: Sitios Corporativos
  H2: "Proyectos reales"                        ← sin keyword SEO
    H3: Jardín Ferraris, Casa Arias, Floresta, Antigua Grecia, Lantana, IBANI Rifas
  H2: "Lo que dicen nuestros clientes"
  H2: "Cómo trabajamos"
  H2: "Inversión transparente"
  H2: "Preguntas frecuentes"
  H2: "¿Listo para tu web profesional?"
```

**Problemas:**
- H1 visible no menciona Hermosillo/Sonora en texto plano (solo en `aria-label`)
- H2s genéricos: "Lo que hacemos" vs "Servicios de Diseño Web en Sonora"

### 3.4 Open Graph & Twitter Cards

| Tag | Estado | Detalle |
|-----|--------|---------|
| og:type | ✅ | website |
| og:title | ✅ | Match con title tag |
| og:description | ✅ | 130 chars — óptimo para WhatsApp/redes |
| og:url | ✅ | https://www.ibanidigital.com/ |
| og:image | ✅ | /og-image.jpg — existe |
| og:locale | ✅ | es_MX |
| twitter:card | ✅ | summary_large_image |

### 3.5 Keyword Coverage

| Keyword objetivo | En title | En H1 | En H2 | En meta desc |
|----------------|---------|-------|-------|------------|
| "diseño web" | ✅ | ❌ | ❌ | ✅ |
| "Hermosillo" | ❌ | ❌ aria-label | ❌ | ✅ |
| "Sonora" | ✅ | ❌ | ❌ | ✅ |
| "diseño web Hermosillo" | ❌ | ❌ | ❌ | ❌ |
| "landing page" | ❌ | ❌ | ❌ | ✅ |
| "3 días" | ❌ | ❌ | ❌ | ✅ |

**Keyword faltante de alta intención:** "diseño web Hermosillo" — debería estar en H1 o H2.

---

## 4. Schema / Structured Data

### 4.1 Implementación actual

```
@graph
  ├── WebSite (#website) — dateModified, inLanguage: es-MX
  ├── Person (#founder) — Jose Daniel Ibarra Nieblas
  ├── ProfessionalService (#business)
  │   ├── aggregateRating (5★, reviewCount: 3)
  │   ├── review[] — 3 reseñas completas con autor y fecha
  │   ├── areaServed — Hermosillo, Ciudad Obregón, Sonora
  │   ├── sameAs — GBP + Facebook
  │   └── hasOfferCatalog — 4 servicios
  └── FAQPage (#faq)
      └── mainEntity[] — 6 Q&A completos
```

### 4.2 Validación

| Check | Estado | Detalle |
|-------|--------|---------|
| JSON-LD válido | ✅ OK | Sintaxis correcta, sin errores de parseo |
| @graph con @id cross-references | ✅ OK | Entidades enlazadas entre sí |
| ProfessionalService type | ✅ OK | Apropiado para agencia de servicios |
| aggregateRating | ⚠️ RIESGO | Solo 3 reseñas — Google normalmente requiere 5+ |
| FAQPage | ✅ BUENO | 6 preguntas elegibles para FAQ rich results |
| Founder Person entity | ✅ OK | Fortalece E-E-A-T |
| dateModified en WebSite | ✅ OK | 2026-03-21 (al día) |

### 4.3 Schemas faltantes o mejorables

| Schema | Prioridad | Beneficio potencial |
|--------|-----------|-------------------|
| `OpeningHoursSpecification` | Media | Horario de atención en Knowledge Panel |
| `Service` con `offers` y precios | Media | Rich results de precio |
| `itemReviewed` en cada Review | Baja | Enlaza reviews de vuelta al servicio |
| `VideoObject` | Baja | Si se agrega video testimonial |

---

## 5. Performance (Core Web Vitals — Estimado)

> Sin Lighthouse en tiempo real. Estimaciones basadas en análisis de código.

### 5.1 LCP — Estimado: NECESITA MEJORA

- H1 usa word-reveal con animación JS — el paint final del texto se retrasa
- No hay `<link rel="preload">` para fuentes o imagen hero
- Fuentes cargadas con `media="print"` onload ✅ (no render-blocking)
- Font fallback con métricas ajustadas para prevenir FOIT/FOUT ✅

### 5.2 CLS — Estimado: BUENO

- Font fallback con `ascent-override`, `size-adjust` en base.css ✅
- Sin imágenes sin dimensiones explícitas en HTML
- Layout CSS Grid/Flexbox estable

### 5.3 INP — Estimado: BUENO

- JavaScript mínimo: scroll reveals, FAQ accordion, mobile nav, counters
- Sin frameworks pesados
- Scroll listener con `{ passive: true }` ✅

### 5.4 Oportunidades

| Oportunidad | Impacto | Dificultad |
|-------------|---------|-----------|
| Combinar 3 CSS en 1 | Reduce 2 HTTP requests | Baja |
| `<link rel="preload">` para Fraunces | Mejora LCP | Baja |
| Eliminar/reducir animación JS del H1 | Mejora LCP significativamente | Media |

---

## 6. Images

| Check | Estado | Detalle |
|-------|--------|---------|
| alt text en `<img>` | N/A | No hay `<img>` tags — todo es CSS |
| og:image existe | ✅ OK | 47KB JPEG |
| og:image dimensiones | ⚠️ VERIFICAR | Deberían ser 1200×630px |
| favicon.svg | ❌ 404 | Archivo no encontrado en servidor |
| favicon.ico fallback | ⚠️ Sin confirmar | Declarado en HTML |
| Portfolio con screenshots reales | ❌ FALTA | Solo gradientes CSS |
| Indexable en Google Images | ❌ CERO | Sin `<img>` tags en contenido |

**El área de imágenes es la más débil del sitio (35/100).** El portafolio depende exclusivamente de gradientes CSS — no hay fotografías de los proyectos que se puedan indexar ni que generen confianza visual.

---

## 7. AI Search Readiness (GEO)

### 7.1 Accesibilidad para crawlers de IA

| Bot | Estado | Configuración |
|-----|--------|--------------|
| GPTBot (ChatGPT) | ✅ PERMITIDO | Explícito en robots.txt |
| OAI-SearchBot | ✅ PERMITIDO | Explícito en robots.txt |
| ClaudeBot | ✅ PERMITIDO | Explícito en robots.txt |
| PerplexityBot | ✅ PERMITIDO | Explícito en robots.txt |

### 7.2 llms.txt

- ✅ Existe en `/llms.txt` — excelente adopción temprana
- ✅ Contiene: nombre, servicios, precios, proceso, cobertura geográfica, contacto
- ✅ Formato correcto (Markdown estructurado)
- ⚠️ No referenciado en robots.txt (agregar `Llms-txt: https://www.ibanidigital.com/llms.txt`)
- ⚠️ Sin sección de instrucciones para LLMs (ej: "Esta empresa no opera en X")

### 7.3 Citabilidad de pasajes

| Tipo de contenido | Score | Detalle |
|-------------------|-------|---------|
| Datos factuales (precios, plazos) | ✅ ALTO | "$9,000 MXN", "3 días hábiles" — muy citable |
| Entidad identificable | ✅ ALTO | Nombre + empresa + ubicación + contacto |
| FAQ schema | ✅ ALTO | 6 preguntas directamente consumibles por AI |
| Especificidad geográfica | ✅ ALTO | Hermosillo, Ciudad Obregón, Sonora |
| Contenido educativo citeable | ❌ BAJO | Sin artículos, guías ni recursos |
| Menciones externas | ⚠️ DESCONOCIDO | Sin backlinks verificados |

---

## 8. Hallazgos adicionales

### 8.1 Portfolio en dominios externos
- 5 proyectos en `pagina-X.vercel.app`, 1 demo en `ibanidemo.vercel.app`
- Ninguno enlaza de regreso a ibanidigital.com → cero link equity recibido
- Oportunidad: agregar footer con "Desarrollado por IBANI Digital — ibanidigital.com" en cada sitio de cliente

### 8.2 Google Business Profile
- Configurado como negocio de área de servicio (sin dirección pública) ✅
- `sameAs` en schema apunta a URL de GBP ✅

### 8.3 Sitemap — lastmod
- `lastmod: 2026-03-18` en sitemap — reciente ✅
- `changefreq: monthly` — correcto para un sitio estático que actualiza mensualmente

---

## Resumen de puntuaciones por área

```
Technical SEO        ████████████████████░░░░░░░░░  72/100
Content / E-E-A-T    █████████████████████░░░░░░░░  74/100
On-Page SEO          ████████████████████░░░░░░░░░  70/100
Schema               ████████████████████████░░░░░  82/100
Performance (est.)   ███████████████████░░░░░░░░░░  68/100
Images               ██████████░░░░░░░░░░░░░░░░░░░  35/100
AI Search (GEO)      ████████████████████████████░  88/100

OVERALL              ████████████████████░░░░░░░░░  72/100
```
