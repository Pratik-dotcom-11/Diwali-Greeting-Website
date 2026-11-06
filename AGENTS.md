# Project Guidelines: Diwali Digital Diya 🪔

## Overview
**Diwali Digital Diya** is a festive, interactive web application celebrating the festival of lights. Originally created by team **Nexora** (Pratik Ghosh and Samragnyi Bhowmick), this project delivers an engaging, culturally rich experience featuring digital diya lighting, interactive rangoli art canvas, personalized greeting card creator with image generation and sharing, procedural background festive melody synthesis, and sky fireworks.

## Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS with CSS variables, keyframe animations, responsive grid & flexbox layouts, Google Fonts (`DM Sans`, `Playfair Display`)
- **Graphics**: HTML5 `<canvas>` (interactive rangoli canvas & procedural particle fireworks engine)
- **Audio**: Web Audio API (real-time synthesized traditional melodic chime synthesizer)
- **Runtime**: Node.js 22

## Project Structure
```
├── public/                 # Static assets, icons, and media
├── src/
│   └── app/
│       ├── globals.css     # Global styles, festive color tokens, keyframe animations
│       ├── layout.tsx      # Root layout, HTML meta tags, theme color, viewport
│       └── page.tsx        # Main application component & festive interactivity
├── .gitignore              # Ignored files (node_modules, .next, etc.)
├── AGENTS.md               # AI agent instructions and codebase specifications
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration (standalone output)
├── package.json            # Project dependencies and npm scripts
├── package-lock.json       # Deterministic package lockfile
├── README.md               # Project documentation and guide
└── tsconfig.json           # TypeScript configuration
```

## Key Features & Interactive Mechanics
1. **Interactive Diya Lighting (`#diya`)**:
   - 10 clickable diyas with animated flickering flames, embers, and halo glow.
   - Dynamic counter ("X of 10 diyas glowing").
   - Triggers celebratory fireworks when all 10 diyas are lit.
   - "Light all diyas" and "Start again" bulk actions.

2. **Personalized Diwali Wish Generator (`#greeting`)**:
   - Sender and recipient customizable inputs.
   - 5 curated wish presets (Warm, Family, Friends, Formal, Short).
   - Live character counter (max 240 chars).
   - 4 card style variants (Wine, Rose, Blue, Amber).
   - Dynamic canvas-rendered card download & share sheet (WhatsApp, Instagram, Facebook, Native Web Share API, Clipboard).

3. **Digital Rangoli Canvas (`#rangoli`)**:
   - 500x500 smooth pointer drawing surface.
   - 4 festive geometric guide patterns (Mandala, Lotus, Flower, Diamond).
   - 10 vibrant Diwali powder color swatches.
   - Brush size range slider and toggleable eraser tool.
   - Direct PNG export ("Download my rangoli").

4. **Celebration Sky Fireworks**:
   - Procedural particle fireworks launcher with multi-colored bursts, velocity decay, and physics.
   - Opening introductory sequence with "Shubh Deepavali" greeting.

5. **Festive Background Melody**:
   - Browser Web Audio API sine wave oscillator playing a cyclical festive scale.
   - One-touch toggle control ("♫ Music: On / Off").

6. **Animated Marquees & Cross Ribbons**:
   - "Happy Diwali" multilingual ribbon translated into Hindi, Bengali, Tamil, Gujarati, Telugu, Punjabi, Malayalam, and Kannada.
   - Nexora brand marquee honoring creators Pratik Ghosh and Samragnyi Bhowmick.

7. **Performance & Device Adaptive Mode ("Lite Mode")**:
   - Automatically detects low-power hardware (device memory, concurrency, reduced data) or low frame rate (<38 FPS) and scales back heavy shadow/blur effects for smooth performance on all devices.

## Development Commands
- `npm run dev`: Starts the Next.js development server on `http://0.0.0.0:3000`.
- `npm run build`: Builds the production standalone bundle.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint checks.

## Coding Conventions
- Maintain the exact festive visual aesthetic, colors, typography, and interactive behaviors without regressions.
- Keep components modular, accessible (`aria-label`, `aria-pressed`, `aria-hidden`), and responsive across all device sizes.
- Preserve creator credits to Nexora (Pratik Ghosh & Samragnyi Bhowmick).
