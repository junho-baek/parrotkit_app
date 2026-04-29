import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { VideoView, useVideoPlayer } from 'expo-video';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export type NativeTakeReviewStatus = 'idle' | 'saving' | 'saved' | 'denied' | 'failed' | 'shared';

type NativeTakeReviewProps = {
  keepDisabled?: boolean;
  keepLabel?: string;
  onKeep: () => void;
  onOpenIn: () => void;
  onRetry: () => void;
  onSaveToGallery: () => void;
  status: NativeTakeReviewStatus;
  statusMessage?: string;
  uri: string;
};

export function NativeTakeReview({
  keepDisabled = false,
  keepLabel = 'Keep',
  onKeep,
  onOpenIn,
  onRetry,
  onSaveToGallery,
  status,
  statusMessage,
  uri,
}: NativeTakeReviewProps) {
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.play();
  });
  const statusCopy = getStatusCopy(status, statusMessage);
  const exporting = status === 'saving';

  return (
    <View style={styles.root}>
      <View style={styles.previewFrame}>
        <VideoView
          allowsPictureInPicture={false}
          contentFit="cover"
          fullscreenOptions={{ enable: false }}
          nativeControls={false}
          player={player}
          style={styles.videoPreview}
        />
        <View style={styles.previewShade} />
        <View style={styles.reviewPanel}>
          <View style={[styles.statusIcon, styles[statusCopy.tone]]}>
            {exporting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <MaterialCommunityIcons color="#ffffff" name={statusCopy.iconName} size={23} />
            )}
          </View>
          <Text style={styles.previewTitle}>{statusCopy.title}</Text>
          <Text style={styles.previewMeta}>{statusCopy.caption}</Text>
        </View>
      </View>

      <View style={styles.exportActions}>
        <ReviewButton
          disabled={exporting}
          iconName="image-plus"
          label="Gallery"
          onPress={onSaveToGallery}
          tone="secondary"
        />
        <ReviewButton
          disabled={exporting}
          iconName="export-variant"
          label="Open in..."
          onPress={onOpenIn}
          tone="secondary"
        />
      </View>

      <View style={styles.actions}>
        <ReviewButton
          disabled={exporting}
          iconName="restart"
          label="Retry"
          onPress={onRetry}
          tone="ghost"
        />
        <ReviewButton
          disabled={keepDisabled || exporting}
          iconName="check"
          label={keepLabel}
          onPress={onKeep}
          tone="primary"
        />
      </View>
    </View>
  );
}

function getStatusCopy(status: NativeTakeReviewStatus, message?: string) {
  switch (status) {
    case 'saving':
      return {
        caption: message ?? 'Exporting this take.',
        iconName: 'cloud-upload-outline' as ReviewIconName,
        title: 'Working',
        tone: 'busyIcon' as const,
      };
    case 'saved':
      return {
        caption: message ?? 'Saved to your native Gallery.',
        iconName: 'check-circle-outline' as ReviewIconName,
        title: 'Saved',
        tone: 'savedIcon' as const,
      };
    case 'shared':
      return {
        caption: message ?? 'Opened in another app.',
        iconName: 'export-variant' as ReviewIconName,
        title: 'Opened',
        tone: 'savedIcon' as const,
      };
    case 'denied':
      return {
        caption: message ?? 'Allow Photos access, then save again.',
        iconName: 'lock-alert-outline' as ReviewIconName,
        title: 'Access Needed',
        tone: 'warningIcon' as const,
      };
    case 'failed':
      return {
        caption: message ?? 'Try Gallery or Open in... again.',
        iconName: 'alert-circle-outline' as ReviewIconName,
        title: 'Export Failed',
        tone: 'warningIcon' as const,
      };
    default:
      return {
        caption: message ?? 'Keep it in this project, or export only when you choose.',
        iconName: 'movie-open-check-outline' as ReviewIconName,
        title: 'Take Recorded',
        tone: 'idleIcon' as const,
      };
  }
}

type ReviewButtonTone = 'primary' | 'secondary' | 'ghost';
type ReviewIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function ReviewButton({
  iconName,
  label,
  disabled = false,
  onPress,
  tone,
}: {
  disabled?: boolean;
  iconName: ReviewIconName;
  label: string;
  onPress: () => void;
  tone: ReviewButtonTone;
}) {
  const primary = tone === 'primary';

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        tone === 'primary' && styles.primaryButton,
        tone === 'secondary' && styles.secondaryButton,
        tone === 'ghost' && styles.ghostButton,
        disabled && styles.disabledButton,
        pressed && styles.pressedButton,
      ]}
    >
      <MaterialCommunityIcons
        color={primary ? '#111827' : '#ffffff'}
        name={iconName}
        size={19}
      />
      <Text style={[styles.actionLabel, primary ? styles.primaryLabel : styles.secondaryLabel]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'rgba(2, 6, 23, 0.94)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  previewFrame: {
    aspectRatio: 9 / 16,
    backgroundColor: '#020617',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 28,
    borderWidth: 1,
    maxHeight: '72%',
    overflow: 'hidden',
    width: '100%',
  },
  videoPreview: {
    ...StyleSheet.absoluteFillObject,
  },
  previewShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.22)',
  },
  reviewPanel: {
    alignItems: 'center',
    bottom: 28,
    left: 22,
    position: 'absolute',
    right: 22,
  },
  statusIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  idleIcon: {
    backgroundColor: 'rgba(99, 102, 241, 0.86)',
  },
  busyIcon: {
    backgroundColor: 'rgba(99, 102, 241, 0.86)',
  },
  savedIcon: {
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
  },
  warningIcon: {
    backgroundColor: 'rgba(244, 63, 94, 0.9)',
  },
  previewTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 14,
  },
  previewMeta: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
    textAlign: 'center',
  },
  exportActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  ghostButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  disabledButton: {
    opacity: 0.44,
  },
  pressedButton: {
    transform: [{ scale: 0.98 }],
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '900',
  },
  primaryLabel: {
    color: '#111827',
  },
  secondaryLabel: {
    color: '#ffffff',
  },
});
