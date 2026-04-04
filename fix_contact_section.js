const fs = require('fs');
const path = require('path');

const plans = [
    { id: 'bronce', name: 'Bronce', price: '22,000', maint: '7,260', pages: '7', sections: '8', watermark: '01', step: '01' },
    { id: 'silver', name: 'Silver', price: '25,000', maint: '8,250', pages: '10', sections: '8', watermark: '02', step: '02' },
    { id: 'gold', name: 'Gold', price: '29,000', maint: '9,570', pages: '15', sections: '8', watermark: '03', step: '03' },
    { id: 'platino', name: 'Platino', price: '34,000', maint: '11,220', pages: '20', sections: '9', watermark: '04', step: '04' },
    { id: 'diamante', name: 'Diamante', price: '38,000', maint: '12,540', pages: '25', sections: '9', watermark: '05', step: '05' },
    { id: 'esmeralda', name: 'Esmeralda', price: '44,500', maint: '14,685', pages: '30', sections: '9', watermark: '06', step: '06' }
];

const dir = 'servicios/sitios-corporativos';

plans.forEach(plan => {
    const filePath = path.join(dir, `${plan.id}.html`);
    if (!fs.existsSync(filePath)) return;

    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Fix the Contact Label (multiline)
    const labelRegex = /<span class="label" style="color:rgba\(255,255,255,\.3\)">[\s\S]*?<\/span>/;
    html = html.replace(labelRegex, `<span class="label" style="color:rgba(255,255,255,.3)">Sitio ${plan.name} · $${plan.price} MXN · Entrega en 15 días</span>`);

    // 2. Fix the Contact Subtext (days)
    const subtextRegex = /<p class="contact__sub" style="color:rgba\(255,255,255,\.55\)">[\s\S]*?<\/p>/;
    html = html.replace(subtextRegex, `<p class="contact__sub" style="color:rgba(255,255,255,.55)">Escríbenos y comenzamos hoy. Entrega corporativa garantizada en 15 días hábiles.</p>`);

    // 3. Fix the Buy Button text
    const buyBtnRegex = /Comprar Sitio [\s\S]*? <\/a>/;
    html = html.replace(buyBtnRegex, `Comprar Sitio ${plan.name} </a>`);

    fs.writeFileSync(filePath, html);
    console.log(`Plan ${plan.name} fixed (ContactSection) successfully.`);
});
