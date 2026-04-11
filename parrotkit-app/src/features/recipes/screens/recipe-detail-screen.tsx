import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';

type DetailTab = 'analysis' | 'recipe' | 'prompter';

const detailTabs: Array<{ id: DetailTab; label: string }> = [
  { id: 'analysis', label: 'Original Analysis' },
  { id: 'recipe', label: 'Your Script' },
  { id: 'prompter', label: 'Prompter' },
];

export function RecipeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recipeId?: string }>();
  const { getRecipeById } = useMockWorkspace();
  const recipe = params.recipeId ? getRecipeById(params.recipeId) : null;

  const [activeTab, setActiveTab] = useState<DetailTab>('recipe');

  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-6">
        <Text className="text-[26px] font-black text-ink">Recipe not found</Text>
        <Text className="mt-2 text-center text-sm text-muted">
          This mock recipe is not available anymore.
        </Text>
        <Text
          className="mt-5 rounded-full bg-violet px-5 py-3 text-sm font-bold text-white"
          onPress={() => router.back()}
        >
          Go back
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ paddingBottom: 44 }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-5 px-5 pt-4">
        <View className="flex-row items-center justify-between">
          <Pressable className="flex-row items-center gap-2 rounded-full border border-stroke bg-surface px-4 py-2.5" onPress={() => router.back()}>
            <MaterialCommunityIcons color="#111827" name="arrow-left" size={18} />
            <Text className="text-sm font-semibold text-ink">Back</Text>
          </Pressable>

          <View className="rounded-full bg-slate-100 px-3 py-1.5">
            <Text className="text-[11px] font-semibold text-slate-600">{recipe.platform}</Text>
          </View>
        </View>

        <View className="overflow-hidden rounded-[30px] border border-stroke bg-surface">
          <View className="aspect-[16/10] overflow-hidden">
            <Image className="h-full w-full" resizeMode="cover" source={{ uri: recipe.thumbnail }} />
            <LinearGradient
              colors={['rgba(15,23,42,0.04)', 'rgba(15,23,42,0.72)']}
              end={{ x: 0.5, y: 1 }}
              start={{ x: 0.5, y: 0 }}
              style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
            />

            <View className="absolute inset-x-4 bottom-4 gap-2">
              <Text className="text-[28px] font-black leading-[32px] text-white">{recipe.title}</Text>
              <Text className="text-sm text-white/85">{recipe.creator} · {recipe.savedAt}</Text>
            </View>
          </View>
        </View>

        <View className="gap-3 rounded-[28px] border border-stroke bg-surface px-5 py-5">
          <Text className="text-[18px] font-bold text-ink">Recipe Summary</Text>
          <Text className="text-sm leading-6 text-muted">{recipe.summary}</Text>

          <View className="flex-row gap-2">
            <MetaChip label={recipe.niche} />
            <MetaChip label={recipe.goal} />
            <MetaChip label={`${recipe.scenes.length} scenes`} />
          </View>
        </View>

        <View className="flex-row gap-2 rounded-[24px] border border-stroke bg-surface p-1.5">
          {detailTabs.map((tab) => {
            const active = tab.id === activeTab;

            return (
              <Text
                key={tab.id}
                className={`flex-1 rounded-[18px] px-3 py-2.5 text-center text-[12px] font-semibold ${
                  active ? 'bg-violet text-white' : 'text-muted'
                }`}
                onPress={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Text>
            );
          })}
        </View>

        <View className="gap-3">
          {recipe.scenes.map((scene, index) => {
            const lines =
              activeTab === 'analysis'
                ? scene.analysisLines
                : activeTab === 'recipe'
                  ? scene.recipeLines
                  : scene.prompterLines;

            return (
              <View key={scene.id} className="gap-3 rounded-[28px] border border-stroke bg-surface px-5 py-5">
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1 gap-1">
                    <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">
                      Scene {index + 1}
                    </Text>
                    <Text className="text-[22px] font-black leading-[28px] text-ink">{scene.title}</Text>
                  </View>

                  <View className="rounded-full bg-slate-100 px-3 py-1.5">
                    <Text className="text-[11px] font-semibold text-slate-600">{activeTab}</Text>
                  </View>
                </View>

                <Text className="text-sm leading-6 text-muted">{scene.summary}</Text>

                <View className="gap-2">
                  {lines.map((line) => (
                    <View key={line} className="flex-row items-start gap-2 rounded-[18px] bg-slate-50 px-4 py-3">
                      <View className="mt-1 h-2 w-2 rounded-full bg-violet" />
                      <Text className="flex-1 text-sm leading-6 text-ink">{line}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={{ borderRadius: 24 }}>
          <View className="gap-1 rounded-[24px] px-5 py-5">
            <Text className="text-[18px] font-bold text-white">Local mock recipe shell</Text>
            <Text className="text-sm leading-6 text-white/85">
              This screen is intentionally wired to local state only. Server logic can attach later without changing the product flow.
            </Text>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

function MetaChip({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-slate-100 px-3 py-1.5">
      <Text className="text-[11px] font-semibold text-slate-600">{label}</Text>
    </View>
  );
}
