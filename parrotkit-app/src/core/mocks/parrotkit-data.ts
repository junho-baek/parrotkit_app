import { ugcMedia } from '@/core/mocks/ugc-media';
import type {
  CreatorTrust,
  PartnerCreator,
  Recipe,
  RecipeOwnership,
  RecipePlatform,
  RecipeScene,
  RecipeShootStatus,
  RecipeVerification,
  Reference,
} from '@/domain/recipes/recipe';
import type { SavedTakePersistenceContract } from '@/domain/takes/saved-take-contract';

export type MockPlatform = RecipePlatform;

export type MockCreatorTrust = CreatorTrust;
export type MockRecipeOwnership = RecipeOwnership;
export type MockRecipeVerification = RecipeVerification;
export type MockRecipeShootStatus = RecipeShootStatus;

export type MockReference = Reference;

export type MockPartnerCreator = PartnerCreator;

export type MockTakeExportStatus = 'local' | 'gallery_saved' | 'shared';

export type MockProjectTake = {
  id: string;
  uri: string;
  createdAt: string;
  label: string;
  exportStatus: MockTakeExportStatus;
  savedTake?: SavedTakePersistenceContract;
  exportedToGalleryAt?: string;
  sharedAt?: string;
};

export type MockSceneTakeCollection = {
  sceneId: string;
  bestTakeId?: string;
  takes: MockProjectTake[];
};

export type MockRecipeTakeProject = {
  id: string;
  recipeId: string;
  updatedAt: string;
  scenes: Record<string, MockSceneTakeCollection>;
};

export type MockQuickTakeProject = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  bestTakeId?: string;
  takes: MockProjectTake[];
};

export type MockRecipeScene = RecipeScene;

export type MockRecipe = Recipe;

export type MockProfile = {
  name: string;
  handle: string;
  role: string;
  bio: string;
  focusTags: string[];
  streakDays: number;
};

export function markRecipeBoardExplicitCompletion(
  recipes: MockRecipe[],
  recipeId: string,
  explicitCompletion = true,
) {
  return recipes.map((recipe) =>
    recipe.id === recipeId
      ? {
          ...recipe,
          explicitCompletion,
        }
      : recipe,
  );
}

export const rotatingPlatforms: MockPlatform[] = ['Instagram Reels', 'TikTok', 'YouTube Shorts'];

export const partnerCreators: MockPartnerCreator[] = [
  {
    id: 'creator-1',
    name: 'Minho Eats',
    handle: '@minhoeats',
    avatar: 'https://img.youtube.com/vi/JhBOUaCkltg/mqdefault.jpg',
    trust: 'verified',
    specialty: 'Food hooks',
  },
  {
    id: 'creator-2',
    name: 'Ava Beauty',
    handle: '@avabeauty',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    trust: 'verified',
    specialty: 'Beauty routines',
  },
  {
    id: 'creator-3',
    name: 'Coach Leon',
    handle: '@coachleon',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    trust: 'verified',
    specialty: 'Fitness proof',
  },
  {
    id: 'creator-4',
    name: 'Lena Builds',
    handle: '@lenabuilds',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
    trust: 'community',
    specialty: 'Founder story',
  },
  {
    id: 'creator-5',
    name: 'Miles Away',
    handle: '@milesaway',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    trust: 'community',
    specialty: 'Travel edits',
  },
];

export const trendingReferencesSeed: MockReference[] = [
  {
    id: 'trend-1',
    title: 'Amazing Cooking Shorts',
    creator: '@CookingChannel',
    thumbnail: ugcMedia.foodPromo.image,
    duration: '00:25',
    views: '5.4M',
    likes: 450,
    category: 'Cooking',
    platform: 'YouTube Shorts',
    videoUrl: 'mock://ugc-food-promo',
    createdAt: '2 hours ago',
    isLiked: true,
    recipeId: 'recipe-korean-diet-hook',
  },
  {
    id: 'trend-2',
    title: 'Food Promo Hook Guide',
    creator: '@FoodMaster',
    thumbnail: ugcMedia.foodPromo.image,
    duration: '00:30',
    views: '3.2M',
    likes: 320,
    category: 'Cooking',
    platform: 'TikTok',
    videoUrl: 'mock://ugc-food-promo-proof',
    createdAt: '5 hours ago',
    isLiked: false,
    recipeId: 'recipe-airfryer-stack',
  },
  {
    id: 'trend-3',
    title: 'Beauty Conversion Hook Guide',
    creator: '@avabeauty',
    thumbnail: ugcMedia.beautyHero.image,
    duration: '00:21',
    views: '1.8M',
    likes: 184,
    category: 'Beauty',
    platform: 'Instagram Reels',
    videoUrl: 'mock://ugc-beauty-conversion',
    createdAt: '8 hours ago',
    isLiked: false,
  },
  {
    id: 'trend-4',
    title: 'Problem-to-Proof App Demo Guide',
    creator: '@coachleon',
    thumbnail: ugcMedia.appDemo.image,
    duration: '00:28',
    views: '2.1M',
    likes: 231,
    category: 'Fitness',
    platform: 'Instagram Reels',
    videoUrl: 'mock://ugc-app-demo',
    createdAt: '1 day ago',
    isLiked: true,
  },
];

export const recentReferencesSeed: MockReference[] = [
  {
    id: 'recent-1',
    title: 'Food Promo Hook Guide',
    creator: '@CookingMaster',
    thumbnail: ugcMedia.foodPromo.image,
    duration: '00:25',
    views: '5.4K',
    likes: 92,
    category: 'Cooking',
    platform: 'YouTube Shorts',
    videoUrl: 'mock://ugc-food-promo',
    createdAt: '2 hours ago',
    isLiked: false,
    recipeId: 'recipe-korean-diet-hook',
  },
  {
    id: 'recent-2',
    title: 'App Problem Hook Guide',
    creator: '@copylab',
    thumbnail: ugcMedia.appDemo.image,
    duration: '00:19',
    views: '12K',
    likes: 64,
    category: 'Creator',
    platform: 'Instagram Reels',
    videoUrl: 'mock://ugc-app-problem-hook',
    createdAt: 'Yesterday',
    isLiked: false,
    recipeId: 'recipe-airfryer-stack',
  },
];

export const recipesSeed: MockRecipe[] = [
  {
    id: 'recipe-korean-diet-hook',
    title: 'Food Promo Shooting Guide',
    creator: '@fit.frames',
    platform: 'Instagram Reels',
    thumbnail: ugcMedia.foodPromo.image,
    savedAt: 'Saved 2h ago',
    sourceUrl: 'mock://food-promo-shooting-guide',
    referenceVideoSource: ugcMedia.foodPromo.video,
    summary: 'A reusable guide for promoting food with a result-first hook, quick proof visual, and save-worthy CTA.',
    niche: 'Cooking',
    goal: 'Promote food with a clear hook',
    notes: 'Use this when the product or dish needs to look craveable before the explanation starts.',
    ownership: 'owned',
    verification: 'verified_creator',
    ownerHandle: '@fit.frames',
    ownerName: 'Fit Frames',
    downloadCount: 1280,
    shootStatus: 'continue',
    shotSceneCount: 2,
    totalSceneCount: 3,
    lastShotAt: 'Last shot 18m ago',
    scenes: [
      {
        id: 'scene-1',
        sceneNumber: 1,
        title: 'Immediate promise',
        summary: 'Lead with the payoff before the process.',
        startTime: '00:00',
        endTime: '00:05',
        thumbnail: ugcMedia.foodPromo.image,
        analysisLines: [
          'Open on the strongest food/result contrast in the first second.',
          'Use the creator face only after the promise is clear.',
        ],
        recipeLines: [
          'Hook: “I stopped overthinking diet food and this is what finally stuck.”',
          'Cut from plated meal to creator reaction in under 1 second.',
        ],
        prompterLines: ['State the promise in one breath.', 'Smile on the reveal shot.'],
        analysis: {
          transcriptOriginal: ['I stopped overthinking diet food and this is what finally stuck.'],
          transcriptSnippet: 'I stopped overthinking diet food and this is what finally stuck.',
          motionDescription: 'The reference opens on the strongest food/result contrast, then cuts quickly to the creator reaction.',
          whyItWorks: [
            'The payoff appears before the explanation, so the viewer knows why to keep watching.',
            'The creator face arrives after the promise, which makes the reaction feel earned.',
          ],
          referenceSignals: [],
        },
        recipe: {
          objective: 'Turn the opening into a reusable promise-first hook.',
          appealPoint: 'Lead with the payoff before the process.',
          keyLine: 'I stopped overthinking diet food and this is what finally stuck.',
          scriptLines: [
            'I stopped overthinking diet food and this is what finally stuck.',
            'Cut from plated meal to creator reaction in under 1 second.',
          ],
          keyMood: 'Confident, relieved, direct',
          keyAction: 'Show plated result first, then creator reaction.',
          mustInclude: ['Payoff first', 'Creator reaction after promise'],
          mustAvoid: ['Do not explain the process before the result'],
          cta: '',
        },
        prompter: {
          blocks: [
            {
              id: 'key-line',
              type: 'key_line',
              label: 'Main Script',
              content: 'I stopped overthinking diet food and this is what finally stuck.',
              accentColor: 'blue',
              visible: true,
              size: 'xl',
              positionPreset: 'lowerThird',
              scale: 1,
              order: 1,
            },
            {
              id: 'action',
              type: 'action',
              label: 'Action',
              content: 'Meal first, reaction second',
              accentColor: 'coral',
              visible: true,
              size: 'md',
              positionPreset: 'upperThird',
              scale: 1,
              order: 2,
            },
            {
              id: 'avoid',
              type: 'warning',
              label: 'Avoid',
              content: 'Do not explain before payoff',
              accentColor: 'yellow',
              visible: false,
              size: 'sm',
              positionPreset: 'top',
              scale: 1,
              order: 3,
            },
          ],
        },
      },
      {
        id: 'scene-2',
        title: 'Proof in motion',
        summary: 'Show texture and speed to make the meal feel easy.',
        analysisLines: [
          'The original edit stacks three food cuts to prove variety.',
          'The hands stay centered to keep the rhythm readable.',
        ],
        recipeLines: [
          'Show prep, drizzle, and final bite in a 3-cut sequence.',
          'Add an on-screen caption: “20 min, high protein, zero mental load.”',
        ],
        prompterLines: ['Keep hands centered.', 'Pause half a beat on the final bite.'],
      },
      {
        id: 'scene-3',
        title: 'Actionable finish',
        summary: 'End with one reusable takeaway instead of a generic CTA.',
        analysisLines: [
          'The source video closes on a vague lifestyle statement.',
          'A stronger ending would restate the system behind the meal.',
        ],
        recipeLines: [
          'Close with: “Build one plate you can repeat all week.”',
          'Hold the final frame long enough for the caption to land.',
        ],
        prompterLines: ['Lower your voice slightly for the closer.', 'Hold the plate steady for the last frame.'],
      },
    ],
  },
  {
    id: 'recipe-airfryer-stack',
    title: 'Problem Hook Food Demo Guide',
    creator: '@kitchen.frames',
    platform: 'TikTok',
    thumbnail: ugcMedia.foodPromo.image,
    savedAt: 'Saved yesterday',
    sourceUrl: 'mock://problem-hook-food-demo',
    referenceVideoSource: ugcMedia.foodPromo.video,
    summary: 'A food promotion guide for turning one product or meal into a clear problem, proof, and appetite payoff.',
    niche: 'Cooking',
    goal: 'Cleaner mid-video pacing',
    notes: 'Keep the crunchy sound moment and the stack reveal, but simplify the ingredient callouts.',
    ownership: 'downloaded',
    verification: 'verified_creator',
    ownerHandle: '@minhoeats',
    ownerName: 'Minho Eats',
    downloadCount: 894,
    shootStatus: 'ready',
    shotSceneCount: 0,
    totalSceneCount: 3,
    scenes: [
      {
        id: 'scene-1b',
        title: 'Setup the craving',
        summary: 'Use one sensory phrase to create appetite fast.',
        analysisLines: [
          'The source opens with a close crop and audible crunch.',
          'It works because the first frame already implies texture.',
        ],
        recipeLines: [
          'Open on the stack cut-open shot.',
          'Caption: “The air fryer lunch I keep making on repeat.”',
        ],
        prompterLines: ['Let the crunch breathe.', 'Don’t over-explain ingredients yet.'],
      },
      {
        id: 'scene-2b',
        title: 'Build the stack',
        summary: 'Sequence ingredients in the order the viewer can copy.',
        analysisLines: [
          'The original mid-section moves too quickly between layers.',
          'Re-ordering the cuts makes the build feel simpler.',
        ],
        recipeLines: [
          'Layer bread, protein, sauce, cheese, then air fryer close.',
          'Use short lower-third labels for each layer.',
        ],
        prompterLines: ['Keep each layer to one sentence.', 'Match the cut to the hand motion.'],
      },
      {
        id: 'scene-3b',
        title: 'Repeatable payoff',
        summary: 'Close with the one thing that makes the meal repeatable.',
        analysisLines: [
          'The repeatability angle is present but buried.',
          'Ending on the system, not the taste, makes the format reusable.',
        ],
        recipeLines: [
          'Close with: “Save this as your 12-minute lunch template.”',
          'Freeze on the final cross-section for the save beat.',
        ],
        prompterLines: ['Point to the sandwich on the word “template”.', 'Leave one beat for the save CTA.'],
      },
    ],
  },
];

export const exploreRecipeSeeds: MockRecipe[] = [
  {
    id: 'market-recipe-beauty-proof-routine',
    title: 'Beauty Purchase Conversion Hook Guide',
    creator: '@avabeauty',
    platform: 'Instagram Reels',
    thumbnail: ugcMedia.beautyHero.image,
    savedAt: 'Verified recipe',
    sourceUrl: 'mock://beauty-conversion-hook',
    referenceVideoSource: ugcMedia.beautyHero.video,
    summary: 'A shooting guide for raising cosmetic purchase intent by showing the skin result before the product explanation.',
    niche: 'Beauty',
    goal: 'Increase product trust before purchase',
    notes: 'Downloaded recipes keep creator attribution and can be remixed after saving.',
    ownership: 'community',
    verification: 'verified_creator',
    ownerHandle: '@avabeauty',
    ownerName: 'Ava Beauty',
    downloadCount: 2140,
    shootStatus: 'ready',
    shotSceneCount: 0,
    totalSceneCount: 3,
    scenes: [
      {
        id: 'beauty-proof-1',
        sceneNumber: 1,
        title: 'Open on the finished look',
        summary: 'Start with the result so the routine has a reason to exist.',
        analysisLines: ['The result-first open makes the routine feel worth copying.'],
        recipeLines: ['Show the finished look first.', 'Say the visible problem in one short line.'],
        prompterLines: ['This is the glow I wanted before touching concealer.'],
      },
      {
        id: 'beauty-proof-2',
        sceneNumber: 2,
        title: 'Make the product earn attention',
        summary: 'Hold the product until the viewer understands the problem.',
        analysisLines: ['The reveal lands because the product appears after a visible need.'],
        recipeLines: ['Show texture close-up.', 'Name one reason the product matters.'],
        prompterLines: ['I only care because it fixes this patchy spot.'],
      },
      {
        id: 'beauty-proof-3',
        sceneNumber: 3,
        title: 'Close with repeatability',
        summary: 'End with a routine the viewer can save.',
        analysisLines: ['A repeatable close drives saves better than a generic CTA.'],
        recipeLines: ['Summarize the three steps.', 'Hold the final look for one beat.'],
        prompterLines: ['Result, patch, blend. That is the whole routine.'],
      },
    ],
  },
  {
    id: 'market-recipe-core-control-proof',
    title: 'Food Promotion Shooting Guide',
    creator: '@snackframes',
    platform: 'Instagram Reels',
    thumbnail: ugcMedia.foodPromo.image,
    savedAt: 'Verified recipe',
    sourceUrl: 'mock://food-promo-proof',
    referenceVideoSource: ugcMedia.foodPromo.video,
    summary: 'A guide for filming food promotion with an appetite hook, visible texture proof, and a repeatable save CTA.',
    niche: 'Cooking',
    goal: 'Make food promotion feel natural',
    notes: 'Use this when a food product needs to look useful and craveable without sounding like an ad.',
    ownership: 'community',
    verification: 'verified_creator',
    ownerHandle: '@snackframes',
    ownerName: 'Snack Frames',
    downloadCount: 1670,
    shootStatus: 'ready',
    shotSceneCount: 0,
    totalSceneCount: 3,
    scenes: [
      {
        id: 'core-proof-1',
        sceneNumber: 1,
        title: 'Open with the craving',
        summary: 'Show the finished bite before explaining the product.',
        analysisLines: ['The appetite-first open gives the viewer a reason to keep watching.'],
        recipeLines: ['Show the bite or finished serving first.', 'Keep the product visible but secondary.'],
        prompterLines: ['This is the quickest snack I keep coming back to.'],
      },
      {
        id: 'core-proof-2',
        sceneNumber: 2,
        title: 'Show the proof visual',
        summary: 'Use texture, spread, bite, or close-up to make the claim believable.',
        analysisLines: ['The close proof visual makes the product benefit concrete.'],
        recipeLines: ['Show texture close-up.', 'Name the product benefit in one line.'],
        prompterLines: ['The texture is what makes it feel like an actual treat.'],
      },
      {
        id: 'core-proof-3',
        sceneNumber: 3,
        title: 'End with a repeatable use',
        summary: 'Give the viewer one occasion where they would use it.',
        analysisLines: ['A specific use case makes the promo easier to save.'],
        recipeLines: ['Name the occasion.', 'End with a soft save CTA.'],
        prompterLines: ['Save this for the next time breakfast needs to be fast.'],
      },
    ],
  },
  {
    id: 'market-recipe-founder-problem-hook',
    title: 'Problem Hook App Demo Guide',
    creator: '@lenabuilds',
    platform: 'TikTok',
    thumbnail: ugcMedia.appDemo.image,
    savedAt: 'Community recipe',
    sourceUrl: '',
    referenceVideoSource: ugcMedia.appDemo.video,
    summary: 'A guide for opening with a user problem, then showing the app or product as the practical fix.',
    niche: 'Creator',
    goal: 'Create a problem-to-solution hook',
    notes: 'Community recipes are visible but not treated as verified.',
    ownership: 'community',
    verification: 'community',
    ownerHandle: '@lenabuilds',
    ownerName: 'Lena Builds',
    downloadCount: 340,
    shootStatus: 'ready',
    shotSceneCount: 0,
    totalSceneCount: 3,
    scenes: [
      {
        id: 'founder-hook-1',
        sceneNumber: 1,
        title: 'Name the annoying moment',
        summary: 'Use a concrete pain before naming the product.',
        analysisLines: [],
        recipeLines: ['Say the moment users already recognize.'],
        prompterLines: ['The worst part is not the task. It is losing the tiny details.'],
      },
      {
        id: 'founder-hook-2',
        sceneNumber: 2,
        title: 'Show the old workaround',
        summary: 'Make the pain visible with the current hack.',
        analysisLines: [],
        recipeLines: ['Show the messy workaround in one shot.'],
        prompterLines: ['So people build this weird little system around it.'],
      },
      {
        id: 'founder-hook-3',
        sceneNumber: 3,
        title: 'Introduce the cleaner habit',
        summary: 'Position the product as a habit upgrade.',
        analysisLines: [],
        recipeLines: ['Show the new clean action.', 'Keep the product name secondary.'],
        prompterLines: ['We made the habit smaller, so you actually keep doing it.'],
      },
    ],
  },
];

export const profileSeed: MockProfile = {
  name: 'Junho Baek',
  handle: '@junho',
  role: 'Creative systems builder',
  bio: 'Turning viral references into reusable creator workflows for web and mobile.',
  focusTags: ['Creator tools', 'Recipe systems', 'Mobile product'],
  streakDays: 18,
};
