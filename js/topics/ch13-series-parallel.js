// Chapter 13: Series & Parallel Circuits — Resistor Configurations
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'series-parallel';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;

    // Electrons
    let electrons = [];
    const numElectrons = 40;

    function initElectrons() {
      electrons = [];
      for (let i = 0; i < numElectrons; i++) {
        electrons.push({
          t: Math.random(),
          branch: Math.floor(Math.random() * 3), // for parallel: which branch
          offset: (Math.random() - 0.5) * 4
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

    function drawZigzag(x, y, w, label, color) {
      const zigN = 4;
      const zigH = 6;
      p.stroke(color);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = color;
      for (let i = 0; i < zigN; i++) {
        const x1 = x + i * (w / zigN);
        const x2 = x + (i + 0.5) * (w / zigN);
        const x3 = x + (i + 1) * (w / zigN);
        p.line(x1, y, x2, y + (i % 2 === 0 ? -zigH : zigH));
        p.line(x2, y + (i % 2 === 0 ? -zigH : zigH), x3, y);
      }
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(color);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(label, x + w / 2, y - 10);
    }

    function getSeriesWirePoint(t, cx, cy) {
      // Series circuit: rectangular loop with 3 resistors on top
      const hw = 200, hh = 100;
      const perimeter = 2 * (hw * 2 + hh * 2);
      const dist = t * perimeter;

      if (dist < hw * 2) {
        return { x: cx - hw + dist, y: cy + hh };
      }
      const d1 = dist - hw * 2;
      if (d1 < hh * 2) {
        return { x: cx + hw, y: cy + hh - d1 };
      }
      const d2 = d1 - hh * 2;
      if (d2 < hw * 2) {
        return { x: cx + hw - d2, y: cy - hh };
      }
      const d3 = d2 - hw * 2;
      return { x: cx - hw, y: cy - hh + d3 };
    }

    p.draw = () => {
      p.background(10, 10, 26);

      if (engine.isPlaying) time += 0.016 * engine.speed;

      const r1 = engine.getParam('r1');
      const r2 = engine.getParam('r2');
      const r3 = engine.getParam('r3');
      const V = engine.getParam('voltage');
      const mode = engine.getParam('mode');
      const isSeries = mode < 0.5;

      // Physics
      let Req, I, I1, I2, I3, V1, V2, V3;
      if (isSeries) {
        Req = r1 + r2 + r3;
        I = V / Req;
        I1 = I2 = I3 = I;
        V1 = I * r1;
        V2 = I * r2;
        V3 = I * r3;
      } else {
        Req = 1 / (1 / r1 + 1 / r2 + 1 / r3);
        I = V / Req;
        I1 = V / r1;
        I2 = V / r2;
        I3 = V / r3;
        V1 = V2 = V3 = V;
      }

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text(isSeries ? 'Series Circuit: R_eq = R₁ + R₂ + R₃' : 'Parallel Circuit: 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃', width / 2, 10);

      const cx = width * 0.42;
      const cy = height * 0.5;

      if (isSeries) {
        // --- SERIES LAYOUT ---
        const hw = 200, hh = 80;

        // Draw main wire loop
        p.noFill();
        p.stroke(80, 80, 110);
        p.strokeWeight(2);
        // Bottom wire
        p.line(cx - hw, cy + hh, cx + hw, cy + hh);
        // Left wire
        p.line(cx - hw, cy - hh, cx - hw, cy + hh);
        // Right wire
        p.line(cx + hw, cy - hh, cx + hw, cy + hh);
        // Top wire (segments between resistors)
        p.line(cx - hw, cy - hh, cx - hw + 60, cy - hh);
        p.line(cx - hw + 130, cy - hh, cx - 35, cy - hh);
        p.line(cx + 35, cy - hh, cx + hw - 130, cy - hh);
        p.line(cx + hw - 60, cy - hh, cx + hw, cy - hh);

        // Resistors on top
        drawZigzag(cx - hw + 60, cy - hh, 70, r1 + 'Ω', '#ff6b6b');
        drawZigzag(cx - 35, cy - hh, 70, r2 + 'Ω', '#4ecdc4');
        drawZigzag(cx + hw - 130, cy - hh, 70, r3 + 'Ω', '#ffd93d');

        // Voltage drops
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.fill(255, 107, 107);
        p.text(V1.toFixed(2) + 'V', cx - hw + 95, cy - hh + 12);
        p.fill(78, 205, 196);
        p.text(V2.toFixed(2) + 'V', cx, cy - hh + 12);
        p.fill(255, 217, 61);
        p.text(V3.toFixed(2) + 'V', cx + hw - 95, cy - hh + 12);

        // Battery at bottom
        p.stroke(255, 200, 50);
        p.strokeWeight(3);
        p.line(cx - 10, cy + hh - 10, cx - 10, cy + hh + 10);
        p.strokeWeight(2);
        p.line(cx + 4, cy + hh - 5, cx + 4, cy + hh + 5);
        p.noStroke();
        p.fill(255, 200, 50);
        p.textSize(10);
        p.textAlign(p.CENTER, p.TOP);
        p.text(V.toFixed(0) + 'V', cx, cy + hh + 14);

        // Animate electrons
        const speed = I * 0.05;
        for (const e of electrons) {
          if (engine.isPlaying) {
            e.t += speed * 0.016 * engine.speed;
            if (e.t > 1) e.t -= 1;
          }
          const pt = getSeriesWirePoint(e.t, cx, cy);
          p.drawingContext.shadowBlur = 8;
          p.drawingContext.shadowColor = '#8b5cf6';
          p.fill(139, 92, 246);
          p.noStroke();
          p.ellipse(pt.x, pt.y + e.offset, 5, 5);
          p.drawingContext.shadowBlur = 0;
        }

      } else {
        // --- PARALLEL LAYOUT ---
        const hw = 180, topY = cy - 100, botY = cy + 100;
        const branchYs = [cy - 50, cy, cy + 50];

        // Top and bottom bus bars
        p.stroke(80, 80, 110);
        p.strokeWeight(3);
        p.line(cx - hw, topY, cx + 60, topY);
        p.line(cx - hw, botY, cx + 60, botY);

        // Left and right verticals
        p.line(cx - hw, topY, cx - hw, botY);
        p.line(cx + 60, topY, cx + 60, botY);

        // Three parallel branches
        const colors = ['#ff6b6b', '#4ecdc4', '#ffd93d'];
        const resistances = [r1, r2, r3];
        const currents = [I1, I2, I3];

        for (let b = 0; b < 3; b++) {
          const by = branchYs[b];
          // Wire segments
          p.stroke(80, 80, 110);
          p.strokeWeight(2);
          p.line(cx - hw, by, cx - hw + 50, by);
          p.line(cx - hw + 120, by, cx + 60, by);

          // Connect to bus bars
          p.line(cx - hw, topY, cx - hw, botY);
          p.line(cx + 60, topY, cx + 60, botY);

          // Resistor
          drawZigzag(cx - hw + 50, by, 70, resistances[b] + 'Ω', colors[b]);

          // Current label
          p.noStroke();
          p.fill(colors[b]);
          p.textSize(9);
          p.textAlign(p.LEFT, p.CENTER);
          p.text('I' + (b + 1) + '=' + (currents[b] * 1000).toFixed(1) + 'mA', cx + 70, by);
        }

        // Battery on left
        const batX = cx - hw - 30;
        const batY = cy;
        p.stroke(80, 80, 110);
        p.strokeWeight(2);
        p.line(cx - hw, topY, batX, topY);
        p.line(batX, topY, batX, cy - 10);
        p.line(batX, cy + 10, batX, botY);
        p.line(batX, botY, cx - hw, botY);

        p.stroke(255, 200, 50);
        p.strokeWeight(3);
        p.line(batX - 6, cy - 10, batX + 6, cy - 10);
        p.strokeWeight(2);
        p.line(batX - 3, cy + 6, batX + 3, cy + 6);
        p.noStroke();
        p.fill(255, 200, 50);
        p.textSize(10);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text(V.toFixed(0) + 'V', batX - 10, batY);

        // Animate electrons in branches
        const speeds = [I1 * 0.05, I2 * 0.05, I3 * 0.05];
        for (const e of electrons) {
          if (engine.isPlaying) {
            e.t += speeds[e.branch % 3] * 0.016 * engine.speed;
            if (e.t > 1) e.t -= 1;
          }
          const b = e.branch % 3;
          const by = branchYs[b];
          const px = cx - hw + e.t * (hw + 60 + hw);
          // Constrain to branch area
          const ex = cx - hw + e.t * (60 + hw);
          p.drawingContext.shadowBlur = 8;
          p.drawingContext.shadowColor = '#8b5cf6';
          p.fill(139, 92, 246);
          p.noStroke();
          p.ellipse(ex, by + e.offset, 5, 5);
          p.drawingContext.shadowBlur = 0;
        }
      }

      // Info panel
      const panelX = width - 220;
      const panelY = 55;
      p.fill(20, 20, 40, 220);
      p.stroke(139, 92, 246, 80);
      p.strokeWeight(1);
      p.rect(panelX, panelY, 210, 195, 8);

      p.noStroke();
      p.fill(139, 92, 246);
      p.textSize(13);
      p.textAlign(p.LEFT, p.TOP);
      p.text(isSeries ? 'Series Circuit' : 'Parallel Circuit', panelX + 10, panelY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      const infoLines = isSeries ? [
        'R₁ = ' + r1 + ' Ω',
        'R₂ = ' + r2 + ' Ω',
        'R₃ = ' + r3 + ' Ω',
        '',
        'R_eq = R₁+R₂+R₃',
        'R_eq = ' + Req.toFixed(1) + ' Ω',
        '',
        'I = V/R_eq = ' + (I * 1000).toFixed(2) + ' mA',
        'V₁ = ' + V1.toFixed(2) + ' V',
        'V₂ = ' + V2.toFixed(2) + ' V',
        'V₃ = ' + V3.toFixed(2) + ' V'
      ] : [
        'R₁ = ' + r1 + ' Ω',
        'R₂ = ' + r2 + ' Ω',
        'R₃ = ' + r3 + ' Ω',
        '',
        '1/R_eq = 1/R₁+1/R₂+1/R₃',
        'R_eq = ' + Req.toFixed(2) + ' Ω',
        '',
        'I_total = ' + (I * 1000).toFixed(2) + ' mA',
        'I₁ = ' + (I1 * 1000).toFixed(2) + ' mA',
        'I₂ = ' + (I2 * 1000).toFixed(2) + ' mA',
        'I₃ = ' + (I3 * 1000).toFixed(2) + ' mA'
      ];

      for (let i = 0; i < infoLines.length; i++) {
        p.fill(i >= 4 ? p.color(139, 92, 246) : p.color(200, 200, 220));
        p.text(infoLines[i], panelX + 10, panelY + 28 + i * 15);
      }

      // Mode indicator
      p.fill(139, 92, 246, 150);
      p.textSize(12);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Mode: ' + (isSeries ? 'SERIES (mode=0)' : 'PARALLEL (mode=1)') + '  |  Adjust mode slider to switch', width / 2, height - 8);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { r1: 30, r2: 50, r3: 70, voltage: 9, mode: 0 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'r1', label: 'Resistor R₁', min: 10, max: 100, step: 5, value: 30, unit: 'Ω' },
    { name: 'r2', label: 'Resistor R₂', min: 10, max: 100, step: 5, value: 50, unit: 'Ω' },
    { name: 'r3', label: 'Resistor R₃', min: 10, max: 100, step: 5, value: 70, unit: 'Ω' },
    { name: 'voltage', label: 'Voltage', min: 1, max: 12, step: 0.5, value: 9, unit: 'V' },
    { name: 'mode', label: 'Mode (0=Series, 1=Parallel)', min: 0, max: 1, step: 1, value: 0, unit: '' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
