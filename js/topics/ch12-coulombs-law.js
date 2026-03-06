// Chapter 12: Coulomb's Law — Interactive Charge Forces
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'coulombs-law';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;
    const k = 8.99e9; // Coulomb constant
    const microC = 1e-6;
    const pixelsPerMeter = 100; // 1m = 100px for display

    // Charges array: { x, y, q (μC) }
    let charges = [];
    let dragging = -1;
    let dragOffX = 0, dragOffY = 0;

    function resetCharges() {
      charges = [
        { x: 0, y: 0, q: engine.getParam('charge1') },
        { x: 0, y: 0, q: engine.getParam('charge2') }
      ];
    }

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      p.textFont('monospace');
      charges = [
        { x: width * 0.35, y: height / 2, q: engine.getParam('charge1') },
        { x: width * 0.65, y: height / 2, q: engine.getParam('charge2') }
      ];
    };

    function coulombForce(q1, q2, rPixels) {
      const rMeters = rPixels / pixelsPerMeter;
      if (rMeters < 0.01) return 0;
      return k * Math.abs(q1 * microC) * Math.abs(q2 * microC) / (rMeters * rMeters);
    }

    function drawGlowCircle(x, y, radius, color, glowColor) {
      p.drawingContext.shadowBlur = 25;
      p.drawingContext.shadowColor = glowColor;
      p.noStroke();
      p.fill(color);
      p.ellipse(x, y, radius * 2, radius * 2);
      p.drawingContext.shadowBlur = 0;
    }

    function drawArrow(x1, y1, x2, y2, color) {
      p.stroke(color);
      p.strokeWeight(2);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = color;
      p.line(x1, y1, x2, y2);
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLen = 10;
      p.line(x2, y2, x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4));
      p.line(x2, y2, x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4));
      p.drawingContext.shadowBlur = 0;
    }

    function drawFieldLines(charge, allCharges) {
      const numLines = Math.max(4, Math.min(16, Math.abs(charge.q) * 3));
      const isPositive = charge.q > 0;

      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * p.TWO_PI;
        let px = charge.x + Math.cos(angle) * 20;
        let py = charge.y + Math.sin(angle) * 20;
        const step = isPositive ? 4 : -4;

        p.stroke(139, 92, 246, 100);
        p.strokeWeight(1.5);
        p.noFill();
        p.beginShape();
        p.vertex(px, py);

        for (let s = 0; s < 80; s++) {
          let ex = 0, ey = 0;
          for (const c of allCharges) {
            const dx = px - c.x;
            const dy = py - c.y;
            const r = Math.sqrt(dx * dx + dy * dy);
            if (r < 5) { ex = 0; ey = 0; break; }
            const eMag = c.q / (r * r);
            ex += eMag * dx / r;
            ey += eMag * dy / r;
          }
          const eMag = Math.sqrt(ex * ex + ey * ey);
          if (eMag < 0.0001) break;
          px += step * ex / eMag;
          py += step * ey / eMag;
          if (px < 0 || px > width || py < 0 || py > height) break;

          // Stop if near another charge
          let nearCharge = false;
          for (const c of allCharges) {
            if (c === charge) continue;
            const d = Math.sqrt((px - c.x) ** 2 + (py - c.y) ** 2);
            if (d < 18) { nearCharge = true; break; }
          }
          p.vertex(px, py);
          if (nearCharge) break;
        }
        p.endShape();
      }
    }

    p.draw = () => {
      p.background(10, 10, 26);

      // Update charges from params
      if (charges.length >= 2) {
        charges[0].q = engine.getParam('charge1');
        charges[1].q = engine.getParam('charge2');
      }

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text("Coulomb's Law: F = kq₁q₂/r²", width / 2, 10);

      p.textSize(11);
      p.fill(200, 200, 220, 180);
      p.text('Drag charges to move them', width / 2, 32);

      // Draw field lines
      for (const charge of charges) {
        if (charge.q !== 0) {
          drawFieldLines(charge, charges);
        }
      }

      // Draw force vectors between charge pairs
      if (charges.length >= 2) {
        const c1 = charges[0];
        const c2 = charges[1];
        const dx = c2.x - c1.x;
        const dy = c2.y - c1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 30 && c1.q !== 0 && c2.q !== 0) {
          const force = coulombForce(c1.q, c2.q, dist);
          const attractive = (c1.q > 0 && c2.q < 0) || (c1.q < 0 && c2.q > 0);

          // Normalize direction
          const nx = dx / dist;
          const ny = dy / dist;

          // Scale force for display (log scale for visibility)
          const arrowLen = Math.min(80, Math.max(20, 15 * Math.log10(force + 1)));

          if (attractive) {
            // Forces point toward each other
            drawArrow(c1.x + nx * 22, c1.y + ny * 22, c1.x + nx * (22 + arrowLen), c1.y + ny * (22 + arrowLen), '#ff6b6b');
            drawArrow(c2.x - nx * 22, c2.y - ny * 22, c2.x - nx * (22 + arrowLen), c2.y - ny * (22 + arrowLen), '#ff6b6b');
          } else {
            // Forces point away from each other
            drawArrow(c1.x - nx * 22, c1.y - ny * 22, c1.x - nx * (22 + arrowLen), c1.y - ny * (22 + arrowLen), '#4ecdc4');
            drawArrow(c2.x + nx * 22, c2.y + ny * 22, c2.x + nx * (22 + arrowLen), c2.y + ny * (22 + arrowLen), '#4ecdc4');
          }

          // Info panel
          const rMeters = dist / pixelsPerMeter;
          p.fill(20, 20, 40, 220);
          p.stroke(139, 92, 246, 80);
          p.strokeWeight(1);
          p.rect(width - 240, 60, 225, 140, 8);

          p.noStroke();
          p.fill(139, 92, 246);
          p.textSize(13);
          p.textAlign(p.LEFT, p.TOP);
          p.text('Coulomb\'s Law', width - 228, 68);

          p.fill(200, 200, 220);
          p.textSize(11);
          p.text('q₁ = ' + c1.q.toFixed(1) + ' μC', width - 228, 90);
          p.text('q₂ = ' + c2.q.toFixed(1) + ' μC', width - 228, 108);
          p.text('r = ' + rMeters.toFixed(2) + ' m', width - 228, 126);
          p.text('k = 8.99 × 10⁹ N·m²/C²', width - 228, 144);

          p.fill(139, 92, 246);
          const forceStr = force >= 1e6 ? (force / 1e6).toFixed(2) + ' MN' :
                           force >= 1e3 ? (force / 1e3).toFixed(2) + ' kN' :
                           force >= 1 ? force.toFixed(2) + ' N' :
                           force >= 1e-3 ? (force * 1e3).toFixed(2) + ' mN' :
                           (force * 1e6).toFixed(2) + ' μN';
          p.text('F = ' + forceStr, width - 228, 168);
          p.fill(attractive ? '#ff6b6b' : '#4ecdc4');
          p.text(attractive ? '(Attractive)' : '(Repulsive)', width - 228, 184);
        }
      }

      // Draw charges
      for (let i = 0; i < charges.length; i++) {
        const c = charges[i];
        if (c.q === 0) continue;
        const isPos = c.q > 0;
        const color = isPos ? p.color(255, 80, 80) : p.color(80, 130, 255);
        const glow = isPos ? '#ff5050' : '#5082ff';
        const radius = Math.max(12, Math.min(22, Math.abs(c.q) * 3 + 8));

        drawGlowCircle(c.x, c.y, radius, color, glow);

        // Draw + or - sign
        p.fill(255);
        p.noStroke();
        p.textSize(16);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(isPos ? '+' : '−', c.x, c.y);

        // Label
        p.textSize(10);
        p.fill(200, 200, 220);
        p.text('q' + (i + 1) + '=' + c.q.toFixed(1) + 'μC', c.x, c.y + radius + 14);
      }

      // Formula at bottom
      p.fill(139, 92, 246, 180);
      p.textSize(14);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('F = k · |q₁ · q₂| / r²     k = 8.99 × 10⁹ N·m²/C²', width / 2, height - 12);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;
      for (let i = 0; i < charges.length; i++) {
        const d = Math.sqrt((p.mouseX - charges[i].x) ** 2 + (p.mouseY - charges[i].y) ** 2);
        if (d < 25) {
          dragging = i;
          dragOffX = charges[i].x - p.mouseX;
          dragOffY = charges[i].y - p.mouseY;
          return;
        }
      }
    };

    p.mouseDragged = () => {
      if (dragging >= 0) {
        charges[dragging].x = p.mouseX + dragOffX;
        charges[dragging].y = p.mouseY + dragOffY;
      }
    };

    p.mouseReleased = () => { dragging = -1; };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, { charge1: 3, charge2: -2 });

  renderSimControls(document.getElementById('sim-controls'), engine, [
    { name: 'charge1', label: 'Charge 1', min: -5, max: 5, step: 0.5, value: 3, unit: 'μC' },
    { name: 'charge2', label: 'Charge 2', min: -5, max: 5, step: 0.5, value: -2, unit: 'μC' }
  ]);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
