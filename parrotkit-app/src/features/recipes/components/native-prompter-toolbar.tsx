import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { normalizePrompterScale } from '@/features/recipes/lib/prompter-layout';
import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

type NativePrompterToolbarProps = {
  focusedBlock: PrompterBlock | null;
  hiddenBlocks: PrompterBlock[];
  onAddCue: () => void;
  onColorCue: (accentColor: string) => void;
  onEditCue: () => void;
  onHideCue: () => void;
  onScaleCue: (scale: number) => void;
  onShowCue: (blockId: string) => void;
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
  hiddenBlocks,
  onAddCue,
  onColorCue,
  onEditCue,
  onHideCue,
  onScaleCue,
  onShowCue,
}: NativePrompterToolbarProps) {
  const currentScale = normalizePrompterScale(focusedBlock?.scale ?? 1);
  const nextHiddenBlock = hiddenBlocks[0] ?? null;

  return (
    <View pointerEvents="box-none" style={styles.root}>
      {focusedBlock ? (
        <>
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
          </View>
          <View style={styles.paletteBar}>
            {colorSwatches.map((swatch) => (
              <Pressable
                accessibilityLabel={`Set cue color ${swatch.accentColor}`}
                accessibilityRole="button"
                key={swatch.accentColor}
                onPress={() => onColorCue(swatch.accentColor)}
                style={[
                  styles.swatch,
                  { backgroundColor: swatch.color },
                  focusedBlock.accentColor === swatch.accentColor && styles.activeSwatch,
                ]}
              >
                <View style={[styles.swatchInner, { backgroundColor: swatch.color }]} />
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      <View style={styles.quickControls}>
        <ToolbarButton
          accessibilityLabel="Add cue"
          emphasized
          iconName="plus"
          onPress={onAddCue}
        />
        {nextHiddenBlock ? (
          <Pressable
            accessibilityLabel="Show hidden cue"
            accessibilityRole="button"
            onPress={() => onShowCue(nextHiddenBlock.id)}
            style={({ pressed }) => [
              styles.restoreButton,
              pressed && styles.pressedButton,
            ]}
          >
            <MaterialCommunityIcons color="#ffffff" name="eye-outline" size={19} />
            <Text style={styles.restoreCount}>{hiddenBlocks.length}</Text>
          </Pressable>
        ) : null}
      </View>
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
    alignSelf: 'flex-start',
    gap: 8,
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
    height: 38,
    padding: 4,
    width: 38,
  },
  activeSwatch: {
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  paletteBar: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
  },
  quickControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  restoreButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    height: 42,
    justifyContent: 'center',
    minWidth: 54,
    paddingHorizontal: 11,
  },
  restoreCount: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  swatchInner: {
    borderRadius: 999,
    flex: 1,
  },
});
