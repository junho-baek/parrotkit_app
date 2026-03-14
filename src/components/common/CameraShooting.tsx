'use client';

import React, { useRef, useState, useEffect } from 'react';

interface CameraShootingProps {
  sceneId: number;
  sceneTitle: string;
  instructions: string[];
  onCapture: (videoBlob: Blob) => void;
  onBack: () => void;
  embedded?: boolean;
}

export const CameraShooting: React.FC<CameraShootingProps> = ({
  sceneId,
  sceneTitle,
  instructions,
  onCapture,
  onBack,
  embedded = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const skipCaptureRef = useRef(false);
  const isActiveRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [scriptOpen, setScriptOpen] = useState(false);

  useEffect(() => {
    isActiveRef.current = true;
    skipCaptureRef.current = false;
    startCamera();
    return () => {
      isActiveRef.current = false;
      skipCaptureRef.current = true;
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
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
  };

  const stopRecordingStream = () => {
    if (recordingStreamRef.current) {
      recordingStreamRef.current.getTracks().forEach((track) => track.stop());
      recordingStreamRef.current = null;
    }
  };

  const stopPreviewStream = () => {
    if (previewStreamRef.current) {
      previewStreamRef.current.getTracks().forEach((track) => track.stop());
      previewStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const stopCamera = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
    setIsRecording(false);
    stopRecordingStream();
    stopPreviewStream();
  };

  const startRecording = async () => {
    const previewStream = previewStreamRef.current;
    if (!previewStream) return;
    if (isRecording) return;
    if (!isActiveRef.current) return;

    const previewVideoTrack = previewStream.getVideoTracks()[0];
    if (!previewVideoTrack) return;

    const recordingTracks: MediaStreamTrack[] = [previewVideoTrack.clone()];

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTrack = audioStream.getAudioTracks()[0];
      if (audioTrack) {
        recordingTracks.push(audioTrack);
      }
    } catch (error) {
      console.warn('Audio access denied, recording video without microphone:', error);
    }

    if (!isActiveRef.current) {
      recordingTracks.forEach((track) => track.stop());
      return;
    }

    const recordingStream = new MediaStream(recordingTracks);
    recordingStreamRef.current = recordingStream;
    const mediaRecorder = new MediaRecorder(recordingStream, {
      mimeType: 'video/webm',
    });

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

      const blob = new Blob(chunks, { type: 'video/webm' });
      if (blob.size > 0) {
        onCapture(blob);
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

  return (
    <div className={containerClass}>
      {/* Video Preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
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

          {/* Spacer for symmetry */}
          <div className="w-[72px]" />
        </div>
      </div>

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
