'use client';

import React, { useRef, useEffect, useState } from 'react';

type YouTubePlayerEvent = {
  target: {
    unMute?: () => void;
    seekTo: (seconds: number) => void;
    playVideo: () => void;
  };
  data: number;
};

type YouTubePlayerInstance = {
  getCurrentTime: () => number;
  pauseVideo: () => void;
  seekTo: (seconds: number) => void;
  destroy: () => void;
};

type YouTubePlayerConstructor = new (
  elementId: string,
  config: {
    videoId: string;
    playerVars: Record<string, string | number>;
    events: {
      onReady: (event: YouTubePlayerEvent) => void;
      onStateChange: (event: YouTubePlayerEvent) => void;
      onError: () => void;
    };
  }
) => YouTubePlayerInstance;

type YouTubeGlobal = {
  Player?: YouTubePlayerConstructor;
  PlayerState: {
    PLAYING: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeGlobal;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface RecipeVideoPlayerProps {
  videoUrl: string;
  scene: {
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    thumbnail?: string;
    description?: string;
  };
  scriptLines?: string[];
  onSwitchToShooting: () => void;
  onBack?: () => void;
  scriptOpen: boolean;
  onScriptOpenChange: (open: boolean) => void;
}

type SupportedPlatform = 'youtube' | 'instagram' | 'tiktok' | 'direct-video' | 'other';

function timeToSeconds(time: string): number {
  const [mins, secs] = time.split(':').map(Number);
  return mins * 60 + secs;
}

function extractYouTubeVideoId(url: string): string {
  const patterns = [
    /shorts\/([a-zA-Z0-9_-]+)/,
    /watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return '';
}

function extractInstagramEmbedUrl(url: string): string | null {
  const match = url.match(/instagram\.com\/(reel|p|tv)\/([^/?#]+)/i);
  if (!match) return null;
  return `https://www.instagram.com/${match[1].toLowerCase()}/${match[2]}/embed/captioned/`;
}

function extractTikTokEmbedUrl(url: string): string | null {
  const match = url.match(/tiktok\.com\/(?:@[^/]+\/video\/)?(\d+)/i);
  if (!match) return null;
  return `https://www.tiktok.com/embed/v2/${match[1]}`;
}

function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

function getPlatform(url: string): SupportedPlatform {
  if (extractYouTubeVideoId(url)) return 'youtube';
  if (extractInstagramEmbedUrl(url)) return 'instagram';
  if (extractTikTokEmbedUrl(url)) return 'tiktok';
  if (isDirectVideoUrl(url)) return 'direct-video';
  return 'other';
}

function getOpenLabel(platform: SupportedPlatform): string {
  switch (platform) {
    case 'instagram':
      return 'Open on Instagram';
    case 'tiktok':
      return 'Open on TikTok';
    case 'youtube':
      return 'Watch on YouTube';
    case 'direct-video':
      return 'Open video source';
    default:
      return 'Open source video';
  }
}

export const RecipeVideoPlayer: React.FC<RecipeVideoPlayerProps> = ({
  videoUrl,
  scene,
  scriptLines,
  onSwitchToShooting,
  onBack: _onBack,
  scriptOpen,
  onScriptOpenChange,
}) => {
  void onSwitchToShooting;
  void _onBack;
  const playerRef = useRef<YouTubePlayerInstance | null>(null);
  const htmlVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [failedVideoId, setFailedVideoId] = useState<string | null>(null);
  const platform = getPlatform(videoUrl);
  const videoId = extractYouTubeVideoId(videoUrl);
  const isYouTube = platform === 'youtube';
  const isDirectVideo = platform === 'direct-video';
  const instagramEmbedUrl = extractInstagramEmbedUrl(videoUrl);
  const tiktokEmbedUrl = extractTikTokEmbedUrl(videoUrl);
  const embedUrl = instagramEmbedUrl || tiktokEmbedUrl;
  const playerError = isYouTube ? failedVideoId === videoId : platform === 'other';
  const startSeconds = timeToSeconds(scene.startTime);
  const endSeconds = timeToSeconds(scene.endTime);
  const openLabel = getOpenLabel(platform);

  useEffect(() => {
    if (!isYouTube) {
      return;
    }

    let player: YouTubePlayerInstance | null = null;
    let checkInterval: ReturnType<typeof setInterval> | null = null;
    let mounted = true;

    const initPlayer = () => {
      if (!mounted) return;
      if (!window.YT || !window.YT.Player) {
        return;
      }

      const container = document.getElementById('youtube-player');
      if (!container) {
        setTimeout(initPlayer, 100);
        return;
      }

      try {
        player = new window.YT.Player('youtube-player', {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            start: startSeconds,
            end: endSeconds,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: YouTubePlayerEvent) => {
              if (!mounted) return;
              event.target.unMute?.();
              event.target.seekTo(startSeconds);
              event.target.playVideo();
            },
            onStateChange: (event: YouTubePlayerEvent) => {
              if (!mounted) return;
              if (event.data === window.YT?.PlayerState.PLAYING) {
                if (checkInterval) clearInterval(checkInterval);
                checkInterval = setInterval(() => {
                  if (!mounted || !player || !player.getCurrentTime) return;
                  try {
                    const current = player.getCurrentTime();
                    if (current >= endSeconds) {
                      player.pauseVideo();
                      player.seekTo(startSeconds);
                      if (checkInterval) {
                        clearInterval(checkInterval);
                      }
                    }
                  } catch {
                    // ignore
                  }
                }, 100);
              }
            },
            onError: () => {
              if (!mounted) return;
              setFailedVideoId(videoId);
            },
          },
        });
        playerRef.current = player;
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
        setFailedVideoId(videoId);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      window.onYouTubeIframeAPIReady = () => {
        setTimeout(initPlayer, 200);
      };
    } else if (window.YT.Player) {
      setTimeout(initPlayer, 100);
    }

    return () => {
      mounted = false;
      if (checkInterval) clearInterval(checkInterval);
      if (player && player.destroy) {
        try {
          player.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [isYouTube, videoId, startSeconds, endSeconds]);

  useEffect(() => {
    if (!isDirectVideo) {
      return;
    }

    const videoElement = htmlVideoRef.current;
    if (!videoElement) {
      return;
    }

    const syncSegment = () => {
      if (Number.isFinite(startSeconds)) {
        try {
          if (Math.abs(videoElement.currentTime - startSeconds) > 0.35) {
            videoElement.currentTime = startSeconds;
          }
        } catch {
          // ignore seek issues until metadata is ready
        }
      }

      void videoElement.play().catch(() => {
        // Browsers may block autoplay with sound.
      });
    };

    const handleLoadedMetadata = () => {
      syncSegment();
    };

    const handleTimeUpdate = () => {
      if (videoElement.currentTime >= endSeconds) {
        videoElement.currentTime = startSeconds;
        void videoElement.play().catch(() => {
          // ignore autoplay rejection while looping
        });
      }
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    syncSegment();

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isDirectVideo, startSeconds, endSeconds, videoUrl]);

  const thumbnailUrl = scene.thumbnail || (isYouTube ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '');
  const badgeLabel = isYouTube || isDirectVideo ? 'Segment' : 'Source video';

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <div className="relative w-full h-full max-w-md mx-auto" ref={containerRef}>
        {isYouTube && !playerError ? (
          <div id="youtube-player" className="absolute inset-0 w-full h-full" />
        ) : isDirectVideo ? (
          <video
            ref={htmlVideoRef}
            src={videoUrl}
            className="absolute inset-0 h-full w-full object-contain"
            playsInline
            controls
            preload="metadata"
          />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={scene.title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={scene.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            ) : null}
            <div className="relative z-10 text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[24px] border-l-white border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent ml-1" />
              </div>
              <p className="text-white text-sm mb-2">
                {isYouTube ? 'This video cannot be embedded.' : 'Inline preview is not available for this source.'}
              </p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                {openLabel}
              </a>
            </div>
          </div>
        )}

        {/* Loop indicator */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">{badgeLabel}</span>
          </div>
        </div>

        {/* View Script Button - More Visible */}
        {!scriptOpen ? (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30">
            <button
              onClick={() => onScriptOpenChange(true)}
              className="px-6 py-3.5 bg-white text-gray-900 rounded-2xl font-bold shadow-2xl text-base flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform border-2 border-gray-200"
            >
              <img src="/parrot-logo.png" alt="" className="w-6 h-6" />
              View Script
            </button>
          </div>
        ) : null}

        {/* Script Bottom Sheet */}
        {scriptOpen && (
          <div className="absolute inset-0 z-20" onClick={() => onScriptOpenChange(false)}>
            <div className="absolute inset-0 bg-black/40" />
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-slide-up"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '70%' }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b-2 border-gray-200">
                <div className="flex items-center gap-2">
                  <img src="/parrot-logo.png" alt="Parrot Kit" className="w-7 h-7" />
                  <span className="font-bold text-gray-900 text-base">Script - #{scene.id}: {scene.title}</span>
                </div>
                <button
                  onClick={() => onScriptOpenChange(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              </div>

              {/* Script Content */}
              <div className="overflow-y-auto p-5 space-y-4" style={{ maxHeight: 'calc(70vh - 80px)' }}>
                {(scriptLines || [scene.description || 'Follow the reference video']).map((line, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm flex-shrink-0 mt-0.5 font-bold">{idx + 1}</span>
                    <p className="text-gray-900 text-base font-semibold leading-relaxed">{line}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
