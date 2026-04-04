const fs = require('fs');
const path = require('path');

const plans = [
    {
        id: 'bronce',
        name: 'Bronce',
        price: '22,000',
        priceRaw: 22000,
        maint: '7,260',
        days: '15',
        pages: '7',
        sections: '8',
        ideal: 'Consultoras, despachos jurídicos, médicos independientes o cualquier firma de servicios profesionales que ya opera formalmente y necesita una sede web institucional de primer nivel para captación corporativa.',
        watermark: '01',
        step: '01'
    },
    {
        id: 'silver',
        name: 'Silver',
        price: '25,000',
        priceRaw: 25000,
        maint: '8,250',
        days: '15',
        pages: '10',
        sections: '8',
        ideal: 'Empresas en crecimiento con múltiples especialidades o servicios diferenciados: constructoras, agencias, hospitales y grupos de consultoría que requieren una página dedicada exclusiva para cada departamento o línea de negocio.',
        watermark: '02',
        step: '02'
    },
    {
        id: 'gold',
        name: 'Gold',
        price: '29,000',
        priceRaw: 29000,
        maint: '9,570',
        days: '15',
        pages: '15',
        sections: '8',
        ideal: 'Instituciones educativas, aseguradoras, medios corporativos o cualquier organización que depende de la publicación activa de contenido para generar tráfico orgánico y captar prospectos mes a mes sin invertir en publicidad.',
        watermark: '03',
        step: '03'
    },
    {
        id: 'platino',
        name: 'Platino',
        price: '34,000',
        priceRaw: 34000,
        maint: '11,220',
        days: '15',
        pages: '20',
        sections: '9',
        ideal: 'Grupos empresariales con divisiones contrastantes (B2B, B2C, logística, manufactura) que operan bajo un mismo nombre corporativo y necesitan presentar cada área con su propia identidad dentro de un portal único y coherente.',
        watermark: '04',
        step: '04'
    },
    {
        id: 'diamante',
        name: 'Diamante',
        price: '38,000',
        priceRaw: 38000,
        maint: '12,540',
        days: '15',
        pages: '25',
        sections: '9',
        ideal: 'Franquicias nacionales, redes financieras, grupos retailers o consorcios con presencia en múltiples estados que requieren páginas individualizadas por región, sucursal o línea de producto con información y precios locales.',
        watermark: '05',
        step: '05'
    },
    {
        id: 'esmeralda',
        name: 'Esmeralda',
        price: '44,500',
        priceRaw: 44500,
        maint: '14,685',
        days: '15',
        pages: '30',
        sections: '9',
        ideal: 'Corporativos globales, grupos industriales o holdings multinacionales con docenas de divisiones activas, múltiples países de operación y la necesidad de dominar orgánicamente decenas de keywords simultáneos en buscadores.',
        watermark: '06',
        step: '06'
    }
];

const dir = 'servicios/sitios-corporativos';

plans.forEach(plan => {
    const filePath = path.join(dir, `${plan.id}.html`);
    if (!fs.existsSync(filePath)) {
        console.log(`File ${filePath} doesn't exist, skipping...`);
        return;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Fix SEO Meta Tags
    html = html.replace(/<title>.*?<\/title>/, `<title>Plan Corporativo ${plan.name} — IBANI Digital</title>`);
    html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="Sitio corporativo Plan ${plan.name}: ${plan.pages} páginas maestras, dominio + hosting, SSL, buzón corporativo y alta en Google. Todo por $${plan.price} MXN. Entrega en ${plan.days} días hábiles.">`);
    html = html.replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="https://www.ibanidigital.com/servicios/sitios-corporativos/${plan.id}">`);
    html = html.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="Plan ${plan.name} Corporativo — IBANI Digital">`);
    html = html.replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${plan.pages} páginas maestras, dominio, hosting, SSL, buzón corporativo y alta en Google. Entrega en ${plan.days} días hábiles. Todo por $${plan.price} MXN.">`);
    
    // 2. Fix Watermark and Steps
    html = html.replace(/<span class="plan-watermark" aria-hidden="true">.*?<\/span>/, `<span class="plan-watermark" aria-hidden="true">${plan.watermark}</span>`);
    html = html.replace(/<span class="plan-hero__num">Plan .*? de 6 · Corporativos<\/span>/, `<span class="plan-hero__num">Plan ${plan.step} de 6 · Corporativos</span>`);
    
    // 3. Fix Hero Name and Price
    html = html.replace(/<h1 class="plan-hero__name anim-l".*?> Sitio <em>.*?<\/em> <\/h1>/, `<h1 class="plan-hero__name anim-l" style="--delay:.18s"> Sitio <em>${plan.name}</em> </h1>`);
    // Fallback if formatting is slightly different
    html = html.replace(/Sitio <em>.*?<\/em>/g, `Sitio <em>${plan.name}</em>`);

    html = html.replace(/<span class="plan-hero__price">.*?<\/span>/, `<span class="plan-hero__price">$${plan.price} MXN</span>`);
    
    // 4. Fix "Ideal para"
    html = html.replace(/<strong>Ideal para:<\/strong>.*?<\/p>/, `<strong>Ideal para:</strong> ${plan.ideal} </p>`);

    // 5. Fix Sidebar Plan Card
    html = html.replace(/<p class="plan-card__name">.*?<\/p>/, `<p class="plan-card__name">Sitio ${plan.name}</p>`);
    html = html.replace(/<p class="plan-card__price">.*?<\/p>/, `<p class="plan-card__price">$${plan.price} MXN</p>`);

    // 6. Fix maintenance row in comparative table if it exists
    // The previous script might have miscalculated or missed it.
    // Let's ensure the row is there and correct.
    const maintRowRegex = /<tr>\s*<td>Mantenimiento Año 2\+.*?<\/tr>/;
    const newMaintRow = `
              <tr>
                <td>Mantenimiento Año 2+ (33% anual)</td>
                <td><span class="c-val" style="font-size:.72rem">$7,260</span></td>
                <td><span class="c-val" style="font-size:.72rem">$8,250</span></td>
                <td><span class="c-val" style="font-size:.72rem">$9,570</span></td>
                <td><span class="c-val" style="font-size:.72rem">$11,220</span></td>
                <td><span class="c-val" style="font-size:.72rem">$12,540</span></td>
                <td><span class="c-val" style="font-size:.72rem">$14,685</span></td>
              </tr>`;

    if (html.match(maintRowRegex)) {
        html = html.replace(maintRowRegex, newMaintRow);
    } else {
        // Try to insert it before the last </tbody> of the compare table
        html = html.replace(/<\/tbody>\s*<\/table>\s*<\/div>\s*<\/div>\s*<\/section>/, (match) => {
            return newMaintRow + "\n            " + match;
        });
    }

    // 7. Fix WhatsApp links in hero and card
    const waText = `Hola%2C%20quiero%20el%20Plan%20${plan.name}%20%24${plan.price.replace(',', '%2C')}%20MXN`;
    html = html.replace(/wa\.me\/526625044016\?text=.*?["\s]/g, (match) => {
        return `wa.me/526625044016?text=${waText}"`;
    });

    fs.writeFileSync(filePath, html);
    console.log(`Plan ${plan.name} fixed successfully.`);
});
