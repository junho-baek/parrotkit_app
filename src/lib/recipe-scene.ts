import type {
  BrandBrief,
  PrompterBlock,
  PrompterPositionPreset,
  PrompterBlockSize,
  RecipeScene,
  ReferenceSignalType,
  SceneAnalysis,
  SceneRecipePlan,
} from '@/types/recipe';

type JsonRecord = Record<string, unknown>;

const DEFAULT_KEY_MOOD = 'Clear and conversational';
const DEFAULT_KEY_ACTION = 'Match the reference beat with one clear action';
const LEGACY_HIDDEN_PROMPTER_IDS = new Set([
  'script-focus',
  'motion-focus',
  'product-focus',
  'problem-focus',
  'scene-role',
  'cut-goal',
  'required-cue',
  'warning',
]);
const LEGACY_HIDDEN_PROMPTER_LABELS = new Set([
  'Script Point',
  'Motion Point',
  'Product Point',
  'Problem Point',
  'Scene Role',
  'Cut Goal',
  'Required Cue',
  'Avoid Cue',
]);

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((item) => String(item ?? '').trim())
    .filter(Boolean);
}

function normalizeReferenceSignalType(value: unknown): ReferenceSignalType {
  const supported: ReferenceSignalType[] = ['hook', 'pacing', 'motion', 'caption', 'emotion', 'product', 'cta'];
  const normalized = String(value ?? '').trim() as ReferenceSignalType;
  return supported.includes(normalized) ? normalized : 'motion';
}

function normalizePrompterSize(value: unknown): PrompterBlockSize {
  const supported: PrompterBlockSize[] = ['sm', 'md', 'lg', 'xl'];
  const normalized = String(value ?? '').trim() as PrompterBlockSize;
  return supported.includes(normalized) ? normalized : 'lg';
}

function normalizePrompterPosition(value: unknown): PrompterPositionPreset {
  const supported: PrompterPositionPreset[] = ['top', 'upperThird', 'center', 'lowerThird', 'bottom'];
  const normalized = String(value ?? '').trim() as PrompterPositionPreset;
  return supported.includes(normalized) ? normalized : 'lowerThird';
}

function normalizePrompterScale(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 1;
  }

  return Math.min(2.5, Math.max(0.65, numeric));
}

function compactText(value: unknown) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function toShortCue(text: string, maxWords: number = 4, maxChars: number = 26) {
  const compact = compactText(text);
  if (!compact) {
    return '';
  }

  const words = compact.split(/\s+/).filter(Boolean);
  const shortText = words.length > 1 ? words.slice(0, maxWords).join(' ') : compact;

  if (shortText.length <= maxChars) {
    return shortText;
  }

  return `${shortText.slice(0, maxChars - 1).trim()}…`;
}

function appendBlock(
  blocks: PrompterBlock[],
  block: Omit<PrompterBlock, 'order'> & { order?: number }
) {
  const content = compactText(block.content);
  if (!content) {
    return;
  }

  if (blocks.some((item) => item.id === block.id || item.content === content)) {
    return;
  }

  blocks.push({
    ...block,
    content,
    order: block.order ?? blocks.length + 1,
  });
}

function createFallbackWhyItWorks(title: string, motionDescription: string, transcriptSnippet: string) {
  const reasons = [
    motionDescription
      ? `The scene has a clear visual change: ${motionDescription}.`
      : `The scene establishes a recognizable ${title.toLowerCase()} beat quickly.`,
  ];

  if (transcriptSnippet) {
    reasons.push(`The spoken beat is easy to understand and can be repurposed into a short creator line.`);
  }

  return reasons;
}

export function normalizeBrandBrief(raw: unknown, sourceFileName?: string | null): BrandBrief | null {
  if (!isRecord(raw)) {
    if (sourceFileName) {
      return {
        brandName: '',
        productName: '',
        objective: '',
        targetAudience: [],
        tone: [],
        keyMessages: [],
        mustInclude: [],
        mustAvoid: [],
        shootingGuidelines: [],
        captionRequirements: [],
        hashtags: [],
        tags: [],
        sourceFileName: sourceFileName || undefined,
        extractionStatus: 'failed',
        extractionNotes: ['Brand PDF was provided, but structured extraction did not succeed.'],
      };
    }

    return null;
  }

  return {
    brandName: compactText(raw.brandName),
    productName: compactText(raw.productName),
    objective: compactText(raw.objective),
    targetAudience: normalizeStringArray(raw.targetAudience),
    tone: normalizeStringArray(raw.tone),
    keyMessages: normalizeStringArray(raw.keyMessages),
    mustInclude: normalizeStringArray(raw.mustInclude),
    mustAvoid: normalizeStringArray(raw.mustAvoid),
    shootingGuidelines: normalizeStringArray(raw.shootingGuidelines),
    captionRequirements: normalizeStringArray(raw.captionRequirements),
    hashtags: normalizeStringArray(raw.hashtags),
    tags: normalizeStringArray(raw.tags),
    sourceFileName: compactText(raw.sourceFileName) || sourceFileName || undefined,
    extractionStatus: raw.extractionStatus === 'failed' ? 'failed' : 'success',
    extractionNotes: normalizeStringArray(raw.extractionNotes),
  };
}

export function createDefaultPrompterBlocks(
  recipe: SceneRecipePlan,
  _analysis?: Partial<SceneAnalysis>,
  _brandBrief?: BrandBrief | null,
  _sceneTitle?: string
): PrompterBlock[] {
  const blocks: PrompterBlock[] = [];

  appendBlock(blocks, {
    id: 'key-line',
    type: 'key_line',
    label: 'Main Script',
    content: recipe.keyLine,
    visible: true,
    size: 'xl',
    scale: 1,
    positionPreset: 'lowerThird',
  });

  appendBlock(blocks, {
    id: 'mood',
    type: 'mood',
    label: 'Mood',
    content: recipe.keyMood,
    visible: false,
    size: 'sm',
    scale: 1,
    positionPreset: 'upperThird',
  });

  appendBlock(blocks, {
    id: 'action',
    type: 'action',
    label: 'Action',
    content: recipe.keyAction,
    visible: false,
    size: 'md',
    scale: 1,
    positionPreset: 'bottom',
  });

  appendBlock(blocks, {
    id: 'cta',
    type: 'cta',
    label: 'CTA',
    content: recipe.cta || '',
    visible: false,
    size: 'md',
    scale: 1,
    positionPreset: 'bottom',
  });

  return blocks;
}

function shouldHideLegacyPrompterBlock(
  id: string,
  type: PrompterBlock['type'],
  label?: string
) {
  return (
    LEGACY_HIDDEN_PROMPTER_IDS.has(id)
    || LEGACY_HIDDEN_PROMPTER_LABELS.has(label || '')
    || type === 'appeal_point'
    || type === 'warning'
  );
}

export function normalizePrompterBlocks(
  raw: unknown,
  recipe: SceneRecipePlan,
  analysis?: Partial<SceneAnalysis>,
  brandBrief?: BrandBrief | null,
  sceneTitle?: string
): PrompterBlock[] {
  const fallback = createDefaultPrompterBlocks(recipe, analysis, brandBrief, sceneTitle);
  if (!Array.isArray(raw)) {
    return fallback;
  }

  const blocks = raw.reduce<PrompterBlock[]>((acc, item, index) => {
    if (!isRecord(item)) {
      return acc;
    }

    const id = compactText(item.id) || `block-${index + 1}`;
    const type = (compactText(item.type) as PrompterBlock['type']) || 'keyword';
    const label = compactText(item.label) || undefined;
    if (shouldHideLegacyPrompterBlock(id, type, label)) {
      return acc;
    }

    const content = compactText(item.content);
    if (!content) {
      return acc;
    }

    if (acc.some((block) => block.id === id || block.content.toLowerCase() === content.toLowerCase())) {
      return acc;
    }

    acc.push({
      id,
      type,
      label,
      content,
      visible: item.visible !== false,
      size: normalizePrompterSize(item.size),
      positionPreset: normalizePrompterPosition(item.positionPreset),
      scale: normalizePrompterScale(item.scale),
      ...(Number.isFinite(Number(item.x)) ? { x: Number(item.x) } : {}),
      ...(Number.isFinite(Number(item.y)) ? { y: Number(item.y) } : {}),
      order: Number.isFinite(Number(item.order)) ? Number(item.order) : index + 1,
    });

    return acc;
  }, []).sort((left, right) => left.order - right.order);

  if (blocks.length === 0) {
    return fallback;
  }

  const merged = [...blocks];
  for (const fallbackBlock of fallback) {
    if (
      merged.some((block) =>
        block.id === fallbackBlock.id
        || block.content.toLowerCase() === fallbackBlock.content.toLowerCase()
      )
    ) {
      continue;
    }

    merged.push({
      ...fallbackBlock,
      order: merged.length + 1,
    });
  }

  return merged.sort((left, right) => left.order - right.order);
}

function normalizeSceneRecipe(item: JsonRecord, title: string, description: string, brandBrief?: BrandBrief | null): SceneRecipePlan {
  const recipe = isRecord(item.recipe) ? item.recipe : {};
  const legacyScript = normalizeStringArray(item.script);
  const brandMustInclude = brandBrief?.mustInclude || [];
  const brandMustAvoid = brandBrief?.mustAvoid || [];
  const brandMessages = brandBrief?.keyMessages || [];

  const scriptLines = normalizeStringArray(recipe.scriptLines).length > 0
    ? normalizeStringArray(recipe.scriptLines)
    : legacyScript;
  const keyLine = compactText(recipe.keyLine) || scriptLines[0] || description || `Recreate the ${title.toLowerCase()} beat in your own words.`;
  const appealPoint =
    compactText(recipe.appealPoint) ||
    brandMessages[0] ||
    (description && description !== keyLine ? description : '') ||
    `Use this ${title.toLowerCase()} cut to move the viewer into the next beat.`;

  return {
    objective: compactText(recipe.objective) || `Turn the reference ${title.toLowerCase()} into a reusable creator beat.`,
    appealPoint,
    keyLine,
    scriptLines: scriptLines.length > 0 ? scriptLines : [keyLine],
    keyMood: compactText(recipe.keyMood) || DEFAULT_KEY_MOOD,
    keyAction: compactText(recipe.keyAction) || description || DEFAULT_KEY_ACTION,
    mustInclude: normalizeStringArray(recipe.mustInclude).length > 0 ? normalizeStringArray(recipe.mustInclude) : brandMustInclude,
    mustAvoid: normalizeStringArray(recipe.mustAvoid).length > 0 ? normalizeStringArray(recipe.mustAvoid) : brandMustAvoid,
    cta: compactText(recipe.cta),
  };
}

function normalizeSceneAnalysis(item: JsonRecord, title: string): SceneAnalysis {
  const analysis = isRecord(item.analysis) ? item.analysis : {};
  const transcriptSnippet = compactText(analysis.transcriptSnippet ?? item.transcriptSnippet);
  const motionDescription = compactText(analysis.motionDescription ?? item.description);
  const transcriptOriginal = normalizeStringArray(analysis.transcriptOriginal);
  const whyItWorks = normalizeStringArray(analysis.whyItWorks);
  const referenceSignalsRaw = Array.isArray(analysis.referenceSignals) ? analysis.referenceSignals : [];

  const referenceSignals = referenceSignalsRaw
    .map((signal) => {
      if (!isRecord(signal)) {
        return null;
      }

      const text = compactText(signal.text);
      if (!text) {
        return null;
      }

      return {
        type: normalizeReferenceSignalType(signal.type),
        text,
      };
    })
    .filter((signal): signal is SceneAnalysis['referenceSignals'][number] => Boolean(signal));

  return {
    transcriptOriginal: transcriptOriginal.length > 0 ? transcriptOriginal : transcriptSnippet ? [transcriptSnippet] : [],
    transcriptSnippet: transcriptSnippet || null,
    motionDescription,
    whyItWorks: whyItWorks.length > 0 ? whyItWorks : createFallbackWhyItWorks(title, motionDescription, transcriptSnippet),
    referenceSignals,
  };
}

export function normalizeRecipeScene(raw: unknown, index: number, brandBrief?: BrandBrief | null): RecipeScene {
  const item = isRecord(raw) ? raw : {};
  const title = compactText(item.title) || `Scene ${index + 1}`;
  const description = compactText(item.description);
  const recipe = normalizeSceneRecipe(item, title, description, brandBrief);
  const analysis = normalizeSceneAnalysis(item, title);

  return {
    id: Number(item.id ?? index + 1),
    title,
    startTime: compactText(item.startTime) || '00:00',
    endTime: compactText(item.endTime) || '00:05',
    thumbnail: compactText(item.thumbnail),
    analysis,
    recipe,
    prompter: {
      blocks: normalizePrompterBlocks(
        isRecord(item.prompter) ? item.prompter.blocks : undefined,
        recipe,
        analysis,
        brandBrief,
        title
      ),
    },
    progress: Number(item.progress ?? 0),
    description: analysis.motionDescription || recipe.appealPoint || recipe.keyLine,
    script: recipe.scriptLines,
    transcriptSnippet: analysis.transcriptSnippet ?? null,
  };
}

export function normalizeRecipeScenes(raw: unknown, brandBrief?: BrandBrief | null) {
  if (!Array.isArray(raw)) {
    return [] as RecipeScene[];
  }

  return raw.map((scene, index) => normalizeRecipeScene(scene, index, brandBrief));
}

export function buildPersistableScene(scene: RecipeScene): RecipeScene {
  const normalized = normalizeRecipeScene(scene, scene.id - 1);
  return {
    ...normalized,
    description: normalized.analysis.motionDescription || normalized.recipe.appealPoint || normalized.recipe.keyLine,
    script: normalized.recipe.scriptLines,
    transcriptSnippet: normalized.analysis.transcriptSnippet ?? null,
  };
}

export function buildPersistableScenes(scenes: RecipeScene[]) {
  return scenes.map((scene) => buildPersistableScene(scene));
}

export function getSceneOriginalScriptLines(scene: RecipeScene) {
  const originalLines = (scene.analysis.transcriptOriginal || [])
    .map((line) => line.trim())
    .filter(Boolean);

  if (originalLines.length > 0) {
    return originalLines;
  }

  const fallbackSnippet = (scene.analysis.transcriptSnippet || scene.transcriptSnippet || '').trim();
  return fallbackSnippet ? [fallbackSnippet] : [];
}

export function getSceneScriptLines(scene: RecipeScene) {
  return scene.recipe.scriptLines.length > 0 ? scene.recipe.scriptLines : scene.script || [];
}

export function getSceneCardSummary(scene: RecipeScene) {
  return {
    eyebrow: scene.recipe.appealPoint || scene.analysis.motionDescription || scene.title,
    title: scene.recipe.keyLine || scene.title,
    detail: scene.recipe.keyAction || scene.analysis.motionDescription || '',
  };
}

export function getBrandBriefFromMetadata(metadata: unknown) {
  if (!isRecord(metadata)) {
    return null;
  }

  return normalizeBrandBrief(metadata.brandBrief);
}
