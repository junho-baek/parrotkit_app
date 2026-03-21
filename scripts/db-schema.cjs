const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) {
      continue;
    }

    const idx = line.indexOf('=');
    const key = line.slice(0, idx).trim();
    if (process.env[key]) {
      continue;
    }

    let value = line.slice(idx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function normalizeDatabaseUrl(rawUrl) {
  if (!rawUrl) {
    return rawUrl;
  }
  let value = rawUrl;
  if (value.startsWith('DATABASE_URL=')) {
    value = value.slice('DATABASE_URL='.length);
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }
  if (value.includes('#')) {
    const hashIndex = value.indexOf('#');
    const beforeHash = value.slice(0, hashIndex);
    const afterHash = value.slice(hashIndex + 1);
    const atIndex = afterHash.indexOf('@');
    if (atIndex !== -1) {
      const passwordSuffix = afterHash.slice(0, atIndex);
      const hostAndPath = afterHash.slice(atIndex + 1);
      value = `${beforeHash}${encodeURIComponent(`#${passwordSuffix}`)}@${hostAndPath}`;
    }
  }
  try {
    const parsed = new URL(value);
    if (
      parsed.searchParams.get('sslmode') === 'require' &&
      !parsed.searchParams.has('uselibpqcompat')
    ) {
      parsed.searchParams.set('uselibpqcompat', 'true');
      value = parsed.toString();
    }
  } catch {
    return value;
  }
  return value;
}

function now() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return {
    date: `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`,
    time: `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`,
    iso: d.toISOString(),
  };
}

async function main() {
  loadDotEnvLocal();
  const url = normalizeDatabaseUrl(process.env.DATABASE_URL);
  if (!url) {
    console.log('[db:schema] DATABASE_URL is not set; schema snapshot skipped.');
    process.exit(0);
  }

  const parsedUrl = new URL(url);
  const isSupabaseManagedHost =
    parsedUrl.hostname.endsWith('.supabase.co') ||
    parsedUrl.hostname.endsWith('.supabase.com') ||
    parsedUrl.hostname.endsWith('.pooler.supabase.com');
  const requiresSsl =
    parsedUrl.searchParams.get('sslmode') === 'require' ||
    parsedUrl.searchParams.get('ssl') === 'true' ||
    isSupabaseManagedHost;

  const client = new Client({
    connectionString: url,
    ...(requiresSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });
  await client.connect();

  try {
    const tablesResult = await client.query(`
    select table_schema, table_name
    from information_schema.tables
    where table_schema in ('public', 'storage')
    order by table_schema, table_name;
  `);

    const columnsResult = await client.query(`
    select table_schema, table_name, column_name, data_type, is_nullable
    from information_schema.columns
    where table_schema in ('public', 'storage')
    order by table_schema, table_name, ordinal_position;
  `);

    const tables = tablesResult.rows;
    const columns = columnsResult.rows;

  const ts = now();
  const contextDir = path.join(process.cwd(), 'context');
  fs.mkdirSync(contextDir, { recursive: true });

  const filePath = path.join(
    contextDir,
    `context_${ts.date}_${ts.time}_supabase_schema_snapshot.md`
  );

  const lines = [];
  lines.push(`# Supabase Schema Snapshot (${ts.iso})`);
  lines.push('');
  lines.push('## Tables');
  lines.push('');

  if (!tables.length) {
    lines.push('- No tables found in public/storage schemas.');
  } else {
    for (const t of tables) {
      lines.push(`- ${t.table_schema}.${t.table_name}`);
    }
  }

  lines.push('');
  lines.push('## Columns');
  lines.push('');

  if (!columns.length) {
    lines.push('- No columns found.');
  } else {
    for (const c of columns) {
      lines.push(
        `- ${c.table_schema}.${c.table_name}.${c.column_name}: ${c.data_type} (nullable=${c.is_nullable})`
      );
    }
  }

    fs.writeFileSync(filePath, lines.join('\n') + '\n', 'utf8');
    console.log(`[db:schema] Wrote snapshot: ${filePath}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('[db:schema] Failed:', err);
  process.exit(1);
});
