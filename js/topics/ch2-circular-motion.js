// Chapter 2: Circular Motion — Ball on a String
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'circular-motion';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    let angle = 0;
    let trail = [];
    let centerX, centerY;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 500;
      p.createCanvas(width, height);
      p.textFont('monospace');
      centerX = width / 2;
      centerY = height * 0.4;
    };

    p.draw = () => {
      p.background(10, 10, 26);
      const radius = engine.getParam('radius');
      const speed = engine.getParam('speed');
      centerX = width / 2;
      centerY = height * 0.4;

      // Angular velocity: omega = v / r (treating radius in px, speed as abstract)
      const omega = speed / (radius * 0.05);

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Circular Motion', width / 2, 8);

      // Update angle
      if (engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        angle += omega * dt;
      }

      // Ball position
      const ballX = centerX + radius * Math.cos(angle);
      const ballY = centerY + radius * Math.sin(angle);

      // Trail
      trail.push({ x: ballX, y: ballY });
      if (trail.length > 80) trail.shift();

      // Draw circular path
      p.noFill();
      p.stroke(40, 40, 70);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([4, 4]);
      p.ellipse(centerX, centerY, radius * 2, radius * 2);
      p.drawingContext.setLineDash([]);

      // Trail
      for (let i = 0; i < trail.length; i++) {
        const alpha = (i / trail.length) * 200;
        p.noStroke();
        p.fill(0, 180, 216, alpha);
        p.ellipse(trail[i].x, trail[i].y, 4, 4);
      }

      // String
      p.stroke(200, 200, 220, 150);
      p.strokeWeight(1.5);
      p.line(centerX, centerY, ballX, ballY);

      // Center point
      p.fill(100, 100, 130);
      p.noStroke();
      p.ellipse(centerX, centerY, 8, 8);

      // Ball
      p.drawingContext.shadowBlur = 20;
      p.drawingContext.shadowColor = '#00b4d8';
      p.fill(0, 180, 216);
      p.noStroke();
      p.ellipse(ballX, ballY, 20, 20);
      p.fill(100, 220, 255);
      p.ellipse(ballX - 3, ballY - 3, 6, 6);
      p.drawingContext.shadowBlur = 0;

      // === Force vectors ===
      const arrowScale = 40;

      // Velocity (tangent to circle)
      const vDirX = -Math.sin(angle);
      const vDirY = Math.cos(angle);
      const vLen = speed * 4;

      p.stroke(0, 255, 136);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#00ff88';
      const vEndX = ballX + vDirX * vLen;
      const vEndY = ballY + vDirY * vLen;
      p.line(ballX, ballY, vEndX, vEndY);
      // Arrowhead
      const vAngle = Math.atan2(vDirY, vDirX);
      p.line(vEndX, vEndY, vEndX - 8 * Math.cos(vAngle - 0.4), vEndY - 8 * Math.sin(vAngle - 0.4));
      p.line(vEndX, vEndY, vEndX - 8 * Math.cos(vAngle + 0.4), vEndY - 8 * Math.sin(vAngle + 0.4));
      p.drawingContext.shadowBlur = 0;

      // Label
      p.noStroke();
      p.fill(0, 255, 136);
      p.textSize(11);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('v', vEndX + vDirX * 12, vEndY + vDirY * 12);

      // Centripetal acceleration (toward center)
      const acDirX = (centerX - ballX) / radius;
      const acDirY = (centerY - ballY) / radius;
      const ac = speed * speed / (radius * 0.05); // centripetal acceleration
      const acLen = Math.min(ac * 3, 80);

      p.stroke(255, 100, 100);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#ff6464';
      const acEndX = ballX + acDirX * acLen;
      const acEndY = ballY + acDirY * acLen;
      p.line(ballX, ballY, acEndX, acEndY);
      const acAngle = Math.atan2(acDirY, acDirX);
      p.line(acEndX, acEndY, acEndX - 8 * Math.cos(acAngle - 0.4), acEndY - 8 * Math.sin(acAngle - 0.4));
      p.line(acEndX, acEndY, acEndX - 8 * Math.cos(acAngle + 0.4), acEndY - 8 * Math.sin(acAngle + 0.4));
      p.drawingContext.shadowBlur = 0;

      // Label
      p.noStroke();
      p.fill(255, 100, 100);
      p.textSize(11);
      p.text('a\u2099', acEndX + acDirX * 12, acEndY + acDirY * 12);

      // Centripetal force (same direction as acceleration, but different color)
      const fc = ac * 1; // mass = 1 for display
      p.stroke(139, 92, 246);
      p.strokeWeight(2.5);
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#8b5cf6';
      const fcLen = Math.min(fc * 2, 60);
      const fcEndX = ballX + acDirX * fcLen;
      const fcEndY = ballY + acDirY * fcLen;
      // Draw slightly offset so it's visible
      const offX = vDirX * 5;
      const offY = vDirY * 5;
      p.line(ballX + offX, ballY + offY, fcEndX + offX, fcEndY + offY);
      p.line(fcEndX + offX, fcEndY + offY, fcEndX + offX - 8 * Math.cos(acAngle - 0.4), fcEndY + offY - 8 * Math.sin(acAngle - 0.4));
      p.line(fcEndX + offX, fcEndY + offY, fcEndX + offX - 8 * Math.cos(acAngle + 0.4), fcEndY + offY - 8 * Math.sin(acAngle + 0.4));
      p.drawingContext.shadowBlur = 0;

      p.noStroke();
      p.fill(139, 92, 246);
      p.textSize(11);
      p.text('F\u2099', fcEndX + offX + acDirX * 12, fcEndY + offY + acDirY * 12);

      // === Info panel ===
      const panelY = height * 0.75;
      p.fill(15, 15, 35, 240);
      p.stroke(80, 80, 120, 80);
      p.strokeWeight(1);
      p.rect(20, panelY, width - 40, 110, 10);

      p.noStroke();
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);

      // Formulas with values
      const r_m = radius * 0.05; // Convert px to meters
      const v_ms = speed;
      const omega_val = v_ms / r_m;
      const T = 2 * Math.PI / omega_val;
      const f = 1 / T;
      const a_c = v_ms * v_ms / r_m;

      const entries = [
        { label: 'Speed (v)', value: v_ms.toFixed(1) + ' m/s', color: '#00ff88' },
        { label: 'Radius (r)', value: r_m.toFixed(1) + ' m', color: '#00b4d8' },
        { label: '\u03C9 = v/r', value: omega_val.toFixed(2) + ' rad/s', color: '#ffaa00' },
        { label: 'Period (T)', value: T.toFixed(2) + ' s', color: '#ff44aa' },
        { label: 'Frequency (f)', value: f.toFixed(2) + ' Hz', color: '#44ffaa' },
        { label: 'a\u2099 = v\u00B2/r', value: a_c.toFixed(1) + ' m/s\u00B2', color: '#ff6464' },
        { label: 'F\u2099 = ma\u2099', value: a_c.toFixed(1) + ' N (m=1)', color: '#8b5cf6' }
      ];

      const cols = 3;
      entries.forEach((e, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const ex = 35 + col * ((width - 70) / cols);
        const ey = panelY + 10 + row * 35;
        p.fill(e.color);
        p.textSize(11);
        p.text(e.label, ex, ey);
        p.fill(255, 255, 255, 220);
        p.textSize(13);
        p.text(e.value, ex, ey + 15);
      });

      // Legend
      p.textSize(10);
      p.fill(200, 200, 220, 120);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Green = velocity (tangent) | Red = centripetal acceleration | Purple = centripetal force', width / 2, panelY - 5);
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { radius: 120, speed: 3 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'radius', label: 'Radius', min: 50, max: 200, step: 5, value: 120, unit: 'px' },
    { name: 'speed', label: 'Speed', min: 1, max: 10, step: 0.5, value: 3, unit: 'm/s' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
