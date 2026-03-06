/* ch6-gyroscopes.js — Gyroscope / precession simulation
   Top-down and side views of a spinning gyroscope. Angular momentum vector shown.
   When tilted, precession occurs. Faster spin = less precession. */

function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'gyroscopes';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const COL_WHEEL  = [0, 200, 255];
  const COL_AXLE   = [200, 200, 200];
  const COL_L      = [0, 255, 136];
  const COL_PREC   = [255, 80, 200];
  const COL_TORQUE = [255, 220, 50];

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let precAngle = 0;    // precession angle (rotation about vertical)
    let spinAngle = 0;    // wheel spin angle

    function resetSim() {
      precAngle = 0;
      spinAngle = 0;
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

      const spinRate = engine.getParam('spinRate');
      const tiltDeg  = engine.getParam('tilt');
      const tiltRad  = tiltDeg * Math.PI / 180;

      // Precession rate: omega_p = (m * g * r) / (I * omega_s)
      // Simplified: precession is inversely proportional to spin rate
      const mgr = 10;   // effective torque factor
      const I = 2;
      const precRate = (tiltDeg > 0.5) ? (mgr * Math.sin(tiltRad)) / (I * spinRate + 0.01) : 0;

      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        precAngle += precRate * dt;
        spinAngle += spinRate * dt;
      }

      // ── Layout: side view (left), top-down view (right) ───────────
      const sideX = width * 0.28;
      const sideY = height * 0.5;
      const topX  = width * 0.72;
      const topY  = height * 0.5;

      // ── Section labels ────────────────────────────────────────────
      p.noStroke();
      p.fill(255, 255, 255, 120);
      p.textAlign(p.CENTER);
      p.textSize(13);
      p.text('Side View', sideX, 25);
      p.text('Top-Down View', topX, 25);

      // Divider
      p.stroke(255, 255, 255, 30);
      p.strokeWeight(1);
      p.line(width / 2, 40, width / 2, height - 40);

      // ══════════════════════════════════════════════════════════════
      // SIDE VIEW
      // ══════════════════════════════════════════════════════════════

      p.push();
      p.translate(sideX, sideY);

      // Support stand
      p.stroke(100);
      p.strokeWeight(3);
      p.line(0, 50, 0, 80);
      p.line(-30, 80, 30, 80);

      // Axle tilted by tilt angle
      const axleLen = 80;
      const axEndX = Math.cos(-tiltRad + Math.PI / 2) * axleLen * 0.5;
      const axEndY = -Math.sin(-tiltRad + Math.PI / 2) * axleLen * 0.5;
      const axEndX2 = -axEndX;
      const axEndY2 = -axEndY;

      // Axle
      p.stroke(COL_AXLE[0], COL_AXLE[1], COL_AXLE[2]);
      p.strokeWeight(3);
      p.line(axEndX2, axEndY2, axEndX, axEndY);

      // Gyro wheel (ellipse for perspective)
      const wheelR = 35;
      p.noFill();
      p.stroke(COL_WHEEL[0], COL_WHEEL[1], COL_WHEEL[2]);
      p.strokeWeight(4);
      p.drawingContext.shadowColor = `rgba(${COL_WHEEL.join(',')}, 0.6)`;
      p.drawingContext.shadowBlur = 12;

      // Wheel at left end of axle
      p.push();
      p.translate(axEndX2, axEndY2);
      p.rotate(-tiltRad);
      p.ellipse(0, 0, 14, wheelR * 2);
      // Spin spokes
      for (let i = 0; i < 4; i++) {
        const sa = spinAngle + (Math.PI / 2) * i;
        p.strokeWeight(1);
        p.line(0, 0, Math.cos(sa) * 5, Math.sin(sa) * wheelR * 0.9);
      }
      p.pop();
      p.drawingContext.shadowBlur = 0;

      // Angular momentum vector L (along axle direction)
      const Lscale = 60;
      const Lx = Math.cos(-tiltRad + Math.PI / 2) * Lscale;
      const Ly = -Math.sin(-tiltRad + Math.PI / 2) * Lscale;
      p.stroke(COL_L[0], COL_L[1], COL_L[2]);
      p.strokeWeight(3);
      p.drawingContext.shadowColor = `rgba(${COL_L.join(',')}, 0.5)`;
      p.drawingContext.shadowBlur = 8;
      p.line(0, 0, Lx, Ly);
      // Arrowhead
      const La = Math.atan2(Ly, Lx);
      p.line(Lx, Ly, Lx - 10 * Math.cos(La - 0.4), Ly - 10 * Math.sin(La - 0.4));
      p.line(Lx, Ly, Lx - 10 * Math.cos(La + 0.4), Ly - 10 * Math.sin(La + 0.4));
      p.drawingContext.shadowBlur = 0;

      p.noStroke();
      p.fill(COL_L[0], COL_L[1], COL_L[2]);
      p.textSize(12);
      p.text('L', Lx + 10, Ly - 5);

      // Gravity arrow on the heavy end
      if (tiltDeg > 0.5) {
        p.stroke(COL_TORQUE[0], COL_TORQUE[1], COL_TORQUE[2]);
        p.strokeWeight(2);
        p.line(axEndX2, axEndY2, axEndX2, axEndY2 + 30);
        p.line(axEndX2, axEndY2 + 30, axEndX2 - 4, axEndY2 + 22);
        p.line(axEndX2, axEndY2 + 30, axEndX2 + 4, axEndY2 + 22);
        p.noStroke();
        p.fill(COL_TORQUE[0], COL_TORQUE[1], COL_TORQUE[2]);
        p.textSize(10);
        p.text('mg', axEndX2 + 12, axEndY2 + 28);
      }

      p.pop();

      // ══════════════════════════════════════════════════════════════
      // TOP-DOWN VIEW (precession circle)
      // ══════════════════════════════════════════════════════════════

      p.push();
      p.translate(topX, topY);

      // Precession circle (dashed)
      const precR = 70;
      p.noFill();
      p.stroke(COL_PREC[0], COL_PREC[1], COL_PREC[2], 50);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([6, 6]);
      p.ellipse(0, 0, precR * 2, precR * 2);
      p.drawingContext.setLineDash([]);

      // Support point (center)
      p.fill(COL_AXLE[0], COL_AXLE[1], COL_AXLE[2], 150);
      p.noStroke();
      p.ellipse(0, 0, 10, 10);

      // Gyroscope axle position (sweeps around in precession)
      const gx = Math.cos(precAngle) * precR * Math.sin(tiltRad);
      const gy = Math.sin(precAngle) * precR * Math.sin(tiltRad);

      // Axle from center to gyroscope position
      p.stroke(COL_AXLE[0], COL_AXLE[1], COL_AXLE[2]);
      p.strokeWeight(3);
      p.line(0, 0, gx, gy);

      // Gyro wheel (circle from top)
      const wheelTopR = 25;
      p.noFill();
      p.stroke(COL_WHEEL[0], COL_WHEEL[1], COL_WHEEL[2]);
      p.strokeWeight(3);
      p.drawingContext.shadowColor = `rgba(${COL_WHEEL.join(',')}, 0.5)`;
      p.drawingContext.shadowBlur = 10;
      p.ellipse(gx, gy, wheelTopR * 2, wheelTopR * 2);
      p.drawingContext.shadowBlur = 0;

      // Spin indicator (rotating line on wheel)
      p.stroke(COL_WHEEL[0], COL_WHEEL[1], COL_WHEEL[2], 200);
      p.strokeWeight(2);
      p.line(gx, gy,
             gx + Math.cos(spinAngle) * wheelTopR * 0.8,
             gy + Math.sin(spinAngle) * wheelTopR * 0.8);

      // L vector from gyro position (pointing outward along axle direction)
      if (tiltDeg > 0.5) {
        const LtopLen = 50;
        const Ltx = gx + Math.cos(precAngle) * LtopLen;
        const Lty = gy + Math.sin(precAngle) * LtopLen;
        p.stroke(COL_L[0], COL_L[1], COL_L[2]);
        p.strokeWeight(2);
        p.drawingContext.shadowColor = `rgba(${COL_L.join(',')}, 0.4)`;
        p.drawingContext.shadowBlur = 6;
        p.line(gx, gy, Ltx, Lty);
        const la2 = Math.atan2(Lty - gy, Ltx - gx);
        p.line(Ltx, Lty, Ltx - 8 * Math.cos(la2 - 0.3), Lty - 8 * Math.sin(la2 - 0.3));
        p.line(Ltx, Lty, Ltx - 8 * Math.cos(la2 + 0.3), Lty - 8 * Math.sin(la2 + 0.3));
        p.drawingContext.shadowBlur = 0;

        p.noStroke();
        p.fill(COL_L[0], COL_L[1], COL_L[2]);
        p.textSize(11);
        p.text('L', Ltx + 8, Lty);
      }

      // Precession direction arc
      if (precRate > 0.01) {
        p.noFill();
        p.stroke(COL_PREC[0], COL_PREC[1], COL_PREC[2]);
        p.strokeWeight(2);
        p.drawingContext.shadowColor = `rgba(${COL_PREC.join(',')}, 0.4)`;
        p.drawingContext.shadowBlur = 6;
        p.arc(0, 0, 40, 40, precAngle, precAngle + 0.8);
        // Arrow at arc end
        const arcEnd = precAngle + 0.8;
        const arrowX = Math.cos(arcEnd) * 20;
        const arrowY = Math.sin(arcEnd) * 20;
        p.line(arrowX, arrowY, arrowX - 6 * Math.cos(arcEnd + 0.8), arrowY - 6 * Math.sin(arcEnd + 0.8));
        p.drawingContext.shadowBlur = 0;

        p.noStroke();
        p.fill(COL_PREC[0], COL_PREC[1], COL_PREC[2]);
        p.textSize(10);
        p.text('precession', 0, precR + 30);
      }

      p.pop();

      // ── Info panel ────────────────────────────────────────────────
      const panelX = 20;
      const panelY = height - 100;
      p.fill(10, 10, 26, 220);
      p.noStroke();
      p.rect(panelX - 5, panelY - 5, width - 30, 95, 8);

      p.textAlign(p.LEFT);
      p.textSize(13);
      p.fill(COL_WHEEL[0], COL_WHEEL[1], COL_WHEEL[2]);
      p.text(`Spin rate (\u03C9_s): ${spinRate.toFixed(1)} rad/s`, panelX + 5, panelY + 14);

      p.fill(COL_TORQUE[0], COL_TORQUE[1], COL_TORQUE[2]);
      p.text(`Tilt: ${tiltDeg}\u00B0`, panelX + 5, panelY + 34);

      p.fill(COL_PREC[0], COL_PREC[1], COL_PREC[2]);
      p.text(`Precession rate (\u03C9_p): ${precRate.toFixed(3)} rad/s`, panelX + 5, panelY + 54);

      p.fill(255, 255, 255, 160);
      p.textSize(12);
      p.text('\u03C9_p = \u03C4 / L = (mgr sin\u03B8) / (I\u03C9_s)     \u2192  Faster spin = slower precession', panelX + 5, panelY + 78);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { spinRate: 8, tilt: 20 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'spinRate', label: 'Spin Rate',  min: 1,  max: 20, step: 0.5, value: 8,  unit: 'rad/s' },
    { name: 'tilt',     label: 'Tilt Angle', min: 0,  max: 45, step: 1,   value: 20, unit: '\u00B0' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
