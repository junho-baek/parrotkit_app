import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, Pressable, Text, View } from 'react-native';

import { getSceneCardSummary, getSceneStrategyMeta } from '@/features/recipes/lib/scene-strategy-meta';
import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export function RecipeSceneCard({
  scene,
  sceneIndex,
  totalScenes,
  captured = false,
  onPress,
}: {
  scene: NativeRecipeScene;
  sceneIndex: number;
  totalScenes: number;
  captured?: boolean;
  onPress: () => void;
}) {
  const meta = getSceneStrategyMeta(scene, sceneIndex, totalScenes);
  const summary = getSceneCardSummary(scene);

  return (
    <Pressable
      className={`overflow-hidden rounded-[22px] bg-surface ${
        captured ? 'border-2 border-emerald-500' : 'border border-stroke'
      }`}
      onPress={onPress}
    >
      <View className="flex-row gap-3 p-3">
        <View className="relative w-[108px] shrink-0 overflow-hidden rounded-[22px] bg-slate-100">
          <View className="aspect-[9/16] w-full">
            {scene.thumbnail ? (
              <Image className="h-full w-full" resizeMode="cover" source={{ uri: scene.thumbnail }} />
            ) : (
              <View className="h-full w-full bg-slate-200" />
            )}
          </View>
          <View className="absolute left-2 top-2 rounded-full bg-ink px-2 py-1">
            <Text className="text-[10px] font-black text-white">#{scene.sceneNumber}</Text>
          </View>
          {captured ? (
            <View className="absolute inset-0 items-center justify-center bg-emerald-500/20">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                <MaterialCommunityIcons color="#fff" name="check" size={16} />
              </View>
            </View>
          ) : null}
        </View>

        <View className="min-w-0 flex-1 justify-between py-1">
          <View className="gap-2">
            <Text className="text-[16px] font-black leading-[20px] text-ink" numberOfLines={2}>
              {summary}
            </Text>
            <Text className="text-[10px] font-black uppercase tracking-[1.4px] text-muted">
              {meta.stageLabel}: {meta.patternLabel}
            </Text>
          </View>

          <View className="flex-row items-center justify-end gap-1 pt-4">
            <Text className="text-xs font-bold text-muted">Open</Text>
            <MaterialCommunityIcons color="#64748b" name="arrow-right" size={16} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
