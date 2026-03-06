/* ch6-angular-momentum.js — Ice Skater / Conservation of Angular Momentum
   Arms out = slow spin. Arms in = fast spin. L = I * omega is conserved.
   As I decreases (arms in), omega increases proportionally. */

function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'angular-momentum';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const COL_BODY   = [0, 200, 255];
  const COL_ARM    = [0, 255, 200];
  const COL_GLOW   = [100, 180, 255];
  const COL_L      = [0, 255, 136];
  const COL_OMEGA  = [255, 80, 200];
  const COL_I      = [255, 220, 50];

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let angle = 0;
    let trail = [];   // trailing glow positions

    // The initial angular momentum L is set when arms are fully extended
    const L_constant = 50; // conserved quantity

    function resetSim() {
      angle = 0;
      trail = [];
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

      const armSpread = engine.getParam('armSpread'); // 0.2 (tucked) to 1 (extended)

      // Moment of inertia depends on arm spread
      // I_body = constant core, I_arms = m_arm * r^2 scaled by armSpread
      const I_core = 4;
      const I_arms = 20 * armSpread * armSpread;
      const I_total = I_core + I_arms;

      // omega = L / I (conservation of angular momentum)
      const omega = L_constant / I_total;

      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        angle += omega * dt;
      }

      const cx = width * 0.4;
      const cy = height * 0.5;

      // ── Ice rink surface ──────────────────────────────────────────
      p.noStroke();
      p.fill(20, 30, 50, 120);
      p.ellipse(cx, cy, 320, 180);
      // Ice scratches
      p.stroke(255, 255, 255, 15);
      p.strokeWeight(1);
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 / 12) * i;
        p.line(cx + Math.cos(a) * 30, cy + Math.sin(a) * 15,
               cx + Math.cos(a) * 140, cy + Math.sin(a) * 70);
      }

      // ── Motion trail ──────────────────────────────────────────────
      const armPx = armSpread * 60 + 10;
      const handX1 = cx + Math.cos(angle) * armPx;
      const handY1 = cy + Math.sin(angle) * armPx * 0.5; // perspective squish
      const handX2 = cx + Math.cos(angle + Math.PI) * armPx;
      const handY2 = cy + Math.sin(angle + Math.PI) * armPx * 0.5;

      if (engine.isPlaying) {
        trail.push({ x1: handX1, y1: handY1, x2: handX2, y2: handY2, alpha: 200 });
        if (trail.length > 30) trail.shift();
      }

      for (const t of trail) {
        t.alpha -= 7;
        if (t.alpha > 0) {
          p.stroke(COL_GLOW[0], COL_GLOW[1], COL_GLOW[2], t.alpha * 0.3);
          p.strokeWeight(3);
          p.point(t.x1, t.y1);
          p.point(t.x2, t.y2);
        }
      }

      // ── Draw skater ──────────────────────────────────────────────
      p.push();
      p.translate(cx, cy);

      // Body (torso)
      p.noStroke();
      p.drawingContext.shadowColor = `rgba(${COL_BODY.join(',')}, 0.5)`;
      p.drawingContext.shadowBlur = 20;
      p.fill(COL_BODY[0], COL_BODY[1], COL_BODY[2]);
      p.ellipse(0, 0, 28, 36);
      p.drawingContext.shadowBlur = 0;

      // Head
      p.fill(COL_BODY[0], COL_BODY[1], COL_BODY[2], 200);
      p.ellipse(0, -24, 18, 18);

      // Arms
      p.stroke(COL_ARM[0], COL_ARM[1], COL_ARM[2]);
      p.strokeWeight(4);
      p.drawingContext.shadowColor = `rgba(${COL_ARM.join(',')}, 0.4)`;
      p.drawingContext.shadowBlur = 8;

      const armLen = armSpread * 60 + 10;
      // Left arm
      const lax = Math.cos(angle) * armLen;
      const lay = Math.sin(angle) * armLen * 0.5;
      p.line(0, -5, lax, lay - 5);
      // Right arm
      const rax = Math.cos(angle + Math.PI) * armLen;
      const ray = Math.sin(angle + Math.PI) * armLen * 0.5;
      p.line(0, -5, rax, ray - 5);
      p.drawingContext.shadowBlur = 0;

      // Hands (circles at arm ends)
      p.noStroke();
      p.fill(COL_ARM[0], COL_ARM[1], COL_ARM[2]);
      p.ellipse(lax, lay - 5, 10, 10);
      p.ellipse(rax, ray - 5, 10, 10);

      // Skirt / legs
      p.stroke(COL_BODY[0], COL_BODY[1], COL_BODY[2], 150);
      p.strokeWeight(3);
      p.line(-5, 14, -8, 38);
      p.line(5, 14, 8, 38);

      // Skate blades
      p.stroke(200, 200, 200);
      p.strokeWeight(2);
      p.line(-14, 38, -2, 38);
      p.line(2, 38, 14, 38);

      p.pop();

      // ── Angular momentum vector (vertical arrow) ──────────────────
      const vecX = cx;
      const vecY = cy - 80;
      const vecLen = 50;
      p.stroke(COL_L[0], COL_L[1], COL_L[2]);
      p.strokeWeight(3);
      p.drawingContext.shadowColor = `rgba(${COL_L.join(',')}, 0.6)`;
      p.drawingContext.shadowBlur = 8;
      p.line(vecX, vecY, vecX, vecY - vecLen);
      p.line(vecX, vecY - vecLen, vecX - 6, vecY - vecLen + 10);
      p.line(vecX, vecY - vecLen, vecX + 6, vecY - vecLen + 10);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(COL_L[0], COL_L[1], COL_L[2]);
      p.textSize(12);
      p.textAlign(p.CENTER);
      p.text('L (constant)', vecX, vecY - vecLen - 10);

      // ── Info panel ────────────────────────────────────────────────
      const panelX = width - 240;
      const panelY = 30;
      p.fill(10, 10, 26, 220);
      p.noStroke();
      p.rect(panelX - 10, panelY - 10, 240, 200, 8);

      p.textAlign(p.LEFT);
      p.textSize(14);
      p.fill(COL_L[0], COL_L[1], COL_L[2]);
      p.text('L = I \u00D7 \u03C9 = constant', panelX, panelY + 10);

      p.textSize(12);
      let py = panelY + 35;

      p.fill(COL_I[0], COL_I[1], COL_I[2]);
      p.text(`I (moment of inertia): ${I_total.toFixed(1)} kg\u00B7m\u00B2`, panelX, py); py += 20;

      p.fill(COL_OMEGA[0], COL_OMEGA[1], COL_OMEGA[2]);
      p.text(`\u03C9 (angular velocity): ${omega.toFixed(2)} rad/s`, panelX, py); py += 20;

      p.fill(COL_L[0], COL_L[1], COL_L[2]);
      p.text(`L = ${L_constant.toFixed(1)} kg\u00B7m\u00B2/s`, panelX, py); py += 28;

      p.fill(255, 255, 255, 160);
      p.textSize(11);
      p.text(`Arm spread: ${(armSpread * 100).toFixed(0)}%`, panelX, py); py += 18;

      // Visual bars for I and omega
      const barW = 180;
      const barH = 12;

      // I bar
      p.fill(255, 255, 255, 60);
      p.rect(panelX, py, barW, barH, 3);
      p.fill(COL_I[0], COL_I[1], COL_I[2]);
      p.drawingContext.shadowColor = `rgba(${COL_I.join(',')}, 0.5)`;
      p.drawingContext.shadowBlur = 4;
      p.rect(panelX, py, barW * (I_total / 24), barH, 3);
      p.drawingContext.shadowBlur = 0;
      p.fill(255);
      p.textSize(10);
      p.text('I', panelX + barW + 8, py + 10);
      py += 22;

      // omega bar
      p.fill(255, 255, 255, 60);
      p.rect(panelX, py, barW, barH, 3);
      p.fill(COL_OMEGA[0], COL_OMEGA[1], COL_OMEGA[2]);
      p.drawingContext.shadowColor = `rgba(${COL_OMEGA.join(',')}, 0.5)`;
      p.drawingContext.shadowBlur = 4;
      const maxOmega = L_constant / I_core;
      p.rect(panelX, py, barW * Math.min(omega / maxOmega, 1), barH, 3);
      p.drawingContext.shadowBlur = 0;
      p.fill(255);
      p.text('\u03C9', panelX + barW + 8, py + 10);

      // ── Hint ──────────────────────────────────────────────────────
      p.fill(255, 255, 255, 100);
      p.textAlign(p.CENTER);
      p.textSize(11);
      p.text('Move the Arm Spread slider to see conservation of angular momentum', width / 2, height - 15);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { armSpread: 1 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'armSpread', label: 'Arm Spread', min: 0.2, max: 1, step: 0.05, value: 1, unit: 'ratio' },
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
