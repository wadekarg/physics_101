/* ch5-2d-collisions.js — Air-hockey 2D collision simulation
   Two pucks on an air-hockey table collide. Momentum vectors shown
   before and after. User adjusts angle and speed of incoming puck. */

function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = '2d-collisions';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const COL_PUCK1  = [0, 255, 255];
  const COL_PUCK2  = [255, 80, 200];
  const COL_TABLE  = [20, 60, 40];
  const COL_VEC    = [0, 255, 136];
  const COL_TOTAL  = [255, 220, 50];

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Puck state
    let p1, p2;          // { x, y, vx, vy }
    let preSnap, postSnap;
    let phase;           // 'pre', 'colliding', 'post'
    let collisionPoint;

    function resetSim() {
      const m1 = engine.getParam('mass1');
      const m2 = engine.getParam('mass2');
      const speed = engine.getParam('speed');
      const angleDeg = engine.getParam('angle');
      const angle = angleDeg * Math.PI / 180;

      const cx = (width || 700) / 2;
      const cy = (height || 400) / 2;

      p1 = { x: 100, y: cy - 20, vx: speed * Math.cos(angle) * 30, vy: speed * Math.sin(angle) * 30 };
      p2 = { x: cx + 80, y: cy + 10, vx: 0, vy: 0 };

      preSnap = {
        p1vx: p1.vx / 30, p1vy: p1.vy / 30,
        p2vx: 0, p2vy: 0,
        totalPx: m1 * p1.vx / 30, totalPy: m1 * p1.vy / 30,
      };
      postSnap = null;
      phase = 'pre';
      collisionPoint = null;
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      resetSim();
    };

    engine.onReset(resetSim);

    p.draw = () => {
      const m1 = engine.getParam('mass1');
      const m2 = engine.getParam('mass2');
      const r1 = 18 + m1 * 3;
      const r2 = 18 + m2 * 3;

      // ── Table background ──────────────────────────────────────────
      p.background(10, 10, 26);
      // Table surface
      p.noStroke();
      p.fill(COL_TABLE[0], COL_TABLE[1], COL_TABLE[2]);
      p.rect(20, 20, width - 40, height - 40, 12);
      // Table border (neon)
      p.noFill();
      p.stroke(0, 255, 136, 100);
      p.strokeWeight(3);
      p.rect(20, 20, width - 40, height - 40, 12);
      // Center line
      p.stroke(255, 255, 255, 30);
      p.strokeWeight(1);
      p.line(width / 2, 30, width / 2, height - 30);
      p.noFill();
      p.ellipse(width / 2, height / 2, 80, 80);

      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;

        p1.x += p1.vx * dt;
        p1.y += p1.vy * dt;
        p2.x += p2.vx * dt;
        p2.y += p2.vy * dt;

        // Wall bounces
        if (p1.x - r1 < 20)           { p1.x = 20 + r1; p1.vx *= -0.9; }
        if (p1.x + r1 > width - 20)   { p1.x = width - 20 - r1; p1.vx *= -0.9; }
        if (p1.y - r1 < 20)           { p1.y = 20 + r1; p1.vy *= -0.9; }
        if (p1.y + r1 > height - 20)  { p1.y = height - 20 - r1; p1.vy *= -0.9; }

        if (p2.x - r2 < 20)           { p2.x = 20 + r2; p2.vx *= -0.9; }
        if (p2.x + r2 > width - 20)   { p2.x = width - 20 - r2; p2.vx *= -0.9; }
        if (p2.y - r2 < 20)           { p2.y = 20 + r2; p2.vy *= -0.9; }
        if (p2.y + r2 > height - 20)  { p2.y = height - 20 - r2; p2.vy *= -0.9; }

        // Puck collision (elastic 2D)
        if (phase === 'pre') {
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < r1 + r2) {
            phase = 'post';
            collisionPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

            // Normal and tangent unit vectors
            const nx = dx / dist;
            const ny = dy / dist;

            // Relative velocity along normal
            const dvx = p1.vx - p2.vx;
            const dvy = p1.vy - p2.vy;
            const dvn = dvx * nx + dvy * ny;

            // Don't resolve if separating
            if (dvn > 0) {
              const j = (2 * dvn) / (1 / m1 + 1 / m2);

              p1.vx -= (j / m1) * nx;
              p1.vy -= (j / m1) * ny;
              p2.vx += (j / m2) * nx;
              p2.vy += (j / m2) * ny;

              // Separate pucks
              const overlap = r1 + r2 - dist;
              p1.x -= nx * overlap / 2;
              p1.y -= ny * overlap / 2;
              p2.x += nx * overlap / 2;
              p2.y += ny * overlap / 2;
            }

            postSnap = {
              p1vx: p1.vx / 30, p1vy: p1.vy / 30,
              p2vx: p2.vx / 30, p2vy: p2.vy / 30,
              totalPx: (m1 * p1.vx + m2 * p2.vx) / 30,
              totalPy: (m1 * p1.vy + m2 * p2.vy) / 30,
            };
          }
        }
      }

      // ── Draw pucks ────────────────────────────────────────────────
      // Puck 1
      p.noStroke();
      p.drawingContext.shadowColor = `rgba(${COL_PUCK1.join(',')}, 0.6)`;
      p.drawingContext.shadowBlur = 16;
      p.fill(COL_PUCK1[0], COL_PUCK1[1], COL_PUCK1[2]);
      p.ellipse(p1.x, p1.y, r1 * 2, r1 * 2);
      p.drawingContext.shadowBlur = 0;
      p.fill(10, 30, 20);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(10);
      p.text(`${m1}kg`, p1.x, p1.y);

      // Puck 2
      p.drawingContext.shadowColor = `rgba(${COL_PUCK2.join(',')}, 0.6)`;
      p.drawingContext.shadowBlur = 16;
      p.fill(COL_PUCK2[0], COL_PUCK2[1], COL_PUCK2[2]);
      p.ellipse(p2.x, p2.y, r2 * 2, r2 * 2);
      p.drawingContext.shadowBlur = 0;
      p.fill(10, 30, 20);
      p.text(`${m2}kg`, p2.x, p2.y);

      // ── Velocity vectors ──────────────────────────────────────────
      function drawVec(x, y, vx, vy, col, label) {
        const len = Math.sqrt(vx * vx + vy * vy);
        if (len < 0.3) return;
        const scale = 4;
        const ex = x + vx * scale;
        const ey = y + vy * scale;
        p.stroke(col[0], col[1], col[2]);
        p.strokeWeight(2);
        p.drawingContext.shadowColor = `rgba(${col.join(',')}, 0.5)`;
        p.drawingContext.shadowBlur = 6;
        p.line(x, y, ex, ey);
        // Arrowhead
        const angle = Math.atan2(vy, vx);
        p.line(ex, ey, ex - 8 * Math.cos(angle - 0.4), ey - 8 * Math.sin(angle - 0.4));
        p.line(ex, ey, ex - 8 * Math.cos(angle + 0.4), ey - 8 * Math.sin(angle + 0.4));
        p.drawingContext.shadowBlur = 0;
        if (label) {
          p.noStroke();
          p.fill(col[0], col[1], col[2]);
          p.textSize(9);
          p.textAlign(p.LEFT);
          p.text(label, ex + 5, ey - 5);
        }
      }

      drawVec(p1.x, p1.y, p1.vx / 30, p1.vy / 30, COL_PUCK1, 'v1');
      drawVec(p2.x, p2.y, p2.vx / 30, p2.vy / 30, COL_PUCK2, 'v2');

      // ── Collision flash ───────────────────────────────────────────
      if (collisionPoint && phase === 'post') {
        p.noStroke();
        const alpha = Math.max(0, 255 - p.frameCount * 4);
        if (alpha > 0) {
          p.fill(255, 255, 255, alpha * 0.3);
          p.ellipse(collisionPoint.x, collisionPoint.y, 60, 60);
        }
      }

      // ── Momentum vectors panel ────────────────────────────────────
      const panelX = 25;
      const panelY = height - 105;
      p.fill(10, 10, 26, 240);
      p.noStroke();
      p.rect(panelX - 5, panelY - 5, 340, 105, 6);

      p.fill(255, 255, 255, 200);
      p.textAlign(p.LEFT);
      p.textSize(12);
      p.text('Momentum Vectors:', panelX, panelY + 10);

      const snap = postSnap || preSnap;
      const label = postSnap ? 'After' : 'Before';

      p.textSize(11);
      p.fill(COL_PUCK1[0], COL_PUCK1[1], COL_PUCK1[2]);
      p.text(`p1 = (${(m1 * snap.p1vx).toFixed(1)}, ${(m1 * snap.p1vy).toFixed(1)}) kg\u00B7m/s`, panelX, panelY + 30);
      p.fill(COL_PUCK2[0], COL_PUCK2[1], COL_PUCK2[2]);
      p.text(`p2 = (${(m2 * snap.p2vx).toFixed(1)}, ${(m2 * snap.p2vy).toFixed(1)}) kg\u00B7m/s`, panelX, panelY + 48);

      const totalPx = m1 * snap.p1vx + m2 * snap.p2vx;
      const totalPy = m1 * snap.p1vy + m2 * snap.p2vy;
      p.fill(COL_TOTAL[0], COL_TOTAL[1], COL_TOTAL[2]);
      p.text(`p_total = (${totalPx.toFixed(1)}, ${totalPy.toFixed(1)}) kg\u00B7m/s  [${label}]`, panelX, panelY + 68);

      if (postSnap) {
        p.fill(COL_VEC[0], COL_VEC[1], COL_VEC[2]);
        p.text('\u2713 Total momentum conserved in both x and y!', panelX, panelY + 90);
      }

      // ── Phase indicator ───────────────────────────────────────────
      p.fill(255, 255, 255, 140);
      p.textAlign(p.RIGHT);
      p.textSize(12);
      p.text(phase === 'pre' ? 'Approaching...' : 'Collision complete', width - 30, 40);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { mass1: 2, mass2: 3, speed: 5, angle: 15 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'mass1', label: 'Puck 1 Mass', min: 1, max: 5,  step: 0.5, value: 2,  unit: 'kg' },
    { name: 'mass2', label: 'Puck 2 Mass', min: 1, max: 5,  step: 0.5, value: 3,  unit: 'kg' },
    { name: 'speed', label: 'Speed',       min: 2, max: 10, step: 0.5, value: 5,  unit: 'm/s' },
    { name: 'angle', label: 'Angle',       min: 0, max: 90, step: 1,   value: 15, unit: '\u00B0' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
