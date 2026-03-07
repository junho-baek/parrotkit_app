const fs = require('fs');
const path = require('path');
const {
  appendBlocksInChunks,
  createSinglePartFileUpload,
  formatIsoDate,
  getArgValue,
  getArgValues,
  getArtifactBlock,
  getGitValue,
  hasFlag,
  inferReportType,
  inferSummaryPath,
  loadDotEnvLocal,
  markdownToBlocks,
  normalizeNotionId,
  notionRequest,
  requireEnv,
  titleFromFilename,
  toRichText,
} = require('./notion-reporting-utils.cjs');

function printHelp() {
  console.log(`Usage: node scripts/upload-report-to-notion.cjs --file output/pdf/report.pdf [options]\n\nOptions:\n  --file <path>           Primary artifact file. Repeatable.\n  --extra-files <a,b,c>   Comma-separated extra artifact files.\n  --summary-md <path>     Markdown file to convert into Notion page blocks.\n  --title <text>\n  --project <text>\n  --report-type <text>\n  --status <text>\n  --source-url <url>\n  --recipe-id <id>\n  --notes <text>\n  --created-at <ISO-8601>\n  --branch <branch>\n  --commit <sha>\n  --dry-run\n\nRequired env for real upload:\n  NOTION_API_KEY\n  NOTION_REPORTS_DATA_SOURCE_ID\n`);
}

function collectFileArguments(argv) {
  const directFiles = getArgValues(argv, '--file');
  const extraFilesArg = getArgValue(argv, '--extra-files');
  const extraFiles = extraFilesArg
    ? extraFilesArg
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    : [];

  return [...directFiles, ...extraFiles].map((filePath) => path.resolve(process.cwd(), filePath));
}

function ensureFilesExist(filePaths) {
  const missing = filePaths.filter((filePath) => !fs.existsSync(filePath));
  if (missing.length > 0) {
    throw new Error(`Missing artifact files: ${missing.join(', ')}`);
  }
}

function buildProperties({ title, project, reportType, status, createdAt, branch, commit, sourceUrl, recipeId, notes, uploadedFiles }) {
  return {
    Name: {
      title: toRichText(title),
    },
    Project: project
      ? {
          select: { name: project },
        }
      : undefined,
    'Report Type': reportType
      ? {
          select: { name: reportType },
        }
      : undefined,
    Status: status
      ? {
          select: { name: status },
        }
      : undefined,
    'Created At': {
      date: { start: createdAt },
    },
    Branch: branch
      ? {
          rich_text: toRichText(branch),
        }
      : undefined,
    Commit: commit
      ? {
          rich_text: toRichText(commit),
        }
      : undefined,
    'Source URL': sourceUrl
      ? {
          url: sourceUrl,
        }
      : undefined,
    'Recipe ID': recipeId
      ? {
          rich_text: toRichText(recipeId),
        }
      : undefined,
    Artifacts: uploadedFiles?.length
      ? {
          files: uploadedFiles.map((file) => ({
            type: 'file_upload',
            name: file.name,
            file_upload: { id: file.id },
          })),
        }
      : undefined,
    Notes: notes
      ? {
          rich_text: toRichText(notes),
        }
      : undefined,
  };
}

function buildPageBlocks({ createdAt, branch, commit, sourceUrl, recipeId, notes, summaryBlocks, uploadedFiles }) {
  const blocks = [
    {
      object: 'block',
      type: 'callout',
      callout: {
        icon: { type: 'emoji', emoji: '📌' },
        rich_text: toRichText(
          `Generated ${createdAt}${branch ? ` | branch: ${branch}` : ''}${commit ? ` | commit: ${commit}` : ''}`
        ),
      },
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: { rich_text: toRichText('Metadata') },
    },
  ];

  const metadataLines = [
    sourceUrl ? `Source URL: ${sourceUrl}` : null,
    recipeId ? `Recipe ID: ${recipeId}` : null,
    notes ? `Notes: ${notes}` : null,
  ].filter(Boolean);

  for (const line of metadataLines) {
    blocks.push({
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: { rich_text: toRichText(line) },
    });
  }

  if (summaryBlocks.length > 0) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: { rich_text: toRichText('Report Summary') },
    });
    blocks.push(...summaryBlocks);
  }

  if (uploadedFiles.length > 0) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: { rich_text: toRichText('Artifacts') },
    });

    for (const file of uploadedFiles) {
      blocks.push(getArtifactBlock(file));
    }
  }

  return blocks;
}

async function main() {
  loadDotEnvLocal();
  const argv = process.argv.slice(2);

  if (hasFlag(argv, '--help')) {
    printHelp();
    return;
  }

  const files = collectFileArguments(argv);
  if (files.length === 0) {
    throw new Error('At least one --file is required');
  }
  ensureFilesExist(files);

  const primaryFile = files[0];
  const summaryMdPath = inferSummaryPath(primaryFile, getArgValue(argv, '--summary-md'));
  if (summaryMdPath && !fs.existsSync(summaryMdPath)) {
    throw new Error(`Summary markdown not found: ${summaryMdPath}`);
  }

  const title = getArgValue(argv, '--title') || titleFromFilename(primaryFile);
  const project = getArgValue(argv, '--project') || 'Parrotkit';
  const reportType = getArgValue(argv, '--report-type') || inferReportType(primaryFile);
  const status = getArgValue(argv, '--status') || 'Uploaded';
  const sourceUrl = getArgValue(argv, '--source-url');
  const recipeId = getArgValue(argv, '--recipe-id');
  const notes = getArgValue(argv, '--notes');
  const createdAt = formatIsoDate(getArgValue(argv, '--created-at'));
  const branch = getArgValue(argv, '--branch') || getGitValue('git rev-parse --abbrev-ref HEAD');
  const commit = getArgValue(argv, '--commit') || getGitValue('git rev-parse --short HEAD');
  const dryRun = hasFlag(argv, '--dry-run');

  const summaryBlocks = summaryMdPath
    ? markdownToBlocks(fs.readFileSync(summaryMdPath, 'utf8')).slice(0, 120)
    : [];

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          title,
          project,
          reportType,
          status,
          createdAt,
          branch,
          commit,
          sourceUrl: sourceUrl || null,
          recipeId: recipeId || null,
          notes: notes || null,
          files,
          summaryMdPath: summaryMdPath || null,
          summaryBlockCount: summaryBlocks.length,
        },
        null,
        2
      )
    );
    return;
  }

  const token = requireEnv('NOTION_API_KEY');
  const dataSourceId = requireEnv('NOTION_REPORTS_DATA_SOURCE_ID');

  const uploadedFiles = [];
  for (const filePath of files) {
    uploadedFiles.push(await createSinglePartFileUpload({ token, filePath }));
  }

  const properties = buildProperties({
    title,
    project,
    reportType,
    status,
    createdAt,
    branch,
    commit,
    sourceUrl,
    recipeId,
    notes,
    uploadedFiles,
  });

  const page = await notionRequest('POST', '/pages', {
    token,
    body: {
      parent: {
        type: 'data_source_id',
        data_source_id: normalizeNotionId(dataSourceId),
      },
      properties: Object.fromEntries(Object.entries(properties).filter(([, value]) => Boolean(value))),
    },
  });

  const blocks = buildPageBlocks({
    createdAt,
    branch,
    commit,
    sourceUrl,
    recipeId,
    notes,
    summaryBlocks,
    uploadedFiles,
  });

  if (blocks.length > 0) {
    await appendBlocksInChunks({ token, parentBlockId: page.id, children: blocks });
  }

  console.log(
    JSON.stringify(
      {
        pageId: page.id,
        pageUrl: page.url,
        dataSourceId: normalizeNotionId(dataSourceId),
        uploadedFiles: uploadedFiles.map((file) => ({
          id: file.id,
          name: file.name,
          size: file.size,
          path: file.path,
        })),
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(`[notion-upload] ${error.message || error}`);
  process.exit(1);
});
