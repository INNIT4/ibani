const fs = require('fs');
let c = fs.readFileSync('servicios/sitios-corporativos/bronce.html', 'utf8');

c = c.replace(/<p class="footer__col-title">Planes — Sitios Web<\/p>\s*<ul class="footer__col-links">[\s\S]*?<\/ul>/, 
`<p class="footer__col-title">Paquetes Corporativos</p>
            <ul class="footer__col-links">
              <li><a href="/servicios/sitios-corporativos/bronce.html">Sitio Bronce — $22,000</a></li>
              <li><a href="/servicios/sitios-corporativos/silver.html">Sitio Silver — $25,000</a></li>
              <li><a href="/servicios/sitios-corporativos/gold.html">Sitio Gold — $29,000</a></li>
              <li><a href="/servicios/sitios-corporativos/platino.html">Sitio Platino — $34,000</a></li>
              <li><a href="/servicios/sitios-corporativos/diamante.html">Sitio Diamante — $38,000</a></li>
              <li><a href="/servicios/sitios-corporativos/esmeralda.html">Sitio Esmeralda — $44,500</a></li>
            </ul>`);

fs.writeFileSync('servicios/sitios-corporativos/bronce.html', c);
console.log('Footer refined in bronce!');
