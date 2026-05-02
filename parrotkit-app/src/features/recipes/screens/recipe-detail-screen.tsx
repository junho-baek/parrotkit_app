import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage, type AppLanguage } from '@/core/i18n/app-language';
import type { MockRecipe } from '@/core/mocks/parrotkit-data';
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

const detailCopy = {
  en: {
    back: 'Back',
    partnerCreator: 'Partner Creator',
    verified: 'Verified',
    keyHook: 'Key Hook',
    structurePreview: 'Structure Preview',
    whyItWorks: 'Why it works',
    scenes: 'Scene details',
    save: 'Save',
    saved: 'Saved',
    startShooting: 'Start Shooting',
    saves: 'saves',
    views: 'views',
    sceneCount: 'scenes',
  },
  ko: {
    back: '뒤로',
    partnerCreator: '파트너 크리에이터',
    verified: '인증됨',
    keyHook: '핵심 훅',
    structurePreview: '구성 미리보기',
    whyItWorks: '활용 포인트',
    scenes: '씬 상세',
    save: '저장',
    saved: '저장됨',
    startShooting: '촬영 시작',
    saves: '저장',
    views: '조회',
    sceneCount: '씬',
  },
} satisfies Record<AppLanguage, Record<string, string>>;

export function RecipeDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ recipeId?: string }>();
  const { language } = useAppLanguage();
  const copy = detailCopy[language];
  const {
    downloadRecipe,
    getRecipeById,
    isRecipeDownloaded,
    updateScenePrompterBlockVisibility,
  } = useMockWorkspace();
  const recipe = params.recipeId ? getRecipeById(params.recipeId) : null;
  const nativeRecipe = useMemo(() => (recipe ? normalizeNativeRecipe(recipe) : null), [recipe]);

  const [activeTab, setActiveTab] = useState<DetailTab>('recipe');
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/explore' as Href);
  };

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
        <Pressable className="mt-5 rounded-full bg-violet px-5 py-3" onPress={handleBack}>
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

  const recipeSaved = recipe ? isRecipeSaved(recipe, isRecipeDownloaded(recipe.id)) : false;

  const saveRecipe = () => {
    if (!recipe) {
      return null;
    }

    if (recipeSaved) {
      return recipe;
    }

    const downloadedRecipe = downloadRecipe(recipe.id);

    if (downloadedRecipe) {
      router.replace(`/recipe/${downloadedRecipe.id}` as Href);
      return downloadedRecipe;
    }

    return recipe;
  };

  const handleStartRecipe = () => {
    const targetRecipe = saveRecipe();
    const firstScene = targetRecipe?.scenes[0];

    if (!targetRecipe || !firstScene) {
      return;
    }

    router.push(`/recipe/${targetRecipe.id}/prompter?sceneId=${firstScene.id}` as Href);
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

  const detailRecipe = recipe;

  if (!detailRecipe) {
    return null;
  }

  const firstScene = nativeRecipe.scenes[0] ?? null;
  const keyHook = firstScene?.recipe.keyLine || nativeRecipe.summary;
  const whyItWorks = getWhyItWorks(nativeRecipe.scenes);

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 44 }}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          imageStyle={styles.heroImage}
          resizeMode="cover"
          source={{ uri: nativeRecipe.thumbnail }}
          style={styles.hero}
        >
          <LinearGradient
            colors={['rgba(15,23,42,0.1)', 'rgba(15,23,42,0.48)', 'rgba(15,23,42,0.92)']}
            locations={[0, 0.42, 1]}
            style={StyleSheet.absoluteFill}
          />

          <View className="flex-1 justify-between px-5 pb-5" style={{ paddingTop: insets.top + 12 }}>
            <View className="flex-row items-center justify-between">
              <Pressable
                accessibilityLabel={copy.back}
                className="h-10 w-10 items-center justify-center rounded-full bg-black/35"
                onPress={handleBack}
              >
                <MaterialCommunityIcons color="#fff" name="arrow-left" size={21} />
              </Pressable>

              <View className="flex-row gap-2">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-black/35">
                  <MaterialCommunityIcons color="#fff" name="share-variant-outline" size={19} />
                </View>
                <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-black/35" onPress={saveRecipe}>
                  <MaterialCommunityIcons color="#fff" name={recipeSaved ? 'bookmark' : 'bookmark-outline'} size={20} />
                </Pressable>
              </View>
            </View>

            <View className="gap-3">
              <View className="flex-row flex-wrap gap-2">
                <View style={styles.heroBadge}>
                  <Text className="text-[10px] font-black text-white">{copy.partnerCreator}</Text>
                </View>
                <View style={styles.heroBadge}>
                  <MaterialCommunityIcons color="#fff" name="check-decagram" size={11} />
                  <Text className="text-[10px] font-black text-white">{copy.verified}</Text>
                </View>
              </View>

              <Text className="text-[26px] font-black leading-[31px] text-white" numberOfLines={2}>
                {getDetailTitle(language, detailRecipe)}
              </Text>
              <Text style={styles.heroSummary} numberOfLines={2}>
                {nativeRecipe.summary}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <Text style={styles.heroMetaStrong}>{detailRecipe.ownerHandle}</Text>
                <Text style={styles.heroMeta}>
                  ♡ {formatCompactMetric(detailRecipe.downloadCount)} {copy.saves}
                </Text>
                <Text style={styles.heroMeta}>
                  ◦ {formatCompactMetric(detailRecipe.downloadCount * 6)} {copy.views}
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-1.5">
                {getDetailTags(language, detailRecipe).map((tag) => (
                  <View key={tag} style={styles.heroTag}>
                    <Text style={styles.heroTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ImageBackground>

        <View className="gap-5 px-5 py-5">
          <View className="gap-2">
            <Text className="text-[16px] font-black text-ink">{copy.keyHook}</Text>
            <Text className="text-[15px] font-semibold leading-6 text-slate-700">
              "{keyHook}"
            </Text>
          </View>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[16px] font-black text-ink">{copy.structurePreview}</Text>
              <Text className="text-[12px] font-bold text-muted">
                {nativeRecipe.scenes.length} {copy.sceneCount} · 30s
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3 pr-5">
                {nativeRecipe.scenes.slice(0, 4).map((scene, index) => (
                  <Pressable key={scene.id} onPress={() => openScene(scene)} style={styles.structureCard}>
                    <View style={[styles.structureMarker, { backgroundColor: getStructureColor(index) }]} />
                    <Text className="text-[11px] font-black text-ink">{scene.startTime}</Text>
                    <Text className="text-[12px] font-black leading-4 text-ink" numberOfLines={2}>
                      {scene.title}
                    </Text>
                    <Text className="text-[10px] font-semibold leading-4 text-muted" numberOfLines={2}>
                      {scene.recipe.keyAction || scene.summary}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="gap-2">
            <Text className="text-[16px] font-black text-ink">{copy.whyItWorks}</Text>
            {whyItWorks.map((line) => (
              <View className="flex-row gap-2" key={line}>
                <Text className="text-[14px] font-black text-violet">✓</Text>
                <Text className="flex-1 text-[13px] font-semibold leading-5 text-slate-700">{line}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row gap-3">
            <Pressable
              accessibilityRole="button"
              className="min-h-[50px] flex-1 flex-row items-center justify-center gap-2 rounded-full border border-stroke bg-surface"
              onPress={saveRecipe}
            >
              <MaterialCommunityIcons color="#111827" name={recipeSaved ? 'bookmark' : 'bookmark-outline'} size={18} />
              <Text className="text-[14px] font-black text-ink">{recipeSaved ? copy.saved : copy.save}</Text>
            </Pressable>

            <Pressable accessibilityRole="button" className="flex-[1.7] overflow-hidden rounded-full" onPress={handleStartRecipe}>
              <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.startButton}>
                <MaterialCommunityIcons color="#fff" name="camera-outline" size={18} />
                <Text className="text-[14px] font-black text-white">{copy.startShooting}</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <View className="gap-3">
            <Text className="text-[16px] font-black text-ink">{copy.scenes}</Text>
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
    </View>
  );
}

function isRecipeSaved(recipe: MockRecipe, downloadedFromExplore: boolean) {
  return recipe.id.startsWith('downloaded-') || recipe.ownership !== 'community' || downloadedFromExplore;
}

function formatCompactMetric(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  }

  return String(value);
}

function getDetailTitle(language: AppLanguage, recipe: MockRecipe) {
  if (language === 'en') {
    if (recipe.id.includes('beauty-proof-routine')) return 'Glowy Skin Routine';
    if (recipe.id.includes('core-control-proof')) return 'Home Upper Body Workout';
    if (recipe.id.includes('founder-problem-hook')) return 'New App Launch Promo';
    return recipe.title;
  }

  if (recipe.id.includes('beauty-proof-routine')) return '광채 피부 표현 루틴';
  if (recipe.id.includes('core-control-proof')) return '집에서 하는 상체 운동 루틴';
  if (recipe.id.includes('founder-problem-hook')) return '새로운 앱 런칭 홍보 레시피';
  return recipe.title;
}

function getDetailTags(language: AppLanguage, recipe: MockRecipe) {
  if (language === 'ko') {
    return [
      recipe.niche === 'Beauty' ? '뷰티' : recipe.niche === 'Fitness' ? '피트니스' : '크리에이터',
      recipe.id.includes('beauty') ? '제품 홍보' : recipe.id.includes('core') ? '운동 루틴' : '앱 홍보',
      '30초',
      recipe.verification === 'verified_creator' ? '인증' : '커뮤니티',
    ];
  }

  return [
    recipe.niche,
    recipe.goal.split(' ').slice(0, 2).join(' '),
    '30s',
    recipe.verification === 'verified_creator' ? 'Verified' : 'Community',
  ];
}

function getWhyItWorks(scenes: NativeRecipeScene[]) {
  const firstScene = scenes[0];
  const explicitLines = firstScene?.analysis.whyItWorks ?? [];

  if (explicitLines.length > 0) {
    return explicitLines.slice(0, 2);
  }

  return scenes
    .flatMap((scene) => scene.analysis.whyItWorks)
    .filter(Boolean)
    .slice(0, 2);
}

function getStructureColor(index: number) {
  const colors = ['#fb7185', '#fb923c', '#8b5cf6', '#38bdf8'];
  return colors[index % colors.length];
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 365,
  },
  heroBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.34)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  heroImage: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroMeta: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '800',
  },
  heroMetaStrong: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 12,
    fontWeight: '900',
  },
  heroSummary: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 20,
  },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroTagText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    fontWeight: '900',
  },
  startButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 16,
  },
  structureCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    minHeight: 118,
    padding: 12,
    width: 136,
  },
  structureMarker: {
    borderRadius: 999,
    height: 18,
    width: 4,
  },
});
