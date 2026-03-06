// Heat Engines & Entropy — Carnot cycle animation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'heat-engines';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let cyclePhase = 0; // 0-4 for the 4 Carnot steps
    let cycleProgress = 0;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
    };

    p.draw = () => {
      p.background(10, 10, 26);
      const Th = engine.getParam('tempHot');
      const Tc = engine.getParam('tempCold');
      const efficiency = 1 - Tc / Th;

      // PV diagram area
      const pvX = 40, pvY = 40, pvW = width * 0.45, pvH = height - 100;

      // Draw PV axes
      p.stroke(255, 255, 255, 80);
      p.strokeWeight(1);
      p.line(pvX, pvY, pvX, pvY + pvH);
      p.line(pvX, pvY + pvH, pvX + pvW, pvY + pvH);
      p.fill(255, 255, 255, 150);
      p.noStroke();
      p.textSize(12);
      p.textAlign(p.CENTER);
      p.text('Volume', pvX + pvW / 2, pvY + pvH + 30);
      p.push();
      p.translate(pvX - 25, pvY + pvH / 2);
      p.rotate(-p.HALF_PI);
      p.text('Pressure', 0, 0);
      p.pop();

      // Carnot cycle points
      const V1 = 0.15, V2 = 0.4, V3 = 0.75, V4 = 0.45;
      const P1 = 0.85, P2 = 0.55, P3 = 0.2, P4 = 0.4;

      const toScreenX = (v) => pvX + v * pvW;
      const toScreenY = (pr) => pvY + pvH - pr * pvH;

      // Draw Carnot cycle path
      const steps = 40;
      const paths = [
        [], // isothermal expansion (1→2)
        [], // adiabatic expansion (2→3)
        [], // isothermal compression (3→4)
        [], // adiabatic compression (4→1)
      ];

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        // Path 0: isothermal expansion at Th
        paths[0].push({ x: toScreenX(V1 + (V2 - V1) * t), y: toScreenY(P1 + (P2 - P1) * t + 0.05 * Math.sin(t * Math.PI)) });
        // Path 1: adiabatic expansion
        paths[1].push({ x: toScreenX(V2 + (V3 - V2) * t), y: toScreenY(P2 + (P3 - P2) * t - 0.03 * Math.sin(t * Math.PI)) });
        // Path 2: isothermal compression at Tc
        paths[2].push({ x: toScreenX(V3 + (V4 - V3) * t), y: toScreenY(P3 + (P4 - P3) * t - 0.04 * Math.sin(t * Math.PI)) });
        // Path 3: adiabatic compression
        paths[3].push({ x: toScreenX(V4 + (V1 - V4) * t), y: toScreenY(P4 + (P1 - P4) * t + 0.03 * Math.sin(t * Math.PI)) });
      }

      // Fill the cycle area
      p.fill(255, 170, 0, 25);
      p.noStroke();
      p.beginShape();
      for (const path of paths) for (const pt of path) p.vertex(pt.x, pt.y);
      p.endShape(p.CLOSE);

      // Draw cycle lines
      const colors = ['#ff4466', '#ffaa00', '#00b4d8', '#8b5cf6'];
      const labels = ['Isothermal Expansion', 'Adiabatic Expansion', 'Isothermal Compression', 'Adiabatic Compression'];
      paths.forEach((path, idx) => {
        p.stroke(colors[idx]);
        p.strokeWeight(idx === Math.floor(cyclePhase) ? 3 : 1.5);
        if (idx === Math.floor(cyclePhase)) {
          p.drawingContext.shadowBlur = 8;
          p.drawingContext.shadowColor = colors[idx];
        }
        p.noFill();
        p.beginShape();
        for (const pt of path) p.vertex(pt.x, pt.y);
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      });

      // Animate current position on cycle
      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        cycleProgress += dt * 0.5;
        if (cycleProgress >= 1) {
          cycleProgress = 0;
          cyclePhase = (cyclePhase + 1) % 4;
        }
      }

      const currentPath = paths[Math.floor(cyclePhase)];
      const ptIdx = Math.floor(cycleProgress * (currentPath.length - 1));
      const currentPt = currentPath[Math.min(ptIdx, currentPath.length - 1)];

      p.drawingContext.shadowBlur = 12;
      p.drawingContext.shadowColor = colors[Math.floor(cyclePhase)];
      p.fill(255);
      p.noStroke();
      p.ellipse(currentPt.x, currentPt.y, 12, 12);
      p.drawingContext.shadowBlur = 0;

      // Right side: engine diagram
      const engX = width * 0.55;
      const engW = width * 0.4;

      // Hot reservoir
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#ff4466';
      p.fill(255, 68, 102, 80);
      p.stroke(255, 68, 102);
      p.strokeWeight(2);
      p.rect(engX + engW * 0.15, 50, engW * 0.7, 60, 8);
      p.drawingContext.shadowBlur = 0;
      p.fill(255);
      p.noStroke();
      p.textSize(14);
      p.textAlign(p.CENTER);
      p.text(`Hot: ${Th}K`, engX + engW / 2, 85);

      // Cold reservoir
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(0, 180, 216, 80);
      p.stroke(0, 180, 216);
      p.strokeWeight(2);
      p.rect(engX + engW * 0.15, height - 120, engW * 0.7, 60, 8);
      p.drawingContext.shadowBlur = 0;
      p.fill(255);
      p.noStroke();
      p.text(`Cold: ${Tc}K`, engX + engW / 2, height - 85);

      // Engine box
      p.fill(40, 40, 70);
      p.stroke(255, 170, 0);
      p.strokeWeight(2);
      const boxY = 160, boxH = 100;
      p.rect(engX + engW * 0.25, boxY, engW * 0.5, boxH, 8);
      p.fill(255, 170, 0);
      p.noStroke();
      p.textSize(13);
      p.text('ENGINE', engX + engW / 2, boxY + 40);
      p.textSize(11);
      p.text(`W = Q_H - Q_C`, engX + engW / 2, boxY + 60);

      // Heat flow arrows
      const phase = Math.floor(cyclePhase);
      const arrowPulse = (Math.sin(p.millis() * 0.005) + 1) / 2;

      // Qh arrow (hot → engine)
      p.stroke(255, 68, 102, 150 + 100 * arrowPulse);
      p.strokeWeight(3);
      drawArrow(p, engX + engW / 2, 115, engX + engW / 2, boxY - 5);
      p.fill(255, 68, 102);
      p.noStroke();
      p.textSize(11);
      p.text('Q_H', engX + engW / 2 + 25, 140);

      // Work arrow (engine → right)
      p.stroke(255, 170, 0, 150 + 100 * arrowPulse);
      p.strokeWeight(3);
      drawArrow(p, engX + engW * 0.75 + 5, boxY + boxH / 2, engX + engW + 10, boxY + boxH / 2);
      p.fill(255, 170, 0);
      p.noStroke();
      p.text('W', engX + engW + 15, boxY + boxH / 2 - 8);

      // Qc arrow (engine → cold)
      p.stroke(0, 180, 216, 150 + 100 * arrowPulse);
      p.strokeWeight(3);
      drawArrow(p, engX + engW / 2, boxY + boxH + 5, engX + engW / 2, height - 125);
      p.fill(0, 180, 216);
      p.noStroke();
      p.text('Q_C', engX + engW / 2 + 25, boxY + boxH + 40);

      // Efficiency display
      p.fill(0, 255, 136);
      p.textSize(18);
      p.textAlign(p.CENTER);
      p.text(`Carnot Efficiency: ${(efficiency * 100).toFixed(1)}%`, engX + engW / 2, height - 38);
      p.fill(255, 255, 255, 120);
      p.textSize(11);
      p.text(`η = 1 - T_cold/T_hot = 1 - ${Tc}/${Th}`, engX + engW / 2, height - 14);

      // Current phase label
      p.fill(colors[Math.floor(cyclePhase)]);
      p.textSize(13);
      p.textAlign(p.LEFT);
      p.text(`Phase: ${labels[Math.floor(cyclePhase)]}`, pvX, pvY + pvH + 50);
    };

    function drawArrow(p, x1, y1, x2, y2) {
      p.line(x1, y1, x2, y2);
      const a = Math.atan2(y2 - y1, x2 - x1);
      const sz = 8;
      p.line(x2, y2, x2 - sz * Math.cos(a - 0.4), y2 - sz * Math.sin(a - 0.4));
      p.line(x2, y2, x2 - sz * Math.cos(a + 0.4), y2 - sz * Math.sin(a + 0.4));
    }

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, { tempHot: 600, tempCold: 300 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'tempHot', label: 'Hot Reservoir', min: 400, max: 800, step: 10, value: 600, unit: 'K' },
    { name: 'tempCold', label: 'Cold Reservoir', min: 200, max: 400, step: 10, value: 300, unit: 'K' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
