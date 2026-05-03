import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { normalizePrompterOpacity, normalizePrompterScale } from '@/features/recipes/lib/prompter-layout';
import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

type NativePrompterToolbarProps = {
  focusedBlock: PrompterBlock | null;
  hiddenBlocks: PrompterBlock[];
  onAddCue: () => void;
  onColorCue: (accentColor: string) => void;
  onEditCue: () => void;
  onHideCue: () => void;
  onOpacityCue: (opacity: number) => void;
  onScaleCue: (scale: number) => void;
  onShowCue: (blockId: string) => void;
};

const SCALE_STEP = 0.12;
const OPACITY_STEP = 0.14;
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
  onOpacityCue,
  onScaleCue,
  onShowCue,
}: NativePrompterToolbarProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const currentScale = normalizePrompterScale(focusedBlock?.scale ?? 1);
  const currentOpacity = normalizePrompterOpacity(focusedBlock?.opacity);
  const nextHiddenBlock = hiddenBlocks[0] ?? null;

  useEffect(() => {
    setPaletteOpen(false);
  }, [focusedBlock?.id]);

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
              accessibilityLabel="Make focused cue more transparent"
              iconName="opacity"
              onPress={() => onOpacityCue(normalizePrompterOpacity(currentOpacity - OPACITY_STEP))}
            />
            <ToolbarButton
              accessibilityLabel="Make focused cue more opaque"
              iconName="circle-opacity"
              onPress={() => onOpacityCue(normalizePrompterOpacity(currentOpacity + OPACITY_STEP))}
            />
            <ToolbarButton
              accessibilityLabel={paletteOpen ? 'Close cue color palette' : 'Open cue color palette'}
              active={paletteOpen}
              iconName="palette-outline"
              onPress={() => setPaletteOpen((current) => !current)}
            />
            <ToolbarButton
              accessibilityLabel="Hide focused cue"
              iconName="eye-off-outline"
              onPress={onHideCue}
            />
          </View>
          {paletteOpen ? (
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
              <Pressable
                accessibilityLabel="Close cue color palette"
                accessibilityRole="button"
                onPress={() => setPaletteOpen(false)}
                style={({ pressed }) => [
                  styles.paletteCloseButton,
                  pressed && styles.pressedButton,
                ]}
              >
                <MaterialCommunityIcons color="#ffffff" name="close" size={19} />
              </Pressable>
            </View>
          ) : null}
        </>
      ) : null}

      <View style={styles.quickControls}>
        <ToolbarButton
          accessibilityLabel="Add cue"
          emphasized
          iconName="plus"
          onPress={onAddCue}
          size="large"
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
  active = false,
  emphasized = false,
  iconName,
  onPress,
  size = 'regular',
}: {
  accessibilityLabel: string;
  active?: boolean;
  emphasized?: boolean;
  iconName: ToolbarIconName;
  onPress: () => void;
  size?: 'regular' | 'large';
}) {
  const large = size === 'large';

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        large && styles.largeButton,
        emphasized ? styles.emphasizedButton : styles.secondaryButton,
        active && styles.activeButton,
        pressed && styles.pressedButton,
      ]}
    >
      <MaterialCommunityIcons
        color="#ffffff"
        name={iconName}
        size={large ? 28 : 20}
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
  largeButton: {
    height: 58,
    width: 58,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  emphasizedButton: {
    backgroundColor: '#8b5cf6',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
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
    height: 42,
    padding: 4,
    width: 42,
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
  paletteCloseButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
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
