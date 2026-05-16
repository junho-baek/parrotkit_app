import { useMemo, type ReactElement } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  type RenderItemParams,
} from "react-native-draggable-flatlist";

import type { AppLanguage } from "@/core/i18n/app-language";
import { ShootBoardSceneCard } from "@/features/recipes/components/shoot-board-scene-card";
import type {
  ShootBoardCut,
  ShootBoardCutTextPatch,
  ShootBoardTake,
} from "@/features/recipes/lib/shoot-board-model";

export function ShootBoardDraggableList({
  contentContainerStyle,
  cuts,
  expandedCutIds,
  highlightedCutId,
  language,
  ListHeaderComponent,
  onDragStateChange,
  onPreview,
  onReorderCuts,
  onResetCut,
  onSetFinalTake,
  onShoot,
  onTake,
  onToggleChecklistItem,
  onToggleExpanded,
  onUpdateCutText,
  reorderMode,
}: {
  contentContainerStyle?: StyleProp<ViewStyle>;
  cuts: ShootBoardCut[];
  expandedCutIds: string[];
  highlightedCutId?: string;
  language: AppLanguage;
  ListHeaderComponent?: ReactElement;
  onDragStateChange?: (dragging: boolean) => void;
  onPreview: (cut: ShootBoardCut) => void;
  onReorderCuts: (cuts: ShootBoardCut[]) => void;
  onResetCut: (cutId: string) => void;
  onSetFinalTake: (cut: ShootBoardCut, take: ShootBoardTake) => void;
  onShoot: (cut: ShootBoardCut, take?: ShootBoardTake) => void;
  onTake: (cut: ShootBoardCut, take?: ShootBoardTake) => void;
  onToggleChecklistItem: (
    cutId: string,
    itemId: string,
    checked: boolean,
  ) => void;
  onToggleExpanded: (cutId: string) => void;
  onUpdateCutText: (cutId: string, patch: ShootBoardCutTextPatch) => void;
  reorderMode: boolean;
}) {
  const orderedCuts = useMemo(
    () => [...cuts].sort((a, b) => a.order - b.order),
    [cuts],
  );

  const renderItem = ({
    drag,
    isActive,
    item: cut,
  }: RenderItemParams<ShootBoardCut>) => (
    <ScaleDecorator>
      <View style={[styles.row, isActive && styles.activeRow]}>
        <ShootBoardSceneCard
          cut={cut}
          expanded={expandedCutIds.includes(cut.id)}
          highlighted={highlightedCutId === cut.id}
          language={language}
          onDragStart={drag}
          onPreview={() => onPreview(cut)}
          onReset={() => onResetCut(cut.id)}
          onSetFinalTake={(take) => onSetFinalTake(cut, take)}
          onShoot={(take) => onShoot(cut, take)}
          onTake={(take) => onTake(cut, take)}
          onToggleChecklistItem={(itemId, checked) =>
            onToggleChecklistItem(cut.id, itemId, checked)
          }
          onToggleExpanded={() => onToggleExpanded(cut.id)}
          onUpdateText={(patch) => onUpdateCutText(cut.id, patch)}
          reorderMode={reorderMode || isActive}
        />
      </View>
    </ScaleDecorator>
  );

  return (
    <DraggableFlatList
      activationDistance={18}
      autoscrollSpeed={90}
      autoscrollThreshold={90}
      containerStyle={styles.list}
      contentContainerStyle={contentContainerStyle}
      data={orderedCuts}
      dragItemOverflow
      keyExtractor={(cut) => cut.id}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={ListHeaderComponent}
      onDragBegin={() => onDragStateChange?.(true)}
      onDragEnd={({ data }) => {
        onDragStateChange?.(false);
        onReorderCuts(data);
      }}
      onRelease={() => onDragStateChange?.(false)}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  activeRow: {
    opacity: 0.96,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
  },
  list: {
    flex: 1,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});
