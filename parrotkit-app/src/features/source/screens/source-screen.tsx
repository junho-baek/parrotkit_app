import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Href, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { screenAccents } from '@/core/theme/colors';

type SourceQueueItem = {
  body: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
};

const sourceSignals = [
  'Keep copied creator URLs, temporary notes, and import-ready links in one destination.',
  'Make Source feel like a home for inputs, not a transient one-tap overlay.',
  'Open the + sheet only when you want to create, import, or capture something new.',
];

const sourceQueue: SourceQueueItem[] = [
  {
    body: 'Collect copied links, creator references, and saved external assets before turning them into recipes.',
    icon: 'link-variant',
    title: 'Incoming links',
  },
  {
    body: 'Leave space for later clipboard detection, source history, and import status without changing the root nav.',
    icon: 'content-paste',
    title: 'Draft inbox',
  },
  {
    body: 'Keep the action model simple: Source is the destination, + is the entry point into a stacked creation flow.',
    icon: 'plus-circle-outline',
    title: 'Action first',
  },
];

export function SourceScreen() {
  const accentColor = screenAccents.source;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        className="flex-1"
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 132 }]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5 px-5 pt-5">
          <View
            className="rounded-[28px] border bg-surface px-5 py-6"
            style={[styles.heroCard, { borderColor: accentColor, shadowColor: accentColor }]}
          >
            <Text className="text-[13px] font-extrabold tracking-[1px]" style={{ color: accentColor }}>
              SOURCE
            </Text>
            <Text className="mt-2 text-[32px] font-black leading-[38px] text-ink">Build from source</Text>
            <Text className="mt-2 text-base leading-6 text-stone-600">
              Source is the dedicated mobile surface for incoming links, copied references, and quick import flows
              before they turn into recipes.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-[15px] font-bold text-ink">Why this works</Text>
            <View className="gap-3">
              {sourceSignals.map((item) => (
                <View key={item} className="flex-row items-start gap-3 rounded-3xl bg-surface px-4 py-4" style={styles.card}>
                  <View className="mt-1.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                  <Text className="flex-1 text-[15px] leading-[22px] text-stone-700">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-[15px] font-bold text-ink">Source queue</Text>
            <View className="gap-3">
              {sourceQueue.map((item) => (
                <View key={item.title} className="flex-row gap-3 rounded-[26px] bg-surface px-4 py-4" style={styles.card}>
                  <View className="h-11 w-11 items-center justify-center rounded-2xl bg-violet/10">
                    <MaterialCommunityIcons color={accentColor} name={item.icon} size={22} />
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="text-[16px] font-bold text-ink">{item.title}</Text>
                    <Text className="text-[14px] leading-[21px] text-stone-600">{item.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="rounded-[26px] bg-ink px-5 py-5">
            <Text className="text-base font-bold leading-[22px] text-slate-50">Source is the destination. + is the action.</Text>
            <Text className="mt-2 text-[14px] leading-[21px] text-slate-300">
              Keep the tab bar readable, land on Source when you want context, and open the center + only when you want
              to paste, import, or create a new source draft.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View pointerEvents="box-none" style={styles.fabLayer}>
        <Pressable
          accessibilityHint="Open the source action sheet"
          accessibilityLabel="Add source"
          className="h-[68px] w-[68px] items-center justify-center rounded-full border border-white/85 bg-ink"
          onPress={() => router.push('/source-actions' as Href)}
          style={[
            styles.fab,
            {
              bottom: insets.bottom + 32,
            },
          ]}
        >
          <MaterialCommunityIcons color="#fffdf8" name="plus" size={30} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    shadowColor: '#111827',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  contentContainer: {
    paddingBottom: 132,
  },
  fab: {
    elevation: 10,
    shadowColor: '#111827',
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 14,
    },
  },
  fabLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  heroCard: {
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 18,
    },
  },
});
