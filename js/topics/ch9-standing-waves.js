// Chapter 9: Standing Waves — Harmonics on a String
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'standing-waves';
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
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const n = Math.round(engine.getParam('harmonic'));
      const amp = engine.getParam('amplitude');
      const speed = engine.getParam('speed');

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;
      }

      const stringStart = 60;
      const stringEnd = width - 60;
      const stringLen = stringEnd - stringStart;
      const stringY = height / 2 - 20;

      // Wavelength and frequency for nth harmonic
      const wavelength = (2 * stringLen) / n;
      const freq = speed / wavelength;
      const omega = 2 * Math.PI * freq;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Standing Waves: Harmonic #' + n, width / 2, 8);

      // Draw fixed ends (wall mounts)
      p.fill(80, 80, 100);
      p.noStroke();
      p.rect(stringStart - 15, stringY - 25, 15, 50, 3, 0, 0, 3);
      p.rect(stringEnd, stringY - 25, 15, 50, 0, 3, 3, 0);

      // Draw equilibrium line
      p.stroke(255, 255, 255, 25);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([4, 4]);
      p.line(stringStart, stringY, stringEnd, stringY);
      p.drawingContext.setLineDash([]);

      // Draw standing wave: y(x,t) = A * sin(n*pi*x/L) * cos(omega*t)
      const envelope = Math.cos(omega * time);

      // Draw the envelope (ghost)
      p.noFill();
      p.stroke(0, 255, 200, 40);
      p.strokeWeight(1);
      p.beginShape();
      for (let x = stringStart; x <= stringEnd; x += 2) {
        const xNorm = (x - stringStart) / stringLen;
        const y = stringY + amp * Math.sin(n * Math.PI * xNorm);
        p.vertex(x, y);
      }
      p.endShape();
      p.beginShape();
      for (let x = stringStart; x <= stringEnd; x += 2) {
        const xNorm = (x - stringStart) / stringLen;
        const y = stringY - amp * Math.sin(n * Math.PI * xNorm);
        p.vertex(x, y);
      }
      p.endShape();

      // Draw actual wave
      p.noFill();
      p.stroke(0, 255, 200);
      p.strokeWeight(3);
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#00ffc8';
      p.beginShape();
      for (let x = stringStart; x <= stringEnd; x += 2) {
        const xNorm = (x - stringStart) / stringLen;
        const y = stringY + amp * Math.sin(n * Math.PI * xNorm) * envelope;
        p.vertex(x, y);
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Mark nodes (where sin(n*pi*x/L) = 0)
      for (let i = 0; i <= n; i++) {
        const nodeX = stringStart + (i / n) * stringLen;
        p.drawingContext.shadowBlur = 10;
        p.drawingContext.shadowColor = '#ff5050';
        p.fill(255, 80, 80);
        p.noStroke();
        p.ellipse(nodeX, stringY, 10, 10);
        p.drawingContext.shadowBlur = 0;

        if (i === 0 || i === n) {
          p.fill(255, 80, 80);
          p.textSize(9);
          p.textAlign(p.CENTER, p.TOP);
          p.text('N', nodeX, stringY + 15);
        } else {
          p.fill(255, 80, 80);
          p.textSize(9);
          p.textAlign(p.CENTER, p.TOP);
          p.text('Node', nodeX, stringY + 15);
        }
      }

      // Mark antinodes (halfway between nodes)
      for (let i = 0; i < n; i++) {
        const antiX = stringStart + ((i + 0.5) / n) * stringLen;
        const antiY = stringY + amp * Math.sin(n * Math.PI * ((i + 0.5) / n)) * envelope;

        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = '#ffc832';
        p.fill(255, 200, 50);
        p.noStroke();
        p.ellipse(antiX, antiY, 8, 8);
        p.drawingContext.shadowBlur = 0;

        p.fill(255, 200, 50);
        p.textSize(9);
        p.textAlign(p.CENTER, p.BOTTOM);
        const labelY = stringY - amp - 10;
        p.text('Antinode', antiX, labelY);
      }

      // Wavelength indicator (between first pair of like-phase nodes)
      if (n >= 1) {
        const wlArrowY = stringY + amp + 35;
        const wlStart = stringStart;
        const wlEnd = stringStart + wavelength;
        if (wlEnd <= stringEnd + 10) {
          p.stroke(0, 180, 255);
          p.strokeWeight(1.5);
          p.drawingContext.shadowBlur = 4;
          p.drawingContext.shadowColor = '#00b4ff';
          p.line(wlStart, wlArrowY, wlEnd, wlArrowY);
          p.line(wlStart, wlArrowY, wlStart + 8, wlArrowY - 4);
          p.line(wlStart, wlArrowY, wlStart + 8, wlArrowY + 4);
          p.line(wlEnd, wlArrowY, wlEnd - 8, wlArrowY - 4);
          p.line(wlEnd, wlArrowY, wlEnd - 8, wlArrowY + 4);
          p.drawingContext.shadowBlur = 0;
          p.noStroke();
          p.fill(0, 180, 255);
          p.textSize(10);
          p.textAlign(p.CENTER, p.TOP);
          p.text('\u03BB = ' + wavelength.toFixed(0) + ' px', (wlStart + wlEnd) / 2, wlArrowY + 4);
        }
      }

      // Info panel
      const infoX = 30;
      const infoY = height - 110;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(infoX, infoY, 300, 95, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Standing Wave: Harmonic n = ' + n, infoX + 10, infoY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('\u03BB_n = 2L/n = ' + wavelength.toFixed(0) + ' px', infoX + 10, infoY + 28);
      p.text('f_n = nv/(2L) = ' + freq.toFixed(2) + ' Hz', infoX + 10, infoY + 44);
      p.text('Nodes: ' + (n + 1) + '  |  Antinodes: ' + n, infoX + 10, infoY + 60);
      p.text('v = ' + speed + ' px/s  |  L = ' + stringLen + ' px', infoX + 10, infoY + 76);

      // Harmonic series info
      const info2X = width - 240;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(info2X, infoY, 210, 95, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Harmonic Series:', info2X + 10, infoY + 8);

      p.textSize(10);
      const f1 = speed / (2 * stringLen);
      for (let i = 1; i <= Math.min(5, 8); i++) {
        p.fill(i === n ? '#00ffc8' : 'rgba(200,200,220,0.6)');
        p.text('n=' + i + ': f=' + (f1 * i).toFixed(1) + ' Hz  \u03BB=' + ((2 * stringLen) / i).toFixed(0) + 'px', info2X + 10, infoY + 24 + (i - 1) * 14);
      }

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Change harmonic number to see different modes of vibration', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { harmonic: 1, amplitude: 50, speed: 200 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'harmonic', label: 'Harmonic (n)', min: 1, max: 8, step: 1, value: 1, unit: '' },
    { name: 'amplitude', label: 'Amplitude', min: 20, max: 80, step: 5, value: 50, unit: 'px' },
    { name: 'speed', label: 'Wave Speed', min: 100, max: 400, step: 10, value: 200, unit: 'px/s' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
