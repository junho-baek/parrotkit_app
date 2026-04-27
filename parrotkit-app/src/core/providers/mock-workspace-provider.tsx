import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import {
  MockPlatform,
  MockRecipe,
  MockRecipeScene,
  MockRecordedTake,
  MockReference,
  exploreRecipeSeeds,
  partnerCreators,
  profileSeed,
  recentReferencesSeed,
  recipesSeed,
  trendingReferencesSeed,
} from '@/core/mocks/parrotkit-data';
import { getDefaultPrompterSelection } from '@/features/recipes/lib/mock-prompter-elements';
import { normalizeNativeRecipeScene } from '@/features/recipes/lib/recipe-domain-normalizer';
import {
  getContinueShootRecipe as selectContinueShootRecipe,
  getLatestShootableRecipe as selectLatestShootableRecipe,
} from '@/features/recipes/lib/recipe-ownership';
import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

type CreateRecipeDraftInput = {
  title: string;
  videoUrl?: string;
  niche?: string;
  goal?: string;
  notes?: string;
};

type CreateQuickShootRecipeInput = {
  blocks: PrompterBlock[];
  title?: string;
};

type MockWorkspaceContextValue = {
  partnerCreators: typeof partnerCreators;
  profile: typeof profileSeed;
  recentReferences: MockReference[];
  recipes: MockRecipe[];
  exploreRecipes: MockRecipe[];
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
  createQuickShootRecipe: (input: CreateQuickShootRecipeInput) => MockRecipe;
  downloadRecipe: (recipeId: string) => MockRecipe | null;
  getContinueShootRecipe: () => MockRecipe | null;
  getLatestShootableRecipe: () => MockRecipe | null;
  getRecipeById: (recipeId: string) => MockRecipe | null;
  isRecipeDownloaded: (recipeId: string) => boolean;
  getPrompterSelection: (recipeId: string, scene: MockRecipeScene) => string[];
  setPrompterSelection: (recipeId: string, sceneId: string, elementIds: string[]) => void;
  togglePrompterSelection: (recipeId: string, scene: MockRecipeScene, elementId: string) => void;
  updateScenePrompterBlock: (
    recipeId: string,
    sceneId: string,
    blockId: string,
    updates: Partial<PrompterBlock>
  ) => void;
  updateScenePrompterBlockVisibility: (recipeId: string, sceneId: string, blockId: string, visible: boolean) => void;
  updateScenePrompterBlockContent: (recipeId: string, sceneId: string, blockId: string, content: string) => void;
  addScenePrompterBlock: (recipeId: string, sceneId: string) => string | null;
  hideScenePrompterBlock: (recipeId: string, sceneId: string, blockId: string) => void;
  getSceneRecordedTake: (recipeId: string, sceneId: string) => MockRecordedTake | null;
  setSceneRecordedTake: (recipeId: string, sceneId: string, take: MockRecordedTake) => void;
  clearSceneRecordedTake: (recipeId: string, sceneId: string) => void;
};

const MockWorkspaceContext = createContext<MockWorkspaceContextValue | null>(null);

type PrompterSelectionState = Record<string, Record<string, string[]>>;
type RecordedTakeState = Record<string, Record<string, MockRecordedTake>>;
type WorkspaceState = {
  recipes: MockRecipe[];
  prompterSelections: PrompterSelectionState;
};
type StateUpdate<T> = T | ((current: T) => T);

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

function compactCueContent(content: string, fallback: string) {
  const cleaned = content.trim().replace(/\s+/g, ' ');

  return cleaned || fallback;
}

function titleFromCue(content: string, index: number) {
  const cleaned = compactCueContent(content, `Cut ${index + 1}`);

  if (cleaned.length <= 34) {
    return cleaned;
  }

  return `${cleaned.slice(0, 34).trim()}...`;
}

export function MockWorkspaceProvider({ children }: PropsWithChildren) {
  const [recentReferences, setRecentReferences] = useState<MockReference[]>(recentReferencesSeed);
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>({
    recipes: recipesSeed,
    prompterSelections: {},
  });
  const [trendingReferences, setTrendingReferences] = useState<MockReference[]>(trendingReferencesSeed);
  const [recordedTakes, setRecordedTakes] = useState<RecordedTakeState>({});
  const { recipes, prompterSelections } = workspaceState;

  const setRecipes = useCallback((update: StateUpdate<MockRecipe[]>) => {
    setWorkspaceState((current) => ({
      ...current,
      recipes: typeof update === 'function' ? update(current.recipes) : update,
    }));
  }, []);

  const setPrompterSelections = useCallback((update: StateUpdate<PrompterSelectionState>) => {
    setWorkspaceState((current) => ({
      ...current,
      prompterSelections: typeof update === 'function' ? update(current.prompterSelections) : update,
    }));
  }, []);

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
      ownership: 'owned',
      verification: 'community',
      ownerHandle: '@parrotkitcodextest',
      ownerName: 'You',
      downloadCount: 0,
      shootStatus: 'draft',
      shotSceneCount: 0,
      totalSceneCount: 3,
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

  const createQuickShootRecipe = useCallback(({ blocks, title = 'Quick Shoot Recipe' }: CreateQuickShootRecipeInput) => {
    const visibleBlocks = blocks
      .filter((block) => block.visible)
      .sort((first, second) => first.order - second.order);
    const sourceBlocks = visibleBlocks.length > 0 ? visibleBlocks : blocks.slice(0, 1);
    const recipeId = `recipe-${Date.now().toString(36)}`;
    const resolvedTitle = title.trim() || 'Quick Shoot Recipe';
    const thumbnail = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80';
    const scenes: MockRecipeScene[] = sourceBlocks.map((block, index) => {
      const cueContent = compactCueContent(block.content, `Cut ${index + 1}`);
      const sceneId = `scene-${recipeId}-${index + 1}`;

      return {
        id: sceneId,
        sceneNumber: index + 1,
        title: titleFromCue(cueContent, index),
        summary: `Cut ${index + 1}: ${cueContent}`,
        analysisLines: [],
        recipeLines: [cueContent],
        prompterLines: [cueContent],
        recipe: {
          objective: `Shoot cut ${index + 1} from your quick prompt.`,
          appealPoint: cueContent,
          keyLine: cueContent,
          scriptLines: [cueContent],
          keyMood: 'Direct creator note',
          keyAction: 'Treat this cue as one clean beat.',
          mustInclude: [cueContent],
          mustAvoid: [],
          cta: '',
        },
        prompter: {
          blocks: [
            {
              ...block,
              id: `${sceneId}-${block.id}`,
              label: block.label ?? `Cut ${index + 1}`,
              content: cueContent,
              order: 0,
              visible: true,
            },
          ],
        },
      };
    });

    const recipe: MockRecipe = {
      id: recipeId,
      title: resolvedTitle,
      creator: '@parrotkit',
      platform: 'TikTok',
      thumbnail,
      savedAt: 'Saved just now',
      sourceUrl: '',
      summary: `${sourceBlocks.length} quick shoot ${sourceBlocks.length === 1 ? 'cue' : 'cues'} turned into a cut-by-cut recipe.`,
      niche: 'Creator',
      goal: 'Shoot a multi-cut prompt',
      notes: 'Created from Quick Shoot.',
      ownership: 'owned',
      verification: 'community',
      ownerHandle: '@parrotkitcodextest',
      ownerName: 'You',
      downloadCount: 0,
      shootStatus: 'continue',
      shotSceneCount: 0,
      totalSceneCount: scenes.length,
      lastShotAt: 'Created just now',
      scenes,
    };

    const reference: MockReference = {
      id: `recent-${Date.now().toString(36)}`,
      title: resolvedTitle,
      creator: '@parrotkit',
      thumbnail,
      duration: `${sourceBlocks.length} ${sourceBlocks.length === 1 ? 'cut' : 'cuts'}`,
      views: 'Draft',
      likes: 0,
      category: 'Quick Shoot',
      platform: 'TikTok',
      videoUrl: '',
      createdAt: 'Just now',
      isLiked: false,
      recipeId,
    };

    setRecipes((current) => [recipe, ...current]);
    setRecentReferences((current) => [reference, ...current].slice(0, 4));

    return recipe;
  }, [setRecipes]);

  const downloadRecipe = useCallback((recipeId: string) => {
    const sourceRecipe = exploreRecipeSeeds.find((recipe) => recipe.id === recipeId);

    if (!sourceRecipe) {
      return null;
    }

    const downloadedRecipeId = `downloaded-${sourceRecipe.id}`;
    const existingDownloadedRecipe = recipes.find((recipe) => recipe.id === downloadedRecipeId);

    if (existingDownloadedRecipe) {
      return existingDownloadedRecipe;
    }

    const downloadedRecipe: MockRecipe = {
      ...sourceRecipe,
      id: downloadedRecipeId,
      ownership: 'downloaded',
      savedAt: 'Saved just now',
      shootStatus: 'ready',
      shotSceneCount: 0,
      totalSceneCount: sourceRecipe.scenes.length,
    };

    setRecipes((current) => {
      const currentDownloadedRecipe = current.find((recipe) => recipe.id === downloadedRecipeId);

      if (currentDownloadedRecipe) {
        return current;
      }

      return [downloadedRecipe, ...current];
    });

    return downloadedRecipe;
  }, [recipes, setRecipes]);

  const getContinueShootRecipe = useCallback(
    () => selectContinueShootRecipe(recipes),
    [recipes]
  );

  const getLatestShootableRecipe = useCallback(
    () => selectLatestShootableRecipe(recipes),
    [recipes]
  );

  const isRecipeDownloaded = useCallback(
    (recipeId: string) => {
      const sourceRecipe = exploreRecipeSeeds.find((recipe) => recipe.id === recipeId);

      if (!sourceRecipe) {
        return false;
      }

      const downloadedRecipeId = `downloaded-${sourceRecipe.id}`;

      return recipes.some((recipe) => recipe.id === downloadedRecipeId);
    },
    [recipes]
  );

  const getPrompterSelection = useCallback(
    (recipeId: string, scene: MockRecipeScene) =>
      prompterSelections[recipeId]?.[scene.id] ?? getDefaultPrompterSelection(scene),
    [prompterSelections]
  );

  const setPrompterSelection = useCallback((recipeId: string, sceneId: string, elementIds: string[]) => {
    const elementIdSet = new Set(elementIds);

    setWorkspaceState((current) => {
      let nextIds = Array.from(elementIdSet);

      const nextRecipes = current.recipes.map((currentRecipe) => {
        if (currentRecipe.id !== recipeId) {
          return currentRecipe;
        }

        return {
          ...currentRecipe,
          scenes: currentRecipe.scenes.map((currentScene, currentSceneIndex) => {
            if (currentScene.id !== sceneId) {
              return currentScene;
            }

            const currentNormalized = normalizeNativeRecipeScene(
              currentScene,
              currentSceneIndex,
              currentRecipe.thumbnail
            );
            nextIds = currentNormalized.prompter.blocks
              .filter((block) => elementIdSet.has(block.id))
              .map((block) => block.id);
            const nextIdSet = new Set(nextIds);

            return {
              ...currentScene,
              prompter: {
                blocks: currentNormalized.prompter.blocks.map((block) => ({
                  ...block,
                  visible: nextIdSet.has(block.id),
                })),
              },
            };
          }),
        };
      });

      return {
        ...current,
        recipes: nextRecipes,
        prompterSelections: {
          ...current.prompterSelections,
          [recipeId]: {
            ...(current.prompterSelections[recipeId] ?? {}),
            [sceneId]: nextIds,
          },
        },
      };
    });
  }, []);

  const updateScenePrompterBlock = useCallback((
    recipeId: string,
    sceneId: string,
    blockId: string,
    updates: Partial<PrompterBlock>
  ) => {
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
                        ...updates,
                        content: typeof updates.content === 'string'
                          ? updates.content.trim() || block.content
                          : block.content,
                      }
                    : block
                ),
              },
            };
          }),
        };
      })
    );

    if (typeof updates.visible === 'boolean') {
      const recipe = recipes.find((currentRecipe) => currentRecipe.id === recipeId);
      const sceneIndex = recipe?.scenes.findIndex((scene) => scene.id === sceneId) ?? -1;
      const scene = sceneIndex >= 0 ? recipe?.scenes[sceneIndex] : null;
      const baseSelection = scene
        ? normalizeNativeRecipeScene(scene, sceneIndex, recipe?.thumbnail ?? '').prompter.blocks
            .filter((block) => block.visible)
            .map((block) => block.id)
        : [];

      setPrompterSelections((current) => {
        const currentRecipe = current[recipeId] ?? {};
        const currentSelection = currentRecipe[sceneId] ?? baseSelection;
        const nextSelection = updates.visible
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
    }
  }, [recipes]);

  const updateScenePrompterBlockVisibility = useCallback((recipeId: string, sceneId: string, blockId: string, visible: boolean) => {
    updateScenePrompterBlock(recipeId, sceneId, blockId, { visible });
  }, [updateScenePrompterBlock]);

  const updateScenePrompterBlockContent = useCallback((recipeId: string, sceneId: string, blockId: string, content: string) => {
    updateScenePrompterBlock(recipeId, sceneId, blockId, { content });
  }, [updateScenePrompterBlock]);

  const addScenePrompterBlock = useCallback((recipeId: string, sceneId: string) => {
    const recipe = recipes.find((currentRecipe) => currentRecipe.id === recipeId);
    const sceneIndex = recipe?.scenes.findIndex((scene) => scene.id === sceneId) ?? -1;
    const scene = sceneIndex >= 0 ? recipe?.scenes[sceneIndex] : null;

    if (!recipe || !scene) {
      return null;
    }

    const newBlockId = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const baseSelection = normalizeNativeRecipeScene(scene, sceneIndex, recipe.thumbnail).prompter.blocks
      .filter((block) => block.visible)
      .map((block) => block.id);

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
                blocks: [
                  ...normalized.prompter.blocks,
                  {
                    id: newBlockId,
                    type: 'keyword',
                    label: 'Cue',
                    content: 'New cue',
                    accentColor: 'blue',
                    visible: true,
                    size: 'md',
                    positionPreset: 'upperThird',
                    scale: 1,
                    order: normalized.prompter.blocks.reduce((max, block) => Math.max(max, block.order), 0) + 1,
                  },
                ],
              },
            };
          }),
        };
      })
    );

    setPrompterSelections((current) => {
      const currentRecipe = current[recipeId] ?? {};
      const currentSelection = currentRecipe[sceneId] ?? baseSelection;

      return {
        ...current,
        [recipeId]: {
          ...currentRecipe,
          [sceneId]: Array.from(new Set([...currentSelection, newBlockId])),
        },
      };
    });

    return newBlockId;
  }, [recipes]);

  const hideScenePrompterBlock = useCallback((recipeId: string, sceneId: string, blockId: string) => {
    updateScenePrompterBlock(recipeId, sceneId, blockId, { visible: false });
  }, [updateScenePrompterBlock]);

  const getSceneRecordedTake = useCallback(
    (recipeId: string, sceneId: string) => recordedTakes[recipeId]?.[sceneId] ?? null,
    [recordedTakes]
  );

  const setSceneRecordedTake = useCallback((recipeId: string, sceneId: string, take: MockRecordedTake) => {
    setRecordedTakes((current) => ({
      ...current,
      [recipeId]: {
        ...(current[recipeId] ?? {}),
        [sceneId]: take,
      },
    }));
  }, []);

  const clearSceneRecordedTake = useCallback((recipeId: string, sceneId: string) => {
    setRecordedTakes((current) => {
      const recipeTakes = current[recipeId];
      if (!recipeTakes?.[sceneId]) {
        return current;
      }

      const nextRecipe = { ...recipeTakes };
      delete nextRecipe[sceneId];

      if (Object.keys(nextRecipe).length === 0) {
        const nextRecordedTakes = { ...current };
        delete nextRecordedTakes[recipeId];
        return nextRecordedTakes;
      }

      return {
        ...current,
        [recipeId]: nextRecipe,
      };
    });
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
      exploreRecipes: exploreRecipeSeeds,
      trendingReferences,
      likedReferences,
      homeStats,
      sourceStats,
      toggleLikeReference,
      createRecipeDraft,
      createQuickShootRecipe,
      downloadRecipe,
      getContinueShootRecipe,
      getLatestShootableRecipe,
      getRecipeById,
      isRecipeDownloaded,
      getPrompterSelection,
      setPrompterSelection,
      togglePrompterSelection,
      updateScenePrompterBlock,
      updateScenePrompterBlockVisibility,
      updateScenePrompterBlockContent,
      addScenePrompterBlock,
      hideScenePrompterBlock,
      getSceneRecordedTake,
      setSceneRecordedTake,
      clearSceneRecordedTake,
    }),
    [
      addScenePrompterBlock,
      clearSceneRecordedTake,
      createRecipeDraft,
      createQuickShootRecipe,
      downloadRecipe,
      getContinueShootRecipe,
      getLatestShootableRecipe,
      getSceneRecordedTake,
      getPrompterSelection,
      getRecipeById,
      hideScenePrompterBlock,
      homeStats,
      isRecipeDownloaded,
      likedReferences,
      recentReferences,
      recipes,
      setPrompterSelection,
      setSceneRecordedTake,
      sourceStats,
      toggleLikeReference,
      togglePrompterSelection,
      trendingReferences,
      updateScenePrompterBlock,
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
