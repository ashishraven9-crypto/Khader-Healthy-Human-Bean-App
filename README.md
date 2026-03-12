# Healthy Human Bean

A comprehensive, modern health and wellness platform built with React 19, TypeScript, Tailwind CSS 4, and shadcn/ui. This application provides intelligent health assessment tools, wellness tracking, and medical information in a beautifully designed organic wellness interface.

## Features

### Core Pages

| Page | Description |
|------|-------------|
| **Home** | Hero section with animated counters, feature cards, wellness areas grid, "How It Works" steps, testimonials, and CTA |
| **Symptom Checker** | 5-step intelligent health triage questionnaire with age, gender, symptom selection, severity, and duration analysis |
| **Health Dashboard** | Interactive charts (Recharts) showing health scores, daily steps, calories, sleep patterns, vitals, and wellness metrics |
| **Wellness Tools** | BMI Calculator (metric/imperial), Hydration Tracker with circular progress, Sleep Quality Assessment, Calorie Estimator, Heart Rate Zone Calculator |
| **Emergency Services** | Emergency contacts, first aid guides, crisis helplines, and poison control information |
| **Health Library** | Searchable medical knowledge base with categorized articles on nutrition, fitness, mental health, and prevention |
| **Health Risk Assessment** | 4-step comprehensive multi-factor risk analysis across cardiovascular, mental health, nutrition, and fitness domains |

### Design

The application follows an **Organic Wellness** design philosophy combining Biophilic Design with Scandinavian Minimalism:

- **Typography:** DM Serif Display (headings) + DM Sans (body)
- **Color Palette:** Warm cream backgrounds, forest sage green primary, terracotta accents, organic earth tones
- **Animations:** Spring-based transitions with Framer Motion
- **Dark/Light Mode:** Full theme switching support
- **Responsive:** Mobile-first design with floating pill navigation

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **Routing:** Wouter (lightweight client-side routing)
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Build Tool:** Vite 7

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm check
```

## Project Structure

```
client/
  src/
    pages/          # Page components (Home, SymptomChecker, etc.)
    components/     # Reusable UI components (Layout, shadcn/ui)
    contexts/       # React contexts (ThemeContext)
    hooks/          # Custom hooks (useMobile, useComposition)
    lib/            # Utility helpers
    App.tsx         # Routes & layout
    index.css       # Global styles & theme tokens
server/             # Express server for production
shared/             # Shared constants
```

## License

MIT

---

Built with care by Khader
