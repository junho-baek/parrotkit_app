import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SourceAction = {
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
};

const sourceActions: SourceAction[] = [
  {
    description: 'Start from a copied creator or video URL and turn it into a structured source draft.',
    icon: 'link-variant-plus',
    title: 'Paste URL',
  },
  {
    description: 'Pull in what is already on the clipboard when Source becomes the default mobile intake surface.',
    icon: 'content-paste',
    title: 'Use clipboard',
  },
  {
    description: 'Leave room for share sheet, photo import, or file-based intake without changing the bottom navigation again.',
    icon: 'tray-arrow-up',
    title: 'Import media',
  },
];

export function SourceActionSheetScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black/30">
      <Pressable className="flex-1" onPress={() => router.back()} />

      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View className="rounded-t-[34px] border border-b-0 border-stroke bg-sheet px-5 pb-6 pt-4">
          <View className="items-center pb-4">
            <View className="h-1.5 w-12 rounded-full bg-stone-300" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-5 pb-2">
              <View className="gap-2">
                <Text className="text-[13px] font-extrabold tracking-[1px] text-violet">ADD SOURCE</Text>
                <Text className="text-[31px] font-black leading-[36px] text-ink">Quick intake sheet</Text>
                <Text className="text-base leading-6 text-stone-600">
                  Keep Source as a stable destination tab, and open this sheet only when you want to paste, import, or
                  create a new source draft.
                </Text>
              </View>

              <View className="rounded-[26px] border border-stroke bg-surface px-4 py-4" style={styles.card}>
                <Text className="text-sm font-semibold uppercase tracking-[0.6px] text-stone-500">URL</Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="mt-3 rounded-2xl border border-stroke bg-canvas px-4 py-4 text-base text-ink"
                  placeholder="Paste a YouTube, TikTok, or Instagram URL"
                  placeholderTextColor="#8c8a84"
                />
                <Pressable
                  className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-4"
                  onPress={() => router.back()}
                >
                  <MaterialCommunityIcons color="#fffdf8" name="arrow-top-right" size={18} />
                  <Text className="text-base font-semibold text-slate-50">Create source draft</Text>
                </Pressable>
              </View>

              <View className="gap-3">
                {sourceActions.map((action) => (
                  <View key={action.title} className="flex-row gap-3 rounded-3xl bg-surface px-4 py-4" style={styles.card}>
                    <View className="h-11 w-11 items-center justify-center rounded-2xl bg-violet/10">
                      <MaterialCommunityIcons color="#8c67ff" name={action.icon} size={22} />
                    </View>
                    <View className="flex-1 gap-1">
                      <Text className="text-[16px] font-bold text-ink">{action.title}</Text>
                      <Text className="text-[14px] leading-[21px] text-stone-600">{action.description}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <Pressable className="items-center justify-center rounded-2xl border border-stroke px-4 py-4" onPress={() => router.back()}>
                <Text className="text-[15px] font-semibold text-stone-700">Close sheet</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    shadowColor: '#111827',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
});
