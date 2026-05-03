import {
  createPrompterDraftBlock,
  normalizePrompterOpacity,
  normalizePrompterScale,
} from '@/features/recipes/lib/prompter-layout';

const smallScale = normalizePrompterScale(0.1);
const lowOpacity = normalizePrompterOpacity(0.1);
const highOpacity = normalizePrompterOpacity(2);
const draftBlock = createPrompterDraftBlock({
  content: 'New scene cue',
  id: 'scene-cue-1',
  order: 2,
  y: 0.58,
});

if (smallScale !== 0.65) {
  throw new Error('normalizePrompterScale should clamp to the minimum scale.');
}

if (lowOpacity !== 0.35) {
  throw new Error('normalizePrompterOpacity should clamp to readable minimum opacity.');
}

if (highOpacity !== 1) {
  throw new Error('normalizePrompterOpacity should clamp to maximum opacity.');
}

if (draftBlock.content !== 'New scene cue' || draftBlock.visible !== true || draftBlock.opacity !== 0.92) {
  throw new Error('createPrompterDraftBlock should create a visible editable cue.');
}
