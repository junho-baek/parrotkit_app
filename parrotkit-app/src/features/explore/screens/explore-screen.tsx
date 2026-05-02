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

import { useAppLanguage, type AppLanguage } from '@/core/i18n/app-language';
import type { MockRecipe } from '@/core/mocks/parrotkit-data';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { isVerifiedCreatorRecipe } from '@/features/recipes/lib/recipe-ownership';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type SourceFilter = 'all' | 'partners' | 'community' | 'brand';

type ExploreCopy = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  quickStart: string;
  recommended: string;
  viewAll: string;
  browse: string;
  popular: string;
  save: string;
  saved: string;
  open: string;
  verified: string;
  partnerCreator: string;
  filters: Record<SourceFilter, string>;
  facets: string[];
  categories: Array<{ id: string; label: string; icon: IconName; tone: string }>;
  quickCards: Array<{ title: string; eyebrow: string; tag: string; image: string }>;
};

const exploreCopy: Record<AppLanguage, ExploreCopy> = {
  en: {
    title: 'Explore',
    subtitle: 'Discover verified recipes and real filming know-how.',
    searchPlaceholder: 'Search recipes',
    quickStart: 'Quick Start',
    recommended: 'Recommended for you',
    viewAll: 'View all',
    browse: 'Browse recipes',
    popular: 'Popular',
    save: 'Save',
    saved: 'Saved',
    open: 'Open',
    verified: 'Verified',
    partnerCreator: 'Partner Creator',
    filters: {
      all: 'All',
      partners: 'Partners',
      community: 'Community',
      brand: 'Brand Requests',
    },
    facets: ['Category', 'Format', 'Goal', 'Length', 'Level'],
    categories: [
      { id: 'beauty', label: 'Beauty', icon: 'lipstick', tone: '#f43f5e' },
      { id: 'food', label: 'Food', icon: 'food-apple-outline', tone: '#ff9568' },
      { id: 'fitness', label: 'Fitness', icon: 'dumbbell', tone: '#a855f7' },
      { id: 'tech', label: 'Tech', icon: 'cellphone', tone: '#4f46e5' },
      { id: 'lifestyle', label: 'Lifestyle', icon: 'home-heart', tone: '#64748b' },
      { id: 'all', label: 'All', icon: 'dots-horizontal', tone: '#111827' },
    ],
    quickCards: [
      {
        title: 'Cosmetic UGC Shooting Guide',
        eyebrow: 'From basics to pro',
        tag: 'Guide',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      },
      {
        title: 'Request a Brand Promo Recipe',
        eyebrow: 'Collab opportunities',
        tag: 'Brand Requests',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  ko: {
    title: '탐색',
    subtitle: '검증된 레시피와 실전 노하우를 발견하고 바로 촬영해보세요.',
    searchPlaceholder: '레시피 검색',
    quickStart: '빠른 시작',
    recommended: '추천 레시피',
    viewAll: '전체 보기',
    browse: '레시피 둘러보기',
    popular: '인기순',
    save: '저장',
    saved: '저장됨',
    open: '열기',
    verified: '인증됨',
    partnerCreator: '파트너 크리에이터',
    filters: {
      all: '전체',
      partners: '파트너',
      community: '커뮤니티',
      brand: '기업 요청',
    },
    facets: ['카테고리', '포맷', '목적', '길이', '난이도'],
    categories: [
      { id: 'beauty', label: '뷰티', icon: 'lipstick', tone: '#f43f5e' },
      { id: 'food', label: '푸드', icon: 'food-apple-outline', tone: '#ff9568' },
      { id: 'fitness', label: '피트니스', icon: 'dumbbell', tone: '#a855f7' },
      { id: 'tech', label: '테크', icon: 'cellphone', tone: '#4f46e5' },
      { id: 'lifestyle', label: '라이프', icon: 'home-heart', tone: '#64748b' },
      { id: 'all', label: '전체', icon: 'dots-horizontal', tone: '#111827' },
    ],
    quickCards: [
      {
        title: '화장품 UGC 촬영 가이드',
        eyebrow: '기초부터 완성까지',
        tag: '가이드',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      },
      {
        title: '기업 홍보 레시피 요청하기',
        eyebrow: '브랜드와 협업 기회',
        tag: '기업 요청',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
};

export function ExploreScreen() {
  const router = useRouter();
  const { language } = useAppLanguage();
  const copy = exploreCopy[language];
  const {
    exploreRecipes,
    isRecipeDownloaded,
  } = useMockWorkspace();
  const [selectedFilter, setSelectedFilter] = useState<SourceFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return exploreRecipes.filter((recipe) => {
      const matchesSource = selectedFilter === 'all'
        || (selectedFilter === 'partners' && isVerifiedCreatorRecipe(recipe))
        || (selectedFilter === 'community' && !isVerifiedCreatorRecipe(recipe))
        || (selectedFilter === 'brand' && recipe.niche.toLowerCase().includes('creator'));
      const searchable = [
        recipe.title,
        recipe.summary,
        recipe.niche,
        recipe.goal,
        recipe.ownerHandle,
      ].join(' ').toLowerCase();

      return matchesSource && (!query || searchable.includes(query));
    });
  }, [exploreRecipes, searchQuery, selectedFilter]);

  const recommendedRecipes = filteredRecipes.length > 0 ? filteredRecipes.slice(0, 2) : exploreRecipes.slice(0, 2);
  const browseRecipes = filteredRecipes.length > 0 ? filteredRecipes : exploreRecipes;

  const openRecipe = (recipeId: string) => {
    router.push(`/recipe/${recipeId}` as Href);
  };

  return (
    <AppScreenScrollView contentContainerStyle={styles.exploreScrollContent}>
      <View className="gap-6 px-5">
        <View className="gap-1">
          <Text className="text-[32px] font-black leading-[36px] text-ink">{copy.title}</Text>
          <Text className="text-[15px] font-semibold leading-6 text-muted">{copy.subtitle}</Text>
        </View>

        <View style={styles.searchBox}>
          <MaterialCommunityIcons color="#94a3b8" name="magnify" size={18} />
          <TextInput
            autoCapitalize="none"
            className="flex-1 text-[14px] font-semibold text-ink"
            onChangeText={setSearchQuery}
            placeholder={copy.searchPlaceholder}
            placeholderTextColor="#94a3b8"
            value={searchQuery}
          />
          <MaterialCommunityIcons color="#334155" name="bookmark-outline" size={18} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-4 pr-5">
            {copy.categories.map((category) => (
              <CategoryShortcut key={category.id} category={category} />
            ))}
          </View>
        </ScrollView>

        <View className="gap-3">
          <Text className="text-[16px] font-black text-ink">{copy.quickStart}</Text>
          <View className="flex-row gap-3">
            {copy.quickCards.map((card) => (
              <QuickStartCard card={card} key={card.title} />
            ))}
          </View>
        </View>

        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-[18px] font-black text-ink">{copy.recommended}</Text>
            <Text className="text-[13px] font-bold text-violet">{copy.viewAll}</Text>
          </View>

          <View className="gap-3">
            {recommendedRecipes.map((recipe) => (
              <RecommendedRecipeCard
                copy={copy}
                downloaded={isRecipeDownloaded(recipe.id)}
                key={recipe.id}
                language={language}
                onPress={() => openRecipe(recipe.id)}
                recipe={recipe}
              />
            ))}
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-[18px] font-black text-ink">{copy.browse}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pr-5">
              {(Object.keys(copy.filters) as SourceFilter[]).map((filter) => {
                const selected = selectedFilter === filter;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={filter}
                    onPress={() => setSelectedFilter(filter)}
                    style={[styles.sourcePill, selected ? styles.sourcePillSelected : null]}
                  >
                    <Text style={[styles.sourcePillText, selected ? styles.sourcePillTextSelected : null]}>
                      {copy.filters[filter]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View className="flex-row items-center justify-between">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2 pr-3">
                {copy.facets.map((facet) => (
                  <View className="flex-row items-center gap-1 rounded-full bg-slate-100 px-3 py-2" key={facet}>
                    <Text className="text-[11px] font-black text-slate-700">{facet}</Text>
                    <MaterialCommunityIcons color="#64748b" name="chevron-down" size={13} />
                  </View>
                ))}
              </View>
            </ScrollView>

            <View className="ml-2 flex-row items-center gap-1">
              <Text className="text-[11px] font-black text-ink">{copy.popular}</Text>
              <MaterialCommunityIcons color="#111827" name="chevron-down" size={13} />
            </View>
          </View>

          <View style={styles.recipeList}>
            {browseRecipes.map((recipe) => (
              <BrowseRecipeRow
                downloaded={isRecipeDownloaded(recipe.id)}
                key={recipe.id}
                language={language}
                onPress={() => openRecipe(recipe.id)}
                recipe={recipe}
              />
            ))}
          </View>
        </View>
      </View>
    </AppScreenScrollView>
  );
}

function CategoryShortcut({ category }: { category: ExploreCopy['categories'][number] }) {
  return (
    <View className="w-[52px] items-center gap-2">
      <View style={[styles.categoryIcon, { backgroundColor: `${category.tone}14` }]}>
        <MaterialCommunityIcons color={category.tone} name={category.icon} size={20} />
      </View>
      <Text className="text-center text-[10px] font-black text-slate-600" numberOfLines={1}>
        {category.label}
      </Text>
    </View>
  );
}

function QuickStartCard({ card }: { card: ExploreCopy['quickCards'][number] }) {
  return (
    <View style={styles.quickCard}>
      <View className="flex-1 gap-1 pr-2">
        <Text className="text-[13px] font-black leading-[16px] text-ink" numberOfLines={2}>
          {card.title}
        </Text>
        <Text className="text-[10px] font-bold text-muted" numberOfLines={1}>
          {card.eyebrow}
        </Text>
        <View className="self-start rounded-full bg-violet/10 px-2 py-1">
          <Text className="text-[9px] font-black text-violet">{card.tag}</Text>
        </View>
      </View>
      <Image source={{ uri: card.image }} style={styles.quickCardImage} />
    </View>
  );
}

function RecommendedRecipeCard({
  copy,
  downloaded,
  language,
  onPress,
  recipe,
}: {
  copy: ExploreCopy;
  downloaded: boolean;
  language: AppLanguage;
  onPress: () => void;
  recipe: MockRecipe;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.recommendedCard}>
      <ImageBackground imageStyle={styles.recommendedImage} resizeMode="cover" source={{ uri: recipe.thumbnail }} style={styles.recommendedBackground}>
        <LinearGradient
          colors={['rgba(15,23,42,0.18)', 'rgba(15,23,42,0.94)']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

        <View className="flex-1 gap-2 px-4 py-4">
          <View className="flex-row items-center gap-2">
            <View style={styles.darkBadge}>
              <Text className="text-[9px] font-black text-white">{copy.partnerCreator}</Text>
            </View>
            {isVerifiedCreatorRecipe(recipe) ? (
              <View style={styles.darkBadge}>
                <MaterialCommunityIcons color="#fff" name="check-decagram" size={10} />
                <Text className="text-[9px] font-black text-white">{copy.verified}</Text>
              </View>
            ) : null}
          </View>

          <View className="mt-auto gap-1.5">
            <Text className="text-[18px] font-black leading-[22px] text-white" numberOfLines={1}>
              {getLocalizedTitle(language, recipe)}
            </Text>
            <Text className="text-[12px] font-semibold leading-4 text-white/75" numberOfLines={1}>
              {recipe.summary}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-[11px] font-bold text-white/80">{recipe.ownerHandle}</Text>
              <Text className="text-[11px] font-bold text-white/70">♡ {formatCompactMetric(recipe.downloadCount)} {language === 'ko' ? '저장' : 'saves'}</Text>
              <Text className="text-[11px] font-bold text-white/70">◦ {formatCompactMetric(recipe.downloadCount * 6)} {language === 'ko' ? '조회' : 'views'}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row flex-wrap gap-1.5">
                {getRecipeTags(recipe, language).slice(0, 4).map((tag) => (
                  <View className="rounded-full bg-white/12 px-2 py-1" key={tag}>
                    <Text className="text-[9px] font-black text-white/90">{tag}</Text>
                  </View>
                ))}
              </View>
              <Text className="text-[11px] font-black text-white">{downloaded ? copy.open : copy.save}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

function BrowseRecipeRow({
  downloaded,
  language,
  onPress,
  recipe,
}: {
  downloaded: boolean;
  language: AppLanguage;
  onPress: () => void;
  recipe: MockRecipe;
}) {
  return (
    <Pressable accessibilityRole="button" className="flex-row gap-3 py-3" onPress={onPress}>
      <Image source={{ uri: recipe.thumbnail }} style={styles.rowImage} />
      <View className="flex-1 gap-1">
        <View className="flex-row items-start justify-between gap-2">
          <Text className="flex-1 text-[15px] font-black leading-[19px] text-ink" numberOfLines={2}>
            {getLocalizedTitle(language, recipe)}
          </Text>
          {downloaded ? <MaterialCommunityIcons color="#8c67ff" name="bookmark" size={16} /> : null}
        </View>
        <Text className="text-[11px] font-semibold leading-4 text-muted" numberOfLines={1}>
          {recipe.summary}
        </Text>
        <Text className="text-[11px] font-bold text-slate-500" numberOfLines={1}>
          {recipe.ownerHandle} · {recipe.totalSceneCount} {language === 'ko' ? '씬' : 'scenes'} · 30s
        </Text>
        <View className="flex-row flex-wrap gap-1.5">
          {getRecipeTags(recipe, language).slice(0, 3).map((tag) => (
            <View className="rounded-full bg-violet/10 px-2 py-1" key={tag}>
              <Text className="text-[9px] font-black text-violet">{tag}</Text>
            </View>
          ))}
        </View>
        <View className="flex-row gap-3">
          <Text className="text-[10px] font-bold text-muted">♡ {formatCompactMetric(recipe.downloadCount)}</Text>
          <Text className="text-[10px] font-bold text-muted">◦ {formatCompactMetric(recipe.downloadCount * 6)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function formatCompactMetric(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  }

  return String(value);
}

function getLocalizedTitle(language: AppLanguage, recipe: MockRecipe) {
  if (language === 'en') {
    if (recipe.id === 'market-recipe-beauty-proof-routine') return 'Glowy Skin Routine';
    if (recipe.id === 'market-recipe-core-control-proof') return 'Home Upper Body Workout';
    if (recipe.id === 'market-recipe-founder-problem-hook') return 'New App Launch Promo';
    return recipe.title;
  }

  if (recipe.id === 'market-recipe-beauty-proof-routine') return '광채 피부 표현 루틴';
  if (recipe.id === 'market-recipe-core-control-proof') return '집에서 하는 상체 운동 루틴';
  if (recipe.id === 'market-recipe-founder-problem-hook') return '새로운 앱 런칭 홍보 레시피';
  return recipe.title;
}

function getRecipeTags(recipe: MockRecipe, language: AppLanguage) {
  const enTags = [recipe.niche, recipe.goal.split(' ').slice(0, 2).join(' '), '30s', isVerifiedCreatorRecipe(recipe) ? 'Verified' : 'Community'];
  const koNiche: Record<string, string> = {
    Beauty: '뷰티',
    Creator: '크리에이터',
    Fitness: '피트니스',
  };
  const koTags = [
    koNiche[recipe.niche] ?? recipe.niche,
    recipe.id.includes('beauty') ? '제품 홍보' : recipe.id.includes('core') ? '운동 루틴' : '앱 홍보',
    '30초',
    isVerifiedCreatorRecipe(recipe) ? '인증' : '커뮤니티',
  ];

  return language === 'ko' ? koTags : enTags;
}

const styles = StyleSheet.create({
  categoryIcon: {
    alignItems: 'center',
    borderRadius: 15,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  exploreScrollContent: {
    paddingTop: 52,
  },
  darkBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quickCard: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    minHeight: 92,
    padding: 12,
  },
  quickCardImage: {
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    height: 44,
    width: 44,
  },
  recipeList: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
    borderTopWidth: 1,
  },
  recommendedBackground: {
    minHeight: 138,
  },
  recommendedCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  recommendedImage: {
    borderRadius: 20,
  },
  rowImage: {
    backgroundColor: '#e2e8f0',
    borderRadius: 14,
    height: 82,
    width: 82,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#eef2f7',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  sourcePill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  sourcePillSelected: {
    backgroundColor: '#8c67ff',
  },
  sourcePillText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '900',
  },
  sourcePillTextSelected: {
    color: '#ffffff',
  },
});
