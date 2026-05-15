const { existsSync, readdirSync, readFileSync, statSync } = require('node:fs');
const { join, relative } = require('node:path');
const ts = require('typescript');

const root = process.cwd();
const srcRoot = join(root, 'src');

function walkFiles(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) return walkFiles(fullPath);
    if (!/\.(ts|tsx)$/.test(entry)) return [];
    return [fullPath];
  });
}

function importsIn(source, filePath) {
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const imports = [];

  function addModuleSpecifier(moduleSpecifier) {
    if (moduleSpecifier && ts.isStringLiteralLike(moduleSpecifier)) {
      imports.push(moduleSpecifier.text);
    }
  }

  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      addModuleSpecifier(node.moduleSpecifier);
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      addModuleSpecifier(node.moduleReference.expression);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword
    ) {
      addModuleSpecifier(node.arguments[0]);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return imports;
}

const rules = [
  {
    name: 'domain_is_pure',
    dir: join(srcRoot, 'domain'),
    forbidden: [
      /^react$/,
      /^react-native$/,
      /^expo($|\/)/,
      /^expo-router$/,
      /^@expo\//,
      /^@\/app($|\/)/,
      /^@\/app-shell($|\/)/,
      /^@\/application($|\/)/,
      /^@\/core($|\/)/,
      /^@\/features($|\/)/,
    ],
  },
  {
    name: 'core_does_not_import_features',
    dir: join(srcRoot, 'core'),
    forbidden: [/^@\/features($|\/)/],
  },
];

const failures = [];

for (const rule of rules) {
  for (const file of walkFiles(rule.dir)) {
    const source = readFileSync(file, 'utf8');
    for (const imported of importsIn(source, file)) {
      if (rule.forbidden.some((pattern) => pattern.test(imported))) {
        failures.push(`${rule.name}: ${relative(root, file)} imports ${imported}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Architecture boundary check passed.');
