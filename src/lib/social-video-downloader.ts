import 'server-only';

type DownloadPlatform = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'other';

type VideoVariant = {
  url: string;
  label: string | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  fps: number | null;
};

export type DownloadSource = 'rapidapi_smvd' | 'none';

export interface SocialVideoDownloadResult {
  platform: DownloadPlatform;
  source: DownloadSource;
  title: string | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  fallbackReason: string | null;
  variants: VideoVariant[];
  raw: Record<string, unknown> | null;
}

function getRapidApiKey() {
  return (
    process.env.RAPIDAPI_SMVD_KEY?.trim()
    || process.env.RAPIDAPI_KEY?.trim()
    || ''
  );
}

function getRapidApiHost() {
  return (
    process.env.RAPIDAPI_SMVD_HOST?.trim()
    || process.env.RAPIDAPI_HOST?.trim()
    || ''
  );
}

function getRapidApiBaseUrl(host: string) {
  return (
    process.env.RAPIDAPI_SMVD_BASE_URL?.trim()
    || `https://${host}`
  );
}

function buildUrl(pathname: string, params: Record<string, string | null | undefined>) {
  const host = getRapidApiHost();
  const baseUrl = getRapidApiBaseUrl(host);
  const url = new URL(pathname, baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;
    url.searchParams.set(key, value);
  });

  return url.toString();
}

function detectPlatform(url: string): DownloadPlatform {
  if (/youtu\.be|youtube\.com/i.test(url)) return 'youtube';
  if (/instagram\.com/i.test(url)) return 'instagram';
  if (/tiktok\.com/i.test(url)) return 'tiktok';
  if (/facebook\.com|fb\.watch/i.test(url)) return 'facebook';
  return 'other';
}

function extractYouTubeVideoId(url: string) {
  const patterns = [
    /shorts\/([a-zA-Z0-9_-]+)/,
    /watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function extractInstagramShortcode(url: string) {
  const match = url.match(/\/(?:reel|p)\/([a-zA-Z0-9_-]+)/i);
  return match?.[1] || null;
}

function asObject(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function asString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function asNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function extractThumbnailUrl(payload: Record<string, unknown>) {
  const metadata = asObject(payload.metadata);
  const contents = Array.isArray(payload.contents) ? payload.contents : [];

  const topLevelThumbnail = asString(metadata?.thumbnailUrl);
  if (topLevelThumbnail) {
    return topLevelThumbnail;
  }

  for (const content of contents) {
    const item = asObject(content);
    const images = Array.isArray(item?.images) ? item.images : [];
    const firstImage = asObject(images[0]);
    const imageUrl = asString(firstImage?.url);
    if (imageUrl) {
      return imageUrl;
    }
  }

  return null;
}

function extractTitle(payload: Record<string, unknown>) {
  const metadata = asObject(payload.metadata);
  return asString(metadata?.title) || asString(payload.title);
}

function collectVideoVariantsFromEntry(entry: Record<string, unknown>) {
  const metadata = asObject(entry.metadata);
  const url = asString(entry.url) || asString(entry.downloadUrl) || asString(entry.src);

  if (!url) {
    return [];
  }

  const mimeType = asString(metadata?.mime_type) || asString(metadata?.mimeType);
  const width = asNumber(metadata?.width);
  const height = asNumber(metadata?.height);
  const fps = asNumber(metadata?.fps);

  if (mimeType && !mimeType.startsWith('video/')) {
    return [];
  }

  return [{
    url,
    label: asString(entry.label) || asString(metadata?.quality_label) || null,
    mimeType,
    width,
    height,
    fps,
  }] satisfies VideoVariant[];
}

function collectVideoVariants(payload: Record<string, unknown>) {
  const contents = Array.isArray(payload.contents) ? payload.contents : [];
  const variants: VideoVariant[] = [];

  const maybePushFromArray = (value: unknown) => {
    if (!Array.isArray(value)) return;

    for (const item of value) {
      const entry = asObject(item);
      if (!entry) continue;
      variants.push(...collectVideoVariantsFromEntry(entry));
    }
  };

  for (const content of contents) {
    const item = asObject(content);
    if (!item) continue;
    maybePushFromArray(item.videos);
  }

  maybePushFromArray(payload.videos);

  return variants.filter((variant, index, array) => (
    array.findIndex((candidate) => candidate.url === variant.url) === index
  ));
}

function choosePreferredVariant(variants: VideoVariant[]) {
  const targetHeight = 480;

  return [...variants].sort((left, right) => {
    const leftMp4 = left.mimeType?.includes('mp4') ? 0 : 1;
    const rightMp4 = right.mimeType?.includes('mp4') ? 0 : 1;
    if (leftMp4 !== rightMp4) return leftMp4 - rightMp4;

    const leftHeightDelta = left.height == null ? 9999 : Math.abs(left.height - targetHeight);
    const rightHeightDelta = right.height == null ? 9999 : Math.abs(right.height - targetHeight);
    if (leftHeightDelta !== rightHeightDelta) return leftHeightDelta - rightHeightDelta;

    return (left.height ?? 0) - (right.height ?? 0);
  })[0] || null;
}

async function fetchRapidApiJson(pathname: string, params: Record<string, string | null | undefined>) {
  const apiKey = getRapidApiKey();
  const host = getRapidApiHost();

  if (!apiKey) {
    throw new Error('rapidapi_key_missing');
  }

  if (!host) {
    throw new Error('rapidapi_host_missing');
  }

  const response = await fetch(buildUrl(pathname, params), {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': host,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  const payload = await response.json() as Record<string, unknown>;
  const errorObject = asObject(payload.error);
  const errorMessage = asString(errorObject?.message) || asString(errorObject?.code) || asString(payload.message);

  if (!response.ok || errorMessage) {
    throw new Error(errorMessage || `rapidapi_request_failed_${response.status}`);
  }

  return payload;
}

function mapFailure(platform: DownloadPlatform, reason: string): SocialVideoDownloadResult {
  return {
    platform,
    source: 'none',
    title: null,
    thumbnailUrl: null,
    videoUrl: null,
    fallbackReason: reason,
    variants: [],
    raw: null,
  };
}

export async function fetchSocialVideoDownload(url: string): Promise<SocialVideoDownloadResult> {
  const platform = detectPlatform(url);

  if (platform === 'other') {
    return mapFailure(platform, 'rapidapi_platform_unsupported');
  }

  try {
    let payload: Record<string, unknown>;

    if (platform === 'youtube') {
      const videoId = extractYouTubeVideoId(url);
      if (!videoId) {
        return mapFailure(platform, 'rapidapi_invalid_youtube_url');
      }

      payload = await fetchRapidApiJson('/youtube/v3/video/details', {
        videoId,
        urlAccess: 'proxied',
      });
    } else if (platform === 'instagram') {
      const shortcode = extractInstagramShortcode(url);
      if (!shortcode) {
        return mapFailure(platform, 'rapidapi_invalid_instagram_url');
      }

      payload = await fetchRapidApiJson('/instagram/v3/media/post/details', {
        shortcode,
      });
    } else if (platform === 'tiktok') {
      payload = await fetchRapidApiJson('/tiktok/v3/post/details', {
        url,
      });
    } else {
      payload = await fetchRapidApiJson('/facebook/v3/post/details', {
        url,
      });
    }

    const variants = collectVideoVariants(payload);
    const preferredVariant = choosePreferredVariant(variants);

    return {
      platform,
      source: preferredVariant ? 'rapidapi_smvd' : 'none',
      title: extractTitle(payload),
      thumbnailUrl: extractThumbnailUrl(payload),
      videoUrl: preferredVariant?.url || null,
      fallbackReason: preferredVariant ? null : 'rapidapi_video_variant_missing',
      variants,
      raw: payload,
    };
  } catch (error) {
    return mapFailure(
      platform,
      error instanceof Error ? error.message : 'rapidapi_request_failed'
    );
  }
}
