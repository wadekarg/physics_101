# 🔬 Physics 101

**An interactive, gamified physics learning platform covering the entire high-school and introductory university physics curriculum.**

🌐 **Live:** [https://wadekarg.github.io/physics_101/](https://wadekarg.github.io/physics_101/)

Explore 73 topics across 23 chapters — each with an interactive simulation, formula card, worked examples, a knowledge check quiz, a challenge lab, and XP rewards. No login, no server, no build step.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎮 **Gamification** | Earn XP for every quiz you complete and challenge you finish. Level up from *Physics Rookie* → *Quantum Wizard* |
| 🏆 **Achievements** | 22 unlockable badges for milestones, streaks, and chapter completions |
| 🔥 **Daily Streak** | Track consecutive-day visits to build study momentum |
| 🧪 **Simulations** | Interactive p5.js and Matter.js simulations on every topic page |
| 📐 **Formula Card** | Collapsible KaTeX-rendered formula sheet with variable tables on every topic |
| ✏️ **Worked Examples** | Step-by-step accordion examples — reveal each step at your own pace |
| 🧠 **Knowledge Check** | 6 MCQ per topic with one-at-a-time Prev/Next navigation, instant feedback, and explanations |
| 🧪 **Challenge Lab** | Real-world multi-part application problems with hints per topic |
| 🗂️ **Summary Card** | Auto-appears after quiz completion showing key formula and score |
| 🔗 **Concept Connections** | Links to prerequisite topics so you never get lost |
| ✅ **Progress Tracking** | Completed topics show a ✓ in the sidebar; chapters badge when fully done |
| 💡 **Fun Facts** | 3 curated real-world facts on every topic |
| 🔍 **Search** | Instant full-text search across all 73 topics |
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
`Wave Properties` · `Superposition` · `Standing Waves` · `Doppler Effect`

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
`Faraday's Law` · `Generators & Transformers` · `AC Circuits` · `Motors & Generators`

### Chapter 16 — Electromagnetic Waves
`Maxwell's Equations` · `The EM Spectrum`

### Chapter 17 — Optics
`Reflection & Mirrors` · `Refraction` · `Lenses` · `Wave Optics`

### Chapter 18 — Special Relativity
`Time Dilation` · `Length Contraction` · `E = mc²`

### Chapter 19 — Quantum Mechanics
`Photoelectric Effect` · `Wave-Particle Duality` · `Energy Levels` · `Atomic Models`

### Chapter 20 — Nuclear & Particle Physics
`Radioactive Decay` · `Fission & Fusion` · `The Standard Model` · `Nuclear Physics`

### Chapter 21 — Semiconductors & Electronics
`Semiconductors` · `P-N Junction` · `Transistors`

### Chapter 22 — Communication Technology
`Modulation` · `Wave Propagation` · `Digital Communication`

---

## 🏗️ Project Structure

```
physics_101/
├── index.html                  # Landing page — chapter grid
├── assets/
│   └── favicon.svg
├── css/
│   ├── main.css                # Root stylesheet (imports all partials)
│   ├── variables.css           # CSS custom properties & theming
│   ├── reset.css
│   ├── layout.css
│   ├── components.css
│   ├── features.css            # Formula card, worked examples, challenge lab, summary card
│   ├── simulation.css
│   └── print.css
├── data/
│   ├── chapters.json           # Curriculum: titles, slugs, fun facts, quizzes (6 per topic)
│   ├── topic-extras.json       # Formula cards, worked examples, challenge labs, connections
│   └── achievements.json       # Achievement definitions
├── js/
│   ├── app.js                  # Boot: fetches data, initialises modules, injects feature sections
│   ├── progress.js             # XP, levels, streaks — localStorage
│   ├── achievements.js         # Achievement unlock logic + toast notifications
│   ├── nav.js                  # Sidebar navigation with completion checkmarks
│   ├── search.js               # Full-text topic search
│   ├── quiz.js                 # One-at-a-time quiz with Prev/Next navigation
│   ├── fun-facts.js            # Fun-fact card renderer
│   ├── formula-card.js         # Collapsible KaTeX formula sheet
│   ├── worked-examples.js      # Step-by-step accordion examples
│   ├── concept-connections.js  # Prerequisite topic links
│   ├── sim-challenges.js       # Challenge lab (honor-system completion + XP)
│   ├── summary-card.js         # Post-quiz summary card
│   ├── sim-engine.js           # p5.js simulation runner
│   ├── sim-controls.js         # Simulation parameter controls
│   ├── graph.js                # Real-time data graph
│   ├── theme.js                # Dark/light theme toggle
│   └── topics/                 # One JS file per topic (73 files)
├── topics/                     # One HTML page per topic (73 files)
└── libs/
    ├── p5.min.js               # p5.js v1 — canvas-based simulations
    └── matter.min.js           # Matter.js — 2D rigid-body physics engine
```

---

## 🚀 Getting Started

**Option 1 — Use the live site (no setup):**
Visit [https://wadekarg.github.io/physics_101/](https://wadekarg.github.io/physics_101/) in any browser.

**Option 2 — Run locally:**

> Some browsers block `fetch()` on `file://` URLs (needed to load JSON data files).
> Use a local server if the chapter cards don't appear.

**Python (built into macOS / Linux):**
```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

**Node.js:**
```bash
npx serve .
```

**VS Code:** install the **Live Server** extension and click "Go Live".

---

## 🧩 Tech Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Plain CSS with custom properties (no framework) |
| Scripting | Vanilla JavaScript (ES modules, no bundler) |
| Simulations | [p5.js](https://p5js.org/) — creative coding / canvas |
| Physics engine | [Matter.js](https://brm.io/matter-js/) — rigid-body simulation |
| Formula rendering | [KaTeX](https://katex.org/) — loaded dynamically on topic pages |
| Storage | `localStorage` — all progress persisted client-side |
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
- Answer a quiz question correctly: **25 XP**
- Complete a topic (finish the quiz): **50 XP bonus**
- Complete a Challenge Lab: **75 XP** (varies per topic)
- Unlock an achievement: **50 – 2,000 XP** depending on the badge

---

## 🏆 Achievements (22 total)

Milestone badges, chapter-completion awards, XP rank badges, streak rewards, and special simulation achievements including *First Orbit*, *Speed of Light*, and *Energy Conserved*.

---

## 📄 License

MIT — open source, free to use and adapt.
