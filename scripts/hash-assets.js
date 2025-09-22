const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashFileContents(buf) {
  return crypto.createHash('md5').update(buf).digest('hex').slice(0,8);
}

const projectRoot = path.join(__dirname, '..');
const distCss = path.join(projectRoot, 'dist', 'css');
const distJs = path.join(projectRoot, 'dist', 'js');
const outDataDir = path.join(projectRoot, '_data');
if (!fs.existsSync(outDataDir)) fs.mkdirSync(outDataDir, { recursive: true });

const mapping = {};

if (fs.existsSync(distCss)) {
  fs.readdirSync(distCss).forEach(file => {
    if (!file.endsWith('.css')) return;
    const full = path.join(distCss, file);
    const buf = fs.readFileSync(full);
    const h = hashFileContents(buf);
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const newName = `${name}.${h}${ext}`;
    fs.copyFileSync(full, path.join(distCss, newName));
    mapping[file] = `/dist/css/${newName}`;
  });
}

if (fs.existsSync(distJs)) {
  fs.readdirSync(distJs).forEach(file => {
    if (!file.endsWith('.js')) return;
    const full = path.join(distJs, file);
    const buf = fs.readFileSync(full);
    const h = hashFileContents(buf);
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const newName = `${name}.${h}${ext}`;
    fs.copyFileSync(full, path.join(distJs, newName));
    mapping[file] = `/dist/js/${newName}`;
  });
}

// write YAML mapping for Jekyll
const yamlLines = Object.entries(mapping).map(([k,v]) => `${k}: "${v}"`);
fs.writeFileSync(path.join(outDataDir, 'asset_map.yml'), yamlLines.join('\n') + '\n');
console.log('Wrote _data/asset_map.yml');

