// Chapter 12: Electric Fields — Field Visualizer with Charges
function init() {
  if (!window.QP) { setTimeout(init, 100); return; }

  const { SimEngine, renderSimControls, renderQuiz, renderFunFacts } = window.QP;

  const slug = 'electric-fields';
  let topicData = null;
  for (const ch of QP.chapters) {
    for (const t of ch.topics || []) { if (t.slug === slug) { topicData = t; break; } }
    if (topicData) break;
  }

  const engine = new SimEngine('sim-canvas', (p, engine) => {
    let width, height;

    // Charges: { x, y, q } q > 0 = positive, q < 0 = negative
    let charges = [];
    let dragging = -1;
    let dragOffX = 0, dragOffY = 0;

    const gridSpacing = 30;

    p.setup = () => {
      width = Math.min(p.windowWidth - 40, 800);
      height = 450;
      p.createCanvas(width, height);
      p.textFont('monospace');
      // Start with one positive and one negative charge
      charges = [
        { x: width * 0.35, y: height / 2, q: 1 },
        { x: width * 0.65, y: height / 2, q: -1 }
      ];
    };

    function calcField(px, py) {
      let ex = 0, ey = 0;
      for (const c of charges) {
        const dx = px - c.x;
        const dy = py - c.y;
        const r2 = dx * dx + dy * dy;
        const r = Math.sqrt(r2);
        if (r < 10) continue;
        const eMag = c.q / r2;
        ex += eMag * dx / r;
        ey += eMag * dy / r;
      }
      return { x: ex, y: ey };
    }

    function calcPotential(px, py) {
      let v = 0;
      for (const c of charges) {
        const dx = px - c.x;
        const dy = py - c.y;
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r < 10) continue;
        v += c.q / r;
      }
      return v;
    }

    function drawFieldArrows() {
      for (let gx = gridSpacing; gx < width; gx += gridSpacing) {
        for (let gy = gridSpacing + 50; gy < height - 30; gy += gridSpacing) {
          const e = calcField(gx, gy);
          const mag = Math.sqrt(e.x * e.x + e.y * e.y);
          if (mag < 0.00001) continue;

          const maxLen = gridSpacing * 0.7;
          const len = Math.min(maxLen, mag * 8000);
          const angle = Math.atan2(e.y, e.x);

          const alpha = Math.min(255, mag * 15000 + 40);
          p.stroke(139, 92, 246, alpha);
          p.strokeWeight(1.5);

          const x2 = gx + Math.cos(angle) * len;
          const y2 = gy + Math.sin(angle) * len;
          p.line(gx, gy, x2, y2);

          // Arrowhead
          const headLen = Math.min(6, len * 0.3);
          p.line(x2, y2, x2 - headLen * Math.cos(angle - 0.5), y2 - headLen * Math.sin(angle - 0.5));
          p.line(x2, y2, x2 - headLen * Math.cos(angle + 0.5), y2 - headLen * Math.sin(angle + 0.5));
        }
      }
    }

    function drawEquipotentialContours() {
      const levels = [-0.08, -0.04, -0.02, -0.01, 0, 0.01, 0.02, 0.04, 0.08];
      const step = 6;

      for (const level of levels) {
        p.stroke(0, 180, 216, 40);
        p.strokeWeight(1);
        p.noFill();

        for (let gx = step; gx < width; gx += step) {
          for (let gy = 50; gy < height - 30; gy += step) {
            const v00 = calcPotential(gx, gy);
            const v10 = calcPotential(gx + step, gy);
            const v01 = calcPotential(gx, gy + step);

            if ((v00 - level) * (v10 - level) < 0 || (v00 - level) * (v01 - level) < 0) {
              p.point(gx, gy);
            }
          }
        }
      }
    }

    function drawFieldLines() {
      for (const charge of charges) {
        if (charge.q <= 0) continue;
        const numLines = Math.max(6, Math.min(16, Math.abs(charge.q) * 8));

        for (let i = 0; i < numLines; i++) {
          const angle = (i / numLines) * p.TWO_PI;
          let px = charge.x + Math.cos(angle) * 18;
          let py = charge.y + Math.sin(angle) * 18;

          p.stroke(139, 92, 246, 70);
          p.strokeWeight(1.5);
          p.noFill();
          p.beginShape();
          p.vertex(px, py);

          for (let s = 0; s < 150; s++) {
            const e = calcField(px, py);
            const mag = Math.sqrt(e.x * e.x + e.y * e.y);
            if (mag < 0.000001) break;
            const stepSize = 4;
            px += stepSize * e.x / mag;
            py += stepSize * e.y / mag;
            if (px < 0 || px > width || py < 0 || py > height) break;

            let nearNeg = false;
            for (const c of charges) {
              if (c.q >= 0) continue;
              const d = Math.sqrt((px - c.x) ** 2 + (py - c.y) ** 2);
              if (d < 15) { nearNeg = true; break; }
            }
            p.vertex(px, py);
            if (nearNeg) break;
          }
          p.endShape();
        }
      }
    }

    p.draw = () => {
      p.background(10, 10, 26);

      // Title
      p.fill(255, 255, 255, 200);
      p.noStroke();
      p.textSize(16);
      p.textAlign(p.CENTER, p.TOP);
      p.text('Electric Field Visualizer   E = F/q', width / 2, 10);

      p.textSize(11);
      p.fill(200, 200, 220, 160);
      p.text('Click to add +charge | Shift+Click to add −charge | Drag to move', width / 2, 32);

      // Draw equipotential contours
      drawEquipotentialContours();

      // Draw field lines from positive charges
      drawFieldLines();

      // Draw arrow field
      drawFieldArrows();

      // Draw charges
      for (let i = 0; i < charges.length; i++) {
        const c = charges[i];
        const isPos = c.q > 0;
        const radius = 14;
        const color = isPos ? p.color(255, 80, 80) : p.color(80, 130, 255);
        const glow = isPos ? '#ff5050' : '#5082ff';

        p.drawingContext.shadowBlur = 20;
        p.drawingContext.shadowColor = glow;
        p.noStroke();
        p.fill(color);
        p.ellipse(c.x, c.y, radius * 2, radius * 2);
        p.drawingContext.shadowBlur = 0;

        p.fill(255);
        p.textSize(16);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(isPos ? '+' : '−', c.x, c.y);
      }

      // Show field at mouse position
      if (p.mouseX > 0 && p.mouseX < width && p.mouseY > 50 && p.mouseY < height - 30) {
        const e = calcField(p.mouseX, p.mouseY);
        const mag = Math.sqrt(e.x * e.x + e.y * e.y);
        const v = calcPotential(p.mouseX, p.mouseY);

        p.fill(20, 20, 40, 220);
        p.stroke(139, 92, 246, 80);
        p.strokeWeight(1);
        p.rect(10, height - 70, 240, 35, 6);

        p.noStroke();
        p.fill(200, 200, 220);
        p.textSize(11);
        p.textAlign(p.LEFT, p.TOP);
        p.text('|E| = ' + (mag * 1000).toFixed(2) + ' (arb. units)', 18, height - 64);
        p.text('V = ' + (v * 100).toFixed(2) + ' (arb. units)', 18, height - 50);
      }

      // Info
      p.fill(139, 92, 246, 150);
      p.textSize(12);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('Purple arrows: E field direction & magnitude | Blue dots: equipotential contours', width / 2, height - 6);
    };

    p.mousePressed = () => {
      if (p.mouseX < 0 || p.mouseX > width || p.mouseY < 0 || p.mouseY > height) return;

      // Check for dragging existing charges
      for (let i = 0; i < charges.length; i++) {
        const d = Math.sqrt((p.mouseX - charges[i].x) ** 2 + (p.mouseY - charges[i].y) ** 2);
        if (d < 20) {
          dragging = i;
          dragOffX = charges[i].x - p.mouseX;
          dragOffY = charges[i].y - p.mouseY;
          return;
        }
      }

      // Add new charge
      if (p.mouseY > 45 && p.mouseY < height - 35) {
        const q = p.keyIsDown(p.SHIFT) ? -1 : 1;
        charges.push({ x: p.mouseX, y: p.mouseY, q: q });
      }
    };

    p.mouseDragged = () => {
      if (dragging >= 0) {
        charges[dragging].x = p.mouseX + dragOffX;
        charges[dragging].y = p.mouseY + dragOffY;
      }
    };

    p.mouseReleased = () => { dragging = -1; };

    // Double click to remove
    p.doubleClicked = () => {
      for (let i = charges.length - 1; i >= 0; i--) {
        const d = Math.sqrt((p.mouseX - charges[i].x) ** 2 + (p.mouseY - charges[i].y) ** 2);
        if (d < 20) {
          charges.splice(i, 1);
          return;
        }
      }
    };

    p.windowResized = () => {
      width = Math.min(p.windowWidth - 40, 800);
      p.resizeCanvas(width, height);
    };
  }, {});

  renderSimControls(document.getElementById('sim-controls'), engine, []);

  if (topicData) renderFunFacts(document.getElementById('facts-container'), topicData.funFacts);
  if (topicData) renderQuiz(document.getElementById('quiz-container'), topicData.quiz, topicData.slug);
}
init();
