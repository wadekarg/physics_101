// Chapter 8: Springs & Hooke's Law — Mass-Spring SHM Simulation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'springs-hookes-law';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;
    let trail = [];

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 400;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const k = engine.getParam('springConstant');
      const m = engine.getParam('mass');
      const damp = engine.getParam('damping');
      const initDisp = engine.getParam('displacement');

      if (engine.isPlaying) {
        time += (1 / 60) * engine.speed;
      }

      // Physics: damped SHM  x(t) = A * e^(-γt) * cos(ωt)
      const omega = Math.sqrt(k / m);
      const gamma = damp / (2 * m);
      const amplitude = initDisp * Math.exp(-gamma * time);
      const displacement = amplitude * Math.cos(omega * time);
      const velocity = -amplitude * omega * Math.sin(omega * time) - gamma * amplitude * Math.cos(omega * time);
      const force = -k * displacement;
      const period = (2 * Math.PI) / omega;

      // Anchor point (top center)
      const anchorX = width * 0.35;
      const anchorY = 50;
      const restY = anchorY + 150;
      const massY = restY + displacement;
      const massRadius = Math.max(15, Math.min(35, m * 3));

      // Draw title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Hooke\'s Law: F = -kx', width / 2, 8);

      // Draw ceiling
      p.stroke(100, 100, 120);
      p.strokeWeight(2);
      p.line(anchorX - 60, anchorY - 5, anchorX + 60, anchorY - 5);
      for (let i = -60; i < 60; i += 12) {
        p.line(anchorX + i, anchorY - 5, anchorX + i - 8, anchorY - 18);
      }

      // Draw spring (zigzag)
      const springTop = anchorY;
      const springBottom = massY - massRadius;
      const coils = 12;
      const coilWidth = 20;
      p.stroke(0, 255, 200);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#00ffc8';
      p.noFill();
      p.beginShape();
      p.vertex(anchorX, springTop);
      for (let i = 0; i <= coils; i++) {
        const t = i / coils;
        const sy = springTop + t * (springBottom - springTop);
        const sx = anchorX + (i % 2 === 0 ? -coilWidth : coilWidth);
        if (i === 0 || i === coils) {
          p.vertex(anchorX, sy);
        } else {
          p.vertex(sx, sy);
        }
      }
      p.endShape();
      p.drawingContext.shadowBlur = 0;

      // Draw equilibrium line
      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([4, 4]);
      p.line(anchorX - 80, restY, anchorX + 80, restY);
      p.drawingContext.setLineDash([]);
      p.noStroke();
      p.fill(255, 255, 255, 80);
      p.textSize(10);
      p.textAlign(p.LEFT, p.CENTER);
      p.text('equilibrium', anchorX + 45, restY);

      // Draw displacement arrow
      if (Math.abs(displacement) > 2) {
        p.stroke(255, 200, 50);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = '#ffc832';
        const arrowX = anchorX - 50;
        p.line(arrowX, restY, arrowX, massY);
        // Arrowhead
        const dir = displacement > 0 ? 1 : -1;
        p.line(arrowX, massY, arrowX - 5, massY - 8 * dir);
        p.line(arrowX, massY, arrowX + 5, massY - 8 * dir);
        p.drawingContext.shadowBlur = 0;
        p.noStroke();
        p.fill(255, 200, 50);
        p.textSize(11);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text('x=' + displacement.toFixed(1) + 'px', arrowX - 5, (restY + massY) / 2);
      }

      // Draw force arrow on mass
      if (Math.abs(force) > 0.5) {
        const forceScale = 0.8;
        const forceLen = Math.max(-80, Math.min(80, force * forceScale));
        const fArrowX = anchorX + 50;
        p.stroke(255, 80, 80);
        p.strokeWeight(2.5);
        p.drawingContext.shadowBlur = 10;
        p.drawingContext.shadowColor = '#ff5050';
        p.line(fArrowX, massY, fArrowX, massY + forceLen);
        const fDir = forceLen > 0 ? 1 : -1;
        p.line(fArrowX, massY + forceLen, fArrowX - 5, massY + forceLen - 8 * fDir);
        p.line(fArrowX, massY + forceLen, fArrowX + 5, massY + forceLen - 8 * fDir);
        p.drawingContext.shadowBlur = 0;
        p.noStroke();
        p.fill(255, 80, 80);
        p.textSize(11);
        p.textAlign(p.LEFT, p.CENTER);
        p.text('F=' + force.toFixed(1) + 'N', fArrowX + 8, massY + forceLen / 2);
      }

      // Draw mass
      p.drawingContext.shadowBlur = 20;
      p.drawingContext.shadowColor = '#8b5cf6';
      p.fill(139, 92, 246);
      p.noStroke();
      p.ellipse(anchorX, massY, massRadius * 2, massRadius * 2);
      p.drawingContext.shadowBlur = 6;
      p.fill(180, 140, 255);
      p.ellipse(anchorX - massRadius * 0.2, massY - massRadius * 0.2, massRadius * 0.5, massRadius * 0.5);
      p.drawingContext.shadowBlur = 0;

      // Draw mass label
      p.fill(255);
      p.textSize(11);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(m.toFixed(1) + 'kg', anchorX, massY);

      // Trail / graph on right side
      if (engine.isPlaying) {
        trail.push(displacement);
        if (trail.length > 300) trail.shift();
      }

      // Graph panel
      const graphX = width * 0.6;
      const graphW = width * 0.35;
      const graphY = 50;
      const graphH = 160;
      const graphCenterY = graphY + graphH / 2;

      p.fill(15, 15, 35, 200);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(graphX, graphY, graphW, graphH, 8);

      p.noStroke();
      p.fill(0, 180, 216);
      p.textSize(12);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Displacement vs Time', graphX + graphW / 2, graphY + 5);

      // Center line
      p.stroke(255, 255, 255, 40);
      p.strokeWeight(1);
      p.line(graphX + 5, graphCenterY, graphX + graphW - 5, graphCenterY);

      // Plot trail
      if (trail.length > 1) {
        p.noFill();
        p.stroke(0, 255, 200);
        p.strokeWeight(1.5);
        p.drawingContext.shadowBlur = 4;
        p.drawingContext.shadowColor = '#00ffc8';
        p.beginShape();
        for (let i = 0; i < trail.length; i++) {
          const tx = graphX + 5 + (i / 300) * (graphW - 10);
          const ty = graphCenterY - (trail[i] / (initDisp + 10)) * (graphH / 2 - 10);
          p.vertex(tx, ty);
        }
        p.endShape();
        p.drawingContext.shadowBlur = 0;
      }

      // Info panel
      const infoX = graphX;
      const infoY = graphY + graphH + 20;
      p.fill(15, 15, 35, 200);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(infoX, infoY, graphW, 145, 8);

      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(13);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Physics:', infoX + 10, infoY + 8);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('k = ' + k.toFixed(1) + ' N/m', infoX + 10, infoY + 28);
      p.text('m = ' + m.toFixed(1) + ' kg', infoX + 10, infoY + 44);
      p.text('\u03C9 = \u221A(k/m) = ' + omega.toFixed(2) + ' rad/s', infoX + 10, infoY + 60);

      p.fill(0, 255, 200);
      p.textSize(12);
      p.text('T = 2\u03C0\u221A(m/k) = ' + period.toFixed(3) + ' s', infoX + 10, infoY + 80);

      p.fill(200, 200, 220);
      p.textSize(11);
      p.text('f = ' + (1 / period).toFixed(3) + ' Hz', infoX + 10, infoY + 100);
      p.text('x = ' + displacement.toFixed(1) + ' px', infoX + 10, infoY + 116);
      p.text('F = ' + force.toFixed(1) + ' N', infoX + 10, infoY + 132);

      // Instruction
      p.fill(255, 255, 255, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Adjust spring constant, mass, and damping to explore SHM', width / 2, height - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { springConstant: 20, mass: 2, damping: 0.05, displacement: 60 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'springConstant', label: 'Spring Constant (k)', min: 1, max: 50, step: 1, value: 20, unit: 'N/m' },
    { name: 'mass', label: 'Mass', min: 0.5, max: 10, step: 0.5, value: 2, unit: 'kg' },
    { name: 'damping', label: 'Damping', min: 0, max: 0.5, step: 0.01, value: 0.05, unit: '' },
    { name: 'displacement', label: 'Initial Displacement', min: 10, max: 100, step: 5, value: 60, unit: 'px' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
