const fs = require('fs');

const plans = [
  { slug: 'bronce',   pages: '7',  sec: '8', planNum: '1' },
  { slug: 'silver',   pages: '10', sec: '8', planNum: '2' },
  { slug: 'gold',     pages: '15', sec: '8', planNum: '3' },
  { slug: 'platino',  pages: '20', sec: '9', planNum: '4' },
  { slug: 'diamante', pages: '25', sec: '9', planNum: '5' },
  { slug: 'esmeralda',pages: '30', sec: '9', planNum: '6' },
];

const newTbody = `<tbody>
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
                <td>Animaciones y Micro-interacciones</td>
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
            </tbody>`;

for (const p of plans) {
  const filepath = `servicios/sitios-corporativos/${p.slug}.html`;
  let c = fs.readFileSync(filepath, 'utf8');

  // The compare table is inside <section class="compare-section">, we target its tbody specifically
  // by replacing the block between </thead> and </table> inside compare-section
  c = c.replace(
    /(<section class="compare-section">[\s\S]*?<\/thead>\s*)(<tbody>[\s\S]*?<\/tbody>)/,
    (match, before) => before + newTbody
  );

  // Fix compare-table class  
  c = c.replace(/class="compare-table plan-0?(\d+)"/, `class="compare-table plan-${p.planNum}"`);

  fs.writeFileSync(filepath, c, 'utf8');
  console.log(`✓ ${p.slug} compare-table updated`);
}

console.log('\nDone! All compare tables fixed.');
