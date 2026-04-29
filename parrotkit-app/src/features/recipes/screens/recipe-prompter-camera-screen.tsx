import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
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
import { ShootingSceneSwitcher } from '@/features/recipes/components/shooting-scene-switcher';
import { getVisiblePrompterBlocks, normalizeNativeRecipe } from '@/features/recipes/lib/recipe-domain-normalizer';
import { openTakeInShareSheet, saveTakeToGallery } from '@/features/recipes/lib/take-export';
import { PrompterBlock } from '@/features/recipes/types/recipe-domain';

export function RecipePrompterCameraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ recipeId?: string; sceneId?: string }>();
  const {
    addScenePrompterBlock,
    addSceneProjectTake,
    deleteSceneProjectTake,
    getRecipeById,
    getSceneBestTake,
    getSceneTakeCollection,
    hideScenePrompterBlock,
    markSceneProjectTakeGallerySaved,
    markSceneProjectTakeShared,
    setSceneBestProjectTake,
    updateScenePrompterBlock,
  } = useMockWorkspace();
  const [permission, requestPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const cameraRef = useRef<CameraView>(null);
  const recordingPromiseRef = useRef<Promise<{ uri: string } | undefined> | null>(null);
  const [facing, setFacing] = useState<CameraType>('front');
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [editRequestByBlockId, setEditRequestByBlockId] = useState<Record<string, number>>({});
  const [recording, setRecording] = useState(false);
  const [reviewUri, setReviewUri] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<NativeTakeReviewStatus>('idle');
  const [reviewStatusMessage, setReviewStatusMessage] = useState('');
  const [savingTake, setSavingTake] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [busyTakeId, setBusyTakeId] = useState<string | null>(null);
  const rawRecipe = params.recipeId ? getRecipeById(params.recipeId) : null;
  const recipe = useMemo(() => (rawRecipe ? normalizeNativeRecipe(rawRecipe) : null), [rawRecipe]);
  const [activeSceneId, setActiveSceneId] = useState(params.sceneId ?? recipe?.scenes[0]?.id ?? '');

  useEffect(() => {
    if (!activeSceneId && recipe?.scenes[0]) {
      setActiveSceneId(recipe.scenes[0].id);
    }
  }, [activeSceneId, recipe]);

  useEffect(() => {
    if (params.sceneId) {
      setActiveSceneId(params.sceneId);
    }
  }, [params.sceneId]);

  const activeScene = useMemo(
    () => recipe?.scenes.find((scene) => scene.id === activeSceneId) ?? recipe?.scenes[0] ?? null,
    [activeSceneId, recipe]
  );
  const selectedBlocks = activeScene ? getVisiblePrompterBlocks(activeScene) : [];
  const hiddenBlocks = useMemo(
    () => activeScene?.prompter.blocks.filter((block) => !block.visible) ?? [],
    [activeScene]
  );
  const focusedBlock = useMemo(
    () => selectedBlocks.find((block) => block.id === focusedBlockId) ?? null,
    [focusedBlockId, selectedBlocks]
  );
  const sceneTakeCollection = recipe && activeScene ? getSceneTakeCollection(recipe.id, activeScene.id) : null;
  const bestTake = recipe && activeScene ? getSceneBestTake(recipe.id, activeScene.id) : null;

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace((recipe ? `/recipe/${recipe.id}` : '/(tabs)/recipes') as Href);
  }, [recipe, router]);

  useEffect(() => {
    if (focusedBlockId && !selectedBlocks.some((block) => block.id === focusedBlockId)) {
      setFocusedBlockId(selectedBlocks[0]?.id ?? null);
    }
  }, [focusedBlockId, selectedBlocks]);

  useEffect(() => {
    setReviewUri(null);
    setReviewStatus('idle');
    setReviewStatusMessage('');
    setSavingTake(false);
    setSaveMessage('');
    setBusyTakeId(null);
    setFocusedBlockId(null);
  }, [activeSceneId]);

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
    if (!recipe || !activeScene) return;

    updateScenePrompterBlock(recipe.id, activeScene.id, blockId, updates);
  }, [activeScene, recipe, updateScenePrompterBlock]);

  const requestEditForBlock = useCallback((blockId: string) => {
    setFocusedBlockId(blockId);
    setEditRequestByBlockId((current) => ({
      ...current,
      [blockId]: Date.now(),
    }));
  }, []);

  const handleAddCue = useCallback(() => {
    if (!recipe || !activeScene) return;

    const blockId = addScenePrompterBlock(recipe.id, activeScene.id);

    if (blockId) {
      setFocusedBlockId(blockId);
    }
  }, [activeScene, addScenePrompterBlock, recipe]);

  const handleHideFocusedCue = useCallback(() => {
    if (!recipe || !activeScene || !focusedBlock) return;

    hideScenePrompterBlock(recipe.id, activeScene.id, focusedBlock.id);
    setFocusedBlockId(null);
  }, [activeScene, focusedBlock, hideScenePrompterBlock, recipe]);

  const handleShowCue = useCallback((blockId: string) => {
    handleUpdateBlock(blockId, { visible: true });
    setFocusedBlockId(blockId);
  }, [handleUpdateBlock]);

  const handleScaleFocusedCue = useCallback((scale: number) => {
    if (!focusedBlock) return;

    handleUpdateBlock(focusedBlock.id, { scale });
  }, [focusedBlock, handleUpdateBlock]);

  const handleColorFocusedCue = useCallback((accentColor: string) => {
    if (!focusedBlock) return;

    handleUpdateBlock(focusedBlock.id, { accentColor });
  }, [focusedBlock, handleUpdateBlock]);

  const handleEditFocusedCue = useCallback(() => {
    if (!focusedBlock) return;

    requestEditForBlock(focusedBlock.id);
  }, [focusedBlock, requestEditForBlock]);

  const handleRecordPress = useCallback(async () => {
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
    setReviewStatus('idle');
    setReviewStatusMessage('');
    setRecording(true);

    const recordingPromise = camera.recordAsync({ maxDuration: 90 });
    recordingPromiseRef.current = recordingPromise;

    try {
      const result = await recordingPromise;

      if (result?.uri) {
        setReviewUri(result.uri);
        setReviewStatus('idle');
        setReviewStatusMessage('Keep it in this scene, or export only the take you like.');
      }
    } catch {
      setSaveMessage('Recording could not be saved. Try again.');
    } finally {
      if (recordingPromiseRef.current === recordingPromise) {
        recordingPromiseRef.current = null;
      }

      setRecording(false);
    }
  }, [microphonePermission, recording, requestMicrophonePermission]);

  const handleRetryReview = useCallback(() => {
    setReviewUri(null);
    setReviewStatus('idle');
    setReviewStatusMessage('');
    setSaveMessage('');
  }, []);

  const handleKeepTake = useCallback(() => {
    if (!recipe || !activeScene || !reviewUri || savingTake) return;

    setSavingTake(true);

    try {
      addSceneProjectTake(recipe.id, activeScene.id, reviewUri);
      setReviewUri(null);
      setReviewStatus('idle');
      setReviewStatusMessage('');
      setSaveMessage(`Kept locally in ${activeScene.title}.`);
    } finally {
      setSavingTake(false);
    }
  }, [activeScene, addSceneProjectTake, recipe, reviewUri, savingTake]);

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
    if (!recipe || !activeScene || busyTakeId) return;

    setBusyTakeId(take.id);
    setSaveMessage(`Saving ${take.label} to Gallery...`);

    const result = await saveTakeToGallery(take.uri);

    if (result.status === 'saved') {
      markSceneProjectTakeGallerySaved(recipe.id, activeScene.id, take.id);
    }

    setSaveMessage(result.message);
    setBusyTakeId(null);
  }, [activeScene, busyTakeId, markSceneProjectTakeGallerySaved, recipe]);

  const handleOpenTakeIn = useCallback(async (take: MockProjectTake) => {
    if (!recipe || !activeScene || busyTakeId) return;

    setBusyTakeId(take.id);
    setSaveMessage(`Opening ${take.label}...`);

    const result = await openTakeInShareSheet(take.uri);

    if (result.status === 'shared') {
      markSceneProjectTakeShared(recipe.id, activeScene.id, take.id);
    }

    setSaveMessage(result.message);
    setBusyTakeId(null);
  }, [activeScene, busyTakeId, markSceneProjectTakeShared, recipe]);

  const handleDeleteTake = useCallback((take: MockProjectTake) => {
    if (!recipe || !activeScene) return;

    deleteSceneProjectTake(recipe.id, activeScene.id, take.id);
    setSaveMessage(`${take.label} deleted.`);
  }, [activeScene, deleteSceneProjectTake, recipe]);

  const handleSetBestTake = useCallback((take: MockProjectTake) => {
    if (!recipe || !activeScene) return;

    setSceneBestProjectTake(recipe.id, activeScene.id, take.id);
    setSaveMessage(`${take.label} is best for this scene.`);
  }, [activeScene, recipe, setSceneBestProjectTake]);

  const statusLabel = saveMessage
    || (bestTake && sceneTakeCollection ? `${sceneTakeCollection.takes.length} local takes · Best ${bestTake.label}` : '')
    || (!microphonePermission?.granted ? 'Mic off: muted recording' : '');

  if (!recipe || !activeScene) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950 px-6">
        <Text className="text-[24px] font-black text-white">Prompter unavailable</Text>
        <Pressable className="mt-5 rounded-full border border-white/15 bg-white/10 px-5 py-3" onPress={handleBack}>
          <Text className="text-sm font-semibold text-white">Back</Text>
        </Pressable>
      </View>
    );
  }

  if (!permission) {
    return <View className="flex-1 bg-slate-950" />;
  }

  if (!permission.granted) {
    return <CameraPermissionGate onBack={handleBack} onRequest={requestPermission} />;
  }

  return (
    <View className="flex-1 bg-slate-950">
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
            <OverlayIconButton accessibilityLabel="Go back" iconName="arrow-left" onPress={handleBack} />

            <View className="max-w-[230px] rounded-full border border-white/15 bg-black/35 px-3 py-1.5">
              <Text className="text-[12px] font-semibold text-white/85" numberOfLines={1}>
                {recipe.title}
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
            {selectedBlocks.length ? (
              selectedBlocks.map((block) => (
                <NativePrompterBlockOverlay
                  key={block.id}
                  block={block}
                  containerSize={containerSize}
                  editingRequestedAt={editRequestByBlockId[block.id]}
                  focused={block.id === focusedBlock?.id}
                  onFocus={() => setFocusedBlockId(block.id)}
                  onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
                />
              ))
            ) : (
              <View className="mx-4 self-center rounded-[24px] border border-dashed border-white/20 bg-black/35 px-5 py-5" style={styles.emptyCueState}>
                <Text className="text-sm font-medium leading-6 text-white/70">
                  Add a cue to start shooting with prompts.
                </Text>
              </View>
            )}
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
              onScaleCue={handleScaleFocusedCue}
              onShowCue={handleShowCue}
            />
            <NativeRecordButton
              disabled={Boolean(reviewUri)}
              onPress={handleRecordPress}
              recording={recording}
            />
          </View>

          {statusLabel ? (
            <Text style={styles.statusLabel}>
              {statusLabel}
            </Text>
          ) : null}

          {sceneTakeCollection ? (
            <NativeTakeTray
              bestTakeId={sceneTakeCollection.bestTakeId}
              busyTakeId={busyTakeId}
              onDeleteTake={handleDeleteTake}
              onOpenIn={handleOpenTakeIn}
              onSaveToGallery={handleSaveTakeToGallery}
              onSetBestTake={handleSetBestTake}
              takes={sceneTakeCollection.takes}
              title="Scene takes"
            />
          ) : null}

          <ShootingSceneSwitcher
            activeSceneId={activeScene.id}
            onSelectScene={setActiveSceneId}
            scenes={recipe.scenes}
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
          Enable camera permission to open the native prompter view.
        </Text>

        <View className="mt-6 gap-3">
          <Pressable className="rounded-full bg-white px-5 py-3.5" onPress={onRequest}>
            <Text className="text-center text-sm font-bold text-slate-950">Allow camera</Text>
          </Pressable>

          <Pressable className="rounded-full border border-white/15 bg-white/5 px-5 py-3.5" onPress={onBack}>
            <Text className="text-center text-sm font-semibold text-white">Back to recipe</Text>
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
  emptyCueState: {
    top: '42%',
    maxWidth: 330,
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
