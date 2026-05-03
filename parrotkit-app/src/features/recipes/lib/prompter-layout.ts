import {
  PrompterBlock,
  PrompterPositionPreset,
} from '@/features/recipes/types/recipe-domain';

export type PrompterPoint = { x: number; y: number };
export type PrompterPointBounds = {
  horizontalInset?: number;
  topInset?: number;
  bottomInset?: number;
};

export const PROMPTER_SCALE_MIN = 0.65;
export const PROMPTER_SCALE_MAX = 2.5;
export const PROMPTER_OPACITY_MIN = 0.35;
export const PROMPTER_OPACITY_MAX = 1;

export const presetOffsetMap: Record<PrompterPositionPreset, PrompterPoint> = {
  top: { x: 0.5, y: 0.14 },
  upperThird: { x: 0.5, y: 0.28 },
  center: { x: 0.5, y: 0.45 },
  lowerThird: { x: 0.5, y: 0.64 },
  bottom: { x: 0.5, y: 0.78 },
};

export function finiteOrFallback(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function clamp(value: number, min: number, max: number) {
  const safeMin = finiteOrFallback(min, 0);
  const safeMax = finiteOrFallback(max, safeMin);
  const lowerBound = Math.min(safeMin, safeMax);
  const upperBound = Math.max(safeMin, safeMax);
  const safeValue = finiteOrFallback(value, lowerBound);

  return Math.min(Math.max(safeValue, lowerBound), upperBound);
}

export function clampPrompterPoint(point: PrompterPoint): PrompterPoint {
  return clampPrompterPointToBounds(point);
}

export function clampPrompterPointToBounds(
  point: PrompterPoint,
  { horizontalInset = 0.08, topInset = 0.1, bottomInset = 0.84 }: PrompterPointBounds = {},
): PrompterPoint {
  const safeHorizontalInset = clamp(finiteOrFallback(horizontalInset, 0.08), 0, 0.5);
  const safeTopInset = clamp(finiteOrFallback(topInset, 0.1), 0, 1);
  const safeBottomInset = clamp(finiteOrFallback(bottomInset, 0.84), safeTopInset, 1);

  return {
    x: clamp(finiteOrFallback(point.x, 0.5), safeHorizontalInset, 1 - safeHorizontalInset),
    y: clamp(finiteOrFallback(point.y, 0.45), safeTopInset, safeBottomInset),
  };
}

export function normalizePrompterScale(value: number) {
  return clamp(finiteOrFallback(value, 1), PROMPTER_SCALE_MIN, PROMPTER_SCALE_MAX);
}

export function normalizePrompterOpacity(value: number | undefined) {
  return clamp(finiteOrFallback(value, 0.92), PROMPTER_OPACITY_MIN, PROMPTER_OPACITY_MAX);
}

export function createPrompterDraftBlock({
  content = 'New cue',
  id,
  order,
  x = 0.5,
  y = 0.5,
}: {
  content?: string;
  id: string;
  order: number;
  x?: number;
  y?: number;
}): PrompterBlock {
  const point = clampPrompterPoint({
    x,
    y,
  });

  return {
    accentColor: 'blue',
    content,
    id,
    opacity: 0.92,
    order,
    positionPreset: 'center',
    scale: 1,
    size: 'lg',
    type: 'key_line',
    visible: true,
    x: point.x,
    y: point.y,
  };
}

export function getBlockPoint(block: PrompterBlock): PrompterPoint {
  const presetPoint = presetOffsetMap[block.positionPreset];

  return clampPrompterPoint({
    x: finiteOrFallback(block.x, presetPoint.x),
    y: finiteOrFallback(block.y, presetPoint.y),
  });
}

export function pointFromGesture({
  start,
  dx,
  dy,
  width,
  height,
}: {
  start: PrompterPoint;
  dx: number;
  dy: number;
  width: number;
  height: number;
}): PrompterPoint {
  const safeStart = {
    x: finiteOrFallback(start.x, 0.5),
    y: finiteOrFallback(start.y, 0.45),
  };
  const safeDx = finiteOrFallback(dx, 0);
  const safeDy = finiteOrFallback(dy, 0);
  const safeWidth = Math.max(finiteOrFallback(width, 1), 1);
  const safeHeight = Math.max(finiteOrFallback(height, 1), 1);

  return clampPrompterPoint({
    x: safeStart.x + safeDx / safeWidth,
    y: safeStart.y + safeDy / safeHeight,
  });
}
