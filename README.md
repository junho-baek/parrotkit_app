# 🦜 ParrotKit

> Transform viral videos into actionable content recipes with AI

ParrotKit is a cutting-edge mobile-first platform that analyzes viral short-form videos and generates detailed "recipes" - shot-by-shot breakdowns that help content creators replicate successful formats. Powered by Google Gemini AI and FFmpeg, it provides comprehensive scene analysis, camera angles, lighting setups, and scriptwriting guidance.

**Last Updated**: February 11, 2026

## ✨ Features

### 🎬 Advanced Video Analysis
- **FFmpeg Scene Detection**: Real-time cut point detection using FFmpeg for accurate scene transitions
- **AI-Powered Analysis**: Automatically breaks down videos using Google Gemini Pro
- **Multi-Platform Support**: Works with YouTube Shorts, TikTok, Instagram Reels
- **Real Thumbnails**: Extracts actual video frames at each cut point (not generic thumbnails)
- **Scene Breakdown**: Detailed shot types, camera angles, lighting, and audio notes
- **Custom Context**: Add niche, goals, and descriptions for tailored analysis
- **AI Script Generation**: Intelligent dialogue and acting direction for each scene

### 📱 Mobile-First Experience
- **App-Like Interface**: Optimized for mobile with smooth animations and transitions
- **Bottom Tab Navigation**: Intuitive 5-tab layout (Home, Explore, Paste, Recipes, My)
- **Fixed Frame Layout**: Stable viewport with no scrolling issues (100dvh support)
- **Safe Area Support**: Adaptive padding for notches and home indicators
- **Responsive Design**: Scales from mobile to tablet to desktop
- **Touch-Optimized**: Perfect tap targets and swipe gestures
- **Bouncing Logo**: Playful loading animations with brand logo throughout

### 🔍 Explore & Discover
- **Trending Content**: Browse curated viral videos
- **Like & Save**: Build your personal collection of favorite videos
- **Category Filters**: Find content by niche (Cooking, Beauty, Fitness, DIY, Travel, Comedy)
- **Real YouTube Integration**: Play videos directly within modal player
- **Grid Layout**: Instagram-style 2-column video grid

### 📋 Smart Recipe Management
- **Create Recipes**: Paste video URLs and generate instant recipes
- **Smart Scene Detection**: FFmpeg analyzes actual cut transitions (not time-based splits)
- **AI Chat Assistant**: Modify scene scripts with conversational AI
- **View & Edit**: Access detailed scene-by-scene breakdowns with real thumbnails
- **Track Progress**: Monitor captured scenes and completion status
- **Camera Shooting**: Record scenes with reference video side-by-side
- **Export Options**: Download captured videos individually or bulk export
- **Recipe Storage**: LocalStorage-based recipe persistence

### 👤 Complete User Experience
- **Secure Authentication**: JWT-based login with bcrypt password hashing
- **Interest Onboarding**: Personalize your experience with 15+ interest categories
- **Profile Management**: Track your references, recipes, and statistics
- **Subscription System**: Free and Pro plans with Lemon Squeezy integration
- **Analytics Integration**: GTM-based GA4/Meta events plus Microsoft Clarity
- **Persistent Sessions**: Stay logged in across visits

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase project with Postgres
- Google AI API key (Gemini)
- **FFmpeg** (required for scene detection) - [Installation Guide](FFMPEG_SETUP.md)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/parrotkit.git
cd parrotkit
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
# Use Supabase's modern publishable key for browsers and normal auth flows.
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
# Keep the secret key server-only for admin APIs and migrations.
SUPABASE_SECRET_KEY="your-secret-key"
# Use the pooled connection string for Next.js/serverless traffic.
DATABASE_URL="postgresql://postgres.<project-ref>:<db-password>@aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require"

# Google AI
GOOGLE_AI_API_KEY="your-gemini-api-key"

# GTM entrypoint
# GA4 Measurement ID and Meta Pixel ID should stay in GTM, not in app env.
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"

# Lemon Squeezy (Optional)
NEXT_PUBLIC_APP_URL="https://parrotkit-deploy.vercel.app"
LEMONSQUEEZY_API_KEY="your-lemonsqueezy-api-key"
LEMONSQUEEZY_STORE_ID="your-store-id"
LEMONSQUEEZY_WEBHOOK_SECRET="your-webhook-secret"
NEXT_PUBLIC_VARIANT_PRO="your-pro-variant-id"

# Notion report automation (Optional)
NOTION_API_KEY="secret_your_notion_internal_integration_token"
NOTION_REPORTS_PARENT_PAGE_ID="your-notion-parent-page-id"
NOTION_REPORTS_DATABASE_ID="your-notion-database-id"
NOTION_REPORTS_DATA_SOURCE_ID="your-notion-data-source-id"
```

Important analytics rule:
- The app pushes events into `window.dataLayer`.
- GTM fans those events out to GA4 and Meta Pixel.
- Do not add GA4 Measurement IDs or Meta Pixel IDs directly to the app env.

4. **Install FFmpeg** (Required)

Follow the platform-specific instructions in [FFMPEG_SETUP.md](FFMPEG_SETUP.md)

```bash
# Verify FFmpeg installation
ffmpeg -version
```

5. **Capture current DB schema snapshot**
```bash
npm run db:schema
```

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ Stable DB Workflow (Drizzle + Supabase)

ParrotKit uses a hybrid model:
- **Drizzle** for `public` table DDL change tracking (columns/indexes/defaults).
- **Supabase SQL migrations** for platform-specific concerns (RLS, Auth/Storage policies).

Recommended workflow for schema changes:

1. Edit table definitions in `src/lib/schema.ts`.
2. Generate Drizzle SQL draft:
```bash
npm run db:generate
```
3. Promote required DDL into `supabase/migrations/*.sql` (keep policy SQL in the same migration as needed).
4. Apply migration to Supabase environment.
5. Refresh snapshot/contracts:
```bash
npm run db:schema
```
6. Sync `src/types/supabase.generated.ts` if table contract changed.

## 📝 Notion Report Automation

ParrotKit can push generated PDF/PPT artifacts and their Markdown summary into a dedicated Notion database.

Important distinction:
- **Notion MCP** is for interactive agent browsing/writing.
- **Notion API integration token** is for repeatable headless uploads from local scripts and manual agent runs.

### One-time setup

1. Create a Notion internal integration and copy its token into `NOTION_API_KEY`.
2. Create a parent page in Notion and share it with the integration.
3. Copy that page ID into `NOTION_REPORTS_PARENT_PAGE_ID`.
4. Create or reuse the reports database:

```bash
make notion-setup
```

This writes `NOTION_REPORTS_DATABASE_ID` and `NOTION_REPORTS_DATA_SOURCE_ID` back into `.env.local`.

### Dry-run metadata check

Before a real upload, inspect what title, branch, summary blocks, and artifact paths will be sent:

```bash
make notion-upload-dry-run
```

### Upload the latest generated report

If `REPORT` is omitted, `report-and-upload` picks the newest PDF/PPT/PPTX inside `output/` and tries to find a matching Markdown summary in `output/reports/`.

```bash
make report-and-upload
```

### Create a summary template first

```bash
make report-template REPORT=output/pdf/example.pdf
make deck-template REPORT=output/ppt/example.pptx
```

### Upload a deck artifact to the same Notion flow

```bash
make deck-and-upload REPORT=output/ppt/example.pptx
```

### Upload a specific artifact

```bash
make notion-upload \
  REPORT=output/pdf/20260307_parrotkit_e2e_validation_report.pdf \
  SUMMARY_MD=output/reports/20260307_parrotkit_e2e_validation_report.md \
  REPORT_TYPE=e2e \
  STATUS=Uploaded \
  NOTES="Local validation run"
```

### MCP login for interactive Notion access

The Codex MCP server can be connected globally for interactive Notion access:

```bash
codex mcp login notion
```

That login is separate from `NOTION_API_KEY`. Keep both because automation and interactive agent access use different auth models.

## 📈 GTM + Lemon Squeezy Go-Live

ParrotKit now treats GTM as the only client analytics entrypoint, and Lemon Squeezy webhooks as the only billing source of truth.

### Tracking architecture

1. App code pushes events into `window.dataLayer`.
2. GTM receives those events and forwards them to:
   - GA4
   - Meta Pixel
3. Supabase `event_logs` still records server-side and client-side app events for product QA.

Core events already emitted by the app:
- `signup_start`
- `signup_success`
- `onboarding_complete`
- `reference_submitted`
- `recipe_generated`
- `recipe_saved`
- `capture_uploaded`
- `export_zip_success`
- `view_pricing`
- `begin_checkout`
- `purchase_success`

### Billing architecture

1. `/api/checkout` creates a hosted Lemon Squeezy checkout for the authenticated user.
2. Hosted checkout redirects to `/billing/success` after a successful payment.
3. `/billing/success` polls the authenticated profile briefly.
4. Entitlement is granted only after `/api/webhooks/lemonsqueezy` updates `profiles`.
5. The webhook also writes billing events into Supabase `event_logs`.

### External console setup order

1. Create a GTM Web container and put only `NEXT_PUBLIC_GTM_ID` into the app.
2. In GTM, add:
   - GA4 Configuration tag
   - Meta Pixel base tag
   - Event triggers for `view_pricing`, `begin_checkout`, `purchase_success`
3. Create or confirm the GA4 property and test with DebugView.
4. Create the Meta Pixel and validate with Test Events / Pixel Helper.
5. Create the Lemon Squeezy store, variant, and webhook secret.
6. Set Vercel env:
   - `NEXT_PUBLIC_GTM_ID`
   - `NEXT_PUBLIC_APP_URL`
   - `LEMONSQUEEZY_API_KEY`
   - `LEMONSQUEEZY_STORE_ID`
   - `LEMONSQUEEZY_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_VARIANT_PRO`
7. Point the Lemon webhook URL to `/api/webhooks/lemonsqueezy`.
8. Run test-mode checkout QA before enabling live mode.

## 📁 Project Structure

```
parrotkit/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout with AppFrame
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Global styles & animations
│   │   ├── (tabs)/                   # Tab-based navigation group
│   │   │   ├── layout.tsx            # Tab layout (Header + BottomTabBar)
│   │   │   ├── home/                 # Dashboard
│   │   │   ├── explore/              # Trending videos
│   │   │   ├── paste/                # URL input
│   │   │   ├── recipes/              # Recipe gallery
│   │   │   └── my/                   # User profile
│   │   ├── signin/                   # Login page
│   │   ├── signup/                   # Registration page
│   │   ├── onboarding/               # Welcome flow
│   │   ├── interests/                # Interest selection
│   │   ├── billing/                  # Billing success / cancel pages
│   │   ├── pricing/                  # Subscription plans
│   │   └── api/                      # API routes
│   │       ├── analyze/              # Video analysis endpoint
│   │       ├── auth/                 # Authentication endpoints
│   │       │   ├── signin/
│   │       │   └── signup/
│   │       ├── chat/                 # AI chat assistant
│   │       ├── checkout/             # Payment processing
│   │       ├── export/               # Video export
│   │       ├── interests/            # Interest management
│   │       ├── user/                 # User profile
│   │       │   └── profile/
│   │       └── webhooks/             # Payment webhooks
│   │           └── lemonsqueezy/
│   ├── components/
│   │   ├── auth/                     # Auth-related components
│   │   │   ├── DashboardContent.tsx  # Home, Recipes, Settings tabs
│   │   │   ├── ExploreContent.tsx    # Explore page with video grid
│   │   │   ├── RecipesTab.tsx        # Recipe management
│   │   │   ├── SignInForm.tsx        # Login form
│   │   │   ├── SignUpForm.tsx        # Registration form
│   │   │   ├── InterestsForm.tsx     # Interest selection
│   │   │   ├── URLInputForm.tsx      # Video URL paste
│   │   │   ├── OnboardingForm.tsx    # Onboarding wizard
│   │   │   ├── SourceOptionsForm.tsx # Video source options
│   │   │   └── PricingCard.tsx       # Pricing display
│   │   └── common/                   # Reusable UI components
│   │       ├── AppFrame.tsx          # App container (100dvh, safe areas)
│   │       ├── BottomTabBar.tsx      # 5-tab navigation bar
│   │       ├── TopNav.tsx            # Top navigation header
│   │       ├── Button.tsx            # Button component
│   │       ├── Input.tsx             # Input component
│   │       ├── Card.tsx              # Card component
│   │       ├── LoadingScreen.tsx     # Loading with bouncing logo
│   │       ├── RecipeResult.tsx      # Recipe viewer & editor
│   │       ├── RecipeVideoPlayer.tsx # YouTube video player
│   │       ├── CameraShooting.tsx    # Camera recording
│   │       └── PromoModal.tsx        # Promotional modal
│   ├── lib/
│   │   ├── db.ts                     # Drizzle ORM configuration
│   │   ├── schema.ts                 # Database schema (users, subscriptions)
│   │   ├── lemonsqueezy.ts           # Payment integration
│   │   └── video-analyzer.ts         # FFmpeg scene detection
│   └── types/
│       └── auth.ts                   # TypeScript type definitions
├── public/                           # Static assets
│   ├── parrot-logo.png               # Brand logo (used in all loading states)
│   ├── Home.png                      # Tab icon
│   ├── Explore.png                   # Tab icon
│   ├── Paste.png                     # Tab icon
│   ├── Recipes.png                   # Tab icon
│   └── My.png                        # Tab icon
├── drizzle/                          # Database migrations
│   ├── 0000_fuzzy_blockbuster.sql
│   └── meta/
├── temp/                             # Temporary video files (gitignored)
├── .env.local                        # Environment variables (gitignored)
├── FFMPEG_SETUP.md                   # FFmpeg installation guide
├── LEMONSQUEEZY_SETUP.md             # Payment setup guide
├── MVP-TODO.md                       # Development roadmap
└── README.md                         # This file
```

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16**: App Router, Server Components, Turbopack
- **React 19.2**: Latest features and performance improvements
- **TypeScript 5**: Type-safe development

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS with custom animations
- **Custom Animations**: bounce-logo, float-gentle, pulse-glow
- **Glassmorphism**: Modern glass effects and gradients
- **Responsive Design**: Mobile-first with adaptive layouts

### Backend & Data
- **Supabase Postgres**: Hosted Postgres, Auth, and Storage
- **Drizzle ORM**: Type-safe database queries
- **JWT Authentication**: Secure token-based auth
- **bcryptjs**: Password hashing

### AI & Video Processing
- **Google Gemini Pro**: AI-powered video analysis and script generation
- **FFmpeg**: Scene detection and video processing
- **fluent-ffmpeg**: Node.js FFmpeg wrapper
- **ytdl-core**: YouTube video downloading

### Integrations
- **Lemon Squeezy**: Payment and subscription management
- **Google Tag Manager**: Client analytics entrypoint
- **Google Analytics 4**: Funnel and behavior tracking via GTM
- **Meta Pixel**: Paid acquisition events via GTM
- **Microsoft Clarity**: Session recordings and heatmaps

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Drizzle Kit**: Database migrations

## 🎨 Design System

### Brand Colors
- **Primary Gradient**: Indigo (#6366f1) → Purple (#8b5cf6)
- **Secondary**: Pink (#ec4899)
- **Accent**: Purple (#764ba2)

### UI Components
- **AppFrame**: Unified app container with viewport stability
- **BottomTabBar**: Fixed navigation with 5 tabs
- **LoadingScreen**: Bouncing logo animation
- **Card**: Luxury card design with hover effects
- **Button**: Primary and secondary variants with gradients

### Animations
- `animate-bounce-logo`: Playful bouncing (1.5s)
- `animate-float-gentle`: Smooth floating motion (3s)
- `animate-pulse-glow`: Glowing pulse effect (2s)
- `animate-fade-in`: Fade in with slide up (0.5s)

### Layout Architecture
```
Root Layout (AppFrame applied once)
├── Landing Page (/)
├── Auth Pages (/signin, /signup)
│   └── Centered form with full-screen support
├── Onboarding (/interests)
│   └── Header + scrollable content
└── Tab Layout (/(tabs))
    ├── Fixed Header (Logo + Title)
    ├── Scrollable Content
    │   ├── /home - Dashboard
    │   ├── /explore - Trending videos
    │   ├── /paste - URL input
    │   ├── /recipes - Recipe gallery
    │   └── /my - User profile
    └── Fixed Bottom Tab Bar
```

## 📖 API Documentation

### POST `/api/analyze`
Analyzes a video URL and generates a comprehensive recipe.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/shorts/VIDEO_ID",
  "niche": "Cooking",
  "goal": "Create engaging cooking content",
  "describe": "Quick recipe tutorial for viral shorts"
}
```

**Response:**
```json
{
  "success": true,
  "videoId": "VIDEO_ID",
  "scenes": [
    {
      "id": 1,
      "title": "Hook",
      "startTime": "00:00",
      "endTime": "00:04",
      "thumbnail": "data:image/jpeg;base64,...",
      "description": "Close-up of finished dish with steam rising",
      "script": [
        "Wow, this is the easiest recipe you'll ever make!",
        "(Enthusiastic, holding plate towards camera)",
        "Smile and make eye contact"
      ],
      "progress": 0
    }
  ],
  "metadata": {
    "title": "Easy Cooking Tutorial",
    "duration": "00:30",
    "platform": "YouTube Shorts",
    "analyzedWithFFmpeg": true,
    "cutPoints": [0, 4.2, 8.5, 15.3, 22.1, 30]
  }
}
```

### POST `/api/auth/signup`
Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "creator123",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt.token.here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "creator123",
    "interests": []
  }
}
```

### POST `/api/auth/signin`
Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "username": "creator123",
  "password": "securePassword123"
}
```

### POST `/api/chat`
AI assistant for modifying scene scripts.

**Request Body:**
```json
{
  "message": "Make the opening more energetic",
  "context": {
    "sceneId": 1,
    "currentScript": ["Original line"]
  }
}
```

### POST `/api/interests`
Saves user interest preferences.

**Request Body:**
```json
{
  "interests": ["Cooking", "Beauty", "Fitness"]
}
```

### GET `/api/user/profile`
Retrieves user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## 🚀 Key Improvements (Feb 2026)

### Architecture Enhancements
- **Unified AppFrame**: Applied once at root layout, eliminating nested layout conflicts
- **Optimized Rendering**: Removed duplicate AppFrame instances from 10+ pages
- **Clean Component Hierarchy**: Clear separation between layout and content components
- **Flexbox Layout**: Consistent flex-based layouts replacing min-h-screen patterns

### UX Improvements
- **Bouncing Logo Loading**: Playful brand-consistent loading states across all components
- **Smooth Transitions**: Enhanced animation timing and easing functions
- **Loading Feedback**: Clear loading messages with context-specific descriptions
- **Error Recovery**: Graceful fallbacks for API failures

### Performance Optimizations
- **Reduced Re-renders**: Eliminated duplicate wrapper components
- **Viewport Stability**: Fixed 100dvh implementation prevents scroll jank
- **Lazy Loading**: Suspense boundaries for heavy components
- **Optimized Images**: Next.js Image component with priority flags

### API Stability
- **Gemini Pro Model**: Switched from gemini-1.5-flash for better reliability
- **Error Handling**: Comprehensive try-catch blocks with user-friendly messages
- **Timeout Management**: Proper async/await patterns throughout

## 🧪 Testing & Quality

### Type Safety
```bash
# Run TypeScript type checking
npx tsc --noEmit
```

### Build Testing
```bash
# Production build
npm run build

# Test production build locally
npm start
```

### Database Operations
```bash
# Push schema changes
npm run db:push

# Generate migrations
npm run db:generate

# View database studio
npm run db:studio
```

## 🐛 Known Issues & Limitations

1. **FFmpeg Dependency**: Requires system-level FFmpeg installation
2. **Video Download**: YouTube download may fail due to ytdl-core limitations
3. **Browser Support**: Modern browsers only (Chrome, Safari, Edge)
4. **Mobile Recording**: Camera features require HTTPS in production
5. **Storage Limits**: LocalStorage used for recipes (5-10MB typical limit)

## 🔮 Future Enhancements

- [ ] Cloud storage for recipes (replace LocalStorage)
- [ ] Social sharing features
- [ ] Collaborative recipe editing
- [ ] Advanced video editing tools
- [ ] Mobile app (iOS/Android)
- [ ] Content scheduling and posting
- [ ] Analytics dashboard
- [ ] Team collaboration features

## 📦 Deployment

The project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- Google Gemini AI for powerful video analysis
- Next.js team for an amazing framework
- Tailwind CSS for beautiful styling utilities
- Supabase for hosted Postgres and Auth
- Lemon Squeezy for payment processing

## 📧 Contact

For questions or support, please contact:
- Email: support@parrotkit.com
- Website: https://parrotkit.com

---

Made with ❤️ by the ParrotKit team
