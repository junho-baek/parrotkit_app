import { Pressable, ScrollView, Text, View } from 'react-native';

import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export function ShootingSceneSwitcher({
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
      <View className="flex-row gap-2 pr-1">
        {scenes.map((scene) => {
          const active = scene.id === activeSceneId;

          return (
            <Pressable
              key={scene.id}
              className={`rounded-full border px-4 py-2 ${active ? 'border-white/70 bg-white' : 'border-white/10 bg-white/5'}`}
              onPress={() => onSelectScene(scene.id)}
            >
              <Text className={`text-sm font-semibold ${active ? 'text-slate-950' : 'text-white/65'}`}>
                {scene.sceneNumber}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
