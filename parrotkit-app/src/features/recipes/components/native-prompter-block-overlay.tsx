import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  View,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from 'react-native';

import {
  getBlockPoint,
  normalizePrompterScale,
  pointFromGesture,
  type PrompterPoint,
} from '@/features/recipes/lib/prompter-layout';
import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

type NativePrompterBlockOverlayProps = {
  block: PrompterBlock;
  containerSize: { width: number; height: number };
  focused: boolean;
  onFocus: () => void;
  onUpdate: (updates: Partial<Pick<PrompterBlock, 'content' | 'scale' | 'x' | 'y'>>) => void;
  // Bump this timestamp when a parent toolbar needs this block to enter edit mode.
  editingRequestedAt?: number;
};

const BLOCK_WIDTH = 280;
const BLOCK_MIN_HEIGHT = 74;

function getTouchDistance(event: GestureResponderEvent) {
  const [firstTouch, secondTouch] = event.nativeEvent.touches;

  if (!firstTouch || !secondTouch) return null;

  const dx = secondTouch.pageX - firstTouch.pageX;
  const dy = secondTouch.pageY - firstTouch.pageY;

  return Math.hypot(dx, dy);
}

function getFontSize(block: PrompterBlock) {
  if (block.size === 'xl') return 24;
  if (block.size === 'lg') return 21;
  if (block.size === 'sm') return 16;
  return 18;
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
  onUpdate,
  editingRequestedAt,
}: NativePrompterBlockOverlayProps) {
  const textInputRef = useRef<TextInput>(null);
  const startPointRef = useRef<PrompterPoint>(getBlockPoint(block));
  const startScaleRef = useRef(normalizePrompterScale(block.scale ?? 1));
  const startPinchDistanceRef = useRef<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(block.content);

  const point = getBlockPoint(block);
  const scale = normalizePrompterScale(block.scale ?? 1);
  const safeWidth = Math.max(containerSize.width, 1);
  const safeHeight = Math.max(containerSize.height, 1);
  const fontSize = getFontSize(block);
  const tone = getTone(block);

  const beginEditing = useCallback(() => {
    onFocus();
    setDraft(block.content);
    setEditing(true);
  }, [block.content, onFocus]);

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
    if (editing) {
      requestAnimationFrame(() => {
        textInputRef.current?.focus();
      });
    }
  }, [editing]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (event) => event.nativeEvent.touches.length > 1,
        onMoveShouldSetPanResponder: (event, gestureState) =>
          event.nativeEvent.touches.length > 1 || Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3,
        onPanResponderGrant: (event) => {
          onFocus();
          startPointRef.current = getBlockPoint(block);
          startScaleRef.current = normalizePrompterScale(block.scale ?? 1);
          startPinchDistanceRef.current = getTouchDistance(event);
        },
        onPanResponderMove: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          const pinchDistance = getTouchDistance(event);

          if (pinchDistance !== null) {
            const startPinchDistance = startPinchDistanceRef.current ?? pinchDistance;
            startPinchDistanceRef.current = startPinchDistance;

            if (startPinchDistance > 0) {
              onUpdate({
                scale: normalizePrompterScale(startScaleRef.current * (pinchDistance / startPinchDistance)),
              });
            }

            return;
          }

          const nextPoint = pointFromGesture({
            start: startPointRef.current,
            dx: gestureState.dx,
            dy: gestureState.dy,
            width: safeWidth,
            height: safeHeight,
          });

          onUpdate({ x: nextPoint.x, y: nextPoint.y });
        },
        onPanResponderRelease: () => {
          startPinchDistanceRef.current = null;
        },
        onPanResponderTerminate: () => {
          startPinchDistanceRef.current = null;
        },
      }),
    [block, onFocus, onUpdate, safeHeight, safeWidth],
  );

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.root,
        {
          left: point.x * safeWidth - BLOCK_WIDTH / 2,
          top: point.y * safeHeight,
          transform: [{ scale }],
          width: BLOCK_WIDTH,
        },
      ]}
    >
      <View
        onTouchStart={onFocus}
        style={[
          styles.card,
          tone,
          focused && styles.focusedCard,
          editing && styles.editingCard,
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
            onPress={onFocus}
            style={[styles.text, { fontSize, lineHeight: Math.round(fontSize * 1.34) }]}
          >
            {block.content}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: BLOCK_MIN_HEIGHT,
    position: 'absolute',
    zIndex: 10,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    minHeight: BLOCK_MIN_HEIGHT,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    borderWidth: 2,
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
