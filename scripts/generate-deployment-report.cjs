const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const {
  getArgValue,
  hasFlag,
  loadDotEnvLocal,
} = require('./notion-reporting-utils.cjs');

function readJsonFile(filePath) {
  if (!filePath) return null;
  const absolutePath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Payload file not found: ${absolutePath}`);
  }
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

function getPathValue(obj, keyPath) {
  return keyPath.split('.').reduce((acc, key) => {
    if (acc == null) return undefined;
    return acc[key];
  }, obj);
}

function pickFirst(payload, paths, fallback = null) {
  for (const keyPath of paths) {
    const value = getPathValue(payload, keyPath);
    if (value !== undefined && value !== null && `${value}`.trim() !== '') {
      return value;
    }
  }
  return fallback;
}

function normalizeUrl(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function slugify(value) {
  return String(value || 'report')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'report';
}

function compact(list) {
  return list.filter((value) => value !== null && value !== undefined && `${value}`.trim() !== '');
}

function buildStamp(date) {
  const pad = (num) => String(num).padStart(2, '0');
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    '_',
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
  ].join('');
}

function writePdf(filePath, title, sections) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48, size: 'A4' });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.font('Helvetica-Bold').fontSize(22).text(title);
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(10).fillColor('#555555').text('Auto-generated deployment report');
    doc.fillColor('#000000');
    doc.moveDown();

    for (const section of sections) {
      doc.font('Helvetica-Bold').fontSize(14).text(section.heading);
      doc.moveDown(0.35);
      doc.font('Helvetica').fontSize(10);
      for (const line of section.lines) {
        doc.text(`- ${line}`, {
          indent: 12,
          paragraphGap: 3,
        });
      }
      doc.moveDown(0.8);
    }

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function main() {
  loadDotEnvLocal();
  const argv = process.argv.slice(2);

  const dryRun = hasFlag(argv, '--dry-run');
  const payload = readJsonFile(getArgValue(argv, '--payload-file')) || {};
  const generatedAt = new Date();

  const project =
    getArgValue(argv, '--project') ||
    pickFirst(payload, ['project.name', 'projectName', 'name'], 'Parrotkit');
  const environment =
    getArgValue(argv, '--environment') ||
    pickFirst(payload, ['target', 'environment', 'deployment.target', 'meta.githubCommitRefType'], 'preview');
  const eventType =
    getArgValue(argv, '--event-type') ||
    pickFirst(payload, ['type', 'eventType', 'event_name'], 'vercel.deployment.ready');
  const deploymentId =
    getArgValue(argv, '--deployment-id') ||
    pickFirst(payload, ['id', 'deployment.id'], 'unknown-deployment');
  const deploymentUrl = normalizeUrl(
    getArgValue(argv, '--deployment-url') ||
      pickFirst(payload, ['url', 'deployment.url', 'deployment.alias', 'alias', 'inspectorUrl'], null)
  );
  const branch =
    getArgValue(argv, '--branch') ||
    pickFirst(payload, ['git.ref', 'git.branch', 'meta.githubCommitRef', 'branch'], 'unknown-branch');
  const commit =
    getArgValue(argv, '--commit') ||
    pickFirst(payload, ['git.sha', 'meta.githubCommitSha', 'commit'], 'unknown-commit');
  const shortSha = pickFirst(payload, ['git.shortSha', 'shortSha'], String(commit).slice(0, 7));
  const creator =
    getArgValue(argv, '--creator') ||
    pickFirst(payload, ['creator.username', 'meta.githubCommitAuthorLogin', 'user'], 'unknown');
  const state =
    getArgValue(argv, '--state') ||
    pickFirst(payload, ['state', 'state.type', 'status'], 'ready');
  const notes = compact([
    getArgValue(argv, '--notes') || null,
    eventType ? `Triggered by ${eventType}` : null,
    deploymentUrl ? 'This report was generated from the deployment metadata and uploaded automatically.' : null,
  ]).join(' ');

  const title = `${generatedAt.toISOString().slice(0, 10)} ${project} ${environment} Deployment Report`;
  const stem =
    getArgValue(argv, '--output-stem') ||
    `${buildStamp(generatedAt)}_${slugify(project)}_${slugify(environment)}_deployment_report`;

  const reportsDir = path.join(process.cwd(), 'output', 'reports');
  const pdfDir = path.join(process.cwd(), 'output', 'pdf');
  const markdownPath = path.join(reportsDir, `${stem}.md`);
  const pdfPath = path.join(pdfDir, `${stem}.pdf`);

  const sections = [
    {
      heading: 'Purpose',
      lines: [
        'Capture the Vercel deployment result in a durable Notion record.',
        'Persist deployment metadata alongside the branch, commit, and deployment URL.',
      ],
    },
    {
      heading: 'Deployment Snapshot',
      lines: compact([
        `Project: ${project}`,
        `Environment: ${environment}`,
        `Deployment ID: ${deploymentId}`,
        deploymentUrl ? `Deployment URL: ${deploymentUrl}` : null,
        `State: ${state}`,
      ]),
    },
    {
      heading: 'Git Context',
      lines: compact([
        `Branch: ${branch}`,
        `Commit: ${commit}`,
        shortSha ? `Short SHA: ${shortSha}` : null,
        creator ? `Triggered by: ${creator}` : null,
      ]),
    },
    {
      heading: 'Automation Notes',
      lines: compact([
        `Generated At (UTC): ${generatedAt.toISOString()}`,
        notes || null,
      ]),
    },
  ];

  const markdown = [
    `# ${title}`,
    '',
    '## Purpose',
    '- Capture the Vercel deployment result in a durable Notion record.',
    '- Persist deployment metadata alongside the branch, commit, and deployment URL.',
    '',
    '## Deployment Snapshot',
    ...sections[1].lines.map((line) => `- ${line}`),
    '',
    '## Git Context',
    ...sections[2].lines.map((line) => `- ${line}`),
    '',
    '## Automation Notes',
    ...sections[3].lines.map((line) => `- ${line}`),
    '',
    '## Next Steps',
    '- Validate the deployment URL if the deployment is production-facing.',
    '- Use this page as the canonical release/deployment note linked from Notion.',
    '',
  ].join('\n');

  const result = {
    title,
    project,
    environment,
    eventType,
    deploymentId,
    deploymentUrl,
    branch,
    commit,
    shortSha,
    creator,
    state,
    notes,
    markdownPath,
    pdfPath,
    reportType: 'deployment',
  };

  if (dryRun) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  fs.mkdirSync(reportsDir, { recursive: true });
  fs.mkdirSync(pdfDir, { recursive: true });
  fs.writeFileSync(markdownPath, markdown, 'utf8');
  await writePdf(pdfPath, title, sections);

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(`[deployment-report] ${error.message || error}`);
  process.exit(1);
});
