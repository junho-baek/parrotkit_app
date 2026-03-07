const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const NOTION_API_BASE = 'https://api.notion.com/v1';
const DEFAULT_NOTION_VERSION = process.env.NOTION_API_VERSION || '2025-09-03';
const MAX_SINGLE_PART_BYTES = 20 * 1024 * 1024;

function loadDotEnvLocal(envFile = '.env.local') {
  const envPath = path.join(process.cwd(), envFile);
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
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function normalizeNotionId(value) {
  if (!value) {
    return value;
  }

  const trimmed = String(value).trim();
  if (/^[0-9a-f]{32}$/i.test(trimmed)) {
    return [
      trimmed.slice(0, 8),
      trimmed.slice(8, 12),
      trimmed.slice(12, 16),
      trimmed.slice(16, 20),
      trimmed.slice(20),
    ].join('-');
  }

  return trimmed;
}

function isPlaceholderValue(value) {
  if (!value) {
    return true;
  }

  const normalized = String(value).trim().replace(/^['"]|['"]$/g, '');
  if (!normalized) {
    return true;
  }

  return (
    normalized.includes('your-notion-') ||
    normalized.includes('your_notion_') ||
    normalized.includes('<') ||
    normalized.toLowerCase() === 'changeme'
  );
}

function getConfiguredEnvValue(name) {
  const rawValue = process.env[name];
  if (isPlaceholderValue(rawValue)) {
    return null;
  }
  return String(rawValue).trim().replace(/^['"]|['"]$/g, '');
}

function upsertEnvFile(envPath, pairs) {
  const absolutePath = path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath);
  const existing = fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
  const lines = existing ? existing.split('\n') : [];
  const normalized = new Map(Object.entries(pairs).map(([key, value]) => [key, String(value)]));
  const seen = new Set();

  const nextLines = lines.map((line) => {
    const match = line.match(/^([A-Z0-9_]+)=/i);
    if (!match) {
      return line;
    }

    const key = match[1];
    if (!normalized.has(key)) {
      return line;
    }

    seen.add(key);
    return `${key}="${normalized.get(key)}"`;
  });

  for (const [key, value] of normalized.entries()) {
    if (!seen.has(key)) {
      nextLines.push(`${key}="${value}"`);
    }
  }

  fs.writeFileSync(absolutePath, `${nextLines.filter(Boolean).join('\n')}\n`, 'utf8');
}

function getArgValue(argv, flag) {
  const idx = argv.indexOf(flag);
  if (idx === -1) {
    return null;
  }
  return argv[idx + 1] ?? null;
}

function getArgValues(argv, flag) {
  const values = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === flag && argv[i + 1]) {
      values.push(argv[i + 1]);
      i += 1;
    }
  }
  return values;
}

function hasFlag(argv, flag) {
  return argv.includes(flag);
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function guessMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.pdf': 'application/pdf',
    '.md': 'text/markdown',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
  };
  return types[ext] || 'application/octet-stream';
}

function titleFromFilename(filePath) {
  const stem = path.basename(filePath, path.extname(filePath));
  return stem
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function inferReportType(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.includes('deployment')) return 'deployment';
  if (lower.includes('e2e')) return 'e2e';
  if (lower.includes('release')) return 'release';
  if (lower.includes('mobile')) return 'mobile';
  if (lower.includes('qa')) return 'qa';
  if (lower.endsWith('.ppt') || lower.endsWith('.pptx')) return 'deck';
  if (lower.endsWith('.pdf')) return 'pdf';
  return 'report';
}

function inferSummaryPath(primaryFilePath, explicitPath) {
  if (explicitPath) {
    return explicitPath;
  }

  const stem = path.basename(primaryFilePath, path.extname(primaryFilePath));
  const directSibling = path.join(path.dirname(primaryFilePath), `${stem}.md`);
  if (fs.existsSync(directSibling)) {
    return directSibling;
  }

  const outputReportPath = path.join(process.cwd(), 'output', 'reports', `${stem}.md`);
  if (fs.existsSync(outputReportPath)) {
    return outputReportPath;
  }

  return null;
}

function getGitValue(command) {
  try {
    return execSync(command, { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'ignore'] })
      .toString('utf8')
      .trim();
  } catch {
    return null;
  }
}

function toRichText(text, href = null) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return [];
  }

  const chunks = [];
  for (let idx = 0; idx < normalized.length; idx += 1800) {
    const content = normalized.slice(idx, idx + 1800);
    chunks.push({
      type: 'text',
      text: href ? { content, link: { url: href } } : { content },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default',
      },
      plain_text: content,
      href,
    });
  }
  return chunks;
}

function cleanMarkdownInline(text) {
  return String(text || '')
    .replace(/!\[[^\]]*\]\(([^)]+)\)/g, 'Image: $1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

function markdownToBlocks(markdown) {
  const blocks = [];
  const lines = String(markdown || '').split(/\r?\n/);
  let inCodeBlock = false;
  let codeLanguage = 'plain text';
  let codeBuffer = [];

  const pushCodeBlock = () => {
    if (!codeBuffer.length) {
      return;
    }
    blocks.push({
      object: 'block',
      type: 'code',
      code: {
        rich_text: toRichText(codeBuffer.join('\n')),
        language: codeLanguage || 'plain text',
        caption: [],
      },
    });
    codeBuffer = [];
    codeLanguage = 'plain text';
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, '  ');

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        pushCodeBlock();
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim() || 'plain text';
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const cleaned = cleanMarkdownInline(trimmed);
    if (!cleaned) {
      continue;
    }

    if (trimmed.startsWith('# ')) {
      blocks.push({ object: 'block', type: 'heading_1', heading_1: { rich_text: toRichText(cleaned.slice(2)) } });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push({ object: 'block', type: 'heading_2', heading_2: { rich_text: toRichText(cleaned.slice(3)) } });
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.push({ object: 'block', type: 'heading_3', heading_3: { rich_text: toRichText(cleaned.slice(4)) } });
      continue;
    }
    if (/^[-*]\s+/.test(trimmed)) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: toRichText(cleaned.replace(/^[-*]\s+/, '')) },
      });
      continue;
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: toRichText(cleaned.replace(/^\d+\.\s+/, '')) },
      });
      continue;
    }
    if (trimmed.startsWith('> ')) {
      blocks.push({ object: 'block', type: 'quote', quote: { rich_text: toRichText(cleaned.slice(2)) } });
      continue;
    }

    blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: toRichText(cleaned) } });
  }

  if (inCodeBlock) {
    pushCodeBlock();
  }

  return blocks;
}

async function notionRequest(method, pathname, { token, body, headers = {} } = {}) {
  const response = await fetch(`${NOTION_API_BASE}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': DEFAULT_NOTION_VERSION,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = data?.message || response.statusText;
    throw new Error(`Notion API ${method} ${pathname} failed (${response.status}): ${message}`);
  }

  return data;
}

async function createSinglePartFileUpload({ token, filePath }) {
  const stat = fs.statSync(filePath);
  if (stat.size > MAX_SINGLE_PART_BYTES) {
    throw new Error(
      `File exceeds Notion single-part limit (${Math.round(stat.size / 1024 / 1024)}MB). Use a file under 20MB or extend this script for multipart uploads.`
    );
  }

  const filename = path.basename(filePath);
  const contentType = guessMimeType(filePath);
  const createResponse = await notionRequest('POST', '/file_uploads', {
    token,
    body: {
      mode: 'single_part',
      filename,
      content_type: contentType,
    },
  });

  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(filePath)], { type: contentType }), filename);

  const sendResponse = await fetch(createResponse.upload_url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': DEFAULT_NOTION_VERSION,
    },
    body: form,
  });

  const sendText = await sendResponse.text();
  const sendData = sendText ? JSON.parse(sendText) : null;
  if (!sendResponse.ok) {
    throw new Error(
      `Notion file upload send failed for ${filename} (${sendResponse.status}): ${sendData?.message || sendResponse.statusText}`
    );
  }

  if (sendData?.status !== 'uploaded') {
    throw new Error(`Notion file upload for ${filename} did not reach uploaded status.`);
  }

  return {
    id: sendData.id,
    name: filename,
    size: stat.size,
    contentType,
    path: filePath,
  };
}

function getArtifactBlock(uploadedFile) {
  const lowerName = uploadedFile.name.toLowerCase();
  const commonPayload = {
    type: 'file_upload',
    file_upload: { id: uploadedFile.id },
    caption: toRichText(uploadedFile.name),
  };

  if (uploadedFile.contentType.startsWith('image/')) {
    return { object: 'block', type: 'image', image: commonPayload };
  }
  if (uploadedFile.contentType.startsWith('video/')) {
    return { object: 'block', type: 'video', video: commonPayload };
  }
  if (uploadedFile.contentType.startsWith('audio/')) {
    return { object: 'block', type: 'audio', audio: commonPayload };
  }
  if (lowerName.endsWith('.pdf')) {
    return { object: 'block', type: 'pdf', pdf: commonPayload };
  }

  return { object: 'block', type: 'file', file: commonPayload };
}

async function appendBlocksInChunks({ token, parentBlockId, children }) {
  const chunkSize = 100;
  for (let idx = 0; idx < children.length; idx += chunkSize) {
    const chunk = children.slice(idx, idx + chunkSize);
    await notionRequest('PATCH', `/blocks/${normalizeNotionId(parentBlockId)}/children`, {
      token,
      body: { children: chunk },
    });
  }
}

function formatIsoDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }
  return date.toISOString();
}

module.exports = {
  DEFAULT_NOTION_VERSION,
  MAX_SINGLE_PART_BYTES,
  appendBlocksInChunks,
  createSinglePartFileUpload,
  formatIsoDate,
  getArgValue,
  getArgValues,
  getArtifactBlock,
  getConfiguredEnvValue,
  getGitValue,
  guessMimeType,
  hasFlag,
  inferReportType,
  inferSummaryPath,
  isPlaceholderValue,
  loadDotEnvLocal,
  markdownToBlocks,
  normalizeNotionId,
  notionRequest,
  requireEnv,
  titleFromFilename,
  toRichText,
  upsertEnvFile,
};
