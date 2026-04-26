import { MockRecipeScene } from '@/core/mocks/parrotkit-data';
import { normalizeNativeRecipeScene } from '@/features/recipes/lib/recipe-domain-normalizer';
import { PrompterBlock } from '@/features/recipes/types/recipe-domain';

export type MockPrompterElementKind = PrompterBlock['type'];

export type MockPrompterElement = {
  id: string;
  kind: MockPrompterElementKind;
  label: string;
  text: string;
  visible: boolean;
};

export function getScenePrompterElements(scene: MockRecipeScene): MockPrompterElement[] {
  const normalized = normalizeNativeRecipeScene(scene, 0, '');

  return normalized.prompter.blocks.map((block) => ({
    id: block.id,
    kind: block.type,
    label: block.label || block.type.replace(/_/g, ' '),
    text: block.content,
    visible: block.visible,
  }));
}

export function getDefaultPrompterSelection(scene: MockRecipeScene) {
  return getScenePrompterElements(scene)
    .filter((element) => element.visible)
    .map((element) => element.id);
}

export function getSelectedPrompterElements(scene: MockRecipeScene, selectedIds: string[]) {
  const selected = new Set(selectedIds);

  return getScenePrompterElements(scene).filter((element) => selected.has(element.id));
}
