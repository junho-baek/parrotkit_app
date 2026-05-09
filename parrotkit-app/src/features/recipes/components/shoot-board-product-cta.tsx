import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { AppLanguage } from "@/core/i18n/app-language";
import { brandActionGradient } from "@/core/theme/colors";

export function ShootBoardProductCta({
  language,
  onPress,
}: {
  language: AppLanguage;
  onPress: () => void;
}) {
  const isKo = language === "ko";

  return (
    <View style={styles.shell}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons color="#8c67ff" name="storefront-outline" size={21} />
          </View>
          <View style={styles.titleWrap}>
            <Text style={styles.eyebrow}>{isKo ? "RECIPE PRODUCT" : "RECIPE PRODUCT"}</Text>
            <Text numberOfLines={2} style={styles.title}>
              {isKo ? "이 촬영 레시피를 상품으로 만들기" : "Turn this shoot into a Recipe Product"}
            </Text>
          </View>
        </View>

        <View style={styles.itemGrid}>
          <ProductChip icon="view-dashboard-outline" label={isKo ? "컷별 레시피" : "Cut-by-cut"} />
          <ProductChip icon="script-text-outline" label={isKo ? "스크립트" : "Script"} />
          <ProductChip icon="television-guide" label={isKo ? "프롬프터" : "Prompter"} />
          <ProductChip icon="cash" label={isKo ? "판매 준비" : "Sell-ready"} />
        </View>

        <Pressable accessibilityRole="button" onPress={onPress} style={styles.buttonPressable}>
          <LinearGradient
            colors={brandActionGradient}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.button}
          >
            <Text numberOfLines={1} style={styles.buttonText}>
              {isKo ? "Recipe Product 만들기" : "Turn into Recipe Product"}
            </Text>
            <MaterialCommunityIcons color="#fff" name="arrow-right" size={18} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function ProductChip({
  icon,
  label,
}: {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
}) {
  return (
    <View style={styles.chip}>
      <MaterialCommunityIcons color="#64748b" name={icon} size={15} />
      <Text numberOfLines={1} style={styles.chipText}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16,
  },
  buttonPressable: {
    marginTop: 14,
  },
  buttonText: {
    color: "#ffffff",
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
  },
  chip: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "48%",
    flexDirection: "row",
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 10,
  },
  chipText: {
    color: "#334155",
    flex: 1,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
  },
  eyebrow: {
    color: "#8c67ff",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#ede9fe",
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  itemGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  shell: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 22,
    marginTop: 2,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
});
