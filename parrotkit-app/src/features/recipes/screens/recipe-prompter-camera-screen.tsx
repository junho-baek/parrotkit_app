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
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type DimensionValue,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MockProjectTake } from '@/core/mocks/parrotkit-data';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { hydrateExploreTemplateFilmingRecipe } from '@/features/explore/lib/explore-template-recipe-copy';
import {
  NativeTakeReview,
  type NativeTakeReviewStatus,
} from '@/features/recipes/components/native-take-review';
import { NativeTakeTray } from '@/features/recipes/components/native-take-tray';
import { createPrompterDraftBlock } from '@/features/recipes/lib/prompter-layout';
import { getPrompterSavedTakeReturnHref } from '@/features/recipes/lib/prompter-take-save-state';
import { getNextPrompterScrollOffset } from '@/features/recipes/lib/prompter-scroll';
import {
  getPrompterModeState,
  resolvePrompterModeSwitchState,
  type PrompterModeMaxOffsets,
} from '@/features/recipes/lib/prompter-mode-state';
import {
  canAdjustPrompterTextSize,
  getNextPrompterTextSizeLevel,
  getPrompterScriptTextStyle,
  getPrompterTextSizeMetrics,
  type PrompterTextSizeLevel,
} from '@/features/recipes/lib/prompter-text-size';
import {
  getActiveRecipePrompterCutText,
  getActiveRecipePrompterFullScript,
  getPrompterControlsLayoutModel,
  getPrompterUiTextRenderModel,
  type PrompterDisplayMode,
} from '@/features/recipes/lib/prompter-display';
import { ShootingSceneSwitcher } from '@/features/recipes/components/shooting-scene-switcher';
import { normalizeNativeRecipe } from '@/features/recipes/lib/recipe-domain-normalizer';
import { openTakeInShareSheet, saveTakeToGallery } from '@/features/recipes/lib/take-export';
import type { NativeRecipeScene, PrompterBlock } from '@/features/recipes/types/recipe-domain';

export function RecipePrompterCameraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    cutId?: string;
    lineToSay?: string;
    recipeId?: string;
    retakeTakeId?: string;
    sceneId?: string;
    shootingGuideline?: string;
    savedTemplateRecipeId?: string;
    source?: string;
    sourceRecipeId?: string;
  }>();
  const {
    addSceneProjectTake,
    deleteSceneProjectTake,
    getRecipeEditorBoard,
    getRecipeById,
    getSceneBestTake,
    getSceneTakeCollection,
    markSceneProjectTakeGallerySaved,
    markSceneProjectTakeShared,
    prompterModeStateByMode,
    prompterTextSizeLevel,
    setPrompterModePlaybackStatus,
    setPrompterModeScrollOffset,
    setPrompterModeSettings,
    setSceneBestProjectTake,
    setPrompterTextSizeLevel,
  } = useMockWorkspace();
  const [permission, requestPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const cameraRef = useRef<CameraView>(null);
  const recordingPromiseRef = useRef<Promise<{ uri: string } | undefined> | null>(null);
  const [facing, setFacing] = useState<CameraType>('front');
  const [recording, setRecording] = useState(false);
  const [reviewUri, setReviewUri] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<NativeTakeReviewStatus>('idle');
  const [reviewStatusMessage, setReviewStatusMessage] = useState('');
  const [savedReviewReturnHref, setSavedReviewReturnHref] = useState<string | null>(null);
  const [savingTake, setSavingTake] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [busyTakeId, setBusyTakeId] = useState<string | null>(null);
  const rawRecipe = hydrateExploreTemplateFilmingRecipe({
    getRecipeById,
    routeRecipeId: params.recipeId,
    savedTemplateRecipeId: params.savedTemplateRecipeId,
    source: params.source,
    sourceRecipeId: params.sourceRecipeId,
  });
  const recipe = useMemo(() => (rawRecipe ? normalizeNativeRecipe(rawRecipe) : null), [rawRecipe]);
  const shootBoard = recipe ? getRecipeEditorBoard(recipe.id) : null;
  const fullScript = useMemo(
    () => getActiveRecipePrompterFullScript({ recipe, shootBoard }),
    [recipe, shootBoard]
  );
  const [activeSceneId, setActiveSceneId] = useState(params.sceneId ?? recipe?.scenes[0]?.id ?? '');
  const [sceneBlocksById, setSceneBlocksById] = useState<Record<string, PrompterBlock[]>>({});
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [editRequestByBlockId, setEditRequestByBlockId] = useState<Record<string, number>>({});
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const prompterScrollRef = useRef<ScrollView>(null);
  const [prompterScrollOffset, setPrompterScrollOffset] = useState(0);
  const [prompterScrollMaxOffset, setPrompterScrollMaxOffset] = useState(0);
  const [prompterScrollMaxOffsetByMode, setPrompterScrollMaxOffsetByMode] =
    useState<PrompterModeMaxOffsets>({});
  const [prompterScrollViewportHeight, setPrompterScrollViewportHeight] = useState(0);
  const [prompterDisplayMode, setPrompterDisplayMode] = useState<PrompterDisplayMode>('card');

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
  const activeSceneIndex = useMemo(
    () => recipe && activeScene ? Math.max(0, recipe.scenes.findIndex((scene) => scene.id === activeScene.id)) : 0,
    [activeScene, recipe]
  );
  const previousScene = recipe && activeSceneIndex > 0 ? recipe.scenes[activeSceneIndex - 1] : null;
  const nextScene = recipe && activeSceneIndex < recipe.scenes.length - 1 ? recipe.scenes[activeSceneIndex + 1] : null;
  const sceneTakeCollection = recipe && activeScene ? getSceneTakeCollection(recipe.id, activeScene.id) : null;
  const bestTake = recipe && activeScene ? getSceneBestTake(recipe.id, activeScene.id) : null;
  const activeBlocks = activeScene ? sceneBlocksById[activeScene.id] ?? activeScene.prompter.blocks : [];
  const visibleBlocks = useMemo(
    () => activeBlocks.filter((block) => block.visible).sort((first, second) => first.order - second.order),
    [activeBlocks]
  );
  const hiddenBlocks = useMemo(
    () => activeBlocks.filter((block) => !block.visible).sort((first, second) => first.order - second.order),
    [activeBlocks]
  );
  const focusedBlock = useMemo(
    () => visibleBlocks.find((block) => block.id === focusedBlockId) ?? null,
    [focusedBlockId, visibleBlocks]
  );

  useEffect(() => {
    if (!recipe) return;

    setSceneBlocksById((current) => {
      const next = { ...current };

      recipe.scenes.forEach((scene) => {
        if (next[scene.id]) return;

        next[scene.id] = scene.prompter.blocks.map((block) => ({
          ...block,
          opacity: block.opacity ?? 0.92,
          scale: block.scale ?? 1,
        }));
      });

      return next;
    });
  }, [recipe]);

  useEffect(() => {
    setFocusedBlockId(visibleBlocks[0]?.id ?? null);
  }, [activeSceneId]);

  useEffect(() => {
    if (!focusedBlockId || visibleBlocks.some((block) => block.id === focusedBlockId)) {
      return;
    }

    setFocusedBlockId(visibleBlocks[0]?.id ?? null);
  }, [focusedBlockId, visibleBlocks]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace((recipe ? `/recipe/${recipe.id}` : '/(tabs)/recipes') as Href);
  }, [recipe, router]);

  const handleOverlayLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setContainerSize((current) => {
      if (Math.round(current.width) === Math.round(width) && Math.round(current.height) === Math.round(height)) {
        return current;
      }

      return { height, width };
    });
  }, []);

  const handleUpdateBlock = useCallback((blockId: string, updates: Partial<PrompterBlock>) => {
    if (!activeScene) return;

    setSceneBlocksById((current) => ({
      ...current,
      [activeScene.id]: (current[activeScene.id] ?? activeScene.prompter.blocks).map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      ),
    }));
  }, [activeScene]);

  const requestEditForBlock = useCallback((blockId: string) => {
    setFocusedBlockId(blockId);
    setEditRequestByBlockId((current) => ({
      ...current,
      [blockId]: Date.now(),
    }));
  }, []);

  const handleAddCue = useCallback(() => {
    if (!activeScene) return;

    setSceneBlocksById((current) => {
      const currentBlocks = current[activeScene.id] ?? activeScene.prompter.blocks;
      const order = currentBlocks.length;
      const blockId = `${activeScene.id}-cue-${Date.now()}`;
      const nextY = Math.min(0.74, 0.38 + (order % 4) * 0.1);
      const nextBlock = createPrompterDraftBlock({
        content: 'New cue',
        id: blockId,
        order,
        y: nextY,
      });

      setFocusedBlockId(blockId);

      return {
        ...current,
        [activeScene.id]: [...currentBlocks, nextBlock],
      };
    });
  }, [activeScene]);

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

  useEffect(() => {
    setReviewUri(null);
    setReviewStatus('idle');
    setReviewStatusMessage('');
    setSavedReviewReturnHref(null);
    setSavingTake(false);
    setSaveMessage('');
    setBusyTakeId(null);
  }, [activeSceneId, params.cutId, params.retakeTakeId]);

  useEffect(() => {
    if (prompterDisplayMode === 'full-script' && !fullScript.trim()) {
      setPrompterDisplayMode('card');
    }
  }, [fullScript, prompterDisplayMode]);

  useEffect(() => {
    const modeState = getPrompterModeState(prompterModeStateByMode, prompterDisplayMode);
    const modeMaxOffset = prompterScrollMaxOffsetByMode[prompterDisplayMode];
    const restoredOffset = Math.min(
      modeState.scrollOffset,
      typeof modeMaxOffset === 'number' ? modeMaxOffset : Number.MAX_SAFE_INTEGER
    );

    setPrompterScrollOffset(restoredOffset);
    setPrompterTextSizeLevel(modeState.textSizeLevel);
    prompterScrollRef.current?.scrollTo({ animated: false, y: restoredOffset });

    if (typeof modeMaxOffset === 'number' && restoredOffset !== modeState.scrollOffset) {
      setPrompterModeScrollOffset({
        maxOffset: modeMaxOffset,
        mode: prompterDisplayMode,
        scrollOffset: restoredOffset,
      });
    }
  }, [
    prompterDisplayMode,
    prompterModeStateByMode,
    prompterScrollMaxOffsetByMode,
    setPrompterModeScrollOffset,
    setPrompterTextSizeLevel,
  ]);

  const handlePrompterScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextOffset = event.nativeEvent.contentOffset.y;

    setPrompterScrollOffset(nextOffset);
    setPrompterModeScrollOffset({
      maxOffset: prompterScrollMaxOffset,
      mode: prompterDisplayMode,
      scrollOffset: nextOffset,
    });
  }, [prompterDisplayMode, prompterScrollMaxOffset, setPrompterModeScrollOffset]);

  const handlePrompterViewportLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;

    setPrompterScrollViewportHeight(height);
  }, []);

  const handlePrompterContentSizeChange = useCallback((_width: number, height: number) => {
    const nextMaxOffset = Math.max(0, height - prompterScrollViewportHeight);

    setPrompterScrollMaxOffset(nextMaxOffset);
    setPrompterScrollMaxOffsetByMode((current) => ({
      ...current,
      [prompterDisplayMode]: nextMaxOffset,
    }));
  }, [prompterDisplayMode, prompterScrollViewportHeight]);

  const scrollPrompterTo = useCallback((offset: number) => {
    const nextOffset = Math.min(Math.max(0, offset), prompterScrollMaxOffset);

    setPrompterScrollOffset(nextOffset);
    setPrompterModeScrollOffset({
      maxOffset: prompterScrollMaxOffset,
      mode: prompterDisplayMode,
      scrollOffset: nextOffset,
    });
    prompterScrollRef.current?.scrollTo({ animated: true, y: nextOffset });
  }, [prompterDisplayMode, prompterScrollMaxOffset, setPrompterModeScrollOffset]);

  const handleStepPrompterScroll = useCallback((direction: 'up' | 'down') => {
    scrollPrompterTo(getNextPrompterScrollOffset({
      currentOffset: prompterScrollOffset,
      direction,
      maxOffset: prompterScrollMaxOffset,
    }));
  }, [prompterScrollMaxOffset, prompterScrollOffset, scrollPrompterTo]);

  const handleResetPrompterScroll = useCallback(() => {
    scrollPrompterTo(0);
  }, [scrollPrompterTo]);

  const handlePrompterDisplayModeChange = useCallback((mode: PrompterDisplayMode) => {
    const switchState = resolvePrompterModeSwitchState({
      currentMaxOffset: prompterScrollMaxOffset,
      currentMode: prompterDisplayMode,
      currentScrollOffset: prompterScrollOffset,
      modeMaxOffsets: prompterScrollMaxOffsetByMode,
      requestedMode: mode,
      state: prompterModeStateByMode,
    });

    setPrompterModeScrollOffset({
      maxOffset: prompterScrollMaxOffset,
      mode: prompterDisplayMode,
      scrollOffset: prompterScrollOffset,
    });
    setPrompterScrollOffset(switchState.restoredScrollOffset);
    setPrompterTextSizeLevel(switchState.restoredModeState.textSizeLevel);
    setPrompterDisplayMode(mode);
    prompterScrollRef.current?.scrollTo({ animated: false, y: switchState.restoredScrollOffset });
  }, [
    prompterDisplayMode,
    prompterModeStateByMode,
    prompterScrollMaxOffset,
    prompterScrollMaxOffsetByMode,
    prompterScrollOffset,
    setPrompterModeScrollOffset,
    setPrompterTextSizeLevel,
  ]);

  const handleAdjustPrompterTextSize = useCallback((direction: 'decrease' | 'increase') => {
    const nextLevel = getNextPrompterTextSizeLevel({
      direction,
      level: prompterTextSizeLevel,
    });

    setPrompterTextSizeLevel(nextLevel);
    setPrompterModeSettings(prompterDisplayMode, { textSizeLevel: nextLevel });
  }, [prompterDisplayMode, prompterTextSizeLevel, setPrompterModeSettings, setPrompterTextSizeLevel]);

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
    setSavedReviewReturnHref(null);
    setReviewUri(null);
    setReviewStatus('idle');
    setReviewStatusMessage('');
    setRecording(true);
    setPrompterModePlaybackStatus(prompterDisplayMode, 'playing');

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
      setPrompterModePlaybackStatus(prompterDisplayMode, 'idle');
    }
  }, [
    microphonePermission,
    prompterDisplayMode,
    recording,
    requestMicrophonePermission,
    setPrompterModePlaybackStatus,
  ]);

  const handleRetryReview = useCallback(() => {
    setReviewUri(null);
    setReviewStatus('idle');
    setReviewStatusMessage('');
    setSavedReviewReturnHref(null);
    setSaveMessage('');
  }, []);

  const handleKeepTake = useCallback(() => {
    if (reviewStatus === 'kept') {
      if (savedReviewReturnHref) {
        router.replace(savedReviewReturnHref as Href);
        return;
      }

      handleBack();
      return;
    }

    if (!recipe || !activeScene || !reviewUri || savingTake) return;

    setSavingTake(true);
    setReviewStatus('saving');
    setReviewStatusMessage('Saving this take to the current cut.');

    try {
      const savedTake = addSceneProjectTake(recipe.id, activeScene.id, reviewUri, {
        activeCutId: typeof params.cutId === 'string' ? params.cutId : null,
      });
      const returnHref = getPrompterSavedTakeReturnHref({
        cutId: typeof params.cutId === 'string' ? params.cutId : null,
        recipeId: recipe.id,
        sceneId: activeScene.id,
        takeId: savedTake?.id,
      });

      setSavedReviewReturnHref(returnHref);
      setReviewStatus('kept');
      setReviewStatusMessage(`Saved locally in ${activeScene.title}.`);
      setSaveMessage(`Saved locally in ${activeScene.title}.`);
    } catch {
      setReviewStatus('failed');
      setReviewStatusMessage('Could not save this take locally. Try again.');
    } finally {
      setSavingTake(false);
    }
  }, [
    activeScene,
    addSceneProjectTake,
    handleBack,
    params.cutId,
    recipe,
    reviewStatus,
    reviewUri,
    router,
    savedReviewReturnHref,
    savingTake,
  ]);

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
  const activeCutText = activeScene
    ? getActiveRecipePrompterCutText({
      fallbackActionLine: getCameraActionLine(activeScene),
      fallbackLineToSay: getCameraPrimaryLine(activeScene),
      sceneId: activeScene.id,
      selectedCutId: typeof params.cutId === 'string' ? params.cutId : null,
      shootBoard,
    })
    : null;

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
                #{activeScene.sceneNumber} · {getCameraSceneRole(activeSceneIndex, recipe.scenes.length)} · {activeScene.endTime}
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
          <CameraCoachOverlay
            fullScript={fullScript}
            lineToSay={activeCutText?.lineToSay}
            recording={recording}
            scene={activeScene}
            sceneIndex={activeSceneIndex}
            shootingGuideline={activeCutText?.shootingGuideline}
            onPrompterContentSizeChange={handlePrompterContentSizeChange}
            onPrompterDisplayModeChange={handlePrompterDisplayModeChange}
            onPrompterScroll={handlePrompterScroll}
            onPrompterScrollDown={() => handleStepPrompterScroll('down')}
            onPrompterScrollReset={handleResetPrompterScroll}
            onPrompterScrollUp={() => handleStepPrompterScroll('up')}
            onPrompterTextSizeDecrease={() => handleAdjustPrompterTextSize('decrease')}
            onPrompterTextSizeIncrease={() => handleAdjustPrompterTextSize('increase')}
            onPrompterViewportLayout={handlePrompterViewportLayout}
            prompterCanScrollDown={prompterScrollOffset < prompterScrollMaxOffset}
            prompterCanScrollUp={prompterScrollOffset > 0}
            prompterDisplayMode={prompterDisplayMode}
            prompterScrollRef={prompterScrollRef}
            prompterTextSizeLevel={prompterTextSizeLevel}
            totalScenes={recipe.scenes.length}
          />
        </View>

        <View
          className="rounded-t-[30px] border border-white/10 bg-slate-950/78 px-4 pt-4"
          style={{ paddingBottom: insets.bottom + (Platform.OS === 'android' ? 12 : 4) }}
        >
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

          <View style={styles.cameraControlRow}>
            <PrompterStepButton
              disabled={!previousScene}
              label="Prev cut"
              onPress={() => {
                if (previousScene) setActiveSceneId(previousScene.id);
              }}
            />
            <CenterRecordButton
              disabled={Boolean(reviewUri)}
              onPress={handleRecordPress}
              recording={recording}
            />
            <PrompterStepButton
              disabled={!nextScene}
              label="Next cut"
              onPress={() => {
                if (nextScene) setActiveSceneId(nextScene.id);
              }}
            />
          </View>
        </View>
      </View>

      {reviewUri ? (
        <View style={styles.reviewOverlay}>
          <NativeTakeReview
            keepDisabled={savingTake}
            onKeep={handleKeepTake}
            onOpenIn={handleOpenReviewIn}
            onRetry={handleRetryReview}
            onSaveToGallery={handleSaveReviewToGallery}
            retryIconName="arrow-left"
            retryLabel={reviewStatus === 'kept' ? 'Record another' : 'Back'}
            status={reviewStatus}
            statusMessage={reviewStatusMessage}
            uri={reviewUri}
          />
        </View>
      ) : null}
    </View>
  );
}

function CameraCoachOverlay({
  fullScript,
  lineToSay,
  recording,
  scene,
  sceneIndex,
  shootingGuideline,
  onPrompterContentSizeChange,
  onPrompterDisplayModeChange,
  onPrompterScroll,
  onPrompterScrollDown,
  onPrompterScrollReset,
  onPrompterScrollUp,
  onPrompterTextSizeDecrease,
  onPrompterTextSizeIncrease,
  onPrompterViewportLayout,
  prompterCanScrollDown,
  prompterCanScrollUp,
  prompterDisplayMode,
  prompterScrollRef,
  prompterTextSizeLevel,
  totalScenes,
}: {
  fullScript?: string;
  lineToSay?: string;
  recording: boolean;
  scene: NativeRecipeScene;
  sceneIndex: number;
  shootingGuideline?: string;
  onPrompterContentSizeChange: (width: number, height: number) => void;
  onPrompterDisplayModeChange: (mode: PrompterDisplayMode) => void;
  onPrompterScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onPrompterScrollDown: () => void;
  onPrompterScrollReset: () => void;
  onPrompterScrollUp: () => void;
  onPrompterTextSizeDecrease: () => void;
  onPrompterTextSizeIncrease: () => void;
  onPrompterViewportLayout: (event: LayoutChangeEvent) => void;
  prompterCanScrollDown: boolean;
  prompterCanScrollUp: boolean;
  prompterDisplayMode: PrompterDisplayMode;
  prompterScrollRef: React.RefObject<ScrollView | null>;
  prompterTextSizeLevel: PrompterTextSizeLevel;
  totalScenes: number;
}) {
  const primaryLine = lineToSay?.trim() || getCameraPrimaryLine(scene);
  const actionLine = shootingGuideline?.trim() || getCameraActionLine(scene);
  const prompterUiText = getPrompterUiTextRenderModel({
    currentCutLines: getCameraPrompterLines(scene, primaryLine),
    fullScript,
    mode: prompterDisplayMode,
  });
  const prompterDisplay = prompterUiText.activeDisplay;
  const prompterDisplayModeOptions = prompterUiText.modeOptions;
  const textSizeMetrics = getPrompterTextSizeMetrics(prompterTextSizeLevel);
  const primaryScriptTextStyle = getPrompterScriptTextStyle({
    level: prompterTextSizeLevel,
    role: 'primary',
  });
  const secondaryScriptTextStyle = getPrompterScriptTextStyle({
    level: prompterTextSizeLevel,
    role: 'secondary',
  });
  const canDecreaseTextSize = canAdjustPrompterTextSize({
    direction: 'decrease',
    level: prompterTextSizeLevel,
  });
  const canIncreaseTextSize = canAdjustPrompterTextSize({
    direction: 'increase',
    level: prompterTextSizeLevel,
  });
  const progress = `${Math.max(12, ((sceneIndex + 1) / totalScenes) * 100)}%` as DimensionValue;
  const isFullScriptMode = prompterDisplay.mode === 'full-script';
  const prompterControlsLayout = getPrompterControlsLayoutModel({ mode: prompterDisplay.mode });

  return (
    <View pointerEvents="box-none" style={styles.coachOverlay}>
      <View pointerEvents="none">
        <View style={styles.coachTopRow}>
          <View style={styles.scenePill}>
            <Text style={styles.scenePillText}>
              Scene {sceneIndex + 1}/{totalScenes} · {getCameraSceneRole(sceneIndex, totalScenes)}
            </Text>
          </View>
          <View style={[styles.recPill, recording ? styles.recPillActive : null]}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>{recording ? 'REC' : 'READY'}</Text>
          </View>
        </View>

        <View style={styles.progressRail}>
          <View style={[styles.progressFill, { width: progress }]} />
        </View>
      </View>

      <View pointerEvents="box-none" style={styles.coachPromptStack}>
        <View pointerEvents="none" style={styles.actionCue}>
          <Text style={styles.coachLabel}>SHOOTING GUIDELINE</Text>
          <Text style={styles.actionText}>{actionLine}</Text>
        </View>

        <View style={styles.sayNowBlock}>
          <View style={styles.sayNowHeaderRow}>
            <Text style={styles.sayNowLabel}>{prompterDisplay.label}</Text>
          </View>

          <View
            accessibilityLabel="Persistent prompter controls"
            nativeID={`prompter-${prompterControlsLayout.controlsRegion}`}
            style={styles.prompterPersistentControlDock}
          >
            <View
              accessibilityLabel="Prompter view mode"
              style={styles.prompterModeSwitch}
            >
              {prompterDisplayModeOptions.map((option) => {
                const selected = prompterDisplay.mode === option.mode;

                return (
                  <Pressable
                    key={option.mode}
                    accessibilityLabel={`Show ${option.label.toLowerCase()} view`}
                    accessibilityRole="tab"
                    accessibilityState={{ disabled: option.disabled, selected }}
                    disabled={option.disabled}
                    onPress={() => onPrompterDisplayModeChange(option.mode)}
                    style={[
                      styles.prompterModeButton,
                      selected ? styles.prompterModeButtonSelected : null,
                      option.disabled ? styles.prompterModeButtonDisabled : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.prompterModeButtonText,
                        selected ? styles.prompterModeButtonTextSelected : null,
                        option.disabled ? styles.prompterModeButtonTextDisabled : null,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.prompterPersistentButtonRow}>
              <View style={styles.prompterTextSizeControls}>
                <PrompterControlButton
                  accessibilityLabel="Make prompter text smaller"
                  disabled={!canDecreaseTextSize}
                  iconName="format-font-size-decrease"
                  onPress={onPrompterTextSizeDecrease}
                />
                <Text style={styles.prompterTextSizeLabel}>{textSizeMetrics.label}</Text>
                <PrompterControlButton
                  accessibilityLabel="Make prompter text larger"
                  disabled={!canIncreaseTextSize}
                  iconName="format-font-size-increase"
                  onPress={onPrompterTextSizeIncrease}
                />
              </View>
              <View style={styles.prompterScrollControls}>
                <PrompterControlButton
                  accessibilityLabel="Scroll prompter up"
                  disabled={!prompterCanScrollUp}
                  iconName="chevron-up"
                  onPress={onPrompterScrollUp}
                />
                <PrompterControlButton
                  accessibilityLabel="Reset prompter scroll"
                  disabled={!prompterCanScrollUp}
                  iconName="format-vertical-align-top"
                  onPress={onPrompterScrollReset}
                />
                <PrompterControlButton
                  accessibilityLabel="Scroll prompter down"
                  disabled={!prompterCanScrollDown}
                  iconName="chevron-down"
                  onPress={onPrompterScrollDown}
                />
              </View>
            </View>
          </View>

          <ScrollView
            ref={prompterScrollRef}
            accessibilityLabel={isFullScriptMode ? 'Scrollable full script prompter copy' : 'Manual scrolling prompter copy'}
            bounces={false}
            contentContainerStyle={[
              styles.sayNowScrollContent,
              isFullScriptMode ? styles.sayNowFullScriptScrollContent : null,
            ]}
            nestedScrollEnabled
            onContentSizeChange={onPrompterContentSizeChange}
            onLayout={onPrompterViewportLayout}
            onScroll={onPrompterScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={prompterCanScrollDown || prompterCanScrollUp}
            style={[
              styles.sayNowScroll,
              isFullScriptMode ? styles.sayNowFullScriptScroll : null,
            ]}
          >
            {prompterDisplay.lines.map((line, index) => (
              <Text
                key={`${line}-${index}`}
                style={[
                  styles.sayNowText,
                  primaryScriptTextStyle,
                  index > 0
                    ? isFullScriptMode
                      ? styles.sayNowFullScriptParagraph
                      : [
                        styles.sayNowTextSecondary,
                        secondaryScriptTextStyle,
                      ]
                    : null,
                ]}
              >
                {line}
              </Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

function PrompterControlButton({
  accessibilityLabel,
  disabled,
  iconName,
  onPress,
}: {
  accessibilityLabel: string;
  disabled: boolean;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.prompterControlButton,
        disabled ? styles.prompterControlButtonDisabled : null,
        pressed && !disabled ? styles.prompterControlButtonPressed : null,
      ]}
    >
      <MaterialCommunityIcons color={disabled ? 'rgba(255,255,255,0.28)' : '#ffffff'} name={iconName} size={17} />
    </Pressable>
  );
}

function CenterRecordButton({
  disabled,
  onPress,
  recording,
}: {
  disabled: boolean;
  onPress: () => void;
  recording: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={recording ? 'Stop recording' : 'Record'}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.centerRecord,
        recording && styles.centerRecordActive,
        disabled && styles.centerRecordDisabled,
        pressed && styles.centerRecordPressed,
      ]}
    >
      <View style={[styles.centerRecordCore, recording && styles.centerRecordCoreActive]} />
      <Text style={styles.centerRecordLabel}>
        {recording ? 'Stop' : 'Record'}
      </Text>
    </Pressable>
  );
}

function PrompterStepButton({
  disabled,
  label,
  onPress,
}: {
  disabled: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.stepButton, disabled ? styles.stepButtonDisabled : styles.stepButtonEnabled]}
    >
      <Text style={[styles.stepButtonText, disabled ? styles.stepButtonTextDisabled : styles.stepButtonTextEnabled]}>
        {label}
      </Text>
    </Pressable>
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

function getCameraSceneRole(sceneIndex: number, totalScenes: number) {
  if (sceneIndex === 0) return 'Hook';
  if (sceneIndex === totalScenes - 1) return 'CTA';
  return 'Proof';
}

function getCameraPrimaryLine(scene: NativeRecipeScene) {
  return (
    scene.recipe.keyLine.trim()
    || scene.prompter.blocks.find((block) => block.type === 'key_line')?.content.trim()
    || scene.recipe.scriptLines[0]?.trim()
    || scene.recipe.appealPoint.trim()
    || scene.title
  );
}

function getCameraActionLine(scene: NativeRecipeScene) {
  return (
    scene.recipe.keyAction.trim()
    || scene.prompter.blocks.find((block) => block.type === 'action')?.content.trim()
    || scene.analysis.motionDescription?.trim()
    || 'Frame the subject and hold the beat.'
  );
}

function getCameraNextLine(scene: NativeRecipeScene) {
  return (
    scene.prompterLines?.[0]?.trim()
    || scene.recipe.scriptLines[1]?.trim()
    || scene.recipe.cta?.trim()
    || 'Hold for one beat before stopping.'
  );
}

function getCameraPrompterLines(scene: NativeRecipeScene, primaryLine: string) {
  const lines = [
    primaryLine,
    ...scene.recipe.scriptLines,
    ...scene.prompter.blocks
      .filter((block) => block.visible && block.type !== 'action')
      .sort((first, second) => first.order - second.order)
      .map((block) => block.content),
    getCameraNextLine(scene),
  ];

  return Array.from(new Set(lines.map((line) => line.trim()).filter(Boolean)));
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
  actionCue: {
    backgroundColor: 'rgba(249, 115, 22, 0.24)',
    borderColor: 'rgba(251, 146, 60, 0.58)',
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 24,
    marginTop: 6,
  },
  cameraControlRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  centerRecord: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 82,
  },
  centerRecordActive: {
    opacity: 0.98,
  },
  centerRecordCore: {
    backgroundColor: '#ef4444',
    borderColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 999,
    borderWidth: 5,
    height: 66,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    width: 66,
  },
  centerRecordCoreActive: {
    backgroundColor: '#991b1b',
    borderRadius: 18,
  },
  centerRecordDisabled: {
    opacity: 0.45,
  },
  centerRecordLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 6,
  },
  centerRecordPressed: {
    transform: [{ scale: 0.96 }],
  },
  coachLabel: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  coachOverlay: {
    bottom: 16,
    justifyContent: 'space-between',
    left: 18,
    position: 'absolute',
    right: 18,
    top: 18,
  },
  coachPromptStack: {
    gap: 16,
    justifyContent: 'center',
    marginBottom: 18,
  },
  coachTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nextCue: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.58)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 18,
    borderWidth: 1,
    maxWidth: 280,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  nextCueText: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
    marginTop: 3,
  },
  progressFill: {
    backgroundColor: '#a78bfa',
    borderRadius: 999,
    height: '100%',
  },
  progressRail: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 999,
    height: 3,
    marginTop: 14,
    overflow: 'hidden',
  },
  recDot: {
    backgroundColor: '#ef4444',
    borderRadius: 999,
    height: 7,
    width: 7,
  },
  prompterControlButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 999,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  prompterControlButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  prompterControlButtonPressed: {
    transform: [{ scale: 0.94 }],
  },
  prompterModeButton: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
    minWidth: 54,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  prompterModeButtonDisabled: {
    opacity: 0.42,
  },
  prompterModeButtonSelected: {
    backgroundColor: '#ffffff',
  },
  prompterModeButtonText: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 11,
    fontWeight: '900',
  },
  prompterModeButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.38)',
  },
  prompterModeButtonTextSelected: {
    color: '#020617',
  },
  prompterModeSwitch: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 3,
  },
  prompterPersistentButtonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  prompterPersistentControlDock: {
    gap: 8,
    marginTop: 12,
  },
  prompterScrollControls: {
    flexDirection: 'row',
    gap: 8,
  },
  prompterTextSizeControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  prompterTextSizeLabel: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 11,
    fontWeight: '900',
    minWidth: 34,
    textAlign: 'center',
  },
  recPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  recPillActive: {
    backgroundColor: 'rgba(127, 29, 29, 0.72)',
  },
  recText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  reviewOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  sayNowBlock: {
    backgroundColor: 'rgba(2, 6, 23, 0.74)',
    borderColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 28,
    borderWidth: 2,
    paddingHorizontal: 22,
    paddingVertical: 20,
  },
  sayNowHeaderRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  sayNowLabel: {
    color: '#a78bfa',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  sayNowScroll: {
    marginTop: 8,
    maxHeight: 168,
  },
  sayNowFullScriptScroll: {
    maxHeight: 244,
  },
  sayNowScrollContent: {
    paddingBottom: 8,
  },
  sayNowFullScriptScrollContent: {
    paddingBottom: 28,
  },
  sayNowText: {
    color: '#ffffff',
    fontWeight: '900',
    paddingRight: 8,
  },
  sayNowFullScriptParagraph: {
    marginTop: 16,
  },
  sayNowTextSecondary: {
    color: 'rgba(255, 255, 255, 0.78)',
    marginTop: 8,
  },
  scenePill: {
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  scenePillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  statusLabel: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    minWidth: 82,
    paddingHorizontal: 12,
  },
  stepButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepButtonEnabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  stepButtonText: {
    fontSize: 12,
    fontWeight: '900',
  },
  stepButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.28)',
  },
  stepButtonTextEnabled: {
    color: '#ffffff',
  },
});
