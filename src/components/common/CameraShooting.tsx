'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

interface CameraShootingProps {
  sceneId: number;
  sceneTitle: string;
  instructions: string[];
  onCapture: (videoBlob: Blob) => void;
  onBack: () => void;
  onPreviousScene?: () => void;
  onNextScene?: () => void;
  hasPreviousScene?: boolean;
  hasNextScene?: boolean;
  embedded?: boolean;
  existingCapture?: Blob | null;
}

export const CameraShooting: React.FC<CameraShootingProps> = ({
  sceneId,
  sceneTitle,
  instructions,
  onCapture,
  onBack,
  onPreviousScene,
  onNextScene,
  hasPreviousScene = false,
  hasNextScene = false,
  embedded = false,
  existingCapture = null,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reviewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const skipCaptureRef = useRef(false);
  const isActiveRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [scriptOpen, setScriptOpen] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'ready' | 'missing' | 'denied'>('idle');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const existingCaptureUrl = React.useMemo(
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        // Keep mic off on entry. We request audio only when user taps Shoot.
        audio: false,
      });

      if (!isActiveRef.current || !videoRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      previewStreamRef.current = stream;
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Camera access error:', error);
      alert('카메라 접근 권한이 필요합니다.');
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
    void startCamera();
    return () => {
      isActiveRef.current = false;
      skipCaptureRef.current = true;
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const startRecording = async () => {
    const previewStream = previewStreamRef.current;
    if (!previewStream) return;
    if (isRecording) return;
    if (!isActiveRef.current) return;

    const previewVideoTrack = previewStream.getVideoTracks()[0];
    if (!previewVideoTrack) return;

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
        setReviewUrl((prev) => {
          if (prev) {
            URL.revokeObjectURL(prev);
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
    } else {
      void startRecording();
    }
  };

  const containerClass = embedded
    ? 'relative w-full h-full bg-black'
    : 'fixed inset-0 bg-black z-50';

  const handleRetry = () => {
    if (reviewUrl) {
      URL.revokeObjectURL(reviewUrl);
    }
    setRecordedBlob(null);
    setReviewUrl(null);
    setSaveMessage(null);
  };

  const handleUseTake = () => {
    if (!effectiveRecordedBlob) {
      return;
    }

    onCapture(effectiveRecordedBlob);
    setSaveMessage('Take saved');
  };

  return (
    <div className={containerClass}>
      {/* Video Preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onBack}
          className="px-3.5 py-2 bg-black/65 backdrop-blur-sm text-white rounded-xl font-semibold text-sm border border-white/20 active:scale-95 transition-transform"
        >
          ← Back
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={onPreviousScene}
          disabled={!hasPreviousScene}
          className="h-10 w-10 rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-sm transition disabled:opacity-35 disabled:cursor-not-allowed"
          aria-label="Previous segment"
        >
          ←
        </button>
        <button
          type="button"
          onClick={onNextScene}
          disabled={!hasNextScene}
          className="h-10 w-10 rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-sm transition disabled:opacity-35 disabled:cursor-not-allowed"
          aria-label="Next segment"
        >
          →
        </button>
      </div>

      {/* Guidelines Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>

        <div className="relative">
          <div className="w-48 h-48 rounded-full border-4 border-white/50 flex items-center justify-center">
            <div className="w-36 h-44 rounded-full border-2 border-white/30" />
          </div>
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-bold">REC</span>
          </div>
        </div>
      )}

      {/* Passive Script Prompt */}
      <div className="pointer-events-none absolute inset-x-0 bottom-32 z-10 flex justify-center px-5">
        <div className="max-w-sm rounded-2xl bg-black/18 px-4 py-3 backdrop-blur-[2px]">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
            Scene #{sceneId}
          </div>
          <div className="space-y-1.5">
            {instructions.slice(0, 3).map((instruction, idx) => (
              <p key={idx} className="text-sm font-medium leading-snug text-white/42">
                {instruction}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="flex items-center justify-center gap-6">
          {/* Script Button */}
          <button
            onClick={() => setScriptOpen(true)}
            className="px-4 py-2.5 bg-white/95 backdrop-blur-sm text-gray-900 rounded-xl font-semibold shadow-lg text-sm flex items-center gap-2"
          >
            <img src="/parrot-logo.png" alt="" className="w-5 h-5" />
            Script
          </button>

          {/* Record Button */}
          <button
            onClick={handleShootButton}
            disabled={Boolean(effectiveReviewUrl)}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 scale-90'
                : 'bg-white border-4 border-red-500'
            }`}
          >
            {isRecording && (
              <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping" />
            )}
            {!isRecording && <div className="w-16 h-16 rounded-full bg-red-500" />}
          </button>

          <button
            type="button"
            onClick={() => {
              if (reviewVideoRef.current) {
                reviewVideoRef.current.currentTime = 0;
                void reviewVideoRef.current.play().catch(() => {
                  // ignore replay failures
                });
              }
            }}
            disabled={!effectiveReviewUrl}
            className="w-[72px] rounded-xl bg-white/95 px-3 py-2.5 text-xs font-semibold text-gray-900 shadow-lg disabled:opacity-45 disabled:cursor-not-allowed"
          >
            Review
          </button>
        </div>
        <div className="mt-3 text-center">
          {audioStatus === 'ready' ? (
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-100">
              Mic ready
            </span>
          ) : audioStatus === 'denied' ? (
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-100">
              Mic denied, video only
            </span>
          ) : audioStatus === 'missing' && isRecording ? (
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-100">
              Recording without microphone
            </span>
          ) : null}
          {saveMessage ? (
            <span className="ml-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
              {saveMessage}
            </span>
          ) : null}
        </div>
      </div>

      {effectiveReviewUrl ? (
        <div className="absolute inset-0 z-20 bg-black/82 px-5 py-6 backdrop-blur-sm">
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
            <p className="mt-3 text-center text-xs text-white/55">
              Play the clip here to confirm video and microphone audio before saving.
            </p>
          </div>
        </div>
      ) : null}

      {/* Script Bottom Sheet */}
      {scriptOpen && (
        <div className="absolute inset-0 z-30" onClick={() => setScriptOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '60%' }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src="/parrot-logo.png" alt="Parrot Kit" className="w-6 h-6" />
                <span className="font-bold text-gray-900 text-base">Script - #{sceneId}: {sceneTitle}</span>
              </div>
              <button
                onClick={() => setScriptOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>

            {/* Script Content */}
            <div className="overflow-y-auto p-5 space-y-3" style={{ maxHeight: 'calc(60vh - 80px)' }}>
              {instructions.map((instruction, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold">{idx + 1}</span>
                  <p className="text-gray-800 text-sm font-medium leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
