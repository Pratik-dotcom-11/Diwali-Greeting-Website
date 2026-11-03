# 🪔 Diwali Digital Diya

A festive, animated Diwali greeting website — light diyas, draw rangoli, create a personalised wish card and set off fireworks.
Built with plain **HTML, CSS and JavaScript** (no frameworks, no build step) by team **Nexora**.

## ✨ Features
- **Opening firework show** with a "Shubh Deepavali" greeting (tap anywhere for extra rockets)
- **Personalised greeting** with live preview, WhatsApp share and copy
- **Photo greeting card** — upload a photo, add a message, download as PNG or share
- **10 interactive diyas** with glow, embers and a fireworks finale when all are lit
- **Rangoli canvas** with colours, brush size and PNG download
- **Fireworks button**, festive background music (generated in the browser)
- **Marquees** — Nexora names band and crossing "Happy Diwali" ribbons in many Indian languages (speed reacts to scrolling)
- **Scroll animations** — every section enters with its own animation
- **Team section** — Nexora, Pratik Ghosh and Samragyni Bhowmick
- Mobile-first, responsive, respects `prefers-reduced-motion`

## ⚡ Performance
The site detects weak devices (≤4 CPU cores, ≤4 GB memory, data-saver) and measures its own frame rate; if it struggles it switches to **lite mode** (lighter effects, same features).
Force a mode with a URL flag: `index.html?fx=lite` or `index.html?fx=full`.

## 📁 Project structure
```
Diwali-Greeting-Website/
├── index.html      # page markup + early device detection
├── css/
│   └── style.css   # all styles, animations, lite-mode rules
├── js/
│   └── script.js   # greeting, photo card, diyas, rangoli, music, fireworks, animations, performance controller
└── README.md
```

## ▶️ Run locally
Open `index.html` in any modern browser — no install needed.

## 🌐 Deploy (GitHub Pages)
Repo **Settings → Pages → Deploy from a branch → `main` / root**. The site is served from `index.html`.

## 👥 Credits
Crafted by **Nexora** — Pratik Ghosh & Samragyni Bhowmick.
