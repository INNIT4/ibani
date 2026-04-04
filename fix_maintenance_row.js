const fs = require('fs');

// The new row to inject before </tbody> in the compare table
const newRow = `
              <tr>
                <td>Mantenimiento Año 2+ (33% anual)</td>
                <td><span class="c-val" style="font-size:.72rem">$7,260</span></td>
                <td><span class="c-val" style="font-size:.72rem">$8,250</span></td>
                <td><span class="c-val" style="font-size:.72rem">$9,570</span></td>
                <td><span class="c-val" style="font-size:.72rem">$11,220</span></td>
                <td><span class="c-val" style="font-size:.72rem">$12,540</span></td>
                <td><span class="c-val" style="font-size:.72rem">$14,685</span></td>
              </tr>`;

const plans = ['bronce', 'silver', 'gold', 'platino', 'diamante', 'esmeralda'];

for (const slug of plans) {
  const filepath = `servicios/sitios-corporativos/${slug}.html`;
  let c = fs.readFileSync(filepath, 'utf8');

  // Target the compare-section and add the row before its </tbody>
  // We find the compare-section block, then replace the last </tbody> inside it
  const compareSectionMatch = c.match(/(<section class="compare-section">[\s\S]*?<\/section>)/);
  if (compareSectionMatch) {
    const oldSection = compareSectionMatch[1];
    // Insert new row before the last </tbody> in this section
    const newSection = oldSection.replace(/(\s*<\/tbody>\s*<\/table>)/, newRow + '\n            $1');
    c = c.replace(oldSection, newSection);
    fs.writeFileSync(filepath, c, 'utf8');
    console.log(`✓ ${slug} — Mantenimiento row added`);
  } else {
    console.log(`✗ ${slug} — compare-section not found`);
  }
}

console.log('\nDone!');
