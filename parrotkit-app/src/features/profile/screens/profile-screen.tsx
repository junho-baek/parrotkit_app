import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage, type AppLanguage } from '@/core/i18n/app-language';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { getProfileScrollBottomPadding } from '@/features/profile/lib/profile-layout';
import {
  getSavedTakeProfileAccessEntries,
  type SavedRecipeProfileAccessEntry,
  type SavedTakeProfileAccessEntry,
} from '@/features/recipes/lib/saved-take-home-access';

type ProfileCopy = ReturnType<typeof useAppLanguage>['copy']['profile'];

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { getSavedRecipeTakes, profile, recipes } = useMockWorkspace();
  const { copy, language, setLanguage } = useAppLanguage();
  const profileCopy = copy.profile;
  const profileEntries = getSavedTakeProfileAccessEntries({
    recipes,
    savedTakes: getSavedRecipeTakes(),
  });

  const openDestination = (destination: string) => {
    router.push(destination as Href);
  };

  return (
    <AppScreenScrollView bottomPadding={getProfileScrollBottomPadding(insets.bottom)}>
      <View className="gap-5 px-5">
        <View className="gap-3 rounded-[28px] border border-stroke bg-surface px-5 py-5">
          <View className="gap-1">
            <Text className="text-[30px] font-black leading-[34px] text-ink">{profile.name}</Text>
            <Text className="text-sm font-semibold text-violet">{profile.role}</Text>
          </View>

          <Text className="text-sm leading-6 text-muted">{profile.bio}</Text>

          <View className="flex-row flex-wrap gap-2">
            {profile.focusTags.map((tag) => (
              <View key={tag} className="rounded-full bg-slate-100 px-3 py-1.5">
                <Text className="text-[11px] font-semibold text-slate-600">{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-3 rounded-[26px] border border-stroke bg-surface px-5 py-5">
          <View className="flex-row items-center justify-between gap-3">
            <View className="min-w-0 flex-1 gap-1">
              <Text className="text-[18px] font-black text-ink">{profileCopy.proSection}</Text>
              <Text className="text-[15px] font-black text-ink">{profileCopy.proStatusTitle}</Text>
              <Text className="text-[13px] font-semibold leading-5 text-muted">
                {profileCopy.proStatusBody}
              </Text>
            </View>
            <View style={styles.proBadge}>
              <MaterialCommunityIcons color="#8c67ff" name="lock-outline" size={18} />
            </View>
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-[18px] font-black text-ink">{profileCopy.savedRecipesSection}</Text>

          {profileEntries.savedRecipes.length > 0 ? (
            <View style={styles.listCard}>
              {profileEntries.savedRecipes.map((recipe) => (
                <SavedRecipeRow
                  key={recipe.recipeId}
                  language={language}
                  onPress={() => openDestination(recipe.destination)}
                  onStartFilming={() => openDestination(recipe.startFilmingDestination)}
                  recipe={recipe}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              body={profileCopy.savedRecipesEmptyBody}
              icon="book-outline"
              title={profileCopy.savedRecipesEmptyTitle}
            />
          )}
        </View>

        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-[18px] font-black text-ink">{profileCopy.savedTakesSection}</Text>
            <Text className="text-[13px] font-bold text-muted">{profileCopy.savedTakeLocal}</Text>
          </View>

          {profileEntries.savedTakes.length > 0 ? (
            <View style={styles.listCard}>
              {profileEntries.savedTakes.map((take) => (
                <SavedTakeRow
                  copy={profileCopy}
                  key={take.takeId}
                  language={language}
                  onPress={() => openDestination(take.destination)}
                  take={take}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              body={profileCopy.savedTakesEmptyBody}
              icon="video-check-outline"
              title={profileCopy.savedTakesEmptyTitle}
            />
          )}
        </View>

        <View className="gap-3 rounded-[26px] border border-stroke bg-surface px-5 py-5">
          <Text className="text-[18px] font-black text-ink">{profileCopy.settingsSection}</Text>

          <View className="gap-1">
            <Text className="text-[15px] font-black text-ink">{profileCopy.languageTitle}</Text>
            <Text className="text-[13px] font-semibold leading-5 text-muted">
              {profileCopy.languageDescription}
            </Text>
          </View>

          <View style={styles.languageSegment}>
            <LanguageOption
              active={language === 'en'}
              label={profileCopy.english}
              language="en"
              onPress={setLanguage}
            />
            <LanguageOption
              active={language === 'ko'}
              label={profileCopy.korean}
              language="ko"
              onPress={setLanguage}
            />
          </View>
        </View>
      </View>
    </AppScreenScrollView>
  );
}

function SavedRecipeRow({
  language,
  onPress,
  onStartFilming,
  recipe,
}: {
  language: AppLanguage;
  onPress: () => void;
  onStartFilming: () => void;
  recipe: SavedRecipeProfileAccessEntry;
}) {
  const progress = typeof recipe.shotSceneCount === 'number' && typeof recipe.totalSceneCount === 'number'
    ? language === 'ko'
      ? `${recipe.shotSceneCount}/${recipe.totalSceneCount}컷 촬영`
      : `${recipe.shotSceneCount}/${recipe.totalSceneCount} shots`
    : language === 'ko'
      ? '로컬 레시피'
      : 'Local recipe';

  return (
    <View style={styles.row}>
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.recipeRowMain}>
        <View style={styles.rowIcon}>
          <MaterialCommunityIcons color="#111827" name="book-open-page-variant-outline" size={21} />
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-[15px] font-black leading-5 text-ink" numberOfLines={1}>
            {recipe.recipeTitle}
          </Text>
          <Text className="text-[12px] font-bold text-muted" numberOfLines={1}>
            {progress}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityLabel={language === 'ko' ? `${recipe.recipeTitle} 촬영 시작` : `Start filming ${recipe.recipeTitle}`}
        accessibilityRole="button"
        onPress={onStartFilming}
        style={styles.startFilmingButton}
      >
        <MaterialCommunityIcons color="#fff" name="camera-outline" size={14} />
        <Text style={styles.startFilmingButtonText}>
          {language === 'ko' ? '촬영 시작' : 'Start filming'}
        </Text>
      </Pressable>
    </View>
  );
}

function SavedTakeRow({
  copy,
  language,
  onPress,
  take,
}: {
  copy: ProfileCopy;
  language: AppLanguage;
  onPress: () => void;
  take: SavedTakeProfileAccessEntry;
}) {
  const cutLabel = typeof take.cutOrder === 'number'
    ? language === 'ko' ? `컷 ${take.cutOrder}` : `Cut ${take.cutOrder}`
    : language === 'ko' ? '컷' : 'Cut';
  const statusLabel = take.isFinalTake ? copy.savedTakeFinal : copy.savedTakeSaved;

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      <View style={styles.rowIcon}>
        <MaterialCommunityIcons color="#111827" name="play-circle-outline" size={22} />
      </View>
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-[15px] font-black leading-5 text-ink" numberOfLines={1}>
          {take.recipeTitle}
        </Text>
        <Text className="text-[12px] font-bold text-muted" numberOfLines={1}>
          {cutLabel} · {take.cutTitle}
        </Text>
      </View>
      <View className="items-end gap-1">
        <Text className="text-[11px] font-black text-violet" numberOfLines={1}>
          {take.takeLabel}
        </Text>
        <Text className="text-[11px] font-bold text-slate-400" numberOfLines={1}>
          {statusLabel}
        </Text>
      </View>
      <MaterialCommunityIcons color="#94a3b8" name="chevron-right" size={20} />
    </Pressable>
  );
}

function EmptyState({
  body,
  icon,
  title,
}: {
  body: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <MaterialCommunityIcons color="#8c67ff" name={icon} size={21} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-black text-ink">{title}</Text>
        <Text className="mt-1 text-[13px] font-semibold leading-5 text-muted">{body}</Text>
      </View>
    </View>
  );
}

function LanguageOption({
  active,
  label,
  language,
  onPress,
}: {
  active: boolean;
  label: string;
  language: AppLanguage;
  onPress: (language: AppLanguage) => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      onPress={() => onPress(language)}
      style={[styles.languageOption, active ? styles.languageOptionActive : null]}
    >
      <Text style={[styles.languageOptionText, active ? styles.languageOptionTextActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  languageOption: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
  languageOptionActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  languageOptionText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '900',
  },
  languageOptionTextActive: {
    color: '#ffffff',
  },
  languageSegment: {
    backgroundColor: '#f1f5f9',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    padding: 4,
  },
  listCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  proBadge: {
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    borderRadius: 999,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 72,
    paddingVertical: 11,
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  recipeRowMain: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    minWidth: 0,
  },
  startFilmingButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 10,
  },
  startFilmingButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
});
