import { Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { ShootableRecipeCard } from '@/features/recipes/components/shootable-recipe-card';

const libraryFilters = ['All', 'Owned', 'Saved', 'Remixes'] as const;
type LibraryFilter = (typeof libraryFilters)[number];

export function RecipesScreen() {
  const router = useRouter();
  const { recipes } = useMockWorkspace();
  const [selectedFilter, setSelectedFilter] = useState<LibraryFilter>('All');

  const filteredRecipes = useMemo(() => {
    if (selectedFilter === 'Owned') {
      return recipes.filter((recipe) => recipe.ownership === 'owned');
    }

    if (selectedFilter === 'Saved') {
      return recipes.filter((recipe) => recipe.ownership === 'downloaded');
    }

    if (selectedFilter === 'Remixes') {
      return recipes.filter((recipe) => recipe.ownership === 'remixed');
    }

    return recipes;
  }, [recipes, selectedFilter]);

  return (
    <AppScreenScrollView>
      <View className="gap-5 px-5">
        <View className="gap-1">
          <Text className="text-[32px] font-black leading-[36px] text-ink">Recipes</Text>
          <Text className="text-[15px] text-muted">
            Saved scripts, owned frameworks, and remixes ready for the prompter.
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {libraryFilters.map((filter) => {
              const selected = filter === selectedFilter;

              return (
                <Pressable
                  key={filter}
                  accessibilityRole="button"
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

        {filteredRecipes.length === 0 ? (
          <View className="rounded-[26px] border border-dashed border-stroke bg-surface px-5 py-10">
            <Text className="text-center text-[18px] font-black text-ink">Nothing here yet</Text>
            <Text className="mt-2 text-center text-sm leading-6 text-muted">
              Save a creator recipe from Explore, remix it, then bring it back here to shoot.
            </Text>
            <Pressable
              accessibilityRole="button"
              className="mt-5 self-center rounded-full bg-violet px-5 py-3"
              onPress={() => router.push('/explore' as Href)}
            >
              <Text className="text-sm font-black text-white">Explore recipes</Text>
            </Pressable>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {filteredRecipes.map((recipe) => (
              <View key={recipe.id} className="w-[48%]">
                <ShootableRecipeCard
                  recipe={recipe}
                  primaryLabel="Shoot"
                  secondaryLabel="Open"
                  onPrimary={() => router.push(`/recipe/${recipe.id}/prompter` as Href)}
                  onSecondary={() => router.push(`/recipe/${recipe.id}` as Href)}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </AppScreenScrollView>
  );
}
