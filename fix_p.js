const fs = require('fs');
const path = require('path');
const dir = 'servicios/landing-pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const f of files) {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');

  content = content.replace(/\.plan-nav__item-num \{[\s\S]*?\}/, `.plan-nav__item-num {
      font-size: .6rem;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: var(--ink-3);
      white-space: nowrap;
      margin-left: 2px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
    }`);

  fs.writeFileSync(fp, content, 'utf8');
  console.log('Fixed P overflow in ' + f);
}
