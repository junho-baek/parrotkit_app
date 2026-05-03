import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentProps, useMemo } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage, type AppLanguage } from '@/core/i18n/app-language';
import type { MockRecipe, MockRecipeScene } from '@/core/mocks/parrotkit-data';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { isVerifiedCreatorRecipe } from '@/features/recipes/lib/recipe-ownership';
import { getShootBoardHref } from '@/features/recipes/lib/shoot-board-model';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const previewCopy = {
  en: {
    back: 'Back',
    partnerCreator: 'Partner Creator',
    communityRecipe: 'Community Recipe',
    verified: 'Verified',
    keyHook: 'Key Hook',
    included: 'Included',
    structurePreview: 'Structure Preview',
    creatorNotes: 'Creator notes',
    save: 'Save',
    saved: 'Saved',
    startShooting: 'Start Shooting',
    saves: 'saves',
    views: 'views',
    scenes: 'scenes',
    notFound: 'Recipe not found',
    notFoundBody: 'This recipe may have moved from Explore.',
    includedItems: [
      { icon: 'play-box-outline' as IconName, label: 'Reference breakdown' },
      { icon: 'format-list-checks' as IconName, label: 'Shot list' },
      { icon: 'script-text-outline' as IconName, label: 'Script prompts' },
      { icon: 'camera-iris' as IconName, label: 'Prompter mode' },
    ],
  },
  ko: {
    back: '뒤로',
    partnerCreator: '파트너 크리에이터',
    communityRecipe: '커뮤니티 레시피',
    verified: '인증됨',
    keyHook: '핵심 훅',
    included: '포함됨',
    structurePreview: '구성 미리보기',
    creatorNotes: '크리에이터 노트',
    save: '저장',
    saved: '저장됨',
    startShooting: '촬영 시작',
    saves: '저장',
    views: '조회',
    scenes: '씬',
    notFound: '레시피를 찾을 수 없어요',
    notFoundBody: '탐색 레시피가 이동했을 수 있어요.',
    includedItems: [
      { icon: 'play-box-outline' as IconName, label: '레퍼런스 분석' },
      { icon: 'format-list-checks' as IconName, label: '촬영 리스트' },
      { icon: 'script-text-outline' as IconName, label: '대본 프롬프트' },
      { icon: 'camera-iris' as IconName, label: '프롬프터 모드' },
    ],
  },
} satisfies Record<AppLanguage, {
  back: string;
  partnerCreator: string;
  communityRecipe: string;
  verified: string;
  keyHook: string;
  included: string;
  structurePreview: string;
  creatorNotes: string;
  save: string;
  saved: string;
  startShooting: string;
  saves: string;
  views: string;
  scenes: string;
  notFound: string;
  notFoundBody: string;
  includedItems: Array<{ icon: IconName; label: string }>;
}>;

export function ExploreRecipeDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ recipeId?: string }>();
  const { language } = useAppLanguage();
  const copy = previewCopy[language];
  const {
    downloadRecipe,
    getRecipeById,
    isRecipeDownloaded,
  } = useMockWorkspace();

  const recipe = params.recipeId ? getRecipeById(params.recipeId) : null;
  const firstScene = recipe?.scenes[0] ?? null;
  const keyHook = firstScene ? getPrimaryPrompterLine(firstScene) : recipe?.summary ?? '';
  const saved = recipe ? isRecipeDownloaded(recipe.id) || recipe.ownership === 'downloaded' : false;
  const tags = useMemo(() => (recipe ? getPreviewTags(language, recipe) : []), [language, recipe]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/explore' as Href);
  };

  const ensureSavedRecipe = () => {
    if (!recipe) {
      return null;
    }

    if (recipe.ownership === 'downloaded' || recipe.ownership === 'owned' || recipe.id.startsWith('downloaded-')) {
      return recipe;
    }

    return downloadRecipe(recipe.id) ?? recipe;
  };

  const handleSave = () => {
    ensureSavedRecipe();
  };

  const handleStartShooting = () => {
    const targetRecipe = ensureSavedRecipe();

    if (!targetRecipe) {
      return;
    }

    router.push(getShootBoardHref(targetRecipe.id) as Href);
  };

  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-6">
        <Text className="text-center text-[26px] font-black text-ink">{copy.notFound}</Text>
        <Text className="mt-2 text-center text-sm font-semibold leading-6 text-muted">{copy.notFoundBody}</Text>
        <Pressable className="mt-5 rounded-full bg-violet px-5 py-3" onPress={handleBack}>
          <Text className="text-sm font-bold text-white">{copy.back}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: Math.max(34, insets.bottom + 18) }}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          imageStyle={styles.heroImage}
          resizeMode="cover"
          source={{ uri: recipe.thumbnail }}
          style={styles.hero}
        >
          <LinearGradient
            colors={['rgba(15,23,42,0.06)', 'rgba(15,23,42,0.50)', 'rgba(15,23,42,0.94)']}
            locations={[0, 0.46, 1]}
            style={StyleSheet.absoluteFill}
          />

          <View className="flex-1 justify-between px-5 pb-5" style={{ paddingTop: insets.top + 10 }}>
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
                <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-black/35" onPress={handleSave}>
                  <MaterialCommunityIcons color="#fff" name={saved ? 'bookmark' : 'bookmark-outline'} size={20} />
                </Pressable>
              </View>
            </View>

            <View className="gap-3">
              <View className="flex-row flex-wrap gap-2">
                <View style={styles.heroBadge}>
                  <Text className="text-[10px] font-black text-white">
                    {isVerifiedCreatorRecipe(recipe) ? copy.partnerCreator : copy.communityRecipe}
                  </Text>
                </View>
                {isVerifiedCreatorRecipe(recipe) ? (
                  <View style={styles.heroBadge}>
                    <MaterialCommunityIcons color="#fff" name="check-decagram" size={11} />
                    <Text className="text-[10px] font-black text-white">{copy.verified}</Text>
                  </View>
                ) : null}
              </View>

              <Text className="text-[29px] font-black leading-[34px] text-white" numberOfLines={2}>
                {getPreviewTitle(language, recipe)}
              </Text>
              <Text style={styles.heroSummary} numberOfLines={3}>
                {getPreviewSummary(language, recipe)}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <Text style={styles.heroMetaStrong}>{recipe.ownerHandle}</Text>
                <Text style={styles.heroMeta}>
                  ♡ {formatCompactMetric(recipe.downloadCount)} {copy.saves}
                </Text>
                <Text style={styles.heroMeta}>
                  ◦ {formatCompactMetric(recipe.downloadCount * 6)} {copy.views}
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-1.5">
                {tags.map((tag) => (
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
            <Text className="text-[17px] font-black leading-7 text-slate-800">
              "{keyHook}"
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-[16px] font-black text-ink">{copy.included}</Text>
            <View className="flex-row flex-wrap gap-2">
              {copy.includedItems.map((item) => (
                <View key={item.label} style={styles.includeChip}>
                  <MaterialCommunityIcons color="#8c67ff" name={item.icon} size={17} />
                  <Text className="text-[12px] font-black text-ink">{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[16px] font-black text-ink">{copy.structurePreview}</Text>
              <Text className="text-[12px] font-bold text-muted">
                {recipe.scenes.length} {copy.scenes} · 30s
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3 pr-5">
                {recipe.scenes.map((scene, index) => (
                  <StructurePreviewCard
                    key={scene.id}
                    language={language}
                    scene={scene}
                    sceneIndex={index}
                    totalScenes={recipe.scenes.length}
                  />
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.notesBox}>
            <Text className="text-[13px] font-black text-ink">{copy.creatorNotes}</Text>
            <Text className="mt-1 text-[13px] font-semibold leading-6 text-slate-700">
              {getCreatorNotes(language, recipe)}
            </Text>
          </View>

          <View className="flex-row gap-3 pt-1">
            <Pressable
              accessibilityRole="button"
              className="min-h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-full border border-stroke bg-surface"
              onPress={handleSave}
            >
              <MaterialCommunityIcons color="#111827" name={saved ? 'bookmark' : 'bookmark-outline'} size={18} />
              <Text className="text-[14px] font-black text-ink">{saved ? copy.saved : copy.save}</Text>
            </Pressable>

            <Pressable accessibilityRole="button" className="flex-[1.7] overflow-hidden rounded-full" onPress={handleStartShooting}>
              <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.startButton}>
                <MaterialCommunityIcons color="#fff" name="camera-outline" size={18} />
                <Text className="text-[14px] font-black text-white">{copy.startShooting}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StructurePreviewCard({
  language,
  scene,
  sceneIndex,
  totalScenes,
}: {
  language: AppLanguage;
  scene: MockRecipeScene;
  sceneIndex: number;
  totalScenes: number;
}) {
  return (
    <View style={styles.structureCard}>
      <View className="flex-row items-center gap-2">
        <View style={[styles.roleDot, { backgroundColor: getStructureColor(sceneIndex) }]} />
        <Text className="text-[10px] font-black uppercase text-violet">
          {getSceneRoleLabel(language, sceneIndex, totalScenes)}
        </Text>
      </View>
      <Text className="text-[15px] font-black leading-[19px] text-ink" numberOfLines={2}>
        {scene.title}
      </Text>
      <Text className="text-[12px] font-semibold leading-5 text-muted" numberOfLines={3}>
        {scene.summary}
      </Text>
      <View className="mt-auto rounded-full bg-slate-100 px-3 py-2">
        <Text className="text-center text-[11px] font-black text-slate-700">
          #{scene.sceneNumber ?? sceneIndex + 1} · {getSceneDuration(scene)}
        </Text>
      </View>
    </View>
  );
}

function formatCompactMetric(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  }

  return String(value);
}

function getPreviewTitle(language: AppLanguage, recipe: MockRecipe) {
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

function getPreviewSummary(language: AppLanguage, recipe: MockRecipe) {
  if (language === 'ko') {
    if (recipe.id.includes('beauty-proof-routine')) {
      return '완성된 결과를 먼저 보여주고, 제품은 두 번째 씬에서 자연스럽게 등장시키는 3씬 뷰티 UGC 레시피.';
    }

    if (recipe.id.includes('core-control-proof')) {
      return '잘못된 자세와 교정된 자세를 바로 비교해 신뢰를 만드는 3씬 피트니스 레시피.';
    }

    if (recipe.id.includes('founder-problem-hook')) {
      return '제품을 먼저 말하지 않고, 사용자가 겪는 문제부터 납득시키는 3씬 런칭 레시피.';
    }
  }

  return recipe.summary;
}

function getPreviewTags(language: AppLanguage, recipe: MockRecipe) {
  if (language === 'ko') {
    if (recipe.id.includes('beauty-proof-routine')) return ['뷰티', '제품 홍보', '전환', '30초'];
    if (recipe.id.includes('core-control-proof')) return ['피트니스', '자세 교정', '교육', '30초'];
    if (recipe.id.includes('founder-problem-hook')) return ['테크', '문제 훅', '런칭', '30초'];
  }

  if (recipe.id.includes('beauty-proof-routine')) return ['Beauty', 'Product Promo', 'Conversion', '30s'];
  if (recipe.id.includes('core-control-proof')) return ['Fitness', 'Form Check', 'Education', '30s'];
  if (recipe.id.includes('founder-problem-hook')) return ['Tech', 'Problem Hook', 'Launch', '30s'];

  return [recipe.niche, recipe.goal.split(' ').slice(0, 2).join(' '), '30s'];
}

function getCreatorNotes(language: AppLanguage, recipe: MockRecipe) {
  if (language === 'ko') {
    if (recipe.id.includes('beauty-proof-routine')) {
      return '제품명은 2씬 이후에만 노출하고, 과장된 효능 표현은 피하세요. 자연광과 피부 텍스처 클로즈업이 핵심입니다.';
    }

    if (recipe.id.includes('core-control-proof')) {
      return '카메라 각도를 유지한 채 잘못된 자세와 교정 자세를 비교하세요. 통증/치료 표현은 피하고 폼 체크로 말하세요.';
    }

    return '제품명보다 문제가 먼저 보이게 구성하세요. 기능 설명은 마지막에 짧게 붙이고, 현재 방식의 불편함을 구체적으로 보여주세요.';
  }

  if (recipe.id.includes('beauty-proof-routine')) {
    return 'Reveal the product after scene 2, avoid exaggerated claims, and use natural light with one texture close-up.';
  }

  if (recipe.id.includes('core-control-proof')) {
    return 'Keep the camera angle consistent, compare before/after form, and avoid medical or pain-cure language.';
  }

  return 'Lead with the specific problem before naming the product. Keep feature language short and visual.';
}

function getPrimaryPrompterLine(scene: MockRecipeScene) {
  return scene.recipe?.keyLine
    ?? scene.prompterLines[0]
    ?? scene.recipeLines[0]
    ?? scene.summary;
}

function getSceneDuration(scene: MockRecipeScene) {
  if (scene.startTime && scene.endTime) {
    return `${scene.startTime}-${scene.endTime}`;
  }

  return '10s';
}

function getSceneRoleLabel(language: AppLanguage, sceneIndex: number, totalScenes: number) {
  if (sceneIndex === 0) return language === 'ko' ? 'Hook' : 'Hook';
  if (sceneIndex === totalScenes - 1) return language === 'ko' ? 'CTA' : 'CTA';
  return language === 'ko' ? 'Proof' : 'Proof';
}

function getStructureColor(sceneIndex: number) {
  const colors = ['#ff6b8a', '#8c67ff', '#38bdf8'];
  return colors[sceneIndex % colors.length];
}

const styles = StyleSheet.create({
  hero: {
    height: 430,
    overflow: 'hidden',
  },
  heroBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  heroImage: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroMeta: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 12,
    fontWeight: '800',
  },
  heroMetaStrong: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  heroSummary: {
    color: 'rgba(255,255,255,0.80)',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
  },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  heroTagText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 10,
    fontWeight: '900',
  },
  includeChip: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 12,
    width: '48%',
  },
  notesBox: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  roleDot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  startButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  structureCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
    minHeight: 164,
    padding: 14,
    width: 156,
  },
});
