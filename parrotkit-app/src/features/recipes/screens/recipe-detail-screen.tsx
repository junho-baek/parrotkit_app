import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { MockRecipe, MockRecipeScene } from '@/core/mocks/parrotkit-data';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import {
  getScenePrompterElements,
  getSelectedPrompterElements,
  type MockPrompterElement,
} from '@/features/recipes/lib/mock-prompter-elements';

type DetailTab = 'analysis' | 'recipe' | 'prompter';

const detailTabs: Array<{ id: DetailTab; label: string }> = [
  { id: 'analysis', label: 'Original Analysis' },
  { id: 'recipe', label: 'Your Script' },
  { id: 'prompter', label: 'Prompter' },
];

export function RecipeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recipeId?: string }>();
  const { getPrompterSelection, getRecipeById, togglePrompterSelection } = useMockWorkspace();
  const recipe = params.recipeId ? getRecipeById(params.recipeId) : null;

  const [activeTab, setActiveTab] = useState<DetailTab>('recipe');
  const [selectedPrompterSceneId, setSelectedPrompterSceneId] = useState(recipe?.scenes[0]?.id ?? '');

  const prompterScene = useMemo(
    () => recipe?.scenes.find((scene) => scene.id === selectedPrompterSceneId) ?? recipe?.scenes[0] ?? null,
    [recipe, selectedPrompterSceneId]
  );

  const selectedPrompterIds = recipe && prompterScene ? getPrompterSelection(recipe.id, prompterScene) : [];
  const selectedPrompterElements = prompterScene
    ? getSelectedPrompterElements(prompterScene, selectedPrompterIds)
    : [];

  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-6">
        <Text className="text-[26px] font-black text-ink">Recipe not found</Text>
        <Text className="mt-2 text-center text-sm text-muted">
          This mock recipe is not available anymore.
        </Text>

        <Pressable
          className="mt-5 rounded-full bg-violet px-5 py-3"
          onPress={() => router.back()}
        >
          <Text className="text-sm font-bold text-white">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handleOpenPrompter = () => {
    if (!prompterScene) {
      return;
    }

    router.push(`/recipe/${recipe.id}/prompter?sceneId=${prompterScene.id}` as Href);
  };

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ paddingBottom: 44 }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-5 px-5 pt-4">
        <View className="flex-row items-center justify-between">
          <Pressable
            className="flex-row items-center gap-2 rounded-full border border-stroke bg-surface px-4 py-2.5"
            onPress={() => router.back()}
          >
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
              <Text className="text-sm text-white/85">
                {recipe.creator} · {recipe.savedAt}
              </Text>
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
              <Pressable
                key={tab.id}
                className={`flex-1 rounded-[18px] px-3 py-2.5 ${
                  active ? 'bg-violet' : 'bg-transparent'
                }`}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  className={`text-center text-[12px] font-semibold ${
                    active ? 'text-white' : 'text-muted'
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {activeTab === 'prompter' ? (
          <PrompterPlanner
            onOpenPrompter={handleOpenPrompter}
            onSelectScene={setSelectedPrompterSceneId}
            onToggleElement={(elementId) => {
              if (!prompterScene) {
                return;
              }

              togglePrompterSelection(recipe.id, prompterScene, elementId);
            }}
            recipe={recipe}
            selectedElements={selectedPrompterElements}
            selectedIds={selectedPrompterIds}
            selectedScene={prompterScene}
          />
        ) : (
          <View className="gap-3">
            {recipe.scenes.map((scene, index) => {
              const lines = activeTab === 'analysis' ? scene.analysisLines : scene.recipeLines;

              return (
                <SceneCard
                  key={scene.id}
                  index={index}
                  lines={lines}
                  scene={scene}
                  tabLabel={activeTab}
                />
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function PrompterPlanner({
  recipe,
  selectedScene,
  selectedIds,
  selectedElements,
  onSelectScene,
  onToggleElement,
  onOpenPrompter,
}: {
  recipe: MockRecipe;
  selectedScene: MockRecipeScene | null;
  selectedIds: string[];
  selectedElements: MockPrompterElement[];
  onSelectScene: (sceneId: string) => void;
  onToggleElement: (elementId: string) => void;
  onOpenPrompter: () => void;
}) {
  if (!selectedScene) {
    return null;
  }

  const sceneElements = getScenePrompterElements(selectedScene);
  const scriptElements = sceneElements.filter((element) => element.kind === 'script');
  const cueElements = sceneElements.filter((element) => element.kind === 'cue');

  return (
    <View className="gap-4">
      <View className="gap-4 rounded-[28px] border border-stroke bg-surface px-5 py-5">
        <View className="flex-row items-center justify-between">
          <Text className="text-[18px] font-bold text-ink">Prompter</Text>
          <Text className="text-[12px] font-semibold text-violet">{selectedElements.length} selected</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2 pr-1">
            {recipe.scenes.map((scene, index) => {
              const active = scene.id === selectedScene.id;

              return (
                <Pressable
                  key={scene.id}
                  className={`rounded-full border px-4 py-2 ${
                    active ? 'border-violet bg-violet/10' : 'border-stroke bg-white'
                  }`}
                  onPress={() => onSelectScene(scene.id)}
                >
                  <Text className={`text-sm font-semibold ${active ? 'text-violet' : 'text-ink'}`}>
                    Scene {index + 1}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View className="gap-3 rounded-[24px] bg-slate-950 px-4 py-4">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-white/55">
            Camera Overlay
          </Text>

          <View className="gap-2.5">
            {selectedElements.length ? (
              selectedElements.map((element) => (
                <View
                  key={element.id}
                  className={`rounded-[18px] border px-4 py-3 ${
                    element.kind === 'script'
                      ? 'border-white/20 bg-white/10'
                      : 'border-violet-200/25 bg-violet-300/15'
                  }`}
                >
                  <Text className="text-[11px] font-semibold uppercase tracking-[0.8px] text-white/55">
                    {element.kind === 'script' ? 'Script' : 'Cue'}
                  </Text>
                  <Text className="mt-1 text-sm font-semibold leading-6 text-white">{element.text}</Text>
                </View>
              ))
            ) : (
              <View className="rounded-[18px] border border-dashed border-white/15 px-4 py-5">
                <Text className="text-sm font-medium text-white/60">Choose at least one line below.</Text>
              </View>
            )}
          </View>
        </View>

        <PrompterElementSection
          iconName="script-text-outline"
          label="Script"
          onToggleElement={onToggleElement}
          selectedIds={selectedIds}
          elements={scriptElements}
        />

        <PrompterElementSection
          iconName="star-four-points-outline"
          label="Prompter cues"
          onToggleElement={onToggleElement}
          selectedIds={selectedIds}
          elements={cueElements}
        />

        <Pressable disabled={selectedElements.length === 0} onPress={onOpenPrompter}>
          <LinearGradient
            colors={brandActionGradient}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={{
              borderRadius: 24,
              opacity: selectedElements.length === 0 ? 0.5 : 1,
            }}
          >
            <View className="flex-row items-center justify-center gap-2 px-5 py-4">
              <MaterialCommunityIcons color="#fffdf8" name="camera-outline" size={20} />
              <Text className="text-[15px] font-semibold text-white">Open native prompter</Text>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function PrompterElementSection({
  label,
  iconName,
  elements,
  selectedIds,
  onToggleElement,
}: {
  label: string;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  elements: MockPrompterElement[];
  selectedIds: string[];
  onToggleElement: (elementId: string) => void;
}) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons color="#6366f1" name={iconName} size={18} />
        <Text className="text-[14px] font-semibold text-ink">{label}</Text>
      </View>

      <View className="gap-2.5">
        {elements.map((element) => {
          const active = selectedIds.includes(element.id);

          return (
            <Pressable
              key={element.id}
              className={`rounded-[22px] border px-4 py-3 ${
                active ? 'border-violet bg-violet/5' : 'border-stroke bg-white'
              }`}
              onPress={() => onToggleElement(element.id)}
            >
              <View className="flex-row items-start gap-3">
                <MaterialCommunityIcons
                  color={active ? '#6366f1' : '#cbd5e1'}
                  name={active ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                  size={20}
                />

                <View className="flex-1 gap-1">
                  <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">
                    {element.label}
                  </Text>
                  <Text className="text-sm leading-6 text-ink">{element.text}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SceneCard({
  scene,
  lines,
  index,
  tabLabel,
}: {
  scene: MockRecipeScene;
  lines: string[];
  index: number;
  tabLabel: string;
}) {
  return (
    <View className="gap-3 rounded-[28px] border border-stroke bg-surface px-5 py-5">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">
            Scene {index + 1}
          </Text>
          <Text className="text-[22px] font-black leading-[28px] text-ink">{scene.title}</Text>
        </View>

        <View className="rounded-full bg-slate-100 px-3 py-1.5">
          <Text className="text-[11px] font-semibold text-slate-600">{tabLabel}</Text>
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
}

function MetaChip({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-slate-100 px-3 py-1.5">
      <Text className="text-[11px] font-semibold text-slate-600">{label}</Text>
    </View>
  );
}
