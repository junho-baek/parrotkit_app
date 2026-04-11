import { Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { MediaTileCard } from '@/core/ui/media-tile-card';

const categories = ['All', 'Cooking', 'Beauty', 'Fitness', 'Creator'];

export function ExploreScreen() {
  const router = useRouter();
  const { partnerCreators, toggleLikeReference, trendingReferences } = useMockWorkspace();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredReferences = useMemo(
    () =>
      selectedCategory === 'All'
        ? trendingReferences
        : trendingReferences.filter((reference) => reference.category === selectedCategory),
    [selectedCategory, trendingReferences]
  );

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ paddingBottom: 176 }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-5 px-5 pt-5">
        <View className="gap-1">
          <Text className="text-[32px] font-black leading-[36px] text-ink">Explore</Text>
          <Text className="text-[15px] text-muted">Most popular viral references</Text>
        </View>

        <View className="gap-3">
          <Text className="text-[16px] font-bold text-ink">Partner Creators</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4">
              {partnerCreators.map((creator) => (
                <View key={creator.id} className="w-[86px] items-center">
                  <View className="mb-2 h-[74px] w-[74px] overflow-hidden rounded-full border border-stroke">
                    <MediaAvatar uri={creator.avatar} />
                  </View>
                  <Text className="text-[13px] font-semibold text-ink" numberOfLines={1}>
                    {creator.name}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {categories.map((category) => {
              const selected = category === selectedCategory;
              return (
                <Text
                  key={category}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${selected ? 'bg-violet text-white' : 'bg-slate-100 text-slate-700'}`}
                  onPress={() => setSelectedCategory(category)}
                >
                  {category}
                </Text>
              );
            })}
          </View>
        </ScrollView>

        <View className="flex-row flex-wrap gap-3">
          {filteredReferences.map((reference) => (
            <View key={reference.id} className="w-[48%]">
              <MediaTileCard
                actionLabel={reference.isLiked ? 'Liked' : 'Like'}
                actionMeta={`(${reference.likes})`}
                actionTone={reference.isLiked ? 'liked' : 'neutral'}
                leftMetric={{ icon: '👁', value: reference.views }}
                onAction={() => toggleLikeReference(reference.id)}
                onPress={() =>
                  reference.recipeId
                    ? router.push(`/recipe/${reference.recipeId}` as Href)
                    : router.push('/source-actions' as Href)
                }
                rightMetric={{ icon: '❤', value: String(reference.likes) }}
                subtitle={reference.creator}
                thumbnail={reference.thumbnail}
                title={reference.title}
                topLeftLabel="TRENDING"
                topLeftTone="warm"
                topRightLabel={reference.duration}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function MediaAvatar({ uri }: { uri: string }) {
  return <Image className="h-full w-full" resizeMode="cover" source={{ uri }} />;
}
