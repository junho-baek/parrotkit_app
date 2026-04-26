import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { SceneAnalysisPanel } from '@/features/recipes/components/scene-analysis-panel';
import { SceneRecipePanel } from '@/features/recipes/components/scene-recipe-panel';
import { SceneSequenceRail } from '@/features/recipes/components/scene-sequence-rail';
import { normalizeNativeRecipe } from '@/features/recipes/lib/recipe-domain-normalizer';

type DetailTab = 'analysis' | 'recipe' | 'shoot';

const detailTabs: Array<{ id: DetailTab; label: string }> = [
  { id: 'analysis', label: 'Analysis' },
  { id: 'recipe', label: 'Recipe' },
  { id: 'shoot', label: 'Shoot' },
];

export function RecipeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recipeId?: string }>();
  const { getRecipeById, updateScenePrompterBlockVisibility } = useMockWorkspace();
  const recipe = params.recipeId ? getRecipeById(params.recipeId) : null;
  const nativeRecipe = useMemo(() => (recipe ? normalizeNativeRecipe(recipe) : null), [recipe]);

  const [activeTab, setActiveTab] = useState<DetailTab>('recipe');
  const [selectedSceneId, setSelectedSceneId] = useState(nativeRecipe?.scenes[0]?.id ?? '');

  useEffect(() => {
    if (!nativeRecipe?.scenes.length) {
      return;
    }

    if (!selectedSceneId || !nativeRecipe.scenes.some((scene) => scene.id === selectedSceneId)) {
      setSelectedSceneId(nativeRecipe.scenes[0].id);
    }
  }, [nativeRecipe, selectedSceneId]);

  if (!nativeRecipe) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-6">
        <Text className="text-[26px] font-black text-ink">Recipe not found</Text>
        <Pressable className="mt-5 rounded-full bg-violet px-5 py-3" onPress={() => router.back()}>
          <Text className="text-sm font-bold text-white">Back</Text>
        </Pressable>
      </View>
    );
  }

  const selectedScene = nativeRecipe.scenes.find((scene) => scene.id === selectedSceneId) ?? nativeRecipe.scenes[0];

  const handleOpenPrompter = () => {
    router.push(`/recipe/${nativeRecipe.id}/prompter?sceneId=${selectedScene.id}` as Href);
  };

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ paddingBottom: 44 }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-5 px-5 pt-4">
        <View className="flex-row items-center justify-between">
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-full border border-stroke bg-surface"
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons color="#111827" name="arrow-left" size={20} />
          </Pressable>

          <Text className="max-w-[240px] text-center text-[15px] font-black text-ink" numberOfLines={1}>
            {nativeRecipe.title}
          </Text>

          <View className="h-11 w-11" />
        </View>

        <View className="overflow-hidden rounded-[28px] border border-stroke bg-surface">
          <View className="aspect-[16/10] overflow-hidden">
            <Image className="h-full w-full" resizeMode="cover" source={{ uri: nativeRecipe.thumbnail }} />
            <LinearGradient
              colors={['rgba(15,23,42,0.02)', 'rgba(15,23,42,0.74)']}
              end={{ x: 0.5, y: 1 }}
              start={{ x: 0.5, y: 0 }}
              style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
            />
            <View className="absolute inset-x-4 bottom-4 gap-1">
              <Text className="text-[28px] font-black leading-[32px] text-white">{nativeRecipe.title}</Text>
              <Text className="text-sm font-medium text-white/82">{nativeRecipe.creator}</Text>
            </View>
          </View>
        </View>

        <SceneSequenceRail
          activeSceneId={selectedScene.id}
          onSelectScene={(sceneId) => {
            setSelectedSceneId(sceneId);
            setActiveTab('recipe');
          }}
          scenes={nativeRecipe.scenes}
        />

        <View className="gap-2">
          <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">
            Scene {selectedScene.sceneNumber}
          </Text>
          <Text className="text-[30px] font-black leading-[34px] text-ink">{selectedScene.title}</Text>
          <Text className="text-sm leading-6 text-muted">{selectedScene.recipe.appealPoint || selectedScene.summary}</Text>
        </View>

        <View className="flex-row gap-2 rounded-[24px] border border-stroke bg-surface p-1.5">
          {detailTabs.map((tab) => {
            const active = tab.id === activeTab;

            return (
              <Pressable
                key={tab.id}
                className={`flex-1 rounded-[18px] px-3 py-2.5 ${active ? 'bg-violet' : 'bg-transparent'}`}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text className={`text-center text-[12px] font-semibold ${active ? 'text-white' : 'text-muted'}`}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {activeTab === 'analysis' ? (
          <SceneAnalysisPanel scene={selectedScene} />
        ) : activeTab === 'recipe' ? (
          <SceneRecipePanel
            scene={selectedScene}
            onToggleBlock={(blockId, visible) => {
              updateScenePrompterBlockVisibility(nativeRecipe.id, selectedScene.id, blockId, visible);
            }}
          />
        ) : (
          <View className="gap-4 rounded-[24px] border border-stroke bg-surface px-4 py-5">
            <Text className="text-[20px] font-black text-ink">{selectedScene.title}</Text>
            <Text className="text-sm leading-6 text-muted">
              {selectedScene.recipe.keyLine || selectedScene.recipe.appealPoint}
            </Text>
            <Pressable onPress={handleOpenPrompter}>
              <LinearGradient
                colors={brandActionGradient}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
                style={{ borderRadius: 24 }}
              >
                <View className="flex-row items-center justify-center gap-2 px-5 py-4">
                  <MaterialCommunityIcons color="#fffdf8" name="camera-outline" size={20} />
                  <Text className="text-[15px] font-semibold text-white">Open prompter</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
