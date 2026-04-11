import { ScrollView, Text, View } from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { MediaTileCard } from '@/core/ui/media-tile-card';

export function ProfileScreen() {
  const { likedReferences, profile, recipes } = useMockWorkspace();

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ paddingBottom: 176 }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-5 px-5 pt-5">
        <View className="gap-3 rounded-[28px] border border-stroke bg-surface px-5 py-5">
          <View className="gap-1">
            <Text className="text-[30px] font-black leading-[34px] text-ink">{profile.name}</Text>
            <Text className="text-sm font-semibold text-violet">{profile.role}</Text>
          </View>

          <Text className="text-sm leading-6 text-muted">{profile.bio}</Text>

          <View className="flex-row gap-2">
            {profile.focusTags.map((tag) => (
              <View key={tag} className="rounded-full bg-slate-100 px-3 py-1.5">
                <Text className="text-[11px] font-semibold text-slate-600">{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="flex-row gap-2.5">
          <MiniStat title="Streak" value={`${profile.streakDays}d`} />
          <MiniStat title="Recipes" value={String(recipes.length)} />
          <MiniStat title="Likes" value={String(likedReferences.length)} />
        </View>

        <View className="gap-3">
          <Text className="text-[18px] font-bold text-ink">Liked References</Text>

          {likedReferences.length === 0 ? (
            <View className="rounded-[24px] border border-dashed border-stroke bg-surface px-5 py-10">
              <Text className="text-center text-sm font-semibold text-ink">No liked references yet</Text>
              <Text className="mt-2 text-center text-sm text-muted">
                Like trending videos in Explore and they will show up here.
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-3">
              {likedReferences.map((reference) => (
                <View key={reference.id} className="w-[48%]">
                  <MediaTileCard
                    actionLabel="Liked"
                    actionMeta={`(${reference.likes})`}
                    actionTone="liked"
                    subtitle={reference.creator}
                    thumbnail={reference.thumbnail}
                    title={reference.title}
                    topLeftLabel="SAVED"
                    topLeftTone="success"
                    topRightLabel={reference.platform}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <View className="flex-1 rounded-[22px] border border-stroke bg-surface px-4 py-4">
      <Text className="text-[22px] font-black text-ink">{value}</Text>
      <Text className="mt-1 text-[11px] font-semibold text-muted">{title}</Text>
    </View>
  );
}
