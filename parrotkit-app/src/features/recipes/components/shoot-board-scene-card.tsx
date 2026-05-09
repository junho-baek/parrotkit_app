import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import type { AppLanguage } from "@/core/i18n/app-language";
import { brandActionGradient } from "@/core/theme/colors";
import { shootBoardSceneCardLayout } from "@/features/recipes/components/shoot-board-scene-card-layout";
import {
  getShootBoardCutCompletionState,
  type ShootBoardCut,
  type ShootBoardCutTextPatch,
} from "@/features/recipes/lib/shoot-board-model";

export function ShootBoardSceneCard({
  cut,
  expanded,
  language,
  onDragStart,
  onPreview,
  onTake,
  onShoot,
  onToggleExpanded,
  onToggleRequiredCheck,
  onToggleSceneComplete,
  onUpdateText,
  reorderMode,
}: {
  cut: ShootBoardCut;
  expanded: boolean;
  language: AppLanguage;
  onDragStart: () => void;
  onPreview: () => void;
  onTake: () => void;
  onShoot: () => void;
  onToggleExpanded: () => void;
  onToggleRequiredCheck: (checklistItemId: string, checked: boolean) => void;
  onToggleSceneComplete: (complete: boolean) => void;
  onUpdateText: (patch: ShootBoardCutTextPatch) => void;
  reorderMode: boolean;
}) {
  const [editing] = useState(() => isBlankEditableCut(cut));
  const completionState = getShootBoardCutCompletionState(cut);
  const accent = getRoleAccent(cut.role);
  const title = language === "ko" ? cut.titleKo : cut.title;
  const instruction =
    language === "ko" ? (cut.instructionKo ?? cut.instruction) : cut.instruction;

  return (
    <View
      style={[
        styles.card,
        { borderBottomColor: getTakeStatusBorderColor(cut.takeStatus) },
        cut.takeStatus === "final" && styles.finalCard,
      ]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.72}
          accessibilityLabel={language === "ko" ? "드래그 핸들" : "Drag handle"}
          accessibilityRole="button"
          delayLongPress={180}
          onLongPress={onDragStart}
          style={[
            styles.dragHandle,
            expanded ? styles.dragHandleExpanded : styles.dragHandleCollapsed,
          ]}
        >
          <MaterialCommunityIcons
            color={reorderMode ? accent.main : "#94a3b8"}
            name="drag-vertical"
            size={22}
          />
        </TouchableOpacity>

        <Pressable
          accessibilityRole="button"
          onPress={onToggleExpanded}
          style={[
            styles.expandButton,
            expanded ? styles.expandButtonExpanded : styles.expandButtonCollapsed,
          ]}
        >
          <MaterialCommunityIcons
            color="#111827"
            name={expanded ? "chevron-down" : "chevron-right"}
            size={22}
          />
        </Pressable>

        <CutThumbnail
          expanded={expanded}
          onPress={onPreview}
          thumbnailUrl={cut.thumbnailUrl}
        />

        <Pressable
          accessibilityRole="button"
          onPress={onToggleExpanded}
          style={[
            styles.titleBlock,
            expanded ? styles.titleBlockExpanded : styles.titleBlockCollapsed,
          ]}
        >
          <View style={styles.titleRow}>
            <Text numberOfLines={1} style={styles.titleText}>
              {title}
            </Text>
            <Text style={styles.titleDot}>·</Text>
            <Text style={styles.durationText}>
              {formatCutDuration(language, cut.durationSeconds)}
            </Text>
          </View>
          <Text numberOfLines={expanded ? 2 : 1} style={styles.instructionText}>
            {instruction}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: completionState === "complete" }}
          onPress={() => onToggleSceneComplete(completionState !== "complete")}
          style={[
            styles.completionCircle,
            expanded
              ? styles.completionCircleExpanded
              : styles.completionCircleCollapsed,
            completionState === "complete" && {
              backgroundColor: accent.main,
              borderColor: accent.main,
            },
            completionState === "partial" && { borderColor: accent.main },
          ]}
        >
          {completionState === "complete" ? (
            <MaterialCommunityIcons color="#fff" name="check" size={16} />
          ) : null}
          {completionState === "partial" ? (
            <View
              style={[styles.partialDash, { backgroundColor: accent.main }]}
            />
          ) : null}
        </Pressable>
      </View>

      {expanded ? (
        <View style={styles.expandedBody}>
          <DetailInput
            editing={editing}
            placeholder={
              language === "ko"
                ? "촬영 중 말할 문장을 입력하세요"
                : "Add line to say"
            }
            title="Line to say"
            value={getLineToSay(language, cut)}
            onChangeText={(value) =>
              onUpdateText(
                language === "ko"
                  ? { speakingLineKo: value }
                  : { speakingLine: value },
              )
            }
          />
          <DetailInput
            editing={editing}
            placeholder={
              language === "ko"
                ? "촬영 가이드를 입력하세요"
                : "Add shooting guideline"
            }
            title={language === "ko" ? "촬영 가이드" : "Shooting guideline"}
            value={
              language === "ko"
                ? cut.shootingGuidelineKo
                : cut.shootingGuideline
            }
            onChangeText={(value) =>
              onUpdateText(
                language === "ko"
                  ? { shootingGuidelineKo: value }
                  : { shootingGuideline: value },
              )
            }
          />

          <View style={styles.checklist}>
            <Text style={styles.detailTitle}>
              {language === "ko" ? "필수 체크" : "Required checklist"}
            </Text>
            {cut.requiredChecklist.map((item) => (
              <View style={styles.checkRow} key={item.id}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.checked }}
                  onPress={() => onToggleRequiredCheck(item.id, !item.checked)}
                  style={[
                    styles.checkBox,
                    item.checked && {
                      backgroundColor: accent.main,
                      borderColor: accent.main,
                    },
                  ]}
                >
                  {item.checked ? (
                    <MaterialCommunityIcons
                      color="#fff"
                      name="check"
                      size={13}
                    />
                  ) : null}
                </Pressable>
                {editing ? (
                  <TextInput
                    multiline
                    onChangeText={(value) =>
                      onUpdateText({
                        requiredChecklist: [
                          language === "ko"
                            ? { id: item.id, labelKo: value }
                            : { id: item.id, label: value },
                        ],
                      })
                    }
                    placeholder={
                      language === "ko"
                        ? "체크 항목 입력"
                        : "Add checklist item"
                    }
                    placeholderTextColor="#94a3b8"
                    style={styles.inlineEditInput}
                    value={language === "ko" ? item.labelKo : item.label}
                  />
                ) : (
                  <Text style={styles.checkLabel}>
                    {language === "ko" ? item.labelKo : item.label}
                  </Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              accessibilityRole="button"
              onPress={onTake}
              style={styles.secondaryActionButton}
            >
              <MaterialCommunityIcons color="#27358f" name="plus" size={17} />
              <Text numberOfLines={1} style={styles.secondaryActionText}>
                {language === "ko" ? "My Take" : "My Take"}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onTake}
              style={styles.secondaryActionButton}
            >
              <MaterialCommunityIcons
                color="#111827"
                name="calendar-check-outline"
                size={15}
              />
              <Text numberOfLines={1} style={styles.takeActionText}>
                Takes ({cut.takes.length})
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onShoot}
              style={styles.primaryActionPressable}
            >
              <LinearGradient
                colors={brandActionGradient}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
                style={styles.shootButton}
              >
                <MaterialCommunityIcons
                  color="#fff"
                  name="video-outline"
                  size={17}
                />
                <Text numberOfLines={1} style={styles.shootButtonText}>
                  {language === "ko" ? "촬영" : "Shoot"}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function CutThumbnail({
  expanded,
  onPress,
  thumbnailUrl,
}: {
  expanded: boolean;
  onPress: () => void;
  thumbnailUrl?: string;
}) {
  const size = expanded
    ? shootBoardSceneCardLayout.expandedThumbnail
    : shootBoardSceneCardLayout.collapsedThumbnail;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.thumbnail, size]}
    >
      {thumbnailUrl ? (
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={{ uri: thumbnailUrl }}
          style={styles.thumbnailImage}
        />
      ) : (
        <View style={styles.emptyThumbnail} />
      )}
      <View style={styles.thumbnailShade} />
      <View style={styles.thumbnailPlay}>
        <MaterialCommunityIcons color="#8b5cf6" name="play" size={18} />
      </View>
    </Pressable>
  );
}

function DetailInput({
  editing,
  onChangeText,
  placeholder,
  title,
  value,
}: {
  editing: boolean;
  onChangeText: (value: string) => void;
  placeholder: string;
  title: string;
  value: string;
}) {
  return (
    <View className="gap-1.5">
      <Text className="text-[12px] font-black text-ink">{title}</Text>
      {editing ? (
        <TextInput
          multiline
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          style={styles.detailEditInput}
          value={value}
        />
      ) : (
        <Text className="text-[13px] font-semibold leading-5 text-ink">
          {value}
        </Text>
      )}
    </View>
  );
}

function isBlankEditableCut(cut: ShootBoardCut) {
  return (
    cut.role === "custom" &&
    !cut.roleLabel &&
    !cut.instruction &&
    !cut.instructionKo &&
    !cut.speakingLine &&
    !cut.speakingLineKo &&
    !cut.shootingGuideline &&
    !cut.shootingGuidelineKo
  );
}

function formatCutDuration(language: AppLanguage, durationSeconds: number) {
  return language === "ko" ? `${durationSeconds}초` : `${durationSeconds}s`;
}

function getLineToSay(language: AppLanguage, cut: ShootBoardCut) {
  if (language === "ko") {
    return cut.speakingLineKo ?? cut.prompterLine ?? cut.speakingLine;
  }

  return cut.speakingLine;
}

function getTakeStatusBorderColor(status: ShootBoardCut["takeStatus"]) {
  if (status === "final") return "#8b5cf6";
  if (status === "saved") return "#c4b5fd";
  if (status === "needs_reshoot") return "#fb7185";
  return "#e2e8f0";
}

function getRoleAccent(role: ShootBoardCut["role"]) {
  if (role === "proof") return { main: "#f97316" };
  if (role === "cta") return { main: "#8b5cf6" };
  if (role === "scene") return { main: "#6366f1" };
  if (role === "custom") return { main: "#64748b" };
  return { main: "#ff4f73" };
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },
  card: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  checkBox: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 5,
    borderWidth: 1.3,
    height: 18,
    justifyContent: "center",
    width: 18,
  },
  checkLabel: {
    color: "#111827",
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 20,
    minWidth: 0,
  },
  checkRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  checklist: {
    gap: 10,
  },
  completionCircle: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#64748b",
    borderRadius: 999,
    borderWidth: 1.5,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  completionCircleCollapsed: {
    marginTop: 29,
  },
  completionCircleExpanded: {
    marginTop: 50,
  },
  detailTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 2,
  },
  dragHandle: {
    alignItems: "center",
    justifyContent: "center",
    width: 18,
  },
  dragHandleCollapsed: {
    marginTop: 28,
  },
  dragHandleExpanded: {
    marginTop: 49,
  },
  durationText: {
    color: "#64748b",
    flexShrink: 0,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0,
  },
  emptyThumbnail: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#eef2f7",
  },
  expandButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    width: 28,
  },
  expandButtonCollapsed: {
    marginTop: 25,
  },
  expandButtonExpanded: {
    marginTop: 46,
  },
  expandedBody: {
    borderTopColor: "#e2e8f0",
    borderTopWidth: 1,
    gap: 18,
    marginLeft: 116,
    marginTop: 14,
    paddingTop: 17,
  },
  detailEditInput: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    color: "#111827",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
    minHeight: 30,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  finalCard: {
    borderBottomColor: "#8b5cf6",
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
  },
  inlineEditInput: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    color: "#111827",
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
    minHeight: 26,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  instructionText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 22,
    marginTop: 8,
  },
  partialDash: {
    borderRadius: 999,
    height: 3,
    width: 12,
  },
  primaryActionPressable: {
    borderRadius: 8,
    flex: 1.08,
    overflow: "hidden",
  },
  secondaryActionButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#dbe3ee",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 10,
  },
  secondaryActionText: {
    color: "#27358f",
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
  },
  shootButton: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 12,
  },
  shootButtonText: {
    color: "#ffffff",
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  takeActionText: {
    color: "#111827",
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
  },
  thumbnail: {
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbnailImage: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
  },
  thumbnailPlay: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 999,
    height: 38,
    justifyContent: "center",
    left: "50%",
    marginLeft: -19,
    marginTop: -19,
    position: "absolute",
    top: "50%",
    width: 38,
  },
  thumbnailShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.06)",
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  titleBlockCollapsed: {
    paddingTop: 16,
  },
  titleBlockExpanded: {
    paddingTop: 28,
  },
  titleDot: {
    color: "#64748b",
    flexShrink: 0,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    minWidth: 0,
  },
  titleText: {
    color: "#111827",
    flexShrink: 1,
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 24,
  },
});
