import { StyleSheet, Text, View, ScrollView } from 'react-native';

type NativeTabScreenProps = {
  title: string;
  eyebrow: string;
  description: string;
  accentColor: string;
  highlights: string[];
};

export function NativeTabScreen({
  title,
  eyebrow,
  description,
  accentColor,
  highlights,
}: NativeTabScreenProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.page}>
        <View
          style={[
            styles.heroCard,
            {
              borderColor: accentColor,
              boxShadow: `0 18px 40px ${accentColor}22`,
            },
          ]}
        >
          <Text style={[styles.eyebrow, { color: accentColor }]}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick glance</Text>
          <View style={styles.list}>
            {highlights.map((item) => (
              <View key={item} style={styles.listItem}>
                <View style={[styles.dot, { backgroundColor: accentColor }]} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Native tabs check</Text>
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>This screen is rendered inside Expo Router native tabs.</Text>
            <Text style={styles.statusText}>
              Use the system tab bar below to switch sections and compare the
              native selection, safe-area behavior, and scroll interaction.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 36,
  },
  page: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    paddingHorizontal: 20,
    paddingVertical: 22,
    gap: 10,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: '#111827',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4b5563',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  list: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 22,
    borderCurve: 'continuous',
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
  },
  dot: {
    width: 10,
    height: 10,
    marginTop: 7,
    borderRadius: 999,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  statusCard: {
    borderRadius: 24,
    borderCurve: 'continuous',
    backgroundColor: '#111827',
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 8,
  },
  statusTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: '#f9fafb',
  },
  statusText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#d1d5db',
  },
});
