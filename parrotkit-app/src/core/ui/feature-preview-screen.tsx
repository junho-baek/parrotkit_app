import { Text, View } from 'react-native';

import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';

type FeaturePreviewScreenProps = {
  title: string;
  accentColor: string;
  panels: string[];
};

export function FeaturePreviewScreen({ title, accentColor, panels }: FeaturePreviewScreenProps) {
  return (
    <AppScreenScrollView>
      <View className="gap-5 px-5">
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
          <Text className="text-[32px] font-black leading-[38px] text-ink">{title}</Text>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {panels.map((panel) => (
            <View
              key={panel}
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
              <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
              <Text className="mt-auto text-[15px] font-semibold text-ink">{panel}</Text>
            </View>
          ))}
        </View>
      </View>
    </AppScreenScrollView>
  );
}
