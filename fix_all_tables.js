const fs = require('fs');

const plans = [
  { slug: 'bronce', pages: '7',  sec: '8',  planNum: '1'  },
  { slug: 'silver', pages: '10', sec: '8',  planNum: '2'  },
  { slug: 'gold',   pages: '15', sec: '8',  planNum: '3'  },
  { slug: 'platino',pages: '20', sec: '9',  planNum: '4'  },
  { slug: 'diamante',pages:'25', sec: '9',  planNum: '5'  },
  { slug: 'esmeralda',pages:'30',sec: '9',  planNum: '6'  },
];

const newTbody = `
            <tbody>
              <tr class="group-row">
                <td colspan="7">Estructura Base</td>
              </tr>
              <tr>
                <td>Páginas Maestras</td>
                <td><span class="c-val">7</span></td>
                <td><span class="c-val">10</span></td>
                <td><span class="c-val">15</span></td>
                <td><span class="c-val">20</span></td>
                <td><span class="c-val">25</span></td>
                <td><span class="c-val">30</span></td>
              </tr>
              <tr>
                <td>Secciones por Página</td>
                <td><span class="c-val">8</span></td>
                <td><span class="c-val">8</span></td>
                <td><span class="c-val">8</span></td>
                <td><span class="c-val">9</span></td>
                <td><span class="c-val">9</span></td>
                <td><span class="c-val">9</span></td>
              </tr>
              <tr>
                <td>Dominio Premium (.com o .mx)</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr>
                <td>Hosting Profesional (1 año)</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr class="group-row">
                <td colspan="7">Diseño y Desarrollo</td>
              </tr>
              <tr>
                <td>Diseño 100% Personalizado</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr>
                <td>Adaptable a cualquier Móvil</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr>
                <td>Micro-interacciones y Animaciones</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr>
                <td>Revisiones de Cambios</td>
                <td><span class="c-val">2</span></td>
                <td><span class="c-val">2</span></td>
                <td><span class="c-val">2</span></td>
                <td><span class="c-val">2</span></td>
                <td><span class="c-val">2</span></td>
                <td><span class="c-val">2</span></td>
              </tr>
              <tr class="group-row">
                <td colspan="7">Sistema Corporativo</td>
              </tr>
              <tr>
                <td>Buzón Corporativo (Correos)</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr>
                <td>Formularios Ilimitados</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr>
                <td>WhatsApp + Chat de Soporte</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr class="group-row">
                <td colspan="7">SEO, Rendimiento y Seguridad</td>
              </tr>
              <tr>
                <td>Certificado SSL Encriptado</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr>
                <td>Alta Indexación en Google</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr>
                <td>Google Maps + Redes Sociales</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr class="group-row">
                <td colspan="7">Entrega</td>
              </tr>
              <tr>
                <td>Tiempo de Desarrollo</td>
                <td><span class="c-val">15 días</span></td>
                <td><span class="c-val">15 días</span></td>
                <td><span class="c-val">15 días</span></td>
                <td><span class="c-val">15 días</span></td>
                <td><span class="c-val">15 días</span></td>
                <td><span class="c-val">15 días</span></td>
              </tr>
              <tr>
                <td>Pago en Parcialidades</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
            </tbody>
`;

const newSpecTable = (p) => `
              <table class="spec-table">
                <tbody>
                  <tr class="spec-row">
                    <td class="spec-label">Páginas Maestras</td>
                    <td class="spec-val">${p.pages}</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Secciones por página</td>
                    <td class="spec-val">${p.sec}</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Diseño UI exclusivo</td>
                    <td class="spec-val">Incluido</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Buzón Corporativo</td>
                    <td class="spec-val">Incluido</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Formularios dinámicos</td>
                    <td class="spec-val">Ilimitados</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Dominio y SSL</td>
                    <td class="spec-val">Incluido (1er año)</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Pago en parcialidades</td>
                    <td class="spec-val">Disponible</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Tiempo de Desarrollo</td>
                    <td class="spec-val">15 días hábiles</td>
                  </tr>
                </tbody>
              </table>
`;

for (const p of plans) {
  const filepath = `servicios/sitios-corporativos/${p.slug}.html`;
  let c = fs.readFileSync(filepath, 'utf8');

  // Replace tbody of compare table
  c = c.replace(/<tbody>[\s\S]*?<\/tbody>/, newTbody);

  // Replace spec table (sidebar black card)
  c = c.replace(/<table class="spec-table">[\s\S]*?<\/table>/, newSpecTable(p));

  // Fix compare-table class to use plan number correctly (plan-02 is wrong, needs plan-2)
  c = c.replace(/class="compare-table plan-0?(\d)"/, `class="compare-table plan-${p.planNum}"`);

  fs.writeFileSync(filepath, c, 'utf8');
  console.log(`✓ ${p.slug} table updated`);
}

console.log('\nAll tables refreshed!');
