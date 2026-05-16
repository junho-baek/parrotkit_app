import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardRecipe } from "@/features/recipes/lib/shoot-board-model";

export function ShootBoardBodyHeader({
  board,
  language,
  onOpenNote,
}: {
  board: ShootBoardRecipe;
  language: AppLanguage;
  onOpenNote: () => void;
}) {
  const hasNote = Boolean(board.boardNote?.trim());

  return (
    <View style={styles.shell}>
      <Text numberOfLines={2} style={styles.title}>
        {board.title}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onOpenNote}
        style={styles.noteRow}
      >
        <MaterialCommunityIcons color="#94a3b8" name="pencil-outline" size={18} />
        <Text
          numberOfLines={1}
          style={[styles.noteText, hasNote && styles.noteTextFilled]}
        >
          {hasNote
            ? board.boardNote
            : language === "ko"
              ? "오늘의 메모를 입력해보세요."
              : "Add today's shooting note."}
        </Text>
        <MaterialCommunityIcons color="#94a3b8" name="chevron-right" size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  noteRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 34,
  },
  noteText: {
    color: "#94a3b8",
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0,
  },
  noteTextFilled: {
    color: "#64748b",
  },
  shell: {
    backgroundColor: "#ffffff",
    gap: 8,
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  title: {
    color: "#111827",
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 31,
  },
});
