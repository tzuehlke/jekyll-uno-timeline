const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'js');
const outDir = path.join(__dirname, '..', 'dist', 'js');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.readdirSync(srcDir).forEach(file => {
  if (!file.endsWith('.js')) return;
  const full = path.join(srcDir, file);
  let content = fs.readFileSync(full, 'utf8');
  // remove leading YAML front-matter block starting with --- and ending with ---\n
  if (content.startsWith('---')) {
    const idx = content.indexOf('\n---', 3);
    if (idx !== -1) {
      content = content.slice(idx + 4);
    } else {
      // try simple removal until next \n---\n
      const idx2 = content.indexOf('\n---\n');
      if (idx2 !== -1) content = content.slice(idx2 + 5);
    }
  }
  fs.writeFileSync(path.join(outDir, file), content, 'utf8');
  console.log('Stripped front-matter:', file);
});
