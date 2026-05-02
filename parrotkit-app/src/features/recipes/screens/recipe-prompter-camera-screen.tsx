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
import { Platform, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MockProjectTake } from '@/core/mocks/parrotkit-data';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { NativeRecordButton } from '@/features/recipes/components/native-record-button';
import {
  NativeTakeReview,
  type NativeTakeReviewStatus,
} from '@/features/recipes/components/native-take-review';
import { NativeTakeTray } from '@/features/recipes/components/native-take-tray';
import { ShootingSceneSwitcher } from '@/features/recipes/components/shooting-scene-switcher';
import { normalizeNativeRecipe } from '@/features/recipes/lib/recipe-domain-normalizer';
import { openTakeInShareSheet, saveTakeToGallery } from '@/features/recipes/lib/take-export';
import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export function RecipePrompterCameraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ recipeId?: string; sceneId?: string }>();
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

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace((recipe ? `/recipe/${recipe.id}` : '/(tabs)/recipes') as Href);
  }, [recipe, router]);

  useEffect(() => {
    setReviewUri(null);
    setReviewStatus('idle');
    setReviewStatusMessage('');
    setSavingTake(false);
    setSaveMessage('');
    setBusyTakeId(null);
  }, [activeSceneId]);

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

        <View pointerEvents="box-none" className="flex-1">
          <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            <CameraCoachOverlay
              recording={recording}
              scene={activeScene}
              sceneIndex={activeSceneIndex}
              totalScenes={recipe.scenes.length}
            />
          </View>
        </View>

        <View
          className="rounded-t-[30px] border border-white/10 bg-slate-950/72 px-4 pt-4"
          style={{ paddingBottom: insets.bottom + (Platform.OS === 'android' ? 12 : 4) }}
        >
          <View className="mb-3 flex-row items-center justify-between gap-3">
            <PrompterStepButton
              disabled={!previousScene}
              label="Prev cut"
              onPress={() => {
                if (previousScene) setActiveSceneId(previousScene.id);
              }}
            />
            <NativeRecordButton
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

function CameraCoachOverlay({
  recording,
  scene,
  sceneIndex,
  totalScenes,
}: {
  recording: boolean;
  scene: NativeRecipeScene;
  sceneIndex: number;
  totalScenes: number;
}) {
  const primaryLine = getCameraPrimaryLine(scene);
  const actionLine = getCameraActionLine(scene);
  const nextLine = getCameraNextLine(scene);
  const progress = `${Math.max(12, ((sceneIndex + 1) / totalScenes) * 100)}%` as DimensionValue;

  return (
    <View pointerEvents="none" style={styles.coachOverlay}>
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

      <View style={styles.actionCue}>
        <Text style={styles.coachLabel}>ACTION</Text>
        <Text style={styles.actionText}>{actionLine}</Text>
      </View>

      <View style={styles.sayNowBlock}>
        <Text style={styles.sayNowLabel}>SAY NOW</Text>
        <Text style={styles.sayNowText}>{primaryLine}</Text>
      </View>

      <View style={styles.nextCue}>
        <Text style={styles.coachLabel}>NEXT</Text>
        <Text style={styles.nextCueText}>{nextLine}</Text>
      </View>
    </View>
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
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: 320,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
    marginTop: 4,
  },
  coachLabel: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  coachOverlay: {
    bottom: 24,
    gap: 14,
    left: 18,
    position: 'absolute',
    right: 18,
    top: 18,
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
    backgroundColor: 'rgba(2, 6, 23, 0.66)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 28,
    borderWidth: 1,
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  sayNowLabel: {
    color: '#a78bfa',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  sayNowText: {
    color: '#ffffff',
    fontSize: 31,
    fontWeight: '900',
    lineHeight: 40,
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
