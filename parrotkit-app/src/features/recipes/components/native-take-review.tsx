import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { VideoView, useVideoPlayer } from 'expo-video';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export type NativeGallerySaveStatus = 'idle' | 'saving' | 'saved' | 'denied' | 'failed';

type NativeTakeReviewProps = {
  galleryMessage?: string;
  galleryStatus: NativeGallerySaveStatus;
  uri: string;
  onRetry: () => void;
  onUseTake: () => void;
  useTakeDisabled?: boolean;
  useTakeLabel?: string;
};

export function NativeTakeReview({
  galleryMessage,
  galleryStatus,
  uri,
  onRetry,
  onUseTake,
  useTakeDisabled = false,
  useTakeLabel = 'Use Take',
}: NativeTakeReviewProps) {
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.play();
  });
  const statusCopy = getStatusCopy(galleryStatus, galleryMessage);

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
        <View style={styles.galleryPanel}>
          <View style={[styles.statusIcon, styles[statusCopy.tone]]}>
            {galleryStatus === 'saving' ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <MaterialCommunityIcons color="#ffffff" name={statusCopy.iconName} size={23} />
            )}
          </View>
          <Text style={styles.previewTitle}>{statusCopy.title}</Text>
          <Text style={styles.previewMeta}>
            {statusCopy.caption}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <ReviewButton
          iconName="restart"
          label="Retry"
          onPress={onRetry}
          tone="secondary"
        />
        <ReviewButton
          iconName="check"
          disabled={useTakeDisabled}
          label={useTakeLabel}
          onPress={onUseTake}
          tone="primary"
        />
      </View>
    </View>
  );
}

function getStatusCopy(status: NativeGallerySaveStatus, message?: string) {
  switch (status) {
    case 'saving':
      return {
        caption: message ?? 'Putting this take in the native camera roll.',
        iconName: 'cloud-upload-outline' as ReviewIconName,
        title: 'Saving to Gallery',
        tone: 'busyIcon' as const,
      };
    case 'saved':
      return {
        caption: message ?? 'This take is now in your iPhone gallery.',
        iconName: 'check-circle-outline' as ReviewIconName,
        title: 'Saved to Gallery',
        tone: 'savedIcon' as const,
      };
    case 'denied':
      return {
        caption: message ?? 'Allow Photos access, then save this take again.',
        iconName: 'lock-alert-outline' as ReviewIconName,
        title: 'Gallery Access Needed',
        tone: 'warningIcon' as const,
      };
    case 'failed':
      return {
        caption: message ?? 'Tap Save to Gallery to try again.',
        iconName: 'alert-circle-outline' as ReviewIconName,
        title: 'Gallery Save Failed',
        tone: 'warningIcon' as const,
      };
    default:
      return {
        caption: message ?? 'Preparing this take for your native gallery.',
        iconName: 'movie-open-check-outline' as ReviewIconName,
        title: 'Take Recorded',
        tone: 'busyIcon' as const,
      };
  }
}

type ReviewButtonTone = 'primary' | 'secondary';
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
        primary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
        pressed && styles.pressedButton,
      ]}
    >
      <MaterialCommunityIcons
        color={primary ? '#111827' : '#ffffff'}
        name={iconName}
        size={19}
      />
      <Text style={[styles.actionLabel, primary ? styles.primaryLabel : styles.secondaryLabel]}>
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
    maxHeight: '78%',
    overflow: 'hidden',
    width: '100%',
  },
  videoPreview: {
    ...StyleSheet.absoluteFillObject,
  },
  previewShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.26)',
  },
  galleryPanel: {
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
    color: 'rgba(255, 255, 255, 0.54)',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  pressedButton: {
    opacity: 0.74,
    transform: [{ scale: 0.98 }],
  },
  disabledButton: {
    opacity: 0.58,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  primaryLabel: {
    color: '#111827',
  },
  secondaryLabel: {
    color: '#ffffff',
  },
});
