// Chapter 9: Wave Properties — Transverse Wave Simulation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'wave-properties';
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

      const freq = engine.getParam('frequency');
      const amp = engine.getParam('amplitude');
      const speed = engine.getParam('speed');

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;
      }

      const wavelength = speed / freq;
      const waveStartX = 40;
      const waveEndX = width - 40;
      const waveY = height / 2 - 30;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Transverse Wave Properties', width / 2, 8);

      // Draw equilibrium line
      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([4, 4]);
      p.line(waveStartX, waveY, waveEndX, waveY);
      p.drawingContext.setLineDash([]);

      // Draw wave
      p.noFill();
      p.stroke(0, 255, 200);
      p.strokeWeight(2.5);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = '#00ffc8';
      p.beginShape();
      const points = [];
      for (let x = waveStartX; x <= waveEndX; x += 2) {
        const phase = (2 * Math.PI * freq * time) - (2 * Math.PI * (x - waveStartX) / wavelength);
        const y = waveY + amp * Math.sin(phase);
        p.vertex(x, y);
        points.push({ x, y, phase });
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Label parts of the wave - find crest, trough, wavelength
      // Find the first crest (sin = 1)
      let crestX = -1, troughX = -1, crest2X = -1;
      for (let i = 1; i < points.length - 1; i++) {
        if (points[i].y < points[i - 1].y && points[i].y < points[i + 1].y && crestX === -1) {
          crestX = points[i].x;
        } else if (points[i].y > points[i - 1].y && points[i].y > points[i + 1].y && troughX === -1 && crestX !== -1) {
          troughX = points[i].x;
        } else if (points[i].y < points[i - 1].y && points[i].y < points[i + 1].y && crestX !== -1 && crest2X === -1) {
          crest2X = points[i].x;
          break;
        }
      }

      // Crest label
      if (crestX > 0) {
        p.fill(255, 200, 50);
        p.noStroke();
        p.textSize(11);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text('Crest', crestX, waveY - amp - 8);
        p.stroke(255, 200, 50, 100);
        p.strokeWeight(1);
        p.line(crestX, waveY - amp - 5, crestX, waveY - amp + 3);
      }

      // Trough label
      if (troughX > 0) {
        p.fill(255, 100, 100);
        p.noStroke();
        p.textSize(11);
        p.textAlign(p.CENTER, p.TOP);
        p.text('Trough', troughX, waveY + amp + 8);
        p.stroke(255, 100, 100, 100);
        p.strokeWeight(1);
        p.line(troughX, waveY + amp - 3, troughX, waveY + amp + 5);
      }

      // Wavelength arrow between two crests
      if (crestX > 0 && crest2X > 0) {
        const arrowY = waveY - amp - 25;
        p.stroke(0, 180, 255);
        p.strokeWeight(1.5);
        p.drawingContext.shadowBlur = 4;
        p.drawingContext.shadowColor = '#00b4ff';
        // Horizontal line
        p.line(crestX, arrowY, crest2X, arrowY);
        // Left arrowhead
        p.line(crestX, arrowY, crestX + 8, arrowY - 4);
        p.line(crestX, arrowY, crestX + 8, arrowY + 4);
        // Right arrowhead
        p.line(crest2X, arrowY, crest2X - 8, arrowY - 4);
        p.line(crest2X, arrowY, crest2X - 8, arrowY + 4);
        p.drawingContext.shadowBlur = 0;
        // Vertical dashes
        p.stroke(0, 180, 255, 60);
        p.drawingContext.setLineDash([2, 2]);
        p.line(crestX, waveY - amp, crestX, arrowY);
        p.line(crest2X, waveY - amp, crest2X, arrowY);
        p.drawingContext.setLineDash([]);

        p.noStroke();
        p.fill(0, 180, 255);
        p.textSize(11);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text('\u03BB = ' + wavelength.toFixed(0) + ' px', (crestX + crest2X) / 2, arrowY - 3);
      }

      // Amplitude arrow
      if (crestX > 0) {
        const ampX = waveStartX + 15;
        p.stroke(255, 80, 200);
        p.strokeWeight(1.5);
        p.drawingContext.shadowBlur = 4;
        p.drawingContext.shadowColor = '#ff50c8';
        p.line(ampX, waveY, ampX, waveY - amp);
        p.line(ampX, waveY - amp, ampX - 4, waveY - amp + 6);
        p.line(ampX, waveY - amp, ampX + 4, waveY - amp + 6);
        p.drawingContext.shadowBlur = 0;
        p.noStroke();
        p.fill(255, 80, 200);
        p.textSize(10);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text('A=' + amp + 'px', ampX - 5, waveY - amp / 2);
      }

      // Direction of wave motion arrow
      const dirArrowY = waveY + amp + 40;
      p.stroke(0, 255, 136);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#00ff88';
      const arrowStart = width / 2 - 60;
      const arrowEnd = width / 2 + 60;
      p.line(arrowStart, dirArrowY, arrowEnd, dirArrowY);
      p.line(arrowEnd, dirArrowY, arrowEnd - 10, dirArrowY - 5);
      p.line(arrowEnd, dirArrowY, arrowEnd - 10, dirArrowY + 5);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Wave Direction \u2192', width / 2, dirArrowY + 5);

      // Particle motion arrow (perpendicular)
      const partX = width / 2 - 100;
      p.stroke(255, 200, 50);
      p.strokeWeight(1.5);
      p.line(partX, waveY + 15, partX, waveY - 15);
      p.line(partX, waveY - 15, partX - 3, waveY - 9);
      p.line(partX, waveY - 15, partX + 3, waveY - 9);
      p.line(partX, waveY + 15, partX - 3, waveY + 9);
      p.line(partX, waveY + 15, partX + 3, waveY + 9);
      p.noStroke();
      p.fill(255, 200, 50);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Particle', partX, waveY + 18);
      p.text('Motion', partX, waveY + 30);

      // Info panel
      const infoX = 30;
      const infoY = height - 110;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(infoX, infoY, 250, 95, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Wave Equation: v = f\u03BB', infoX + 10, infoY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('Frequency (f) = ' + freq.toFixed(2) + ' Hz', infoX + 10, infoY + 28);
      p.text('Amplitude (A) = ' + amp + ' px', infoX + 10, infoY + 44);
      p.text('Wave Speed (v) = ' + speed + ' px/s', infoX + 10, infoY + 60);

      p.fill(0, 255, 200);
      p.text('Wavelength (\u03BB) = v/f = ' + wavelength.toFixed(1) + ' px', infoX + 10, infoY + 76);

      // Secondary info
      const info2X = width - 250;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(info2X, infoY, 220, 95, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Properties:', info2X + 10, infoY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('Period (T) = 1/f = ' + (1 / freq).toFixed(3) + ' s', info2X + 10, infoY + 28);
      p.text('\u03C9 = 2\u03C0f = ' + (2 * Math.PI * freq).toFixed(2) + ' rad/s', info2X + 10, infoY + 44);
      p.text('k = 2\u03C0/\u03BB = ' + (2 * Math.PI / wavelength).toFixed(4) + ' rad/px', info2X + 10, infoY + 60);
      p.text('Type: Transverse wave', info2X + 10, infoY + 76);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Adjust frequency, amplitude, and speed to see how wave properties change', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { frequency: 2, amplitude: 50, speed: 150 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'frequency', label: 'Frequency', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'Hz' },
    { name: 'amplitude', label: 'Amplitude', min: 20, max: 100, step: 5, value: 50, unit: 'px' },
    { name: 'speed', label: 'Wave Speed', min: 50, max: 300, step: 10, value: 150, unit: 'px/s' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
