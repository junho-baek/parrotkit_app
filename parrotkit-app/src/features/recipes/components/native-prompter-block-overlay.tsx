import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from 'react-native';

import {
  clampPrompterPointToBounds,
  getBlockPoint,
  normalizePrompterOpacity,
  normalizePrompterScale,
  type PrompterPoint,
} from '@/features/recipes/lib/prompter-layout';
import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

type NativePrompterBlockOverlayProps = {
  block: PrompterBlock;
  containerSize: { width: number; height: number };
  focused: boolean;
  onFocus: () => void;
  onInteractionActiveChange?: (active: boolean) => void;
  onUpdate: (updates: Partial<Pick<PrompterBlock, 'content' | 'opacity' | 'scale' | 'x' | 'y'>>) => void;
  // Bump this timestamp when a parent toolbar needs this block to enter edit mode.
  editingRequestedAt?: number;
};

const BLOCK_WIDTH = 244;
const BLOCK_MIN_HEIGHT = 58;
const PROMPTER_BOUNDS = {
  bottomInset: 0.88,
  horizontalInset: 0.1,
  topInset: 0.1,
};

function getTouchDistance(event: GestureResponderEvent) {
  const [firstTouch, secondTouch] = event.nativeEvent.touches;

  if (!firstTouch || !secondTouch) return null;

  const dx = secondTouch.pageX - firstTouch.pageX;
  const dy = secondTouch.pageY - firstTouch.pageY;

  return Math.hypot(dx, dy);
}

function getFontSize(block: PrompterBlock) {
  if (block.size === 'xl') return 20;
  if (block.size === 'lg') return 18;
  if (block.size === 'sm') return 16;
  return 17;
}

function getTopLeftFromPoint(
  point: PrompterPoint,
  { width, height }: { width: number; height: number },
) {
  return {
    x: point.x * width - BLOCK_WIDTH / 2,
    y: point.y * height - BLOCK_MIN_HEIGHT / 2,
  };
}

function getTone(block: PrompterBlock) {
  if (block.accentColor === 'coral' || block.type === 'key_line') {
    return {
      backgroundColor: 'rgba(255, 126, 88, 0.24)',
      borderColor: 'rgba(255, 190, 160, 0.88)',
    };
  }

  if (block.accentColor === 'green' || block.type === 'cta') {
    return {
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgba(134, 239, 172, 0.8)',
    };
  }

  if (block.accentColor === 'yellow' || block.type === 'warning') {
    return {
      backgroundColor: 'rgba(250, 204, 21, 0.2)',
      borderColor: 'rgba(253, 224, 71, 0.8)',
    };
  }

  if (block.accentColor === 'pink') {
    return {
      backgroundColor: 'rgba(236, 72, 153, 0.22)',
      borderColor: 'rgba(249, 168, 212, 0.82)',
    };
  }

  return {
    backgroundColor: 'rgba(99, 102, 241, 0.24)',
    borderColor: 'rgba(196, 181, 253, 0.82)',
  };
}

export function NativePrompterBlockOverlay({
  block,
  containerSize,
  focused,
  onFocus,
  onInteractionActiveChange,
  onUpdate,
  editingRequestedAt,
}: NativePrompterBlockOverlayProps) {
  const textInputRef = useRef<TextInput>(null);
  const animatedPosition = useRef(new Animated.ValueXY()).current;
  const animatedScale = useRef(new Animated.Value(normalizePrompterScale(block.scale ?? 1))).current;
  const startPointRef = useRef<PrompterPoint>(getBlockPoint(block));
  const startScaleRef = useRef(normalizePrompterScale(block.scale ?? 1));
  const startPinchDistanceRef = useRef<number | null>(null);
  const pendingPointRef = useRef<PrompterPoint | null>(null);
  const pendingScaleRef = useRef<number | null>(null);
  const gestureActiveRef = useRef(false);
  const gestureMovedRef = useRef(false);
  const lastTapAtRef = useRef(0);
  const lastHandledTapAtRef = useRef(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(block.content);

  const point = clampPrompterPointToBounds(getBlockPoint(block), PROMPTER_BOUNDS);
  const scale = normalizePrompterScale(block.scale ?? 1);
  const opacity = normalizePrompterOpacity(block.opacity);
  const safeWidth = Math.max(containerSize.width, 1);
  const safeHeight = Math.max(containerSize.height, 1);
  const fontSize = getFontSize(block);
  const tone = getTone(block);

  const beginEditing = useCallback(() => {
    onFocus();
    setDraft(block.content);
    setEditing(true);
  }, [block.content, onFocus]);

  const handleCueTap = useCallback(() => {
    const now = Date.now();

    if (now - lastHandledTapAtRef.current < 80) return;

    lastHandledTapAtRef.current = now;
    onFocus();

    if (now - lastTapAtRef.current < 320) {
      beginEditing();
      lastTapAtRef.current = 0;
      return;
    }

    lastTapAtRef.current = now;
  }, [beginEditing, onFocus]);

  const syncAnimatedLayout = useCallback(() => {
    animatedPosition.setValue(getTopLeftFromPoint(point, {
      height: safeHeight,
      width: safeWidth,
    }));
    animatedScale.setValue(scale);
  }, [animatedPosition, animatedScale, point.x, point.y, safeHeight, safeWidth, scale]);

  const commitGestureUpdates = useCallback(() => {
    const nextPoint = pendingPointRef.current;
    const nextScale = pendingScaleRef.current;
    const updates: Partial<Pick<PrompterBlock, 'scale' | 'x' | 'y'>> = {};

    pendingPointRef.current = null;
    pendingScaleRef.current = null;
    startPinchDistanceRef.current = null;
    gestureActiveRef.current = false;

    if (nextPoint) {
      updates.x = nextPoint.x;
      updates.y = nextPoint.y;
    }

    if (nextScale !== null) {
      updates.scale = nextScale;
    }

    if (Object.keys(updates).length > 0) {
      onUpdate(updates);
    }
  }, [onUpdate]);

  const commitDraft = useCallback(() => {
    const trimmed = draft.trim();

    if (trimmed.length > 0 && trimmed !== block.content.trim()) {
      onUpdate({ content: trimmed });
      setDraft(trimmed);
    } else {
      setDraft(block.content);
    }

    setEditing(false);
  }, [block.content, draft, onUpdate]);

  useEffect(() => {
    if (!editing) {
      setDraft(block.content);
    }
  }, [block.content, editing]);

  useEffect(() => {
    if (editingRequestedAt === undefined) return;
    beginEditing();
  }, [beginEditing, editingRequestedAt]);

  useEffect(() => {
    if (gestureActiveRef.current) return;
    syncAnimatedLayout();
  }, [syncAnimatedLayout]);

  useEffect(() => {
    if (editing) {
      requestAnimationFrame(() => {
        textInputRef.current?.focus();
      });
    }
  }, [editing]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !editing,
        onMoveShouldSetPanResponder: (event, gestureState) =>
          !editing && (
            event.nativeEvent.touches.length > 1 ||
            Math.abs(gestureState.dx) > 2 ||
            Math.abs(gestureState.dy) > 2
          ),
        onPanResponderGrant: (event) => {
          onInteractionActiveChange?.(true);
          onFocus();
          animatedPosition.stopAnimation();
          animatedScale.stopAnimation();
          gestureActiveRef.current = true;
          gestureMovedRef.current = false;
          pendingPointRef.current = null;
          pendingScaleRef.current = null;
          startPointRef.current = point;
          startScaleRef.current = scale;
          startPinchDistanceRef.current = getTouchDistance(event);
          syncAnimatedLayout();
        },
        onPanResponderMove: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          if (
            event.nativeEvent.touches.length > 1 ||
            Math.abs(gestureState.dx) > 2 ||
            Math.abs(gestureState.dy) > 2
          ) {
            gestureMovedRef.current = true;
          }

          const pinchDistance = getTouchDistance(event);

          if (pinchDistance !== null) {
            const startPinchDistance = startPinchDistanceRef.current ?? pinchDistance;
            startPinchDistanceRef.current = startPinchDistance;

            if (startPinchDistance > 0) {
              const nextScale = normalizePrompterScale(startScaleRef.current * (pinchDistance / startPinchDistance));

              pendingScaleRef.current = nextScale;
              animatedScale.setValue(nextScale);
            }

            return;
          }

          const nextPoint = {
            x: startPointRef.current.x + gestureState.dx / safeWidth,
            y: startPointRef.current.y + gestureState.dy / safeHeight,
          };
          const clampedPoint = clampPrompterPointToBounds(nextPoint, PROMPTER_BOUNDS);

          pendingPointRef.current = clampedPoint;
          animatedPosition.setValue(getTopLeftFromPoint(clampedPoint, {
            height: safeHeight,
            width: safeWidth,
          }));
        },
        onPanResponderRelease: () => {
          const gestureMoved = gestureMovedRef.current;

          onInteractionActiveChange?.(false);
          commitGestureUpdates();

          if (!gestureMoved) {
            handleCueTap();
          }
        },
        onPanResponderTerminate: () => {
          onInteractionActiveChange?.(false);
          commitGestureUpdates();
        },
      }),
    [
      animatedPosition,
      animatedScale,
      beginEditing,
      commitGestureUpdates,
      editing,
      handleCueTap,
      onFocus,
      onInteractionActiveChange,
      point,
      safeHeight,
      safeWidth,
      scale,
      syncAnimatedLayout,
    ],
  );

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.root,
        {
          transform: animatedPosition.getTranslateTransform(),
          width: BLOCK_WIDTH,
        },
        focused && styles.focusedRoot,
      ]}
    >
      <Animated.View
        style={[
          styles.card,
          tone,
          focused && styles.focusedCard,
          editing && styles.editingCard,
          {
            opacity,
            transform: [{ scale: animatedScale }],
          },
        ]}
      >
        {editing ? (
          <TextInput
            ref={textInputRef}
            multiline
            blurOnSubmit
            onBlur={commitDraft}
            onChangeText={setDraft}
            onSubmitEditing={commitDraft}
            returnKeyType="done"
            selectionColor="#ffffff"
            style={[styles.input, { fontSize, lineHeight: Math.round(fontSize * 1.34) }]}
            value={draft}
          />
        ) : (
          <Text
            onLongPress={beginEditing}
            onPress={handleCueTap}
            style={[styles.text, { fontSize, lineHeight: Math.round(fontSize * 1.34) }]}
          >
            {block.content}
          </Text>
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    left: 0,
    minHeight: BLOCK_MIN_HEIGHT,
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  focusedRoot: {
    zIndex: 11,
  },
  card: {
    borderRadius: 22,
    borderWidth: 2,
    minHeight: BLOCK_MIN_HEIGHT,
    paddingHorizontal: 14,
    paddingVertical: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
  },
  editingCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
  },
  focusedCard: {
    borderColor: '#ffffff',
  },
  input: {
    color: '#ffffff',
    fontWeight: '700',
    minHeight: 46,
    padding: 0,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  text: {
    color: '#ffffff',
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
});
