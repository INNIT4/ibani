const fs = require('fs');

let cssFile = 'css/all.css';
let css = fs.readFileSync(cssFile, 'utf8');

// Fix dropdown hover gap issue using the existing .dd-open class
css = css.replace(
  '.nav__item--has-dropdown:hover .nav__dropdown,\n.nav__item--has-dropdown:focus-within .nav__dropdown {',
  '.nav__item--has-dropdown:hover .nav__dropdown,\n.nav__item--has-dropdown.dd-open .nav__dropdown,\n.nav__item--has-dropdown:focus-within .nav__dropdown {'
);

css = css.replace(
  '.nav__item--has-dropdown:hover .nav__dropdown--wide,\n.nav__item--has-dropdown:focus-within .nav__dropdown--wide {',
  '.nav__item--has-dropdown:hover .nav__dropdown--wide,\n.nav__item--has-dropdown.dd-open .nav__dropdown--wide,\n.nav__item--has-dropdown:focus-within .nav__dropdown--wide {'
);

// Fix dropdown dark mode strong color
const strongFix = `
.header.scrolled .nav__dropdown a .dd-content strong { color: rgba(250,248,241,0.95); }
.header.scrolled .nav__dropdown a:hover .dd-content strong { color: var(--accent); }
`;
if (!css.includes('.header.scrolled .nav__dropdown a .dd-content strong')) {
    css = css + strongFix;
}

fs.writeFileSync(cssFile, css);
console.log("Updated css/all.css");
