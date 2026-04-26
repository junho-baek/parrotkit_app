import { MockRecipe, MockRecipeScene } from '@/core/mocks/parrotkit-data';
import {
  NativeRecipe,
  NativeRecipeScene,
  PrompterBlock,
  PrompterBlockSize,
  PrompterBlockType,
  PrompterPositionPreset,
  ReferenceSignalType,
} from '@/features/recipes/types/recipe-domain';

function compactText(value: unknown) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value.map((item) => compactText(item)).filter(Boolean);
}

function normalizePrompterType(value: unknown): PrompterBlockType {
  const supported: PrompterBlockType[] = ['key_line', 'keyword', 'appeal_point', 'mood', 'action', 'warning', 'cta'];
  const normalized = compactText(value) as PrompterBlockType;
  return supported.includes(normalized) ? normalized : 'keyword';
}

function normalizeReferenceSignalType(value: unknown): ReferenceSignalType {
  const supported: ReferenceSignalType[] = ['hook', 'pacing', 'motion', 'caption', 'emotion', 'product', 'cta'];
  const normalized = compactText(value) as ReferenceSignalType;
  return supported.includes(normalized) ? normalized : 'motion';
}

function normalizePrompterSize(value: unknown): PrompterBlockSize {
  const supported: PrompterBlockSize[] = ['sm', 'md', 'lg', 'xl'];
  const normalized = compactText(value) as PrompterBlockSize;
  return supported.includes(normalized) ? normalized : 'lg';
}

function normalizePrompterPosition(value: unknown): PrompterPositionPreset {
  const supported: PrompterPositionPreset[] = ['top', 'upperThird', 'center', 'lowerThird', 'bottom'];
  const normalized = compactText(value) as PrompterPositionPreset;
  return supported.includes(normalized) ? normalized : 'lowerThird';
}

function timeForIndex(index: number, offset: number) {
  return `00:${String(index * 5 + offset).padStart(2, '0')}`;
}

function createDefaultBlocks(scene: MockRecipeScene): PrompterBlock[] {
  const recipeLines = normalizeStringArray(scene.recipeLines);
  const prompterLines = normalizeStringArray(scene.prompterLines);
  const keyLine = compactText(scene.recipe?.keyLine) || recipeLines[0] || compactText(scene.summary) || 'Open with the clearest cue.';
  const keyAction = compactText(scene.recipe?.keyAction) || recipeLines[1] || compactText(scene.summary) || 'Match the reference beat.';

  const baseBlocks: PrompterBlock[] = [
    {
      id: 'key-line',
      type: 'key_line',
      label: 'Main Script',
      content: keyLine,
      accentColor: 'blue',
      visible: true,
      size: 'xl',
      positionPreset: 'lowerThird',
      scale: 1,
      order: 1,
    },
    {
      id: 'action',
      type: 'action',
      label: 'Action',
      content: keyAction,
      accentColor: 'coral',
      visible: true,
      size: 'md',
      positionPreset: 'upperThird',
      scale: 1,
      order: 2,
    },
  ];

  const cueBlocks = prompterLines.map((line, index) => ({
    id: `cue-${index + 1}`,
    type: 'keyword' as const,
    label: 'Cue',
    content: line,
    accentColor: index % 2 === 0 ? 'pink' : 'green',
    visible: index === 0,
    size: 'md' as const,
    positionPreset: 'lowerThird' as const,
    scale: 1,
    order: index + 3,
  }));

  return [...baseBlocks, ...cueBlocks].filter((block, index, blocks) => {
    const key = block.content.toLowerCase();
    return key.length > 0 && blocks.findIndex((candidate) => candidate.content.toLowerCase() === key) === index;
  });
}

function normalizePrompterBlocks(scene: MockRecipeScene): PrompterBlock[] {
  const rawBlocks = scene.prompter?.blocks;
  if (!Array.isArray(rawBlocks) || rawBlocks.length === 0) {
    return createDefaultBlocks(scene);
  }

  const blocks = rawBlocks
    .map((block, blockIndex) => ({
      id: compactText(block.id) || `block-${blockIndex + 1}`,
      type: normalizePrompterType(block.type),
      label: compactText(block.label) || undefined,
      content: compactText(block.content),
      accentColor: compactText(block.accentColor) || undefined,
      visible: block.visible !== false,
      size: normalizePrompterSize(block.size),
      positionPreset: normalizePrompterPosition(block.positionPreset),
      scale: Number.isFinite(Number(block.scale)) ? Number(block.scale) : 1,
      x: Number.isFinite(Number(block.x)) ? Number(block.x) : undefined,
      y: Number.isFinite(Number(block.y)) ? Number(block.y) : undefined,
      order: Number.isFinite(Number(block.order)) ? Number(block.order) : blockIndex + 1,
    }))
    .filter((block) => block.content.length > 0)
    .sort((left, right) => left.order - right.order);

  return blocks.length > 0 ? blocks : createDefaultBlocks(scene);
}

export function normalizeNativeRecipeScene(scene: MockRecipeScene, index: number, recipeThumbnail: string): NativeRecipeScene {
  const sceneNumber = Number(scene.sceneNumber ?? index + 1);
  const analysisLines = normalizeStringArray(scene.analysisLines);
  const recipeLines = normalizeStringArray(scene.recipeLines);
  const prompterBlocks = normalizePrompterBlocks(scene);
  const whyItWorks = normalizeStringArray(scene.analysis?.whyItWorks);
  const scriptLines = normalizeStringArray(scene.recipe?.scriptLines);
  const referenceSignals = Array.isArray(scene.analysis?.referenceSignals)
    ? scene.analysis.referenceSignals
        .map((signal) => ({
          type: normalizeReferenceSignalType(signal.type),
          text: compactText(signal.text),
        }))
        .filter((signal) => signal.text.length > 0)
    : [];

  return {
    id: compactText(scene.id) || `scene-${sceneNumber}`,
    sceneNumber,
    title: compactText(scene.title) || `Scene ${sceneNumber}`,
    startTime: compactText(scene.startTime) || timeForIndex(index, 0),
    endTime: compactText(scene.endTime) || timeForIndex(index, 5),
    thumbnail: compactText(scene.thumbnail) || recipeThumbnail,
    analysis: {
      transcriptOriginal: normalizeStringArray(scene.analysis?.transcriptOriginal),
      transcriptSnippet: compactText(scene.analysis?.transcriptSnippet) || analysisLines[0] || null,
      motionDescription: compactText(scene.analysis?.motionDescription) || compactText(scene.summary),
      whyItWorks: whyItWorks.length > 0 ? whyItWorks : analysisLines,
      referenceSignals,
    },
    recipe: {
      objective: compactText(scene.recipe?.objective) || compactText(scene.summary),
      appealPoint: compactText(scene.recipe?.appealPoint) || compactText(scene.summary),
      keyLine: compactText(scene.recipe?.keyLine) || recipeLines[0] || prompterBlocks[0]?.content || '',
      scriptLines: scriptLines.length > 0 ? scriptLines : recipeLines,
      keyMood: compactText(scene.recipe?.keyMood) || 'Clear and direct',
      keyAction: compactText(scene.recipe?.keyAction) || recipeLines[1] || compactText(scene.summary),
      mustInclude: normalizeStringArray(scene.recipe?.mustInclude),
      mustAvoid: normalizeStringArray(scene.recipe?.mustAvoid),
      cta: compactText(scene.recipe?.cta),
    },
    prompter: {
      blocks: prompterBlocks,
    },
    progress: typeof scene.progress === 'number' ? scene.progress : 0,
    summary: scene.summary,
    analysisLines,
    recipeLines,
    prompterLines: normalizeStringArray(scene.prompterLines),
  };
}

export function normalizeNativeRecipe(recipe: MockRecipe): NativeRecipe {
  return {
    ...recipe,
    scenes: recipe.scenes.map((scene, index) => normalizeNativeRecipeScene(scene, index, recipe.thumbnail)),
  };
}

export function getVisiblePrompterBlocks(scene: NativeRecipeScene) {
  return scene.prompter.blocks
    .filter((block) => block.visible)
    .sort((left, right) => left.order - right.order);
}
