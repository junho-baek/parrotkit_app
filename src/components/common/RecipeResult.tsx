'use client';

import React, { useCallback, useRef, useState } from 'react';
import JSZip from 'jszip';
import { useRouter } from 'next/navigation';
import { CameraShooting } from './CameraShooting';
import { RecipeVideoPlayer } from './RecipeVideoPlayer';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Spinner } from '@/components/ui/spinner';
import { authenticatedFetch, ensureValidAccessToken } from '@/lib/auth/client-session';
import { logClientEvent } from '@/lib/client-events';
import { buildPersistableScenes, getSceneCardSummary, getSceneScriptLines, normalizeBrandBrief, normalizeRecipeScenes } from '@/lib/recipe-scene';
import type { BrandBrief, PrompterBlock, RecipeScene } from '@/types/recipe';

type DetailTab = 'analysis' | 'recipe' | 'prompter';
type ScriptSheetTab = Exclude<DetailTab, 'prompter'>;
type ChatRole = 'user' | 'assistant';
type AssistantMode = 'global' | 'scene';

type SceneUpdate = {
  appealPoint?: string;
  keyLine?: string;
  scriptLines?: string[];
  keyMood?: string;
  keyAction?: string;
  mustInclude?: string[];
  mustAvoid?: string[];
  prompterBlocks?: Array<Partial<PrompterBlock> & { id?: string; type?: string }>;
};

type ChatMessage = {
  role: ChatRole;
  content: string;
  sceneUpdate?: SceneUpdate | null;
};

const PROMPTER_PERSIST_DEBOUNCE_MS = 275;

interface RecipeResultProps {
  scenes: RecipeScene[];
  videoUrl: string;
  onBack?: () => void;
  recipeId?: string;
  initialCapturedVideos?: { [key: number]: boolean };
  initialMatchResults?: { [key: number]: boolean };
  brandBrief?: BrandBrief | null;
  analysisMetadata?: Record<string, unknown>;
}

function mergePrompterBlocks(existingBlocks: PrompterBlock[], updates: SceneUpdate['prompterBlocks']) {
  if (!updates || updates.length === 0) {
    return existingBlocks;
  }

  const nextBlocks = [...existingBlocks];

  for (const update of updates) {
    const targetIndex = nextBlocks.findIndex((block) =>
      (update.id && block.id === update.id) || (update.type && block.type === update.type)
    );

    if (targetIndex >= 0) {
      nextBlocks[targetIndex] = {
        ...nextBlocks[targetIndex],
        ...(update.id ? { id: update.id } : {}),
        ...(update.type ? { type: update.type as PrompterBlock['type'] } : {}),
        ...(typeof update.label === 'string' ? { label: update.label } : {}),
        ...(typeof update.content === 'string' ? { content: update.content } : {}),
        ...(typeof update.visible === 'boolean' ? { visible: update.visible } : {}),
        ...(update.size ? { size: update.size } : {}),
        ...(typeof update.scale === 'number' ? { scale: update.scale } : {}),
        ...(update.positionPreset ? { positionPreset: update.positionPreset } : {}),
        ...(typeof update.order === 'number' ? { order: update.order } : {}),
      };
    }
  }

  return nextBlocks.sort((left, right) => left.order - right.order);
}

function getPrompterBlockLabel(block: PrompterBlock) {
  if (block.label) {
    return block.label;
  }

  switch (block.type) {
    case 'key_line':
      return 'Main Script';
    case 'appeal_point':
      return 'Cut Goal';
    case 'action':
      return 'Action';
    case 'mood':
      return 'Mood';
    case 'warning':
      return 'Avoid Cue';
    case 'cta':
      return 'CTA';
    default:
      return 'Cue';
  }
}

function getSceneTranscriptLines(scene: RecipeScene) {
  const originalLines = (scene.analysis.transcriptOriginal || [])
    .map((line) => line.trim())
    .filter(Boolean);

  if (originalLines.length > 0) {
    return originalLines;
  }

  const fallbackSnippet = (scene.analysis.transcriptSnippet || scene.transcriptSnippet || '').trim();
  return fallbackSnippet ? [fallbackSnippet] : [];
}

function getScriptSheetButtonLabel(tab: ScriptSheetTab) {
  return tab === 'analysis' ? 'View Original Script' : 'View Your Script';
}

function getScriptSheetTitle(tab: ScriptSheetTab) {
  return tab === 'analysis' ? 'Original Script' : 'Your Script';
}

function getScriptSheetDescription(tab: ScriptSheetTab) {
  return tab === 'analysis' ? 'Reference transcript only' : 'Creator-ready lines only';
}

function getScriptSheetEmptyMessage(tab: ScriptSheetTab) {
  return tab === 'analysis'
    ? 'No original transcript was captured for this cut.'
    : 'No creator script is available for this cut yet.';
}

function containsKeyword(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function getSceneStrategyMeta(scene: RecipeScene, sceneIndex: number, totalScenes: number) {
  const searchableText = [
    scene.title,
    scene.recipe.objective,
    scene.recipe.appealPoint,
    scene.recipe.keyLine,
    scene.recipe.keyAction,
    scene.recipe.cta || '',
    scene.analysis.motionDescription || '',
    scene.analysis.transcriptSnippet || '',
  ]
    .join(' ')
    .toLowerCase();

  const getHookPattern = () => {
    if (containsKeyword(searchableText, ['myth', 'actually', 'the truth', 'instead', 'secret', '속지', '몰랐', '반전'])) {
      return 'Myth-Busting';
    }

    if (containsKeyword(searchableText, ['problem', 'mistake', 'avoid', 'stop', 'warning', 'wrong', '실수', '문제', '조심', '피하', '절대'])) {
      return 'Problem-Led';
    }

    return 'Outcome-First';
  };

  const getBasePattern = () => {
    if (containsKeyword(searchableText, ['?', 'why', 'how', 'what', '여러분', '아세요'])) {
      return 'Question Lead';
    }

    if (containsKeyword(searchableText, ['kitchen', 'store', 'shop', 'cafe', 'room', 'desk', 'table', 'outside', 'inside', '가서', '에서'])) {
      return 'Scene Change';
    }

    if (containsKeyword(searchableText, ['expert', 'doctor', 'founder', 'coach', 'chef', 'specialist', 'authority', '전문가', '현직', '추천'])) {
      return 'Authority Cue';
    }

    return 'Real Example';
  };

  const getCtaPattern = () => {
    if (containsKeyword(searchableText, ['now', 'today', 'must', 'save this', 'follow', 'click', 'buy', 'join', 'download', '지금', '바로', '꼭', '무조건'])) {
      return 'Hard CTA';
    }

    return 'Soft CTA';
  };

  if (sceneIndex === 0) {
    return { stageLabel: 'HOOK', patternLabel: getHookPattern() };
  }

  if (sceneIndex === totalScenes - 1) {
    return { stageLabel: 'CTA', patternLabel: getCtaPattern() };
  }

  return {
    stageLabel: `BASE #${sceneIndex}`,
    patternLabel: getBasePattern(),
  };
}

export const RecipeResult: React.FC<RecipeResultProps> = ({
  scenes,
  videoUrl,
  onBack,
  recipeId,
  initialCapturedVideos = {},
  initialMatchResults = {},
  brandBrief = null,
  analysisMetadata,
}) => {
  const router = useRouter();
  const resolvedBrandBrief = React.useMemo(
    () => normalizeBrandBrief(brandBrief || analysisMetadata?.brandBrief) || null,
    [analysisMetadata, brandBrief]
  );
  const normalizedIncomingScenes = React.useMemo(
    () => normalizeRecipeScenes(scenes, resolvedBrandBrief),
    [resolvedBrandBrief, scenes]
  );
  const [recipeScenes, setRecipeScenes] = useState<RecipeScene[]>(normalizedIncomingScenes);
  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('analysis');
  const [capturedVideos, setCapturedVideos] = useState<{ [key: number]: Blob }>({});
  const [isExporting, setIsExporting] = useState(false);
  const [isExported, setIsExported] = useState(false);
  const [capturedScenes, setCapturedScenes] = useState<{ [key: number]: boolean }>(initialCapturedVideos);
  const [uploadingScenes, setUploadingScenes] = useState<{ [key: number]: boolean }>({});
  const [uploadErrors, setUploadErrors] = useState<{ [key: number]: string }>({});
  const [sceneSaveError, setSceneSaveError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [assistantMode, setAssistantMode] = useState<AssistantMode>('global');
  const [globalChatHistory, setGlobalChatHistory] = useState<ChatMessage[]>([]);
  const [sceneChatHistory, setSceneChatHistory] = useState<Record<number, ChatMessage[]>>({});
  const [chatLoading, setChatLoading] = useState(false);
  const [applyingUpdateMessageIndex, setApplyingUpdateMessageIndex] = useState<number | null>(null);
  const [sheetHeight, setSheetHeight] = useState(50);
  const [scriptSheetOpen, setScriptSheetOpen] = useState(false);
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const capturedScenesRef = useRef<{ [key: number]: boolean }>(initialCapturedVideos);
  const prompterPersistTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPrompterScenesRef = useRef<RecipeScene[] | null>(null);

  React.useEffect(() => {
    setRecipeScenes(normalizedIncomingScenes);
  }, [normalizedIncomingScenes]);

  React.useEffect(() => {
    setSelectedSceneId(null);
    setActiveTab('analysis');
    setAssistantMode('global');
    setGlobalChatHistory([]);
    setSceneChatHistory({});
    setChatOpen(false);
    setChatMessage('');
    setSceneSaveError(null);
  }, [recipeId, videoUrl, scenes]);

  React.useEffect(() => {
    setScriptSheetOpen(false);
  }, [activeTab, selectedSceneId]);

  const selectedScene = React.useMemo(
    () => recipeScenes.find((scene) => scene.id === selectedSceneId) || null,
    [recipeScenes, selectedSceneId]
  );
  const selectedSceneIndex = React.useMemo(
    () => recipeScenes.findIndex((scene) => scene.id === selectedSceneId),
    [recipeScenes, selectedSceneId]
  );
  const activeScriptTab: ScriptSheetTab | null = activeTab === 'analysis' || activeTab === 'recipe' ? activeTab : null;
  const activeScriptLines = selectedScene
    ? activeScriptTab === 'analysis'
      ? getSceneTranscriptLines(selectedScene)
      : activeScriptTab === 'recipe'
        ? getSceneScriptLines(selectedScene)
        : []
    : [];

  const localCapturedSceneIds = React.useMemo(
    () =>
      Object.keys(capturedVideos)
        .map((sceneId) => Number(sceneId))
        .filter((sceneId) => Number.isFinite(sceneId)),
    [capturedVideos]
  );

  const exportableSceneIds = React.useMemo(() => {
    const uniqueSceneIds = new Set<number>(localCapturedSceneIds);
    Object.keys(capturedScenes).forEach((sceneId) => {
      uniqueSceneIds.add(Number(sceneId));
    });

    return Array.from(uniqueSceneIds).filter(Number.isFinite).sort((left, right) => left - right);
  }, [capturedScenes, localCapturedSceneIds]);

  const exportableCaptureCount = exportableSceneIds.length;
  const localOnlyCaptureCount = React.useMemo(
    () => localCapturedSceneIds.filter((sceneId) => !capturedScenes[sceneId]).length,
    [capturedScenes, localCapturedSceneIds]
  );
  const uploadingCount = Object.keys(uploadingScenes).length;
  const hasLocalOnlyCaptures = localOnlyCaptureCount > 0;

  const getSceneAssistantIntro = React.useCallback((scene: RecipeScene): ChatMessage => ({
    role: 'assistant',
    content: `Hi! I'm refining #${scene.id}: ${scene.title}. Ask me to sharpen the cut goal, tighten the script, change the mood, or adjust what appears in the prompter.`,
  }), []);

  const globalAssistantIntro = React.useMemo<ChatMessage>(() => ({
    role: 'assistant',
    content: "Hi! I'm your Recipe Assistant. I can help with overall recipe flow, stronger hooks, better cut-by-cut pacing, and creator-friendly scene planning.",
  }), []);

  const activeChatHistory = React.useMemo(() => {
    if (assistantMode === 'scene' && selectedScene) {
      return sceneChatHistory[selectedScene.id] || [];
    }

    return globalChatHistory;
  }, [assistantMode, globalChatHistory, sceneChatHistory, selectedScene]);

  const activeThreadMessages = React.useMemo(() => {
    if (assistantMode === 'scene' && selectedScene) {
      const history = sceneChatHistory[selectedScene.id] || [];
      return history.length > 0 ? history : [getSceneAssistantIntro(selectedScene)];
    }

    return globalChatHistory.length > 0 ? globalChatHistory : [globalAssistantIntro];
  }, [assistantMode, getSceneAssistantIntro, globalAssistantIntro, globalChatHistory, sceneChatHistory, selectedScene]);

  const buildRecipeSessionData = React.useCallback((nextScenes: RecipeScene[]) => ({
    scenes: buildPersistableScenes(nextScenes),
    videoUrl,
    capturedVideos: capturedScenesRef.current,
    matchResults: initialMatchResults,
    recipeId: recipeId || '',
    brandBrief: resolvedBrandBrief,
    analysisMetadata: {
      ...(analysisMetadata || {}),
      ...(resolvedBrandBrief ? { brandBrief: resolvedBrandBrief } : {}),
    },
  }), [analysisMetadata, initialMatchResults, recipeId, resolvedBrandBrief, videoUrl]);

  const syncRecipeSessionStorage = React.useCallback((nextScenes: RecipeScene[]) => {
    if (typeof window === 'undefined') {
      return;
    }

    sessionStorage.setItem('recipeData', JSON.stringify(buildRecipeSessionData(nextScenes)));
  }, [buildRecipeSessionData]);

  const persistRecipeScenes = React.useCallback(async (nextScenes: RecipeScene[]) => {
    if (!recipeId) {
      syncRecipeSessionStorage(nextScenes);
      return true;
    }

    const token = await ensureValidAccessToken();
    if (!token) {
      setSceneSaveError('Login required to save this recipe.');
      return false;
    }

    const response = await authenticatedFetch(`/api/recipes/${recipeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenes: buildPersistableScenes(nextScenes),
        analysisMetadata: {
          ...(analysisMetadata || {}),
          ...(resolvedBrandBrief ? { brandBrief: resolvedBrandBrief } : {}),
        },
      }),
    });

    if (!response.ok) {
      setSceneSaveError('Could not save the recipe yet. Your local change is still visible.');
      return false;
    }

    syncRecipeSessionStorage(nextScenes);
    setSceneSaveError(null);
    return true;
  }, [analysisMetadata, recipeId, resolvedBrandBrief, syncRecipeSessionStorage]);

  const clearPrompterPersistTimeout = React.useCallback(() => {
    if (!prompterPersistTimeoutRef.current) {
      return;
    }

    clearTimeout(prompterPersistTimeoutRef.current);
    prompterPersistTimeoutRef.current = null;
  }, []);

  const cancelPendingPrompterPersistence = React.useCallback(() => {
    pendingPrompterScenesRef.current = null;
    clearPrompterPersistTimeout();
  }, [clearPrompterPersistTimeout]);

  const flushPendingPrompterPersistence = React.useCallback(() => {
    const pendingScenes = pendingPrompterScenesRef.current;
    if (!pendingScenes) {
      return;
    }

    pendingPrompterScenesRef.current = null;
    clearPrompterPersistTimeout();
    syncRecipeSessionStorage(pendingScenes);
    void persistRecipeScenes(pendingScenes);
  }, [clearPrompterPersistTimeout, persistRecipeScenes, syncRecipeSessionStorage]);

  const schedulePrompterPersistence = React.useCallback((nextScenes: RecipeScene[]) => {
    syncRecipeSessionStorage(nextScenes);

    if (!recipeId) {
      pendingPrompterScenesRef.current = null;
      clearPrompterPersistTimeout();
      return;
    }

    pendingPrompterScenesRef.current = nextScenes;
    clearPrompterPersistTimeout();

    prompterPersistTimeoutRef.current = setTimeout(() => {
      const pendingScenes = pendingPrompterScenesRef.current;
      pendingPrompterScenesRef.current = null;
      clearPrompterPersistTimeout();

      if (!pendingScenes) {
        return;
      }

      void persistRecipeScenes(pendingScenes);
    }, PROMPTER_PERSIST_DEBOUNCE_MS);
  }, [clearPrompterPersistTimeout, persistRecipeScenes, recipeId, syncRecipeSessionStorage]);

  React.useEffect(() => () => {
    flushPendingPrompterPersistence();
  }, [flushPendingPrompterPersistence, recipeId, videoUrl]);

  const setActiveThread = React.useCallback((messages: ChatMessage[]) => {
    if (assistantMode === 'scene' && selectedScene) {
      setSceneChatHistory((prev) => ({
        ...prev,
        [selectedScene.id]: messages,
      }));
      return;
    }

    setGlobalChatHistory(messages);
  }, [assistantMode, selectedScene]);

  const closeChatAssistant = React.useCallback(() => {
    setChatOpen(false);
    setSheetHeight(50);
  }, []);

  const closeScriptSheet = React.useCallback(() => {
    setScriptSheetOpen(false);
  }, []);

  const openScriptSheet = React.useCallback(() => {
    closeChatAssistant();
    setScriptSheetOpen(true);
  }, [closeChatAssistant]);

  const openChatAssistant = React.useCallback((mode?: AssistantMode) => {
    setScriptSheetOpen(false);
    setAssistantMode(mode || (selectedScene ? 'scene' : 'global'));
    setChatOpen(true);
  }, [selectedScene]);

  const applySceneUpdate = React.useCallback(async (sceneUpdate: SceneUpdate, messageIndex: number) => {
    if (!selectedScene || assistantMode !== 'scene') {
      return;
    }

    setApplyingUpdateMessageIndex(messageIndex);
    await new Promise((resolve) => setTimeout(resolve, 700));

    const nextScenes = recipeScenes.map((scene) => {
      if (scene.id !== selectedScene.id) {
        return scene;
      }

      const nextScene: RecipeScene = {
        ...scene,
        recipe: {
          ...scene.recipe,
          ...(sceneUpdate.appealPoint ? { appealPoint: sceneUpdate.appealPoint } : {}),
          ...(sceneUpdate.keyLine ? { keyLine: sceneUpdate.keyLine } : {}),
          ...(sceneUpdate.scriptLines && sceneUpdate.scriptLines.length > 0 ? { scriptLines: sceneUpdate.scriptLines } : {}),
          ...(sceneUpdate.keyMood ? { keyMood: sceneUpdate.keyMood } : {}),
          ...(sceneUpdate.keyAction ? { keyAction: sceneUpdate.keyAction } : {}),
          ...(sceneUpdate.mustInclude ? { mustInclude: sceneUpdate.mustInclude } : {}),
          ...(sceneUpdate.mustAvoid ? { mustAvoid: sceneUpdate.mustAvoid } : {}),
        },
      };

      nextScene.script = nextScene.recipe.scriptLines;
      nextScene.description = nextScene.analysis.motionDescription || nextScene.recipe.appealPoint || nextScene.recipe.keyLine;
      nextScene.prompter = {
        blocks: mergePrompterBlocks(nextScene.prompter.blocks, sceneUpdate.prompterBlocks),
      };

      return nextScene;
    });

    cancelPendingPrompterPersistence();
    setRecipeScenes(nextScenes);
    setSceneSaveError(null);
    closeChatAssistant();
    setActiveTab('recipe');
    setScriptSheetOpen(true);
    syncRecipeSessionStorage(nextScenes);
    void persistRecipeScenes(nextScenes);
    setApplyingUpdateMessageIndex(null);
  }, [assistantMode, cancelPendingPrompterPersistence, closeChatAssistant, persistRecipeScenes, recipeScenes, selectedScene, syncRecipeSessionStorage]);

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || chatLoading) {
      return;
    }

    const userMsg = chatMessage.trim();
    setChatMessage('');
    const newHistory = [...activeChatHistory, { role: 'user' as const, content: userMsg }];
    setActiveThread(newHistory);
    setChatLoading(true);

    setTimeout(() => {
      chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);

    const payload = {
      messages: newHistory,
      mode: assistantMode,
      allScenes: recipeScenes,
      targetScene: selectedScene,
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.message) {
        setActiveThread([
          ...newHistory,
          {
            role: 'assistant',
            content: data.message,
            sceneUpdate: data.sceneUpdate || null,
          },
        ]);
      } else {
        setActiveThread([...newHistory, { role: 'assistant', content: `Error: ${data.error || 'Failed to get response'}` }]);
      }
    } catch {
      setActiveThread([...newHistory, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => {
        chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 50);
    }
  };

  const handleDragStart = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    dragRef.current = { startY: clientY, startHeight: sheetHeight };
  }, [sheetHeight]);

  const handleDragMove = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    if (!dragRef.current) {
      return;
    }

    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const deltaY = dragRef.current.startY - clientY;
    const deltaPercent = (deltaY / window.innerHeight) * 100;
    const newHeight = Math.min(90, Math.max(20, dragRef.current.startHeight + deltaPercent));
    setSheetHeight(newHeight);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!dragRef.current) {
      return;
    }

    if (sheetHeight < 15) {
      setChatOpen(false);
      setSheetHeight(50);
    }

    dragRef.current = null;
  }, [sheetHeight]);

  const handleSceneClick = (scene: RecipeScene) => {
    setSelectedSceneId(scene.id);
    setActiveTab('analysis');
    setAssistantMode('scene');
    closeChatAssistant();
  };

  const navigateScene = React.useCallback((direction: -1 | 1) => {
    if (selectedSceneIndex < 0) {
      return;
    }

    const nextScene = recipeScenes[selectedSceneIndex + direction];
    if (!nextScene) {
      return;
    }

    setSelectedSceneId(nextScene.id);
    closeChatAssistant();
    setAssistantMode('scene');
  }, [closeChatAssistant, recipeScenes, selectedSceneIndex]);

  const markSceneCaptured = useCallback((sceneId: number) => {
    setCapturedScenes((prev) => {
      const next = {
        ...prev,
        [sceneId]: true,
      };
      capturedScenesRef.current = next;
      return next;
    });
  }, []);

  const clearSceneCaptured = useCallback((sceneId: number) => {
    setCapturedScenes((prev) => {
      if (!prev[sceneId]) {
        return prev;
      }

      const next = { ...prev };
      delete next[sceneId];
      capturedScenesRef.current = next;
      return next;
    });
  }, []);

  const setSceneUploadingState = useCallback((sceneId: number, isUploading: boolean) => {
    setUploadingScenes((prev) => {
      const next = { ...prev };
      if (isUploading) {
        next[sceneId] = true;
      } else {
        delete next[sceneId];
      }
      return next;
    });
  }, []);

  const setSceneUploadError = useCallback((sceneId: number, message?: string) => {
    setUploadErrors((prev) => {
      const next = { ...prev };
      if (message) {
        next[sceneId] = message;
      } else {
        delete next[sceneId];
      }
      return next;
    });
  }, []);

  const persistProgress = async (sceneId: number) => {
    if (!recipeId) {
      return;
    }

    const token = await ensureValidAccessToken();
    if (!token) {
      return;
    }

    await authenticatedFetch(`/api/recipes/${recipeId}/progress`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sceneId,
        captured: true,
      }),
    });
  };

  const uploadCapture = async (sceneId: number, videoBlob: Blob) => {
    if (!recipeId) {
      return;
    }

    const token = await ensureValidAccessToken();
    if (!token) {
      throw new Error('LOGIN_REQUIRED');
    }

    const formData = new FormData();
    formData.append('sceneId', String(sceneId));
    formData.append('video', videoBlob, `scene-${sceneId}.webm`);

    const response = await authenticatedFetch(`/api/recipes/${recipeId}/captures`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload capture');
    }
  };

  const handleVideoCapture = async (videoBlob: Blob) => {
    if (!selectedScene) {
      return;
    }

    const capturedSceneId = selectedScene.id;

    setCapturedVideos((prev) => ({
      ...prev,
      [capturedSceneId]: videoBlob,
    }));

    setSceneUploadError(capturedSceneId);

    if (recipeId) {
      const hadUploadedCapture = Boolean(capturedScenesRef.current[capturedSceneId]);
      setSceneUploadingState(capturedSceneId, true);

      void (async () => {
        try {
          await uploadCapture(capturedSceneId, videoBlob);
          markSceneCaptured(capturedSceneId);
          await persistProgress(capturedSceneId);

          await logClientEvent('capture_uploaded', {
            recipe_id: recipeId,
            scene_id: capturedSceneId,
          });
        } catch (uploadError) {
          console.error('Capture upload warning:', uploadError);
          if (!hadUploadedCapture) {
            clearSceneCaptured(capturedSceneId);
          }
          setSceneUploadError(
            capturedSceneId,
            hadUploadedCapture
              ? 'Previous take is still safe. This new take is saved locally for download.'
              : 'Saved locally. You can still download this take even if sync failed.'
          );
        } finally {
          setSceneUploadingState(capturedSceneId, false);
        }
      })();
    } else {
      markSceneCaptured(capturedSceneId);
      void logClientEvent('capture_uploaded', {
        recipe_id: 'local',
        scene_id: capturedSceneId,
      });
    }

    setSceneSaveError(null);
  };

  const handleSceneBlocksChange = (sceneId: number, blocks: PrompterBlock[]) => {
    const nextScenes = recipeScenes.map((scene) =>
      scene.id === sceneId
        ? {
            ...scene,
            prompter: {
              blocks,
            },
          }
        : scene
    );

    setRecipeScenes(nextScenes);
    setSceneSaveError(null);
    schedulePrompterPersistence(nextScenes);
  };

  const toggleScenePrompterBlock = (sceneId: number, blockId: string) => {
    const scene = recipeScenes.find((item) => item.id === sceneId);
    if (!scene) {
      return;
    }

    handleSceneBlocksChange(
      sceneId,
      scene.prompter.blocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              visible: !block.visible,
            }
          : block
      )
    );
  };

  const handleDetailBack = () => {
    setSelectedSceneId(null);
    setActiveTab('analysis');
    setScriptSheetOpen(false);
    closeChatAssistant();
  };

  const handleExportVideos = async () => {
    if (exportableCaptureCount === 0) {
      alert('아직 촬영된 비디오가 없습니다.');
      return;
    }

    setIsExporting(true);

    try {
      const downloadBlob = (blob: Blob, fileName: string) => {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      };

      const appendLocalCapturesToZip = (zip: JSZip) => {
        let addedCount = 0;

        for (const [sceneId, videoBlob] of Object.entries(capturedVideos)) {
          const numericSceneId = Number(sceneId);
          const extension = videoBlob.type === 'video/mp4' ? 'mp4' : 'webm';
          zip.file(`scene-${numericSceneId}.${extension}`, videoBlob);
          addedCount += 1;
        }

        return addedCount;
      };

      if (recipeId) {
        const zip = new JSZip();
        let addedCount = 0;

        const token = await ensureValidAccessToken();
        if (token && Object.keys(capturedScenes).length > 0) {
          const response = await authenticatedFetch(`/api/recipes/${recipeId}/export-zip`, {
            method: 'GET',
          });

          if (response.ok) {
            const remoteZipBlob = await response.blob();
            const remoteZip = await JSZip.loadAsync(remoteZipBlob);
            const remoteFiles = Object.values(remoteZip.files).filter((file) => !file.dir);

            for (const file of remoteFiles) {
              zip.file(file.name, await file.async('uint8array'));
              addedCount += 1;
            }
          }
        }

        addedCount += appendLocalCapturesToZip(zip);
        if (addedCount === 0) {
          throw new Error('ZIP 다운로드에 실패했습니다.');
        }

        const archiveBlob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(archiveBlob, `recipe-${recipeId}.zip`);
        await logClientEvent('export_zip_success', { recipe_id: recipeId });
        setIsExported(true);
        return;
      }

      const zip = new JSZip();
      appendLocalCapturesToZip(zip);
      const archiveBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(archiveBlob, 'parrotkit-captures.zip');
      setIsExported(true);
    } catch (error) {
      console.error('Export error:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveAndGoToDashboard = async () => {
    await logClientEvent('recipe_saved', {
      recipe_id: recipeId || 'local',
      captured_count: exportableCaptureCount,
    });

    router.push('/recipes');
  };

  const renderRecipeDetail = (scene: RecipeScene) => (
    <div className="mx-auto flex h-full w-full max-w-[500px] flex-col overflow-y-auto bg-[#0b0d12] px-4 pb-10 pt-4 text-white">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_22px_50px_rgb(0_0_0_/_0.28)]">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100">
            Cut Goal
          </span>
          {resolvedBrandBrief?.productName ? (
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70">
              {resolvedBrandBrief.productName}
            </span>
          ) : null}
        </div>
        <p className="text-sm font-semibold leading-relaxed text-white/70">{scene.recipe.appealPoint}</p>
        <h2 className="mt-4 text-[1.85rem] font-bold tracking-[-0.04em] text-white">
          {scene.recipe.keyLine}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Mood</p>
            <p className="mt-2 text-sm font-semibold text-white">{scene.recipe.keyMood}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Action</p>
            <p className="mt-2 text-sm font-semibold text-white">{scene.recipe.keyAction}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Prompter Picks</p>
              <p className="mt-1 text-xs font-medium text-white/50">Check the cues you want to see while shooting.</p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70">
              {scene.prompter.blocks.filter((block) => block.visible).length} visible
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {scene.prompter.blocks
              .slice()
              .sort((left, right) => left.order - right.order)
              .map((block) => (
                <button
                  key={`${scene.id}-${block.id}`}
                  type="button"
                  onClick={() => toggleScenePrompterBlock(scene.id, block.id)}
                  className={`max-w-full rounded-[1.4rem] border px-3 py-2 text-left transition ${
                    block.visible
                      ? 'border-sky-300/35 bg-sky-500/14 text-sky-50 shadow-[0_10px_24px_rgb(14_165_233_/_0.12)]'
                      : 'border-white/10 bg-black/20 text-white/72'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                      block.visible ? 'border-sky-200 bg-sky-100 text-slate-950' : 'border-white/20 text-transparent'
                    }`}>
                      ✓
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                      {getPrompterBlockLabel(block)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">{block.content}</p>
                </button>
              ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Recommended Script</p>
          <div className="mt-3 space-y-3">
            {getSceneScriptLines(scene).map((line, index) => (
              <div key={`${scene.id}-script-${index}`} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                  {index + 1}
                </span>
                <p className="text-base font-semibold leading-relaxed text-white">{line}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Must Include</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(scene.recipe.mustInclude.length > 0 ? scene.recipe.mustInclude : ['No required cue captured']).map((item, index) => (
              <span key={`${scene.id}-include-${index}`} className="rounded-full border border-emerald-300/20 bg-emerald-500/12 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Must Avoid</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(scene.recipe.mustAvoid.length > 0 ? scene.recipe.mustAvoid : ['No avoid cue captured']).map((item, index) => (
              <span key={`${scene.id}-avoid-${index}`} className="rounded-full border border-rose-300/20 bg-rose-500/12 px-3 py-1.5 text-xs font-semibold text-rose-100">
                {item}
              </span>
            ))}
          </div>
        </section>

        {scene.recipe.cta ? (
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">CTA</p>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-white">{scene.recipe.cta}</p>
          </section>
        ) : null}
      </div>
    </div>
  );

  if (!recipeScenes || !Array.isArray(recipeScenes) || recipeScenes.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h3 className="mb-2 text-lg font-bold text-gray-900">Invalid Recipe Data</h3>
        <p className="mb-4 text-gray-600">Unable to load recipe scenes</p>
        {onBack ? (
          <button
            onClick={onBack}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go Back
          </button>
        ) : null}
      </div>
    );
  }

  if (selectedScene) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-black">
        <div className="border-b border-white/10 bg-black/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[500px] items-center justify-between px-4 py-3 text-white">
            <button
              onClick={handleDetailBack}
              className="flex items-center gap-2 text-base font-bold text-blue-400"
            >
              ← Back
            </button>
            <div className="min-w-0 text-center">
              <span className="block truncate text-sm font-medium">
                #{selectedScene.id}: {selectedScene.title}
              </span>
              {resolvedBrandBrief?.brandName ? (
                <span className="truncate text-[11px] font-semibold text-white/45">
                  {resolvedBrandBrief.brandName} context active
                </span>
              ) : null}
            </div>
            <div className="text-xs text-white/35">{activeTab}</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 bg-black py-2.5">
          {(['analysis', 'recipe', 'prompter'] as DetailTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-1.5 text-sm font-semibold capitalize transition ${
                activeTab === tab ? 'bg-white text-black' : 'bg-white/10 text-white/55'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative flex-1 overflow-hidden">
          {activeTab === 'analysis' ? (
            <RecipeVideoPlayer videoUrl={videoUrl} scene={selectedScene} />
          ) : activeTab === 'recipe' ? (
            renderRecipeDetail(selectedScene)
          ) : (
            <CameraShooting
              key={`prompter-${selectedScene.id}`}
              sceneId={selectedScene.id}
              sceneTitle={selectedScene.title}
              prompterBlocks={selectedScene.prompter.blocks}
              onPrompterBlocksChange={(blocks) => handleSceneBlocksChange(selectedScene.id, blocks)}
              onCapture={handleVideoCapture}
              onBack={handleDetailBack}
              existingCapture={capturedVideos[selectedScene.id] || null}
              embedded={true}
            />
          )}

          <button
            type="button"
            onClick={() => navigateScene(-1)}
            disabled={selectedSceneIndex <= 0}
            className="absolute left-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-xl font-semibold text-white backdrop-blur-sm transition disabled:cursor-not-allowed disabled:opacity-25"
            aria-label="Previous segment"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => navigateScene(1)}
            disabled={selectedSceneIndex >= recipeScenes.length - 1}
            className="absolute right-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-xl font-semibold text-white backdrop-blur-sm transition disabled:cursor-not-allowed disabled:opacity-25"
            aria-label="Next segment"
          >
            →
          </button>

          {selectedScene && activeScriptTab && !chatOpen && !scriptSheetOpen ? (
            <button
              type="button"
              onClick={openScriptSheet}
              className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgb(0_0_0_/_0.28)] transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <img src="/parrot-logo.png" alt="" className="h-5 w-5" aria-hidden="true" />
              <span>{getScriptSheetButtonLabel(activeScriptTab)}</span>
            </button>
          ) : null}
        </div>

        {selectedScene && activeScriptTab ? (
          <div
            className={`pointer-events-none absolute inset-0 z-40 transition-opacity duration-200 ${
              scriptSheetOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {scriptSheetOpen ? (
              <>
                <button
                  type="button"
                  onClick={closeScriptSheet}
                  className="pointer-events-auto absolute inset-0 bg-black/38"
                  aria-label="Close script sheet"
                />
                <div className="pointer-events-auto absolute inset-x-0 bottom-0 mx-auto w-full max-w-[500px] px-3 pb-5">
                  <div className="rounded-[2rem] border border-gray-200 bg-white text-gray-900 shadow-[0_24px_60px_rgb(0_0_0_/_0.24)]">
                    <div className="flex justify-center pt-3">
                      <div className="h-1.5 w-11 rounded-full bg-gray-300" />
                    </div>
                    <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <img src="/parrot-logo.png" alt="" className="h-7 w-7 shrink-0" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-950">
                            {getScriptSheetTitle(activeScriptTab)} - #{selectedScene.id}: {selectedScene.title}
                          </p>
                          <p className="text-[11px] font-medium text-gray-500">
                            {getScriptSheetDescription(activeScriptTab)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={closeScriptSheet}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Close script sheet"
                      >
                        ×
                      </button>
                    </div>

                    <div className="max-h-[42vh] overflow-y-auto px-4 pb-4">
                      {activeScriptLines.length > 0 ? (
                        <div className="space-y-2">
                          {activeScriptLines.map((line, index) => (
                            <div
                              key={`${selectedScene.id}-script-sheet-${activeScriptTab}-${index}`}
                              className="rounded-[1.4rem] border border-gray-200 bg-gray-50 px-3 py-3"
                            >
                              <div className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-900 ring-1 ring-gray-200">
                                  {index + 1}
                                </span>
                                <p className="text-sm font-medium leading-relaxed text-gray-800">{line}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-[1.4rem] border border-gray-200 bg-gray-50 px-4 py-4 text-sm font-medium leading-relaxed text-gray-500">
                          {getScriptSheetEmptyMessage(activeScriptTab)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {!chatOpen && !scriptSheetOpen ? (
          <button
            onClick={() => openChatAssistant('scene')}
            className="absolute bottom-8 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl transition-all hover:scale-110 hover:shadow-blue-500/50 active:scale-95"
          >
            <img src="/parrot-logo.png" alt="Chat" className="h-9 w-9" />
          </button>
        ) : null}

        <div
          className={`absolute bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
            chatOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{ height: `${sheetHeight}vh` }}
        >
          {chatOpen ? (
            <div className="absolute inset-0 -z-10 bg-black/30" onClick={closeChatAssistant} />
          ) : null}

          <div className="flex h-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl">
            <div
              className="flex-shrink-0 cursor-grab select-none active:cursor-grabbing"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <div className="flex justify-center pb-2 pt-3">
                <div className="h-1.5 w-10 rounded-full bg-gray-300" />
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 px-5 pb-3">
              <div className="flex items-center gap-2">
                <img src="/parrot-logo.png" alt="Parrot Kit" className="h-7 w-7" />
                <span className="text-lg font-bold text-gray-900">Scene Planner</span>
              </div>
              <button
                onClick={closeChatAssistant}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3">
              <button
                onClick={() => setAssistantMode('global')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  assistantMode === 'global' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Global
              </button>
              <button
                onClick={() => setAssistantMode('scene')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  assistantMode === 'scene' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'
                }`}
              >
                Scene #{selectedScene.id}
              </button>
            </div>

            <div ref={chatScrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {sceneSaveError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                  {sceneSaveError}
                </div>
              ) : null}

              {activeThreadMessages.map((message, index) => (
                <div key={index} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[88%] rounded-2xl p-3 ${
                    message.role === 'user' ? 'rounded-br-sm bg-blue-500 text-white' : 'rounded-tl-sm bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm font-semibold">{message.content}</p>
                  </div>
                  {assistantMode === 'scene' && message.sceneUpdate ? (
                    applyingUpdateMessageIndex === index ? (
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground">
                        <Spinner className="size-3.5" />
                        Applying scene update...
                      </div>
                    ) : (
                      <InteractiveHoverButton
                        onClick={() => void applySceneUpdate(message.sceneUpdate!, index)}
                        className="mt-2 self-start"
                        aria-label="Apply scene update"
                      >
                        Apply Scene Update
                      </InteractiveHoverButton>
                    )
                  ) : null}
                </div>
              ))}

              {chatLoading ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm bg-gray-100 p-3">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex gap-2 border-t border-gray-100 p-4">
              <input
                type="text"
                value={chatMessage}
                onChange={(event) => setChatMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void sendChatMessage();
                  }
                }}
                placeholder={assistantMode === 'scene' ? `Refine Scene #${selectedScene.id}...` : 'Ask about the whole recipe...'}
                disabled={chatLoading}
                className="flex-1 rounded-full bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
              />
              <button
                onClick={() => void sendChatMessage()}
                disabled={chatLoading || !chatMessage.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all hover:bg-blue-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-gray-50">
      <div className="z-10 flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[500px] items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-base font-bold text-blue-600 transition-colors hover:text-blue-700"
          >
            <span className="text-xl">←</span> Back
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            {exportableCaptureCount > 0 ? <span>{exportableCaptureCount}/{recipeScenes.length} captured</span> : null}
            {uploadingCount > 0 ? <span className="text-amber-600">• {uploadingCount} uploading</span> : null}
          </div>
        </div>
      </div>

      <div data-recipe-scroll-container="true" className="flex-1 overflow-y-auto px-3 pb-2 pt-2">
        <div className="mx-auto flex h-full max-w-[500px] flex-col">
          <div className="mb-3 flex flex-shrink-0 items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recipe</h2>
              <p className="text-xs font-medium text-gray-500">
                Reference analysis, creator recipe, and prompter cues
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportVideos}
                disabled={isExporting || exportableCaptureCount === 0}
                className="rounded-lg bg-gradient-to-r from-[#ff9568] via-[#de81c1] to-[#8c67ff] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isExporting ? 'Exporting...' : `Download (${exportableCaptureCount})`}
              </button>
              {isExported ? (
                <button
                  onClick={handleSaveAndGoToDashboard}
                  className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-green-600"
                >
                  Save & Dashboard
                </button>
              ) : null}
            </div>
          </div>

          {resolvedBrandBrief ? (
            <div className="mb-3 rounded-2xl border border-fuchsia-200 bg-fuchsia-50 px-3 py-2 text-xs font-medium text-fuchsia-800">
              Brand context active: {resolvedBrandBrief.brandName || 'Brand'} {resolvedBrandBrief.productName ? `· ${resolvedBrandBrief.productName}` : ''}
            </div>
          ) : null}

          {hasLocalOnlyCaptures ? (
            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
              {localOnlyCaptureCount} take(s) are saved locally right now. Download still works even before sync finishes.
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pb-20">
            {recipeScenes.map((scene, sceneIndex) => {
              const isCaptured = capturedScenes[scene.id];
              const hasLocalCapture = Boolean(capturedVideos[scene.id]) || isCaptured;
              const isUploading = Boolean(uploadingScenes[scene.id]);
              const uploadError = uploadErrors[scene.id];
              const hasUploadError = Boolean(uploadError);
              const summary = getSceneCardSummary(scene);
              const strategyMeta = getSceneStrategyMeta(scene, sceneIndex, recipeScenes.length);
              const statusLabel = isUploading
                ? 'Uploading'
                : hasUploadError && hasLocalCapture
                  ? 'Saved locally'
                  : hasUploadError
                    ? 'Retry shoot'
                    : isCaptured
                      ? 'Captured'
                      : 'Ready';
              const statusClassName = isUploading
                ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                : hasUploadError && hasLocalCapture
                  ? 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
                  : hasUploadError
                    ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                    : isCaptured
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
              const showStatusBadge = statusLabel !== 'Ready';

              return (
                <div
                  key={scene.id}
                  onClick={() => handleSceneClick(scene)}
                  onWheelCapture={(event) => {
                    const scrollContainer = event.currentTarget.closest('[data-recipe-scroll-container="true"]');
                    if (!(scrollContainer instanceof HTMLDivElement)) {
                      return;
                    }

                    scrollContainer.scrollTop += event.deltaY;
                    event.preventDefault();
                  }}
                  className={`cursor-pointer select-none overflow-hidden rounded-2xl bg-white transition-all ${
                    isUploading
                      ? 'ring-2 ring-amber-400'
                      : hasUploadError && hasLocalCapture
                        ? 'ring-2 ring-fuchsia-300'
                      : hasUploadError
                        ? 'ring-2 ring-red-400'
                      : hasLocalCapture
                        ? 'ring-2 ring-green-500'
                        : 'border border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  style={{ touchAction: 'pan-y' }}
                >
                  <div className="flex items-start gap-3 p-3">
                    <div className="pointer-events-none relative w-[108px] flex-shrink-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-purple-100 to-pink-100">
                      <div className="aspect-[9/16] w-full">
                        <img
                          src={scene.thumbnail}
                          alt={scene.title}
                          draggable={false}
                          className="pointer-events-none h-full w-full object-cover"
                          onError={(event) => {
                            const target = event.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                      {isUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-amber-500/20">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                          </div>
                        </div>
                      ) : hasLocalCapture ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                            ✓
                          </div>
                        </div>
                      ) : hasUploadError ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-500/15">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            !
                          </div>
                        </div>
                      ) : null}
                      <div className="absolute left-2 top-2 rounded-full bg-gray-900 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                        #{scene.id}
                      </div>
                    </div>

                    <div className="pointer-events-none flex min-w-0 flex-1 flex-col justify-between gap-2 py-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="line-clamp-1 text-sm font-bold uppercase tracking-[0.08em] text-gray-900">
                            {strategyMeta.stageLabel}: {strategyMeta.patternLabel}
                          </h3>
                        </div>
                        {showStatusBadge ? (
                          <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClassName}`}>
                            {statusLabel}
                          </span>
                        ) : null}
                      </div>

                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                        Scene {scene.id} · {scene.startTime} → {scene.endTime}
                      </p>

                      <p className="line-clamp-2 text-[14px] leading-[1.45] text-gray-700">
                        {summary.title}
                      </p>

                      {summary.detail && summary.detail !== summary.title ? (
                        <p className="line-clamp-1 text-[12px] leading-[1.4] text-gray-500">
                          {summary.detail}
                        </p>
                      ) : null}

                      <div className="flex items-center justify-end pt-1">
                        <span className="text-xs font-semibold text-gray-500">
                          Open →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!chatOpen ? (
        <button
          onClick={() => openChatAssistant('global')}
          className="absolute bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all hover:bg-blue-600 hover:scale-110"
        >
          <img src="/parrot-logo.png" alt="Chat" className="h-8 w-8" />
        </button>
      ) : null}

      <div
        className={`absolute bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          chatOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: `${sheetHeight}vh` }}
      >
        {chatOpen ? (
          <div className="absolute inset-0 -z-10 bg-black/30" onClick={closeChatAssistant} />
        ) : null}

        <div className="flex h-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl">
          <div
            className="flex-shrink-0 cursor-grab select-none active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div className="flex justify-center pb-2 pt-3">
              <div className="h-1.5 w-10 rounded-full bg-gray-300" />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 px-5 pb-3">
            <div className="flex items-center gap-2">
              <img src="/parrot-logo.png" alt="Parrot Kit" className="h-7 w-7" />
              <span className="text-lg font-bold text-gray-900">Recipe Assistant</span>
            </div>
            <button
              onClick={closeChatAssistant}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div ref={chatScrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {sceneSaveError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                {sceneSaveError}
              </div>
            ) : null}
            {activeThreadMessages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 ${
                  message.role === 'user' ? 'rounded-br-sm bg-blue-500 text-white' : 'rounded-tl-sm bg-gray-100 text-gray-700'
                }`}>
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {chatLoading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-gray-100 p-3">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex gap-2 border-t border-gray-100 p-4">
            <input
              type="text"
              value={chatMessage}
              onChange={(event) => setChatMessage(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendChatMessage(); } }}
              placeholder="Ask about the whole recipe..."
              disabled={chatLoading}
              className="flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
            />
            <button
              onClick={() => void sendChatMessage()}
              disabled={chatLoading || !chatMessage.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
