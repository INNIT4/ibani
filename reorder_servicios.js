const fs = require('fs');

const path = 'servicios.html';
let content = fs.readFileSync(path, 'utf8');

const newOrder = ['landing', 'corporativos', 'software', 'rifas', 'tiendas', 'citas', 'sistemas'];

// Match the start of the first block (landing)
const s1Match = content.match(/<!-- ═+ -->\r?\n\s*<section class="svc-block" id="landing">/);
// Match the start of the CTA FINAL section
const s2Match = content.match(/<!-- ═+ -->\r?\n\s*<!-- CTA FINAL/);

if (!s1Match || !s2Match) {
  console.log("Could not find start/end bounds.");
  process.exit(1);
}

const s1 = s1Match.index;
const s2 = s2Match.index;

let blocksPart = content.substring(s1, s2);
const sectionsMap = {};

// The blocks are now separated just by the visual line comment
const blocks = blocksPart.split(/<!-- ═+ -->/).filter(b => b.trim().length > 0);

for(let b of blocks) {
  let idMatch = b.match(/<section class="svc-block" id="([^"]+)">/);
  if (idMatch) {
    sectionsMap[idMatch[1]] = b.trim();
  }
}

let newSectionsText = '';
newOrder.forEach((id, idx) => {
  if (sectionsMap[id]) {
    let blockText = sectionsMap[id];
    let num = (idx + 1).toString().padStart(2, '0');
    let isEven = (idx + 1) % 2 === 0;

    let contentClass = isEven ? 's3d-r' : 's3d-l';
    let visualClass = isEven ? 's3d-l' : 's3d-r';

    // Update numbering
    blockText = blockText.replace(/<div class="svc-block__bg-num" aria-hidden="true">[0-9]+<\/div>/, `<div class="svc-block__bg-num" aria-hidden="true">${num}</div>`);
    blockText = blockText.replace(/<span class="svc-content__index-label">Servicio [0-9]+<\/span>/, `<span class="svc-content__index-label">Servicio ${num}</span>`);
    
    // Fix Orientation Classes
    blockText = blockText.replace(/reveal (s3d-l|s3d-r)/g, (m, p1) => {
        // If it's inside a svc-visual container, use visualClass
        // This is a bit naive but let's try to be specific
        return 'reveal ' + contentClass; 
    });
    
    // Specifically target visual class which is usually at the bottom of the block
    blockText = blockText.replace(/class="svc-visual reveal s3d-(l|r)"/g, `class="svc-visual reveal ${visualClass}"`);

    newSectionsText += '    <!-- ══════════════════════════════════════════════════════════ -->\n    ' + blockText + '\n\n';
  }
});

let finalContent = content.substring(0, s1) + newSectionsText + '    ' + content.substring(s2);

const names = {
  landing: "Landing Pages",
  corporativos: "Sitios Corporativos",
  software: "Software Administrativo",
  rifas: "Plataformas de Rifas",
  tiendas: "Tiendas Online",
  citas: "Citas Online",
  sistemas: "Sistemas a Medida",
};

let pillsHTML = newOrder.map((id, idx) => {
    let num = (idx + 1).toString().padStart(2, '0');
    let href = (id === 'corporativos' || id === 'tiendas' || id === 'rifas' || id === 'software') ? `/servicios/${id}` : '#' + id;
    if (id === 'landing') href = '/servicios/landing-pages';
    if (id === 'corporativos') href = '/servicios/sitios-corporativos';
    
    return `          <a href="${href}" class="svc-nav__pill"><span class="svc-nav__pill-num">${num}</span> ${names[id]}</a>`;
}).join('\n');

finalContent = finalContent.replace(/<nav class="svc-nav anim-u[^>]*>[\s\S]*?<\/nav>/, 
  `<nav class="svc-nav anim-u" style="--delay:.48s" aria-label="Ir a servicio">\n${pillsHTML}\n        </nav>`
);

fs.writeFileSync(path, finalContent, 'utf8');
console.log('Reordered and fixed orientation in servicios.html successfully.');
