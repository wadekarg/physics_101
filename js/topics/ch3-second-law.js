// Chapter 3: Newton's Second Law — F = ma Explorer
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'newtons-second-law';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Block state
    let blockX = 80;
    let blockVx = 0;
    let blockAx = 0;
    let simTime = 0;
    let trail = [];
    let accHistory = [];
    let applying = false;

    const surfaceY = 250;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 500;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);
      const force = engine.getParam('force');
      const mass = engine.getParam('mass');

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text("Newton's Second Law: F = ma", width / 2, 8);

      p.textSize(11);
      p.fill(200, 200, 220, 150);
      p.text('Click and hold to apply force | Watch acceleration change with mass', width / 2, 28);

      // Calculate acceleration
      blockAx = applying ? force / mass : 0;

      // Physics update
      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        simTime += dt;

        blockVx += blockAx * dt;
        blockX += blockVx * 60 * dt;

        // Wrap
        if (blockX > width + 50) {
          blockX = -50;
          trail = [];
        }

        trail.push({ x: blockX, v: blockVx, t: simTime });
        if (trail.length > 150) trail.shift();

        accHistory.push({ t: simTime, a: blockAx });
        if (accHistory.length > 200) accHistory.shift();
      }

      // Surface
      p.stroke(0, 255, 136, 80);
      p.strokeWeight(2);
      p.line(0, surfaceY, width, surfaceY);

      p.fill(20, 25, 20);
      p.noStroke();
      p.rect(0, surfaceY, width, 10);

      // Trail
      for (let i = 0; i < trail.length; i++) {
        const alpha = (i / trail.length) * 100;
        p.noStroke();
        p.fill(0, 180, 216, alpha);
        p.ellipse(trail[i].x + 25, surfaceY, 3, 3);
      }

      // Block - size scales with mass
      const blockW = 30 + mass * 0.6;
      const blockH = 30 + mass * 0.4;
      const blockY = surfaceY - blockH;

      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(0, 130, 180);
      p.stroke(0, 180, 216);
      p.strokeWeight(1);
      p.rect(blockX, blockY, blockW, blockH, 4);
      p.drawingContext.shadowBlur = 0;

      // Mass label
      p.noStroke();
      p.fill(255, 255, 255, 220);
      p.textSize(Math.max(10, 14 - mass * 0.1));
      p.textAlign(p.CENTER, p.CENTER);
      p.text(mass.toFixed(0) + ' kg', blockX + blockW / 2, blockY + blockH / 2);

      // Force arrow
      if (applying) {
        const fLen = Math.min(force * 1.5, 150);
        p.stroke(0, 255, 136);
        p.strokeWeight(3);
        p.drawingContext.shadowBlur = 12;
        p.drawingContext.shadowColor = '#00ff88';
        const arrowY = blockY + blockH / 2;
        p.line(blockX + blockW, arrowY, blockX + blockW + fLen, arrowY);
        p.line(blockX + blockW + fLen, arrowY, blockX + blockW + fLen - 10, arrowY - 6);
        p.line(blockX + blockW + fLen, arrowY, blockX + blockW + fLen - 10, arrowY + 6);
        p.drawingContext.shadowBlur = 0;

        // Force label
        p.noStroke();
        p.fill(0, 255, 136);
        p.textSize(12);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text('F = ' + force.toFixed(0) + ' N', blockX + blockW + fLen / 2, arrowY - 10);
      }

      // Acceleration arrow
      if (Math.abs(blockAx) > 0.01) {
        const aLen = Math.min(Math.abs(blockAx) * 8, 80);
        const aDir = blockAx > 0 ? 1 : -1;
        p.stroke(255, 100, 100);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = '#ff6464';
        const aaY = blockY - 15;
        p.line(blockX + blockW / 2, aaY, blockX + blockW / 2 + aLen * aDir, aaY);
        p.line(blockX + blockW / 2 + aLen * aDir, aaY, blockX + blockW / 2 + aLen * aDir - aDir * 6, aaY - 4);
        p.line(blockX + blockW / 2 + aLen * aDir, aaY, blockX + blockW / 2 + aLen * aDir - aDir * 6, aaY + 4);
        p.drawingContext.shadowBlur = 0;

        p.noStroke();
        p.fill(255, 100, 100);
        p.textSize(11);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text('a = ' + blockAx.toFixed(2) + ' m/s\u00B2', blockX + blockW / 2, aaY - 5);
      }

      // === F = ma display ===
      const eqY = 55;
      p.fill(15, 15, 35, 230);
      p.stroke(139, 92, 246, 80);
      p.strokeWeight(1);
      p.rect(20, eqY, width - 40, 58, 10);

      p.noStroke();
      p.textSize(22);
      p.textAlign(p.CENTER, p.CENTER);

      // F
      p.fill(0, 255, 136);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#00ff88';
      p.text('F', width / 2 - 80, eqY + 25);
      p.drawingContext.shadowBlur = 0;

      p.fill(255, 255, 255, 200);
      p.text('=', width / 2 - 40, eqY + 25);

      // m
      p.fill(0, 180, 216);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#00b4d8';
      p.text('m', width / 2, eqY + 25);
      p.drawingContext.shadowBlur = 0;

      p.fill(255, 255, 255, 200);
      p.text('\u00D7', width / 2 + 35, eqY + 25);

      // a
      p.fill(255, 100, 100);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#ff6464';
      p.text('a', width / 2 + 70, eqY + 25);
      p.drawingContext.shadowBlur = 0;

      // Values
      p.textSize(13);
      p.fill(0, 255, 136);
      p.text(force.toFixed(0) + 'N', width / 2 - 80, eqY + 48);
      p.fill(0, 180, 216);
      p.text(mass.toFixed(0) + 'kg', width / 2, eqY + 48);
      p.fill(255, 100, 100);
      p.text(blockAx.toFixed(2) + 'm/s\u00B2', width / 2 + 80, eqY + 48);

      // === Comparison display ===
      const compY = surfaceY + 25;
      p.fill(15, 15, 35, 230);
      p.stroke(60, 60, 90, 80);
      p.strokeWeight(1);
      p.rect(20, compY, width - 40, 130, 10);

      p.noStroke();
      p.fill(255, 255, 255, 180);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Comparison: Same Force, Different Masses', 35, compY + 8);

      // Show 3 blocks with same force but different masses
      const masses = [5, mass, 50];
      const labels = ['5 kg', mass.toFixed(0) + ' kg (yours)', '50 kg'];
      const colors = ['#ffaa00', '#00b4d8', '#ff44aa'];

      masses.forEach((m, i) => {
        const accel = force / m;
        const barMaxW = width - 200;
        const barW = (accel / (force / 1)) * barMaxW; // normalize to mass=1
        const barY = compY + 30 + i * 32;
        const barH = 20;

        // Background
        p.fill(25, 25, 45);
        p.noStroke();
        p.rect(120, barY, barMaxW, barH, 3);

        // Bar
        p.drawingContext.shadowBlur = 6;
        p.drawingContext.shadowColor = colors[i];
        p.fill(colors[i]);
        p.rect(120, barY, Math.min(barW, barMaxW), barH, 3);
        p.drawingContext.shadowBlur = 0;

        // Label
        p.fill(200, 200, 220);
        p.textSize(10);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text(labels[i], 115, barY + barH / 2);

        // Accel value
        p.fill(colors[i]);
        p.textAlign(p.LEFT, p.CENTER);
        p.text('a = ' + accel.toFixed(2) + ' m/s\u00B2', Math.min(barW, barMaxW) + 125, barY + barH / 2);
      });

      // Velocity display
      p.fill(200, 200, 220);
      p.textSize(11);
      p.textAlign(p.LEFT, p.BOTTOM);
      p.text('v = ' + blockVx.toFixed(2) + ' m/s     t = ' + simTime.toFixed(1) + ' s', 25, surfaceY - 5);

      // Key insight
      p.fill(139, 92, 246, 180);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Greater mass = greater inertia = less acceleration for the same force', width / 2, height - 5);
    };

    p.mousePressed = () => {
      if (p.mouseX >= 0 && p.mouseX <= width && p.mouseY >= 0 && p.mouseY <= height) {
        applying = true;
      }
    };

    p.mouseReleased = () => {
      applying = false;
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { force: 30, mass: 10 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'force', label: 'Applied Force', min: 1, max: 100, step: 1, value: 30, unit: 'N' },
    { name: 'mass', label: 'Mass', min: 1, max: 50, step: 1, value: 10, unit: 'kg' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
