// Chapter 10: Bernoulli's Principle — Fluid Flow Through a Pipe
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'bernoulli';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;
    let particles = [];

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
      initParticles();
    };

    function initParticles() {
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * width,
          y: 0,
          speed: 0
        });
      }
    }

    function getPipeY(x, pipeW1, pipeW2) {
      const pipeStartX = 60;
      const pipeEndX = width - 60;
      const narrowStart = width * 0.35;
      const narrowEnd = width * 0.65;
      const transitionLen = 60;

      let halfWidth;
      if (x < narrowStart - transitionLen) {
        halfWidth = pipeW1 / 2;
      } else if (x < narrowStart) {
        const t = (x - (narrowStart - transitionLen)) / transitionLen;
        const smooth = t * t * (3 - 2 * t); // smoothstep
        halfWidth = pipeW1 / 2 + (pipeW2 / 2 - pipeW1 / 2) * smooth;
      } else if (x < narrowEnd) {
        halfWidth = pipeW2 / 2;
      } else if (x < narrowEnd + transitionLen) {
        const t = (x - narrowEnd) / transitionLen;
        const smooth = t * t * (3 - 2 * t);
        halfWidth = pipeW2 / 2 + (pipeW1 / 2 - pipeW2 / 2) * smooth;
      } else {
        halfWidth = pipeW1 / 2;
      }
      return { top: height / 2 - halfWidth, bottom: height / 2 + halfWidth, halfWidth };
    }

    function getFlowSpeed(x, pipeW1, pipeW2, v1) {
      const pipe = getPipeY(x, pipeW1, pipeW2);
      const currentWidth = pipe.halfWidth * 2;
      // Continuity: A1*v1 = A2*v2 => v2 = v1 * A1/A2 = v1 * w1/w2
      return v1 * (pipeW1 / currentWidth);
    }

    p.draw = () => {
      p.background(10, 10, 26);

      const pipeW1 = engine.getParam('pipeWidth1');
      const pipeW2 = engine.getParam('pipeWidth2');
      const v1 = engine.getParam('flowSpeed');

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;
      }

      const pipeStartX = 60;
      const pipeEndX = width - 60;
      const narrowStart = width * 0.35;
      const narrowEnd = width * 0.65;

      // Continuity equation: A1*v1 = A2*v2
      const v2 = v1 * (pipeW1 / pipeW2);

      // Bernoulli: P1 + 0.5*rho*v1^2 = P2 + 0.5*rho*v2^2
      const rho = 1000; // water density
      const P1 = 101325; // atmospheric + some pressure (Pa)
      const P2 = P1 + 0.5 * rho * (v1 * v1 - v2 * v2);

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Bernoulli\'s Principle', width / 2, 8);

      // Draw pipe walls
      p.noFill();
      p.stroke(100, 120, 160);
      p.strokeWeight(3);

      // Top wall
      p.beginShape();
      for (let x = pipeStartX; x <= pipeEndX; x += 3) {
        const pipe = getPipeY(x, pipeW1, pipeW2);
        p.vertex(x, pipe.top);
      }
      p.endShape();

      // Bottom wall
      p.beginShape();
      for (let x = pipeStartX; x <= pipeEndX; x += 3) {
        const pipe = getPipeY(x, pipeW1, pipeW2);
        p.vertex(x, pipe.bottom);
      }
      p.endShape();

      // Fill pipe interior with gradient indicating pressure
      for (let x = pipeStartX; x <= pipeEndX; x += 3) {
        const pipe = getPipeY(x, pipeW1, pipeW2);
        const localV = getFlowSpeed(x, pipeW1, pipeW2, v1);
        const speedNorm = (localV - v1) / (v2 - v1 + 0.001);
        // Higher speed = lower pressure = cooler color
        const r = 20 + (1 - speedNorm) * 30;
        const g = 40 + (1 - speedNorm) * 60;
        const b = 80 + speedNorm * 80;
        p.stroke(r, g, b, 60);
        p.strokeWeight(3);
        p.line(x, pipe.top + 2, x, pipe.bottom - 2);
      }

      // Update and draw particles
      if (engine.isPlaying) {
        for (const part of particles) {
          const localSpeed = getFlowSpeed(part.x, pipeW1, pipeW2, v1);
          part.speed = localSpeed;
          part.x += localSpeed * 15 * (1 / 60) * engine.speed;

          // Reset particle to left when it exits
          if (part.x > pipeEndX + 10) {
            part.x = pipeStartX - 10;
          }

          // Position y within pipe
          const pipe = getPipeY(part.x, pipeW1, pipeW2);
          if (part.y === 0 || part.y < pipe.top + 5 || part.y > pipe.bottom - 5) {
            part.y = pipe.top + 5 + Math.random() * (pipe.bottom - pipe.top - 10);
          }
          // Adjust y to stay within pipe as it narrows
          const targetRange = pipe.bottom - pipe.top - 10;
          const normalizedY = (part.y - (height / 2)) / (pipeW1 / 2);
          part.y = height / 2 + normalizedY * (pipe.halfWidth - 5);
        }
      }

      for (const part of particles) {
        if (part.x < pipeStartX || part.x > pipeEndX) continue;
        const speedNorm = (part.speed - v1) / (Math.max(v2, v1 + 0.01) - v1);
        const r = 50 + speedNorm * 200;
        const g = 200 - speedNorm * 100;
        const b = 255 - speedNorm * 100;
        const size = 3 + speedNorm * 2;
        p.drawingContext.shadowBlur = 4;
        p.drawingContext.shadowColor = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
        p.fill(r, g, b, 200);
        p.noStroke();
        p.ellipse(part.x, part.y, size, size);
      }
      p.drawingContext.shadowBlur = 0;

      // Velocity arrows in wide and narrow sections
      const wideX = width * 0.2;
      const narrowX = width * 0.5;
      const wideX2 = width * 0.8;

      // Arrow in wide section
      p.stroke(0, 255, 200);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#00ffc8';
      const wArrowLen = Math.min(v1 * 6, 40);
      p.line(wideX, height / 2, wideX + wArrowLen, height / 2);
      p.line(wideX + wArrowLen, height / 2, wideX + wArrowLen - 6, height / 2 - 4);
      p.line(wideX + wArrowLen, height / 2, wideX + wArrowLen - 6, height / 2 + 4);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(0, 255, 200);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('v\u2081=' + v1.toFixed(1) + ' m/s', wideX + wArrowLen / 2, height / 2 - 6);

      // Arrow in narrow section (longer = faster)
      p.stroke(255, 100, 100);
      p.strokeWeight(2.5);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#ff6464';
      const nArrowLen = Math.min(v2 * 6, 60);
      p.line(narrowX, height / 2, narrowX + nArrowLen, height / 2);
      p.line(narrowX + nArrowLen, height / 2, narrowX + nArrowLen - 6, height / 2 - 4);
      p.line(narrowX + nArrowLen, height / 2, narrowX + nArrowLen - 6, height / 2 + 4);
      p.drawingContext.shadowBlur = 0;
      p.noStroke();
      p.fill(255, 100, 100);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('v\u2082=' + v2.toFixed(1) + ' m/s', narrowX + nArrowLen / 2, height / 2 - 6);

      // Pressure indicators (manometer tubes)
      const manH1 = Math.min(60, P1 / 5000);
      const manH2 = Math.min(60, Math.max(5, P2 / 5000));

      // Wide section manometer
      const manX1 = width * 0.22;
      const pipeAtMan1 = getPipeY(manX1, pipeW1, pipeW2);
      p.stroke(0, 180, 255, 150);
      p.strokeWeight(4);
      p.line(manX1, pipeAtMan1.top, manX1, pipeAtMan1.top - manH1);
      p.fill(0, 180, 255, 150);
      p.noStroke();
      p.textSize(9);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('P\u2081 (high)', manX1, pipeAtMan1.top - manH1 - 3);

      // Narrow section manometer
      const manX2 = width * 0.5;
      const pipeAtMan2 = getPipeY(manX2, pipeW1, pipeW2);
      p.stroke(0, 180, 255, 100);
      p.strokeWeight(4);
      p.line(manX2, pipeAtMan2.top, manX2, pipeAtMan2.top - manH2);
      p.fill(0, 180, 255, 100);
      p.noStroke();
      p.textSize(9);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('P\u2082 (low)', manX2, pipeAtMan2.top - manH2 - 3);

      // Width labels
      p.fill(255, 200, 50, 150);
      p.textSize(9);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('A\u2081 (wide)', wideX, height / 2 + pipeW1 / 2 + 15);
      p.text('A\u2082 (narrow)', narrowX, height / 2 + pipeW2 / 2 + 15);

      // Info panel
      const infoX = 30;
      const infoY = height - 120;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(infoX, infoY, 350, 105, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Bernoulli\'s Equation:', infoX + 10, infoY + 6);

      p.fill(0, 255, 200);
      p.textSize(12);
      p.text('P + \u00BD\u03C1v\u00B2 + \u03C1gh = constant', infoX + 10, infoY + 24);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('Continuity: A\u2081v\u2081 = A\u2082v\u2082', infoX + 10, infoY + 44);
      p.text('v\u2081 = ' + v1.toFixed(1) + ' m/s  \u2192  v\u2082 = ' + v2.toFixed(1) + ' m/s', infoX + 10, infoY + 62);
      p.text('Speed \u2191 in narrow section, Pressure \u2193', infoX + 10, infoY + 80);

      // Key insight
      const info2X = width - 240;
      p.fill(15, 15, 35, 220);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(info2X, infoY, 210, 105, 8);

      p.noStroke();
      p.fill(255, 200, 50);
      p.textSize(11);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Key Insight:', info2X + 10, infoY + 6);

      p.fill(200, 200, 220);
      p.textSize(10);
      p.text('Faster flow = Lower pressure', info2X + 10, infoY + 24);
      p.text('Slower flow = Higher pressure', info2X + 10, infoY + 40);
      p.text('', info2X + 10, infoY + 56);
      p.text('Speed ratio: ' + (v2 / v1).toFixed(1) + '\u00D7', info2X + 10, infoY + 56);
      p.text('Area ratio: ' + (pipeW1 / pipeW2).toFixed(1) + '\u00D7', info2X + 10, infoY + 72);
      p.text('\u0394P = ' + ((P1 - P2) / 1000).toFixed(1) + ' kPa', info2X + 10, infoY + 88);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Narrower pipe = faster flow, lower pressure. Watch the particles accelerate!', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
      initParticles();
    };
  }, { pipeWidth1: 80, pipeWidth2: 30, flowSpeed: 3 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'pipeWidth1', label: 'Wide Section', min: 60, max: 120, step: 5, value: 80, unit: 'px' },
    { name: 'pipeWidth2', label: 'Narrow Section', min: 20, max: 60, step: 5, value: 30, unit: 'px' },
    { name: 'flowSpeed', label: 'Flow Speed (v\u2081)', min: 1, max: 10, step: 0.5, value: 3, unit: 'm/s' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
