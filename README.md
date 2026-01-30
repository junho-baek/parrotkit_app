# 🦜 ParrotKit

> Transform viral videos into actionable content recipes with AI

ParrotKit is a cutting-edge platform that analyzes viral videos and generates detailed "recipes" - shot-by-shot breakdowns that help content creators replicate successful formats. Powered by Google Gemini AI, it provides comprehensive scene analysis, camera angles, lighting setups, and scriptwriting guidance.

## ✨ Features

### 🎬 Video Analysis
- **AI-Powered Analysis**: Automatically breaks down videos into scenes using Google Gemini 1.5 Flash
- **Multi-Platform Support**: Works with YouTube Shorts, TikTok, Instagram Reels
- **Scene Breakdown**: Detailed shot types, camera angles, lighting, and audio notes
- **Custom Context**: Add niche, goals, and descriptions for tailored analysis

### 📱 User-Friendly Interface
- **Modern UI/UX**: Beautiful gradients, animations, and glassmorphism effects
- **Mobile-First Design**: Responsive layout optimized for all devices
- **Bottom Tab Navigation**: Easy access to Home, Explore, Paste, Recipes, and My pages
- **Video Player Modal**: Built-in player with smooth transitions and app-like UX

### 🔍 Explore & Discover
- **Trending Content**: Browse curated viral videos
- **Like & Save**: Build your personal collection of favorite videos
- **Category Filters**: Find content by niche (Cooking, Beauty, Fitness, etc.)
- **Real YouTube Integration**: Play videos directly within the app

### 📋 Recipe Management
- **Create Recipes**: Paste video URLs and generate instant recipes
- **View & Edit**: Access detailed scene-by-scene breakdowns
- **Track Progress**: Monitor captured scenes and completion status
- **Export Options**: Share your recipes with collaborators

### 👤 Account Features
- **Secure Authentication**: JWT-based login with bcrypt password hashing
- **Interest Onboarding**: Personalize your experience with interest selection
- **Profile Management**: Track your references, recipes, and statistics
- **Persistent Sessions**: Stay logged in across visits

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (NeonDB recommended)
- Google AI API key (Gemini)

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
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Google AI
GOOGLE_AI_API_KEY="your-gemini-api-key"

# Lemon Squeezy (Optional)
LEMONSQUEEZY_API_KEY="your-lemonsqueezy-api-key"
LEMONSQUEEZY_STORE_ID="your-store-id"
LEMONSQUEEZY_WEBHOOK_SECRET="your-webhook-secret"
```

4. **Set up the database**
```bash
npm run db:push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
parrotkit/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (tabs)/            # Tab-based routes (Home, Explore, etc.)
│   │   ├── api/               # API routes
│   │   │   ├── analyze/       # Video analysis endpoint
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   └── webhooks/      # Payment webhooks
│   │   ├── globals.css        # Global styles & animations
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── auth/              # Auth-related components
│   │   │   ├── DashboardContent.tsx    # Home, Recipes, Settings
│   │   │   ├── ExploreContent.tsx      # Explore page
│   │   │   ├── SignInForm.tsx          # Login form
│   │   │   ├── SignUpForm.tsx          # Registration form
│   │   │   └── URLInputForm.tsx        # Video URL paste form
│   │   └── common/            # Reusable components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── LoadingScreen.tsx
│   │       └── RecipeResult.tsx        # Recipe viewer
│   ├── lib/
│   │   ├── db.ts              # Drizzle ORM setup
│   │   ├── schema.ts          # Database schema
│   │   └── lemonsqueezy.ts    # Payment integration
│   └── types/
│       └── auth.ts            # TypeScript types
├── public/                     # Static assets
│   ├── parrot-logo.png
│   └── navigation icons/
├── drizzle/                    # Database migrations
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router & Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with custom animations
- **Database**: PostgreSQL (NeonDB) with Drizzle ORM
- **AI**: Google Gemini 1.5 Flash
- **Authentication**: JWT + bcryptjs
- **Payments**: Lemon Squeezy (optional)
- **Deployment**: Vercel

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (`#6366f1`) to Purple (`#8b5cf6`)
- **Secondary**: Pink (`#ec4899`)
- **Accent**: Purple (`#764ba2`)

### Key Features
- Gradient backgrounds and buttons
- Glassmorphism effects
- Smooth animations and transitions
- Custom loading states
- Responsive grid layouts

## 📖 API Documentation

### POST `/api/analyze`
Analyzes a video URL and generates a recipe.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/shorts/VIDEO_ID",
  "niche": "Cooking",
  "goal": "Create engaging content",
  "describe": "Additional context"
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
      "endTime": "00:05",
      "description": "Opening shot description",
      "script": ["Line 1", "Line 2"]
    }
  ]
}
```

### POST `/api/auth/signup`
Creates a new user account.

### POST `/api/auth/signin`
Authenticates a user and returns a JWT token.

## 🧪 Testing

```bash
# Run TypeScript type checking
npm run type-check

# Build for production
npm run build

# Run production build locally
npm start
```

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
- NeonDB for serverless PostgreSQL
- Lemon Squeezy for payment processing

## 📧 Contact

For questions or support, please contact:
- Email: support@parrotkit.com
- Website: https://parrotkit.com

---

Made with ❤️ by the ParrotKit team
