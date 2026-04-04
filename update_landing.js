const fs = require("fs");
let file = "servicios/landing-pages.html";
let content = fs.readFileSync(file, "utf8");

// Change logic:
// Plan 3: Negocios -> Emprendedor Pro
content = content.replace('<p class="pc-name">Negocios</p>', '<p class="pc-name">Emprendedor Pro</p>');
// Price is still 7,500
content = content.replace('text=Hola%2C%20quiero%20el%20Plan%20Negocios', 'text=Hola%2C%20quiero%20el%20Plan%20Emprendedor%20Pro');

// Plan 4: Microempresa -> Emprendedor Plus (Price + 3500 => 9,500 + 3,500 = 13,000)
content = content.replace('<p class="pc-name">Microempresa</p>', '<p class="pc-name">Emprendedor Plus</p>');
content = content.replace('<span class="pc-amount">9,500</span>', '<span class="pc-amount">13,000</span>');
content = content.replace('text=Hola%2C%20quiero%20el%20Plan%20Microempresa%20de%20sitio%20web%20%249%2C500', 'text=Hola%2C%20quiero%20el%20Plan%20Emprendedor%20Plus%20de%20sitio%20web%20%2413%2C000');

// Plan 5: PyME -> Emprendedor Avanzado (Price + 4500 => 11,500 + 4,500 = 16,000)
content = content.replace('<p class="pc-name">PyME</p>', '<p class="pc-name">Emprendedor Avanzado</p>');
content = content.replace('<span class="pc-amount">11,500</span>', '<span class="pc-amount">16,000</span>');
content = content.replace('text=Hola%2C%20quiero%20el%20Plan%20PyME%20de%20sitio%20web%20%2411%2C500', 'text=Hola%2C%20quiero%20el%20Plan%20Emprendedor%20Avanzado%20de%20sitio%20web%20%2416%2C000');

// Plan 6: Empresarial -> Emprendedor Elite (Price + 6000 => 14,000 + 6,000 = 20,000)
content = content.replace('<p class="pc-name">Empresarial</p>', '<p class="pc-name">Emprendedor Elite</p>');
content = content.replace('<span class="pc-amount">14,000</span>', '<span class="pc-amount">20,000</span>');
content = content.replace('text=Hola%2C%20quiero%20el%20Plan%20Empresarial%20de%20sitio%20web%20%2414%2C000', 'text=Hola%2C%20quiero%20el%20Plan%20Emprendedor%20Elite%20de%20sitio%20web%20%2420%2C000');

// Change section description slightly
content = content.replace(
  'Elige el plan que más se ajuste a tu negocio', 
  'Elige el plan que más se ajuste a tu emprendimiento'
);

// We need to also rename the detail characteristic pages that the "Características" link points to
content = content.replace('href="/servicios/landing-pages/negocios"', 'href="/servicios/landing-pages/emprendedor-pro"');
content = content.replace('href="/servicios/landing-pages/microempresa"', 'href="/servicios/landing-pages/emprendedor-plus"');
content = content.replace('href="/servicios/landing-pages/pyme"', 'href="/servicios/landing-pages/emprendedor-avanzado"');
content = content.replace('href="/servicios/landing-pages/empresarial"', 'href="/servicios/landing-pages/emprendedor-elite"');

fs.writeFileSync(file, content);
console.log("Updated landing-pages.html prices and names");

// Now update llms.txt
let llmsFile = "llms.txt";
let llmsContent = fs.readFileSync(llmsFile, "utf8");
llmsContent = llmsContent.replace('Plan Negocios: $7,500 MXN', 'Plan Emprendedor Pro: $7,500 MXN');
llmsContent = llmsContent.replace('Plan Microempresa: $9,500 MXN', 'Plan Emprendedor Plus: $13,000 MXN');
llmsContent = llmsContent.replace('Plan PyME: $11,500 MXN', 'Plan Emprendedor Avanzado: $16,000 MXN');
llmsContent = llmsContent.replace('Plan Empresarial: $14,000 MXN', 'Plan Emprendedor Elite: $20,000 MXN');
fs.writeFileSync(llmsFile, llmsContent);
console.log("Updated llms.txt with new prices and names");

