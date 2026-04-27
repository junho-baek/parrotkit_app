import { Text, View } from 'react-native';

import { PrompterBlockCard } from '@/features/recipes/components/prompter-block-card';
import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export function SceneRecipePanel({
  scene,
  onToggleBlock,
}: {
  scene: NativeRecipeScene;
  onToggleBlock: (blockId: string, visible: boolean) => void;
}) {
  const scriptLines = scene.recipe.scriptLines.filter(Boolean);

  return (
    <View className="gap-5">
      <View className="gap-3">
        <Text className="text-[28px] font-black leading-[33px] text-ink">
          {scene.recipe.appealPoint || scene.recipe.keyLine || scene.title}
        </Text>
        {scene.recipe.keyAction ? (
          <Text className="text-sm leading-6 text-muted">{scene.recipe.keyAction}</Text>
        ) : null}
      </View>

      {scriptLines.length > 0 ? (
        <View className="gap-2">
          {scriptLines.slice(0, 3).map((line, index) => (
            <View key={`${scene.id}-recipe-line-${index}`} className="flex-row gap-3 rounded-[22px] border border-stroke bg-surface px-4 py-4">
              <Text className="text-xs font-black text-violet">{index + 1}</Text>
              <Text className="flex-1 text-sm leading-6 text-ink">{line}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View className="flex-row flex-wrap gap-3">
        {scene.prompter.blocks.map((block) => (
          <View key={block.id} className="w-[48%]">
            <PrompterBlockCard block={block} onToggle={onToggleBlock} />
          </View>
        ))}
      </View>
    </View>
  );
}
