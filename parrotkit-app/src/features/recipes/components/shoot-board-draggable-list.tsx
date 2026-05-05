import { useMemo, useRef, useState } from 'react';
import { PanResponder, type LayoutChangeEvent, View } from 'react-native';

import type { AppLanguage } from '@/core/i18n/app-language';
import { ShootBoardSceneCard } from '@/features/recipes/components/shoot-board-scene-card';
import type { ShootBoardCut } from '@/features/recipes/lib/shoot-board-model';

type RowLayout = {
  height: number;
  y: number;
};

export function ShootBoardDraggableList({
  cuts,
  expandedCutIds,
  language,
  onPreview,
  onReorder,
  onResult,
  onShoot,
  onToggleExpanded,
  onToggleRequiredCheck,
  onToggleSceneComplete,
  reorderMode,
}: {
  cuts: ShootBoardCut[];
  expandedCutIds: string[];
  language: AppLanguage;
  onPreview: (cut: ShootBoardCut) => void;
  onReorder: (cutId: string, targetOrder: number) => void;
  onResult: (cut: ShootBoardCut) => void;
  onShoot: (cut: ShootBoardCut) => void;
  onToggleExpanded: (cutId: string) => void;
  onToggleRequiredCheck: (cutId: string, checklistItemId: string, checked: boolean) => void;
  onToggleSceneComplete: (cutId: string, complete: boolean) => void;
  reorderMode: boolean;
}) {
  const [draggingCutId, setDraggingCutId] = useState<string | null>(null);
  const dragStartYRef = useRef(0);
  const layoutsRef = useRef<Record<string, RowLayout>>({});

  const orderedCuts = useMemo(() => [...cuts].sort((a, b) => a.order - b.order), [cuts]);

  return (
    <View className="gap-3">
      {orderedCuts.map((cut) => {
        const panResponder = PanResponder.create({
          onMoveShouldSetPanResponder: (_, gestureState) => reorderMode && Math.abs(gestureState.dy) > 4,
          onPanResponderGrant: () => {
            setDraggingCutId(cut.id);
            dragStartYRef.current = layoutsRef.current[cut.id]?.y ?? 0;
          },
          onPanResponderRelease: (_, gestureState) => {
            const targetY = dragStartYRef.current + gestureState.dy;
            const targetOrder = getTargetOrderFromY(cut, orderedCuts, layoutsRef.current, targetY);
            setDraggingCutId(null);
            onReorder(cut.id, targetOrder);
          },
          onPanResponderTerminate: () => {
            setDraggingCutId(null);
          },
          onStartShouldSetPanResponder: () => reorderMode,
        });
        const dragging = draggingCutId === cut.id;

        return (
          <View
            key={cut.id}
            onLayout={(event: LayoutChangeEvent) => {
              layoutsRef.current[cut.id] = event.nativeEvent.layout;
            }}
            style={{ opacity: dragging ? 0.72 : 1, transform: [{ scale: dragging ? 0.99 : 1 }] }}
          >
            <ShootBoardSceneCard
              cut={cut}
              dragHandleProps={panResponder.panHandlers}
              expanded={expandedCutIds.includes(cut.id)}
              language={language}
              onPreview={() => onPreview(cut)}
              onResult={() => onResult(cut)}
              onShoot={() => onShoot(cut)}
              onToggleExpanded={() => onToggleExpanded(cut.id)}
              onToggleRequiredCheck={(checklistItemId, checked) => onToggleRequiredCheck(cut.id, checklistItemId, checked)}
              onToggleSceneComplete={(complete) => onToggleSceneComplete(cut.id, complete)}
              reorderMode={reorderMode}
            />
          </View>
        );
      })}
    </View>
  );
}

function getTargetOrderFromY(
  movingCut: ShootBoardCut,
  cuts: ShootBoardCut[],
  layouts: Record<string, RowLayout>,
  targetY: number
) {
  const targetCut = cuts.find((cut) => {
    if (cut.id === movingCut.id) return false;

    const layout = layouts[cut.id];
    if (!layout) return false;

    const midpoint = layout.y + layout.height / 2;
    return targetY < midpoint;
  });

  if (!targetCut) return cuts.length;

  return targetCut.order > movingCut.order ? targetCut.order - 1 : targetCut.order;
}
