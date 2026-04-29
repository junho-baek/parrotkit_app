import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { MockProjectTake } from '@/core/mocks/parrotkit-data';

type NativeTakeTrayProps = {
  bestTakeId?: string;
  busyTakeId?: string | null;
  onDeleteTake: (take: MockProjectTake) => void;
  onOpenIn: (take: MockProjectTake) => void;
  onSaveToGallery: (take: MockProjectTake) => void;
  onSetBestTake: (take: MockProjectTake) => void;
  takes: MockProjectTake[];
  title?: string;
};

export function NativeTakeTray({
  bestTakeId,
  busyTakeId,
  onDeleteTake,
  onOpenIn,
  onSaveToGallery,
  onSetBestTake,
  takes,
  title = 'Takes',
}: NativeTakeTrayProps) {
  if (takes.length === 0) return null;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>{takes.length}</Text>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
      >
        {takes.map((take) => {
          const best = take.id === bestTakeId || (!bestTakeId && take.id === takes[0]?.id);
          const busy = busyTakeId === take.id;

          return (
            <View key={take.id} style={[styles.card, best && styles.bestCard]}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={[styles.takeLabel, best && styles.bestTakeLabel]}>{take.label}</Text>
                  <Text style={[styles.takeMeta, best && styles.bestTakeMeta]}>{take.createdAt}</Text>
                </View>
                <Pressable
                  accessibilityLabel={`Delete ${take.label}`}
                  hitSlop={8}
                  onPress={() => onDeleteTake(take)}
                  style={styles.iconButton}
                >
                  <MaterialCommunityIcons
                    color="rgba(255,255,255,0.78)"
                    name="trash-can-outline"
                    size={16}
                  />
                </Pressable>
              </View>

              <View style={styles.statusRow}>
                <View style={[styles.statusDot, take.exportStatus !== 'local' && styles.exportedDot]} />
                <Text style={[styles.statusText, best && styles.bestStatusText]}>{getExportLabel(take)}</Text>
              </View>

              <View style={styles.actions}>
                <TrayAction
                  active={best}
                  disabled={busy}
                  iconName={best ? 'star' : 'star-outline'}
                  label={best ? 'Best' : 'Best'}
                  onPress={() => onSetBestTake(take)}
                />
                <TrayAction
                  disabled={busy}
                  iconName="image-plus"
                  label="Gallery"
                  onPress={() => onSaveToGallery(take)}
                />
                <TrayAction
                  disabled={busy}
                  iconName="export-variant"
                  label="Open"
                  onPress={() => onOpenIn(take)}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function getExportLabel(take: MockProjectTake) {
  if (take.exportStatus === 'gallery_saved') return 'Gallery';
  if (take.exportStatus === 'shared') return 'Opened';

  return 'Local';
}

function TrayAction({
  active = false,
  disabled = false,
  iconName,
  label,
  onPress,
}: {
  active?: boolean;
  disabled?: boolean;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        active && styles.activeAction,
        disabled && styles.disabledAction,
        pressed && styles.pressedAction,
      ]}
    >
      <MaterialCommunityIcons color={active ? '#111827' : '#ffffff'} name={iconName} size={14} />
      <Text style={[styles.actionLabel, active && styles.activeActionLabel]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    marginBottom: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
  },
  count: {
    color: 'rgba(255, 255, 255, 0.52)',
    fontSize: 12,
    fontWeight: '800',
  },
  list: {
    gap: 10,
    paddingRight: 2,
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    width: 166,
  },
  bestCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.32)',
    borderColor: 'rgba(196, 181, 253, 0.72)',
  },
  cardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  takeLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  takeMeta: {
    color: 'rgba(255, 255, 255, 0.52)',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  bestTakeLabel: {
    color: '#ffffff',
  },
  bestTakeMeta: {
    color: 'rgba(255, 255, 255, 0.62)',
  },
  iconButton: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  statusDot: {
    backgroundColor: '#8b5cf6',
    borderRadius: 999,
    height: 7,
    width: 7,
  },
  exportedDot: {
    backgroundColor: '#22c55e',
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontSize: 11,
    fontWeight: '800',
  },
  bestStatusText: {
    color: 'rgba(255, 255, 255, 0.68)',
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  action: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 999,
    flex: 1,
    flexDirection: 'row',
    gap: 3,
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  activeAction: {
    backgroundColor: '#ffffff',
  },
  disabledAction: {
    opacity: 0.42,
  },
  pressedAction: {
    opacity: 0.72,
  },
  actionLabel: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  activeActionLabel: {
    color: '#111827',
  },
});
