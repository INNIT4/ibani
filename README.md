# IBANI - Landing

Página IBANI con **animaciones interactivas** y **funcionalidad** lista para usar.

## Cómo ver la página

1. Abre la carpeta `rifaspro-landing` en tu editor.
2. Abre el archivo `index.html` en tu navegador (doble clic o arrastrar al navegador).

También puedes usar un servidor local, por ejemplo con Live Server en VS Code/Cursor o con Python:

```bash
cd rifaspro-landing
python -m http.server 8080
```

Luego visita: http://localhost:8080

## Contenido y funcionalidad

- **Header fijo** con navegación y menú móvil.
- **Hero** con título, CTAs y estadísticas que se animan al hacer scroll.
- **Características** con tarjetas que aparecen al scroll y **ruleta de sorteo** (botón "INICIAR SORTEO").
- **5 pasos** para crear un sorteo (formularios de ejemplo, compartir, pagos, **mini ruleta** en el paso 5).
- **Calculadora de precios**: presets, +/- , slider y tabla que se resalta según la cantidad elegida.
- **FAQ** con búsqueda en tiempo real, filtros por categoría y acordeón con animación.
- **Contacto**: tarjetas clicables (email, teléfono, WhatsApp) y formulario con validación y mensaje de envío.
- **Footer** con enlaces y redes.

## Estructura

```
rifaspro-landing/
├── index.html    # Página principal (una sola página con todas las secciones)
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
└── README.md
```

## Personalización

- Colores y tipografía: variables CSS en `:root` en `css/styles.css`.
- Textos, emails y teléfonos: edita `index.html` y, si quieres, `js/main.js` para el envío real del formulario (backend).
