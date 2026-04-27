import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type NativeTakeReviewProps = {
  uri: string;
  onRetry: () => void;
  onUseTake: () => void;
  useTakeDisabled?: boolean;
  useTakeLabel?: string;
};

export function NativeTakeReview({
  uri,
  onRetry,
  onUseTake,
  useTakeDisabled = false,
  useTakeLabel = 'Use Take',
}: NativeTakeReviewProps) {
  return (
    <View style={styles.root}>
      <View style={styles.previewFrame}>
        <View style={styles.previewFallback}>
          <MaterialCommunityIcons color="#ffffff" name="check-circle-outline" size={48} />
          <Text style={styles.previewTitle}>Take recorded</Text>
          <Text numberOfLines={2} style={styles.previewMeta}>
            {uri}
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

type ReviewButtonTone = 'primary' | 'secondary';
type ReviewIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

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
  previewFallback: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
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
