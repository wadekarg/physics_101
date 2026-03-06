// Chapter 11: Heat & Temperature — Particle Kinetic Energy Simulation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'heat-temperature';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let particles = [];
    let speedHistogram = new Array(20).fill(0);

    function initParticles() {
      const count = Math.round(engine.getParam('particleCount'));
      const temp = engine.getParam('temperature');
      particles = [];
      for (let i = 0; i < count; i++) {
        const speed = getRandomSpeed(temp);
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: 80 + Math.random() * (width * 0.45 - 20),
          y: 60 + Math.random() * 250,
          vx: speed * Math.cos(angle),
          vy: speed * Math.sin(angle),
          radius: 3 + Math.random() * 2
        });
      }
    }

    function getRandomSpeed(temp) {
      // Maxwell-Boltzmann-like distribution using Box-Muller
      const kB = 1.38e-23;
      const m = 4.65e-26; // ~N2 molecule
      const sigma = Math.sqrt(kB * temp / m);
      const scaledSigma = sigma / 1e10 * 0.8; // scale for pixels
      // Generate from Rayleigh distribution (2D speed distribution)
      const u = Math.random();
      return scaledSigma * Math.sqrt(-2 * Math.log(1 - u));
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
      initParticles();
    };

    let lastCount = 0;
    let lastTemp = 0;

    p.draw = () => {
      p.background(10, 10, 26);

      const temp = engine.getParam('temperature');
      const count = Math.round(engine.getParam('particleCount'));

      // Reinitialize if params changed significantly
      if (count !== lastCount) {
        initParticles();
        lastCount = count;
        lastTemp = temp;
      }

      // Rescale velocities if temperature changed
      if (Math.abs(temp - lastTemp) > 5) {
        const ratio = Math.sqrt(temp / Math.max(1, lastTemp));
        for (const part of particles) {
          part.vx *= ratio;
          part.vy *= ratio;
        }
        lastTemp = temp;
      }

      // Box boundaries
      const boxLeft = 60;
      const boxTop = 55;
      const boxRight = width * 0.48;
      const boxBottom = 320;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Heat & Temperature: Particle Motion', width / 2, 8);

      // Update particles
      if (engine.isPlaying) {
        for (const part of particles) {
          part.x += part.vx * engine.speed;
          part.y += part.vy * engine.speed;

          // Wall collisions
          if (part.x - part.radius < boxLeft) { part.x = boxLeft + part.radius; part.vx *= -1; }
          if (part.x + part.radius > boxRight) { part.x = boxRight - part.radius; part.vx *= -1; }
          if (part.y - part.radius < boxTop) { part.y = boxTop + part.radius; part.vy *= -1; }
          if (part.y + part.radius > boxBottom) { part.y = boxBottom - part.radius; part.vy *= -1; }
        }
      }

      // Draw box
      p.stroke(100, 120, 160);
      p.strokeWeight(2);
      p.noFill();
      p.rect(boxLeft, boxTop, boxRight - boxLeft, boxBottom - boxTop, 4);

      // Draw box walls with glow based on temperature
      const tempNorm = (temp - 100) / 900;
      const wallR = 80 + tempNorm * 175;
      const wallG = 120 - tempNorm * 80;
      const wallB = 160 - tempNorm * 120;
      p.stroke(wallR, wallG, wallB, 100 + tempNorm * 100);
      p.strokeWeight(3);
      p.drawingContext.shadowBlur = 8 + tempNorm * 15;
      p.drawingContext.shadowColor = `rgba(${Math.round(wallR)},${Math.round(wallG)},${Math.round(wallB)},0.6)`;
      p.noFill();
      p.rect(boxLeft, boxTop, boxRight - boxLeft, boxBottom - boxTop, 4);
      p.drawingContext.shadowBlur = 0;

      // Draw particles with speed-based coloring
      let maxSpeed = 0;
      for (const part of particles) {
        const speed = Math.sqrt(part.vx * part.vx + part.vy * part.vy);
        if (speed > maxSpeed) maxSpeed = speed;
      }

      for (const part of particles) {
        const speed = Math.sqrt(part.vx * part.vx + part.vy * part.vy);
        const speedNorm = maxSpeed > 0 ? speed / maxSpeed : 0;

        // Color: blue (slow) -> cyan -> yellow -> red (fast)
        let r, g, b;
        if (speedNorm < 0.33) {
          const t = speedNorm / 0.33;
          r = 50; g = 100 + t * 155; b = 255;
        } else if (speedNorm < 0.66) {
          const t = (speedNorm - 0.33) / 0.33;
          r = 50 + t * 205; g = 255; b = 255 - t * 200;
        } else {
          const t = (speedNorm - 0.66) / 0.34;
          r = 255; g = 255 - t * 200; b = 55 - t * 55;
        }

        p.drawingContext.shadowBlur = 6;
        p.drawingContext.shadowColor = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
        p.fill(r, g, b);
        p.noStroke();
        p.ellipse(part.x, part.y, part.radius * 2, part.radius * 2);
      }
      p.drawingContext.shadowBlur = 0;

      // Build speed histogram
      speedHistogram.fill(0);
      const binMax = maxSpeed * 1.2 + 0.1;
      const binSize = binMax / speedHistogram.length;
      for (const part of particles) {
        const speed = Math.sqrt(part.vx * part.vx + part.vy * part.vy);
        const bin = Math.min(speedHistogram.length - 1, Math.floor(speed / binSize));
        speedHistogram[bin]++;
      }

      // Draw histogram (Maxwell-Boltzmann distribution)
      const histX = width * 0.55;
      const histW = width * 0.4;
      const histY = 55;
      const histH = 150;
      const histBottom = histY + histH;

      p.fill(15, 15, 35, 200);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(histX, histY, histW, histH + 30, 8);

      p.noStroke();
      p.fill(0, 180, 216);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Speed Distribution (Maxwell-Boltzmann)', histX + histW / 2, histY + 4);

      // Axes
      p.stroke(255, 255, 255, 50);
      p.strokeWeight(1);
      p.line(histX + 30, histBottom - 5, histX + histW - 10, histBottom - 5);
      p.line(histX + 30, histY + 20, histX + 30, histBottom - 5);

      p.noStroke();
      p.fill(150, 150, 170);
      p.textSize(9);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Speed \u2192', histX + histW / 2, histBottom + 2);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.push();
      p.translate(histX + 15, histY + histH / 2 + 10);
      p.rotate(-Math.PI / 2);
      p.text('Count \u2192', 0, 0);
      p.pop();

      // Draw bars
      const maxCount = Math.max(1, ...speedHistogram);
      const barW = (histW - 45) / speedHistogram.length;
      for (let i = 0; i < speedHistogram.length; i++) {
        const barH = (speedHistogram[i] / maxCount) * (histH - 30);
        const speedNorm = i / speedHistogram.length;

        let r, g, b;
        if (speedNorm < 0.33) {
          r = 50; g = 100 + speedNorm * 3 * 155; b = 255;
        } else if (speedNorm < 0.66) {
          const t = (speedNorm - 0.33) / 0.33;
          r = 50 + t * 205; g = 255; b = 255 - t * 200;
        } else {
          const t = (speedNorm - 0.66) / 0.34;
          r = 255; g = 255 - t * 200; b = 55 - t * 55;
        }

        p.fill(r, g, b, 180);
        p.noStroke();
        p.rect(histX + 32 + i * barW, histBottom - 5 - barH, barW - 1, barH);
      }

      // Theoretical MB curve overlay
      p.noFill();
      p.stroke(255, 255, 255, 100);
      p.strokeWeight(1.5);
      p.beginShape();
      const kB = 1.38e-23;
      const m = 4.65e-26;
      for (let i = 0; i < speedHistogram.length; i++) {
        const vCenter = (i + 0.5) * binSize;
        const scaledV = vCenter * 1e10 / 0.8;
        // 2D MB: f(v) = (m/(kB*T)) * v * exp(-m*v^2/(2*kB*T))
        const fv = (m / (kB * temp)) * scaledV * Math.exp(-m * scaledV * scaledV / (2 * kB * temp));
        const normalizedFv = fv * particles.length * binSize * 1e10 / 0.8;
        const barH = Math.min(histH - 30, (normalizedFv / maxCount) * (histH - 30));
        p.vertex(histX + 32 + (i + 0.5) * barW, histBottom - 5 - barH);
      }
      p.endShape();

      // Temperature thermometer visual
      const thermX = boxRight + 15;
      const thermTop = boxTop + 20;
      const thermBot = boxBottom - 20;
      const thermW = 14;
      const fillH = tempNorm * (thermBot - thermTop - 10);

      p.fill(30, 30, 50);
      p.stroke(100, 100, 120);
      p.strokeWeight(1);
      p.rect(thermX, thermTop, thermW, thermBot - thermTop, 7);

      // Fill
      const thermGrad = p.drawingContext.createLinearGradient(0, thermBot, 0, thermBot - fillH);
      thermGrad.addColorStop(0, 'rgba(255,50,50,0.9)');
      thermGrad.addColorStop(1, 'rgba(255,200,50,0.9)');
      p.drawingContext.fillStyle = thermGrad;
      p.noStroke();
      p.rect(thermX + 2, thermBot - fillH - 2, thermW - 4, fillH, 3);

      // Bulb
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = `rgba(${Math.round(wallR)},50,50,0.8)`;
      p.fill(wallR, 50, 50);
      p.ellipse(thermX + thermW / 2, thermBot + 8, 22, 22);
      p.drawingContext.shadowBlur = 0;

      p.fill(255);
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(temp + 'K', thermX + thermW / 2, thermBot + 8);

      // Info panel
      const infoX = width * 0.55;
      const infoY = histY + histH + 45;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(infoX, infoY, width * 0.4, 110, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Kinetic Theory of Heat:', infoX + 10, infoY + 6);

      p.fill(0, 255, 200);
      p.textSize(11);
      p.text('KE_avg = \u00BE k_B T', infoX + 10, infoY + 24);

      const keAvg = 1.5 * kB * temp;
      const vrms = Math.sqrt(3 * kB * temp / m);

      p.fill(200, 200, 220);
      p.textSize(10);
      p.text('T = ' + temp + ' K', infoX + 10, infoY + 42);
      p.text('KE_avg = ' + (keAvg * 1e21).toFixed(2) + ' \u00D7 10\u207B\u00B2\u00B9 J', infoX + 10, infoY + 56);
      p.text('v_rms = ' + vrms.toFixed(0) + ' m/s', infoX + 10, infoY + 70);
      p.text('Particles: ' + count, infoX + 10, infoY + 84);
      p.text('Higher T \u2192 faster particles \u2192 wider distribution', infoX + 10, infoY + 98);

      // Color legend
      const legX = 60;
      const legY = boxBottom + 10;
      p.fill(50, 100, 255); p.noStroke(); p.ellipse(legX, legY + 5, 8, 8);
      p.fill(150, 150, 170); p.textSize(9); p.textAlign(p.LEFT, p.CENTER); p.text('Slow', legX + 8, legY + 5);
      p.fill(50, 255, 50); p.ellipse(legX + 50, legY + 5, 8, 8);
      p.fill(150, 150, 170); p.text('Medium', legX + 58, legY + 5);
      p.fill(255, 50, 50); p.ellipse(legX + 120, legY + 5, 8, 8);
      p.fill(150, 150, 170); p.text('Fast', legX + 128, legY + 5);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Higher temperature = faster particles. Watch the speed distribution change!', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { temperature: 300, particleCount: 50 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'temperature', label: 'Temperature', min: 100, max: 1000, step: 50, value: 300, unit: 'K' },
    { name: 'particleCount', label: 'Particle Count', min: 20, max: 100, step: 5, value: 50, unit: '' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
