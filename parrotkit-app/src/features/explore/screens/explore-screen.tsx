import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { ComponentProps, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage, type AppLanguage } from '@/core/i18n/app-language';
import type { MockRecipe } from '@/core/mocks/parrotkit-data';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { isVerifiedCreatorRecipe } from '@/features/recipes/lib/recipe-ownership';
import { getShootBoardHref } from '@/features/recipes/lib/shoot-board-model';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type OriginFilter = 'all' | 'partners' | 'community' | 'brand';
type CategoryFilter = 'beauty' | 'food' | 'fitness' | 'tech' | 'life' | 'all';
type ExploreAction = 'save' | 'shoot' | 'remix' | 'apply';
type ExploreOrigin = 'partner' | 'community' | 'brand';

type ExploreRecipeCardModel = {
  action: ExploreAction;
  category: CategoryFilter;
  chips: string[];
  creatorHandle: string;
  description: string;
  difficulty: string;
  id: string;
  image: string;
  metadata: string[];
  origin: ExploreOrigin;
  recipe?: MockRecipe;
  saveCount: number;
  title: string;
  viewCount: number;
};

type ExploreCopy = {
  title: string;
  searchPlaceholder: string;
  recommended: string;
  viewAll: string;
  browse: string;
  savedIconLabel: string;
  actions: Record<ExploreAction, string>;
  stats: {
    saves: string;
    views: string;
  };
  filters: Record<OriginFilter, string>;
  facets: string[];
  categories: Array<{ id: CategoryFilter; label: string; icon: IconName; tone: string }>;
  brandRequest: {
    chips: string[];
    creatorHandle: string;
    description: string;
    difficulty: string;
    image: string;
    metadata: string[];
    saveCount: number;
    title: string;
    viewCount: number;
  };
};

const exploreCopy: Record<AppLanguage, ExploreCopy> = {
  en: {
    title: 'Explore',
    searchPlaceholder: 'Search recipes',
    recommended: 'Recommended Recipes',
    viewAll: 'View all',
    browse: 'Browse Recipes',
    savedIconLabel: 'Saved recipes',
    actions: {
      apply: 'Apply',
      remix: 'Remix',
      save: 'Save',
      shoot: 'Shoot',
    },
    stats: {
      saves: 'saves',
      views: 'views',
    },
    filters: {
      all: 'All',
      partners: 'Partners',
      community: 'Community',
      brand: 'Brand Requests',
    },
    facets: ['Category', 'Format', 'Goal', 'Length', 'Level', 'Popular'],
    categories: [
      { id: 'beauty', label: 'Beauty', icon: 'lipstick', tone: '#f43f5e' },
      { id: 'food', label: 'Food', icon: 'food-apple-outline', tone: '#ff9568' },
      { id: 'fitness', label: 'Fitness', icon: 'dumbbell', tone: '#16a34a' },
      { id: 'tech', label: 'Tech', icon: 'cellphone', tone: '#4f46e5' },
      { id: 'life', label: 'Life', icon: 'home-heart', tone: '#0f766e' },
      { id: 'all', label: 'All', icon: 'dots-horizontal', tone: '#111827' },
    ],
    brandRequest: {
      chips: ['Beauty', 'Brand Collab', 'Product Demo'],
      creatorHandle: '@glowbrand',
      description: 'A brand request for filming a proof-first product demo with clear usage claims.',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
      metadata: ['3 cuts', '30s', 'Prompter', 'Filming tips'],
      saveCount: 980,
      title: 'Serum launch UGC request',
      viewCount: 7200,
    },
  },
  ko: {
    title: '탐색',
    searchPlaceholder: '레시피 검색',
    recommended: '추천 레시피',
    viewAll: '전체 보기',
    browse: '레시피 둘러보기',
    savedIconLabel: '저장한 레시피',
    actions: {
      apply: '지원하기',
      remix: '리믹스',
      save: '저장',
      shoot: '촬영하기',
    },
    stats: {
      saves: '저장',
      views: '조회',
    },
    filters: {
      all: '전체',
      partners: '파트너',
      community: '커뮤니티',
      brand: '기업 요청',
    },
    facets: ['카테고리', '포맷', '목적', '길이', '난이도', '인기순'],
    categories: [
      { id: 'beauty', label: '뷰티', icon: 'lipstick', tone: '#f43f5e' },
      { id: 'food', label: '푸드', icon: 'food-apple-outline', tone: '#ff9568' },
      { id: 'fitness', label: '피트니스', icon: 'dumbbell', tone: '#16a34a' },
      { id: 'tech', label: '테크', icon: 'cellphone', tone: '#4f46e5' },
      { id: 'life', label: '라이프', icon: 'home-heart', tone: '#0f766e' },
      { id: 'all', label: '전체', icon: 'dots-horizontal', tone: '#111827' },
    ],
    brandRequest: {
      chips: ['뷰티', '제품 홍보', '브랜드 협업'],
      creatorHandle: '@glowbrand',
      description: '제품 사용감과 전후 비교가 분명한 30초 UGC 데모를 찾는 브랜드 요청입니다.',
      difficulty: '난이도 쉬움',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
      metadata: ['3컷', '30초', '프롬프터 포함', '촬영 팁'],
      saveCount: 980,
      title: '세럼 런칭 UGC 요청',
      viewCount: 7200,
    },
  },
};

export function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language } = useAppLanguage();
  const copy = exploreCopy[language];
  const {
    downloadRecipe,
    exploreRecipes,
    isRecipeDownloaded,
  } = useMockWorkspace();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedFilter, setSelectedFilter] = useState<OriginFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const cards = useMemo(
    () => [
      ...exploreRecipes.map((recipe) => createRecipeCardModel(recipe, language, isRecipeDownloaded(recipe.id))),
      createBrandRequestCardModel(copy),
    ],
    [copy, exploreRecipes, isRecipeDownloaded, language]
  );

  const filteredCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return cards.filter((card) => {
      const matchesOrigin = selectedFilter === 'all'
        || (selectedFilter === 'partners' && card.origin === 'partner')
        || (selectedFilter === 'community' && card.origin === 'community')
        || (selectedFilter === 'brand' && card.origin === 'brand');
      const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
      const searchable = [
        card.title,
        card.description,
        card.creatorHandle,
        card.chips.join(' '),
        card.metadata.join(' '),
      ].join(' ').toLowerCase();

      return matchesOrigin && matchesCategory && (!query || searchable.includes(query));
    });
  }, [cards, searchQuery, selectedCategory, selectedFilter]);

  const visibleCards = filteredCards.length > 0 ? filteredCards : cards;
  const recommendedCards = prioritizeRecommendedCards(visibleCards).slice(0, 3);

  const openCard = (card: ExploreRecipeCardModel) => {
    if (card.recipe) {
      router.push(`/explore-recipe/${card.recipe.id}` as Href);
      return;
    }

    router.push('/recipe-create?mode=brand' as Href);
  };

  const saveRecipe = (card: ExploreRecipeCardModel) => {
    if (card.recipe) {
      downloadRecipe(card.recipe.id);
    }
  };

  const shootRecipe = (card: ExploreRecipeCardModel) => {
    if (!card.recipe) return;

    const targetRecipe = downloadRecipe(card.recipe.id) ?? card.recipe;
    router.push(getShootBoardHref(targetRecipe.id) as Href);
  };

  const handleAction = (card: ExploreRecipeCardModel) => {
    if (card.action === 'apply') {
      router.push('/recipe-create?mode=brand' as Href);
      return;
    }

    if (card.action === 'remix') {
      const remixPath = card.recipe
        ? `/recipe-create?mode=manual&remixOf=${card.recipe.id}`
        : '/recipe-create?mode=manual';

      router.push(remixPath as Href);
      return;
    }

    if (card.action === 'shoot') {
      shootRecipe(card);
      return;
    }

    saveRecipe(card);
  };

  return (
    <View className="flex-1 bg-canvas">
      <AppScreenScrollView topSpacing={18}>
        <View className="gap-6 px-5">
        <View>
          <Text className="text-[32px] font-black leading-[37px] text-ink">{copy.title}</Text>
        </View>

        <View style={styles.searchBox}>
          <MaterialCommunityIcons color="#94a3b8" name="magnify" size={19} />
          <TextInput
            autoCapitalize="none"
            className="min-w-0 flex-1 text-[14px] font-semibold text-ink"
            onChangeText={setSearchQuery}
            placeholder={copy.searchPlaceholder}
            placeholderTextColor="#94a3b8"
            value={searchQuery}
          />
          <Pressable accessibilityLabel={copy.savedIconLabel} accessibilityRole="button" hitSlop={8}>
            <MaterialCommunityIcons color="#334155" name="bookmark-outline" size={19} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-4 pr-5">
            {copy.categories.map((category) => (
              <CategoryShortcut
                category={category}
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                selected={selectedCategory === category.id}
              />
            ))}
          </View>
        </ScrollView>

        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-[18px] font-black text-ink">{copy.recommended}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setSelectedCategory('all');
                setSelectedFilter('all');
              }}
            >
              <Text className="text-[13px] font-black text-violet">{copy.viewAll}</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3 pr-5">
              {recommendedCards.map((card) => (
                <RecommendedRecipeCard
                  card={card}
                  copy={copy}
                  key={card.id}
                  onAction={() => handleAction(card)}
                  onPress={() => openCard(card)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="gap-3">
          <Text className="text-[18px] font-black text-ink">{copy.browse}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pr-5">
              {(Object.keys(copy.filters) as OriginFilter[]).map((filter) => {
                const selected = selectedFilter === filter;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={filter}
                    onPress={() => setSelectedFilter(filter)}
                    style={[styles.originPill, selected ? styles.originPillSelected : null]}
                  >
                    <Text style={[styles.originPillText, selected ? styles.originPillTextSelected : null]}>
                      {copy.filters[filter]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pr-5">
              {copy.facets.map((facet) => (
                <View className="flex-row items-center gap-1 rounded-full bg-slate-100 px-3 py-2" key={facet}>
                  <Text className="text-[11px] font-black text-slate-700">{facet}</Text>
                  <MaterialCommunityIcons color="#64748b" name="chevron-down" size={13} />
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.recipeList}>
            {visibleCards.map((card) => (
              <BrowseRecipeRow
                card={card}
                copy={copy}
                key={card.id}
                onAction={() => handleAction(card)}
                onPress={() => openCard(card)}
              />
            ))}
          </View>
        </View>
        </View>
      </AppScreenScrollView>
      <View pointerEvents="none" style={[styles.safeAreaShield, { height: insets.top + 8 }]} />
    </View>
  );
}

function CategoryShortcut({
  category,
  onPress,
  selected,
}: {
  category: ExploreCopy['categories'][number];
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" className="w-[56px] items-center gap-2" onPress={onPress}>
      <View
        style={[
          styles.categoryIcon,
          { backgroundColor: `${category.tone}14` },
          selected ? { borderColor: category.tone, borderWidth: 1.5 } : null,
        ]}
      >
        <MaterialCommunityIcons color={category.tone} name={category.icon} size={20} />
      </View>
      <Text
        className="text-center text-[10px] font-black text-slate-600"
        numberOfLines={1}
        style={selected ? { color: category.tone } : null}
      >
        {category.label}
      </Text>
    </Pressable>
  );
}

function RecommendedRecipeCard({
  card,
  copy,
  onAction,
  onPress,
}: {
  card: ExploreRecipeCardModel;
  copy: ExploreCopy;
  onAction: () => void;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.recommendedCard}>
      <ImageBackground
        imageStyle={styles.recommendedImage}
        resizeMode="cover"
        source={{ uri: card.image }}
        style={styles.recommendedBackground}
      >
        <LinearGradient
          colors={['rgba(15,23,42,0.04)', 'rgba(15,23,42,0.28)', 'rgba(15,23,42,0.92)']}
          locations={[0, 0.42, 1]}
          style={StyleSheet.absoluteFill}
        />

        <View className="flex-1 justify-end px-4 py-4">
          <View className="gap-2">
            <Text style={styles.recommendedTitle} numberOfLines={2}>
              {card.title}
            </Text>

            <Text style={styles.recommendedCreator} numberOfLines={1}>
              {card.creatorHandle}
            </Text>

            <View className="flex-row items-center justify-end">
              <Pressable accessibilityRole="button" onPress={onAction} style={styles.recommendedCta}>
                <Text className="text-[12px] font-black text-ink">{copy.actions[card.action]}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

function BrowseRecipeRow({
  card,
  copy,
  onAction,
  onPress,
}: {
  card: ExploreRecipeCardModel;
  copy: ExploreCopy;
  onAction: () => void;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" className="flex-row gap-3 py-3" onPress={onPress}>
      <Image source={{ uri: card.image }} style={styles.rowImage} />
      <View className="min-w-0 flex-1 gap-1">
        <View className="flex-row items-start justify-between gap-2">
          <Text className="min-w-0 flex-1 text-[15px] font-black leading-[19px] text-ink" numberOfLines={2}>
            {card.title}
          </Text>
          <MaterialCommunityIcons
            color={card.action === 'shoot' ? '#8c67ff' : '#94a3b8'}
            name={card.action === 'shoot' ? 'bookmark' : 'bookmark-outline'}
            size={17}
          />
        </View>
        <Text className="text-[11px] font-semibold leading-4 text-muted" numberOfLines={2}>
          {card.description}
        </Text>
        <Text className="text-[11px] font-bold text-slate-500" numberOfLines={1}>
          {card.creatorHandle} · {card.metadata[0]} · {card.metadata[1]}
        </Text>
        <View className="flex-row flex-wrap gap-1.5">
          {card.chips.slice(0, 3).map((tag) => (
            <View className="rounded-full bg-violet/10 px-2 py-1" key={tag}>
              <Text className="text-[9px] font-black text-violet">{tag}</Text>
            </View>
          ))}
        </View>
        <View className="flex-row items-center justify-between gap-2">
          <View className="min-w-0 flex-1 flex-row gap-3">
            <Text className="text-[10px] font-bold text-muted">{formatCompactMetric(card.saveCount)} {copy.stats.saves}</Text>
            <Text className="text-[10px] font-bold text-muted">{formatCompactMetric(card.viewCount)} {copy.stats.views}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={onAction} style={styles.rowCta}>
            <Text className="text-[11px] font-black text-violet">{copy.actions[card.action]}</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function createRecipeCardModel(
  recipe: MockRecipe,
  language: AppLanguage,
  downloaded: boolean
): ExploreRecipeCardModel {
  const verified = isVerifiedCreatorRecipe(recipe);
  const action: ExploreAction = downloaded ? 'shoot' : verified ? 'save' : 'remix';

  return {
    action,
    category: getRecipeCategory(recipe),
    chips: getRecipeChips(recipe, language),
    creatorHandle: recipe.ownerHandle,
    description: getLocalizedDescription(language, recipe),
    difficulty: getDifficulty(language, recipe),
    id: recipe.id,
    image: recipe.thumbnail,
    metadata: getRecipeMetadata(language, recipe),
    origin: verified ? 'partner' : 'community',
    recipe,
    saveCount: recipe.downloadCount,
    title: getLocalizedTitle(language, recipe),
    viewCount: recipe.downloadCount * 6,
  };
}

function createBrandRequestCardModel(copy: ExploreCopy): ExploreRecipeCardModel {
  return {
    action: 'apply',
    category: 'beauty',
    chips: copy.brandRequest.chips,
    creatorHandle: copy.brandRequest.creatorHandle,
    description: copy.brandRequest.description,
    difficulty: copy.brandRequest.difficulty,
    id: 'brand-request-serum-launch',
    image: copy.brandRequest.image,
    metadata: copy.brandRequest.metadata,
    origin: 'brand',
    saveCount: copy.brandRequest.saveCount,
    title: copy.brandRequest.title,
    viewCount: copy.brandRequest.viewCount,
  };
}

function prioritizeRecommendedCards(cards: ExploreRecipeCardModel[]) {
  const order: Record<ExploreOrigin, number> = {
    partner: 0,
    brand: 1,
    community: 2,
  };

  return [...cards].sort((first, second) => order[first.origin] - order[second.origin]);
}

function getRecipeCategory(recipe: MockRecipe): CategoryFilter {
  if (recipe.niche === 'Beauty') return 'beauty';
  if (recipe.niche === 'Fitness') return 'fitness';
  if (recipe.niche === 'Cooking') return 'food';
  if (recipe.id.includes('founder') || recipe.goal.toLowerCase().includes('product')) return 'tech';
  return 'life';
}

function getLocalizedTitle(language: AppLanguage, recipe: MockRecipe) {
  if (language === 'en') {
    if (recipe.id.includes('beauty-proof-routine')) return 'Glowy Skin Routine';
    if (recipe.id.includes('core-control-proof')) return 'Home Upper Body Workout';
    if (recipe.id.includes('founder-problem-hook')) return 'New App Launch Promo Recipe';
    return recipe.title;
  }

  if (recipe.id.includes('beauty-proof-routine')) return '광채 피부 표현 루틴';
  if (recipe.id.includes('core-control-proof')) return '집에서 하는 상체 운동 루틴';
  if (recipe.id.includes('founder-problem-hook')) return '새로운 앱 런칭 홍보 레시피';
  return recipe.title;
}

function getLocalizedDescription(language: AppLanguage, recipe: MockRecipe) {
  if (language === 'ko') {
    if (recipe.id.includes('beauty-proof-routine')) {
      return 'A verified creator recipe for turning a routine into a proof-first product story.';
    }

    if (recipe.id.includes('core-control-proof')) {
      return 'A verified fitness recipe for making form correction feel easy to follow.';
    }

    if (recipe.id.includes('founder-problem-hook')) {
      return 'A community recipe for explaining a product problem and showing the solution.';
    }
  }

  return recipe.summary;
}

function getRecipeChips(recipe: MockRecipe, language: AppLanguage) {
  if (language === 'ko') {
    if (recipe.id.includes('beauty-proof-routine')) return ['뷰티', '제품 홍보', '프롬프터 포함'];
    if (recipe.id.includes('core-control-proof')) return ['피트니스', '운동 루틴', '난이도 쉬움'];
    if (recipe.id.includes('founder-problem-hook')) return ['크리에이터', '앱 홍보', '30초'];
  }

  if (recipe.id.includes('beauty-proof-routine')) return ['Beauty', 'Product Promo', 'Prompter'];
  if (recipe.id.includes('core-control-proof')) return ['Fitness', 'Workout Routine', 'Easy'];
  if (recipe.id.includes('founder-problem-hook')) return ['Creator', 'App Promo', '30s'];

  return [recipe.niche, recipe.goal.split(' ').slice(0, 2).join(' '), 'Prompter'];
}

function getRecipeMetadata(language: AppLanguage, recipe: MockRecipe) {
  const cutCount = language === 'ko' ? `${recipe.totalSceneCount}컷` : `${recipe.totalSceneCount} cuts`;

  return language === 'ko'
    ? [cutCount, '30초', '프롬프터 포함', '예시 영상', '촬영 팁', getDifficulty(language, recipe)]
    : [cutCount, '30s', 'Prompter', 'Example video', 'Filming tips', getDifficulty(language, recipe)];
}

function getDifficulty(language: AppLanguage, recipe: MockRecipe) {
  const easy = recipe.id.includes('core') || recipe.id.includes('beauty');

  if (language === 'ko') {
    return easy ? '난이도 쉬움' : '난이도 보통';
  }

  return easy ? 'Easy' : 'Medium';
}

function formatCompactMetric(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  }

  return String(value);
}

const styles = StyleSheet.create({
  categoryIcon: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 16,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  originPill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  originPillSelected: {
    backgroundColor: '#8c67ff',
  },
  originPillText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '900',
  },
  originPillTextSelected: {
    color: '#ffffff',
  },
  recipeList: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
    borderTopWidth: 1,
  },
  recommendedBackground: {
    height: 260,
  },
  recommendedCard: {
    borderRadius: 26,
    overflow: 'hidden',
    width: 286,
  },
  recommendedCta: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  recommendedImage: {
    borderRadius: 26,
  },
  recommendedCreator: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  recommendedTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 29,
  },
  rowCta: {
    backgroundColor: '#f4f0ff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  rowImage: {
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    height: 92,
    width: 92,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#eef2f7',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    minHeight: 48,
    paddingHorizontal: 13,
  },
  safeAreaShield: {
    backgroundColor: '#ffffff',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 32,
  },
});
