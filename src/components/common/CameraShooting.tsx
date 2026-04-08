'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PrompterBlock } from '@/types/recipe';

interface CameraShootingProps {
  sceneId: number;
  sceneTitle: string;
  prompterBlocks: PrompterBlock[];
  onPrompterBlocksChange: (blocks: PrompterBlock[]) => void;
  onCapture: (videoBlob: Blob) => void;
  onBack: () => void;
  embedded?: boolean;
  existingCapture?: Blob | null;
}

type DragState = {
  mode: 'drag' | 'resize';
  blockId: string;
  pointerId: number;
  startX?: number;
  startY?: number;
  startScale?: number;
};

type PinchState = {
  blockId: string;
  startDistance: number;
  startScale: number;
};

const PROMPTER_CUE_ACCENT_ORDER = ['blue', 'yellow', 'coral', 'green', 'pink'] as const;

type PrompterCueAccent = typeof PROMPTER_CUE_ACCENT_ORDER[number];

const sizeClassMap: Record<PrompterBlock['size'], string> = {
  sm: 'text-[11px] px-2.5 py-1.5',
  md: 'text-sm px-3 py-2',
  lg: 'text-xl px-4 py-2.5',
  xl: 'text-[2rem] px-5 py-3',
};

const presetOffsetMap: Record<PrompterBlock['positionPreset'], { x: number; y: number }> = {
  top: { x: 0.5, y: 0.12 },
  upperThird: { x: 0.5, y: 0.24 },
  center: { x: 0.5, y: 0.42 },
  lowerThird: { x: 0.5, y: 0.68 },
  bottom: { x: 0.5, y: 0.84 },
};

const prompterTypeOptions: Array<{ value: PrompterBlock['type']; label: string }> = [
  { value: 'key_line', label: 'Main Script' },
  { value: 'keyword', label: 'Keyword' },
  { value: 'appeal_point', label: 'Cut Goal' },
  { value: 'mood', label: 'Mood' },
  { value: 'action', label: 'Action' },
  { value: 'warning', label: 'Warning' },
  { value: 'cta', label: 'CTA' },
];

function normalizeBlockOrder(blocks: PrompterBlock[]) {
  return blocks.map((block, index) => ({
    ...block,
    order: index + 1,
  }));
}

function createCustomPrompterBlock(order: number): PrompterBlock {
  const uniqueId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id: uniqueId,
    type: 'keyword',
    label: undefined,
    content: 'New cue',
    accentColor: 'blue',
    visible: true,
    size: 'md',
    positionPreset: 'upperThird',
    scale: 1,
    order,
  };
}

function isPrompterCueAccent(value?: string): value is PrompterCueAccent {
  return Boolean(value) && PROMPTER_CUE_ACCENT_ORDER.includes(value as PrompterCueAccent);
}

function getDefaultPrompterAccent(type: PrompterBlock['type']): PrompterCueAccent {
  switch (type) {
    case 'mood':
      return 'yellow';
    case 'action':
      return 'coral';
    case 'cta':
      return 'green';
    case 'key_line':
      return 'blue';
    default:
      return 'pink';
  }
}

function getBlockTone(block: PrompterBlock) {
  const accent = isPrompterCueAccent(block.accentColor) ? block.accentColor : getDefaultPrompterAccent(block.type);

  switch (accent) {
    case 'yellow':
      return 'border-[#f4d774] bg-[#fff9e7] text-slate-950';
    case 'coral':
      return 'border-[#ffb299] bg-[#fff1eb] text-slate-950';
    case 'green':
      return 'border-[#9be4b6] bg-[#effcf4] text-slate-950';
    case 'pink':
      return 'border-[#ffb6d9] bg-[#fff0f8] text-slate-950';
    case 'blue':
    default:
      return 'border-[#a8d1ff] bg-[#eef6ff] text-slate-950';
  }
}

function getAccentSwatchClass(accent: PrompterCueAccent) {
  switch (accent) {
    case 'yellow':
      return 'bg-[#f3c84f]';
    case 'coral':
      return 'bg-[#ff7a59]';
    case 'green':
      return 'bg-[#47c787]';
    case 'pink':
      return 'bg-[#ff5fa2]';
    case 'blue':
    default:
      return 'bg-[#58a9ff]';
  }
}

export const CameraShooting: React.FC<CameraShootingProps> = ({
  sceneId,
  sceneTitle,
  prompterBlocks,
  onPrompterBlocksChange,
  onCapture,
  onBack,
  embedded = false,
  existingCapture = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reviewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const skipCaptureRef = useRef(false);
  const isActiveRef = useRef(false);
  const dragStateRef = useRef<DragState | null>(null);
  const pinchStateRef = useRef<PinchState | null>(null);
  const trashZoneRef = useRef<HTMLDivElement>(null);
  const trashHoverRef = useRef(false);
  const draggingBlockIdRef = useRef<string | null>(null);
  const editingBlockRef = useRef<HTMLDivElement | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'ready' | 'missing' | 'denied'>('idle');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [trashHovering, setTrashHovering] = useState(false);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

  const existingCaptureUrl = useMemo(
    () => (existingCapture ? URL.createObjectURL(existingCapture) : null),
    [existingCapture]
  );
  const effectiveReviewUrl = reviewUrl || existingCaptureUrl;
  const effectiveRecordedBlob = recordedBlob || existingCapture;

  useEffect(() => {
    return () => {
      if (reviewUrl) {
        URL.revokeObjectURL(reviewUrl);
      }

      if (existingCaptureUrl) {
        URL.revokeObjectURL(existingCaptureUrl);
      }
    };
  }, [existingCaptureUrl, reviewUrl]);

  useEffect(() => {
    if (!editingBlockId || !editingBlockRef.current) {
      return;
    }

    const target = editingBlockRef.current;
    target.focus();

    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(target);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, [editingBlockId]);

  const clearDraftReview = useCallback(() => {
    setReviewVisible(false);
    setRecordedBlob(null);
    setReviewUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }

      return null;
    });
    setSaveMessage(null);
  }, []);

  const getRecordingMimeType = useCallback(() => {
    const candidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
      'video/mp4',
    ];

    if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
      return '';
    }

    return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) || '';
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      if (!isActiveRef.current || !videoRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      previewStreamRef.current = stream;
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.warn('Camera access unavailable:', error);
      setCameraError('카메라 접근 권한이 필요합니다.');
    }
  }, []);

  const stopRecordingStream = useCallback(() => {
    if (recordingStreamRef.current) {
      recordingStreamRef.current.getTracks().forEach((track) => track.stop());
      recordingStreamRef.current = null;
    }
  }, []);

  const stopPreviewStream = useCallback(() => {
    if (previewStreamRef.current) {
      previewStreamRef.current.getTracks().forEach((track) => track.stop());
      previewStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }

    setIsRecording(false);
    stopRecordingStream();
    stopPreviewStream();
  }, [stopPreviewStream, stopRecordingStream]);

  useEffect(() => {
    isActiveRef.current = true;
    skipCaptureRef.current = false;
    const startTimer = window.setTimeout(() => {
      void startCamera();
    }, 0);

    return () => {
      window.clearTimeout(startTimer);
      isActiveRef.current = false;
      skipCaptureRef.current = true;
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const applyBlocks = useCallback((updater: (blocks: PrompterBlock[]) => PrompterBlock[]) => {
    const nextBlocks = normalizeBlockOrder(
      updater(
        prompterBlocks
          .slice()
          .sort((left, right) => left.order - right.order)
      )
    );

    onPrompterBlocksChange(nextBlocks);
  }, [onPrompterBlocksChange, prompterBlocks]);

  const updateBlock = useCallback((blockId: string, updater: (block: PrompterBlock) => PrompterBlock) => {
    applyBlocks((blocks) => blocks.map((block) => (block.id === blockId ? updater(block) : block)));
  }, [applyBlocks]);

  const addCustomBlock = useCallback(() => {
    const nextBlock = createCustomPrompterBlock(prompterBlocks.length + 1);
    applyBlocks((blocks) => [
      ...blocks,
      nextBlock,
    ]);
    setEditingBlockId(nextBlock.id);
    setEditingValue(nextBlock.content);
    setFocusedBlockId(nextBlock.id);
    setLayoutOpen(false);
  }, [applyBlocks, prompterBlocks.length]);

  const cancelInlineEdit = useCallback(() => {
    setEditingBlockId(null);
    setEditingValue('');
  }, []);

  const removeCustomBlock = useCallback((blockId: string) => {
    applyBlocks((blocks) => blocks.filter((block) => block.id !== blockId));
  }, [applyBlocks]);

  const updateBlockScale = useCallback((blockId: string, nextScale: number) => {
    updateBlock(blockId, (block) => ({
      ...block,
      scale: Math.min(2.5, Math.max(0.35, nextScale)),
    }));
  }, [updateBlock]);

  const discardBlock = useCallback((blockId: string) => {
    const target = prompterBlocks.find((block) => block.id === blockId);
    if (!target) {
      return;
    }

    if (focusedBlockId === blockId) {
      setFocusedBlockId(null);
    }

    if (target.id.startsWith('custom-')) {
      removeCustomBlock(blockId);
      return;
    }

    updateBlock(blockId, (block) => ({
      ...block,
      visible: false,
    }));
  }, [focusedBlockId, prompterBlocks, removeCustomBlock, updateBlock]);

  const updateBlockAccentColor = useCallback((blockId: string, accentColor: PrompterCueAccent) => {
    updateBlock(blockId, (block) => ({
      ...block,
      accentColor,
    }));
  }, [updateBlock]);

  const getTouchDistance = useCallback((touches: ArrayLike<{ clientX: number; clientY: number }>) => {
    if (touches.length < 2) {
      return 0;
    }

    const [first, second] = [touches[0], touches[1]];
    return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
  }, []);

  const commitInlineEdit = useCallback((blockId: string) => {
    const target = prompterBlocks.find((block) => block.id === blockId);
    if (!target) {
      cancelInlineEdit();
      return;
    }

    const nextContent = (editingBlockRef.current?.innerText ?? editingValue).trim() || target.content;
    if (nextContent !== target.content) {
      updateBlock(blockId, (block) => ({
        ...block,
        content: nextContent,
      }));
    }

    cancelInlineEdit();
  }, [cancelInlineEdit, editingValue, prompterBlocks, updateBlock]);

  const startInlineEdit = useCallback((blockId: string, content: string) => {
    dragStateRef.current = null;
    pinchStateRef.current = null;
    setEditingBlockId(blockId);
    setEditingValue(content);
    setFocusedBlockId(blockId);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const active = dragStateRef.current;
      const container = containerRef.current;
      if (!active || !container || pinchStateRef.current || event.pointerId !== active.pointerId) {
        return;
      }

      if (active.mode === 'resize') {
        const delta = Math.max(event.clientX - (active.startX || 0), event.clientY - (active.startY || 0));
        updateBlockScale(active.blockId, (active.startScale || 1) + delta / 180);
        return;
      }

      const rect = container.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(0.9, Math.max(0.08, (event.clientY - rect.top) / rect.height));

      updateBlock(active.blockId, (block) => ({
        ...block,
        x,
        y,
      }));

      const trashRect = trashZoneRef.current?.getBoundingClientRect();
      const isHoveringTrash = Boolean(
        trashRect
        && event.clientX >= trashRect.left
        && event.clientX <= trashRect.right
        && event.clientY >= trashRect.top
        && event.clientY <= trashRect.bottom
      );

      if (trashHoverRef.current !== isHoveringTrash) {
        trashHoverRef.current = isHoveringTrash;
        setTrashHovering(isHoveringTrash);
      }
    };

    const handlePointerUp = () => {
      const active = dragStateRef.current;
      if (active?.mode === 'drag' && trashHoverRef.current) {
        discardBlock(active.blockId);
      }

      dragStateRef.current = null;
      trashHoverRef.current = false;
      draggingBlockIdRef.current = null;
      setDraggingBlockId(null);
      setTrashHovering(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [discardBlock, updateBlock, updateBlockScale]);

  const startRecording = async () => {
    const previewStream = previewStreamRef.current;
    if (!previewStream || isRecording || !isActiveRef.current) {
      return;
    }

    const previewVideoTrack = previewStream.getVideoTracks()[0];
    if (!previewVideoTrack) {
      return;
    }

    clearDraftReview();
    const recordingTracks: MediaStreamTrack[] = [previewVideoTrack.clone()];
    setSaveMessage(null);
    setAudioStatus('missing');

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTrack = audioStream.getAudioTracks()[0];
      if (audioTrack) {
        recordingTracks.push(audioTrack);
        setAudioStatus('ready');
      }
    } catch (error) {
      console.warn('Audio access denied, recording video without microphone:', error);
      setAudioStatus('denied');
    }

    if (!isActiveRef.current) {
      recordingTracks.forEach((track) => track.stop());
      return;
    }

    const recordingStream = new MediaStream(recordingTracks);
    recordingStreamRef.current = recordingStream;
    const recordingMimeType = getRecordingMimeType();
    const mediaRecorder = recordingMimeType
      ? new MediaRecorder(recordingStream, { mimeType: recordingMimeType })
      : new MediaRecorder(recordingStream);

    mediaRecorderRef.current = mediaRecorder;
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      stopRecordingStream();
      mediaRecorderRef.current = null;
      setIsRecording(false);

      if (skipCaptureRef.current) {
        return;
      }

      const blob = new Blob(chunks, { type: mediaRecorder.mimeType || recordingMimeType || 'video/webm' });
      if (blob.size > 0) {
        const nextUrl = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setReviewVisible(true);
        setReviewUrl((previousUrl) => {
          if (previousUrl) {
            URL.revokeObjectURL(previousUrl);
          }
          return nextUrl;
        });
      }
    };

    skipCaptureRef.current = false;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive' && isRecording) {
      skipCaptureRef.current = false;
      recorder.stop();
    }
  };

  const handleShootButton = () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    void startRecording();
  };

  const handleRetry = () => {
    clearDraftReview();
  };

  const handleUseTake = () => {
    if (!effectiveRecordedBlob) {
      return;
    }

    setReviewVisible(false);
    onCapture(effectiveRecordedBlob);
    setSaveMessage('Take saved');
  };

  const visibleBlocks = prompterBlocks
    .filter((block) => block.visible)
    .sort((left, right) => left.order - right.order);
  const focusedBlock = visibleBlocks.find((block) => block.id === focusedBlockId) || null;

  const containerClass = embedded
    ? 'relative h-full w-full bg-black'
    : 'fixed inset-0 z-50 bg-black';

  return (
    <div className={containerClass}>
      <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />

        {visibleBlocks.map((block) => {
          const scale = block.scale ?? 1;
          const isEditing = editingBlockId === block.id;
          const position = {
            left: `${((block.x ?? presetOffsetMap[block.positionPreset].x) * 100).toFixed(2)}%`,
            top: `${((block.y ?? presetOffsetMap[block.positionPreset].y) * 100).toFixed(2)}%`,
          };

          return (
            <div
              key={block.id}
              onPointerDown={(event) => {
                if (isEditing) {
                  return;
                }
                setFocusedBlockId(block.id);
                dragStateRef.current = {
                  mode: 'drag',
                  blockId: block.id,
                  pointerId: event.pointerId,
                };
                draggingBlockIdRef.current = block.id;
                trashHoverRef.current = false;
                setDraggingBlockId(block.id);
                setTrashHovering(false);
                (event.currentTarget as HTMLDivElement).setPointerCapture?.(event.pointerId);
              }}
              onDoubleClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                startInlineEdit(block.id, block.content);
              }}
              onTouchStart={(event) => {
                if (isEditing) {
                  return;
                }
                if (event.touches.length !== 2) {
                  return;
                }

                dragStateRef.current = null;
                pinchStateRef.current = {
                  blockId: block.id,
                  startDistance: getTouchDistance(event.touches),
                  startScale: block.scale ?? 1,
                };
              }}
              onTouchMove={(event) => {
                if (isEditing) {
                  return;
                }
                const pinch = pinchStateRef.current;
                if (!pinch || pinch.blockId !== block.id || event.touches.length !== 2) {
                  return;
                }

                event.preventDefault();
                const nextDistance = getTouchDistance(event.touches);
                if (!nextDistance || !pinch.startDistance) {
                  return;
                }

                updateBlockScale(block.id, pinch.startScale * (nextDistance / pinch.startDistance));
              }}
              onTouchEnd={(event) => {
                if (event.touches.length < 2) {
                  dragStateRef.current = null;
                  pinchStateRef.current = null;
                }
              }}
              className={`absolute z-10 w-max max-w-[82%] select-none rounded-[1.75rem] border font-semibold tracking-[-0.02em] shadow-[0_16px_40px_rgb(0_0_0_/_0.25)] touch-none ${sizeClassMap[block.size]} ${getBlockTone(block)} ${isEditing ? 'cursor-text' : 'cursor-move'}`}
              style={{
                ...position,
                transform: `translate(-50%, -50%) scale(${scale})`,
                transformOrigin: 'center center',
              }}
            >
              {isEditing ? (
                <div
                  ref={editingBlockRef}
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onPointerDown={(event) => event.stopPropagation()}
                  onDoubleClick={(event) => event.stopPropagation()}
                  onBlur={() => commitInlineEdit(block.id)}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                      event.preventDefault();
                      commitInlineEdit(block.id);
                    }

                    if (event.key === 'Escape') {
                      event.preventDefault();
                      cancelInlineEdit();
                    }
                  }}
                  className="inline-block min-w-[2ch] whitespace-pre-wrap break-words bg-transparent p-0 font-semibold tracking-[-0.02em] text-inherit outline-none"
                >
                  {editingValue}
                </div>
              ) : null}
              {!isEditing ? (
                <span className="whitespace-pre-wrap">{block.content}</span>
              ) : null}
              {!isEditing ? (
                <span
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    dragStateRef.current = {
                      mode: 'resize',
                      blockId: block.id,
                      pointerId: event.pointerId,
                      startX: event.clientX,
                      startY: event.clientY,
                      startScale: block.scale ?? 1,
                    };
                  }}
                  className="absolute -bottom-2 -right-2 hidden h-5 w-5 items-center justify-center rounded-full border border-white/25 bg-black/70 text-[10px] text-white shadow-lg md:flex"
                  aria-hidden="true"
                >
                  ↘
                </span>
              ) : null}
            </div>
          );
        })}

        {isRecording ? (
          <div className="absolute right-4 top-16 z-20">
            <div className="flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5">
              <div className="h-3 w-3 animate-pulse rounded-full bg-white" />
              <span className="text-sm font-bold text-white">REC</span>
            </div>
          </div>
        ) : null}

        {cameraError ? (
          <div className="absolute left-1/2 top-24 z-20 w-[min(88%,22rem)] -translate-x-1/2 rounded-3xl border border-amber-300/25 bg-amber-500/18 px-4 py-3 text-center text-sm font-medium text-amber-50 shadow-[0_18px_40px_rgb(0_0_0_/_0.28)] backdrop-blur-sm">
            {cameraError}
          </div>
        ) : null}

        <div className="absolute bottom-8 left-0 right-0 z-20">
          {draggingBlockId ? (
            <div className="pointer-events-none absolute left-1/2 top-[-4.5rem] -translate-x-1/2">
              <div
                ref={trashZoneRef}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm shadow-[0_12px_24px_rgb(0_0_0_/_0.22)] transition ${
                  trashHovering
                    ? 'border-rose-300 bg-rose-500 text-white scale-110'
                    : 'border-white/18 bg-black/72 text-white/85'
                }`}
              >
                🗑
              </div>
            </div>
          ) : null}

          {focusedBlock && !draggingBlockId ? (
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/66 px-3 py-2 shadow-[0_12px_28px_rgb(0_0_0_/_0.24)] backdrop-blur-sm">
                {PROMPTER_CUE_ACCENT_ORDER.map((accent) => {
                  const currentAccent = isPrompterCueAccent(focusedBlock.accentColor)
                    ? focusedBlock.accentColor
                    : getDefaultPrompterAccent(focusedBlock.type);

                  return (
                    <button
                      key={accent}
                      type="button"
                      onClick={() => updateBlockAccentColor(focusedBlock.id, accent)}
                      className={`h-7 w-7 rounded-full border-2 transition ${
                        currentAccent === accent ? 'scale-110 border-white' : 'border-transparent opacity-80'
                      } ${getAccentSwatchClass(accent)}`}
                      aria-label={`Set cue color to ${accent}`}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={addCustomBlock}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2f6bff_0%,#5f8bff_55%,#ff7a59_100%)] text-[1.65rem] font-semibold leading-none text-white shadow-[0_18px_34px_rgb(47_107_255_/_0.22)] transition hover:brightness-105 active:scale-[0.98]"
              aria-label="Add cue"
            >
              +
            </button>

            <button
              onClick={handleShootButton}
              className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all ${
                isRecording ? 'scale-90 bg-red-500' : 'border-4 border-red-500 bg-white'
              }`}
            >
              {isRecording ? (
                <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-red-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setReviewVisible(true);
                if (reviewVideoRef.current) {
                  reviewVideoRef.current.currentTime = 0;
                  void reviewVideoRef.current.play().catch(() => {
                    // ignore replay failures
                  });
                }
              }}
              disabled={!effectiveReviewUrl}
              className="w-[72px] rounded-xl bg-white/95 px-3 py-2.5 text-xs font-semibold text-gray-900 shadow-lg disabled:cursor-not-allowed disabled:opacity-45"
            >
              Review
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-center">
            {audioStatus === 'ready' ? (
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-100">Mic ready</span>
            ) : audioStatus === 'denied' ? (
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-100">Mic denied</span>
            ) : null}
            {saveMessage ? (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">{saveMessage}</span>
            ) : null}
          </div>
        </div>

        {layoutOpen ? (
          <div className="absolute inset-x-0 bottom-0 z-30 max-h-[46%] overflow-hidden rounded-t-[2rem] border-t border-white/15 bg-[#0f1218]/96 px-4 pb-6 pt-3 text-white backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Prompter Layout</p>
                <h3 className="text-lg font-bold text-white">Choose what you want to see while shooting</h3>
                <p className="mt-1 text-xs font-medium text-white/45">Drag blocks on the camera, pinch to zoom on touch, edit the text you want, and add your own cue when needed.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addCustomBlock}
                  className="rounded-full border border-sky-300/20 bg-sky-500/18 px-3 py-1.5 text-xs font-semibold text-sky-50"
                >
                  + Add cue
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutOpen(false)}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1">
              {prompterBlocks.map((block) => (
                <div key={block.id} className="rounded-3xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={block.label || ''}
                          onChange={(event) => updateBlock(block.id, (current) => ({ ...current, label: event.target.value }))}
                          placeholder="Block label"
                          className="min-w-[10rem] flex-1 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm font-semibold text-white placeholder:text-white/30"
                        />
                        {block.id.startsWith('custom-') ? (
                          <span className="rounded-full border border-emerald-300/20 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
                            Custom
                          </span>
                        ) : null}
                      </div>
                      <textarea
                        value={block.content}
                        onChange={(event) => updateBlock(block.id, (current) => ({ ...current, content: event.target.value }))}
                        rows={3}
                        placeholder="Cue text"
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white placeholder:text-white/30"
                      />
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => updateBlock(block.id, (current) => ({ ...current, visible: !current.visible }))}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          block.visible ? 'bg-white text-slate-900' : 'bg-white/10 text-white/70'
                        }`}
                      >
                        {block.visible ? 'Visible' : 'Hidden'}
                      </button>
                      {block.id.startsWith('custom-') ? (
                        <button
                          type="button"
                          onClick={() => removeCustomBlock(block.id)}
                          className="rounded-full border border-rose-300/20 bg-rose-500/12 px-3 py-1.5 text-xs font-semibold text-rose-100"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <label className="space-y-1 text-xs font-medium text-white/60">
                      <span>Tone</span>
                      <select
                        value={block.type}
                        onChange={(event) => updateBlock(block.id, (current) => ({ ...current, type: event.target.value as PrompterBlock['type'] }))}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white"
                      >
                        {prompterTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1 text-xs font-medium text-white/60">
                      <span>Size</span>
                      <select
                        value={block.size}
                        onChange={(event) => updateBlock(block.id, (current) => ({ ...current, size: event.target.value as PrompterBlock['size'] }))}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white"
                      >
                        <option value="sm">Small</option>
                        <option value="md">Medium</option>
                        <option value="lg">Large</option>
                        <option value="xl">XL</option>
                      </select>
                    </label>

                    <label className="space-y-1 text-xs font-medium text-white/60">
                      <span>Preset</span>
                      <select
                        value={block.positionPreset}
                        onChange={(event) =>
                          updateBlock(block.id, (current) => ({
                            ...current,
                            positionPreset: event.target.value as PrompterBlock['positionPreset'],
                            x: undefined,
                            y: undefined,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white"
                      >
                        <option value="top">Top</option>
                        <option value="upperThird">Upper third</option>
                        <option value="center">Center</option>
                        <option value="lowerThird">Lower third</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </label>

                    <label className="space-y-1 text-xs font-medium text-white/60">
                      <span>Scale</span>
                      <input
                        type="range"
                        min="0.65"
                        max="2.5"
                        step="0.05"
                        value={block.scale ?? 1}
                        onChange={(event) => updateBlockScale(block.id, Number(event.target.value))}
                        className="w-full accent-white"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {reviewVisible && effectiveReviewUrl ? (
          <div className="absolute inset-0 z-40 bg-black/82 px-5 py-6 backdrop-blur-sm">
            <div className="mx-auto flex h-full max-w-sm flex-col">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">Review Take</p>
                  <h3 className="text-lg font-bold text-white">Scene #{sceneId}</h3>
                </div>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Close
                </button>
              </div>

              <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black">
                <video
                  ref={reviewVideoRef}
                  src={effectiveReviewUrl}
                  controls
                  playsInline
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={handleUseTake}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black"
                >
                  Use Take
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
