import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { Href, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { NativePrompterBlockOverlay } from '@/features/recipes/components/native-prompter-block-overlay';
import { NativePrompterToolbar } from '@/features/recipes/components/native-prompter-toolbar';
import { NativeRecordButton } from '@/features/recipes/components/native-record-button';
import {
  NativeTakeReview,
  type NativeGallerySaveStatus,
} from '@/features/recipes/components/native-take-review';
import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

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

export function QuickShootCameraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { createQuickShootRecipe } = useMockWorkspace();
  const [permission, requestPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const cameraRef = useRef<CameraView>(null);
  const recordingPromiseRef = useRef<Promise<{ uri: string } | undefined> | null>(null);
  const gallerySaveRunRef = useRef(0);
  const gallerySavedUrisRef = useRef<Set<string>>(new Set());
  const swipeTranslateX = useRef(new Animated.Value(0)).current;
  const swipeStartRef = useRef({ x: 0, y: 0 });
  const swipeTriggeredRef = useRef(false);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [editRequestByBlockId, setEditRequestByBlockId] = useState<Record<string, number>>({});
  const [facing, setFacing] = useState<CameraType>('front');
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(initialBlocks[0]?.id ?? null);
  const [recording, setRecording] = useState(false);
  const [reviewUri, setReviewUri] = useState<string | null>(null);
  const [gallerySaveStatus, setGallerySaveStatus] = useState<NativeGallerySaveStatus>('idle');
  const [gallerySaveMessage, setGallerySaveMessage] = useState('');
  const [savingTake, setSavingTake] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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
  const screenSwipeEnabled = !recording && !reviewUri && !savingTake;

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)' as Href);
  }, [router]);

  const handleGoHome = useCallback(() => {
    router.replace('/(tabs)' as Href);
  }, [router]);

  const animateSwipeTo = useCallback((toValue: number, onComplete?: () => void) => {
    Animated.timing(swipeTranslateX, {
      duration: toValue === 0 ? 170 : 210,
      easing: Easing.out(Easing.cubic),
      toValue,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onComplete?.();
      }
    });
  }, [swipeTranslateX]);

  const getScreenSwipeState = useCallback((event: GestureResponderEvent) => {
    const start = swipeStartRef.current;
    const dx = event.nativeEvent.pageX - start.x;
    const dy = event.nativeEvent.pageY - start.y;
    const horizontalIntent = Math.abs(dx) > 26 && Math.abs(dx) > Math.abs(dy) * 1.35;

    return { dx, horizontalIntent };
  }, []);

  const handleMakeRecipe = useCallback(() => {
    const recipe = createQuickShootRecipe({
      blocks,
      title: 'Quick Shoot Recipe',
    });

    router.replace(`/recipe/${recipe.id}` as Href);
  }, [blocks, createQuickShootRecipe, router]);

  const handleScreenTouchStart = useCallback((event: GestureResponderEvent) => {
    if (!screenSwipeEnabled) return;

    swipeTriggeredRef.current = false;
    swipeTranslateX.stopAnimation();
    swipeStartRef.current = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    };
  }, [screenSwipeEnabled, swipeTranslateX]);

  const handleScreenTouchMove = useCallback((event: GestureResponderEvent) => {
    if (!screenSwipeEnabled || swipeTriggeredRef.current) return;

    const { dx, horizontalIntent } = getScreenSwipeState(event);

    if (!horizontalIntent) {
      swipeTranslateX.setValue(0);
      return;
    }

    swipeTranslateX.setValue(Math.max(-windowWidth, Math.min(windowWidth, dx)));
  }, [getScreenSwipeState, screenSwipeEnabled, swipeTranslateX, windowWidth]);

  const handleScreenTouchEnd = useCallback((event: GestureResponderEvent) => {
    if (!screenSwipeEnabled || swipeTriggeredRef.current) return;

    const { dx, horizontalIntent } = getScreenSwipeState(event);
    const swipeThreshold = Math.min(150, windowWidth * 0.36);

    if (horizontalIntent && dx < -swipeThreshold) {
      swipeTriggeredRef.current = true;
      animateSwipeTo(-windowWidth, () => {
        handleGoHome();
        swipeTranslateX.setValue(0);
      });
      return;
    }

    if (horizontalIntent && dx > swipeThreshold) {
      swipeTriggeredRef.current = true;
      animateSwipeTo(windowWidth, () => {
        handleMakeRecipe();
        swipeTranslateX.setValue(0);
      });
      return;
    }

    animateSwipeTo(0);
  }, [
    animateSwipeTo,
    getScreenSwipeState,
    handleGoHome,
    handleMakeRecipe,
    screenSwipeEnabled,
    swipeTranslateX,
    windowWidth,
  ]);

  const handleScreenTouchCancel = useCallback(() => {
    animateSwipeTo(0);
  }, [animateSwipeTo]);

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

  const handleColorFocusedCue = useCallback((accentColor: string) => {
    if (!focusedBlock) return;

    handleUpdateBlock(focusedBlock.id, { accentColor });
  }, [focusedBlock, handleUpdateBlock]);

  const handleEditFocusedCue = useCallback(() => {
    if (!focusedBlock) return;

    requestEditForBlock(focusedBlock.id);
  }, [focusedBlock, requestEditForBlock]);

  const resetGalleryReview = useCallback(() => {
    gallerySaveRunRef.current += 1;
    setGallerySaveStatus('idle');
    setGallerySaveMessage('');
  }, []);

  const saveTakeToNativeGallery = useCallback(async (uri: string) => {
    const runId = gallerySaveRunRef.current + 1;
    gallerySaveRunRef.current = runId;
    const updateGalleryState = (status: NativeGallerySaveStatus, message: string) => {
      if (gallerySaveRunRef.current !== runId) return;

      setGallerySaveStatus(status);
      setGallerySaveMessage(message);
    };

    if (gallerySavedUrisRef.current.has(uri)) {
      const message = 'Saved to native Gallery';

      updateGalleryState('saved', 'This take is already in your native gallery.');

      return { message, status: 'saved' as NativeGallerySaveStatus };
    }

    updateGalleryState('saving', 'Saving this take to the native camera roll.');

    try {
      const permissionResult = await MediaLibrary.requestPermissionsAsync(true, ['video']);

      if (!permissionResult.granted) {
        const message = 'Gallery access was not allowed.';

        updateGalleryState('denied', 'Allow Photos access to save this take to the native gallery.');

        return { message, status: 'denied' as NativeGallerySaveStatus };
      }

      await MediaLibrary.saveToLibraryAsync(uri);
      gallerySavedUrisRef.current.add(uri);

      const message = 'Saved to native Gallery';

      updateGalleryState('saved', 'This take is now in your native camera roll.');

      return { message, status: 'saved' as NativeGallerySaveStatus };
    } catch {
      const message = 'Could not save to native Gallery.';

      updateGalleryState('failed', 'Tap Save to Gallery to try again.');

      return { message, status: 'failed' as NativeGallerySaveStatus };
    }
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
    resetGalleryReview();
    setRecording(true);

    const recordingPromise = camera.recordAsync({ maxDuration: 90 });
    recordingPromiseRef.current = recordingPromise;

    try {
      const result = await recordingPromise;

      if (result?.uri) {
        setReviewUri(result.uri);
        void saveTakeToNativeGallery(result.uri);
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
    microphonePermission,
    recording,
    requestMicrophonePermission,
    resetGalleryReview,
    saveTakeToNativeGallery,
  ]);

  const handleRetryReview = useCallback(() => {
    setReviewUri(null);
    resetGalleryReview();
    setSaveMessage('');
  }, [resetGalleryReview]);

  const handleUseTake = useCallback(async () => {
    if (!reviewUri || savingTake) return;

    setSavingTake(true);

    try {
      let message = 'Saved to native Gallery';

      if (gallerySaveStatus !== 'saved' || !gallerySavedUrisRef.current.has(reviewUri)) {
        const galleryResult = await saveTakeToNativeGallery(reviewUri);

        if (galleryResult.status !== 'saved') {
          setSaveMessage(galleryResult.message);
          return;
        }

        message = galleryResult.message;
      }

      setReviewUri(null);
      resetGalleryReview();
      setSaveMessage(message);
    } finally {
      setSavingTake(false);
    }
  }, [gallerySaveStatus, resetGalleryReview, reviewUri, saveTakeToNativeGallery, savingTake]);

  const statusLabel = saveMessage || (!microphonePermission?.granted ? 'Mic off: muted recording' : '');

  if (!permission) {
    return <View className="flex-1 bg-slate-950" />;
  }

  if (!permission.granted) {
    return <CameraPermissionGate onBack={handleBack} onRequest={requestPermission} />;
  }

  return (
    <View className="flex-1 overflow-hidden bg-slate-950">
      <QuickShootSwipeBackdrop />

      <Animated.View
        onTouchCancel={handleScreenTouchCancel}
        onTouchEnd={handleScreenTouchEnd}
        onTouchMove={handleScreenTouchMove}
        onTouchStart={handleScreenTouchStart}
        style={[
          styles.quickShootSurface,
          {
            transform: [{ translateX: swipeTranslateX }],
          },
        ]}
      >
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
        </View>
      </View>

      {reviewUri ? (
        <View style={styles.reviewOverlay}>
          <NativeTakeReview
            galleryMessage={gallerySaveMessage}
            galleryStatus={gallerySaveStatus}
            onRetry={handleRetryReview}
            onUseTake={handleUseTake}
            useTakeDisabled={savingTake || gallerySaveStatus === 'saving'}
            useTakeLabel={
              savingTake || gallerySaveStatus === 'saving'
                ? 'Saving...'
                : gallerySaveStatus === 'saved'
                  ? 'Keep Take'
                  : 'Save to Gallery'
            }
            uri={reviewUri}
          />
        </View>
      ) : null}
      </Animated.View>
    </View>
  );
}

function QuickShootSwipeBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#6d28d9', '#7c3aed', '#111827']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[styles.swipePanel, styles.recipeSwipePanel]}
      >
        <MaterialCommunityIcons color="#ffffff" name="layers-triple" size={42} />
        <Text style={styles.swipePanelTitle}>Make Recipe</Text>
        <Text style={styles.swipePanelBody}>Turn cues into cuts</Text>
      </LinearGradient>

      <LinearGradient
        colors={['#020617', '#0f172a', '#1d4ed8']}
        end={{ x: 0, y: 1 }}
        start={{ x: 1, y: 0 }}
        style={[styles.swipePanel, styles.homeSwipePanel]}
      >
        <MaterialCommunityIcons color="#ffffff" name="home-variant" size={42} />
        <Text style={styles.swipePanelTitle}>Home</Text>
        <Text style={styles.swipePanelBody}>Back to workspace</Text>
      </LinearGradient>
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
  quickShootSurface: {
    backgroundColor: '#020617',
    flex: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.34,
    shadowRadius: 34,
  },
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
  swipePanel: {
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 34,
    position: 'absolute',
    top: 0,
    width: '78%',
  },
  recipeSwipePanel: {
    alignItems: 'flex-start',
    left: 0,
  },
  homeSwipePanel: {
    alignItems: 'flex-end',
    right: 0,
  },
  swipePanelTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 14,
  },
  swipePanelBody: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
});
