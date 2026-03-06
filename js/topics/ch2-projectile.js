// Chapter 2: Projectile Motion — Cannon Trajectory Simulation
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'projectile-motion';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) {
      if (t.slug === slug) { topicData = t; break; }
    }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Projectile state
    let projX = 0, projY = 0;
    let vx = 0, vy = 0;
    let time = 0;
    let fired = false;
    let landed = false;
    let trail = [];
    let maxHeight = 0;
    let range = 0;
    let flightTime = 0;

    // Ground level
    const groundLevel = 380;
    const cannonX = 60;
    const cannonY = groundLevel;
    const pixPerMeter = 6;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 460;
      p.createCanvas(width, height);
      p.textFont('monospace');
    };

    function fire() {
      const angle = engine.getParam('angle') * Math.PI / 180;
      const speed = engine.getParam('speed');

      vx = speed * Math.cos(angle);
      vy = -speed * Math.sin(angle); // negative because y is inverted in screen
      projX = cannonX;
      projY = cannonY;
      time = 0;
      fired = true;
      landed = false;
      trail = [];
      maxHeight = 0;
      range = 0;
      flightTime = 0;
    }

    p.draw = () => {
      p.background(10, 10, 26);
      const angle = engine.getParam('angle');
      const speed = engine.getParam('speed');
      const g = engine.getParam('gravity');
      const angleRad = angle * Math.PI / 180;

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Projectile Motion', width / 2, 8);

      // Physics update
      if (fired && !landed && engine.isPlaying) {
        const dt = (1 / 60) * engine.speed;
        time += dt;

        vy += g * pixPerMeter * dt;
        projX += vx * pixPerMeter * dt;
        projY += vy * dt * pixPerMeter;

        // Track max height
        const currentH = (cannonY - projY) / pixPerMeter;
        if (currentH > maxHeight) maxHeight = currentH;

        // Trail dots at intervals
        if (trail.length === 0 || p.dist(projX, projY, trail[trail.length - 1].x, trail[trail.length - 1].y) > 15) {
          trail.push({ x: projX, y: projY, t: time });
        }

        // Check landing
        if (projY >= cannonY && time > 0.1) {
          projY = cannonY;
          landed = true;
          range = (projX - cannonX) / pixPerMeter;
          flightTime = time;
        }
      }

      // Ground
      p.stroke(0, 255, 136, 150);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 6;
      p.drawingContext.shadowColor = '#00ff88';
      p.line(0, groundLevel, width, groundLevel);
      p.drawingContext.shadowBlur = 0;

      // Ground grid
      p.stroke(0, 255, 136, 20);
      p.strokeWeight(0.5);
      for (let x = cannonX; x < width; x += 10 * pixPerMeter) {
        p.line(x, groundLevel, x, groundLevel + 5);
      }

      // Cannon
      p.push();
      p.translate(cannonX, cannonY);
      p.rotate(-angleRad);

      // Cannon barrel
      p.drawingContext.shadowBlur = 10;
      p.drawingContext.shadowColor = '#8b5cf6';
      p.fill(100, 80, 140);
      p.stroke(139, 92, 246);
      p.strokeWeight(1);
      p.rect(0, -6, 40, 12, 2);

      // Barrel end glow
      p.fill(139, 92, 246);
      p.noStroke();
      p.rect(36, -8, 6, 16, 1);
      p.drawingContext.shadowBlur = 0;
      p.pop();

      // Cannon base
      p.fill(80, 70, 110);
      p.noStroke();
      p.ellipse(cannonX, cannonY, 30, 20);

      // Angle arc
      p.noFill();
      p.stroke(255, 200, 50, 150);
      p.strokeWeight(1);
      p.arc(cannonX, cannonY, 50, 50, -angleRad, 0);
      p.noStroke();
      p.fill(255, 200, 50, 200);
      p.textSize(10);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(angle + '\u00B0', cannonX + 30, cannonY - 12);

      // Theoretical trajectory (dashed)
      if (!fired || landed) {
        p.noFill();
        p.stroke(0, 180, 216, 60);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([4, 4]);
        p.beginShape();
        const v0x = speed * Math.cos(angleRad);
        const v0y = speed * Math.sin(angleRad);
        for (let t = 0; t <= 2 * v0y / g + 0.1; t += 0.05) {
          const tx = cannonX + v0x * t * pixPerMeter;
          const ty = cannonY - (v0y * t - 0.5 * g * t * t) * pixPerMeter;
          if (tx > width || ty > cannonY + 5) break;
          p.vertex(tx, ty);
        }
        p.endShape();
        p.drawingContext.setLineDash([]);
      }

      // Trail
      for (let i = 0; i < trail.length; i++) {
        const alpha = 80 + (i / trail.length) * 175;
        const r = 3 + (i / trail.length) * 3;
        p.noStroke();
        p.fill(0, 180, 216, alpha);
        p.ellipse(trail[i].x, trail[i].y, r, r);

        // Time label on some dots
        if (i % 3 === 0) {
          p.fill(100, 100, 140, alpha);
          p.textSize(8);
          p.textAlign(p.CENTER, p.BOTTOM);
          p.text(trail[i].t.toFixed(1) + 's', trail[i].x, trail[i].y - 6);
        }
      }

      // Projectile
      if (fired) {
        p.drawingContext.shadowBlur = 20;
        p.drawingContext.shadowColor = '#00b4d8';
        p.fill(0, 180, 216);
        p.noStroke();
        p.ellipse(projX, projY, 14, 14);
        p.fill(100, 220, 255);
        p.ellipse(projX - 2, projY - 2, 5, 5);
        p.drawingContext.shadowBlur = 0;

        // Velocity decomposition arrows
        if (!landed) {
          // Horizontal velocity
          const vxArrow = p.constrain(vx * 2, -50, 50);
          p.stroke(0, 255, 136);
          p.strokeWeight(1.5);
          p.drawingContext.shadowBlur = 6;
          p.drawingContext.shadowColor = '#00ff88';
          p.line(projX, projY, projX + vxArrow, projY);
          p.drawingContext.shadowBlur = 0;

          // Vertical velocity
          const vyArrow = p.constrain(vy * 2, -50, 50);
          p.stroke(255, 100, 100);
          p.strokeWeight(1.5);
          p.drawingContext.shadowBlur = 6;
          p.drawingContext.shadowColor = '#ff6464';
          p.line(projX, projY, projX, projY + vyArrow);
          p.drawingContext.shadowBlur = 0;
        }
      }

      // Max height indicator
      if (maxHeight > 0) {
        const mhY = cannonY - maxHeight * pixPerMeter;
        p.stroke(255, 200, 50, 80);
        p.strokeWeight(0.5);
        p.drawingContext.setLineDash([3, 3]);
        p.line(cannonX, mhY, width - 20, mhY);
        p.drawingContext.setLineDash([]);
        p.noStroke();
        p.fill(255, 200, 50, 180);
        p.textSize(10);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text('H = ' + maxHeight.toFixed(1) + ' m', width - 25, mhY);
      }

      // Range indicator
      if (landed && range > 0) {
        p.stroke(0, 255, 136, 80);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([3, 3]);
        p.line(cannonX, cannonY + 15, cannonX + range * pixPerMeter, cannonY + 15);
        p.drawingContext.setLineDash([]);

        p.drawingContext.shadowBlur = 8;
        p.drawingContext.shadowColor = '#00ff88';
        p.noStroke();
        p.fill(0, 255, 136);
        p.textSize(11);
        p.textAlign(p.CENTER, p.TOP);
        p.text('Range = ' + range.toFixed(1) + ' m', cannonX + (range * pixPerMeter) / 2, cannonY + 20);
        p.drawingContext.shadowBlur = 0;
      }

      // Info panel
      const panelY = groundLevel + 30;
      p.fill(20, 20, 40, 230);
      p.stroke(0, 180, 216, 60);
      p.strokeWeight(1);
      p.rect(20, panelY, width - 40, 45, 8);

      p.noStroke();
      p.textSize(11);
      p.textAlign(p.LEFT, p.TOP);

      // Theoretical values
      const v0y = speed * Math.sin(angleRad);
      const v0x = speed * Math.cos(angleRad);
      const theoMaxH = (v0y * v0y) / (2 * g);
      const theoRange = (speed * speed * Math.sin(2 * angleRad)) / g;
      const theoTime = (2 * v0y) / g;

      p.fill(0, 180, 216);
      p.text('Theoretical:', 30, panelY + 5);
      p.fill(200, 200, 220);
      p.textSize(10);
      p.text('Range = ' + theoRange.toFixed(1) + ' m', 30, panelY + 20);
      p.text('Max H = ' + theoMaxH.toFixed(1) + ' m', 180, panelY + 20);
      p.text('Flight = ' + theoTime.toFixed(2) + ' s', 340, panelY + 20);
      p.text('v\u2080x = ' + v0x.toFixed(1) + ' m/s', 500, panelY + 20);
      if (v0x > 0) p.text('v\u2080y = ' + v0y.toFixed(1) + ' m/s', 630, panelY + 20);

      if (fired) {
        p.fill(255, 200, 50);
        p.textSize(10);
        p.text('t = ' + time.toFixed(2) + ' s', 500, panelY + 5);
      }

      // Instruction
      p.fill(200, 200, 220, 150);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Click to fire!', width / 2, 30);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      fire();
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { angle: 45, speed: 20, gravity: 9.81 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'angle', label: 'Launch Angle', min: 0, max: 90, step: 1, value: 45, unit: '\u00B0' },
    { name: 'speed', label: 'Launch Speed', min: 5, max: 50, step: 1, value: 20, unit: 'm/s' },
    { name: 'gravity', label: 'Gravity', min: 1, max: 20, step: 0.1, value: 9.81, unit: 'm/s\u00B2' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
