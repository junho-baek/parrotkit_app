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
import { getContinueShootRecipe, getLatestShootableRecipe } from '@/features/recipes/lib/recipe-ownership';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type RecipesView = 'main' | 'collection' | 'publish';
type RecipeFilter = 'continue' | 'collection' | 'owned' | 'saved' | 'remix' | 'draft';
type PublishCategory = 'food' | 'lifestyle' | 'beauty' | 'tech' | 'business';
type Visibility = 'public' | 'followers' | 'private';

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
    publishTitle: 'Publish to community',
    publishBody: 'Share my recipe with other creators.',
    publishAction: 'Publish recipe',
    collectionTitle: 'Collections',
    collectionSearch: 'Search collections',
    recentCollection: 'Recently used collection',
    recipesInCollection: 'Recipes in collection',
    manageCollection: 'Manage collection',
    newest: 'Newest',
    publishHeader: 'Publish Recipe',
    save: 'Save',
    coverImage: 'Cover image',
    changeCover: 'Change cover',
    recipeTitle: 'Recipe title',
    titlePlaceholder: 'Air fryer lunch 3-step recipe',
    oneLine: 'One-line description',
    descriptionPlaceholder: 'A 15-minute viral lunch idea with 3 air fryer cuts',
    category: 'Category',
    included: 'Included items',
    visibility: 'Visibility',
    beforePublish: 'Preview is only visible to you before publishing.',
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
    publishTitle: '커뮤니티로 발행',
    publishBody: '내 레시피를 다른 크리에이터와 공유',
    publishAction: '레시피 발행',
    collectionTitle: '컬렉션',
    collectionSearch: '컬렉션 검색',
    recentCollection: '최근 사용 컬렉션',
    recipesInCollection: '컬렉션 내 레시피',
    manageCollection: '컬렉션 관리',
    newest: '최신순',
    publishHeader: '레시피 발행',
    save: '저장',
    coverImage: '커버 이미지',
    changeCover: '커버 변경',
    recipeTitle: '레시피 제목',
    titlePlaceholder: '에어프라이어 런치 3종 레시피',
    oneLine: '한 줄 설명',
    descriptionPlaceholder: '바쁜 하루도 맛있게! 15분 완성 에어프라이어 런치 아이디어 3가지',
    category: '카테고리',
    included: '포함 항목',
    visibility: '공개 설정',
    beforePublish: '발행 전 미리보기는 나에게만 공개됩니다.',
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

export function RecipesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ view?: string }>();
  const { language } = useAppLanguage();
  const copy = recipeCopy[language];
  const { exploreRecipes, recipes } = useMockWorkspace();
  const [view, setView] = useState<RecipesView>('main');
  const [selectedFilter, setSelectedFilter] = useState<RecipeFilter>('continue');
  const [selectedCategory, setSelectedCategory] = useState<PublishCategory>('food');
  const [visibility, setVisibility] = useState<Visibility>('public');

  useEffect(() => {
    if (params.view === 'publish') {
      router.replace('/recipe-create?mode=manual' as Href);
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
    router.push(`/recipe/${recipe.id}` as Href);
  };

  const shootRecipe = (recipe: MockRecipe) => {
    router.push(`/recipe/${recipe.id}/prompter` as Href);
  };

  const startRecipeCreate = (mode: 'brand' | 'manual' | 'reference' = 'reference') => {
    router.push(`/recipe-create?mode=${mode}` as Href);
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
        <RecipesTabScrollView bottomPadding={260}>
          <PublishRecipeScreen
            copy={copy}
            onBack={() => setView('main')}
            onSelectCategory={setSelectedCategory}
            onSelectVisibility={setVisibility}
            recipe={continueRecipe ?? recipes[0] ?? null}
            selectedCategory={selectedCategory}
            visibility={visibility}
          />
        </RecipesTabScrollView>
        <PublishBottomCta copy={copy} />
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

          <Pressable accessibilityRole="button" onPress={() => startRecipeCreate('manual')} style={styles.publishCta}>
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
      <RecipeCreateFab onPress={() => startRecipeCreate('reference')} />
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
        <Image source={{ uri: recipe.thumbnail }} style={styles.continueImage} />
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
        <Image source={{ uri: recipe.thumbnail }} style={styles.recipeRowImage} />
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
  imageLookup: Map<string, string>;
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
              source={{ uri: imageLookup.get(imageId) ?? recipes[0]?.thumbnail }}
              style={styles.collectionPreviewImage}
            />
          ))}
          {recipes.slice(0, 2).map((recipe) => (
            <Image key={recipe.id} source={{ uri: recipe.thumbnail }} style={styles.collectionPreviewImage} />
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
  copy,
  onBack,
  onSelectCategory,
  onSelectVisibility,
  recipe,
  selectedCategory,
  visibility,
}: {
  copy: (typeof recipeCopy)['en'];
  onBack: () => void;
  onSelectCategory: (category: PublishCategory) => void;
  onSelectVisibility: (visibility: Visibility) => void;
  recipe: MockRecipe | null;
  selectedCategory: PublishCategory;
  visibility: Visibility;
}) {
  const categories = Object.keys(copy.categories as Record<PublishCategory, string>) as PublishCategory[];
  const visibilityOptions = copy.visibilityOptions as Record<Visibility, { icon: IconName; title: string; body: string }>;

  return (
    <View className="gap-4 px-5">
      <SubHeader onBack={onBack} title={copy.publishHeader as string}>
        <Pressable accessibilityRole="button" hitSlop={8}>
          <Text className="text-[13px] font-black text-violet">{copy.save as string}</Text>
        </Pressable>
      </SubHeader>

      <View className="gap-3">
        <Text className="text-[13px] font-black text-ink">{copy.coverImage as string} ⓘ</Text>
        <View className="flex-row gap-4">
          <ImageBackground
            imageStyle={styles.publishCoverImage}
            resizeMode="cover"
            source={{ uri: recipe?.thumbnail ?? 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80' }}
            style={styles.publishCover}
          >
            <LinearGradient colors={['rgba(15,23,42,0.08)', 'rgba(15,23,42,0.58)']} style={StyleSheet.absoluteFill} />
            <View className="items-center gap-1">
              <MaterialCommunityIcons color="#fff" name="camera-outline" size={22} />
              <Text className="text-[11px] font-black text-white">{copy.changeCover as string}</Text>
            </View>
          </ImageBackground>

          <View className="min-w-0 flex-1 gap-3">
            <LabeledInput
              counter={copy.titleCount as string}
              label={`${copy.recipeTitle as string} *`}
              value={copy.titlePlaceholder as string}
            />
            <LabeledInput
              counter={copy.descriptionCount as string}
              label={copy.oneLine as string}
              multiline
              value={copy.descriptionPlaceholder as string}
            />
          </View>
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-[13px] font-black text-ink">{copy.category as string}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2 pr-5">
            {categories.map((category) => {
              const selected = category === selectedCategory;
              const labels = copy.categories as Record<PublishCategory, string>;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={category}
                  onPress={() => onSelectCategory(category)}
                  style={[styles.categoryPill, selected ? styles.categoryPillActive : null]}
                >
                  <Text style={[styles.categoryPillText, selected ? styles.categoryPillTextActive : null]}>
                    {labels[category]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View className="gap-3">
        <Text className="text-[13px] font-black text-ink">{copy.included as string}</Text>
        <View style={styles.includeList}>
          {(copy.includedItems as Array<{ icon: IconName; title: string; body: string }>).map((item) => (
            <View className="flex-row items-center gap-2.5 px-3 py-2" key={item.title}>
              <View style={styles.includeIcon}>
                <MaterialCommunityIcons color="#8c67ff" name={item.icon} size={16} />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="text-[12px] font-black text-ink">{item.title}</Text>
                <Text className="text-[10px] font-semibold text-muted" numberOfLines={1}>
                  {item.body}
                </Text>
              </View>
              <MaterialCommunityIcons color="#8c67ff" name="check-circle" size={20} />
            </View>
          ))}
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-[13px] font-black text-ink">{copy.visibility as string} ⓘ</Text>
        <View className="flex-row gap-2">
          {(Object.keys(visibilityOptions) as Visibility[]).map((option) => {
            const selected = option === visibility;
            const item = visibilityOptions[option];

            return (
              <Pressable
                accessibilityRole="button"
                key={option}
                onPress={() => onSelectVisibility(option)}
                style={[styles.visibilityCard, selected ? styles.visibilityCardActive : null]}
              >
                <MaterialCommunityIcons color={selected ? '#8c67ff' : '#111827'} name={item.icon} size={21} />
                <Text className={`mt-2 text-[12px] font-black ${selected ? 'text-violet' : 'text-ink'}`}>
                  {item.title}
                </Text>
                <Text className="text-[10px] font-semibold text-muted" numberOfLines={1}>
                  {item.body}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

    </View>
  );
}

function PublishBottomCta({ copy }: { copy: (typeof recipeCopy)['en'] }) {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.publishFooterLayer, { bottom: insets.bottom + 88 }]}>
      <View className="gap-2 px-5">
        <Pressable accessibilityRole="button" className="overflow-hidden rounded-full">
          <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.bigPublishButton}>
            <MaterialCommunityIcons color="#fff" name="send" size={18} />
            <Text className="text-[16px] font-black text-white">{copy.publishTitle as string}</Text>
          </LinearGradient>
        </Pressable>

        <View className="flex-row items-center justify-center gap-1">
          <MaterialCommunityIcons color="#94a3b8" name="lock" size={13} />
          <Text className="text-center text-[11px] font-semibold text-muted">{copy.beforePublish as string}</Text>
        </View>
      </View>
    </View>
  );
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
  logo: {
    height: 34,
    width: 34,
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
