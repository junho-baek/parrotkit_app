import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { VideoView, useVideoPlayer } from "expo-video";
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
              {formatSceneTitle(language, cut)}
            </Text>
            <View style={styles.headerMeta}>
              <View style={styles.referencePill}>
                <Text style={styles.referencePillText}>{copy.reference}</Text>
              </View>
              <Text numberOfLines={1} style={styles.headerTime}>
                {cut.timeRangeLabel}
              </Text>
            </View>
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

        <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.carousel}
            showsHorizontalScrollIndicator={false}
          >
            {cuts.map((item) => (
              <CutThumb
                active={item.id === cut.id}
                cut={item}
                key={item.id}
                language={language}
                onPress={() => onSelectCut?.(item)}
              />
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={!onUseAsGuide}
              onPress={() => onUseAsGuide?.(cut)}
              style={({ pressed }) => [
                styles.secondaryButton,
                !onUseAsGuide && styles.disabledButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                color="#ffffff"
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
              style={({ pressed }) => [
                styles.primaryButtonWrap,
                pressed && styles.pressed,
              ]}
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

  if (cut.thumbnailUrl) {
    return <Image source={{ uri: cut.thumbnailUrl }} style={styles.previewImage} />;
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

function CutThumb({
  active,
  cut,
  language,
  onPress,
}: {
  active: boolean;
  cut: ShootBoardCut;
  language: AppLanguage;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.cutThumb,
        active && styles.activeCutThumb,
        pressed && styles.pressed,
      ]}
    >
      {cut.thumbnailUrl ? (
        <Image
          source={{ uri: cut.thumbnailUrl }}
          style={styles.cutThumbImage}
        />
      ) : null}
      <View style={styles.cutThumbShade} />
      <Text numberOfLines={1} style={styles.cutThumbOrder}>
        #{cut.order}
      </Text>
      <Text numberOfLines={2} style={styles.cutThumbTitle}>
        {language === "ko"
          ? cut.roleLabel || cut.titleKo
          : cut.roleLabel || cut.title}
      </Text>
    </Pressable>
  );
}

function formatSceneTitle(language: AppLanguage, cut: ShootBoardCut) {
  const role = cut.roleLabel || (language === "ko" ? cut.titleKo : cut.title);
  return language === "ko"
    ? `컷 #${cut.order}: ${role}`
    : `Cut #${cut.order}: ${role}`;
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
    reference: string;
    shootThisScene: string;
    useAsGuide: string;
  }
> = {
  en: {
    bookmark: "Bookmark reference",
    close: "Close reference",
    reference: "Reference",
    shootThisScene: "Film this cut",
    useAsGuide: "Use as guide",
  },
  ko: {
    bookmark: "레퍼런스 저장",
    close: "레퍼런스 닫기",
    reference: "Reference",
    shootThisScene: "이 컷 촬영",
    useAsGuide: "가이드로 사용",
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
  referencePill: {
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  referencePillText: {
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
    paddingBottom: 12,
  },
  carousel: {
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  cutThumb: {
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
  activeCutThumb: {
    borderColor: "#c4b5fd",
    borderWidth: 2,
  },
  cutThumbImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cutThumbShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2, 6, 23, 0.28)",
  },
  cutThumbOrder: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0,
  },
  cutThumbTitle: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 4,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderColor: "rgba(255, 255, 255, 0.16)",
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 10,
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
    flex: 1,
    overflow: "hidden",
  },
  primaryButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 10,
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
