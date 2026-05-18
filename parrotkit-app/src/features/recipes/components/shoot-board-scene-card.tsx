import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { AppLanguage } from "@/core/i18n/app-language";
import { brandActionGradient } from "@/core/theme/colors";
import { ShootBoardMediaSlot } from "@/features/recipes/components/shoot-board-media-slot";
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
  onReset,
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
  onReset: () => void;
  onTake: () => void;
  onShoot: () => void;
  onToggleExpanded: () => void;
  onToggleRequiredCheck: (checklistItemId: string, checked: boolean) => void;
  onToggleSceneComplete: (complete: boolean) => void;
  onUpdateText: (patch: ShootBoardCutTextPatch) => void;
  reorderMode: boolean;
}) {
  const [editing, setEditing] = useState(() => isBlankEditableCut(cut));
  const completionState = getShootBoardCutCompletionState(cut);
  const accent = getRoleAccent(cut.role);
  return (
    <View
      style={[
        styles.card,
        { borderColor: getTakeStatusBorderColor(cut.takeStatus) },
        cut.takeStatus === "final" && styles.finalCard,
      ]}
    >
      <View className="flex-row items-start gap-2">
        <Pressable
          accessibilityLabel={language === "ko" ? "드래그 핸들" : "Drag handle"}
          accessibilityRole="button"
          delayLongPress={180}
          onLongPress={onDragStart}
          style={styles.dragHandle}
        >
          <MaterialCommunityIcons
            color={reorderMode ? accent.main : "#94a3b8"}
            name="drag-vertical"
            size={22}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          className="mt-0.5 h-8 w-8 items-center justify-center rounded-full"
          onPress={onToggleExpanded}
        >
          <MaterialCommunityIcons
            color="#111827"
            name={expanded ? "chevron-down" : "chevron-right"}
            size={22}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          className="min-w-0 flex-1"
          onPress={onToggleExpanded}
        >
          <View className="flex-row flex-wrap items-center gap-1.5">
            <Text className="text-[14px] font-black text-ink">
              {language === "ko" ? cut.titleKo : cut.title}
            </Text>
            <Text className="text-[13px] font-black text-muted">·</Text>
            <Text className="text-[13px] font-black text-muted">
              {formatCutDuration(language, cut.durationSeconds)}
            </Text>
          </View>
          <Text
            className="mt-1 text-[13px] font-semibold leading-5 text-ink"
            numberOfLines={expanded ? 3 : 1}
          >
            {language === "ko"
              ? (cut.instructionKo ?? cut.instruction)
              : cut.instruction}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: completionState === "complete" }}
          onPress={() => onToggleSceneComplete(completionState !== "complete")}
          style={[
            styles.completionCircle,
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
          <View className="flex-row justify-end gap-2">
            <Pressable
              accessibilityRole="button"
              className={`flex-row items-center gap-1 rounded-full border px-3 py-1.5 ${
                editing ? "border-violet bg-violet" : "border-stroke bg-white"
              }`}
              onPress={() => setEditing((current) => !current)}
            >
              <MaterialCommunityIcons
                color={editing ? "#ffffff" : "#8b5cf6"}
                name={editing ? "check" : "pencil-outline"}
                size={14}
              />
              <Text
                className={`text-[11px] font-black ${editing ? "text-white" : "text-violet"}`}
              >
                {editing ? "Done" : "Edit"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="flex-row items-center gap-1 rounded-full border border-stroke bg-white px-3 py-1.5"
              onPress={onReset}
            >
              <MaterialCommunityIcons
                color="#64748b"
                name="restore"
                size={14}
              />
              <Text className="text-[11px] font-black text-muted">
                {language === "ko" ? "원래대로" : "Reset"}
              </Text>
            </Pressable>
          </View>

          <ShotBriefRail cut={cut} language={language} />

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

          <View className="gap-2">
            <Text className="text-[12px] font-black text-ink">
              {language === "ko" ? "필수 체크" : "Required checklist"}
            </Text>
            {cut.requiredChecklist.map((item) => (
              <View className="flex-row items-center gap-2" key={item.id}>
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
                  <Text className="min-w-0 flex-1 text-[13px] font-semibold leading-5 text-ink">
                    {language === "ko" ? item.labelKo : item.label}
                  </Text>
                )}
              </View>
            ))}
          </View>

          <View className="flex-row items-end gap-2">
            <View className="flex-row gap-2">
              <ShootBoardMediaSlot
                caption={undefined}
                label="Reference"
                onPress={onPreview}
                status="saved"
                thumbnailUrl={cut.thumbnailUrl}
                timeRangeLabel={undefined}
              />
              <ShootBoardMediaSlot
                caption={undefined}
                label="My Take"
                onPress={onTake}
                status={getTakeSlotStatus(cut)}
                thumbnailUrl={
                  cut.takes.length > 0 ? cut.takeThumbnailUrl : undefined
                }
                timeRangeLabel={undefined}
              />
            </View>
            <View className="min-w-0 flex-1 flex-row gap-2">
              <Pressable
                accessibilityRole="button"
                className="flex-1 flex-row items-center justify-center gap-1.5 rounded-[12px] border border-stroke bg-white px-3 py-3"
                onPress={onTake}
              >
                <MaterialCommunityIcons
                  color="#111827"
                  name="calendar-check-outline"
                  size={15}
                />
                <Text className="text-[12px] font-black text-ink">
                  Takes ({cut.takes.length})
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                className="flex-1 overflow-hidden rounded-[12px]"
                onPress={onShoot}
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
                  <Text className="text-[13px] font-black text-white">
                    {language === "ko" ? "촬영" : "Shoot"}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function ShotBriefRail({
  cut,
  language,
}: {
  cut: ShootBoardCut;
  language: AppLanguage;
}) {
  const items = [
    {
      icon: "cellphone-screenshot" as const,
      title: language === "ko" ? "프레임" : "Frame",
      value: language === "ko" ? cut.shotFrameKo : cut.shotFrame,
    },
    {
      icon: "gesture-tap" as const,
      title: language === "ko" ? "첫 동작" : "First move",
      value: language === "ko" ? cut.firstActionKo : cut.firstAction,
    },
    {
      icon: "cube-outline" as const,
      title: language === "ko" ? "준비물" : "Setup",
      value: language === "ko" ? cut.setupCueKo : cut.setupCue,
    },
  ].filter((item) => item.value.trim().length > 0);

  if (!items.length) {
    return null;
  }

  return (
    <View style={styles.shotBrief}>
      <View className="mb-2 flex-row items-center gap-2">
        <MaterialCommunityIcons color="#8b5cf6" name="movie-open-play-outline" size={17} />
        <Text className="text-[12px] font-black text-ink">
          {language === "ko" ? "바로 찍는 브리프" : "Ready-to-shoot brief"}
        </Text>
      </View>
      <View className="gap-2">
        {items.map((item) => (
          <View className="flex-row gap-2" key={item.title}>
            <View style={styles.briefIcon}>
              <MaterialCommunityIcons color="#8b5cf6" name={item.icon} size={15} />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-[10px] font-black uppercase text-muted">
                {item.title}
              </Text>
              <Text className="mt-0.5 text-[12px] font-black leading-5 text-ink">
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
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

function getTakeSlotStatus(cut: ShootBoardCut) {
  if (cut.takeStatus === "final") return "final";
  if (cut.takeStatus === "needs_reshoot") return "needs_reshoot";
  if (cut.takes.length > 0 || cut.takeStatus === "saved") return "saved";
  return "empty";
}

function getRoleAccent(role: ShootBoardCut["role"]) {
  if (role === "proof") return { main: "#f97316" };
  if (role === "cta") return { main: "#8b5cf6" };
  if (role === "scene") return { main: "#6366f1" };
  if (role === "custom") return { main: "#64748b" };
  return { main: "#ff4f73" };
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.035,
    shadowRadius: 14,
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
  briefIcon: {
    alignItems: "center",
    backgroundColor: "#f3f0ff",
    borderRadius: 999,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  completionCircle: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#94a3b8",
    borderRadius: 999,
    borderWidth: 1.5,
    height: 26,
    justifyContent: "center",
    marginTop: 4,
    width: 26,
  },
  dragHandle: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -5,
    marginTop: 3,
    width: 17,
  },
  expandedBody: {
    gap: 14,
    marginLeft: 41,
    marginTop: 12,
    paddingTop: 13,
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
    shadowOpacity: 0.08,
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
  partialDash: {
    borderRadius: 999,
    height: 3,
    width: 12,
  },
  shootButton: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 10,
  },
  shotBrief: {
    backgroundColor: "#fbf8ff",
    borderColor: "#eadfff",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
