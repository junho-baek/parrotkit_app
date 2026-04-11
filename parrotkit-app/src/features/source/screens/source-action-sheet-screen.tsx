import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { brandActionGradient } from '@/core/theme/colors';

type SourceAction = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
};

const sourceActions: SourceAction[] = [
  {
    icon: 'link-variant-plus',
    title: 'Paste URL',
  },
  {
    icon: 'content-paste',
    title: 'Use clipboard',
  },
  {
    icon: 'tray-arrow-up',
    title: 'Import media',
  },
];

export function SourceActionSheetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black/30">
      <Pressable className="flex-1" onPress={() => router.back()} />

      <View className="bg-transparent">
        <View
          className="overflow-hidden rounded-t-[34px] border border-b-0 border-stroke bg-sheet px-5 pt-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View
            aria-hidden
            className="pointer-events-none absolute inset-x-[-12px] top-0 h-40 bg-[radial-gradient(74%_62%_at_50%_0%,rgba(213,232,255,0.74)_0%,rgba(238,228,255,0.46)_40%,rgba(255,255,255,0)_80%)]"
          />
          <View aria-hidden className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/90 to-transparent" />

          <View className="items-center pb-4">
            <View className="h-1.5 w-12 rounded-full bg-slate-300/80" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-5 px-1">
              <Text className="text-[31px] font-black leading-[36px] text-ink">Paste</Text>

              <View className="gap-3">
                <Text className="text-sm font-semibold uppercase tracking-[0.6px] text-slate-500">Video URL</Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="rounded-2xl border border-stroke bg-surface px-4 py-4 text-base text-ink"
                  placeholder="Paste a YouTube, TikTok, or Instagram URL"
                  placeholderTextColor="#8c8a84"
                />
                <Pressable onPress={() => router.back()}>
                  <LinearGradient
                    colors={brandActionGradient}
                    end={{ x: 1, y: 1 }}
                    start={{ x: 0, y: 0 }}
                    style={{ borderRadius: 18 }}
                  >
                    <View className="flex-row items-center justify-center gap-2 rounded-[18px] px-4 py-4">
                      <Text className="text-base font-semibold text-white">Make your video recipe</Text>
                      <MaterialCommunityIcons color="#fffdf8" name="arrow-right" size={18} />
                    </View>
                  </LinearGradient>
                </Pressable>
              </View>

              <View className="h-px bg-slate-200/80" />

              <View className="gap-3">
                {sourceActions.map((action) => (
                  <View key={action.title} className="flex-row gap-3 rounded-3xl border border-stroke bg-surface px-4 py-4">
                    <View className="h-11 w-11 items-center justify-center rounded-2xl bg-violet/10">
                      <MaterialCommunityIcons color="#8c67ff" name={action.icon} size={22} />
                    </View>
                    <View className="flex-1 justify-center">
                      <Text className="text-[16px] font-bold text-ink">{action.title}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
