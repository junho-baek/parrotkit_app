import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { RecipeSceneCard } from '@/features/recipes/components/recipe-scene-card';
import { SceneAnalysisPanel } from '@/features/recipes/components/scene-analysis-panel';
import { SceneRecipePanel } from '@/features/recipes/components/scene-recipe-panel';
import { normalizeNativeRecipe } from '@/features/recipes/lib/recipe-domain-normalizer';
import { sceneSupportsAnalysis } from '@/features/recipes/lib/scene-strategy-meta';
import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

type DetailTab = 'analysis' | 'recipe' | 'shoot';

const detailTabs: Array<{ id: DetailTab; label: string }> = [
  { id: 'analysis', label: 'Analysis' },
  { id: 'recipe', label: 'Recipe' },
  { id: 'shoot', label: 'Shoot' },
];

export function RecipeDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ recipeId?: string }>();
  const { getRecipeById, updateScenePrompterBlockVisibility } = useMockWorkspace();
  const recipe = params.recipeId ? getRecipeById(params.recipeId) : null;
  const nativeRecipe = useMemo(() => (recipe ? normalizeNativeRecipe(recipe) : null), [recipe]);

  const [activeTab, setActiveTab] = useState<DetailTab>('recipe');
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);

  useEffect(() => {
    if (!nativeRecipe?.scenes.length || selectedSceneId === null) {
      return;
    }

    if (!nativeRecipe.scenes.some((scene) => scene.id === selectedSceneId)) {
      setSelectedSceneId(null);
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

  const selectedScene = selectedSceneId
    ? nativeRecipe.scenes.find((scene) => scene.id === selectedSceneId) ?? null
    : null;

  const selectedSceneIndex = selectedScene
    ? nativeRecipe.scenes.findIndex((scene) => scene.id === selectedScene.id)
    : -1;

  const availableDetailTabs = selectedScene && sceneSupportsAnalysis(selectedScene)
    ? detailTabs
    : detailTabs.filter((tab) => tab.id !== 'analysis');

  const openScene = (scene: NativeRecipeScene) => {
    setSelectedSceneId(scene.id);
    setActiveTab(sceneSupportsAnalysis(scene) ? 'analysis' : 'recipe');
  };

  const closeScene = () => {
    setSelectedSceneId(null);
    setActiveTab('recipe');
  };

  const handleOpenPrompter = () => {
    if (!selectedScene) {
      return;
    }

    router.push(`/recipe/${nativeRecipe.id}/prompter?sceneId=${selectedScene.id}` as Href);
  };

  if (selectedScene) {
    const previousScene = selectedSceneIndex > 0 ? nativeRecipe.scenes[selectedSceneIndex - 1] : null;
    const nextScene = selectedSceneIndex >= 0 && selectedSceneIndex < nativeRecipe.scenes.length - 1
      ? nativeRecipe.scenes[selectedSceneIndex + 1]
      : null;
    const activeTabLabel = activeTab === 'shoot' ? 'Shooting' : activeTab === 'analysis' ? 'Analysis' : 'Recipe';

    return (
      <View className="flex-1 bg-canvas">
        <View
          className="flex-row items-center justify-between border-b border-stroke bg-surface px-5 pb-3"
          style={{ paddingTop: insets.top + 12 }}
        >
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full border border-stroke bg-canvas"
            onPress={closeScene}
          >
            <MaterialCommunityIcons color="#111827" name="arrow-left" size={20} />
          </Pressable>

          <Text className="max-w-[210px] text-center text-[14px] font-black text-ink" numberOfLines={1}>
            #{selectedScene.sceneNumber}: {selectedScene.title}
          </Text>

          <View className="min-w-[78px] items-end">
            <Text className="text-[12px] font-black text-muted">{activeTabLabel}</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 44 }}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-5 px-5 pt-4">
            <View className="flex-row gap-2 rounded-[24px] border border-stroke bg-surface p-1.5">
              {availableDetailTabs.map((tab) => {
                const active = tab.id === activeTab;

                return (
                  <Pressable
                    key={tab.id}
                    className={`flex-1 rounded-[18px] px-3 py-2.5 ${active ? 'bg-ink' : 'bg-transparent'}`}
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
                <View className="gap-2">
                  <Text className="text-[12px] font-black uppercase tracking-[1.2px] text-muted">
                    Scene {selectedScene.sceneNumber}
                  </Text>
                  <Text className="text-[22px] font-black leading-[27px] text-ink">{selectedScene.title}</Text>
                  <Text className="text-sm leading-6 text-muted">
                    {selectedScene.recipe.keyLine || selectedScene.recipe.keyAction || selectedScene.recipe.appealPoint}
                  </Text>
                  {selectedScene.recipe.keyAction ? (
                    <Text className="text-sm font-semibold leading-6 text-ink">{selectedScene.recipe.keyAction}</Text>
                  ) : null}
                </View>

                <Pressable onPress={handleOpenPrompter}>
                  <LinearGradient
                    colors={brandActionGradient}
                    end={{ x: 1, y: 1 }}
                    start={{ x: 0, y: 0 }}
                    style={{ borderRadius: 24 }}
                  >
                    <View className="flex-row items-center justify-center gap-2 px-5 py-4">
                      <MaterialCommunityIcons color="#fffdf8" name="camera-outline" size={20} />
                      <Text className="text-[15px] font-semibold text-white">Start shooting</Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              </View>
            )}

            <View className="flex-row gap-3">
              <Pressable
                className={`flex-1 rounded-[20px] border px-4 py-3 ${
                  previousScene ? 'border-stroke bg-surface' : 'border-stroke/60 bg-surface/60'
                }`}
                disabled={!previousScene}
                onPress={() => {
                  if (previousScene) {
                    openScene(previousScene);
                  }
                }}
              >
                <Text className={`text-center text-[13px] font-black ${previousScene ? 'text-ink' : 'text-muted'}`}>
                  Previous
                </Text>
              </Pressable>

              <Pressable
                className={`flex-1 rounded-[20px] border px-4 py-3 ${
                  nextScene ? 'border-stroke bg-surface' : 'border-stroke/60 bg-surface/60'
                }`}
                disabled={!nextScene}
                onPress={() => {
                  if (nextScene) {
                    openScene(nextScene);
                  }
                }}
              >
                <Text className={`text-center text-[13px] font-black ${nextScene ? 'text-ink' : 'text-muted'}`}>
                  Next
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

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

          <Text className="max-w-[220px] text-center text-[15px] font-black text-ink" numberOfLines={1}>
            {nativeRecipe.title}
          </Text>

          <Pressable
            className="rounded-full bg-ink px-4 py-2.5"
            onPress={() => {
              const firstScene = nativeRecipe.scenes[0];

              if (!firstScene) {
                return;
              }

              setSelectedSceneId(firstScene.id);
              setActiveTab('shoot');
            }}
          >
            <Text className="text-[12px] font-black text-white">Shoot</Text>
          </Pressable>
        </View>

        <View className="gap-2">
          <Text className="text-[26px] font-black leading-[31px] text-ink">{nativeRecipe.title}</Text>
          <Text className="text-sm leading-6 text-muted">{nativeRecipe.summary}</Text>
        </View>

        <View className="gap-3">
          {nativeRecipe.scenes.map((scene, sceneIndex) => (
            <RecipeSceneCard
              key={scene.id}
              scene={scene}
              sceneIndex={sceneIndex}
              totalScenes={nativeRecipe.scenes.length}
              onPress={() => openScene(scene)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
