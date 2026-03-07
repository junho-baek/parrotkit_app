const fs = require('fs');
const path = require('path');
const {
  getArgValue,
  hasFlag,
  inferReportType,
  loadDotEnvLocal,
  titleFromFilename,
} = require('./notion-reporting-utils.cjs');

function templateFor(reportType, title, artifactPath, project) {
  const commonHeader = [
    `# ${title}`,
    '',
    `- Project: ${project}`,
    `- Report Type: ${reportType}`,
    `- Artifact: ${artifactPath}`,
    '',
  ];

  if (reportType === 'deck') {
    return [
      ...commonHeader,
      '## Goal',
      '- What should this deck accomplish?',
      '',
      '## Audience',
      '- Who is the primary audience?',
      '',
      '## Slide Structure',
      '1. Intro',
      '2. Problem',
      '3. Solution',
      '4. Demo / Proof',
      '5. CTA',
      '',
      '## Key Messages',
      '- Message 1',
      '- Message 2',
      '',
      '## Assets / Demo Notes',
      '- Screenshots, videos, metrics, links',
      '',
      '## Follow-up',
      '- Any action items after sharing the deck',
      '',
    ].join('\n');
  }

  if (reportType === 'deployment') {
    return [
      ...commonHeader,
      '## Purpose',
      '- What deployment does this report cover?',
      '',
      '## Environment',
      '- Branch / commit / URL / target',
      '',
      '## Result',
      '- Build result, smoke result, known issues',
      '',
      '## Follow-up',
      '- What still needs to be validated?',
      '',
    ].join('\n');
  }

  return [
    ...commonHeader,
    '## Purpose',
    '- Why this report or artifact was created',
    '',
    '## Scope',
    '- What was validated or delivered',
    '',
    '## Results',
    '- Key outcomes',
    '- Known issues',
    '',
    '## Evidence',
    '- Links, screenshots, metrics, or notes',
    '',
    '## Next Steps',
    '- Follow-up actions',
    '',
  ].join('\n');
}

function main() {
  loadDotEnvLocal();
  const argv = process.argv.slice(2);
  const fileArg = getArgValue(argv, '--file');
  const dryRun = hasFlag(argv, '--dry-run');
  const force = hasFlag(argv, '--force');

  if (!fileArg) {
    throw new Error('--file is required');
  }

  const artifactPath = path.resolve(process.cwd(), fileArg);
  const reportType = getArgValue(argv, '--report-type') || inferReportType(artifactPath);
  const title = getArgValue(argv, '--title') || titleFromFilename(artifactPath);
  const project = getArgValue(argv, '--project') || 'Parrotkit';
  const outputArg = getArgValue(argv, '--output');
  const outputPath = outputArg
    ? path.resolve(process.cwd(), outputArg)
    : path.join(process.cwd(), 'output', 'reports', `${path.basename(artifactPath, path.extname(artifactPath))}.md`);

  const markdown = templateFor(reportType, title, artifactPath, project);
  const result = {
    artifactPath,
    outputPath,
    reportType,
    title,
  };

  if (dryRun) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  if (fs.existsSync(outputPath) && !force) {
    throw new Error(`${outputPath} already exists. Use --force to overwrite.`);
  }

  fs.writeFileSync(outputPath, markdown, 'utf8');
  console.log(JSON.stringify(result, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`[report-template] ${error.message || error}`);
  process.exit(1);
}
