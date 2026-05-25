# LifeTrek

Comprehensive health & wellness tracking app. Track activity, nutrition, sleep, mental wellness, medications, lab results, and get AI-powered insights.

## Features

- **Health Score System** - Dynamic 0-100 score with letter grades (A+ to F)
- **Activity Tracking** - Steps, distance, calories, exercises with 12+ sports types
- **Nutrition Tracking** - Meal logging with macro tracking
- **Sleep Analysis** - Duration, quality scores, sleep phases
- **Mental Wellness** - Mood tracking, stress levels, meditation sessions
- **AI-Powered Features** - Health coach, lab analysis, workout generator
- **Medications & Supplements** - Track daily intake
- **Lab Results** - PDF upload with AI analysis
- **Hydration & Vitals** - Water intake, BP, HR, SpO2 tracking

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 3
- Recharts for data visualization
- @react-oauth/google for authentication
- Vitest for testing

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:3000

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required:
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |

## Project Structure

```
src/
├── components/
│   ├── layout/      # Header, Sidebar
│   ├── views/       # Page components (Dashboard, Activity, etc.)
│   └── auth/        # LoginScreen
├── contexts/        # React Context (Auth, Toast, HealthData)
├── hooks/          # Custom hooks
├── services/       # Storage service
└── types.ts        # TypeScript types
```

## Deploy

The app is configured for deployment on Google Cloud Run with:

- **tests.yml** - CI on push/PR
- **deploy-dev.yml** - Manual deploy to dev environment
- **deploy-prd.yml** - Auto deploy on tag v*

See [CLAUDE.md](../../.claude/CLAUDE.md) for complete deployment instructions.

## License

Private - All rights reserved