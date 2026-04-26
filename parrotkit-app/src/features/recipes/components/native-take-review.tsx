import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type NativeTakeReviewProps = {
  uri: string;
  onRetry: () => void;
  onUseTake: () => void;
};

export function NativeTakeReview({
  uri,
  onRetry,
  onUseTake,
}: NativeTakeReviewProps) {
  const player = useVideoPlayer({ uri }, (createdPlayer) => {
    createdPlayer.loop = true;
    createdPlayer.play();
  });

  return (
    <View style={styles.root}>
      <View style={styles.previewFrame}>
        <VideoView
          allowsFullscreen
          contentFit="cover"
          nativeControls
          player={player}
          style={styles.video}
        />
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
          label="Use Take"
          onPress={onUseTake}
          tone="primary"
        />
      </View>
    </View>
  );
}

type ReviewButtonTone = 'primary' | 'secondary';
type ReviewIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function ReviewButton({
  iconName,
  label,
  onPress,
  tone,
}: {
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
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        primary ? styles.primaryButton : styles.secondaryButton,
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
  video: {
    height: '100%',
    width: '100%',
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
