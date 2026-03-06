/* ch4-power.js — Power & Efficiency simulation
   Two engines lifting weights side by side. One is more powerful.
   Shows work done over time, displays P = W/t. Efficiency comparison. */

function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'power-efficiency';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const COL_ENGINE1 = [0, 255, 255];   // cyan  — powerful
  const COL_ENGINE2 = [255, 100, 60];  // orange — weaker
  const COL_WORK    = [0, 255, 136];
  const COL_POWER   = [255, 0, 200];

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time, liftY1, liftY2;
    const maxLift = 260;         // max pixels the weight can rise
    const floorY = 360;
    const efficiency1 = 0.9;     // engine 1 — 90 % efficient
    const efficiency2 = 0.55;    // engine 2 — 55 % efficient

    function resetSim() {
      time = 0;
      liftY1 = 0;
      liftY2 = 0;
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

      const force = engine.getParam('force');
      const totalTime = engine.getParam('time');

      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        time += dt;
      }

      // Time fraction [0..1]
      const frac = Math.min(time / totalTime, 1);

      // Engine 1: lifts at constant power over the full time (powerful)
      // Engine 2: lifts the same weight, same distance, but takes 1.8x longer
      const power1 = (force * maxLift * 0.01) / totalTime;         // W = Fd, P = W/t
      const power2 = (force * maxLift * 0.01) / (totalTime * 1.8);

      liftY1 = frac * maxLift;
      liftY2 = Math.min(frac / 1.8, 1) * maxLift;

      const work1 = force * liftY1 * 0.01;
      const work2 = force * liftY2 * 0.01;
      const disp1 = power1 * Math.min(time, totalTime);
      const disp2 = power2 * Math.min(time, totalTime * 1.8);

      // ── Draw floor ────────────────────────────────────────────────
      p.stroke(60);
      p.strokeWeight(2);
      p.line(0, floorY, width, floorY);

      // ── Helper: draw engine block ─────────────────────────────────
      function drawEngine(cx, liftPx, col, label, eff) {
        // Cable
        p.stroke(col[0], col[1], col[2], 120);
        p.strokeWeight(2);
        p.line(cx, 50, cx, floorY - liftPx - 30);

        // Weight block
        const wy = floorY - liftPx - 30;
        p.noStroke();
        p.drawingContext.shadowColor = `rgba(${col.join(',')}, 0.5)`;
        p.drawingContext.shadowBlur = 14;
        p.fill(col[0], col[1], col[2]);
        p.rectMode(p.CENTER);
        p.rect(cx, wy, 50, 30, 4);
        p.drawingContext.shadowBlur = 0;

        // Mass label on block
        p.fill(10, 10, 26);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(12);
        p.text(force + ' N', cx, wy);

        // Pulley / motor at top
        p.fill(col[0], col[1], col[2], 80);
        p.stroke(col[0], col[1], col[2]);
        p.strokeWeight(2);
        p.ellipse(cx, 50, 24, 24);

        // Label
        p.noStroke();
        p.fill(col[0], col[1], col[2]);
        p.textSize(14);
        p.text(label, cx, 24);

        // Efficiency badge
        p.textSize(11);
        p.fill(255, 255, 255, 170);
        p.text(`Eff: ${(eff * 100).toFixed(0)}%`, cx, floorY + 34);

        p.rectMode(p.CORNER);
      }

      // ── Draw two engines ──────────────────────────────────────────
      const cx1 = width * 0.25;
      const cx2 = width * 0.55;
      drawEngine(cx1, liftY1, COL_ENGINE1, 'Engine A (High P)', efficiency1);
      drawEngine(cx2, liftY2, COL_ENGINE2, 'Engine B (Low P)', efficiency2);

      // ── Work / Power readouts ─────────────────────────────────────
      const panelX = width - 180;
      p.fill(255, 255, 255, 30);
      p.noStroke();
      p.rect(panelX - 10, 10, 180, 160, 8);

      p.textAlign(p.LEFT);
      p.textSize(12);
      let py = 28;

      p.fill(COL_ENGINE1[0], COL_ENGINE1[1], COL_ENGINE1[2]);
      p.text('Engine A', panelX, py); py += 18;
      p.fill(255, 255, 255, 200);
      p.text(`Work: ${work1.toFixed(1)} J`, panelX, py); py += 16;
      p.text(`Power: ${(work1 / Math.max(time, 0.01)).toFixed(1)} W`, panelX, py); py += 22;

      p.fill(COL_ENGINE2[0], COL_ENGINE2[1], COL_ENGINE2[2]);
      p.text('Engine B', panelX, py); py += 18;
      p.fill(255, 255, 255, 200);
      p.text(`Work: ${work2.toFixed(1)} J`, panelX, py); py += 16;
      p.text(`Power: ${(work2 / Math.max(time, 0.01)).toFixed(1)} W`, panelX, py); py += 22;

      p.fill(COL_POWER[0], COL_POWER[1], COL_POWER[2]);
      p.textSize(11);
      p.text(`P = W / t`, panelX, py);

      // ── Time bar ──────────────────────────────────────────────────
      p.fill(255, 255, 255, 140);
      p.textAlign(p.CENTER);
      p.textSize(12);
      p.text(`Time: ${time.toFixed(2)} s`, width / 2, floorY + 18);

      // Progress bar
      const barW = 200;
      const barH = 6;
      const barX = width / 2 - barW / 2;
      const barY = floorY + 50;
      p.noStroke();
      p.fill(255, 255, 255, 30);
      p.rect(barX, barY, barW, barH, 3);
      p.fill(COL_WORK[0], COL_WORK[1], COL_WORK[2]);
      p.drawingContext.shadowColor = `rgba(${COL_WORK.join(',')}, 0.6)`;
      p.drawingContext.shadowBlur = 6;
      p.rect(barX, barY, barW * frac, barH, 3);
      p.drawingContext.shadowBlur = 0;
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { force: 80, time: 4 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'force', label: 'Force', min: 10, max: 200, step: 5,   value: 80, unit: 'N' },
    { name: 'time',  label: 'Time',  min: 1,  max: 10,  step: 0.5, value: 4,  unit: 's' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
