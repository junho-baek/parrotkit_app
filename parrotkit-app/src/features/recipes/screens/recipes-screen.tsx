import { Href, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { MediaTileCard } from '@/core/ui/media-tile-card';

export function RecipesScreen() {
  const router = useRouter();
  const { recipes } = useMockWorkspace();

  return (
    <AppScreenScrollView>
      <View className="gap-5 px-5">
        <View className="gap-1">
          <Text className="text-[32px] font-black leading-[36px] text-ink">My Recipes</Text>
          <Text className="text-[15px] text-muted">Your analyzed video recipes</Text>
        </View>

        {recipes.length === 0 ? (
          <View className="rounded-[28px] border border-dashed border-stroke bg-surface px-5 py-12">
            <Text className="text-center text-[18px] font-bold text-ink">No recipes yet</Text>
            <Text className="mt-2 text-center text-sm text-muted">
              Create your first recipe from a viral video.
            </Text>
            <Text
              className="mt-5 self-center rounded-full bg-violet px-5 py-3 text-sm font-bold text-white"
              onPress={() => router.push('/source-actions' as Href)}
            >
              Create Recipe
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {recipes.map((recipe) => (
              <View key={recipe.id} className="w-[48%]">
                <MediaTileCard
                  actionLabel="View Recipe"
                  actionTone="brand"
                  onAction={() => router.push(`/recipe/${recipe.id}` as Href)}
                  onPress={() => router.push(`/recipe/${recipe.id}` as Href)}
                  subtitle={recipe.savedAt}
                  thumbnail={recipe.thumbnail}
                  title={recipe.title}
                  topLeftLabel="RECIPE"
                  topLeftTone="success"
                  topRightLabel={recipe.platform}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </AppScreenScrollView>
  );
}
