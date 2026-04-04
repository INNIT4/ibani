const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'servicios', 'landing-pages', 'economico.html');
const srcContent = fs.readFileSync(srcPath, 'utf8');

// Extraemos la etiqueta <style> completa de economico.html
const styleRegex = /<style>[\s\S]*?<\/style>/;
const match = srcContent.match(styleRegex);

if (!match) {
  console.error("No se encontró <style> en economico.html");
  process.exit(1);
}

const newStyle = match[0];

// Directorios a actualizar
const dirs = [
  path.join(__dirname, 'servicios', 'tiendas'),
  path.join(__dirname, 'servicios', 'software-administrativo'),
  path.join(__dirname, 'servicios', 'rifas')
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.html')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Reemplazar la etiqueta <style>
      if (styleRegex.test(content)) {
        content = content.replace(styleRegex, newStyle);
        
        // Also fix the layout of plan-nav__item-num since old ones didn't have it
        // The old plan-nav item does not have plan-nav__item-num. It looks like:
        // <span class="plan-nav__item-name">...</span>
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated CSS in ${filePath}`);
      }
    }
  }
}
