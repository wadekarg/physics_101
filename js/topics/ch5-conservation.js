/* ch5-conservation.js — Conservation of Momentum (1D collisions)
   Two balls collide in 1D. Elastic vs inelastic toggle.
   Shows momentum and energy bars before and after. Total momentum conserved. */

function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'conservation-momentum';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const COL_BALL1 = [0, 255, 255];
  const COL_BALL2 = [255, 80, 200];
  const COL_MOM   = [0, 255, 136];
  const COL_KE    = [255, 220, 50];

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Physics state
    let b1x, b1v, b2x, b2v;
    let collided;
    let preCollision, postCollision;  // snapshots
    let phase; // 'approaching', 'collided', 'separated'

    function resetSim() {
      const m1 = engine.getParam('mass1');
      const m2 = engine.getParam('mass2');
      const v1 = engine.getParam('velocity1');

      b1x = 120;
      b1v = v1 * 3;   // scale for pixels
      b2x = width ? width - 200 : 500;
      b2v = 0;
      collided = false;
      phase = 'approaching';

      preCollision = {
        p1: m1 * v1, p2: 0, pTotal: m1 * v1,
        ke1: 0.5 * m1 * v1 * v1, ke2: 0, keTotal: 0.5 * m1 * v1 * v1,
      };
      postCollision = null;
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

      const m1 = engine.getParam('mass1');
      const m2 = engine.getParam('mass2');
      const v1 = engine.getParam('velocity1');
      const isElastic = engine.getParam('collisionType') < 0.5;

      const r1 = 15 + m1 * 2;
      const r2 = 15 + m2 * 2;
      const trackY = 200;

      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;

        if (phase === 'approaching') {
          b1x += b1v * dt;
          b2x += b2v * dt;

          // Check collision
          if (b1x + r1 >= b2x - r2) {
            phase = 'collided';
            collided = true;

            // Compute post-collision velocities
            if (isElastic) {
              // Elastic: v1' = (m1-m2)/(m1+m2)*v1, v2' = 2*m1/(m1+m2)*v1
              const v1f = ((m1 - m2) / (m1 + m2)) * v1;
              const v2f = (2 * m1 / (m1 + m2)) * v1;
              b1v = v1f * 3;
              b2v = v2f * 3;
              postCollision = {
                p1: m1 * v1f, p2: m2 * v2f, pTotal: m1 * v1f + m2 * v2f,
                ke1: 0.5 * m1 * v1f * v1f, ke2: 0.5 * m2 * v2f * v2f,
                keTotal: 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f,
              };
            } else {
              // Perfectly inelastic: they stick
              const vf = (m1 * v1) / (m1 + m2);
              b1v = vf * 3;
              b2v = vf * 3;
              postCollision = {
                p1: m1 * vf, p2: m2 * vf, pTotal: (m1 + m2) * vf,
                ke1: 0.5 * m1 * vf * vf, ke2: 0.5 * m2 * vf * vf,
                keTotal: 0.5 * (m1 + m2) * vf * vf,
              };
            }
            phase = 'separated';
          }
        } else if (phase === 'separated') {
          b1x += b1v * dt;
          b2x += b2v * dt;

          // In inelastic, keep them together
          if (!isElastic) {
            const avg = (b1x + b2x) / 2;
            b1x = avg - 2;
            b2x = avg + 2;
          }
        }
      }

      // ── Draw track ────────────────────────────────────────────────
      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.line(20, trackY, width - 20, trackY);

      // ── Draw balls ────────────────────────────────────────────────
      // Ball 1
      p.noStroke();
      p.drawingContext.shadowColor = `rgba(${COL_BALL1.join(',')}, 0.6)`;
      p.drawingContext.shadowBlur = 18;
      p.fill(COL_BALL1[0], COL_BALL1[1], COL_BALL1[2]);
      p.ellipse(b1x, trackY, r1 * 2, r1 * 2);
      p.drawingContext.shadowBlur = 0;
      p.fill(10, 10, 26);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(11);
      p.text(`${m1}kg`, b1x, trackY);

      // Ball 2
      p.drawingContext.shadowColor = `rgba(${COL_BALL2.join(',')}, 0.6)`;
      p.drawingContext.shadowBlur = 18;
      p.fill(COL_BALL2[0], COL_BALL2[1], COL_BALL2[2]);
      p.ellipse(b2x, trackY, r2 * 2, r2 * 2);
      p.drawingContext.shadowBlur = 0;
      p.fill(10, 10, 26);
      p.text(`${m2}kg`, b2x, trackY);

      // Velocity arrows
      function drawArrow(x, y, vx, col) {
        if (Math.abs(vx) < 0.5) return;
        const len = vx * 4;
        p.stroke(col[0], col[1], col[2]);
        p.strokeWeight(2);
        p.drawingContext.shadowColor = `rgba(${col.join(',')}, 0.5)`;
        p.drawingContext.shadowBlur = 6;
        p.line(x, y - 30, x + len, y - 30);
        // Arrowhead
        const dir = len > 0 ? 1 : -1;
        p.line(x + len, y - 30, x + len - dir * 8, y - 36);
        p.line(x + len, y - 30, x + len - dir * 8, y - 24);
        p.drawingContext.shadowBlur = 0;
      }
      drawArrow(b1x, trackY, b1v / 3, COL_BALL1);
      drawArrow(b2x, trackY, b2v / 3, COL_BALL2);

      // ── Collision type label ──────────────────────────────────────
      p.noStroke();
      p.fill(255, 255, 255, 200);
      p.textAlign(p.CENTER);
      p.textSize(14);
      p.text(isElastic ? 'Elastic Collision' : 'Perfectly Inelastic Collision', width / 2, 25);

      // ── Momentum & Energy bars ────────────────────────────────────
      const barSectionY = 260;
      const barH = 16;
      const maxMom = Math.max(Math.abs(preCollision.pTotal) * 1.5, 1);
      const maxKE  = Math.max(preCollision.keTotal * 1.5, 1);

      function drawBarPair(label, preVal, postVal, y, maxVal, col) {
        p.fill(255, 255, 255, 160);
        p.textAlign(p.LEFT);
        p.textSize(11);
        p.text(label, 20, y - 2);

        const barX = 140;
        const barMaxW = 200;

        // Before
        p.fill(col[0], col[1], col[2], 60);
        p.rect(barX, y - barH, barMaxW, barH / 2, 2);
        p.fill(col[0], col[1], col[2]);
        const w1 = (preVal / maxVal) * barMaxW;
        p.rect(barX, y - barH, Math.max(0, w1), barH / 2, 2);

        // After
        if (postVal !== null) {
          p.fill(col[0], col[1], col[2], 60);
          p.rect(barX, y - barH / 2 + 2, barMaxW, barH / 2, 2);
          p.fill(col[0], col[1], col[2], 220);
          const w2 = (postVal / maxVal) * barMaxW;
          p.rect(barX, y - barH / 2 + 2, Math.max(0, w2), barH / 2, 2);
        }

        // Values
        p.fill(255, 255, 255, 180);
        p.textSize(10);
        p.text(`Before: ${preVal.toFixed(1)}`, barX + barMaxW + 10, y - barH + 6);
        if (postVal !== null) {
          p.text(`After: ${postVal.toFixed(1)}`, barX + barMaxW + 10, y);
        }
      }

      // Momentum bars
      p.fill(COL_MOM[0], COL_MOM[1], COL_MOM[2]);
      p.textSize(13);
      p.textAlign(p.LEFT);
      p.text('Momentum (kg\u00B7m/s)', 20, barSectionY);
      drawBarPair('Ball 1 p', preCollision.p1, postCollision ? postCollision.p1 : null,
                  barSectionY + 25, maxMom, COL_BALL1);
      drawBarPair('Ball 2 p', preCollision.p2, postCollision ? postCollision.p2 : null,
                  barSectionY + 55, maxMom, COL_BALL2);
      drawBarPair('Total p', preCollision.pTotal, postCollision ? postCollision.pTotal : null,
                  barSectionY + 85, maxMom, COL_MOM);

      // KE bars
      p.fill(COL_KE[0], COL_KE[1], COL_KE[2]);
      p.textSize(13);
      p.text('Kinetic Energy (J)', width / 2 + 20, barSectionY);
      const keX = width / 2 + 20;

      function drawKEBar(label, preVal, postVal, y, col) {
        p.fill(255, 255, 255, 160);
        p.textAlign(p.LEFT);
        p.textSize(11);
        p.text(label, keX, y - 2);

        const barX2 = keX + 80;
        const barMaxW = 150;

        p.fill(col[0], col[1], col[2], 60);
        p.rect(barX2, y - barH, barMaxW, barH / 2, 2);
        p.fill(col[0], col[1], col[2]);
        const w1 = (preVal / maxKE) * barMaxW;
        p.rect(barX2, y - barH, Math.max(0, w1), barH / 2, 2);

        if (postVal !== null) {
          p.fill(col[0], col[1], col[2], 60);
          p.rect(barX2, y - barH / 2 + 2, barMaxW, barH / 2, 2);
          p.fill(col[0], col[1], col[2], 220);
          const w2 = (postVal / maxKE) * barMaxW;
          p.rect(barX2, y - barH / 2 + 2, Math.max(0, w2), barH / 2, 2);
        }

        p.fill(255, 255, 255, 180);
        p.textSize(10);
        p.text(`B: ${preVal.toFixed(1)}`, barX2 + barMaxW + 6, y - barH + 6);
        if (postVal !== null) {
          p.text(`A: ${postVal.toFixed(1)}`, barX2 + barMaxW + 6, y);
        }
      }

      drawKEBar('KE 1', preCollision.ke1, postCollision ? postCollision.ke1 : null,
                barSectionY + 25, COL_BALL1);
      drawKEBar('KE 2', preCollision.ke2, postCollision ? postCollision.ke2 : null,
                barSectionY + 55, COL_BALL2);
      drawKEBar('Total KE', preCollision.keTotal, postCollision ? postCollision.keTotal : null,
                barSectionY + 85, COL_KE);

      // Conservation note
      if (postCollision) {
        p.textSize(12);
        p.textAlign(p.CENTER);
        p.fill(COL_MOM[0], COL_MOM[1], COL_MOM[2]);
        p.text('\u2713 Momentum conserved!', width / 4, height - 15);

        if (isElastic) {
          p.fill(COL_KE[0], COL_KE[1], COL_KE[2]);
          p.text('\u2713 KE conserved (elastic)', width * 3 / 4, height - 15);
        } else {
          p.fill(255, 100, 80);
          const keLoss = ((1 - postCollision.keTotal / preCollision.keTotal) * 100).toFixed(1);
          p.text(`\u2717 KE lost: ${keLoss}% (inelastic)`, width * 3 / 4, height - 15);
        }
      }
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { mass1: 4, mass2: 2, velocity1: 5, collisionType: 0 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'mass1',         label: 'Mass 1',         min: 1, max: 10, step: 0.5, value: 4, unit: 'kg' },
    { name: 'mass2',         label: 'Mass 2',         min: 1, max: 10, step: 0.5, value: 2, unit: 'kg' },
    { name: 'velocity1',     label: 'Velocity 1',     min: 1, max: 10, step: 0.5, value: 5, unit: 'm/s' },
    { name: 'collisionType', label: 'Inelastic (0=Elastic, 1=Inelastic)', min: 0, max: 1, step: 1, value: 0, unit: '' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
