import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import {
  MockPlatform,
  MockRecipe,
  MockRecipeScene,
  MockReference,
  partnerCreators,
  profileSeed,
  recentReferencesSeed,
  recipesSeed,
  trendingReferencesSeed,
} from '@/core/mocks/parrotkit-data';
import { getDefaultPrompterSelection } from '@/features/recipes/lib/mock-prompter-elements';
import { normalizeNativeRecipeScene } from '@/features/recipes/lib/recipe-domain-normalizer';

type CreateRecipeDraftInput = {
  title: string;
  videoUrl?: string;
  niche?: string;
  goal?: string;
  notes?: string;
};

type MockWorkspaceContextValue = {
  partnerCreators: typeof partnerCreators;
  profile: typeof profileSeed;
  recentReferences: MockReference[];
  recipes: MockRecipe[];
  trendingReferences: MockReference[];
  likedReferences: MockReference[];
  homeStats: {
    references: number;
    recipes: number;
    views: number;
  };
  sourceStats: {
    links: number;
    drafts: number;
    imports: number;
    queue: number;
  };
  toggleLikeReference: (referenceId: string) => void;
  createRecipeDraft: (input: CreateRecipeDraftInput) => MockRecipe;
  getRecipeById: (recipeId: string) => MockRecipe | null;
  getPrompterSelection: (recipeId: string, scene: MockRecipeScene) => string[];
  setPrompterSelection: (recipeId: string, sceneId: string, elementIds: string[]) => void;
  togglePrompterSelection: (recipeId: string, scene: MockRecipeScene, elementId: string) => void;
  updateScenePrompterBlockVisibility: (recipeId: string, sceneId: string, blockId: string, visible: boolean) => void;
  updateScenePrompterBlockContent: (recipeId: string, sceneId: string, blockId: string, content: string) => void;
};

const MockWorkspaceContext = createContext<MockWorkspaceContextValue | null>(null);

type PrompterSelectionState = Record<string, Record<string, string[]>>;

function guessPlatform(url: string): MockPlatform {
  const lowered = url.toLowerCase();

  if (lowered.includes('instagram')) {
    return 'Instagram Reels';
  }

  if (lowered.includes('youtube') || lowered.includes('youtu.be')) {
    return 'YouTube Shorts';
  }

  return 'TikTok';
}

function buildScenes(title: string, niche: string, goal: string, notes: string): MockRecipe['scenes'] {
  const resolvedNiche = niche.trim() || 'Creator';
  const resolvedGoal = goal.trim() || 'Clearer cut-by-cut pacing';
  const resolvedNotes = notes.trim() || 'Keep the strongest visual beat and rewrite the CTA around reuse.';

  return [
    {
      id: `scene-${Date.now().toString(36)}-1`,
      title: 'Open with the payoff',
      summary: 'Start from the reason this source matters.',
      analysisLines: [
        `The source already has a strong ${resolvedNiche.toLowerCase()} cue in the first second.`,
        'Lead with the payoff first, then explain the process.',
      ],
      recipeLines: [
        `Hook: “Here’s the ${title.trim() || 'idea'} format I’d actually reuse.”`,
        `Restate the goal as: “${resolvedGoal}.”`,
      ],
      prompterLines: ['One-sentence promise first.', 'Pause before the second beat.'],
    },
    {
      id: `scene-${Date.now().toString(36)}-2`,
      title: 'Turn motion into proof',
      summary: 'Sequence the middle so every cut proves the claim.',
      analysisLines: [
        'Group similar actions together so the edit feels intentional.',
        `Use ${resolvedNiche.toLowerCase()} language that sounds operational, not promotional.`,
      ],
      recipeLines: [
        'Show 2-3 proof beats with a tighter crop and cleaner caption.',
        'Replace vague adjectives with one concrete cue per cut.',
      ],
      prompterLines: ['Cut on hand motion.', 'Keep each line under six words.'],
    },
    {
      id: `scene-${Date.now().toString(36)}-3`,
      title: 'Land on the reusable system',
      summary: 'Finish with the template the viewer can steal.',
      analysisLines: [
        'The ending works best when it gives the viewer a system, not just a vibe.',
        `Preserve this note: ${resolvedNotes}`,
      ],
      recipeLines: [
        'Close with a repeatable format or checklist.',
        'Hold the last frame long enough for the save beat.',
      ],
      prompterLines: ['Lower the voice for the final line.', 'Leave one beat for the save CTA.'],
    },
  ];
}

export function MockWorkspaceProvider({ children }: PropsWithChildren) {
  const [recentReferences, setRecentReferences] = useState<MockReference[]>(recentReferencesSeed);
  const [recipes, setRecipes] = useState<MockRecipe[]>(recipesSeed);
  const [trendingReferences, setTrendingReferences] = useState<MockReference[]>(trendingReferencesSeed);
  const [prompterSelections, setPrompterSelections] = useState<PrompterSelectionState>({});

  const toggleLikeReference = (referenceId: string) => {
    setTrendingReferences((current) =>
      current.map((reference) =>
        reference.id === referenceId
          ? {
              ...reference,
              isLiked: !reference.isLiked,
              likes: reference.isLiked ? reference.likes - 1 : reference.likes + 1,
            }
          : reference
      )
    );
  };

  const createRecipeDraft = ({ title, videoUrl = '', niche = '', goal = '', notes = '' }: CreateRecipeDraftInput) => {
    const platform = guessPlatform(videoUrl);
    const draftId = `recipe-${Date.now().toString(36)}`;
    const resolvedTitle = title.trim() || 'Untitled Recipe Draft';

    const recipe: MockRecipe = {
      id: draftId,
      title: resolvedTitle,
      creator: '@parrotkit',
      platform,
      thumbnail: platform === 'YouTube Shorts'
        ? 'https://img.youtube.com/vi/isQbx375vSo/maxresdefault.jpg'
        : 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80',
      savedAt: 'Saved just now',
      sourceUrl: videoUrl.trim(),
      summary: `${resolvedTitle} is now a local draft recipe shell you can shape before wiring real analysis.`,
      niche: niche.trim() || 'Creator',
      goal: goal.trim() || 'Sharper pacing',
      notes: notes.trim(),
      scenes: buildScenes(resolvedTitle, niche, goal, notes),
    };

    const reference: MockReference = {
      id: `recent-${Date.now().toString(36)}`,
      title: resolvedTitle,
      creator: '@parrotkit',
      thumbnail: recipe.thumbnail,
      duration: '00:29',
      views: 'Draft',
      likes: 0,
      category: niche.trim() || 'Creator',
      platform,
      videoUrl: videoUrl.trim(),
      createdAt: 'Just now',
      isLiked: false,
      recipeId: draftId,
    };

    setRecipes((current) => [recipe, ...current]);
    setRecentReferences((current) => [reference, ...current].slice(0, 4));

    return recipe;
  };

  const getPrompterSelection = useCallback(
    (recipeId: string, scene: MockRecipeScene) =>
      prompterSelections[recipeId]?.[scene.id] ?? getDefaultPrompterSelection(scene),
    [prompterSelections]
  );

  const setPrompterSelection = useCallback((recipeId: string, sceneId: string, elementIds: string[]) => {
    const nextIds = Array.from(new Set(elementIds));

    setPrompterSelections((current) => ({
      ...current,
      [recipeId]: {
        ...(current[recipeId] ?? {}),
        [sceneId]: nextIds,
      },
    }));
  }, []);

  const updateScenePrompterBlockVisibility = useCallback((recipeId: string, sceneId: string, blockId: string, visible: boolean) => {
    setRecipes((currentRecipes) =>
      currentRecipes.map((recipe) => {
        if (recipe.id !== recipeId) {
          return recipe;
        }

        return {
          ...recipe,
          scenes: recipe.scenes.map((scene, sceneIndex) => {
            if (scene.id !== sceneId) {
              return scene;
            }

            const normalized = normalizeNativeRecipeScene(scene, sceneIndex, recipe.thumbnail);

            return {
              ...scene,
              prompter: {
                blocks: normalized.prompter.blocks.map((block) =>
                  block.id === blockId
                    ? {
                        ...block,
                        visible,
                      }
                    : block
                ),
              },
            };
          }),
        };
      })
    );

    setPrompterSelections((current) => {
      const currentRecipe = current[recipeId] ?? {};
      const currentSelection = currentRecipe[sceneId] ?? [];
      const nextSelection = visible
        ? Array.from(new Set([...currentSelection, blockId]))
        : currentSelection.filter((id) => id !== blockId);

      return {
        ...current,
        [recipeId]: {
          ...currentRecipe,
          [sceneId]: nextSelection,
        },
      };
    });
  }, []);

  const updateScenePrompterBlockContent = useCallback((recipeId: string, sceneId: string, blockId: string, content: string) => {
    const nextContent = content.trim();
    if (!nextContent) {
      return;
    }

    setRecipes((currentRecipes) =>
      currentRecipes.map((recipe) => {
        if (recipe.id !== recipeId) {
          return recipe;
        }

        return {
          ...recipe,
          scenes: recipe.scenes.map((scene, sceneIndex) => {
            if (scene.id !== sceneId) {
              return scene;
            }

            const normalized = normalizeNativeRecipeScene(scene, sceneIndex, recipe.thumbnail);

            return {
              ...scene,
              prompter: {
                blocks: normalized.prompter.blocks.map((block) =>
                  block.id === blockId
                    ? {
                        ...block,
                        content: nextContent,
                      }
                    : block
                ),
              },
            };
          }),
        };
      })
    );
  }, []);

  const togglePrompterSelection = useCallback((recipeId: string, scene: MockRecipeScene, elementId: string) => {
    const normalized = normalizeNativeRecipeScene(scene, 0, '');
    const currentBlock = normalized.prompter.blocks.find((block) => block.id === elementId);

    if (currentBlock) {
      updateScenePrompterBlockVisibility(recipeId, scene.id, elementId, !currentBlock.visible);
      return;
    }

    setPrompterSelections((current) => {
      const currentSelection = current[recipeId]?.[scene.id] ?? getDefaultPrompterSelection(scene);
      const nextSelection = currentSelection.includes(elementId)
        ? currentSelection.filter((id) => id !== elementId)
        : [...currentSelection, elementId];

      return {
        ...current,
        [recipeId]: {
          ...(current[recipeId] ?? {}),
          [scene.id]: nextSelection,
        },
      };
    });
  }, [updateScenePrompterBlockVisibility]);

  const likedReferences = useMemo(
    () => trendingReferences.filter((reference) => reference.isLiked),
    [trendingReferences]
  );

  const homeStats = useMemo(
    () => ({
      references: recentReferences.length,
      recipes: recipes.length,
      views: 124000,
    }),
    [recentReferences.length, recipes.length]
  );

  const sourceStats = useMemo(
    () => ({
      links: recentReferences.length,
      drafts: recipes.length,
      imports: 4,
      queue: 2,
    }),
    [recentReferences.length, recipes.length]
  );

  const getRecipeById = (recipeId: string) => recipes.find((recipe) => recipe.id === recipeId) ?? null;

  const value = useMemo<MockWorkspaceContextValue>(
    () => ({
      partnerCreators,
      profile: profileSeed,
      recentReferences,
      recipes,
      trendingReferences,
      likedReferences,
      homeStats,
      sourceStats,
      toggleLikeReference,
      createRecipeDraft,
      getRecipeById,
      getPrompterSelection,
      setPrompterSelection,
      togglePrompterSelection,
      updateScenePrompterBlockVisibility,
      updateScenePrompterBlockContent,
    }),
    [
      createRecipeDraft,
      getPrompterSelection,
      getRecipeById,
      homeStats,
      likedReferences,
      recentReferences,
      recipes,
      setPrompterSelection,
      sourceStats,
      toggleLikeReference,
      togglePrompterSelection,
      trendingReferences,
      updateScenePrompterBlockContent,
      updateScenePrompterBlockVisibility,
    ]
  );

  return <MockWorkspaceContext.Provider value={value}>{children}</MockWorkspaceContext.Provider>;
}

export function useMockWorkspace() {
  const context = useContext(MockWorkspaceContext);

  if (!context) {
    throw new Error('useMockWorkspace must be used within MockWorkspaceProvider.');
  }

  return context;
}
