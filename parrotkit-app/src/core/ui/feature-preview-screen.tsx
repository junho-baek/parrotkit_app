import { ScrollView, StyleSheet, Text, View } from 'react-native';

type FeaturePreviewScreenProps = {
  title: string;
  eyebrow: string;
  description: string;
  accentColor: string;
  highlights: string[];
  footerTitle: string;
  footerBody: string;
};

export function FeaturePreviewScreen({
  title,
  eyebrow,
  description,
  accentColor,
  highlights,
  footerTitle,
  footerBody,
}: FeaturePreviewScreenProps) {
  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-5 px-5 pt-5">
        <View
          className="rounded-[28px] border bg-surface px-5 py-6"
          style={[styles.heroCard, { borderColor: accentColor, shadowColor: accentColor }]}
        >
          <Text className="text-[13px] font-extrabold tracking-[1px]" style={{ color: accentColor }}>
            {eyebrow}
          </Text>
          <Text className="mt-2 text-[32px] font-black leading-[38px] text-ink">{title}</Text>
          <Text className="mt-2 text-base leading-6 text-stone-600">{description}</Text>
        </View>

        <View className="gap-3">
          <Text className="text-[15px] font-bold text-ink">Quick glance</Text>
          <View className="gap-3">
            {highlights.map((item) => (
              <View key={item} className="flex-row items-start gap-3 rounded-3xl bg-surface px-4 py-4" style={styles.card}>
                <View className="mt-1.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                <Text className="flex-1 text-[15px] leading-[22px] text-stone-700">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-[15px] font-bold text-ink">Native shell check</Text>
          <View className="rounded-[26px] bg-ink px-5 py-5">
            <Text className="text-base font-bold leading-[22px] text-slate-50">{footerTitle}</Text>
            <Text className="mt-2 text-[14px] leading-[21px] text-slate-300">{footerBody}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 112,
  },
  card: {
    elevation: 2,
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
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
