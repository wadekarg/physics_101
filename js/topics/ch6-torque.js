/* ch6-torque.js — Torque simulation
   Wrench on a bolt. Adjustable arm length, force, angle.
   Shows torque = r * F * sin(theta). Force and lever arm vectors. */

function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'torque';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const COL_WRENCH = [150, 180, 210];
  const COL_BOLT   = [180, 180, 180];
  const COL_FORCE  = [255, 60, 80];
  const COL_ARM    = [0, 255, 255];
  const COL_TORQUE = [0, 255, 136];
  const COL_ARC    = [255, 200, 0];

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let boltAngle = 0;       // rotation of the bolt
    let boltAngularVel = 0;

    function resetSim() {
      boltAngle = 0;
      boltAngularVel = 0;
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

      const armLength = engine.getParam('armLength');
      const force     = engine.getParam('force');
      const angleDeg  = engine.getParam('angle');
      const angleRad  = angleDeg * Math.PI / 180;

      const torque = armLength * force * Math.sin(angleRad);

      // Bolt center
      const cx = width * 0.4;
      const cy = height * 0.45;
      const armPx = armLength * 280;  // scale to pixels

      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        // Torque drives rotation
        const momentOfInertia = 5;
        const angAccel = torque / momentOfInertia;
        boltAngularVel += angAccel * dt * 0.02;
        boltAngularVel *= 0.97; // friction
        boltAngle += boltAngularVel * dt;
      }

      // ── Draw bolt ─────────────────────────────────────────────────
      p.push();
      p.translate(cx, cy);
      p.rotate(boltAngle);

      // Bolt hexagon
      p.stroke(COL_BOLT[0], COL_BOLT[1], COL_BOLT[2]);
      p.strokeWeight(2);
      p.fill(COL_BOLT[0], COL_BOLT[1], COL_BOLT[2], 100);
      p.drawingContext.shadowColor = 'rgba(180, 180, 180, 0.3)';
      p.drawingContext.shadowBlur = 10;
      p.beginShape();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        p.vertex(Math.cos(a) * 22, Math.sin(a) * 22);
      }
      p.endShape(p.CLOSE);
      p.drawingContext.shadowBlur = 0;

      // Slot cross on bolt
      p.stroke(60);
      p.strokeWeight(3);
      p.line(-10, 0, 10, 0);
      p.line(0, -10, 0, 10);

      // ── Draw wrench ───────────────────────────────────────────────
      // Wrench extends to the right from bolt center
      p.strokeWeight(8);
      p.stroke(COL_WRENCH[0], COL_WRENCH[1], COL_WRENCH[2]);
      p.line(0, 0, armPx, 0);

      // Wrench head (ring around bolt)
      p.noFill();
      p.stroke(COL_WRENCH[0], COL_WRENCH[1], COL_WRENCH[2], 160);
      p.strokeWeight(6);
      p.arc(0, 0, 50, 50, -Math.PI * 0.6, Math.PI * 0.6);

      // Handle grip
      p.stroke(COL_WRENCH[0], COL_WRENCH[1], COL_WRENCH[2], 80);
      p.strokeWeight(12);
      p.line(armPx - 20, 0, armPx + 10, 0);

      p.pop();

      // ── Force vector at end of wrench ─────────────────────────────
      const wrenchEndX = cx + Math.cos(boltAngle) * armPx;
      const wrenchEndY = cy + Math.sin(boltAngle) * armPx;

      // Force direction: at 'angle' degrees relative to wrench arm
      const forceDir = boltAngle + angleRad;
      const forceLen = force * 1.2; // scale for display
      const fEndX = wrenchEndX + Math.cos(forceDir + Math.PI / 2) * forceLen;
      const fEndY = wrenchEndY + Math.sin(forceDir + Math.PI / 2) * forceLen;

      // Force vector
      p.stroke(COL_FORCE[0], COL_FORCE[1], COL_FORCE[2]);
      p.strokeWeight(3);
      p.drawingContext.shadowColor = `rgba(${COL_FORCE.join(',')}, 0.6)`;
      p.drawingContext.shadowBlur = 8;
      p.line(wrenchEndX, wrenchEndY, fEndX, fEndY);
      // Arrowhead
      const fAngle = Math.atan2(fEndY - wrenchEndY, fEndX - wrenchEndX);
      p.line(fEndX, fEndY, fEndX - 10 * Math.cos(fAngle - 0.4), fEndY - 10 * Math.sin(fAngle - 0.4));
      p.line(fEndX, fEndY, fEndX - 10 * Math.cos(fAngle + 0.4), fEndY - 10 * Math.sin(fAngle + 0.4));
      p.drawingContext.shadowBlur = 0;

      p.noStroke();
      p.fill(COL_FORCE[0], COL_FORCE[1], COL_FORCE[2]);
      p.textSize(12);
      p.textAlign(p.LEFT);
      p.text(`F = ${force} N`, fEndX + 8, fEndY);

      // ── Lever arm vector ──────────────────────────────────────────
      p.stroke(COL_ARM[0], COL_ARM[1], COL_ARM[2]);
      p.strokeWeight(2);
      p.drawingContext.shadowColor = `rgba(${COL_ARM.join(',')}, 0.4)`;
      p.drawingContext.shadowBlur = 6;
      const rEndX = cx + Math.cos(boltAngle) * armPx;
      const rEndY = cy + Math.sin(boltAngle) * armPx;
      p.line(cx, cy, rEndX, rEndY);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(COL_ARM[0], COL_ARM[1], COL_ARM[2]);
      p.textSize(11);
      p.text(`r = ${armLength.toFixed(2)} m`, (cx + rEndX) / 2 - 10, (cy + rEndY) / 2 - 15);

      // ── Angle arc ─────────────────────────────────────────────────
      if (angleDeg > 2) {
        p.noFill();
        p.stroke(COL_ARC[0], COL_ARC[1], COL_ARC[2], 180);
        p.strokeWeight(2);
        const arcR = 40;
        p.arc(wrenchEndX, wrenchEndY, arcR * 2, arcR * 2,
              boltAngle, boltAngle + angleRad);
        p.noStroke();
        p.fill(COL_ARC[0], COL_ARC[1], COL_ARC[2]);
        p.textSize(11);
        const arcMid = boltAngle + angleRad / 2;
        p.text(`\u03B8 = ${angleDeg}\u00B0`, wrenchEndX + Math.cos(arcMid) * (arcR + 14),
                                               wrenchEndY + Math.sin(arcMid) * (arcR + 14));
      }

      // ── Torque readout ────────────────────────────────────────────
      const panelX = width - 260;
      const panelY = 20;
      p.fill(10, 10, 26, 220);
      p.noStroke();
      p.rect(panelX - 10, panelY - 5, 260, 130, 8);

      p.textAlign(p.LEFT);
      p.textSize(14);
      p.fill(COL_TORQUE[0], COL_TORQUE[1], COL_TORQUE[2]);
      p.drawingContext.shadowColor = `rgba(${COL_TORQUE.join(',')}, 0.5)`;
      p.drawingContext.shadowBlur = 6;
      p.text('\u03C4 = r \u00D7 F \u00D7 sin(\u03B8)', panelX, panelY + 15);
      p.drawingContext.shadowBlur = 0;

      p.textSize(12);
      p.fill(255, 255, 255, 200);
      p.text(`\u03C4 = ${armLength.toFixed(2)} \u00D7 ${force} \u00D7 sin(${angleDeg}\u00B0)`, panelX, panelY + 38);
      p.fill(COL_TORQUE[0], COL_TORQUE[1], COL_TORQUE[2]);
      p.textSize(16);
      p.text(`\u03C4 = ${torque.toFixed(1)} N\u00B7m`, panelX, panelY + 62);

      // Torque bar
      p.fill(255, 255, 255, 30);
      p.rect(panelX, panelY + 75, 230, 14, 4);
      const maxTorque = 100; // 1m * 100N
      const tFrac = Math.min(Math.abs(torque) / maxTorque, 1);
      p.fill(COL_TORQUE[0], COL_TORQUE[1], COL_TORQUE[2]);
      p.drawingContext.shadowColor = `rgba(${COL_TORQUE.join(',')}, 0.5)`;
      p.drawingContext.shadowBlur = 6;
      p.rect(panelX, panelY + 75, 230 * tFrac, 14, 4);
      p.drawingContext.shadowBlur = 0;

      // Tip
      p.fill(255, 255, 255, 120);
      p.textSize(11);
      p.text('sin(90\u00B0) = 1  \u2192  Maximum torque at 90\u00B0', panelX, panelY + 110);

      // ── Rotation indicator ────────────────────────────────────────
      p.fill(255, 255, 255, 100);
      p.textAlign(p.CENTER);
      p.textSize(11);
      p.text(`Bolt rotation: ${(boltAngle * 180 / Math.PI).toFixed(1)}\u00B0`, cx, cy + 50);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { armLength: 0.5, force: 60, angle: 90 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'armLength', label: 'Arm Length', min: 0.1, max: 1,   step: 0.05, value: 0.5,  unit: 'm' },
    { name: 'force',     label: 'Force',      min: 10,  max: 100, step: 5,    value: 60,   unit: 'N' },
    { name: 'angle',     label: 'Angle',      min: 0,   max: 90,  step: 1,    value: 90,   unit: '\u00B0' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
