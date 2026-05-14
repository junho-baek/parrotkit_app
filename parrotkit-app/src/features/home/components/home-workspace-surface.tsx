import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import {
  Image,
  ImageBackground,
  Pressable,
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
import { toImageSource } from '@/core/ui/image-source';
import {
  getHomePrimaryCta,
  getHomePrimaryCtaDestination,
} from '@/features/home/lib/home-primary-cta';
import {
  getHomeOwnedRecipeCardEntries,
  getHomeOwnedRecipeCardsDestination,
  type HomeOwnedRecipeCardEntry,
} from '@/features/home/lib/home-owned-recipe-cards';
import { getHomeRecipeCreateEntry } from '@/features/home/lib/home-recipe-create-entry';
import {
  getHomeContinueWorkflowCard,
  getHomeContinueWorkflowEntry,
  getHomeContinueWorkflowHref,
  getHomeEmptyWorkflowFallback,
  type HomeContinueWorkflowCard,
  type HomeEmptyWorkflowFallback,
} from '@/features/home/lib/home-continue-workflow-card';
import { getHomeWorkflowSelection } from '@/features/home/lib/home-workflow-resolution';
import { getHomeWorkspaceSectionOrder } from '@/features/home/lib/home-workspace-sections';
import {
  getSavedTakeHomeDestination,
} from '@/features/recipes/lib/saved-take-home-access';
import type { SavedRecipeTakeRecord } from '@/features/recipes/lib/saved-take-storage';
import { getShootBoardHref } from '@/features/recipes/lib/shoot-board-model';

type HomeCopy = ReturnType<typeof useAppLanguage>['copy']['home'];

export function HomeWorkspaceSurface() {
  const router = useRouter();
  const { copy, language } = useAppLanguage();
  const homeCopy = copy.home;
  const {
    getSavedRecipeTakes,
    recipes,
  } = useMockWorkspace();
  const savedTakes = getSavedRecipeTakes();
  const workflowSelection = getHomeWorkflowSelection(recipes, { savedTakes });
  const continueWorkflowCard = getHomeContinueWorkflowCard({
    language,
    selection: workflowSelection,
  });
  const heroRecipe = continueWorkflowCard?.recipe ?? null;
  const recipeCards = getHomeOwnedRecipeCardEntries(recipes).slice(0, 6);
  const recentSavedTakes = savedTakes.slice(0, 4);
  const recipeCreateEntry = getHomeRecipeCreateEntry(language);
  const primaryCta = getHomePrimaryCta({
    hasContinueRecipe: Boolean(heroRecipe),
    language,
    recipeTitle: heroRecipe?.title,
  });
  const primaryCtaDestination = getHomePrimaryCtaDestination({
    createDestination: recipeCreateEntry.destination,
    recipeId: heroRecipe?.id,
  });
  const continueWorkflowEntry = getHomeContinueWorkflowEntry({
    createDestination: recipeCreateEntry.destination,
    savedTakes,
    selection: workflowSelection,
  });
  const continueWorkflowHref = getHomeContinueWorkflowHref(continueWorkflowEntry);
  const emptyWorkflowFallback = getHomeEmptyWorkflowFallback({
    createDestination: recipeCreateEntry.destination,
    language,
    selection: workflowSelection,
  });
  const sectionOrder = getHomeWorkspaceSectionOrder({
    hasContinueOrRecentRecipe: Boolean(heroRecipe),
    hasSavedTakes: recentSavedTakes.length > 0,
  });

  const openRecipe = (recipe: MockRecipe) => {
    router.push(getShootBoardHref(recipe.id) as Href);
  };

  const openSavedTake = (take: SavedRecipeTakeRecord) => {
    router.push(getSavedTakeHomeDestination(take) as Href);
  };

  const openSavedRecipeDestination = (destination: string) => {
    router.push(destination as Href);
  };

  return (
    <View className="flex-1 bg-canvas">
      <AppScreenScrollView>
        <View className="gap-7 px-5">
          {sectionOrder[0] === 'continueRecentRecipe' ? (
            continueWorkflowCard ? (
              <ContinueRecipePanel
                card={continueWorkflowCard}
                copy={homeCopy}
                language={language}
                onOpenRecipe={() => openRecipe(continueWorkflowCard.recipe)}
                onPrimary={() => router.push(continueWorkflowHref as Href)}
                onViewAll={() => router.push('/recipes' as Href)}
                recipe={continueWorkflowCard.recipe}
              />
            ) : (
              emptyWorkflowFallback ? (
                <EmptyContinuePanel
                  fallback={emptyWorkflowFallback}
                  onCreateRecipe={() => router.push(emptyWorkflowFallback.destination as Href)}
                />
              ) : null
            )
          ) : null}

          <View className="gap-1.5">
            <Text className="text-[30px] font-black leading-[34px] text-ink">
              {homeCopy.welcomeTitle}
            </Text>
            <Text className="text-[15px] font-semibold leading-6 text-muted">
              {homeCopy.welcomeSubtitle}
            </Text>
          </View>

          <PrimaryWorkflowCta
            actionLabel={primaryCta.actionLabel}
            body={primaryCta.body}
            onPress={() => router.push(primaryCtaDestination as Href)}
            title={primaryCta.title}
            workflowLabel={primaryCta.workflowLabel}
          />

          <BlankShootBoardEntry
            accessibilityLabel={recipeCreateEntry.accessibilityLabel}
            label={recipeCreateEntry.label}
            language={language}
            onPress={() => router.push(recipeCreateEntry.destination as Href)}
          />

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[18px] font-black text-ink">
                {language === 'ko' ? '내 레시피' : 'My recipes'}
              </Text>
              <Text
                className="text-[13px] font-bold text-violet"
                onPress={() => router.push(getHomeOwnedRecipeCardsDestination() as Href)}
              >
                {homeCopy.viewAll}
              </Text>
            </View>

            {recipeCards.length > 0 ? (
              <View style={styles.recipeCardGrid}>
                {recipeCards.map((entry) => (
                  <HomeRecipeCard
                    copy={homeCopy}
                    entry={entry}
                    key={entry.recipeId}
                    language={language}
                    onPress={() => openSavedRecipeDestination(entry.destination)}
                    onManage={() => openSavedRecipeDestination(entry.managementDestination)}
                    onStartFilming={() => openSavedRecipeDestination(entry.startFilmingDestination)}
                  />
                ))}
              </View>
            ) : (
              <View className="rounded-[24px] border border-dashed border-stroke bg-surface px-5 py-8">
                <Text className="text-[16px] font-black text-ink">{homeCopy.emptyTitle}</Text>
                <Text className="mt-2 text-sm leading-6 text-muted">{homeCopy.emptyBody}</Text>
              </View>
            )}
          </View>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[18px] font-black text-ink">
                {language === 'ko' ? '저장한 테이크' : 'Saved takes'}
              </Text>
              <Text className="text-[13px] font-bold text-muted">
                {language === 'ko' ? '로컬' : 'Local'}
              </Text>
            </View>

            {recentSavedTakes.length > 0 ? (
              <View style={styles.savedTakeList}>
                {recentSavedTakes.map((take) => (
                  <SavedTakeRow
                    key={take.takeId}
                    language={language}
                    onPress={() => openSavedTake(take)}
                    take={take}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.savedTakeEmpty}>
                <View style={styles.savedTakeEmptyIcon}>
                  <MaterialCommunityIcons color="#8c67ff" name="video-check-outline" size={21} />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-[15px] font-black text-ink">
                    {language === 'ko' ? '아직 저장한 테이크가 없어요' : 'No saved takes yet'}
                  </Text>
                  <Text className="mt-1 text-[13px] font-semibold leading-5 text-muted">
                    {language === 'ko'
                      ? '컷 카드에서 촬영을 마치면 여기에서 바로 다시 열 수 있어요.'
                      : 'Finish a cut-card recording, then reopen it from here.'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </AppScreenScrollView>
    </View>
  );
}

function BlankShootBoardEntry({
  accessibilityLabel,
  label,
  language,
  onPress,
}: {
  accessibilityLabel: string;
  label: string;
  language: AppLanguage;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.blankShootBoardEntry}
    >
      <View style={styles.blankShootBoardIcon}>
        <MaterialCommunityIcons color="#ff7a59" name="plus-box-outline" size={21} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[14px] font-black text-ink" numberOfLines={1}>
          {label}
        </Text>
        <Text className="mt-0.5 text-[12px] font-semibold text-muted" numberOfLines={1}>
          {language === 'ko' ? '빈 레시피로 시작' : 'Start with a blank recipe'}
        </Text>
      </View>
      <MaterialCommunityIcons color="#64748b" name="chevron-right" size={22} />
    </Pressable>
  );
}

function PrimaryWorkflowCta({
  actionLabel,
  body,
  onPress,
  title,
  workflowLabel,
}: {
  actionLabel: string;
  body: string;
  onPress: () => void;
  title: string;
  workflowLabel: string;
}) {
  return (
    <Pressable
      accessibilityLabel={`${workflowLabel}: ${title}`}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.primaryWorkflowCard}
    >
      <LinearGradient
        colors={['#111827', '#3b2f70']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.primaryWorkflowGradient}
      >
        <View className="min-w-0 flex-1 gap-2">
          <View style={styles.primaryWorkflowPill}>
            <MaterialCommunityIcons color="#c4b5fd" name="movie-open-play-outline" size={14} />
            <Text className="text-[11px] font-black uppercase text-violet-100" numberOfLines={1}>
              {workflowLabel}
            </Text>
          </View>
          <Text className="text-[20px] font-black leading-6 text-white" numberOfLines={2}>
            {title}
          </Text>
          <Text className="text-[13px] font-semibold leading-5 text-slate-200" numberOfLines={2}>
            {body}
          </Text>
        </View>
        <View style={styles.primaryWorkflowAction}>
          <Text className="text-[13px] font-black text-slate-950" numberOfLines={1}>
            {actionLabel}
          </Text>
          <MaterialCommunityIcons color="#111827" name="arrow-right" size={18} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function ContinueRecipePanel({
  copy,
  card,
  language,
  onOpenRecipe,
  onPrimary,
  onViewAll,
  recipe,
}: {
  card: HomeContinueWorkflowCard;
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
        <Text className="text-[18px] font-black text-ink">{card.sectionTitle || copy.continueSection}</Text>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onViewAll}>
          <Text className="text-[13px] font-bold text-violet">{copy.viewAll}</Text>
        </Pressable>
      </View>

      <View style={styles.continueCard}>
        <Pressable
          accessibilityLabel={card.accessibilityLabel}
          accessibilityRole="button"
          className="flex-row gap-3"
          onPress={onOpenRecipe}
        >
          <Image source={toImageSource(recipe.thumbnail)} style={styles.continueImage} />
          <View className="flex-1 justify-center gap-1.5">
            <Text className="text-[17px] font-black leading-[21px] text-ink" numberOfLines={2}>
              {card.title || copy.continueTitleFallback}
            </Text>
            <View style={styles.continueStatePill}>
              <MaterialCommunityIcons color="#6d28d9" name="progress-clock" size={13} />
              <Text className="text-[11px] font-black text-violet" numberOfLines={1}>
                {card.stateLabel}
              </Text>
            </View>
            <Text className="text-[13px] font-bold text-muted" numberOfLines={1}>
              {recipe.ownerHandle} · {card.supportingProgressLabel}
            </Text>
            <Text className="text-[12px] font-semibold leading-4 text-muted" numberOfLines={2}>
              {card.body}
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

        <Pressable
          accessibilityLabel={card.actionLabel}
          accessibilityRole="button"
          onPress={onPrimary}
          style={styles.continueButton}
        >
          <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.continueButtonGradient}>
            <MaterialCommunityIcons color="#fff" name="play" size={18} />
            <Text className="text-[14px] font-black text-white">{card.actionLabel}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function EmptyContinuePanel({
  fallback,
  onCreateRecipe,
}: {
  fallback: HomeEmptyWorkflowFallback;
  onCreateRecipe: () => void;
}) {
  return (
    <LinearGradient colors={['#fff7ed', '#f8fbff']} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.emptyPanel}>
      <View className="gap-4">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
          <MaterialCommunityIcons color="#ff9568" name="plus-box-outline" size={25} />
        </View>
        <View className="gap-2">
          <Text className="text-[26px] font-black leading-[31px] text-ink">{fallback.title}</Text>
          <Text className="text-sm font-semibold leading-6 text-muted">{fallback.body}</Text>
        </View>
        <Pressable accessibilityRole="button" className="self-start rounded-full bg-slate-950 px-5 py-3" onPress={onCreateRecipe}>
          <Text className="text-sm font-black text-white">{fallback.actionLabel}</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

function HomeRecipeCard({
  copy,
  entry,
  language,
  onManage,
  onPress,
  onStartFilming,
}: {
  copy: HomeCopy;
  entry: HomeOwnedRecipeCardEntry<MockRecipe>;
  language: AppLanguage;
  onManage: () => void;
  onPress: () => void;
  onStartFilming: () => void;
}) {
  const { recipe } = entry;
  const statusLabel = getRecipeStatusLabel(copy, recipe);
  const activityLabel = localizeActivityLabel(language, recipe.lastShotAt ?? recipe.savedAt);
  const progressRatio = recipe.totalSceneCount > 0 ? recipe.shotSceneCount / recipe.totalSceneCount : 0;
  const progressPercent = Math.max(8, Math.min(100, Math.round(progressRatio * 100)));
  const progressWidth: DimensionValue = `${progressPercent}%`;

  return (
    <View style={styles.recipeCard}>
      <Pressable accessibilityRole="button" onPress={onPress}>
        <ImageBackground
          imageStyle={styles.recipeCardImage}
          resizeMode="cover"
          source={toImageSource(recipe.thumbnail)}
          style={styles.recipeCardMedia}
        >
          <LinearGradient
            colors={['rgba(15,23,42,0.02)', 'rgba(15,23,42,0.72)']}
            end={{ x: 0.5, y: 1 }}
            start={{ x: 0.5, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View className="flex-row">
            <View style={styles.recipeCardBadge}>
              <MaterialCommunityIcons color="#fff" name="check-decagram" size={11} />
              <Text className="text-[9px] font-black text-white">{statusLabel}</Text>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
      <View className="gap-2.5 p-3">
        <Pressable accessibilityRole="button" onPress={onPress}>
          <Text className="text-[15px] font-black leading-[19px] text-ink" numberOfLines={2}>
            {recipe.title}
          </Text>
        </Pressable>
        <View className="gap-1.5">
          <Text className="text-[12px] font-bold text-muted" numberOfLines={1}>
            {formatShotProgress(language, recipe.shotSceneCount, recipe.totalSceneCount)}
          </Text>
          <View style={styles.recipeCardProgressTrack}>
            <LinearGradient
              colors={brandActionGradient}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={[styles.recipeCardProgressFill, { width: progressWidth }]}
            />
          </View>
        </View>
        {activityLabel ? (
          <Text className="text-[12px] font-semibold text-slate-400" numberOfLines={1}>
            {activityLabel}
          </Text>
        ) : null}
        <View className="flex-row items-center justify-between gap-2 pt-1">
          <Text className="flex-1 text-[12px] font-bold text-muted" numberOfLines={1}>
            {formatSceneCount(language, recipe.totalSceneCount)}
          </Text>
          <Pressable
            accessibilityLabel={language === 'ko' ? `${entry.recipeTitle} 관리` : `Manage ${entry.recipeTitle}`}
            accessibilityRole="button"
            onPress={onManage}
            style={styles.recipeCardManageButton}
          >
            <MaterialCommunityIcons color="#475569" name="cog-outline" size={14} />
            <Text className="text-[11px] font-black text-slate-600">
              {language === 'ko' ? '관리' : 'Manage'}
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel={language === 'ko' ? `${entry.recipeTitle} 촬영 시작` : `Start filming ${entry.recipeTitle}`}
            accessibilityRole="button"
            onPress={onStartFilming}
            style={styles.recipeCardStartButton}
          >
            <MaterialCommunityIcons color="#fff" name="camera-outline" size={14} />
            <Text className="text-[11px] font-black text-white">
              {language === 'ko' ? '촬영 시작' : 'Start filming'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function SavedTakeRow({
  language,
  onPress,
  take,
}: {
  language: AppLanguage;
  onPress: () => void;
  take: SavedRecipeTakeRecord;
}) {
  const primaryCard = take.cards[0];
  const title = primaryCard?.title || take.sceneTitle;
  const statusLabel = take.isFinalTake
    ? language === 'ko' ? 'Final' : 'Final'
    : language === 'ko' ? '저장됨' : 'Saved';

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.savedTakeRow}>
      <View style={styles.savedTakeIcon}>
        <MaterialCommunityIcons color="#111827" name="play-circle-outline" size={22} />
      </View>
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-[15px] font-black leading-5 text-ink" numberOfLines={1}>
          {take.recipeTitle}
        </Text>
        <Text className="text-[12px] font-bold text-muted" numberOfLines={1}>
          {language === 'ko' ? `컷 ${primaryCard?.order ?? ''}` : `Cut ${primaryCard?.order ?? ''}`} · {title}
        </Text>
      </View>
      <View className="items-end gap-1">
        <Text className="text-[11px] font-black text-violet" numberOfLines={1}>
          {take.label}
        </Text>
        <Text className="text-[11px] font-bold text-slate-400" numberOfLines={1}>
          {statusLabel}
        </Text>
      </View>
      <MaterialCommunityIcons color="#94a3b8" name="chevron-right" size={20} />
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
  blankShootBoardEntry: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  blankShootBoardIcon: {
    alignItems: 'center',
    backgroundColor: '#fff1eb',
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
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
  continueStatePill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    maxWidth: '100%',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  primaryWorkflowAction: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 14,
  },
  primaryWorkflowCard: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
  },
  primaryWorkflowGradient: {
    borderRadius: 22,
    gap: 15,
    padding: 18,
  },
  primaryWorkflowPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    maxWidth: '100%',
    paddingHorizontal: 9,
    paddingVertical: 5,
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
  recipeCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    width: '48.5%',
  },
  recipeCardBadge: {
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
  recipeCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  recipeCardImage: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  recipeCardManageButton: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    minHeight: 30,
    paddingHorizontal: 8,
  },
  recipeCardMedia: {
    height: 118,
    overflow: 'hidden',
    padding: 10,
  },
  recipeCardStartButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    minHeight: 30,
    justifyContent: 'center',
    paddingHorizontal: 9,
  },
  recipeCardProgressFill: {
    borderRadius: 999,
    height: 4,
  },
  recipeCardProgressTrack: {
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    height: 4,
    overflow: 'hidden',
  },
  savedTakeEmpty: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  savedTakeEmptyIcon: {
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  savedTakeIcon: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  savedTakeList: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  savedTakeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 72,
    paddingVertical: 11,
  },
});
