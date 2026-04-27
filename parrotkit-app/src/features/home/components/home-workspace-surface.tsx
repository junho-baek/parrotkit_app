import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { ShootableRecipeCard } from '@/features/recipes/components/shootable-recipe-card';

export function HomeWorkspaceSurface() {
  const router = useRouter();
  const {
    getContinueShootRecipe,
    getLatestShootableRecipe,
    recipes,
  } = useMockWorkspace();
  const continueRecipe = getContinueShootRecipe();
  const latestRecipe = continueRecipe ? null : getLatestShootableRecipe();
  const shelfRecipes = recipes.filter((recipe) => recipe.id !== continueRecipe?.id && recipe.id !== latestRecipe?.id);
  const heroRecipe = continueRecipe ?? latestRecipe;

  return (
    <View className="flex-1 bg-canvas">
      <AppScreenScrollView>
        <View className="gap-5 px-5">
          <View className="gap-1">
            <Text className="text-[32px] font-black leading-[36px] text-ink">Shoot</Text>
            <Text className="text-[15px] font-medium text-muted">Open a recipe, load the prompter, and record the next cut.</Text>
          </View>

          {heroRecipe ? (
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-[12px] font-black uppercase tracking-[1.2px] text-muted">
                  {continueRecipe ? 'Continue' : 'Ready to shoot'}
                </Text>
                <Text className="text-[12px] font-bold text-violet">
                  {heroRecipe.lastShotAt ?? heroRecipe.savedAt}
                </Text>
              </View>

              <ShootableRecipeCard
                mode="hero"
                recipe={heroRecipe}
                onPrimary={() => router.push(`/recipe/${heroRecipe.id}/prompter` as Href)}
                onSecondary={() => router.push(`/recipe/${heroRecipe.id}` as Href)}
                secondaryLabel="Recipe"
              />
            </View>
          ) : (
            <EmptyShootHero onQuickShoot={() => router.push('/quick-shoot' as Href)} />
          )}

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[18px] font-black text-ink">Your recipes</Text>
              <Text
                className="text-[13px] font-bold text-violet"
                onPress={() => router.push('/recipes' as Href)}
              >
                View all
              </Text>
            </View>

            {shelfRecipes.length > 0 ? (
              <View className="flex-row flex-wrap gap-3">
                {shelfRecipes.slice(0, 4).map((recipe) => (
                  <View key={recipe.id} className="w-[48%]">
                    <ShootableRecipeCard
                      recipe={recipe}
                      onPrimary={() => router.push(`/recipe/${recipe.id}/prompter` as Href)}
                      onSecondary={() => router.push(`/recipe/${recipe.id}` as Href)}
                      secondaryLabel="Open"
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View className="rounded-[26px] border border-dashed border-stroke bg-surface px-5 py-8">
                <Text className="text-[17px] font-black text-ink">No saved recipe shelf yet</Text>
                <Text className="mt-2 text-sm leading-6 text-muted">
                  Download a verified creator recipe from Explore or make one from Source.
                </Text>
              </View>
            )}
          </View>

          <PressableAction
            body="Paste a script, link, or reference and turn it into a shootable recipe."
            cta="Make Recipe"
            onPress={() => router.push('/source-actions' as Href)}
            title="Add a source"
          />
        </View>
      </AppScreenScrollView>
    </View>
  );
}

function EmptyShootHero({ onQuickShoot }: { onQuickShoot: () => void }) {
  return (
    <LinearGradient colors={['#111827', '#020617']} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={{ borderRadius: 28 }}>
      <View className="gap-4 px-5 py-6">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-white/12">
          <MaterialCommunityIcons color="#fff" name="video-plus-outline" size={25} />
        </View>
        <View className="gap-2">
          <Text className="text-[28px] font-black leading-[32px] text-white">Start with a blank prompter</Text>
          <Text className="text-sm leading-6 text-white/70">
            No active shoot yet. Open Quick Shoot, write one cue, and record the first take.
          </Text>
        </View>
        <Pressable className="self-start rounded-full bg-white px-5 py-3" onPress={onQuickShoot}>
          <Text className="text-sm font-black text-slate-950">Quick Shoot</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

function PressableAction({
  title,
  body,
  cta,
  onPress,
}: {
  title: string;
  body: string;
  cta: string;
  onPress: () => void;
}) {
  return (
    <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={{ borderRadius: 24 }}>
      <View className="flex-row items-center justify-between rounded-[24px] px-5 py-5">
        <View className="flex-1 gap-1 pr-4">
          <Text className="text-[18px] font-bold text-white">{title}</Text>
          <Text className="text-[13px] leading-5 text-white/90">{body}</Text>
        </View>

        <Pressable className="rounded-2xl bg-white px-4 py-2.5" onPress={onPress}>
          <Text className="text-sm font-bold text-sky-600">{cta}</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
