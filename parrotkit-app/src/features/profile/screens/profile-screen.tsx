import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppLanguage, type AppLanguage } from '@/core/i18n/app-language';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { MediaTileCard } from '@/core/ui/media-tile-card';

type ProfileCopy = ReturnType<typeof useAppLanguage>['copy']['profile'];

export function ProfileScreen() {
  const { likedReferences, profile, recipes } = useMockWorkspace();
  const { copy, language, setLanguage } = useAppLanguage();
  const profileCopy = copy.profile;

  return (
    <AppScreenScrollView>
      <View className="gap-5 px-5">
        <View className="gap-3 rounded-[28px] border border-stroke bg-surface px-5 py-5">
          <View className="gap-1">
            <Text className="text-[30px] font-black leading-[34px] text-ink">{profile.name}</Text>
            <Text className="text-sm font-semibold text-violet">{profile.role}</Text>
          </View>

          <Text className="text-sm leading-6 text-muted">{profile.bio}</Text>

          <View className="flex-row flex-wrap gap-2">
            {profile.focusTags.map((tag) => (
              <View key={tag} className="rounded-full bg-slate-100 px-3 py-1.5">
                <Text className="text-[11px] font-semibold text-slate-600">{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="flex-row gap-2.5">
          <MiniStat title={profileCopy.statsStreak} value={`${profile.streakDays}d`} />
          <MiniStat title={profileCopy.statsRecipes} value={String(recipes.length)} />
          <MiniStat title={profileCopy.statsLikes} value={String(likedReferences.length)} />
        </View>

        <View className="gap-3 rounded-[26px] border border-stroke bg-surface px-5 py-5">
          <Text className="text-[18px] font-black text-ink">{profileCopy.settingsSection}</Text>

          <View className="gap-1">
            <Text className="text-[15px] font-black text-ink">{profileCopy.languageTitle}</Text>
            <Text className="text-[13px] font-semibold leading-5 text-muted">
              {profileCopy.languageDescription}
            </Text>
          </View>

          <View style={styles.languageSegment}>
            <LanguageOption
              active={language === 'en'}
              label={profileCopy.english}
              language="en"
              onPress={setLanguage}
            />
            <LanguageOption
              active={language === 'ko'}
              label={profileCopy.korean}
              language="ko"
              onPress={setLanguage}
            />
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-[18px] font-bold text-ink">{profileCopy.likedSection}</Text>

          {likedReferences.length === 0 ? (
            <View className="rounded-[24px] border border-dashed border-stroke bg-surface px-5 py-10">
              <Text className="text-center text-sm font-semibold text-ink">{profileCopy.likedEmptyTitle}</Text>
              <Text className="mt-2 text-center text-sm text-muted">
                {profileCopy.likedEmptyBody}
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-3">
              {likedReferences.map((reference) => (
                <View key={reference.id} className="w-[48%]">
                  <MediaTileCard
                    actionLabel={profileCopy.likedAction}
                    actionMeta={`(${reference.likes})`}
                    actionTone="liked"
                    subtitle={reference.creator}
                    thumbnail={reference.thumbnail}
                    title={reference.title}
                    topLeftLabel={profileCopy.savedLabel}
                    topLeftTone="success"
                    topRightLabel={reference.platform}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </AppScreenScrollView>
  );
}

function LanguageOption({
  active,
  label,
  language,
  onPress,
}: {
  active: boolean;
  label: string;
  language: AppLanguage;
  onPress: (language: AppLanguage) => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      onPress={() => onPress(language)}
      style={[styles.languageOption, active ? styles.languageOptionActive : null]}
    >
      <Text style={[styles.languageOptionText, active ? styles.languageOptionTextActive : null]}>
        {label}
      </Text>
    </Pressable>
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

const styles = StyleSheet.create({
  languageOption: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
  languageOptionActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  languageOptionText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '900',
  },
  languageOptionTextActive: {
    color: '#ffffff',
  },
  languageSegment: {
    backgroundColor: '#f1f5f9',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    padding: 4,
  },
});
