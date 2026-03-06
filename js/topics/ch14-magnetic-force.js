// Chapter 14: Magnetic Force on Charges — Charged Particle in B Field
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'magnetic-force-charges';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    let time = 0;

    // Particle state
    let particleX, particleY;
    let vx, vy;
    let trail = [];
    const maxTrail = 500;
    let inField = false;

    function resetParticle() {
      particleX = 80;
      particleY = height / 2;
      const v = engine.getParam('velocity') * 30;
      vx = v;
      vy = 0;
      trail = [];
      time = 0;
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      p.textFont('monospace');
      resetParticle();
    };

    p.draw = () => {
      p.background(10, 10, 26);

      const velocity = engine.getParam('velocity');
      const B = engine.getParam('fieldStrength');
      const qe = engine.getParam('charge');
      const mass = engine.getParam('mass');

      // Physics: F = qvB, a = F/m, radius = mv/(qB)
      const q = qe * 1.6e-19;
      const m = mass * 1.67e-27;
      const v = velocity * 1e6; // m/s scale
      const radius_real = m * v / (q * B); // meters
      const radius_px = Math.max(30, Math.min(300, 5000 * m * velocity / (qe * B)));

      // Magnetic field region
      const fieldX = 180;
      const fieldW = width - 220;
      const fieldY = 50;
      const fieldH = height - 100;

      // Draw field region
      p.fill(139, 92, 246, 15);
      p.stroke(139, 92, 246, 40);
      p.strokeWeight(1);
      p.rect(fieldX, fieldY, fieldW, fieldH, 8);

      // Draw B field dots (into page) or crosses (out of page)
      p.fill(139, 92, 246, 50);
      p.noStroke();
      p.textSize(14);
      p.textAlign(p.CENTER, p.CENTER);
      for (let gx = fieldX + 25; gx < fieldX + fieldW; gx += 35) {
        for (let gy = fieldY + 25; gy < fieldY + fieldH; gy += 35) {
          // Dots = field into page
          p.drawingContext.shadowBlur = 4;
          p.drawingContext.shadowColor = '#8b5cf6';
          p.ellipse(gx, gy, 5, 5);
          p.drawingContext.shadowBlur = 0;
        }
      }

      // B field label
      p.fill(139, 92, 246, 120);
      p.textSize(12);
      p.textAlign(p.CENTER, p.TOP);
      p.text('B = ' + B.toFixed(1) + ' T (into page)', fieldX + fieldW / 2, fieldY + 5);

      // Update particle physics
      if (engine.isPlaying) {
        const dt = 0.5 * engine.speed;
        const v_mag = Math.sqrt(vx * vx + vy * vy);

        // Check if particle is in field region
        inField = particleX >= fieldX && particleX <= fieldX + fieldW &&
                  particleY >= fieldY && particleY <= fieldY + fieldH;

        if (inField && v_mag > 0) {
          // Magnetic force: F = qv × B (B into page means Bz < 0)
          // For positive charge moving right in B into page:
          // F = q(v × B), with B = -Bz_hat
          // Fx = q * vy * (-B), Fy = q * (-vx) * (-B) = q * vx * B
          // This gives clockwise rotation for positive charge
          const accel = (qe * B * 0.02) / mass;
          const ax = -accel * vy;
          const ay = accel * vx;

          vx += ax * dt;
          vy += ay * dt;

          // Normalize speed to keep it constant (magnetic force does no work)
          const newMag = Math.sqrt(vx * vx + vy * vy);
          if (newMag > 0) {
            vx = vx / newMag * v_mag;
            vy = vy / newMag * v_mag;
          }
        }

        particleX += vx * dt;
        particleY += vy * dt;

        trail.push({ x: particleX, y: particleY });
        if (trail.length > maxTrail) trail.shift();

        // Reset if out of bounds
        if (particleX < -50 || particleX > width + 50 || particleY < -50 || particleY > height + 50) {
          resetParticle();
        }
      }

      // Draw trail
      if (trail.length > 1) {
        p.noFill();
        p.strokeWeight(2);
        for (let i = 1; i < trail.length; i++) {
          const alpha = (i / trail.length) * 180;
          p.stroke(139, 92, 246, alpha);
          p.line(trail[i - 1].x, trail[i - 1].y, trail[i].x, trail[i].y);
        }
      }

      // Draw particle
      p.drawingContext.shadowBlur = 20;
      p.drawingContext.shadowColor = '#8b5cf6';
      p.noStroke();
      p.fill(139, 92, 246);
      p.ellipse(particleX, particleY, 14, 14);
      p.drawingContext.shadowBlur = 8;
      p.fill(200, 160, 255);
      p.ellipse(particleX - 2, particleY - 2, 5, 5);
      p.drawingContext.shadowBlur = 0;

      // Velocity arrow
      const arrowScale = 0.6;
      if (Math.sqrt(vx * vx + vy * vy) > 0.1) {
        const arrowLen = Math.min(40, Math.sqrt(vx * vx + vy * vy) * arrowScale);
        const angle = Math.atan2(vy, vx);
        const ax2 = particleX + Math.cos(angle) * arrowLen;
        const ay2 = particleY + Math.sin(angle) * arrowLen;

        p.stroke(0, 255, 136);
        p.strokeWeight(2);
        p.drawingContext.shadowBlur = 6;
        p.drawingContext.shadowColor = '#00ff88';
        p.line(particleX, particleY, ax2, ay2);
        p.line(ax2, ay2, ax2 - 8 * Math.cos(angle - 0.4), ay2 - 8 * Math.sin(angle - 0.4));
        p.line(ax2, ay2, ax2 - 8 * Math.cos(angle + 0.4), ay2 - 8 * Math.sin(angle + 0.4));
        p.drawingContext.shadowBlur = 0;

        // Force arrow (perpendicular to velocity in field)
        if (inField) {
          const fAngle = angle + Math.PI / 2; // perpendicular
          const fLen = 25;
          const fx2 = particleX + Math.cos(fAngle) * fLen;
          const fy2 = particleY + Math.sin(fAngle) * fLen;
          p.stroke(255, 100, 100);
          p.drawingContext.shadowBlur = 6;
          p.drawingContext.shadowColor = '#ff6464';
          p.line(particleX, particleY, fx2, fy2);
          p.line(fx2, fy2, fx2 - 7 * Math.cos(fAngle - 0.4), fy2 - 7 * Math.sin(fAngle - 0.4));
          p.line(fx2, fy2, fx2 - 7 * Math.cos(fAngle + 0.4), fy2 - 7 * Math.sin(fAngle + 0.4));
          p.drawingContext.shadowBlur = 0;
        }
      }

      // Draw expected circle radius
      if (inField && radius_px < 350) {
        p.noFill();
        p.stroke(139, 92, 246, 30);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([4, 6]);
        // Approximate center of circular path
        const cAngle = Math.atan2(vy, vx) + Math.PI / 2;
        const cx = particleX + Math.cos(cAngle) * radius_px;
        const cy = particleY + Math.sin(cAngle) * radius_px;
        p.ellipse(cx, cy, radius_px * 2, radius_px * 2);
        p.drawingContext.setLineDash([]);
      }

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Magnetic Force: F = qv × B', width / 2, 10);

      p.textSize(11);
      p.fill(200, 200, 220, 150);
      p.text('Click canvas to reset particle', width / 2, 30);

      // Legend
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.LEFT, p.TOP);
      p.fill(0, 255, 136);
      p.text('→ Velocity (v)', 10, fieldY + fieldH + 8);
      p.fill(255, 100, 100);
      p.text('→ Force (F)', 120, fieldY + fieldH + 8);
      p.fill(139, 92, 246, 120);
      p.text('⊗ B field (into page)', 220, fieldY + fieldH + 8);

      // Info panel
      const panelX = 10;
      const panelY = 55;
      p.fill(20, 20, 40, 220);
      p.stroke(139, 92, 246, 80);
      p.strokeWeight(1);
      p.rect(panelX, panelY, 160, 150, 8);

      p.noStroke();
      p.fill(139, 92, 246);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text('Particle Properties', panelX + 8, panelY + 8);

      p.fill(200, 200, 220);
      p.textSize(10);
      const F_mag = q * v * B;
      const lines = [
        'v = ' + velocity.toFixed(1) + ' ×10⁶ m/s',
        'B = ' + B.toFixed(1) + ' T',
        'q = ' + qe.toFixed(0) + 'e',
        'm = ' + mass.toFixed(0) + ' u',
        '',
        'F = qvB',
        'F = ' + F_mag.toExponential(2) + ' N',
        'r = mv/qB',
        'r = ' + radius_real.toExponential(2) + ' m'
      ];
      for (let i = 0; i < lines.length; i++) {
        p.fill(i >= 5 ? p.color(139, 92, 246) : p.color(200, 200, 220));
        p.text(lines[i], panelX + 8, panelY + 26 + i * 13);
      }

      // Bottom
      p.fill(139, 92, 246, 150);
      p.textSize(12);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('F = qvBsinθ  |  Circular radius: r = mv/(qB)  |  Magnetic force does no work', width / 2, height - 8);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      resetParticle();
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.resizeCanvas(width, height);
      resetParticle();
    };
  }, { velocity: 3, fieldStrength: 2, charge: 1, mass: 1 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'velocity', label: 'Velocity', min: 1, max: 10, step: 0.5, value: 3, unit: '×10⁶ m/s' },
    { name: 'fieldStrength', label: 'B Field Strength', min: 1, max: 10, step: 0.5, value: 2, unit: 'T' },
    { name: 'charge', label: 'Charge', min: 1, max: 5, step: 1, value: 1, unit: 'e' },
    { name: 'mass', label: 'Mass', min: 1, max: 10, step: 1, value: 1, unit: 'u' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
