export type MockPlatform = 'TikTok' | 'Instagram Reels' | 'YouTube Shorts';

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
};

export type MockRecipeScene = {
  id: string;
  title: string;
  summary: string;
  analysisLines: string[];
  recipeLines: string[];
  prompterLines: string[];
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
  },
  {
    id: 'creator-2',
    name: 'Ava Beauty',
    handle: '@avabeauty',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'creator-3',
    name: 'Coach Leon',
    handle: '@coachleon',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'creator-4',
    name: 'Lena Builds',
    handle: '@lenabuilds',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'creator-5',
    name: 'Miles Away',
    handle: '@milesaway',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
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
    scenes: [
      {
        id: 'scene-1',
        title: 'Immediate promise',
        summary: 'Lead with the payoff before the process.',
        analysisLines: [
          'Open on the strongest food/result contrast in the first second.',
          'Use the creator face only after the promise is clear.',
        ],
        recipeLines: [
          'Hook: “I stopped overthinking diet food and this is what finally stuck.”',
          'Cut from plated meal to creator reaction in under 1 second.',
        ],
        prompterLines: ['State the promise in one breath.', 'Smile on the reveal shot.'],
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

export const profileSeed: MockProfile = {
  name: 'Junho Baek',
  handle: '@junho',
  role: 'Creative systems builder',
  bio: 'Turning viral references into reusable creator workflows for web and mobile.',
  focusTags: ['Creator tools', 'Recipe systems', 'Mobile product'],
  streakDays: 18,
};
