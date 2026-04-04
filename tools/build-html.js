const fs = require('fs');
const path = require('path');

const includesDir = path.join(__dirname, '../includes');
const rootDir = path.join(__dirname, '..');

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!['node_modules', 'dist-demo-rifas', '.git', 'includes', 'tools'].includes(file)) {
        getHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const components = {
  header: fs.readFileSync(path.join(includesDir, 'header.html'), 'utf8'),
  footer: fs.readFileSync(path.join(includesDir, 'footer.html'), 'utf8'),
};

const htmlFiles = getHtmlFiles(rootDir);

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Unify Header (Now handles potential separate nav__mobile block)
  // Remove any separate nav__mobile block first to avoid duplicates
  content = content.replace(/<div class="nav__mobile"[\s\S]*?<\/div>/i, '');
  
  // Replace the header block
  content = content.replace(/<header[\s\S]*?<\/header>/i, components.header);

  // 2. Unify Footer
  content = content.replace(/<footer[\s\S]*?<\/footer>/i, components.footer);

  // 3. Remove Redundant Global Style Parts (Variables & Reset)
  content = content.replace(/<style>[\s\S]*?:root\{[\s\S]*?\}[\s\S]*?<\/style>/i, (match) => {
    let cleaned = match.replace(/:root\{[\s\S]*?\}/i, '/* Tokens moved to all.min.css */');
    cleaned = cleaned.replace(/\*,[\s\S]*?body\{[\s\S]*?\}/i, '/* Reset moved to all.min.css */');
    cleaned = cleaned.replace(/@font-face\{[\s\S]*?\}/i, '');
    return cleaned;
  });

  // 4. Ensure global CSS and JS are linked correctly
  if (!content.includes('all.min.css')) {
     content = content.replace('</head>', '  <link rel="stylesheet" href="/css/all.min.css">\n</head>');
  }
  
  // Ensure main.min.js is the only script if others like nav.js were present
  content = content.replace(/<script src=".*?nav\.js.*?"><\/script>/gi, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Cleaned & Optimized: ${path.relative(rootDir, filePath)}`);
  }
});
