const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'output');
const allowed = new Set(['.pdf', '.ppt', '.pptx']);

function walk(dir, acc) {
  if (!fs.existsSync(dir)) {
    return acc;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('._')) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, acc);
      continue;
    }

    if (allowed.has(path.extname(entry.name).toLowerCase())) {
      acc.push({ path: fullPath, mtimeMs: fs.statSync(fullPath).mtimeMs });
    }
  }

  return acc;
}

const matches = walk(root, []).sort((a, b) => b.mtimeMs - a.mtimeMs);
if (matches[0]) {
  process.stdout.write(matches[0].path);
}
