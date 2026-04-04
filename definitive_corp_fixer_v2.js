const fs = require('fs');
const path = require('path');

const plans = [
    { id: 'bronce', name: 'Bronce', price: '22,000', maint: '7,260', pages: '7', sections: '8', watermark: '01', step: '01', ideal: 'Consultoras, despachos jurídicos, médicos independientes o cualquier firma de servicios profesionales que ya opera formalmente y necesita una sede web institucional de primer nivel.', qA: 'Es el arranque de la sede corporativa de la empresa en internet. Un ecosistema inicial de hasta 7 páginas estratégicas organizadas a través de su propio menú de navegación.', qFor: 'Recomendado para consultoras o bufetes de nueva creación que ya requieren presentarse institucionalmente ante clientes, mostrando su catálogo de servicios de forma separada.', example: '<span><strong>1. Inicio Institucional:</strong> Perfil del despacho.</span><span><strong>2-4. (Servicios):</strong> Civil, Penal, Corporativo.</span><span><strong>5. Nosotros:</strong> Equipo y valores.</span><span><strong>6. Portafolio/Casos:</strong> Victorias legales.</span><span><strong>7. Contacto.</strong></span>' },
    { id: 'silver', name: 'Silver', price: '25,000', maint: '8,250', pages: '10', sections: '8', watermark: '02', step: '02', ideal: 'Empresas en crecimiento con múltiples especialidades: constructoras, agencias, hospitales y grupos de consultoría que requieren una página dedicada exclusiva para cada departamento.', qA: 'Crecimiento de la matriz corporativa a 10 páginas. Un sistema web con mayor anchura navegacional para empresas con departamentos segmentados o portafolio extenso.', qFor: 'Ideal para constructoras, agencias o empresas que necesitan dedicar una página entera a cada especialidad, producto o unidad de servicio.', example: '<span><strong>1. Inicio Institucional:</strong> Perfil directivo y misión.</span><span><strong>2-7. (Especialidades):</strong> Asfalto, Obra Civil, Remodelaciones, Proyectos, Maquinaria, Permisos.</span><span><strong>8. Portafolio de Obras:</strong> Proyectos culminados.</span><span><strong>9. Servicios Adicionales.</strong></span><span><strong>10. Contacto y Cotización.</strong></span>' },
    { id: 'gold', name: 'Gold', price: '29,000', maint: '9,570', pages: '15', sections: '8', watermark: '03', step: '03', ideal: 'Instituciones educativas, aseguradoras y organizaciones que dependen de la publicación activa de contenido para generar tráfico orgánico y captar prospectos sin invertir en publicidad.', qA: 'La matriz estándar corporativa con alcance de 15 páginas. Integración nativa a blogs y categorías activas para posicionamiento SEO pasivo.', qFor: 'Instituciones educativas o empresas que dependen de publicar contenido activamente para incrementar su tráfico orgánico.', example: '<span><strong>1. Inicio:</strong> Oferta académica / institucional.</span><span><strong>2-10. (Secciones):</strong> Carreras, Maestrías, Becas, Admisiones, Vida Universitaria.</span><span><strong>11-14. (Dinámicos):</strong> Blog, Noticias, Eventos, Foro.</span><span><strong>15. Contacto General.</strong></span>' },
    { id: 'platino', name: 'Platino', price: '34,000', maint: '11,220', pages: '20', sections: '9', watermark: '04', step: '04', ideal: 'Grupos empresariales con divisiones contrastantes (B2B, B2C, logística, manufactura) que operan bajo un mismo nombre corporativo.', qA: 'Extensión máxima modular de 20 subpáginas. Construido para empresas con operaciones a gran escala o divisiones muy contrastantes.', qFor: 'Corporativos que manejan divisiones independientes y necesitan agruparlas internamente sin confundir al usuario.', example: '<span><strong>1. Portada del Grupo:</strong> Visión global.</span><span><strong>2-12. (Divisiones):</strong> Logística Nacional, Aduanas, Bodegaje, Transportes, etc.</span><span><strong>13-18. (Corporativo):</strong> Inversionistas, Prensa, RRHH, Sucursales.</span><span><strong>19. Soporte/FAQ.</strong></span><span><strong>20. Contacto Ejecutivo.</strong></span>' },
    { id: 'diamante', name: 'Diamante', price: '38,000', maint: '12,540', pages: '25', sections: '9', watermark: '05', step: '05', ideal: 'Franquicias nacionales, redes financieras, grupos retailers o consorcios con presencia en múltiples estados que requieren páginas por región.', qA: 'Mega despliegue ejecutivo de 25 páginas. Ideal para empresas con páginas exclusivas de soporte, talento, perfiles regionales y sub-marcas.', qFor: 'Franquicias a nivel república o redes de retail que necesitan páginas independientes por estado con promociones locales.', example: '<span><strong>1. Matriz:</strong> Localizador y oferta nacional.</span><span><strong>2-20. (Regiones):</strong> Ciudad de México, Monterrey, Guadalajara, etc.</span><span><strong>21-24. (Herramientas):</strong> Portal Clientes, Calculadora, FAQ, Blog.</span><span><strong>25. Contacto Corporativo.</strong></span>' },
    { id: 'esmeralda', name: 'Esmeralda', price: '44,500', maint: '14,685', pages: '30', sections: '9', watermark: '06', step: '06', ideal: 'Corporativos globales, grupos industriales o holdings multinacionales con docenas de divisiones activas y múltiples países de operación.', qA: 'El grado final: 30 subpáginas que operan como ecosistemas digitales simultáneos con mega-navegaciones anidadas.', qFor: 'Compañías paraguas o grandes armadoras que manejan bases informativas saturadas de keywords SEO.', example: '<span><strong>1. Portal Global:</strong> Presencia internacional.</span><span><strong>2-22. (Niveles):</strong> Divisiones Industriales, Farmacéutica, Energía, etc.</span><span><strong>23-28. (Governance):</strong> Sustentabilidad, Ética, Investors, Newsroom.</span><span><strong>29. Career Center.</strong></span><span><strong>30. Contacto Global.</strong></span>' }
];

const dir = 'servicios/sitios-corporativos';

plans.forEach(plan => {
    const filePath = path.join(dir, `${plan.id}.html`);
    if (!fs.existsSync(filePath)) return;

    let html = fs.readFileSync(filePath, 'utf8');

    // SEO
    html = html.replace(/<title>.*?<\/title>/, `<title>Sitio Corporativo ${plan.name} — IBANI Digital</title>`);
    html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="Plan ${plan.name}: ${plan.pages} páginas maestras, ${plan.sections} secciones c/u, dominio, hosting y SSL. Todo por $${plan.price} MXN.">`);

    // Hero
    html = html.replace(/<span class="plan-watermark" aria-hidden="true">.*?<\/span>/, `<span class="plan-watermark" aria-hidden="true">${plan.watermark}</span>`);
    html = html.replace(/<span class="plan-hero__num">Plan .*? de 6 · Corporativos<\/span>/, `<span class="plan-hero__num">Plan ${plan.step} de 6 · Corporativos</span>`);
    html = html.replace(/Sitio <em>.*?<\/em>/, `Sitio <em>${plan.name}</em>`);
    html = html.replace(/<span class="plan-hero__price">.*?<\/span>/, `<span class="plan-hero__price">$${plan.price} MXN</span>`);
    html = html.replace(/<strong>Ideal para:<\/strong>.*?<\/p>/, `<strong>Ideal para:</strong> ${plan.ideal} </p>`);
    html = html.replace(/<strong>¿Qué es\?<\/strong><br>.*?<\/p>/, `<strong>¿Qué es?</strong><br>${plan.qA}</p>`);
    html = html.replace(/<strong>¿Para quién sirve\?<\/strong><br>.*?<\/p>/, `<strong>¿Para quién sirve?</strong><br>${plan.qFor}</p>`);
    
    // Example block in Hero
    const exampleRegex = /<strong>Un ejemplo estructurado:<\/strong><br>.*?<span style="display:block;margin-top:6px;padding-left:12px;border-left:2px solid var(--accent);font-size:0.95em;display:flex;flex-direction:column;gap:4px;">([\s\S]*?)<\/span>/;
    html = html.replace(exampleRegex, `<strong>Un ejemplo estructurado:</strong><br>Plan sugerido para este nivel:<br><span style="display:block;margin-top:6px;padding-left:12px;border-left:2px solid var(--accent);font-size:0.95em;display:flex;flex-direction:column;gap:4px;">${plan.example}</span>`);

    // Everything included section (inc-list)
    html = html.replace(/<li class="inc-item"><span class="inc-check"><svg viewBox="0 0 12 12">\s*<polyline points="2,6 5,9 10,3" \/>\s*<\/svg><\/span>.*?páginas maestras<\/li>/, 
        `<li class="inc-item"><span class="inc-check"><svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg></span>${plan.pages} páginas maestras</li>`);
    
    html = html.replace(/Entrega en .*? días hábiles \(a partir de contar con la información completa\)/, `Entrega en 15 días hábiles (a partir de contar con la información completa)`);

    // Sidebar Card
    html = html.replace(/<p class="plan-card__name">.*?<\/p>/, `<p class="plan-card__name">Sitio ${plan.name}</p>`);
    html = html.replace(/<p class="plan-card__price">.*?<\/p>/, `<p class="plan-card__price">$${plan.price} MXN</p>`);

    // Spec Table in Sidebar
    const specTableRegex = /<table class="spec-table">[\s\S]*?<\/table>/;
    const newSpecTable = `
              <table class="spec-table">
                <tbody>
                  <tr class="spec-row">
                    <td class="spec-label">Páginas Maestras</td>
                    <td class="spec-val">${plan.pages}</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Secciones por página</td>
                    <td class="spec-val">${plan.sections}</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Buzón Corporativo</td>
                    <td class="spec-val">Incluido</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Dominio y SSL</td>
                    <td class="spec-val">Incluido (1er año)</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Tiempo de Desarrollo</td>
                    <td class="spec-val">15 días hábiles</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Mantenimiento Anual</td>
                    <td class="spec-val">${plan.maint} MXN</td>
                  </tr>
                </tbody>
              </table>`;
    html = html.replace(specTableRegex, newSpecTable);

    // WhatsApp
    const waText = `Hola%2C%20quiero%20el%20Plan%20${plan.name}%20Corporativo%20%24${plan.price.replace(',', '%2C')}%20MXN`;
    html = html.replace(/wa\.me\/526625044016\?text=.*?["\s]/g, (match) => {
        return `wa.me/526625044016?text=${waText}"`;
    });

    fs.writeFileSync(filePath, html);
    console.log(`Plan ${plan.name} fixed (v2) successfully.`);
});
