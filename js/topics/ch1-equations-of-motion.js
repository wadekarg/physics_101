// Chapter 1: Equations of Motion — Kinematic Equations Visualizer
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'equations-of-motion';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    let simTime = 0;
    let running = false;
    let trail = [];

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 500;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    function getKinematics(v0, a, t) {
      const v = v0 + a * t;
      const s = v0 * t + 0.5 * a * t * t;
      const v2 = v0 * v0 + 2 * a * s;
      return { v, s, v2 };
    }

    p.draw = () => {
      p.background(10, 10, 26);
      const v0 = engine.getParam('initialVelocity');
      const a = engine.getParam('acceleration');
      const tMax = engine.getParam('time');

      // Physics update
      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        simTime += dt;
        if (simTime > tMax) {
          simTime = 0;
          trail = [];
        }
      }

      const kin = getKinematics(v0, a, simTime);
      const kinFinal = getKinematics(v0, a, tMax);

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Equations of Motion', width / 2, 8);

      // === Track area ===
      const trackY = 80;
      const trackH = 80;
      const trackX = 40;
      const trackW = width - 80;

      p.fill(15, 15, 30);
      p.stroke(40, 40, 70);
      p.strokeWeight(1);
      p.rect(trackX, trackY, trackW, trackH, 8);

      // Scale: fit max displacement in track
      const maxDisp = Math.abs(kinFinal.s);
      const pixPerMeter = maxDisp > 0 ? (trackW - 60) / (maxDisp * 1.2) : 10;
      const objX = trackX + 30 + kin.s * pixPerMeter;
      const objY = trackY + trackH / 2;

      // Position ticks
      for (let m = 0; m <= maxDisp * 1.2; m += Math.max(1, Math.ceil(maxDisp / 10))) {
        const tx = trackX + 30 + m * pixPerMeter;
        if (tx > trackX + trackW - 5) break;
        p.stroke(50, 50, 70);
        p.strokeWeight(1);
        p.line(tx, trackY + trackH - 2, tx, trackY + trackH + 4);
        p.noStroke();
        p.fill(80, 80, 110);
        p.textSize(8);
        p.textAlign(p.CENTER, p.TOP);
        p.text(m + 'm', tx, trackY + trackH + 6);
      }

      // Trail dots at equal time intervals
      trail.push({ x: objX, y: objY });
      if (trail.length > 200) trail.shift();

      for (let i = 0; i < trail.length; i++) {
        const alpha = (i / trail.length) * 150;
        p.noStroke();
        p.fill(0, 180, 216, alpha);
        p.ellipse(trail[i].x, trail[i].y, 5, 5);
      }

      // Object (ball)
      p.drawingContext.shadowBlur = 20;
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(0, 180, 216);
      p.noStroke();
      p.ellipse(p.constrain(objX, trackX + 15, trackX + trackW - 15), objY, 24, 24);
      p.drawingContext.shadowBlur = 0;

      // Velocity arrow
      const vArrow = p.constrain(kin.v * 3, -60, 60);
      if (Math.abs(vArrow) > 2) {
        p.stroke(0, 255, 136);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = '#00ff88';
        const ax = p.constrain(objX, trackX + 15, trackX + trackW - 15);
        p.line(ax, objY - 20, ax + vArrow, objY - 20);
        const d = vArrow > 0 ? -1 : 1;
        p.line(ax + vArrow, objY - 20, ax + vArrow + d * 6, objY - 25);
        p.line(ax + vArrow, objY - 20, ax + vArrow + d * 6, objY - 15);
        p.drawingContext.shadowBlur = 0;
      }

      // === Equations panel ===
      const eqY = trackY + trackH + 30;
      const eqH = 200;
      p.fill(15, 15, 35, 240);
      p.stroke(139, 92, 246, 80);
      p.strokeWeight(1);
      p.rect(20, eqY, width - 40, eqH, 10);

      p.noStroke();
      p.fill(139, 92, 246);
      p.textSize(13);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Kinematic Equations', 35, eqY + 8);

      const equations = [
        { eq: 'v = v\u2080 + at', known: ['v\u2080', 'a', 't'], result: 'v = ' + kin.v.toFixed(2) + ' m/s', highlight: true },
        { eq: 's = v\u2080t + \u00BDat\u00B2', known: ['v\u2080', 'a', 't'], result: 's = ' + kin.s.toFixed(2) + ' m', highlight: true },
        { eq: 'v\u00B2 = v\u2080\u00B2 + 2as', known: ['v\u2080', 'a', 's'], result: 'v\u00B2 = ' + kin.v2.toFixed(2) + ' m\u00B2/s\u00B2', highlight: true },
        { eq: 's = \u00BD(v\u2080 + v)t', known: ['v\u2080', 'v', 't'], result: 's = ' + (0.5 * (v0 + kin.v) * simTime).toFixed(2) + ' m', highlight: true },
        { eq: 's = vt - \u00BDat\u00B2', known: ['v', 'a', 't'], result: 's = ' + (kin.v * simTime - 0.5 * a * simTime * simTime).toFixed(2) + ' m', highlight: true }
      ];

      equations.forEach((eq, i) => {
        const ey = eqY + 30 + i * 32;
        const col = eq.highlight ? p.color(0, 255, 136, 220) : p.color(150, 150, 170);

        // Equation
        p.fill(col);
        p.textSize(12);
        p.textAlign(p.LEFT, p.TOP);
        p.text((i + 1) + '.  ' + eq.eq, 40, ey);

        // Known variables
        p.fill(0, 180, 216, 180);
        p.textSize(10);
        p.text('Known: ' + eq.known.join(', '), 250, ey + 1);

        // Result
        p.fill(255, 200, 50);
        p.textSize(11);
        p.textAlign(p.LEFT, p.TOP);
        p.text(eq.result, 420, ey);
      });

      // === Current values display ===
      const valY = eqY + eqH + 15;
      p.fill(15, 15, 35, 240);
      p.stroke(0, 180, 216, 80);
      p.strokeWeight(1);
      p.rect(20, valY, width - 40, 55, 10);

      p.noStroke();
      const vals = [
        { label: 'v\u2080', val: v0.toFixed(1), unit: 'm/s', color: '#00b4d8' },
        { label: 'a', val: a.toFixed(1), unit: 'm/s\u00B2', color: '#ff6464' },
        { label: 't', val: simTime.toFixed(2), unit: 's', color: '#ffaa00' },
        { label: 'v', val: kin.v.toFixed(2), unit: 'm/s', color: '#00ff88' },
        { label: 's', val: kin.s.toFixed(2), unit: 'm', color: '#8b5cf6' }
      ];

      const vw = (width - 80) / vals.length;
      vals.forEach((v, i) => {
        const vx = 40 + i * vw;
        p.fill(v.color);
        p.textSize(12);
        p.textAlign(p.CENTER, p.TOP);
        p.text(v.label, vx + vw / 2, valY + 8);
        p.fill(255, 255, 255, 220);
        p.textSize(14);
        p.text(v.val, vx + vw / 2, valY + 24);
        p.fill(100, 100, 130);
        p.textSize(9);
        p.text(v.unit, vx + vw / 2, valY + 42);
      });

      // Time progress bar
      const barY = 50;
      p.fill(30, 30, 50);
      p.noStroke();
      p.rect(40, barY, width - 80, 10, 5);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#ffaa00';
      p.fill(255, 170, 0);
      p.rect(40, barY, (width - 80) * (simTime / tMax), 10, 5);
      p.drawingContext.shadowBlur = 0;

      p.fill(200, 200, 220);
      p.textSize(10);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('t = ' + simTime.toFixed(2) + ' / ' + tMax.toFixed(1) + ' s', 40, barY + 20);
    };

    p.mousePressed = () => {
      if (p.mouseX >= 0 && p.mouseX <= width && p.mouseY >= 0 && p.mouseY <= height) {
        simTime = 0;
        trail = [];
      }
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { initialVelocity: 5, acceleration: 2, time: 5 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'initialVelocity', label: 'Initial Velocity (v\u2080)', min: 0, max: 20, step: 0.5, value: 5, unit: 'm/s' },
    { name: 'acceleration', label: 'Acceleration (a)', min: 0, max: 10, step: 0.5, value: 2, unit: 'm/s\u00B2' },
    { name: 'time', label: 'Total Time', min: 1, max: 10, step: 0.5, value: 5, unit: 's' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);

  // ── Beat the Sim ────────────────────────────────────────────────────
  const simEl = document.getElementById('simulation');
  if (simEl) {
    const TARGETS = [50, 75, 100, 120, 150];
    let targetIdx = 0;
    let attempts  = 0;
    let best      = null;

    const beatDiv = document.createElement('div');
    beatDiv.className = 'beat-sim';
    simEl.appendChild(beatDiv);

    function getTarget() { return TARGETS[targetIdx % TARGETS.length]; }

    function renderBeat() {
      const target = getTarget();
      beatDiv.innerHTML = `
        <div class="beat-sim__header">🎯 Beat the Sim</div>
        <div class="beat-sim__target">
          Hit a displacement of exactly <strong>${target} m</strong>.<br>
          Adjust the sliders above, then launch!
        </div>
        <div class="beat-sim__actions">
          <button class="btn beat-launch-btn">🚀 Launch!</button>
          <button class="btn beat-new-btn">New Target</button>
        </div>
        <div class="beat-sim__result" aria-live="polite"></div>
        <div class="beat-sim__meta">${attempts > 0 ? `Attempts: ${attempts}${best !== null ? ' · Best diff: ' + best.toFixed(1) + ' m' : ''}` : ''}</div>
      `;

      beatDiv.querySelector('.beat-launch-btn').addEventListener('click', () => {
        const v0 = engine.getParam('initialVelocity');
        const a  = engine.getParam('acceleration');
        const t  = engine.getParam('time');
        const s  = v0 * t + 0.5 * a * t * t;
        const diff = Math.abs(s - target);
        attempts++;
        if (best === null || diff < best) best = diff;

        engine.play();

        const resultEl = beatDiv.querySelector('.beat-sim__result');
        const metaEl   = beatDiv.querySelector('.beat-sim__meta');

        if (diff < 1) {
          resultEl.textContent = `🎉 BULLSEYE! You hit ${s.toFixed(1)} m — only ${diff.toFixed(2)} m off!`;
          resultEl.className   = 'beat-sim__result beat-sim__result--win';
        } else if (diff < 5) {
          resultEl.textContent = `⭐ So close! Got ${s.toFixed(1)} m (${diff.toFixed(1)} m off target)`;
          resultEl.className   = 'beat-sim__result beat-sim__result--close';
        } else if (s < target) {
          resultEl.textContent = `📏 ${diff.toFixed(1)} m short (got ${s.toFixed(1)} m, need ${target} m)`;
          resultEl.className   = 'beat-sim__result beat-sim__result--miss';
        } else {
          resultEl.textContent = `📏 ${diff.toFixed(1)} m overshoot (got ${s.toFixed(1)} m, need ${target} m)`;
          resultEl.className   = 'beat-sim__result beat-sim__result--miss';
        }
        metaEl.textContent = `Attempts: ${attempts} · Best diff: ${best.toFixed(1)} m`;
      });

      beatDiv.querySelector('.beat-new-btn').addEventListener('click', () => {
        targetIdx++;
        attempts = 0;
        best = null;
        renderBeat();
      });
    }

    renderBeat();
  }
}
init();
