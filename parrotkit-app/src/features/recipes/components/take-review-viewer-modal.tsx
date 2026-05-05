import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AppLanguage } from "@/core/i18n/app-language";
import { brandActionGradient } from "@/core/theme/colors";
import type {
  ShootBoardCut,
  ShootBoardTake,
} from "@/features/recipes/lib/shoot-board-model";

export type TakeReviewViewerModalProps = {
  cut: ShootBoardCut;
  cuts: ShootBoardCut[];
  language: AppLanguage;
  onClose: () => void;
  onDelete?: (take: ShootBoardTake, cut: ShootBoardCut) => void;
  onRetake: (cut: ShootBoardCut) => void;
  onSelectCut?: (cut: ShootBoardCut) => void;
  onSelectFinal: (take: ShootBoardTake, cut: ShootBoardCut) => void;
  onSelectTake: (take: ShootBoardTake, cut: ShootBoardCut) => void;
  selectedTakeId?: string;
  visible: boolean;
};

export function TakeReviewViewerModal({
  cut,
  cuts,
  language,
  onClose,
  onDelete,
  onRetake,
  onSelectCut,
  onSelectFinal,
  onSelectTake,
  selectedTakeId,
  visible,
}: TakeReviewViewerModalProps) {
  const copy = takeCopy[language];
  const insets = useSafeAreaInsets();
  const initialTakeId = selectedTakeId ?? cut.finalTakeId ?? cut.takes[0]?.id;
  const [activeTakeId, setActiveTakeId] = useState<string | undefined>(
    initialTakeId,
  );

  useEffect(() => {
    setActiveTakeId(initialTakeId);
  }, [initialTakeId]);

  const activeTake = useMemo(
    () => cut.takes.find((take) => take.id === activeTakeId) ?? cut.takes[0],
    [activeTakeId, cut.takes],
  );
  const statusCopy = getStatusCopy(language, activeTake, cut.finalTakeId);

  function handleSelectTake(take: ShootBoardTake) {
    setActiveTakeId(take.id);
    onSelectTake(take, cut);
  }

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
      visible={visible}
    >
      <View style={styles.root}>
        <View
          style={[
            styles.header,
            { paddingTop: Math.max(insets.top + 12, 66) },
          ]}
        >
          <Pressable
            accessibilityLabel={copy.close}
            accessibilityRole="button"
            hitSlop={20}
            onPress={onClose}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons
              color="#ffffff"
              name="chevron-left"
              size={28}
            />
          </Pressable>

          <View style={styles.headerTitleWrap}>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {formatSceneTitle(language, cut)}
            </Text>
            <View style={styles.headerMeta}>
              <View
                style={[
                  styles.statusPill,
                  { borderColor: statusCopy.borderColor },
                ]}
              >
                <Text style={styles.statusPillText}>{statusCopy.label}</Text>
              </View>
              <Text numberOfLines={1} style={styles.headerTime}>
                {cut.timeRangeLabel}
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityLabel={copy.retake}
            accessibilityRole="button"
            hitSlop={20}
            onPress={() => onRetake(cut)}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons
              color="#f8fafc"
              name="camera-retake-outline"
              size={23}
            />
          </Pressable>
        </View>

        <View style={styles.main}>
          <View style={styles.previewFrame}>
            {(cut.takeThumbnailUrl ?? cut.thumbnailUrl) ? (
              <Image
                source={{ uri: cut.takeThumbnailUrl ?? cut.thumbnailUrl }}
                style={styles.previewImage}
              />
            ) : (
              <View style={styles.emptyPreview}>
                <MaterialCommunityIcons
                  color="rgba(255,255,255,0.48)"
                  name="video-outline"
                  size={42}
                />
              </View>
            )}
            <View style={styles.previewShade} />
            <View style={styles.playButton}>
              <MaterialCommunityIcons color="#ffffff" name="play" size={28} />
            </View>
            <View style={styles.takePanel}>
              <View style={styles.takePanelTop}>
                <Text numberOfLines={1} style={styles.takeLabel}>
                  {activeTake?.label ?? copy.noTake}
                </Text>
                {activeTake ? (
                  <Text numberOfLines={1} style={styles.takeDuration}>
                    {formatDuration(language, activeTake.durationSeconds)}
                  </Text>
                ) : null}
              </View>
              <Text numberOfLines={1} style={styles.takeMeta}>
                {activeTake?.recordedAtLabel ?? copy.noTakeMeta}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.carousel}
            showsHorizontalScrollIndicator={false}
          >
            {cut.takes.map((take) => (
              <TakeThumb
                active={take.id === activeTake?.id}
                final={take.id === cut.finalTakeId || take.status === "final"}
                key={take.id}
                language={language}
                onPress={() => handleSelectTake(take)}
                take={take}
                thumbnailUrl={cut.takeThumbnailUrl ?? cut.thumbnailUrl}
              />
            ))}
            <Pressable
              accessibilityRole="button"
              onPress={() => onRetake(cut)}
              style={({ pressed }) => [
                styles.retakeThumb,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                color="rgba(255,255,255,0.78)"
                name="plus"
                size={22}
              />
              <Text style={styles.retakeThumbText}>{copy.retake}</Text>
            </Pressable>
          </ScrollView>

          {cuts.length > 1 ? (
            <ScrollView
              horizontal
              contentContainerStyle={styles.sceneRail}
              showsHorizontalScrollIndicator={false}
            >
              {cuts.map((item) => (
                <Pressable
                  accessibilityRole="button"
                  key={item.id}
                  onPress={() => onSelectCut?.(item)}
                  style={[
                    styles.sceneChip,
                    item.id === cut.id && styles.activeSceneChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.sceneChipText,
                      item.id === cut.id && styles.activeSceneChipText,
                    ]}
                    numberOfLines={1}
                  >
                    #{item.order}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={!activeTake || !onDelete}
              onPress={() => activeTake && onDelete?.(activeTake, cut)}
              style={({ pressed }) => [
                styles.secondaryButton,
                (!activeTake || !onDelete) && styles.disabledButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                color="#ffffff"
                name="trash-can-outline"
                size={18}
              />
              <Text numberOfLines={1} style={styles.secondaryButtonLabel}>
                {copy.delete}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => onRetake(cut)}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                color="#ffffff"
                name="camera-retake-outline"
                size={18}
              />
              <Text numberOfLines={1} style={styles.secondaryButtonLabel}>
                {copy.retake}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={!activeTake}
              onPress={() => activeTake && onSelectFinal(activeTake, cut)}
              style={({ pressed }) => [
                styles.primaryButtonWrap,
                !activeTake && styles.disabledButton,
                pressed && styles.pressed,
              ]}
            >
              <LinearGradient
                colors={brandActionGradient}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
                style={styles.primaryButton}
              >
                <MaterialCommunityIcons color="#ffffff" name="star" size={18} />
                <Text numberOfLines={1} style={styles.primaryButtonLabel}>
                  {copy.selectFinal}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function TakeThumb({
  active,
  final,
  language,
  onPress,
  take,
  thumbnailUrl,
}: {
  active: boolean;
  final: boolean;
  language: AppLanguage;
  onPress: () => void;
  take: ShootBoardTake;
  thumbnailUrl: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.takeThumb,
        active && styles.activeTakeThumb,
        final && styles.finalTakeThumb,
        pressed && styles.pressed,
      ]}
    >
      {thumbnailUrl ? (
        <Image source={{ uri: thumbnailUrl }} style={styles.takeThumbImage} />
      ) : null}
      <View style={styles.takeThumbShade} />
      {final ? (
        <View style={styles.finalBadge}>
          <MaterialCommunityIcons color="#ffffff" name="star" size={11} />
        </View>
      ) : null}
      <Text numberOfLines={1} style={styles.takeThumbLabel}>
        {take.label}
      </Text>
      <Text numberOfLines={1} style={styles.takeThumbMeta}>
        {formatDuration(language, take.durationSeconds)}
      </Text>
    </Pressable>
  );
}

function formatSceneTitle(language: AppLanguage, cut: ShootBoardCut) {
  const role = cut.roleLabel || (language === "ko" ? cut.titleKo : cut.title);
  return language === "ko"
    ? `Scene #${cut.order}: ${role}`
    : `Scene #${cut.order}: ${role}`;
}

function formatDuration(language: AppLanguage, durationSeconds: number) {
  return language === "ko" ? `${durationSeconds}초` : `${durationSeconds}s`;
}

function getStatusCopy(
  language: AppLanguage,
  take?: ShootBoardTake,
  finalTakeId?: string,
) {
  if (!take) {
    return {
      borderColor: "rgba(255, 255, 255, 0.18)",
      label: language === "ko" ? "Take 없음" : "No take",
    };
  }

  const final = take.id === finalTakeId || take.status === "final";
  if (final) {
    return {
      borderColor: "#c4b5fd",
      label:
        language === "ko"
          ? `${take.label} · Final 선택됨`
          : `${take.label} · Final selected`,
    };
  }

  if (take.status === "needs_reshoot") {
    return {
      borderColor: "#fb7185",
      label:
        language === "ko"
          ? `${take.label} · 재촬영 필요`
          : `${take.label} · Needs reshoot`,
    };
  }

  return {
    borderColor: "rgba(255, 255, 255, 0.22)",
    label:
      language === "ko" ? `${take.label} · 저장됨` : `${take.label} · Saved`,
  };
}

const takeCopy: Record<
  AppLanguage,
  {
    close: string;
    delete: string;
    noTake: string;
    noTakeMeta: string;
    retake: string;
    selectFinal: string;
  }
> = {
  en: {
    close: "Close take review",
    delete: "Delete",
    noTake: "No take",
    noTakeMeta: "Record a take to review it here.",
    retake: "Retake",
    selectFinal: "Select Final",
  },
  ko: {
    close: "테이크 리뷰 닫기",
    delete: "삭제",
    noTake: "Take 없음",
    noTakeMeta: "촬영한 테이크가 여기에 표시됩니다.",
    retake: "재촬영",
    selectFinal: "Final로 선택",
  },
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#020617",
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    zIndex: 10,
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "rgba(2, 6, 23, 0.48)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 999,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  headerTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0,
  },
  headerMeta: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 5,
  },
  statusPill: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: "72%",
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  statusPillText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
  },
  headerTime: {
    color: "rgba(255, 255, 255, 0.58)",
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
  },
  main: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  previewFrame: {
    aspectRatio: 9 / 16,
    backgroundColor: "#0f172a",
    borderColor: "rgba(255, 255, 255, 0.16)",
    borderRadius: 26,
    borderWidth: 1,
    maxHeight: "100%",
    overflow: "hidden",
    width: "100%",
  },
  previewImage: {
    ...StyleSheet.absoluteFillObject,
  },
  emptyPreview: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  previewShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2, 6, 23, 0.22)",
  },
  playButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(2, 6, 23, 0.62)",
    borderColor: "rgba(255, 255, 255, 0.22)",
    borderRadius: 999,
    borderWidth: 1,
    height: 62,
    justifyContent: "center",
    position: "absolute",
    top: "44%",
    width: 62,
  },
  takePanel: {
    backgroundColor: "rgba(2, 6, 23, 0.74)",
    borderColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 18,
    borderWidth: 1,
    bottom: 16,
    left: 14,
    paddingHorizontal: 13,
    paddingVertical: 11,
    position: "absolute",
    right: 14,
  },
  takePanelTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  takeLabel: {
    color: "#ffffff",
    flex: 1,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  takeDuration: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
  },
  takeMeta: {
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 5,
  },
  bottom: {
    paddingBottom: 12,
  },
  carousel: {
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  takeThumb: {
    aspectRatio: 9 / 16,
    backgroundColor: "#0f172a",
    borderColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: 8,
    width: 70,
  },
  activeTakeThumb: {
    borderColor: "#ffffff",
    borderWidth: 2,
  },
  finalTakeThumb: {
    borderColor: "#c4b5fd",
  },
  takeThumbImage: {
    ...StyleSheet.absoluteFillObject,
  },
  takeThumbShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2, 6, 23, 0.28)",
  },
  finalBadge: {
    alignItems: "center",
    backgroundColor: "#8b5cf6",
    borderRadius: 999,
    height: 20,
    justifyContent: "center",
    position: "absolute",
    right: 6,
    top: 6,
    width: 20,
  },
  takeThumbLabel: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
  },
  takeThumbMeta: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 2,
  },
  retakeThumb: {
    alignItems: "center",
    aspectRatio: 9 / 16,
    borderColor: "rgba(255, 255, 255, 0.28)",
    borderRadius: 14,
    borderStyle: "dashed",
    borderWidth: 1.4,
    justifyContent: "center",
    width: 70,
  },
  retakeThumbText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: 4,
  },
  sceneRail: {
    gap: 8,
    paddingHorizontal: 18,
    paddingBottom: 6,
  },
  sceneChip: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 999,
    borderWidth: 1,
    height: 30,
    justifyContent: "center",
    minWidth: 40,
    paddingHorizontal: 10,
  },
  activeSceneChip: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },
  sceneChipText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
  },
  activeSceneChipText: {
    color: "#111827",
  },
  actions: {
    flexDirection: "row",
    gap: 9,
    paddingHorizontal: 18,
    paddingTop: 4,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderColor: "rgba(255, 255, 255, 0.16)",
    borderRadius: 14,
    borderWidth: 1,
    flex: 0.82,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 8,
  },
  secondaryButtonLabel: {
    color: "#ffffff",
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  primaryButtonWrap: {
    borderRadius: 14,
    flex: 1.18,
    overflow: "hidden",
  },
  primaryButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 9,
  },
  primaryButtonLabel: {
    color: "#ffffff",
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  disabledButton: {
    opacity: 0.44,
  },
  pressed: {
    opacity: 0.76,
  },
});
