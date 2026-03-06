// Chapter 17: Wave Optics — Double-Slit Experiment & Interference
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'wave-optics';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const PINK = [255, 0, 110];
  const PINK_HEX = '#ff006e';

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;

    function wavelengthToRGB(wl) {
      let r = 0, g = 0, b = 0;
      if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
      else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
      else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
      else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
      else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
      else if (wl >= 645 && wl <= 700) { r = 1; }
      return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const d = engine.getParam('slitSeparation');      // slit separation in sim units
      const lambda = engine.getParam('wavelength');       // wavelength in nm
      const slitW = engine.getParam('slitWidth');         // slit width

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;
      }

      const lightColor = wavelengthToRGB(lambda);
      const lightHex = `rgb(${lightColor[0]},${lightColor[1]},${lightColor[2]})`;

      // Layout
      const sourceX = 40;
      const barrierX = width * 0.3;
      const screenX = width * 0.85;
      const centerY = height / 2;

      // Scale factor for slit separation
      const slitScale = 1.5;
      const slit1Y = centerY - (d * slitScale) / 2;
      const slit2Y = centerY + (d * slitScale) / 2;
      const slitHalfW = slitW * slitScale / 2;

      // --- Title ---
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Double-Slit Experiment: Interference', width / 2, 8);

      // --- Draw light source ---
      p.noStroke();
      p.fill(lightColor[0], lightColor[1], lightColor[2]);
      p.drawingContext.shadowColor = lightHex;
      p.drawingContext.shadowBlur = 20;
      p.ellipse(sourceX, centerY, 16, 16);
      p.drawingContext.shadowBlur = 0;
      p.fill(255, 255, 255, 150);
      p.textSize(10);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Source', sourceX, centerY + 14);

      // --- Draw incoming waves (plane waves) ---
      p.noFill();
      p.strokeWeight(1);
      const waveSpacing = lambda / 20;
      for (let wx = sourceX + 20; wx < barrierX; wx += Math.max(10, waveSpacing)) {
        const phase = (time * 60 * 2) % (Math.max(10, waveSpacing));
        const x = wx - phase;
        if (x < sourceX || x > barrierX) continue;
        const alpha = p.map(x, sourceX, barrierX, 150, 50);
        p.stroke(lightColor[0], lightColor[1], lightColor[2], alpha);
        p.line(x, centerY - 100, x, centerY + 100);
      }

      // --- Draw barrier ---
      p.fill(60, 60, 80);
      p.noStroke();
      p.rect(barrierX - 4, 30, 8, slit1Y - slitHalfW - 30);
      p.rect(barrierX - 4, slit1Y + slitHalfW, 8, slit2Y - slitHalfW - slit1Y - slitHalfW);
      p.rect(barrierX - 4, slit2Y + slitHalfW, 8, height - 30 - slit2Y - slitHalfW);

      // Highlight slits
      p.fill(lightColor[0], lightColor[1], lightColor[2], 200);
      p.drawingContext.shadowColor = lightHex;
      p.drawingContext.shadowBlur = 8;
      p.rect(barrierX - 2, slit1Y - slitHalfW, 4, slitHalfW * 2);
      p.rect(barrierX - 2, slit2Y - slitHalfW, 4, slitHalfW * 2);
      p.drawingContext.shadowBlur = 0;

      // --- Draw circular wavefronts from slits ---
      p.noFill();
      p.strokeWeight(1);
      const maxR = screenX - barrierX;
      const waveSpeed = 60;
      const numWaves = 15;
      for (let i = 0; i < numWaves; i++) {
        const r = ((time * waveSpeed + i * Math.max(10, waveSpacing)) % maxR);
        if (r < 0) continue;
        const alpha = p.map(r, 0, maxR, 100, 10);
        p.stroke(lightColor[0], lightColor[1], lightColor[2], alpha);
        // Wavefront from slit 1
        p.arc(barrierX, slit1Y, r * 2, r * 2, -Math.PI / 2, Math.PI / 2);
        // Wavefront from slit 2
        p.arc(barrierX, slit2Y, r * 2, r * 2, -Math.PI / 2, Math.PI / 2);
      }

      // --- Compute interference pattern on screen ---
      const screenWidth = 10;
      p.fill(20, 20, 40);
      p.noStroke();
      p.rect(screenX, 30, screenWidth, height - 60);

      // Intensity calculation along screen
      const L = screenX - barrierX;  // distance to screen
      const lambdaSim = lambda / 20; // scale wavelength to sim coordinates
      const dSim = d * slitScale;    // slit separation in sim coords
      const aSim = slitW * slitScale; // slit width in sim coords

      for (let sy = 35; sy < height - 35; sy++) {
        const y = sy - centerY;
        const theta = Math.atan2(y, L);
        const sinTheta = Math.sin(theta);

        // Double-slit interference: cos^2(pi * d * sin(theta) / lambda)
        const phi = Math.PI * dSim * sinTheta / lambdaSim;
        let interference = Math.cos(phi);
        interference = interference * interference;

        // Single-slit diffraction envelope: sinc^2(pi * a * sin(theta) / lambda)
        const beta = Math.PI * aSim * sinTheta / lambdaSim;
        let diffraction = 1;
        if (Math.abs(beta) > 0.001) {
          diffraction = Math.sin(beta) / beta;
          diffraction = diffraction * diffraction;
        }

        const intensity = interference * diffraction;
        const bright = Math.floor(intensity * 255);

        p.fill(
          Math.floor(lightColor[0] * intensity),
          Math.floor(lightColor[1] * intensity),
          Math.floor(lightColor[2] * intensity)
        );
        p.rect(screenX, sy, screenWidth, 1);
      }

      // --- Draw intensity graph to the right ---
      const graphX = screenX + screenWidth + 10;
      const graphW = width - graphX - 10;
      if (graphW > 30) {
        p.stroke(255, 255, 255, 40);
        p.strokeWeight(1);
        p.line(graphX, 35, graphX, height - 35);

        p.noFill();
        p.stroke(PINK[0], PINK[1], PINK[2]);
        p.strokeWeight(1.5);
        p.drawingContext.shadowColor = PINK_HEX;
        p.drawingContext.shadowBlur = 4;
        p.beginShape();
        for (let sy = 35; sy < height - 35; sy++) {
          const y = sy - centerY;
          const theta = Math.atan2(y, L);
          const sinTheta = Math.sin(theta);
          const phi = Math.PI * dSim * sinTheta / lambdaSim;
          let interference = Math.cos(phi);
          interference = interference * interference;
          const beta = Math.PI * aSim * sinTheta / lambdaSim;
          let diffraction = 1;
          if (Math.abs(beta) > 0.001) {
            diffraction = Math.sin(beta) / beta;
            diffraction = diffraction * diffraction;
          }
          const intensity = interference * diffraction;
          p.vertex(graphX + intensity * graphW, sy);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;

        p.noStroke();
        p.fill(PINK[0], PINK[1], PINK[2]);
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        p.text('I', graphX + graphW / 2, 28);
      }

      // --- Labels ---
      p.noStroke();
      p.fill(255, 255, 255, 120);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Screen', screenX + screenWidth / 2, 28);

      // Slit separation label
      p.stroke(255, 255, 255, 60);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([3, 3]);
      p.line(barrierX + 15, slit1Y, barrierX + 35, slit1Y);
      p.line(barrierX + 15, slit2Y, barrierX + 35, slit2Y);
      p.line(barrierX + 25, slit1Y, barrierX + 25, slit2Y);
      p.drawingContext.setLineDash([]);
      p.noStroke();
      p.fill(255, 255, 255, 100);
      p.textSize(9);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('d', barrierX + 30, centerY);

      // --- Info panel ---
      p.fill(15, 15, 35, 220);
      p.stroke(PINK[0], PINK[1], PINK[2], 60);
      p.strokeWeight(1);
      p.rect(10, 35, 170, 100, 8);
      p.noStroke();

      p.fill(PINK[0], PINK[1], PINK[2]);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Double-Slit', 20, 43);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('\u03BB = ' + lambda.toFixed(0) + ' nm', 20, 63);
      p.text('d = ' + d.toFixed(0) + ' units', 20, 79);
      p.text('slit width = ' + slitW.toFixed(0), 20, 95);

      // Fringe spacing
      const fringeSpacing = (lambda / 20) * L / (d * slitScale);
      p.fill(0, 245, 212);
      p.text('\u0394y \u2248 ' + fringeSpacing.toFixed(1) + ' px', 20, 115);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Adjust wavelength and slit separation to see interference patterns change', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { slitSeparation: 40, wavelength: 550, slitWidth: 5 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'slitSeparation', label: 'Slit Separation (d)', min: 10, max: 100, step: 1, value: 40, unit: 'units' },
    { name: 'wavelength', label: 'Wavelength (\u03BB)', min: 380, max: 700, step: 5, value: 550, unit: 'nm' },
    { name: 'slitWidth', label: 'Slit Width', min: 1, max: 20, step: 1, value: 5, unit: 'units' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
