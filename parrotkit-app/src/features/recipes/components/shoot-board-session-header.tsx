import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardRecipe } from "@/features/recipes/lib/shoot-board-model";

type Copy = {
  back: string;
  done: string;
  more: string;
};

export function ShootBoardSessionHeader({
  board,
  copy,
  language,
  onBack,
  onDone,
  onMore,
  topInset,
}: {
  board: ShootBoardRecipe;
  copy: Copy;
  language: AppLanguage;
  onBack: () => void;
  onDone: () => void;
  onMore: () => void;
  topInset: number;
}) {
  const totalCuts = board.cuts.length;
  const completedCuts = board.cuts.filter((cut) => cut.takes.length > 0).length;
  const takeCount = board.cuts.reduce((sum, cut) => sum + cut.takes.length, 0);
  const durationSeconds = board.cuts.reduce(
    (sum, cut) => sum + cut.durationSeconds,
    0,
  );

  return (
    <View style={[styles.shell, { paddingTop: topInset + 12 }]}>
      <View style={styles.navRow}>
        <Pressable
          accessibilityLabel={copy.back}
          accessibilityRole="button"
          onPress={onBack}
          style={styles.iconButton}
        >
          <MaterialCommunityIcons color="#ffffff" name="chevron-down" size={25} />
        </Pressable>
        <Pressable
          accessibilityLabel={copy.more}
          accessibilityRole="button"
          onPress={onMore}
          style={styles.iconButton}
        >
          <MaterialCommunityIcons color="#ffffff" name="dots-horizontal" size={24} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onDone}
          style={styles.doneButton}
        >
          <Text style={styles.doneText}>{copy.done}</Text>
        </Pressable>
      </View>
      <View style={styles.statsRow}>
        <SessionStat
          label={language === "ko" ? "컷" : "Cuts"}
          value={`${completedCuts}/${totalCuts}`}
        />
        <SessionStat
          label={language === "ko" ? "테이크" : "Takes"}
          value={String(takeCount)}
        />
        <SessionStat
          label={language === "ko" ? "길이" : "Length"}
          value={formatDuration(durationSeconds, language)}
        />
      </View>
    </View>
  );
}

function SessionStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function formatDuration(seconds: number, language: AppLanguage) {
  if (seconds < 60) {
    return language === "ko" ? `${seconds}초` : `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return remaining === 0
    ? `${minutes}:00`
    : `${minutes}:${String(remaining).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  doneButton: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    marginLeft: "auto",
    minHeight: 38,
    paddingHorizontal: 8,
  },
  doneText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  iconButton: {
    alignItems: "center",
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  navRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  shell: {
    backgroundColor: "#0B0F14",
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
  },
  statValue: {
    color: "#ffffff",
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 0,
  },
  statsRow: {
    flexDirection: "row",
    gap: 18,
    paddingTop: 18,
  },
});
