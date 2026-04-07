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

function getSignalTone(type: string) {
  switch (type) {
    case 'hook':
      return 'bg-violet-500/15 text-violet-200 border-violet-400/30';
    case 'cta':
      return 'bg-amber-500/15 text-amber-100 border-amber-400/30';
    case 'motion':
      return 'bg-sky-500/15 text-sky-100 border-sky-400/30';
    case 'product':
      return 'bg-emerald-500/15 text-emerald-100 border-emerald-400/30';
    default:
      return 'bg-white/10 text-white/80 border-white/15';
  }
}

export const RecipeVideoPlayer: React.FC<RecipeVideoPlayerProps> = ({
  videoUrl,
  scene,
}) => {
  const playerRef = useRef<YouTubePlayerInstance | null>(null);
  const htmlVideoRef = useRef<HTMLVideoElement | null>(null);
  const [failedVideoId, setFailedVideoId] = useState<string | null>(null);
  const [isMediaReady, setIsMediaReady] = useState(false);

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
  const mediaReady = platform === 'other' || isMediaReady;

  useEffect(() => {
    if (!embedUrl) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsMediaReady(true);
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, [embedUrl]);

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
              setIsMediaReady(true);
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
              setIsMediaReady(false);
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
      setIsMediaReady(true);
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

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05070b]">
      <div className="relative mx-auto h-full w-full max-w-[500px]">
        <div className="relative h-[46%] min-h-[280px] overflow-hidden bg-black">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={scene.title}
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-35 blur-sm"
            />
          ) : null}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_38%),linear-gradient(180deg,rgba(5,7,11,0.28),rgba(5,7,11,0.72))]" />

          {isYouTube && !playerError ? (
            <div
              id="youtube-player"
              className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${mediaReady ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : isDirectVideo ? (
            <video
              ref={htmlVideoRef}
              src={videoUrl}
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${mediaReady ? 'opacity-100' : 'opacity-0'}`}
              playsInline
              controls
              preload="metadata"
            />
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              title={scene.title}
              className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${mediaReady ? 'opacity-100' : 'opacity-0'}`}
              allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
              allowFullScreen
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
                  This reference source cannot be embedded inline.
                </p>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-full border border-white/20 bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                >
                  Open source video
                </a>
              </div>
            </div>
          )}

          {!playerError && !mediaReady ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur-sm">
                Loading reference clip
              </div>
            </div>
          ) : null}

          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 backdrop-blur-sm">
            Reference Clip
          </div>
          <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            {scene.startTime} - {scene.endTime}
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-4 pb-5 pt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Study the beat</p>
            <h2 className="mt-2 text-[1.55rem] font-bold tracking-[-0.04em] text-white">
              {scene.title}
            </h2>
            <p className="mt-2 max-w-[22rem] text-sm font-medium leading-relaxed text-white/70">
              {scene.analysis.motionDescription || scene.recipe.appealPoint}
            </p>
          </div>
        </div>

        <div className="relative -mt-8 h-[calc(54%+32px)] overflow-y-auto rounded-t-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(12,16,24,0.98),rgba(9,12,18,0.98))] px-4 pb-8 pt-6 text-white shadow-[0_-18px_40px_rgb(0_0_0_/_0.28)]">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />

          <div className="space-y-5">
            <section className="rounded-[1.9rem] border border-sky-300/12 bg-sky-500/[0.08] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-white/55">Motion Read</h3>
                  <p className="mt-3 text-base font-semibold leading-relaxed text-white">
                    {scene.analysis.motionDescription || 'No motion-specific description was extracted for this cut.'}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  First watch
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {scene.analysis.referenceSignals.map((signal, index) => (
                  <div
                    key={`${scene.id}-signal-${index}`}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getSignalTone(signal.type)}`}
                  >
                    {signal.type}: {signal.text}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-white/55">Original Transcript</h3>
                <span className="text-[11px] font-semibold text-white/35">reference evidence</span>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                {scene.analysis.transcriptOriginal && scene.analysis.transcriptOriginal.length > 0 ? (
                  <div className="space-y-2">
                    {scene.analysis.transcriptOriginal.map((line, index) => (
                      <p key={`${scene.id}-transcript-${index}`} className="text-sm font-medium leading-relaxed text-white/82">
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/45">No transcript was captured for this cut.</p>
                )}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-white/55">Why This Cut Lands</h3>
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
