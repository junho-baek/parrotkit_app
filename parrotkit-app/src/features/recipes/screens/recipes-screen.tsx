import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import { PropsWithChildren, useCallback } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  localizeActivityLabel,
  useAppLanguage,
  type AppLanguage,
} from '@/core/i18n/app-language';
import type { MockRecipe } from '@/core/mocks/parrotkit-data';
import { APP_TOP_BAR_HIDE_RANGE } from '@/core/navigation/app-top-bar';
import { useAppChrome } from '@/core/navigation/app-chrome-provider';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { toImageSource } from '@/core/ui/image-source';
import { getShootBoardHref } from '@/features/recipes/lib/shoot-board-model';

export function RecipesScreen() {
  const router = useRouter();
  const { language, copy } = useAppLanguage();
  const { recipes } = useMockWorkspace();

  const openRecipe = (recipe: MockRecipe) => {
    router.push(getShootBoardHref(recipe.id) as Href);
  };

  return (
    <View className="flex-1 bg-canvas">
      <RecipesTabScrollView>
        <View className="gap-5 px-5">
          <View className="gap-1">
            <Text className="text-[32px] font-black leading-[37px] text-ink">
              {copy.nav.recipes}
            </Text>
          </View>

          {recipes.length > 0 ? (
            <View style={styles.recipeListFlat}>
              {recipes.map((recipe) => (
                <RecipeListRow
                  key={recipe.id}
                  language={language}
                  onPress={() => openRecipe(recipe)}
                  recipe={recipe}
                />
              ))}
            </View>
          ) : (
            <Text className="text-[14px] font-semibold leading-5 text-muted">
              {language === 'ko' ? '아직 저장한 레시피가 없어요.' : 'No saved recipes yet.'}
            </Text>
          )}
        </View>
      </RecipesTabScrollView>
    </View>
  );
}

function RecipeListRow({
  language,
  onPress,
  recipe,
}: {
  language: AppLanguage;
  onPress: () => void;
  recipe: MockRecipe;
}) {
  const activity = localizeActivityLabel(language, recipe.lastShotAt ?? recipe.savedAt);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.recipeRow}>
      <Image source={toImageSource(recipe.thumbnail)} style={styles.recipeRowImage} />
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-black leading-5 text-ink" numberOfLines={1}>
          {recipe.title}
        </Text>
        <Text className="mt-1 text-[12px] font-semibold text-muted" numberOfLines={1}>
          {recipe.ownerHandle} · {formatCutCount(language, recipe.totalSceneCount)}
        </Text>
        <Text className="mt-0.5 text-[12px] font-semibold text-muted" numberOfLines={1}>
          {activity}
        </Text>
      </View>
      <MaterialCommunityIcons color="#94a3b8" name="chevron-right" size={21} />
    </Pressable>
  );
}

function formatCutCount(language: AppLanguage, count: number) {
  return language === 'ko' ? `${count}컷` : `${count} ${count === 1 ? 'cut' : 'cuts'}`;
}

function RecipesTabScrollView({
  bottomPadding = 176,
  children,
}: PropsWithChildren<{ bottomPadding?: number }>) {
  const insets = useSafeAreaInsets();
  const { topBarProgress } = useAppChrome();

  useFocusEffect(
    useCallback(() => {
      topBarProgress.value = APP_TOP_BAR_HIDE_RANGE;

      return () => {
        topBarProgress.value = 0;
      };
    }, [topBarProgress])
  );

  return (
    <ScrollView
      automaticallyAdjustContentInsets={false}
      className="flex-1 bg-canvas"
      contentContainerStyle={{
        paddingBottom: bottomPadding,
        paddingTop: insets.top + 12,
      }}
      contentInsetAdjustmentBehavior="never"
      scrollIndicatorInsets={{
        bottom: bottomPadding,
        top: insets.top + 12,
      }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  recipeListFlat: {
    gap: 2,
  },
  recipeRow: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#eef2f7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    minHeight: 76,
    paddingVertical: 10,
  },
  recipeRowImage: {
    backgroundColor: '#f8fafc',
    borderRadius: 17,
    height: 58,
    width: 46,
  },
});
