/* ch7-gravitation.js — Multi-body gravity sandbox
   Click to place planets with varying masses. They attract each other
   gravitationally. Force vectors shown. N-body simulation. */

function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'universal-gravitation';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const BODY_COLORS = [
    [0, 255, 255],
    [255, 80, 200],
    [0, 255, 136],
    [255, 220, 50],
    [255, 100, 60],
    [100, 140, 255],
    [200, 100, 255],
    [255, 160, 200],
  ];

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let bodies = [];      // [{ x, y, vx, vy, mass, color, trail }]
    let nextMass = 50;    // mass of next placed body
    let placingBody = false;
    let placeX, placeY;

    function resetSim() {
      bodies = [];
      // Start with two default bodies
      bodies.push({
        x: 0, y: 0, vx: 0, vy: -0.3,
        mass: 200,
        color: BODY_COLORS[0],
        trail: [],
      });
      bodies.push({
        x: 120, y: 0, vx: 0, vy: 1.2,
        mass: 30,
        color: BODY_COLORS[1],
        trail: [],
      });
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      resetSim();
    };

    engine.onReset(resetSim);

    p.mousePressed = () => {
      // Check click is within canvas
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      if (bodies.length >= 8) return; // max bodies

      const G = engine.getParam('gravitationalConstant');
      // Place relative to center
      const bx = p.mouseX - width / 2;
      const by = p.mouseY - height / 2;

      // Give a small tangential velocity for interesting orbits
      const dist = Math.sqrt(bx * bx + by * by) || 1;
      const tangVx = -by / dist * 0.5;
      const tangVy = bx / dist * 0.5;

      bodies.push({
        x: bx, y: by,
        vx: tangVx, vy: tangVy,
        mass: 20 + Math.random() * 60,
        color: BODY_COLORS[bodies.length % BODY_COLORS.length],
        trail: [],
      });
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const G = engine.getParam('gravitationalConstant');

      // Center of canvas
      const cx = width / 2;
      const cy = height / 2;

      // ── Physics: compute forces and integrate ─────────────────────
      if (engine.isPlaying && bodies.length > 0) {
        const dt = (1 / 60) * engine.speed;
        const subSteps = 4;
        const subDt = dt / subSteps;

        for (let s = 0; s < subSteps; s++) {
          // Compute accelerations
          for (let i = 0; i < bodies.length; i++) {
            let ax = 0, ay = 0;
            for (let j = 0; j < bodies.length; j++) {
              if (i === j) continue;
              const dx = bodies[j].x - bodies[i].x;
              const dy = bodies[j].y - bodies[i].y;
              const dist2 = dx * dx + dy * dy;
              const dist = Math.sqrt(dist2);
              const minDist = 10;
              const safeDist = Math.max(dist, minDist);
              const forceMag = G * bodies[i].mass * bodies[j].mass / (safeDist * safeDist);
              ax += (forceMag / bodies[i].mass) * (dx / safeDist);
              ay += (forceMag / bodies[i].mass) * (dy / safeDist);
            }
            bodies[i].vx += ax * subDt;
            bodies[i].vy += ay * subDt;
          }

          // Update positions
          for (const b of bodies) {
            b.x += b.vx * subDt;
            b.y += b.vy * subDt;

            // Store trail
            b.trail.push({ x: b.x, y: b.y });
            if (b.trail.length > 200) b.trail.shift();
          }
        }

        // Remove bodies that are way out of bounds
        bodies = bodies.filter(b => Math.abs(b.x) < 2000 && Math.abs(b.y) < 2000);
      }

      // ── Draw star field background ────────────────────────────────
      p.noStroke();
      p.fill(255, 255, 255, 40);
      p.randomSeed(42);
      for (let i = 0; i < 60; i++) {
        const sx = p.random(width);
        const sy = p.random(height);
        p.ellipse(sx, sy, 1.5, 1.5);
      }
      p.randomSeed(p.millis());

      // ── Draw trails ───────────────────────────────────────────────
      for (const b of bodies) {
        if (b.trail.length < 2) continue;
        p.noFill();
        p.strokeWeight(1.5);
        for (let i = 1; i < b.trail.length; i++) {
          const alpha = (i / b.trail.length) * 120;
          p.stroke(b.color[0], b.color[1], b.color[2], alpha);
          p.line(cx + b.trail[i - 1].x, cy + b.trail[i - 1].y,
                 cx + b.trail[i].x, cy + b.trail[i].y);
        }
      }

      // ── Draw force vectors ────────────────────────────────────────
      for (let i = 0; i < bodies.length; i++) {
        let fx = 0, fy = 0;
        for (let j = 0; j < bodies.length; j++) {
          if (i === j) continue;
          const dx = bodies[j].x - bodies[i].x;
          const dy = bodies[j].y - bodies[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const safeDist = Math.max(dist, 10);
          const forceMag = G * bodies[i].mass * bodies[j].mass / (safeDist * safeDist);
          fx += forceMag * (dx / safeDist);
          fy += forceMag * (dy / safeDist);
        }

        const fLen = Math.sqrt(fx * fx + fy * fy);
        if (fLen > 0.01) {
          const maxArrow = 40;
          const scale = Math.min(maxArrow / fLen, 5);
          const arrowX = fx * scale;
          const arrowY = fy * scale;
          const bpx = cx + bodies[i].x;
          const bpy = cy + bodies[i].y;

          p.stroke(255, 255, 255, 100);
          p.strokeWeight(1.5);
          p.line(bpx, bpy, bpx + arrowX, bpy + arrowY);
          const fa = Math.atan2(arrowY, arrowX);
          p.line(bpx + arrowX, bpy + arrowY,
                 bpx + arrowX - 6 * Math.cos(fa - 0.4), bpy + arrowY - 6 * Math.sin(fa - 0.4));
          p.line(bpx + arrowX, bpy + arrowY,
                 bpx + arrowX - 6 * Math.cos(fa + 0.4), bpy + arrowY - 6 * Math.sin(fa + 0.4));
        }
      }

      // ── Draw bodies ───────────────────────────────────────────────
      for (const b of bodies) {
        const bx = cx + b.x;
        const by = cy + b.y;
        const r = 4 + Math.sqrt(b.mass) * 0.8;

        p.noStroke();
        p.drawingContext.shadowColor = `rgba(${b.color.join(',')}, 0.7)`;
        p.drawingContext.shadowBlur = 20;
        p.fill(b.color[0], b.color[1], b.color[2]);
        p.ellipse(bx, by, r * 2, r * 2);
        p.drawingContext.shadowBlur = 0;

        // Mass label
        p.fill(255, 255, 255, 160);
        p.textSize(9);
        p.textAlign(p.CENTER);
        p.text(b.mass.toFixed(0), bx, by - r - 6);
      }

      // ── Info panel ────────────────────────────────────────────────
      p.fill(10, 10, 26, 200);
      p.noStroke();
      p.rect(10, 10, 260, 70, 6);

      p.fill(255, 255, 255, 200);
      p.textAlign(p.LEFT);
      p.textSize(12);
      p.text(`F = G \u00D7 m\u2081m\u2082 / r\u00B2`, 20, 30);
      p.textSize(11);
      p.fill(255, 255, 255, 140);
      p.text(`G = ${G.toFixed(1)}   |   Bodies: ${bodies.length}/8`, 20, 48);
      p.fill(0, 255, 136, 180);
      p.text('Click canvas to add bodies!', 20, 66);

      // ── Total momentum display ────────────────────────────────────
      let totalPx = 0, totalPy = 0;
      for (const b of bodies) {
        totalPx += b.mass * b.vx;
        totalPy += b.mass * b.vy;
      }
      p.fill(255, 255, 255, 100);
      p.textAlign(p.RIGHT);
      p.textSize(10);
      p.text(`Total p: (${totalPx.toFixed(1)}, ${totalPy.toFixed(1)})`, width - 15, height - 15);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { gravitationalConstant: 3 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'gravitationalConstant', label: 'G (Gravitational Constant)', min: 0.1, max: 10, step: 0.1, value: 3, unit: '' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
