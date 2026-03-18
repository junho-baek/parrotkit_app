'use client';

import React, { useState, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import { useRouter } from 'next/navigation';
import { CameraShooting } from './CameraShooting';
import { RecipeVideoPlayer } from './RecipeVideoPlayer';
import { authenticatedFetch, ensureValidAccessToken } from '@/lib/auth/client-session';
import { logClientEvent } from '@/lib/client-events';

interface RecipeScene {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  thumbnail: string;
  description: string;
  script?: string[];
  progress?: number;
}

interface RecipeResultProps {
  scenes: RecipeScene[];
  videoUrl: string;
  onBack?: () => void;
  recipeId?: string; // 레시피 ID 추가
  initialCapturedVideos?: {[key: number]: boolean}; // 초기 촬영 데이터
  initialMatchResults?: {[key: number]: boolean}; // 초기 매칭 결과
}

export const RecipeResult: React.FC<RecipeResultProps> = ({ 
  scenes, 
  videoUrl, 
  onBack,
  recipeId,
  initialCapturedVideos = {}
}) => {
  const router = useRouter();
  const brandActionStyle: React.CSSProperties = {
    backgroundImage: 'linear-gradient(135deg, #ff9568 0%, #de81c1 52%, #8c67ff 100%)',
    boxShadow: '0 10px 20px rgba(140, 103, 255, 0.2)',
  };
  const [selectedScene, setSelectedScene] = useState<RecipeScene | null>(null);
  const [activeTab, setActiveTab] = useState<'recipe' | 'shooting'>('recipe');
  const [capturedVideos, setCapturedVideos] = useState<{[key: number]: Blob}>({});
  const [isExporting, setIsExporting] = useState(false);
  const [isExported, setIsExported] = useState(false);
  const [capturedScenes, setCapturedScenes] = useState<{[key: number]: boolean}>(initialCapturedVideos);
  const [uploadingScenes, setUploadingScenes] = useState<{[key: number]: boolean}>({});
  const [uploadErrors, setUploadErrors] = useState<{[key: number]: string}>({});
  const [sceneScripts, setSceneScripts] = useState<{[key: number]: string[]}>({});
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant'; content: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeight] = useState(50);
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const capturedScenesRef = useRef<{[key: number]: boolean}>(initialCapturedVideos);
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

  const defaultScripts: {[key: number]: string[]} = {
    1: [
      'Most people still don\'t know this... you NEED to hear this',
      '(Look at the camera with confidence)',
      'Slightly surprised expression + spark curiosity',
    ],
    2: [
      'Hey everyone, today I\'m sharing a tip you absolutely need to know',
      '(Start with a natural greeting)',
      'Relaxed, friendly tone',
    ],
    3: [
      'I was skeptical at first, but after trying it myself, it actually works',
      '(Share your experience honestly)',
      'Relatable expression + nodding',
    ],
    4: [
      'Okay, here\'s the key part. Just follow this and you\'re set',
      '(Emphasize the main point clearly)',
      'Point with finger or gesture at screen',
    ],
    5: [
      'And that\'s it! Easier than you thought, right?',
      '(Wrap up with an upbeat tone)',
      'Satisfied expression, nod and smile',
    ],
    6: [
      'If this helped, hit like and follow!',
      'More great tips coming soon!',
      '(Wave and give a closing smile)',
    ],
  };

  const getScriptForScene = (scene: RecipeScene): string[] => {
    if (sceneScripts[scene.id]) return sceneScripts[scene.id];
    if (scene.script && scene.script.length > 0) return scene.script;
    return defaultScripts[scene.id] || [scene.description];
  };

  const parseScriptLines = (text: string): string[] | null => {
    const lines = text.split('\n');
    const numbered: string[] = [];
    for (const line of lines) {
      const match = line.match(/^\s*(\d+)\.\s+(.+)/);
      if (match) {
        numbered.push(match[2].trim());
      }
    }
    return numbered.length >= 2 ? numbered : null;
  };

  const applyScript = (messageContent: string) => {
    if (!selectedScene) return;
    const lines = parseScriptLines(messageContent);
    if (lines) {
      setSceneScripts(prev => ({ ...prev, [selectedScene.id]: lines }));
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || chatLoading) return;
    const userMsg = chatMessage.trim();
    setChatMessage('');
    const newHistory = [...chatHistory, { role: 'user' as const, content: userMsg }];
    setChatHistory(newHistory);
    setChatLoading(true);

    setTimeout(() => chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' }), 50);

    const currentScript = selectedScene ? getScriptForScene(selectedScene) : [];
    const payload = {
      messages: newHistory,
      scenes: scenes.map(s => ({ id: s.id, title: s.title, startTime: s.startTime, endTime: s.endTime, description: s.description })),
      currentScene: selectedScene ? {
        id: selectedScene.id,
        title: selectedScene.title,
        description: selectedScene.description,
        script: currentScript,
      } : null,
    };

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.message) {
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'assistant', content: 'Error: ' + (data.error || 'Failed to get response') }]);
      }
    } catch {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
    }
  };

  const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragRef.current = { startY: clientY, startHeight: sheetHeight };
  }, [sheetHeight]);

  const handleDragMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!dragRef.current) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = dragRef.current.startY - clientY;
    const deltaPercent = (deltaY / window.innerHeight) * 100;
    const newHeight = Math.min(90, Math.max(20, dragRef.current.startHeight + deltaPercent));
    setSheetHeight(newHeight);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!dragRef.current) return;
    // Snap to close if dragged below 15%
    if (sheetHeight < 15) {
      setChatOpen(false);
      setSheetHeight(50);
    }
    dragRef.current = null;
  }, [sheetHeight]);

  const handleSceneClick = (scene: RecipeScene) => {
    setSelectedScene(scene);
    setActiveTab('recipe'); // 기본으로 Recipe 탭 표시
  };

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
    if (!selectedScene) return;

    const capturedSceneId = selectedScene.id;

    console.log('Video captured:', videoBlob);

    // 촬영한 비디오 저장
    setCapturedVideos(prev => ({
      ...prev,
      [capturedSceneId]: videoBlob,
    }));

    // 이전 업로드 오류는 새 촬영 시 초기화
    setSceneUploadError(capturedSceneId);

    if (recipeId) {
      const hadUploadedCapture = Boolean(capturedScenesRef.current[capturedSceneId]);
      // 업로드 중 상태를 씬 단위로 표시하고, 업로드 성공 시에만 captured로 확정
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
      // 로컬 모드에서는 즉시 캡처 완료 처리
      markSceneCaptured(capturedSceneId);
      void logClientEvent('capture_uploaded', {
        recipe_id: 'local',
        scene_id: capturedSceneId,
      });
    }

    // 랜덤 매칭 게이트 제거: 촬영 후 즉시 리스트로 복귀하고 업로드 결과로만 상태를 확정한다.
    setSelectedScene(null);
    setActiveTab('recipe');
  };

  const handleCameraBack = () => {
    setSelectedScene(null);
    setActiveTab('recipe');
  };

  // 모든 촬영한 비디오를 ZIP으로 다운로드
  const handleExportVideos = async () => {
    const capturedCount = exportableCaptureCount;
    
    if (capturedCount === 0) {
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

  // 레시피 저장하고 Recipes 탭으로 이동
  const handleSaveAndGoToDashboard = async () => {
    await logClientEvent('recipe_saved', {
      recipe_id: recipeId || 'local',
      captured_count: exportableCaptureCount,
    });

    router.push('/recipes');
  };

  // Validate props after hooks are initialized to keep hook order stable.
  if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Invalid Recipe Data</h3>
        <p className="text-gray-600 mb-4">Unable to load recipe scenes</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  // 선택된 씨에서 디테일 화면
  if (selectedScene) {
    return (
      <div className="fixed inset-0 flex flex-col bg-black overflow-hidden z-[9999]">
        {/* Header */}
        <div className="bg-black border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-3 text-white max-w-md mx-auto">
            <button
              onClick={handleCameraBack}
              className="flex items-center gap-2 font-bold text-blue-400 text-base"
            >
              ← Back
            </button>
            <span className="text-sm font-medium truncate">#{selectedScene.id}: {selectedScene.title}</span>
            <div className="text-xs text-gray-400">slow mode</div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center justify-center gap-4 py-2 bg-black flex-shrink-0">
          <button
            onClick={() => setActiveTab('recipe')}
            className={`px-6 py-1.5 rounded-full font-medium transition-all text-sm ${
              activeTab === 'recipe'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            Recipe
          </button>
          <button
            onClick={() => setActiveTab('shooting')}
            className={`px-6 py-1.5 rounded-full font-medium transition-all text-sm ${
              activeTab === 'shooting'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            Shooting
          </button>
        </div>

        {/* Content - fills remaining space */}
        <div className="flex-1 relative overflow-hidden max-w-md mx-auto w-full">
          {activeTab === 'recipe' ? (
            <RecipeVideoPlayer
              videoUrl={videoUrl}
              scene={selectedScene}
              scriptLines={getScriptForScene(selectedScene)}
              onSwitchToShooting={() => setActiveTab('shooting')}
              onBack={handleCameraBack}
            />
          ) : (
            <CameraShooting
              sceneId={selectedScene.id}
              sceneTitle={selectedScene.title}
              instructions={getScriptForScene(selectedScene)}
              onCapture={handleVideoCapture}
              onBack={handleCameraBack}
              embedded={true}
            />
          )}
        </div>

        {/* Floating Chatbot Button - More Visible */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="absolute bottom-8 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center z-50 border-4 border-white"
          >
            <img src="/parrot-logo.png" alt="Chat" className="w-9 h-9" />
          </button>
        )}

        {/* Chatbot Bottom Sheet */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
            chatOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{ height: `${sheetHeight}vh` }}
        >
          {chatOpen && (
            <div
              className="absolute inset-0 bg-black/30 -z-10"
              onClick={() => { setChatOpen(false); setSheetHeight(50); }}
            />
          )}
          <div className="h-full bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden">
            <div
              className="flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <img src="/parrot-logo.png" alt="Parrot Kit" className="w-7 h-7" />
                <span className="font-bold text-gray-900 text-lg">Script Assistant</span>
              </div>
              <button
                onClick={() => { setChatOpen(false); setSheetHeight(50); }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-sm max-w-[85%]">
                <p className="text-sm text-gray-900 font-semibold">
                  Hi! I&apos;m editing the script for <strong>#{selectedScene.id}: {selectedScene.title}</strong>. Ask me to rewrite, shorten, or change the tone!
                </p>
              </div>
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                  }`}>
                    <p className="text-sm font-semibold whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'assistant' && parseScriptLines(msg.content) && (
                    <button
                      onClick={() => applyScript(msg.content)}
                      className="mt-1.5 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold hover:bg-green-600 transition-colors"
                    >
                      Apply to Script
                    </button>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-gray-100 p-4 flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                placeholder="Ask about scripts..."
                disabled={chatLoading}
                className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-base text-gray-900 placeholder:text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all disabled:opacity-50"
              />
              <button
                onClick={sendChatMessage}
                disabled={chatLoading || !chatMessage.trim()}
                className="w-11 h-11 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
    <div className="absolute inset-0 bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 z-10 shadow-sm flex-shrink-0">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors text-base"
          >
            <span className="text-xl">←</span> Back
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-900 font-semibold">
            {exportableCaptureCount > 0 && (
              <span>{exportableCaptureCount}/{scenes.length} captured</span>
            )}
            {uploadingCount > 0 && (
              <span className="text-amber-600">• {uploadingCount} uploading</span>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Content - fits in one viewport */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 pt-2">
        <div className="max-w-md mx-auto h-full flex flex-col">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900">Recipe</h2>
            <div className="flex gap-2">
              <button
                onClick={handleExportVideos}
                disabled={isExporting || exportableCaptureCount === 0}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                style={brandActionStyle}
              >
                {isExporting ? 'Exporting...' : `Download (${exportableCaptureCount})`}
              </button>
              {isExported && (
                <button
                  onClick={handleSaveAndGoToDashboard}
                  className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-all"
                >
                  Save & Dashboard
                </button>
              )}
            </div>
          </div>
          {hasLocalOnlyCaptures ? (
            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
              {localOnlyCaptureCount} take(s) are saved locally right now. Download still works even before sync finishes.
            </div>
          ) : null}

          {/* Scenes Grid - compact, fits in one screen */}
          <div className="grid grid-cols-2 gap-3 pb-20">
            {scenes.map((scene) => {
              const isCaptured = capturedScenes[scene.id];
              const hasLocalCapture = Boolean(capturedVideos[scene.id]) || isCaptured;
              const isUploading = Boolean(uploadingScenes[scene.id]);
              const uploadError = uploadErrors[scene.id];
              const hasUploadError = Boolean(uploadError);
              const scriptLines = getScriptForScene(scene);

              return (
                <div
                  key={scene.id}
                  onClick={() => handleSceneClick(scene)}
                  className={`bg-white rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col ${
                    isUploading
                      ? 'ring-2 ring-amber-400'
                      : hasUploadError && hasLocalCapture
                        ? 'ring-2 ring-fuchsia-300'
                      : hasUploadError
                        ? 'ring-2 ring-red-400'
                        : hasLocalCapture
                      ? 'ring-2 ring-green-500'
                      : 'border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                    <img
                      src={scene.thumbnail}
                      alt={scene.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient background with scene number
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    {isUploading ? (
                      <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                        <div className="bg-white text-amber-600 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                          <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      </div>
                    ) : hasLocalCapture ? (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          ✓
                        </div>
                      </div>
                    ) : hasUploadError ? (
                      <div className="absolute inset-0 bg-red-500/15 flex items-center justify-center">
                        <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          !
                        </div>
                      </div>
                    ) : null}
                    {/* Scene Number Badge */}
                    <div className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      #{scene.id}
                    </div>
                    {/* Time Badge */}
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">
                      {scene.startTime}
                    </div>
                  </div>

                  {/* Scene Info */}
                  <div className="px-3 py-2.5 flex flex-col gap-1.5 flex-shrink-0">
                    <h3 className="font-bold text-xs text-gray-900 truncate">
                      {scene.title}
                    </h3>
                    <p className="text-[10px] text-gray-600 line-clamp-2 leading-tight">
                      {scriptLines[0] || scene.description}
                    </p>
                    {isUploading ? (
                      <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                        <span className="inline-block w-2 h-2 border border-amber-600 border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </span>
                    ) : hasUploadError && hasLocalCapture ? (
                      <span className="text-xs text-fuchsia-600 font-medium flex items-center gap-1">
                        <span>⬇️</span> Saved locally
                      </span>
                    ) : hasUploadError ? (
                      <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                        <span>⚠️</span> Retry Shoot
                      </span>
                    ) : isCaptured ? (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <span>✓</span> Done
                      </span>
                    ) : (
                      <span className="text-xs font-medium flex items-center gap-1 text-[#8c67ff]">
                        <span>📹</span> Shoot
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Chatbot Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-110 flex items-center justify-center z-40"
        >
          <img src="/parrot-logo.png" alt="Chat" className="w-8 h-8" />
        </button>
      )}

      {/* Chatbot Bottom Sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          chatOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: `${sheetHeight}vh` }}
      >
        {/* Backdrop */}
        {chatOpen && (
          <div
            className="absolute inset-0 bg-black/30 -z-10"
            onClick={() => { setChatOpen(false); setSheetHeight(50); }}
          />
        )}

        <div className="h-full bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Drag Handle */}
          <div
            className="flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
            </div>
          </div>

          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <img src="/parrot-logo.png" alt="Parrot Kit" className="w-7 h-7" />
              <span className="font-bold text-gray-900 text-lg">Script Assistant</span>
            </div>
            <button
              onClick={() => { setChatOpen(false); setSheetHeight(50); }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Chat Messages - scrollable */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Welcome message */}
            <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-sm max-w-[85%]">
              <p className="text-sm text-gray-700">
                Hi! I&apos;m your Script Assistant. I can help you write and refine scripts for each scene. Try:
              </p>
              <ul className="text-xs text-gray-600 mt-2 space-y-1">
                <li>&bull; &quot;Write a script for Scene #1 Hook&quot;</li>
                <li>&bull; &quot;Make the intro more engaging&quot;</li>
                <li>&bull; &quot;Suggest a funny voiceover for all scenes&quot;</li>
              </ul>
            </div>

            {/* Chat history */}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-700 rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-100 p-4 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
              placeholder="Ask about scripts..."
              disabled={chatLoading}
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all disabled:opacity-50"
            />
            <button
              onClick={sendChatMessage}
              disabled={chatLoading || !chatMessage.trim()}
              className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
