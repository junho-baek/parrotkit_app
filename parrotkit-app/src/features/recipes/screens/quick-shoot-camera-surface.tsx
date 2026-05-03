import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MockProjectTake } from '@/core/mocks/parrotkit-data';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { NativePrompterBlockOverlay } from '@/features/recipes/components/native-prompter-block-overlay';
import { NativePrompterToolbar } from '@/features/recipes/components/native-prompter-toolbar';
import { NativeRecordButton } from '@/features/recipes/components/native-record-button';
import {
  NativeTakeReview,
  type NativeTakeReviewStatus,
} from '@/features/recipes/components/native-take-review';
import { NativeTakeTray } from '@/features/recipes/components/native-take-tray';
import { openTakeInShareSheet, saveTakeToGallery } from '@/features/recipes/lib/take-export';
import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

export type QuickShootCameraSurfaceProps = {
  cameraActive: boolean;
  onBlocksChange?: (blocks: PrompterBlock[]) => void;
  onExitHome: () => void;
  onPrompterInteractionChange?: (active: boolean) => void;
};

const initialBlocks: PrompterBlock[] = [
  {
    accentColor: 'blue',
    content: 'Double-tap to write your line.',
    id: 'quick-cue-1',
    order: 0,
    positionPreset: 'center',
    scale: 1,
    size: 'lg',
    type: 'key_line',
    visible: true,
    x: 0.5,
    y: 0.44,
  },
];

export function QuickShootCameraSurface({
  cameraActive,
  onBlocksChange,
  onExitHome,
  onPrompterInteractionChange,
}: QuickShootCameraSurfaceProps) {
  const insets = useSafeAreaInsets();
  const {
    addQuickProjectTake,
    deleteQuickProjectTake,
    markQuickProjectTakeGallerySaved,
    markQuickProjectTakeShared,
    quickTakeProject,
    setQuickBestProjectTake,
  } = useMockWorkspace();
  const [permission, requestPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const cameraRef = useRef<CameraView>(null);
  const recordingPromiseRef = useRef<Promise<{ uri: string } | undefined> | null>(null);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [editRequestByBlockId, setEditRequestByBlockId] = useState<Record<string, number>>({});
  const [facing, setFacing] = useState<CameraType>('front');
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(initialBlocks[0]?.id ?? null);
  const [recording, setRecording] = useState(false);
  const [reviewUri, setReviewUri] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<NativeTakeReviewStatus>('idle');
  const [reviewStatusMessage, setReviewStatusMessage] = useState('');
  const [savingTake, setSavingTake] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [busyTakeId, setBusyTakeId] = useState<string | null>(null);

  useEffect(() => {
    onBlocksChange?.(blocks);
  }, [blocks, onBlocksChange]);

  const visibleBlocks = useMemo(
    () => blocks.filter((block) => block.visible).sort((first, second) => first.order - second.order),
    [blocks]
  );
  const hiddenBlocks = useMemo(
    () => blocks.filter((block) => !block.visible).sort((first, second) => first.order - second.order),
    [blocks]
  );
  const focusedBlock = useMemo(
    () => visibleBlocks.find((block) => block.id === focusedBlockId) ?? null,
    [focusedBlockId, visibleBlocks]
  );

  const handleOverlayLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setContainerSize((current) => {
      if (Math.round(current.width) === Math.round(width) && Math.round(current.height) === Math.round(height)) {
        return current;
      }

      return { width, height };
    });
  }, []);

  const handleUpdateBlock = useCallback((blockId: string, updates: Partial<PrompterBlock>) => {
    setBlocks((current) =>
      current.map((block) => (block.id === blockId ? { ...block, ...updates } : block))
    );
  }, []);

  const requestEditForBlock = useCallback((blockId: string) => {
    setFocusedBlockId(blockId);
    setEditRequestByBlockId((current) => ({
      ...current,
      [blockId]: Date.now(),
    }));
  }, []);

  const handleAddCue = useCallback(() => {
    setBlocks((current) => {
      const order = current.length;
      const blockId = `quick-cue-${Date.now()}`;
      const nextY = Math.min(0.72, 0.36 + (order % 4) * 0.1);
      const nextBlock: PrompterBlock = {
        accentColor: 'blue',
        content: 'New cue',
        id: blockId,
        order,
        positionPreset: 'center',
        scale: 1,
        size: 'lg',
        type: 'key_line',
        visible: true,
        x: 0.5,
        y: nextY,
      };

      setFocusedBlockId(blockId);

      return [...current, nextBlock];
    });
  }, []);

  const handleHideFocusedCue = useCallback(() => {
    if (!focusedBlock) return;

    handleUpdateBlock(focusedBlock.id, { visible: false });
    setFocusedBlockId(null);
  }, [focusedBlock, handleUpdateBlock]);

  const handleShowCue = useCallback((blockId: string) => {
    handleUpdateBlock(blockId, { visible: true });
    setFocusedBlockId(blockId);
  }, [handleUpdateBlock]);

  const handleScaleFocusedCue = useCallback((scale: number) => {
    if (!focusedBlock) return;

    handleUpdateBlock(focusedBlock.id, { scale });
  }, [focusedBlock, handleUpdateBlock]);

  const handleOpacityFocusedCue = useCallback((opacity: number) => {
    if (!focusedBlock) return;

    handleUpdateBlock(focusedBlock.id, { opacity });
  }, [focusedBlock, handleUpdateBlock]);

  const handleColorFocusedCue = useCallback((accentColor: string) => {
    if (!focusedBlock) return;

    handleUpdateBlock(focusedBlock.id, { accentColor });
  }, [focusedBlock, handleUpdateBlock]);

  const handleEditFocusedCue = useCallback(() => {
    if (!focusedBlock) return;

    requestEditForBlock(focusedBlock.id);
  }, [focusedBlock, requestEditForBlock]);

  const resetTakeReview = useCallback(() => {
    setReviewStatus('idle');
    setReviewStatusMessage('');
  }, []);

  const handleRecordPress = useCallback(async () => {
    if (!cameraActive) {
      setSaveMessage('Slide fully into Quick Shoot to record.');
      return;
    }

    if (recording) {
      cameraRef.current?.stopRecording();
      return;
    }

    if (microphonePermission?.canAskAgain && !microphonePermission.granted) {
      await requestMicrophonePermission();
    }

    const camera = cameraRef.current;

    if (!camera) return;

    setSaveMessage('');
    setReviewUri(null);
    resetTakeReview();
    setRecording(true);

    const recordingPromise = camera.recordAsync({ maxDuration: 90 });
    recordingPromiseRef.current = recordingPromise;

    try {
      const result = await recordingPromise;

      if (result?.uri) {
        setReviewUri(result.uri);
        setReviewStatus('idle');
        setReviewStatusMessage('Keep this take in Quick Shoot, or export it now.');
      }
    } catch {
      setSaveMessage('Recording could not be saved. Try again.');
    } finally {
      if (recordingPromiseRef.current === recordingPromise) {
        recordingPromiseRef.current = null;
      }

      setRecording(false);
    }
  }, [
    cameraActive,
    microphonePermission,
    recording,
    requestMicrophonePermission,
    resetTakeReview,
  ]);

  const handleRetryReview = useCallback(() => {
    setReviewUri(null);
    resetTakeReview();
    setSaveMessage('');
  }, [resetTakeReview]);

  const handleKeepTake = useCallback(() => {
    if (!reviewUri || savingTake) return;

    setSavingTake(true);

    try {
      addQuickProjectTake(reviewUri);
      setReviewUri(null);
      resetTakeReview();
      setSaveMessage('Kept locally in Quick Shoot.');
    } finally {
      setSavingTake(false);
    }
  }, [addQuickProjectTake, resetTakeReview, reviewUri, savingTake]);

  const handleSaveReviewToGallery = useCallback(async () => {
    if (!reviewUri) return;

    setReviewStatus('saving');
    setReviewStatusMessage('Saving this take to native Gallery.');

    const result = await saveTakeToGallery(reviewUri);

    setReviewStatus(result.status === 'saved' ? 'saved' : result.status === 'denied' ? 'denied' : 'failed');
    setReviewStatusMessage(result.message);
    setSaveMessage(result.message);
  }, [reviewUri]);

  const handleOpenReviewIn = useCallback(async () => {
    if (!reviewUri) return;

    setReviewStatus('saving');
    setReviewStatusMessage('Opening share sheet.');

    const result = await openTakeInShareSheet(reviewUri);

    setReviewStatus(result.status === 'shared' ? 'shared' : result.status === 'cancelled' ? 'idle' : 'failed');
    setReviewStatusMessage(result.message);
    setSaveMessage(result.message);
  }, [reviewUri]);

  const handleSaveTakeToGallery = useCallback(async (take: MockProjectTake) => {
    if (busyTakeId) return;

    setBusyTakeId(take.id);
    setSaveMessage(`Saving ${take.label} to Gallery...`);

    const result = await saveTakeToGallery(take.uri);

    if (result.status === 'saved') {
      markQuickProjectTakeGallerySaved(take.id);
    }

    setSaveMessage(result.message);
    setBusyTakeId(null);
  }, [busyTakeId, markQuickProjectTakeGallerySaved]);

  const handleOpenTakeIn = useCallback(async (take: MockProjectTake) => {
    if (busyTakeId) return;

    setBusyTakeId(take.id);
    setSaveMessage(`Opening ${take.label}...`);

    const result = await openTakeInShareSheet(take.uri);

    if (result.status === 'shared') {
      markQuickProjectTakeShared(take.id);
    }

    setSaveMessage(result.message);
    setBusyTakeId(null);
  }, [busyTakeId, markQuickProjectTakeShared]);

  const handleDeleteTake = useCallback((take: MockProjectTake) => {
    deleteQuickProjectTake(take.id);
    setSaveMessage(`${take.label} deleted.`);
  }, [deleteQuickProjectTake]);

  const handleSetBestTake = useCallback((take: MockProjectTake) => {
    setQuickBestProjectTake(take.id);
    setSaveMessage(`${take.label} is best for Quick Shoot.`);
  }, [setQuickBestProjectTake]);

  const statusLabel = saveMessage
    || (quickTakeProject.takes.length ? `${quickTakeProject.takes.length} local takes` : '')
    || (cameraActive && !microphonePermission?.granted ? 'Mic off: muted recording' : '');

  if (cameraActive && !permission) {
    return <View className="flex-1 bg-slate-950" />;
  }

  if (cameraActive && permission && !permission.granted) {
    return <CameraPermissionGate onBack={onExitHome} onRequest={requestPermission} />;
  }

  return (
    <View className="flex-1 overflow-hidden bg-slate-950">
      {cameraActive && permission?.granted ? (
        <CameraView
          ref={cameraRef}
          active
          animateShutter={false}
          facing={facing}
          mirror={facing === 'front'}
          mode="video"
          mute={!microphonePermission?.granted}
          style={styles.camera}
        />
      ) : (
        <DormantCameraSurface />
      )}

      <LinearGradient
        colors={['rgba(2,6,23,0.72)', 'rgba(2,6,23,0)']}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
        start={{ x: 0.5, y: 0 }}
        style={styles.topFade}
      />
      <LinearGradient
        colors={['rgba(2,6,23,0)', 'rgba(2,6,23,0.9)']}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
        start={{ x: 0.5, y: 0 }}
        style={styles.bottomFade}
      />

      <View className="flex-1 justify-between" style={styles.content}>
        <View className="px-4" style={{ paddingTop: insets.top + (Platform.OS === 'android' ? 14 : 6) }}>
          <View className="flex-row items-center justify-between">
            <OverlayIconButton accessibilityLabel="Go back" iconName="arrow-left" onPress={onExitHome} />

            <View className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5">
              <Text className="text-[12px] font-semibold text-white/85" numberOfLines={1}>
                Quick Shoot
              </Text>
            </View>

            <OverlayIconButton
              accessibilityLabel="Flip camera"
              iconName="camera-flip-outline"
              onPress={() => setFacing((current) => (current === 'back' ? 'front' : 'back'))}
            />
          </View>
        </View>

        <View pointerEvents="box-none" className="flex-1" onLayout={handleOverlayLayout}>
          <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            {visibleBlocks.map((block) => (
              <NativePrompterBlockOverlay
                key={block.id}
                block={block}
                containerSize={containerSize}
                editingRequestedAt={editRequestByBlockId[block.id]}
                focused={block.id === focusedBlock?.id}
                onFocus={() => setFocusedBlockId(block.id)}
                onInteractionActiveChange={onPrompterInteractionChange}
                onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
              />
            ))}
          </View>
        </View>

        <View
          className="rounded-t-[30px] border border-white/10 bg-slate-950/72 px-4 pt-4"
          style={{ paddingBottom: insets.bottom + (Platform.OS === 'android' ? 12 : 4) }}
        >
          <View className="mb-3 flex-row items-center justify-between gap-3">
            <NativePrompterToolbar
              focusedBlock={focusedBlock}
              hiddenBlocks={hiddenBlocks}
              onAddCue={handleAddCue}
              onColorCue={handleColorFocusedCue}
              onEditCue={handleEditFocusedCue}
              onHideCue={handleHideFocusedCue}
              onOpacityCue={handleOpacityFocusedCue}
              onScaleCue={handleScaleFocusedCue}
              onShowCue={handleShowCue}
            />
            <NativeRecordButton
              disabled={!cameraActive || Boolean(reviewUri)}
              onPress={handleRecordPress}
              recording={recording}
            />
          </View>

          {statusLabel ? (
            <Text style={styles.statusLabel}>
              {statusLabel}
            </Text>
          ) : null}

          <NativeTakeTray
            bestTakeId={quickTakeProject.bestTakeId}
            busyTakeId={busyTakeId}
            onDeleteTake={handleDeleteTake}
            onOpenIn={handleOpenTakeIn}
            onSaveToGallery={handleSaveTakeToGallery}
            onSetBestTake={handleSetBestTake}
            takes={quickTakeProject.takes}
            title="Quick takes"
          />
        </View>
      </View>

      {reviewUri ? (
        <View style={styles.reviewOverlay}>
          <NativeTakeReview
            keepDisabled={savingTake}
            keepLabel={savingTake ? 'Keeping...' : 'Keep'}
            onKeep={handleKeepTake}
            onOpenIn={handleOpenReviewIn}
            onRetry={handleRetryReview}
            onSaveToGallery={handleSaveReviewToGallery}
            status={reviewStatus}
            statusMessage={reviewStatusMessage}
            uri={reviewUri}
          />
        </View>
      ) : null}
    </View>
  );
}

function DormantCameraSurface() {
  return (
    <View style={styles.dormantCamera}>
      <LinearGradient
        colors={['#0f172a', '#020617', '#111827']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.dormantLens}>
        <MaterialCommunityIcons color="rgba(255,255,255,0.82)" name="camera-iris" size={52} />
      </View>
    </View>
  );
}

function CameraPermissionGate({
  onRequest,
  onBack,
}: {
  onRequest: () => void;
  onBack: () => void;
}) {
  return (
    <View className="flex-1 justify-center bg-slate-950 px-6">
      <View className="rounded-[32px] border border-white/10 bg-white/5 px-6 py-7">
        <Text className="text-[28px] font-black text-white">Camera access</Text>
        <Text className="mt-3 text-sm leading-6 text-white/70">
          Enable camera permission to open quick shoot.
        </Text>

        <View className="mt-6 gap-3">
          <Pressable className="rounded-full bg-white px-5 py-3.5" onPress={onRequest}>
            <Text className="text-center text-sm font-bold text-slate-950">Allow camera</Text>
          </Pressable>

          <Pressable className="rounded-full border border-white/15 bg-white/5 px-5 py-3.5" onPress={onBack}>
            <Text className="text-center text-sm font-semibold text-white">Back home</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function OverlayIconButton({
  iconName,
  onPress,
  accessibilityLabel,
}: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      className="h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/35"
      onPress={onPress}
    >
      <MaterialCommunityIcons color="#fff" name={iconName} size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  camera: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  content: {
    zIndex: 2,
  },
  dormantCamera: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  dormantLens: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 999,
    borderWidth: 1,
    height: 112,
    justifyContent: 'center',
    width: 112,
  },
  bottomFade: {
    bottom: 0,
    height: 320,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  topFade: {
    height: 180,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  reviewOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  statusLabel: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
});
