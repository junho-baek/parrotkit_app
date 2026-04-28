import { Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { ShootableRecipeCard } from '@/features/recipes/components/shootable-recipe-card';
import { isVerifiedCreatorRecipe } from '@/features/recipes/lib/recipe-ownership';

const recipeFilters = ['Verified', 'Community', 'All'] as const;
type RecipeFilter = (typeof recipeFilters)[number];

export function ExploreScreen() {
  const router = useRouter();
  const {
    downloadRecipe,
    exploreRecipes,
    isRecipeDownloaded,
    partnerCreators,
  } = useMockWorkspace();
  const [selectedFilter, setSelectedFilter] = useState<RecipeFilter>('Verified');

  const filteredRecipes = useMemo(() => {
    if (selectedFilter === 'Verified') {
      return exploreRecipes.filter(isVerifiedCreatorRecipe);
    }

    if (selectedFilter === 'Community') {
      return exploreRecipes.filter((recipe) => !isVerifiedCreatorRecipe(recipe));
    }

    return exploreRecipes;
  }, [exploreRecipes, selectedFilter]);

  const verifiedCreators = partnerCreators.filter((creator) => creator.trust === 'verified');

  const handleDownload = (recipeId: string) => {
    const downloadedRecipe = downloadRecipe(recipeId);

    if (downloadedRecipe) {
      router.push(`/recipe/${downloadedRecipe.id}` as Href);
    }
  };

  return (
    <AppScreenScrollView>
      <View className="gap-5 px-5">
        <View className="gap-1">
          <Text className="text-[32px] font-black leading-[36px] text-ink">Explore</Text>
          <Text className="text-[15px] text-muted">Verified creator recipes you can save, remix, and shoot.</Text>
        </View>

        <View className="gap-3">
          <Text className="text-[16px] font-black text-ink">Verified creators</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4">
              {verifiedCreators.map((creator) => (
                <View key={creator.id} className="w-[96px]">
                  <View className="mb-2 h-[76px] w-[76px] overflow-hidden rounded-full border border-violet/30">
                    <MediaAvatar uri={creator.avatar} />
                  </View>
                  <Text className="text-[13px] font-black text-ink" numberOfLines={1}>
                    {creator.name}
                  </Text>
                  <Text className="text-[11px] font-semibold text-muted" numberOfLines={1}>
                    {creator.specialty}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {recipeFilters.map((filter) => {
              const selected = filter === selectedFilter;
              return (
                <Pressable
                  key={filter}
                  className={`rounded-full px-4 py-2 ${selected ? 'bg-violet' : 'bg-slate-100'}`}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text className={`text-xs font-black ${selected ? 'text-white' : 'text-slate-700'}`}>
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View className="gap-3">
          <Text className="text-[18px] font-black text-ink">
            {selectedFilter === 'Verified' ? 'Verified recipes' : selectedFilter === 'Community' ? 'Community recipes' : 'All recipes'}
          </Text>

          <View className="flex-row flex-wrap gap-3">
            {filteredRecipes.map((recipe) => {
              const downloaded = isRecipeDownloaded(recipe.id);
              return (
                <View key={recipe.id} className="w-[48%]">
                  <ShootableRecipeCard
                    recipe={recipe}
                    primaryLabel={downloaded ? 'Open' : 'Download'}
                    secondaryLabel={downloaded ? 'Saved' : `${recipe.downloadCount}`}
                    onPrimary={() => handleDownload(recipe.id)}
                    onSecondary={downloaded ? () => handleDownload(recipe.id) : undefined}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </AppScreenScrollView>
  );
}

function MediaAvatar({ uri }: { uri: string }) {
  return <Image className="h-full w-full" resizeMode="cover" source={{ uri }} />;
}
