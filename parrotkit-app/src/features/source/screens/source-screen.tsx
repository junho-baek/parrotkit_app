import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { screenAccents } from '@/core/theme/colors';

type SourceQueueItem = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
};

const sourceQueue: SourceQueueItem[] = [
  {
    icon: 'link-variant',
    title: 'Links',
  },
  {
    icon: 'content-paste',
    title: 'Drafts',
  },
  {
    icon: 'tray-arrow-up',
    title: 'Imports',
  },
  {
    icon: 'arrow-top-right-thin-circle-outline',
    title: 'Queue',
  },
];

export function SourceScreen() {
  const accentColor = screenAccents.source;
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 176 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5 px-5 pt-5">
          <View
            className="rounded-[28px] border bg-surface px-5 py-6"
            style={{
              borderColor: accentColor,
              elevation: 5,
              shadowColor: accentColor,
              shadowOpacity: 0.1,
              shadowRadius: 24,
              shadowOffset: {
                width: 0,
                height: 18,
              },
            }}
          >
            <Text className="text-[32px] font-black leading-[38px] text-ink">Source inbox</Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {sourceQueue.map((item) => (
              <View
                key={item.title}
                className="min-h-[118px] w-[48%] rounded-[26px] border border-stroke bg-surface px-4 py-4"
                style={{
                  elevation: 2,
                  shadowColor: '#111827',
                  shadowOpacity: 0.07,
                  shadowRadius: 18,
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                }}
              >
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-violet/10">
                  <MaterialCommunityIcons color={accentColor} name={item.icon} size={22} />
                </View>
                <Text className="mt-auto text-[15px] font-semibold text-ink">{item.title}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
