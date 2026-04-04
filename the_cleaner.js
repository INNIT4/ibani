const fs = require('fs');
const path = require('path');

const cleanTbody = `
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
                <td colspan="7">Políticas de Entrega</td>
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
                <td>Mantenimiento Año 2+ (33%)</td>
                <td><span class="c-val" style="font-size:.72rem">$7,260</span></td>
                <td><span class="c-val" style="font-size:.72rem">$8,250</span></td>
                <td><span class="c-val" style="font-size:.72rem">$9,570</span></td>
                <td><span class="c-val" style="font-size:.72rem">$11,220</span></td>
                <td><span class="c-val" style="font-size:.72rem">$12,540</span></td>
                <td><span class="c-val" style="font-size:.72rem">$14,685</span></td>
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

const plans = ['bronce', 'silver', 'gold', 'platino', 'diamante', 'esmeralda'];
const dir = 'servicios/sitios-corporativos';

plans.forEach((id, index) => {
    const filePath = path.join(dir, `${id}.html`);
    if (!fs.existsSync(filePath)) return;

    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Identify the compare table section
    // We'll replace everything from <thead> until the first </table> after it inside compare-section
    const startTag = '<table class="compare-table';
    const endTag = '</table>';
    
    // We need to be careful with the broken tags. 
    // The most reliable way is to find the thead and then find the NEXT </table> that is NOT followed by 1,220 or similar junk.
    
    const tableStartIdx = html.indexOf(startTag);
    if (tableStartIdx === -1) {
        console.log(`Could not find table start in ${id}`);
        return;
    }

    // Capture the <thead> (it should be relatively intact)
    const currentPlanNum = index + 1;
    const thead = `
            <thead>
              <tr>
                <th class="th-features">Características</th>
                <th><span class="th-name">Sitio Bronce</span><span class="th-price">$22,000</span></th>
                <th><span class="th-name">Sitio Silver</span><span class="th-price">$25,000</span></th>
                <th><span class="th-name">Sitio Gold</span><span class="th-price">$29,000</span></th>
                <th><span class="th-name">Sitio Platino</span><span class="th-price">$34,000</span></th>
                <th><span class="th-name">Sitio Diamante</span><span class="th-price">$38,000</span></th>
                <th><span class="th-name">Sitio Esmeralda</span><span class="th-price">$44,500</span></th>
              </tr>
            </thead>`;

    const fullNewTable = `
          <table class="compare-table plan-${currentPlanNum}">
            ${thead}
            ${cleanTbody}
          </table>`;

    // Now find where the compare section ends
    const sectionStartIdx = html.indexOf('<section class="compare-section">');
    const nextSectionIdx = html.indexOf('<section class="extras-section">');
    
    if (sectionStartIdx !== -1 && nextSectionIdx !== -1) {
        const sectionContent = html.substring(sectionStartIdx, nextSectionIdx);
        // We'll replace the inner div container contents
        const containerStart = sectionContent.indexOf('<div class="compare-wrap reveal">');
        if (containerStart !== -1) {
            const beforeContainer = sectionContent.substring(0, containerStart + '<div class="compare-wrap reveal">'.length);
            const afterContainer = '</div>\n      </div>\n    '; // We'll just assume this standard closure
            
            const newSectionContent = beforeContainer + '\n            ' + fullNewTable + '\n        ' + afterContainer;
            
            html = html.substring(0, sectionStartIdx) + newSectionContent + html.substring(nextSectionIdx);
        }
    }

    fs.writeFileSync(filePath, html);
    console.log(`Cleanup of ${id} table finished.`);
});
