import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type NativeRecordButtonProps = {
  recording: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function NativeRecordButton({
  recording,
  disabled = false,
  onPress,
}: NativeRecordButtonProps) {
  return (
    <Pressable
      accessibilityLabel={recording ? 'Stop recording' : 'Start recording'}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        recording ? styles.stopRoot : styles.recordRoot,
        disabled && styles.disabledRoot,
        pressed && !disabled && styles.pressedRoot,
      ]}
    >
      <View style={[styles.iconShell, recording ? styles.stopIconShell : styles.recordIconShell]}>
        <MaterialCommunityIcons
          color={recording ? '#ef4444' : '#ffffff'}
          name={recording ? 'stop' : 'record-circle'}
          size={recording ? 24 : 28}
        />
      </View>
      <Text style={[styles.label, recording ? styles.stopLabel : styles.recordLabel]}>
        {recording ? 'Stop' : 'Record'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    height: 58,
    justifyContent: 'center',
    minWidth: 142,
    paddingHorizontal: 18,
  },
  recordRoot: {
    backgroundColor: '#ef4444',
    borderColor: 'rgba(255, 255, 255, 0.24)',
  },
  stopRoot: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  disabledRoot: {
    opacity: 0.45,
  },
  pressedRoot: {
    opacity: 0.78,
    transform: [{ scale: 0.97 }],
  },
  iconShell: {
    alignItems: 'center',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  recordIconShell: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  stopIconShell: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
  },
  recordLabel: {
    color: '#ffffff',
  },
  stopLabel: {
    color: '#991b1b',
  },
});
