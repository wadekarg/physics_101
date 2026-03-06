// Chapter 13: Ohm's Law — V = IR Interactive Triangle
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'ohms-law';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;

    // Electrons for animation
    let electrons = [];
    const numElectrons = 30;

    function initElectrons() {
      electrons = [];
      for (let i = 0; i < numElectrons; i++) {
        electrons.push({
          t: Math.random(), // position along wire (0 to 1)
          offset: (Math.random() - 0.5) * 6
        });
      }
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      p.textFont('monospace');
      initElectrons();
    };

    // Wire path: rectangular circuit
    function getWirePoint(t) {
      // t from 0 to 1, path is a rectangle
      const cx = width * 0.42;
      const cy = height * 0.55;
      const hw = 160; // half width
      const hh = 90;  // half height

      const perimeter = 2 * (hw * 2 + hh * 2);
      const dist = t * perimeter;

      // Bottom: left to right
      if (dist < hw * 2) {
        return { x: cx - hw + dist, y: cy + hh, nx: 0, ny: 1 };
      }
      const d1 = dist - hw * 2;
      // Right: bottom to top
      if (d1 < hh * 2) {
        return { x: cx + hw, y: cy + hh - d1, nx: 1, ny: 0 };
      }
      const d2 = d1 - hh * 2;
      // Top: right to left
      if (d2 < hw * 2) {
        return { x: cx + hw - d2, y: cy - hh, nx: 0, ny: -1 };
      }
      const d3 = d2 - hw * 2;
      // Left: top to bottom
      return { x: cx - hw, y: cy - hh + d3, nx: -1, ny: 0 };
    }

    p.draw = () => {
      p.background(10, 10, 26);

      const V = engine.getParam('voltage');
      const R = engine.getParam('resistance');
      const I = V / R; // Amps

      if (engine.isPlaying) time += 0.016 * engine.speed;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text("Ohm's Law: V = I × R", width / 2, 10);

      // --- Ohm's Law Triangle ---
      const triCX = width - 140;
      const triCY = 140;
      const triR = 65;

      // Outer glow circle
      p.noFill();
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#8b5cf6';
      p.stroke(139, 92, 246, 100);
      p.strokeWeight(2);
      p.ellipse(triCX, triCY, triR * 2 + 10, triR * 2 + 10);
      p.drawingContext.shadowBlur = 0;

      // Dividing line
      p.stroke(139, 92, 246, 120);
      p.strokeWeight(1);
      p.line(triCX - triR, triCY, triCX + triR, triCY);

      // V on top
      p.noStroke();
      p.fill(255, 200, 50);
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#ffc832';
      p.textSize(24);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('V', triCX, triCY - triR / 2);
      p.drawingContext.shadowBlur = 0;

      // I on bottom-left, R on bottom-right
      p.fill(0, 255, 136);
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#00ff88';
      p.text('I', triCX - triR / 2.2, triCY + triR / 2.5);
      p.drawingContext.shadowBlur = 0;

      p.fill(255, 100, 100);
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#ff6464';
      p.text('R', triCX + triR / 2.2, triCY + triR / 2.5);
      p.drawingContext.shadowBlur = 0;

      // Multiplication sign
      p.fill(139, 92, 246);
      p.textSize(16);
      p.text('×', triCX, triCY + triR / 2.5);

      // Values below triangle
      p.textSize(12);
      p.textAlign(p.CENTER, p.TOP);
      p.fill(255, 200, 50);
      p.text('V = ' + V.toFixed(1) + ' V', triCX, triCY + triR + 15);
      p.fill(0, 255, 136);
      p.text('I = ' + (I * 1000).toFixed(1) + ' mA', triCX, triCY + triR + 32);
      p.fill(255, 100, 100);
      p.text('R = ' + R.toFixed(0) + ' Ω', triCX, triCY + triR + 49);

      // --- Circuit Diagram ---
      const cx = width * 0.42;
      const cy = height * 0.55;
      const hw = 160;
      const hh = 90;

      // Draw wire path
      p.noFill();
      p.stroke(100, 100, 130);
      p.strokeWeight(3);
      p.rect(cx - hw, cy - hh, hw * 2, hh * 2, 8);

      // Battery on bottom
      const batX = cx;
      const batY = cy + hh;
      p.stroke(255, 200, 50);
      p.strokeWeight(3);
      p.line(batX - 10, batY - 10, batX - 10, batY + 10);
      p.strokeWeight(2);
      p.line(batX + 4, batY - 5, batX + 4, batY + 5);
      p.noStroke();
      p.fill(255, 200, 50);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text(V.toFixed(1) + 'V', batX, batY + 14);
      p.textSize(8);
      p.text('+', batX - 16, batY - 6);
      p.text('−', batX + 10, batY - 6);

      // Resistor on top (zigzag)
      const resX = cx;
      const resY = cy - hh;
      const zigW = 40;
      const zigH = 8;
      const zigN = 5;
      p.stroke(255, 100, 100);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#ff6464';
      p.line(resX - zigW - 10, resY, resX - zigW, resY);
      for (let i = 0; i < zigN; i++) {
        const x1 = resX - zigW + i * (zigW * 2 / zigN);
        const x2 = resX - zigW + (i + 0.5) * (zigW * 2 / zigN);
        const x3 = resX - zigW + (i + 1) * (zigW * 2 / zigN);
        p.line(x1, resY, x2, resY + (i % 2 === 0 ? -zigH : zigH));
        p.line(x2, resY + (i % 2 === 0 ? -zigH : zigH), x3, resY);
      }
      p.line(resX + zigW, resY, resX + zigW + 10, resY);
      p.drawingContext.shadowBlur = 0;

      p.noStroke();
      p.fill(255, 100, 100);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(R.toFixed(0) + 'Ω', resX, resY - 12);

      // Animate electrons
      const speed = I * 0.15; // Scale visual speed with current
      for (const e of electrons) {
        if (engine.isPlaying) {
          e.t += speed * 0.016 * engine.speed;
          if (e.t > 1) e.t -= 1;
          if (e.t < 0) e.t += 1;
        }

        const pt = getWirePoint(e.t);
        const ex = pt.x + pt.ny * e.offset;
        const ey = pt.y - pt.nx * e.offset;

        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = '#8b5cf6';
        p.fill(139, 92, 246);
        p.noStroke();
        p.ellipse(ex, ey, 6, 6);
        p.drawingContext.shadowBlur = 0;
      }

      // Current direction arrow
      p.fill(0, 255, 136, 180);
      p.textSize(11);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('I →', cx + hw + 8, cy);

      // Ammeter reading
      p.fill(20, 20, 40, 220);
      p.stroke(139, 92, 246, 80);
      p.strokeWeight(1);
      p.rect(10, height - 80, 200, 75, 8);

      p.noStroke();
      p.fill(139, 92, 246);
      p.textSize(13);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Measurements', 22, height - 74);
      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('V = ' + V.toFixed(2) + ' V', 22, height - 55);
      p.text('I = V/R = ' + (I * 1000).toFixed(2) + ' mA', 22, height - 38);
      p.text('P = VI = ' + (V * I * 1000).toFixed(2) + ' mW', 22, height - 21);

      // Bottom label
      p.fill(139, 92, 246, 150);
      p.textSize(13);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('V = IR   |   I = V/R   |   R = V/I   |   P = VI', width / 2, height - 8);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { voltage: 6, resistance: 50 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'voltage', label: 'Voltage', min: 0, max: 12, step: 0.5, value: 6, unit: 'V' },
    { name: 'resistance', label: 'Resistance', min: 1, max: 100, step: 1, value: 50, unit: 'Ω' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
