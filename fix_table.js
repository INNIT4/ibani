const fs = require('fs');

let c = fs.readFileSync('servicios/sitios-corporativos/bronce.html', 'utf8');

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
                <td>Revisión de Cambios Estructurales</td>
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
                <td>Correos Institucionales (Buzón)</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr>
                <td>Formularios de Captura Ilimitados</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr>
                <td>Chat de Soporte Técnico (WhatsApp)</td>
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
                <td>Certificado de Seguridad SSL Encriptado</td>
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
                <td>Integración Google Maps y Redes</td>
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
                <td>Capacitación de Uso (Opcional)</td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
                <td><span class="c-yes"></span></td>
              </tr>
              <tr>
                <td>Tiempo Estimado de Entrega total</td>
                <td><span class="c-val">15 días</span></td>
                <td><span class="c-val">15 días</span></td>
                <td><span class="c-val">15 días</span></td>
                <td><span class="c-val">15 días</span></td>
                <td><span class="c-val">15 días</span></td>
                <td><span class="c-val">15 días</span></td>
              </tr>
              <tr>
                <td>Plan de Pagos Flexibles</td>
                <td><span class="c-val" style="font-size:.72rem">Parcialidades</span></td>
                <td><span class="c-val" style="font-size:.72rem">Parcialidades</span></td>
                <td><span class="c-val" style="font-size:.72rem">Parcialidades</span></td>
                <td><span class="c-val" style="font-size:.72rem">Parcialidades</span></td>
                <td><span class="c-val" style="font-size:.72rem">Parcialidades</span></td>
                <td><span class="c-val" style="font-size:.72rem">Parcialidades</span></td>
              </tr>
            </tbody>
`;

const tbodyRegex = /<tbody>[\s\S]*?<\/tbody>/;
c = c.replace(tbodyRegex, newTbody);

// The user also wants to refine the table inside the individual black card (.spec-table) 
// The black card has a mini spec list:
/*
                <table class="spec-table">
                  <tbody>
                    <tr class="spec-row">
                      <td class="spec-label">Secciones</td>
                      <td class="spec-val">2</td>
                    ...
*/
// I should update it as well to match the corporate logic for Bronce
const oldSpecTableMatch = c.match(/<table class="spec-table">[\s\S]*?<\/table>/);

const newSpecTable = `
              <table class="spec-table">
                <tbody>
                  <tr class="spec-row">
                    <td class="spec-label">Páginas Maestras</td>
                    <td class="spec-val">7</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Secciones por página</td>
                    <td class="spec-val">8</td>
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
                    <td class="spec-label">Capacidad de Multimedia</td>
                    <td class="spec-val">Ilimitada</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Formularios dinámicos</td>
                    <td class="spec-val">Ilimitados</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Dominio y Certificado SSL</td>
                    <td class="spec-val">Incluido (1er año)</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Pago en parcialidades</td>
                    <td class="spec-val">Revisable</td>
                  </tr>
                  <tr class="spec-row">
                    <td class="spec-label">Tiempo de Desarrollo</td>
                    <td class="spec-val">15 días hábiles</td>
                  </tr>
                </tbody>
              </table>
`;

if(oldSpecTableMatch) {
  c = c.replace(oldSpecTableMatch[0], newSpecTable);
}

fs.writeFileSync('servicios/sitios-corporativos/bronce.html', c, 'utf8');
console.log('Comparative table modernized for Corporate Sites!');
