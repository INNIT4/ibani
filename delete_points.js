const fs = require("fs");
let file = "servicios/sitios-corporativos.html";
let content = fs.readFileSync(file, "utf8");

content = content.replace('<li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Diseño de Logotipo, Imágenes con IA o Recursos Stock</span></li>\n            ', '');
content = content.replace('<li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Servicio de Fotografía, Video y Marca de Agua</span></li>\n            ', '');

fs.writeFileSync(file, content);
console.log("Deleted the two unwanted points");
