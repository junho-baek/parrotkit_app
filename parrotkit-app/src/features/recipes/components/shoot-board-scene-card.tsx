import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import type { AppLanguage } from "@/core/i18n/app-language";
import { brandActionGradient } from "@/core/theme/colors";
import { getCutCardActionStatus } from "@/features/recipes/lib/cut-card-action-status";
import { getCutCardBodyPreviewRows } from "@/features/recipes/lib/cut-card-body-preview";
import { getCutCardHeaderParts } from "@/features/recipes/lib/cut-card-header";
import { getCutCardReferenceViewerSection } from "@/features/recipes/lib/cut-card-reference-viewer-section";
import { getCutCardTakeViewerSection } from "@/features/recipes/lib/cut-card-take-viewer-section";
import {
  getCutCardEditorFieldDefinitions,
  getCutCardEditorFieldValue,
} from "@/features/recipes/lib/cut-card-editor-fields";
import {
  type ShootBoardCut,
  type ShootBoardCutTextPatch,
  type ShootBoardTake,
} from "@/features/recipes/lib/shoot-board-model";

export function ShootBoardSceneCard({
  cut,
  expanded,
  highlighted,
  language,
  onDragStart,
  onPreview,
  onReset,
  onSetFinalTake,
  onTake,
  onShoot,
  onToggleChecklistItem,
  onToggleExpanded,
  onUpdateText,
  reorderMode,
  takeViewerLoading = false,
}: {
  cut: ShootBoardCut;
  expanded: boolean;
  highlighted: boolean;
  language: AppLanguage;
  onDragStart: () => void;
  onPreview: () => void;
  onReset: () => void;
  onSetFinalTake: (take: ShootBoardTake) => void;
  onTake: (take?: ShootBoardTake) => void;
  onShoot: (take?: ShootBoardTake) => void;
  onToggleChecklistItem: (itemId: string, checked: boolean) => void;
  onToggleExpanded: () => void;
  onUpdateText: (patch: ShootBoardCutTextPatch) => void;
  reorderMode: boolean;
  takeViewerLoading?: boolean;
}) {
  const [editing, setEditing] = useState(() => isBlankEditableCut(cut));
  const accent = getRoleAccent(cut.role);
  const editorFields = getCutCardEditorFieldDefinitions(language);
  const headerParts = getCutCardHeaderParts(cut, language);
  const previewRows = getCutCardBodyPreviewRows(cut, language);
  const referenceViewer = getCutCardReferenceViewerSection(cut, language);
  const referenceThumbnailSource = getReferenceThumbnailSource(
    cut,
    referenceViewer,
  );
  const takeViewer = getCutCardTakeViewerSection(cut, language, {
    loading: takeViewerLoading,
  });
  const actionStatus = getCutCardActionStatus(cut, language);

  return (
    <View
      style={[
        styles.card,
        cut.takeStatus === "final" && styles.finalCard,
        highlighted && styles.highlightedCard,
      ]}
    >
      {!expanded ? (
        <View style={styles.compactRow}>
          <View style={styles.referenceAnchor}>
            {referenceThumbnailSource ? (
              <>
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="cover"
                  source={referenceThumbnailSource}
                  style={styles.referencePreviewImage}
                />
                <View style={styles.referencePreviewShade} />
              </>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={onPreview}
              style={({ pressed }) => [
                styles.referenceAnchorButton,
                pressed && styles.referencePreviewPressed,
              ]}
            >
              <View style={styles.referencePlay}>
                <MaterialCommunityIcons color="#111827" name="play" size={15} />
              </View>
            </Pressable>
          </View>

          <View style={styles.compactCopy}>
            <Pressable accessibilityRole="button" onPress={onToggleExpanded}>
              <View style={styles.compactMetaRow}>
                <Text numberOfLines={1} style={styles.compactTimeText}>
                  {formatCutTimelineLabel(language, cut)}
                </Text>
              </View>
              <View style={styles.compactTitleRow}>
                <Text numberOfLines={2} style={styles.compactTitle}>
                  {headerParts.executionTitle}
                </Text>
                <MaterialCommunityIcons
                  color="#64748b"
                  name="chevron-down"
                  size={18}
                />
              </View>
              <Text numberOfLines={2} style={styles.compactApplication}>
                {language === "ko"
                  ? (cut.instructionKo ?? cut.instruction)
                  : cut.instruction}
              </Text>
            </Pressable>

            <View style={styles.compactToolRows}>
              {previewRows.map((row) => (
                <Pressable
                  accessibilityRole="button"
                  key={row.id}
                  onPress={onToggleExpanded}
                  style={styles.compactToolRow}
                >
                  <Text numberOfLines={1} style={styles.compactToolLabel}>
                    {row.label}
                  </Text>
                  <Text numberOfLines={1} style={styles.compactToolValue}>
                    {row.value}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.compactActionRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => onShoot()}
                style={styles.compactFilmButton}
              >
                <MaterialCommunityIcons
                  color="#ffffff"
                  name="video-outline"
                  size={15}
                />
                <Text style={styles.compactFilmText}>
                  {actionStatus.ctaLabel}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => onTake()}
                style={styles.compactTakeButton}
              >
                <MaterialCommunityIcons
                  color={cut.takes.length > 0 ? "#7c3aed" : "#64748b"}
                  name={
                    cut.takes.length > 0
                      ? "check-circle"
                      : "plus-circle-outline"
                  }
                  size={15}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.compactTakeText,
                    cut.takes.length > 0 && styles.compactTakeTextSaved,
                  ]}
                >
                  {cut.takes.length > 0
                    ? `My Take ${cut.takes.length}`
                    : "My Take"}
                </Text>
              </Pressable>
              {reorderMode ? (
                <TouchableOpacity
                  activeOpacity={0.72}
                  accessibilityLabel={
                    language === "ko" ? "순서 변경" : "Reorder"
                  }
                  accessibilityRole="button"
                  delayLongPress={180}
                  onLongPress={onDragStart}
                  style={styles.dragHandle}
                >
                  <MaterialCommunityIcons
                    color={accent.main}
                    name="drag-vertical"
                    size={21}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.compactRow}>
          <View style={styles.referenceAnchor}>
            {referenceThumbnailSource ? (
              <>
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="cover"
                  source={referenceThumbnailSource}
                  style={styles.referencePreviewImage}
                />
                <View style={styles.referencePreviewShade} />
              </>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={onPreview}
              style={({ pressed }) => [
                styles.referenceAnchorButton,
                pressed && styles.referencePreviewPressed,
              ]}
            >
              <View style={styles.referencePlay}>
                <MaterialCommunityIcons color="#111827" name="play" size={15} />
              </View>
            </Pressable>
          </View>

          <View style={styles.compactCopy}>
            <Pressable accessibilityRole="button" onPress={onToggleExpanded}>
              <View style={styles.compactMetaRow}>
                <Text numberOfLines={1} style={styles.compactTimeText}>
                  {formatCutTimelineLabel(language, cut)}
                </Text>
              </View>
              <View style={styles.compactTitleRow}>
                <Text numberOfLines={2} style={styles.compactTitle}>
                  {headerParts.executionTitle}
                </Text>
                <MaterialCommunityIcons
                  color="#64748b"
                  name="chevron-up"
                  size={18}
                />
              </View>
              <Text numberOfLines={2} style={styles.compactApplication}>
                {language === "ko"
                  ? (cut.instructionKo ?? cut.instruction)
                  : cut.instruction}
              </Text>
            </Pressable>

            <View style={styles.expandedHeaderActions}>
              <Pressable
                accessibilityLabel={editing ? "Done editing" : "Edit"}
                accessibilityRole="button"
                onPress={() => setEditing((current) => !current)}
                style={[
                  styles.expandedHeaderAction,
                  editing && styles.expandedHeaderActionActive,
                ]}
              >
                <MaterialCommunityIcons
                  color={editing ? "#ffffff" : "#7c3aed"}
                  name={editing ? "check" : "pencil-outline"}
                  size={14}
                />
              </Pressable>
              <Pressable
                accessibilityLabel={language === "ko" ? "원래대로" : "Reset"}
                accessibilityRole="button"
                onPress={onReset}
                style={styles.expandedHeaderAction}
              >
                <MaterialCommunityIcons
                  color="#64748b"
                  name="restore"
                  size={14}
                />
              </Pressable>
            </View>
          </View>

          {reorderMode ? (
            <TouchableOpacity
              activeOpacity={0.72}
              accessibilityLabel={language === "ko" ? "순서 변경" : "Reorder"}
              accessibilityRole="button"
              delayLongPress={180}
              onLongPress={onDragStart}
              style={styles.dragHandle}
            >
              <MaterialCommunityIcons
                color={accent.main}
                name="drag-vertical"
                size={21}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {expanded ? (
        <View style={styles.expandedBody}>
          <View style={styles.boardPrimaryArea}>
            <View style={styles.boardCopyColumn}>
              {editorFields.map((field) => (
                <DetailInput
                  editing={editing}
                  key={field.id}
                  placeholder={field.placeholder}
                  title={getBoardFieldTitle(field.id, field.label, language)}
                  value={getCutCardEditorFieldValue(field.id, cut)}
                  onChangeText={(value) =>
                    onUpdateText(field.createPatch(value))
                  }
                />
              ))}
            </View>
          </View>

          <View style={styles.checklistRail}>
            <View style={styles.checklistHeader}>
              <Text style={styles.checklistTitle}>
                {language === "ko" ? "체크리스트" : "Checklist"}
              </Text>
              <Text style={styles.checklistCount}>
                {getChecklistProgressLabel(cut, language)}
              </Text>
            </View>
            <View style={styles.checklistItems}>
              {cut.requiredChecklist.map((item) => (
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.checked }}
                  key={item.id}
                  onPress={() => onToggleChecklistItem(item.id, !item.checked)}
                  style={styles.checklistItem}
                >
                  <View
                    style={[
                      styles.checklistDot,
                      item.checked && {
                        backgroundColor: accent.main,
                        borderColor: accent.main,
                      },
                    ]}
                  >
                    {item.checked ? (
                      <MaterialCommunityIcons
                        color="#ffffff"
                        name="check"
                        size={12}
                      />
                    ) : null}
                  </View>
                  <Text style={styles.checklistText}>
                    {language === "ko" ? item.labelKo : item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.savedTakesArea}>
            <View style={styles.takeViewerHeader}>
              <View className="min-w-0 flex-1">
                <Text style={styles.takeViewerTitle}>
                  {language === "ko" ? "저장된 테이크" : "Saved takes"}
                </Text>
                {takeViewer.statusLabel ? (
                  <Text numberOfLines={1} style={styles.takeViewerStatus}>
                    {takeViewer.statusLabel}
                  </Text>
                ) : null}
              </View>
              {takeViewer.takeCountLabel ? (
                <View
                  style={[
                    styles.takeViewerStatePill,
                    getTakeViewerPillStyle(takeViewer.state, cut.takeStatus),
                  ]}
                >
                  <MaterialCommunityIcons
                    color={getTakeViewerIconColor(
                      takeViewer.state,
                      cut.takeStatus,
                    )}
                    name={getTakeViewerIcon(takeViewer.state, cut.takeStatus)}
                    size={13}
                  />
                  <Text
                    style={[
                      styles.takeViewerStateText,
                      {
                        color: getTakeViewerIconColor(
                          takeViewer.state,
                          cut.takeStatus,
                        ),
                      },
                    ]}
                  >
                    {takeViewer.takeCountLabel}
                  </Text>
                </View>
              ) : null}
            </View>

            <Pressable
              accessibilityHint={
                language === "ko"
                  ? takeViewer.state === "empty"
                    ? "이 컷 촬영을 시작합니다."
                    : "저장된 테이크 리뷰 화면을 엽니다."
                  : takeViewer.state === "empty"
                    ? "Starts filming this cut."
                    : "Opens the saved take review viewer."
              }
              accessibilityLabel={
                language === "ko" ? "저장된 테이크" : "Saved takes"
              }
              accessibilityRole="button"
              accessibilityState={{
                disabled: takeViewer.state === "loading",
              }}
              disabled={takeViewer.state === "loading"}
              onPress={
                takeViewer.state === "empty" ? () => onShoot() : () => onTake()
              }
              style={({ pressed }) => [
                styles.takeViewerPreview,
                takeViewer.state === "empty" && styles.takeViewerPreviewEmpty,
                takeViewer.state === "loading" &&
                  styles.takeViewerPreviewLoading,
                pressed && styles.referencePreviewPressed,
              ]}
            >
              {takeViewer.thumbnailUrl ? (
                <>
                  <Image
                    accessibilityIgnoresInvertColors
                    resizeMode="cover"
                    source={{ uri: takeViewer.thumbnailUrl }}
                    style={styles.referencePreviewImage}
                  />
                  <View style={styles.referencePreviewShade} />
                </>
              ) : null}
              <View
                style={[
                  styles.takeViewerPreviewIcon,
                  takeViewer.state !== "populated" &&
                    styles.takeViewerPreviewIconEmpty,
                ]}
              >
                <MaterialCommunityIcons
                  color={
                    takeViewer.state === "populated" ? "#ffffff" : "#64748b"
                  }
                  name={getTakeViewerPreviewIcon(takeViewer.state)}
                  size={23}
                />
              </View>
              {takeViewer.activeTake ? (
                <View style={styles.takeViewerActivePill}>
                  <Text style={styles.takeViewerActiveText} numberOfLines={1}>
                    {takeViewer.activeTake.label} ·{" "}
                    {formatCutDuration(
                      language,
                      takeViewer.activeTake.durationSeconds,
                    )}
                  </Text>
                </View>
              ) : null}
            </Pressable>

            {takeViewer.takeItems.length > 0 ? (
              <View style={styles.takeViewerItemList}>
                {takeViewer.takeItems.map((item) => (
                  <Pressable
                    accessibilityHint={
                      language === "ko"
                        ? "저장된 테이크 리뷰 화면을 엽니다."
                        : "Opens the saved take review viewer."
                    }
                    accessibilityLabel={`${item.title}, ${item.metadataLabel}`}
                    accessibilityRole="button"
                    key={item.id}
                    onPress={() => onTake(item.take)}
                    style={({ pressed }) => [
                      styles.takeViewerItem,
                      item.selected && styles.takeViewerItemSelected,
                      pressed && styles.referencePreviewPressed,
                    ]}
                  >
                    <View style={styles.takeViewerItemPreview}>
                      {takeViewer.thumbnailUrl ? (
                        <>
                          <Image
                            accessibilityIgnoresInvertColors
                            resizeMode="cover"
                            source={{ uri: takeViewer.thumbnailUrl }}
                            style={styles.referencePreviewImage}
                          />
                          <View style={styles.referencePreviewShade} />
                        </>
                      ) : null}
                      <View style={styles.takeViewerItemPlay}>
                        <MaterialCommunityIcons
                          color="#ffffff"
                          name="play"
                          size={14}
                        />
                      </View>
                    </View>

                    <View className="min-w-0 flex-1">
                      <View style={styles.takeViewerItemTitleRow}>
                        <Text
                          numberOfLines={1}
                          style={styles.takeViewerItemTitle}
                        >
                          {item.title}
                        </Text>
                        {item.selected ? (
                          <MaterialCommunityIcons
                            color="#7c3aed"
                            name="check-circle"
                            size={15}
                          />
                        ) : null}
                      </View>
                      <Text numberOfLines={1} style={styles.takeViewerItemMeta}>
                        {item.metadataLabel}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={styles.takeViewerItemPlayback}
                      >
                        {item.playbackLabel}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.takeViewerItemStatus,
                        item.final && styles.takeViewerItemStatusFinal,
                      ]}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.takeViewerItemStatusText,
                          item.final && styles.takeViewerItemStatusFinalText,
                        ]}
                      >
                        {item.statusLabel}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <View style={styles.takeViewerFooter}>
              <View className="min-w-0 flex-1">
                {takeViewer.activeTake ? (
                  <Text numberOfLines={1} style={styles.takeViewerMeta}>
                    {takeViewer.activeTake.recordedAtLabel}
                  </Text>
                ) : null}
              </View>
              <Pressable
                accessibilityRole="button"
                disabled={takeViewer.state === "loading"}
                onPress={
                  takeViewer.state === "empty"
                    ? () => onShoot()
                    : () => onTake()
                }
                style={[
                  styles.takeViewerButton,
                  takeViewer.state === "loading" &&
                    styles.takeViewerButtonDisabled,
                ]}
              >
                <MaterialCommunityIcons
                  color={takeViewer.state === "loading" ? "#94a3b8" : "#7c3aed"}
                  name={
                    takeViewer.state === "empty"
                      ? "video-outline"
                      : "calendar-check-outline"
                  }
                  size={14}
                />
                <Text
                  style={[
                    styles.takeViewerButtonText,
                    takeViewer.state === "loading" &&
                      styles.takeViewerButtonTextDisabled,
                  ]}
                >
                  {takeViewer.primaryActionLabel}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.expandedActionArea}>
            <View className="min-w-0 flex-1 gap-2">
              <Pressable
                accessibilityRole="button"
                className="flex-row items-center justify-center gap-1.5 rounded-[12px] border border-stroke bg-white px-3 py-3"
                onPress={() => onTake()}
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
              {takeViewer.actionControls.retake.visible ||
              takeViewer.actionControls.setFinal.visible ? (
                <View style={styles.expandedTakeActionRow}>
                  {takeViewer.actionControls.retake.visible ? (
                    <Pressable
                      accessibilityRole="button"
                      className="flex-1 overflow-hidden rounded-[12px]"
                      disabled={takeViewer.actionControls.retake.disabled}
                      onPress={() => onShoot(takeViewer.activeTake)}
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
                          {takeViewer.actionControls.retake.label}
                        </Text>
                      </LinearGradient>
                    </Pressable>
                  ) : null}
                  {takeViewer.actionControls.setFinal.visible ? (
                    <Pressable
                      accessibilityRole="button"
                      disabled={takeViewer.actionControls.setFinal.disabled}
                      onPress={() => {
                        if (takeViewer.activeTake) {
                          onSetFinalTake(takeViewer.activeTake);
                        }
                      }}
                      style={[
                        styles.setFinalButton,
                        takeViewer.actionControls.setFinal.disabled &&
                          styles.setFinalButtonDisabled,
                      ]}
                    >
                      <MaterialCommunityIcons
                        color={
                          takeViewer.actionControls.setFinal.disabled
                            ? "#94a3b8"
                            : "#7c3aed"
                        }
                        name="star-outline"
                        size={16}
                      />
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.setFinalButtonText,
                          takeViewer.actionControls.setFinal.disabled &&
                            styles.setFinalButtonTextDisabled,
                        ]}
                      >
                        {takeViewer.actionControls.setFinal.label}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  className="overflow-hidden rounded-[12px]"
                  onPress={() => onShoot()}
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
                      {language === "ko" ? "촬영" : "Film"}
                    </Text>
                  </LinearGradient>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      ) : null}
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
    <View style={editing ? styles.detailEditRow : styles.detailReadRow}>
      <Text style={styles.detailTitle}>{title}</Text>
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
        <Text style={styles.detailReadValue}>{value}</Text>
      )}
    </View>
  );
}

function getBoardFieldTitle(
  fieldId: string,
  fallbackLabel: string,
  language: AppLanguage,
) {
  if (fieldId === "lineToSay") {
    return language === "ko" ? "말할 문장" : "Line to say";
  }

  if (fieldId === "shotAction") {
    return language === "ko" ? "촬영 가이드" : "Shot guide";
  }

  if (fieldId === "hook") {
    return language === "ko" ? "내 경우 적용" : "Apply to your case";
  }

  return fallbackLabel;
}

function getChecklistProgressLabel(cut: ShootBoardCut, language: AppLanguage) {
  const checkedCount = cut.requiredChecklist.filter(
    (item) => item.checked,
  ).length;

  return language === "ko"
    ? `${checkedCount}/${cut.requiredChecklist.length} 완료`
    : `${checkedCount}/${cut.requiredChecklist.length} done`;
}

function getReferenceThumbnailSource(
  cut: ShootBoardCut,
  referenceViewer: ReturnType<typeof getCutCardReferenceViewerSection>,
): ImageSourcePropType | undefined {
  if (cut.thumbnailSource) {
    return cut.thumbnailSource as ImageSourcePropType;
  }

  if (referenceViewer.thumbnailUrl) {
    return { uri: referenceViewer.thumbnailUrl };
  }

  return undefined;
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

function formatCutTimelineLabel(language: AppLanguage, cut: ShootBoardCut) {
  const durationLabel =
    language === "ko"
      ? `예상 ${formatCutDuration(language, cut.durationSeconds)}`
      : formatCutDuration(language, cut.durationSeconds);

  return `${cut.timeRangeLabel} · ${durationLabel}`;
}

function getRoleAccent(role: ShootBoardCut["role"]) {
  if (role === "proof") return { main: "#f97316" };
  if (role === "cta") return { main: "#8b5cf6" };
  if (role === "scene") return { main: "#6366f1" };
  if (role === "custom") return { main: "#64748b" };
  return { main: "#ff4f73" };
}

function getTakeViewerIcon(
  state: ReturnType<typeof getCutCardTakeViewerSection>["state"],
  status: ShootBoardCut["takeStatus"],
) {
  if (state === "loading") return "progress-clock" as const;
  if (status === "final") return "star" as const;
  if (status === "needs_reshoot") return "alert-circle-outline" as const;
  if (state === "populated") return "check-circle-outline" as const;
  return "circle-outline" as const;
}

function getTakeViewerPreviewIcon(
  state: ReturnType<typeof getCutCardTakeViewerSection>["state"],
) {
  if (state === "loading") return "progress-clock" as const;
  if (state === "populated") return "play" as const;
  return "video-plus-outline" as const;
}

function getTakeViewerIconColor(
  state: ReturnType<typeof getCutCardTakeViewerSection>["state"],
  status: ShootBoardCut["takeStatus"],
) {
  if (state === "loading") return "#64748b";
  if (status === "final") return "#7c3aed";
  if (status === "needs_reshoot") return "#be123c";
  if (state === "populated") return "#4338ca";
  return "#64748b";
}

function getTakeViewerPillStyle(
  state: ReturnType<typeof getCutCardTakeViewerSection>["state"],
  status: ShootBoardCut["takeStatus"],
) {
  if (state === "loading") {
    return { backgroundColor: "#f8fafc", borderColor: "#e2e8f0" };
  }

  if (status === "final") {
    return { backgroundColor: "#f5f3ff", borderColor: "#ddd6fe" };
  }

  if (status === "needs_reshoot") {
    return { backgroundColor: "#fff1f2", borderColor: "#fecdd3" };
  }

  if (state === "populated") {
    return { backgroundColor: "#eef2ff", borderColor: "#c7d2fe" };
  }

  return { backgroundColor: "#f8fafc", borderColor: "#e2e8f0" };
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderBottomColor: "#e2e8f0",
    borderBottomWidth: 1,
    borderLeftColor: "transparent",
    borderLeftWidth: 3,
    borderRadius: 0,
    paddingHorizontal: 4,
    paddingVertical: 14,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  compactActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  compactApplication: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 18,
    marginTop: 3,
  },
  compactCopy: {
    flex: 1,
    gap: 9,
    minWidth: 0,
  },
  compactFilmButton: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 12,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 38,
    paddingHorizontal: 14,
  },
  compactFilmText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  compactMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    marginBottom: 4,
    minHeight: 22,
  },
  compactRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 14,
  },
  compactTakeButton: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 38,
    minWidth: 104,
    paddingHorizontal: 10,
  },
  compactTakeText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
  },
  compactTakeTextSaved: {
    color: "#7c3aed",
  },
  compactTimeText: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
  },
  compactTitle: {
    color: "#111827",
    flex: 1,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 22,
  },
  compactTitleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
  },
  compactToolLabel: {
    color: "#64748b",
    flexShrink: 0,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 16,
    width: 72,
  },
  compactToolRow: {
    flexDirection: "row",
    gap: 8,
    minHeight: 20,
  },
  compactToolRows: {
    gap: 5,
  },
  compactToolValue: {
    color: "#111827",
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 16,
  },
  referenceAnchor: {
    alignItems: "center",
    aspectRatio: 9 / 16,
    backgroundColor: "#111827",
    borderColor: "rgba(15,23,42,0.12)",
    borderWidth: 1,
    borderRadius: 13,
    flexShrink: 0,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: 94,
  },
  referenceAnchorButton: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  checklistCount: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
  },
  checklistDot: {
    alignItems: "center",
    borderColor: "#cbd5e1",
    borderRadius: 999,
    borderWidth: 1.5,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  checklistHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checklistItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 26,
  },
  checklistItems: {
    gap: 7,
  },
  checklistRail: {
    gap: 9,
  },
  checklistText: {
    color: "#111827",
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 17,
  },
  checklistTitle: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
  },
  dragHandle: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderRadius: 999,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    marginTop: 2,
    width: 28,
  },
  expandedBody: {
    gap: 10,
    marginTop: 10,
  },
  expandedActionArea: {
    flexDirection: "row",
  },
  expandedHeaderAction: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 999,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  expandedHeaderActionActive: {
    backgroundColor: "#8c67ff",
    borderColor: "#8c67ff",
  },
  expandedHeaderActions: {
    flexDirection: "row",
    gap: 6,
  },
  expandedTakeActionRow: {
    flexDirection: "row",
    gap: 8,
  },
  detailEditRow: {
    gap: 6,
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
  detailReadRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    minHeight: 28,
  },
  detailReadValue: {
    color: "#111827",
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 19,
  },
  detailTitle: {
    color: "#111827",
    flexShrink: 0,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 18,
    width: 96,
  },
  boardCopyColumn: {
    flex: 1,
    flexBasis: 210,
    gap: 9,
    minWidth: 0,
  },
  boardPrimaryArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  finalCard: {
    backgroundColor: "#ffffff",
  },
  highlightedCard: {
    backgroundColor: "#fffaf7",
    borderBottomColor: "#ffd7c7",
    borderLeftColor: "#ff9568",
  },
  referencePreviewImage: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
  },
  referencePreviewPressed: {
    opacity: 0.82,
  },
  referencePreviewShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.18)",
  },
  referencePlay: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 999,
    height: 26,
    justifyContent: "center",
    width: 26,
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
  setFinalButton: {
    alignItems: "center",
    backgroundColor: "#f5f3ff",
    borderColor: "#c4b5fd",
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 9,
  },
  setFinalButtonDisabled: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
  },
  setFinalButtonText: {
    color: "#7c3aed",
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
  },
  setFinalButtonTextDisabled: {
    color: "#94a3b8",
  },
  savedTakesArea: {
    gap: 10,
  },
  takeViewerActivePill: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 999,
    bottom: 8,
    left: 8,
    maxWidth: "82%",
    paddingHorizontal: 9,
    paddingVertical: 5,
    position: "absolute",
  },
  takeViewerActiveText: {
    color: "#111827",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0,
  },
  takeViewerButton: {
    alignItems: "center",
    backgroundColor: "#f5f3ff",
    borderRadius: 10,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  takeViewerButtonDisabled: {
    backgroundColor: "#f1f5f9",
  },
  takeViewerButtonText: {
    color: "#7c3aed",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
  },
  takeViewerButtonTextDisabled: {
    color: "#94a3b8",
  },
  takeViewerFooter: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  takeViewerItem: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    minHeight: 68,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  takeViewerItemList: {
    gap: 8,
  },
  takeViewerItemMeta: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 2,
  },
  takeViewerItemPlayback: {
    color: "#7c3aed",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: 3,
  },
  takeViewerItemPlay: {
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.72)",
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 999,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  takeViewerItemPreview: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 10,
    height: 52,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: 42,
  },
  takeViewerItemSelected: {
    backgroundColor: "#f5f3ff",
    borderColor: "#c4b5fd",
  },
  takeViewerItemStatus: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: 76,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  takeViewerItemStatusFinal: {
    backgroundColor: "#ede9fe",
    borderColor: "#c4b5fd",
  },
  takeViewerItemStatusFinalText: {
    color: "#6d28d9",
  },
  takeViewerItemStatusText: {
    color: "#475569",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0,
  },
  takeViewerItemTitle: {
    color: "#111827",
    flex: 1,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
  },
  takeViewerItemTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  takeViewerHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  takeViewerMeta: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 3,
  },
  takeViewerPreview: {
    alignItems: "center",
    aspectRatio: 9 / 16,
    backgroundColor: "#111827",
    borderRadius: 12,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: 112,
  },
  takeViewerPreviewEmpty: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    borderWidth: 1,
  },
  takeViewerPreviewIcon: {
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.62)",
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  takeViewerPreviewIconEmpty: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 1,
  },
  takeViewerPreviewLoading: {
    backgroundColor: "#f1f5f9",
  },
  takeViewerStatePill: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  takeViewerStateText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0,
  },
  takeViewerStatus: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 2,
  },
  takeViewerTitle: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
});
