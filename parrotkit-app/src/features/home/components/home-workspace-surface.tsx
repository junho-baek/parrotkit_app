import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { MediaTileCard } from '@/core/ui/media-tile-card';

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function HomeWorkspaceSurface() {
  const router = useRouter();
  const { homeStats, recentReferences, recipes } = useMockWorkspace();

  return (
    <View className="flex-1 bg-canvas">
      <AppScreenScrollView>
        <View className="gap-5 px-5">
          <View className="gap-1">
            <Text className="text-[32px] font-black leading-[36px] text-ink">Welcome!</Text>
            <Text className="text-[15px] font-medium text-ink">Your creative workspace</Text>
          </View>

          <View className="flex-row gap-2.5">
            <StatCard tone="blue" title="References" value={String(homeStats.references)} />
            <StatCard tone="violet" title="Recipes" value={String(homeStats.recipes)} />
            <StatCard tone="rose" title="Views" value={compactFormatter.format(homeStats.views)} />
          </View>

          <PressableAction
            body="Turn viral videos into actionable recipes"
            cta="+ New"
            onPress={() => router.push('/source-actions' as Href)}
            title="Create Recipe"
          />

          {recipes[0] ? (
            <View className="gap-2 rounded-[28px] border border-stroke bg-surface px-5 py-5">
              <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">Latest draft</Text>
              <Text className="text-[22px] font-black leading-[28px] text-ink">{recipes[0].title}</Text>
              <Text className="text-sm leading-6 text-muted">{recipes[0].summary}</Text>
              <View className="flex-row gap-2">
                <Chip label={recipes[0].platform} />
                <Chip label={recipes[0].goal} />
              </View>
            </View>
          ) : null}

          <View className="gap-3">
            <Text className="text-[18px] font-bold text-ink">Recent References</Text>

            <View className="flex-row flex-wrap gap-3">
              {recentReferences.map((reference) => (
                <View key={reference.id} className="w-[48%]">
                  <MediaTileCard
                    actionLabel={reference.recipeId ? 'Open Recipe' : 'Paste Again'}
                    actionTone={reference.recipeId ? 'brand' : 'neutral'}
                    leftMetric={{ icon: '👁', value: reference.views }}
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
                    subtitle={reference.creator}
                    thumbnail={reference.thumbnail}
                    title={reference.title}
                    topLeftLabel="NEW"
                    topLeftTone="brand"
                    topRightLabel={reference.duration}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </AppScreenScrollView>
    </View>
  );
}

function StatCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: 'blue' | 'violet' | 'rose';
}) {
  const gradientColors =
    tone === 'blue'
      ? (['#eff6ff', '#dbeafe'] as const)
      : tone === 'violet'
        ? (['#f5f3ff', '#ede9fe'] as const)
        : (['#fff1f2', '#ffe4e6'] as const);
  const valueColor = tone === 'blue' ? '#0284c7' : tone === 'violet' ? '#7c3aed' : '#e11d48';

  return (
    <LinearGradient colors={gradientColors} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={{ borderRadius: 22, flex: 1 }}>
      <View className="px-3 py-3">
        <Text className="text-[22px] font-black" style={{ color: valueColor }}>
          {value}
        </Text>
        <Text className="mt-1 text-[11px] font-semibold text-black/60">{title}</Text>
      </View>
    </LinearGradient>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-slate-100 px-3 py-1.5">
      <Text className="text-[11px] font-semibold text-slate-600">{label}</Text>
    </View>
  );
}

function PressableAction({
  title,
  body,
  cta,
  onPress,
}: {
  title: string;
  body: string;
  cta: string;
  onPress: () => void;
}) {
  return (
    <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={{ borderRadius: 24 }}>
      <View className="flex-row items-center justify-between rounded-[24px] px-5 py-5">
        <View className="flex-1 gap-1 pr-4">
          <Text className="text-[18px] font-bold text-white">{title}</Text>
          <Text className="text-[13px] text-white/90">{body}</Text>
        </View>

        <View className="overflow-hidden rounded-2xl">
          <Text
            className="rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-sky-600"
            onPress={onPress}
          >
            {cta}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
