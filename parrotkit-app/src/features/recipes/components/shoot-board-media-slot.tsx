import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export type ShootBoardMediaSlotStatus =
  | "empty"
  | "saved"
  | "final"
  | "needs_reshoot";

export type ShootBoardMediaSlotProps = {
  badgeLabel?: string;
  caption?: string;
  label: string;
  onPress: () => void;
  status?: ShootBoardMediaSlotStatus;
  thumbnailUrl?: string;
  timeRangeLabel?: string;
};

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export function ShootBoardMediaSlot({
  badgeLabel,
  caption,
  label,
  onPress,
  status = "empty",
  thumbnailUrl,
  timeRangeLabel,
}: ShootBoardMediaSlotProps) {
  const empty = status === "empty";
  const statusStyle = getStatusStyle(status);

  return (
    <View
      style={[
        styles.root,
        { borderColor: statusStyle.borderColor },
        status === "final" && styles.finalRoot,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View
          style={[
            styles.preview,
            !empty && !thumbnailUrl && styles.previewWithoutThumbnail,
          ]}
        >
          {!empty && thumbnailUrl ? (
            <>
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="cover"
                source={{ uri: thumbnailUrl }}
                style={styles.previewImage}
              />
              <View style={styles.previewShade} />
            </>
          ) : null}

          <View style={empty ? styles.emptyPreview : styles.playPreview}>
            <MaterialCommunityIcons
              color={statusStyle.iconColor}
              name={empty ? "plus" : "play"}
              size={17}
            />
          </View>

          {timeRangeLabel ? (
            <View style={styles.timePill}>
              <Text numberOfLines={1} style={styles.timeText}>
                {timeRangeLabel}
              </Text>
            </View>
          ) : null}

          {badgeLabel ? (
            <View style={styles.badge}>
              <Text numberOfLines={1} style={styles.badgeText}>
                {badgeLabel}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.copy}>
          <View style={styles.labelRow}>
            <Text numberOfLines={1} style={styles.label}>
              {label}
            </Text>
            {status !== "empty" ? (
              <MaterialCommunityIcons
                color={statusStyle.iconColor}
                name={statusStyle.iconName}
                size={10}
              />
            ) : null}
          </View>
          {caption ? (
            <Text numberOfLines={1} style={styles.caption}>
              {caption}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

function getStatusStyle(status: ShootBoardMediaSlotStatus): {
  borderColor: string;
  iconColor: string;
  iconName: IconName;
} {
  if (status === "final") {
    return {
      borderColor: "#8b5cf6",
      iconColor: "#8b5cf6",
      iconName: "star",
    };
  }

  if (status === "needs_reshoot") {
    return {
      borderColor: "#fb7185",
      iconColor: "#e11d48",
      iconName: "alert-circle-outline",
    };
  }

  if (status === "saved") {
    return {
      borderColor: "#c4b5fd",
      iconColor: "#6366f1",
      iconName: "check-circle-outline",
    };
  }

  return {
    borderColor: "#e2e8f0",
    iconColor: "#94a3b8",
    iconName: "plus-circle-outline",
  };
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderColor: "rgba(255,255,255,0.84)",
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 20,
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: "absolute",
    right: 5,
    top: 5,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0,
  },
  root: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1.2,
    flexShrink: 0,
    overflow: "hidden",
    width: 72,
  },
  finalRoot: {
    shadowColor: "#4c1d95",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },
  pressable: {
    position: "relative",
  },
  preview: {
    aspectRatio: 9 / 16,
    backgroundColor: "#f8fafc",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  emptyPreview: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "#f8fafc",
    justifyContent: "center",
  },
  playPreview: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 999,
    height: 24,
    left: "50%",
    marginLeft: -12,
    marginTop: -12,
    position: "absolute",
    top: "50%",
    justifyContent: "center",
    width: 24,
  },
  previewImage: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
  },
  previewWithoutThumbnail: {
    backgroundColor: "#111827",
  },
  previewShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2,6,23,0.08)",
  },
  timePill: {
    backgroundColor: "rgba(2, 6, 23, 0.72)",
    borderRadius: 999,
    left: 4,
    maxWidth: 46,
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: "absolute",
    top: 4,
  },
  timeText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0,
  },
  copy: {
    backgroundColor: "rgba(255,255,255,0.9)",
    gap: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    justifyContent: "space-between",
  },
  label: {
    color: "#111827",
    flex: 1,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0,
  },
  caption: {
    color: "#64748b",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0,
  },
});
