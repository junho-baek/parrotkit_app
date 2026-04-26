import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Href, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { MediaTileCard } from '@/core/ui/media-tile-card';

export function SourceScreen() {
  const router = useRouter();
  const { createRecipeDraft, recentReferences, recipes, sourceStats } = useMockWorkspace();

  const handleStartBlankRecipe = () => {
    const recipe = createRecipeDraft({
      goal: 'Build a reusable content recipe',
      niche: 'Creator',
      notes: 'Started from Source without a pasted link.',
      title: 'New Recipe Draft',
    });

    router.push(`/recipe/${recipe.id}` as Href);
  };

  return (
    <AppScreenScrollView>
      <View className="gap-5 px-5">
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

        <View className="gap-3">
          <Text className="text-[18px] font-bold text-ink">Create from Source</Text>

          <View className="flex-row gap-3">
            <SourceActionCard
              accent="violet"
              body="Drop a TikTok, Reel, or Short. ParrotKit turns it into a structured draft."
              icon="link-variant"
              label="Paste"
              onPress={() => router.push('/source-actions' as Href)}
              title="Paste recipe"
            />
            <SourceActionCard
              accent="blue"
              body="Skip the link. Open a clean draft and shape the content recipe yourself."
              icon="playlist-edit"
              label="Start"
              onPress={handleStartBlankRecipe}
              title="Blank recipe"
            />
          </View>
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
    </AppScreenScrollView>
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

function SourceActionCard({
  accent,
  body,
  icon,
  label,
  onPress,
  title,
}: {
  accent: 'blue' | 'violet';
  body: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  title: string;
}) {
  const tone =
    accent === 'violet'
      ? {
          background: '#f5f3ff',
          button: '#8b5cf6',
          icon: '#7c3aed',
        }
      : {
          background: '#eff6ff',
          button: '#0284c7',
          icon: '#0369a1',
        };

  return (
    <Pressable
      accessibilityRole="button"
      className="min-h-[178px] flex-1 justify-between rounded-[26px] border border-stroke px-4 py-4"
      onPress={onPress}
      style={{ backgroundColor: tone.background }}
    >
      <View className="gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/80">
          <MaterialCommunityIcons color={tone.icon} name={icon} size={21} />
        </View>

        <View className="gap-1.5">
          <Text className="text-[17px] font-black leading-[21px] text-ink">{title}</Text>
          <Text className="text-[12px] font-medium leading-[17px] text-muted">{body}</Text>
        </View>
      </View>

      <View className="mt-4 min-w-[70px] items-center rounded-full px-3.5 py-2" style={{ backgroundColor: tone.button }}>
        <Text allowFontScaling={false} className="text-[12px] font-bold text-white">
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
