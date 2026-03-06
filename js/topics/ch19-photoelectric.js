// Photoelectric Effect — Shine light on metal, eject electrons
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }
  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'photoelectric-effect';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let electrons = [];
    let photons = [];
    let time = 0;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
    };

    engine.onReset(() => { electrons = []; photons = []; time = 0; });

    p.draw = () => {
      p.background(10, 10, 26);
      const freq = engine.getParam('frequency'); // in units of 10^15 Hz
      const intensity = engine.getParam('intensity');
      const workFunc = engine.getParam('workFunction');

      const h = 4.136; // eV·fs (h in eV·s × 10^15)
      const photonEnergy = h * freq; // eV
      const aboveThreshold = photonEnergy > workFunc;
      const kineticEnergy = aboveThreshold ? photonEnergy - workFunc : 0;

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;

        // Generate photons based on intensity
        if (Math.random() < intensity * 0.08 * engine.speed) {
          const startX = 50 + Math.random() * 150;
          const startY = 30 + Math.random() * 80;
          photons.push({ x: startX, y: startY, vx: 3, vy: 2.5 });
        }
      }

      // Metal plate
      const plateX = width * 0.4, plateY = 120, plateW = 20, plateH = 250;

      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#8b5cf6';
      p.fill(100, 100, 140);
      p.stroke(139, 92, 246, 100);
      p.strokeWeight(2);
      p.rect(plateX, plateY, plateW, plateH, 3);
      p.drawingContext.shadowBlur = 0;

      p.fill(255, 255, 255, 100);
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.CENTER);
      p.push();
      p.translate(plateX + 10, plateY + plateH / 2);
      p.rotate(-p.HALF_PI);
      p.text('Metal Surface', 0, -15);
      p.pop();

      // Wavelength to visible color
      const wl = 300 / freq; // approximate nm
      let r = 0, g = 0, b = 0;
      if (wl < 380) { r = 150; g = 0; b = 255; } // UV
      else if (wl < 440) { r = 100; g = 0; b = 255; }
      else if (wl < 490) { r = 0; g = 100; b = 255; }
      else if (wl < 510) { r = 0; g = 255; b = 200; }
      else if (wl < 580) { r = 200; g = 255; b = 0; }
      else if (wl < 645) { r = 255; g = 150; b = 0; }
      else { r = 255; g = 50; b = 50; } // IR/red

      // Update and draw photons
      for (let i = photons.length - 1; i >= 0; i--) {
        const ph = photons[i];
        if (engine.isPlaying) {
          ph.x += ph.vx * engine.speed;
          ph.y += ph.vy * engine.speed;
        }

        // Check collision with plate
        if (ph.x >= plateX - 5) {
          if (aboveThreshold) {
            // Eject electron
            const eSpeed = Math.sqrt(kineticEnergy) * 2;
            electrons.push({
              x: plateX + plateW + 5,
              y: ph.y + (Math.random() - 0.5) * 20,
              vx: eSpeed * (1 + Math.random() * 0.5),
              vy: (Math.random() - 0.5) * eSpeed * 0.5,
              life: 1
            });
          }
          photons.splice(i, 1);
          continue;
        }

        // Remove if off screen
        if (ph.x > width + 10 || ph.y > height + 10) {
          photons.splice(i, 1);
          continue;
        }

        // Draw photon
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = `rgb(${r},${g},${b})`;
        p.fill(r, g, b);
        p.noStroke();
        p.ellipse(ph.x, ph.y, 8, 8);

        // Wavy trail
        p.stroke(r, g, b, 80);
        p.strokeWeight(1);
        p.noFill();
        p.beginShape();
        for (let dx = -20; dx <= 0; dx += 2) {
          p.vertex(ph.x + dx, ph.y + Math.sin(dx * 0.5 + ph.x * 0.1) * 3);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      }

      // Update and draw electrons
      for (let i = electrons.length - 1; i >= 0; i--) {
        const e = electrons[i];
        if (engine.isPlaying) {
          e.x += e.vx * engine.speed;
          e.y += e.vy * engine.speed;
          e.life -= 0.005 * engine.speed;
        }

        if (e.life <= 0 || e.x > width + 10) {
          electrons.splice(i, 1);
          continue;
        }

        p.drawingContext.shadowBlur = 10;
        p.drawingContext.shadowColor = '#00f5d4';
        p.fill(0, 245, 212, e.life * 255);
        p.noStroke();
        p.ellipse(e.x, e.y, 6, 6);
        p.drawingContext.shadowBlur = 0;
      }

      // Light source
      p.drawingContext.shadowBlur = 15;
      p.drawingContext.shadowColor = `rgb(${r},${g},${b})`;
      p.fill(r, g, b, 150);
      p.noStroke();
      p.rect(10, 80, 40, 120, 8);
      p.fill(255);
      p.textSize(10);
      p.textAlign(p.CENTER);
      p.text('Light', 30, 145);
      p.drawingContext.shadowBlur = 0;

      // Energy diagram (right side)
      const diagX = width * 0.65, diagY = 80, diagH = 200;

      p.stroke(255, 255, 255, 60);
      p.strokeWeight(1);
      p.line(diagX, diagY, diagX, diagY + diagH);
      p.line(diagX - 10, diagY + diagH, diagX + 120, diagY + diagH);

      // Work function level
      const phiY = diagY + diagH - (workFunc / 8) * diagH;
      p.stroke(255, 68, 102, 150);
      p.strokeWeight(2);
      p.drawingContext.setLineDash([5, 5]);
      p.line(diagX, phiY, diagX + 120, phiY);
      p.drawingContext.setLineDash([]);
      p.fill(255, 68, 102);
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.LEFT);
      p.text(`φ = ${workFunc} eV`, diagX + 125, phiY + 4);

      // Photon energy level
      const peY = diagY + diagH - (photonEnergy / 8) * diagH;
      p.stroke(r, g, b);
      p.strokeWeight(2);
      p.line(diagX + 20, diagY + diagH, diagX + 20, Math.max(peY, diagY));

      // Arrow head
      const arrY = Math.max(peY, diagY);
      p.fill(r, g, b);
      p.noStroke();
      p.triangle(diagX + 20, arrY, diagX + 16, arrY + 8, diagX + 24, arrY + 8);
      p.textSize(10);
      p.textAlign(p.LEFT);
      p.text(`E = ${photonEnergy.toFixed(2)} eV`, diagX + 30, arrY + 10);

      // KE label if above threshold
      if (aboveThreshold) {
        const keY = Math.max(peY, diagY);
        p.fill(0, 245, 212);
        p.textSize(11);
        p.text(`KE = ${kineticEnergy.toFixed(2)} eV`, diagX + 30, keY - 10);

        // Bracket for KE
        p.stroke(0, 245, 212, 150);
        p.strokeWeight(1);
        p.line(diagX + 15, phiY, diagX + 15, keY);
      }

      // Labels
      p.noStroke();
      p.fill(255, 255, 255, 100);
      p.textSize(9);
      p.textAlign(p.CENTER);
      p.text('Energy', diagX - 15, diagY - 5);
      p.text('0', diagX - 12, diagY + diagH + 4);

      // Status message
      p.textSize(16);
      p.textAlign(p.CENTER);
      if (aboveThreshold) {
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = '#00f5d4';
        p.fill(0, 245, 212);
        p.text('Electrons ejected!', width * 0.5, height - 40);
        p.drawingContext.shadowBlur = 0;
        p.fill(255, 255, 255, 150);
        p.textSize(12);
        p.text(`KE = hf - φ = ${photonEnergy.toFixed(2)} - ${workFunc} = ${kineticEnergy.toFixed(2)} eV`, width * 0.5, height - 18);
      } else {
        p.fill(255, 68, 102);
        p.text('No electrons — frequency too low!', width * 0.5, height - 40);
        p.fill(255, 255, 255, 150);
        p.textSize(12);
        p.text(`Need f ≥ ${(workFunc / h).toFixed(2)} × 10¹⁵ Hz (threshold)`, width * 0.5, height - 18);
      }

      // Info
      p.fill(255, 255, 255, 200);
      p.textSize(12);
      p.textAlign(p.LEFT);
      p.text(`f = ${freq.toFixed(2)} × 10¹⁵ Hz`, 15, 25);
      p.text(`Intensity: ${intensity.toFixed(0)}`, 15, 42);
      p.text(`E_photon = hf = ${photonEnergy.toFixed(2)} eV`, 15, 59);
    };

    p.windowResized = () => { width = Math.min(p.windowWidth - 40, 800); p.resizeCanvas(width, height); };
  }, { frequency: 1.5, intensity: 5, workFunction: 3 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'frequency', label: 'Frequency', min: 0.1, max: 3, step: 0.05, value: 1.5, unit: '×10¹⁵ Hz' },
    { name: 'intensity', label: 'Intensity', min: 1, max: 10, step: 1, value: 5, unit: '' },
    { name: 'workFunction', label: 'Work Function', min: 1, max: 5, step: 0.1, value: 3, unit: 'eV' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
