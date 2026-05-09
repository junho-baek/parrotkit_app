import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentProps, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type DimensionValue,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatShotProgress, localizeActivityLabel, useAppLanguage, type AppLanguage } from '@/core/i18n/app-language';
import type { MockRecipe } from '@/core/mocks/parrotkit-data';
import { APP_TOP_BAR_HIDE_RANGE } from '@/core/navigation/app-top-bar';
import { useAppChrome } from '@/core/navigation/app-chrome-provider';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { toImageSource, type AppImageSource } from '@/core/ui/image-source';
import { getContinueShootRecipe, getLatestShootableRecipe } from '@/features/recipes/lib/recipe-ownership';
import {
  createRecipeProductDemoModel,
  getRecipeProductDemoHref,
} from '@/features/recipes/lib/recipe-product-demo';
import { getRecipeCreateHref } from '@/features/recipes/lib/recipe-create-flow';
import { getShootBoardHref } from '@/features/recipes/lib/shoot-board-model';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type RecipesView = 'main' | 'collection' | 'publish';
type RecipeFilter = 'continue' | 'collection' | 'owned' | 'saved' | 'remix' | 'draft';
type PublishCategory = 'food' | 'lifestyle' | 'beauty' | 'tech' | 'business';
type Visibility = 'public' | 'followers' | 'private';
type AssetFlowStep = 'complete' | 'saved' | 'usage' | 'settings' | 'submitted';
type AssetUsageDestination = 'private' | 'client_share' | 'profile_publish' | 'marketplace_submission';
type AssetPublishCategory = 'beauty' | 'food' | 'lifestyle' | 'business' | 'other';
type AssetPublishVisibility = 'public' | 'followers' | 'private_link';
type AssetAccessMode = 'free' | 'paid' | 'approval_only';

type CollectionItem = {
  id: string;
  color: string;
  count: number;
  imageIds: string[];
  title: Record<AppLanguage, string>;
};

const filters: RecipeFilter[] = ['continue', 'collection', 'owned', 'saved', 'remix', 'draft'];

const collections: CollectionItem[] = [
  {
    id: 'beauty-proof',
    color: '#a78bfa',
    count: 12,
    imageIds: ['market-recipe-beauty-proof-routine', 'recipe-korean-diet-hook'],
    title: { en: 'Beauty Proof', ko: '뷰티 프루프' },
  },
  {
    id: 'food-hook',
    color: '#fbbf24',
    count: 8,
    imageIds: ['recipe-airfryer-stack', 'recipe-korean-diet-hook'],
    title: { en: 'Food Hooks', ko: '푸드 훅' },
  },
  {
    id: 'brand-brief',
    color: '#fb7185',
    count: 5,
    imageIds: ['market-recipe-founder-problem-hook', 'recipe-airfryer-stack'],
    title: { en: 'Brand Briefs', ko: '브랜드 브리프' },
  },
  {
    id: 'ads-ugc',
    color: '#93c5fd',
    count: 9,
    imageIds: ['recipe-korean-diet-hook', 'market-recipe-core-control-proof'],
    title: { en: 'Ad UGC', ko: '광고 UGC' },
  },
];

const recipeCopy = {
  en: {
    title: 'Recipes',
    subtitle: 'Saved recipes, remixes, and prompter workspaces',
    search: 'Search recipes',
    filters: {
      continue: 'Continue',
      collection: 'Collections',
      owned: 'Owned',
      saved: 'Saved',
      remix: 'Remix',
      draft: 'Draft',
    } satisfies Record<RecipeFilter, string>,
    continueSection: 'Continue shooting',
    continueAction: 'Continue',
    lastUsed: 'Last used',
    collections: 'Collections',
    myRecipes: 'My recipes',
    viewAll: 'View all',
    open: 'Open',
    shoot: 'Shoot',
    publishTitle: 'Recipe Asset',
    publishBody: 'Save it for reuse, sharing, publishing, or marketplace submission.',
    publishAction: 'Package',
    collectionTitle: 'Collections',
    collectionSearch: 'Search collections',
    recentCollection: 'Recently used collection',
    recipesInCollection: 'Recipes in collection',
    manageCollection: 'Manage collection',
    newest: 'Newest',
    publishHeader: 'Recipe Product',
    save: 'Save',
    coverImage: 'Cover image',
    changeCover: 'Change cover',
    recipeTitle: 'Recipe title',
    titlePlaceholder: 'Air fryer lunch 3-step recipe',
    oneLine: 'One-line description',
    descriptionPlaceholder: 'A 15-minute viral lunch idea with 3 air fryer cuts',
    category: 'Category',
    included: 'Product includes',
    visibility: 'Visibility',
    beforePublish: 'Demo product is staged locally before marketplace publishing.',
    titleCount: '16/60',
    descriptionCount: '28/120',
    categories: {
      beauty: 'Beauty',
      business: 'Business',
      food: 'Food',
      lifestyle: 'Lifestyle',
      tech: 'Tech',
    } satisfies Record<PublishCategory, string>,
    includedItems: [
      { icon: 'play-box-outline' as IconName, title: 'Reference analysis', body: 'Include tone and hook breakdown' },
      { icon: 'view-dashboard-outline' as IconName, title: 'Shot guide', body: 'Camera, angle, and pacing guide' },
      { icon: 'script-text-outline' as IconName, title: 'Script', body: 'Narration and text overlay script' },
      { icon: 'television-guide' as IconName, title: 'Prompter', body: 'Prompter copy and tips included' },
    ],
    visibilityOptions: {
      public: { icon: 'web' as IconName, title: 'Public', body: 'All creators' },
      followers: { icon: 'account-group-outline' as IconName, title: 'Followers', body: 'Followers only' },
      private: { icon: 'lock-outline' as IconName, title: 'Private', body: 'Only me' },
    } satisfies Record<Visibility, { icon: IconName; title: string; body: string }>,
  },
  ko: {
    title: '레시피',
    subtitle: '저장한 레시피, 리믹스, 프롬프터용 작업 공간',
    search: '레시피 검색',
    filters: {
      continue: '이어하기',
      collection: '컬렉션',
      owned: 'Owned',
      saved: 'Saved',
      remix: 'Remix',
      draft: 'Draft',
    } satisfies Record<RecipeFilter, string>,
    continueSection: '바로 이어서 촬영',
    continueAction: '계속 촬영',
    lastUsed: '마지막 사용',
    collections: '컬렉션',
    myRecipes: '내 레시피',
    viewAll: '전체 보기',
    open: '열기',
    shoot: '촬영',
    publishTitle: 'Recipe Asset',
    publishBody: '재사용, 공유, 공개, 마켓 제출까지 이어지는 자산으로 저장',
    publishAction: '패키징',
    collectionTitle: '컬렉션',
    collectionSearch: '컬렉션 검색',
    recentCollection: '최근 사용 컬렉션',
    recipesInCollection: '컬렉션 내 레시피',
    manageCollection: '컬렉션 관리',
    newest: '최신순',
    publishHeader: 'Recipe Product',
    save: '저장',
    coverImage: '커버 이미지',
    changeCover: '커버 변경',
    recipeTitle: '레시피 제목',
    titlePlaceholder: '에어프라이어 런치 3종 레시피',
    oneLine: '한 줄 설명',
    descriptionPlaceholder: '바쁜 하루도 맛있게! 15분 완성 에어프라이어 런치 아이디어 3가지',
    category: '카테고리',
    included: '상품 포함 항목',
    visibility: '공개 설정',
    beforePublish: '데모 상품은 마켓 발행 전 로컬로만 표시됩니다.',
    titleCount: '16/60',
    descriptionCount: '28/120',
    categories: {
      beauty: '뷰티',
      business: '비즈니스',
      food: '푸드',
      lifestyle: '라이프스타일',
      tech: '테크',
    } satisfies Record<PublishCategory, string>,
    includedItems: [
      { icon: 'play-box-outline' as IconName, title: '레퍼런스 분석', body: '톤앤드와 벤치마크 분석 포함' },
      { icon: 'view-dashboard-outline' as IconName, title: '씬 가이드', body: '시 구도, 구도, 연출 가이드' },
      { icon: 'script-text-outline' as IconName, title: '대본', body: '내레이션 및 텍스트 스크립트' },
      { icon: 'television-guide' as IconName, title: '프롬프터', body: '프롬프터 문구 및 팁 포함' },
    ],
    visibilityOptions: {
      public: { icon: 'web' as IconName, title: '전체 공개', body: '모든 크리에이터' },
      followers: { icon: 'account-group-outline' as IconName, title: '팔로워 공개', body: '팔로워만' },
      private: { icon: 'lock-outline' as IconName, title: '비공개', body: '나만 보기' },
    } satisfies Record<Visibility, { icon: IconName; title: string; body: string }>,
  },
} satisfies Record<AppLanguage, Record<string, unknown>>;

const assetFlowCopy = {
  en: {
    completeTitle: 'Recipe complete!',
    completeSubtitle: 'Your shoot is ready to save as a reusable production asset.',
    completeEyebrow: 'Recipe asset package',
    includedTitle: 'Included in this asset',
    preview: 'Preview',
    edit: 'Edit',
    export: 'Export',
    exportTitle: 'Export package',
    exportBody: 'Clips, shot list, script, prompter text, and checklist are ready to package.',
    saveAsset: 'Save as Recipe Asset',
    savedTitle: 'Saved to My Recipes',
    savedSubtitle: 'This recipe is now available for reuse, sharing, publishing, or marketplace submission.',
    nextTitle: 'Next possible moves',
    chooseUsage: 'Choose usage option',
    goRecipes: 'Go to My Recipes',
    usageTitle: 'How will you use this recipe?',
    usageSubtitle: 'Pick the destination first. Selling stays optional.',
    usageNote: 'You can change this later.',
    continue: 'Continue',
    settingsTitle: 'Marketplace Submission',
    settingsSubtitle: 'Prepare the public-facing package. Monetization is optional.',
    titleLabel: 'Recipe title',
    descriptionLabel: 'One-line description',
    category: 'Category',
    visibility: 'Visibility',
    access: 'Access',
    price: 'Price (USD)',
    includes: 'Product includes',
    submitRecipe: 'Submit Recipe',
    publishRecipe: 'Publish Recipe Product',
    submittedTitle: 'Recipe package ready',
    submittedSubtitle: 'The asset flow is staged. You can reuse it, share it, or keep preparing the listing.',
    done: 'Done',
    secureNote: 'Publishing settings can be changed after submission.',
    destinations: {
      private: {
        icon: 'lock-outline' as IconName,
        title: 'Private',
        body: 'Keep it in My Recipes and shoot it again later.',
      },
      client_share: {
        icon: 'account-group-outline' as IconName,
        title: 'Client / Team Share',
        body: 'Package a private review link for collaborators.',
      },
      profile_publish: {
        icon: 'web' as IconName,
        title: 'Profile Publish',
        body: 'Show it on your creator profile as a reusable format.',
      },
      marketplace_submission: {
        icon: 'storefront-outline' as IconName,
        title: 'Marketplace Submission',
        body: 'Submit it so other creators can discover and reuse it.',
      },
    } satisfies Record<AssetUsageDestination, { icon: IconName; title: string; body: string }>,
    nextActions: [
      { icon: 'movie-open-play-outline' as IconName, title: 'Start a new shoot', body: 'Use this exact structure again.' },
      { icon: 'auto-fix' as IconName, title: 'Make a remix', body: 'Generate a variation from another reference.' },
      { icon: 'share-variant-outline' as IconName, title: 'Share with team/client', body: 'Send the package for review.' },
      { icon: 'storefront-outline' as IconName, title: 'View publish options', body: 'Prepare profile or marketplace settings.' },
    ],
    categories: {
      beauty: 'Beauty',
      food: 'Food',
      lifestyle: 'Lifestyle',
      business: 'Business',
      other: 'Other',
    } satisfies Record<AssetPublishCategory, string>,
    visibilityOptions: {
      public: { icon: 'web' as IconName, title: 'Public' },
      followers: { icon: 'account-group-outline' as IconName, title: 'Followers' },
      private_link: { icon: 'link-variant' as IconName, title: 'Private link' },
    } satisfies Record<AssetPublishVisibility, { icon: IconName; title: string }>,
    accessOptions: {
      free: { icon: 'heart-outline' as IconName, title: 'Free' },
      paid: { icon: 'currency-usd' as IconName, title: 'Paid' },
      approval_only: { icon: 'lock-check-outline' as IconName, title: 'Approval only' },
    } satisfies Record<AssetAccessMode, { icon: IconName; title: string }>,
  },
  ko: {
    completeTitle: 'Recipe complete!',
    completeSubtitle: '방금 만든 촬영 결과를 다시 쓸 수 있는 제작 자산으로 저장하세요.',
    completeEyebrow: 'Recipe asset package',
    includedTitle: '이 자산에 포함된 것',
    preview: '미리보기',
    edit: '편집',
    export: '내보내기',
    exportTitle: 'Export package',
    exportBody: '클립, 샷 리스트, 대본, 프롬프터 문구, 체크리스트를 패키지로 준비합니다.',
    saveAsset: 'Recipe Asset으로 저장',
    savedTitle: 'Saved to My Recipes',
    savedSubtitle: '내 레시피에 저장되었습니다. 다시 촬영하거나 공유/공개/마켓 제출로 이어갈 수 있어요.',
    nextTitle: '다음에 할 수 있는 일',
    chooseUsage: '활용 방식 선택',
    goRecipes: '내 레시피로 이동',
    usageTitle: '이 레시피를 어떻게 활용할까요?',
    usageSubtitle: '목적을 먼저 고르세요. 판매는 선택 옵션입니다.',
    usageNote: '언제든 변경할 수 있어요.',
    continue: '계속',
    settingsTitle: 'Marketplace Submission',
    settingsSubtitle: '공개용 패키지를 정리합니다. 수익화는 선택입니다.',
    titleLabel: '레시피 제목',
    descriptionLabel: '한 줄 설명',
    category: '카테고리',
    visibility: '공개 범위',
    access: '제공 방식',
    price: '가격 (USD)',
    includes: '포함 항목',
    submitRecipe: '제출하기',
    publishRecipe: 'Recipe Product 발행',
    submittedTitle: 'Recipe package ready',
    submittedSubtitle: '자산 플로우가 준비되었습니다. 재사용하거나 공유하고, 리스팅을 계속 다듬을 수 있습니다.',
    done: '완료',
    secureNote: '제출 후에도 공개 및 판매 설정을 바꿀 수 있습니다.',
    destinations: {
      private: {
        icon: 'lock-outline' as IconName,
        title: '개인 보관',
        body: 'My Recipes에 저장하고 나중에 다시 촬영합니다.',
      },
      client_share: {
        icon: 'account-group-outline' as IconName,
        title: '클라이언트/팀 공유',
        body: '협업자에게 비공개 리뷰 패키지로 전달합니다.',
      },
      profile_publish: {
        icon: 'web' as IconName,
        title: '프로필 공개',
        body: '내 프로필에 재사용 가능한 포맷으로 보여줍니다.',
      },
      marketplace_submission: {
        icon: 'storefront-outline' as IconName,
        title: '마켓플레이스 제출',
        body: '다른 크리에이터가 발견하고 재사용할 수 있게 제출합니다.',
      },
    } satisfies Record<AssetUsageDestination, { icon: IconName; title: string; body: string }>,
    nextActions: [
      { icon: 'movie-open-play-outline' as IconName, title: '이 레시피로 새 촬영 시작', body: '같은 구조로 바로 다시 촬영합니다.' },
      { icon: 'auto-fix' as IconName, title: '다른 레퍼런스로 리믹스', body: '다른 영상 기반 변형 버전을 만듭니다.' },
      { icon: 'share-variant-outline' as IconName, title: '팀/클라이언트와 공유', body: '검토용 패키지로 전달합니다.' },
      { icon: 'storefront-outline' as IconName, title: '공개 옵션 보기', body: '프로필 공개나 마켓 제출을 준비합니다.' },
    ],
    categories: {
      beauty: '뷰티',
      food: '푸드',
      lifestyle: '라이프스타일',
      business: '비즈니스',
      other: '기타',
    } satisfies Record<AssetPublishCategory, string>,
    visibilityOptions: {
      public: { icon: 'web' as IconName, title: '전체 공개' },
      followers: { icon: 'account-group-outline' as IconName, title: '팔로워' },
      private_link: { icon: 'link-variant' as IconName, title: '비공개 링크' },
    } satisfies Record<AssetPublishVisibility, { icon: IconName; title: string }>,
    accessOptions: {
      free: { icon: 'heart-outline' as IconName, title: '무료' },
      paid: { icon: 'currency-usd' as IconName, title: '유료' },
      approval_only: { icon: 'lock-check-outline' as IconName, title: '승인 후 제공' },
    } satisfies Record<AssetAccessMode, { icon: IconName; title: string }>,
  },
} satisfies Record<AppLanguage, Record<string, unknown>>;

export function RecipesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recipeId?: string; view?: string }>();
  const { language } = useAppLanguage();
  const copy = recipeCopy[language];
  const { exploreRecipes, recipes } = useMockWorkspace();
  const [view, setView] = useState<RecipesView>('main');
  const [assetFlowStep, setAssetFlowStep] = useState<AssetFlowStep>('complete');
  const [assetExportOpen, setAssetExportOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<AssetUsageDestination>('private');
  const [assetCategory, setAssetCategory] = useState<AssetPublishCategory>('food');
  const [assetVisibility, setAssetVisibility] = useState<AssetPublishVisibility>('public');
  const [assetAccess, setAssetAccess] = useState<AssetAccessMode>('free');
  const [selectedFilter, setSelectedFilter] = useState<RecipeFilter>('continue');

  useEffect(() => {
    if (params.view === 'publish') {
      setView('publish');
      setAssetFlowStep('complete');
      setAssetExportOpen(false);
      setSelectedDestination('private');
      return;
    }

    if (params.view === 'collection' || params.view === 'main') {
      setView(params.view);
    }
  }, [params.view, router]);

  const continueRecipe = useMemo(
    () => getContinueShootRecipe(recipes) ?? getLatestShootableRecipe(recipes) ?? recipes[0] ?? null,
    [recipes]
  );

  const productRecipe = useMemo(() => {
    const recipeId = Array.isArray(params.recipeId) ? params.recipeId[0] : params.recipeId;

    if (!recipeId) {
      return continueRecipe ?? recipes[0] ?? null;
    }

    return (
      recipes.find((recipe) => recipe.id === recipeId) ??
      exploreRecipes.find((recipe) => recipe.id === recipeId) ??
      continueRecipe ??
      recipes[0] ??
      null
    );
  }, [continueRecipe, exploreRecipes, params.recipeId, recipes]);

  const displayedRecipes = useMemo(() => {
    if (selectedFilter === 'owned') {
      return recipes.filter((recipe) => recipe.ownership === 'owned');
    }

    if (selectedFilter === 'saved') {
      return recipes.filter((recipe) => recipe.ownership === 'downloaded');
    }

    if (selectedFilter === 'remix') {
      return recipes.filter((recipe) => recipe.ownership === 'remixed');
    }

    if (selectedFilter === 'draft') {
      return recipes.filter((recipe) => recipe.shootStatus === 'draft');
    }

    if (selectedFilter === 'collection') {
      return recipes.slice(0, 4);
    }

    return continueRecipe ? [continueRecipe, ...recipes.filter((recipe) => recipe.id !== continueRecipe.id)] : recipes;
  }, [continueRecipe, recipes, selectedFilter]);

  const imageLookup = useMemo(() => {
    const entries = [...recipes, ...exploreRecipes].map((recipe) => [recipe.id, recipe.thumbnail] as const);
    return new Map(entries);
  }, [exploreRecipes, recipes]);

  const openRecipe = (recipe: MockRecipe) => {
    router.push(getShootBoardHref(recipe.id) as Href);
  };

  const shootRecipe = (recipe: MockRecipe) => {
    router.push(getShootBoardHref(recipe.id) as Href);
  };

  const startRecipeCreate = (mode: 'brand' | 'manual' | 'reference' = 'manual') => {
    router.push(getRecipeCreateHref(mode) as Href);
  };

  const openRecipeProduct = (recipe: MockRecipe | null = continueRecipe ?? recipes[0] ?? null) => {
    if (!recipe) {
      return;
    }

    setAssetFlowStep('complete');
    setAssetExportOpen(false);
    setSelectedDestination('private');
    router.push(getRecipeProductDemoHref(recipe.id));
  };

  const closePublishFlow = () => {
    setView('main');
    setAssetFlowStep('complete');
    setAssetExportOpen(false);
  };

  const goBackInPublishFlow = () => {
    if (assetFlowStep === 'complete') {
      closePublishFlow();
      return;
    }

    if (assetFlowStep === 'saved') {
      setAssetFlowStep('complete');
      return;
    }

    if (assetFlowStep === 'usage') {
      setAssetFlowStep('saved');
      return;
    }

    if (assetFlowStep === 'settings') {
      setAssetFlowStep('usage');
      return;
    }

    setAssetFlowStep('saved');
  };

  const advancePublishFlow = () => {
    if (assetFlowStep === 'complete') {
      setAssetFlowStep('saved');
      return;
    }

    if (assetFlowStep === 'saved') {
      setAssetFlowStep('usage');
      return;
    }

    if (assetFlowStep === 'usage') {
      if (selectedDestination === 'marketplace_submission' || selectedDestination === 'profile_publish') {
        setAssetFlowStep('settings');
        return;
      }

      setAssetFlowStep('submitted');
      return;
    }

    if (assetFlowStep === 'settings') {
      setAssetFlowStep('submitted');
      return;
    }

    closePublishFlow();
  };

  if (view === 'collection') {
    return (
      <RecipesTabScrollView>
        <CollectionScreen
          collections={collections}
          copy={copy}
          imageLookup={imageLookup}
          language={language}
          onBack={() => setView('main')}
          onOpenRecipe={openRecipe}
          onShootRecipe={shootRecipe}
          recipes={recipes}
        />
      </RecipesTabScrollView>
    );
  }

  if (view === 'publish') {
    return (
      <View className="flex-1 bg-canvas">
        <RecipesTabScrollView bottomPadding={assetFlowStep === 'saved' ? 270 : 230}>
          <PublishRecipeScreen
            access={assetAccess}
            category={assetCategory}
            destination={selectedDestination}
            exportOpen={assetExportOpen}
            language={language}
            onBack={goBackInPublishFlow}
            onEdit={() => productRecipe ? router.push(getShootBoardHref(productRecipe.id) as Href) : undefined}
            onPreview={() => productRecipe ? router.push(getShootBoardHref(productRecipe.id) as Href) : undefined}
            onSelectAccess={setAssetAccess}
            onSelectCategory={setAssetCategory}
            onSelectDestination={setSelectedDestination}
            onSelectVisibility={setAssetVisibility}
            onToggleExport={() => setAssetExportOpen((visible) => !visible)}
            recipe={productRecipe}
            step={assetFlowStep}
            visibility={assetVisibility}
          />
        </RecipesTabScrollView>
        <RecipeAssetBottomCta
          access={assetAccess}
          language={language}
          onPrimary={advancePublishFlow}
          onSecondary={closePublishFlow}
          step={assetFlowStep}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-canvas">
      <RecipesTabScrollView>
        <View className="gap-5 px-5">
          <HeaderBlock copy={copy} />
          <SearchRow placeholder={copy.search as string} />
          <FilterRail
            copy={copy}
            onSelect={setSelectedFilter}
            selectedFilter={selectedFilter}
          />

          {continueRecipe ? (
            <ContinueShootCard
              copy={copy}
              language={language}
              onOpen={() => openRecipe(continueRecipe)}
              onShoot={() => shootRecipe(continueRecipe)}
              recipe={continueRecipe}
            />
          ) : null}

          <SectionHeader
            action={copy.viewAll as string}
            onAction={() => setView('collection')}
            title={copy.collections as string}
          />
          <View className="flex-row gap-2">
            {collections.map((collection) => (
              <CollectionFolderCard
                collection={collection}
                key={collection.id}
                language={language}
                onPress={() => setView('collection')}
              />
            ))}
          </View>

          <SectionHeader
            action={copy.viewAll as string}
            onAction={() => setSelectedFilter('continue')}
            title={copy.myRecipes as string}
          />
          <View style={styles.recipeList}>
            {displayedRecipes.slice(0, 4).map((recipe) => (
              <RecipeListRow
                copy={copy}
                key={recipe.id}
                language={language}
                onOpen={() => openRecipe(recipe)}
                onShoot={() => shootRecipe(recipe)}
                recipe={recipe}
              />
            ))}
          </View>

          <Pressable accessibilityRole="button" onPress={() => openRecipeProduct(continueRecipe ?? recipes[0] ?? null)} style={styles.publishCta}>
            <View style={styles.publishIcon}>
              <MaterialCommunityIcons color="#8c67ff" name="web" size={22} />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-[15px] font-black text-ink">{copy.publishTitle as string}</Text>
              <Text className="mt-0.5 text-[12px] font-semibold text-muted" numberOfLines={1}>
                {copy.publishBody as string}
              </Text>
            </View>
            <View className="overflow-hidden rounded-full">
              <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.publishButton}>
                <Text className="text-[12px] font-black text-white">{copy.publishAction as string}</Text>
              </LinearGradient>
            </View>
          </Pressable>
        </View>
      </RecipesTabScrollView>
      <RecipeCreateFab onPress={() => startRecipeCreate('manual')} />
    </View>
  );
}

function HeaderBlock({ copy }: { copy: (typeof recipeCopy)['en'] }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        <Image source={require('../../../../assets/parrot-logo.png')} style={styles.logo} />
        <View className="min-w-0 flex-1">
          <Text className="text-[30px] font-black leading-[34px] text-ink">{copy.title as string}</Text>
          <Text className="text-[13px] font-semibold text-muted" numberOfLines={1}>
            {copy.subtitle as string}
          </Text>
        </View>
      </View>
      <View className="h-10 w-10 items-center justify-center">
        <MaterialCommunityIcons color="#111827" name="bell-outline" size={24} />
        <View style={styles.notificationDot}>
          <Text className="text-[8px] font-black text-white">1</Text>
        </View>
      </View>
    </View>
  );
}

function SearchRow({ placeholder }: { placeholder: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <View style={styles.searchBox}>
        <MaterialCommunityIcons color="#94a3b8" name="magnify" size={18} />
        <TextInput
          className="flex-1 text-[13px] font-semibold text-ink"
          placeholder={placeholder}
          placeholderTextColor="#a3afc1"
        />
      </View>
      <Pressable accessibilityRole="button" style={styles.tuneButton}>
        <MaterialCommunityIcons color="#334155" name="tune-variant" size={22} />
      </Pressable>
    </View>
  );
}

function FilterRail({
  copy,
  onSelect,
  selectedFilter,
}: {
  copy: (typeof recipeCopy)['en'];
  onSelect: (filter: RecipeFilter) => void;
  selectedFilter: RecipeFilter;
}) {
  const labels = copy.filters as Record<RecipeFilter, string>;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2 pr-5">
        {filters.map((filter) => {
          const selected = filter === selectedFilter;

          return (
            <Pressable
              accessibilityRole="button"
              key={filter}
              onPress={() => onSelect(filter)}
              style={[styles.filterPill, selected ? styles.filterPillActive : null]}
            >
              <Text style={[styles.filterPillText, selected ? styles.filterPillTextActive : null]}>
                {labels[filter]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function ContinueShootCard({
  copy,
  language,
  onOpen,
  onShoot,
  recipe,
}: {
  copy: (typeof recipeCopy)['en'];
  language: AppLanguage;
  onOpen: () => void;
  onShoot: () => void;
  recipe: MockRecipe;
}) {
  const progressRatio = recipe.totalSceneCount > 0 ? recipe.shotSceneCount / recipe.totalSceneCount : 0;
  const progressWidth: DimensionValue = `${Math.max(16, Math.min(100, Math.round(progressRatio * 100)))}%`;

  return (
    <View className="gap-2">
      <Text className="text-[15px] font-black text-ink">{copy.continueSection as string}</Text>
      <Pressable accessibilityRole="button" onPress={onOpen} style={styles.continueCard}>
        <Image source={toImageSource(recipe.thumbnail)} style={styles.continueImage} />
        <View className="min-w-0 flex-1 gap-1.5">
          <View className="flex-row items-start justify-between gap-2">
            <Text className="flex-1 text-[16px] font-black leading-[20px] text-ink" numberOfLines={2}>
              {recipe.title}
            </Text>
            <MaterialCommunityIcons color="#111827" name="dots-horizontal" size={20} />
          </View>
          <Text className="text-[12px] font-semibold text-muted" numberOfLines={1}>
            {recipe.ownerHandle} · {formatShotProgress(language, recipe.shotSceneCount, recipe.totalSceneCount)}
          </Text>
          <Text className="text-[12px] font-semibold text-muted" numberOfLines={1}>
            {copy.lastUsed as string} · {localizeActivityLabel(language, recipe.lastShotAt ?? recipe.savedAt)}
          </Text>
          <View style={styles.progressTrack}>
            <LinearGradient colors={['#8c67ff', '#de81c1']} style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <View className="flex-row justify-end pt-1">
            <Pressable accessibilityRole="button" className="overflow-hidden rounded-full" onPress={onShoot}>
              <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.continueButton}>
                <Text className="text-[12px] font-black text-white">{copy.continueAction as string}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

function SectionHeader({
  action,
  onAction,
  title,
}: {
  action: string;
  onAction: () => void;
  title: string;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-[16px] font-black text-ink">{title}</Text>
      <Pressable accessibilityRole="button" hitSlop={8} onPress={onAction}>
        <View className="flex-row items-center gap-1">
          <Text className="text-[12px] font-bold text-muted">{action}</Text>
          <MaterialCommunityIcons color="#64748b" name="chevron-right" size={16} />
        </View>
      </Pressable>
    </View>
  );
}

function CollectionFolderCard({
  collection,
  language,
  onPress,
}: {
  collection: CollectionItem;
  language: AppLanguage;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.collectionFolder}>
      <FolderIcon color={collection.color} />
      <Text className="mt-2 text-[12px] font-black leading-4 text-ink" numberOfLines={2}>
        {collection.title[language]}
      </Text>
      <Text className="mt-1 text-[12px] font-bold text-muted">{collection.count}</Text>
    </Pressable>
  );
}

function RecipeListRow({
  copy,
  language,
  onOpen,
  onShoot,
  recipe,
}: {
  copy: (typeof recipeCopy)['en'];
  language: AppLanguage;
  onOpen: () => void;
  onShoot: () => void;
  recipe: MockRecipe;
}) {
  return (
    <View style={styles.recipeRow}>
      <Pressable accessibilityRole="button" className="min-w-0 flex-1 flex-row items-center gap-3" onPress={onOpen}>
        <Image source={toImageSource(recipe.thumbnail)} style={styles.recipeRowImage} />
        <View className="min-w-0 flex-1">
          <Text className="text-[14px] font-black leading-[18px] text-ink" numberOfLines={1}>
            {recipe.title}
          </Text>
          <Text className="mt-1 text-[11px] font-semibold text-muted" numberOfLines={1}>
            {recipe.ownerHandle} · {recipe.totalSceneCount} {language === 'ko' ? '씬' : 'scenes'}
          </Text>
          <Text className="mt-0.5 text-[11px] font-semibold text-muted" numberOfLines={1}>
            {localizeActivityLabel(language, recipe.lastShotAt ?? recipe.savedAt)}
          </Text>
        </View>
      </Pressable>
      <View className="items-end gap-2">
        <OwnershipBadge language={language} recipe={recipe} />
        <View className="flex-row gap-1.5">
          <Pressable accessibilityRole="button" onPress={onOpen} style={styles.smallGhostButton}>
            <Text className="text-[11px] font-black text-slate-700">{copy.open as string}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onShoot} style={styles.smallPrimaryButton}>
            <Text className="text-[11px] font-black text-white">{copy.shoot as string}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function CollectionScreen({
  collections,
  copy,
  imageLookup,
  language,
  onBack,
  onOpenRecipe,
  onShootRecipe,
  recipes,
}: {
  collections: CollectionItem[];
  copy: (typeof recipeCopy)['en'];
  imageLookup: Map<string, AppImageSource>;
  language: AppLanguage;
  onBack: () => void;
  onOpenRecipe: (recipe: MockRecipe) => void;
  onShootRecipe: (recipe: MockRecipe) => void;
  recipes: MockRecipe[];
}) {
  const featuredCollection = collections[0];

  return (
    <View className="gap-5 px-5">
      <SubHeader onBack={onBack} title={copy.collectionTitle as string}>
        <Pressable accessibilityRole="button" hitSlop={8}>
          <MaterialCommunityIcons color="#111827" name="plus" size={23} />
        </Pressable>
      </SubHeader>

      <SearchRow placeholder={copy.collectionSearch as string} />

      <View className="flex-row gap-2">
        {collections.map((collection) => (
          <CollectionFolderCard
            collection={collection}
            key={collection.id}
            language={language}
            onPress={() => undefined}
          />
        ))}
      </View>

      <SectionHeader action="" onAction={() => undefined} title={copy.recentCollection as string} />
      <View style={styles.featuredCollection}>
        <View className="flex-row items-center gap-3">
          <FolderIcon color={featuredCollection.color} size="sm" />
          <View className="min-w-0 flex-1">
            <Text className="text-[20px] font-black text-ink">{featuredCollection.title[language]}</Text>
            <Text className="text-[12px] font-semibold text-muted">
              {featuredCollection.count}{language === 'ko' ? '개의 레시피' : ' recipes'}
            </Text>
          </View>
          <MaterialCommunityIcons color="#111827" name="chevron-right" size={24} />
        </View>
        <View className="mt-3 flex-row gap-2">
          {featuredCollection.imageIds.map((imageId) => (
            <Image
              key={imageId}
              source={toImageSource(imageLookup.get(imageId) ?? recipes[0]?.thumbnail)}
              style={styles.collectionPreviewImage}
            />
          ))}
          {recipes.slice(0, 2).map((recipe) => (
            <Image key={recipe.id} source={toImageSource(recipe.thumbnail)} style={styles.collectionPreviewImage} />
          ))}
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-[16px] font-black text-ink">{copy.recipesInCollection as string}</Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-[12px] font-bold text-muted">{copy.newest as string}</Text>
          <MaterialCommunityIcons color="#64748b" name="chevron-down" size={14} />
        </View>
      </View>

      <View style={styles.recipeList}>
        {recipes.slice(0, 3).map((recipe) => (
          <RecipeListRow
            copy={copy}
            key={recipe.id}
            language={language}
            onOpen={() => onOpenRecipe(recipe)}
            onShoot={() => onShootRecipe(recipe)}
            recipe={recipe}
          />
        ))}
      </View>

      <Pressable accessibilityRole="button" style={styles.manageButton}>
        <MaterialCommunityIcons color="#8c67ff" name="cog-outline" size={17} />
        <Text className="text-[13px] font-black text-violet">{copy.manageCollection as string}</Text>
      </Pressable>
    </View>
  );
}

function PublishRecipeScreen({
  access,
  category,
  destination,
  exportOpen,
  language,
  onBack,
  onEdit,
  onPreview,
  onSelectAccess,
  onSelectCategory,
  onSelectDestination,
  onSelectVisibility,
  onToggleExport,
  recipe,
  step,
  visibility,
}: {
  access: AssetAccessMode;
  category: AssetPublishCategory;
  destination: AssetUsageDestination;
  exportOpen: boolean;
  language: AppLanguage;
  onBack: () => void;
  onEdit: () => void;
  onPreview: () => void;
  onSelectAccess: (access: AssetAccessMode) => void;
  onSelectCategory: (category: AssetPublishCategory) => void;
  onSelectDestination: (destination: AssetUsageDestination) => void;
  onSelectVisibility: (visibility: AssetPublishVisibility) => void;
  onToggleExport: () => void;
  recipe: MockRecipe | null;
  step: AssetFlowStep;
  visibility: AssetPublishVisibility;
}) {
  const copy = assetFlowCopy[language];
  const product = recipe ? createRecipeProductDemoModel(recipe, step !== 'complete') : null;

  if (!recipe || !product) {
    return (
      <View className="gap-4 px-5">
        <SubHeader onBack={onBack} title="Recipe Asset">
          <View />
        </SubHeader>
        <View style={styles.emptyProductCard}>
          <MaterialCommunityIcons color="#94a3b8" name="package-variant-closed" size={24} />
          <Text className="text-center text-[14px] font-black text-ink">No recipe selected</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-5 px-5">
      <SubHeader onBack={onBack} title="Recipe Asset">
        <RecipeAssetStepBadge step={step} />
      </SubHeader>

      <RecipeAssetProgress step={step} />

      {step === 'complete' ? (
        <RecipeCompleteSummary
          copy={copy}
          exportOpen={exportOpen}
          onEdit={onEdit}
          onPreview={onPreview}
          onToggleExport={onToggleExport}
          product={product}
          recipe={recipe}
        />
      ) : null}

      {step === 'saved' ? (
        <RecipeSavedHub
          copy={copy}
          product={product}
          recipe={recipe}
        />
      ) : null}

      {step === 'usage' ? (
        <RecipeUsageDestination
          copy={copy}
          destination={destination}
          onSelectDestination={onSelectDestination}
        />
      ) : null}

      {step === 'settings' ? (
        <RecipeMarketplaceSettings
          access={access}
          category={category}
          copy={copy}
          onSelectAccess={onSelectAccess}
          onSelectCategory={onSelectCategory}
          onSelectVisibility={onSelectVisibility}
          product={product}
          recipe={recipe}
          visibility={visibility}
        />
      ) : null}

      {step === 'submitted' ? (
        <RecipeAssetSubmitted
          copy={copy}
          destination={destination}
          product={product}
          recipe={recipe}
        />
      ) : null}
    </View>
  );
}

function RecipeAssetProgress({ step }: { step: AssetFlowStep }) {
  const steps: Array<{ id: AssetFlowStep; label: string }> = [
    { id: 'complete', label: '5-1' },
    { id: 'saved', label: '5-2' },
    { id: 'usage', label: '6-1' },
    { id: 'settings', label: '6-2' },
  ];
  const currentIndex = step === 'submitted' ? steps.length : Math.max(0, steps.findIndex((item) => item.id === step));

  return (
    <View style={styles.assetProgressShell}>
      {steps.map((item, index) => {
        const active = index <= currentIndex;

        return (
          <View className="flex-1" key={item.id}>
            <View style={[styles.assetProgressDot, active ? styles.assetProgressDotActive : null]}>
              <Text style={[styles.assetProgressLabel, active ? styles.assetProgressLabelActive : null]}>{item.label}</Text>
            </View>
            <View style={[styles.assetProgressLine, active ? styles.assetProgressLineActive : null]} />
          </View>
        );
      })}
    </View>
  );
}

function RecipeAssetStepBadge({ step }: { step: AssetFlowStep }) {
  const label = step === 'complete' ? 'STEP 5-1' : step === 'saved' ? 'STEP 5-2' : step === 'usage' ? 'STEP 6-1' : step === 'settings' ? 'STEP 6-2' : 'READY';

  return (
    <View style={styles.assetStepBadge}>
      <Text className="text-[11px] font-black text-violet">{label}</Text>
    </View>
  );
}

function RecipeCompleteSummary({
  copy,
  exportOpen,
  onEdit,
  onPreview,
  onToggleExport,
  product,
  recipe,
}: {
  copy: (typeof assetFlowCopy)[AppLanguage];
  exportOpen: boolean;
  onEdit: () => void;
  onPreview: () => void;
  onToggleExport: () => void;
  product: ReturnType<typeof createRecipeProductDemoModel>;
  recipe: MockRecipe;
}) {
  return (
    <View className="gap-4">
      <View className="items-center gap-2">
        <View style={styles.assetCheckIcon}>
          <MaterialCommunityIcons color="#fff" name="check" size={24} />
        </View>
        <Text className="text-center text-[25px] font-black leading-[30px] text-ink">{copy.completeTitle}</Text>
        <Text className="max-w-[310px] text-center text-[13px] font-semibold leading-5 text-muted">
          {copy.completeSubtitle}
        </Text>
      </View>

      <RecipeAssetHero product={product} recipe={recipe} />

      <AssetIncludedList copy={copy} product={product} />

      <View className="flex-row gap-2">
        <AssetMiniAction icon="play-box-outline" label={copy.preview} onPress={onPreview} />
        <AssetMiniAction icon="pencil-outline" label={copy.edit} onPress={onEdit} />
        <AssetMiniAction icon="tray-arrow-up" label={copy.export} onPress={onToggleExport} />
      </View>

      {exportOpen ? (
        <View style={styles.exportPackageCard}>
          <MaterialCommunityIcons color="#8c67ff" name="package-variant-closed" size={20} />
          <View className="min-w-0 flex-1">
            <Text className="text-[13px] font-black text-ink">{copy.exportTitle}</Text>
            <Text className="mt-0.5 text-[12px] font-semibold leading-4 text-muted">{copy.exportBody}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function RecipeSavedHub({
  copy,
  product,
  recipe,
}: {
  copy: (typeof assetFlowCopy)[AppLanguage];
  product: ReturnType<typeof createRecipeProductDemoModel>;
  recipe: MockRecipe;
}) {
  const nextActions = copy.nextActions as Array<{ icon: IconName; title: string; body: string }>;

  return (
    <View className="gap-4">
      <View className="items-center gap-2">
        <View style={styles.assetCheckIcon}>
          <MaterialCommunityIcons color="#fff" name="check" size={24} />
        </View>
        <Text className="text-center text-[24px] font-black text-ink">{copy.savedTitle}</Text>
        <Text className="max-w-[320px] text-center text-[13px] font-semibold leading-5 text-muted">
          {copy.savedSubtitle}
        </Text>
      </View>

      <View style={styles.savedRecipeCard}>
        <Image source={toImageSource(recipe.thumbnail)} style={styles.savedRecipeImage} />
        <View className="min-w-0 flex-1">
          <Text className="text-[16px] font-black leading-5 text-ink" numberOfLines={2}>{product.title}</Text>
          <Text className="mt-1 text-[12px] font-semibold text-muted">
            {recipe.totalSceneCount} cuts · {getRecipeDurationLabel(recipe)} · Today
          </Text>
        </View>
        <MaterialCommunityIcons color="#111827" name="chevron-right" size={23} />
      </View>

      <View className="gap-2.5">
        <Text className="text-[14px] font-black text-ink">{copy.nextTitle}</Text>
        {nextActions.map((action) => (
          <View key={action.title} style={styles.nextActionRow}>
            <View style={styles.nextActionIcon}>
              <MaterialCommunityIcons color="#8c67ff" name={action.icon} size={18} />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-[13px] font-black text-ink">{action.title}</Text>
              <Text className="mt-0.5 text-[11px] font-semibold text-muted" numberOfLines={1}>{action.body}</Text>
            </View>
            <MaterialCommunityIcons color="#94a3b8" name="chevron-right" size={20} />
          </View>
        ))}
      </View>
    </View>
  );
}

function RecipeUsageDestination({
  copy,
  destination,
  onSelectDestination,
}: {
  copy: (typeof assetFlowCopy)[AppLanguage];
  destination: AssetUsageDestination;
  onSelectDestination: (destination: AssetUsageDestination) => void;
}) {
  const destinations = copy.destinations as Record<AssetUsageDestination, { icon: IconName; title: string; body: string }>;

  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-center text-[24px] font-black leading-[30px] text-ink">{copy.usageTitle}</Text>
        <Text className="text-center text-[13px] font-semibold leading-5 text-muted">{copy.usageSubtitle}</Text>
      </View>

      <View className="gap-3">
        {(Object.keys(destinations) as AssetUsageDestination[]).map((option) => {
          const selected = option === destination;
          const item = destinations[option];

          return (
            <Pressable
              accessibilityRole="button"
              key={option}
              onPress={() => onSelectDestination(option)}
              style={[styles.destinationCard, selected ? styles.destinationCardActive : null]}
            >
              <View style={[styles.destinationIcon, selected ? styles.destinationIconActive : null]}>
                <MaterialCommunityIcons color={selected ? '#ffffff' : '#8c67ff'} name={item.icon} size={23} />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="text-[15px] font-black text-ink">{item.title}</Text>
                <Text className="mt-1 text-[12px] font-semibold leading-4 text-muted">{item.body}</Text>
              </View>
              <MaterialCommunityIcons color={selected ? '#8c67ff' : '#cbd5e1'} name={selected ? 'check-circle' : 'circle-outline'} size={23} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.assetNotice}>
        <MaterialCommunityIcons color="#8c67ff" name="lightbulb-outline" size={16} />
        <Text className="min-w-0 flex-1 text-[12px] font-semibold text-muted">{copy.usageNote}</Text>
      </View>
    </View>
  );
}

function RecipeMarketplaceSettings({
  access,
  category,
  copy,
  onSelectAccess,
  onSelectCategory,
  onSelectVisibility,
  product,
  recipe,
  visibility,
}: {
  access: AssetAccessMode;
  category: AssetPublishCategory;
  copy: (typeof assetFlowCopy)[AppLanguage];
  onSelectAccess: (access: AssetAccessMode) => void;
  onSelectCategory: (category: AssetPublishCategory) => void;
  onSelectVisibility: (visibility: AssetPublishVisibility) => void;
  product: ReturnType<typeof createRecipeProductDemoModel>;
  recipe: MockRecipe;
  visibility: AssetPublishVisibility;
}) {
  const categories = copy.categories as Record<AssetPublishCategory, string>;
  const visibilityOptions = copy.visibilityOptions as Record<AssetPublishVisibility, { icon: IconName; title: string }>;
  const accessOptions = copy.accessOptions as Record<AssetAccessMode, { icon: IconName; title: string }>;

  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-[24px] font-black text-ink">{copy.settingsTitle}</Text>
        <Text className="text-[13px] font-semibold leading-5 text-muted">{copy.settingsSubtitle}</Text>
      </View>

      <View className="flex-row gap-4">
        <ImageBackground imageStyle={styles.marketCoverImage} source={toImageSource(recipe.thumbnail)} style={styles.marketCover}>
          <LinearGradient colors={['rgba(15,23,42,0.02)', 'rgba(15,23,42,0.58)']} style={StyleSheet.absoluteFill} />
          <View style={styles.coverChangePill}>
            <MaterialCommunityIcons color="#111827" name="camera-outline" size={14} />
            <Text className="text-[10px] font-black text-ink">Cover</Text>
          </View>
        </ImageBackground>

        <View className="min-w-0 flex-1 gap-3">
          <LabeledInput counter={`${product.title.length}/60`} label={`${copy.titleLabel} *`} value={product.title} />
          <LabeledInput counter={`${Math.min(product.description.length, 120)}/120`} label={`${copy.descriptionLabel} *`} multiline value={product.description} />
        </View>
      </View>

      <AssetOptionSection title={copy.category}>
        {(Object.keys(categories) as AssetPublishCategory[]).map((option) => (
          <SegmentOption
            icon={option === 'food' ? 'food-apple-outline' : option === 'beauty' ? 'creation-outline' : option === 'business' ? 'briefcase-outline' : option === 'lifestyle' ? 'coffee-outline' : 'dots-horizontal'}
            key={option}
            label={categories[option]}
            onPress={() => onSelectCategory(option)}
            selected={option === category}
          />
        ))}
      </AssetOptionSection>

      <AssetOptionSection title={copy.visibility}>
        {(Object.keys(visibilityOptions) as AssetPublishVisibility[]).map((option) => (
          <SegmentOption
            icon={visibilityOptions[option].icon}
            key={option}
            label={visibilityOptions[option].title}
            onPress={() => onSelectVisibility(option)}
            selected={option === visibility}
          />
        ))}
      </AssetOptionSection>

      <AssetOptionSection title={copy.access}>
        {(Object.keys(accessOptions) as AssetAccessMode[]).map((option) => (
          <SegmentOption
            icon={accessOptions[option].icon}
            key={option}
            label={accessOptions[option].title}
            onPress={() => onSelectAccess(option)}
            selected={option === access}
          />
        ))}
      </AssetOptionSection>

      {access === 'paid' ? (
        <View style={styles.priceInlineCard}>
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons color="#8c67ff" name="currency-usd" size={17} />
            <Text className="text-[12px] font-black text-slate-700">{copy.price}</Text>
          </View>
          <Text className="text-[16px] font-black text-violet">{product.priceLabel}</Text>
        </View>
      ) : null}

      <AssetIncludedList copy={copy} compact product={product} />
    </View>
  );
}

function RecipeAssetSubmitted({
  copy,
  destination,
  product,
  recipe,
}: {
  copy: (typeof assetFlowCopy)[AppLanguage];
  destination: AssetUsageDestination;
  product: ReturnType<typeof createRecipeProductDemoModel>;
  recipe: MockRecipe;
}) {
  const destinations = copy.destinations as Record<AssetUsageDestination, { icon: IconName; title: string; body: string }>;
  const selected = destinations[destination];

  return (
    <View className="items-center gap-4">
      <View style={styles.assetCheckIcon}>
        <MaterialCommunityIcons color="#fff" name="check" size={24} />
      </View>
      <View className="items-center gap-1">
        <Text className="text-center text-[24px] font-black text-ink">{copy.submittedTitle}</Text>
        <Text className="max-w-[320px] text-center text-[13px] font-semibold leading-5 text-muted">
          {copy.submittedSubtitle}
        </Text>
      </View>
      <View style={[styles.destinationCard, styles.destinationCardActive]}>
        <View className="flex-row items-center gap-3">
          <View style={[styles.destinationIcon, styles.destinationIconActive]}>
            <MaterialCommunityIcons color="#ffffff" name={selected.icon} size={22} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-[15px] font-black text-ink">{selected.title}</Text>
            <Text className="mt-1 text-[12px] font-semibold leading-4 text-muted">{selected.body}</Text>
          </View>
        </View>
      </View>
      <RecipeAssetHero product={product} recipe={recipe} />
    </View>
  );
}

function RecipeAssetHero({
  product,
  recipe,
}: {
  product: ReturnType<typeof createRecipeProductDemoModel>;
  recipe: MockRecipe;
}) {
  return (
    <ImageBackground imageStyle={styles.assetHeroImage} resizeMode="cover" source={toImageSource(recipe.thumbnail)} style={styles.assetHero}>
      <LinearGradient colors={['rgba(15,23,42,0.05)', 'rgba(15,23,42,0.82)']} style={StyleSheet.absoluteFill} />
      <View className="flex-1 justify-between">
        <View className="flex-row items-center justify-between">
          <View style={styles.assetHeroDuration}>
            <Text className="text-[12px] font-black text-white">{getRecipeDurationLabel(recipe)}</Text>
          </View>
          <View style={styles.assetHeroReady}>
            <MaterialCommunityIcons color="#ffffff" name="television-guide" size={14} />
            <Text className="text-[11px] font-black text-white">Prompter ready</Text>
          </View>
        </View>
        <View>
          <Text className="text-[24px] font-black leading-[28px] text-white" numberOfLines={2}>{product.title}</Text>
          <Text className="mt-1 text-[13px] font-semibold text-white/85">
            {recipe.totalSceneCount} cuts · Recipe Asset
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

function AssetIncludedList({
  compact = false,
  copy,
  product,
}: {
  compact?: boolean;
  copy: (typeof assetFlowCopy)[AppLanguage];
  product: ReturnType<typeof createRecipeProductDemoModel>;
}) {
  return (
    <View className="gap-2">
      <Text className="text-[14px] font-black text-ink">{compact ? copy.includes : copy.includedTitle}</Text>
      <View style={styles.assetIncludesGrid}>
        {product.includedItems.map((item) => (
          <View key={item.title} style={styles.assetIncludePill}>
            <MaterialCommunityIcons color="#8c67ff" name={getAssetItemIcon(item.title)} size={16} />
            <Text className="min-w-0 flex-1 text-[12px] font-black text-slate-700" numberOfLines={1}>{item.title}</Text>
            <MaterialCommunityIcons color="#8c67ff" name="check" size={15} />
          </View>
        ))}
      </View>
    </View>
  );
}

function AssetMiniAction({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.assetMiniAction}>
      <MaterialCommunityIcons color="#111827" name={icon} size={18} />
      <Text className="text-[12px] font-black text-ink">{label}</Text>
    </Pressable>
  );
}

function AssetOptionSection({ children, title }: PropsWithChildren<{ title: string }>) {
  return (
    <View className="gap-2">
      <Text className="text-[13px] font-black text-ink">{title}</Text>
      <View className="flex-row flex-wrap gap-2">{children}</View>
    </View>
  );
}

function SegmentOption({
  icon,
  label,
  onPress,
  selected,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.segmentOption, selected ? styles.segmentOptionActive : null]}>
      <MaterialCommunityIcons color={selected ? '#ffffff' : '#64748b'} name={icon} size={16} />
      <Text style={[styles.segmentOptionText, selected ? styles.segmentOptionTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

function RecipeAssetBottomCta({
  access,
  language,
  onPrimary,
  onSecondary,
  step,
}: {
  access: AssetAccessMode;
  language: AppLanguage;
  onPrimary: () => void;
  onSecondary: () => void;
  step: AssetFlowStep;
}) {
  const insets = useSafeAreaInsets();
  const copy = assetFlowCopy[language];
  const label =
    step === 'complete'
      ? copy.saveAsset
      : step === 'saved'
        ? copy.chooseUsage
        : step === 'usage'
          ? copy.continue
          : step === 'settings'
            ? access === 'paid'
              ? copy.publishRecipe
              : copy.submitRecipe
            : copy.done;
  const icon: IconName = step === 'complete' ? 'lock-check-outline' : step === 'settings' ? 'send' : step === 'submitted' ? 'check' : 'arrow-right';

  return (
    <View pointerEvents="box-none" style={[styles.publishFooterLayer, { bottom: insets.bottom + 88 }]}>
      <View className="gap-2 px-5">
        <Pressable accessibilityRole="button" className="overflow-hidden rounded-full" onPress={onPrimary}>
          <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.bigPublishButton}>
            <Text className="text-[16px] font-black text-white">{label}</Text>
            <MaterialCommunityIcons color="#fff" name={icon} size={20} />
          </LinearGradient>
        </Pressable>

        {step === 'saved' ? (
          <Pressable accessibilityRole="button" onPress={onSecondary} style={styles.secondaryAssetButton}>
            <Text className="text-[13px] font-black text-slate-700">{copy.goRecipes}</Text>
          </Pressable>
        ) : null}

        {step === 'settings' ? (
          <View className="flex-row items-center justify-center gap-1">
            <MaterialCommunityIcons color="#94a3b8" name="shield-check-outline" size={13} />
            <Text className="text-center text-[11px] font-semibold text-muted">{copy.secureNote}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function getAssetItemIcon(title: string): IconName {
  if (title.includes("Reference")) return "play-box-outline";
  if (title.includes("Cut")) return "view-dashboard-outline";
  if (title.includes("Script")) return "script-text-outline";
  if (title.includes("Sample")) return "video-outline";
  return "television-guide";
}

function getRecipeDurationLabel(recipe: MockRecipe): string {
  const totalSeconds = recipe.scenes.reduce((sum, scene) => sum + getSceneDurationSeconds(scene.startTime, scene.endTime), 0);

  if (totalSeconds > 0) {
    return `${totalSeconds}s`;
  }

  return `${Math.max(20, recipe.totalSceneCount * 10)}s`;
}

function getSceneDurationSeconds(start?: string, end?: string): number {
  const startSeconds = parseTimestampSeconds(start);
  const endSeconds = parseTimestampSeconds(end);

  if (startSeconds === null || endSeconds === null || endSeconds <= startSeconds) {
    return 0;
  }

  return endSeconds - startSeconds;
}

function parseTimestampSeconds(value?: string): number | null {
  if (!value) {
    return null;
  }

  const parts = value.split(':').map((part) => Number(part));

  if (parts.length !== 2 || parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  return parts[0] * 60 + parts[1];
}

function RecipesTabScrollView({
  bottomPadding = 176,
  children,
}: PropsWithChildren<{ bottomPadding?: number }>) {
  const insets = useSafeAreaInsets();
  const { topBarProgress } = useAppChrome();

  useFocusEffect(
    useCallback(() => {
      topBarProgress.value = APP_TOP_BAR_HIDE_RANGE;

      return () => {
        topBarProgress.value = 0;
      };
    }, [topBarProgress])
  );

  return (
    <ScrollView
      automaticallyAdjustContentInsets={false}
      className="flex-1 bg-canvas"
      contentContainerStyle={{
        paddingBottom: bottomPadding,
        paddingTop: insets.top + 10,
      }}
      contentInsetAdjustmentBehavior="never"
      scrollIndicatorInsets={{
        bottom: bottomPadding,
        top: insets.top + 10,
      }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

function SubHeader({
  children,
  onBack,
  title,
}: {
  children: React.ReactNode;
  onBack: () => void;
  title: string;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Pressable accessibilityRole="button" className="h-10 w-10 justify-center" onPress={onBack}>
        <MaterialCommunityIcons color="#111827" name="arrow-left" size={23} />
      </Pressable>
      <Text className="text-[17px] font-black text-ink">{title}</Text>
      <View className="h-10 w-10 items-end justify-center">{children}</View>
    </View>
  );
}

function LabeledInput({
  counter,
  label,
  multiline,
  value,
}: {
  counter: string;
  label: string;
  multiline?: boolean;
  value: string;
}) {
  return (
    <View className="gap-1">
      <Text className="text-[11px] font-semibold text-muted">{label}</Text>
      <View style={[styles.inputBox, multiline ? styles.inputBoxMultiline : null]}>
        <Text className="text-[13px] font-semibold leading-5 text-ink" numberOfLines={multiline ? 3 : 1}>
          {value}
        </Text>
      </View>
      <Text className="self-end text-[10px] font-semibold text-muted">{counter}</Text>
    </View>
  );
}

function RecipeCreateFab({ onPress }: { onPress: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={styles.localFabLayer}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={[styles.localFabPressable, { bottom: insets.bottom + 58 }]}
      >
        {({ pressed }) => (
          <View style={pressed ? styles.localFabPressed : styles.localFabContent}>
            <LinearGradient
              colors={['#ffb39a', '#ecabd8', '#b196ff']}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={styles.localFabButton}
            >
              <View style={styles.localFabGlow} />
              <View style={styles.localFabHighlight} />
              <MaterialCommunityIcons color="#fffdf8" name="plus" size={28} />
            </LinearGradient>
          </View>
        )}
      </Pressable>
    </View>
  );
}

function OwnershipBadge({
  language,
  recipe,
}: {
  language: AppLanguage;
  recipe: MockRecipe;
}) {
  const copy: Record<MockRecipe['ownership'], { bg: string; color: string; label: string }> = {
    community: { bg: '#eef2ff', color: '#4f46e5', label: language === 'ko' ? 'Community' : 'Community' },
    downloaded: { bg: '#ffe4ec', color: '#fb7185', label: language === 'ko' ? 'Saved' : 'Saved' },
    owned: { bg: '#ede9fe', color: '#8c67ff', label: language === 'ko' ? 'Owned' : 'Owned' },
    remixed: { bg: '#ffedd5', color: '#fb923c', label: language === 'ko' ? 'Remix' : 'Remix' },
  };
  const badge = copy[recipe.ownership];

  return (
    <View style={[styles.ownershipBadge, { backgroundColor: badge.bg }]}>
      <Text style={[styles.ownershipBadgeText, { color: badge.color }]}>{badge.label}</Text>
    </View>
  );
}

function FolderIcon({
  color,
  size = 'md',
}: {
  color: string;
  size?: 'sm' | 'md';
}) {
  const width = size === 'sm' ? 42 : 48;
  const height = size === 'sm' ? 34 : 38;

  return (
    <View style={{ height, width }}>
      <View style={[styles.folderTab, { backgroundColor: `${color}88`, width: width * 0.48 }]} />
      <LinearGradient
        colors={[`${color}88`, color]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[styles.folderBody, { height: height - 7, top: 7, width }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  assetCheckIcon: {
    alignItems: 'center',
    backgroundColor: '#8c67ff',
    borderColor: '#efe8ff',
    borderRadius: 999,
    borderWidth: 6,
    height: 58,
    justifyContent: 'center',
    shadowColor: '#8c67ff',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    width: 58,
  },
  assetHero: {
    borderRadius: 24,
    height: 224,
    overflow: 'hidden',
    padding: 16,
  },
  assetHeroDuration: {
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  assetHeroImage: {
    borderRadius: 24,
  },
  assetHeroReady: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.32)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  assetIncludePill: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 14,
    borderWidth: 1,
    flexBasis: '48%',
    flexDirection: 'row',
    flexGrow: 1,
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 10,
  },
  assetIncludesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  assetMiniAction: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    minHeight: 52,
  },
  assetNotice: {
    alignItems: 'center',
    backgroundColor: '#fbf8ff',
    borderColor: '#eadfff',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  assetProgressDot: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#eef2f7',
    borderRadius: 999,
    minWidth: 42,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  assetProgressDotActive: {
    backgroundColor: '#f3f0ff',
  },
  assetProgressLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '900',
  },
  assetProgressLabelActive: {
    color: '#8c67ff',
  },
  assetProgressLine: {
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    height: 3,
    marginTop: 8,
  },
  assetProgressLineActive: {
    backgroundColor: '#8c67ff',
  },
  assetProgressShell: {
    flexDirection: 'row',
    gap: 5,
  },
  assetStepBadge: {
    backgroundColor: '#f3f0ff',
    borderColor: '#eadfff',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  bigPublishButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
  },
  categoryPill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  categoryPillActive: {
    backgroundColor: '#8c67ff',
  },
  categoryPillText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '900',
  },
  categoryPillTextActive: {
    color: '#ffffff',
  },
  collectionFolder: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    minHeight: 98,
    padding: 12,
  },
  collectionPreviewImage: {
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    flex: 1,
    height: 64,
  },
  createdBanner: {
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  createdIcon: {
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  continueButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 38,
    minWidth: 96,
    paddingHorizontal: 14,
  },
  continueCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 10,
  },
  continueImage: {
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    height: 112,
    width: 112,
  },
  coverChangePill: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    bottom: 10,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    position: 'absolute',
  },
  destinationCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 92,
    padding: 13,
  },
  destinationCardActive: {
    backgroundColor: '#fbf8ff',
    borderColor: '#8c67ff',
    borderWidth: 1.5,
  },
  destinationIcon: {
    alignItems: 'center',
    backgroundColor: '#f3f0ff',
    borderRadius: 16,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  destinationIconActive: {
    backgroundColor: '#8c67ff',
  },
  emptyProductCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    justifyContent: 'center',
    minHeight: 140,
    padding: 18,
  },
  featuredCollection: {
    backgroundColor: '#fbf8ff',
    borderColor: '#e8ddff',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
  },
  filterPill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  filterPillActive: {
    backgroundColor: '#8c67ff',
  },
  filterPillText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '900',
  },
  filterPillTextActive: {
    color: '#ffffff',
  },
  folderBody: {
    borderRadius: 8,
    left: 0,
    position: 'absolute',
  },
  folderTab: {
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    height: 12,
    left: 5,
    position: 'absolute',
    top: 0,
  },
  includeIcon: {
    alignItems: 'center',
    backgroundColor: '#f3f0ff',
    borderRadius: 9,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  includeList: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  inputBox: {
    borderColor: '#dbe3ee',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 13,
  },
  inputBoxMultiline: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: 68,
    paddingVertical: 10,
  },
  exportPackageCard: {
    alignItems: 'center',
    backgroundColor: '#fbf8ff',
    borderColor: '#eadfff',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 13,
  },
  logo: {
    height: 34,
    width: 34,
  },
  marketCover: {
    height: 164,
    overflow: 'hidden',
    width: 116,
  },
  marketCoverImage: {
    borderRadius: 18,
  },
  localFabButton: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.88)',
    borderRadius: 999,
    borderWidth: 1,
    height: 60,
    justifyContent: 'center',
    shadowColor: '#8c67ff',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    width: 60,
  },
  localFabContent: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  localFabGlow: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    bottom: 2,
    left: 2,
    position: 'absolute',
    right: 2,
    top: 2,
  },
  localFabHighlight: {
    backgroundColor: 'rgba(255,255,255,0.32)',
    borderRadius: 999,
    height: 10,
    left: '50%',
    position: 'absolute',
    top: 8,
    transform: [{ translateX: -15 }],
    width: 30,
  },
  localFabLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  localFabPressable: {
    position: 'absolute',
    right: 28,
  },
  localFabPressed: {
    opacity: 0.94,
    paddingHorizontal: 2,
    paddingVertical: 2,
    transform: [{ scale: 0.985 }],
  },
  manageButton: {
    alignItems: 'center',
    borderColor: '#8c67ff',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    minHeight: 44,
  },
  notificationDot: {
    alignItems: 'center',
    backgroundColor: '#fb7185',
    borderRadius: 999,
    height: 15,
    justifyContent: 'center',
    position: 'absolute',
    right: 3,
    top: 4,
    width: 15,
  },
  ownershipBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ownershipBadgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  priceCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 13,
  },
  pricePill: {
    backgroundColor: '#f3f0ff',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  priceInlineCard: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fbf8ff',
    borderColor: '#eadfff',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    minHeight: 42,
    paddingHorizontal: 13,
  },
  productModeCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 104,
    padding: 12,
  },
  productModeCardActive: {
    backgroundColor: '#fbf8ff',
    borderColor: '#c4b5fd',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
  progressTrack: {
    backgroundColor: '#e8edf5',
    borderRadius: 999,
    height: 5,
    overflow: 'hidden',
  },
  publishButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    minWidth: 112,
    paddingHorizontal: 14,
  },
  publishCover: {
    alignItems: 'center',
    height: 118,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 102,
  },
  publishCoverImage: {
    borderRadius: 16,
  },
  publishCta: {
    alignItems: 'center',
    backgroundColor: '#fbf8ff',
    borderColor: '#eadfff',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  publishFooterLayer: {
    left: 0,
    position: 'absolute',
    right: 0,
  },
  publishIcon: {
    alignItems: 'center',
    backgroundColor: '#f3f0ff',
    borderRadius: 14,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  recipeList: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  recipeRow: {
    alignItems: 'center',
    borderBottomColor: '#eef2f7',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 82,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  recipeRowImage: {
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    height: 58,
    width: 74,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#f7f8fb',
    borderColor: '#eef2f7',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  nextActionIcon: {
    alignItems: 'center',
    backgroundColor: '#f3f0ff',
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  nextActionRow: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 11,
    minHeight: 68,
    padding: 12,
  },
  savedRecipeCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  savedRecipeImage: {
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    height: 72,
    width: 72,
  },
  secondaryAssetButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#dbe3ee',
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 46,
    justifyContent: 'center',
  },
  segmentOption: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 38,
    paddingHorizontal: 12,
  },
  segmentOptionActive: {
    backgroundColor: '#8c67ff',
    borderColor: '#8c67ff',
  },
  segmentOptionText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '900',
  },
  segmentOptionTextActive: {
    color: '#ffffff',
  },
  smallGhostButton: {
    alignItems: 'center',
    borderColor: '#dbe3ee',
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 30,
    paddingHorizontal: 10,
  },
  smallPrimaryButton: {
    alignItems: 'center',
    backgroundColor: '#8c67ff',
    borderRadius: 9,
    justifyContent: 'center',
    minHeight: 30,
    paddingHorizontal: 10,
  },
  tuneButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 34,
  },
  visibilityCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 15,
    borderWidth: 1,
    flex: 1,
    minHeight: 74,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  visibilityCardActive: {
    borderColor: '#8c67ff',
    borderWidth: 1.5,
  },
});
