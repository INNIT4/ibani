const fs = require("fs");
const files = ["index.html", "servicios.html", "servicios/landing-pages.html", "servicios/sitios-corporativos.html"];
files.forEach(f => {
  let c = fs.readFileSync(f, "utf8");
  
  c = c.replace(/<span class="dd-content"><strong>Landing Pages<\/strong><small>([^<]+)<\/small><\/span>\s*<\/a>\s*<a href="\/servicios\/tiendas">/g, '<span class="dd-content"><strong>Landing Pages</strong><small>$1</small></span></a>\n              <a href="/servicios/sitios-corporativos">\n                <span class="dd-icon">🏢</span>\n                <span class="dd-content"><strong>Sitios Corporativos</strong><small>desde $22,000 MXN</small></span>\n              </a>\n              <a href="/servicios/tiendas">');
  
  c = c.replace(/<span class="dd-content"><strong>Landing Pages<\/strong><small>([^<]+)<\/small><\/span>\s*<\/a>\s*<a href="\/servicios#tiendas">/g, '<span class="dd-content"><strong>Landing Pages</strong><small>$1</small></span></a>\n              <a href="/servicios/sitios-corporativos">\n                <span class="dd-icon">🏢</span>\n                <span class="dd-content"><strong>Sitios Corporativos</strong><small>desde $22,000 MXN</small></span>\n              </a>\n              <a href="/servicios#tiendas">');

  c = c.replace(/↳ Landing Pages<\/a>\s*<a href="\/servicios\/tiendas"/g, '↳ Landing Pages</a>\n      <a href="/servicios/sitios-corporativos" style="font-size:1.4rem;padding-left:1.2rem;color:var(--ink-2)">↳ Sitios Corporativos</a>\n      <a href="/servicios/tiendas"');

  fs.writeFileSync(f, c);
  console.log("updated", f);
});
