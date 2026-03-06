# ⚛️ Quantum Playground

**An interactive, gamified physics learning platform covering the entire high-school and introductory university physics curriculum.**

Explore 67 topics across 21 chapters — each with an interactive simulation, a short quiz, fun facts, and XP rewards. No login, no server, no build step. Open `index.html` and learn.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎮 **Gamification** | Earn XP for every topic and quiz you complete. Level up from *Physics Rookie* → *Quantum Wizard* |
| 🏆 **Achievements** | 22 unlockable badges for milestones, streaks, and chapter completions |
| 🔥 **Daily Streak** | Track consecutive-day visits to build study momentum |
| 🧪 **Simulations** | Interactive p5.js and Matter.js simulations on every topic page |
| 🧠 **Quizzes** | 3 multiple-choice questions per topic with instant feedback and explanations |
| 💡 **Fun Facts** | 3 curated real-world facts on every topic |
| 🔍 **Search** | Instant full-text search across all 67 topics |
| 🌙 **Dark / Light Theme** | Toggleable theme, persisted across sessions |
| 📱 **Responsive** | Works on desktop and mobile; collapsible sidebar on small screens |
| 💾 **Offline-ready** | All progress stored in `localStorage` — no account or network required |

---

## 🗂️ Curriculum

### Chapter 0 — What Is Physics?
`Scientific Method` · `Units & Measurement` · `Vectors`

### Chapter 1 — Kinematics
`Position, Velocity & Acceleration` · `Motion Graphs` · `Equations of Motion` · `Free Fall`

### Chapter 2 — Projectile & 2D Motion
`Projectile Motion` · `Circular Motion` · `Relative Motion`

### Chapter 3 — Newton's Laws
`Newton's First Law` · `Newton's Second Law` · `Newton's Third Law` · `Free-Body Diagrams`

### Chapter 4 — Work, Energy & Power
`Work & Kinetic Energy` · `Potential Energy` · `Power & Efficiency`

### Chapter 5 — Momentum
`Momentum & Impulse` · `Conservation of Momentum` · `2D Collisions`

### Chapter 6 — Rotation & Torque
`Torque` · `Angular Momentum` · `Gyroscopes`

### Chapter 7 — Gravity & Orbits
`Universal Gravitation` · `Orbital Mechanics` · `Escape Velocity`

### Chapter 8 — Oscillations
`Springs & Hooke's Law` · `Pendulums` · `Resonance`

### Chapter 9 — Waves & Sound
`Wave Properties` · `Standing Waves` · `Superposition` · `Doppler Effect`

### Chapter 10 — Fluid Mechanics
`Pressure & Pascal's Law` · `Buoyancy` · `Bernoulli's Principle`

### Chapter 11 — Thermodynamics
`Heat & Temperature` · `Ideal Gas Law` · `Laws of Thermodynamics` · `Heat Engines`

### Chapter 12 — Electrostatics
`Coulomb's Law` · `Electric Fields` · `Capacitors`

### Chapter 13 — Electric Circuits
`Ohm's Law` · `Series & Parallel Circuits` · `Kirchhoff's Laws`

### Chapter 14 — Magnetism
`Magnetic Fields` · `Magnetic Force on Charges` · `Electromagnets`

### Chapter 15 — Electromagnetic Induction
`Faraday's Law` · `Generators & Transformers` · `AC Circuits`

### Chapter 16 — Electromagnetic Waves
`Maxwell's Equations` · `The EM Spectrum`

### Chapter 17 — Optics
`Reflection & Mirrors` · `Refraction` · `Lenses` · `Wave Optics`

### Chapter 18 — Special Relativity
`Time Dilation` · `Length Contraction` · `E = mc²`

### Chapter 19 — Quantum Mechanics
`Photoelectric Effect` · `Wave-Particle Duality` · `Energy Levels`

### Chapter 20 — Nuclear & Particle Physics
`Radioactive Decay` · `Fission & Fusion` · `The Standard Model`

---

## 🏗️ Project Structure

```
QuantumPlayground/
├── index.html              # Landing page — chapter grid
├── assets/
│   └── favicon.svg
├── css/
│   ├── main.css            # Root stylesheet (imports all partials)
│   ├── variables.css       # CSS custom properties & theming
│   ├── reset.css
│   ├── layout.css
│   ├── components.css
│   ├── simulation.css
│   └── print.css
├── data/
│   ├── chapters.json       # Full curriculum: titles, slugs, fun facts, quizzes, XP
│   └── achievements.json   # Achievement definitions
├── js/
│   ├── app.js              # Boot: fetches data, initialises all modules
│   ├── progress.js         # XP, levels, streaks — localStorage
│   ├── achievements.js     # Achievement unlock logic + toast notifications
│   ├── nav.js              # Sidebar navigation
│   ├── search.js           # Full-text topic search
│   ├── quiz.js             # Quiz renderer + answer scoring
│   ├── fun-facts.js        # Fun-fact card renderer
│   ├── sim-engine.js       # p5.js simulation runner
│   ├── sim-controls.js     # Simulation parameter controls
│   ├── graph.js            # Real-time data graph
│   ├── theme.js            # Dark/light theme toggle
│   └── topics/             # One JS file per topic (ch0-… through ch20-…)
│       ├── ch0-scientific-method.js
│       ├── ch1-free-fall.js
│       └── …  (67 files total)
├── topics/                 # One HTML page per topic
│   ├── projectile-motion.html
│   └── …  (67 files total)
└── libs/
    ├── p5.min.js           # p5.js v1 — canvas-based simulations
    └── matter.min.js       # Matter.js — 2D rigid-body physics engine
```

---

## 🚀 Getting Started

**No install, no build step.** This is a zero-dependency static site.

### Option 1 — Open directly in a browser

> Some browsers block `fetch()` on `file://` URLs (needed to load `chapters.json`).
> Use Option 2 if the chapter cards don't appear.

### Option 2 — Local development server (recommended)

Using Python (built into macOS / Linux):
```bash
cd QuantumPlayground
python3 -m http.server 8080
# Open http://localhost:8080
```

Using Node.js:
```bash
npx serve .
```

Using VS Code: install the **Live Server** extension and click "Go Live".

---

## 🧩 Tech Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Plain CSS with custom properties (no framework) |
| Scripting | Vanilla JavaScript (ES modules, no bundler) |
| Simulations | [p5.js](https://p5js.org/) — creative coding / canvas |
| Physics engine | [Matter.js](https://brm.io/matter-js/) — rigid-body simulation |
| Storage | `localStorage` (progress) · `sessionStorage` n/a |
| Fonts | Google Fonts — Inter + JetBrains Mono |

---

## 🎮 Progression System

| Level | XP Required | Icon |
|---|---|---|
| Physics Rookie | 0 | 🔰 |
| Apprentice | 500 | ⚗️ |
| Scholar | 1,500 | 📚 |
| Master | 3,000 | 🎓 |
| Quantum Wizard | 5,000 | 🧙 |

**XP sources:**
- Complete a topic simulation: **50 XP**
- Answer a quiz question correctly: **XP varies per topic**
- Unlock an achievement: **bonus XP** (50 – 2,000 depending on achievement)

---

## 🏆 Achievements (22 total)

Milestone badges, chapter-completion awards, XP rank badges, streak rewards, and special simulation achievements including *First Orbit*, *Speed of Light*, and *Energy Conserved*.

---

## 📄 License

This project is currently private. All rights reserved.
