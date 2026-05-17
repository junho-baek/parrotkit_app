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
      <View className="gap-7 px-5">
        <View className="gap-1.5">
          <Text className="text-[32px] font-black leading-[37px] text-ink">{profile.name}</Text>
          <Text className="text-[14px] font-semibold leading-5 text-muted">{profile.role}</Text>
        </View>

        <View className="gap-3">
          <Text className="text-[18px] font-black text-ink">{profileCopy.savedRecipesSection}</Text>
          {profileEntries.savedRecipes.length > 0 ? (
            <View>
              {profileEntries.savedRecipes.map((recipe) => (
                <SavedRecipeRow
                  key={recipe.recipeId}
                  language={language}
                  onPress={() => openDestination(recipe.destination)}
                  recipe={recipe}
                />
              ))}
            </View>
          ) : (
            <Text className="text-[13px] font-semibold leading-5 text-muted">
              {profileCopy.savedRecipesEmptyTitle}
            </Text>
          )}
        </View>

        <View className="gap-3">
          <Text className="text-[18px] font-black text-ink">{profileCopy.savedTakesSection}</Text>
          {profileEntries.savedTakes.length > 0 ? (
            <View>
              {profileEntries.savedTakes.map((take) => (
                <SavedTakeRow
                  key={take.takeId}
                  language={language}
                  onPress={() => openDestination(take.destination)}
                  take={take}
                />
              ))}
            </View>
          ) : (
            <Text className="text-[13px] font-semibold leading-5 text-muted">
              {profileCopy.savedTakesEmptyTitle}
            </Text>
          )}
        </View>

        <View className="gap-3">
          <Text className="text-[18px] font-black text-ink">{profileCopy.settingsSection}</Text>
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
  recipe,
}: {
  language: AppLanguage;
  onPress: () => void;
  recipe: SavedRecipeProfileAccessEntry;
}) {
  const progress = typeof recipe.shotSceneCount === 'number' && typeof recipe.totalSceneCount === 'number'
    ? language === 'ko'
      ? `${recipe.shotSceneCount}/${recipe.totalSceneCount}컷`
      : `${recipe.shotSceneCount}/${recipe.totalSceneCount} cuts`
    : language === 'ko'
      ? '레시피'
      : 'Recipe';

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      <View style={styles.rowIcon}>
        <MaterialCommunityIcons color="#111827" name="book-open-page-variant-outline" size={21} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-black leading-5 text-ink" numberOfLines={1}>
          {recipe.recipeTitle}
        </Text>
        <Text className="mt-1 text-[12px] font-semibold text-muted" numberOfLines={1}>
          {progress}
        </Text>
      </View>
      <MaterialCommunityIcons color="#94a3b8" name="chevron-right" size={20} />
    </Pressable>
  );
}

function SavedTakeRow({
  language,
  onPress,
  take,
}: {
  language: AppLanguage;
  onPress: () => void;
  take: SavedTakeProfileAccessEntry;
}) {
  const cutLabel = typeof take.cutOrder === 'number'
    ? language === 'ko' ? `${take.cutOrder}컷` : `Cut ${take.cutOrder}`
    : language === 'ko' ? '컷' : 'Cut';

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      <View style={styles.rowIcon}>
        <MaterialCommunityIcons color="#111827" name="play-circle-outline" size={22} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-black leading-5 text-ink" numberOfLines={1}>
          {take.recipeTitle}
        </Text>
        <Text className="mt-1 text-[12px] font-semibold text-muted" numberOfLines={1}>
          {cutLabel} · {take.cutTitle}
        </Text>
      </View>
      <MaterialCommunityIcons color="#94a3b8" name="chevron-right" size={20} />
    </Pressable>
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
  languageOption: {
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  languageOptionActive: {
    backgroundColor: '#111827',
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
    gap: 4,
    padding: 4,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: '#eef2f7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 10,
    minHeight: 68,
    paddingVertical: 9,
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
