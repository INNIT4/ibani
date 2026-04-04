const fs = require('fs');
const glob = require('fs');

const files = [
  'servicios/landing-pages.html',
  'servicios/landing-pages/economico.html',
  'servicios/landing-pages/emprendedor.html',
  'servicios/landing-pages/emprendedor-pro.html',
  'servicios/landing-pages/emprendedor-plus.html',
  'servicios/landing-pages/emprendedor-avanzado.html',
  'servicios/landing-pages/emprendedor-elite.html'
];

for (const file of files) {
   let content = fs.readFileSync(file, 'utf8');

   // Fix glitch 1: the 2,000 MXN glitch
   content = content.replace(/\+ <\/section>2,000 MXN<\/p>/g, '+ $12,000 MXN</p>');
   content = content.replace(/\+ <\/section>2,000/g, '+ $12,000'); // Just in case

   // Fix glitch 2: the "Negocios" string
   content = content.replace(/<th><span class="th-name">Negocios<\/span>/g, '<th><span class="th-name">Emprendedor Pro</span>');
   content = content.replace(/Plan(?:%20| )Negocios/gi, 'Plan%20Emprendedor%20Pro');

   fs.writeFileSync(file, content, 'utf8');
   console.log('Fixed glitches in: ' + file);
}
