// Chapter 11: Ideal Gas Law — PV=nRT Piston Simulation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'ideal-gas-law';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let gasParticles = [];
    let lastVolume = 0;
    let lastTemp = 0;
    let lastCount = 0;

    function initGasParticles(count, containerLeft, containerRight, containerTop, containerBottom, temp) {
      gasParticles = [];
      const speedScale = Math.sqrt(temp / 300) * 2;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.5 + Math.random() * 1.5) * speedScale;
        gasParticles.push({
          x: containerLeft + 10 + Math.random() * (containerRight - containerLeft - 20),
          y: containerTop + 10 + Math.random() * (containerBottom - containerTop - 20),
          vx: speed * Math.cos(angle),
          vy: speed * Math.sin(angle),
          r: 2.5 + Math.random() * 1.5
        });
      }
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const temp = engine.getParam('temperature');
      const volume = engine.getParam('volume');
      const nParticles = Math.round(engine.getParam('particles'));

      const R = 8.314; // J/(mol*K)
      const n = nParticles / 20; // moles (scaled)
      const pressure = (n * R * temp) / volume; // Pa (scaled)

      // Container dimensions based on volume
      const containerLeft = 80;
      const containerBottom = 320;
      const containerTop = 60;
      const containerHeight = containerBottom - containerTop;
      const maxWidth = width * 0.45;
      const containerWidth = (volume / 3) * maxWidth;
      const containerRight = containerLeft + containerWidth;

      // Piston position
      const pistonX = containerRight;
      const pistonW = 15;

      // Reinit particles if needed
      if (nParticles !== lastCount || Math.abs(volume - lastVolume) > 0.3) {
        initGasParticles(nParticles, containerLeft, containerRight, containerTop, containerBottom, temp);
        lastCount = nParticles;
        lastVolume = volume;
        lastTemp = temp;
      }

      // Adjust speeds if temperature changed
      if (Math.abs(temp - lastTemp) > 10 && lastTemp > 0) {
        const ratio = Math.sqrt(temp / lastTemp);
        for (const part of gasParticles) {
          part.vx *= ratio;
          part.vy *= ratio;
        }
        lastTemp = temp;
      }

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Ideal Gas Law: PV = nRT', width / 2, 8);

      // Update particles
      if (engine.isPlaying) {
        for (const part of gasParticles) {
          part.x += part.vx * engine.speed;
          part.y += part.vy * engine.speed;

          // Wall collisions
          if (part.x - part.r < containerLeft + 3) {
            part.x = containerLeft + 3 + part.r;
            part.vx = Math.abs(part.vx);
          }
          if (part.x + part.r > pistonX - 3) {
            part.x = pistonX - 3 - part.r;
            part.vx = -Math.abs(part.vx);
          }
          if (part.y - part.r < containerTop + 3) {
            part.y = containerTop + 3 + part.r;
            part.vy = Math.abs(part.vy);
          }
          if (part.y + part.r > containerBottom - 3) {
            part.y = containerBottom - 3 - part.r;
            part.vy = -Math.abs(part.vy);
          }

          // Clamp position inside container
          part.x = Math.max(containerLeft + 3 + part.r, Math.min(pistonX - 3 - part.r, part.x));
          part.y = Math.max(containerTop + 3 + part.r, Math.min(containerBottom - 3 - part.r, part.y));
        }
      }

      // Draw container
      p.stroke(100, 120, 160);
      p.strokeWeight(3);
      p.noFill();
      // Left wall
      p.line(containerLeft, containerTop, containerLeft, containerBottom);
      // Top wall
      p.line(containerLeft, containerTop, pistonX + pistonW, containerTop);
      // Bottom wall
      p.line(containerLeft, containerBottom, pistonX + pistonW, containerBottom);

      // Draw piston
      const tempNorm = (temp - 200) / 400;
      const pistonGlow = tempNorm * 20;
      p.drawingContext.shadowBlur = 8 + pistonGlow;
      p.drawingContext.shadowColor = '#888aff';
      p.fill(100, 100, 180);
      p.stroke(140, 140, 200);
      p.strokeWeight(2);
      p.rect(pistonX, containerTop, pistonW, containerHeight, 0, 3, 3, 0);
      p.drawingContext.shadowBlur = 0;

      // Piston handle
      p.fill(80, 80, 100);
      p.noStroke();
      p.rect(pistonX + pistonW, (containerTop + containerBottom) / 2 - 5, 30, 10, 0, 3, 3, 0);

      // Piston arrows showing pressure direction
      const arrowLen = Math.min(40, pressure / 500);
      p.stroke(255, 200, 50);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 4;
      p.drawingContext.shadowColor = '#ffc832';
      for (let i = 0; i < 3; i++) {
        const ay = containerTop + (i + 1) * containerHeight / 4;
        p.line(pistonX - 5, ay, pistonX - 5 - arrowLen, ay);
      }
      p.drawingContext.shadowBlur = 0;

      // Draw particles
      for (const part of gasParticles) {
        const speed = Math.sqrt(part.vx * part.vx + part.vy * part.vy);
        const maxSpeed = Math.sqrt(temp / 300) * 4;
        const speedNorm = Math.min(1, speed / (maxSpeed + 0.1));

        let r, g, b;
        if (speedNorm < 0.5) {
          r = 80; g = 150 + speedNorm * 210; b = 255;
        } else {
          r = 80 + (speedNorm - 0.5) * 350; g = 255 - (speedNorm - 0.5) * 200; b = 255 - (speedNorm - 0.5) * 400;
        }

        p.drawingContext.shadowBlur = 5;
        p.drawingContext.shadowColor = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
        p.fill(r, g, b);
        p.noStroke();
        p.ellipse(part.x, part.y, part.r * 2, part.r * 2);
      }
      p.drawingContext.shadowBlur = 0;

      // Volume label
      p.fill(255, 255, 255, 100);
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('V = ' + volume.toFixed(1) + ' L', (containerLeft + pistonX) / 2, containerBottom + 15);

      // PV=nRT display / equation panel
      const eqX = width * 0.55;
      const eqY = 50;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(eqX, eqY, width * 0.4, 130, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(14);
      p.textAlign(p.LEFT, p.TOP);
      p.text('PV = nRT', eqX + 10, eqY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('P = ' + (pressure / 1000).toFixed(2) + ' kPa', eqX + 10, eqY + 32);
      p.text('V = ' + volume.toFixed(2) + ' L', eqX + 10, eqY + 48);
      p.text('n = ' + n.toFixed(2) + ' mol', eqX + 10, eqY + 64);
      p.text('R = 8.314 J/(mol\u00B7K)', eqX + 10, eqY + 80);
      p.text('T = ' + temp + ' K', eqX + 10, eqY + 96);

      p.fill(0, 255, 200);
      p.textSize(11);
      p.text('PV = ' + ((pressure / 1000) * volume).toFixed(1) + ' kPa\u00B7L', eqX + 10, eqY + 114);

      // Relationship explanations
      const relX = width * 0.55;
      const relY = eqY + 145;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(relX, relY, width * 0.4, 100, 8);

      p.noStroke();
      p.fill(255, 200, 50);
      p.textSize(11);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Key Relationships:', relX + 10, relY + 6);

      p.fill(200, 200, 220);
      p.textSize(10);
      p.text('\u2022 T\u2191 \u2192 particles faster \u2192 P\u2191', relX + 10, relY + 24);
      p.text('\u2022 V\u2193 \u2192 more collisions \u2192 P\u2191', relX + 10, relY + 40);
      p.text('\u2022 n\u2191 \u2192 more particles \u2192 P\u2191', relX + 10, relY + 56);
      p.text('\u2022 At constant T: P\u2081V\u2081 = P\u2082V\u2082', relX + 10, relY + 72);
      p.text('  (Boyle\'s Law)', relX + 10, relY + 86);

      // Pressure gauge
      const gaugeX = width * 0.55;
      const gaugeY = relY + 110;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(gaugeX, gaugeY, width * 0.4, 35, 8);

      const maxP = (nParticles / 20) * R * 600 / 0.5;
      const pNorm = Math.min(1, pressure / maxP);
      const barW = (width * 0.4 - 100) * pNorm;

      p.noStroke();
      p.fill(0, 180, 216);
      p.textSize(10);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('Pressure:', gaugeX + 10, gaugeY + 17);

      // Pressure bar
      const pBarX = gaugeX + 80;
      p.fill(30, 30, 50);
      p.rect(pBarX, gaugeY + 10, width * 0.4 - 100, 14, 4);
      p.drawingContext.shadowBlur = 4;
      p.drawingContext.shadowColor = pNorm > 0.7 ? '#ff5050' : '#00ffc8';
      p.fill(pNorm > 0.7 ? 255 : 0, pNorm > 0.7 ? 80 : 255, pNorm > 0.7 ? 80 : 200);
      p.rect(pBarX, gaugeY + 10, barW, 14, 4);
      p.drawingContext.shadowBlur = 0;

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Adjust T, V, and particle count to explore the ideal gas law', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { temperature: 300, volume: 2, particles: 30 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'temperature', label: 'Temperature', min: 200, max: 600, step: 25, value: 300, unit: 'K' },
    { name: 'volume', label: 'Volume', min: 0.5, max: 3, step: 0.1, value: 2, unit: 'L' },
    { name: 'particles', label: 'Particles', min: 10, max: 50, step: 5, value: 30, unit: '' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
