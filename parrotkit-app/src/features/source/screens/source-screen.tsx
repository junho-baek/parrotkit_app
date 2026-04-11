import { Href, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { MediaTileCard } from '@/core/ui/media-tile-card';

export function SourceScreen() {
  const router = useRouter();
  const { recentReferences, recipes, sourceStats } = useMockWorkspace();

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ paddingBottom: 176 }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-5 px-5 pt-5">
        <View className="gap-1">
          <Text className="text-[32px] font-black leading-[36px] text-ink">Source inbox</Text>
          <Text className="text-[15px] text-muted">Incoming drafts, imports, and latest paste activity</Text>
        </View>

        <View className="flex-row flex-wrap gap-3">
          <SourceStat title="Links" value={String(sourceStats.links)} />
          <SourceStat title="Drafts" value={String(sourceStats.drafts)} />
          <SourceStat title="Imports" value={String(sourceStats.imports)} />
          <SourceStat title="Queue" value={String(sourceStats.queue)} />
        </View>

        <View className="gap-3 rounded-[28px] border border-stroke bg-surface px-5 py-5">
          <Text className="text-[18px] font-bold text-ink">Next Action</Text>
          <Text className="text-sm leading-6 text-muted">
            Paste a viral link, create a draft recipe, and review it before wiring real analysis.
          </Text>
          <Text
            className="self-start rounded-full bg-violet px-4 py-3 text-sm font-bold text-white"
            onPress={() => router.push('/source-actions' as Href)}
          >
            Open Paste Drawer
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-[18px] font-bold text-ink">Latest Added</Text>

          <View className="flex-row flex-wrap gap-3">
            {recentReferences.map((reference) => (
              <View key={reference.id} className="w-[48%]">
                <MediaTileCard
                  actionLabel={reference.recipeId ? 'Open Recipe' : 'Open Drawer'}
                  actionTone={reference.recipeId ? 'brand' : 'neutral'}
                  onAction={() =>
                    reference.recipeId
                      ? router.push(`/recipe/${reference.recipeId}` as Href)
                      : router.push('/source-actions' as Href)
                  }
                  onPress={() =>
                    reference.recipeId
                      ? router.push(`/recipe/${reference.recipeId}` as Href)
                      : router.push('/source-actions' as Href)
                  }
                  subtitle={reference.platform}
                  thumbnail={reference.thumbnail}
                  title={reference.title}
                  topLeftLabel="SOURCE"
                  topLeftTone="brand"
                  topRightLabel={reference.createdAt}
                />
              </View>
            ))}
          </View>
        </View>

        {recipes[0] ? (
          <View className="gap-2 rounded-[28px] border border-stroke bg-surface px-5 py-5">
            <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">Current draft</Text>
            <Text className="text-[22px] font-black leading-[28px] text-ink">{recipes[0].title}</Text>
            <Text className="text-sm text-muted">{recipes[0].summary}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

function SourceStat({ title, value }: { title: string; value: string }) {
  return (
    <View className="min-h-[110px] w-[48%] rounded-[26px] border border-stroke bg-surface px-4 py-4">
      <View className="h-2.5 w-2.5 rounded-full bg-violet" />
      <Text className="mt-auto text-[30px] font-black text-ink">{value}</Text>
      <Text className="text-[15px] font-semibold text-ink">{title}</Text>
    </View>
  );
}
