import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import { normalizePrompterScale } from '@/features/recipes/lib/prompter-layout';
import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

type NativePrompterToolbarProps = {
  focusedBlock: PrompterBlock | null;
  onAddCue: () => void;
  onColorCue: (accentColor: string) => void;
  onEditCue: () => void;
  onHideCue: () => void;
  onScaleCue: (scale: number) => void;
};

const SCALE_STEP = 0.12;
const colorSwatches = [
  { accentColor: 'blue', color: '#8b5cf6' },
  { accentColor: 'coral', color: '#ff7e58' },
  { accentColor: 'yellow', color: '#facc15' },
  { accentColor: 'green', color: '#22c55e' },
  { accentColor: 'pink', color: '#ec4899' },
];

type ToolbarIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export function NativePrompterToolbar({
  focusedBlock,
  onAddCue,
  onColorCue,
  onEditCue,
  onHideCue,
  onScaleCue,
}: NativePrompterToolbarProps) {
  const currentScale = normalizePrompterScale(focusedBlock?.scale ?? 1);

  return (
    <View pointerEvents="box-none" style={styles.root}>
      {focusedBlock ? (
        <View style={styles.focusedControls}>
          <ToolbarButton
            accessibilityLabel="Make focused cue smaller"
            iconName="format-font-size-decrease"
            onPress={() => onScaleCue(normalizePrompterScale(currentScale - SCALE_STEP))}
          />
          <ToolbarButton
            accessibilityLabel="Make focused cue larger"
            iconName="format-font-size-increase"
            onPress={() => onScaleCue(normalizePrompterScale(currentScale + SCALE_STEP))}
          />
          <ToolbarButton
            accessibilityLabel="Edit focused cue"
            iconName="pencil-outline"
            onPress={onEditCue}
          />
          <ToolbarButton
            accessibilityLabel="Hide focused cue"
            iconName="eye-off-outline"
            onPress={onHideCue}
          />
          <View style={styles.divider} />
          {colorSwatches.map((swatch) => (
            <Pressable
              accessibilityLabel={`Set cue color ${swatch.accentColor}`}
              accessibilityRole="button"
              key={swatch.accentColor}
              onPress={() => onColorCue(swatch.accentColor)}
              style={({ pressed }) => [
                styles.swatch,
                { backgroundColor: swatch.color },
                focusedBlock.accentColor === swatch.accentColor && styles.activeSwatch,
                pressed && styles.pressedButton,
              ]}
            />
          ))}
        </View>
      ) : null}

      <ToolbarButton
        accessibilityLabel="Add cue"
        emphasized
        iconName="plus"
        onPress={onAddCue}
      />
    </View>
  );
}

function ToolbarButton({
  accessibilityLabel,
  emphasized = false,
  iconName,
  onPress,
}: {
  accessibilityLabel: string;
  emphasized?: boolean;
  iconName: ToolbarIconName;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        emphasized ? styles.emphasizedButton : styles.secondaryButton,
        pressed && styles.pressedButton,
      ]}
    >
      <MaterialCommunityIcons
        color={emphasized ? '#111827' : '#ffffff'}
        name={iconName}
        size={20}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  focusedControls: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    padding: 6,
  },
  button: {
    alignItems: 'center',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    height: 24,
    width: 1,
  },
  emphasizedButton: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
  pressedButton: {
    opacity: 0.72,
    transform: [{ scale: 0.96 }],
  },
  swatch: {
    borderColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 999,
    borderWidth: 1,
    height: 24,
    width: 24,
  },
  activeSwatch: {
    borderColor: '#ffffff',
    borderWidth: 2,
  },
});
