import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

type QuickShootRecipeDraftPreviewProps = {
  blocks: PrompterBlock[];
};

export function QuickShootRecipeDraftPreview({ blocks }: QuickShootRecipeDraftPreviewProps) {
  const insets = useSafeAreaInsets();
  const visibleBlocks = blocks
    .filter((block) => block.visible)
    .sort((first, second) => first.order - second.order);
  const sceneBlocks = visibleBlocks.length > 0 ? visibleBlocks : blocks.slice(0, 1);

  return (
    <View className="flex-1 bg-canvas px-5" style={{ paddingTop: insets.top + 12 }}>
      <View className="flex-row items-center justify-between">
        <View className="h-10 w-10 items-center justify-center rounded-full border border-stroke bg-surface">
          <MaterialCommunityIcons color="#111827" name="arrow-left" size={18} />
        </View>
        <Text className="text-[12px] font-black uppercase tracking-[0.8px] text-muted">
          Recipe
        </Text>
        <View className="h-10 w-10" />
      </View>

      <View className="mt-7 gap-2">
        <Text className="text-[32px] font-black leading-[36px] text-ink">Quick Shoot Recipe</Text>
        <Text className="text-[15px] font-semibold leading-6 text-muted">
          {sceneBlocks.length} cue{sceneBlocks.length === 1 ? '' : 's'} ready to become cut-by-cut scenes.
        </Text>
      </View>

      <View className="mt-6 gap-3">
        {sceneBlocks.slice(0, 4).map((block, index) => (
          <View
            key={block.id}
            className="flex-row gap-3 rounded-[24px] border border-stroke bg-surface px-4 py-4"
          >
            <Text className="text-[13px] font-black text-violet">
              {String(index + 1).padStart(2, '0')}
            </Text>
            <View className="flex-1 gap-1">
              <Text className="text-[16px] font-black leading-5 text-ink" numberOfLines={2}>
                {block.content.trim() || `Cut ${index + 1}`}
              </Text>
              <Text className="text-[12px] font-semibold leading-5 text-muted">
                This cue becomes one shootable scene.
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
