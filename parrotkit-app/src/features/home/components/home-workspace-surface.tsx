import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type DimensionValue,
} from 'react-native';

import {
  formatSceneCount,
  formatShotProgress,
  localizeActivityLabel,
  type AppLanguage,
  useAppLanguage,
} from '@/core/i18n/app-language';
import type { MockRecipe } from '@/core/mocks/parrotkit-data';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { getShootBoardHref } from '@/features/recipes/lib/shoot-board-model';

type HomeCopy = ReturnType<typeof useAppLanguage>['copy']['home'];

export function HomeWorkspaceSurface() {
  const router = useRouter();
  const { copy, language } = useAppLanguage();
  const homeCopy = copy.home;
  const {
    getContinueShootRecipe,
    getLatestShootableRecipe,
    recipes,
  } = useMockWorkspace();
  const continueRecipe = getContinueShootRecipe();
  const latestRecipe = continueRecipe ? null : getLatestShootableRecipe();
  const heroRecipe = continueRecipe ?? latestRecipe;
  const quickStartRecipes = recipes.filter((recipe) => recipe.id !== heroRecipe?.id).slice(0, 6);
  const recentRecipes = recipes.slice(0, 3);

  const openPrompter = (recipe: MockRecipe) => {
    router.push(getShootBoardHref(recipe.id) as Href);
  };

  const openRecipe = (recipe: MockRecipe) => {
    router.push(getShootBoardHref(recipe.id) as Href);
  };

  return (
    <View className="flex-1 bg-canvas">
      <AppScreenScrollView>
        <View className="gap-7 px-5">
          <View className="gap-1.5">
            <Text className="text-[30px] font-black leading-[34px] text-ink">
              {homeCopy.welcomeTitle}
            </Text>
            <Text className="text-[15px] font-semibold leading-6 text-muted">
              {homeCopy.welcomeSubtitle}
            </Text>
          </View>

          {heroRecipe ? (
            <ContinueRecipePanel
              copy={homeCopy}
              language={language}
              onOpenRecipe={() => openRecipe(heroRecipe)}
              onPrimary={() => openPrompter(heroRecipe)}
              onViewAll={() => router.push('/recipes' as Href)}
              recipe={heroRecipe}
            />
          ) : (
            <EmptyContinuePanel copy={homeCopy} onQuickShoot={() => router.push('/quick-shoot' as Href)} />
          )}

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[18px] font-black text-ink">{homeCopy.quickStartSection}</Text>
              <Text
                className="text-[13px] font-bold text-violet"
                onPress={() => router.push('/recipes' as Href)}
              >
                {homeCopy.edit}
              </Text>
            </View>

            {quickStartRecipes.length > 0 ? (
              <ScrollView
                horizontal
                contentContainerStyle={styles.quickRail}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
              >
                {quickStartRecipes.map((recipe) => (
                  <QuickRecipeTile
                    copy={homeCopy}
                    key={recipe.id}
                    language={language}
                    onPress={() => openPrompter(recipe)}
                    recipe={recipe}
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="rounded-[24px] border border-dashed border-stroke bg-surface px-5 py-8">
                <Text className="text-[16px] font-black text-ink">{homeCopy.emptyTitle}</Text>
                <Text className="mt-2 text-sm leading-6 text-muted">{homeCopy.emptyBody}</Text>
              </View>
            )}
          </View>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[18px] font-black text-ink">{homeCopy.recentSection}</Text>
              <Text
                className="text-[13px] font-bold text-violet"
                onPress={() => router.push('/recipes' as Href)}
              >
                {homeCopy.viewAll}
              </Text>
            </View>

            <View style={styles.recentList}>
              {recentRecipes.map((recipe) => (
                <RecentRecipeRow
                  key={recipe.id}
                  language={language}
                  onOpen={() => openRecipe(recipe)}
                  onPrimary={() => openPrompter(recipe)}
                  recipe={recipe}
                />
              ))}
            </View>
          </View>
        </View>
      </AppScreenScrollView>
    </View>
  );
}

function ContinueRecipePanel({
  copy,
  language,
  onOpenRecipe,
  onPrimary,
  onViewAll,
  recipe,
}: {
  copy: HomeCopy;
  language: AppLanguage;
  onOpenRecipe: () => void;
  onPrimary: () => void;
  onViewAll: () => void;
  recipe: MockRecipe;
}) {
  const progressRatio = recipe.totalSceneCount > 0 ? recipe.shotSceneCount / recipe.totalSceneCount : 0;
  const progressPercent = Math.max(10, Math.min(100, Math.round(progressRatio * 100)));
  const progressWidth: DimensionValue = `${progressPercent}%`;
  const activityLabel = localizeActivityLabel(language, recipe.lastShotAt ?? recipe.savedAt);

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-[18px] font-black text-ink">{copy.continueSection}</Text>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onViewAll}>
          <Text className="text-[13px] font-bold text-violet">{copy.viewAll}</Text>
        </Pressable>
      </View>

      <View style={styles.continueCard}>
        <Pressable accessibilityRole="button" className="flex-row gap-3" onPress={onOpenRecipe}>
          <Image source={{ uri: recipe.thumbnail }} style={styles.continueImage} />
          <View className="flex-1 justify-center gap-1.5">
            <Text className="text-[17px] font-black leading-[21px] text-ink" numberOfLines={2}>
              {recipe.title || copy.continueTitleFallback}
            </Text>
            <Text className="text-[13px] font-bold text-muted" numberOfLines={1}>
              {recipe.ownerHandle} · {formatShotProgress(language, recipe.shotSceneCount, recipe.totalSceneCount)}
            </Text>
            {activityLabel ? (
              <Text className="text-[12px] font-semibold text-slate-400" numberOfLines={1}>
                {activityLabel}
              </Text>
            ) : null}
          </View>
          <View className="items-center justify-center">
            <MaterialCommunityIcons color="#64748b" name="chevron-right" size={24} />
          </View>
        </Pressable>

        <View style={styles.progressTrack}>
          <LinearGradient
            colors={brandActionGradient}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>

        <Pressable accessibilityRole="button" onPress={onPrimary} style={styles.continueButton}>
          <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.continueButtonGradient}>
            <MaterialCommunityIcons color="#fff" name="play" size={18} />
            <Text className="text-[14px] font-black text-white">{copy.continueAction}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function EmptyContinuePanel({ copy, onQuickShoot }: { copy: HomeCopy; onQuickShoot: () => void }) {
  return (
    <LinearGradient colors={['#fff7ed', '#f8fbff']} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.emptyPanel}>
      <View className="gap-4">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
          <MaterialCommunityIcons color="#ff9568" name="video-plus-outline" size={25} />
        </View>
        <View className="gap-2">
          <Text className="text-[26px] font-black leading-[31px] text-ink">{copy.emptyTitle}</Text>
          <Text className="text-sm font-semibold leading-6 text-muted">{copy.emptyBody}</Text>
        </View>
        <Pressable accessibilityRole="button" className="self-start rounded-full bg-slate-950 px-5 py-3" onPress={onQuickShoot}>
          <Text className="text-sm font-black text-white">{copy.emptyAction}</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

function QuickRecipeTile({
  copy,
  language,
  onPress,
  recipe,
}: {
  copy: HomeCopy;
  language: AppLanguage;
  onPress: () => void;
  recipe: MockRecipe;
}) {
  const statusLabel = getRecipeStatusLabel(copy, recipe);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.quickTile}>
      <ImageBackground
        imageStyle={styles.quickTileImage}
        resizeMode="cover"
        source={{ uri: recipe.thumbnail }}
        style={styles.quickTileBackground}
      >
        <LinearGradient
          colors={['rgba(15,23,42,0.03)', 'rgba(15,23,42,0.86)']}
          end={{ x: 0.5, y: 1 }}
          start={{ x: 0.5, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View className="flex-row">
          <View style={styles.tileBadge}>
            <MaterialCommunityIcons color="#fff" name="check-decagram" size={11} />
            <Text className="text-[9px] font-black text-white">{statusLabel}</Text>
          </View>
        </View>
        <View className="mt-auto gap-1.5">
          <Text className="text-[14px] font-black leading-[17px] text-white" numberOfLines={2}>
            {recipe.title}
          </Text>
          <View className="flex-row items-center justify-between gap-2">
            <Text className="flex-1 text-[11px] font-bold text-white/82" numberOfLines={1}>
              {formatSceneCount(language, recipe.totalSceneCount)}
            </Text>
            <View style={styles.tilePlay}>
              <MaterialCommunityIcons color="#fff" name="play" size={14} />
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

function RecentRecipeRow({
  language,
  onOpen,
  onPrimary,
  recipe,
}: {
  language: AppLanguage;
  onOpen: () => void;
  onPrimary: () => void;
  recipe: MockRecipe;
}) {
  const activityLabel = localizeActivityLabel(language, recipe.lastShotAt ?? recipe.savedAt);

  return (
    <Pressable accessibilityRole="button" className="flex-row items-center gap-3 py-3" onPress={onOpen}>
      <Image source={{ uri: recipe.thumbnail }} style={styles.recentImage} />
      <View className="flex-1 gap-1">
        <Text className="text-[16px] font-black leading-5 text-ink" numberOfLines={2}>
          {recipe.title}
        </Text>
        <Text className="text-[12px] font-bold text-muted" numberOfLines={1}>
          {recipe.ownerHandle} · {formatSceneCount(language, recipe.totalSceneCount)}
        </Text>
        {activityLabel ? (
          <Text className="text-[12px] font-semibold text-slate-400" numberOfLines={1}>
            {activityLabel}
          </Text>
        ) : null}
      </View>
      <Pressable accessibilityRole="button" hitSlop={8} onPress={onPrimary} style={styles.recentPlay}>
        <MaterialCommunityIcons color="#111827" name="play" size={18} />
      </Pressable>
    </Pressable>
  );
}

function getRecipeStatusLabel(copy: HomeCopy, recipe: MockRecipe) {
  if (recipe.shootStatus === 'continue') {
    return copy.statusInProgress;
  }

  if (recipe.ownership === 'downloaded') {
    return copy.statusDownloaded;
  }

  return recipe.shootStatus === 'ready' ? copy.readyStatus : copy.statusOwned;
}

const styles = StyleSheet.create({
  continueButton: {
    alignSelf: 'flex-end',
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 7,
    minHeight: 46,
    paddingHorizontal: 17,
    paddingVertical: 12,
  },
  continueCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
  },
  continueImage: {
    backgroundColor: '#f1f5f9',
    borderRadius: 18,
    height: 92,
    width: 92,
  },
  emptyPanel: {
    borderColor: '#fed7aa',
    borderRadius: 26,
    borderWidth: 1,
    padding: 20,
  },
  progressFill: {
    borderRadius: 999,
    height: 5,
  },
  progressTrack: {
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    height: 5,
    overflow: 'hidden',
  },
  quickRail: {
    gap: 10,
    paddingRight: 20,
  },
  quickTile: {
    borderRadius: 20,
    height: 188,
    overflow: 'hidden',
    width: 132,
  },
  quickTileBackground: {
    flex: 1,
    padding: 10,
  },
  quickTileImage: {
    borderRadius: 20,
  },
  recentImage: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    height: 68,
    width: 68,
  },
  recentList: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
  },
  recentPlay: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 999,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  tileBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(15, 23, 42, 0.68)',
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  tilePlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 999,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
});
