// Chapter 13: Kirchhoff's Laws — RC Circuit Charging/Discharging
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'kirchhoffs-laws';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;
    let simTime = 0; // Simulation time in seconds
    let charging = true;
    let voltageHistory = [];
    let currentHistory = [];
    const maxHistory = 300;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 480;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const R = engine.getParam('resistance');
      const C_uF = engine.getParam('capacitance');
      const V0 = engine.getParam('voltage');
      const C = C_uF * 1e-6; // Convert μF to F
      const tau = R * C; // Time constant

      if (engine.isPlaying) {
        const dt = 0.016 * engine.speed;
        time += dt;
        simTime += dt * tau * 2; // Scale so we see full charge in reasonable time
      }

      // Calculate current capacitor voltage and current
      const tauMultiple = simTime / tau;
      let Vc, Ic;
      if (charging) {
        Vc = V0 * (1 - Math.exp(-tauMultiple));
        Ic = (V0 / R) * Math.exp(-tauMultiple);
      } else {
        Vc = V0 * Math.exp(-tauMultiple);
        Ic = -(V0 / R) * Math.exp(-tauMultiple);
      }

      // Record history
      if (engine.isPlaying && voltageHistory.length < maxHistory) {
        voltageHistory.push(Vc);
        currentHistory.push(Ic);
      }

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('RC Circuit: τ = RC  |  ' + (charging ? 'Charging' : 'Discharging'), width / 2, 10);

      // --- Circuit Diagram ---
      const circX = 150;
      const circY = 150;
      const cw = 160, ch2 = 80;

      // Wires
      p.stroke(80, 80, 110);
      p.strokeWeight(2);
      // Top wire
      p.line(circX - cw / 2, circY - ch2 / 2, circX + cw / 2, circY - ch2 / 2);
      // Bottom wire
      p.line(circX - cw / 2, circY + ch2 / 2, circX + cw / 2, circY + ch2 / 2);
      // Left wire (battery)
      p.line(circX - cw / 2, circY - ch2 / 2, circX - cw / 2, circY + ch2 / 2);

      // Resistor on top
      const resX = circX;
      const resY = circY - ch2 / 2;
      p.stroke(255, 100, 100);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#ff6464';
      const zigW = 30, zigN = 4;
      for (let i = 0; i < zigN; i++) {
        const x1 = resX - zigW + i * (zigW * 2 / zigN);
        const x2 = resX - zigW + (i + 0.5) * (zigW * 2 / zigN);
        const x3 = resX - zigW + (i + 1) * (zigW * 2 / zigN);
        p.line(x1, resY, x2, resY + (i % 2 === 0 ? -6 : 6));
        p.line(x2, resY + (i % 2 === 0 ? -6 : 6), x3, resY);
      }
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(255, 100, 100);
      p.textSize(9);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('R = ' + R + 'Ω', resX, resY - 10);

      // Capacitor on right
      const capX = circX + cw / 2;
      const capY = circY;
      p.stroke(139, 92, 246);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#8b5cf6';
      p.line(capX, circY - ch2 / 2, capX, capY - 8);
      p.line(capX, capY + 8, capX, circY + ch2 / 2);
      p.strokeWeight(3);
      p.line(capX - 12, capY - 8, capX + 12, capY - 8);
      p.line(capX - 12, capY + 8, capX + 12, capY + 8);
      p.drawingContext.shadowBlur = 0;

      // Charge level on capacitor
      const chargeLevel = Vc / V0;
      p.noStroke();
      p.fill(139, 92, 246, chargeLevel * 180);
      p.rect(capX - 10, capY - 6, 20, 12);

      p.fill(139, 92, 246);
      p.textSize(9);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('C = ' + C_uF + 'μF', capX + 18, capY);
      p.text('Vc = ' + Vc.toFixed(2) + 'V', capX + 18, capY + 14);

      // Battery on left
      const batX = circX - cw / 2;
      const batY = circY;
      p.stroke(255, 200, 50);
      p.strokeWeight(3);
      p.line(batX - 6, batY - 8, batX + 6, batY - 8);
      p.strokeWeight(2);
      p.line(batX - 3, batY + 4, batX + 3, batY + 4);
      p.noStroke();
      p.fill(255, 200, 50);
      p.textSize(9);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(V0 + 'V', batX - 10, batY);

      // Switch indicator
      p.fill(charging ? p.color(0, 255, 136) : p.color(255, 100, 100));
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text(charging ? '▶ CHARGING' : '▶ DISCHARGING', circX, circY + ch2 / 2 + 10);
      p.fill(200, 200, 220, 150);
      p.textSize(9);
      p.text('Click canvas to toggle charge/discharge', circX, circY + ch2 / 2 + 25);

      // --- Voltage vs Time Graph ---
      const graphX = 40;
      const graphY = 260;
      const graphW = width - 80;
      const graphH = 150;

      // Graph background
      p.fill(15, 15, 30, 200);
      p.stroke(60, 60, 80);
      p.strokeWeight(1);
      p.rect(graphX, graphY, graphW, graphH, 4);

      // Grid lines
      p.stroke(40, 40, 60);
      for (let i = 1; i < 5; i++) {
        const gy = graphY + i * graphH / 5;
        p.line(graphX, gy, graphX + graphW, gy);
      }
      for (let i = 1; i < 6; i++) {
        const gx = graphX + i * graphW / 6;
        p.drawingContext.setLineDash([2, 4]);
        p.line(gx, graphY, gx, graphY + graphH);
        p.drawingContext.setLineDash([]);
      }

      // Axes labels
      p.noStroke();
      p.fill(150, 150, 170);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Time', graphX + graphW / 2, graphY + graphH + 5);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(V0.toFixed(0) + 'V', graphX - 4, graphY + 5);
      p.text('0V', graphX - 4, graphY + graphH - 5);

      // Time constant markers
      p.fill(139, 92, 246, 80);
      p.textSize(8);
      p.textAlign(p.CENTER, p.TOP);
      for (let n = 1; n <= 5; n++) {
        const tauFrac = n / 5;
        if (tauFrac <= 1) {
          const tx = graphX + tauFrac * graphW;
          p.drawingContext.setLineDash([2, 3]);
          p.stroke(139, 92, 246, 40);
          p.line(tx, graphY, tx, graphY + graphH);
          p.drawingContext.setLineDash([]);
          p.noStroke();
          p.text(n + 'τ', tx, graphY + graphH + 16);
        }
      }

      // Draw theoretical curve
      p.noFill();
      p.stroke(139, 92, 246, 60);
      p.strokeWeight(1);
      p.beginShape();
      for (let px = 0; px < graphW; px++) {
        const tRatio = (px / graphW) * 5; // Show 5 time constants
        let vTheory;
        if (charging) {
          vTheory = V0 * (1 - Math.exp(-tRatio));
        } else {
          vTheory = V0 * Math.exp(-tRatio);
        }
        const py = graphY + graphH - (vTheory / V0) * graphH;
        p.vertex(graphX + px, py);
      }
      p.endShape();

      // Draw recorded voltage history
      if (voltageHistory.length > 1) {
        p.noFill();
        p.stroke(0, 255, 136);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 6;
        p.drawingContext.shadowColor = '#00ff88';
        p.beginShape();
        for (let i = 0; i < voltageHistory.length; i++) {
          const px = graphX + (i / maxHistory) * graphW;
          const py = graphY + graphH - (voltageHistory[i] / V0) * graphH;
          p.vertex(px, py);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      }

      // Draw current history (dimmer, in a different color)
      if (currentHistory.length > 1) {
        const maxI = V0 / R;
        p.noFill();
        p.stroke(255, 200, 50, 120);
        p.strokeWeight(1);
        p.beginShape();
        for (let i = 0; i < currentHistory.length; i++) {
          const px = graphX + (i / maxHistory) * graphW;
          const py = graphY + graphH - (Math.abs(currentHistory[i]) / maxI) * graphH;
          p.vertex(px, py);
        }
        p.endShape();
      }

      // Legend
      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(10);
      p.textAlign(p.LEFT, p.TOP);
      p.text('— Vc (Voltage)', graphX + 10, graphY + 5);
      p.fill(255, 200, 50, 150);
      p.text('— Ic (Current)', graphX + 10, graphY + 18);

      // Info panel
      const panelX = width - 200;
      const panelY2 = 55;
      p.fill(20, 20, 40, 220);
      p.stroke(139, 92, 246, 80);
      p.strokeWeight(1);
      p.rect(panelX, panelY2, 190, 155, 8);

      p.noStroke();
      p.fill(139, 92, 246);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('RC Circuit', panelX + 10, panelY2 + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      const tauMs = tau * 1000;
      const tauStr = tauMs >= 1 ? tauMs.toFixed(1) + ' ms' : (tau * 1e6).toFixed(1) + ' μs';
      const infoLines = [
        'R = ' + R + ' Ω',
        'C = ' + C_uF + ' μF',
        'V₀ = ' + V0 + ' V',
        '',
        'τ = RC = ' + tauStr,
        'Vc = ' + Vc.toFixed(3) + ' V',
        'Ic = ' + (Math.abs(Ic) * 1000).toFixed(3) + ' mA',
        '% charged: ' + (chargeLevel * 100).toFixed(1) + '%'
      ];
      for (let i = 0; i < infoLines.length; i++) {
        p.fill(i >= 4 ? p.color(139, 92, 246) : p.color(200, 200, 220));
        p.text(infoLines[i], panelX + 10, panelY2 + 26 + i * 15);
      }

      // Bottom
      p.fill(139, 92, 246, 150);
      p.textSize(12);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Charging: Vc = V₀(1 − e^(−t/τ))  |  Discharging: Vc = V₀·e^(−t/τ)  |  τ = RC', width / 2, height - 8);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      charging = !charging;
      simTime = 0;
      voltageHistory = [];
      currentHistory = [];
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { resistance: 1000, capacitance: 100, voltage: 6 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'resistance', label: 'Resistance', min: 100, max: 10000, step: 100, value: 1000, unit: 'Ω' },
    { name: 'capacitance', label: 'Capacitance', min: 1, max: 1000, step: 10, value: 100, unit: 'μF' },
    { name: 'voltage', label: 'Source Voltage', min: 1, max: 12, step: 0.5, value: 6, unit: 'V' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
