export type MockPlatform = 'TikTok' | 'Instagram Reels' | 'YouTube Shorts';

export type MockCreatorTrust = 'verified' | 'community';
export type MockRecipeOwnership = 'owned' | 'downloaded' | 'remixed' | 'community';
export type MockRecipeVerification = 'verified_creator' | 'community';
export type MockRecipeShootStatus = 'continue' | 'ready' | 'draft';

export type MockReference = {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: number;
  category: string;
  platform: MockPlatform;
  videoUrl: string;
  createdAt: string;
  isLiked: boolean;
  recipeId?: string;
};

export type MockPartnerCreator = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  trust: MockCreatorTrust;
  specialty: string;
};

export type MockRecordedTake = {
  uri: string;
  savedAt: string;
};

export type MockRecipeScene = {
  id: string;
  sceneNumber?: number;
  title: string;
  summary: string;
  startTime?: string;
  endTime?: string;
  thumbnail?: string;
  analysisLines: string[];
  recipeLines: string[];
  prompterLines: string[];
  analysis?: {
    transcriptOriginal?: string[];
    transcriptSnippet?: string | null;
    motionDescription?: string;
    whyItWorks?: string[];
    referenceSignals?: Array<{ type: string; text: string }>;
  };
  recipe?: {
    objective?: string;
    appealPoint?: string;
    keyLine?: string;
    scriptLines?: string[];
    keyMood?: string;
    keyAction?: string;
    mustInclude?: string[];
    mustAvoid?: string[];
    cta?: string;
  };
  prompter?: {
    blocks?: Array<{
      id: string;
      type: 'key_line' | 'keyword' | 'appeal_point' | 'mood' | 'action' | 'warning' | 'cta';
      label?: string;
      content: string;
      accentColor?: string;
      visible: boolean;
      size: 'sm' | 'md' | 'lg' | 'xl';
      positionPreset: 'top' | 'upperThird' | 'center' | 'lowerThird' | 'bottom';
      scale?: number;
      x?: number;
      y?: number;
      order: number;
    }>;
  };
  progress?: number;
};

export type MockRecipe = {
  id: string;
  title: string;
  creator: string;
  platform: MockPlatform;
  thumbnail: string;
  savedAt: string;
  sourceUrl: string;
  summary: string;
  niche: string;
  goal: string;
  notes: string;
  ownership: MockRecipeOwnership;
  verification: MockRecipeVerification;
  ownerHandle: string;
  ownerName: string;
  downloadCount: number;
  shootStatus: MockRecipeShootStatus;
  shotSceneCount: number;
  totalSceneCount: number;
  lastShotAt?: string;
  remixOfRecipeId?: string;
  scenes: MockRecipeScene[];
};

export type MockProfile = {
  name: string;
  handle: string;
  role: string;
  bio: string;
  focusTags: string[];
  streakDays: number;
};

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
    thumbnail: 'https://img.youtube.com/vi/JhBOUaCkltg/maxresdefault.jpg',
    duration: '00:25',
    views: '5.4M',
    likes: 450,
    category: 'Cooking',
    platform: 'YouTube Shorts',
    videoUrl: 'https://www.youtube.com/shorts/JhBOUaCkltg',
    createdAt: '2 hours ago',
    isLiked: true,
    recipeId: 'recipe-korean-diet-hook',
  },
  {
    id: 'trend-2',
    title: 'Viral Food Recipe',
    creator: '@FoodMaster',
    thumbnail: 'https://img.youtube.com/vi/RiOqgmmcSvc/maxresdefault.jpg',
    duration: '00:30',
    views: '3.2M',
    likes: 320,
    category: 'Cooking',
    platform: 'TikTok',
    videoUrl: 'https://www.tiktok.com/@foodmaster/video/7423456789012345678',
    createdAt: '5 hours ago',
    isLiked: false,
    recipeId: 'recipe-airfryer-stack',
  },
  {
    id: 'trend-3',
    title: 'Glow Routine in 20 Seconds',
    creator: '@avabeauty',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    duration: '00:21',
    views: '1.8M',
    likes: 184,
    category: 'Beauty',
    platform: 'Instagram Reels',
    videoUrl: 'https://www.instagram.com/reel/DemoGlowRoutine',
    createdAt: '8 hours ago',
    isLiked: false,
  },
  {
    id: 'trend-4',
    title: '3 Moves for Better Core Control',
    creator: '@coachleon',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    duration: '00:28',
    views: '2.1M',
    likes: 231,
    category: 'Fitness',
    platform: 'Instagram Reels',
    videoUrl: 'https://www.instagram.com/reel/CoreControlSprint',
    createdAt: '1 day ago',
    isLiked: true,
  },
];

export const recentReferencesSeed: MockReference[] = [
  {
    id: 'recent-1',
    title: 'Amazing Cooking Shorts',
    creator: '@CookingMaster',
    thumbnail: 'https://img.youtube.com/vi/8qUUuVkhtYQ/maxresdefault.jpg',
    duration: '00:25',
    views: '5.4K',
    likes: 92,
    category: 'Cooking',
    platform: 'YouTube Shorts',
    videoUrl: 'https://www.youtube.com/shorts/8qUUuVkhtYQ',
    createdAt: '2 hours ago',
    isLiked: false,
    recipeId: 'recipe-korean-diet-hook',
  },
  {
    id: 'recent-2',
    title: 'Hook Rewrite for Reels',
    creator: '@copylab',
    thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    duration: '00:19',
    views: '12K',
    likes: 64,
    category: 'Creator',
    platform: 'Instagram Reels',
    videoUrl: 'https://www.instagram.com/reel/CopyHookLab',
    createdAt: 'Yesterday',
    isLiked: false,
    recipeId: 'recipe-airfryer-stack',
  },
];

export const recipesSeed: MockRecipe[] = [
  {
    id: 'recipe-korean-diet-hook',
    title: 'Korean Diet Viral Hook',
    creator: '@fit.frames',
    platform: 'Instagram Reels',
    thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    savedAt: 'Saved 2h ago',
    sourceUrl: 'https://www.instagram.com/reel/KoreanDietHook',
    summary: 'Turn a transformation reel into a cleaner three-beat story with a stronger opening promise and better payoff pacing.',
    niche: 'Fitness',
    goal: 'Better hook pacing',
    notes: 'Keep the quick food montage but slow down the claim so the viewer understands the promise.',
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
        thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
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
    title: 'Air Fryer Lunch Stack',
    creator: '@kitchen.frames',
    platform: 'TikTok',
    thumbnail: 'https://img.youtube.com/vi/RiOqgmmcSvc/maxresdefault.jpg',
    savedAt: 'Saved yesterday',
    sourceUrl: 'https://www.tiktok.com/@kitchen.frames/video/7423456789012345678',
    summary: 'Reframe a quick food short into a repeatable lunch format with clearer cuts, tighter ingredient cues, and a better ending beat.',
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
    title: 'Beauty Proof Routine',
    creator: '@avabeauty',
    platform: 'Instagram Reels',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    savedAt: 'Verified recipe',
    sourceUrl: 'https://www.instagram.com/reel/DemoGlowRoutine',
    summary: 'A verified creator recipe for turning a routine into three proof-first beats before the product reveal.',
    niche: 'Beauty',
    goal: 'Show proof before product',
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
    title: 'Core Control Proof',
    creator: '@coachleon',
    platform: 'Instagram Reels',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    savedAt: 'Verified recipe',
    sourceUrl: 'https://www.instagram.com/reel/CoreControlSprint',
    summary: 'A verified fitness recipe for making form correction feel obvious in the first five seconds.',
    niche: 'Fitness',
    goal: 'Make form correction visible',
    notes: 'Use this when the creator needs proof before instruction.',
    ownership: 'community',
    verification: 'verified_creator',
    ownerHandle: '@coachleon',
    ownerName: 'Coach Leon',
    downloadCount: 1670,
    shootStatus: 'ready',
    shotSceneCount: 0,
    totalSceneCount: 3,
    scenes: [
      {
        id: 'core-proof-1',
        sceneNumber: 1,
        title: 'Show the mistake first',
        summary: 'Make the bad form visible before explaining it.',
        analysisLines: ['The mistake-first open makes the correction feel necessary.'],
        recipeLines: ['Show one bad rep.', 'Freeze the frame on the visible issue.'],
        prompterLines: ['If your ribs flare here, your core is not controlling the move.'],
      },
      {
        id: 'core-proof-2',
        sceneNumber: 2,
        title: 'Switch to the correction',
        summary: 'Contrast the fixed version immediately.',
        analysisLines: ['The back-to-back contrast makes the lesson easy to trust.'],
        recipeLines: ['Show one corrected rep.', 'Keep the camera angle identical.'],
        prompterLines: ['Now tuck, breathe, and keep the ribs down.'],
      },
      {
        id: 'core-proof-3',
        sceneNumber: 3,
        title: 'Give the viewer a test',
        summary: 'End with a small check they can repeat.',
        analysisLines: ['A test gives the viewer a reason to save the video.'],
        recipeLines: ['Name the one check.', 'Invite them to try it next set.'],
        prompterLines: ['Try three slow reps and watch whether the ribs move.'],
      },
    ],
  },
  {
    id: 'market-recipe-founder-problem-hook',
    title: 'Founder Problem Hook',
    creator: '@lenabuilds',
    platform: 'TikTok',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    savedAt: 'Community recipe',
    sourceUrl: '',
    summary: 'A community recipe for explaining a product problem without sounding like a pitch.',
    niche: 'Creator',
    goal: 'Make a product problem feel specific',
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
