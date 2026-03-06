// Chapter 9: Superposition — Two-Source Wave Interference
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'superposition';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;
    let pg; // offscreen graphics for interference pattern

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      pg = p.createGraphics(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const freq = engine.getParam('frequency');
      const spacing = engine.getParam('sourceSpacing');
      const amp = engine.getParam('amplitude');

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;
      }

      const waveSpeed = 200; // px/s
      const wavelength = waveSpeed / freq;
      const omega = 2 * Math.PI * freq;
      const k = 2 * Math.PI / wavelength;

      // Source positions
      const s1x = width * 0.15;
      const s1y = height / 2 - spacing / 2;
      const s2x = width * 0.15;
      const s2y = height / 2 + spacing / 2;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Wave Superposition & Interference', width / 2, 8);

      // Compute interference pattern on a grid
      const resolution = 4;
      for (let x = 0; x < width; x += resolution) {
        for (let y = 30; y < height - 30; y += resolution) {
          const d1 = Math.sqrt((x - s1x) * (x - s1x) + (y - s1y) * (y - s1y));
          const d2 = Math.sqrt((x - s2x) * (x - s2x) + (y - s2y) * (y - s2y));

          const wave1 = amp * Math.sin(omega * time - k * d1) / (Math.sqrt(d1 + 1));
          const wave2 = amp * Math.sin(omega * time - k * d2) / (Math.sqrt(d2 + 1));
          const combined = wave1 + wave2;

          // Map to color: constructive = bright cyan, destructive = dark
          const intensity = Math.abs(combined) / (amp * 0.5);
          const bright = Math.min(255, intensity * 60);

          // Color based on positive (cyan) or negative (magenta)
          if (combined > 0) {
            p.fill(0, bright * 0.8, bright, 180);
          } else {
            p.fill(bright * 0.5, 0, bright * 0.8, 180);
          }
          p.noStroke();
          p.rect(x, y, resolution, resolution);
        }
      }

      // Draw wave fronts (circles from each source)
      const maxDist = width;
      const numFronts = Math.floor(maxDist / wavelength);

      for (let i = 0; i < numFronts; i++) {
        const radius = (i * wavelength + (time * waveSpeed) % wavelength);
        if (radius > maxDist) continue;
        const alpha = Math.max(0, 80 - (radius / maxDist) * 80);

        // Source 1 fronts
        p.noFill();
        p.stroke(0, 255, 200, alpha);
        p.strokeWeight(1);
        p.ellipse(s1x, s1y, radius * 2, radius * 2);

        // Source 2 fronts
        p.stroke(255, 80, 200, alpha);
        p.ellipse(s2x, s2y, radius * 2, radius * 2);
      }

      // Draw sources
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = '#00ffc8';
      p.fill(0, 255, 200);
      p.noStroke();
      p.ellipse(s1x, s1y, 12, 12);
      p.drawingContext.shadowColor = '#ff50c8';
      p.fill(255, 80, 200);
      p.ellipse(s2x, s2y, 12, 12);
      p.drawingContext.shadowBlur = 0;

      // Labels
      p.fill(0, 255, 200);
      p.textSize(10);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text('S1', s1x - 10, s1y);
      p.fill(255, 80, 200);
      p.text('S2', s2x - 10, s2y);

      // Spacing indicator
      p.stroke(255, 200, 50, 100);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([3, 3]);
      p.line(s1x - 20, s1y, s1x - 20, s2y);
      p.drawingContext.setLineDash([]);
      p.noStroke();
      p.fill(255, 200, 50);
      p.textSize(9);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text('d=' + spacing + 'px', s1x - 24, (s1y + s2y) / 2);

      // Legend
      const legX = width - 200;
      const legY = 35;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(legX, legY, 190, 80, 8);

      p.noStroke();
      p.fill(0, 180, 216);
      p.textSize(11);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Interference:', legX + 10, legY + 6);

      p.fill(0, 200, 255);
      p.rect(legX + 10, legY + 24, 12, 12);
      p.fill(200, 200, 220);
      p.textSize(10);
      p.text('Constructive (bright)', legX + 28, legY + 25);

      p.fill(30, 10, 40);
      p.rect(legX + 10, legY + 42, 12, 12);
      p.fill(200, 200, 220);
      p.text('Destructive (dark)', legX + 28, legY + 43);

      p.fill(200, 200, 220);
      p.textSize(10);
      p.text('\u03BB = ' + wavelength.toFixed(0) + ' px', legX + 10, legY + 62);

      // Info panel
      const infoX = width - 200;
      const infoY = legY + 90;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(infoX, infoY, 190, 100, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(11);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Superposition Principle:', infoX + 10, infoY + 8);

      p.fill(200, 200, 220);
      p.textSize(10);
      p.text('y_total = y1 + y2', infoX + 10, infoY + 28);
      p.text('Constructive: \u0394d = n\u03BB', infoX + 10, infoY + 46);
      p.text('Destructive: \u0394d = (n+\u00BD)\u03BB', infoX + 10, infoY + 62);
      p.text('f = ' + freq.toFixed(1) + ' Hz, v = ' + waveSpeed + ' px/s', infoX + 10, infoY + 80);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Two coherent sources create interference patterns', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { frequency: 2, sourceSpacing: 120, amplitude: 40 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'frequency', label: 'Frequency', min: 1, max: 5, step: 0.1, value: 2, unit: 'Hz' },
    { name: 'sourceSpacing', label: 'Source Spacing', min: 50, max: 300, step: 10, value: 120, unit: 'px' },
    { name: 'amplitude', label: 'Amplitude', min: 20, max: 60, step: 5, value: 40, unit: 'px' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
