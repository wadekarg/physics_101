// Chapter 4: Work & Kinetic Energy — Push a Crate
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'work-kinetic-energy';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Crate state
    let crateX = 80;
    let crateVx = 0;
    let displacement = 0;
    let totalWork = 0;
    let kineticEnergy = 0;
    let pushing = false;
    let simTime = 0;
    let workHistory = [];
    let keHistory = [];

    const surfaceY = 280;
    const crateSize = 50;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 520;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    function resetSim() {
      crateX = 80;
      crateVx = 0;
      displacement = 0;
      totalWork = 0;
      kineticEnergy = 0;
      simTime = 0;
      workHistory = [];
      keHistory = [];
    }

    p.draw = () => {
      p.background(10, 10, 26);
      const F = engine.getParam('force');
      const mass = engine.getParam('mass');
      const angleDeg = engine.getParam('angle');
      const angleRad = angleDeg * Math.PI / 180;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Work & Kinetic Energy', width / 2, 8);

      p.textSize(11);
      p.fill(200, 200, 220, 150);
      p.text('Click and hold to push the crate | Watch work convert to kinetic energy', width / 2, 28);

      // Horizontal component of force
      const Fx = F * Math.cos(angleRad);
      const Fy = F * Math.sin(angleRad);
      const accel = Fx / mass;

      // Physics update
      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        simTime += dt;

        if (pushing) {
          crateVx += accel * dt;
          const dx = crateVx * dt;
          displacement += Math.abs(dx);
          totalWork = F * Math.cos(angleRad) * displacement;
        }

        crateX += crateVx * 80 * dt;

        // Wrap
        if (crateX > width + crateSize) {
          crateX = -crateSize;
        }

        kineticEnergy = 0.5 * mass * crateVx * crateVx;

        // History for graph
        workHistory.push({ t: simTime, v: totalWork });
        keHistory.push({ t: simTime, v: kineticEnergy });
        if (workHistory.length > 250) {
          workHistory.shift();
          keHistory.shift();
        }
      }

      // Surface
      p.fill(25, 25, 20);
      p.noStroke();
      p.rect(0, surfaceY, width, 20);
      p.stroke(0, 255, 136, 80);
      p.strokeWeight(1);
      p.line(0, surfaceY, width, surfaceY);

      // Distance markers
      p.stroke(0, 255, 136, 30);
      p.strokeWeight(0.5);
      for (let d = 0; d < width; d += 60) {
        p.line(d, surfaceY, d, surfaceY + 5);
      }

      // Crate
      const crateY = surfaceY - crateSize;
      p.drawingContext.shadowBlur = 12;
      p.drawingContext.shadowColor = '#8b5cf6';
      p.fill(100, 70, 150);
      p.stroke(139, 92, 246);
      p.strokeWeight(1);
      p.rect(crateX, crateY, crateSize, crateSize, 3);
      p.drawingContext.shadowBlur = 0;

      // Crate details
      p.stroke(120, 90, 170);
      p.strokeWeight(0.5);
      p.line(crateX, crateY, crateX + crateSize, crateY + crateSize);
      p.line(crateX + crateSize, crateY, crateX, crateY + crateSize);

      // Mass label
      p.noStroke();
      p.fill(255, 255, 255, 200);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(mass.toFixed(0) + 'kg', crateX + crateSize / 2, crateY + crateSize / 2);

      // Force arrow (at angle)
      if (pushing) {
        const fLen = Math.min(F * 1.2, 120);
        const fStartX = crateX - 5;
        const fStartY = crateY + crateSize / 2;
        const fEndX = fStartX - fLen * Math.cos(angleRad);
        const fEndY = fStartY + fLen * Math.sin(angleRad); // note: y inverted

        // Force direction line (from crate, toward push origin)
        p.stroke(0, 255, 136);
        p.strokeWeight(3);
        p.drawingContext.shadowBlur = 12;
        p.drawingContext.shadowColor = '#00ff88';
        // Actually show arrow pushing rightward at angle
        const pushEndX = crateX + crateSize + fLen * Math.cos(angleRad);
        const pushEndY = crateY + crateSize / 2 - fLen * Math.sin(angleRad);
        const pushStartX = crateX + crateSize + 5;
        const pushStartY = crateY + crateSize / 2;

        // Arrow from crate in force direction
        p.line(pushStartX, pushStartY, pushEndX, pushEndY);
        const fAngle = Math.atan2(pushEndY - pushStartY, pushEndX - pushStartX);
        p.line(pushEndX, pushEndY, pushEndX - 10 * Math.cos(fAngle - 0.3), pushEndY - 10 * Math.sin(fAngle - 0.3));
        p.line(pushEndX, pushEndY, pushEndX - 10 * Math.cos(fAngle + 0.3), pushEndY - 10 * Math.sin(fAngle + 0.3));
        p.drawingContext.shadowBlur = 0;

        // Label
        p.noStroke();
        p.fill(0, 255, 136);
        p.textSize(11);
        p.textAlign(p.LEFT, p.BOTTOM);
        p.text('F = ' + F.toFixed(0) + ' N', pushEndX + 5, pushEndY - 3);

        // Horizontal component
        p.stroke(0, 180, 216, 150);
        p.strokeWeight(1.5);
        p.drawingContext.setLineDash([4, 3]);
        p.line(pushStartX, pushStartY, pushStartX + fLen * Math.cos(angleRad), pushStartY);
        p.drawingContext.setLineDash([]);

        p.noStroke();
        p.fill(0, 180, 216);
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.text('Fx = F cos\u03B8 = ' + Fx.toFixed(1) + ' N', pushStartX + fLen * Math.cos(angleRad) / 2, pushStartY + 5);

        // Angle indicator
        p.noFill();
        p.stroke(255, 200, 50, 120);
        p.strokeWeight(1);
        p.arc(pushStartX, pushStartY, 30, 30, -angleRad, 0);
        p.noStroke();
        p.fill(255, 200, 50);
        p.textSize(9);
        p.text('\u03B8=' + angleDeg.toFixed(0) + '\u00B0', pushStartX + 20, pushStartY - 15);
      }

      // === Work-Energy Theorem display ===
      const eqY = 50;
      p.fill(15, 15, 35, 230);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(20, eqY, width - 40, 50, 10);

      p.noStroke();
      p.textSize(18);
      p.textAlign(p.CENTER, p.CENTER);

      // W = F d cos theta
      p.fill(0, 255, 136);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#00ff88';
      p.text('W', width * 0.15, eqY + 17);
      p.drawingContext.shadowBlur = 0;

      p.fill(200, 200, 220);
      p.text('=', width * 0.22, eqY + 17);

      p.fill(0, 180, 216);
      p.text('F \u00B7 d \u00B7 cos\u03B8', width * 0.38, eqY + 17);

      p.fill(200, 200, 220);
      p.text('=', width * 0.55, eqY + 17);

      p.fill(255, 170, 50);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#ffaa32';
      p.text('\u0394KE', width * 0.65, eqY + 17);
      p.drawingContext.shadowBlur = 0;

      p.fill(200, 200, 220);
      p.text('=', width * 0.73, eqY + 17);

      p.fill(139, 92, 246);
      p.text('\u00BDmv\u00B2', width * 0.83, eqY + 17);

      // Values
      p.textSize(10);
      p.fill(0, 255, 136);
      p.text(totalWork.toFixed(1) + ' J', width * 0.15, eqY + 42);
      p.fill(0, 180, 216);
      p.text(F.toFixed(0) + '\u00D7' + displacement.toFixed(1) + '\u00D7cos' + angleDeg.toFixed(0) + '\u00B0', width * 0.38, eqY + 42);
      p.fill(255, 170, 50);
      p.text(kineticEnergy.toFixed(1) + ' J', width * 0.65, eqY + 42);
      p.fill(139, 92, 246);
      p.text('\u00BD\u00D7' + mass.toFixed(0) + '\u00D7' + crateVx.toFixed(2) + '\u00B2', width * 0.83, eqY + 42);

      // === Energy bars ===
      const barY = surfaceY + 30;
      const barH = 30;
      const maxEnergy = Math.max(totalWork, kineticEnergy, 1);
      const barMaxW = width - 200;

      // Work bar
      p.fill(30, 30, 50);
      p.noStroke();
      p.rect(130, barY, barMaxW, barH, 4);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#00ff88';
      p.fill(0, 255, 136);
      const wBarW = (totalWork / Math.max(maxEnergy * 1.2, 10)) * barMaxW;
      p.rect(130, barY, Math.min(wBarW, barMaxW), barH, 4);
      p.drawingContext.shadowBlur = 0;

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(11);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text('Work:', 125, barY + barH / 2);
      p.fill(255, 255, 255, 200);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(totalWork.toFixed(1) + ' J', Math.min(wBarW, barMaxW) + 135, barY + barH / 2);

      // KE bar
      p.fill(30, 30, 50);
      p.noStroke();
      p.rect(130, barY + barH + 8, barMaxW, barH, 4);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#ffaa32';
      p.fill(255, 170, 50);
      const keBarW = (kineticEnergy / Math.max(maxEnergy * 1.2, 10)) * barMaxW;
      p.rect(130, barY + barH + 8, Math.min(keBarW, barMaxW), barH, 4);
      p.drawingContext.shadowBlur = 0;

      p.noStroke();
      p.fill(255, 170, 50);
      p.textSize(11);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text('KE:', 125, barY + barH + 8 + barH / 2);
      p.fill(255, 255, 255, 200);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(kineticEnergy.toFixed(1) + ' J', Math.min(keBarW, barMaxW) + 135, barY + barH + 8 + barH / 2);

      // === Mini graph ===
      const graphY = barY + barH * 2 + 25;
      const graphH = 100;
      const graphW = width - 80;
      const graphX = 50;

      p.fill(15, 15, 30);
      p.stroke(40, 40, 70);
      p.strokeWeight(1);
      p.rect(graphX, graphY, graphW, graphH, 6);

      p.noStroke();
      p.fill(200, 200, 220, 150);
      p.textSize(10);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Energy vs Time', graphX + 5, graphY + 3);

      // Find max for scaling
      let graphMax = 1;
      for (const d of workHistory) if (d.v > graphMax) graphMax = d.v;
      for (const d of keHistory) if (d.v > graphMax) graphMax = d.v;
      graphMax *= 1.2;

      // Work line
      if (workHistory.length > 1) {
        p.noFill();
        p.stroke(0, 255, 136);
        p.strokeWeight(1.5);
        p.drawingContext.shadowBlur = 4;
        p.drawingContext.shadowColor = '#00ff88';
        p.beginShape();
        for (let i = 0; i < workHistory.length; i++) {
          const x = graphX + (i / 250) * graphW;
          const y = graphY + graphH - (workHistory[i].v / graphMax) * (graphH - 10);
          p.vertex(x, y);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      }

      // KE line
      if (keHistory.length > 1) {
        p.noFill();
        p.stroke(255, 170, 50);
        p.strokeWeight(1.5);
        p.drawingContext.shadowBlur = 4;
        p.drawingContext.shadowColor = '#ffaa32';
        p.beginShape();
        for (let i = 0; i < keHistory.length; i++) {
          const x = graphX + (i / 250) * graphW;
          const y = graphY + graphH - (keHistory[i].v / graphMax) * (graphH - 10);
          p.vertex(x, y);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      }

      // Graph legend
      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(9);
      p.textAlign(p.RIGHT, p.TOP);
      p.text('Work', graphX + graphW - 5, graphY + 5);
      p.fill(255, 170, 50);
      p.text('KE', graphX + graphW - 5, graphY + 17);

      // Current values
      p.fill(200, 200, 220);
      p.textSize(11);
      p.textAlign(p.LEFT, p.TOP);
      p.text('v = ' + crateVx.toFixed(2) + ' m/s   |   d = ' + displacement.toFixed(1) + ' m   |   t = ' + simTime.toFixed(1) + ' s', 30, height - 18);

      // Note
      p.fill(139, 92, 246, 150);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Work-Energy Theorem: W = \u0394KE', width / 2, height - 3);
    };

    p.mousePressed = () => {
      if (p.mouseX >= 0 && p.mouseX <= width && p.mouseY >= 0 && p.mouseY <= height) {
        if (pushing) {
          pushing = false;
        } else {
          resetSim();
          pushing = true;
        }
      }
    };

    p.mouseReleased = () => {
      pushing = false;
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { force: 50, mass: 10, angle: 0 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'force', label: 'Applied Force', min: 1, max: 100, step: 1, value: 50, unit: 'N' },
    { name: 'mass', label: 'Mass', min: 1, max: 50, step: 1, value: 10, unit: 'kg' },
    { name: 'angle', label: 'Force Angle', min: 0, max: 90, step: 1, value: 0, unit: '\u00B0' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
