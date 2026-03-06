// Faraday's Law — Magnet moving through a coil
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'faradays-law';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let magnetX, magnetDir = 1, emfHistory = [], time = 0;
    let isDragging = false;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      magnetX = width * 0.2;
    };

    engine.onReset(() => { magnetX = width * 0.2; emfHistory = []; time = 0; });

    p.draw = () => {
      p.background(10, 10, 26);
      const speed = engine.getParam('magnetSpeed');
      const coilTurns = Math.round(engine.getParam('coilTurns'));
      const strength = engine.getParam('magnetStrength');

      const coilX = width / 2;
      const coilY = height / 2 - 30;
      const coilW = 60;
      const coilH = 120;

      // Animate magnet
      if (engine.isPlaying && !isDragging) {
        const dt = (1 / 60) * engine.speed;
        time += dt;
        magnetX += magnetDir * speed * 40 * dt;
        if (magnetX > width - 80) { magnetDir = -1; }
        if (magnetX < 80) { magnetDir = 1; }
      }

      // Dragging
      if (isDragging) {
        magnetX = p.constrain(p.mouseX, 60, width - 60);
      }

      // Calculate EMF (proportional to rate of change of flux)
      const distFromCoil = magnetX - coilX;
      const fluxGaussian = strength * Math.exp(-distFromCoil * distFromCoil / (4000));
      const dFluxDx = -distFromCoil / 2000 * fluxGaussian;
      const velocity = engine.isPlaying ? magnetDir * speed * 40 : 0;
      const emf = -coilTurns * dFluxDx * velocity * 0.1;

      emfHistory.push({ t: time, v: emf });
      if (emfHistory.length > 300) emfHistory.shift();

      // Draw coil
      p.stroke(200, 160, 50);
      p.strokeWeight(3);
      p.noFill();
      for (let i = 0; i < Math.min(coilTurns, 20); i++) {
        const offset = (i - Math.min(coilTurns, 20) / 2) * 3;
        p.rect(coilX - coilW / 2 + offset, coilY - coilH / 2, coilW, coilH, 4);
      }

      // Current flow indicator
      if (Math.abs(emf) > 0.1) {
        const currentAlpha = Math.min(Math.abs(emf) * 30, 255);
        p.fill(0, 255, 136, currentAlpha);
        p.noStroke();
        const arrowDir = emf > 0 ? 1 : -1;
        // Arrows on coil
        for (let i = 0; i < 4; i++) {
          const ay = coilY - coilH / 2 + (i + 0.5) * (coilH / 4);
          const ax = coilX + coilW / 2 + 15;
          p.triangle(ax, ay, ax - 6, ay - 4 * arrowDir, ax + 6, ay - 4 * arrowDir);
        }
      }

      // Draw magnet
      const magnetW = 80, magnetH = 40;
      const my = coilY;

      // N pole (red)
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#ff4466';
      p.fill(200, 50, 50);
      p.noStroke();
      p.rect(magnetX - magnetW / 2, my - magnetH / 2, magnetW / 2, magnetH, 6, 0, 0, 6);
      p.fill(255);
      p.textSize(16);
      p.textAlign(p.CENTER);
      p.text('N', magnetX - magnetW / 4, my + 6);

      // S pole (blue)
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(50, 50, 200);
      p.rect(magnetX, my - magnetH / 2, magnetW / 2, magnetH, 0, 6, 6, 0);
      p.fill(255);
      p.text('S', magnetX + magnetW / 4, my + 6);
      p.drawingContext.shadowBlur = 0;

      // Field lines from magnet
      p.noFill();
      for (let i = -1; i <= 1; i++) {
        const lY = my + i * 12;
        p.stroke(139, 92, 246, 60);
        p.strokeWeight(1);
        p.beginShape();
        for (let dx = -50; dx <= 50; dx += 5) {
          p.vertex(magnetX + dx, lY + Math.sin(dx * 0.05) * 5);
        }
        p.endShape();
      }

      // EMF graph at bottom
      const gx = 40, gy = height - 150, gw = width - 80, gh = 100;
      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.line(gx, gy, gx + gw, gy);
      p.line(gx, gy - gh / 2, gx + gw, gy - gh / 2);
      p.line(gx, gy + gh / 2, gx + gw, gy + gh / 2);
      p.line(gx, gy - gh / 2, gx, gy + gh / 2);

      p.fill(255, 255, 255, 100);
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.RIGHT);
      p.text('EMF +', gx - 5, gy - gh / 2 + 4);
      p.text('0', gx - 5, gy + 4);
      p.text('EMF -', gx - 5, gy + gh / 2 + 4);
      p.textAlign(p.CENTER);
      p.text('Time →', gx + gw / 2, gy + gh / 2 + 15);

      // Plot EMF
      if (emfHistory.length > 1) {
        p.stroke(0, 255, 136);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 4;
        p.drawingContext.shadowColor = '#00ff88';
        p.noFill();
        p.beginShape();
        for (let i = 0; i < emfHistory.length; i++) {
          const px = gx + (i / 300) * gw;
          const py = gy - (emfHistory[i].v / 10) * (gh / 2);
          p.vertex(px, p.constrain(py, gy - gh / 2, gy + gh / 2));
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      }

      // Info
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(13);
      p.textAlign(p.LEFT);
      p.text(`Induced EMF: ${emf.toFixed(2)} V`, 15, 25);
      p.text(`Coil turns: ${coilTurns}`, 15, 45);
      p.text(`Magnet strength: ${strength.toFixed(1)} T`, 15, 65);

      p.fill(139, 92, 246);
      p.textSize(12);
      p.text('EMF = -N × dΦ/dt  (Faraday\'s Law)', 15, 85);

      if (!engine.isPlaying && !isDragging) {
        p.fill(255, 255, 255, 100);
        p.textSize(13);
        p.textAlign(p.CENTER);
        p.text('Drag the magnet through the coil!', width / 2, 120);
      }
    };

    p.mousePressed = () => {
      const my = height / 2 - 30;
      if (Math.abs(p.mouseX - magnetX) < 50 && Math.abs(p.mouseY - my) < 30) {
        isDragging = true;
      }
    };
    p.mouseReleased = () => { isDragging = false; };

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, { magnetSpeed: 3, coilTurns: 20, magnetStrength: 5 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'magnetSpeed', label: 'Magnet Speed', min: 1, max: 10, step: 0.5, value: 3, unit: 'm/s' },
    { name: 'coilTurns', label: 'Coil Turns', min: 5, max: 50, step: 1, value: 20, unit: '' },
    { name: 'magnetStrength', label: 'Magnet Strength', min: 1, max: 10, step: 0.5, value: 5, unit: 'T' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
