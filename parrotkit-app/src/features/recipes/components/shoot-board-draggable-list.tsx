import { useMemo, useRef, useState } from 'react';
import { PanResponder, type LayoutChangeEvent, View } from 'react-native';

import type { AppLanguage } from '@/core/i18n/app-language';
import { ShootBoardSceneCard } from '@/features/recipes/components/shoot-board-scene-card';
import type { ShootBoardCut, ShootBoardCutTextPatch } from '@/features/recipes/lib/shoot-board-model';

type RowLayout = {
  height: number;
  y: number;
};

export function ShootBoardDraggableList({
  cuts,
  expandedCutIds,
  language,
  onDragStateChange,
  onMoveCut,
  onPreview,
  onResetCut,
  onResult,
  onShoot,
  onToggleExpanded,
  onToggleRequiredCheck,
  onToggleSceneComplete,
  onUpdateCutText,
  reorderMode,
}: {
  cuts: ShootBoardCut[];
  expandedCutIds: string[];
  language: AppLanguage;
  onDragStateChange?: (dragging: boolean) => void;
  onMoveCut: (cutId: string, direction: -1 | 1) => void;
  onPreview: (cut: ShootBoardCut) => void;
  onResetCut: (cutId: string) => void;
  onResult: (cut: ShootBoardCut) => void;
  onShoot: (cut: ShootBoardCut) => void;
  onToggleExpanded: (cutId: string) => void;
  onToggleRequiredCheck: (cutId: string, checklistItemId: string, checked: boolean) => void;
  onToggleSceneComplete: (cutId: string, complete: boolean) => void;
  onUpdateCutText: (cutId: string, patch: ShootBoardCutTextPatch) => void;
  reorderMode: boolean;
}) {
  const [draggingCutId, setDraggingCutId] = useState<string | null>(null);
  const lastDragStepRef = useRef(0);
  const layoutsRef = useRef<Record<string, RowLayout>>({});

  const orderedCuts = useMemo(() => [...cuts].sort((a, b) => a.order - b.order), [cuts]);

  return (
    <View className="gap-3">
      {orderedCuts.map((cut) => {
        const panResponder = PanResponder.create({
          onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 3,
          onMoveShouldSetPanResponderCapture: (_, gestureState) => Math.abs(gestureState.dy) > 3,
          onPanResponderGrant: () => {
            setDraggingCutId(cut.id);
            lastDragStepRef.current = 0;
            onDragStateChange?.(true);
          },
          onPanResponderMove: (_, gestureState) => {
            const rowHeight = layoutsRef.current[cut.id]?.height ?? 104;
            const step = Math.max(56, rowHeight * 0.45);
            const nextStep = Math.trunc(gestureState.dy / step);

            if (nextStep === lastDragStepRef.current) {
              return;
            }

            const direction = nextStep > lastDragStepRef.current ? 1 : -1;
            lastDragStepRef.current = nextStep;
            onMoveCut(cut.id, direction);
          },
          onPanResponderRelease: () => {
            setDraggingCutId(null);
            onDragStateChange?.(false);
          },
          onPanResponderTerminate: () => {
            setDraggingCutId(null);
            onDragStateChange?.(false);
          },
          onStartShouldSetPanResponder: () => true,
          onStartShouldSetPanResponderCapture: () => true,
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
              onReset={() => onResetCut(cut.id)}
              onResult={() => onResult(cut)}
              onShoot={() => onShoot(cut)}
              onToggleExpanded={() => onToggleExpanded(cut.id)}
              onToggleRequiredCheck={(checklistItemId, checked) => onToggleRequiredCheck(cut.id, checklistItemId, checked)}
              onToggleSceneComplete={(complete) => onToggleSceneComplete(cut.id, complete)}
              onUpdateText={(patch) => onUpdateCutText(cut.id, patch)}
              reorderMode={reorderMode || dragging}
            />
          </View>
        );
      })}
    </View>
  );
}
