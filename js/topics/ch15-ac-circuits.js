// AC Circuits & RLC Resonance
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'ac-circuits';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
    };

    p.draw = () => {
      p.background(10, 10, 26);
      const R = engine.getParam('resistance');
      const L = engine.getParam('inductance');
      const C = engine.getParam('capacitance') * 1e-6; // μF to F
      const freq = engine.getParam('frequency');
      const omega = 2 * Math.PI * freq;

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;
      }

      // Calculate impedance
      const XL = omega * L;
      const XC = 1 / (omega * C);
      const Z = Math.sqrt(R * R + (XL - XC) * (XL - XC));
      const phi = Math.atan2(XL - XC, R); // phase angle
      const resonantFreq = 1 / (2 * Math.PI * Math.sqrt(L * C));
      const Imax = 10 / Z; // V=10V source

      // --- Waveform display ---
      const waveY = height * 0.3, waveH = 80;
      const waveX = 50, waveW = width - 100;

      // Axes
      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.line(waveX, waveY, waveX + waveW, waveY);
      p.line(waveX, waveY - waveH, waveX, waveY + waveH);

      // Voltage waveform
      p.stroke(255, 170, 0);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 4;
      p.drawingContext.shadowColor = '#ffaa00';
      p.noFill();
      p.beginShape();
      for (let i = 0; i <= waveW; i += 2) {
        const t = (i / waveW) * 4 * Math.PI;
        const v = Math.sin(t + time * omega * 0.1);
        p.vertex(waveX + i, waveY - v * waveH * 0.8);
      }
      p.endShape();

      // Current waveform (phase-shifted)
      p.stroke(0, 255, 136);
      p.drawingContext.shadowColor = '#00ff88';
      p.beginShape();
      for (let i = 0; i <= waveW; i += 2) {
        const t = (i / waveW) * 4 * Math.PI;
        const iVal = Imax * Math.sin(t + time * omega * 0.1 - phi);
        const normalized = iVal / Math.max(Imax, 0.001);
        p.vertex(waveX + i, waveY - normalized * waveH * 0.8);
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Legend
      p.noStroke();
      p.fill(255, 170, 0);
      p.textSize(11);
      p.textAlign(p.LEFT);
      p.text('━ Voltage', waveX + waveW - 140, waveY - waveH + 10);
      p.fill(0, 255, 136);
      p.text('━ Current', waveX + waveW - 140, waveY - waveH + 25);

      // --- Impedance vs Frequency graph ---
      const gX = 50, gY = height * 0.75, gH = 80, gW = width * 0.55;

      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.line(gX, gY, gX + gW, gY);
      p.line(gX, gY, gX, gY - gH);

      // Plot impedance curve
      p.stroke(139, 92, 246);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 4;
      p.drawingContext.shadowColor = '#8b5cf6';
      p.noFill();
      p.beginShape();
      const fMax = 100;
      for (let i = 0; i <= gW; i += 2) {
        const f = (i / gW) * fMax + 0.5;
        const w = 2 * Math.PI * f;
        const xl = w * L;
        const xc = 1 / (w * C);
        const z = Math.sqrt(R * R + (xl - xc) * (xl - xc));
        const currentVal = 10 / z;
        const normalized = currentVal / (10 / R);
        p.vertex(gX + i, gY - Math.min(normalized, 1) * gH);
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Mark resonance point
      const resX = gX + (resonantFreq / fMax) * gW;
      if (resX > gX && resX < gX + gW) {
        p.stroke(255, 0, 110);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([4, 4]);
        p.line(resX, gY, resX, gY - gH);
        p.drawingContext.setLineDash([]);
        p.fill(255, 0, 110);
        p.noStroke();
        p.textSize(10);
        p.textAlign(p.CENTER);
        p.text(`f₀=${resonantFreq.toFixed(1)}Hz`, resX, gY + 15);
      }

      // Mark current frequency
      const currX = gX + (freq / fMax) * gW;
      p.fill(0, 255, 136);
      p.noStroke();
      p.ellipse(currX, gY - Math.min(Imax / (10 / R), 1) * gH, 8, 8);

      p.fill(255, 255, 255, 100);
      p.textSize(10);
      p.textAlign(p.CENTER);
      p.text('Frequency (Hz)', gX + gW / 2, gY + 28);
      p.textAlign(p.RIGHT);
      p.text('Current', gX - 5, gY - gH / 2);

      // --- Info panel (right side) ---
      const infoX = width * 0.63;
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(13);
      p.textAlign(p.LEFT);

      const infoY = height * 0.58;
      p.text(`Impedance Z = ${Z.toFixed(1)} Ω`, infoX, infoY);
      p.text(`X_L = ${XL.toFixed(1)} Ω`, infoX, infoY + 22);
      p.text(`X_C = ${XC.toFixed(1)} Ω`, infoX, infoY + 44);
      p.text(`Phase: ${(phi * 180 / Math.PI).toFixed(1)}°`, infoX, infoY + 66);
      p.text(`I_max = ${Imax.toFixed(3)} A`, infoX, infoY + 88);

      p.fill(255, 0, 110);
      p.textSize(14);
      p.text(`f₀ = ${resonantFreq.toFixed(1)} Hz`, infoX, infoY + 115);

      // Resonance indicator
      const isNearResonance = Math.abs(freq - resonantFreq) < resonantFreq * 0.15;
      if (isNearResonance) {
        p.drawingContext.shadowBlur = 10;
        p.drawingContext.shadowColor = '#00ff88';
        p.fill(0, 255, 136);
        p.textSize(16);
        p.text('RESONANCE!', infoX, infoY + 140);
        p.drawingContext.shadowBlur = 0;
      }
    };

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, { resistance: 50, inductance: 0.1, capacitance: 100, frequency: 50 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'resistance', label: 'Resistance R', min: 10, max: 200, step: 5, value: 50, unit: 'Ω' },
    { name: 'inductance', label: 'Inductance L', min: 0.01, max: 1, step: 0.01, value: 0.1, unit: 'H' },
    { name: 'capacitance', label: 'Capacitance C', min: 1, max: 100, step: 1, value: 100, unit: 'μF' },
    { name: 'frequency', label: 'Frequency', min: 1, max: 100, step: 1, value: 50, unit: 'Hz' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
