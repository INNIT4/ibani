const fs = require("fs");

const renames = {
  "servicios/landing-pages/negocios.html": {
    newName: "servicios/landing-pages/emprendedor-pro.html",
    oldNameStr: "Negocios",
    newNameStr: "Emprendedor Pro",
    oldPrice: "7,500",
    newPrice: "7,500"
  },
  "servicios/landing-pages/microempresa.html": {
    newName: "servicios/landing-pages/emprendedor-plus.html",
    oldNameStr: "Microempresa",
    newNameStr: "Emprendedor Plus",
    oldPrice: "9,500",
    newPrice: "13,000"
  },
  "servicios/landing-pages/pyme.html": {
    newName: "servicios/landing-pages/emprendedor-avanzado.html",
    oldNameStr: "PyME",
    newNameStr: "Emprendedor Avanzado",
    oldPrice: "11,500",
    newPrice: "16,000"
  },
  "servicios/landing-pages/empresarial.html": {
    newName: "servicios/landing-pages/emprendedor-elite.html",
    oldNameStr: "Empresarial",
    newNameStr: "Emprendedor Elite",
    oldPrice: "14,000",
    newPrice: "20,000"
  }
};

for (const [oldPath, cfg] of Object.entries(renames)) {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, cfg.newName);
    
    let content = fs.readFileSync(cfg.newName, "utf8");
    content = content.replace(new RegExp("Plan " + cfg.oldNameStr, 'g'), "Plan " + cfg.newNameStr);
    content = content.replace(new RegExp("Landing Page " + cfg.oldNameStr, 'g'), "Landing Page " + cfg.newNameStr);
    content = content.replace(new RegExp('>' + cfg.oldNameStr + '<', 'g'), '>' + cfg.newNameStr + '<');
    
    if (cfg.oldPrice !== cfg.newPrice) {
      content = content.replace(new RegExp(cfg.oldPrice, 'g'), cfg.newPrice);
    }
    
    fs.writeFileSync(cfg.newName, content);
  }
}
