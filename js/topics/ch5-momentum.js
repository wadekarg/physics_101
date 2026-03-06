/* ch5-momentum.js — Car crash / Impulse simulation
   Car hits a wall. Crumple zone extends collision time, reducing peak force.
   Shows impulse J = F*dt, force-time curve, and compares rigid vs crumple. */

function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts, RealtimeGraph } = window.QP;

  const slug = 'momentum-impulse';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const COL_CAR    = [0, 200, 255];
  const COL_WALL   = [200, 200, 200];
  const COL_FORCE  = [255, 60, 80];
  const COL_CRUMPLE= [255, 200, 0];

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let carX, carVel, colliding, collisionTimer, crumpleDisp;
    let peakForce, impulse;
    let forceHistory;   // [{t, f}]
    let simTime;
    let crashed;

    function resetSim() {
      const vel = engine.getParam('velocity');
      carX = 100;
      carVel = vel;  // m/s  (pixels: vel * scale)
      colliding = false;
      collisionTimer = 0;
      crumpleDisp = 0;
      peakForce = 0;
      impulse = 0;
      forceHistory = [];
      simTime = 0;
      crashed = false;
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      resetSim();
    };

    engine.onReset(resetSim);

    p.draw = () => {
      p.background(10, 10, 26);

      const mass = engine.getParam('mass');
      const velocity = engine.getParam('velocity');
      const crumpleTime = engine.getParam('crumpleTime');

      const wallX = width - 60;
      const groundY = height - 80;
      const carW = 120;
      const carH = 40;
      const scale = 3;  // pixels per m/s

      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        simTime += dt;

        if (!colliding && !crashed) {
          carX += carVel * scale * dt;

          // Check collision with wall
          if (carX + carW >= wallX) {
            colliding = true;
            collisionTimer = 0;
            carX = wallX - carW;
          }
        }

        if (colliding) {
          collisionTimer += dt;
          // Impulse: J = m * v (change in momentum, assuming stop)
          // Force profile: half-sine over crumpleTime
          const tFrac = collisionTimer / crumpleTime;

          if (tFrac <= 1) {
            // Half-sine force profile
            const fNow = (Math.PI * mass * velocity) / (2 * crumpleTime) * Math.sin(Math.PI * tFrac);
            peakForce = Math.max(peakForce, fNow);
            impulse = mass * velocity * Math.min(tFrac, 1);
            forceHistory.push({ t: simTime, f: fNow });

            // Crumple visual deformation
            crumpleDisp = tFrac * Math.min(crumpleTime * 100, 40);

            // Car decelerates
            carVel = velocity * (1 - tFrac);
          } else {
            colliding = false;
            crashed = true;
            carVel = 0;
            impulse = mass * velocity;
            forceHistory.push({ t: simTime, f: 0 });
          }
        }
      }

      // ── Draw road ─────────────────────────────────────────────────
      p.stroke(60);
      p.strokeWeight(2);
      p.line(0, groundY, width, groundY);
      // Road dashes
      p.stroke(80);
      p.strokeWeight(1);
      for (let dx = 0; dx < width; dx += 40) {
        p.line(dx, groundY + 15, dx + 20, groundY + 15);
      }

      // ── Draw wall ─────────────────────────────────────────────────
      p.noStroke();
      p.fill(COL_WALL[0], COL_WALL[1], COL_WALL[2], 100);
      p.rect(wallX, groundY - 120, 30, 120);
      p.fill(COL_WALL[0], COL_WALL[1], COL_WALL[2], 180);
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 2; col++) {
          const bx = wallX + 2 + col * 14 + (row % 2 === 0 ? 0 : 7);
          const by = groundY - 120 + row * 20 + 2;
          p.rect(bx, by, 12, 18, 1);
        }
      }

      // ── Draw car ──────────────────────────────────────────────────
      const drawCarX = carX;
      const drawCarW = carW - crumpleDisp;
      // Body
      p.noStroke();
      p.drawingContext.shadowColor = `rgba(${COL_CAR.join(',')}, 0.4)`;
      p.drawingContext.shadowBlur = 16;
      p.fill(COL_CAR[0], COL_CAR[1], COL_CAR[2]);
      p.rect(drawCarX, groundY - carH, drawCarW, carH, 4);
      // Cabin
      p.fill(COL_CAR[0], COL_CAR[1], COL_CAR[2], 180);
      p.rect(drawCarX + drawCarW * 0.2, groundY - carH - 22, drawCarW * 0.45, 22, 4, 4, 0, 0);
      p.drawingContext.shadowBlur = 0;
      // Wheels
      p.fill(40);
      p.stroke(80);
      p.strokeWeight(2);
      p.ellipse(drawCarX + 25, groundY, 18, 18);
      p.ellipse(drawCarX + drawCarW - 25, groundY, 18, 18);

      // Crumple zone indicator
      if (crumpleDisp > 2) {
        p.stroke(COL_CRUMPLE[0], COL_CRUMPLE[1], COL_CRUMPLE[2]);
        p.strokeWeight(2);
        const cStart = drawCarX + drawCarW;
        for (let i = 0; i < 4; i++) {
          const zigX = cStart + (crumpleDisp / 4) * i;
          const zigDir = i % 2 === 0 ? -6 : 6;
          p.line(zigX, groundY - carH * 0.3 + zigDir, zigX + crumpleDisp / 4, groundY - carH * 0.3 - zigDir);
        }
      }

      // ── Force-time graph (inline mini-graph) ──────────────────────
      const gx = 30, gy = 20, gw = 250, gh = 100;
      p.fill(10, 10, 26, 200);
      p.noStroke();
      p.rect(gx - 5, gy - 5, gw + 10, gh + 30, 6);

      // Axes
      p.stroke(255, 255, 255, 80);
      p.strokeWeight(1);
      p.line(gx, gy + gh, gx + gw, gy + gh); // x
      p.line(gx, gy, gx, gy + gh);            // y

      p.fill(255, 255, 255, 160);
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.CENTER);
      p.text('Time (s)', gx + gw / 2, gy + gh + 22);
      p.textAlign(p.RIGHT);
      p.text('F (N)', gx - 4, gy + 6);

      // Plot force history
      if (forceHistory.length > 1) {
        const tMin = forceHistory[0].t;
        const tMax = forceHistory[forceHistory.length - 1].t || tMin + 1;
        const fMax = peakForce || 1;
        p.noFill();
        p.stroke(COL_FORCE[0], COL_FORCE[1], COL_FORCE[2]);
        p.strokeWeight(2);
        p.drawingContext.shadowColor = `rgba(${COL_FORCE.join(',')}, 0.6)`;
        p.drawingContext.shadowBlur = 6;
        p.beginShape();
        for (const pt of forceHistory) {
          const px = gx + ((pt.t - tMin) / (tMax - tMin + 0.001)) * gw;
          const py = gy + gh - (pt.f / (fMax * 1.1)) * gh;
          p.vertex(px, py);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      }

      // ── Info panel ────────────────────────────────────────────────
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textAlign(p.LEFT);
      p.textSize(13);
      const ix = 30, iy = height - 55;
      p.text(`Mass: ${mass} kg   |   v\u2080: ${velocity} m/s   |   Crumple \u0394t: ${crumpleTime} s`, ix, iy);
      p.fill(COL_FORCE[0], COL_FORCE[1], COL_FORCE[2]);
      p.text(`Peak Force: ${peakForce.toFixed(0)} N`, ix, iy + 18);
      p.fill(COL_CRUMPLE[0], COL_CRUMPLE[1], COL_CRUMPLE[2]);
      p.text(`Impulse J = ${impulse.toFixed(0)} N\u00B7s   |   J = m\u00B7\u0394v = F\u00B7\u0394t`, ix, iy + 36);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { mass: 1000, velocity: 15, crumpleTime: 0.1 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'mass',        label: 'Car Mass',     min: 500,  max: 2000, step: 50,   value: 1000, unit: 'kg' },
    { name: 'velocity',    label: 'Velocity',     min: 5,    max: 30,   step: 1,    value: 15,   unit: 'm/s' },
    { name: 'crumpleTime', label: 'Crumple Time', min: 0.01, max: 0.5,  step: 0.01, value: 0.1,  unit: 's' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
