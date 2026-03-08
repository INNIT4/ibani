# Guía para tu Demo de Rifas (Modo Visual Stático)

He preparado esta carpeta `dist-demo-rifas` con una versión especial de "Modo Escaparate". 

## 🌟 Características de esta Demo
- **Datos Hardcoded:** He modificado la lógica interna para que la página NO necesite conectarse a una base de datos real. Mostrará una rifa de ejemplo ("iPhone de Prueba") con números ya ocupados y apartados de forma visual.
- **Segura por defecto:** Los usuarios pueden navegar, ver el diseño táctil en móviles y el panel administrativo, pero **no podrán enviar datos ni modificar nada**. 
- **Zero Config:** No necesitas configurar Firebase para que la gente la vea; el código ya lleva los datos de demostración incluidos.

## 🚀 Pasos para la Integración

### 1. Copiar y Renombrar
Copia esta carpeta entera dentro del repositorio de tu sitio personal. Puedes renombrarla a algo como `rifas-escaparate`.

### 2. Deploy en Subdominio
Si usas Vercel o similar:
1. Crea un nuevo proyecto apuntando a esta carpeta específica en tu repositorio.
2. Configura el subdominio en los Settings (ej: `demo.tuweb.com`).
3. **¡Listo!** No necesitas subir archivos `.env` complicados porque los datos son estáticos dentro del código.

## 🛠 Qué modifiqué para ti
- **`lib/firestore.ts`**: Reemplacé las llamadas a la base de datos por funciones que devuelven datos de ejemplo al instante.
- **`lib/firebase.ts`**: Desactivé la inicialización real de Firebase para evitar errores de conexión.
- **`RifaInteractive.tsx`**: Las reservas de números ahora son simuladas.

---
> [!TIP]
> Esta es la mejor forma de promocionarte: un sitio que vuela por lo rápido que es (al no consultar bases de datos) y que muestra perfectamente tu talento como diseñador y desarrollador a tus futuros clientes.
