import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage, type AppLanguage } from '@/core/i18n/app-language';
import type { MockRecipe } from '@/core/mocks/parrotkit-data';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { normalizeNativeRecipe } from '@/features/recipes/lib/recipe-domain-normalizer';
import { getSceneCardSummary, getSceneStrategyMeta } from '@/features/recipes/lib/scene-strategy-meta';
import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

type DetailTab = 'analysis' | 'recipe' | 'shoot';
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

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
    startScene: 'Start Scene',
    openScene: 'Open workspace',
    saves: 'saves',
    views: 'views',
    sceneCount: 'scenes',
    prepSnapshot: 'Ready-to-shoot brief',
    sceneTimeline: 'Scene timeline',
    referenceVideo: 'Reference clip',
    whyThisWorks: 'Why this works',
    copyThis: 'Copy this',
    avoidThis: 'Avoid this',
    sceneGoal: 'Scene Goal',
    creatorDirection: 'Creator Direction',
    prompterLines: 'Prompter Lines',
    onScreenText: 'On-screen Text',
    brandNotes: 'Brand Notes',
    toneVariants: 'Tone Variants',
    shotGuide: 'Shot guide',
    checklist: 'Before recording',
    cameraAngle: 'Camera angle',
    lighting: 'Lighting',
    productCue: 'Product cue',
    say: 'Say',
    show: 'Show',
    avoid: 'Avoid',
    previous: 'Previous',
    next: 'Next',
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
    startScene: '씬 시작',
    openScene: '작업실 열기',
    saves: '저장',
    views: '조회',
    sceneCount: '씬',
    prepSnapshot: '촬영 준비 브리프',
    sceneTimeline: '씬 타임라인',
    referenceVideo: '예시 영상',
    whyThisWorks: '왜 먹히는지',
    copyThis: '이렇게 따라하기',
    avoidThis: '피할 것',
    sceneGoal: '씬 목표',
    creatorDirection: '크리에이터 지시',
    prompterLines: '프롬프터 문장',
    onScreenText: '화면 자막',
    brandNotes: '브랜드 노트',
    toneVariants: '말투 변경',
    shotGuide: '촬영 가이드',
    checklist: '촬영 전 체크',
    cameraAngle: '카메라 앵글',
    lighting: '조명',
    productCue: '제품 타이밍',
    say: '대사',
    show: '화면',
    avoid: '피하기',
    previous: '이전 씬',
    next: '다음 씬',
  },
} satisfies Record<AppLanguage, Record<string, string>>;

type DetailCopy = (typeof detailCopy)['en'];

export function RecipeDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ recipeId?: string; sceneId?: string; tab?: DetailTab }>();
  const { language } = useAppLanguage();
  const copy = detailCopy[language];
  const {
    downloadRecipe,
    getRecipeById,
    isRecipeDownloaded,
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

  useEffect(() => {
    if (!nativeRecipe?.scenes.length || !params.sceneId) {
      return;
    }

    if (nativeRecipe.scenes.some((scene) => scene.id === params.sceneId)) {
      setSelectedSceneId(params.sceneId);
    }

    if (params.tab && isDetailTab(params.tab)) {
      setActiveTab(params.tab);
    }
  }, [nativeRecipe, params.sceneId, params.tab]);

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

  const openScene = (scene: NativeRecipeScene) => {
    setSelectedSceneId(scene.id);
    setActiveTab('analysis');
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

  const handleStartScene = (scene: NativeRecipeScene) => {
    const targetRecipe = saveRecipe();

    if (!targetRecipe) {
      return;
    }

    router.push(`/recipe/${targetRecipe.id}/prompter?sceneId=${scene.id}` as Href);
  };

  if (selectedScene) {
    const previousScene = selectedSceneIndex > 0 ? nativeRecipe.scenes[selectedSceneIndex - 1] : null;
    const nextScene = selectedSceneIndex >= 0 && selectedSceneIndex < nativeRecipe.scenes.length - 1
      ? nativeRecipe.scenes[selectedSceneIndex + 1]
      : null;
    const sceneRole = getSceneRoleLabel(language, selectedSceneIndex, nativeRecipe.scenes.length);

    return (
      <View className="flex-1 bg-canvas">
        <View
          className="border-b border-stroke bg-surface px-5 pb-3"
          style={{ paddingTop: insets.top + 12 }}
        >
          <View className="flex-row items-center justify-between">
            <Pressable
              className="h-10 w-10 items-center justify-center rounded-full border border-stroke bg-canvas"
              onPress={closeScene}
            >
              <MaterialCommunityIcons color="#111827" name="arrow-left" size={20} />
            </Pressable>

            <View className="min-w-0 flex-1 px-3">
              <Text className="text-center text-[12px] font-black text-violet" numberOfLines={1}>
                #{selectedScene.sceneNumber} · {sceneRole} · {getSceneDuration(selectedScene)}
              </Text>
              <Text className="text-center text-[14px] font-black text-ink" numberOfLines={1}>
                {selectedScene.title}
              </Text>
            </View>

            <Pressable
              className="h-10 w-10 items-center justify-center rounded-full bg-ink"
              onPress={handleOpenPrompter}
            >
              <MaterialCommunityIcons color="#fff" name="camera-outline" size={18} />
            </Pressable>
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
              {detailTabs.map((tab) => {
                const active = tab.id === activeTab;

                return (
                  <Pressable
                    key={tab.id}
                    className={`flex-1 rounded-[18px] px-3 py-2.5 ${active ? 'bg-ink' : 'bg-transparent'}`}
                    onPress={() => setActiveTab(tab.id)}
                  >
                    <Text className={`text-center text-[12px] font-semibold ${active ? 'text-white' : 'text-muted'}`}>
                      {getTabLabel(language, tab.id)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {activeTab === 'analysis' ? (
              <SceneWatchPanel
                copy={copy}
                language={language}
                scene={selectedScene}
                sceneIndex={selectedSceneIndex}
                totalScenes={nativeRecipe.scenes.length}
              />
            ) : activeTab === 'recipe' ? (
              <ScenePlanPanel
                copy={copy}
                language={language}
                recipe={nativeRecipe}
                scene={selectedScene}
                sceneIndex={selectedSceneIndex}
                totalScenes={nativeRecipe.scenes.length}
              />
            ) : (
              <SceneShootPanel
                copy={copy}
                language={language}
                onStart={handleOpenPrompter}
                scene={selectedScene}
                sceneIndex={selectedSceneIndex}
                totalScenes={nativeRecipe.scenes.length}
              />
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
                  {copy.previous}
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
                  {copy.next}
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
      <View
        className="border-b border-stroke bg-surface px-5 pb-4"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityLabel={copy.back}
            className="h-10 w-10 items-center justify-center rounded-full border border-stroke bg-canvas"
            onPress={handleBack}
          >
            <MaterialCommunityIcons color="#111827" name="arrow-left" size={21} />
          </Pressable>

          <View className="min-w-0 flex-1 px-3">
            <Text className="text-center text-[12px] font-black uppercase text-violet">
              {language === 'ko' ? '실행 워크스페이스' : 'Execution Workspace'}
            </Text>
            <Text className="text-center text-[14px] font-black text-ink" numberOfLines={1}>
              {nativeRecipe.scenes.length} {copy.sceneCount} · 30s
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full bg-ink"
            onPress={handleStartRecipe}
          >
            <MaterialCommunityIcons color="#fff" name="camera-outline" size={18} />
          </Pressable>
        </View>

        <View className="flex-row gap-3 pt-4">
          <ImageBackground
            imageStyle={styles.executionThumbImage}
            resizeMode="cover"
            source={{ uri: nativeRecipe.thumbnail }}
            style={styles.executionThumb}
          >
            <LinearGradient
              colors={['rgba(15,23,42,0)', 'rgba(15,23,42,0.72)']}
              style={StyleSheet.absoluteFill}
            />
            <View className="absolute bottom-2 left-2 right-2 rounded-full bg-white/90 px-2 py-1.5">
              <Text className="text-center text-[10px] font-black text-ink">
                {nativeRecipe.scenes.length} {copy.sceneCount} · 30s
              </Text>
            </View>
          </ImageBackground>

          <View className="min-w-0 flex-1 gap-2">
            <Text className="text-[22px] font-black leading-[27px] text-ink" numberOfLines={2}>
              {getDetailTitle(language, detailRecipe)}
            </Text>
            <Text className="text-[13px] font-semibold leading-5 text-muted" numberOfLines={2}>
              {language === 'ko'
                ? '타임라인을 확인하고, 씬별 준비를 맞춘 뒤 바로 프롬프터로 촬영하세요.'
                : 'Check the timeline, prep each scene, then move into prompter mode.'}
            </Text>
            <View className="flex-row flex-wrap gap-1.5">
              {getDetailTags(language, detailRecipe).slice(0, 3).map((tag) => (
                <View key={tag} style={styles.executionTag}>
                  <Text style={styles.executionTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="mt-4 flex-row gap-3">
          <Pressable
            accessibilityRole="button"
            className="min-h-[48px] flex-1 flex-row items-center justify-center gap-2 rounded-full border border-stroke bg-canvas"
            onPress={saveRecipe}
          >
            <MaterialCommunityIcons color="#111827" name={recipeSaved ? 'bookmark' : 'bookmark-outline'} size={18} />
            <Text className="text-[13px] font-black text-ink">{recipeSaved ? copy.saved : copy.save}</Text>
          </Pressable>

          <Pressable accessibilityRole="button" className="flex-[1.6] overflow-hidden rounded-full" onPress={handleStartRecipe}>
            <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.executionStartButton}>
              <MaterialCommunityIcons color="#fff" name="record-circle-outline" size={18} />
              <Text className="text-[13px] font-black text-white">{copy.startShooting}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 44 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5 px-5 py-5">
          <View style={styles.executionFlowCard}>
            <Text className="text-[13px] font-black text-ink">
              {language === 'ko' ? '오늘 찍을 흐름' : 'Today’s shooting flow'}
            </Text>
            <View className="mt-3 flex-row items-center justify-between">
              {nativeRecipe.scenes.map((scene, sceneIndex) => (
                <View className="flex-1 items-center gap-2" key={scene.id}>
                  <View style={[styles.flowNode, { backgroundColor: getStructureColor(sceneIndex) }]}>
                    <Text className="text-[11px] font-black text-white">#{scene.sceneNumber}</Text>
                  </View>
                  <Text className="text-center text-[10px] font-black leading-3 text-slate-700" numberOfLines={2}>
                    {getSceneRoleLabel(language, sceneIndex, nativeRecipe.scenes.length)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-[16px] font-black text-ink">{copy.keyHook}</Text>
            <Text className="text-[15px] font-semibold leading-6 text-slate-700">
              "{keyHook}"
            </Text>
          </View>

          <RecipePrepSnapshot copy={copy} language={language} recipe={detailRecipe} />

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[16px] font-black text-ink">{copy.sceneTimeline}</Text>
              <Text className="text-[12px] font-bold text-muted">
                {nativeRecipe.scenes.length} {copy.sceneCount} · 30s
              </Text>
            </View>

            <View className="gap-3">
              {nativeRecipe.scenes.map((scene, sceneIndex) => (
                <SceneTimelineCard
                  copy={copy}
                  key={scene.id}
                  language={language}
                  onOpen={() => openScene(scene)}
                  onShoot={() => handleStartScene(scene)}
                  scene={scene}
                  sceneIndex={sceneIndex}
                  totalScenes={nativeRecipe.scenes.length}
                />
              ))}
            </View>
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

          <View className="rounded-[24px] border border-violet/20 bg-violet/5 px-4 py-4">
            <Text className="text-[13px] font-black text-ink">
              {language === 'ko' ? '씬을 열면 예시, 준비 브리프, 촬영 체크리스트를 한 화면에서 확인할 수 있어요.' : 'Open a scene to review the reference, prep brief, and shooting checklist in one workspace.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function RecipePrepSnapshot({
  copy,
  language,
  recipe,
}: {
  copy: DetailCopy;
  language: AppLanguage;
  recipe: MockRecipe;
}) {
  return (
    <View className="gap-3">
      <Text className="text-[16px] font-black text-ink">{copy.prepSnapshot}</Text>
      <View className="flex-row flex-wrap gap-2">
        {getRecipePrepItems(language, recipe).map((item) => (
          <View key={item.label} style={styles.prepChip}>
            <MaterialCommunityIcons color="#8c67ff" name={item.icon} size={16} />
            <View className="min-w-0 flex-1">
              <Text className="text-[10px] font-black text-muted">{item.label}</Text>
              <Text className="text-[12px] font-black leading-4 text-ink" numberOfLines={2}>
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View className="rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3">
        <Text className="text-[12px] font-black text-amber-900">{copy.brandNotes}</Text>
        <Text className="mt-1 text-[12px] font-semibold leading-5 text-amber-900/80">
          {getRecipeBrandNote(language, recipe)}
        </Text>
      </View>
    </View>
  );
}

function SceneTimelineCard({
  copy,
  language,
  onOpen,
  onShoot,
  scene,
  sceneIndex,
  totalScenes,
}: {
  copy: DetailCopy;
  language: AppLanguage;
  onOpen: () => void;
  onShoot: () => void;
  scene: NativeRecipeScene;
  sceneIndex: number;
  totalScenes: number;
}) {
  const role = getSceneRoleLabel(language, sceneIndex, totalScenes);
  const summary = getSceneCardSummary(scene);

  return (
    <View className="overflow-hidden rounded-[24px] border border-stroke bg-surface">
      <View className="flex-row gap-3 p-3">
        <Pressable className="overflow-hidden rounded-[18px]" onPress={onOpen} style={styles.timelineThumb}>
          <ImageBackground resizeMode="cover" source={{ uri: scene.thumbnail }} style={styles.timelineThumb}>
            <LinearGradient
              colors={['rgba(15,23,42,0)', 'rgba(15,23,42,0.72)']}
              style={StyleSheet.absoluteFill}
            />
            <View className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-1">
              <Text className="text-[10px] font-black text-white">#{scene.sceneNumber}</Text>
            </View>
            <View className="absolute bottom-2 left-2 right-2 rounded-full bg-white/90 px-2 py-1">
              <Text className="text-center text-[10px] font-black text-ink">{getSceneDuration(scene)}</Text>
            </View>
          </ImageBackground>
        </Pressable>

        <View className="min-w-0 flex-1 gap-2">
          <View className="flex-row items-center gap-2">
            <View style={[styles.roleDot, { backgroundColor: getStructureColor(sceneIndex) }]} />
            <Text className="text-[11px] font-black uppercase tracking-[1px] text-violet">
              {role}
            </Text>
          </View>
          <Text className="text-[16px] font-black leading-[20px] text-ink" numberOfLines={2}>
            {summary}
          </Text>
          <Text className="text-[12px] font-semibold leading-5 text-muted" numberOfLines={2}>
            {scene.recipe.keyAction || scene.analysis.motionDescription || scene.summary}
          </Text>
          <Text className="text-[12px] font-black leading-5 text-ink" numberOfLines={2}>
            "{getPrimaryPrompterLine(scene)}"
          </Text>

          <View className="flex-row gap-2 pt-1">
            <Pressable
              accessibilityRole="button"
              className="flex-1 rounded-full border border-stroke bg-canvas px-3 py-2.5"
              onPress={onOpen}
            >
              <Text className="text-center text-[11px] font-black text-ink">{copy.openScene}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" className="flex-1 overflow-hidden rounded-full" onPress={onShoot}>
              <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.timelineShootButton}>
                <MaterialCommunityIcons color="#fff" name="camera-outline" size={14} />
                <Text className="text-[11px] font-black text-white">{copy.startScene}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function SceneWatchPanel({
  copy,
  language,
  scene,
  sceneIndex,
  totalScenes,
}: {
  copy: DetailCopy;
  language: AppLanguage;
  scene: NativeRecipeScene;
  sceneIndex: number;
  totalScenes: number;
}) {
  const role = getSceneRoleLabel(language, sceneIndex, totalScenes);
  const whyLines = scene.analysis.whyItWorks.length ? scene.analysis.whyItWorks.slice(0, 3) : [scene.analysis.motionDescription || scene.summary || scene.recipe.objective];

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-[12px] font-black text-muted">{copy.referenceVideo}</Text>
        <ImageBackground imageStyle={{ borderRadius: 24 }} resizeMode="cover" source={{ uri: scene.thumbnail }} style={styles.referencePlayer}>
          <LinearGradient
            colors={['rgba(15,23,42,0.05)', 'rgba(15,23,42,0.78)']}
            style={StyleSheet.absoluteFill}
          />
          <View className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5">
            <Text className="text-[11px] font-black text-white">#{scene.sceneNumber} · {role}</Text>
          </View>
          <View className="items-center justify-center">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-white/90">
              <MaterialCommunityIcons color="#111827" name="play" size={30} />
            </View>
          </View>
          <View className="absolute bottom-4 left-4 right-4">
            <View className="h-1.5 overflow-hidden rounded-full bg-white/25">
              <View style={[styles.referenceProgress, { width: `${Math.min(100, ((sceneIndex + 1) / totalScenes) * 100)}%` }]} />
            </View>
            <Text className="mt-2 text-[11px] font-black text-white/85">{getSceneDuration(scene)}</Text>
          </View>
        </ImageBackground>
      </View>

      <InsightBlock
        icon="chart-timeline-variant"
        lines={whyLines}
        title={copy.whyThisWorks}
      />

      <View className="flex-row gap-3">
        <MiniBriefCard
          icon="content-copy"
          title={copy.copyThis}
          value={scene.recipe.keyAction || scene.recipe.objective}
        />
        <MiniBriefCard
          icon="alert-circle-outline"
          title={copy.avoidThis}
          value={getAvoidLine(language, scene)}
        />
      </View>
    </View>
  );
}

function ScenePlanPanel({
  copy,
  language,
  recipe,
  scene,
  sceneIndex,
  totalScenes,
}: {
  copy: DetailCopy;
  language: AppLanguage;
  recipe: { notes: string };
  scene: NativeRecipeScene;
  sceneIndex: number;
  totalScenes: number;
}) {
  const role = getSceneRoleLabel(language, sceneIndex, totalScenes);
  const prompterLines = [getPrimaryPrompterLine(scene), ...scene.recipe.scriptLines.slice(1, 3)]
    .filter(Boolean)
    .slice(0, 3);

  return (
    <View className="gap-4">
      <View className="rounded-[24px] border border-violet/25 bg-violet/5 px-4 py-4">
        <Text className="text-[12px] font-black text-violet">#{scene.sceneNumber} · {role}</Text>
        <Text className="mt-2 text-[24px] font-black leading-[30px] text-ink">
          {scene.recipe.keyLine || scene.recipe.appealPoint}
        </Text>
        <Text className="mt-2 text-[13px] font-semibold leading-5 text-muted">
          {scene.recipe.keyMood || (language === 'ko' ? '자연스럽고 확신 있게' : 'Natural, confident, and ready to shoot.')}
        </Text>
      </View>

      <PlanRow icon="target" title={copy.sceneGoal} value={scene.recipe.objective || scene.summary || scene.title} />
      <PlanRow icon="gesture-tap" title={copy.creatorDirection} value={scene.recipe.keyAction || scene.analysis.motionDescription || scene.title} />
      <PlanRow icon="script-text-outline" title={copy.prompterLines} value={prompterLines.join('\n')} />
      <PlanRow icon="closed-caption-outline" title={copy.onScreenText} value={getOnScreenText(language, scene)} />
      <PlanRow icon="shield-check-outline" title={copy.brandNotes} value={getSceneBrandNote(language, recipe.notes)} />

      <View className="gap-2">
        <Text className="text-[12px] font-black text-muted">{copy.toneVariants}</Text>
        <View className="flex-row flex-wrap gap-2">
          {getToneVariants(language).map((variant) => (
            <View className="rounded-full bg-slate-100 px-3 py-2" key={variant}>
              <Text className="text-[11px] font-black text-slate-700">{variant}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function SceneShootPanel({
  copy,
  language,
  onStart,
  scene,
  sceneIndex,
  totalScenes,
}: {
  copy: DetailCopy;
  language: AppLanguage;
  onStart: () => void;
  scene: NativeRecipeScene;
  sceneIndex: number;
  totalScenes: number;
}) {
  return (
    <View className="gap-4">
      <View className="rounded-[24px] border border-stroke bg-surface px-4 py-4">
        <Text className="text-[12px] font-black text-violet">
          Scene {scene.sceneNumber}/{totalScenes} · {getSceneRoleLabel(language, sceneIndex, totalScenes)} · {getSceneDuration(scene)}
        </Text>
        <Text className="mt-2 text-[20px] font-black leading-[26px] text-ink">
          {copy.say}
        </Text>
        <Text className="mt-2 text-[24px] font-black leading-[31px] text-ink">
          "{getPrimaryPrompterLine(scene)}"
        </Text>
      </View>

      <View className="gap-3">
        <Text className="text-[12px] font-black text-muted">{copy.shotGuide}</Text>
        <View className="flex-row flex-wrap gap-2">
          <ShotGuidePill icon="camera-outline" label={copy.cameraAngle} value={getCameraGuide(language, sceneIndex)} />
          <ShotGuidePill icon="white-balance-sunny" label={copy.lighting} value={language === 'ko' ? '자연광 + 보조등' : 'Natural light + soft fill'} />
          <ShotGuidePill icon="cube-outline" label={copy.productCue} value={getProductCue(language, sceneIndex)} />
        </View>
      </View>

      <InsightBlock
        icon="check-circle-outline"
        lines={getShootChecklist(language, scene, sceneIndex)}
        title={copy.checklist}
      />

      <View className="flex-row gap-3">
        <MiniBriefCard icon="eye-outline" title={copy.show} value={scene.recipe.keyAction || scene.analysis.motionDescription || scene.summary || scene.title} />
        <MiniBriefCard icon="close-octagon-outline" title={copy.avoid} value={getAvoidLine(language, scene)} />
      </View>

      <Pressable accessibilityRole="button" className="overflow-hidden rounded-full" onPress={onStart}>
        <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.workspaceStartButton}>
          <MaterialCommunityIcons color="#fff" name="camera-outline" size={20} />
          <Text className="text-[15px] font-black text-white">{copy.startShooting}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

function InsightBlock({
  icon,
  lines,
  title,
}: {
  icon: IconName;
  lines: string[];
  title: string;
}) {
  return (
    <View className="rounded-[24px] border border-stroke bg-surface px-4 py-4">
      <View className="mb-3 flex-row items-center gap-2">
        <MaterialCommunityIcons color="#8c67ff" name={icon} size={18} />
        <Text className="text-[13px] font-black text-ink">{title}</Text>
      </View>
      <View className="gap-2">
        {lines.filter(Boolean).map((line, index) => (
          <View className="flex-row gap-2" key={`${title}-${index}`}>
            <Text className="text-[12px] font-black text-violet">✓</Text>
            <Text className="flex-1 text-[13px] font-semibold leading-5 text-slate-700">{line}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MiniBriefCard({
  icon,
  title,
  value,
}: {
  icon: IconName;
  title: string;
  value: string;
}) {
  return (
    <View className="min-w-0 flex-1 rounded-[20px] border border-stroke bg-surface px-3 py-3">
      <MaterialCommunityIcons color="#8c67ff" name={icon} size={18} />
      <Text className="mt-2 text-[11px] font-black text-muted">{title}</Text>
      <Text className="mt-1 text-[12px] font-black leading-5 text-ink" numberOfLines={4}>
        {value}
      </Text>
    </View>
  );
}

function PlanRow({
  icon,
  title,
  value,
}: {
  icon: IconName;
  title: string;
  value: string;
}) {
  return (
    <View className="flex-row gap-3 rounded-[22px] border border-stroke bg-surface px-4 py-4">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-violet/10">
        <MaterialCommunityIcons color="#8c67ff" name={icon} size={18} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[12px] font-black text-muted">{title}</Text>
        <Text className="mt-1 text-[13px] font-semibold leading-5 text-ink">{value}</Text>
      </View>
    </View>
  );
}

function ShotGuidePill({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) {
  return (
    <View className="min-w-[47%] flex-1 rounded-[18px] bg-slate-100 px-3 py-3">
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons color="#64748b" name={icon} size={16} />
        <Text className="text-[10px] font-black text-muted">{label}</Text>
      </View>
      <Text className="mt-1 text-[12px] font-black text-ink">{value}</Text>
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

function getTabLabel(language: AppLanguage, tab: DetailTab) {
  if (language === 'ko') {
    return tab === 'analysis' ? '예시' : tab === 'recipe' ? '준비' : '촬영';
  }

  return tab === 'analysis' ? 'Watch' : tab === 'recipe' ? 'Plan' : 'Shoot';
}

function isDetailTab(value: string): value is DetailTab {
  return value === 'analysis' || value === 'recipe' || value === 'shoot';
}

function getSceneRoleLabel(language: AppLanguage, sceneIndex: number, totalScenes: number) {
  if (sceneIndex === 0) return language === 'ko' ? 'Hook' : 'Hook';
  if (sceneIndex === totalScenes - 1) return language === 'ko' ? 'CTA' : 'CTA';
  return language === 'ko' ? 'Proof' : 'Proof';
}

function getSceneDuration(scene: NativeRecipeScene) {
  return `${scene.startTime}-${scene.endTime}`;
}

function getPrimaryPrompterLine(scene: NativeRecipeScene) {
  return (
    scene.recipe.keyLine.trim()
    || scene.prompter.blocks.find((block) => block.type === 'key_line')?.content.trim()
    || scene.recipe.scriptLines[0]?.trim()
    || scene.recipe.appealPoint.trim()
    || scene.title
  );
}

function getNextLine(scene: NativeRecipeScene) {
  return (
    scene.prompter.blocks.find((block) => block.type === 'action')?.content.trim()
    || scene.recipe.keyAction.trim()
    || scene.recipe.scriptLines[1]?.trim()
    || scene.analysis.motionDescription?.trim()
    || scene.title
  );
}

function getAvoidLine(language: AppLanguage, scene: NativeRecipeScene) {
  return (
    scene.recipe.mustAvoid[0]
    || (language === 'ko' ? '제품 설명부터 시작하지 않기' : 'Do not start by explaining the product.')
  );
}

function getOnScreenText(language: AppLanguage, scene: NativeRecipeScene) {
  if (scene.recipe.cta) {
    return scene.recipe.cta;
  }

  if (scene.sceneNumber === 1) {
    return language === 'ko' ? 'Finished look first' : 'Finished look first';
  }

  return scene.recipe.appealPoint || scene.title;
}

function getRecipePrepItems(language: AppLanguage, recipe: MockRecipe): Array<{ icon: IconName; label: string; value: string }> {
  if (language === 'ko') {
    return [
      { icon: 'clock-outline', label: '예상 시간', value: `${Math.max(12, recipe.totalSceneCount * 5)}분` },
      { icon: 'map-marker-outline', label: '장소', value: recipe.niche === 'Beauty' ? '자연광 거울 앞' : '집/작업 공간' },
      { icon: 'face-woman-outline', label: '얼굴 노출', value: recipe.niche === 'Beauty' ? '권장' : '선택' },
      { icon: 'cube-outline', label: '제품 등장', value: '2씬 이후' },
    ];
  }

  return [
    { icon: 'clock-outline', label: 'Shoot time', value: `${Math.max(12, recipe.totalSceneCount * 5)} min` },
    { icon: 'map-marker-outline', label: 'Location', value: recipe.niche === 'Beauty' ? 'Window light mirror' : 'Home setup' },
    { icon: 'face-woman-outline', label: 'Face on camera', value: recipe.niche === 'Beauty' ? 'Recommended' : 'Optional' },
    { icon: 'cube-outline', label: 'Product reveal', value: 'After scene 1' },
  ];
}

function getRecipeBrandNote(language: AppLanguage, recipe: MockRecipe) {
  if (language === 'ko') {
    return recipe.niche === 'Beauty'
      ? '제품명은 2씬 이후 노출. 과장된 효능 표현은 피하고 텍스처/전후 맥락을 보여주세요.'
      : '광고처럼 들리지 않게 실제 루틴 맥락에서 보여주고, 결과를 먼저 증명하세요.';
  }

  return recipe.niche === 'Beauty'
    ? 'Reveal the product after scene 1. Avoid exaggerated claims; show texture and before/after context.'
    : 'Keep it inside a real routine, not an ad. Prove the result before explaining the product.';
}

function getSceneBrandNote(language: AppLanguage, recipeNotes: string) {
  if (recipeNotes.trim()) {
    return recipeNotes;
  }

  return language === 'ko'
    ? '브랜드명/제품명은 자연스럽게, 효능 과장은 피하고 실제 사용 맥락을 보여주세요.'
    : 'Mention the brand naturally, avoid hard claims, and keep the shot grounded in real use.';
}

function getToneVariants(language: AppLanguage) {
  return language === 'ko'
    ? ['자연스럽게', '후킹 세게', '브랜드톤', '짧게']
    : ['Natural', 'Punchier', 'Brand-safe', 'Shorter'];
}

function getShootChecklist(language: AppLanguage, scene: NativeRecipeScene, sceneIndex: number) {
  const base = language === 'ko'
    ? [
        '말할 문장을 한 번 소리 내서 읽기',
        sceneIndex === 0 ? '제품을 바로 보여주지 않기' : '제품/소품을 프레임 가까이에 두기',
        '컷 끝에서 1초 멈추기',
      ]
    : [
        'Read the line once before recording.',
        sceneIndex === 0 ? 'Do not reveal the product too early.' : 'Keep product or prop within reach.',
        'Hold the final beat for one second.',
      ];

  if (scene.recipe.mustInclude[0]) {
    return [scene.recipe.mustInclude[0], ...base].slice(0, 4);
  }

  return base;
}

function getCameraGuide(language: AppLanguage, sceneIndex: number) {
  if (language === 'ko') {
    return sceneIndex === 0 ? '정면 클로즈업' : '손/제품 클로즈업';
  }

  return sceneIndex === 0 ? 'Front close-up' : 'Hand/product close-up';
}

function getProductCue(language: AppLanguage, sceneIndex: number) {
  if (language === 'ko') {
    return sceneIndex === 0 ? '아직 숨기기' : '프레임 안에 등장';
  }

  return sceneIndex === 0 ? 'Keep hidden' : 'Bring into frame';
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
  executionFlowCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  executionStartButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
  },
  executionTag: {
    backgroundColor: '#f3f0ff',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  executionTagText: {
    color: '#6d4df2',
    fontSize: 10,
    fontWeight: '900',
  },
  executionThumb: {
    borderRadius: 20,
    height: 112,
    overflow: 'hidden',
    width: 84,
  },
  executionThumbImage: {
    borderRadius: 20,
  },
  flowNode: {
    alignItems: 'center',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  prepChip: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 58,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '48%',
  },
  referencePlayer: {
    height: 210,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  referenceProgress: {
    backgroundColor: '#a78bfa',
    borderRadius: 999,
    height: '100%',
  },
  roleDot: {
    borderRadius: 999,
    height: 8,
    width: 8,
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
  timelineShootButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 10,
  },
  timelineThumb: {
    height: 148,
    width: 88,
  },
  structureMarker: {
    borderRadius: 999,
    height: 18,
    width: 4,
  },
  workspaceStartButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 18,
  },
});
