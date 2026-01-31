# FFmpeg Setup Instructions

## Windows

1. **Download FFmpeg**:
   - Visit https://www.gyan.dev/ffmpeg/builds/
   - Download "ffmpeg-release-essentials.zip"

2. **Extract and Add to PATH**:
   ```powershell
   # Extract to C:\ffmpeg
   # Add C:\ffmpeg\bin to System Environment Variables PATH
   
   # Verify installation
   ffmpeg -version
   ```

## macOS

```bash
# Install via Homebrew
brew install ffmpeg

# Verify
ffmpeg -version
```

## Linux

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# Verify
ffmpeg -version
```

## Vercel Deployment

For Vercel deployment, FFmpeg is **not available** by default. You have two options:

### Option 1: Use YouTube API Thumbnails (Current Fallback)
The code automatically falls back to YouTube thumbnail URLs if FFmpeg fails.

### Option 2: Use External Video Processing Service
- **Cloudinary**: Video analysis API
- **AWS MediaConvert**: Scene detection
- **Mux**: Video analytics

### Option 3: Custom Build with FFmpeg Layer
Use Vercel's custom build with FFmpeg binary included (advanced).

## Testing Locally

After installing FFmpeg:

```bash
npm install
npm run dev
```

Test with a YouTube URL:
```
POST http://localhost:3000/api/analyze
{
  "url": "https://www.youtube.com/shorts/VIDEO_ID"
}
```

The API will:
1. ✅ Try FFmpeg scene detection
2. ✅ Extract real thumbnails from video
3. ⚠️ Fallback to YouTube thumbnails if FFmpeg fails
