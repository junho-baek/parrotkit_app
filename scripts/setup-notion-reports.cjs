const {
  getConfiguredEnvValue,
  getArgValue,
  hasFlag,
  loadDotEnvLocal,
  normalizeNotionId,
  notionRequest,
  requireEnv,
  toRichText,
  upsertEnvFile,
} = require('./notion-reporting-utils.cjs');

function printHelp() {
  console.log(`Usage: node scripts/setup-notion-reports.cjs [--write-env .env.local] [--title "Parrotkit Reports"] [--dry-run]\n\nCreates or inspects the Notion reports database used for PDF/PPT upload automation.\n\nRequired env:\n  NOTION_API_KEY\n  NOTION_REPORTS_PARENT_PAGE_ID (when creating a new database)\n\nOptional env:\n  NOTION_REPORTS_DATABASE_ID\n  NOTION_REPORTS_DATA_SOURCE_ID\n  NOTION_REPORTS_DATABASE_TITLE\n  NOTION_API_VERSION\n`);
}

function buildSchema() {
  return {
    Name: { title: {} },
    Project: {
      select: {
        options: [{ name: 'Parrotkit', color: 'blue' }],
      },
    },
    'Report Type': {
      select: {
        options: [
          { name: 'qa', color: 'green' },
          { name: 'e2e', color: 'purple' },
          { name: 'release', color: 'orange' },
          { name: 'mobile', color: 'pink' },
          { name: 'deck', color: 'yellow' },
          { name: 'pdf', color: 'gray' },
          { name: 'report', color: 'default' },
        ],
      },
    },
    Status: {
      // Notion 2025-09-03 API still does not allow creating new status properties via database create.
      // Use select here so setup remains fully API-driven and reproducible.
      select: {
        options: [
          { name: 'Draft', color: 'gray' },
          { name: 'Uploaded', color: 'green' },
          { name: 'Failed', color: 'red' },
          { name: 'Published', color: 'blue' },
        ],
      },
    },
    'Created At': { date: {} },
    Branch: { rich_text: {} },
    Commit: { rich_text: {} },
    'Source URL': { url: {} },
    'Recipe ID': { rich_text: {} },
    Artifacts: { files: {} },
    Notes: { rich_text: {} },
  };
}

async function retrieveDatabaseAndDataSource(token, databaseId) {
  const database = await notionRequest('GET', `/databases/${normalizeNotionId(databaseId)}`, { token });
  const firstDataSource = database.data_sources?.[0];
  if (!firstDataSource?.id) {
    throw new Error('Database was retrieved but no child data source was returned.');
  }
  return { database, dataSourceId: firstDataSource.id };
}

async function main() {
  loadDotEnvLocal();
  const argv = process.argv.slice(2);

  if (hasFlag(argv, '--help')) {
    printHelp();
    return;
  }

  const writeEnvPath = getArgValue(argv, '--write-env');
  const dryRun = hasFlag(argv, '--dry-run');
  const existingDatabaseId = getConfiguredEnvValue('NOTION_REPORTS_DATABASE_ID');
  const title =
    getArgValue(argv, '--title') ||
    getConfiguredEnvValue('NOTION_REPORTS_DATABASE_TITLE') ||
    'Parrotkit Reports';

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          mode: existingDatabaseId ? 'inspect-existing' : 'create-new',
          title,
          parentPageId: getConfiguredEnvValue('NOTION_REPORTS_PARENT_PAGE_ID') || null,
          writeEnvPath: writeEnvPath || null,
          schemaProperties: Object.keys(buildSchema()),
        },
        null,
        2
      )
    );
    return;
  }

  const token = requireEnv('NOTION_API_KEY');

  let databaseId = existingDatabaseId;
  let dataSourceId = getConfiguredEnvValue('NOTION_REPORTS_DATA_SOURCE_ID') || null;

  if (databaseId) {
    const existing = await retrieveDatabaseAndDataSource(token, databaseId);
    databaseId = existing.database.id;
    dataSourceId = existing.dataSourceId;
    console.log(`[notion-setup] Reusing existing database: ${existing.database.url}`);
  } else {
    const parentPageId = requireEnv('NOTION_REPORTS_PARENT_PAGE_ID');
    const created = await notionRequest('POST', '/databases', {
      token,
      body: {
        parent: { type: 'page_id', page_id: normalizeNotionId(parentPageId) },
        title: toRichText(title),
        icon: { type: 'emoji', emoji: '🧪' },
        initial_data_source: {
          name: 'Reports',
          properties: buildSchema(),
        },
      },
    });

    const retrieved = await retrieveDatabaseAndDataSource(token, created.id);
    databaseId = retrieved.database.id;
    dataSourceId = retrieved.dataSourceId;
    console.log(`[notion-setup] Created database: ${retrieved.database.url}`);
  }

  if (writeEnvPath) {
    upsertEnvFile(writeEnvPath, {
      NOTION_REPORTS_DATABASE_ID: databaseId,
      NOTION_REPORTS_DATA_SOURCE_ID: dataSourceId,
    });
    console.log(`[notion-setup] Wrote IDs to ${writeEnvPath}`);
  }

  console.log(`NOTION_REPORTS_DATABASE_ID="${databaseId}"`);
  console.log(`NOTION_REPORTS_DATA_SOURCE_ID="${dataSourceId}"`);
}

main().catch((error) => {
  console.error(`[notion-setup] ${error.message || error}`);
  process.exit(1);
});
