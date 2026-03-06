// Electromagnets & Motors — Solenoid with field lines
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'electromagnets';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let electronOffset = 0;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
    };

    p.draw = () => {
      p.background(10, 10, 26);
      const turns = Math.round(engine.getParam('turns'));
      const current = engine.getParam('current');
      const fieldStrength = turns * current;

      const cx = width / 2, cy = height / 2;
      const solenoidW = width * 0.5;
      const solenoidH = 80;
      const sx = cx - solenoidW / 2;
      const sy = cy - solenoidH / 2;

      // Draw magnetic field lines inside solenoid (straight, parallel)
      const numLines = 5;
      const lineAlpha = Math.min(fieldStrength * 3, 200);
      for (let i = 0; i < numLines; i++) {
        const y = sy + 15 + (i / (numLines - 1)) * (solenoidH - 30);
        // Inside: straight lines
        p.stroke(139, 92, 246, lineAlpha);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 6;
        p.drawingContext.shadowColor = 'rgba(139, 92, 246, 0.5)';

        // Arrow showing direction (right = N pole direction)
        p.line(sx - 40, y, sx + solenoidW + 40, y);

        // Arrowhead
        const ax = sx + solenoidW + 35;
        p.line(ax, y, ax - 8, y - 5);
        p.line(ax, y, ax - 8, y + 5);
        p.drawingContext.shadowBlur = 0;
      }

      // Outside field lines (curved, returning from N to S)
      for (let i = 0; i < 3; i++) {
        const spread = 60 + i * 40;
        p.noFill();
        p.stroke(139, 92, 246, lineAlpha * 0.5);
        p.strokeWeight(1.5);
        p.beginShape();
        for (let t = 0; t <= 1; t += 0.05) {
          const angle = Math.PI * t;
          const fx = cx + (solenoidW / 2 + 30) * Math.cos(angle);
          const fy = cy - spread * Math.sin(angle);
          p.vertex(fx, fy);
        }
        p.endShape();
        p.beginShape();
        for (let t = 0; t <= 1; t += 0.05) {
          const angle = Math.PI * t;
          const fx = cx + (solenoidW / 2 + 30) * Math.cos(angle);
          const fy = cy + spread * Math.sin(angle);
          p.vertex(fx, fy);
        }
        p.endShape();
      }

      // Draw solenoid coils
      if (engine.isPlaying) electronOffset += engine.speed * current * 2;
      const spacing = solenoidW / turns;
      for (let i = 0; i < turns; i++) {
        const x = sx + i * spacing + spacing / 2;
        // Coil shape
        p.stroke(200, 160, 50);
        p.strokeWeight(3);
        p.noFill();
        p.ellipse(x, cy, 14, solenoidH);

        // Electron flow dots
        if (current > 0) {
          const ePos = (electronOffset + i * 50) % (solenoidH + 40);
          const eY = sy - 20 + ePos;
          if (eY > sy - 5 && eY < sy + solenoidH + 5) {
            p.fill(0, 255, 136);
            p.noStroke();
            p.ellipse(x + 7, eY, 5, 5);
          }
        }
      }

      // Core
      p.fill(60, 60, 90, 150);
      p.noStroke();
      p.rect(sx + 10, cy - 10, solenoidW - 20, 20, 4);

      // N and S poles
      p.textSize(20);
      p.textAlign(p.CENTER);
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#ff4466';
      p.fill(255, 68, 102);
      p.text('N', sx + solenoidW + 60, cy + 6);
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(0, 180, 216);
      p.text('S', sx - 45, cy + 6);
      p.drawingContext.shadowBlur = 0;

      // Info
      p.fill(255, 255, 255, 200);
      p.textSize(13);
      p.textAlign(p.LEFT);
      p.text(`Turns: ${turns}`, 15, 25);
      p.text(`Current: ${current.toFixed(1)} A`, 15, 45);
      p.text(`Field Strength ∝ nI: ${fieldStrength.toFixed(1)} (relative)`, 15, 65);

      // Formula
      p.fill(139, 92, 246);
      p.textSize(14);
      p.textAlign(p.CENTER);
      p.text('B = μ₀ · n · I', cx, height - 32);
      p.fill(255, 255, 255, 100);
      p.textSize(11);
      p.text('More turns + more current = stronger magnetic field', cx, height - 12);
    };

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, { turns: 15, current: 2 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'turns', label: 'Number of Turns', min: 5, max: 50, step: 1, value: 15, unit: '' },
    { name: 'current', label: 'Current', min: 0.1, max: 5, step: 0.1, value: 2, unit: 'A' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
