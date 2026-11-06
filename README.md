# 🪔 Diwali Digital Diya

A festive, animated Diwali greeting website — light diyas, draw rangoli, create a personalised wish card and set off fireworks.
Built with **Next.js, React & TypeScript** by team **Nexora**.

## ✨ Features
- **Opening firework show** with a "Shubh Deepavali" greeting (tap anywhere for extra rockets)
- **Personalised greeting** with live preview, card styles, WhatsApp share and copy
- **10 interactive diyas** with glow, embers and a fireworks finale when all are lit
- **Rangoli canvas** with patterns, colours, brush size, eraser and PNG download
- **Fireworks button**, festive background music (synthesized in the browser)
- **Marquees** — Nexora names band and crossing "Happy Diwali" ribbons in many Indian languages (speed reacts to scrolling)
- **Scroll animations** — every section enters with its own animation
- **Team section** — Nexora, Pratik Ghosh and Samragnyi Bhowmick
- Mobile-first, responsive, respects `prefers-reduced-motion`

## ⚡ Performance
The site detects weak devices (≤4 CPU cores, ≤4 GB memory, data-saver) and measures its own frame rate; if it struggles it switches to **lite mode** (lighter effects, same features).
Force a mode with a URL flag: `?fx=lite` or `?fx=full`.

## 📁 Project structure
```
├── public/                 # Static assets, icons, and media
├── src/
│   └── app/
│       ├── globals.css     # Festive styles, animations, lite-mode rules
│       ├── layout.tsx      # Root layout, HTML meta tags & early device detection
│       └── page.tsx        # Greeting, diyas, rangoli, music, fireworks & team
├── .gitignore              # Git ignored files
├── AGENTS.md               # Agent guidelines and codebase specifications
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Scripts & dependencies
├── package-lock.json       # Deterministic package lockfile
├── README.md               # Project documentation
└── tsconfig.json           # TypeScript configuration
```

## ▶️ Run locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 Credits
Crafted with light by **Nexora** — Pratik Ghosh & Samragnyi Bhowmick.
