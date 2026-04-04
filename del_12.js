const fs = require("fs");
let file = "servicios/sitios-corporativos.html";
let content = fs.readFileSync(file, "utf8");

content = content.replace('<li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Formulario Complejo con Firma Electrónica</span></li>\n          ', '');
// Let's also check if it's there without the exact whitespace
let item12Regex = /<li[^>]*><span[^>]*>\+<\/span>\s*<span>Formulario Complejo con Firma Electrónica<\/span><\/li>\s*/g;
content = content.replace(item12Regex, '');

fs.writeFileSync(file, content);
console.log("Deleted item 12");
