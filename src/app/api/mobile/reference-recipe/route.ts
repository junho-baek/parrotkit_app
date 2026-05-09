import { NextRequest, NextResponse } from 'next/server';

import { generateReplicateGeminiFlashText } from '@/lib/replicate';
import { fetchSupadataTranscript, type TranscriptSegment } from '@/lib/supadata';

type RecipeNiche = 'beauty' | 'fitness' | 'food' | 'home' | 'other' | 'tech';
type RecipeGoal = 'ad' | 'conversion' | 'personal' | 'recipe-product' | 'sell' | 'viral';
type GeneratedSceneType = 'hook' | 'proof' | 'demonstration' | 'cta';

type GeneratedRecipeScene = {
  index: number;
  type: GeneratedSceneType;
  title: string;
  durationSec: number;
  intent: string;
  lineToSay: string;
  shootingGuideline: string;
  requiredChecklist: string[];
  teleprompterLine: string;
};

type GeneratedRecipe = {
  title: string;
  oneLineDescription: string;
  totalDurationSec: number;
  scenes: GeneratedRecipeScene[];
};

const sceneTypes: GeneratedSceneType[] = ['hook', 'proof', 'demonstration', 'cta'];
const defaultDurations: Record<GeneratedSceneType, number> = {
  hook: 5,
  proof: 8,
  demonstration: 12,
  cta: 5,
};

function extractYouTubeVideoId(url: string) {
  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

function normalizeNiche(value: unknown): RecipeNiche {
  const normalized = String(value || '').trim().toLowerCase();
  const allowed: RecipeNiche[] = ['beauty', 'fitness', 'food', 'home', 'other', 'tech'];
  return allowed.includes(normalized as RecipeNiche) ? normalized as RecipeNiche : 'other';
}

function normalizeGoal(value: unknown): RecipeGoal {
  const normalized = String(value || '').trim().toLowerCase().replace('_', '-');
  const allowed: RecipeGoal[] = ['ad', 'conversion', 'personal', 'recipe-product', 'sell', 'viral'];
  return allowed.includes(normalized as RecipeGoal) ? normalized as RecipeGoal : 'ad';
}

function compactText(value: unknown, fallback: string) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  return text || fallback;
}

function extractJsonObject(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  return match?.[0] || null;
}

function getTranscriptText(segments: TranscriptSegment[], maxChars = 4200) {
  const text = segments
    .slice(0, 40)
    .map((segment) => segment.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text.slice(0, maxChars);
}

function getGoalDirection(goal: RecipeGoal) {
  if (goal === 'sell') return 'purchase intent and concrete value';
  if (goal === 'recipe-product') return 'a reusable UGC recipe that another creator can copy';
  if (goal === 'personal') return 'natural personal recommendation';
  if (goal === 'viral') return 'curiosity, pattern interrupt, and save/share behavior';
  if (goal === 'conversion') return 'proof, reduced friction, and a clear next action';
  return 'ad-style problem, benefit, proof, and product action';
}

function buildSystemPrompt() {
  return [
    'You are ParrotKit, an AI that turns short-form video references into reusable UGC shooting recipes.',
    'Create practical cut-by-cut shooting instructions a creator can use immediately.',
    'Use the transcript and metadata when present. If the transcript is sparse, infer a useful UGC structure.',
    'Return strict JSON only. Do not use markdown fences. Do not explain limitations.',
  ].join('\n');
}

function buildUserPrompt({
  goal,
  niche,
  referenceTitle,
  referenceUrl,
  transcriptText,
}: {
  goal: RecipeGoal;
  niche: RecipeNiche;
  referenceTitle: string;
  referenceUrl: string;
  transcriptText: string;
}) {
  return `Create a reusable UGC shooting recipe from this YouTube Shorts reference.

Reference URL:
${referenceUrl}

Platform:
youtube-shorts

Niche:
${niche}

Goal:
${goal} (${getGoalDirection(goal)})

Reference title:
${referenceTitle}

Transcript:
${transcriptText || '(No transcript available. Infer from title, URL, niche, and goal.)'}

Return this exact JSON shape:
{
  "title": "string",
  "oneLineDescription": "string",
  "totalDurationSec": 30,
  "scenes": [
    {
      "index": 1,
      "type": "hook",
      "title": "Hook",
      "durationSec": 5,
      "intent": "string",
      "lineToSay": "string",
      "shootingGuideline": "string",
      "requiredChecklist": ["string", "string", "string"],
      "teleprompterLine": "string"
    }
  ]
}

Rules:
- Create exactly 4 scenes in this order: hook, proof, demonstration, cta.
- Each requiredChecklist must contain exactly 3 visible checks.
- Keep lineToSay short and spoken.
- Make shootingGuideline concrete and shootable.
- Optimize the CTA and hook for the selected goal.
- Return strict JSON only.`;
}

function coerceScene(raw: unknown, index: number, fallback: GeneratedRecipeScene): GeneratedRecipeScene {
  const scene = typeof raw === 'object' && raw !== null ? raw as Record<string, unknown> : {};
  const expectedType = sceneTypes[index] || fallback.type;
  const rawChecklist = Array.isArray(scene.requiredChecklist) ? scene.requiredChecklist : [];
  const checklist = rawChecklist
    .map((item) => compactText(item, ''))
    .filter(Boolean)
    .slice(0, 3);

  while (checklist.length < 3) {
    checklist.push(fallback.requiredChecklist[checklist.length] || 'The key visual is clear');
  }

  return {
    index: index + 1,
    type: expectedType,
    title: fallback.title,
    durationSec: Number.isFinite(Number(scene.durationSec)) ? Math.max(3, Math.min(15, Number(scene.durationSec))) : fallback.durationSec,
    intent: compactText(scene.intent, fallback.intent),
    lineToSay: compactText(scene.lineToSay, fallback.lineToSay),
    shootingGuideline: compactText(scene.shootingGuideline, fallback.shootingGuideline),
    requiredChecklist: checklist,
    teleprompterLine: compactText(scene.teleprompterLine, fallback.teleprompterLine),
  };
}

function sanitizeRecipe(raw: unknown, fallback: GeneratedRecipe): GeneratedRecipe {
  const parsed = typeof raw === 'object' && raw !== null ? raw as Record<string, unknown> : {};
  const rawScenes = Array.isArray(parsed.scenes) ? parsed.scenes : [];
  const scenes = sceneTypes.map((_, index) => coerceScene(rawScenes[index], index, fallback.scenes[index]));
  const totalDurationSec = scenes.reduce((sum, scene) => sum + scene.durationSec, 0);

  return {
    title: compactText(parsed.title, fallback.title).slice(0, 80),
    oneLineDescription: compactText(parsed.oneLineDescription, fallback.oneLineDescription).slice(0, 180),
    totalDurationSec,
    scenes,
  };
}

function buildFallbackRecipe({
  goal,
  niche,
  referenceTitle,
}: {
  goal: RecipeGoal;
  niche: RecipeNiche;
  referenceTitle: string;
}): GeneratedRecipe {
  const subject = niche === 'other' ? 'this reference' : `${niche} reference`;
  const cta =
    goal === 'recipe-product'
      ? 'Save this structure and reuse it for your next shoot.'
      : goal === 'sell' || goal === 'conversion'
        ? 'Check the product and try it with your own routine.'
        : 'Save this and try the format with your own idea.';

  const scenes: GeneratedRecipeScene[] = [
    {
      index: 1,
      type: 'hook',
      title: 'Hook',
      durationSec: defaultDurations.hook,
      intent: 'Lead with the strongest payoff in the first beat.',
      lineToSay: 'Here is the result I wanted from this.',
      shootingGuideline: `Open on the final-looking result from the ${subject}. Keep the payoff centered before explaining.`,
      requiredChecklist: ['The result is visible immediately', 'The main item is centered', 'The opening line is short'],
      teleprompterLine: 'Here is the result I wanted from this.',
    },
    {
      index: 2,
      type: 'proof',
      title: 'Proof',
      durationSec: defaultDurations.proof,
      intent: 'Make the claim believable with a visible proof moment.',
      lineToSay: 'You can see the difference right here.',
      shootingGuideline: 'Show a close-up proof moment, before-after cue, texture, screen, or reaction that supports the hook.',
      requiredChecklist: ['The proof is visible without explanation', 'The shot is close enough', 'The proof connects to the hook'],
      teleprompterLine: 'You can see the difference right here.',
    },
    {
      index: 3,
      type: 'demonstration',
      title: 'Demonstration',
      durationSec: defaultDurations.demonstration,
      intent: 'Show the repeatable method so another creator can copy it.',
      lineToSay: 'Here is exactly how I use it.',
      shootingGuideline: 'Break the action into simple steps. Keep hands, product, or screen movement clean and repeatable.',
      requiredChecklist: ['The action is visible', 'Each step is easy to follow', 'The method feels repeatable'],
      teleprompterLine: 'Here is exactly how I use it.',
    },
    {
      index: 4,
      type: 'cta',
      title: 'CTA',
      durationSec: defaultDurations.cta,
      intent: 'Ask for the next action without over-explaining.',
      lineToSay: cta,
      shootingGuideline: 'End on the cleanest product, result, or next-action frame. Hold it long enough for the save beat.',
      requiredChecklist: ['The CTA is short', 'The next action is obvious', 'The final frame is clean'],
      teleprompterLine: cta,
    },
  ];

  return {
    title: referenceTitle && referenceTitle !== 'YouTube Shorts Reference'
      ? `${referenceTitle} Recipe`
      : `${niche[0].toUpperCase()}${niche.slice(1)} UGC Recipe`,
    oneLineDescription: `A transcript-based Hook / Proof / Demonstration / CTA shooting recipe for ${getGoalDirection(goal)}.`,
    totalDurationSec: scenes.reduce((sum, scene) => sum + scene.durationSec, 0),
    scenes,
  };
}

async function generateRecipeWithGemini({
  fallback,
  goal,
  niche,
  referenceTitle,
  referenceUrl,
  transcriptText,
}: {
  fallback: GeneratedRecipe;
  goal: RecipeGoal;
  niche: RecipeNiche;
  referenceTitle: string;
  referenceUrl: string;
  transcriptText: string;
}) {
  const text = await generateReplicateGeminiFlashText({
    systemInstruction: buildSystemPrompt(),
    prompt: buildUserPrompt({ goal, niche, referenceTitle, referenceUrl, transcriptText }),
    maxOutputTokens: 2600,
    temperature: 0.35,
    topP: 0.9,
    thinkingBudget: 0,
  });
  const rawJson = extractJsonObject(text);

  if (!rawJson) {
    throw new Error('gemini_json_missing');
  }

  return sanitizeRecipe(JSON.parse(rawJson), fallback);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const referenceUrl = String(body.referenceUrl || body.url || '').trim();
  const niche = normalizeNiche(body.niche);
  const goal = normalizeGoal(body.goal);
  const videoId = extractYouTubeVideoId(referenceUrl);

  if (!referenceUrl || !videoId) {
    return NextResponse.json(
      { error: 'youtube_url_required' },
      { status: 400 }
    );
  }

  const thumbnailFallback = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const transcriptResult = await fetchSupadataTranscript(referenceUrl, {
    preferredLanguage: 'en',
    timeoutMs: 30000,
  });
  const metadata = transcriptResult.sourceMetadata;
  const referenceTitle = metadata?.title || 'YouTube Shorts Reference';
  const thumbnailUrl = metadata?.thumbnailUrl || thumbnailFallback;
  const transcriptText = getTranscriptText(transcriptResult.transcript);
  const fallback = buildFallbackRecipe({ goal, niche, referenceTitle });

  let recipe = fallback;
  let fallbackUsed = true;
  let model: string | null = null;
  let fallbackReason = transcriptResult.fallbackReason;

  try {
    recipe = await generateRecipeWithGemini({
      fallback,
      goal,
      niche,
      referenceTitle,
      referenceUrl,
      transcriptText,
    });
    fallbackUsed = false;
    fallbackReason = null;
    model = 'replicate/google/gemini-2.5-flash';
  } catch (error) {
    fallbackReason = error instanceof Error ? error.message : 'gemini_generation_failed';
  }

  return NextResponse.json({
    recipe,
    reference: {
      url: referenceUrl,
      platform: 'youtube-shorts',
      videoId,
      title: referenceTitle,
      thumbnailUrl,
      transcriptPreview: transcriptText.slice(0, 800),
      transcriptSource: transcriptResult.transcriptSource,
      transcriptLanguage: transcriptResult.language,
    },
    generation: {
      status: fallbackUsed ? 'fallback' : 'generated',
      fallbackUsed,
      fallbackReason,
      model,
      generatedAt: new Date().toISOString(),
    },
  });
}
