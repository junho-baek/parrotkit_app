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
  Animated,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type DimensionValue,
  type GestureResponderEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MockProjectTake } from '@/core/mocks/parrotkit-data';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import {
  NativeTakeReview,
  type NativeTakeReviewStatus,
} from '@/features/recipes/components/native-take-review';
import { createPrompterDraftBlock } from '@/features/recipes/lib/prompter-layout';
import { normalizeNativeRecipe } from '@/features/recipes/lib/recipe-domain-normalizer';
import { openTakeInShareSheet, saveTakeToGallery } from '@/features/recipes/lib/take-export';
import type { NativeRecipeScene, PrompterBlock } from '@/features/recipes/types/recipe-domain';

type PrompterColorPreset = 'white' | 'purple' | 'yellow' | 'blue';
type PrompterStylePreset = 'clean' | 'bold' | 'caption' | 'teleprompter';
type PrompterMode = 'center' | 'top';

const PROMPTER_SPEEDS = [0.5, 1, 1.25, 1.5, 2] as const;
const PROMPTER_OPACITIES = [0.32, 0.48, 0.64, 0.78] as const;
const PROMPTER_COLORS: PrompterColorPreset[] = ['white', 'purple', 'yellow', 'blue'];
const PROMPTER_STYLES: PrompterStylePreset[] = ['clean', 'bold', 'caption', 'teleprompter'];
const MIN_PROMPTER_FONT_SIZE = 28;
const MAX_PROMPTER_FONT_SIZE = 72;

export function RecipePrompterCameraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    lineToSay?: string;
    recipeId?: string;
    sceneId?: string;
    shootingGuideline?: string;
  }>();
  const {
    addSceneProjectTake,
    deleteSceneProjectTake,
    getRecipeById,
    getSceneBestTake,
    getSceneTakeCollection,
    markSceneProjectTakeGallerySaved,
    markSceneProjectTakeShared,
    setSceneBestProjectTake,
  } = useMockWorkspace();
  const [permission, requestPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const cameraRef = useRef<CameraView>(null);
  const recordingPromiseRef = useRef<Promise<{ uri: string } | undefined> | null>(null);
  const scriptScrollY = useRef(new Animated.Value(0)).current;
  const lastScriptTapAtRef = useRef(0);
  const pinchDistanceRef = useRef<number | null>(null);
  const pinchFontSizeRef = useRef(36);
  const [facing, setFacing] = useState<CameraType>('front');
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
  const [sceneBlocksById, setSceneBlocksById] = useState<Record<string, PrompterBlock[]>>({});
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [prompterMode, setPrompterMode] = useState<PrompterMode>('center');
  const [prompterSpeed, setPrompterSpeed] = useState(1.25);
  const [prompterPaused, setPrompterPaused] = useState(false);
  const [prompterFontSize, setPrompterFontSize] = useState(36);
  const [prompterOpacity, setPrompterOpacity] = useState(0.48);
  const [prompterColor, setPrompterColor] = useState<PrompterColorPreset>('white');
  const [prompterStyle, setPrompterStyle] = useState<PrompterStylePreset>('teleprompter');
  const [scriptEditVisible, setScriptEditVisible] = useState(false);
  const [scriptEditDraft, setScriptEditDraft] = useState('');
  const [newClueVisible, setNewClueVisible] = useState(false);
  const [newClueDraft, setNewClueDraft] = useState('');
  const [teleprompterHintVisible, setTeleprompterHintVisible] = useState(true);

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
  const focusedBlock = useMemo(
    () => visibleBlocks.find((block) => block.id === focusedBlockId) ?? null,
    [focusedBlockId, visibleBlocks]
  );
  const currentScript = useMemo(
    () => activeScene ? getTeleprompterScript(activeScene, visibleBlocks, params) : '',
    [activeScene, params, visibleBlocks]
  );
  const nextScript = nextScene ? getCameraPrimaryLine(nextScene) : '촬영 완료 후 마음에 드는 take를 저장하세요.';
  const progress = `${Math.max(6, (((activeSceneIndex + 1) / Math.max(recipe?.scenes.length ?? 1, 1)) * 100))}%` as DimensionValue;
  const prompterTheme = getPrompterTheme(prompterColor, prompterOpacity);
  const prompterTypography = getPrompterTypography(prompterStyle, prompterFontSize);

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

  const handleUpdateBlock = useCallback((blockId: string, updates: Partial<PrompterBlock>) => {
    if (!activeScene) return;

    setSceneBlocksById((current) => ({
      ...current,
      [activeScene.id]: (current[activeScene.id] ?? activeScene.prompter.blocks).map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      ),
    }));
  }, [activeScene]);

  const openScriptEditor = useCallback(() => {
    setScriptEditDraft(focusedBlock?.content ?? currentScript);
    setScriptEditVisible(true);
  }, [currentScript, focusedBlock]);

  const saveScriptEdit = useCallback(() => {
    if (!activeScene) return;

    const nextContent = scriptEditDraft.trim();
    if (!nextContent) {
      setScriptEditVisible(false);
      return;
    }

    if (focusedBlock) {
      handleUpdateBlock(focusedBlock.id, { content: nextContent });
    } else {
      const blockId = `${activeScene.id}-line-${Date.now()}`;
      setSceneBlocksById((current) => {
        const currentBlocks = current[activeScene.id] ?? activeScene.prompter.blocks;
        return {
          ...current,
          [activeScene.id]: [
            ...currentBlocks,
            createPrompterDraftBlock({
              content: nextContent,
              id: blockId,
              order: currentBlocks.length,
            }),
          ],
        };
      });
      setFocusedBlockId(blockId);
    }

    setScriptEditVisible(false);
  }, [activeScene, focusedBlock, handleUpdateBlock, scriptEditDraft]);

  const saveNewClue = useCallback(() => {
    if (!activeScene) return;

    const content = newClueDraft.trim();
    if (!content) {
      setNewClueVisible(false);
      return;
    }

    setSceneBlocksById((current) => {
      const currentBlocks = current[activeScene.id] ?? activeScene.prompter.blocks;
      const blockId = `${activeScene.id}-clue-${Date.now()}`;
      const nextBlock = createPrompterDraftBlock({
        content,
        id: blockId,
        order: currentBlocks.length,
        y: 0.62,
      });

      setFocusedBlockId(blockId);

      return {
        ...current,
        [activeScene.id]: [...currentBlocks, nextBlock],
      };
    });
    setNewClueDraft('');
    setNewClueVisible(false);
  }, [activeScene, newClueDraft]);

  useEffect(() => {
    setReviewUri(null);
    setReviewStatus('idle');
    setReviewStatusMessage('');
    setSavingTake(false);
    setSaveMessage('');
    setBusyTakeId(null);
    scriptScrollY.setValue(0);
  }, [activeSceneId]);

  useEffect(() => {
    scriptScrollY.stopAnimation();
    scriptScrollY.setValue(0);

    if (!recording || prompterPaused) {
      return;
    }

    const duration = Math.max(5800, Math.round((currentScript.length * 86) / prompterSpeed));
    const animation = Animated.timing(scriptScrollY, {
      duration,
      toValue: -42,
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished && nextScene) {
        setActiveSceneId(nextScene.id);
      }
    });

    return () => {
      animation.stop();
    };
  }, [currentScript, nextScene, prompterPaused, prompterSpeed, recording, scriptScrollY]);

  const prompterPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (event, gestureState) =>
          event.nativeEvent.touches.length > 1 ||
          Math.abs(gestureState.dy) > 12,
        onPanResponderGrant: (event) => {
          if (event.nativeEvent.touches.length >= 2) {
            pinchDistanceRef.current = getTouchDistance(event);
            pinchFontSizeRef.current = prompterFontSize;
          }
        },
        onPanResponderMove: (event, gestureState) => {
          if (event.nativeEvent.touches.length >= 2) {
            const initialDistance = pinchDistanceRef.current;
            const currentDistance = getTouchDistance(event);

            if (initialDistance && currentDistance) {
              const ratio = currentDistance / initialDistance;
              setPrompterFontSize(clampPrompterFontSize(pinchFontSizeRef.current * ratio));
            }
            return;
          }

          if (gestureState.dy < -56) {
            setTeleprompterHintVisible(false);
            setPrompterMode('top');
          }

          if (gestureState.dy > 56) {
            setPrompterMode('center');
          }
        },
        onPanResponderRelease: (_event, gestureState) => {
          if (gestureState.dy < -42) {
            setPrompterMode('top');
          }

          if (gestureState.dy > 42) {
            setPrompterMode('center');
          }

          pinchDistanceRef.current = null;
        },
      }),
    [prompterFontSize],
  );

  const handleScriptPress = useCallback(() => {
    const now = Date.now();

    if (now - lastScriptTapAtRef.current < 520) {
      openScriptEditor();
    }

    lastScriptTapAtRef.current = now;
  }, [openScriptEditor]);

  const adjustPrompterSpeed = useCallback((direction: -1 | 1) => {
    setPrompterSpeed((current) => {
      const currentIndex = PROMPTER_SPEEDS.findIndex((speed) => speed === current);
      const safeIndex = currentIndex >= 0 ? currentIndex : 2;
      const nextIndex = Math.min(PROMPTER_SPEEDS.length - 1, Math.max(0, safeIndex + direction));

      return PROMPTER_SPEEDS[nextIndex];
    });
  }, []);

  const goToScene = useCallback((scene: NativeRecipeScene | null) => {
    if (!scene) return;

    setActiveSceneId(scene.id);
    setPrompterPaused(false);
  }, []);

  const cyclePrompterOpacity = useCallback(() => {
    setPrompterOpacity((current) => getNextValue(PROMPTER_OPACITIES, current));
  }, []);

  const cyclePrompterColor = useCallback(() => {
    setPrompterColor((current) => getNextValue(PROMPTER_COLORS, current));
  }, []);

  const cyclePrompterStyle = useCallback(() => {
    setPrompterStyle((current) => getNextValue(PROMPTER_STYLES, current));
  }, []);

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

      <View style={styles.content}>
        <View style={[styles.teleprompterTopBar, { paddingTop: insets.top + (Platform.OS === 'android' ? 14 : 6) }]}>
          <OverlayIconButton accessibilityLabel="Close shooting" iconName="close" onPress={handleBack} />

          <View style={styles.teleprompterSceneCluster}>
            <View style={styles.teleprompterScenePill}>
              <Text style={styles.teleprompterSceneText}>
                씬 {activeSceneIndex + 1}/{recipe.scenes.length}
              </Text>
              <View style={styles.teleprompterSceneDot} />
            </View>
            <View style={styles.teleprompterProgressRail}>
              <View style={[styles.teleprompterProgressFill, { width: progress }]} />
            </View>
          </View>

          <OverlayIconButton
            accessibilityLabel="Flip camera"
            iconName="camera-flip-outline"
            onPress={() => setFacing((current) => (current === 'back' ? 'front' : 'back'))}
          />
        </View>

        <View
          pointerEvents="box-none"
          style={[
            styles.teleprompterStage,
            prompterMode === 'top' ? styles.teleprompterStageTop : styles.teleprompterStageCenter,
          ]}
        >
          <Pressable
            accessibilityRole="button"
            onPress={handleScriptPress}
            style={[
              styles.scriptPanel,
              {
                backgroundColor: prompterTheme.panelBackground,
                borderColor: prompterTheme.borderColor,
              },
              prompterMode === 'top' ? styles.scriptPanelTop : null,
            ]}
            {...prompterPanResponder.panHandlers}
          >
            <View style={styles.dragHandle} />
            {teleprompterHintVisible ? (
              <Text style={styles.teleprompterHint}>위로 올리면 텔레프롬프터 모드</Text>
            ) : null}
            <Animated.View style={{ transform: [{ translateY: scriptScrollY }] }}>
              <Text
                style={[
                  styles.scriptText,
                  {
                    color: prompterTheme.textColor,
                    fontSize: prompterTypography.fontSize,
                    fontWeight: prompterTypography.fontWeight,
                    lineHeight: prompterTypography.lineHeight,
                  },
                ]}
              >
                {currentScript}
              </Text>
            </Animated.View>
            <View style={styles.nextScriptBlock}>
              <Text style={styles.nextScriptLabel}>다음 컷 자동 이어짐</Text>
              <Text numberOfLines={3} style={styles.nextScriptText}>{nextScript}</Text>
            </View>
          </Pressable>
        </View>

        <View style={[styles.teleprompterBottomDock, { paddingBottom: insets.bottom + (Platform.OS === 'android' ? 12 : 8) }]}>
          {statusLabel ? <Text style={styles.statusLabel}>{statusLabel}</Text> : null}

          <View style={styles.speedDock}>
            <View>
              <Text style={styles.speedLabel}>속도</Text>
              <Text style={styles.speedValue}>{prompterSpeed.toFixed(prompterSpeed % 1 === 0 ? 1 : 2)}x</Text>
            </View>
            <RoundControlButton iconName="minus" onPress={() => adjustPrompterSpeed(-1)} />
            <RoundControlButton
              iconName={prompterPaused ? 'play' : 'pause'}
              onPress={() => setPrompterPaused((current) => !current)}
              prominent
            />
            <RoundControlButton iconName="plus" onPress={() => adjustPrompterSpeed(1)} />
          </View>

          <View style={styles.recordDock}>
            <CutStepButton
              disabled={!previousScene}
              iconName="skip-previous-outline"
              label="이전 컷"
              onPress={() => goToScene(previousScene)}
            />
            <CenterRecordButton
              disabled={Boolean(reviewUri)}
              onPress={handleRecordPress}
              recording={recording}
            />
            <CutStepButton
              disabled={!nextScene}
              iconName="skip-next-outline"
              label="다음 컷"
              onPress={() => goToScene(nextScene)}
            />
          </View>

          <View style={styles.paletteDock}>
            <PaletteButton iconName="plus" label="New clue" onPress={() => setNewClueVisible(true)} />
            <PaletteButton iconName="checkerboard" label="투명도" onPress={cyclePrompterOpacity} />
            <PaletteButton iconName="circle" label="색상" onPress={cyclePrompterColor} tint={prompterTheme.textColor} />
            <PaletteButton iconName="format-letter-case" label="스타일" onPress={cyclePrompterStyle} />
          </View>
        </View>
      </View>

      {reviewUri ? (
        <View style={styles.reviewOverlay}>
          <NativeTakeReview
            keepDisabled={savingTake}
            keepLabel={savingTake ? 'Saving...' : 'Use take'}
            onKeep={handleKeepTake}
            onOpenIn={handleOpenReviewIn}
            onRetry={handleRetryReview}
            onSaveToGallery={handleSaveReviewToGallery}
            retryIconName="arrow-left"
            retryLabel="Back"
            status={reviewStatus}
            statusMessage={reviewStatusMessage}
            uri={reviewUri}
          />
        </View>
      ) : null}

      <PromptTextModal
        ctaLabel="완료"
        onChangeText={setScriptEditDraft}
        onClose={() => setScriptEditVisible(false)}
        onSubmit={saveScriptEdit}
        placeholder="대본을 수정하세요"
        title="대본 수정"
        value={scriptEditDraft}
        visible={scriptEditVisible}
      />
      <PromptTextModal
        ctaLabel="추가"
        onChangeText={setNewClueDraft}
        onClose={() => setNewClueVisible(false)}
        onSubmit={saveNewClue}
        placeholder="어떤 멘트를 추가할까요?"
        title="New clue"
        value={newClueDraft}
        visible={newClueVisible}
      />
    </View>
  );
}

function CameraCoachOverlay({
  lineToSay,
  recording,
  scene,
  sceneIndex,
  shootingGuideline,
  totalScenes,
}: {
  lineToSay?: string;
  recording: boolean;
  scene: NativeRecipeScene;
  sceneIndex: number;
  shootingGuideline?: string;
  totalScenes: number;
}) {
  const primaryLine = lineToSay?.trim() || getCameraPrimaryLine(scene);
  const actionLine = shootingGuideline?.trim() || getCameraActionLine(scene);
  const progress = `${Math.max(12, ((sceneIndex + 1) / totalScenes) * 100)}%` as DimensionValue;

  return (
    <View pointerEvents="none" style={styles.coachOverlay}>
      <View>
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

      <View style={styles.coachPromptStack}>
        <View style={styles.actionCue}>
          <Text style={styles.coachLabel}>SHOOTING GUIDELINE</Text>
          <Text style={styles.actionText}>{actionLine}</Text>
        </View>

        <View style={styles.sayNowBlock}>
          <Text style={styles.sayNowLabel}>LINE TO SAY</Text>
          <Text style={styles.sayNowText}>{primaryLine}</Text>
        </View>
      </View>
    </View>
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

function RoundControlButton({
  iconName,
  onPress,
  prominent = false,
}: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
  prominent?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.roundControlButton, prominent ? styles.roundControlButtonProminent : null]}
    >
      <MaterialCommunityIcons color="#ffffff" name={iconName} size={22} />
    </Pressable>
  );
}

function CutStepButton({
  disabled,
  iconName,
  label,
  onPress,
}: {
  disabled: boolean;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.cutStepButton, disabled ? styles.cutStepButtonDisabled : null]}
    >
      <MaterialCommunityIcons color={disabled ? 'rgba(255,255,255,0.28)' : '#ffffff'} name={iconName} size={22} />
      <Text style={[styles.cutStepText, disabled ? styles.cutStepTextDisabled : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function PaletteButton({
  iconName,
  label,
  onPress,
  tint = '#a78bfa',
}: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress: () => void;
  tint?: string;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.paletteButton}>
      <View style={styles.paletteIconBubble}>
        <MaterialCommunityIcons color={tint} name={iconName} size={20} />
      </View>
      <Text style={styles.paletteLabel}>{label}</Text>
    </Pressable>
  );
}

function PromptTextModal({
  ctaLabel,
  onChangeText,
  onClose,
  onSubmit,
  placeholder,
  title,
  value,
  visible,
}: {
  ctaLabel: string;
  onChangeText: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  placeholder: string;
  title: string;
  value: string;
  visible: boolean;
}) {
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.promptModalOverlay}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFillObject} />
        <View style={styles.promptModalCard}>
          <Text style={styles.promptModalTitle}>{title}</Text>
          <TextInput
            autoFocus
            multiline
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.42)"
            returnKeyType="done"
            style={styles.promptModalInput}
            value={value}
          />
          <View style={styles.promptModalActions}>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.promptModalSecondary}>
              <Text style={styles.promptModalSecondaryText}>취소</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onSubmit} style={styles.promptModalPrimary}>
              <Text style={styles.promptModalPrimaryText}>{ctaLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
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

function getTeleprompterScript(
  scene: NativeRecipeScene,
  visibleBlocks: PrompterBlock[],
  params: { lineToSay?: string; sceneId?: string },
) {
  if (params.sceneId === scene.id && typeof params.lineToSay === 'string' && params.lineToSay.trim()) {
    return params.lineToSay.trim();
  }

  const blockLines = visibleBlocks
    .map((block) => block.content.trim())
    .filter(Boolean);

  if (blockLines.length > 0) {
    return blockLines.slice(0, 4).join('\n');
  }

  return getCameraPrimaryLine(scene);
}

function getPrompterTheme(color: PrompterColorPreset, opacity: number) {
  const textColorByPreset: Record<PrompterColorPreset, string> = {
    blue: '#bfdbfe',
    purple: '#c4b5fd',
    white: '#ffffff',
    yellow: '#fde68a',
  };

  return {
    borderColor: color === 'white' ? 'rgba(255,255,255,0.28)' : `${textColorByPreset[color]}99`,
    panelBackground: `rgba(2,6,23,${opacity})`,
    textColor: textColorByPreset[color],
  };
}

function getPrompterTypography(style: PrompterStylePreset, fontSize: number) {
  if (style === 'clean') {
    return {
      fontSize: clampPrompterFontSize(fontSize - 4),
      fontWeight: '700' as const,
      lineHeight: Math.round((fontSize - 4) * 1.24),
    };
  }

  if (style === 'caption') {
    return {
      fontSize: clampPrompterFontSize(fontSize - 8),
      fontWeight: '900' as const,
      lineHeight: Math.round((fontSize - 8) * 1.18),
    };
  }

  if (style === 'bold') {
    return {
      fontSize: clampPrompterFontSize(fontSize + 2),
      fontWeight: '900' as const,
      lineHeight: Math.round((fontSize + 2) * 1.2),
    };
  }

  return {
    fontSize,
    fontWeight: '900' as const,
    lineHeight: Math.round(fontSize * 1.22),
  };
}

function getTouchDistance(event: GestureResponderEvent) {
  const [firstTouch, secondTouch] = event.nativeEvent.touches;

  if (!firstTouch || !secondTouch) {
    return null;
  }

  const dx = firstTouch.pageX - secondTouch.pageX;
  const dy = firstTouch.pageY - secondTouch.pageY;

  return Math.sqrt(dx * dx + dy * dy);
}

function clampPrompterFontSize(value: number) {
  return Math.round(Math.min(MAX_PROMPTER_FONT_SIZE, Math.max(MIN_PROMPTER_FONT_SIZE, value)));
}

function getNextValue<T>(values: readonly T[], current: T) {
  const index = values.findIndex((value) => value === current);
  return values[index >= 0 && index < values.length - 1 ? index + 1 : 0];
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
    flex: 1,
    justifyContent: 'space-between',
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
  cutStepButton: {
    alignItems: 'center',
    gap: 6,
    minWidth: 78,
  },
  cutStepButtonDisabled: {
    opacity: 0.42,
  },
  cutStepText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  cutStepTextDisabled: {
    color: 'rgba(255,255,255,0.34)',
  },
  dragHandle: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    height: 4,
    marginBottom: 14,
    width: 48,
  },
  nextScriptBlock: {
    borderTopColor: 'rgba(255,255,255,0.16)',
    borderTopWidth: 1,
    marginTop: 18,
    paddingTop: 12,
  },
  nextScriptLabel: {
    color: '#a78bfa',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  nextScriptText: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 25,
    marginTop: 8,
  },
  paletteButton: {
    alignItems: 'center',
    flex: 1,
    gap: 7,
    justifyContent: 'center',
    minHeight: 62,
  },
  paletteDock: {
    backgroundColor: 'rgba(10,12,18,0.68)',
    borderColor: 'rgba(255,255,255,0.13)',
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  paletteIconBubble: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  paletteLabel: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 11,
    fontWeight: '800',
  },
  promptModalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  promptModalCard: {
    backgroundColor: 'rgba(15,23,42,0.96)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 26,
    borderWidth: 1,
    padding: 18,
    width: '88%',
  },
  promptModalInput: {
    borderColor: 'rgba(167,139,250,0.6)',
    borderRadius: 18,
    borderWidth: 1,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 26,
    marginTop: 14,
    minHeight: 112,
    padding: 14,
    textAlignVertical: 'top',
  },
  promptModalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.58)',
    flex: 1,
    justifyContent: 'center',
  },
  promptModalPrimary: {
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    minHeight: 50,
  },
  promptModalPrimaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  promptModalSecondary: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    minHeight: 50,
  },
  promptModalSecondaryText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    fontWeight: '900',
  },
  promptModalTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
  recordDock: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  roundControlButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  roundControlButtonProminent: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    height: 58,
    width: 58,
  },
  scriptPanel: {
    borderLeftWidth: 3,
    borderRadius: 28,
    maxHeight: 374,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 16,
    width: '100%',
  },
  scriptPanelTop: {
    maxHeight: 336,
  },
  scriptText: {
    letterSpacing: 0,
  },
  speedDock: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(10,12,18,0.58)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    minHeight: 76,
    paddingHorizontal: 18,
  },
  speedLabel: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 11,
    fontWeight: '900',
  },
  speedValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
  teleprompterBottomDock: {
    gap: 14,
    paddingHorizontal: 18,
  },
  teleprompterHint: {
    color: 'rgba(255,255,255,0.46)',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  teleprompterProgressFill: {
    backgroundColor: '#a78bfa',
    borderRadius: 999,
    height: '100%',
  },
  teleprompterProgressRail: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    height: 3,
    marginTop: 8,
    overflow: 'hidden',
    width: 126,
  },
  teleprompterSceneCluster: {
    alignItems: 'center',
  },
  teleprompterSceneDot: {
    backgroundColor: '#a78bfa',
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  teleprompterScenePill: {
    alignItems: 'center',
    backgroundColor: 'rgba(10,12,18,0.58)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  teleprompterSceneText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  teleprompterStage: {
    left: 18,
    position: 'absolute',
    right: 18,
  },
  teleprompterStageCenter: {
    top: '20%',
  },
  teleprompterStageTop: {
    top: '11%',
  },
  teleprompterTopBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
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
  sayNowLabel: {
    color: '#a78bfa',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  sayNowText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 39,
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
