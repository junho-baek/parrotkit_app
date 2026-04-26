import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export function SceneSequenceRail({
  scenes,
  activeSceneId,
  onSelectScene,
}: {
  scenes: NativeRecipeScene[];
  activeSceneId: string;
  onSelectScene: (sceneId: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-3 pr-5">
        {scenes.map((scene) => {
          const active = scene.id === activeSceneId;

          return (
            <Pressable
              key={scene.id}
              className={`w-[128px] overflow-hidden rounded-[22px] border ${
                active ? 'border-violet bg-violet/5' : 'border-stroke bg-surface'
              }`}
              onPress={() => onSelectScene(scene.id)}
            >
              <View className="aspect-[9/12] bg-slate-100">
                {scene.thumbnail ? (
                  <Image className="h-full w-full" resizeMode="cover" source={{ uri: scene.thumbnail }} />
                ) : null}
              </View>
              <View className="gap-1 px-3 py-3">
                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons color={active ? '#6366f1' : '#64748b'} name="movie-open-outline" size={14} />
                  <Text className={`text-[11px] font-semibold ${active ? 'text-violet' : 'text-muted'}`}>
                    {scene.startTime}-{scene.endTime}
                  </Text>
                </View>
                <Text className="text-[13px] font-black leading-[17px] text-ink" numberOfLines={2}>
                  {scene.title}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
