import 'server-only';

import { PDFParse } from 'pdf-parse';
import { generateReplicateGeminiFlashText } from '@/lib/replicate';
import { normalizeBrandBrief } from '@/lib/recipe-scene';
import type { BrandBrief } from '@/types/recipe';

function extractJsonObject(text: string) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch?.[0] || null;
}

async function repairJsonObject(rawJson: string) {
  const repairedText = await generateReplicateGeminiFlashText({
    systemInstruction: 'You repair malformed JSON. Return valid JSON only with no markdown fences or commentary.',
    prompt: `Convert the following malformed JSON-like text into valid JSON without changing the meaning.\n\n${rawJson}`,
    maxOutputTokens: 2048,
    temperature: 0,
    topP: 1,
    thinkingBudget: 0,
  });

  const repairedJson = extractJsonObject(repairedText);
  return repairedJson ? JSON.parse(repairedJson) : null;
}

async function parseJsonWithRepair<T>(text: string) {
  const rawJson = extractJsonObject(text);
  if (!rawJson) {
    return null;
  }

  try {
    return JSON.parse(rawJson) as T;
  } catch {
    return await repairJsonObject(rawJson) as T | null;
  }
}

async function extractTextFromPdf(buffer: Buffer) {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return result.text || '';
  } finally {
    await parser.destroy();
  }
}

export async function extractBrandBriefFromPdf({
  fileName,
  fileBuffer,
  niche,
  goal,
  notes,
}: {
  fileName: string;
  fileBuffer: Buffer;
  niche?: string;
  goal?: string;
  notes?: string;
}): Promise<BrandBrief> {
  try {
    const rawText = (await extractTextFromPdf(fileBuffer)).replace(/\s+\n/g, '\n').trim();
    const trimmedText = rawText.slice(0, 18000);

    if (!trimmedText) {
      return normalizeBrandBrief(null, fileName)!;
    }

    const prompt = `Read the brand guideline PDF text and extract a structured brand brief.

Creator context:
- niche: ${niche || '(not provided)'}
- goal: ${goal || '(not provided)'}
- notes: ${notes || '(not provided)'}

Return JSON only in this exact schema:
{
  "brandName": "",
  "productName": "",
  "objective": "",
  "targetAudience": [],
  "tone": [],
  "keyMessages": [],
  "mustInclude": [],
  "mustAvoid": [],
  "shootingGuidelines": [],
  "captionRequirements": [],
  "hashtags": [],
  "tags": [],
  "sourceFileName": "${fileName}",
  "extractionStatus": "success",
  "extractionNotes": []
}

Rules:
- Extract only what is supported by the PDF text.
- Keep every item short and concrete.
- Use empty arrays when a category is not clearly present.
- Do not invent claims or compliance language.
- Preserve required mentions, forbidden claims, and caption rules if they exist.

PDF text:
${trimmedText}`;

    const response = await generateReplicateGeminiFlashText({
      systemInstruction: 'You extract structured brand briefs from marketing guideline PDFs. Return valid JSON only.',
      prompt,
      maxOutputTokens: 2048,
      temperature: 0.1,
      topP: 0.9,
      thinkingBudget: 0,
    });

    const parsed = await parseJsonWithRepair<BrandBrief>(response);
    return normalizeBrandBrief(parsed, fileName) || normalizeBrandBrief(null, fileName)!;
  } catch (error) {
    console.error('[브랜드 PDF] brand brief 추출에 실패했습니다.', error);
    return normalizeBrandBrief(null, fileName)!;
  }
}
