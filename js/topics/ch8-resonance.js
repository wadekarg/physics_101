// Chapter 8: Resonance — Driven Oscillator Simulation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'resonance';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;
    let x = 0, v = 0; // displacement and velocity of the oscillator
    let trail = [];
    let responseData = []; // amplitude vs frequency for response curve

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    function computeResponseCurve(natFreq, damping, drivingAmp) {
      const data = [];
      for (let f = 0.1; f <= 10; f += 0.1) {
        const omega = 2 * Math.PI * f;
        const omega0 = 2 * Math.PI * natFreq;
        const gamma = damping;
        const denomSq = Math.pow(omega0 * omega0 - omega * omega, 2) + Math.pow(2 * gamma * omega, 2);
        const amp = drivingAmp * omega0 * omega0 / Math.sqrt(denomSq);
        data.push({ f, amp });
      }
      return data;
    }

    p.draw = () => {
      p.background(10, 10, 26);

      const natFreq = engine.getParam('naturalFreq');
      const drivingFreq = engine.getParam('drivingFreq');
      const damping = engine.getParam('damping');
      const drivingAmp = engine.getParam('drivingAmplitude');

      const omega0 = 2 * Math.PI * natFreq;
      const omegaD = 2 * Math.PI * drivingFreq;

      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        time += dt;

        // Driven damped harmonic oscillator: x'' + 2γx' + ω₀²x = F₀cos(ωt)
        const driving = drivingAmp * Math.cos(omegaD * time);
        const accel = -omega0 * omega0 * x - 2 * damping * v + omega0 * omega0 * driving / drivingAmp * drivingAmp;
        v += accel * dt;
        x += v * dt;

        trail.push(x);
        if (trail.length > 300) trail.shift();
      }

      responseData = computeResponseCurve(natFreq, damping, drivingAmp);

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Resonance: Driven Oscillator', width / 2, 8);

      // Left side: visual oscillator
      const oscCenterX = width * 0.22;
      const oscCenterY = height / 2;
      const anchorY = 60;
      const restY = oscCenterY;
      const massY = restY + x;
      const massR = 22;

      // Wall / anchor
      p.fill(80, 80, 100);
      p.noStroke();
      p.rect(oscCenterX - 40, anchorY - 10, 80, 10, 3);

      // Spring
      const coils = 10;
      const coilW = 15;
      p.stroke(0, 255, 200);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#00ffc8';
      p.noFill();
      p.beginShape();
      p.vertex(oscCenterX, anchorY);
      for (let i = 0; i <= coils; i++) {
        const t = i / coils;
        const sy = anchorY + t * (massY - massR - anchorY);
        const sx = oscCenterX + (i % 2 === 0 ? -coilW : coilW);
        if (i === 0 || i === coils) p.vertex(oscCenterX, sy);
        else p.vertex(sx, sy);
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Mass
      p.drawingContext.shadowBlur = 20;
      p.drawingContext.shadowColor = '#ff6090';
      p.fill(255, 80, 130);
      p.noStroke();
      p.ellipse(oscCenterX, massY, massR * 2, massR * 2);
      p.drawingContext.shadowBlur = 0;

      // Driving force indicator
      const drivingPhase = drivingAmp * Math.cos(omegaD * time);
      const dForceY = restY + drivingPhase;
      p.stroke(255, 200, 50, 150);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([3, 3]);
      p.line(oscCenterX - 60, dForceY, oscCenterX - 30, dForceY);
      p.drawingContext.setLineDash([]);
      p.noStroke();
      p.fill(255, 200, 50);
      p.textSize(9);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text('drive', oscCenterX - 62, dForceY);

      // Ratio indicator
      const ratio = drivingFreq / natFreq;
      const isResonant = Math.abs(ratio - 1) < 0.15;
      if (isResonant) {
        p.drawingContext.shadowBlur = 15;
        p.drawingContext.shadowColor = '#ff0000';
        p.fill(255, 50, 50);
        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('RESONANCE!', oscCenterX, height - 40);
        p.drawingContext.shadowBlur = 0;
      }

      // Oscillator trail graph
      const g1X = width * 0.38;
      const g1W = width * 0.25;
      const g1Y = 50;
      const g1H = 130;
      const g1CY = g1Y + g1H / 2;

      p.fill(15, 15, 35, 200);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(g1X, g1Y, g1W, g1H, 8);

      p.noStroke();
      p.fill(0, 180, 216);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Displacement vs Time', g1X + g1W / 2, g1Y + 4);

      p.stroke(255, 255, 255, 30);
      p.strokeWeight(1);
      p.line(g1X + 5, g1CY, g1X + g1W - 5, g1CY);

      if (trail.length > 1) {
        const maxAmp = Math.max(50, ...trail.map(v => Math.abs(v)));
        p.noFill();
        p.stroke(0, 255, 200);
        p.strokeWeight(1.5);
        p.drawingContext.shadowBlur = 3;
        p.drawingContext.shadowColor = '#00ffc8';
        p.beginShape();
        for (let i = 0; i < trail.length; i++) {
          const tx = g1X + 5 + (i / 300) * (g1W - 10);
          const ty = g1CY - (trail[i] / maxAmp) * (g1H / 2 - 15);
          p.vertex(tx, ty);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      }

      // Response curve (amplitude vs frequency)
      const g2X = width * 0.38;
      const g2W = width * 0.57;
      const g2Y = g1Y + g1H + 20;
      const g2H = 150;

      p.fill(15, 15, 35, 200);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(g2X, g2Y, g2W, g2H, 8);

      p.noStroke();
      p.fill(0, 180, 216);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Amplitude vs Driving Frequency (Response Curve)', g2X + g2W / 2, g2Y + 4);

      // Axes
      p.stroke(255, 255, 255, 50);
      p.strokeWeight(1);
      p.line(g2X + 30, g2Y + g2H - 25, g2X + g2W - 10, g2Y + g2H - 25); // x axis
      p.line(g2X + 30, g2Y + 20, g2X + 30, g2Y + g2H - 25); // y axis

      // Labels
      p.noStroke();
      p.fill(150, 150, 170);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Frequency (Hz)', g2X + g2W / 2, g2Y + g2H - 2);
      p.textAlign(p.CENTER, p.BOTTOM);
      // Frequency ticks
      for (let f = 1; f <= 10; f++) {
        const fx = g2X + 30 + (f / 10) * (g2W - 40);
        p.stroke(255, 255, 255, 30);
        p.strokeWeight(1);
        p.line(fx, g2Y + g2H - 28, fx, g2Y + g2H - 22);
        p.noStroke();
        p.fill(150, 150, 170);
        p.text(f, fx, g2Y + g2H - 14);
      }

      // Plot response curve
      if (responseData.length > 1) {
        const maxResp = Math.max(...responseData.map(d => d.amp));
        p.noFill();
        p.stroke(255, 80, 130);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 5;
        p.drawingContext.shadowColor = '#ff5082';
        p.beginShape();
        for (const d of responseData) {
          const fx = g2X + 30 + (d.f / 10) * (g2W - 40);
          const fy = g2Y + g2H - 25 - (d.amp / (maxResp + 1)) * (g2H - 50);
          p.vertex(fx, fy);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;

        // Mark natural frequency
        const nfx = g2X + 30 + (natFreq / 10) * (g2W - 40);
        p.stroke(0, 255, 136, 150);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([3, 3]);
        p.line(nfx, g2Y + 20, nfx, g2Y + g2H - 25);
        p.drawingContext.setLineDash([]);
        p.noStroke();
        p.fill(0, 255, 136);
        p.textSize(9);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text('f\u2080=' + natFreq.toFixed(1), nfx, g2Y + 30);

        // Mark driving frequency
        const dfx = g2X + 30 + (drivingFreq / 10) * (g2W - 40);
        p.stroke(255, 200, 50);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 6;
        p.drawingContext.shadowColor = '#ffc832';
        p.line(dfx, g2Y + g2H - 30, dfx, g2Y + g2H - 15);
        p.fill(255, 200, 50);
        p.noStroke();
        p.triangle(dfx - 4, g2Y + g2H - 30, dfx + 4, g2Y + g2H - 30, dfx, g2Y + g2H - 37);
        p.drawingContext.shadowBlur = 0;
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.text('f_d=' + drivingFreq.toFixed(1), dfx, g2Y + g2H + 5);
      }

      // Info text
      const infoX = width * 0.68;
      const infoY = 50;
      p.fill(15, 15, 35, 200);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(infoX, infoY, width * 0.28, 130, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Physics:', infoX + 10, infoY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('f\u2080 = ' + natFreq.toFixed(2) + ' Hz', infoX + 10, infoY + 28);
      p.text('f_drive = ' + drivingFreq.toFixed(2) + ' Hz', infoX + 10, infoY + 44);
      p.text('Ratio = ' + ratio.toFixed(2), infoX + 10, infoY + 60);
      p.text('Damping = ' + damping.toFixed(3), infoX + 10, infoY + 76);

      p.fill(isResonant ? '#ff5050' : '#00ffc8');
      p.textSize(11);
      p.text(isResonant ? 'At resonance!' : 'Off resonance', infoX + 10, infoY + 100);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Match driving freq to natural freq for resonance!', width / 2, height - 5);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      x = 0; v = 0; time = 0; trail = [];
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { naturalFreq: 2, drivingFreq: 2, damping: 0.1, drivingAmplitude: 20 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'naturalFreq', label: 'Natural Frequency', min: 1, max: 5, step: 0.1, value: 2, unit: 'Hz' },
    { name: 'drivingFreq', label: 'Driving Frequency', min: 0.1, max: 10, step: 0.1, value: 2, unit: 'Hz' },
    { name: 'damping', label: 'Damping', min: 0.01, max: 0.5, step: 0.01, value: 0.1, unit: '' },
    { name: 'drivingAmplitude', label: 'Driving Amplitude', min: 5, max: 50, step: 1, value: 20, unit: 'px' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
