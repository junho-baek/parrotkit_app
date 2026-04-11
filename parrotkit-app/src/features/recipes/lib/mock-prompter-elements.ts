import { MockRecipeScene } from '@/core/mocks/parrotkit-data';

export type MockPrompterElementKind = 'script' | 'cue';

export type MockPrompterElement = {
  id: string;
  kind: MockPrompterElementKind;
  label: string;
  text: string;
};

export function getScenePrompterElements(scene: MockRecipeScene): MockPrompterElement[] {
  const scriptElements = scene.recipeLines.map((line, index) => ({
    id: `script-${index + 1}`,
    kind: 'script' as const,
    label: `Script ${index + 1}`,
    text: line,
  }));

  const cueElements = scene.prompterLines.map((line, index) => ({
    id: `cue-${index + 1}`,
    kind: 'cue' as const,
    label: `Cue ${index + 1}`,
    text: line,
  }));

  return [...scriptElements, ...cueElements];
}

export function getDefaultPrompterSelection(scene: MockRecipeScene) {
  const elements = getScenePrompterElements(scene);

  return elements
    .filter((element, index) => element.kind === 'cue' || index === 0)
    .map((element) => element.id);
}

export function getSelectedPrompterElements(scene: MockRecipeScene, selectedIds: string[]) {
  const selected = new Set(selectedIds);

  return getScenePrompterElements(scene).filter((element) => selected.has(element.id));
}
