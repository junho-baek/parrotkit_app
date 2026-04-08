'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { RecipeScene } from '@/types/recipe';

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
  scene: RecipeScene;
}

type SupportedPlatform = 'youtube' | 'direct-video' | 'other';

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

function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

function getPlatform(url: string): SupportedPlatform {
  if (extractYouTubeVideoId(url)) return 'youtube';
  if (isDirectVideoUrl(url)) return 'direct-video';
  return 'other';
}

export const RecipeVideoPlayer: React.FC<RecipeVideoPlayerProps> = ({
  videoUrl,
  scene,
}) => {
  const playerRef = useRef<YouTubePlayerInstance | null>(null);
  const htmlVideoRef = useRef<HTMLVideoElement | null>(null);
  const [failedVideoId, setFailedVideoId] = useState<string | null>(null);

  const platform = getPlatform(videoUrl);
  const videoId = extractYouTubeVideoId(videoUrl);
  const isYouTube = platform === 'youtube';
  const isDirectVideo = platform === 'direct-video';
  const playerError = isYouTube ? failedVideoId === videoId : platform === 'other';
  const startSeconds = timeToSeconds(scene.startTime);
  const endSeconds = timeToSeconds(scene.endTime);

  useEffect(() => {
    if (!isYouTube) {
      return;
    }

    let player: YouTubePlayerInstance | null = null;
    let checkInterval: ReturnType<typeof setInterval> | null = null;
    let mounted = true;

    const initPlayer = () => {
      if (!mounted || !window.YT?.Player) {
        return;
      }

      const container = document.getElementById('youtube-player');
      if (!container) {
        setTimeout(initPlayer, 100);
        return;
      }

      try {
        player = new window.YT.Player('youtube-player', {
          videoId,
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
              if (!mounted || event.data !== window.YT?.PlayerState.PLAYING) {
                return;
              }

              if (checkInterval) clearInterval(checkInterval);
              checkInterval = setInterval(() => {
                if (!mounted || !player) return;
                try {
                  if (player.getCurrentTime() >= endSeconds) {
                    player.pauseVideo();
                    player.seekTo(startSeconds);
                  }
                } catch {
                  // ignore
                }
              }, 120);
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
      if (firstScriptTag?.parentNode) {
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
      if (player?.destroy) {
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
      try {
        if (Math.abs(videoElement.currentTime - startSeconds) > 0.35) {
          videoElement.currentTime = startSeconds;
        }
      } catch {
        // metadata not ready
      }

      void videoElement.play().catch(() => {
        // autoplay may be blocked
      });
    };

    const handleLoadedMetadata = () => {
      syncSegment();
    };

    const handleTimeUpdate = () => {
      if (videoElement.currentTime >= endSeconds) {
        videoElement.currentTime = startSeconds;
        void videoElement.play().catch(() => {
          // ignore autoplay rejection
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
  const fallbackMessage = isYouTube
    ? 'The YouTube player could not load inline for this shot.'
    : 'This recipe does not have a direct playback video yet.';
  const fallbackActionLabel = isYouTube ? 'Open on YouTube' : 'Open source video';

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div className="relative mx-auto h-full w-full max-w-[500px]">
        <div className="relative h-[48%] min-h-[280px] overflow-hidden bg-black">
          {isYouTube && !playerError ? (
            <div id="youtube-player" className="absolute inset-0 h-full w-full" />
          ) : isDirectVideo ? (
            <video
              ref={htmlVideoRef}
              src={videoUrl}
              className="absolute inset-0 h-full w-full object-contain"
              playsInline
              controls
              preload="metadata"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={scene.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-60"
                />
              ) : null}
              <div className="relative z-10 max-w-[260px] rounded-3xl bg-white/10 px-5 py-4 text-center backdrop-blur-sm">
                <p className="text-sm font-semibold text-white/90">
                  {fallbackMessage}
                </p>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-full border border-white/20 bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                >
                  {fallbackActionLabel}
                </a>
              </div>
            </div>
          )}

          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 backdrop-blur-sm">
            Analysis
          </div>
          <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            {scene.startTime} - {scene.endTime}
          </div>
        </div>

        <div className="relative -mt-5 h-[calc(52%+20px)] overflow-y-auto rounded-t-[2rem] border-t border-white/10 bg-[#0b0d12] px-4 pb-8 pt-6 text-white shadow-[0_-18px_40px_rgb(0_0_0_/_0.25)]">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />

          <div className="space-y-5">
            <section className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-white/55">Motion View</h3>
              <div className="rounded-3xl border border-sky-400/15 bg-sky-500/10 p-4">
                <p className="text-sm font-medium leading-relaxed text-sky-50">
                  {scene.analysis.motionDescription || 'No motion-specific description was extracted for this cut.'}
                </p>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-white/55">Why It Works</h3>
              <div className="space-y-2">
                {scene.analysis.whyItWorks.map((item, index) => (
                  <div key={`${scene.id}-why-${index}`} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-sm font-medium leading-relaxed text-white/82">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
