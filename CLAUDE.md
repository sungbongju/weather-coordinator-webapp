# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WeatherFit (WeatherCoordi) — a weather-based outfit recommendation web app targeting Korean users. Real-time weather data drives clothing recommendations displayed as flat illustrations with witty Korean one-liner comments. See PROJECT_PLAN.md for full specification.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-first `@theme` in globals.css)
- **State Management**: Zustand
- **Weather Data**: Google Weather API (server-side only)
- **Deployment**: Vercel

## Build & Dev Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (watch mode)
npm run test:run     # Vitest single run
```

## Architecture

### Data Flow
```
Browser Geolocation → /api/weather (Next.js API route, adds API key) → Google Weather API
                                         ↓
                            outfitEngine(weatherData) → recommendation
                                         ↓
                              UI components render outfit
```

### Outfit Recommendation Engine (`src/lib/outfitEngine.ts`)
The core algorithm follows 4 steps:
1. **Classify temperature level** from feels-like temp (7 levels: FREEZING ≤-5°C through SCORCHING 28°C+)
2. **Select base outfit** (outer/top/bottom/shoes) for that temperature level
3. **Apply condition modifiers** — rain (>50% precip), UV (≥6), wind (>30km/h), large daily temp gap (≥10°C), poor air quality (AQI >100)
4. **Generate one-liner comment** from template pool per temperature level

### API Proxy Pattern
Google Weather API key must stay server-side. Clients call `/api/weather?lat=X&lng=Y`, the API route adds the key and proxies the request. Caching: current weather 10min, forecast 30min.

### Key Files
| Path | Role |
|------|------|
| `src/lib/outfitEngine.ts` | Core weather→outfit recommendation algorithm |
| `src/lib/clothingData.ts` | Static clothing item database (~50 items, 5 categories) |
| `src/lib/comments.ts` | Korean one-liner comment templates per temperature level |
| `src/lib/weather.ts` | Google Weather API fetch wrappers |
| `src/app/api/weather/route.ts` | API proxy — protects API key from client exposure |
| `src/store/weatherStore.ts` | Zustand global state |
| `src/hooks/useWeather.ts` | Weather data fetching hook |
| `src/hooks/useGeolocation.ts` | Browser geolocation with Seoul fallback |
| `src/types/weather.ts` | Weather data types |
| `src/types/outfit.ts` | ClothingItem, OutfitRecommendation, TempLevel, Category types |

## Conventions

- **Components**: PascalCase filenames (`WeatherCard.tsx`)
- **Utils/Hooks**: camelCase filenames (`useWeather.ts`, `outfitEngine.ts`)
- **Types**: Separate files in `src/types/`
- **Korean comments** are acceptable throughout the codebase
- **Fonts**: Pretendard (Korean) + Inter (English)
- **Assets**: Flat illustration WebP files in `public/assets/clothing/{outer,top,bottom,shoes,accessory}/`

## Environment Variables

```bash
# .env.local (required)
GOOGLE_WEATHER_API_KEY=your_key_here

# Optional
CLAUDE_API_KEY=xxx  # For AI-generated comments
```

## Testing (TDD)

- **Framework**: Vitest + React Testing Library
- **Config**: `vitest.config.mts`, `vitest.setup.ts`
- **Pattern**: Test files in `__tests__/` directories adjacent to source
- **Fixtures**: `src/__tests__/fixtures/weatherData.ts` — shared mock data
- **TDD workflow**: Write failing test → implement → verify → refactor
- 73 tests covering hooks, store, API route, components, engine

## Design System

- **Style**: Glassmorphism + Pastel colors
- **Theme**: Defined in `src/app/globals.css` via Tailwind v4 `@theme inline`
- **Glass utilities**: `.glass`, `.glass-card`, `.glass-card-heavy`, `.glass-button`
- **Weather gradients**: `.bg-weather-sunny`, `.bg-temp-freezing` etc (CSS custom properties)
- **UI components**: `src/components/ui/GlassCard.tsx` — reusable glass card (variant: light/medium/heavy)
- **cn() utility**: `src/lib/cn.ts` — clsx + tailwind-merge

## Important Constraints

- Geolocation denied → default to Seoul (37.5665, 126.9780)
- Google Weather API key: server-side only, never expose to client
- Mobile-first responsive design (primary breakpoint: 640px)
- Animations: framer-motion for complex orchestrations, CSS keyframes for continuous animations
