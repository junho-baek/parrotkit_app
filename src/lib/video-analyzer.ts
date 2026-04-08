import ffmpeg from 'fluent-ffmpeg';
import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import { promisify } from 'util';

const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rm);

const MIN_SCENE_COUNT = 4;
const MAX_SCENE_COUNT = 6;
const MAX_CANDIDATE_COUNT = 8;
const MIN_SCENE_GAP_SECONDS = 2;
const STORYBOARD_DIFF_SIZE = 24;

interface SceneDetection {
  timestamp: number;
  thumbnailBase64: string;
}

export interface VideoAnalysisResult {
  scenes: SceneDetection[];
  duration: number;
  method?: 'ffmpeg_video_download' | 'frame_diff_ai_confirmed' | 'transcript_guided';
  error?: string;
  fallbackReason?: string;
}

export interface SceneCandidate extends SceneDetection {
  diffScore: number;
}

export interface VideoCandidateAnalysisResult {
  candidates: SceneCandidate[];
  scenes: SceneDetection[];
  duration: number;
  error?: string;
  fallbackReason?: string;
}

interface FrameSample {
  index: number;
  timestamp: number;
  thumbnailBase64: string;
  diffScore: number;
}

function getTempRoot(...segments: string[]) {
  return path.join(os.tmpdir(), 'parrotkit', ...segments);
}

/**
 * YouTube URL에서 비디오 ID 추출
 */
export function extractVideoId(url: string): string | null {
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

/**
 * FFmpeg를 사용하여 비디오에서 장면 전환 감지
 * @param videoPath 비디오 파일 경로
 * @param threshold 장면 전환 감도 (0.0 ~ 1.0, 기본값 0.3 - 더 민감하게)
 * @returns 장면 전환 타임스탬프 배열
 */
export async function detectSceneChanges(
  videoPath: string,
  threshold: number = 0.3
): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const sceneTimestamps: number[] = [0]; // 시작은 항상 0초
    
    ffmpeg(videoPath)
      .outputOptions([
        '-vf', `select='gt(scene,${threshold})',showinfo`,
        '-f', 'null'
      ])
      .on('stderr', (stderrLine) => {
        // FFmpeg stderr에서 타임스탬프 추출
        const match = stderrLine.match(/pts_time:([\d.]+)/);
        if (match) {
          const timestamp = parseFloat(match[1]);
          sceneTimestamps.push(timestamp);
        }
      })
      .on('end', () => {
        resolve(sceneTimestamps.sort((a, b) => a - b));
      })
      .on('error', (err) => {
        console.error('Scene detection error:', err);
        reject(err);
      })
      .output('-')
      .run();
  });
}

/**
 * 특정 타임스탬프에서 썸네일 추출
 */
export async function extractThumbnail(
  videoPath: string,
  timestamp: number,
  outputDir: string
): Promise<string> {
  const outputPath = path.join(outputDir, `thumb_${timestamp.toFixed(2)}.jpg`);
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .inputOptions([`-ss ${Math.max(0, timestamp)}`])
      .output(outputPath)
      .outputOptions(['-frames:v 1', '-update 1'])
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

/**
 * 이미지 파일을 base64로 변환
 */
export async function imageToBase64(imagePath: string): Promise<string> {
  const imageBuffer = await fs.promises.readFile(imagePath);
  return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
}

/**
 * 비디오 길이 가져오기
 */
export async function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration || 30);
    });
  });
}

async function downloadRemoteVideo(remoteUrl: string, tempDir: string) {
  const response = await fetch(remoteUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to download remote video: ${response.status}`);
  }

  const filePath = path.join(tempDir, 'source-video.mp4');
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.promises.writeFile(filePath, buffer);
  return filePath;
}

export async function extractVideoThumbnailsAtTimestamps(videoUrl: string, timestamps: number[]) {
  const tempDir = getTempRoot('scene-thumbnails', `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const thumbDir = path.join(tempDir, 'thumbs');
  const normalizedTimestamps = Array.from(
    new Set(
      timestamps
        .filter((timestamp) => Number.isFinite(timestamp))
        .map((timestamp) => Math.max(0, timestamp))
    )
  ).sort((a, b) => a - b);

  if (normalizedTimestamps.length === 0) {
    return new Map<number, string>();
  }

  const isRemoteVideo = /^https?:\/\//i.test(videoUrl);
  let localVideoPath = videoUrl;

  try {
    await mkdir(tempDir, { recursive: true });
    await mkdir(thumbDir, { recursive: true });
    localVideoPath = isRemoteVideo ? await downloadRemoteVideo(videoUrl, tempDir) : videoUrl;

    const thumbnails = new Map<number, string>();

    for (const timestamp of normalizedTimestamps) {
      try {
        const thumbPath = await extractThumbnail(localVideoPath, timestamp, thumbDir);
        const thumbnailBase64 = await imageToBase64(thumbPath);
        thumbnails.set(timestamp, thumbnailBase64);
        await unlink(thumbPath);
      } catch (error) {
        console.warn('[비디오 썸네일] 특정 시점 프레임 추출에 실패했습니다.', { timestamp, error });
      }
    }

    return thumbnails;
  } catch (error) {
    console.warn('[비디오 썸네일] 다중 프레임 추출에 실패했습니다.', error);
    return new Map<number, string>();
  } finally {
    try {
      if (isRemoteVideo && fs.existsSync(localVideoPath)) {
        await unlink(localVideoPath);
      }
    } catch {
      // ignore cleanup failures
    }

    try {
      if (fs.existsSync(tempDir)) {
        await rmdir(tempDir, { recursive: true, force: true });
      }
    } catch {
      // ignore cleanup failures
    }
  }
}

function getMean(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getStandardDeviation(values: number[], mean: number) {
  if (values.length === 0) return 0;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function meanAbsoluteDifference(current: Uint8Array, previous: Uint8Array) {
  let total = 0;

  for (let index = 0; index < current.length; index += 1) {
    total += Math.abs(current[index] - previous[index]);
  }

  return total / current.length;
}

function pickNearestFrame(frames: FrameSample[], targetTimestamp: number) {
  return [...frames].sort((a, b) => Math.abs(a.timestamp - targetTimestamp) - Math.abs(b.timestamp - targetTimestamp))[0] ?? null;
}

function sortFramesChronologically(frames: FrameSample[]) {
  return [...frames].sort((a, b) => a.timestamp - b.timestamp);
}

function collectCandidateFrames(frames: FrameSample[], duration: number, maxCandidates: number = MAX_CANDIDATE_COUNT) {
  if (frames.length === 0) {
    return [];
  }

  const withDiff = frames.slice(1);
  const scores = withDiff.map((frame) => frame.diffScore);
  const mean = getMean(scores);
  const stdDev = getStandardDeviation(scores, mean);
  const localPeaks = withDiff.filter((frame, index) => {
    const previousScore = withDiff[index - 1]?.diffScore ?? -Infinity;
    const nextScore = withDiff[index + 1]?.diffScore ?? -Infinity;
    return frame.diffScore >= previousScore && frame.diffScore >= nextScore;
  });

  const selected = [frames[0]];
  const minGap = Math.max(MIN_SCENE_GAP_SECONDS, Math.round((frames[1]?.timestamp ?? MIN_SCENE_GAP_SECONDS)));

  const tryAddFrame = (candidate: FrameSample | null | undefined) => {
    if (!candidate) return false;
    if (selected.some((frame) => Math.abs(frame.timestamp - candidate.timestamp) < minGap)) {
      return false;
    }

    selected.push(candidate);
    return true;
  };

  for (const candidate of localPeaks.sort((a, b) => b.diffScore - a.diffScore)) {
    if (selected.length >= maxCandidates) break;
    if (candidate.diffScore >= mean || stdDev === 0) {
      tryAddFrame(candidate);
    }
  }

  if (selected.length < MIN_SCENE_COUNT) {
    const targetRatios = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
    for (const ratio of targetRatios) {
      if (selected.length >= Math.min(maxCandidates, MIN_SCENE_COUNT + 2)) break;
      tryAddFrame(pickNearestFrame(frames, duration * ratio));
    }
  }

  return sortFramesChronologically(selected).slice(0, maxCandidates);
}

function selectSceneFrames(frames: FrameSample[], duration: number) {
  if (frames.length === 0) {
    return [];
  }

  const withDiff = frames.slice(1);
  const scores = withDiff.map((frame) => frame.diffScore);
  const mean = getMean(scores);
  const stdDev = getStandardDeviation(scores, mean);
  const threshold = mean + stdDev * 0.5;

  const localPeaks = withDiff.filter((frame, index) => {
    const previousScore = withDiff[index - 1]?.diffScore ?? -Infinity;
    const nextScore = withDiff[index + 1]?.diffScore ?? -Infinity;
    return frame.diffScore >= previousScore && frame.diffScore >= nextScore;
  });

  const selected = [frames[0]];
  const minGap = Math.max(MIN_SCENE_GAP_SECONDS, Math.round((frames[1]?.timestamp ?? MIN_SCENE_GAP_SECONDS)));

  const tryAddFrame = (candidate: FrameSample | null | undefined) => {
    if (!candidate) return false;
    if (selected.some((frame) => Math.abs(frame.timestamp - candidate.timestamp) < minGap)) {
      return false;
    }

    selected.push(candidate);
    return true;
  };

  const prioritizedPeaks = localPeaks
    .filter((frame) => frame.diffScore >= threshold)
    .sort((a, b) => b.diffScore - a.diffScore);

  for (const candidate of prioritizedPeaks) {
    if (selected.length >= MAX_SCENE_COUNT) break;
    tryAddFrame(candidate);
  }

  if (selected.length < MIN_SCENE_COUNT) {
    const supplementalFrames = [...localPeaks, ...withDiff]
      .sort((a, b) => b.diffScore - a.diffScore);

    for (const candidate of supplementalFrames) {
      if (selected.length >= MIN_SCENE_COUNT) break;
      tryAddFrame(candidate);
    }
  }

  if (selected.length < MIN_SCENE_COUNT) {
    const targetRatios = [0.2, 0.4, 0.6, 0.8, 0.92];
    for (const ratio of targetRatios) {
      if (selected.length >= MIN_SCENE_COUNT) break;
      const candidate = pickNearestFrame(frames, duration * ratio);
      tryAddFrame(candidate);
    }
  }

  const deduped = Array.from(
    new Map(selected.map((frame) => [frame.timestamp, frame])).values()
  ).sort((a, b) => a.timestamp - b.timestamp);

  if (deduped.length <= MAX_SCENE_COUNT) {
    return deduped;
  }

  const [firstFrame, ...remainingFrames] = deduped;
  const trimmedFrames = remainingFrames
    .sort((a, b) => b.diffScore - a.diffScore)
    .slice(0, MAX_SCENE_COUNT - 1)
    .sort((a, b) => a.timestamp - b.timestamp);

  return [firstFrame, ...trimmedFrames];
}

async function buildFrameFromImagePath(imagePath: string, timestamp: number, previousPixels: Uint8Array | null) {
  const imageBuffer = await fs.promises.readFile(imagePath);
  const normalizedBuffer = await sharp(imageBuffer)
    .resize(STORYBOARD_DIFF_SIZE, STORYBOARD_DIFF_SIZE)
    .grayscale()
    .raw()
    .toBuffer();

  const currentPixels = new Uint8Array(normalizedBuffer);
  const diffScore = previousPixels ? meanAbsoluteDifference(currentPixels, previousPixels) : 0;

  return {
    frame: {
      index: Math.round(timestamp * 1000),
      timestamp,
      thumbnailBase64: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`,
      diffScore,
    },
    pixels: currentPixels,
  };
}

export async function analyzeVideoFrameCandidates(videoUrl: string): Promise<VideoCandidateAnalysisResult> {
  const tempDir = getTempRoot('frame-candidates', `${Date.now()}`);

  try {
    await mkdir(tempDir, { recursive: true });
    const localVideoPath = /^https?:\/\//i.test(videoUrl)
      ? await downloadRemoteVideo(videoUrl, tempDir)
      : videoUrl;
    const duration = await getVideoDuration(localVideoPath);
    const sampleInterval = Math.max(1.5, Math.min(4, duration / 12));
    const safeDuration = Math.max(0, duration - 0.5);
    const timestamps = Array.from(
      new Set(
        [0, ...Array.from({ length: Math.ceil(duration / sampleInterval) }, (_, index) => Number((index * sampleInterval).toFixed(2))), safeDuration]
          .map((timestamp) => Math.max(0, Math.min(safeDuration, timestamp)))
      )
    ).sort((a, b) => a - b);

    const frames: FrameSample[] = [];
    let previousPixels: Uint8Array | null = null;

    for (const timestamp of timestamps) {
      const thumbnailPath = await extractThumbnail(localVideoPath, timestamp, tempDir);
      const { frame, pixels } = await buildFrameFromImagePath(thumbnailPath, timestamp, previousPixels);
      frames.push(frame);
      previousPixels = pixels;
      await unlink(thumbnailPath);
    }

    const candidates = collectCandidateFrames(frames, duration).map((frame) => ({
      timestamp: frame.timestamp,
      thumbnailBase64: frame.thumbnailBase64,
      diffScore: frame.diffScore,
    }));
    const scenes = selectSceneFrames(frames, duration).map((frame) => ({
      timestamp: frame.timestamp,
      thumbnailBase64: frame.thumbnailBase64,
    }));

    return {
      candidates,
      scenes,
      duration,
      ...(candidates.length > 0 ? {} : { fallbackReason: 'frame_diff_candidates_empty' }),
    };
  } catch (error) {
    return {
      candidates: [],
      scenes: [],
      duration: 0,
      error: error instanceof Error ? error.message : 'Failed to analyze video frames',
      fallbackReason: 'frame_diff_analysis_failed',
    };
  } finally {
    try {
      if (fs.existsSync(tempDir)) {
        await rmdir(tempDir, { recursive: true, force: true });
      }
    } catch {}
  }
}

function normalizeDetectedSceneTimestamps(sceneTimestamps: number[], duration: number) {
  let normalizedTimestamps = Array.from(
    new Set(
      sceneTimestamps
        .filter((timestamp) => Number.isFinite(timestamp))
        .map((timestamp) => Math.max(0, Math.min(timestamp, duration)))
    )
  ).sort((a, b) => a - b);

  normalizedTimestamps = normalizedTimestamps.filter((timestamp, index) => {
    if (index === 0) return true;
    return timestamp - normalizedTimestamps[index - 1] >= MIN_SCENE_GAP_SECONDS;
  });

  if (normalizedTimestamps.length > MAX_SCENE_COUNT) {
    const [firstFrame, ...remainingFrames] = normalizedTimestamps;
    const step = Math.ceil(remainingFrames.length / (MAX_SCENE_COUNT - 1));
    normalizedTimestamps = [firstFrame, ...remainingFrames.filter((_, index) => index % step === 0)].slice(0, MAX_SCENE_COUNT);
  }

  if (normalizedTimestamps.length < MIN_SCENE_COUNT) {
    const sceneCount = Math.min(MAX_SCENE_COUNT, Math.max(MIN_SCENE_COUNT, Math.floor(duration / 3)));
    normalizedTimestamps = Array.from({ length: sceneCount }, (_, index) => (duration / sceneCount) * index);
  }

  return normalizedTimestamps;
}

/**
 * YouTube 비디오를 임시로 다운로드하고 분석
 */
export async function analyzeYouTubeVideo(url: string): Promise<VideoAnalysisResult> {
  const videoId = extractVideoId(url);
  if (!videoId) {
    return { scenes: [], duration: 0, error: 'Invalid YouTube URL' };
  }

  const tempDir = getTempRoot('youtube-analysis');
  const videoPath = path.join(tempDir, `${videoId}.mp4`);
  const thumbDir = path.join(tempDir, 'thumbnails', videoId);

  try {
    // 임시 디렉토리 생성
    await mkdir(tempDir, { recursive: true });
    await mkdir(thumbDir, { recursive: true });

    // YouTube 비디오 다운로드
    console.log('[유튜브 장면 분석] 비디오 다운로드를 시작합니다.');
    
    // 비디오 정보 먼저 가져오기
    const info = await ytdl.getInfo(url);
    console.log('[유튜브 장면 분석] 비디오 메타데이터를 가져왔습니다.', { title: info.videoDetails.title });
    
    const videoStream = ytdl(url, {
      quality: 'lowestvideo',
      filter: (format) => format.hasVideo,
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        }
      }
    });

    const writeStream = fs.createWriteStream(videoPath);
    let downloadComplete = false;
    
    await new Promise<void>((resolve, reject) => {
      videoStream.pipe(writeStream);
      
      writeStream.on('finish', () => {
        downloadComplete = true;
        console.log('[유튜브 장면 분석] 비디오 다운로드가 완료되었습니다.');
        resolve();
      });
      
      writeStream.on('error', (err) => {
        console.error('[유튜브 장면 분석] 다운로드 파일 쓰기 중 오류가 발생했습니다.', err);
        reject(err);
      });
      
      videoStream.on('error', (err) => {
        console.error('[유튜브 장면 분석] 비디오 스트림 오류가 발생했습니다.', err);
        reject(err);
      });
      
      // 60초 후 타임아웃 (shorts는 보통 짧으므로 충분함)
      setTimeout(() => {
        if (!downloadComplete) {
          console.log('[유튜브 장면 분석] 다운로드 시간이 길어져 부분 파일 기준으로 계속 진행합니다.');
          videoStream.destroy();
          writeStream.end();
          resolve();
        }
      }, 60000);
    });

    console.log('[유튜브 장면 분석] 비디오 다운로드 후 장면 분석을 시작합니다.');

    // 비디오 길이 확인
    const duration = await getVideoDuration(videoPath);

    // 장면 전환 감지 (threshold 낮추어 더 많은 컬 감지)
    let sceneTimestamps = await detectSceneChanges(videoPath, 0.3);
    sceneTimestamps = normalizeDetectedSceneTimestamps(sceneTimestamps, duration);

    console.log('[유튜브 장면 분석] 장면 후보를 추출했습니다.', { sceneCount: sceneTimestamps.length });

    // 각 장면의 썸네일 추출
    const scenes: SceneDetection[] = [];
    for (const timestamp of sceneTimestamps) {
      try {
        const thumbPath = await extractThumbnail(videoPath, timestamp, thumbDir);
        const thumbnailBase64 = await imageToBase64(thumbPath);
        scenes.push({ timestamp, thumbnailBase64 });
        
        // 임시 파일 삭제
        await unlink(thumbPath);
      } catch (err) {
        console.error(`[유튜브 장면 분석] ${timestamp}초 썸네일 추출에 실패했습니다.`, err);
      }
    }

    // 임시 비디오 파일 삭제
    await unlink(videoPath);
    await rmdir(thumbDir, { recursive: true, force: true });

    return { scenes, duration, method: 'ffmpeg_video_download' };

  } catch (error: unknown) {
    console.error('[유튜브 장면 분석] 분석 중 오류가 발생했습니다.', error);
    
    // 정리
    try {
      if (fs.existsSync(videoPath)) await unlink(videoPath);
    } catch {}
    try {
      if (fs.existsSync(thumbDir)) {
        await rmdir(thumbDir, { recursive: true, force: true });
      }
    } catch {}

    return { 
      scenes: [], 
      duration: 0, 
      error: error instanceof Error ? error.message : 'Failed to analyze video',
      fallbackReason: 'youtube_scene_detection_failed',
    };
  }
}
