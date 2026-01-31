import ffmpeg from 'fluent-ffmpeg';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

interface SceneDetection {
  timestamp: number;
  thumbnailBase64: string;
}

interface VideoAnalysisResult {
  scenes: SceneDetection[];
  duration: number;
  error?: string;
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
 * @param threshold 장면 전환 감도 (0.0 ~ 1.0, 기본값 0.4)
 * @returns 장면 전환 타임스탬프 배열
 */
export async function detectSceneChanges(
  videoPath: string,
  threshold: number = 0.4
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
      .seekInput(timestamp)
      .frames(1)
      .output(outputPath)
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

/**
 * YouTube 비디오를 임시로 다운로드하고 분석
 */
export async function analyzeYouTubeVideo(url: string): Promise<VideoAnalysisResult> {
  const videoId = extractVideoId(url);
  if (!videoId) {
    return { scenes: [], duration: 0, error: 'Invalid YouTube URL' };
  }

  const tempDir = path.join(process.cwd(), 'temp');
  const videoPath = path.join(tempDir, `${videoId}.mp4`);
  const thumbDir = path.join(tempDir, 'thumbnails', videoId);

  try {
    // 임시 디렉토리 생성
    await mkdir(tempDir, { recursive: true });
    await mkdir(thumbDir, { recursive: true });

    // YouTube 비디오 다운로드 (30초만)
    console.log('Downloading video...');
    const videoStream = ytdl(url, {
      quality: 'lowest',
      filter: 'videoandaudio',
    });

    const writeStream = fs.createWriteStream(videoPath);
    
    await new Promise<void>((resolve, reject) => {
      videoStream.pipe(writeStream);
      writeStream.on('finish', () => resolve());
      writeStream.on('error', reject);
      
      // 30초 후 타임아웃
      setTimeout(() => {
        videoStream.destroy();
        writeStream.end();
        resolve(null);
      }, 30000);
    });

    console.log('Video downloaded, analyzing scenes...');

    // 비디오 길이 확인
    const duration = await getVideoDuration(videoPath);

    // 장면 전환 감지
    let sceneTimestamps = await detectSceneChanges(videoPath, 0.4);
    
    // 장면이 너무 많으면 6~8개로 제한
    if (sceneTimestamps.length > 8) {
      const interval = Math.floor(sceneTimestamps.length / 6);
      sceneTimestamps = sceneTimestamps.filter((_, i) => i % interval === 0).slice(0, 8);
    }

    // 장면이 너무 적으면 균등 분할
    if (sceneTimestamps.length < 4) {
      sceneTimestamps = Array.from({ length: 6 }, (_, i) => (duration / 6) * i);
    }

    console.log(`Found ${sceneTimestamps.length} scenes`);

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
        console.error(`Failed to extract thumbnail at ${timestamp}:`, err);
      }
    }

    // 임시 비디오 파일 삭제
    await unlink(videoPath);

    return { scenes, duration };

  } catch (error: any) {
    console.error('Video analysis error:', error);
    
    // 정리
    try {
      if (fs.existsSync(videoPath)) await unlink(videoPath);
    } catch {}

    return { 
      scenes: [], 
      duration: 0, 
      error: error.message || 'Failed to analyze video' 
    };
  }
}
