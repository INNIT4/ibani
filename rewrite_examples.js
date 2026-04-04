const fs = require('fs');

const examples = {
  'economico': {
    qEx: 'Imagina que ofreces asesoría legal rápida.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em; display: flex; flex-direction: column; gap: 4px;">' +
         '<span><strong>1. Inicio:</strong> "Defensa Legal en 24h" y tus credenciales inmediatas de autoridad.</span>' +
         '<span><strong>2. Contacto:</strong> Tu horario de trabajo, formulario directo y tu botón enorme de WhatsApp.</span></span>'
  },
  'emprendedor': {
    qEx: 'Imagina que tienes una clínica estética.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em; display: flex; flex-direction: column; gap: 4px;">' +
         '<span><strong>1. Inicio:</strong> La gran promesa y la promoción principal del mes.</span>' +
         '<span><strong>2. Nosotros:</strong> La historia, títulos y certificaciones de los doctores.</span>' +
         '<span><strong>3. Tratamientos:</strong> Tus servicios de inyectables y faciales descritos en breve.</span>' +
         '<span><strong>4. Galería / Contacto:</strong> Carrusel de fotos "antes vs después" conectadas inmediatamente al formulario.</span></span>'
  },
  'emprendedor-pro': {
    qEx: 'Imagina una agencia de viajes premium.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em; display: flex; flex-direction: column; gap: 4px;">' +
         '<span><strong>1. Inicio:</strong> Los destinos más exóticos con un título persuasivo y un gran botón de reserva.</span>' +
         '<span><strong>2. La Agencia:</strong> Por qué ustedes (aseguradoras, guías de prestigio).</span>' +
         '<span><strong>3. Los Paquetes:</strong> "Caribe", "Europa" e "Internacionales" con sus respectivos atractivos visuales.</span>' +
         '<span><strong>4. Lo que nos Oculten:</strong> El problema real de otras agencias vs la solución que te dan ustedes.</span>' +
         '<span><strong>5. Testimonios:</strong> "Mi luna de miel fue un sueño", demostrando confiabilidad enorme.</span>' +
         '<span><strong>6. Contacto:</strong> Toda tu información corporativa y llamada rápida de su reservación.</span></span>'
  },
  'emprendedor-plus': {
    qEx: 'Imagina que vendes un Sistema de Purificación de Agua.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em; display: flex; flex-direction: column; gap: 4px;">' +
         '<span><strong>1. Inicio:</strong> "Agua pura en tu hogar sin garrafones", atrae directo al problema.</span>' +
         '<span><strong>2. El Problema (Agitar la herida):</strong> "Estudios advierten la calidad dudosa del garrafón".</span>' +
         '<span><strong>3. La Solución (Tu Filtro):</strong> Presentando visualmente tu purificador y su magia.</span>' +
         '<span><strong>4. Cómo Beneficia a la Familia:</strong> Listando ahorro, salud y evitar ir a recargar el garrafón de noche.</span>' +
         '<span><strong>5. Especificaciones Técnicas (Features):</strong> Las 4 etapas de ósmosis inversa.</span>' +
         '<span><strong>6. Reseñas y Validaciones:</strong> "Antes compraba 5 garrafones, hoy solo abro la llave".</span>' +
         '<span><strong>7. FAQ\'s (Preguntas):</strong> Resolviendo objeciones: "¿Requiere mantenimiento caro?".</span>' +
         '<span><strong>8. Oferta Central / Contacto:</strong> Las garantías del purificador y su Checkout de compra.</span></span>'
  },
  'emprendedor-avanzado': {
    qEx: 'Imagina que ofreces un Postgrado en Finanzas Corporativas de alto valor.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em; display: flex; flex-direction: column; gap: 4px;">' +
         '<span><strong>1. Inicio:</strong> Título rimbombante de Transformación ejecutiva.</span>' +
         '<span><strong>2. El Gancho / Revelación:</strong> Lo que la industria necesita y no te enseñan en la escuela.</span>' +
         '<span><strong>3. ¿Para quién es el evento?:</strong> Filtrando estrictamente a CEOs y Controllers financieros.</span>' +
         '<span><strong>4. Qué vas a Lograr:</strong> Puntos de transformación dura (Sueldos, conocimientos).</span>' +
         '<span><strong>5. Autoridad del Mentor (El experto):</strong> Sus millones gestionados o fondo de inversión en Silicon Valley.</span>' +
         '<span><strong>6. Metodología Semanal:</strong> Qué pasará específicamente las siguientes 12 semanas.</span>' +
         '<span><strong>7. Casos de Éxito Profundos:</strong> Entrevistas con ex-alumnos, escalando seguridad al top.</span>' +
         '<span><strong>8. Bonos Ocultos y Limitantes:</strong> Acelerar la urgencia (Escasez de asientos VIP).</span>' +
         '<span><strong>9. FAQ\'s Exhaustivas:</strong> "Podré verlo grabado?", justificando más valor que el precio que pagan.</span>' +
         '<span><strong>10. Boton de Ticket Alto:</strong> El gran call-to-action con Formulario completo y entrevista pre-selección.</span></span>'
  },
  'emprendedor-elite': {
    qEx: 'Imagina el prelanzamiento de un Mega Proyecto Inmobiliario de Lujuria.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em; display: flex; flex-direction: column; gap: 4px;">' +
         '<span><strong>1. Portada Visual Inmersiva:</strong> Video ambiental del render al nivel del mar o drone real.</span>' +
         '<span><strong>2. La Visión y Lifestyle:</strong> Párrafos persuasivos sobre la exclusividad y plusvalía natural.</span>' +
         '<span><strong>3. Masterplan Urbano / Ubicación:</strong> Mapa integrando los comercios e isócronas cercanos.</span>' +
         '<span><strong>4. Listado de 20+ Amenidades:</strong> Grilla ultra visual (GYM, Spa, Jacuzzis, Cine VIP).</span>' +
         '<span><strong>5. Modelos de Depas / Unidades:</strong> Diferenciados (Loft, Penthouse, Terraza).</span>' +
         '<span><strong>6. Renders Interiores y Acabados:</strong> Qué maderas o cuarzos vestirá.</span>' +
         '<span><strong>7. Galería Arquitectónica:</strong> Mosaico premium y lightboxes de la zona.</span>' +
         '<span><strong>8. Autoridad de la Constructora:</strong> Presunción del despacho detrás de este proyecto masivo.</span>' +
         '<span><strong>9. Línea de Avances / Time-line:</strong> Cuando inicia estructura, cuando es la entrega de llaves final.</span>' +
         '<span><strong>10. Modelos de Inversión y Retorno (ROI):</strong> Rentabilidad proyectada en Airbnb calculada para el inversor.</span>' +
         '<span><strong>11. Explicación de Etapas de Compra "FAQ":</strong> Explicar pagos, enganches, "Friends & Family pre-sales".</span>' +
         '<span><strong>12. Anclaje y Contacto Final Exclusivo:</strong> Formulario que destila "Asegura tu Patrimonio" guiando directo al asesor de ventas Senior.</span></span>'
  }
};

const files = ['economico', 'emprendedor', 'emprendedor-pro', 'emprendedor-plus', 'emprendedor-avanzado', 'emprendedor-elite'];

for(const file of files) {
   let content = fs.readFileSync('servicios/landing-pages/' + file + '.html', 'utf8');
   const d = examples[file];
   if(d) {
     const p3 = `<p><strong>Un ejemplo estructurado:</strong><br>\n          ${d.qEx}\n          </p>`;
     content = content.replace(/<p><strong>Un ejemplo estructurado:<\/strong><br>[\s\S]*?<\/p>\s*<\/div>\s*<div class="anim-u"/, p3 + '\n        </div>\n        <div class="anim-u"');
     fs.writeFileSync('servicios/landing-pages/' + file + '.html', content, 'utf8');
     console.log('Fixed Texts for: ' + file);
   }
}
