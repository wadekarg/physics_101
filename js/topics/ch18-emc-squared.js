// Chapter 18: E=mc² — Mass-Energy Equivalence & Relativistic Momentum
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'emc-squared';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const CYAN = [0, 245, 212];
  const CYAN_HEX = '#00f5d4';

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;
    let particles = [];

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const mass = engine.getParam('mass');     // kg
      const v = engine.getParam('velocity');    // fraction of c
      const c = 3e8;                             // m/s
      const gamma = 1 / Math.sqrt(1 - v * v);

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;
      }

      // Energy calculations
      const E_rest = mass * c * c;                           // Rest energy (J)
      const E_total = gamma * mass * c * c;                  // Total relativistic energy
      const E_kinetic = (gamma - 1) * mass * c * c;          // Relativistic KE
      const p_rel = gamma * mass * v * c;                    // Relativistic momentum

      // --- Title ---
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('E = mc\u00B2 : Mass-Energy Equivalence', width / 2, 8);

      // === LEFT SIDE: Energy visualization ===
      const leftW = width * 0.45;

      // Mass visualization (sphere)
      const massCenterX = leftW * 0.4;
      const massCenterY = 160;
      const massRadius = 20 + mass * 8;

      // Energy release particles
      if (engine.isPlaying && Math.random() < 0.3) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        particles.push({
          x: massCenterX,
          y: massCenterY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60,
          maxLife: 60
        });
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        if (pt.life <= 0) { particles.splice(i, 1); continue; }
        const alpha = (pt.life / pt.maxLife) * 200;
        p.noStroke();
        p.fill(255, 220, 50, alpha);
        p.drawingContext.shadowColor = 'rgba(255,220,50,' + (alpha / 255) + ')';
        p.drawingContext.shadowBlur = 6;
        p.ellipse(pt.x, pt.y, 4, 4);
      }
      p.drawingContext.shadowBlur = 0;

      // Draw mass sphere
      p.noStroke();
      p.drawingContext.shadowColor = CYAN_HEX;
      p.drawingContext.shadowBlur = 25;
      p.fill(CYAN[0], CYAN[1], CYAN[2]);
      p.ellipse(massCenterX, massCenterY, massRadius * 2, massRadius * 2);
      // Inner highlight
      p.fill(100, 255, 240, 120);
      p.ellipse(massCenterX - massRadius * 0.2, massCenterY - massRadius * 0.2,
                massRadius * 0.6, massRadius * 0.6);
      p.drawingContext.shadowBlur = 0;

      // Mass label
      p.fill(255);
      p.textSize(12);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(mass.toFixed(3) + ' kg', massCenterX, massCenterY);

      // Arrow from mass to energy
      const arrowStartX = massCenterX + massRadius + 10;
      const arrowEndX = leftW - 30;
      const arrowY = massCenterY;
      p.stroke(255, 220, 50);
      p.strokeWeight(2);
      p.drawingContext.shadowColor = '#ffdc32';
      p.drawingContext.shadowBlur = 8;
      p.line(arrowStartX, arrowY, arrowEndX, arrowY);
      p.line(arrowEndX, arrowY, arrowEndX - 8, arrowY - 5);
      p.line(arrowEndX, arrowY, arrowEndX - 8, arrowY + 5);
      p.drawingContext.shadowBlur = 0;

      // E=mc^2 label on arrow
      p.noStroke();
      p.fill(255, 220, 50);
      p.textSize(14);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.drawingContext.shadowColor = '#ffdc32';
      p.drawingContext.shadowBlur = 6;
      p.text('E = mc\u00B2', (arrowStartX + arrowEndX) / 2, arrowY - 8);
      p.drawingContext.shadowBlur = 0;

      // Energy value display
      p.fill(255, 220, 50);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Rest Energy:', 15, 220);
      p.fill(255, 255, 255, 200);
      p.textSize(14);
      p.text(E_rest.toExponential(3) + ' J', 15, 238);

      // Comparisons
      p.fill(200, 200, 220);
      p.textSize(10);
      const tntPerKg = 4.184e9; // J per ton TNT
      const tntEquiv = E_rest / tntPerKg;
      p.text('\u2248 ' + tntEquiv.toExponential(2) + ' tons TNT', 15, 260);
      const householdsPerYear = E_rest / (1.2e10); // avg US household ~12,000 kWh/yr
      p.text('\u2248 powers ' + householdsPerYear.toExponential(1) + ' homes/yr', 15, 276);

      // === RIGHT SIDE: Relativistic momentum graph ===
      const graphX = leftW + 30;
      const graphY = 55;
      const graphW = width - graphX - 20;
      const graphH = 200;

      // Graph background
      p.fill(15, 15, 35, 200);
      p.stroke(CYAN[0], CYAN[1], CYAN[2], 40);
      p.strokeWeight(1);
      p.rect(graphX, graphY, graphW, graphH, 8);

      // Title
      p.noStroke();
      p.fill(CYAN[0], CYAN[1], CYAN[2]);
      p.textSize(12);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Relativistic Momentum: p = \u03B3mv', graphX + graphW / 2, graphY + 5);

      // Axes
      p.stroke(255, 255, 255, 60);
      p.strokeWeight(1);
      const axisL = graphX + 35;
      const axisR = graphX + graphW - 10;
      const axisT = graphY + 25;
      const axisB = graphY + graphH - 25;
      p.line(axisL, axisB, axisR, axisB);  // x-axis
      p.line(axisL, axisB, axisL, axisT);  // y-axis

      // Axis labels
      p.noStroke();
      p.fill(255, 255, 255, 120);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text('v/c', (axisL + axisR) / 2, axisB + 4);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text('p', axisL - 5, (axisT + axisB) / 2);

      // Tick marks on x-axis
      for (let vt = 0; vt <= 1; vt += 0.2) {
        const tx = axisL + (vt / 1) * (axisR - axisL);
        p.stroke(255, 255, 255, 30);
        p.line(tx, axisB, tx, axisT);
        p.noStroke();
        p.fill(255, 255, 255, 80);
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.text(vt.toFixed(1), tx, axisB + 2);
      }

      // Newtonian momentum (dashed line: p = mv)
      p.noFill();
      p.strokeWeight(1.5);
      p.stroke(255, 255, 255, 60);
      p.drawingContext.setLineDash([4, 4]);
      const maxP_display = 5; // Normalized max momentum for display
      p.beginShape();
      for (let vv = 0; vv <= 0.99; vv += 0.01) {
        const pNewt = mass * vv; // Newtonian p (normalized by mc)
        const px = axisL + (vv / 1) * (axisR - axisL);
        const py = axisB - (pNewt / maxP_display) * (axisB - axisT);
        if (py >= axisT) p.vertex(px, py);
      }
      p.endShape();
      p.drawingContext.setLineDash([]);

      // Relativistic momentum curve
      p.strokeWeight(2);
      p.stroke(CYAN[0], CYAN[1], CYAN[2]);
      p.drawingContext.shadowColor = CYAN_HEX;
      p.drawingContext.shadowBlur = 6;
      p.beginShape();
      for (let vv = 0; vv <= 0.99; vv += 0.005) {
        const gam = 1 / Math.sqrt(1 - vv * vv);
        const pRel = gam * mass * vv; // relativistic p (normalized)
        const px = axisL + (vv / 1) * (axisR - axisL);
        const py = axisB - (pRel / maxP_display) * (axisB - axisT);
        if (py >= axisT) p.vertex(px, Math.max(axisT, py));
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Current velocity marker
      const markerX = axisL + (v / 1) * (axisR - axisL);
      const pRelCurrent = gamma * mass * v;
      const markerY = Math.max(axisT, axisB - (pRelCurrent / maxP_display) * (axisB - axisT));
      p.noStroke();
      p.fill(255, 100, 100);
      p.drawingContext.shadowColor = '#ff6464';
      p.drawingContext.shadowBlur = 10;
      p.ellipse(markerX, markerY, 10, 10);
      p.drawingContext.shadowBlur = 0;

      // Legend
      p.textSize(10);
      p.textAlign(p.LEFT, p.TOP);
      p.fill(CYAN[0], CYAN[1], CYAN[2]);
      p.text('\u2500 Relativistic', graphX + 40, graphY + graphH - 18);
      p.fill(255, 255, 255, 80);
      p.text('--- Newtonian', graphX + 130, graphY + graphH - 18);
      p.fill(255, 100, 100);
      p.text('\u25CF Current', graphX + 220, graphY + graphH - 18);

      // === BOTTOM: Energy breakdown ===
      const barY = 300;
      const barH = 25;
      const barMaxW = graphX - 30;

      // Total energy bar
      const maxE = gamma * mass * c * c * 1.1; // slightly more for padding
      const restBarW = (E_rest / maxE) * barMaxW;
      const keBarW = (E_kinetic / maxE) * barMaxW;

      p.noStroke();
      // Rest energy
      p.fill(CYAN[0], CYAN[1], CYAN[2], 180);
      p.drawingContext.shadowColor = CYAN_HEX;
      p.drawingContext.shadowBlur = 4;
      p.rect(20, barY, restBarW, barH, 4, 0, 0, 4);
      // Kinetic energy
      p.fill(255, 100, 100, 180);
      p.drawingContext.shadowColor = '#ff6464';
      p.rect(20 + restBarW, barY, keBarW, barH, 0, 4, 4, 0);
      p.drawingContext.shadowBlur = 0;

      // Labels
      p.fill(255);
      p.textSize(10);
      p.textAlign(p.LEFT, p.CENTER);
      if (restBarW > 60) {
        p.text('E\u2080 = mc\u00B2', 25, barY + barH / 2);
      }
      if (keBarW > 60) {
        p.text('KE = (\u03B3-1)mc\u00B2', 25 + restBarW + 5, barY + barH / 2);
      }

      // Total energy label
      p.fill(255, 255, 255, 200);
      p.textSize(11);
      p.textAlign(p.LEFT, p.TOP);
      p.text('E_total = \u03B3mc\u00B2 = ' + E_total.toExponential(3) + ' J', 20, barY + barH + 8);
      p.text('E_rest = ' + E_rest.toExponential(3) + ' J   KE = ' + E_kinetic.toExponential(3) + ' J', 20, barY + barH + 24);

      // --- Physics values panel ---
      p.fill(15, 15, 35, 220);
      p.stroke(CYAN[0], CYAN[1], CYAN[2], 60);
      p.strokeWeight(1);
      p.rect(graphX, barY - 10, graphW, 90, 8);
      p.noStroke();

      p.fill(CYAN[0], CYAN[1], CYAN[2]);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Relativistic Values', graphX + 10, barY - 2);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('\u03B3 = ' + gamma.toFixed(4), graphX + 10, barY + 16);
      p.text('p = ' + p_rel.toExponential(3) + ' kg\u00B7m/s', graphX + 10, barY + 32);
      p.text('v = ' + (v * c).toExponential(3) + ' m/s', graphX + 10, barY + 48);
      p.text('KE/E\u2080 = ' + ((gamma - 1)).toFixed(4), graphX + 10, barY + 64);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Adjust mass and velocity to explore mass-energy equivalence', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { mass: 1, velocity: 0.5 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'mass', label: 'Mass', min: 0.001, max: 10, step: 0.001, value: 1, unit: 'kg' },
    { name: 'velocity', label: 'Velocity', min: 0, max: 0.99, step: 0.01, value: 0.5, unit: 'c' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
