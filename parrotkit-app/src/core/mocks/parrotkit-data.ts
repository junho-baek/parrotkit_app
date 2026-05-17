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
import type { ReferenceBreakdown } from '@/domain/recipes/reference-breakdown';
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

const foodPromoReferenceBreakdown: ReferenceBreakdown = {
  schema_version: 'parrotkit.reference_breakdown.v1',
  reference: {
    source_url: 'mock://food-promo-shooting-guide',
    platform: 'instagram',
    creator_handle: '@fit.frames',
    title: 'Food Promo Shooting Guide',
    duration_seconds: 25,
    language: 'en',
    thumbnail_description: 'A creator opens on a finished food result before explaining the system.',
  },
  summary: {
    one_liner: 'A result-first food promo that turns a meal into a repeatable creator system.',
    audience: 'Food, wellness, and product creators who need a promo to feel useful before it feels like an ad.',
    promise: 'Show the payoff first, prove the texture and ease, then end with a repeatable use.',
    why_viewers_keep_watching: 'The finished plate appears before the explanation, so the viewer understands the reward immediately.',
  },
  transcript: {
    raw: ['I stopped overthinking diet food and this is what finally stuck.'],
    clean: 'I stopped overthinking diet food and this is what finally stuck.',
    notable_lines: [
      {
        time_range: '0:00-0:05',
        line: 'I stopped overthinking diet food and this is what finally stuck.',
        why_it_matters: 'The line names the emotional relief before the process starts.',
      },
    ],
  },
  idea_analysis: {
    topic: 'Food promotion through repeatable meal systems',
    idea_seed: 'Use the final plate as the promise before showing any process.',
    unique_angle: 'The promo is framed as a mental-load reduction system, not just a tasty dish.',
    common_belief_to_challenge: 'Diet food promotion needs ingredient explanation before payoff.',
    contrarian_reality: 'The payoff can do the persuasion first if the plate looks repeatable and low-friction.',
    supporting_evidence: [
      'The opening frame carries the food result before the creator explains anything.',
      'The creator reaction arrives after the promise, making the response feel earned.',
      'The close can turn the dish into a weekly system instead of a one-off recipe.',
    ],
    user_application: 'Start with your strongest final plate, then use each cut to show why it is repeatable in your context.',
  },
  hook: {
    category: 'problem',
    formula: 'I stopped [painful habit] and this is what finally [desired outcome].',
    spoken_hook: 'I stopped overthinking diet food and this is what finally stuck.',
    visual_hook: 'Finished meal appears before process or ingredient explanation.',
    why_it_works: 'The viewer sees the reward and hears the pain relief in the same opening beat.',
    adaptation_rule: 'Swap in the viewer pain and keep the first frame on the finished result, not the setup.',
  },
  storytelling_format: {
    category: 'demo',
    description: 'Promise-first food demo with proof cuts and a repeatable save beat.',
    beat_order: ['Finished plate promise', 'Texture and prep proof', 'Repeatable weekly use'],
    why_it_works: 'The video moves from desire to believability to reuse, which supports saves without extra CTA clutter.',
    reuse_when: 'Use when the dish, product, or routine needs to feel practical as quickly as it feels appetizing.',
  },
  visual_layout: {
    category: 'product_demo',
    sub_category: 'Food result close-up with creator reaction',
    framing: 'Start on the finished food/result, then bring the creator reaction into the rhythm.',
    camera_motion: 'Fast close-up cut into a stable reaction frame, followed by centered hand action.',
    caption_strategy: 'Use one short promise caption first, then practical proof captions only where they reduce uncertainty.',
    subject_product_relationship: 'Food stays primary; creator reaction validates the promise after the plate is understood.',
    user_application: 'Keep the dish dominant in the first beat and use your face only after the viewer knows the payoff.',
  },
  proof_structure: {
    proof_points: [
      'The finished plate shows the desired result immediately.',
      'Texture and hand-action cuts make the claim observable.',
      'The closer reframes the meal as repeatable instead of aspirational.',
    ],
    trust_signals: ['Creator reaction', 'Visible food texture', 'Specific repeatable use case'],
    risk_or_gap: 'Nutrition or product claims still need real evidence if used in a paid promotion.',
  },
  cuts: [
    {
      id: 'scene-1',
      time_range: '0:00-0:05',
      execution_title: 'Immediate promise',
      reference_observation: 'The reference opens on the strongest finished-food result before any explanation.',
      line_to_say: 'I stopped overthinking diet food and this is what finally stuck.',
      shooting_guide: 'Show plated result first, then cut to creator reaction in under one second.',
      why_this_beat_exists: 'It gives the viewer a reason to care before the process starts.',
      my_take_success_criteria: ['Finished result is visible immediately', 'The line names relief, not ingredients'],
    },
    {
      id: 'scene-2',
      time_range: '0:05-0:15',
      execution_title: 'Proof in motion',
      reference_observation: 'Three fast food cuts show texture, speed, and variety.',
      line_to_say: '20 min, high protein, zero mental load.',
      shooting_guide: 'Stack prep, drizzle, and final bite so the process feels easy.',
      why_this_beat_exists: 'It makes the opening promise believable through visible food proof.',
      my_take_success_criteria: ['Hands stay centered', 'Each proof cut answers one uncertainty'],
    },
    {
      id: 'scene-3',
      time_range: '0:15-0:25',
      execution_title: 'Actionable finish',
      reference_observation: 'The closing frame can turn the meal into a system the viewer saves.',
      line_to_say: 'Build one plate you can repeat all week.',
      shooting_guide: 'Hold the final plate steady long enough for the save idea to land.',
      why_this_beat_exists: 'It turns a single food moment into a repeatable action.',
      my_take_success_criteria: ['Closer names a repeatable use', 'Final frame is stable'],
    },
  ],
  shooting_projection: {
    board_title: 'Food Promo Shooting Guide',
    video_level_breakdown: [
      {
        label: 'Summary',
        value: 'A result-first food promo that turns a meal into a repeatable creator system.',
      },
      {
        label: 'Transcript',
        value: 'I stopped overthinking diet food and this is what finally stuck.',
      },
      {
        label: 'Idea Analysis',
        value: 'Use the final plate as the promise before showing any process.',
      },
      {
        label: 'Hook',
        value: 'I stopped [painful habit] and this is what finally [desired outcome].',
      },
      {
        label: 'Storytelling',
        value: 'Promise-first food demo with proof cuts and a repeatable save beat.',
      },
      {
        label: 'Visual Layout',
        value: 'Food result close-up with creator reaction.',
      },
    ],
    cut_rows: [
      {
        cut_id: 'scene-1',
        execution_title: 'Immediate promise',
        line_to_say: 'I stopped overthinking diet food and this is what finally stuck.',
        shot_guide: 'Show plated result first, then creator reaction.',
        reference_usage: 'Borrow the result-first opening structure.',
        my_take_relationship: 'Your take must prove the payoff in the first frame.',
      },
      {
        cut_id: 'scene-2',
        execution_title: 'Proof in motion',
        line_to_say: '20 min, high protein, zero mental load.',
        shot_guide: 'Stack prep, drizzle, and final bite.',
        reference_usage: 'Borrow the quick proof rhythm.',
        my_take_relationship: 'Your take must show why the meal is easy to repeat.',
      },
      {
        cut_id: 'scene-3',
        execution_title: 'Actionable finish',
        line_to_say: 'Build one plate you can repeat all week.',
        shot_guide: 'Hold the final plate for the save beat.',
        reference_usage: 'Borrow the repeatable close.',
        my_take_relationship: 'Your take must make the next action obvious.',
      },
    ],
  },
  vault_candidates: {
    idea: {
      title: 'Result-first repeatable meal system',
      tags: ['food', 'promo', 'repeatable'],
    },
    hook: {
      formula: 'I stopped [painful habit] and this is what finally [desired outcome].',
      category: 'problem',
    },
    story_format: {
      name: 'Promise proof repeat',
      tags: ['demo', 'food'],
    },
    visual_layout: {
      name: 'Food result close-up with creator reaction',
      tags: ['product_demo', 'close_up'],
    },
    channel: {
      creator_handle: '@fit.frames',
      why_follow: 'Strong result-first food promo patterns.',
    },
  },
  confidence: {
    overall: 0.82,
    transcript: 0.88,
    visual: 0.78,
    cut_segmentation: 0.74,
    notes: ['Mock payload mirrors the durable Sandcastle-style contract for local QA.'],
  },
};

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
    analysisMetadata: {
      reference_breakdown: foodPromoReferenceBreakdown,
    },
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
  bio: 'Turning viral references into reusable creator recipes for web and mobile.',
  focusTags: ['Creator tools', 'Recipe systems', 'Mobile product'],
  streakDays: 18,
};
