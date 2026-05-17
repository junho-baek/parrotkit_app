import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AppLanguage } from "@/core/i18n/app-language";
import { brandActionGradient } from "@/core/theme/colors";
import { toImageSource } from "@/core/ui/image-source";
import {
  getReferenceViewerHeader,
  getReferenceViewerRailItems,
  type ReferenceViewerRailItem,
} from "@/features/recipes/lib/reference-viewer-ui";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

export type ReferenceViewerModalProps = {
  cut: ShootBoardCut;
  cuts: ShootBoardCut[];
  language: AppLanguage;
  onClose: () => void;
  onSelectCut?: (cut: ShootBoardCut) => void;
  onShoot: (cut: ShootBoardCut) => void;
  onUseAsGuide?: (cut: ShootBoardCut) => void;
  visible: boolean;
};

export function ReferenceViewerModal({
  cut,
  cuts,
  language,
  onClose,
  onSelectCut,
  onShoot,
  onUseAsGuide,
  visible,
}: ReferenceViewerModalProps) {
  const copy = referenceCopy[language];
  const insets = useSafeAreaInsets();
  const headerModel = getReferenceViewerHeader({ cut, language });
  const railItems = getReferenceViewerRailItems({
    activeCutId: cut.id,
    cuts,
    language,
  });
  const speakingLine = getSpeakingLine(language, cut);

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
              {headerModel.title}
            </Text>
            <Text numberOfLines={1} style={styles.headerTime}>
              {headerModel.meta}
            </Text>
          </View>

          <Pressable
            accessibilityLabel={copy.bookmark}
            accessibilityRole="button"
            hitSlop={20}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons
              color="#f8fafc"
              name="bookmark-outline"
              size={24}
            />
          </Pressable>
        </View>

        <View style={styles.main}>
          <View style={styles.previewFrame}>
            <ReferenceMedia cut={cut} />
            <View style={styles.previewShade} />
            <View style={styles.playButton}>
              <MaterialCommunityIcons color="#ffffff" name="play" size={28} />
            </View>
            <View style={styles.linePanel}>
              <Text numberOfLines={1} style={styles.previewTime}>
                {cut.timeRangeLabel}
              </Text>
              <Text numberOfLines={3} style={styles.speakingLine}>
                {speakingLine}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.bottom,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <View style={styles.bottomRail}>
            <View style={styles.carousel}>
              {railItems.map((item) => {
                const targetCut = cuts.find(
                  (candidate) => candidate.id === item.cutId,
                );

                if (!targetCut) return null;

                return (
                  <CutRailButton
                    active={item.active}
                    item={item}
                    key={item.cutId}
                    onPress={() => onSelectCut?.(targetCut)}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={!onUseAsGuide}
              onPress={() => onUseAsGuide?.(cut)}
              style={[
                styles.secondaryButton,
                !onUseAsGuide && styles.disabledButton,
              ]}
            >
              <MaterialCommunityIcons
                color="#f8fafc"
                name="bookmark-check-outline"
                size={18}
              />
              <Text numberOfLines={1} style={styles.secondaryButtonLabel}>
                {copy.useAsGuide}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => onShoot(cut)}
              style={styles.primaryButtonWrap}
            >
              <LinearGradient
                colors={brandActionGradient}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
                style={styles.primaryButton}
              >
                <MaterialCommunityIcons
                  color="#ffffff"
                  name="video-outline"
                  size={18}
                />
                <Text numberOfLines={1} style={styles.primaryButtonLabel}>
                  {copy.shootThisScene}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ReferenceMedia({ cut }: { cut: ShootBoardCut }) {
  if (isPlayableReferenceVideoSource(cut.referenceVideoUrl)) {
    return (
      <ReferenceVideoPlayer
        key={`${cut.id}-${String(cut.referenceVideoUrl)}`}
        source={cut.referenceVideoUrl}
      />
    );
  }

  if (cut.thumbnailSource || cut.thumbnailUrl) {
    return (
      <Image
        source={cut.thumbnailSource ?? toImageSource(cut.thumbnailUrl)}
        style={styles.previewImage}
      />
    );
  }

  return (
    <View style={styles.emptyPreview}>
      <MaterialCommunityIcons
        color="rgba(255,255,255,0.48)"
        name="image-outline"
        size={42}
      />
    </View>
  );
}

function isPlayableReferenceVideoSource(
  source: ShootBoardCut["referenceVideoUrl"],
): source is string | number {
  if (typeof source === "number") return true;
  if (!source) return false;
  return (
    source.startsWith("file://") ||
    source.startsWith("asset://") ||
    /\.(m3u8|mov|mp4)(\?|$)/i.test(source)
  );
}

function ReferenceVideoPlayer({ source }: { source: string | number }) {
  const player = useVideoPlayer(source, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.play();
  });

  return (
    <VideoView
      allowsPictureInPicture={false}
      contentFit="cover"
      fullscreenOptions={{ enable: false }}
      nativeControls={false}
      player={player}
      style={styles.previewImage}
    />
  );
}

function CutRailButton({
  active,
  item,
  onPress,
}: {
  active: boolean;
  item: ReferenceViewerRailItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={item.accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.cutRailButton,
        active && styles.activeCutRailButton,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[styles.cutRailText, active && styles.activeCutRailText]}
      >
        {item.visibleLabel}
      </Text>
    </Pressable>
  );
}

function getSpeakingLine(language: AppLanguage, cut: ShootBoardCut) {
  if (language === "ko")
    return cut.speakingLineKo ?? cut.prompterLine ?? cut.speakingLine;
  return cut.speakingLine;
}

const referenceCopy: Record<
  AppLanguage,
  {
    bookmark: string;
    close: string;
    shootThisScene: string;
    useAsGuide: string;
  }
> = {
  en: {
    bookmark: "Bookmark reference",
    close: "Close reference",
    shootThisScene: "Film",
    useAsGuide: "Guide",
  },
  ko: {
    bookmark: "레퍼런스 저장",
    close: "레퍼런스 닫기",
    shootThisScene: "촬영",
    useAsGuide: "가이드",
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
  headerTime: {
    color: "rgba(255, 255, 255, 0.58)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 5,
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
    backgroundColor: "rgba(2, 6, 23, 0.2)",
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
  linePanel: {
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
  previewTime: {
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 5,
  },
  speakingLine: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 21,
  },
  bottom: {
    alignItems: "center",
    gap: 12,
    paddingBottom: 12,
    paddingHorizontal: 18,
  },
  carousel: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  cutRailButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  activeCutRailButton: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },
  cutRailText: {
    color: "rgba(255, 255, 255, 0.76)",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  activeCutRailText: {
    color: "#020617",
  },
  bottomRail: {
    alignItems: "center",
    maxWidth: 420,
    width: "100%",
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    maxWidth: 420,
    width: "100%",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderColor: "rgba(255, 255, 255, 0.16)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    height: 46,
    justifyContent: "center",
    width: 132,
    paddingHorizontal: 14,
  },
  secondaryButtonLabel: {
    color: "#f8fafc",
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  primaryButtonWrap: {
    borderRadius: 999,
    overflow: "hidden",
    width: 176,
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 7,
    height: 46,
    justifyContent: "center",
    paddingHorizontal: 18,
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
