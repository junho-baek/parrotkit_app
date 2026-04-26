import {
  PrompterBlock,
  PrompterPositionPreset,
} from '@/features/recipes/types/recipe-domain';

export type PrompterPoint = { x: number; y: number };

export const PROMPTER_SCALE_MIN = 0.65;
export const PROMPTER_SCALE_MAX = 2.5;

export const presetOffsetMap: Record<PrompterPositionPreset, PrompterPoint> = {
  top: { x: 0.5, y: 0.14 },
  upperThird: { x: 0.5, y: 0.28 },
  center: { x: 0.5, y: 0.45 },
  lowerThird: { x: 0.5, y: 0.64 },
  bottom: { x: 0.5, y: 0.78 },
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function clampPrompterPoint(point: PrompterPoint): PrompterPoint {
  return {
    x: clamp(point.x, 0.08, 0.92),
    y: clamp(point.y, 0.1, 0.84),
  };
}

export function normalizePrompterScale(value: number) {
  return clamp(value, PROMPTER_SCALE_MIN, PROMPTER_SCALE_MAX);
}

export function getBlockPoint(block: PrompterBlock): PrompterPoint {
  return clampPrompterPoint({
    x: block.x ?? presetOffsetMap[block.positionPreset].x,
    y: block.y ?? presetOffsetMap[block.positionPreset].y,
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
  return clampPrompterPoint({
    x: start.x + dx / Math.max(width, 1),
    y: start.y + dy / Math.max(height, 1),
  });
}
